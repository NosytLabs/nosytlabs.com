/**
 * Error Handling Module
 *
 * Unified error handling system for tracking and managing errors
 * with proper logging and reporting.
 *
 * @module error-handling
 */

// Export error handler
export * from "./error-handler";

// Re-export commonly used utilities for convenience
export {
  ErrorHandler,
  trackError,
  safeJsonParse,
  safeAsync,
  withErrorTracking,
  type ErrorContext,
  type ErrorReport,
  type ErrorSeverity,
} from "./error-handler";
