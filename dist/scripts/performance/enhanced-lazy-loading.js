/**
 * Enhanced Lazy Loading Implementation for NosytLabs
 * Supports images, videos, iframes, and components with intersection observer
 */

class EnhancedLazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px 0px',
      threshold: 0.01,
      enableBlurUp: true,
      enableFadeIn: true,
      retryAttempts: 3,
      retryDelay: 1000,
      ...options
    };

    this.observers = new Map();
    this.loadedElements = new Set();
    this.retryCount = new Map();

    this.init();
  }

  /**
   * Initialize lazy loading
   */
  init() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, loading all content immediately');
      this.loadAllContent();
      return;
    }

    this.createObservers();
    this.observeElements();
    this.setupEventListeners();

    console.log('✅ Enhanced lazy loading initialized');
  }

  /**
   * Create intersection observers for different content types
   */
  createObservers() {
    // Image observer
    this.observers.set('images', new IntersectionObserver(
      this.handleImageIntersection.bind(this),
      this.options
    ));

    // Video observer
    this.observers.set('videos', new IntersectionObserver(
      this.handleVideoIntersection.bind(this),
      this.options
    ));

    // Iframe observer (for embeds)
    this.observers.set('iframes', new IntersectionObserver(
      this.handleIframeIntersection.bind(this),
      this.options
    ));

    // Component observer (for heavy components)
    this.observers.set('components', new IntersectionObserver(
      this.handleComponentIntersection.bind(this),
      { ...this.options, rootMargin: '100px 0px' }
    ));
  }

  /**
   * Start observing elements
   */
  observeElements() {
    // Observe images
    document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
      if (!this.loadedElements.has(img)) {
        this.observers.get('images').observe(img);
        this.setupImagePlaceholder(img);
      }
    });

    // Observe videos
    document.querySelectorAll('video[data-src]').forEach(video => {
      if (!this.loadedElements.has(video)) {
        this.observers.get('videos').observe(video);
      }
    });

    // Observe iframes
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      if (!this.loadedElements.has(iframe)) {
        this.observers.get('iframes').observe(iframe);
      }
    });

    // Observe lazy components
    document.querySelectorAll('[data-lazy-component]').forEach(component => {
      if (!this.loadedElements.has(component)) {
        this.observers.get('components').observe(component);
      }
    });
  }

  /**
   * Handle image intersection
   */
  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observers.get('images').unobserve(entry.target);
      }
    });
  }

  /**
   * Handle video intersection
   */
  handleVideoIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadVideo(entry.target);
        this.observers.get('videos').unobserve(entry.target);
      }
    });
  }

  /**
   * Handle iframe intersection
   */
  handleIframeIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadIframe(entry.target);
        this.observers.get('iframes').unobserve(entry.target);
      }
    });
  }

  /**
   * Handle component intersection
   */
  handleComponentIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadComponent(entry.target);
        this.observers.get('components').unobserve(entry.target);
      }
    });
  }

  /**
   * Load image with error handling and retry logic
   */
  async loadImage(img) {
    const src = img.dataset.src || img.src;
    if (!src || this.loadedElements.has(img)) return;

    try {
      // Create new image for preloading
      const newImg = new Image();
      
      // Set up promise for loading
      const loadPromise = new Promise((resolve, reject) => {
        newImg.onload = resolve;
        newImg.onerror = reject;
        
        // Set timeout for loading
        setTimeout(() => reject(new Error('Image load timeout')), 10000);
      });

      // Start loading
      newImg.src = src;
      await loadPromise;

      // Apply loaded image
      if (img.dataset.src) {
        img.src = src;
        img.removeAttribute('data-src');
      }

      // Add fade-in effect
      if (this.options.enableFadeIn) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
      }

      // Remove blur effect if enabled
      if (this.options.enableBlurUp) {
        img.style.filter = 'none';
      }

      this.loadedElements.add(img);
      img.classList.add('lazy-loaded');

      // Dispatch custom event
      img.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));

    } catch (error) {
      console.warn('Failed to load image:', src, error);
      this.handleLoadError(img, 'image');
    }
  }

  /**
   * Load video
   */
  async loadVideo(video) {
    const src = video.dataset.src;
    if (!src || this.loadedElements.has(video)) return;

    try {
      video.src = src;
      video.removeAttribute('data-src');
      
      // Load video metadata
      video.load();
      
      this.loadedElements.add(video);
      video.classList.add('lazy-loaded');
      
      video.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
      
    } catch (error) {
      console.warn('Failed to load video:', src, error);
      this.handleLoadError(video, 'video');
    }
  }

  /**
   * Load iframe
   */
  async loadIframe(iframe) {
    const src = iframe.dataset.src;
    if (!src || this.loadedElements.has(iframe)) return;

    try {
      iframe.src = src;
      iframe.removeAttribute('data-src');
      
      this.loadedElements.add(iframe);
      iframe.classList.add('lazy-loaded');
      
      iframe.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
      
    } catch (error) {
      console.warn('Failed to load iframe:', src, error);
      this.handleLoadError(iframe, 'iframe');
    }
  }

  /**
   * Load component
   */
  async loadComponent(component) {
    const componentType = component.dataset.lazyComponent;
    if (!componentType || this.loadedElements.has(component)) return;

    try {
      // Show loading state
      component.innerHTML = '<div class="lazy-loading">Loading...</div>';
      
      // Dynamically import component
      const module = await import(`/scripts/components/${componentType}.js`);
      
      if (module.default && typeof module.default.render === 'function') {
        const content = await module.default.render(component.dataset);
        component.innerHTML = content;
      }
      
      this.loadedElements.add(component);
      component.classList.add('lazy-loaded');
      
      component.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
      
    } catch (error) {
      console.warn('Failed to load component:', componentType, error);
      component.innerHTML = '<div class="lazy-error">Failed to load content</div>';
    }
  }

  /**
   * Setup image placeholder with blur-up effect
   */
  setupImagePlaceholder(img) {
    if (!this.options.enableBlurUp) return;

    // Create low-quality placeholder
    const placeholder = img.dataset.placeholder;
    if (placeholder) {
      img.src = placeholder;
      img.style.filter = 'blur(5px)';
      img.style.transition = 'filter 0.3s ease-in-out';
    }
  }

  /**
   * Handle load errors with retry logic
   */
  handleLoadError(element, type) {
    const retryCount = this.retryCount.get(element) || 0;
    
    if (retryCount < this.options.retryAttempts) {
      this.retryCount.set(element, retryCount + 1);
      
      setTimeout(() => {
        console.log(`Retrying ${type} load (attempt ${retryCount + 1}):`, element);
        
        switch (type) {
          case 'image':
            this.loadImage(element);
            break;
          case 'video':
            this.loadVideo(element);
            break;
          case 'iframe':
            this.loadIframe(element);
            break;
        }
      }, this.options.retryDelay * (retryCount + 1));
    } else {
      // Max retries reached, show error state
      element.classList.add('lazy-error');
      
      if (type === 'image') {
        element.src = '/images/fallback-image.svg';
        element.alt = 'Failed to load image';
      }
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Re-observe new elements when DOM changes
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.observeNewElements(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.observeElements();
      }
    });
  }

  /**
   * Observe new elements added to DOM
   */
  observeNewElements(container) {
    // Images
    container.querySelectorAll?.('img[data-src], img[loading="lazy"]').forEach(img => {
      if (!this.loadedElements.has(img)) {
        this.observers.get('images').observe(img);
        this.setupImagePlaceholder(img);
      }
    });

    // Videos
    container.querySelectorAll?.('video[data-src]').forEach(video => {
      if (!this.loadedElements.has(video)) {
        this.observers.get('videos').observe(video);
      }
    });

    // Iframes
    container.querySelectorAll?.('iframe[data-src]').forEach(iframe => {
      if (!this.loadedElements.has(iframe)) {
        this.observers.get('iframes').observe(iframe);
      }
    });

    // Components
    container.querySelectorAll?.('[data-lazy-component]').forEach(component => {
      if (!this.loadedElements.has(component)) {
        this.observers.get('components').observe(component);
      }
    });
  }

  /**
   * Load all content immediately (fallback for unsupported browsers)
   */
  loadAllContent() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });

    document.querySelectorAll('video[data-src]').forEach(video => {
      video.src = video.dataset.src;
      video.removeAttribute('data-src');
    });

    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      iframe.src = iframe.dataset.src;
      iframe.removeAttribute('data-src');
    });
  }

  /**
   * Get loading statistics
   */
  getStats() {
    return {
      totalObserved: Array.from(this.observers.values()).reduce((total, observer) => {
        return total + observer.takeRecords().length;
      }, 0),
      totalLoaded: this.loadedElements.size,
      retryAttempts: Array.from(this.retryCount.values()).reduce((total, count) => total + count, 0)
    };
  }

  /**
   * Destroy lazy loader and clean up
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.loadedElements.clear();
    this.retryCount.clear();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new EnhancedLazyLoader();
  });
} else {
  window.lazyLoader = new EnhancedLazyLoader();
}

// Export for module usage
export default EnhancedLazyLoader;
