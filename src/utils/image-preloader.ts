/**
 * Image preloader utility for optimizing image loading performance
 */

export interface ImagePreloadOptions {
  priority?: 'high' | 'low';
  loading?: 'eager' | 'lazy';
  sizes?: string;
  srcset?: string;
}

export class ImagePreloader {
  private static preloadedImages = new Set<string>();
  private static loadingPromises = new Map<string, Promise<void>>();

  /**
   * Preload an image with optional configuration
   */
  static async preload(src: string, options: ImagePreloadOptions = {}): Promise<void> {
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.preloadedImages.add(src);
        this.loadingPromises.delete(src);
        resolve();
      };

      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to preload image: ${src}`));
      };

      if (options.srcset) {
        img.srcset = options.srcset;
      }

      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Preload multiple images
   */
  static async preloadMultiple(
    sources: string[],
    options: ImagePreloadOptions = {}
  ): Promise<void[]> {
    return Promise.all(sources.map(src => this.preload(src, options)));
  }

  /**
   * Check if an image has been preloaded
   */
  static isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Clear preloaded images cache
   */
  static clearCache(): void {
    this.preloadedImages.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get optimized image attributes for responsive images
   */
  static getOptimizedAttributes(src: string, options: ImagePreloadOptions = {}) {
    return {
      src,
      loading: options.loading || 'lazy',
      decoding: 'async',
      ...(options.sizes && { sizes: options.sizes }),
      ...(options.srcset && { srcset: options.srcset }),
    };
  }
}

/**
 * Utility function for preloading critical images
 */
export const preloadCriticalImages = async (images: string[]) => {
  return ImagePreloader.preloadMultiple(images, { priority: 'high', loading: 'eager' });
};

/**
 * Utility function for lazy preloading images
 */
export const preloadLazyImages = async (images: string[]) => {
  return ImagePreloader.preloadMultiple(images, { priority: 'low', loading: 'lazy' });
};

export default ImagePreloader;
