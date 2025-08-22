/**
 * Error handling components export file
 * This file exports all error-related components for easy importing
 */

// Error handling components - unified system
export { default as UnifiedErrorSystem } from './UnifiedErrorSystem';
export { default as ErrorFallback } from './ErrorFallback';

// Import the actual components for re-export
export {
  UnifiedErrorBoundary,
  NetworkErrorHandler,
  withUnifiedErrorHandling,
  useNetworkStatus,
} from './UnifiedErrorSystem';

/**
 * Error handling utilities and components
 * 
 * This module provides:
 * - Error boundary components for React
 * - Error fallback UI components
 * - Error logging and reporting utilities
 * - Type-safe error handling patterns
 * - Integration with monitoring services
 */

// Re-export hooks from UnifiedErrorSystem
export { useAsyncError } from './UnifiedErrorSystem';

// Re-export types and utilities from error handling
export {
  AppError,
  ErrorFactory,
  ErrorType,
  ErrorSeverity,
  handleNetworkError,
  fetchWithErrorHandling,
  timeoutPromise,
  fetchWithTimeout,
  ErrorRecovery,
  setupGlobalErrorHandlers,
  createErrorBoundary,
} from '../../utils/error-handling';
