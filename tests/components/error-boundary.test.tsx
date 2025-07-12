// ErrorBoundary component was removed from the codebase
// Commenting out this test file to prevent TypeScript errors

/*
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, withErrorBoundary, useErrorHandler } from '@/components/utils/ErrorBoundary';

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllMocks();
});

// Test component that throws an error
const ThrowingComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working component</div>;
};

// Test component for error boundary
const TestComponent: React.FC = () => <div>Test content</div>;

describe('ErrorBoundary', () => {
  describe('Basic Error Handling', () => {
    it('should render children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });

    it('should render fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('should call onError callback when error occurs', () => {
      const onErrorSpy = vi.fn();
      
      render(
        <ErrorBoundary onError={onErrorSpy}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });

    it('should render custom fallback when provided', () => {
      const customFallback = (error: Error, errorInfo: any, retry: () => void) => (
        <div>
          <h2>Custom Error</h2>
          <p>Error: {error.message}</p>
          <button onClick={retry}>Retry</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should reset error state when retry is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /try again/i });
      retryButton.click();

      // Rerender with non-throwing component
      rerender(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('Error Categories', () => {
    it('should handle different error types appropriately', () => {
      const networkError = new Error('Network error');
      networkError.name = 'NetworkError';

      const NetworkThrowingComponent = () => {
        throw networkError;
      };

      render(
        <ErrorBoundary>
          <NetworkThrowingComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  describe('Performance and Memory', () => {
    it('should not cause memory leaks with multiple errors', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Simulate multiple error/recovery cycles
      for (let i = 0; i < 5; i++) {
        rerender(
          <ErrorBoundary>
            <ThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        );

        rerender(
          <ErrorBoundary>
            <ThrowingComponent shouldThrow={false} />
          </ErrorBoundary>
        );
      }

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });
});

describe('withErrorBoundary HOC', () => {
  it('should wrap component with error boundary', () => {
    const WrappedComponent = withErrorBoundary(TestComponent);
    
    render(<WrappedComponent />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should handle errors in wrapped component', () => {
    const WrappedThrowingComponent = withErrorBoundary(
      () => <ThrowingComponent shouldThrow={true} />
    );
    
    render(<WrappedThrowingComponent />);
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('should accept custom error boundary options', () => {
    const onError = vi.fn();
    const WrappedComponent = withErrorBoundary(TestComponent, {
      onError,
      fallback: () => <div>Custom HOC Error</div>
    });
    
    render(<WrappedComponent />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});

describe('useErrorHandler hook', () => {
  it('should provide error handling utilities', () => {
    let errorHandler: any;
    
    const TestComponent = () => {
      errorHandler = useErrorHandler();
      return <div>Test</div>;
    };
    
    render(<TestComponent />);
    
    expect(errorHandler).toBeDefined();
    expect(typeof errorHandler.reportError).toBe('function');
    expect(typeof errorHandler.clearError).toBe('function');
  });

  it('should handle async errors', async () => {
    let errorHandler: any;
    
    const TestComponent = () => {
      errorHandler = useErrorHandler();
      return <div>Test</div>;
    };
    
    render(<TestComponent />);
    
    // Test async error handling
    const asyncError = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Async error')), 0);
    });
    
    errorHandler.handleAsync(asyncError);
    
    // Verify error is handled (would need more sophisticated testing for full async behavior)
    expect(errorHandler).toBeDefined();
  });
});

describe('ErrorBoundary Accessibility', () => {
  it('should have proper ARIA attributes in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveAttribute('aria-live', 'polite');
  });

  it('should support keyboard navigation in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    
    // Test keyboard accessibility
    retryButton.focus();
    expect(document.activeElement).toBe(retryButton);
  });
});

describe('ErrorBoundary Integration', () => {
  it('should work with React Suspense boundaries', () => {
    const SuspenseComponent = () => (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      </React.Suspense>
    );

    render(<SuspenseComponent />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should handle errors during component lifecycle methods', () => {
    class LifecycleErrorComponent extends React.Component {
      override componentDidMount() {
        throw new Error('Lifecycle error');
      }

      override render() {
        return <div>Should not render</div>;
      }
    }

    render(
      <ErrorBoundary>
        <LifecycleErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
*/
