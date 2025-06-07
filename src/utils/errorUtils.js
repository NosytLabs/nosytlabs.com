/**
 * @fileoverview Error Handling Utilities
 * 
 * Consolidated error handling functions to standardize error management
 * across the codebase. Provides consistent error logging, reporting, and recovery.
 * 
 * @module errorUtils
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

/**
 * Error severity levels
 * 
 * @readonly
 * @enum {string}
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories for better organization
 * 
 * @readonly
 * @enum {string}
 */
export const ErrorCategory = {
  NETWORK: 'network',
  VALIDATION: 'validation',
  RESOURCE: 'resource',
  PERMISSION: 'permission',
  RUNTIME: 'runtime',
  USER_INPUT: 'user_input'
};

/**
 * Handle errors with consistent logging and reporting
 * 
 * Provides standardized error handling with severity levels,
 * categorization, and optional reporting to external services.
 * 
 * @param {Error|string} error - The error to handle
 * @param {string} [context='Unknown'] - Context where the error occurred
 * @param {string} [severity=ErrorSeverity.MEDIUM] - Error severity level
 * @param {string} [category=ErrorCategory.RUNTIME] - Error category
 * @param {boolean} [report=true] - Whether to report the error
 * @returns {void}
 * @example
 * // Handle basic error
 * handleError(new Error('Something went wrong'), 'User login');
 * 
 * @example
 * // Handle with severity and category
 * handleError(error, 'API call', ErrorSeverity.HIGH, ErrorCategory.NETWORK);
 * 
 * @since 1.0.0
 */
export function handleError(error, context = 'Unknown', severity = ErrorSeverity.MEDIUM, category = ErrorCategory.RUNTIME, report = true) {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    severity,
    category,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  };
  
  // Log to console with appropriate level
  const logMethod = getLogMethod(severity);
  logMethod(`[${severity.toUpperCase()}] ${context}: ${errorInfo.message}`);
  
  if (error instanceof Error && error.stack) {
    console.debug('Stack trace:', error.stack);
  }
  
  // Report to external service if enabled
  if (report && typeof window !== 'undefined') {
    reportError(errorInfo);
  }
  
  // Store in session for debugging
  storeErrorForDebugging(errorInfo);
}

/**
 * Get appropriate console method based on severity
 * 
 * @param {string} severity - Error severity level
 * @returns {Function} Console method to use
 * @example
 * const logMethod = getLogMethod(ErrorSeverity.HIGH);
 * 
 * @since 1.0.0
 */
function getLogMethod(severity) {
  switch (severity) {
    case ErrorSeverity.LOW:
      return console.info;
    case ErrorSeverity.MEDIUM:
      return console.warn;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      return console.error;
    default:
      return console.log;
  }
}

/**
 * Try to execute a function and handle any errors
 * 
 * Safely executes a function with automatic error handling.
 * Returns the result or undefined on error.
 * 
 * @param {Function} func - The function to execute
 * @param {string} [context='Unknown'] - Context for error handling
 * @param {boolean} [report=true] - Whether to report errors
 * @returns {any} The result of the function or undefined on error
 * @example
 * // Safe function execution
 * const result = tryExecute(() => JSON.parse(jsonString), 'JSON parsing');
 * 
 * @example
 * // With custom error handling
 * const result = tryExecute(
 *   () => riskyOperation(),
 *   'Risky operation',
 *   false // Don't report this error
 * );
 * 
 * @since 1.0.0
 */
export function tryExecute(func, context = 'Unknown', report = true) {
  try {
    return func();
  } catch (error) {
    handleError(error, context, ErrorSeverity.MEDIUM, ErrorCategory.RUNTIME, report);
    return undefined;
  }
}

/**
 * Try to execute an async function and handle any errors
 * 
 * Safely executes an async function with automatic error handling.
 * Returns the result or undefined on error.
 * 
 * @async
 * @param {Function} func - The async function to execute
 * @param {string} [context='Unknown'] - Context for error handling
 * @param {boolean} [report=true] - Whether to report errors
 * @returns {Promise<any>} The result of the function or undefined on error
 * @example
 * // Safe async function execution
 * const result = await tryExecuteAsync(
 *   () => fetch('/api/data'),
 *   'API call'
 * );
 * 
 * @since 1.0.0
 */
export async function tryExecuteAsync(func, context = 'Unknown', report = true) {
  try {
    return await func();
  } catch (error) {
    handleError(error, context, ErrorSeverity.MEDIUM, ErrorCategory.RUNTIME, report);
    return undefined;
  }
}

/**
 * Handle resource loading errors (images, scripts, stylesheets)
 * 
 * Standardized handling for resource loading failures with fallbacks.
 * Automatically sets up fallback resources when available.
 * 
 * @param {Event} event - The error event
 * @param {object} [options={}] - Configuration options
 * @param {string} [options.fallbackImage='/images/fallback-image.svg'] - Fallback image URL
 * @param {boolean} [options.retryOnce=true] - Whether to retry loading once
 * @returns {void}
 * @example
 * // Handle image error
 * img.addEventListener('error', handleResourceError);
 * 
 * @example
 * // Handle with custom fallback
 * img.addEventListener('error', (event) => {
 *   handleResourceError(event, { fallbackImage: '/images/custom-fallback.png' });
 * });
 * 
 * @since 1.0.0
 */
export function handleResourceError(event, options = {}) {
  const target = event.target;
  const {
    fallbackImage = '/images/fallback-image.svg',
    retryOnce = true
  } = options;
  
  if (target.tagName === 'IMG') {
    handleError(
      new Error(`Image failed to load: ${target.src}`),
      'Image loading',
      ErrorSeverity.LOW,
      ErrorCategory.RESOURCE
    );
    
    // Set fallback image if not already a fallback
    if (!target.src.includes('fallback') && !target.hasAttribute('data-no-fallback')) {
      target.src = fallbackImage;
      target.setAttribute('data-fallback-applied', 'true');
    }
  } else if (target.tagName === 'SCRIPT') {
    handleError(
      new Error(`Script failed to load: ${target.src}`),
      'Script loading',
      ErrorSeverity.HIGH,
      ErrorCategory.RESOURCE
    );
    
    // Retry once if enabled
    if (retryOnce && !target.hasAttribute('data-retry-attempted')) {
      target.setAttribute('data-retry-attempted', 'true');
      setTimeout(() => {
        const newScript = document.createElement('script');
        newScript.src = target.src;
        newScript.async = target.async;
        newScript.defer = target.defer;
        target.parentNode.replaceChild(newScript, target);
      }, 1000);
    }
  } else if (target.tagName === 'LINK' && target.rel === 'stylesheet') {
    handleError(
      new Error(`Stylesheet failed to load: ${target.href}`),
      'Stylesheet loading',
      ErrorSeverity.MEDIUM,
      ErrorCategory.RESOURCE
    );
  }
}

/**
 * Create a global error handler for unhandled errors
 * 
 * Sets up global error handling for unhandled JavaScript errors
 * and unhandled promise rejections.
 * 
 * @param {object} [options={}] - Configuration options
 * @param {boolean} [options.handlePromiseRejections=true] - Handle unhandled promise rejections
 * @param {boolean} [options.handleGlobalErrors=true] - Handle global JavaScript errors
 * @returns {Function} Cleanup function to remove handlers
 * @example
 * // Set up global error handling
 * const cleanup = setupGlobalErrorHandler();
 * 
 * @example
 * // Set up with custom options
 * const cleanup = setupGlobalErrorHandler({
 *   handlePromiseRejections: false
 * });
 * 
 * @since 1.0.0
 */
export function setupGlobalErrorHandler(options = {}) {
  const {
    handlePromiseRejections = true,
    handleGlobalErrors = true
  } = options;
  
  const cleanupFunctions = [];
  
  if (handleGlobalErrors && typeof window !== 'undefined') {
    const errorHandler = (event) => {
      handleError(
        new Error(event.message),
        `${event.filename}:${event.lineno}:${event.colno}`,
        ErrorSeverity.HIGH,
        ErrorCategory.RUNTIME
      );
    };
    
    window.addEventListener('error', errorHandler);
    cleanupFunctions.push(() => window.removeEventListener('error', errorHandler));
  }
  
  if (handlePromiseRejections && typeof window !== 'undefined') {
    const rejectionHandler = (event) => {
      handleError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'Unhandled Promise Rejection',
        ErrorSeverity.HIGH,
        ErrorCategory.RUNTIME
      );
    };
    
    window.addEventListener('unhandledrejection', rejectionHandler);
    cleanupFunctions.push(() => window.removeEventListener('unhandledrejection', rejectionHandler));
  }
  
  return function cleanup() {
    cleanupFunctions.forEach(fn => fn());
  };
}

/**
 * Report error to external service
 * 
 * @param {object} errorInfo - Error information object
 * @returns {void}
 * @example
 * reportError({ message: 'Error occurred', context: 'API call' });
 * 
 * @since 1.0.0
 */
function reportError(errorInfo) {
  // In a real application, this would send to an error reporting service
  // For now, we'll just store it locally for debugging
  try {
    const errors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
    errors.push(errorInfo);
    
    // Keep only the last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('nosytlabs_errors', JSON.stringify(errors));
  } catch (storageError) {
    console.warn('Could not store error for reporting:', storageError);
  }
}

/**
 * Store error for debugging purposes
 * 
 * @param {object} errorInfo - Error information object
 * @returns {void}
 * @example
 * storeErrorForDebugging({ message: 'Debug error', context: 'Testing' });
 * 
 * @since 1.0.0
 */
function storeErrorForDebugging(errorInfo) {
  if (typeof sessionStorage !== 'undefined') {
    try {
      const sessionErrors = JSON.parse(sessionStorage.getItem('nosytlabs_session_errors') || '[]');
      sessionErrors.push(errorInfo);
      
      // Keep only the last 20 errors in session
      if (sessionErrors.length > 20) {
        sessionErrors.splice(0, sessionErrors.length - 20);
      }
      
      sessionStorage.setItem('nosytlabs_session_errors', JSON.stringify(sessionErrors));
    } catch (storageError) {
      console.warn('Could not store error for debugging:', storageError);
    }
  }
}

/**
 * Get stored errors for debugging
 * 
 * Retrieves errors stored in localStorage and sessionStorage for debugging.
 * Useful for development and troubleshooting.
 * 
 * @returns {object} Object containing stored errors
 * @example
 * const { persistent, session } = getStoredErrors();
 * console.log('Recent errors:', session);
 * 
 * @since 1.0.0
 */
export function getStoredErrors() {
  const result = {
    persistent: [],
    session: []
  };
  
  try {
    if (typeof localStorage !== 'undefined') {
      result.persistent = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
    }
    
    if (typeof sessionStorage !== 'undefined') {
      result.session = JSON.parse(sessionStorage.getItem('nosytlabs_session_errors') || '[]');
    }
  } catch (error) {
    console.warn('Could not retrieve stored errors:', error);
  }
  
  return result;
}

/**
 * Clear stored errors
 * 
 * Clears all stored errors from localStorage and sessionStorage.
 * Useful for cleanup and testing.
 * 
 * @returns {void}
 * @example
 * clearStoredErrors();
 * 
 * @since 1.0.0
 */
export function clearStoredErrors() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('nosytlabs_errors');
    }
    
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('nosytlabs_session_errors');
    }
  } catch (error) {
    console.warn('Could not clear stored errors:', error);
  }
}
