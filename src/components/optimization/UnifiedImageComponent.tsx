/**
 * Unified Image Component
 * Consolidates all image handling functionality from multiple components
 * Replaces: SafeImage.astro, OptimizedImage.tsx, ResponsiveImage.tsx, UnifiedImage.tsx
 */

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { UnifiedErrorBoundary } from '../error/UnifiedErrorSystem';
import { logger } from '../../utils/logger';
import {
  COMMON_SIZES,
  IMAGE_QUALITY,
  supportsWebP,
  supportsAVIF,
  generateImageFormats,
  generateResponsiveSrcSet,
  getLoadingStrategy,
  type ResponsiveBreakpoint
} from '../../utils/unified-image-utils';

// ... (keep existing interfaces: UnifiedImageProps, ImageState)

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface UnifiedImageProps {
  // Core image properties
  src: string;
  alt: string;
  width?: number;
  height?: number;

  // Responsive and optimization
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager' | 'auto';

  // Format and fallback handling
  formats?: string[] | 'auto';
  fallbackSrc?: string;
  placeholder?: string | 'blur' | 'empty';

  // Responsive breakpoints
  breakpoints?: ResponsiveBreakpoint[];
  responsiveMode?: 'srcset' | 'picture' | 'auto';

  // Styling and layout
  className?: string;
  style?: React.CSSProperties;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  aspectRatio?: string | number;

  // Event handlers
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoadStart?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  // Accessibility and SEO
  title?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // Performance and behavior
  _preload?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];

  // Error handling
  showErrorFallback?: boolean;
  errorFallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  retryAttempts?: number;
  retryDelay?: number;

  // Development and debugging
  debug?: boolean;
  testId?: string;
}

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  currentSrc: string;
  retryCount: number;
  formatSupport: {
    webp: boolean | null;
    avif: boolean | null;
  };
}

// ============================================================================
// UNIFIED IMAGE COMPONENT
// ============================================================================

export const UnifiedImageComponent = forwardRef<HTMLImageElement, UnifiedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      sizes = COMMON_SIZES.fullWidth,
      quality = IMAGE_QUALITY.standard,
      priority = false,
      loading = 'auto',
      formats = 'auto',
      fallbackSrc,
      placeholder = 'empty',
      breakpoints,
      responsiveMode = 'auto',
      className = '',
      style = {},
      objectFit = 'cover',
      objectPosition = 'center',
      aspectRatio,
      onLoad,
      onError,
      onLoadStart,
      title,
      role,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      _preload = false,
      fetchPriority = 'auto',
      crossOrigin,
      referrerPolicy,
      showErrorFallback = true,
      errorFallbackComponent,
      retryAttempts = 3,
      retryDelay = 1000,
      debug = false,
      testId,
      ...restProps
    },
    ref
  ) => {
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

    const imgRef = useRef<HTMLImageElement | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // ============================================================================
    // FORMAT DETECTION AND OPTIMIZATION
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
                'UnifiedImage'
              );
            }
          } catch (_error) {
            logger.warn('Failed to detect format support', 'UnifiedImage');
          }
        }
      };

      detectFormatSupport();
    }, [formats, debug]);

    // ============================================================================
    // SOURCE GENERATION
    // ============================================================================

    const generateOptimizedSources = (): { src: string; srcSet?: string; type?: string }[] => {
      const sources: { src: string; srcSet?: string; type?: string }[] = [];

      if (
        formats === 'auto' &&
        state.formatSupport.avif !== null &&
        state.formatSupport.webp !== null
      ) {
        const imageFormats = generateImageFormats(src, quality);

        // AVIF source (if supported)
        if (state.formatSupport.avif && imageFormats.avif) {
          sources.push({
            src: imageFormats.avif,
            srcSet: breakpoints ? generateResponsiveSrcSet(imageFormats.avif, breakpoints) : '',
            type: 'image/avif',
          });
        }

        // WebP source (if supported)
        if (state.formatSupport.webp && imageFormats.webp) {
          sources.push({
            src: imageFormats.webp,
            srcSet: breakpoints ? generateResponsiveSrcSet(imageFormats.webp, breakpoints) : '',
            type: 'image/webp',
          });
        }

        // Fallback source
        sources.push({
          src: imageFormats.fallback,
          srcSet: breakpoints ? generateResponsiveSrcSet(imageFormats.fallback, breakpoints) : '',
        });
      } else {
        // Simple source without format optimization
        sources.push({
          src,
          srcSet: breakpoints ? generateResponsiveSrcSet(src, breakpoints) : '',
        });
      }

      return sources;
    };

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setState(prev => ({ ...prev, isLoading: false, hasError: false }));

      if (debug) {
        logger.info(`Image loaded successfully: ${state.currentSrc}`, 'UnifiedImage');
      }

      onLoad?.(event);
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setState(prev => ({ ...prev, isLoading: false, hasError: true }));

      if (debug) {
        logger.error(
          `Image failed to load: ${state.currentSrc}`,
          new Error('Image load failed'),
          'UnifiedImage'
        );
      }

      // Attempt retry if we haven't exceeded retry attempts
      if (state.retryCount < retryAttempts) {
        retryTimeoutRef.current = setTimeout(() => {
          retryImageLoad();
        }, retryDelay);
      } else if (fallbackSrc && state.currentSrc !== fallbackSrc) {
        // Try fallback source
        setState(prev => ({ ...prev, currentSrc: fallbackSrc, retryCount: 0 }));
      }

      onError?.(event);
    };

    const handleLoadStart = (_event: React.SyntheticEvent<HTMLImageElement>) => {
      setState(prev => ({ ...prev, isLoading: true, hasError: false }));
      onLoadStart?.(_event);
    };

    const retryImageLoad = () => {
      setState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
        hasError: false,
        isLoading: true,
      }));

      if (debug) {
        logger.info(
          `Retrying image load (attempt ${state.retryCount + 1}): ${state.currentSrc}`,
          'UnifiedImage'
        );
      }
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
    // LOADING STRATEGY
    // ============================================================================

    const effectiveLoading = loading === 'auto' ? getLoadingStrategy(priority, priority) : loading;

    // ============================================================================
    // STYLE COMPUTATION
    // ============================================================================

    const computedStyle: React.CSSProperties = {
      objectFit,
      objectPosition,
      ...(aspectRatio && { aspectRatio: aspectRatio.toString() }),
      ...style,
    };

    // ============================================================================
    // RENDER LOGIC
    // ============================================================================

    // Error fallback rendering
    if (
      state.hasError &&
      state.retryCount >= retryAttempts &&
      (!fallbackSrc || state.currentSrc === fallbackSrc)
    ) {
      if (!showErrorFallback) {
        return null;
      }

      if (errorFallbackComponent) {
        const ErrorComponent = errorFallbackComponent;
        return <ErrorComponent error={new Error('Image failed to load')} retry={retryImageLoad} />;
      }

      return (
        <div
          className={`image-error-fallback ${className}`}
          style={{
            ...computedStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background-muted-light)',
            color: 'var(--text-muted)',
            fontSize: '14px',
            minHeight: height || '200px',
            width: width || '100%',
          }}
          data-testid={testId ? `${testId}-error` : undefined}
        >
          <div className="text-center">
            <div className="mb-2">⚠️</div>
            <div>Failed to load image</div>
            <button
              onClick={retryImageLoad}
              className="mt-2 px-3 py-1 text-xs bg-background-muted-light hover:bg-background-muted-dark rounded"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Placeholder rendering
    if (state.isLoading && placeholder && placeholder !== 'empty') {
      if (placeholder === 'blur') {
        return (
          <div
            className={`image-placeholder-blur ${className}`}
            style={{
              ...computedStyle,
              backgroundColor: 'var(--background-muted-light)',
              filter: 'blur(10px)',
              minHeight: height || '200px',
              width: width || '100%',
            }}
            data-testid={testId ? `${testId}-placeholder` : undefined}
          />
        );
      }

      if (typeof placeholder === 'string' && placeholder !== 'blur') {
        return (
          <img
            src={placeholder}
            alt={alt}
            className={`image-placeholder ${className}`}
            style={computedStyle}
            data-testid={testId ? `${testId}-placeholder` : undefined}
          />
        );
      }
    }

    // Generate sources for picture element or img srcset
    const sources = generateOptimizedSources();

    // Determine if we should use picture element
    const usePictureElement =
      responsiveMode === 'picture' ||
      (responsiveMode === 'auto' && sources.length > 1 && sources.some(s => s.type));

    // Picture element rendering
    if (usePictureElement) {
      return (
        <picture className={className} data-testid={testId}>
          {sources.slice(0, -1).map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet || source.src}
              type={source.type}
              sizes={sizes}
            />
          ))}
          <img
            ref={node => {
              if (imgRef.current !== node) {
                (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
              }
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            src={sources[sources.length - 1]?.src || state.currentSrc}
            alt={alt}
            width={width}
            height={height}
            loading={effectiveLoading}
            style={computedStyle}
            onLoad={handleLoad}
            onError={handleError}
            onLoadStart={handleLoadStart}
            title={title}
            role={role}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            crossOrigin={crossOrigin}
            referrerPolicy={referrerPolicy}
            {...(fetchPriority !== 'auto' && { fetchPriority })}
            {...restProps}
          />
        </picture>
      );
    }

    // Standard img element rendering
    const primarySource = sources[0] || { src: state.currentSrc };

    return (
      <img
        ref={node => {
          if (imgRef.current !== node) {
            (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        src={primarySource.src}
        srcSet={primarySource.srcSet}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={effectiveLoading}
        className={className}
        style={computedStyle}
        onLoad={handleLoad}
        onError={handleError}
        onLoadStart={handleLoadStart}
        title={title}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        crossOrigin={crossOrigin}
        referrerPolicy={referrerPolicy}
        data-testid={testId}
        {...(fetchPriority !== 'auto' && { fetchPriority })}
        {...restProps}
      />
    );
  }
);

UnifiedImageComponent.displayName = 'UnifiedImageComponent';

// ============================================================================
// WRAPPED COMPONENT WITH ERROR BOUNDARY
// ============================================================================

export const UnifiedImage: React.FC<UnifiedImageProps> = props => {
  return (
    <UnifiedErrorBoundary
      level="component"
      isolate={true}
      fallback={(error, resetError) => (
        <div className="image-error-boundary">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded">
            <div className="text-red-600 mb-2">Image Error</div>
            <div className="text-sm text-red-500 mb-3">{error.message}</div>
            <button
              onClick={resetError}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    >
      <UnifiedImageComponent {...props} />
    </UnifiedErrorBoundary>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * Hero image component with optimized settings
 */
export const HeroImage: React.FC<
  Omit<UnifiedImageProps, 'priority' | 'loading' | 'sizes'>
> = props => (
  <UnifiedImage
    {...props}
    priority={true}
    loading="eager"
    sizes={COMMON_SIZES.hero}
    fetchPriority="high"
  />
);

/**
 * Card image component with optimized settings
 */
export const CardImage: React.FC<Omit<UnifiedImageProps, 'sizes' | 'objectFit'>> = props => (
  <UnifiedImage {...props} sizes={COMMON_SIZES.card} objectFit="cover" loading="lazy" />
);

/**
 * Thumbnail image component with optimized settings
 */
export const ThumbnailImage: React.FC<Omit<UnifiedImageProps, 'sizes' | 'quality'>> = props => (
  <UnifiedImage
    {...props}
    sizes={COMMON_SIZES.thumbnail}
    quality={IMAGE_QUALITY.thumbnail}
    loading="lazy"
  />
);

// ============================================================================
// EXPORTS
// ============================================================================

export default UnifiedImage;

// Legacy compatibility exports
export { UnifiedImage as OptimizedImage };
export { UnifiedImage as ResponsiveImage };
export { UnifiedImageComponent as SafeImage };
