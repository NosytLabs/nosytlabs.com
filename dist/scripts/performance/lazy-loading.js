/**
 * lazy-loading.js
 * Performance optimization for lazy loading resources
 * 
 * This module handles lazy loading of images, iframes, and other resources
 * to improve initial page load performance.
 */

import NosytUtils from '../core/utils.js';

/**
 * LazyLoading module
 */
const LazyLoading = {
  /**
   * Configuration
   */
  config: {
    // Default root margin for intersection observer
    rootMargin: '200px 0px',
    
    // Default threshold for intersection observer
    threshold: 0.1,
    
    // Selectors for lazy-loadable elements
    selectors: {
      images: 'img[loading="lazy"], img[data-src]',
      iframes: 'iframe[loading="lazy"], iframe[data-src]',
      backgrounds: '[data-background]',
      videos: 'video[loading="lazy"], video[data-src]'
    },
    
    // Attribute names
    attributes: {
      src: 'data-src',
      srcset: 'data-srcset',
      sizes: 'data-sizes',
      background: 'data-background'
    }
  },
  
  /**
   * State
   */
  state: {
    observer: null,
    loadedElements: new Set(),
    pendingElements: new Set()
  },
  
  /**
   * Initialize lazy loading
   * @param {Object} options - Configuration options
   */
  init: function(options = {}) {
    console.log('Initializing lazy loading...');
    
    try {
      // Merge options with default config
      this.config = { ...this.config, ...options };
      
      // Check if Intersection Observer is supported
      if ('IntersectionObserver' in window) {
        this.setupIntersectionObserver();
      } else {
        this.fallbackLoadAll();
      }
      
      // Set up mutation observer to watch for new elements
      this.setupMutationObserver();
      
      console.log('Lazy loading initialized successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Lazy loading initialization');
    }
  },
  
  /**
   * Set up Intersection Observer
   */
  setupIntersectionObserver: function() {
    try {
      // Create Intersection Observer
      this.state.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        }
      );
      
      // Observe all lazy-loadable elements
      this.observeElements();
      
      console.log('Intersection Observer set up successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Intersection Observer setup');
      this.fallbackLoadAll();
    }
  },
  
  /**
   * Observe all lazy-loadable elements
   */
  observeElements: function() {
    try {
      // Get all selectors
      const allSelectors = Object.values(this.config.selectors).join(', ');
      
      // Get all elements
      const elements = document.querySelectorAll(allSelectors);
      
      // Observe each element
      elements.forEach(element => {
        if (!this.state.loadedElements.has(element)) {
          this.state.observer.observe(element);
          this.state.pendingElements.add(element);
        }
      });
      
      console.log(`Observing ${elements.length} lazy-loadable elements`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Element observation');
    }
  },
  
  /**
   * Handle intersection of observed elements
   * @param {IntersectionObserverEntry[]} entries - Intersection observer entries
   */
  handleIntersection: function(entries) {
    try {
      entries.forEach(entry => {
        // Load element if it's intersecting
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Load the element
          this.loadElement(element);
          
          // Stop observing the element
          this.state.observer.unobserve(element);
          this.state.pendingElements.delete(element);
          this.state.loadedElements.add(element);
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Intersection handling');
    }
  },
  
  /**
   * Load an element based on its type
   * @param {HTMLElement} element - The element to load
   */
  loadElement: function(element) {
    try {
      // Handle different element types
      if (element.tagName === 'IMG') {
        this.loadImage(element);
      } else if (element.tagName === 'IFRAME') {
        this.loadIframe(element);
      } else if (element.tagName === 'VIDEO') {
        this.loadVideo(element);
      } else if (element.hasAttribute(this.config.attributes.background)) {
        this.loadBackground(element);
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Element loading');
    }
  },
  
  /**
   * Load an image element
   * @param {HTMLImageElement} img - The image element to load
   */
  loadImage: function(img) {
    try {
      // Get attributes
      const src = img.getAttribute(this.config.attributes.src);
      const srcset = img.getAttribute(this.config.attributes.srcset);
      const sizes = img.getAttribute(this.config.attributes.sizes);
      
      // Set attributes if they exist
      if (src) img.src = src;
      if (srcset) img.srcset = srcset;
      if (sizes) img.sizes = sizes;
      
      // Add load event listener
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        this.removeDataAttributes(img);
      });
      
      // Add error event listener
      img.addEventListener('error', () => {
        img.classList.add('error');
        console.warn('Failed to load image:', src);
        
        // Set fallback image if available
        const fallback = img.getAttribute('data-fallback');
        if (fallback) {
          img.src = fallback;
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Image loading');
    }
  },
  
  /**
   * Load an iframe element
   * @param {HTMLIFrameElement} iframe - The iframe element to load
   */
  loadIframe: function(iframe) {
    try {
      // Get src attribute
      const src = iframe.getAttribute(this.config.attributes.src);
      
      // Set src if it exists
      if (src) {
        iframe.src = src;
        
        // Add load event listener
        iframe.addEventListener('load', () => {
          iframe.classList.add('loaded');
          this.removeDataAttributes(iframe);
        });
        
        // Add error event listener
        iframe.addEventListener('error', () => {
          iframe.classList.add('error');
          console.warn('Failed to load iframe:', src);
        });
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Iframe loading');
    }
  },
  
  /**
   * Load a video element
   * @param {HTMLVideoElement} video - The video element to load
   */
  loadVideo: function(video) {
    try {
      // Get src attribute
      const src = video.getAttribute(this.config.attributes.src);
      
      // Set src if it exists
      if (src) {
        video.src = src;
        
        // Add loadeddata event listener
        video.addEventListener('loadeddata', () => {
          video.classList.add('loaded');
          this.removeDataAttributes(video);
        });
        
        // Add error event listener
        video.addEventListener('error', () => {
          video.classList.add('error');
          console.warn('Failed to load video:', src);
        });
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Video loading');
    }
  },
  
  /**
   * Load a background image
   * @param {HTMLElement} element - The element to load the background image for
   */
  loadBackground: function(element) {
    try {
      // Get background attribute
      const background = element.getAttribute(this.config.attributes.background);
      
      // Set background if it exists
      if (background) {
        // Create an image to preload
        const img = new Image();
        
        // Add load event listener
        img.onload = () => {
          element.style.backgroundImage = `url(${background})`;
          element.classList.add('loaded');
          this.removeDataAttributes(element);
        };
        
        // Add error event listener
        img.onerror = () => {
          element.classList.add('error');
          console.warn('Failed to load background image:', background);
          
          // Set fallback background if available
          const fallback = element.getAttribute('data-fallback-background');
          if (fallback) {
            element.style.backgroundImage = `url(${fallback})`;
          }
        };
        
        // Set src to start loading
        img.src = background;
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Background loading');
    }
  },
  
  /**
   * Remove data attributes from an element
   * @param {HTMLElement} element - The element to remove data attributes from
   */
  removeDataAttributes: function(element) {
    try {
      // Remove all data attributes
      Object.values(this.config.attributes).forEach(attr => {
        if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Data attribute removal');
    }
  },
  
  /**
   * Set up mutation observer to watch for new elements
   */
  setupMutationObserver: function() {
    try {
      // Create mutation observer
      const observer = new MutationObserver(mutations => {
        let needsUpdate = false;
        
        // Check for added nodes
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            needsUpdate = true;
          }
        });
        
        // Update observed elements if needed
        if (needsUpdate) {
          this.observeElements();
        }
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('Mutation Observer set up successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Mutation Observer setup');
    }
  },
  
  /**
   * Fallback method to load all elements immediately
   */
  fallbackLoadAll: function() {
    try {
      console.warn('Intersection Observer not supported, loading all elements immediately');
      
      // Get all selectors
      const allSelectors = Object.values(this.config.selectors).join(', ');
      
      // Get all elements
      const elements = document.querySelectorAll(allSelectors);
      
      // Load each element
      elements.forEach(element => {
        this.loadElement(element);
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Fallback loading');
    }
  }
};

// Export LazyLoading module
export default LazyLoading;
