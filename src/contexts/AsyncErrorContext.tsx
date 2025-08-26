import { createContext, useContext } from 'react';
import type { UnifiedAppError } from '../utils/unified-error-handler';

interface AsyncErrorContextType {
  onError: (error: Error | UnifiedAppError) => void;
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
