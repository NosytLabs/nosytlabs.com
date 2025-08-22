/**
 * Unified Error Handling System
 * Consolidates all error handling components into a comprehensive solution
 * Replaces: ErrorBoundary.tsx, AsyncErrorBoundary.tsx, NetworkErrorHandler.tsx, withErrorHandling.tsx
 */

import React, { Component, useState, useEffect } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ErrorType } from '../../utils/error-handling';
import ErrorFallback from './ErrorFallback';
import LoadingFallback from '../ui/LoadingFallback';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface UnifiedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((_error: Error, _resetError: () => void) => ReactNode);
  onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
  enableAsyncErrorHandling?: boolean;
  enableNetworkErrorHandling?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface NetworkErrorHandlerProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  onRetry?: () => void;
  checkInterval?: number;
}

interface WithErrorHandlingOptions {
  fallback?: ReactNode | ((_error: Error, _resetError: () => void) => ReactNode);
  errorComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
  enableAsyncErrorHandling?: boolean;
  enableNetworkErrorHandling?: boolean;
}

// ============================================================================
// UNIFIED ERROR BOUNDARY CLASS COMPONENT
// ============================================================================

class UnifiedErrorBoundary extends Component<UnifiedErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private asyncErrorHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(props: UnifiedErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    };
  }

  private generateErrorId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error('UnifiedErrorBoundary caught an error:', error, errorInfo);
  }

  override componentDidMount() {
    // Set up async error handling if enabled
    if (this.props.enableAsyncErrorHandling) {
      this.setupAsyncErrorHandling();
    }
  }

  override componentWillUnmount() {
    // Clean up async error handling
    if (this.asyncErrorHandler) {
      window.removeEventListener('unhandledrejection', this.asyncErrorHandler);
    }

    // Clear any pending reset timeout
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  override componentDidUpdate(prevProps: UnifiedErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error state if resetKeys have changed
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    // Reset error state if any props have changed (when resetOnPropsChange is true)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  private setupAsyncErrorHandling = () => {
    this.asyncErrorHandler = (_event: PromiseRejectionEvent) => {
      // Convert unhandled promise rejection to error boundary error
      const error = new Error(_event.reason?.message || 'Unhandled promise rejection');
      error.name = 'AsyncError';
      error.stack = _event.reason?.stack;

      this.setState({
        hasError: true,
        error,
        errorInfo: {
          componentStack: 'Async operation',
        } as ErrorInfo,
        errorId: this.generateErrorId(),
      });

      // Prevent the default browser behavior
      _event.preventDefault();
    };

    window.addEventListener('unhandledrejection', this.asyncErrorHandler);
  };

  private resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
    });
  };

  private handleRetry = () => {
    this.resetErrorBoundary();
  };

  private detectErrorType(error: Error): ErrorType {
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      return ErrorType.FILE_SYSTEM;
    }
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return ErrorType.NETWORK;
    }
    if (error.name === 'AsyncError') {
      return ErrorType.SERVER;
    }
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return ErrorType.TIMEOUT;
    }
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return ErrorType.AUTHENTICATION;
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return ErrorType.AUTHORIZATION;
    }
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      return ErrorType.NOT_FOUND;
    }
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return ErrorType.SERVER;
    }
    return ErrorType.UNKNOWN;
  }

  override render() {
    const { hasError, error } = this.state;
    const { children, fallback, level = 'component', isolate = false } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error, this.handleRetry);
        }
        return fallback;
      }

      // Default error fallback with appropriate error type detection
      const errorType = this.detectErrorType(error);

      return (
        <div className={isolate ? 'error-boundary-isolated' : ''}>
          <ErrorFallback
            error={error}
            errorType={errorType}
            onRetry={this.handleRetry}
            className={`error-boundary-${level}`}
          />
        </div>
      );
    }

    return children;
  }
}

// ============================================================================
// NETWORK ERROR HANDLER COMPONENT
// ============================================================================

/**
 * Component for handling network-related errors and offline states
 */
const NetworkErrorHandler: React.FC<NetworkErrorHandlerProps> = ({
  children,
  fallback,
  loadingFallback = <LoadingFallback />,
  onRetry,
  checkInterval = 5000,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onRetry) {
        onRetry();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    return undefined;
  }, [onRetry]);

  // Periodic connection check when offline
  useEffect(() => {
    if (!isOnline && checkInterval > 0) {
      const interval = setInterval(() => {
        checkConnection();
      }, checkInterval);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isOnline, checkInterval]);

  const checkConnection = async () => {
    if (isChecking) return;

    setIsChecking(true);

    try {
      // Attempt to fetch a small resource to verify connection
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (response.ok) {
        setIsOnline(true);
        if (onRetry) {
          onRetry();
        }
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOnline) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <ErrorFallback
        errorType={ErrorType.NETWORK}
        title="You're offline"
        message="Please check your internet connection and try again."
        onRetry={checkConnection}
        showRetry={true}
      />
    );
  }

  if (isChecking) {
    return <>{loadingFallback}</>;
  }

  return <>{children}</>;
};

// ============================================================================
// HIGHER-ORDER COMPONENT (HOC)
// ============================================================================

/**
 * Higher-Order Component (HOC) that wraps a component with unified error handling
 */
function withUnifiedErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
  options: WithErrorHandlingOptions = {}
): React.FC<P> {
  const {
    fallback,
    errorComponent: ErrorComponent,
    onError,
    isolate = false,
    level = 'component',
    enableAsyncErrorHandling = false,
    enableNetworkErrorHandling = false,
  } = options;

  const WithUnifiedErrorHandling: React.FC<P> = props => {
    const errorBoundaryProps: UnifiedErrorBoundaryProps = {
      children: <Component {...props} />,
      isolate,
      level,
      enableAsyncErrorHandling,
      onError: onError || (() => {}),
    };

    // Add custom fallback if provided
    if (ErrorComponent) {
      errorBoundaryProps.fallback = (error, resetError) => (
        <ErrorComponent error={error} resetError={resetError} />
      );
    } else if (fallback) {
      errorBoundaryProps.fallback = fallback;
    }

    let wrappedComponent = <UnifiedErrorBoundary {...errorBoundaryProps} />;

    // Wrap with network error handler if enabled
    if (enableNetworkErrorHandling) {
      wrappedComponent = <NetworkErrorHandler>{wrappedComponent}</NetworkErrorHandler>;
    }

    return wrappedComponent;
  };

  // Set display name for better debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithUnifiedErrorHandling.displayName = `withUnifiedErrorHandling(${displayName})`;

  return WithUnifiedErrorHandling;
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Hook for handling async errors in functional components
 */
const useAsyncError = () => {
  const [, setError] = useState();

  return (error: Error) => {
    setError(() => {
      throw error;
    });
  };
};

/**
 * Hook for network status monitoring
 */
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  return isOnline;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default UnifiedErrorBoundary;

// Main exports

// Export the main components and hooks
export {
  UnifiedErrorBoundary,
  NetworkErrorHandler,
  withUnifiedErrorHandling,
  useNetworkStatus,
  useAsyncError,
};

// Export types
export type { UnifiedErrorBoundaryProps, ErrorBoundaryState, WithErrorHandlingOptions };
