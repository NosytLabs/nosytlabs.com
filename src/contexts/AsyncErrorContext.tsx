import { createContext, useContext } from 'react';
import type { AppError } from '../utils/error-handling';

interface AsyncErrorContextType {
  onError: (error: Error | AppError) => void;
  setPending: (pending: boolean) => void;
  resetError: () => void;
}

export const AsyncErrorContext = createContext<AsyncErrorContextType | undefined>(undefined);

export const useAsyncErrorContext = () => {
  const context = useContext(AsyncErrorContext);
  if (context === undefined) {
    throw new Error('useAsyncErrorContext must be used within an AsyncErrorBoundary');
  }
  return context;
};
