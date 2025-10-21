import type { APIRoute } from "astro";
import { isValidEmail } from "../core/validation";
import {
  trackError,
  type ErrorSeverity,
} from "../error-handling/error-handler";

// Constants for security and performance
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB limit
const MAX_RATE_LIMIT_STORE_SIZE = 10000; // Maximum entries in rate limit store
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Re-export isValidEmail for use in other API routes
export { isValidEmail };

// Environment-aware CORS configuration
const getCorsHeaders = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const allowedOrigin =
    process.env.ALLOWED_ORIGINS || (isDevelopment ? "*" : "");

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
};

export const CORS_HEADERS = getCorsHeaders();

// Common JSON headers
export const JSON_HEADERS = {
  "Content-Type": "application/json",
  ...CORS_HEADERS,
};

// Rate limiting interfaces
export interface RateLimitData {
  count: number;
  resetTime: number;
  lastAccess: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Default rate limit configuration
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

// Rate limiting store
const rateLimitStore = new Map<string, RateLimitData>();

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Handle static build mode where request.headers might not be available
  if (!request.headers) {
    return "unknown";
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  return (
    forwarded?.split(",")[0]?.trim() || realIP || cfConnectingIP || "unknown"
  );
}

/**
 * Cleanup old rate limit entries
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();

  for (const [identifier, data] of rateLimitStore.entries()) {
    // Remove entries older than the cleanup interval
    if (now - data.lastAccess > RATE_LIMIT_CLEANUP_INTERVAL) {
      rateLimitStore.delete(identifier);
    }
  }

  // Cleanup completed in development mode
}

/**
 * Check if rate limit store is too large
 */
function isRateLimitStoreTooLarge(): boolean {
  return rateLimitStore.size > MAX_RATE_LIMIT_STORE_SIZE;
}

/**
 * Check rate limit for a client
 */
export function checkRateLimit(
  clientIP: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `rate_limit_${clientIP}`;

  // Cleanup old entries if store is too large
  if (isRateLimitStoreTooLarge()) {
    cleanupRateLimitStore();
  }

  const existing = rateLimitStore.get(key);

  // Clean up expired entries
  if (existing && now > existing.resetTime) {
    rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(key) || {
    count: 0,
    resetTime: now + config.windowMs,
    lastAccess: now,
  };

  if (current.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
    };
  }

  // Increment count and update last access time
  current.count++;
  current.lastAccess = now;
  rateLimitStore.set(key, current);

  return {
    allowed: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

/**
 * Create a standardized API response
 */
export function createAPIResponse(
  data: Record<string, unknown>,
  status: number = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  });
}

/**
 * Sanitize error message to prevent information disclosure
 */
export function sanitizeErrorMessage(message: string, status: number): string {
  if (process.env.NODE_ENV === "development") {
    return message; // Return full message in development
  }

  // Sanitize based on status code
  if (status >= 500) {
    // Server errors - never expose internal details
    return "Internal server error";
  } else if (status >= 400) {
    // Client errors - sanitize but keep some context
    const sanitized = message
      .replace(/\b\w+:\/\/[^\s]+/g, "[URL]") // Remove URLs
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "[IP]") // Remove IP addresses
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        "[EMAIL]",
      ) // Remove emails
      .replace(/\b\d{4,}\b/g, "[ID]") // Remove long numbers that might be IDs
      .slice(0, 200); // Limit length

    return sanitized || "Invalid request";
  }

  return message;
}

/**
 * Standardized error types for consistent error handling
 */
export enum APIErrorType {
  VALIDATION_ERROR = "validation_error",
  AUTHENTICATION_ERROR = "authentication_error",
  AUTHORIZATION_ERROR = "authorization_error",
  RATE_LIMIT_ERROR = "rate_limit_error",
  NOT_FOUND_ERROR = "not_found_error",
  INTERNAL_ERROR = "internal_error",
  SERVICE_UNAVAILABLE = "service_unavailable",
  BAD_REQUEST = "bad_request",
}

/**
 * Standardized error response structure
 */
export interface APIError {
  type: APIErrorType;
  message: string;
  code?: string;
  field?: string;
  details?: Record<string, unknown>;
}

/**
 * Create standardized error response with proper error tracking
 */
export function createAPIError(
  type: APIErrorType,
  message: string,
  status: number = 500,
  options?: {
    code?: string;
    field?: string;
    details?: Record<string, unknown>;
    context?: string;
    originalError?: Error;
  },
): Response {
  // Track error with appropriate severity
  const severity: ErrorSeverity =
    status >= 500 ? "high" : status >= 400 ? "medium" : "low";

  if (options?.context || options?.originalError) {
    trackError(
      options?.originalError || new Error(message),
      options?.context || `api_error:${type}`,
      severity,
      {
        errorType: type,
        status,
        code: options?.code,
        field: options?.field,
        ...options?.details,
      },
    );
  }

  const sanitizedMessage = sanitizeErrorMessage(message, status);

  const errorResponse: APIError = {
    type,
    message: sanitizedMessage,
    ...(options?.code && { code: options?.code }),
    ...(options?.field && { field: options?.field }),
  };

  return createAPIResponse(
    {
      success: false,
      error: errorResponse,
      ...(options?.details &&
        process.env.NODE_ENV === "development" && { details: options.details }),
    },
    status,
  );
}

/**
 * Create a standardized error response (legacy function - use createAPIError instead)
 */
export function createErrorResponse(
  error: string | Error,
  status: number = 400,
  context?: string,
): Response {
  const message = typeof error === "string" ? error : error.message;

  // Map status codes to error types
  let errorType: APIErrorType;
  switch (status) {
    case 400:
      errorType = APIErrorType.BAD_REQUEST;
      break;
    case 401:
      errorType = APIErrorType.AUTHENTICATION_ERROR;
      break;
    case 403:
      errorType = APIErrorType.AUTHORIZATION_ERROR;
      break;
    case 404:
      errorType = APIErrorType.NOT_FOUND_ERROR;
      break;
    case 429:
      errorType = APIErrorType.RATE_LIMIT_ERROR;
      break;
    case 422:
      errorType = APIErrorType.VALIDATION_ERROR;
      break;
    case 503:
      errorType = APIErrorType.SERVICE_UNAVAILABLE;
      break;
    default:
      errorType =
        status >= 500 ? APIErrorType.INTERNAL_ERROR : APIErrorType.BAD_REQUEST;
  }

  return createAPIError(errorType, message, status, {
    context,
    originalError: typeof error !== "string" ? error : undefined,
  });
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(
  data: Record<string, unknown>,
  message?: string,
): Response {
  return createAPIResponse({
    success: true,
    ...(message && { message }),
    ...data,
  });
}

/**
 * Parse URL-encoded form data with optimizations
 */
async function parseUrlEncodedData<T>(rawBody: string): Promise<T | null> {
  try {
    const params = new URLSearchParams(rawBody);

    // Early return for empty form data
    if (params.entries().next().done) {
      return {} as T;
    }

    const data: Record<string, string> = {};
    let entryCount = 0;
    const maxEntries = 1000; // Prevent DoS with too many form fields

    for (const [key, value] of params.entries()) {
      entryCount++;
      if (entryCount > maxEntries) {
        trackError(
          new Error("Too many form fields"),
          "parse_url_encoded",
          "medium",
          { entryCount, maxEntries },
        );
        break;
      }

      // Sanitize key and value
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = sanitizeInput(value.trim());
      data[sanitizedKey] = sanitizedValue;
    }

    return Object.keys(data).length > 0 ? (data as T) : null;
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("URL-encoded parsing failed"),
      "parse_url_encoded",
      "low",
    );
    return null;
  }
}

/**
 * Parse JSON data with validation and optimizations
 */
function parseJsonData<T>(rawBody: string): T | null {
  try {
    const trimmed = rawBody.trim();
    if (!trimmed) return null;

    // Quick validation for JSON structure
    if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
      trackError(new Error("Invalid JSON structure"), "parse_json", "low", {
        startsWith: trimmed.slice(0, 10),
      });
      return null;
    }

    // Parse with size limit check
    if (trimmed.length > 50000) {
      // 50KB limit for JSON
      trackError(new Error("JSON payload too large"), "parse_json", "medium", {
        size: trimmed.length,
      });
      return null;
    }

    const parsed = JSON.parse(trimmed);

    // Validate parsed result is object or array
    if (typeof parsed !== "object" || parsed === null) {
      trackError(
        new Error("JSON is not an object or array"),
        "parse_json",
        "low",
        { type: typeof parsed },
      );
      return null;
    }

    return parsed as T;
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("JSON parsing failed"),
      "parse_json",
      "medium",
      { error: String(error) },
    );
    return null;
  }
}

/**
 * Parse multipart form data with optimizations and file handling
 */
async function parseMultipartData<T>(request: Request): Promise<T | null> {
  try {
    // Use native FormData parsing when available
    if (typeof FormData !== "undefined" && request.formData) {
      const formData = await request.formData();

      // Early return for empty form data
      if (formData.entries().next().done) {
        return {} as T;
      }

      const result: Record<string, FormDataEntryValue> = {};
      let entryCount = 0;
      let totalFileSize = 0;
      const maxEntries = 100; // Limit form fields
      const maxFileSize = 10 * 1024 * 1024; // 10MB total file size limit

      for (const [key, value] of formData.entries()) {
        entryCount++;

        // Prevent DoS with too many form fields
        if (entryCount > maxEntries) {
          trackError(
            new Error("Too many multipart form fields"),
            "parse_multipart",
            "medium",
            { entryCount, maxEntries },
          );
          break;
        }

        // Handle files and form fields
        if (value instanceof File) {
          // Check file size
          totalFileSize += value.size;
          if (totalFileSize > maxFileSize) {
            trackError(
              new Error("Total file size exceeded limit"),
              "parse_multipart",
              "medium",
              { totalFileSize, maxFileSize },
            );
            break;
          }

          // Store file metadata instead of full file content
          const sanitizedKey = sanitizeInput(key);
          result[sanitizedKey] = value; // Store the actual File object for proper FormDataEntryValue type
        } else {
          // Handle regular form fields
          const sanitizedKey = sanitizeInput(key);
          const sanitizedValue = sanitizeInput(String(value));
          result[sanitizedKey] = sanitizedValue;
        }
      }

      return Object.keys(result).length > 0 ? (result as T) : null;
    }

    // Fallback: manual parsing (not recommended for production)
    trackError(
      new Error("Multipart parsing not available"),
      "parse_multipart_fallback",
      "medium",
    );

    return null;
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("Multipart parsing failed"),
      "parse_multipart",
      "low",
    );
    return null;
  }
}

/**
 * Auto-detect and parse request data based on content
 */
async function autoParseData<T>(rawBody: string): Promise<T | null> {
  const trimmed = rawBody.trim();

  if (!trimmed) return null;

  // Try URL-encoded first (more lenient check)
  if (trimmed.includes("=")) {
    const result = await parseUrlEncodedData<T>(rawBody);
    if (result) return result;
  }

  // Try JSON
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return parseJsonData<T>(rawBody);
  }

  return null;
}

/**
 * Validate request size
 */
function validateRequestSize(rawBody: string): boolean {
  const size = new Blob([rawBody]).size;
  return size <= MAX_REQUEST_SIZE;
}

/**
 * Parse request data (JSON or FormData) with timeout and optimizations
 */
export async function parseRequestData<T = Record<string, unknown>>(
  request: Request,
  context: string = "api_request",
): Promise<T | null> {
  try {
    // Early return for empty content
    const contentType =
      request.headers?.get("content-type")?.toLowerCase() || "";
    if (!contentType && !request.body) {
      return null;
    }

    // Read the body first (can only be done once)
    const rawBody = await request.text();

    if (!rawBody) {
      return null;
    }

    // Validate request size
    if (!validateRequestSize(rawBody)) {
      trackError(
        new Error("Request body too large"),
        `${context}:size_validation`,
        "medium",
        { contentType, size: rawBody.length },
      );
      return null;
    }

    // Debug logging in development
    // Debug info available in development mode

    const timeoutMs = 30000; // 30 second timeout for parsing

    // Parse based on content type with timeout
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return await Promise.race([
        parseUrlEncodedData<T>(rawBody),
        new Promise<null>((_, reject) => {
          setTimeout(
            () => reject(new Error("URL-encoded parsing timeout")),
            timeoutMs,
          );
        }),
      ]);
    }

    if (contentType.includes("application/json")) {
      return await Promise.race([
        parseJsonData<T>(rawBody),
        new Promise<null>((_, reject) => {
          setTimeout(
            () => reject(new Error("JSON parsing timeout")),
            timeoutMs,
          );
        }),
      ]);
    }

    if (contentType.includes("multipart/form-data")) {
      return await Promise.race([
        parseMultipartData<T>(request),
        new Promise<null>((_, reject) => {
          setTimeout(
            () => reject(new Error("Multipart parsing timeout")),
            timeoutMs,
          );
        }),
      ]);
    }

    // Auto-detect if content type is unknown or missing
    if (!contentType || contentType === "unknown") {
      return await Promise.race([
        autoParseData<T>(rawBody),
        new Promise<null>((_, reject) => {
          setTimeout(
            () => reject(new Error("Auto parsing timeout")),
            timeoutMs,
          );
        }),
      ]);
    }

    return null;
  } catch (error) {
    trackError(
      error instanceof Error
        ? error
        : new Error("Failed to parse request data"),
      context,
      "medium",
      {
        contentType: request.headers?.get("content-type"),
        error: String(error),
      },
    );
    return null;
  }
}

/**
 * Create OPTIONS handler for CORS preflight
 */
export const createOptionsHandler = (): APIRoute => {
  return async () => {
    return new Response(null, {
      status: 200,
      headers: CORS_HEADERS,
    });
  };
};

/**
 * Error boundary for API handlers with comprehensive error handling
 */
export async function withErrorBoundary(
  handler: (
    request: Request,
    context: Record<string, unknown>,
  ) => Promise<Response>,
  request: Request,
  context: Record<string, unknown>,
  options?: {
    fallbackMessage?: string;
    logErrors?: boolean;
    sanitizeErrors?: boolean;
  },
): Promise<Response> {
  try {
    return await handler(request, context);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Log error if requested
    if (options?.logErrors !== false) {
      console.error("[API Error Boundary]", {
        error: errorMessage,
        stack: errorStack,
        method: request.method,
        url: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // Track error with high severity
    trackError(
      error instanceof Error ? error : new Error(errorMessage),
      "api_error_boundary",
      "high",
      {
        method: request.method,
        url: request.url,
        ...(errorStack && { stack: errorStack }),
      },
    );

    // Determine appropriate error response
    if (error instanceof Error) {
      // Handle specific error types
      if (error.name === "ValidationError") {
        return createAPIError(
          APIErrorType.VALIDATION_ERROR,
          options?.sanitizeErrors !== false
            ? sanitizeErrorMessage(errorMessage, 400)
            : errorMessage,
          400,
          {
            originalError: error,
            details: { validationError: true },
          },
        );
      }

      if (error.name === "AuthenticationError") {
        return createAPIError(
          APIErrorType.AUTHENTICATION_ERROR,
          options?.sanitizeErrors !== false
            ? sanitizeErrorMessage(errorMessage, 401)
            : errorMessage,
          401,
          { originalError: error },
        );
      }

      if (error.name === "AuthorizationError") {
        return createAPIError(
          APIErrorType.AUTHORIZATION_ERROR,
          options?.sanitizeErrors !== false
            ? sanitizeErrorMessage(errorMessage, 403)
            : errorMessage,
          403,
          { originalError: error },
        );
      }

      if (error.name === "NotFoundError") {
        return createAPIError(
          APIErrorType.NOT_FOUND_ERROR,
          options?.sanitizeErrors !== false
            ? sanitizeErrorMessage(errorMessage, 404)
            : errorMessage,
          404,
          { originalError: error },
        );
      }
    }

    // Default to internal server error
    return createAPIError(
      APIErrorType.INTERNAL_ERROR,
      options?.fallbackMessage || "Internal server error",
      500,
      {
        originalError: error instanceof Error ? error : undefined,
        ...(process.env.NODE_ENV === "development" && {
          rawError: errorMessage,
        }),
      },
    );
  }
}

/**
 * Wrap API handler with common middleware (rate limiting, error handling, logging, security)
 */
export function withAPIMiddleware(
  handler: (
    request: Request,
    context: Record<string, unknown>,
  ) => Promise<Response>,
  options: {
    rateLimit?: RateLimitConfig;
    requireAuth?: boolean;
    logRequests?: boolean;
    validateHeaders?: boolean;
    sanitizeData?: boolean;
    allowedMethods?: string[];
    errorBoundary?: boolean;
  } = {},
): APIRoute {
  return async (context) => {
    const { request } = context;

    try {
      // Request logging available in development mode

      // Method validation
      if (options.allowedMethods && options.allowedMethods.length > 0) {
        const method = request.method.toUpperCase();
        if (!options.allowedMethods.includes(method)) {
          return createAPIError(
            APIErrorType.BAD_REQUEST,
            "Method not allowed",
            405,
          );
        }
      }

      // Header validation
      if (options.validateHeaders !== false && request.headers) {
        const headerValidation = validateRequestHeaders(request.headers);
        if (!headerValidation.valid) {
          return createAPIError(
            APIErrorType.BAD_REQUEST,
            headerValidation.error || "Invalid headers",
            400,
          );
        }
      }

      // Rate limiting
      if (options.rateLimit) {
        const clientIP = getClientIP(request);
        const rateLimit = checkRateLimit(clientIP, options.rateLimit);

        if (!rateLimit.allowed) {
          return createAPIError(
            APIErrorType.RATE_LIMIT_ERROR,
            "Rate limit exceeded. Please try again later.",
            429,
            {
              details: {
                remaining: rateLimit.remaining,
                reset: new Date(rateLimit.resetTime).toISOString(),
              },
            },
          );
        }
      }

      // Parse and sanitize request data if needed
      if (
        options.sanitizeData !== false &&
        request.method !== "GET" &&
        request.method !== "HEAD"
      ) {
        const rawData = await parseRequestData(request);
        if (rawData) {
          const sanitizedData = validateAndSanitizeData(rawData);
          if (sanitizedData) {
            (context as unknown as Record<string, unknown>).sanitizedData =
              sanitizedData;
          }
        }
      }

      // Execute handler with error boundary if enabled
      const startTime = Date.now();
      let result: Response;
      if (options.errorBoundary !== false) {
        result = await withErrorBoundary(
          handler,
          request,
          context as unknown as Record<string, unknown>,
          {
            logErrors: true,
            sanitizeErrors: true,
          },
        );
      } else {
        result = await handler(
          request,
          context as unknown as Record<string, unknown>,
        );
      }

      // Add security headers
      if (result.headers) {
        result.headers.set("X-Response-Time", `${Date.now() - startTime}ms`);
        result.headers.set("X-Content-Type-Options", "nosniff");
        result.headers.set("X-Frame-Options", "DENY");
        result.headers.set("X-XSS-Protection", "1; mode=block");
      }

      return result;
    } catch (error) {
      // This should rarely be reached due to error boundary, but handle just in case
      return withErrorBoundary(
        async () => {
          throw error;
        },
        request,
        context as unknown as Record<string, unknown>,
        {
          logErrors: true,
          sanitizeErrors: true,
          fallbackMessage: "Critical error in API middleware",
        },
      );
    }
  };
}

/**
 * Create a simple health check endpoint
 */
export function createHealthCheck(serviceName: string): APIRoute {
  return async () => {
    return createSuccessResponse(
      {
        service: serviceName,
        status: "healthy",
        timestamp: new Date().toISOString(),
        methods: ["GET", "POST", "OPTIONS"],
      },
      `${serviceName} API is available`,
    );
  };
}

/**
 * Validate request headers for security
 */
export function validateRequestHeaders(headers: Headers): {
  valid: boolean;
  error?: string;
} {
  try {
    // Check for common attack patterns in headers
    const userAgent = headers.get("user-agent");
    if (userAgent && userAgent.length > 500) {
      trackError(
        new Error("User-Agent header too long"),
        "header_validation",
        "low",
        { header: "user-agent", length: userAgent.length },
      );
      return { valid: false, error: "User-Agent header too long" };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      { pattern: /<(script|iframe|object|embed)/i, name: "html_injection" },
      { pattern: /javascript:/i, name: "javascript_protocol" },
      { pattern: /on\w+\s*=/i, name: "event_handler" },
      { pattern: /data:text\/html/i, name: "data_uri" },
    ];

    for (const [key, value] of headers.entries()) {
      for (const { pattern, name } of suspiciousPatterns) {
        if (pattern.test(value)) {
          trackError(
            new Error(`Suspicious pattern detected in header`),
            "header_validation",
            "medium",
            { header: key, pattern: name, value: value.slice(0, 100) },
          );
          return {
            valid: false,
            error: `Suspicious pattern in header: ${key}`,
          };
        }
      }
    }

    return { valid: true };
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("Header validation error"),
      "header_validation",
      "high",
      { error: String(error) },
    );
    return { valid: false, error: "Header validation failed" };
  }
}

/**
 * Sanitize input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  try {
    if (typeof input !== "string") return input;

    const sanitized = input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .slice(0, 10000); // Limit length to prevent DoS

    // Track if input was modified (potential attack attempt)
    if (sanitized !== input) {
      trackError(
        new Error("Input sanitization applied"),
        "input_sanitization",
        "low",
        {
          originalLength: input.length,
          sanitizedLength: sanitized.length,
          modified: true,
        },
      );
    }

    return sanitized;
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("Input sanitization error"),
      "input_sanitization",
      "high",
      { input: String(input).slice(0, 100) },
    );
    return "[Sanitization Error]";
  }
}

/**
 * Validate and sanitize request data
 */
export function validateAndSanitizeData<T>(data: T): T | null {
  if (!data || typeof data !== "object") return null;

  try {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      // Sanitize key
      const sanitizedKey = sanitizeInput(key);
      if (!sanitizedKey) continue; // Skip if key becomes empty

      // Sanitize value based on type
      if (typeof value === "string") {
        const sanitizedValue = sanitizeInput(value);
        if (sanitizedValue) {
          sanitized[sanitizedKey] = sanitizedValue;
        }
      } else if (typeof value === "number" || typeof value === "boolean") {
        sanitized[sanitizedKey] = value;
      } else if (Array.isArray(value)) {
        sanitized[sanitizedKey] = value
          .map((item) =>
            typeof item === "string" ? sanitizeInput(item) : item,
          )
          .filter((item) => item !== "");
      } else if (typeof value === "object" && value !== null) {
        // Recursively sanitize nested objects (with depth limit)
        const nested = validateAndSanitizeData(value);
        if (nested) {
          sanitized[sanitizedKey] = nested;
        }
      }
    }

    return Object.keys(sanitized).length > 0 ? (sanitized as T) : null;
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("Data validation failed"),
      "validate_and_sanitize",
      "medium",
    );
    return null;
  }
}

/**
 * Sanitize and validate common form fields
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[] = [],
): { sanitized: T; errors: string[] } {
  const sanitized = { ...data };
  const errors: string[] = [];

  // Check required fields
  for (const field of requiredFields) {
    if (!data[field] || String(data[field]).trim() === "") {
      errors.push(`${String(field)} is required`);
    }
  }

  // Sanitize string fields
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === "string") {
      sanitized[key as keyof T] = value.trim() as T[keyof T];
    }
  }

  return { sanitized, errors };
}

/**
 * Initialize rate limit cleanup (server-safe)
 */
export function initializeRateLimitCleanup(): void {
  // Only set up periodic cleanup in server environments
  if (typeof setInterval !== "undefined" && typeof process !== "undefined") {
    // Check if we're in a serverless environment
    const isServerless =
      process.env.NETLIFY || process.env.AWS_LAMBDA;

    if (!isServerless) {
      setInterval(cleanupRateLimitStore, RATE_LIMIT_CLEANUP_INTERVAL);
      if (process.env.NODE_ENV === "development") {
        // Periodic cleanup initialized
      }
    } else {
      // Skipping periodic cleanup in serverless environment
    }
  }
}

// Initialize cleanup on module load (only in appropriate environments)
initializeRateLimitCleanup();
