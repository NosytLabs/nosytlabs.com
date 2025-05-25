/**
 * Error Boundary Component for React components
 * Catches JavaScript errors anywhere in the child component tree
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  reportError = (error, errorInfo) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorId: this.state.errorId
    };

    // Store error locally for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
      errors.push(errorReport);
      
      // Keep only last 10 errors
      if (errors.length > 10) {
        errors.splice(0, errors.length - 10);
      }
      
      localStorage.setItem('nosytlabs_errors', JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }

    // Send to error reporting service (if available)
    if (this.props.onError) {
      this.props.onError(errorReport);
    }

    // Send to analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">
              <svg 
                className="w-16 h-16 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            
            <h2 className="error-boundary-title">
              Oops! Something went wrong
            </h2>
            
            <p className="error-boundary-message">
              {this.props.message || 
               "We're sorry, but something unexpected happened. Please try again."}
            </p>

            {this.props.showDetails && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details</summary>
                <div className="error-boundary-error-info">
                  <p><strong>Error:</strong> {this.state.error.message}</p>
                  <p><strong>Error ID:</strong> {this.state.errorId}</p>
                  {this.props.showStack && (
                    <pre className="error-boundary-stack">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button 
                onClick={this.handleRetry}
                className="error-boundary-button error-boundary-button-primary"
              >
                Try Again
              </button>
              
              <button 
                onClick={this.handleReload}
                className="error-boundary-button error-boundary-button-secondary"
              >
                Reload Page
              </button>

              {this.props.showReport && (
                <button 
                  onClick={() => this.props.onReport?.(this.state.error)}
                  className="error-boundary-button error-boundary-button-outline"
                >
                  Report Issue
                </button>
              )}
            </div>

            {this.props.showContact && (
              <p className="error-boundary-contact">
                If this problem persists, please{' '}
                <a href="/contact" className="error-boundary-link">
                  contact our support team
                </a>
                {' '}with error ID: <code>{this.state.errorId}</code>
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary(Component, errorBoundaryProps = {}) {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting in functional components
export function useErrorHandler() {
  const reportError = React.useCallback((error, errorInfo = {}) => {
    const errorReport = {
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...errorInfo
    };

    console.error('Error reported:', errorReport);

    // Store locally
    try {
      const errors = JSON.parse(localStorage.getItem('nosytlabs_errors') || '[]');
      errors.push(errorReport);
      localStorage.setItem('nosytlabs_errors', JSON.stringify(errors));
    } catch (e) {
      console.warn('Failed to store error:', e);
    }

    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message || String(error),
        fatal: false
      });
    }
  }, []);

  return { reportError };
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
  }

  handlePromiseRejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Report the error
    const errorReport = {
      type: 'unhandledrejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    if (this.props.onAsyncError) {
      this.props.onAsyncError(errorReport);
    }

    // Prevent the default browser behavior
    if (this.props.preventDefault) {
      event.preventDefault();
    }
  };

  componentDidCatch(error, errorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="async-error-boundary">
          <p>Something went wrong with an asynchronous operation.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
