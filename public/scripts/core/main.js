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
