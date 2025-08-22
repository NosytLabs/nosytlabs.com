/**
 * Secure Error Handling System
 * Prevents sensitive information exposure while maintaining useful error reporting
 */

// import { validateEnv } from './env.js'; // Temporarily disabled for development

/**
 * Error types and their security levels
 */
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EMAIL_ERROR: 'EMAIL_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  CSRF_ERROR: 'CSRF_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
};

/**
 * Security levels for error exposure
 */
const SecurityLevel = {
  PUBLIC: 'PUBLIC',     // Safe to show to users
  INTERNAL: 'INTERNAL', // Only log internally
  SENSITIVE: 'SENSITIVE' // Never expose, minimal logging
};

/**
 * Error configuration mapping
 */
const errorConfig = {
  [ErrorTypes.VALIDATION_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 400,
    userMessage: 'Please check your input and try again.',
    logLevel: 'warn'
  },
  [ErrorTypes.AUTHENTICATION_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 401,
    userMessage: 'Authentication required. Please log in.',
    logLevel: 'warn'
  },
  [ErrorTypes.AUTHORIZATION_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 403,
    userMessage: 'You do not have permission to perform this action.',
    logLevel: 'warn'
  },
  [ErrorTypes.RATE_LIMIT_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 429,
    userMessage: 'Too many requests. Please try again later.',
    logLevel: 'warn'
  },
  [ErrorTypes.DATABASE_ERROR]: {
    level: SecurityLevel.INTERNAL,
    statusCode: 500,
    userMessage: 'A database error occurred. Please try again.',
    logLevel: 'error'
  },
  [ErrorTypes.EMAIL_ERROR]: {
    level: SecurityLevel.INTERNAL,
    statusCode: 500,
    userMessage: 'Email service is temporarily unavailable.',
    logLevel: 'error'
  },
  [ErrorTypes.FILE_UPLOAD_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 400,
    userMessage: 'File upload failed. Please check file size and type.',
    logLevel: 'warn'
  },
  [ErrorTypes.CSRF_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 403,
    userMessage: 'Security token invalid. Please refresh and try again.',
    logLevel: 'warn'
  },
  [ErrorTypes.NETWORK_ERROR]: {
    level: SecurityLevel.INTERNAL,
    statusCode: 503,
    userMessage: 'Network error occurred. Please try again.',
    logLevel: 'error'
  },
  [ErrorTypes.INTERNAL_ERROR]: {
    level: SecurityLevel.SENSITIVE,
    statusCode: 500,
    userMessage: 'An unexpected error occurred. Please try again.',
    logLevel: 'error'
  },
  [ErrorTypes.NOT_FOUND_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 404,
    userMessage: 'The requested resource was not found.',
    logLevel: 'info'
  },
  [ErrorTypes.CONFLICT_ERROR]: {
    level: SecurityLevel.PUBLIC,
    statusCode: 409,
    userMessage: 'A conflict occurred. Please check your data.',
    logLevel: 'warn'
  }
};

/**
 * Custom Application Error class
 */
export class AppError extends Error {
  constructor(type, message, details = null, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.details = details;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.id = this.generateErrorId();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
  
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Secure Error Handler class
 */
export class SecureErrorHandler {
  constructor() {
    // this.env = validateEnv(); // Temporarily disabled for development
    this.env = { NODE_ENV: process.env.NODE_ENV || 'development' };
    this.isDevelopment = this.env.NODE_ENV === 'development';
    this.isProduction = this.env.NODE_ENV === 'production';
  }

  /**
   * Handles and formats errors for API responses
   * @param {Error} error - The error to handle
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {Function} next - Express next function
   */
  handleError(error, req, res, next) {
    // Generate unique request ID for tracking
    const requestId = req.id || this.generateRequestId();
    
    // Determine error type and configuration
    const errorType = this.determineErrorType(error);
    const config = errorConfig[errorType];
    
    // Create structured error object
    const structuredError = {
      id: error.id || this.generateErrorId(),
      type: errorType,
      message: error.message,
      requestId,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: this.getClientIP(req),
      originalError: error
    };
    
    // Log error internally
    this.logError(structuredError, config.logLevel);
    
    // Send appropriate response to client
    this.sendErrorResponse(res, structuredError, config);
  }

  /**
   * Determines the error type based on the error object
   * @param {Error} error - The error to classify
   * @returns {string} Error type
   */
  determineErrorType(error) {
    if (error instanceof AppError) {
      return error.type;
    }
    
    // Check error message patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorTypes.VALIDATION_ERROR;
    }
    
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return ErrorTypes.AUTHENTICATION_ERROR;
    }
    
    if (message.includes('forbidden') || message.includes('permission')) {
      return ErrorTypes.AUTHORIZATION_ERROR;
    }
    
    if (message.includes('rate limit') || message.includes('too many')) {
      return ErrorTypes.RATE_LIMIT_ERROR;
    }
    
    if (message.includes('database') || message.includes('connection')) {
      return ErrorTypes.DATABASE_ERROR;
    }
    
    if (message.includes('email') || message.includes('smtp')) {
      return ErrorTypes.EMAIL_ERROR;
    }
    
    if (message.includes('file') || message.includes('upload')) {
      return ErrorTypes.FILE_UPLOAD_ERROR;
    }
    
    if (message.includes('csrf') || message.includes('token')) {
      return ErrorTypes.CSRF_ERROR;
    }
    
    if (message.includes('network') || message.includes('timeout')) {
      return ErrorTypes.NETWORK_ERROR;
    }
    
    if (message.includes('not found') || error.status === 404) {
      return ErrorTypes.NOT_FOUND_ERROR;
    }
    
    if (message.includes('conflict') || error.status === 409) {
      return ErrorTypes.CONFLICT_ERROR;
    }
    
    return ErrorTypes.INTERNAL_ERROR;
  }

  /**
   * Logs error with appropriate level and sanitization
   * @param {object} error - Structured error object
   * @param {string} level - Log level
   */
  logError(error, level = 'error') {
    const logData = {
      id: error.id,
      type: error.type,
      message: error.message,
      requestId: error.requestId,
      timestamp: error.timestamp,
      path: error.path,
      method: error.method,
      ip: error.ip,
      userAgent: this.sanitizeUserAgent(error.userAgent)
    };
    
    // Add stack trace in development
    if (this.isDevelopment && error.originalError?.stack) {
      logData.stack = error.originalError.stack;
    }
    
    // Remove sensitive information
    const sanitizedLog = this.sanitizeLogData(logData);
    
    // Log based on level
    switch (level) {
      case 'error':
        console.error('Application Error:', sanitizedLog);
        break;
      case 'warn':
        console.warn('Application Warning:', sanitizedLog);
        break;
      case 'info':
        console.info('Application Info:', sanitizedLog);
        break;
      default:
        console.log('Application Log:', sanitizedLog);
    }
    
    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalLogger(sanitizedLog, level);
    }
  }

  /**
   * Sends error response to client
   * @param {object} res - Express response object
   * @param {object} error - Structured error object
   * @param {object} config - Error configuration
   */
  sendErrorResponse(res, error, config) {
    const response = {
      error: true,
      message: config.userMessage,
      code: error.type,
      requestId: error.requestId,
      timestamp: error.timestamp
    };
    
    // Add details based on security level and environment
    if (config.level === SecurityLevel.PUBLIC) {
      if (error.originalError?.details) {
        response.details = this.sanitizeErrorDetails(error.originalError.details);
      }
    }
    
    // Add development information
    if (this.isDevelopment) {
      response.debug = {
        originalMessage: error.message,
        stack: error.originalError?.stack,
        path: error.path,
        method: error.method
      };
    }
    
    res.status(config.statusCode).json(response);
  }

  /**
   * Sanitizes log data to remove sensitive information
   * @param {object} logData - Log data to sanitize
   * @returns {object} Sanitized log data
   */
  sanitizeLogData(logData) {
    const sanitized = { ...logData };
    
    // Remove or mask sensitive patterns
    if (sanitized.message) {
      sanitized.message = this.sanitizeMessage(sanitized.message);
    }
    
    if (sanitized.stack) {
      sanitized.stack = this.sanitizeStackTrace(sanitized.stack);
    }
    
    return sanitized;
  }

  /**
   * Sanitizes error messages to remove sensitive information
   * @param {string} message - Error message
   * @returns {string} Sanitized message
   */
  sanitizeMessage(message) {
    // Remove potential sensitive patterns
    return message
      .replace(/password[=:]\s*[^\s]+/gi, 'password=[REDACTED]')
      .replace(/token[=:]\s*[^\s]+/gi, 'token=[REDACTED]')
      .replace(/key[=:]\s*[^\s]+/gi, 'key=[REDACTED]')
      .replace(/secret[=:]\s*[^\s]+/gi, 'secret=[REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
      .replace(/\b(?:\d{4}[\s-]?){3}\d{4}\b/g, '[CARD_REDACTED]');
  }

  /**
   * Sanitizes stack traces
   * @param {string} stack - Stack trace
   * @returns {string} Sanitized stack trace
   */
  sanitizeStackTrace(stack) {
    if (!stack) return stack;
    
    // Remove file system paths in production
    if (this.isProduction) {
      return stack.replace(/\/[^\s]+\//g, '/[PATH_REDACTED]/');
    }
    
    return stack;
  }

  /**
   * Sanitizes user agent string
   * @param {string} userAgent - User agent string
   * @returns {string} Sanitized user agent
   */
  sanitizeUserAgent(userAgent) {
    if (!userAgent) return 'Unknown';
    
    // Keep only essential browser information
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/);
    return match ? `${match[1]}/${match[2]}` : 'Unknown Browser';
  }

  /**
   * Sanitizes error details for public exposure
   * @param {any} details - Error details
   * @returns {any} Sanitized details
   */
  sanitizeErrorDetails(details) {
    if (typeof details === 'string') {
      return this.sanitizeMessage(details);
    }
    
    if (Array.isArray(details)) {
      return details.map(detail => this.sanitizeErrorDetails(detail));
    }
    
    if (typeof details === 'object' && details !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(details)) {
        if (!this.isSensitiveKey(key)) {
          sanitized[key] = this.sanitizeErrorDetails(value);
        }
      }
      return sanitized;
    }
    
    return details;
  }

  /**
   * Checks if a key contains sensitive information
   * @param {string} key - Object key to check
   * @returns {boolean} Whether key is sensitive
   */
  isSensitiveKey(key) {
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'credential',
      'ssn', 'social', 'credit', 'card', 'account', 'bank'
    ];
    
    return sensitiveKeys.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );
  }

  /**
   * Gets client IP address safely
   * @param {object} req - Express request object
   * @returns {string} Client IP address
   */
  getClientIP(req) {
    return req.ip || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           'Unknown';
  }

  /**
   * Generates unique request ID
   * @returns {string} Request ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates unique error ID
   * @returns {string} Error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sends logs to external logging service
   * @param {object} logData - Log data to send
   * @param {string} level - Log level
   */
  async sendToExternalLogger(logData, level) {
    // Implementation would depend on chosen logging service
    // Examples: Sentry, LogRocket, DataDog, etc.
    try {
      // Example implementation for Sentry
      if (this.env.SENTRY_DSN) {
        // Sentry.captureException(logData);
      }
      
      // Example implementation for custom webhook
      if (this.env.ERROR_WEBHOOK_URL) {
        // await fetch(this.env.ERROR_WEBHOOK_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ level, ...logData })
        // });
      }
    } catch (error) {
      console.error('Failed to send to external logger:', error.message);
    }
  }
}

// Create singleton instance
const errorHandler = new SecureErrorHandler();

/**
 * Express error handling middleware
 * @param {Error} error - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {Function} next - Express next function
 */
export function errorMiddleware(error, req, res, next) {
  errorHandler.handleError(error, req, res, next);
}

/**
 * Creates a new application error
 * @param {string} type - Error type
 * @param {string} message - Error message
 * @param {any} details - Additional details
 * @param {Error} originalError - Original error object
 * @returns {AppError} Application error
 */
export function createError(type, message, details = null, originalError = null) {
  return new AppError(type, message, details, originalError);
}

/**
 * Async error wrapper for route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
export function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;