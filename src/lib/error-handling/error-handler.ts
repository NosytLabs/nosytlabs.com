/**
 * Error Handling Utilities
 *
 * Unified error handling and logging system for tracking, reporting,
 * and managing errors across the application.
 *
 * @module error-handling/error-handler
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Error context for additional information
 */
export interface ErrorContext {
  [key: string]: unknown;
}

/**
 * Error report structure
 */
export interface ErrorReport {
  message: string;
  stack?: string;
  context: string;
  url: string;
  timestamp: number;
  userAgent: string;
  severity: ErrorSeverity;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

// ========================================
// ERROR HANDLER CLASS
// ========================================

/**
 * Unified Error Handler
 * Centralized error tracking, logging, and reporting system.
 *
 * @example
 * ```typescript
 * const handler = ErrorHandler.getInstance();
 * handler.trackError(new Error('Something went wrong'), 'api_call', 'high');
 *
 * // Get error queue
 * const errors = handler.getErrorQueue();
 *
 * // Flush errors to analytics
 * await handler.flushErrorQueue();
 * ```
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  private constructor() {
    if (typeof window !== "undefined") {
      this.initializeGlobalErrorHandlers();
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Initialize global error handlers for uncaught errors
   */
  private initializeGlobalErrorHandlers(): void {
    // Handle uncaught JavaScript errors
    window.addEventListener("error", (event) => {
      this.trackError(new Error(event.message), "global_error", "high", {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(
        new Error(event.reason?.toString() || "Unhandled promise rejection"),
        "unhandled_promise",
        "high",
        { reason: event.reason },
      );
    });
  }

  /**
   * Track an error with context
   *
   * @param error - Error to track
   * @param context - Context string
   * @param severity - Error severity
   * @param additionalContext - Additional context data
   */
  public trackError(
    error: Error,
    context: string = "unknown",
    severity: ErrorSeverity = "medium",
    additionalContext?: ErrorContext,
  ): void {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context: this.formatContext(context, additionalContext),
      url: typeof window !== "undefined" ? window.location.href : "server",
      timestamp: Date.now(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      severity,
    };

    this.addToQueue(errorReport);
    this.logError(errorReport);

    // Send immediately for critical errors
    if (severity === "critical") {
      this.sendErrorReport(errorReport);
    }
  }

  /**
   * Format context with additional data
   */
  private formatContext(
    context: string,
    additionalContext?: ErrorContext,
  ): string {
    if (!additionalContext) return context;

    try {
      return `${context} | ${JSON.stringify(additionalContext)}`;
    } catch {
      return `${context} | [context serialization failed]`;
    }
  }

  /**
   * Add error to queue
   */
  private addToQueue(errorReport: ErrorReport): void {
    this.errorQueue.push(errorReport);

    // Maintain queue size limit
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Log error to console (development only)
   */
  private logError(errorReport: ErrorReport): void {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Tracked Error:", {
        message: errorReport.message,
        severity: errorReport.severity,
        context: errorReport.context,
        timestamp: errorReport.timestamp,
        userAgent: errorReport.userAgent,
        url: errorReport.url,
      });

      if (errorReport.stack) {
        console.warn("Stack trace:", errorReport.stack);
      }
    }
  }

  /**
   * Send error report to analytics service
   *
   * @param errorReport - Error report to send
   */
  public async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "📤 Error report (would be sent to error service):",
        errorReport,
      );
      return;
    }

    try {
      // Error tracking service integration would go here
      // Currently errors are logged but not sent to external service
    } catch (fetchError) {
      // Silently fail in production to avoid console spam
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to send error report:", fetchError);
      }
    }
  }

  /**
   * Flush error queue to analytics service
   */
  public async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Batch send errors
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "📤 Flushing error queue (would be sent to error service):",
          errors,
        );
        return;
      }

      // Batch error service integration would go here
      // Currently errors are queued but not sent to external service
    } catch (error) {
      // Re-add errors to queue if sending fails
      this.errorQueue.unshift(...errors);

      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to flush error queue:", error);
      }
    }
  }

  /**
   * Get error queue
   *
   * @returns Copy of error queue
   */
  public getErrorQueue(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  public clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get error statistics
   *
   * @returns Error statistics
   */
  public getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    recent: ErrorReport[];
  } {
    const bySeverity: Record<ErrorSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    this.errorQueue.forEach((error) => {
      bySeverity[error.severity]++;
    });

    return {
      total: this.errorQueue.length,
      bySeverity,
      recent: this.errorQueue.slice(-10),
    };
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Track an error with context
 *
 * @param error - Error to track
 * @param context - Context string
 * @param severity - Error severity
 * @param additionalContext - Additional context data
 *
 * @example
 * ```typescript
 * try {
 *   // risky operation
 * } catch (error) {
 *   trackError(error, 'api_call', 'high', { endpoint: '/api/users' });
 * }
 * ```
 */
export function trackError(
  error: Error,
  context?: string,
  severity?: ErrorSeverity,
  additionalContext?: ErrorContext,
): void {
  const handler = ErrorHandler.getInstance();
  handler.trackError(error, context, severity, additionalContext);
}

/**
 * Safe JSON parse with error tracking
 *
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @param context - Context for error tracking
 * @returns Parsed value or fallback
 *
 * @example
 * ```typescript
 * const data = safeJsonParse('{"name":"John"}', {}, 'user_data');
 * ```
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T,
  context: string = "json_parse",
): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("JSON parse failed"),
      context,
      "low",
      { json: json.substring(0, 100) + (json.length > 100 ? "..." : "") },
    );
    return fallback;
  }
}

/**
 * Safe async operation with error tracking
 *
 * @param operation - Async operation to execute
 * @param fallback - Fallback value if operation fails
 * @param context - Context for error tracking
 * @returns Operation result or fallback
 *
 * @example
 * ```typescript
 * const data = await safeAsync(
 *   () => fetch('/api/data').then(r => r.json()),
 *   [],
 *   'fetch_data'
 * );
 * ```
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  context: string = "async_operation",
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    trackError(
      error instanceof Error ? error : new Error("Async operation failed"),
      context,
      "medium",
    );
    return fallback;
  }
}

/**
 * Wrap a function with error tracking
 *
 * @param fn - Function to wrap
 * @param context - Context for error tracking
 * @param severity - Error severity
 * @returns Wrapped function
 *
 * @example
 * ```typescript
 * const safeFunction = withErrorTracking(
 *   riskyFunction,
 *   'risky_operation',
 *   'high'
 * );
 * ```
 */
export function withErrorTracking<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context: string,
  severity: ErrorSeverity = "medium",
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          trackError(
            error instanceof Error
              ? error
              : new Error("Function execution failed"),
            context,
            severity,
            { args: args.slice(0, 3) }, // Limit args to prevent large objects
          );
          throw error;
        });
      }

      return result;
    } catch (error) {
      trackError(
        error instanceof Error ? error : new Error("Function execution failed"),
        context,
        severity,
        { args: args.slice(0, 3) },
      );
      throw error;
    }
  }) as T;
}

// Initialize global error handler
if (typeof window !== "undefined") {
  ErrorHandler.getInstance();
}
