/**
 * Optimized Image Loader
 * Phase 2 Performance Enhancement: Advanced image loading with caching and progressive techniques
 */

import { logger } from '../logger';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ImageLoadingOptions {
  lazy?: boolean;
  priority?: 'high' | 'medium' | 'low';
  progressive?: boolean;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  rootMargin?: string;
  threshold?: number;
}

export interface FormatSupport {
  webp: boolean;
  avif: boolean;
  lastChecked: number;
}

export interface ProgressiveImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  currentSrc?: string;
}

// ============================================================================
// CACHING AND OPTIMIZATION
// ============================================================================

/**
 * Cache for format support detection to avoid repeated checks
 */
export class FormatSupportCache {
  private static instance: FormatSupportCache;
  private cache: FormatSupport | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): FormatSupportCache {
    if (!FormatSupportCache.instance) {
      FormatSupportCache.instance = new FormatSupportCache();
    }
    return FormatSupportCache.instance;
  }

  async getFormatSupport(): Promise<FormatSupport> {
    const now = Date.now();

    // Return cached result if still valid
    if (this.cache && now - this.cache.lastChecked < this.CACHE_DURATION) {
      return this.cache;
    }

    // Perform format detection
    const [webp, avif] = await Promise.all([this.checkWebPSupport(), this.checkAVIFSupport()]);

    this.cache = {
      webp,
      avif,
      lastChecked: now,
    };

    logger.info(`Format support cached: WebP=${webp}, AVIF=${avif}`, 'OptimizedImageLoader');
    return this.cache;
  }

  private checkWebPSupport(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  private checkAVIFSupport(): Promise<boolean> {
    return new Promise(resolve => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }
}

/**
 * Connection-aware preloading based on network conditions
 */
export class ConnectionAwareLoader {
  private static instance: ConnectionAwareLoader;

  static getInstance(): ConnectionAwareLoader {
    if (!ConnectionAwareLoader.instance) {
      ConnectionAwareLoader.instance = new ConnectionAwareLoader();
    }
    return ConnectionAwareLoader.instance;
  }

  shouldPreload(priority: 'high' | 'medium' | 'low'): boolean {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return priority === 'high'; // Conservative fallback
    }

    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;
    const saveData = connection?.saveData;

    // Respect user's data saving preference
    if (saveData) {
      return priority === 'high';
    }

    // Adjust preloading based on connection speed
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return priority === 'high';
      case '3g':
        return priority === 'high' || priority === 'medium';
      case '4g':
      default:
        return true; // Preload all priorities on fast connections
    }
  }

  getOptimalQuality(): number {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 80; // Default quality
    }

    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType;
    const saveData = connection?.saveData;

    if (saveData) return 60; // Lower quality for data saving

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 60;
      case '3g':
        return 75;
      case '4g':
      default:
        return 85;
    }
  }
}

// ============================================================================
// PROGRESSIVE IMAGE LOADER
// ============================================================================

/**
 * Progressive image loader with blur-up technique
 */
export class ProgressiveImageLoader {
  private static observers = new Map<string, IntersectionObserver>();
  private static loadedImages = new Set<string>();

  static createProgressiveImage(
    container: HTMLElement,
    src: string,
    options: ImageLoadingOptions = {}
  ): ProgressiveImageState {
    const state: ProgressiveImageState = {
      isLoading: false,
      isLoaded: false,
      hasError: false,
    };

    if (options.lazy && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.setupLazyLoading(container, src, options, state);
    } else {
      this.loadImage(container, src, options, state);
    }

    return state;
  }

  private static setupLazyLoading(
    container: HTMLElement,
    src: string,
    options: ImageLoadingOptions,
    state: ProgressiveImageState
  ): void {
    const observerKey = `${options.rootMargin || '50px'}-${options.threshold || 0.1}`;

    if (!this.observers.has(observerKey)) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              const imageSrc = target.dataset.src;
              const imageOptions = JSON.parse(target.dataset.options || '{}');
              const imageState = JSON.parse(target.dataset.state || '{}');

              if (imageSrc) {
                this.loadImage(target, imageSrc, imageOptions, imageState);
                observer.unobserve(target);
              }
            }
          });
        },
        {
          rootMargin: options.rootMargin || '50px',
          threshold: options.threshold || 0.1,
        }
      );

      this.observers.set(observerKey, observer);
    }

    // Store data for lazy loading
    container.dataset.src = src;
    container.dataset.options = JSON.stringify(options);
    container.dataset.state = JSON.stringify(state);

    this.observers.get(observerKey)!.observe(container);
  }

  private static async loadImage(
    container: HTMLElement,
    src: string,
    options: ImageLoadingOptions,
    state: ProgressiveImageState
  ): Promise<void> {
    if (this.loadedImages.has(src)) {
      state.isLoaded = true;
      return;
    }

    state.isLoading = true;

    try {
      // Show blur placeholder if available
      if (options.blurDataURL && options.progressive) {
        this.showBlurPlaceholder(container, options.blurDataURL);
      }

      // Get optimal image source based on format support
      const formatSupport = await FormatSupportCache.getInstance().getFormatSupport();
      const optimizedSrc = this.getOptimalImageSrc(src, formatSupport);

      // Preload the image
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          state.currentSrc = optimizedSrc;
          state.isLoaded = true;
          state.isLoading = false;
          this.loadedImages.add(src);

          // Apply the loaded image
          this.applyLoadedImage(container, img, options.progressive);

          options.onLoad?.();
          resolve();
        };

        img.onerror = () => {
          state.hasError = true;
          state.isLoading = false;
          const error = new Error(`Failed to load image: ${optimizedSrc}`);
          options.onError?.(error);
          reject(error);
        };

        img.src = optimizedSrc;
      });
    } catch (error) {
      logger.error(
        `Progressive image loading failed for ${src}`,
        error as Error,
        'ProgressiveImageLoader'
      );
      state.hasError = true;
      state.isLoading = false;
    }
  }

  private static getOptimalImageSrc(src: string, formatSupport: FormatSupport): string {
    const pathWithoutExt = src.replace(/\.[^/.]+$/, '');

    // Choose the best supported format
    if (
      (formatSupport.avif && src.includes('.jpg')) ||
      src.includes('.jpeg') ||
      src.includes('.png')
    ) {
      return `${pathWithoutExt}.avif`;
    }

    if (
      formatSupport.webp &&
      (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png'))
    ) {
      return `${pathWithoutExt}.webp`;
    }

    return src; // Fallback to original
  }

  private static showBlurPlaceholder(container: HTMLElement, blurDataURL: string): void {
    container.style.backgroundImage = `url(${blurDataURL})`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    container.style.filter = 'blur(10px)';
    container.style.transition = 'filter 0.3s ease';
  }

  private static applyLoadedImage(
    container: HTMLElement,
    img: HTMLImageElement,
    progressive?: boolean
  ): void {
    if (progressive) {
      // Smooth transition from blur to sharp image
      container.style.backgroundImage = `url(${img.src})`;
      container.style.filter = 'blur(0px)';

      // Remove blur after transition
      setTimeout(() => {
        container.style.filter = '';
      }, 300);
    } else {
      // Direct image application
      const imgElement = container.querySelector('img') || document.createElement('img');
      imgElement.src = img.src;
      imgElement.alt = container.getAttribute('data-alt') || '';

      if (!container.contains(imgElement)) {
        container.appendChild(imgElement);
      }
    }
  }

  /**
   * Cleanup observers when no longer needed
   */
  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.loadedImages.clear();
  }
}

// ============================================================================
// ENHANCED PRELOADING STRATEGIES
// ============================================================================

/**
 * Enhanced preloading with connection awareness and priority management
 */
export class EnhancedImagePreloader {
  private static preloadQueue: Array<{ src: string; priority: 'high' | 'medium' | 'low' }> = [];
  private static isProcessing = false;
  private static connectionAware = ConnectionAwareLoader.getInstance();

  static addToQueue(src: string, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    // Avoid duplicates
    if (this.preloadQueue.some(item => item.src === src)) {
      return;
    }

    this.preloadQueue.push({ src, priority });
    this.processQueue();
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessing || this.preloadQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    // Sort by priority
    this.preloadQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    while (this.preloadQueue.length > 0) {
      const item = this.preloadQueue.shift()!;

      if (this.connectionAware.shouldPreload(item.priority)) {
        // eslint-disable-next-line no-await-in-loop
        await this.preloadSingle(item.src);
      }

      // Add small delay to avoid blocking the main thread
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => {
        setTimeout(resolve, 10);
        return;
      });
    }

    this.isProcessing = false;
  }

  private static async preloadSingle(src: string): Promise<void> {
    try {
      const formatSupport = await FormatSupportCache.getInstance().getFormatSupport();
      const optimizedSrc = this.getOptimalSrc(src, formatSupport);

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;

      // Add format-specific type
      if (optimizedSrc.endsWith('.avif')) {
        link.type = 'image/avif';
      } else if (optimizedSrc.endsWith('.webp')) {
        link.type = 'image/webp';
      }

      document.head.appendChild(link);
      logger.info(`Preloaded optimized image: ${optimizedSrc}`, 'EnhancedImagePreloader');
    } catch (_error) {
      logger.error(`Failed to preload image: ${src}`, _error as Error, 'EnhancedImagePreloader');
    }
  }

  private static getOptimalSrc(src: string, formatSupport: FormatSupport): string {
    const pathWithoutExt = src.replace(/\.[^/.]+$/, '');

    if (formatSupport.avif) {
      return `${pathWithoutExt}.avif`;
    }

    if (formatSupport.webp) {
      return `${pathWithoutExt}.webp`;
    }

    return src;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  ProgressiveImageLoader,
  EnhancedImagePreloader,
  FormatSupportCache,
  ConnectionAwareLoader,
};
