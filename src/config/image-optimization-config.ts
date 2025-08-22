/**
 * Image Optimization Build Configuration
 * Defines settings for automated image optimization during build process
 */

export interface ImageOptimizationSettings {
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  quality: {
    webp: number;
    avif: number;
    jpeg: number;
    png: number;
  };
  progressive: boolean;
  responsive: {
    breakpoints: number[];
    generateSizes: boolean;
  };
  compression: {
    mozjpeg: boolean;
    pngquant: boolean;
    optipng: boolean;
  };
}

/**
 * Default optimization settings for different image types
 */
export const IMAGE_OPTIMIZATION_SETTINGS: Record<string, ImageOptimizationSettings> = {
  hero: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 90,
      avif: 85,
      jpeg: 85,
      png: 90,
    },
    progressive: true,
    responsive: {
      breakpoints: [320, 480, 768, 1024, 1280, 1536, 1920],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  service: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 80,
      avif: 75,
      jpeg: 80,
      png: 85,
    },
    progressive: true,
    responsive: {
      breakpoints: [320, 480, 768, 1024],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  project: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 85,
      avif: 80,
      jpeg: 85,
      png: 90,
    },
    progressive: true,
    responsive: {
      breakpoints: [320, 480, 768, 1024, 1280],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  team: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 80,
      avif: 75,
      jpeg: 80,
      png: 85,
    },
    progressive: false,
    responsive: {
      breakpoints: [100, 200, 400],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  client: {
    formats: ['avif', 'webp', 'png'],
    quality: {
      webp: 85,
      avif: 80,
      jpeg: 85,
      png: 90,
    },
    progressive: false,
    responsive: {
      breakpoints: [100, 200],
      generateSizes: false,
    },
    compression: {
      mozjpeg: false,
      pngquant: true,
      optipng: true,
    },
  },

  testimonial: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 80,
      avif: 75,
      jpeg: 80,
      png: 85,
    },
    progressive: false,
    responsive: {
      breakpoints: [50, 100],
      generateSizes: false,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  blog: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: {
      webp: 85,
      avif: 80,
      jpeg: 85,
      png: 90,
    },
    progressive: true,
    responsive: {
      breakpoints: [320, 480, 768, 1024, 1200],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },

  fallback: {
    formats: ['webp', 'jpeg'],
    quality: {
      webp: 75,
      avif: 70,
      jpeg: 75,
      png: 80,
    },
    progressive: true,
    responsive: {
      breakpoints: [320, 480, 768],
      generateSizes: true,
    },
    compression: {
      mozjpeg: true,
      pngquant: true,
      optipng: true,
    },
  },
};

/**
 * Build-time image processing configuration
 */
export const BUILD_OPTIMIZATION_CONFIG = {
  // Input directories to process
  inputDirs: [
    'public/images/hero',
    'public/images/services',
    'public/images/projects',
    'public/images/team',
    'public/images/clients',
    'public/images/testimonials',
    'public/images/blog',
  ],

  // Output directory structure
  outputDir: 'public/images',

  // File naming conventions
  naming: {
    responsive: '{name}-{width}w.{ext}',
    optimized: '{name}.{ext}',
    original: '{name}-original.{ext}',
  },

  // Processing options
  processing: {
    parallel: true,
    maxConcurrency: 4,
    skipExisting: true,
    generateManifest: true,
    manifestPath: 'public/images/optimization-manifest.json',
  },

  // Optimization thresholds
  thresholds: {
    minSizeReduction: 0.1, // 10% minimum size reduction
    maxFileSize: 2 * 1024 * 1024, // 2MB max file size
    maxDimensions: {
      width: 2560,
      height: 1440,
    },
  },
};

/**
 * Runtime optimization settings
 */
export const RUNTIME_OPTIMIZATION_CONFIG = {
  // Lazy loading settings
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '50px',
    enableIntersectionObserver: true,
  },

  // Preloading settings
  preloading: {
    criticalImages: 2,
    strategy: 'conservative' as const,
    connectionAware: true,
  },

  // Format detection
  formatDetection: {
    enableWebP: true,
    enableAVIF: true,
    fallbackToOriginal: true,
  },

  // Performance monitoring
  monitoring: {
    trackLCP: true,
    trackCLS: true,
    reportErrors: true,
  },
};

/**
 * Get optimization settings for a specific image type
 */
export const getOptimizationSettings = (imageType: string): ImageOptimizationSettings => {
  const settings =
    IMAGE_OPTIMIZATION_SETTINGS[imageType as keyof typeof IMAGE_OPTIMIZATION_SETTINGS];
  if (settings) {
    return settings;
  }
  return IMAGE_OPTIMIZATION_SETTINGS.fallback as ImageOptimizationSettings;
};

/**
 * Generate responsive breakpoints for an image
 */
export const generateResponsiveBreakpoints = (
  originalWidth: number,
  imageType: string
): number[] => {
  const settings = getOptimizationSettings(imageType);

  return settings.responsive.breakpoints.filter(breakpoint => breakpoint <= originalWidth);
};

/**
 * Calculate optimal quality for a given format and image type
 */
export const getOptimalQuality = (
  format: 'webp' | 'avif' | 'jpeg' | 'png',
  imageType: string
): number => {
  const settings = getOptimizationSettings(imageType);
  return settings.quality[format];
};

export default {
  IMAGE_OPTIMIZATION_SETTINGS,
  BUILD_OPTIMIZATION_CONFIG,
  RUNTIME_OPTIMIZATION_CONFIG,
  getOptimizationSettings,
  generateResponsiveBreakpoints,
  getOptimalQuality,
};
