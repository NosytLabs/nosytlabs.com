/**
 * Image Optimization Script for NosytLabs
 * Handles advanced image loading, lazy loading, and performance optimizations
 * 
 * Features:
 * - Intelligent lazy loading with IntersectionObserver
 * - Blur-up image loading with LQIP (Low Quality Image Placeholders)
 * - Responsive image loading based on viewport and device capabilities
 * - Network-aware loading strategies
 * - Fallback mechanisms for older browsers
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    lazyLoadThreshold: 0.1,       // Start loading when image is 10% in view
    lazyLoadMargin: '200px',      // Load images 200px before they come into view
    placeholderFadeTime: 300,     // Time in ms to fade out placeholder
    useNativeLazyLoading: true,   // Use native lazy loading if available
    lowBandwidthLimit: 1.5,       // Mbps threshold for low bandwidth mode
    highDensityLimit: 2,          // Device pixel ratio threshold for high density displays
    preloadPriority: {            // Priority for preloading (lower = higher priority)
      critical: 1,
      high: 2,
      medium: 3,
      low: 4
    }
  };

  // Network information
  let networkInfo = {
    downlink: 10,                 // Default to 10 Mbps
    effectiveType: '4g',          // Default to 4G
    rtt: 50,                      // Default to 50ms round trip time
    saveData: false               // Default to no data saving
  };

  // Update network information if available
  function updateNetworkInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection) {
        networkInfo.downlink = connection.downlink;
        networkInfo.effectiveType = connection.effectiveType;
        networkInfo.rtt = connection.rtt;
        networkInfo.saveData = connection.saveData;
        
        // Listen for changes
        connection.addEventListener('change', updateNetworkInfo);
      }
    }
  }

  // Check if we're on a low bandwidth connection
  function isLowBandwidth() {
    return networkInfo.saveData || 
           networkInfo.downlink < config.lowBandwidthLimit || 
           networkInfo.effectiveType === 'slow-2g' || 
           networkInfo.effectiveType === '2g';
  }

  // Check if we're on a high density display
  function isHighDensityDisplay() {
    return window.devicePixelRatio >= config.highDensityLimit;
  }

  // Get appropriate image size based on element width and network conditions
  function getAppropriateImageSize(element, sizes) {
    const elementWidth = element.offsetWidth * (isHighDensityDisplay() ? window.devicePixelRatio : 1);
    
    // Find the smallest size that's larger than the element
    for (let i = 0; i < sizes.length; i++) {
      if (sizes[i] >= elementWidth) {
        // On low bandwidth, we might want to go one size down
        if (isLowBandwidth() && i > 0) {
          return sizes[i - 1];
        }
        return sizes[i];
      }
    }
    
    // If no size is large enough, use the largest available
    return sizes[sizes.length - 1];
  }

  // Initialize lazy loading with IntersectionObserver
  function initLazyLoading() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      loadAllImages();
      return;
    }
    
    // Create observer
    const lazyImageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            loadImage(lazyImage);
            observer.unobserve(lazyImage);
          }
        });
      },
      {
        rootMargin: config.lazyLoadMargin,
        threshold: config.lazyLoadThreshold
      }
    );
    
    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset], source[data-srcset]');
    lazyImages.forEach(lazyImage => {
      // Skip images with native lazy loading
      if (config.useNativeLazyLoading && 'loading' in HTMLImageElement.prototype && lazyImage.tagName === 'IMG') {
        loadImage(lazyImage);
      } else {
        lazyImageObserver.observe(lazyImage);
      }
    });
  }

  // Load all images immediately (fallback for older browsers)
  function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset], source[data-srcset]');
    lazyImages.forEach(lazyImage => {
      loadImage(lazyImage);
    });
  }

  // Load a specific image
  function loadImage(element) {
    try {
      if (element.tagName === 'IMG') {
        // Handle image element
        if (element.dataset.src) {
          element.src = element.dataset.src;
          element.removeAttribute('data-src');
        }
        
        if (element.dataset.srcset) {
          element.srcset = element.dataset.srcset;
          element.removeAttribute('data-srcset');
        }
        
        // Handle blur-up effect if placeholder is present
        if (element.classList.contains('blur-up')) {
          element.addEventListener('load', () => {
            setTimeout(() => {
              element.classList.add('blur-up-loaded');
            }, 10);
          });
        }
      } else if (element.tagName === 'SOURCE') {
        // Handle source element in picture
        if (element.dataset.srcset) {
          element.srcset = element.dataset.srcset;
          element.removeAttribute('data-srcset');
        }
      }
      
      // Mark as loaded
      element.classList.add('lazy-loaded');
    } catch (error) {
      console.warn('Error loading image:', error);
    }
  }

  // Preload critical images
  function preloadCriticalImages() {
    if (isLowBandwidth()) {
      // Skip preloading on low bandwidth connections
      return;
    }
    
    const criticalImages = document.querySelectorAll('[data-priority="critical"] img, img[data-priority="critical"]');
    criticalImages.forEach(image => {
      // Force loading of critical images
      loadImage(image);
    });
  }

  // Initialize
  function init() {
    // Update network information
    updateNetworkInfo();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Preload critical images
    preloadCriticalImages();
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
