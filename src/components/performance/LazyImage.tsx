/**
 * Lazy Image Component
 * Progressive image loading with intersection observer
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

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
}

interface ImageState {
  isLoaded: boolean;
  isLoading: boolean;
  hasError: boolean;
  isInView: boolean;
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
  fetchPriority = 'auto',
}) => {
  const [state, setState] = useState<ImageState>({
    isLoaded: false,
    isLoading: false,
    hasError: false,
    isInView: priority, // If priority, consider it in view immediately
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /**
   * Handle image load success
   */
  const handleLoad = useCallback(() => {
    setState(prev => ({ ...prev, isLoaded: true, isLoading: false }));
    onLoad?.();
  }, [onLoad]);

  /**
   * Handle image load error
   */
  const handleError = useCallback(() => {
    const error = new Error(`Failed to load image: ${src}`);
    setState(prev => ({ ...prev, hasError: true, isLoading: false }));
    onError?.(error);
  }, [src, onError]);

  /**
   * Start loading the image
   */
  const startLoading = useCallback(() => {
    if (state.isLoading || state.isLoaded || state.hasError) return;

    setState(prev => ({ ...prev, isLoading: true }));

    // Create a new image element to preload
    const img = new Image();
    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = src;
  }, [src, state, handleLoad, handleError]);

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
      rootMargin: '50px', // Start loading 50px before the image enters viewport
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
   * Generate responsive srcSet
   */
  const generateSrcSet = useCallback((baseSrc: string): string => {
    if (!width || !height) return '';

    const breakpoints = [480, 768, 1024, 1280, 1536];
    const srcSet = breakpoints
      .filter(bp => bp <= width * 2) // Don't generate sizes larger than 2x original
      .map(bp => {
        const scaledHeight = Math.round((height * bp) / width);
        return `${baseSrc}?w=${bp}&h=${scaledHeight}&q=${quality} ${bp}w`;
      })
      .join(', ');

    return srcSet;
  }, [width, height, quality]);

  /**
   * Get placeholder styles
   */
  const getPlaceholderStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#f3f4f6',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    if (blurDataURL) {
      return {
        ...baseStyles,
        backgroundImage: `url(${blurDataURL})`,
        filter: 'blur(10px)',
        transform: 'scale(1.1)', // Slightly scale to hide blur edges
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
    const aspectRatio = width && height ? `aspect-[${width}/${height}]` : '';
    
    return `${baseClasses} ${aspectRatio} ${className}`.trim();
  };

  /**
   * Get image classes
   */
  const getImageClasses = (): string => {
    const baseClasses = 'w-full h-full object-cover transition-opacity duration-300';
    const opacityClass = state.isLoaded ? 'opacity-100' : 'opacity-0';
    
    return `${baseClasses} ${opacityClass}`;
  };

  return (
    <div className={getContainerClasses()}>
      {/* Placeholder */}
      {!state.isLoaded && (
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={getPlaceholderStyles()}
        >
          {/* Loading indicator */}
          {state.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
          )}
          
          {/* Error state */}
          {state.hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <svg 
                  className="w-12 h-12 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-sm">Failed to load</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={state.isInView || priority ? src : undefined}
        srcSet={state.isInView || priority ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={getImageClasses()}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          // Prevent layout shift
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
        }}
      />

      {/* Blur overlay fade out */}
      {blurDataURL && state.isLoaded && (
        <div 
          className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none"
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
  }, []);

  return { preloadImage, preloadImages };
};

export default LazyImage;