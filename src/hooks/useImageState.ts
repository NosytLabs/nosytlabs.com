/**
 * Image State Management Hook
 * Extracted from UnifiedImageComponent for better modularity
 * Handles image loading states, format detection, and retry logic
 */

import { useState, useEffect, useRef } from 'react';
import { supportsWebP, supportsAVIF } from '../utils/unified-image-utils';
import { logger } from '../utils/logger';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  currentSrc: string;
  retryCount: number;
  formatSupport: {
    webp: boolean | null;
    avif: boolean | null;
  };
}

export interface UseImageStateOptions {
  src: string;
  formats?: string[] | 'auto';
  retryAttempts?: number;
  retryDelay?: number;
  debug?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoadStart?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export interface UseImageStateReturn {
  state: ImageState;
  handlers: {
    handleLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    handleError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    handleLoadStart: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    retry: () => void;
  };
  utils: {
    canRetry: boolean;
    isFormatDetectionComplete: boolean;
  };
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useImageState = ({
  src,
  formats = 'auto',
  retryAttempts = 3,
  retryDelay = 1000,
  debug = false,
  onLoad,
  onError,
  onLoadStart,
}: UseImageStateOptions): UseImageStateReturn => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [state, setState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    currentSrc: src,
    retryCount: 0,
    formatSupport: {
      webp: null,
      avif: null,
    },
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // FORMAT DETECTION
  // ============================================================================

  useEffect(() => {
    const detectFormatSupport = async () => {
      if (formats === 'auto') {
        try {
          const [webpSupported, avifSupported] = await Promise.all([
            supportsWebP(),
            supportsAVIF(),
          ]);

          setState(prev => ({
            ...prev,
            formatSupport: {
              webp: webpSupported,
              avif: avifSupported,
            },
          }));

          if (debug) {
            logger.info(
              `Format support detected - WebP: ${webpSupported}, AVIF: ${avifSupported}`,
              'useImageState'
            );
          }
        } catch (_error) {
          logger.warn('Failed to detect format support', 'useImageState');
          // Set fallback values
          setState(prev => ({
            ...prev,
            formatSupport: {
              webp: false,
              avif: false,
            },
          }));
        }
      }
    };

    detectFormatSupport();
  }, [formats, debug]);

  // ============================================================================
  // SOURCE UPDATES
  // ============================================================================

  useEffect(() => {
    setState(prev => ({
      ...prev,
      currentSrc: src,
      isLoading: true,
      hasError: false,
      retryCount: 0,
    }));
  }, [src]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      hasError: false,
    }));

    if (debug) {
      logger.info(`Image loaded successfully: ${state.currentSrc}`, 'useImageState');
    }

    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      hasError: true,
    }));

    if (debug) {
      logger.error(`Image failed to load: ${state.currentSrc}`, undefined, 'useImageState');
    }

    onError?.(event);
  };

  const handleLoadStart = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
    }));

    if (debug) {
      logger.info(`Image load started: ${state.currentSrc}`, 'useImageState');
    }

    onLoadStart?.(event);
  };

  // ============================================================================
  // RETRY LOGIC
  // ============================================================================

  const retry = () => {
    if (state.retryCount >= retryAttempts) {
      if (debug) {
        logger.warn(`Max retry attempts reached for: ${state.currentSrc}`, 'useImageState');
      }
      return;
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      isLoading: true,
      hasError: false,
    }));

    if (debug) {
      logger.info(
        `Retrying image load (attempt ${state.retryCount + 1}): ${state.currentSrc}`,
        'useImageState'
      );
    }

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Set retry delay
    retryTimeoutRef.current = setTimeout(() => {
      // Force re-render by updating a timestamp or similar
      setState(prev => ({ ...prev }));
    }, retryDelay);
  };

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const canRetry = state.retryCount < retryAttempts && state.hasError;
  const isFormatDetectionComplete =
    formats !== 'auto' || (state.formatSupport.webp !== null && state.formatSupport.avif !== null);

  return {
    state,
    handlers: {
      handleLoad,
      handleError,
      handleLoadStart,
      retry,
    },
    utils: {
      canRetry,
      isFormatDetectionComplete,
    },
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Helper function to get format support status
 */
export const getFormatSupport = (state: ImageState) => {
  return {
    supportsWebP: state.formatSupport.webp === true,
    supportsAVIF: state.formatSupport.avif === true,
    isDetectionComplete: state.formatSupport.webp !== null && state.formatSupport.avif !== null,
  };
};

/**
 * Helper function to check if image is in error state and can be retried
 */
export const canRetryImage = (state: ImageState, maxRetries: number = 3) => {
  return state.hasError && state.retryCount < maxRetries;
};

/**
 * Helper function to get loading state description for debugging
 */
export const getLoadingStateDescription = (state: ImageState) => {
  if (state.isLoading) return 'Loading';
  if (state.hasError) return `Error (retry ${state.retryCount})`;
  return 'Loaded';
};
