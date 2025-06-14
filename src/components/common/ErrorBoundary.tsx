/**
 * Enhanced Error Boundary Component
 * Provides comprehensive error handling for React components
 * 
 * @fileoverview React Error Boundary with enhanced error reporting
 * @module components/common/ErrorBoundary
 * @version 1.0.0
 * @author NosytLabs Team
 */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AppError, ErrorReporter } from '@/utils/error-handling';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean; // Whether to isolate this boundary (don't propagate errors up)
  level?: 'page' | 'section' | 'component'; // Error boundary level for context
}

/**
 * Enhanced Error Boundary with comprehensive error handling
 * Features:
 * - Detailed error reporting
 * - Custom fallback UI
 * - Error recovery mechanisms
 * - Development vs production behavior
 * - Error context tracking
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private readonly errorReporter: ErrorReporter;
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };

    this.errorReporter = ErrorReporter.getInstance();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({ errorInfo });

    // Create enhanced error with context
    const enhancedError = new AppError(
      error.message,
      'COMPONENT_ERROR',
      'high',
      {
        componentStack: errorInfo.componentStack,
        errorBoundaryLevel: this.props.level || 'component',
        errorId: this.state.errorId,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        timestamp: new Date().toISOString(),
      }
    );

    // Report error
    this.errorReporter.reportError(enhancedError);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In development, log detailed error information
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', this.state.errorId);
      console.groupEnd();
    }

    // Don't propagate error if isolate is true
    if (this.props.isolate) {
      // Remove invalid stopPropagation call
    }
  }

  /**
   * Retry mechanism - resets error boundary state
   */
  private handleRetry = (): void => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };
  override componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  /**
   * Default error fallback UI
   */
  private renderDefaultFallback = (): ReactNode => {
    const { error, errorInfo, errorId } = this.state;
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
      <div className="min-h-[200px] flex items-center justify-center p-8 bg-red-50 border-2 border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-700/20">
        <div className="text-center max-w-md">
          {/* Error Icon */}
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Error Message */}
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-red-600 dark:text-red-300 mb-4">
            We're sorry, but there was an error loading this component. 
            Please try refreshing the page or contact support if the problem persists.
          </p>

          {/* Development Details */}
          {isDevelopment && error && (
            <details className="text-left bg-red-100 dark:bg-red-900/20 p-3 rounded border text-sm text-red-800 dark:text-red-200 mb-4">
              <summary className="cursor-pointer font-medium">Development Details</summary>
              <div className="mt-2 space-y-2">
                <div><strong>Error:</strong> {error.message}</div>
                <div><strong>Error ID:</strong> {errorId}</div>
                {errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="text-xs mt-1 p-2 bg-red-200 dark:bg-red-800 rounded overflow-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>

          {/* Error ID for Support */}
          {errorId && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Error ID: {errorId}
            </p>
          )}
        </div>
      </div>
    );
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleRetry);
      }

      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for adding error boundary to any component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for programmatic error throwing (useful for async errors)
 */
export function useErrorHandler() {
  return (error: Error, context?: Record<string, any>) => {
    const enhancedError = new AppError(
      error.message,
      'ASYNC_ERROR',
      'medium',
      context
    );

    // Report the error
    ErrorReporter.getInstance().reportError(enhancedError);

    // Re-throw to trigger error boundary
    throw enhancedError;
  };
}

export default ErrorBoundary;
