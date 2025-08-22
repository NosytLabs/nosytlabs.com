import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { AppError, ErrorType } from '../utils/error-handling';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

interface UseAsyncErrorOptions {
  onError?: (error: AppError) => void;
  onSuccess?: <T>(data: T) => void;
  resetOnRetry?: boolean;
}

/**
 * Hook for handling asynchronous operations with proper error handling
 *
 * Features:
 * - Tracks loading, error, and data states
 * - Provides error handling for async operations
 * - Supports retry functionality
 * - Integrates with the logger system
 */
export function useAsyncError<T>(asyncFn: () => Promise<T>, options: UseAsyncErrorOptions = {}) {
  const { onError, onSuccess, resetOnRetry = true } = options;
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    if (resetOnRetry) {
      setState({ data: null, loading: true, error: null });
    } else {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      let appError: AppError;

      if (error instanceof AppError) {
        appError = error;
      } else {
        appError = new AppError({
          message: (error as Error)?.message || 'An unknown error occurred',
          type: ErrorType.UNKNOWN,
          originalError: error as Error
        });
      }

      logger.error('Async operation failed', {
        error: appError.originalError || appError,
        context: 'AsyncError'
      });
      setState({ data: null, loading: false, error: appError });

      if (onError) {
        onError(appError);
      }

      return null;
    }
  }, [asyncFn, onError, onSuccess, resetOnRetry]);

  const retry = useCallback(() => {
    return execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
  };
}

export default useAsyncError;
