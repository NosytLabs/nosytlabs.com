/**
 * API Utilities Module
 *
 * Utilities for API operations including helpers, rate limiting,
 * and request/response handling.
 *
 * @module api
 */

// Export all API helpers
export * from "./api-helpers";

// Re-export commonly used utilities for convenience
export {
  getClientIP,
  checkRateLimit,
  createAPIResponse,
  createErrorResponse,
  createSuccessResponse,
  parseRequestData,
  createOptionsHandler,
  withAPIMiddleware,
  createHealthCheck,
  sanitizeFormData,
  cleanupRateLimitStore,
  isValidEmail,
  CORS_HEADERS,
  JSON_HEADERS,
  DEFAULT_RATE_LIMIT,
  type RateLimitData,
  type RateLimitConfig,
} from "./api-helpers";
