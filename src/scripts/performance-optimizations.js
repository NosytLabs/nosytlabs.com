/**
 * Performance Optimizations for Nosyt Labs
 * Implements caching, lazy loading, and other performance enhancements
 */

// Service Worker Registration for Caching
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
}

// Lazy Loading Images
function setupLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
      // Use native lazy loading attribute as fallback
      const lazyImages = document.querySelectorAll('img.lazy');
      lazyImages.forEach(img => {
          if ('loading' in HTMLImageElement.prototype) {
              img.setAttribute('loading', 'lazy');
          }
      });
  }

// Preload Critical Resources
function preloadCriticalResources() {
  const preloadLinks = [
    { href: '/fonts/roboto-mono-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
    { href: '/images/terminal-background.webp', as: 'image' },
    { href: '/scripts/terminal-effects.js', as: 'script' }
  ];
  
  preloadLinks.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) {
      link.type = resource.type;
    }
    
    if (resource.crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

// Defer Non-Critical JavaScript
function deferNonCriticalJS() {
  const scripts = [
    '/scripts/analytics-manager.js',
    '/scripts/theme-manager.js',
    '/scripts/blog-manager.js'
  ];
  
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  });
}

// Optimize CSS Delivery
function optimizeCSSDelivery() {
  // Inline critical CSS
  const criticalCSS = `
    /* Critical CSS for above-the-fold content */
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0a;
      color: #33ff33;
      font-family: 'Roboto Mono', monospace;
    }
    
    .terminal-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    .terminal-header {
      border-bottom: 1px solid #33ff33;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
  
  // Load non-critical CSS asynchronously
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/styles/global.css';
  link.media = 'print';
  link.onload = function() {
    this.media = 'all';
  };
  document.head.appendChild(link);
}

// Implement Resource Hints
function implementResourceHints() {
  // DNS prefetch
  const dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect
  const preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnect.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Optimize Animations
function optimizeAnimations() {
  // Use requestAnimationFrame for smooth animations
  function animateElement(element, property, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const value = start + (end - start) * progress;
        
        element.style[property] = value + (property === 'opacity' ? '' : 'px');
        requestAnimationFrame(update);
      } else {
        element.style[property] = end + (property === 'opacity' ? '' : 'px');
      }
    }
    
    requestAnimationFrame(update);
  }
  
  // Expose animation function globally
  window.animateElement = animateElement;
  
  // Optimize CSS animations with will-change
  const animatedElements = document.querySelectorAll('.animated');
  
  animatedElements.forEach(element => {
    element.style.willChange = 'transform, opacity';
    
    // Clean up will-change after animation completes
    element.addEventListener('animationend', () => {
      element.style.willChange = 'auto';
    });
  });
}

// Implement Instant Page for faster navigation
function implementInstantPage() {
  const script = document.createElement('script');
  script.src = 'https://instant.page/5.2.0';
  script.type = 'module';
  script.integrity = 'sha384-jnZyxPjiipYXnSU0ygqeac2q7CVYMbh84q0uHVRRxEtvFPiQYbXWUorga2aqZJ0z';
  document.body.appendChild(script);
}

// Implement local storage caching for API responses
function setupLocalStorageCache() {
  // Cache API response in localStorage
  window.cacheApiResponse = function(key, data, expirationMinutes = 60) {
    const now = new Date();
    const item = {
      data: data,
      expiry: now.getTime() + (expirationMinutes * 60 * 1000)
    };
    
    localStorage.setItem(key, JSON.stringify(item));
  };
  
  // Get cached API response from localStorage
  window.getCachedApiResponse = function(key) {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.data;
  };
}

// Initialize all performance optimizations
function initPerformanceOptimizations() {
  // Register service worker for caching
  registerServiceWorker();
  
  // Set up lazy loading for images
  document.addEventListener('DOMContentLoaded', setupLazyLoading);
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Defer non-critical JavaScript
  deferNonCriticalJS();
  
  // Optimize CSS delivery
  optimizeCSSDelivery();
  
  // Implement resource hints
  implementResourceHints();
  
  // Optimize animations
  document.addEventListener('DOMContentLoaded', optimizeAnimations);
  
  // Implement instant page for faster navigation
  implementInstantPage();
  
  // Set up local storage caching
  setupLocalStorageCache();
    // Add native lazy loading attribute
    addNativeLazyLoading();

    // Conditionally defer additional non-critical JS
    deferAdditionalJS();

    // Conditionally async load additional CSS files
    asyncLoadAdditionalCSS();

    // Optional: Log basic web vitals (stub)
    window.addEventListener('load', () => {
      setTimeout(() => {
        if ('performance' in window) {
          const [entry] = performance.getEntriesByType('navigation');
          console.log('Page Load Time:', entry.loadEventEnd);
          console.log('DOM Content Loaded:', entry.domContentLoadedEventEnd);
        }
      }, 0);
    });
}

}
// Initialize performance optimizations
initPerformanceOptimizations();

export const animateElement = window.animateElement;
export const cacheApiResponse = window.cacheApiResponse;
export const getCachedApiResponse = window.getCachedApiResponse;

// Export functions for use in other modules

function deferAdditionalJS() {
    const scriptMap = [
      { src: '/scripts/terminal-background.js', condition: () => document.querySelector('.terminal-container') },
      { src: '/scripts/terminal-cli.js', condition: () => document.querySelector('.terminal-container') },
      { src: '/scripts/terminal-effects.js', condition: () => document.querySelector('.terminal-container') },
      { src: '/scripts/terminal-interactive.js', condition: () => document.querySelector('.terminal-container') },
      { src: '/scripts/radiation-admin.js', condition: () => document.querySelector('.radiation-admin') },
      { src: '/scripts/radiation-effects.js', condition: () => document.querySelector('.radiation-zone') },
      { src: '/scripts/radiation-zone-editor.js', condition: () => document.querySelector('.radiation-editor') },
      { src: '/scripts/vault-shelter-game.js', condition: () => document.querySelector('#vault-shelter-game') }
    ];
    scriptMap.forEach(({ src, condition }) => {
      if (condition()) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.body.appendChild(script);
      }
    });
}

function asyncLoadAdditionalCSS() {
    const cssMap = [
      { href: '/styles/admin.css', condition: () => document.querySelector('.admin-panel') },
      { href: '/styles/portfolio-grid.css', condition: () => document.querySelector('.portfolio-grid') },
      { href: '/styles/responsive.css', condition: () => true },
      { href: '/styles/terminal-animations.css', condition: () => document.querySelector('.terminal-container') }
    ];
    cssMap.forEach(({ href, condition }) => {
      if (condition()) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = function() {
          this.media = 'all';
        };
        document.head.appendChild(link);
      }
    });
}
