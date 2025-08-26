import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
  stage?: string;
}

export interface UseLoadingStateOptions {
  initialLoading?: boolean;
  timeout?: number;
  onTimeout?: () => void;
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const {
    initialLoading = false,
    timeout,
    onTimeout,
    onError,
    onSuccess,
  } = options;

  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startLoading = useCallback((stage?: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    const newState: LoadingState = {
      isLoading: true,
      error: null,
      progress: 0,
    };
    if (stage) {
      newState.stage = stage;
    }
    setState(newState);

    // Set timeout if specified
    if (timeout) {
      timeoutRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Operation timed out',
        }));
        onTimeout?.();
      }, timeout);
    }
  }, [timeout, onTimeout]);

  const updateProgress = useCallback((progress: number, stage?: string) => {
    setState(prev => {
      const newState: LoadingState = {
        ...prev,
        progress: Math.max(0, Math.min(100, progress)),
      };
      const finalStage = stage || prev.stage;
      if (finalStage !== undefined) {
        newState.stage = finalStage;
      }
      return newState;
    });
  }, []);

  const setError = useCallback((error: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => {
      const newState: LoadingState = {
        ...prev,
        isLoading: false,
        error,
      };
      // Don't explicitly set undefined for optional properties
      delete (newState as any).progress;
      delete (newState as any).stage;
      return newState;
    });

    onError?.(error);
  }, [onError]);

  const setSuccess = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState({
      isLoading: false,
      error: null,
      progress: 100,
      stage: 'completed',
    });

    onSuccess?.();

    // Clear success state after a brief moment
    setTimeout(() => {
      setState(prev => {
        const newState: LoadingState = { ...prev };
        // Don't explicitly set undefined for optional properties
        delete (newState as any).progress;
        delete (newState as any).stage;
        return newState;
      });
    }, 1000);
  }, [onSuccess]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => {
      const newState: LoadingState = {
        ...prev,
        isLoading: false,
        error: null,
      };
      // Don't explicitly set undefined for optional properties
      delete (newState as any).progress;
      delete (newState as any).stage;
      return newState;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    startLoading,
    updateProgress,
    setError,
    setSuccess,
    reset,
    abortController: abortControllerRef.current,
  };
}

// Hook for async operations with automatic loading state management
export function useAsyncOperation<T = any>(
  operation: (abortSignal?: AbortSignal) => Promise<T>,
  options: UseLoadingStateOptions = {}
) {
  const loadingState = useLoadingState(options);

  const execute = useCallback(async (): Promise<T | null> => {
    try {
      loadingState.startLoading();
      const result = await operation(loadingState.abortController?.signal);
      loadingState.setSuccess();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          loadingState.reset();
          return null;
        }
        loadingState.setError(error.message);
      } else {
        loadingState.setError('An unknown error occurred');
      }
      return null;
    }
  }, [operation, loadingState]);

  return {
    ...loadingState,
    execute,
  };
}

// Hook for multi-step operations
export function useMultiStepLoading(steps: string[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const loadingState = useLoadingState();

  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (next < steps.length) {
      setCurrentStep(next);
      loadingState.updateProgress(
        (next / steps.length) * 100,
        steps[next]
      );
    } else {
      loadingState.setSuccess();
    }
  }, [currentStep, steps, loadingState]);

  const start = useCallback(() => {
    setCurrentStep(0);
    loadingState.startLoading(steps[0]);
  }, [steps, loadingState]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    loadingState.reset();
  }, [loadingState]);

  return {
    ...loadingState,
    currentStep,
    totalSteps: steps.length,
    currentStepName: steps[currentStep],
    nextStep,
    start,
    reset,
  };
}