// Resource Optimizer - Advanced resource loading and optimization
class ResourceOptimizer {
  constructor() {
    this.loadedResources = new Set();
    this.pendingResources = new Map();
    this.resourceQueue = [];
    this.isProcessing = false;
    
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupResourceHints();
    this.optimizeExistingResources();
    this.setupPerformanceObserver();
  }
  
  // Setup intersection observer for lazy loading
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      
      // Observe all lazy-loadable elements
      this.observeLazyElements();
    }
  }
  
  observeLazyElements() {
    // Images
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    lazyImages.forEach(img => this.observer.observe(img));
    
    // Scripts
    const lazyScripts = document.querySelectorAll('script[data-src]');
    lazyScripts.forEach(script => this.observer.observe(script));
    
    // Iframes
    const lazyIframes = document.querySelectorAll('iframe[data-src]');
    lazyIframes.forEach(iframe => this.observer.observe(iframe));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadResource(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  // Load resource with priority and error handling
  async loadResource(element) {
    const src = element.dataset.src || element.src;
    const priority = element.dataset.priority || 'low';
    
    if (this.loadedResources.has(src)) {
      return;
    }
    
    try {
      this.loadedResources.add(src);
      
      if (element.tagName === 'IMG') {
        await this.loadImage(element, src);
      } else if (element.tagName === 'SCRIPT') {
        await this.loadScript(element, src);
      } else if (element.tagName === 'IFRAME') {
        await this.loadIframe(element, src);
      }
      
      // Dispatch loaded event
      element.dispatchEvent(new CustomEvent('resourceLoaded', {
        detail: { src, priority }
      }));
      
    } catch (error) {
      console.error(`Failed to load resource: ${src}`, error);
      element.dispatchEvent(new CustomEvent('resourceError', {
        detail: { src, error }
      }));
    }
  }
  
  // Optimized image loading
  async loadImage(img, src) {
    return new Promise((resolve, reject) => {
      const newImg = new Image();
      
      newImg.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        resolve();
      };
      
      newImg.onerror = reject;
      newImg.src = src;
    });
  }
  
  // Optimized script loading
  async loadScript(scriptElement, src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = scriptElement.hasAttribute('defer');
      
      script.onload = resolve;
      script.onerror = reject;
      
      // Copy attributes
      Array.from(scriptElement.attributes).forEach(attr => {
        if (attr.name !== 'data-src') {
          script.setAttribute(attr.name, attr.value);
        }
      });
      
      document.head.appendChild(script);
    });
  }
  
  // Optimized iframe loading
  async loadIframe(iframe, src) {
    iframe.src = src;
    iframe.classList.add('loaded');
  }
  
  // Setup resource hints for better performance
  setupResourceHints() {
    // Preconnect to external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com',
      'https://vercel-insights.com'
    ];
    
    externalDomains.forEach(domain => {
      this.addResourceHint('preconnect', domain);
    });
    
    // DNS prefetch for other domains
    const dnsPrefetchDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];
    
    dnsPrefetchDomains.forEach(domain => {
      this.addResourceHint('dns-prefetch', domain);
    });
  }
  
  addResourceHint(rel, href) {
    if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
      return; // Already exists
    }
    
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    
    if (rel === 'preconnect') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }
  
  // Optimize existing resources
  optimizeExistingResources() {
    // Add loading="lazy" to images below the fold
    this.optimizeImages();
    
    // Optimize third-party scripts
    this.optimizeThirdPartyScripts();
    
    // Optimize CSS delivery
    this.optimizeCSSDelivery();
  }
  
  optimizeImages() {
    const images = document.querySelectorAll('img:not([loading])');
    
    images.forEach((img, index) => {
      // First few images should load eagerly
      if (index < 3) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      } else {
        img.loading = 'lazy';
      }
      
      // Add error handling
      img.addEventListener('error', () => {
        img.src = '/images/placeholder.svg';
        img.alt = 'Image failed to load';
      });
    });
  }
  
  optimizeThirdPartyScripts() {
    // Delay third-party scripts until user interaction
    const thirdPartyScripts = document.querySelectorAll('script[src*="google"], script[src*="facebook"], script[src*="twitter"]');
    
    thirdPartyScripts.forEach(script => {
      if (!script.dataset.optimized) {
        script.dataset.optimized = 'true';
        this.delayScript(script);
      }
    });
  }
  
  delayScript(script) {
    const delayedSrc = script.src;
    script.removeAttribute('src');
    
    const loadScript = () => {
      script.src = delayedSrc;
      document.removeEventListener('scroll', loadScript);
      document.removeEventListener('click', loadScript);
      document.removeEventListener('keydown', loadScript);
    };
    
    // Load on first user interaction
    document.addEventListener('scroll', loadScript, { once: true, passive: true });
    document.addEventListener('click', loadScript, { once: true });
    document.addEventListener('keydown', loadScript, { once: true });
    
    // Fallback: load after 5 seconds
    setTimeout(loadScript, 5000);
  }
  
  optimizeCSSDelivery() {
    // Convert render-blocking CSS to non-blocking
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([media])');
    
    stylesheets.forEach(link => {
      if (!link.dataset.optimized) {
        link.dataset.optimized = 'true';
        
        // Use media="print" trick to make non-blocking
        link.media = 'print';
        link.onload = () => {
          link.media = 'all';
        };
      }
    });
  }
  
  // Setup performance observer
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.analyzeResourcePerformance(entry);
        });
      });
      
      resourceObserver.observe({ entryTypes: ['resource'] });
      
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.handleLongTask(entry);
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }
  
  analyzeResourcePerformance(entry) {
    const duration = entry.duration;
    const size = entry.transferSize || 0;
    
    // Flag slow resources
    if (duration > 1000) {
      console.warn(`Slow resource detected: ${entry.name} (${duration}ms)`);
    }
    
    // Flag large resources
    if (size > 500000) { // 500KB
      console.warn(`Large resource detected: ${entry.name} (${(size / 1024).toFixed(2)}KB)`);
    }
    
    // Track resource efficiency
    if (size > 0 && duration > 0) {
      const efficiency = size / duration; // bytes per ms
      if (efficiency < 100) {
        console.warn(`Inefficient resource: ${entry.name} (${efficiency.toFixed(2)} bytes/ms)`);
      }
    }
  }
  
  handleLongTask(entry) {
    console.warn(`Long task detected: ${entry.duration}ms`);
    
    // Break up long tasks if possible
    if (entry.duration > 50) {
      this.scheduleTaskBreaking();
    }
  }
  
  scheduleTaskBreaking() {
    // Use scheduler API if available
    if ('scheduler' in window && 'postTask' in window.scheduler) {
      window.scheduler.postTask(() => {
        // Break up tasks
      }, { priority: 'background' });
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Break up tasks during idle time
      });
    }
  }
  
  // Public API methods
  preloadResource(url, type = 'fetch') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'script') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }
  
  prefetchResource(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  
  // Get performance metrics
  getMetrics() {
    return {
      loadedResources: this.loadedResources.size,
      pendingResources: this.pendingResources.size,
      queueLength: this.resourceQueue.length
    };
  }
  
  // Clean up
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize resource optimizer
const resourceOptimizer = new ResourceOptimizer();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResourceOptimizer;
} else if (typeof window !== 'undefined') {
  window.ResourceOptimizer = ResourceOptimizer;
  window.resourceOptimizer = resourceOptimizer;
}
