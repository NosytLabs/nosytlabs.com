import React from 'react';
import { ErrorType } from '../../utils/error-handling';

interface ErrorFallbackProps {
  error?: Error;
  errorType?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

/**
 * ErrorFallback component for displaying user-friendly error messages
 *
 * Features:
 * - Customizable error messages and titles
 * - Support for different error types with appropriate styling
 * - Optional retry button
 * - Responsive design
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorType = ErrorType.UNKNOWN,
  title,
  message,
  onRetry,
  showRetry = true,
  className = '',
}) => {
  // Determine error details based on provided props or error object
  const errorTitle = title || getDefaultErrorTitle(errorType, error);
  const errorMessage = message || getDefaultErrorMessage(errorType, error);

  // Determine appropriate styling based on error type
  const { containerClasses, iconClasses } = getErrorStyling(errorType);

  return (
    <div className={`p-4 rounded-lg ${containerClasses} ${className}`}>
      <div className="flex items-center mb-2">
        {getErrorIcon(errorType, iconClasses)}
        <h3 className="text-sm font-medium">{errorTitle}</h3>
      </div>
      <div className="text-sm">
        <p>{errorMessage}</p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-3 py-1 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-background-muted hover:bg-background-hover text-text"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// Helper functions for error styling and messages
function getErrorStyling(errorType: ErrorType): { containerClasses: string; iconClasses: string } {
  switch (errorType) {
    case ErrorType.NETWORK:
    case ErrorType.TIMEOUT:
      return {
        containerClasses: 'bg-warning-light border border-warning text-warning-dark',
        iconClasses: 'text-warning',
      };
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      return {
        containerClasses: 'bg-secondary-light border border-secondary text-secondary-dark',
        iconClasses: 'text-warning',
      };
    case ErrorType.NOT_FOUND:
      return {
        containerClasses: 'bg-info-light border border-info text-info-dark',
        iconClasses: 'text-info',
      };
    case ErrorType.SERVER:
      return {
        containerClasses: 'bg-critical-light border border-critical text-critical-dark',
        iconClasses: 'text-critical',
      };
    default:
      return {
        containerClasses: 'bg-background-muted border border-border text-text',
        iconClasses: 'text-text-muted',
      };
  }
}

function getErrorIcon(errorType: ErrorType, className: string): React.ReactNode {
  // Different icon based on error type
  switch (errorType) {
    case ErrorType.NETWORK:
    case ErrorType.TIMEOUT:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className} mr-2`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    case ErrorType.NOT_FOUND:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className} mr-2`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          />
        </svg>
      );
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className} mr-2`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${className} mr-2`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
}

function getDefaultErrorTitle(errorType: ErrorType, error?: Error): string {
  switch (errorType) {
    case ErrorType.NETWORK:
      return 'Network Error';
    case ErrorType.API:
      return 'API Error';
    case ErrorType.VALIDATION:
      return 'Validation Error';
    case ErrorType.AUTHENTICATION:
      return 'Authentication Error';
    case ErrorType.AUTHORIZATION:
      return 'Authorization Error';
    case ErrorType.NOT_FOUND:
      return 'Not Found';
    case ErrorType.TIMEOUT:
      return 'Request Timeout';
    case ErrorType.SERVER:
      return 'Server Error';
    default:
      return error?.name || 'Something went wrong';
  }
}

function getDefaultErrorMessage(errorType: ErrorType, error?: Error): string {
  switch (errorType) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    case ErrorType.API:
      return 'There was a problem with the API request. Please try again later.';
    case ErrorType.VALIDATION:
      return 'The submitted data contains errors. Please check your input and try again.';
    case ErrorType.AUTHENTICATION:
      return 'You need to be logged in to access this feature.';
    case ErrorType.AUTHORIZATION:
      return "You don't have permission to access this resource.";
    case ErrorType.NOT_FOUND:
      return 'The requested resource could not be found.';
    case ErrorType.TIMEOUT:
      return 'The request took too long to complete. Please try again later.';
    case ErrorType.SERVER:
      return 'The server encountered an error. Our team has been notified and is working on a fix.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again later.';
  }
}

export default ErrorFallback;
