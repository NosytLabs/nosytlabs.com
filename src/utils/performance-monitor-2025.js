/**
 * Performance Monitor 2025 for NosytLabs
 * Comprehensive performance monitoring with Core Web Vitals, real user metrics, and optimization insights
 * Features: LCP, FID, CLS tracking, resource timing, navigation timing, and performance recommendations
 */

class PerformanceMonitor2025 {
  constructor() {
    this.metrics = {
      coreWebVitals: {},
      navigationTiming: {},
      resourceTiming: [],
      customMetrics: {},
      errors: []
    };
    
    this.thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      TTFB: { good: 800, needsImprovement: 1800 },
      FCP: { good: 1800, needsImprovement: 3000 }
    };
    
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    this.setupCoreWebVitals();
    this.setupNavigationTiming();
    this.setupResourceTiming();
    this.setupCustomMetrics();
    this.setupErrorTracking();
    this.scheduleReporting();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  setupCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
    
    // Time to First Byte (TTFB)
    this.observeTTFB();
  }

  /**
   * Observe Largest Contentful Paint
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          this.metrics.coreWebVitals.LCP = {
            value: lastEntry.startTime,
            rating: this.getRating(lastEntry.startTime, this.thresholds.LCP),
            element: lastEntry.element?.tagName || 'unknown',
            timestamp: Date.now()
          };
          
          console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms (${this.metrics.coreWebVitals.LCP.rating})`);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        this.metrics.errors.push(`LCP observation error: ${error.message}`);
      }
    }
  }

  /**
   * Observe First Input Delay
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            this.metrics.coreWebVitals.FID = {
              value: entry.processingStart - entry.startTime,
              rating: this.getRating(entry.processingStart - entry.startTime, this.thresholds.FID),
              eventType: entry.name,
              timestamp: Date.now()
            };
            
            console.log(`📊 FID: ${this.metrics.coreWebVitals.FID.value.toFixed(2)}ms (${this.metrics.coreWebVitals.FID.rating})`);
          });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        this.metrics.errors.push(`FID observation error: ${error.message}`);
      }
    }
  }

  /**
   * Observe Cumulative Layout Shift
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.coreWebVitals.CLS = {
            value: clsValue,
            rating: this.getRating(clsValue, this.thresholds.CLS),
            timestamp: Date.now()
          };
          
          console.log(`📊 CLS: ${clsValue.toFixed(4)} (${this.metrics.coreWebVitals.CLS.rating})`);
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        this.metrics.errors.push(`CLS observation error: ${error.message}`);
      }
    }
  }

  /**
   * Observe First Contentful Paint
   */
  observeFCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.coreWebVitals.FCP = {
                value: entry.startTime,
                rating: this.getRating(entry.startTime, this.thresholds.FCP),
                timestamp: Date.now()
              };
              
              console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms (${this.metrics.coreWebVitals.FCP.rating})`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        this.metrics.errors.push(`FCP observation error: ${error.message}`);
      }
    }
  }

  /**
   * Observe Time to First Byte
   */
  observeTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        if (navigationEntry) {
          const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
          
          this.metrics.coreWebVitals.TTFB = {
            value: ttfb,
            rating: this.getRating(ttfb, this.thresholds.TTFB),
            timestamp: Date.now()
          };
          
          console.log(`📊 TTFB: ${ttfb.toFixed(2)}ms (${this.metrics.coreWebVitals.TTFB.rating})`);
        }
      } catch (error) {
        this.metrics.errors.push(`TTFB observation error: ${error.message}`);
      }
    }
  }

  /**
   * Setup navigation timing
   */
  setupNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      try {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        
        if (navigationEntry) {
          this.metrics.navigationTiming = {
            domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
            loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
            domInteractive: navigationEntry.domInteractive - navigationEntry.navigationStart,
            domComplete: navigationEntry.domComplete - navigationEntry.navigationStart,
            redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
            dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
            connectTime: navigationEntry.connectEnd - navigationEntry.connectStart,
            requestTime: navigationEntry.responseEnd - navigationEntry.requestStart,
            responseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
            timestamp: Date.now()
          };
          
          console.log('📊 Navigation Timing captured');
        }
      } catch (error) {
        this.metrics.errors.push(`Navigation timing error: ${error.message}`);
      }
    }
  }

  /**
   * Setup resource timing
   */
  setupResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            if (entry.initiatorType) {
              this.metrics.resourceTiming.push({
                name: entry.name,
                type: entry.initiatorType,
                duration: entry.duration,
                size: entry.transferSize || 0,
                cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
                timestamp: Date.now()
              });
            }
          });
        });
        
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        this.metrics.errors.push(`Resource timing error: ${error.message}`);
      }
    }
  }

  /**
   * Setup custom metrics
   */
  setupCustomMetrics() {
    // Memory usage
    if ('memory' in performance) {
      this.metrics.customMetrics.memory = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
    }

    // Connection information
    if ('connection' in navigator) {
      this.metrics.customMetrics.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
        timestamp: Date.now()
      };
    }

    // Device information
    this.metrics.customMetrics.device = {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      devicePixelRatio: window.devicePixelRatio,
      timestamp: Date.now()
    };
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.metrics.errors.push({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now()
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.push({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        timestamp: Date.now()
      });
    });

    // Resource errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.metrics.errors.push({
          type: 'resource',
          message: `Failed to load: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  /**
   * Get performance rating
   */
  getRating(value, thresholds) {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Generate performance report
   */
  generateReport() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      recommendations: this.generateRecommendations()
    };

    console.log('📊 Performance Report Generated');
    console.log('==============================');
    
    // Core Web Vitals
    console.log('\n🎯 Core Web Vitals:');
    Object.entries(this.metrics.coreWebVitals).forEach(([metric, data]) => {
      const icon = data.rating === 'good' ? '✅' : data.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`   ${icon} ${metric}: ${data.value.toFixed(2)}${metric === 'CLS' ? '' : 'ms'} (${data.rating})`);
    });

    // Navigation Timing
    if (Object.keys(this.metrics.navigationTiming).length > 0) {
      console.log('\n⏱️  Navigation Timing:');
      Object.entries(this.metrics.navigationTiming).forEach(([metric, value]) => {
        if (metric !== 'timestamp' && typeof value === 'number') {
          console.log(`   - ${metric}: ${value.toFixed(2)}ms`);
        }
      });
    }

    // Resource Summary
    if (this.metrics.resourceTiming.length > 0) {
      console.log('\n📦 Resource Summary:');
      const resourceTypes = {};
      let totalSize = 0;
      
      this.metrics.resourceTiming.forEach((resource) => {
        resourceTypes[resource.type] = (resourceTypes[resource.type] || 0) + 1;
        totalSize += resource.size;
      });
      
      Object.entries(resourceTypes).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count} resources`);
      });
      console.log(`   - Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    }

    // Errors
    if (this.metrics.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.metrics.errors.length}`);
      this.metrics.errors.slice(-5).forEach((error) => {
        console.log(`   - ${error.type}: ${error.message}`);
      });
    }

    return report;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // LCP recommendations
    if (this.metrics.coreWebVitals.LCP?.rating !== 'good') {
      recommendations.push({
        metric: 'LCP',
        issue: 'Largest Contentful Paint is slow',
        suggestions: [
          'Optimize images and use modern formats (WebP, AVIF)',
          'Implement lazy loading for non-critical images',
          'Minimize render-blocking resources',
          'Use a CDN for faster content delivery'
        ]
      });
    }

    // FID recommendations
    if (this.metrics.coreWebVitals.FID?.rating !== 'good') {
      recommendations.push({
        metric: 'FID',
        issue: 'First Input Delay is high',
        suggestions: [
          'Reduce JavaScript execution time',
          'Split large bundles and load code on demand',
          'Use web workers for heavy computations',
          'Minimize main thread blocking'
        ]
      });
    }

    // CLS recommendations
    if (this.metrics.coreWebVitals.CLS?.rating !== 'good') {
      recommendations.push({
        metric: 'CLS',
        issue: 'Cumulative Layout Shift is high',
        suggestions: [
          'Set explicit dimensions for images and videos',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS transforms instead of changing layout properties'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Schedule periodic reporting
   */
  scheduleReporting() {
    // Report after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.generateReport(), 1000);
    });

    // Report before page unload
    window.addEventListener('beforeunload', () => {
      this.generateReport();
    });
  }

  /**
   * Export metrics for external analysis
   */
  exportMetrics() {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  window.PerformanceMonitor2025 = PerformanceMonitor2025;
  
  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor2025();
    
    // Add global function for manual reporting
    window.generatePerformanceReport = () => {
      return window.performanceMonitor.generateReport();
    };
  });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor2025;
}
