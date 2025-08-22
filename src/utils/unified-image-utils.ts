/**
 * Unified Image Utilities
 * Consolidates image optimization, preloading, and format handling
 * Replaces: image-optimization.ts and image-preloader.ts
 */

import { logger } from './logger';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImageFormat {
  webp: string;
  fallback: string;
  avif?: string;
}

export interface OptimizedImageConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  formats: ImageFormat;
  sizes: string;
  loading: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
}

export interface ResponsiveBreakpoint {
  width: number;
  descriptor: string;
  media?: string;
}

export interface CriticalImage {
  src: string;
  webp?: string;
  avif?: string;
  sizes?: string;
  media?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PreloadImageOptions {
  as?: 'image';
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
  media?: string;
  sizes?: string;
  type?: string;
}

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

/**
 * Standard responsive breakpoints for image optimization
 */
export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoint[] = [
  { width: 320, descriptor: '320w', media: '(max-width: 480px)' },
  { width: 480, descriptor: '480w', media: '(max-width: 768px)' },
  { width: 768, descriptor: '768w', media: '(max-width: 1024px)' },
  { width: 1024, descriptor: '1024w', media: '(max-width: 1280px)' },
  { width: 1280, descriptor: '1280w', media: '(max-width: 1536px)' },
  { width: 1536, descriptor: '1536w', media: '(max-width: 1920px)' },
  { width: 1920, descriptor: '1920w' },
];

/**
 * Image quality settings for different use cases
 */
export const IMAGE_QUALITY = {
  thumbnail: 70,
  standard: 80,
  high: 90,
  lossless: 100,
} as const;

/**
 * Critical images that should be preloaded for optimal performance
 */
export const CRITICAL_IMAGES: CriticalImage[] = [
  {
    src: '/images/hero/web-development-hero-1920x800.webp',
    webp: '/images/hero/web-development-hero-1920x800.webp',
    avif: '/images/hero/web-development-hero-1920x800.avif',
    sizes: '(min-width: 1024px) 1920px, 100vw',
    media: '(min-width: 1024px)',
    priority: 'high',
  },
  {
    src: '/images/hero/web-development-hero-768x600.webp',
    webp: '/images/hero/web-development-hero-768x600.webp',
    avif: '/images/hero/web-development-hero-768x600.avif',
    sizes: '(max-width: 1023px) 768px, 100vw',
    media: '(max-width: 1023px)',
    priority: 'high',
  },
  {
    src: '/images/services/web-development-service.webp',
    webp: '/images/services/web-development-service.webp',
    avif: '/images/services/web-development-service.avif',
    sizes: '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
    priority: 'medium',
  },
  {
    src: '/images/services/ai-integration-service.webp',
    webp: '/images/services/ai-integration-service.webp',
    avif: '/images/services/ai-integration-service.avif',
    sizes: '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw',
    priority: 'medium',
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(
  breakpoints: Array<{ media: string; size: string }>,
  defaultSize: string = '100vw'
): string {
  const sizeQueries = breakpoints.map(bp => `${bp.media} ${bp.size}`).join(', ');

  return `${sizeQueries}, ${defaultSize}`;
}

/**
 * Predefined sizes configurations for common use cases
 */
export const COMMON_SIZES = {
  hero: generateSizesAttribute(
    [
      { media: '(min-width: 1280px)', size: '1280px' },
      { media: '(min-width: 1024px)', size: '1024px' },
      { media: '(min-width: 768px)', size: '768px' },
    ],
    '100vw'
  ),

  card: generateSizesAttribute(
    [
      { media: '(min-width: 1280px)', size: '33vw' },
      { media: '(min-width: 768px)', size: '50vw' },
    ],
    '100vw'
  ),

  thumbnail: generateSizesAttribute([{ media: '(min-width: 768px)', size: '150px' }], '100px'),

  fullWidth: '100vw',

  halfWidth: generateSizesAttribute([{ media: '(min-width: 768px)', size: '50vw' }], '100vw'),

  thirdWidth: generateSizesAttribute(
    [
      { media: '(min-width: 1024px)', size: '33vw' },
      { media: '(min-width: 768px)', size: '50vw' },
    ],
    '100vw'
  ),
} as const;

// ============================================================================
// FORMAT DETECTION AND SUPPORT
// ============================================================================

/**
 * Check if the browser supports WebP format
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Check if the browser supports AVIF format
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise(resolve => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

// ============================================================================
// IMAGE OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Generate optimized image formats for a given image path
 */
export const generateImageFormats = (
  basePath: string,
  quality: number = IMAGE_QUALITY.standard
): ImageFormat => {
  const pathWithoutExt = basePath.replace(/\.[^/.]+$/, '');

  return {
    webp: `${pathWithoutExt}.webp`,
    fallback: basePath,
    ...(quality >= IMAGE_QUALITY.high && { avif: `${pathWithoutExt}.avif` }),
  };
};

/**
 * Generate responsive image srcset for different breakpoints
 */
export const generateResponsiveSrcSet = (
  basePath: string,
  breakpoints: ResponsiveBreakpoint[] = RESPONSIVE_BREAKPOINTS
): string => {
  const pathWithoutExt = basePath.replace(/\.[^/.]+$/, '');
  const originalExt = basePath.split('.').pop() || 'jpg';

  return breakpoints
    .map(bp => `${pathWithoutExt}-${bp.width}w.${originalExt} ${bp.descriptor}`)
    .join(', ');
};

/**
 * Determine loading strategy based on image position and priority
 */
export const getLoadingStrategy = (
  isAboveTheFold: boolean = false,
  isPriority: boolean = false
): 'lazy' | 'eager' => {
  return isAboveTheFold || isPriority ? 'eager' : 'lazy';
};

/**
 * Calculate optimal image dimensions based on container and device pixel ratio
 */
export const calculateOptimalDimensions = (
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = 2
): { width: number; height: number } => {
  return {
    width: Math.ceil(containerWidth * devicePixelRatio),
    height: Math.ceil(containerHeight * devicePixelRatio),
  };
};

/**
 * Generate complete optimized image configuration
 */
export const createOptimizedImageConfig = (
  src: string,
  alt: string,
  options: {
    width: number;
    height: number;
    sizes?: string;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
    quality?: number;
  }
): OptimizedImageConfig => {
  const {
    width,
    height,
    sizes = COMMON_SIZES.fullWidth,
    loading = 'lazy',
    priority = false,
    quality = IMAGE_QUALITY.standard,
  } = options;

  return {
    src,
    alt,
    width,
    height,
    formats: generateImageFormats(src, quality),
    sizes,
    loading: getLoadingStrategy(loading === 'eager', priority),
    priority,
    quality,
  };
};

// ============================================================================
// IMAGE PRELOADING FUNCTIONS
// ============================================================================

/**
 * Preload a single image with modern format support
 */
export const preloadImage = async (
  src: string,
  options: PreloadImageOptions = {}
): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = options.as || 'image';
    link.href = src;

    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }

    if (options.fetchpriority) {
      link.setAttribute('fetchpriority', options.fetchpriority);
    }

    if (options.media) {
      link.media = options.media;
    }

    if (options.sizes) {
      link.setAttribute('imagesizes', options.sizes);
    }

    if (options.type) {
      link.type = options.type;
    }

    document.head.appendChild(link);
    logger.info(`Preloaded image: ${src}`, 'UnifiedImageUtils');
  } catch (error) {
    logger.error(`Failed to preload image: ${src}`, error as Error, 'UnifiedImageUtils');
  }
};

/**
 * Preload critical image with format detection
 */
export const preloadCriticalImage = async (image: CriticalImage): Promise<void> => {
  const [webpSupported, avifSupported] = await Promise.all([supportsWebP(), supportsAVIF()]);

  let srcToPreload = image.src;
  let typeToPreload: string | undefined;

  // Choose the best format to preload
  if (avifSupported && image.avif) {
    srcToPreload = image.avif;
    typeToPreload = 'image/avif';
  } else if (webpSupported && image.webp) {
    srcToPreload = image.webp;
    typeToPreload = 'image/webp';
  }

  const fetchPriority = image.priority === 'high' ? 'high' : 'auto';

  await preloadImage(srcToPreload, {
    fetchpriority: fetchPriority,
    ...(image.media && { media: image.media }),
    ...(image.sizes && { sizes: image.sizes }),
    ...(typeToPreload && { type: typeToPreload }),
  });
};

/**
 * Preload all critical images based on priority
 */
export const preloadCriticalImages = async (
  maxPriority: 'high' | 'medium' | 'low' = 'medium'
): Promise<void> => {
  const priorityOrder = ['high', 'medium', 'low'];
  const maxPriorityIndex = priorityOrder.indexOf(maxPriority);

  const imagesToPreload = CRITICAL_IMAGES.filter(image => {
    const imagePriorityIndex = priorityOrder.indexOf(image.priority);
    return imagePriorityIndex <= maxPriorityIndex;
  });

  logger.info(`Preloading ${imagesToPreload.length} critical images...`, 'UnifiedImageUtils');

  // Preload high priority images first
  const highPriorityImages = imagesToPreload.filter(img => img.priority === 'high');
  const otherImages = imagesToPreload.filter(img => img.priority !== 'high');

  // Preload high priority images immediately
  await Promise.all(highPriorityImages.map(image => preloadCriticalImage(image)));

  // Preload other images with a slight delay to avoid blocking critical resources
  if (otherImages.length > 0) {
    setTimeout(async () => {
      await Promise.all(otherImages.map(image => preloadCriticalImage(image)));
    }, 100);
  }
};

/**
 * Preload images when the page becomes idle
 */
export const preloadOnIdle = (images: string[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const preloadWhenIdle = () => {
    images.forEach(src => preloadImage(src));
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadWhenIdle, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(preloadWhenIdle, 1000);
  }
};

/**
 * Preload images based on user interaction hints
 */
export const preloadOnHover = (element: HTMLElement, imageSrc: string): void => {
  let hasPreloaded = false;

  const handleMouseEnter = () => {
    if (!hasPreloaded) {
      preloadImage(imageSrc);
      hasPreloaded = true;
    }
  };

  element.addEventListener('mouseenter', handleMouseEnter, { once: true });
};

/**
 * Preload images based on intersection (when they're about to come into view)
 */
export const preloadOnIntersection = (
  elements: HTMLElement[],
  imageSources: string[],
  rootMargin: string = '50px'
): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && imageSources[index]) {
          preloadImage(imageSources[index]);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin }
  );

  elements.forEach(element => observer.observe(element));
};

// ============================================================================
// UTILITY EXPORTS
// ============================================================================



export default {
  // Image optimization
  generateImageFormats,
  generateResponsiveSrcSet,
  generateSizesAttribute,
  getLoadingStrategy,
  calculateOptimalDimensions,
  createOptimizedImageConfig,

  // Format support
  supportsWebP,
  supportsAVIF,

  // Image preloading
  preloadImage,
  preloadCriticalImage,
  preloadCriticalImages,
  preloadOnIdle,
  preloadOnHover,
  preloadOnIntersection,

  // Constants
  RESPONSIVE_BREAKPOINTS,
  IMAGE_QUALITY,
  CRITICAL_IMAGES,
  COMMON_SIZES,
};
