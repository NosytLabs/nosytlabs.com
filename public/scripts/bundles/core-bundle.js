/**
 * core-bundle.js - Consolidated Bundle
 * Generated automatically - do not edit directly
 * Generated on: 2025-05-26T03:43:40.009Z
 */


/* ===== utils.js ===== */
/**
 * utils.js
 * Core utility functions for the NosytLabs website
 * 
 * This file contains common utility functions used throughout the website.
 * It provides a centralized location for shared functionality to avoid code duplication.
 */

/**
 * Utility namespace to avoid global scope pollution
 */
const NosytUtils = {
  /**
   * DOM manipulation utilities
   */
  dom: {
    /**
     * Get an element by ID with error handling
     * @param {string} id - The ID of the element to get
     * @param {boolean} required - Whether the element is required (throws error if not found)
     * @returns {HTMLElement|null} - The element or null if not found and not required
     */
    getById: function(id, required = false) {
      const element = document.getElementById(id);
      if (!element && required) {
        console.error(`Required element with ID "${id}" not found`);
        throw new Error(`Required element with ID "${id}" not found`);
      }
      return element;
    },

    /**
     * Query selector with error handling
     * @param {string} selector - The CSS selector
     * @param {HTMLElement|Document} parent - The parent element to query within
     * @param {boolean} required - Whether the element is required
     * @returns {HTMLElement|null} - The element or null if not found and not required
     */
    query: function(selector, parent = document, required = false) {
      const element = parent.querySelector(selector);
      if (!element && required) {
        console.error(`Required element with selector "${selector}" not found`);
        throw new Error(`Required element with selector "${selector}" not found`);
      }
      return element;
    },

    /**
     * Query all elements matching a selector with error handling
     * @param {string} selector - The CSS selector
     * @param {HTMLElement|Document} parent - The parent element to query within
     * @returns {NodeList} - The matching elements
     */
    queryAll: function(selector, parent = document) {
      return parent.querySelectorAll(selector);
    },

    /**
     * Create an element with attributes and children
     * @param {string} tag - The tag name
     * @param {Object} attributes - The attributes to set
     * @param {Array|HTMLElement|string} children - The children to append
     * @returns {HTMLElement} - The created element
     */
    createElement: function(tag, attributes = {}, children = []) {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
          element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
          Object.entries(value).forEach(([prop, val]) => {
            element.style[prop] = val;
          });
        } else if (key.startsWith('on') && typeof value === 'function') {
          const eventName = key.substring(2).toLowerCase();
          element.addEventListener(eventName, value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Append children
      if (children) {
        if (!Array.isArray(children)) {
          children = [children];
        }
        
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            element.appendChild(child);
          }
        });
      }
      
      return element;
    },

    /**
     * Add event listener with automatic cleanup
     * @param {HTMLElement} element - The element to add the listener to
     * @param {string} event - The event name
     * @param {Function} callback - The callback function
     * @param {Object} options - The event listener options
     * @returns {Function} - A function to remove the event listener
     */
    addEvent: function(element, event, callback, options = {}) {
      if (!element) {
        console.warn(`Cannot add event listener: element is ${element}`);
        return () => {};
      }
      
      element.addEventListener(event, callback, options);
      
      return function cleanup() {
        element.removeEventListener(event, callback, options);
      };
    }
  },

  /**
   * Browser and device detection utilities
   */
  browser: {
    /**
     * Check if the user prefers reduced motion
     * @returns {boolean} - Whether reduced motion is preferred
     */
    prefersReducedMotion: function() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Check if the device is a mobile device
     * @returns {boolean} - Whether the device is mobile
     */
    isMobile: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if the device is a touch device
     * @returns {boolean} - Whether the device is a touch device
     */
    isTouch: function() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get the browser name and version
     * @returns {Object} - The browser name and version
     */
    getBrowser: function() {
      const ua = navigator.userAgent;
      let browser = 'Unknown';
      let version = 'Unknown';
      
      // Detect browser
      if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        version = ua.match(/Version\/([0-9.]+)/)[1];
      } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        version = ua.match(/Edge\/([0-9.]+)/)[1];
      } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
        browser = 'Internet Explorer';
        version = ua.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
      }
      
      return { browser, version };
    }
  },

  /**
   * Performance utilities
   */
  performance: {
    /**
     * Debounce a function
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce wait time in milliseconds
     * @returns {Function} - The debounced function
     */
    debounce: function(func, wait = 100) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    /**
     * Throttle a function
     * @param {Function} func - The function to throttle
     * @param {number} limit - The throttle limit in milliseconds
     * @returns {Function} - The throttled function
     */
    throttle: function(func, limit = 100) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Measure execution time of a function
     * @param {Function} func - The function to measure
     * @param {Array} args - The arguments to pass to the function
     * @returns {Object} - The result and execution time
     */
    measureTime: function(func, ...args) {
      const start = performance.now();
      const result = func(...args);
      const end = performance.now();
      return {
        result,
        time: end - start
      };
    }
  },

  /**
   * Error handling utilities
   */
  error: {
    /**
     * Handle an error with logging and optional reporting
     * @param {Error} error - The error to handle
     * @param {string} context - The context where the error occurred
     * @param {boolean} report - Whether to report the error
     */
    handle: function(error, context = 'Unknown', report = true) {
      console.error(`Error in ${context}:`, error);
      
      if (report && typeof window.reportError === 'function') {
        window.reportError(error, context);
      }
    },

    /**
     * Try to execute a function and handle any errors
     * @param {Function} func - The function to execute
     * @param {string} context - The context for error handling
     * @param {boolean} report - Whether to report errors
     * @returns {any} - The result of the function or undefined on error
     */
    try: function(func, context = 'Unknown', report = true) {
      try {
        return func();
      } catch (error) {
        this.handle(error, context, report);
        return undefined;
      }
    }
  }
};

// Export the utilities
window.NosytUtils = NosytUtils;
export default NosytUtils;



/* ===== main.js ===== */
/**
 * main.js
 * Core initialization script for the NosytLabs website
 * 
 * This file serves as the main entry point for JavaScript functionality.
 * It handles initialization of core features and coordinates loading of other modules.
 */

// Import utilities
import NosytUtils from './utils.js';

/**
 * NosytLabs namespace
 */
const NosytLabs = {
  /**
   * Configuration settings
   */
  config: {
    // Feature flags
    features: {
      darkMode: true,
      animations: true,
      lazyLoading: true,
      serviceWorker: true
    },
    
    // Performance settings
    performance: {
      prefersReducedMotion: NosytUtils.browser.prefersReducedMotion(),
      isMobile: NosytUtils.browser.isMobile(),
      isTouch: NosytUtils.browser.isTouch()
    },
    
    // Paths
    paths: {
      scripts: '/scripts',
      images: '/images',
      styles: '/styles'
    }
  },
  
  /**
   * Initialization function
   */
  init: function() {
    console.log('NosytLabs website initializing...');
    
    try {
      // Initialize core functionality
      this.initCore();
      
      // Initialize features based on configuration
      if (this.config.features.darkMode) {
        this.initTheme();
      }
      
      if (this.config.features.animations && !this.config.performance.prefersReducedMotion) {
        this.initAnimations();
      }
      
      if (this.config.features.lazyLoading) {
        this.initLazyLoading();
      }
      
      if (this.config.features.serviceWorker) {
        this.registerServiceWorker();
      }
      
      // Initialize page-specific functionality
      this.initPageSpecific();
      
      console.log('NosytLabs website initialized successfully');
    } catch (error) {
      console.error('Error initializing NosytLabs website:', error);
    }
  },
  
  /**
   * Initialize core functionality
   */
  initCore: function() {
    // Set up error handling
    window.addEventListener('error', (event) => {
      NosytUtils.error.handle(event.error, 'Global error handler', true);
    });
    
    // Set up unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (event) => {
      NosytUtils.error.handle(event.reason, 'Unhandled promise rejection', true);
    });
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Initialize resource error handling
    this.initResourceErrorHandling();
  },
  
  /**
   * Initialize theme functionality
   */
  initTheme: function() {
    try {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set initial theme
      if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', prefersDark);
      }
      
      // Set up theme toggle functionality
      const themeToggles = document.querySelectorAll('[data-theme-toggle]');
      themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          
          // Update theme toggles
          themeToggles.forEach(t => {
            const darkIcon = t.querySelector('[data-theme-icon="dark"]');
            const lightIcon = t.querySelector('[data-theme-icon="light"]');
            
            if (darkIcon) darkIcon.classList.toggle('hidden', isDark);
            if (lightIcon) lightIcon.classList.toggle('hidden', !isDark);
          });
        });
      });
      
      console.log('Theme functionality initialized');
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme initialization');
    }
  },
  
  /**
   * Initialize animations
   */
  initAnimations: function() {
    try {
      // Import animations module dynamically
      import('/scripts/ui/animations.js')
        .then(module => {
          if (module.default && typeof module.default.init === 'function') {
            module.default.init();
          }
        })
        .catch(error => {
          NosytUtils.error.handle(error, 'Animations module loading');
        });
      
      console.log('Animations initialization started');
    } catch (error) {
      NosytUtils.error.handle(error, 'Animations initialization');
    }
  },
  
  /**
   * Initialize lazy loading
   */
  initLazyLoading: function() {
    try {
      // Import lazy loading module dynamically
      import('/scripts/performance/lazy-loading.js')
        .then(module => {
          if (module.default && typeof module.default.init === 'function') {
            module.default.init();
          }
        })
        .catch(error => {
          NosytUtils.error.handle(error, 'Lazy loading module loading');
        });
      
      console.log('Lazy loading initialization started');
    } catch (error) {
      NosytUtils.error.handle(error, 'Lazy loading initialization');
    }
  },
  
  /**
   * Initialize performance monitoring
   */
  initPerformanceMonitoring: function() {
    try {
      // Set up performance observer
      if ('PerformanceObserver' in window) {
        // Create performance observer for long tasks
        const longTaskObserver = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            console.warn('Long task detected:', entry.duration, 'ms');
          });
        });
        
        // Start observing long tasks
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        
        // Create performance observer for layout shifts
        const layoutShiftObserver = new PerformanceObserver(list => {
          let cumulativeLayoutShift = 0;
          
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              cumulativeLayoutShift += entry.value;
            }
          });
          
          if (cumulativeLayoutShift > 0.1) {
            console.warn('High cumulative layout shift detected:', cumulativeLayoutShift);
          }
        });
        
        // Start observing layout shifts
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
      }
      
      console.log('Performance monitoring initialized');
    } catch (error) {
      NosytUtils.error.handle(error, 'Performance monitoring initialization');
    }
  },
  
  /**
   * Initialize resource error handling
   */
  initResourceErrorHandling: function() {
    try {
      // Set up resource error handling
      document.addEventListener('error', function(event) {
        const target = event.target;
        
        // Handle image loading errors
        if (target.tagName === 'IMG') {
          console.warn('Image failed to load:', target.src);
          
          // Set fallback image
          if (!target.src.includes('fallback') && !target.hasAttribute('data-no-fallback')) {
            target.src = '/images/fallback-image.svg';
          }
        }
        
        // Handle script loading errors
        if (target.tagName === 'SCRIPT') {
          console.error('Script failed to load:', target.src);
        }
        
        // Handle stylesheet loading errors
        if (target.tagName === 'LINK' && target.rel === 'stylesheet') {
          console.error('Stylesheet failed to load:', target.href);
        }
      }, true);
      
      console.log('Resource error handling initialized');
    } catch (error) {
      NosytUtils.error.handle(error, 'Resource error handling initialization');
    }
  },
  
  /**
   * Register service worker
   */
  registerServiceWorker: function() {
    try {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('Service worker registered:', registration.scope);
            })
            .catch(error => {
              console.warn('Service worker registration failed:', error);
            });
        });
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Service worker registration');
    }
  },
  
  /**
   * Initialize page-specific functionality
   */
  initPageSpecific: function() {
    try {
      // Get current page path
      const path = window.location.pathname;
      
      // Initialize NosytOS95 if on that page
      if (path.includes('nosytos95')) {
        this.initNosytOS95();
      }
      
      // Initialize 3D printing page
      if (path.includes('3d-printing')) {
        this.init3DPrinting();
      }
      
      // Initialize blog page
      if (path.includes('blog')) {
        this.initBlog();
      }
      
      console.log('Page-specific initialization completed');
    } catch (error) {
      NosytUtils.error.handle(error, 'Page-specific initialization');
    }
  },
  
  /**
   * Initialize NosytOS95
   */
  initNosytOS95: function() {
    try {
      // Import NosytOS95 modules dynamically
      Promise.all([
        import('/scripts/nosytos95/window-manager.js'),
        import('/scripts/nosytos95/start-menu.js')
      ])
        .then(([windowManager, startMenu]) => {
          // Initialize modules
          if (windowManager.default && typeof windowManager.default.init === 'function') {
            windowManager.default.init();
          }
          
          if (startMenu.default && typeof startMenu.default.init === 'function') {
            startMenu.default.init();
          }
          
          console.log('NosytOS95 initialized');
        })
        .catch(error => {
          NosytUtils.error.handle(error, 'NosytOS95 module loading');
        });
    } catch (error) {
      NosytUtils.error.handle(error, 'NosytOS95 initialization');
    }
  },
  
  /**
   * Initialize 3D printing page
   */
  init3DPrinting: function() {
    // 3D printing page specific initialization
    console.log('3D printing page initialized');
  },
  
  /**
   * Initialize blog page
   */
  initBlog: function() {
    // Blog page specific initialization
    console.log('Blog page initialized');
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  NosytLabs.init();
});

// Export NosytLabs namespace
window.NosytLabs = NosytLabs;
export default NosytLabs;



/* ===== animations.js ===== */
/**
 * Enhanced animations for NosytLabs website
 * Handles scroll-triggered animations and parallax effects
 */

(function() {
  'use strict';

  // Initialize scroll-triggered animations
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // If not supported, show all elements
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when at least 15% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
    });

    // Observe all elements with reveal-on-scroll class
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Initialize modern background effects
  function initModernBackgrounds() {
    const modernBgElements = document.querySelectorAll('.bg-grid-pattern');

    if (modernBgElements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add subtle animation to grid patterns
    modernBgElements.forEach(element => {
      element.style.animation = 'pulse 10s ease-in-out infinite';
    });
  }

  // Initialize staggered animations
  function initStaggeredAnimations() {
    // Add animation delay to elements based on their position
    document.querySelectorAll('.text-reveal, .fade-in-scale, .slide-up-fade').forEach((el, index) => {
      const container = el.closest('.staggered-container');
      if (container) {
        const delay = 0.1 * (index % 5); // Reset after 5 elements
        el.style.setProperty('--animation-delay', `${delay}s`);
      }
    });
  }

  // Initialize subtle hover effects instead of cursor tracking
  function initHoverEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Enhance interactive elements with subtle hover effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .card, .interactive');

    interactiveElements.forEach(el => {
      // Skip elements that already have hover effects
      if (el.classList.contains('hover-effect-applied')) return;

      el.classList.add('hover-effect-applied');

      // Add hover effect based on element type
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '';
        });
      } else if (el.classList.contains('card')) {
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          el.style.transform = 'translateY(-5px)';
          el.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '';
        });
      }
    });

    // Add focus effects for accessibility
    interactiveElements.forEach(el => {
      el.addEventListener('focus', () => {
        el.classList.add('focus-visible');
      });

      el.addEventListener('blur', () => {
        el.classList.remove('focus-visible');
      });
    });
  }

  // Initialize magnetic button effects
  function initMagneticButtons() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const magneticButtons = document.querySelectorAll('.magnetic-button');

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Apply magnetic effect with subtle movement
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      button.addEventListener('mouseleave', () => {
        // Reset position when mouse leaves
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Initialize Windows 95 animations
  function initWin95Animations() {
    // Windows 95 window controls
    const minimizeButtons = document.querySelectorAll('.win95-minimize-button');
    const maximizeButtons = document.querySelectorAll('.win95-maximize-button');
    const closeButtons = document.querySelectorAll('.win95-close-button');

    minimizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.add('win95-minimize');
          // Remove animation class after animation completes
          setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('win95-minimize');
          }, 300);
        }
      });
    });

    maximizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.toggle('win95-maximized');
          if (window.classList.contains('win95-maximized')) {
            window.classList.add('win95-maximize');
            setTimeout(() => {
              window.classList.remove('win95-maximize');
            }, 300);
          }
        }
      });
    });

    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.add('win95-minimize');
          setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('win95-minimize');
          }, 300);
        }
      });
    });
  }

  // Initialize particle background effects
  function initParticleEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const particleContainers = document.querySelectorAll('.particle-container');

    particleContainers.forEach(container => {
      const containerRect = container.getBoundingClientRect();
      const particleCount = Math.floor(containerRect.width * containerRect.height / 10000); // Adjust density

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position within container
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        // Random animation duration between 10s and 30s
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 10}s`;

        container.appendChild(particle);
      }
    });
  }

  // Initialize page transitions
  function initPageTransitions() {
    // Check if the browser supports View Transitions API
    if (!document.startViewTransition) return;

    // Add transition classes to links
    document.querySelectorAll('a[href^="/"]:not([target])').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip if modifier keys are pressed
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();

        // Apply exit animation to current page
        document.body.classList.add('page-transition-out');

        // Navigate after animation completes
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });

    // Apply entrance animation on page load
    window.addEventListener('pageshow', () => {
      document.body.classList.add('page-transition-in');

      // Remove animation class after animation completes
      setTimeout(() => {
        document.body.classList.remove('page-transition-in');
      }, 500);
    });
  }

  // Initialize touch interactions for mobile users
  function initTouchInteractions() {
    // Add touch interactions for cards
    const cards = document.querySelectorAll('.expandable-card, .flippable');

    cards.forEach(card => {
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;

      card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      });

      card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        // Calculate horizontal and vertical distance
        const horizontalDistance = Math.abs(touchEndX - touchStartX);
        const verticalDistance = Math.abs(touchEndY - touchStartY);

        // Only handle horizontal swipes (to avoid conflicts with scrolling)
        if (horizontalDistance > verticalDistance && horizontalDistance > 50) {
          if (touchEndX < touchStartX && card.classList.contains('flippable')) {
            // Swipe left - flip card
            card.classList.add('flipped');
          } else if (touchEndX > touchStartX && card.classList.contains('flipped')) {
            // Swipe right - reset card
            card.classList.remove('flipped');
          }
        }
      });
    });

    // Add double tap for expanding cards
    cards.forEach(card => {
      let lastTap = 0;

      card.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 500 && tapLength > 0) {
          // Double tap detected
          if (card.classList.contains('expandable')) {
            // Don't expand if tapping on a link or button
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
                e.target.closest('a') || e.target.closest('button')) {
              return;
            }

            // Toggle expanded state
            card.classList.toggle('expanded');

            // Handle overlay
            const overlay = document.querySelector('.card-overlay');
            if (overlay) {
              overlay.classList.toggle('active');
            }

            // Prevent body scrolling when card is expanded
            if (card.classList.contains('expanded')) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = '';
            }
          }
        }

        lastTap = currentTime;
      });
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();

    // Initialize modern backgrounds
    initModernBackgrounds();

    // Initialize staggered animations
    initStaggeredAnimations();

    // Initialize hover effects (replacing cursor effects)
    initHoverEffects();

    // Initialize magnetic buttons
    initMagneticButtons();

    // Initialize Windows 95 animations
    initWin95Animations();

    // Initialize particle effects
    initParticleEffects();

    // Initialize page transitions
    initPageTransitions();

    // Initialize touch interactions for mobile
    initTouchInteractions();

    // Add accessibility enhancements
    enhanceAccessibility();

    // Add nav-link class to navigation links
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.add('nav-link');

      // Mark active link
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Add magnetic-button class to primary buttons
    document.querySelectorAll('.btn-primary, .cta-button').forEach(button => {
      button.classList.add('magnetic-button');
    });

    console.log('Enhanced animation system initialized');
  });

  // Enhance accessibility
  function enhanceAccessibility() {
    // Add skip link if it doesn't exist
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);

      // Style the skip link
      skipLink.style.position = 'absolute';
      skipLink.style.top = '-40px';
      skipLink.style.left = '0';
      skipLink.style.padding = '8px 16px';
      skipLink.style.background = 'var(--nosyt-orange-main, #ff6b00)';
      skipLink.style.color = 'white';
      skipLink.style.zIndex = '9999';
      skipLink.style.transition = 'top 0.3s ease';

      // Show skip link on focus
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
      });

      // Hide skip link when focus is lost
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
    }

    // Add main-content id to main element if it doesn't exist
    const mainElement = document.querySelector('main');
    if (mainElement && !document.getElementById('main-content')) {
      mainElement.id = 'main-content';
      mainElement.setAttribute('tabindex', '-1');
    }

    // Add aria-labels to navigation
    const navElement = document.querySelector('nav');
    if (navElement && !navElement.hasAttribute('aria-label')) {
      navElement.setAttribute('aria-label', 'Main navigation');
    }

    // Add aria-labels to footer navigation
    const footerNavs = document.querySelectorAll('footer nav, footer div[role="navigation"]');
    footerNavs.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Footer navigation ${index + 1}`);
      }
    });

    // Add focus styles to interactive elements
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .focus-visible {
          outline: 2px solid var(--nosyt-orange-main, #ff6b00) !important;
          outline-offset: 2px !important;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
          }
        }
      </style>
    `);
  }

  // Update on window resize
  window.addEventListener('resize', function() {
    // Reinitialize modern backgrounds on resize
    initModernBackgrounds();

    // Reinitialize particle effects on resize
    initParticleEffects();
  });
})();



/* ===== theme.js ===== */
/**
 * NosytLabs Theme Management
 * Handles dark mode and theme preferences
 */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
});

/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
  // Check for saved theme preference
  const storedTheme = localStorage.getItem('theme');
  
  // Check for system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Apply theme based on preference
  if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Toggle dark mode
      document.documentElement.classList.toggle('dark');
      
      // Save preference
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Listen for system preference changes
  prefersDarkScheme.addEventListener('change', function(e) {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
  
  console.log('Theme system initialized');
}


