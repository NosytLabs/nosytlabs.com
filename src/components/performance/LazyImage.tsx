/**
 * Lazy Image Component
 * Progressive image loading with intersection observer
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EnhancedSpinner } from '../ui/loading-fallback';
import { AlertCircle, RefreshCw, Eye } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  // Enhanced props
  blurTransition?: boolean;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  progressive?: boolean;
  retryAttempts?: number;
  showProgress?: boolean;
  zoomOnHover?: boolean;
  fallbackSrc?: string;
  enableWebP?: boolean;
  loadingVariant?: 'spinner' | 'skeleton' | 'pulse' | 'shimmer';
}

interface ImageState {
  isLoaded: boolean;
  isLoading: boolean;
  hasError: boolean;
  isInView: boolean;
  retryCount: number;
  loadProgress: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  blurDataURL,
  width,
  height,
  priority = false,
  quality = 75,
  sizes,
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'high',
  // Enhanced props
  blurTransition = true,
  aspectRatio,
  objectFit = 'cover',
  progressive = true,
  retryAttempts = 3,
  showProgress = false,
  zoomOnHover = false,
  fallbackSrc,
  enableWebP = true,
  loadingVariant = 'spinner',
}) => {
  const [state, setState] = useState<ImageState>({
    isLoaded: false,
    isLoading: false,
    hasError: false,
    isInView: priority, // If priority, consider it in view immediately
    retryCount: 0,
    loadProgress: 0,
  });

  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Check if browser supports WebP
   */
  const supportsWebP = useCallback((): boolean => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, []);

  /**
   * Generate responsive srcSet with WebP support
   */
  const generateSrcSet = useCallback((baseSrc: string): string => {
    if (!width || !height) return '';

    const breakpoints = [480, 768, 1024, 1280, 1536];
    const format = enableWebP && supportsWebP() ? 'webp' : 'jpg';
    
    const srcSet = breakpoints
      .filter(bp => bp <= width * 2)
      .map(bp => {
        const scaledHeight = Math.round((height * bp) / width);
        return `${baseSrc}?w=${bp}&h=${scaledHeight}&q=${quality}&f=${format} ${bp}w`;
      })
      .join(', ');

    return srcSet;
  }, [width, height, quality, enableWebP, supportsWebP]);

  /**
   * Handle retry logic
   */
  const handleRetry = useCallback(() => {
    if (state.retryCount >= retryAttempts) {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setState(prev => ({ ...prev, hasError: false, retryCount: 0, loadProgress: 0 }));
        return;
      }
      return;
    }

    setState(prev => ({ 
      ...prev, 
      hasError: false, 
      retryCount: prev.retryCount + 1,
      loadProgress: 0 
    }));
    
    // Exponential backoff
    const delay = Math.pow(2, state.retryCount) * 1000;
    setTimeout(() => {
      startLoading();
    }, delay);
  }, [state.retryCount, retryAttempts, fallbackSrc, currentSrc]);

  /**
   * Simulate loading progress
   */
  const simulateProgress = useCallback(() => {
    if (!showProgress) return;
    
    setState(prev => ({ ...prev, loadProgress: 0 }));
    
    progressIntervalRef.current = setInterval(() => {
      setState(prev => {
        const newProgress = Math.min(prev.loadProgress + Math.random() * 15, 90);
        return { ...prev, loadProgress: newProgress };
      });
    }, 200);
  }, [showProgress]);

  /**
   * Handle image load success
   */
  const handleLoad = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setState(prev => ({ ...prev, isLoaded: true, isLoading: false, loadProgress: 100 }));
    onLoad?.();
  }, [onLoad]);

  /**
   * Handle image load error
   */
  const handleError = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    const error = new Error(`Failed to load image: ${currentSrc || src}`);
    setState(prev => ({ ...prev, hasError: true, isLoading: false, loadProgress: 0 }));
    onError?.(error);
    
    // Auto-retry if attempts remaining
    if (state.retryCount < retryAttempts) {
      setTimeout(() => handleRetry(), 1000);
    }
  }, [src, currentSrc, onError, state.retryCount, retryAttempts, handleRetry]);

  /**
   * Start loading the image
   */
  const startLoading = useCallback(() => {
    if (state.isLoading || (state.isLoaded && !state.hasError)) return;

    setState(prev => ({ ...prev, isLoading: true, hasError: false }));
    
    if (progressive) {
      simulateProgress();
    }

    // Create a new image element to preload
    const img = new Image();
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = currentSrc || src;
  }, [src, currentSrc, state, handleLoad, handleError, progressive, simulateProgress]);

  /**
   * Initialize current source
   */
  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  /**
   * Intersection Observer callback
   */
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry?.isIntersecting && !state.isInView) {
      setState(prev => ({ ...prev, isInView: true }));
      startLoading();
    }
  }, [state.isInView, startLoading]);

  /**
   * Set up intersection observer
   */
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px', // Start loading earlier for better UX
      threshold: 0.1,
    });

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, handleIntersection]);

  /**
   * Load immediately if priority is set
   */
  useEffect(() => {
    if (priority && !state.isLoading && !state.isLoaded && !state.hasError) {
      startLoading();
    }
  }, [priority, state, startLoading]);



  /**
   * Render loading state
   */
  const renderLoading = () => {
    switch (loadingVariant) {
      case 'spinner':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm">
            <EnhancedSpinner size="md" variant="primary" className="" />
            {showProgress && (
              <div className="mt-3 text-sm text-gray-600">
                {Math.round(state.loadProgress)}%
              </div>
            )}
          </div>
        );
      case 'skeleton':
        return (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        );
      case 'pulse':
        return (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        );
      case 'shimmer':
        return (
          <div className="absolute inset-0 bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        );
      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <EnhancedSpinner size="md" variant="primary" className="" />
          </div>
        );
    }
  };

  /**
   * Render error state
   */
  const renderError = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
      <AlertCircle className="w-12 h-12 mb-2 text-red-400" />
      <p className="text-sm mb-2">Failed to load image</p>
      {state.retryCount > 0 && (
        <p className="text-xs mb-3 text-gray-400">
          Attempt {state.retryCount} of {retryAttempts}
        </p>
      )}
      {state.retryCount < retryAttempts && (
        <button
          onClick={handleRetry}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  );

  /**
   * Get placeholder styles
   */
  const getPlaceholderStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: 'rgb(var(--color-neutral-100-rgb))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    if (blurDataURL) {
      return {
        ...baseStyles,
        backgroundImage: `url(${blurDataURL})`,
        filter: blurTransition ? 'blur(10px)' : 'none',
        transform: blurTransition ? 'scale(1.1)' : 'none',
      };
    }

    if (placeholder) {
      return {
        ...baseStyles,
        backgroundImage: `url(${placeholder})`,
      };
    }

    return baseStyles;
  };

  /**
   * Get container classes
   */
  const getContainerClasses = (): string => {
    const baseClasses = 'relative overflow-hidden';
    const aspectClass = aspectRatio || (width && height ? `aspect-[${width}/${height}]` : '');
    const hoverClass = zoomOnHover ? 'group cursor-pointer' : '';
    
    return `${baseClasses} ${aspectClass} ${hoverClass} ${className}`.trim();
  };

  /**
   * Get image classes
   */
  const getImageClasses = (): string => {
    const baseClasses = `w-full h-full object-${objectFit}`;
    const transitionClasses = blurTransition 
      ? 'transition-all duration-500 ease-out' 
      : 'transition-opacity duration-300';
    const opacityClass = state.isLoaded ? 'opacity-100' : 'opacity-0';
    const zoomClass = zoomOnHover ? 'group-hover:scale-110' : '';
    
    return `${baseClasses} ${transitionClasses} ${opacityClass} ${zoomClass}`.trim();
  };

  return (
    <div 
      className={getContainerClasses()}
      onMouseEnter={() => zoomOnHover && setIsHovered(true)}
      onMouseLeave={() => zoomOnHover && setIsHovered(false)}
      style={{
        aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
      }}
    >
      {/* Not in view placeholder */}
      {!state.isInView && !priority && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-center">
            <Eye className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Image will load when visible</p>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {(state.isInView || priority) && !state.isLoaded && (
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={getPlaceholderStyles()}
          aria-hidden="true"
        >
          {/* Loading indicator */}
          {state.isLoading && (
            <div role="status" aria-label="Loading image">
              {renderLoading()}
              <span className="sr-only">Loading image...</span>
            </div>
          )}
          
          {/* Error state */}
          {state.hasError && (
            <div role="alert">
              {renderError()}
            </div>
          )}
        </div>
      )}

      {/* Main image */}
      {(state.isInView || priority) && (
        <img
          ref={imgRef}
          src={currentSrc || src}
          srcSet={generateSrcSet(currentSrc || src)}
          {...(sizes && { sizes })}
          alt={alt}
          {...(width && { width })}
          {...(height && { height })}
          {...(loading && { loading })}
          {...(decoding && { decoding })}
          {...(fetchPriority && { fetchPriority: fetchPriority as 'high' | 'low' | 'auto' })}
          className={getImageClasses()}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: objectFit as React.CSSProperties['objectFit'],
            aspectRatio: aspectRatio || (width && height ? `${width} / ${height}` : undefined),
          }}
        />
      )}

      {/* Zoom overlay */}
      {zoomOnHover && isHovered && state.isLoaded && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
      )}

      {/* Blur overlay fade out */}
      {blurDataURL && state.isLoaded && blurTransition && (
        <div 
          className="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
          }}
        />
      )}
    </div>
  );
};

/**
 * Hook for preloading images
 */
export const useImagePreloader = () => {
  const preloadImage = useCallback((src: string, _options?: {
    quality?: number;
    priority?: boolean;
    sizes?: string;
  }) => {
    // Simple image preloading using native Image API
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback((sources: string[], options?: {
    quality?: number;
    priority?: boolean;
    sizes?: string;
  }) => {
    return Promise.all(
      sources.map(src => preloadImage(src, options))
    );
  }, [preloadImage]);

  return { preloadImage, preloadImages };
};

export default LazyImage;