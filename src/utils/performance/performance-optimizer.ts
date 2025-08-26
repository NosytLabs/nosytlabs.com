/**
 * Performance Optimization Utility
 * Handles lazy loading, code splitting, resource optimization, and performance monitoring
 */

export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableResourceHints: boolean;
  enableServiceWorker: boolean;
  criticalResourceTimeout: number;
  lazyLoadingThreshold: number;
}

export interface ResourceHint {
  href: string;
  as?: string;
  type?: string;
  crossorigin?: string;
}

export interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  enableNativeLazyLoading?: boolean;
}

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private config: PerformanceConfig;
  private intersectionObserver: IntersectionObserver | null = null;
  private resourceHints: Set<string> = new Set();
  private performanceEntries: PerformanceEntry[] = [];

  private constructor() {
    this.config = {
      enableLazyLoading: true,
      enableImageOptimization: true,
      enableResourceHints: true,
      enableServiceWorker: false,
      criticalResourceTimeout: 3000,
      lazyLoadingThreshold: 0.1
    };

    this.initialize();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Initialize performance optimization features
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    // Setup lazy loading
    if (this.config.enableLazyLoading) {
      this.setupLazyLoading();
    }

    // Setup resource hints
    if (this.config.enableResourceHints) {
      this.setupResourceHints();
    }

    // Setup image optimization
    if (this.config.enableImageOptimization) {
      this.setupImageOptimization();
    }

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.performanceEntries.push(...entries);
        
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.analyzeNavigationTiming(entry as PerformanceNavigationTiming);
          } else if (entry.entryType === 'resource') {
            this.analyzeResourceTiming(entry as PerformanceResourceTiming);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported');
      }
    }
  }

  /**
   * Setup lazy loading for images and iframes
   */
  private setupLazyLoading(options: LazyLoadOptions = {}): void {
    const {
      threshold = this.config.lazyLoadingThreshold,
      rootMargin = '50px',
      enableNativeLazyLoading = true
    } = options;

    // Use native lazy loading if supported and enabled
    if (enableNativeLazyLoading && 'loading' in HTMLImageElement.prototype) {
      this.enableNativeLazyLoading();
      return;
    }

    // Fallback to Intersection Observer
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadLazyElement(entry.target as HTMLElement);
              this.intersectionObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold, rootMargin }
      );

      // Observe existing lazy elements
      this.observeLazyElements();
    }
  }

  /**
   * Enable native lazy loading for images
   */
  private enableNativeLazyLoading(): void {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const image = img as HTMLImageElement;
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.loading = 'lazy';
        delete image.dataset.src;
      }
    });
  }

  /**
   * Observe lazy elements
   */
  private observeLazyElements(): void {
    const lazyElements = document.querySelectorAll('[data-src], [data-srcset]');
    lazyElements.forEach(element => {
      this.intersectionObserver?.observe(element);
    });
  }

  /**
   * Load lazy element
   */
  private loadLazyElement(element: HTMLElement): void {
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        delete img.dataset.srcset;
      }
    } else if (element.tagName === 'IFRAME') {
      const iframe = element as HTMLIFrameElement;
      if (iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        delete iframe.dataset.src;
      }
    }

    element.classList.remove('lazy');
    element.classList.add('loaded');
  }

  /**
   * Setup resource hints
   */
  private setupResourceHints(): void {
    // Preload critical resources
    this.preloadCriticalResources();

    // Setup prefetch for likely navigation
    this.setupPrefetch();
  }

  /**
   * Preload critical resources
   */
  private preloadCriticalResources(): void {
    const criticalResources: ResourceHint[] = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/css/critical.css', as: 'style' }
    ];

    criticalResources.forEach(resource => {
      this.addResourceHint('preload', resource);
    });
  }

  /**
   * Setup prefetch for likely resources
   */
  private setupPrefetch(): void {
    // Prefetch on hover for navigation links
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.hostname === window.location.hostname) {
        this.prefetchPage(link.href);
      }
    });

    // Prefetch on focus for keyboard navigation
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        if (link.hostname === window.location.hostname) {
          this.prefetchPage(link.href);
        }
      }
    });
  }

  /**
   * Add resource hint to document head
   */
  private addResourceHint(rel: string, resource: ResourceHint): void {
    const key = `${rel}:${resource.href}`;
    if (this.resourceHints.has(key)) return;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = resource.href;
    
    if (resource.as) link.setAttribute('as', resource.as);
    if (resource.type) link.setAttribute('type', resource.type);
    if (resource.crossorigin) link.setAttribute('crossorigin', resource.crossorigin);

    document.head.appendChild(link);
    this.resourceHints.add(key);
  }

  /**
   * Prefetch page resources
   */
  private prefetchPage(url: string): void {
    this.addResourceHint('prefetch', { href: url });
  }

  /**
   * Setup image optimization
   */
  private setupImageOptimization(): void {
    // Convert images to modern formats if supported
    this.convertToModernFormats();

    // Setup responsive images
    this.setupResponsiveImages();
  }

  /**
   * Convert images to modern formats
   */
  private convertToModernFormats(): void {
    const images = document.querySelectorAll('img[data-optimize]');
    
    images.forEach(img => {
      const image = img as HTMLImageElement;
      const supportsWebP = this.supportsWebP();
      const supportsAVIF = this.supportsAVIF();
      
      if (image.dataset.optimize) {
        let optimizedSrc = image.src;
        
        if (supportsAVIF) {
          optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (supportsWebP) {
          optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        
        // Test if optimized version exists
        this.testImageExists(optimizedSrc).then(exists => {
          if (exists) {
            image.src = optimizedSrc;
          }
        });
      }
    });
  }

  /**
   * Setup responsive images
   */
  private setupResponsiveImages(): void {
    const images = document.querySelectorAll('img[data-responsive]');
    
    images.forEach(img => {
      const image = img as HTMLImageElement;
      if (image.dataset.responsive) {
        const sizes = this.generateSizes();
        const srcset = this.generateSrcSet(image.src);
        
        image.sizes = sizes;
        image.srcset = srcset;
      }
    });
  }

  /**
   * Generate sizes attribute for responsive images
   */
  private generateSizes(): string {
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }

  /**
   * Generate srcset for responsive images
   */
  private generateSrcSet(src: string): string {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => {
        const responsiveSrc = src.replace(/\.(jpg|jpeg|png|webp|avif)$/i, `_${width}w.$1`);
        return `${responsiveSrc} ${width}w`;
      })
      .join(', ');
  }

  /**
   * Check WebP support
   */
  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  /**
   * Check AVIF support
   */
  private supportsAVIF(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * Test if image exists
   */
  private testImageExists(src: string): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.measureLCP();

    // First Input Delay (FID)
    this.measureFID();

    // Cumulative Layout Shift (CLS)
    this.measureCLS();

    // First Contentful Paint (FCP)
    this.measureFCP();
  }

  /**
   * Measure Largest Contentful Paint
   */
  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
      if (lastEntry && lastEntry.startTime !== undefined) {
        // Performance monitoring: LCP recorded
        
        // Report to analytics if needed
        this.reportMetric('LCP', lastEntry.startTime);
      }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP measurement not supported');
      }
    }
  }

  /**
   * Measure First Input Delay
   */
  private measureFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          // Type assertion for PerformanceEventTiming which has processingStart
          const eventEntry = entry as any;
          if (eventEntry.processingStart !== undefined) {
            const fid = eventEntry.processingStart - entry.startTime;
            // Performance monitoring: FID recorded
            
            // Report to analytics if needed
            this.reportMetric('FID', fid);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID measurement not supported');
      }
    }
  }

  /**
   * Measure Cumulative Layout Shift
   */
  private measureCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        // Performance monitoring: CLS recorded
        
        // Report to analytics if needed
        this.reportMetric('CLS', clsValue);
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS measurement not supported');
      }
    }
  }

  /**
   * Measure First Contentful Paint
   */
  private measureFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            // Performance monitoring: FCP recorded
            
            // Report to analytics if needed
            this.reportMetric('FCP', entry.startTime);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP measurement not supported');
      }
    }
  }

  /**
   * Analyze navigation timing
   */
  private analyzeNavigationTiming(entry: PerformanceNavigationTiming): void {
    // Calculate timing metrics
    const dns = entry.domainLookupEnd - entry.domainLookupStart;
    const tcp = entry.connectEnd - entry.connectStart;
    const ssl = entry.connectEnd - entry.secureConnectionStart;
    const ttfb = entry.responseStart - entry.requestStart;
    const download = entry.responseEnd - entry.responseStart;
    const domParse = entry.domContentLoadedEventStart - entry.responseEnd;
    const domReady = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const load = entry.loadEventEnd - entry.loadEventStart;

    // Performance monitoring: Navigation timing recorded
    // Suppress unused variable warnings
    void dns; void tcp; void ssl; void ttfb; void download; void domParse; void domReady; void load;
  }

  /**
   * Analyze resource timing
   */
  private analyzeResourceTiming(entry: PerformanceResourceTiming): void {
    const duration = entry.responseEnd - entry.startTime;
    
    if (duration > this.config.criticalResourceTimeout) {
      console.warn(`Slow resource detected: ${entry.name} (${duration}ms)`);
    }
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(name: string, value: number): void {
    // Report to analytics or monitoring service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Example: Google Analytics 4
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
      });
    }
    // Suppress unused parameter warning
    void name;
    void value;
  }

  /**
   * Public API methods
   */

  /**
   * Optimize image element
   */
  optimizeImage(img: HTMLImageElement, options: ImageOptimizationOptions = {}): void {
    const {
      quality = 85,
      format = 'auto',
      sizes,
      loading = 'lazy'
    } = options;

    // Set loading attribute
    img.loading = loading;

    // Set sizes if provided
    if (sizes) {
      img.sizes = sizes;
    }

    // Generate srcset for responsive images
    if (!img.srcset) {
      img.srcset = this.generateSrcSet(img.src);
    }

    // Add optimization data attribute
    img.dataset.optimize = 'true';
    
    // Suppress unused parameter warnings
    void quality;
    void format;
  }

  /**
   * Add lazy loading to element
   */
  addLazyLoading(element: HTMLElement): void {
    if (element.tagName === 'IMG') {
      const img = element as HTMLImageElement;
      if (img.src) {
        img.dataset.src = img.src;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      }
    }

    element.classList.add('lazy');
    this.intersectionObserver?.observe(element);
  }

  /**
   * Preload resource
   */
  preloadResource(href: string, as?: string, type?: string): void {
    const resource: ResourceHint = { href };
    if (as) resource.as = as;
    if (type) resource.type = type;
    this.addResourceHint('preload', resource);
  }

  /**
   * Prefetch resource
   */
  prefetchResource(href: string): void {
    this.addResourceHint('prefetch', { href });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceEntry[] {
    return [...this.performanceEntries];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions
export const optimizeImage = (img: HTMLImageElement, options?: ImageOptimizationOptions): void => {
  performanceOptimizer.optimizeImage(img, options);
};

export const addLazyLoading = (element: HTMLElement): void => {
  performanceOptimizer.addLazyLoading(element);
};

export const preloadResource = (href: string, as?: string, type?: string): void => {
  performanceOptimizer.preloadResource(href, as, type);
};

export const prefetchResource = (href: string): void => {
  performanceOptimizer.prefetchResource(href);
};