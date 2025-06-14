// Enhanced Error Handling Utilities
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

export class EnhancedAppError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context: Partial<ErrorContext> = {}
  ) {
    super(message);
    this.name = 'EnhancedAppError';
    this.code = code;
    this.severity = severity;
    this.context = {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...context
    };
  }
}

export class ErrorBoundary {
  private static instance: ErrorBoundary;
  private errorHandlers: Map<string, (error: EnhancedAppError) => void> = new Map();

  static getInstance(): ErrorBoundary {
    if (!ErrorBoundary.instance) {
      ErrorBoundary.instance = new ErrorBoundary();
    }
    return ErrorBoundary.instance;
  }

  registerHandler(errorCode: string, handler: (error: EnhancedAppError) => void) {
    this.errorHandlers.set(errorCode, handler);
  }

  handleError(error: EnhancedAppError) {
    // Log error
    console.error(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`, error.context);

    // Call specific handler if exists
    const handler = this.errorHandlers.get(error.code);
    if (handler) {
      handler(error);
    }

    // Default handling based on severity
    switch (error.severity) {
      case 'critical':
        this.handleCriticalError(error);
        break;
      case 'high':
        this.handleHighSeverityError(error);
        break;
      case 'medium':
        this.handleMediumSeverityError(error);
        break;
      case 'low':
        this.handleLowSeverityError(error);
        break;
    }
  }

  private handleCriticalError(error: EnhancedAppError) {
    // Show user notification
    this.showUserNotification('A critical error occurred. Please refresh the page.', 'error');
  }

  private handleHighSeverityError(error: EnhancedAppError) {
    // Show user notification
    this.showUserNotification('An error occurred. Some features may not work properly.', 'warning');
  }

  private handleMediumSeverityError(error: EnhancedAppError) {
    // Log for debugging
    console.warn('Medium severity error:', error);
  }

  private handleLowSeverityError(error: EnhancedAppError) {
    // Silent logging
    console.debug('Low severity error:', error);
  }

  private showUserNotification(message: string, type: 'error' | 'warning' | 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background-color: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
}

// Validation utilities
export class ValidationUtils {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateRequired(value: any, fieldName: string): void {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new EnhancedAppError(
        `${fieldName} is required`,
        'VALIDATION_REQUIRED',
        'medium',
        { component: 'ValidationUtils', action: 'validateRequired' }
      );
    }
  }

  static validateEmail(email: string): void {
    if (!this.isEmail(email)) {
      throw new EnhancedAppError(
        'Invalid email format',
        'VALIDATION_EMAIL',
        'medium',
        { component: 'ValidationUtils', action: 'validateEmail' }
      );
    }
  }
}

// Async utilities
export class AsyncUtils {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries) {
          throw new EnhancedAppError(
            `Operation failed after ${maxRetries} retries: ${lastError.message}`,
            'ASYNC_RETRY_FAILED',
            'high',
            { component: 'AsyncUtils', action: 'withRetry' }
          );
        }

        await this.sleep(delay * Math.pow(2, i)); // Exponential backoff
      }
    }

    throw lastError!;
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new EnhancedAppError(
          `Operation timed out after ${ms}ms`,
          'ASYNC_TIMEOUT',
          'medium',
          { component: 'AsyncUtils', action: 'timeout' }
        )), ms)
      )
    ]);
  }
}

// Initialize error handling
export function initErrorHandling() {
  const errorBoundary = ErrorBoundary.getInstance();

  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      const error = new EnhancedAppError(
        event.message,
        'GLOBAL_ERROR',
        'high',
        { component: 'Global', action: 'windowError' }
      );
      errorBoundary.handleError(error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = new EnhancedAppError(
        event.reason?.message || 'Unhandled promise rejection',
        'UNHANDLED_REJECTION',
        'high',
        { component: 'Global', action: 'unhandledRejection' }
      );
      errorBoundary.handleError(error);
    });
  }

  return errorBoundary;
}
