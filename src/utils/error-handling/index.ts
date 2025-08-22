/**
 * Unified Error Handling System
 *
 * Consolidates error handling, logging, and recovery strategies
 * across the entire application with type-safe error management.
 */

import React from 'react';
import { logger } from '../logger.js';

/**
 * Comprehensive error types for better categorization
 */
export enum ErrorType {
  // Network and API errors
  NETWORK = 'NETWORK',
  API = 'API',
  TIMEOUT = 'TIMEOUT',

  // Authentication and authorization
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',

  // Validation and input errors
  VALIDATION = 'VALIDATION',
  SANITIZATION = 'SANITIZATION',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Server and system errors
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
  FILE_SYSTEM = 'FILE_SYSTEM',

  // Security errors
  SECURITY = 'SECURITY',
  CSRF = 'CSRF',
  RATE_LIMIT = 'RATE_LIMIT',

  // Application errors
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  CONFIGURATION = 'CONFIGURATION',

  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Error context interface
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

/**
 * Enhanced error class with comprehensive metadata
 */
export class AppError extends Error {
  readonly type: ErrorType;
  readonly severity: ErrorSeverity;
  readonly statusCode?: number;
  readonly originalError?: Error;
  readonly context?: ErrorContext;
  readonly recoverable: boolean;
  readonly userMessage?: string;
  readonly errorId: string;

  constructor({
    message,
    type = ErrorType.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    statusCode,
    originalError,
    context,
    recoverable = true,
    userMessage,
  }: {
    message: string;
    type?: ErrorType;
    severity?: ErrorSeverity;
    statusCode?: number;
    originalError?: Error;
    context?: ErrorContext;
    recoverable?: boolean;
    userMessage?: string;
  }) {
    super(message);

    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    if (statusCode !== undefined) this.statusCode = statusCode;
    if (originalError !== undefined) this.originalError = originalError;
    this.context = {
      timestamp: new Date().toISOString(),
      ...context,
    };
    this.recoverable = recoverable;
    if (userMessage !== undefined) this.userMessage = userMessage;
    this.errorId = this.generateErrorId();

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  private generateErrorId(): string {
    return `${this.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.userMessage || this.getDefaultUserMessage();
  }

  private getDefaultUserMessage(): string {
    switch (this.type) {
      case ErrorType.NETWORK:
        return 'Network connection issue. Please check your internet connection and try again.';
      case ErrorType.AUTHENTICATION:
        return 'Authentication required. Please log in and try again.';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.RATE_LIMIT:
        return 'Too many requests. Please wait a moment and try again.';
      case ErrorType.SERVER:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON(): Record<string, any> {
    return {
      errorId: this.errorId,
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      statusCode: this.statusCode,
      recoverable: this.recoverable,
      userMessage: this.userMessage,
      context: this.context,
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack,
          }
        : undefined,
    };
  }
}

/**
 * Error factory functions for common error types
 */
export const ErrorFactory = {
  network: (message: string, statusCode?: number, originalError?: Error, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      ...(statusCode && { statusCode }),
      ...(originalError && { originalError }),
      ...(context && { context }),
      userMessage: 'Network connection issue. Please try again.',
    }),

  api: (message: string, statusCode?: number, originalError?: Error, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.API,
      severity: ErrorSeverity.MEDIUM,
      ...(statusCode && { statusCode }),
      ...(originalError && { originalError }),
      ...(context && { context }),
    }),

  validation: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.VALIDATION,
      severity: ErrorSeverity.LOW,
      statusCode: 400,
      ...(context && { context }),
      userMessage: 'Please check your input and try again.',
    }),

  authentication: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      statusCode: 401,
      ...(context && { context }),
      recoverable: false,
      userMessage: 'Authentication required. Please log in.',
    }),

  authorization: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.AUTHORIZATION,
      severity: ErrorSeverity.HIGH,
      statusCode: 403,
      ...(context && { context }),
      recoverable: false,
      userMessage: 'You do not have permission to perform this action.',
    }),

  notFound: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.NOT_FOUND,
      severity: ErrorSeverity.LOW,
      statusCode: 404,
      ...(context && { context }),
      userMessage: 'The requested resource was not found.',
    }),

  server: (message: string, originalError?: Error, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.SERVER,
      severity: ErrorSeverity.CRITICAL,
      statusCode: 500,
      ...(originalError && { originalError }),
      ...(context && { context }),
      recoverable: false,
      userMessage: 'Server error. Please try again later.',
    }),

  security: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.SECURITY,
      severity: ErrorSeverity.CRITICAL,
      statusCode: 403,
      ...(context && { context }),
      recoverable: false,
      userMessage: 'Security violation detected.',
    }),

  timeout: (message: string, context?: ErrorContext) =>
    new AppError({
      message,
      type: ErrorType.TIMEOUT,
      severity: ErrorSeverity.MEDIUM,
      statusCode: 408,
      ...(context && { context }),
      userMessage: 'Request timed out. Please try again.',
    }),
};

/**
 * Enhanced network request error handler
 */
export const handleNetworkError = async (
  response: Response,
  context?: ErrorContext
): Promise<Response> => {
  if (!response.ok) {
    let errorMessage = `Request failed with status: ${response.status}`;
    let errorData: any = null;

    // Try to parse error details from response
    try {
      errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch {
        // Use default message
      }
    }

    // Create appropriate error based on status code
    let error: AppError;

    if (response.status === 401) {
      error = ErrorFactory.authentication(errorMessage, context);
    } else if (response.status === 403) {
      error = ErrorFactory.authorization(errorMessage, context);
    } else if (response.status === 404) {
      error = ErrorFactory.notFound(errorMessage, context);
    } else if (response.status === 408) {
      error = ErrorFactory.timeout(errorMessage, context);
    } else if (response.status >= 400 && response.status < 500) {
      error = ErrorFactory.api(errorMessage, response.status, undefined, context);
    } else {
      error = ErrorFactory.server(errorMessage, undefined, context);
    }

    // Log the error
    logger.error(`Network request failed: ${errorMessage}`, error, 'Network');

    throw error;
  }

  return response;
};

/**
 * Enhanced fetch wrapper with comprehensive error handling
 */
export const fetchWithErrorHandling = async (
  url: string,
  options?: RequestInit,
  context?: ErrorContext
): Promise<Response> => {
  try {
    const response = await fetch(url, options);
    return await handleNetworkError(response, {
      ...context,
      url,
      method: options?.method || 'GET',
    });
  } catch (_error) {
    // If it's already an AppError, rethrow it
    if (_error instanceof AppError) {
      throw _error;
    }

    // Otherwise, wrap it in an AppError
    const networkError = ErrorFactory.network(
      (_error as Error)?.message || 'Network request failed',
      undefined,
      _error as Error,
      { ...context, url, method: options?.method || 'GET' }
    );

    logger.error('Fetch operation failed', networkError, 'Network');
    throw networkError;
  }
};

/**
 * Timeout promise utility
 */
export const timeoutPromise = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Request timed out',
  context?: ErrorContext
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(ErrorFactory.timeout(`${errorMessage} after ${timeoutMs}ms`, context));
    }, timeoutMs);

    promise
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

/**
 * Fetch with timeout and comprehensive error handling
 */
export const fetchWithTimeout = async (
  url: string,
  options?: RequestInit,
  timeoutMs = 10000,
  context?: ErrorContext
): Promise<Response> => {
  return timeoutPromise(
    fetchWithErrorHandling(url, options, context),
    timeoutMs,
    `Request to ${url} timed out`,
    context
  );
};

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Retry with exponential backoff
   */
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    baseDelay = 1000,
    context?: ErrorContext
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return await operation();
      } catch (error) {
        lastError = error as unknown;

        if (attempt === maxAttempts) {
          break;
        }

        // Don't retry non-recoverable errors
        if (error instanceof AppError && !error.recoverable) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>(resolve => {
          setTimeout(resolve, delay);
        });

        logger.info(`Retrying operation (attempt ${attempt + 1}/${maxAttempts})`, {
          attempt,
          delay,
          error: error instanceof AppError ? error.toJSON() : { message: (error as Error).message },
          context,
        });
      }
    }

    const finalError =
      lastError instanceof AppError
        ? lastError
        : lastError instanceof Error
          ? lastError
          : ErrorFactory.server(
              'Operation failed after retries',
              new Error(String(lastError)),
              context
            );
    throw finalError;
  },

  /**
   * Circuit breaker pattern
   */
  createCircuitBreaker<T>(operation: () => Promise<T>, failureThreshold = 5, resetTimeout = 60000) {
    let failures = 0;
    let lastFailureTime = 0;
    let state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    return async (): Promise<T> => {
      const now = Date.now();

      if (state === 'OPEN') {
        if (now - lastFailureTime >= resetTimeout) {
          state = 'HALF_OPEN';
        } else {
          throw new Error('Circuit breaker is open');
        }
      }

      try {
        const result = await operation();

        if (state === 'HALF_OPEN') {
          state = 'CLOSED';
          failures = 0;
        }

        return result;
      } catch (error) {
        failures++;
        lastFailureTime = now;

        if (failures >= failureThreshold) {
          state = 'OPEN';
        }

        const toThrow =
          error instanceof AppError
            ? error
            : error instanceof Error
              ? ErrorFactory.server('Circuit breaker operation failed', error)
              : ErrorFactory.server('Circuit breaker operation failed', new Error(String(error)));

        throw toThrow;
      }
    };
  },
};

/**
 * Global error handler setup
 */
export const setupGlobalErrorHandlers = (): void => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      const error =
        event.reason instanceof AppError
          ? event.reason
          : ErrorFactory.server('Unhandled Promise Rejection', event.reason);

      logger.error('Unhandled Promise Rejection', error, 'Global');
      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', event => {
      const error = ErrorFactory.server(
        `Uncaught Error: ${event.message}`,
        new Error(event.message),
        {
          url: event.filename,
          additionalData: {
            lineno: event.lineno,
            colno: event.colno,
          },
        }
      );

      logger.error('Uncaught Error', error, 'Global');
      event.preventDefault();
    });
  }
};

/**
 * Error boundary helper for React components
 */
export const createErrorBoundary = (
  fallbackComponent: React.ComponentType<{ error: AppError }>
) => {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: AppError }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      const appError =
        error instanceof AppError ? error : ErrorFactory.server('Component Error', error);

      return { hasError: true, error: appError };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const appError =
        error instanceof AppError
          ? error
          : ErrorFactory.server('Component Error', error, {
              additionalData: errorInfo,
            });

      logger.error('React Error Boundary caught error', appError, 'React');
    }

    override render() {
      if (this.state.hasError && this.state.error) {
        return React.createElement(fallbackComponent, { error: this.state.error });
      }

      return this.props.children;
    }
  };
};

export default {
  AppError,
  ErrorFactory,
  ErrorType,
  ErrorSeverity,
  handleNetworkError,
  fetchWithErrorHandling,
  fetchWithTimeout,
  timeoutPromise,
  ErrorRecovery,
  setupGlobalErrorHandlers,
  createErrorBoundary,
};
