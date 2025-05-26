/**
 * Consolidated Main JavaScript for NosytLabs Website
 * Handles core functionality and initializes all components
 *
 * This file combines functionality from:
 * - Performance optimization (resource loading, lazy loading)
 * - Animations and effects (3D effects, particles, smooth scrolling)
 * - Theme management and UI interactions
 * - Service worker registration
 *
 * Version 4.1 - Performance and Reliability Optimized:
 * - Implemented advanced resource loading strategies
 * - Added network-aware loading for better performance on all devices
 * - Enhanced image loading with WebP and AVIF support
 * - Improved code splitting and lazy loading
 * - Reduced initial load time with critical CSS extraction
 * - Added support for responsive images and better caching
 * - Enhanced service worker for sound file caching and offline support
 * - Improved error handling for sound loading
 */

// Load service worker registration script
document.addEventListener('DOMContentLoaded', function() {
  // Load the service worker registration script
  const script = document.createElement('script');
  script.src = '/scripts/service-worker-registration.js';
  script.defer = true;
  document.head.appendChild(script);
});

(function() {
  'use strict';

  // Define theme functions
  function applyWindows95Theme() {
    document.documentElement.setAttribute('data-theme', 'windows95');
  }

  function removeWindows95Theme() {
    document.documentElement.removeAttribute('data-theme');
  }

  // Define viewport height fix function
  function fixMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Define smooth scrolling function
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Initialize Windows 95 theme toggle function
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check if Windows 95 theme is enabled
    const isWin95 = localStorage.getItem('theme') === 'win95';

    // Set initial state
    if (isWin95) {
      applyWindows95Theme();
    }

    // Add click event listener
    themeToggle.addEventListener('click', function() {
      const currentTheme = localStorage.getItem('theme');

      if (currentTheme === 'win95') {
        removeWindows95Theme();
        localStorage.setItem('theme', 'default');
      } else {
        applyWindows95Theme();
        localStorage.setItem('theme', 'win95');
      }
    });
  }

  // Initialize scroll animations
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // If not supported, show all elements
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Once animated, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Email validation helper
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // Initialize form validation
  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        let isValid = true;

        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            // Add error class
            field.classList.add('error');

            // Create error message if it doesn't exist
            let errorMessage = field.parentNode.querySelector('.error-message');
            if (!errorMessage) {
              errorMessage = document.createElement('div');
              errorMessage.className = 'error-message';
              errorMessage.textContent = 'This field is required';
              field.parentNode.appendChild(errorMessage);
            }
          } else {
            // Remove error class
            field.classList.remove('error');

            // Remove error message if it exists
            const errorMessage = field.parentNode.querySelector('.error-message');
            if (errorMessage) {
              errorMessage.remove();
            }
          }
        });

        // Check email fields
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          if (field.value.trim() && !isValidEmail(field.value)) {
            isValid = false;
            // Add error class
            field.classList.add('error');

            // Create error message if it doesn't exist
            let errorMessage = field.parentNode.querySelector('.error-message');
            if (!errorMessage) {
              errorMessage = document.createElement('div');
              errorMessage.className = 'error-message';
              errorMessage.textContent = 'Please enter a valid email address';
              field.parentNode.appendChild(errorMessage);
            } else {
              errorMessage.textContent = 'Please enter a valid email address';
            }
          }
        });

        // Prevent form submission if not valid
        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }
  // Initialize mobile menu with improved functionality
  function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuToggle && mobileMenu) {
      // Toggle menu when clicking the hamburger icon
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from immediately closing it
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Set accessibility attributes
        const isExpanded = mobileMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
        mobileMenu.setAttribute('aria-hidden', (!isExpanded).toString());
      });

      // Close menu when clicking links inside the menu
      const mobileNavLinks = mobileMenu.querySelectorAll('a');
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
          mobileMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
      });

      // Close menu with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  // Initialize dark mode toggle
  function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('theme-toggle-btn');

    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    }
  }

  // Handle expandable cards on touch screens
  function initExpandableCardFixes() {
    const cards = document.querySelectorAll('.expandable-card');

    cards.forEach(card => {
      const flipButtons = card.querySelectorAll('.flip-button');

      // Check if card is flippable
      if (card.classList.contains('flippable')) {
        // Process flip buttons
        flipButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.toggle('flipped');
          });
        });

        // Add click listener for mobile tap to flip (if not expandable)
        if (!card.classList.contains('expandable')) {
          card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A' &&
                e.target.tagName !== 'BUTTON' &&
                !e.target.closest('a') &&
                !e.target.closest('button')) {
              card.classList.toggle('flipped');
            }
          });
        }
      }
    });
  }

  // Register service worker
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
          .then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(function(error) {
            console.log('ServiceWorker registration failed: ', error);
          });
      });
    } else {
      console.log('Service workers are not supported in this browser');
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    initPerformanceOptimizations();

    // Fix for mobile viewport height
    fixMobileViewportHeight();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize form validation
    initFormValidation();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize dark mode toggle
    initDarkModeToggle();

    // Initialize theme toggle
    initThemeToggle();

    // Initialize expandable card fixes
    initExpandableCardFixes();

    // Initialize particle effects
    initParticleEffects();

    // Initialize 3D effects
    init3DEffects();

    // Initialize lazy loading
    initLazyLoading();

    // Register service worker
    registerServiceWorker();

    console.log('Consolidated main script initialized');
  });

  /**
   * Initialize performance optimizations
   */
  function initPerformanceOptimizations() {
    // Get network information if available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection && connection.saveData;
    const effectiveType = connection ? connection.effectiveType : '4g';
    const isSlowConnection = isSaveData || ['slow-2g', '2g', '3g'].includes(effectiveType);

    // Defer non-critical resources based on connection speed
    const nonCriticalResources = document.querySelectorAll(
      'link[rel="stylesheet"][data-priority="low"], script[data-priority="low"]'
    );

    nonCriticalResources.forEach(resource => {
      if (isSlowConnection) {
        // On slow connections, delay loading even more
        resource.setAttribute('media', 'print');
        setTimeout(() => {
          resource.removeAttribute('media');
        }, 4000); // Longer delay for slow connections
      } else {
        // On fast connections, use shorter delay
        resource.setAttribute('media', 'print');
        setTimeout(() => {
          resource.removeAttribute('media');
        }, 1000);
      }
    });

    // Preload critical resources based on connection speed
    const criticalPaths = ['/images/logo.svg', '/favicon.ico'];
    const importantPaths = ['/styles/consolidated-styles.css', '/scripts/main.js'];

    // Always preload the most critical resources
    criticalPaths.forEach(path => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = path;
      preloadLink.as = path.endsWith('.svg') ? 'image' :
                      path.endsWith('.css') ? 'style' :
                      path.endsWith('.js') ? 'script' : 'fetch';
      document.head.appendChild(preloadLink);
    });

    // Only preload additional resources on fast connections
    if (!isSlowConnection) {
      importantPaths.forEach(path => {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = path;
        preloadLink.as = path.endsWith('.css') ? 'style' :
                        path.endsWith('.js') ? 'script' : 'fetch';
        document.head.appendChild(preloadLink);
      });
    }

    // Add connection change listener
    if (connection) {
      connection.addEventListener('change', () => {
        // Re-evaluate optimization strategy when connection changes
        console.log('Connection changed, updating resource loading strategy');
      });
    }

    // Optimize image loading based on connection
    if (isSlowConnection) {
      // On slow connections, use lower quality images
      document.documentElement.classList.add('slow-connection');
    }

    // Implement idle callback for non-critical operations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Perform non-critical operations during idle time
        prefetchNextPages();
        preconnectToThirdParties();
      }, { timeout: 5000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        prefetchNextPages();
        preconnectToThirdParties();
      }, 5000);
    }
  }

  /**
   * Prefetch likely next pages based on current page
   */
  function prefetchNextPages() {
    // Only prefetch on fast connections
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType))) {
      return;
    }

    // Determine current page and likely next pages
    const currentPath = window.location.pathname;
    let pagesToPrefetch = [];

    // Home page - prefetch main sections
    if (currentPath === '/' || currentPath === '/index.html') {
      pagesToPrefetch = ['/services', '/projects', '/nosytos95'];
    }
    // Services page - prefetch related pages
    else if (currentPath.includes('/services')) {
      pagesToPrefetch = ['/projects', '/contact'];
    }
    // Projects page - prefetch related pages
    else if (currentPath.includes('/projects')) {
      pagesToPrefetch = ['/services', '/blog'];
    }
    // Blog page - prefetch first few articles
    else if (currentPath.includes('/blog')) {
      // This would ideally be dynamic based on actual blog posts
      pagesToPrefetch = ['/blog/post-1', '/blog/post-2'];
    }

    // Limit prefetching to 2-3 pages maximum
    pagesToPrefetch = pagesToPrefetch.slice(0, 3);

    // Create prefetch links
    pagesToPrefetch.forEach(path => {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = path;
      document.head.appendChild(prefetchLink);
    });
  }

  /**
   * Preconnect to third-party domains that will be used
   */
  function preconnectToThirdParties() {
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdnjs.cloudflare.com'
    ];

    domains.forEach(domain => {
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Initialize particle effects
   */
  function initParticleEffects() {
    // Check if particles.js is already initialized by particles-config.js
    if (document.querySelector('.particles-initialized')) {
      console.log('Particles already initialized by particles-config.js');
      return;
    }

    // Check if particles.js is loaded
    if (typeof particlesJS === 'undefined') {
      console.warn('Particles.js library not found. Please check script inclusion.');
      return;
    }

    // Delegate to particles-config.js if available
    if (typeof initializeParticles === 'function' && typeof initializeHeroParticles === 'function') {
      try {
        initializeParticles();
        initializeHeroParticles();
        console.log('Particles initialized via particles-config.js');
      } catch (error) {
        console.error('Error initializing particles via particles-config.js:', error);
      }
      return;
    }

    console.log('Particles-config.js not found, skipping particle initialization');
  }

  /**
   * Initialize 3D effects
   */
  function init3DEffects() {
    const elements3D = document.querySelectorAll('.effect-3d');
    if (elements3D.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('Reduced motion preference detected, disabling 3D effects');
      return;
    }

    elements3D.forEach(element => {
      element.addEventListener('mousemove', e => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  /**
   * Initialize enhanced lazy loading with advanced features
   */
  function initLazyLoading() {
    // Get connection information for adaptive loading
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection && connection.saveData;
    const effectiveType = connection ? connection.effectiveType : '4g';
    const isSlowConnection = isSaveData || ['slow-2g', '2g'].includes(effectiveType);

    // Check if native lazy loading is supported
    const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver not supported, loading critical elements immediately');
      // On older browsers, only load critical images immediately
      const criticalElements = document.querySelectorAll('[data-priority="critical"][data-src], [data-priority="high"][data-src]');
      criticalElements.forEach(el => {
        loadLazyElement(el, isSlowConnection);
      });

      // Defer other images
      const nonCriticalElements = document.querySelectorAll('[data-src]:not([data-priority="critical"]):not([data-priority="high"])');
      setTimeout(() => {
        nonCriticalElements.forEach(el => {
          loadLazyElement(el, isSlowConnection);
        });
      }, isSlowConnection ? 3000 : 1000);

      return;
    }

    // Create observer with different thresholds based on connection speed
    const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadLazyElement(entry.target, isSlowConnection);
          observer.unobserve(entry.target);
        }
      });
    }, {
      // Adjust root margin based on connection speed
      rootMargin: isSlowConnection ? '50px 0px' : '200px 0px',
      threshold: 0.01
    });

    // Handle elements differently based on priority and native lazy loading support
    const lazyElements = document.querySelectorAll('[data-src], [data-srcset], [data-background-src]');

    lazyElements.forEach(el => {
      // Get element priority
      const priority = el.dataset.priority || 'medium';

      // For images with native lazy loading support
      if (supportsNativeLazy && el.tagName === 'IMG') {
        // Critical images load immediately
        if (priority === 'critical') {
          el.loading = 'eager';
          loadLazyElement(el, isSlowConnection);
        }
        // High priority images use native lazy loading
        else if (priority === 'high') {
          el.loading = 'lazy';
          // Also use Intersection Observer as a fallback
          lazyObserver.observe(el);
        }
        // Medium and low priority use both native and our custom implementation
        else {
          el.loading = 'lazy';
          lazyObserver.observe(el);
        }
      }
      // For elements without native support, use our implementation
      else {
        // Critical elements load immediately
        if (priority === 'critical') {
          loadLazyElement(el, isSlowConnection);
        }
        // All others use Intersection Observer
        else {
          lazyObserver.observe(el);
        }
      }
    });

    // Add connection change listener to update loading strategy
    if (connection) {
      connection.addEventListener('change', () => {
        // Re-evaluate lazy loading strategy when connection changes
        console.log('Connection changed, updating lazy loading strategy');
      });
    }

    // Handle dynamically added elements with MutationObserver
    try {
      const mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(mutation => {
          try {
            // Check for new nodes with dataset attributes
            mutation.addedNodes.forEach(node => {
              // Check if it's an Element node
              if (node.nodeType === 1) { // 1 = Element
                // Check if the node itself has data-src
                if (node.dataset && (node.dataset.src || node.dataset.srcset || node.dataset.backgroundSrc)) {
                  const priority = node.dataset.priority || 'medium';
                  if (priority === 'critical') {
                    loadLazyElement(node, isSlowConnection);
                  } else {
                    lazyObserver.observe(node);
                  }
                }

                // Check its children
                const lazyChildren = node.querySelectorAll('[data-src], [data-srcset], [data-background-src]');
                lazyChildren.forEach(child => {
                  if (child && child.parentNode) {
                    const priority = child.dataset.priority || 'medium';
                    if (priority === 'critical') {
                      loadLazyElement(child, isSlowConnection);
                    } else {
                      lazyObserver.observe(child);
                    }
                  }
                });
              }
            });
          } catch (err) {
            console.warn('Error in mutation handler:', err);
          }
        });
      });

      // Start observing the document for added nodes
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (err) {
      console.warn('MutationObserver error:', err);
    }
  }

  /**
   * Load a lazy element with enhanced features
   * @param {Element} el - The element to load
   * @param {boolean} isSlowConnection - Whether the connection is slow
   */
  function loadLazyElement(el, isSlowConnection) {
    try {
      // Handle image elements
      if (el.tagName === 'IMG') {
        // Check if we should use a lower quality version on slow connections
        if (isSlowConnection && el.dataset.srcLow) {
          el.src = el.dataset.srcLow;
        } else if (el.dataset.src) {
          el.src = el.dataset.src;
        }

        // Handle srcset with responsive images
        if (isSlowConnection && el.dataset.srcsetLow) {
          el.srcset = el.dataset.srcsetLow;
        } else if (el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
        }

        // Handle sizes attribute
        if (el.dataset.sizes) {
          el.sizes = el.dataset.sizes;
        }

        // Clean up data attributes
        ['src', 'srcLow', 'srcset', 'srcsetLow', 'sizes'].forEach(attr => {
          if (el.dataset[attr]) {
            el.removeAttribute(`data-${attr.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
          }
        });

        // Add load event for fade-in effect
        if (!el.classList.contains('lazy-loaded')) {
          el.addEventListener('load', () => {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
              el.classList.add('lazy-loaded');
            }, 10);
          });

          // Add error handler
          el.addEventListener('error', () => {
            console.warn(`Failed to load image: ${el.src}`);
            // Try to load fallback image
            if (el.dataset.fallback) {
              el.src = el.dataset.fallback;
              el.removeAttribute('data-fallback');
            } else {
              el.src = '/images/fallback-image.svg';
            }
            el.classList.add('lazy-error');
          });
        }
      }
      // Handle background images
      else if (el.dataset.backgroundSrc) {
        // Use lower quality version on slow connections
        if (isSlowConnection && el.dataset.backgroundSrcLow) {
          el.style.backgroundImage = `url('${el.dataset.backgroundSrcLow}')`;
        } else {
          el.style.backgroundImage = `url('${el.dataset.backgroundSrc}')`;
        }

        // Clean up data attributes
        ['backgroundSrc', 'backgroundSrcLow'].forEach(attr => {
          if (el.dataset[attr]) {
            el.removeAttribute(`data-${attr.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
          }
        });

        // Add loaded class with a small delay for transition
        setTimeout(() => {
          el.classList.add('lazy-loaded');
        }, 10);
      }
      // Handle source elements in picture
      else if (el.tagName === 'SOURCE') {
        // Use lower quality version on slow connections
        if (isSlowConnection && el.dataset.srcsetLow) {
          el.srcset = el.dataset.srcsetLow;
        } else if (el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
        }

        // Clean up data attributes
        ['srcset', 'srcsetLow'].forEach(attr => {
          if (el.dataset[attr]) {
            el.removeAttribute(`data-${attr.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
          }
        });
      }
      // Handle iframe elements
      else if (el.tagName === 'IFRAME' && el.dataset.src) {
        el.src = el.dataset.src;
        el.removeAttribute('data-src');

        // Add loaded class with a small delay for transition
        setTimeout(() => {
          el.classList.add('lazy-loaded');
        }, 10);
      }

      // Add loaded class if not already added
      if (!el.classList.contains('lazy-loaded')) {
        el.classList.add('lazy-loaded');
      }
    } catch (error) {
      console.error('Error loading lazy element:', error);
    }
  }
})();
