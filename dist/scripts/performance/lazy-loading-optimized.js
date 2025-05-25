// Advanced Lazy Loading Implementation
class LazyLoadingManager {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '50px',
      enableNativeLazyLoading: true,
      fallbackDelay: 300,
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    };
    
    this.observer = null;
    this.loadedElements = new WeakSet();
    this.failedElements = new WeakMap();
    this.loadingElements = new WeakSet();
    
    this.init();
  }
  
  init() {
    // Check for native lazy loading support
    if (this.options.enableNativeLazyLoading && 'loading' in HTMLImageElement.prototype) {
      this.setupNativeLazyLoading();
    } else {
      this.setupIntersectionObserver();
    }
    
    // Setup mutation observer for dynamically added content
    this.setupMutationObserver();
    
    // Process existing elements
    this.processExistingElements();
  }
  
  setupNativeLazyLoading() {
    // Use native lazy loading for supported browsers
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      
      // Move data-src to src for native lazy loading
      if (img.dataset.src && !img.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
      
      this.setupImageErrorHandling(img);
    });
    
    // Still use intersection observer for other elements
    this.setupIntersectionObserver();
  }
  
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: this.options.threshold,
          rootMargin: this.options.rootMargin
        }
      );
    } else {
      // Fallback for older browsers
      this.setupFallbackLoading();
    }
  }
  
  setupMutationObserver() {
    if ('MutationObserver' in window) {
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processElement(node);
              
              // Process child elements
              const lazyElements = node.querySelectorAll('[data-src], [data-lazy]');
              lazyElements.forEach(element => this.processElement(element));
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
  
  processExistingElements() {
    const lazyElements = document.querySelectorAll('[data-src], [data-lazy]');
    lazyElements.forEach(element => this.processElement(element));
  }
  
  processElement(element) {
    if (this.loadedElements.has(element) || this.loadingElements.has(element)) {
      return;
    }
    
    if (this.observer) {
      this.observer.observe(element);
    } else {
      // Fallback: load immediately
      this.loadElement(element);
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  async loadElement(element) {
    if (this.loadingElements.has(element) || this.loadedElements.has(element)) {
      return;
    }
    
    this.loadingElements.add(element);
    element.classList.add('lazy-loading');
    
    try {
      await this.loadByType(element);
      this.onLoadSuccess(element);
    } catch (error) {
      this.onLoadError(element, error);
    }
  }
  
  async loadByType(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'img':
        return this.loadImage(element);
      case 'iframe':
        return this.loadIframe(element);
      case 'video':
        return this.loadVideo(element);
      case 'audio':
        return this.loadAudio(element);
      case 'source':
        return this.loadSource(element);
      default:
        if (element.dataset.lazy) {
          return this.loadCustomElement(element);
        }
        throw new Error(`Unsupported element type: ${tagName}`);
    }
  }
  
  loadImage(img) {
    return new Promise((resolve, reject) => {
      const src = img.dataset.src || img.dataset.lazy;
      if (!src) {
        reject(new Error('No source URL found'));
        return;
      }
      
      const tempImg = new Image();
      
      tempImg.onload = () => {
        // Update src and srcset
        img.src = src;
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          delete img.dataset.srcset;
        }
        
        // Handle responsive images
        if (img.dataset.sizes) {
          img.sizes = img.dataset.sizes;
          delete img.dataset.sizes;
        }
        
        delete img.dataset.src;
        delete img.dataset.lazy;
        
        resolve();
      };
      
      tempImg.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Start loading
      tempImg.src = src;
      
      // Copy srcset for responsive images
      if (img.dataset.srcset) {
        tempImg.srcset = img.dataset.srcset;
      }
    });
  }
  
  loadIframe(iframe) {
    return new Promise((resolve, reject) => {
      const src = iframe.dataset.src || iframe.dataset.lazy;
      if (!src) {
        reject(new Error('No source URL found'));
        return;
      }
      
      iframe.onload = resolve;
      iframe.onerror = () => reject(new Error(`Failed to load iframe: ${src}`));
      
      iframe.src = src;
      delete iframe.dataset.src;
      delete iframe.dataset.lazy;
    });
  }
  
  onLoadSuccess(element) {
    this.loadingElements.delete(element);
    this.loadedElements.add(element);
    
    element.classList.remove('lazy-loading');
    element.classList.add('lazy-loaded');
    
    // Dispatch custom event
    element.dispatchEvent(new CustomEvent('lazyLoaded', {
      detail: { element }
    }));
    
    // Remove failed attempts counter
    this.failedElements.delete(element);
  }
  
  onLoadError(element, error) {
    this.loadingElements.delete(element);
    
    element.classList.remove('lazy-loading');
    element.classList.add('lazy-error');
    
    console.warn('Lazy loading failed:', error);
    
    // Retry logic
    const attempts = this.failedElements.get(element) || 0;
    if (attempts < this.options.retryAttempts) {
      this.failedElements.set(element, attempts + 1);
      
      setTimeout(() => {
        element.classList.remove('lazy-error');
        this.loadElement(element);
      }, this.options.retryDelay * (attempts + 1));
    } else {
      // Final failure
      element.dispatchEvent(new CustomEvent('lazyLoadError', {
        detail: { element, error }
      }));
      
      // Set fallback content
      this.setFallbackContent(element);
    }
  }
  
  setFallbackContent(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'img':
        if (element.dataset.fallback) {
          element.src = element.dataset.fallback;
        } else {
          element.src = '/images/placeholder.svg';
          element.alt = 'Image failed to load';
        }
        break;
      case 'iframe':
        element.innerHTML = '<p>Content failed to load</p>';
        break;
      default:
        if (element.dataset.fallback) {
          element.innerHTML = element.dataset.fallback;
        }
    }
  }
  
  setupImageErrorHandling(img) {
    img.addEventListener('error', () => {
      if (!img.dataset.errorHandled) {
        img.dataset.errorHandled = 'true';
        this.setFallbackContent(img);
      }
    });
  }
  
  setupFallbackLoading() {
    // Fallback for browsers without IntersectionObserver
    const lazyElements = document.querySelectorAll('[data-src], [data-lazy]');
    
    const loadElementsOnScroll = () => {
      lazyElements.forEach(element => {
        if (this.isElementInViewport(element)) {
          this.loadElement(element);
        }
      });
    };
    
    // Load on scroll with throttling
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          loadElementsOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', throttledScroll, { passive: true });
    
    // Initial load
    loadElementsOnScroll();
  }
  
  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
      rect.top >= -50 &&
      rect.left >= -50 &&
      rect.bottom <= windowHeight + 50 &&
      rect.right <= windowWidth + 50
    );
  }
  
  // Public API
  loadAll() {
    const lazyElements = document.querySelectorAll('[data-src], [data-lazy]');
    lazyElements.forEach(element => this.loadElement(element));
  }
  
  refresh() {
    this.processExistingElements();
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize lazy loading
const lazyLoadingManager = new LazyLoadingManager({
  threshold: 0.1,
  rootMargin: '50px',
  enableNativeLazyLoading: true,
  retryAttempts: 2,
  retryDelay: 1000
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoadingManager;
} else if (typeof window !== 'undefined') {
  window.LazyLoadingManager = LazyLoadingManager;
  window.lazyLoadingManager = lazyLoadingManager;
}
