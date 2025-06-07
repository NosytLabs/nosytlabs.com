/**
 * Image Optimizer 2025 for NosytLabs
 * Advanced image optimization for Core Web Vitals
 * Features: WebP/AVIF conversion, lazy loading, responsive images, and performance monitoring
 */

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  lazy?: boolean;
  responsive?: boolean;
  placeholder?: boolean;
  priority?: boolean;
  sizes?: string;
}

export interface ImageMetrics {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  loadTime: number;
  format: string;
}

class ImageOptimizer2025 {
  private observer: IntersectionObserver | null = null;
  private loadedImages = new Set<HTMLImageElement>();
  private metrics: Map<string, ImageMetrics> = new Map();
  
  constructor() {
    this.init();
  }

  private init(): void {
    this.setupIntersectionObserver();
    this.setupImageErrorHandling();
    this.setupPerformanceTracking();
    this.optimizeExistingImages();
  }

  private setupIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, loading all images immediately');
      this.loadAllImages();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );
  }

  private setupImageErrorHandling(): void {
    document.addEventListener('error', (event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        this.handleImageError(target);
      }
    }, true);
  }

  private setupPerformanceTracking(): void {
    // Track image loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'img') {
            this.trackImagePerformance(entry);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Performance tracking not supported');
      }
    }
  }

  private optimizeExistingImages(): void {
    // Optimize images already in the DOM
    document.querySelectorAll('img').forEach((img) => {
      this.optimizeImage(img);
    });

    // Watch for new images added to DOM
    if ('MutationObserver' in window) {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const images = element.tagName === 'IMG' 
                ? [element as HTMLImageElement]
                : Array.from(element.querySelectorAll('img'));
              
              images.forEach((img) => this.optimizeImage(img));
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  public optimizeImage(img: HTMLImageElement, options: ImageOptimizationOptions = {}): void {
    const {
      quality = 85,
      format = 'auto',
      lazy = true,
      responsive = true,
      placeholder = true,
      priority = false,
      sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    } = options;

    // Skip if already optimized
    if (img.dataset.optimized === 'true') return;

    // Set up responsive images
    if (responsive) {
      this.setupResponsiveImage(img, sizes);
    }

    // Set up modern image formats
    this.setupModernFormats(img, format, quality);

    // Set up lazy loading
    if (lazy && !priority) {
      this.setupLazyLoading(img);
    }

    // Set up placeholder
    if (placeholder) {
      this.setupPlaceholder(img);
    }

    // Mark as optimized
    img.dataset.optimized = 'true';
  }

  private setupResponsiveImage(img: HTMLImageElement, sizes: string): void {
    if (!img.sizes) {
      img.sizes = sizes;
    }

    // Generate srcset if not present
    if (!img.srcset && img.src) {
      const srcset = this.generateSrcSet(img.src);
      if (srcset) {
        img.srcset = srcset;
      }
    }
  }

  private generateSrcSet(src: string): string {
    const widths = [320, 640, 768, 1024, 1280, 1920];
    const srcsetEntries: string[] = [];

    widths.forEach((width) => {
      const optimizedSrc = this.getOptimizedSrc(src, width);
      srcsetEntries.push(`${optimizedSrc} ${width}w`);
    });

    return srcsetEntries.join(', ');
  }

  private getOptimizedSrc(src: string, width?: number): string {
    // This would integrate with your image optimization service
    // For now, we'll assume WebP versions exist
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    if (width) {
      const extension = webpSrc.split('.').pop();
      const baseName = webpSrc.replace(`.${extension}`, '');
      return `${baseName}-${width}w.${extension}`;
    }
    
    return webpSrc;
  }

  private setupModernFormats(img: HTMLImageElement, format: string, quality: number): void {
    const src = img.src || img.dataset.src;
    if (!src) return;

    // Create picture element for modern formats
    if (!img.parentElement || img.parentElement.tagName !== 'PICTURE') {
      const picture = document.createElement('picture');
      
      // Add AVIF source
      if (format === 'avif' || format === 'auto') {
        const avifSource = document.createElement('source');
        avifSource.srcset = this.convertToFormat(src, 'avif', quality);
        avifSource.type = 'image/avif';
        picture.appendChild(avifSource);
      }

      // Add WebP source
      if (format === 'webp' || format === 'auto') {
        const webpSource = document.createElement('source');
        webpSource.srcset = this.convertToFormat(src, 'webp', quality);
        webpSource.type = 'image/webp';
        picture.appendChild(webpSource);
      }

      // Move img into picture
      img.parentNode?.insertBefore(picture, img);
      picture.appendChild(img);
    }
  }

  private convertToFormat(src: string, format: 'webp' | 'avif', quality: number): string {
    // This would integrate with your image optimization service
    return src.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
  }

  private setupLazyLoading(img: HTMLImageElement): void {
    if (!this.observer) return;

    // Set up data-src for lazy loading
    if (img.src && !img.dataset.src) {
      img.dataset.src = img.src;
      img.src = this.generatePlaceholder(img);
    }

    // Set loading attribute
    img.loading = 'lazy';

    // Observe the image
    this.observer.observe(img);
  }

  private setupPlaceholder(img: HTMLImageElement): void {
    if (!img.dataset.placeholder) {
      img.dataset.placeholder = this.generatePlaceholder(img);
    }

    // Add blur-up effect
    img.classList.add('blur-up');
    
    // Set placeholder as background
    if (img.dataset.placeholder) {
      img.style.backgroundImage = `url(${img.dataset.placeholder})`;
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
    }
  }

  private generatePlaceholder(img: HTMLImageElement): string {
    // Generate a low-quality placeholder
    const width = img.width || 400;
    const height = img.height || 300;
    
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui">
          Loading...
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private loadImage(img: HTMLImageElement): void {
    const startTime = performance.now();
    const src = img.dataset.src;

    if (!src || this.loadedImages.has(img)) return;

    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
      
      // Remove placeholder background
      img.style.backgroundImage = '';
      
      this.loadedImages.add(img);
      this.observer?.unobserve(img);
      
      // Track performance
      const loadTime = performance.now() - startTime;
      this.trackImageLoad(img, loadTime);
      
      // Dispatch custom event
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { loadTime, src }
      }));
    };

    newImg.onerror = () => {
      this.handleImageError(img);
    };

    newImg.src = src;
  }

  private loadAllImages(): void {
    document.querySelectorAll('img[data-src]').forEach((img) => {
      this.loadImage(img as HTMLImageElement);
    });
  }

  private handleImageError(img: HTMLImageElement): void {
    img.classList.add('error');
    
    // Try fallback formats
    const src = img.src || img.dataset.src;
    if (src) {
      if (src.includes('.avif')) {
        img.src = src.replace('.avif', '.webp');
      } else if (src.includes('.webp')) {
        img.src = src.replace('.webp', '.jpg');
      } else {
        // Show error placeholder
        img.src = this.generateErrorPlaceholder();
      }
    }
  }

  private generateErrorPlaceholder(): string {
    const svg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#dc2626" font-family="system-ui">
          Failed to load
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private trackImagePerformance(entry: PerformanceEntry): void {
    const resourceEntry = entry as PerformanceResourceTiming;
    
    this.metrics.set(resourceEntry.name, {
      originalSize: resourceEntry.transferSize || 0,
      optimizedSize: resourceEntry.encodedBodySize || 0,
      compressionRatio: resourceEntry.transferSize 
        ? (resourceEntry.encodedBodySize / resourceEntry.transferSize) * 100 
        : 0,
      loadTime: resourceEntry.duration,
      format: this.getImageFormat(resourceEntry.name)
    });
  }

  private trackImageLoad(img: HTMLImageElement, loadTime: number): void {
    const src = img.src;
    const existing = this.metrics.get(src);
    
    if (existing) {
      existing.loadTime = loadTime;
    } else {
      this.metrics.set(src, {
        originalSize: 0,
        optimizedSize: 0,
        compressionRatio: 0,
        loadTime,
        format: this.getImageFormat(src)
      });
    }
  }

  private getImageFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  public getMetrics(): Map<string, ImageMetrics> {
    return this.metrics;
  }

  public getPerformanceReport(): object {
    const metrics = Array.from(this.metrics.values());
    
    return {
      totalImages: metrics.length,
      averageLoadTime: metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length,
      totalSavings: metrics.reduce((sum, m) => sum + (m.originalSize - m.optimizedSize), 0),
      formatDistribution: this.getFormatDistribution(),
      loadedImages: this.loadedImages.size
    };
  }

  private getFormatDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    this.metrics.forEach((metric) => {
      distribution[metric.format] = (distribution[metric.format] || 0) + 1;
    });
    
    return distribution;
  }
}

// Initialize image optimizer
const imageOptimizer = new ImageOptimizer2025();

// Export for use in other modules
export { ImageOptimizer2025, imageOptimizer };

// Add CSS for image optimization effects
const style = document.createElement('style');
style.textContent = `
  .blur-up {
    filter: blur(5px);
    transition: filter 0.3s ease;
  }
  
  .blur-up.loaded {
    filter: blur(0);
  }
  
  img[loading="lazy"] {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  img[loading="lazy"].loaded {
    opacity: 1;
  }
  
  img.error {
    opacity: 0.5;
    filter: grayscale(100%);
  }
`;
document.head.appendChild(style);
