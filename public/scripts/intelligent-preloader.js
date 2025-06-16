/**
 * Intelligent Resource Preloader
 * Dynamically preloads resources based on user behavior and connection
 */

class IntelligentPreloader {
  constructor() {
    this.connectionInfo = this.getConnectionInfo();
    this.userBehavior = this.initUserBehavior();
    this.preloadQueue = new Set();
    
    this.init();
  }
  
  init() {
    // Only preload on good connections
    if (this.connectionInfo.effectiveType === '4g' || this.connectionInfo.effectiveType === '3g') {
      this.setupIntersectionObserver();
      this.setupHoverPreloading();
      this.setupIdlePreloading();
    }
  }
  
  getConnectionInfo() {
    if ('connection' in navigator) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        saveData: navigator.connection.saveData
      };
    }
    return { effectiveType: '4g', downlink: 10, saveData: false };
  }
  
  initUserBehavior() {
    return {
      hoveredLinks: new Set(),
      scrollDepth: 0,
      timeOnPage: Date.now()
    };
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.preloadNearbyResources(entry.target);
        }
      });
    }, { rootMargin: '50px' });
    
    // Observe sections that might need resources
    document.querySelectorAll('section, .hero, .services, .projects').forEach(el => {
      observer.observe(el);
    });
  }
  
  setupHoverPreloading() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.tagName === 'A' && e.target.href) {
        this.preloadLink(e.target.href);
      }
    });
  }
  
  setupIdlePreloading() {
    // Preload low-priority resources when browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadLowPriorityResources();
      });
    } else {
      setTimeout(() => {
        this.preloadLowPriorityResources();
      }, 2000);
    }
  }
  
  preloadLink(href) {
    if (this.preloadQueue.has(href) || this.connectionInfo.saveData) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    this.preloadQueue.add(href);
  }
  
  preloadNearbyResources(element) {
    // Preload images in nearby sections
    const images = element.querySelectorAll('img[data-src], [data-background]');
    images.forEach(img => {
      if (img.dataset.src && !this.preloadQueue.has(img.dataset.src)) {
        this.preloadResource(img.dataset.src, 'image');
      }
    });
  }
  
  preloadLowPriorityResources() {
    const lowPriorityResources = [
      '/styles/features.css',
      '/scripts/features.js',
      '/images/decorative-bg.webp'
    ];
    
    lowPriorityResources.forEach(resource => {
      if (!this.preloadQueue.has(resource)) {
        this.preloadResource(resource, this.getResourceType(resource));
      }
    });
  }
  
  preloadResource(href, as) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    if (as) link.as = as;
    document.head.appendChild(link);
    
    this.preloadQueue.add(href);
  }
  
  getResourceType(url) {
    if (url.endsWith('.css')) return 'style';
    if (url.endsWith('.js')) return 'script';
    if (url.match(/\.(jpg|jpeg|png|webp|avif|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return 'fetch';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new IntelligentPreloader();
  });
} else {
  new IntelligentPreloader();
}