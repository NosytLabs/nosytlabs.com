/**
 * Enhanced Error Handling Utilities
 * Comprehensive error management and reporting system
 */

export class AppError extends Error {
  public readonly code: string;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';
  public readonly context: Record<string, any> | undefined;
  public readonly timestamp: Date;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date();

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 'low', { field });
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, status?: number, url?: string) {
    super(message, 'NETWORK_ERROR', 'medium', { status, url });
    this.name = 'NetworkError';
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, configKey?: string) {
    super(message, 'CONFIGURATION_ERROR', 'high', { configKey });
    this.name = 'ConfigurationError';
  }
}

export class CompatibilityError extends AppError {
  constructor(message: string, feature?: string, browser?: string) {
    super(message, 'COMPATIBILITY_ERROR', 'medium', { feature, browser });
    this.name = 'CompatibilityError';
  }
}

export class AccessibilityError extends AppError {
  constructor(message: string, element?: string, guideline?: string) {
    super(message, 'ACCESSIBILITY_ERROR', 'high', { element, guideline });
    this.name = 'AccessibilityError';
  }
}

export class PerformanceError extends AppError {
  constructor(message: string, metric?: string, threshold?: number) {
    super(message, 'PERFORMANCE_ERROR', 'medium', { metric, threshold });
    this.name = 'PerformanceError';
  }
}

export class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: AppError[] = [];
  private isReporting = false;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  async reportError(error: Error | AppError, context?: Record<string, any>): Promise<void> {
    const appError = error instanceof AppError
      ? error
      : new AppError(error.message, 'UNHANDLED_ERROR', 'medium', context);

    // Add to queue
    this.errorQueue.push(appError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error reported:', {
        message: appError.message,
        code: appError.code,
        severity: appError.severity,
        context: appError.context,
        stack: appError.stack
      });
    }

    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: appError.message,
        fatal: appError.severity === 'critical'
      });
    }

    // Process queue
    await this.processErrorQueue();
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isReporting || this.errorQueue.length === 0) {
      return;
    }

    this.isReporting = true;

    try {
      // Process error queue - implementation would use this
      // const errors = [...this.errorQueue];
      this.errorQueue = [];

      // In a real application, you would send these to your error reporting service
      // For now, we'll just log them
      // Processing error queue with ${errors.length} errors

    } catch (reportingError) {
      console.error('Failed to report errors:', reportingError);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...this.errorQueue);
    } finally {
      this.isReporting = false;
    }
  }

  getErrorStats(): { total: number; bySeverity: Record<string, number>; byType: Record<string, number> } {
    const stats = {
      total: this.errorQueue.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      byType: {} as Record<string, number>
    };

    this.errorQueue.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byType[error.code] = (stats.byType[error.code] || 0) + 1;
    });

    return stats;  }

  // Enhanced error context collection
  /*
  private collectErrorContext(): Record<string, any> {
    const context: Record<string, any> = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    // Add browser capabilities if available
    if (typeof window !== 'undefined' && window.browserCapabilities) {
      context.browserCapabilities = window.browserCapabilities;
    }

    // Add performance metrics if available
    if (typeof performance !== 'undefined') {
      context.performance = {
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize
        } : undefined,
        timing: performance.timing ? {
          loadEventEnd: performance.timing.loadEventEnd,
          navigationStart: performance.timing.navigationStart
        } : undefined
      };
    }

    return context;
  }
  */
}

// Global error handlers
export function setupGlobalErrorHandlers(): void {
  const errorReporter = ErrorReporter.getInstance();

  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

      errorReporter.reportError(error, {
        type: 'unhandledrejection',
        url: window.location.href
      });
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      const error = event.error || new Error(event.message);

      errorReporter.reportError(error, {
        type: 'uncaughterror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        url: window.location.href
      });
    });
  }
}

// Utility functions

/**
 * Higher-order function that wraps any function with error handling
 * @param fn - Function to wrap with error handling
 * @param errorHandler - Optional custom error handler
 * @returns Wrapped function with error handling
 *
 * @example
 * ```typescript
 * const safeFunction = withErrorHandling(riskyFunction, (error) => {
 *   console.error('Custom error handling:', error);
 * });
 * ```
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  errorHandler?: (error: Error) => void
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          if (errorHandler) {
            errorHandler(error);
          } else {
            ErrorReporter.getInstance().reportError(error);
          }
          throw error;
        });
      }

      return result;
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error);
      } else {
        ErrorReporter.getInstance().reportError(error as Error);
      }
      throw error;
    }
  }) as T;
}

export function safeAsync<T>(
  promise: Promise<T>,
  defaultValue?: T
): Promise<[T | null, Error | null]> {
  return promise
    .then((data) => [data, null] as [T, null])
    .catch((error) => [defaultValue || null, error] as [T | null, Error]);
}

// Initialize error handling
if (typeof window !== 'undefined') {
  setupGlobalErrorHandlers();
}