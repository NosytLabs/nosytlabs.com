/**
 * Browser Compatibility and Polyfill Script for NosytLabs - 2025
 * Detects browser capabilities and applies necessary polyfills
 * Supports: Chrome 80+, Firefox 78+, Safari 14+, Edge 80+
 */

class BrowserCompatibility {
  constructor() {
    this.browser = this.detectBrowser();
    this.features = this.detectFeatures();
    this.init();
  }

  init() {
    this.addBrowserClasses();
    this.loadPolyfills();
    this.applyBrowserFixes();
    this.setupEventListeners();
    this.reportCompatibility();
  }

  detectBrowser() {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor;
    
    // Detect browser type and version
    let browser = {
      name: 'unknown',
      version: 0,
      engine: 'unknown'
    };

    if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
      browser.name = 'chrome';
      browser.engine = 'blink';
      browser.version = parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || '0');
    } else if (/Firefox/.test(userAgent)) {
      browser.name = 'firefox';
      browser.engine = 'gecko';
      browser.version = parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || '0');
    } else if (/Safari/.test(userAgent) && /Apple Computer/.test(vendor)) {
      browser.name = 'safari';
      browser.engine = 'webkit';
      browser.version = parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || '0');
    } else if (/Edg/.test(userAgent)) {
      browser.name = 'edge';
      browser.engine = 'blink';
      browser.version = parseInt(userAgent.match(/Edg\/(\d+)/)?.[1] || '0');
    }

    return browser;
  }

  detectFeatures() {
    const features = {
      // CSS Features
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex'),
      cssCustomProperties: CSS.supports('--test', 'value'),
      cssBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
      cssContainerQueries: CSS.supports('container-type', 'inline-size'),
      cssAspectRatio: CSS.supports('aspect-ratio', '16 / 9'),
      cssScrollbarGutter: CSS.supports('scrollbar-gutter', 'stable'),
      cssAccentColor: CSS.supports('accent-color', '#000000'),

      // JavaScript Features
      es6Modules: typeof import !== 'undefined',
      asyncAwait: typeof (async () => {}) === 'function',
      fetch: typeof fetch !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined',
      resizeObserver: typeof ResizeObserver !== 'undefined',
      mutationObserver: typeof MutationObserver !== 'undefined',
      webComponents: typeof customElements !== 'undefined',
      serviceWorker: 'serviceWorker' in navigator,
      webGL: this.detectWebGL(),
      webGL2: this.detectWebGL2(),

      // Web APIs
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      webWorkers: typeof Worker !== 'undefined',
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      battery: 'getBattery' in navigator,
      deviceOrientation: 'DeviceOrientationEvent' in window,

      // Media Features
      webP: this.detectWebP(),
      avif: this.detectAVIF(),
      webM: this.detectWebM(),
      mp4: this.detectMP4(),

      // Touch and Mobile
      touchEvents: 'ontouchstart' in window,
      pointerEvents: 'onpointerdown' in window,
      orientationChange: 'onorientationchange' in window,

      // Performance APIs
      performanceObserver: typeof PerformanceObserver !== 'undefined',
      performanceNavigation: typeof PerformanceNavigationTiming !== 'undefined',
      performancePaint: typeof PerformancePaintTiming !== 'undefined'
    };

    return features;
  }

  detectWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  detectWebGL2() {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  detectWebP() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  detectAVIF() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  detectWebM() {
    const video = document.createElement('video');
    return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
  }

  detectMP4() {
    const video = document.createElement('video');
    return video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') !== '';
  }

  addBrowserClasses() {
    const html = document.documentElement;
    
    // Add browser class
    html.classList.add(`is-${this.browser.name}`);
    html.classList.add(`engine-${this.browser.engine}`);
    
    // Add version class
    if (this.browser.version > 0) {
      html.classList.add(`${this.browser.name}-${this.browser.version}`);
    }

    // Add feature classes
    Object.entries(this.features).forEach(([feature, supported]) => {
      html.classList.add(supported ? `has-${feature}` : `no-${feature}`);
    });

    // Add mobile/desktop class
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    html.classList.add(isMobile ? 'is-mobile' : 'is-desktop');

    // Add touch class
    html.classList.add(this.features.touchEvents ? 'has-touch' : 'no-touch');
  }

  loadPolyfills() {
    const polyfills = [];

    // IntersectionObserver polyfill
    if (!this.features.intersectionObserver) {
      polyfills.push(this.loadIntersectionObserverPolyfill());
    }

    // ResizeObserver polyfill
    if (!this.features.resizeObserver) {
      polyfills.push(this.loadResizeObserverPolyfill());
    }

    // CSS Custom Properties polyfill for older browsers
    if (!this.features.cssCustomProperties) {
      polyfills.push(this.loadCSSCustomPropertiesPolyfill());
    }

    // Fetch polyfill
    if (!this.features.fetch) {
      polyfills.push(this.loadFetchPolyfill());
    }

    // Load all polyfills
    Promise.all(polyfills).then(() => {
      console.log('✅ Browser polyfills loaded successfully');
    }).catch((error) => {
      console.warn('⚠️ Some polyfills failed to load:', error);
    });
  }

  loadIntersectionObserverPolyfill() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadResizeObserverPolyfill() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadCSSCustomPropertiesPolyfill() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2';
      script.onload = () => {
        if (window.cssVars) {
          window.cssVars();
        }
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadFetchPolyfill() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=fetch';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  applyBrowserFixes() {
    // Safari-specific fixes
    if (this.browser.name === 'safari') {
      this.applySafariFixes();
    }

    // Firefox-specific fixes
    if (this.browser.name === 'firefox') {
      this.applyFirefoxFixes();
    }

    // Chrome-specific fixes
    if (this.browser.name === 'chrome') {
      this.applyChromeFixes();
    }

    // Edge-specific fixes
    if (this.browser.name === 'edge') {
      this.applyEdgeFixes();
    }

    // Mobile-specific fixes
    if (this.features.touchEvents) {
      this.applyMobileFixes();
    }
  }

  applySafariFixes() {
    // Fix iOS Safari viewport height issue
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
    }

    // Fix Safari date input
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      if (input.type !== 'date') {
        input.type = 'text';
        input.placeholder = 'YYYY-MM-DD';
      }
    });
  }

  applyFirefoxFixes() {
    // Fix Firefox flexbox issues
    const flexContainers = document.querySelectorAll('.flex, .d-flex');
    flexContainers.forEach(container => {
      container.style.minHeight = '0';
    });
  }

  applyChromeFixes() {
    // Fix Chrome autofill styling
    const style = document.createElement('style');
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px white inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    `;
    document.head.appendChild(style);
  }

  applyEdgeFixes() {
    // Fix Edge grid issues
    if (this.browser.version < 79) {
      const gridContainers = document.querySelectorAll('.grid, .d-grid');
      gridContainers.forEach(container => {
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
      });
    }
  }

  applyMobileFixes() {
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (parseFloat(getComputedStyle(input).fontSize) < 16) {
        input.style.fontSize = '16px';
      }
    });

    // Add touch-friendly classes
    document.body.classList.add('touch-device');
  }

  setupEventListeners() {
    // Handle orientation change
    if (this.features.orientationChange) {
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      });
    }

    // Handle visibility change
    if ('visibilityState' in document) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          // Page became visible, refresh if needed
          window.dispatchEvent(new CustomEvent('pageVisible'));
        }
      });
    }

    // Handle connection change
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        window.dispatchEvent(new CustomEvent('connectionChange', {
          detail: {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink
          }
        }));
      });
    }
  }

  reportCompatibility() {
    const report = {
      browser: this.browser,
      features: this.features,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1
      }
    };

    // Send compatibility report to analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'browser_compatibility', {
        browser_name: this.browser.name,
        browser_version: this.browser.version,
        css_grid: this.features.cssGrid,
        css_flexbox: this.features.cssFlexbox,
        intersection_observer: this.features.intersectionObserver
      });
    }

    // Store in sessionStorage for debugging
    try {
      sessionStorage.setItem('browserCompatibility', JSON.stringify(report));
    } catch (e) {
      // Ignore storage errors
    }

    console.log('🌐 Browser Compatibility Report:', report);
  }

  // Public API methods
  getBrowser() {
    return this.browser;
  }

  getFeatures() {
    return this.features;
  }

  isSupported(feature) {
    return this.features[feature] || false;
  }

  getCompatibilityScore() {
    const totalFeatures = Object.keys(this.features).length;
    const supportedFeatures = Object.values(this.features).filter(Boolean).length;
    return Math.round((supportedFeatures / totalFeatures) * 100);
  }
}

// Initialize browser compatibility
const browserCompatibility = new BrowserCompatibility();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrowserCompatibility;
} else if (typeof window !== 'undefined') {
  window.BrowserCompatibility = BrowserCompatibility;
  window.browserCompatibility = browserCompatibility;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Browser compatibility initialized');
  });
} else {
  console.log('✅ Browser compatibility initialized');
}
