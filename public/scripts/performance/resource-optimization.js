/**
 * resource-optimization.js
 * Resource optimization for the NosytLabs website
 * 
 * This module handles resource optimization techniques such as:
 * - Preloading critical resources
 * - Prefetching likely-to-be-needed resources
 * - Lazy loading non-critical resources
 * - Resource prioritization
 */

import NosytUtils from '../core/utils.js';

/**
 * ResourceOptimization module
 */
const ResourceOptimization = {
  /**
   * Configuration
   */
  config: {
    // Critical resources to preload
    criticalResources: [
      // Fonts
      { type: 'font', url: '/fonts/inter-var.woff2', as: 'font', crossorigin: 'anonymous' },
      
      // Critical CSS
      { type: 'style', url: '/styles/critical.css', as: 'style' },
      
      // Critical images
      { type: 'image', url: '/images/nosyt-logo.svg', as: 'image' },
      
      // Critical scripts
      { type: 'script', url: '/scripts/core/main.js', as: 'script' }
    ],
    
    // Resources to prefetch
    prefetchResources: [
      // Common page resources
      { type: 'document', url: '/about', as: 'document' },
      { type: 'document', url: '/projects', as: 'document' },
      { type: 'document', url: '/content-creation', as: 'document' },
      
      // Common images
      { type: 'image', url: '/images/hero-background.jpg', as: 'image' }
    ],
    
    // Resources to preconnect
    preconnectDomains: [
      { domain: 'https://www.youtube.com', crossorigin: true },
      { domain: 'https://player.kick.com', crossorigin: true },
      { domain: 'https://www.crealitycloud.com', crossorigin: true }
    ],
    
    // DNS prefetch domains
    dnsPrefetchDomains: [
      'https://www.youtube.com',
      'https://player.kick.com',
      'https://www.crealitycloud.com'
    ],
    
    // Resource hints priority
    priority: {
      preload: 'high',
      prefetch: 'low'
    },
    
    // Lazy loading threshold
    lazyLoadThreshold: '200px'
  },
  
  /**
   * State
   */
  state: {
    preloadedResources: new Set(),
    prefetchedResources: new Set(),
    preconnectedDomains: new Set(),
    dnsPrefetchedDomains: new Set()
  },
  
  /**
   * Initialize resource optimization
   * @param {Object} options - Configuration options
   */
  init: function(options = {}) {
    console.log('Initializing resource optimization...');
    
    try {
      // Merge options with default config
      this.config = { ...this.config, ...options };
      
      // Preload critical resources
      this.preloadCriticalResources();
      
      // Preconnect to important domains
      this.preconnectToDomains();
      
      // Set up DNS prefetch
      this.setupDnsPrefetch();
      
      // Prefetch likely-to-be-needed resources
      this.prefetchResources();
      
      // Set up lazy loading
      this.setupLazyLoading();
      
      // Set up resource prioritization
      this.setupResourcePrioritization();
      
      console.log('Resource optimization initialized successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource optimization initialization');
    }
  },
  
  /**
   * Preload critical resources
   */
  preloadCriticalResources: function() {
    try {
      // Skip if no critical resources
      if (!this.config.criticalResources || this.config.criticalResources.length === 0) {
        return;
      }
      
      // Preload each critical resource
      this.config.criticalResources.forEach(resource => {
        // Skip if already preloaded
        if (this.state.preloadedResources.has(resource.url)) {
          return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        link.as = resource.as;
        
        // Set crossorigin if needed
        if (resource.crossorigin) {
          link.crossOrigin = typeof resource.crossorigin === 'string' ? 
            resource.crossorigin : 'anonymous';
        }
        
        // Set importance
        if (this.config.priority.preload) {
          link.importance = this.config.priority.preload;
        }
        
        // Add to head
        document.head.appendChild(link);
        
        // Mark as preloaded
        this.state.preloadedResources.add(resource.url);
      });
      
      console.log(`Preloaded ${this.state.preloadedResources.size} critical resources`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Critical resource preloading');
    }
  },
  
  /**
   * Preconnect to important domains
   */
  preconnectToDomains: function() {
    try {
      // Skip if no domains to preconnect
      if (!this.config.preconnectDomains || this.config.preconnectDomains.length === 0) {
        return;
      }
      
      // Preconnect to each domain
      this.config.preconnectDomains.forEach(domainInfo => {
        // Skip if already preconnected
        if (this.state.preconnectedDomains.has(domainInfo.domain)) {
          return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domainInfo.domain;
        
        // Set crossorigin if needed
        if (domainInfo.crossorigin) {
          link.crossOrigin = typeof domainInfo.crossorigin === 'string' ? 
            domainInfo.crossorigin : 'anonymous';
        }
        
        // Add to head
        document.head.appendChild(link);
        
        // Mark as preconnected
        this.state.preconnectedDomains.add(domainInfo.domain);
      });
      
      console.log(`Preconnected to ${this.state.preconnectedDomains.size} domains`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Domain preconnection');
    }
  },
  
  /**
   * Set up DNS prefetch
   */
  setupDnsPrefetch: function() {
    try {
      // Skip if no domains to prefetch
      if (!this.config.dnsPrefetchDomains || this.config.dnsPrefetchDomains.length === 0) {
        return;
      }
      
      // Prefetch DNS for each domain
      this.config.dnsPrefetchDomains.forEach(domain => {
        // Skip if already prefetched
        if (this.state.dnsPrefetchedDomains.has(domain)) {
          return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        
        // Add to head
        document.head.appendChild(link);
        
        // Mark as prefetched
        this.state.dnsPrefetchedDomains.add(domain);
      });
      
      console.log(`Set up DNS prefetch for ${this.state.dnsPrefetchedDomains.size} domains`);
    } catch (error) {
      NosytUtils.error.handle(error, 'DNS prefetch setup');
    }
  },
  
  /**
   * Prefetch likely-to-be-needed resources
   */
  prefetchResources: function() {
    try {
      // Skip if no resources to prefetch
      if (!this.config.prefetchResources || this.config.prefetchResources.length === 0) {
        return;
      }
      
      // Wait for idle time to prefetch
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          this.doPrefetch();
        }, { timeout: 2000 });
      } else {
        // Fallback to setTimeout
        setTimeout(() => {
          this.doPrefetch();
        }, 2000);
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource prefetching');
    }
  },
  
  /**
   * Do the actual prefetching
   */
  doPrefetch: function() {
    try {
      // Prefetch each resource
      this.config.prefetchResources.forEach(resource => {
        // Skip if already prefetched
        if (this.state.prefetchedResources.has(resource.url)) {
          return;
        }
        
        // Create link element
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource.url;
        
        // Set as attribute if provided
        if (resource.as) {
          link.as = resource.as;
        }
        
        // Set importance
        if (this.config.priority.prefetch) {
          link.importance = this.config.priority.prefetch;
        }
        
        // Add to head
        document.head.appendChild(link);
        
        // Mark as prefetched
        this.state.prefetchedResources.add(resource.url);
      });
      
      console.log(`Prefetched ${this.state.prefetchedResources.size} resources`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource prefetching');
    }
  },
  
  /**
   * Set up lazy loading
   */
  setupLazyLoading: function() {
    try {
      // Set up native lazy loading for images and iframes
      this.setupNativeLazyLoading();
      
      // Set up Intersection Observer for custom lazy loading
      this.setupIntersectionObserverLazyLoading();
    } catch (error) {
      NosytUtils.error.handle(error, 'Lazy loading setup');
    }
  },
  
  /**
   * Set up native lazy loading
   */
  setupNativeLazyLoading: function() {
    try {
      // Add loading="lazy" to images and iframes that don't have it
      const images = document.querySelectorAll('img:not([loading])');
      const iframes = document.querySelectorAll('iframe:not([loading])');
      
      // Add loading attribute to images
      images.forEach(img => {
        // Skip if it's a critical image
        if (this.isCriticalResource(img.src)) {
          return;
        }
        
        // Add loading attribute
        img.loading = 'lazy';
      });
      
      // Add loading attribute to iframes
      iframes.forEach(iframe => {
        // Skip if it's a critical iframe
        if (this.isCriticalResource(iframe.src)) {
          return;
        }
        
        // Add loading attribute
        iframe.loading = 'lazy';
      });
      
      console.log(`Set up native lazy loading for ${images.length} images and ${iframes.length} iframes`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Native lazy loading setup');
    }
  },
  
  /**
   * Set up Intersection Observer for custom lazy loading
   */
  setupIntersectionObserverLazyLoading: function() {
    try {
      // Import lazy loading module
      import('./lazy-loading.js')
        .then(module => {
          if (module.default && typeof module.default.init === 'function') {
            module.default.init({
              rootMargin: this.config.lazyLoadThreshold
            });
          }
        })
        .catch(error => {
          NosytUtils.error.handle(error, 'Lazy loading module import');
        });
    } catch (error) {
      NosytUtils.error.handle(error, 'Intersection Observer lazy loading setup');
    }
  },
  
  /**
   * Set up resource prioritization
   */
  setupResourcePrioritization: function() {
    try {
      // Set importance attribute on resources
      this.setPriorityOnResources();
      
      // Set fetchpriority attribute on resources
      this.setFetchPriorityOnResources();
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource prioritization setup');
    }
  },
  
  /**
   * Set importance attribute on resources
   */
  setPriorityOnResources: function() {
    try {
      // Set importance on scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        // Set high priority for critical scripts
        if (this.isCriticalResource(script.src)) {
          script.importance = 'high';
        } else {
          script.importance = 'low';
        }
      });
      
      // Set importance on stylesheets
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach(stylesheet => {
        // Set high priority for critical stylesheets
        if (this.isCriticalResource(stylesheet.href)) {
          stylesheet.importance = 'high';
        } else {
          stylesheet.importance = 'low';
        }
      });
      
      console.log(`Set importance on ${scripts.length} scripts and ${stylesheets.length} stylesheets`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource importance setting');
    }
  },
  
  /**
   * Set fetchpriority attribute on resources
   */
  setFetchPriorityOnResources: function() {
    try {
      // Set fetchpriority on images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Set high priority for critical images
        if (this.isCriticalResource(img.src)) {
          img.fetchPriority = 'high';
        } else {
          img.fetchPriority = 'low';
        }
      });
      
      console.log(`Set fetchpriority on ${images.length} images`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource fetchpriority setting');
    }
  },
  
  /**
   * Check if a resource is critical
   * @param {string} url - The resource URL
   * @returns {boolean} - Whether the resource is critical
   */
  isCriticalResource: function(url) {
    try {
      // Check if the URL is in the critical resources list
      return this.config.criticalResources.some(resource => {
        return url.includes(resource.url);
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Critical resource checking');
      return false;
    }
  }
};

// Export ResourceOptimization module
export default ResourceOptimization;
