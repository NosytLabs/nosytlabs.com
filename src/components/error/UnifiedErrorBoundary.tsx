/**
 * Unified Error Boundary Component
 * Consolidates all React error boundary implementations
 * Replaces: UnifiedErrorSystem.tsx and other error boundary components
 */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { toast } from 'sonner';
import { AppError, ErrorType, ErrorSeverity } from '../../utils/error-handling';

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
  isRecovering: boolean;
}

/**
 * Error boundary props interface
 */
interface UnifiedErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  showErrorDetails?: boolean;
  level?: 'page' | 'component' | 'section';
  name?: string;
}

/**
 * Error display component props
 */
interface ErrorDisplayProps {
  error: Error;
  errorInfo: ErrorInfo;
  errorId: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onGoHome: () => void;
  onReportError: () => void;
  showDetails: boolean;
  level: 'page' | 'component' | 'section';
  name?: string;
}

/**
 * Error display component
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  errorInfo,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onGoHome,
  onReportError,
  showDetails,
  level,
  name,
}) => {
  const canRetry = retryCount < maxRetries;
  const isPageLevel = level === 'page';
  const isComponentLevel = level === 'component';

  const getErrorTitle = () => {
    if (isPageLevel) return 'Something went wrong';
    if (isComponentLevel) return `${name || 'Component'} Error`;
    return 'Section Error';
  };

  const getErrorMessage = () => {
    if (error instanceof AppError) {
      return error.userMessage;
    }
    
    if (isPageLevel) {
      return 'We encountered an unexpected error. Please try refreshing the page.';
    }
    
    return 'This section encountered an error and could not be displayed.';
  };

  const containerClasses = {
    page: 'min-h-screen flex items-center justify-center bg-gray-50 px-4',
    component: 'w-full p-8 bg-red-50 border border-red-200 rounded-lg',
    section: 'w-full p-4 bg-red-50 border border-red-200 rounded-md',
  };

  const iconSizes = {
    page: 'h-16 w-16',
    component: 'h-12 w-12',
    section: 'h-8 w-8',
  };

  const titleSizes = {
    page: 'text-3xl',
    component: 'text-xl',
    section: 'text-lg',
  };

  return (
    <div className={containerClasses[level]}>
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <AlertTriangle className={`${iconSizes[level]} text-red-500`} />
        </div>
        
        <h1 className={`${titleSizes[level]} font-bold text-gray-900 mb-2`}>
          {getErrorTitle()}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {errorId && (
          <p className="text-sm text-gray-500 mb-4">
            Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{errorId}</code>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {canRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again {retryCount > 0 && `(${maxRetries - retryCount} left)`}
            </button>
          )}
          
          {isPageLevel && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </button>
          )}
          
          <button
            onClick={onReportError}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Bug className="h-4 w-4 mr-2" />
            Report Issue
          </button>
        </div>

        {showDetails && process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <div className="bg-gray-100 p-4 rounded-md text-xs overflow-auto">
              <div className="mb-4">
                <strong>Error:</strong>
                <pre className="mt-1 whitespace-pre-wrap">{error.message}</pre>
              </div>
              
              <div className="mb-4">
                <strong>Stack Trace:</strong>
                <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
              </div>
              
              {errorInfo.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="mt-1 whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

/**
 * Unified Error Boundary Component
 */
export class UnifiedErrorBoundary extends Component<UnifiedErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info
    this.setState({ errorInfo });

    // Create unified error for logging
    const unifiedError = new UnifiedAppError({
      message: `React Error Boundary: ${error.message}`,
      type: UnifiedErrorType.INTERNAL_ERROR,
      originalError: error,
      context: {
        additionalData: {
          componentStack: errorInfo.componentStack,
          errorBoundary: this.props.name || 'UnifiedErrorBoundary',
          retryCount: this.state.retryCount,
        },
      },
    });

    // Log error
    console.error('Error Boundary caught an error:', unifiedError.toJSON());

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show toast notification for component-level errors
    if (this.props.level !== 'page') {
      toast.error('Component Error', {
        description: 'A component encountered an error and has been reset.',
        duration: 5000,
      });
    }

    // Report error to monitoring service (if available)
    this.reportError(unifiedError);
  }

  override componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportError = (error: UnifiedAppError) => {
    // In a real application, you would send this to your monitoring service
    // For now, we'll just log it
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // monitoringService.captureException(error);
      console.error('Production Error:', error.toJSON());
    }
  };

  /**
   * Retry handler
   */
  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      toast.error('Maximum retries reached', {
        description: 'Please refresh the page or contact support.',
      });
      return;
    }

    this.setState({ isRecovering: true });

    // Add a small delay before retrying to prevent immediate re-errors
    this.retryTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: this.state.retryCount + 1,
        isRecovering: false,
      });

      toast.success('Retrying...', {
        description: 'Attempting to recover from the error.',
      });
    }, 1000);
  };

  /**
   * Go home handler
   */
  private handleGoHome = () => {
    window.location.href = '/';
  };

  /**
   * Report error handler
   */
  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (!error || !errorInfo) return;

    // Create error report
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // In a real application, you would send this to your error reporting service
    console.log('Error Report:', errorReport);
    
    // Copy error ID to clipboard for user
    if (navigator.clipboard && errorId) {
      navigator.clipboard.writeText(errorId).then(() => {
        toast.success('Error ID copied to clipboard', {
          description: 'Please include this ID when reporting the issue.',
        });
      });
    }

    toast.info('Error reported', {
      description: 'Thank you for reporting this issue. We will investigate it.',
    });
  };

  override render() {
    const {
      children,
      fallback,
      enableRetry = true,
      maxRetries = 3,
      showErrorDetails = false,
      level = 'component',
      name,
    } = this.props;

    const { hasError, error, errorInfo, errorId, retryCount, isRecovering } = this.state;

    if (isRecovering) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600">Recovering...</p>
          </div>
        </div>
      );
    }

    if (hasError && error && errorInfo && errorId) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleRetry);
      }

      // Use default error display
      return (
        <ErrorDisplay
          error={error}
          errorInfo={errorInfo}
          errorId={errorId}
          retryCount={retryCount}
          maxRetries={maxRetries}
          onRetry={enableRetry ? this.handleRetry : () => {}}
          onGoHome={this.handleGoHome}
          onReportError={this.handleReportError}
          showDetails={showErrorDetails}
          level={level}
          {...(name !== undefined && { name })}
        />
      );
    }

    return children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<UnifiedErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <UnifiedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </UnifiedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for handling async errors in functional components
 */
export function useAsyncError() {
  const [, setError] = React.useState();
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
}

/**
 * Network error handler component
 */
interface NetworkErrorHandlerProps {
  children: ReactNode;
  onNetworkError?: (error: Error) => void;
}

export const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  children,
  onNetworkError,
}) => {
  React.useEffect(() => {
    const handleOnline = () => {
      toast.success('Connection restored', {
        description: 'You are back online.',
      });
    };

    const handleOffline = () => {
      toast.error('Connection lost', {
        description: 'Please check your internet connection.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleError = React.useCallback(
    (error: Error) => {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        const networkError = new UnifiedAppError({
          message: 'Network error occurred',
          type: UnifiedErrorType.NETWORK,
          originalError: error,
        });

        if (onNetworkError) {
          onNetworkError(networkError);
        }

        toast.error('Network Error', {
          description: 'Please check your connection and try again.',
        });
      }
    },
    [onNetworkError]
  );

  return (
    <UnifiedErrorBoundary
      level="component"
      name="NetworkErrorHandler"
      onError={handleError}
    >
      {children}
    </UnifiedErrorBoundary>
  );
};

/**
 * Export default error boundary
 */
export default UnifiedErrorBoundary;