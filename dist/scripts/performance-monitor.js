/**
 * Performance Monitoring Script
 * Real-time performance tracking and optimization
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    this.setupPerformanceObserver();
    this.setupIntersectionObserver();
    this.setupMutationObserver();
    this.trackUserInteractions();
    this.monitorResourceLoading();
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Monitor navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackNavigationTiming(entry);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Monitor resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackResourceTiming(entry);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Monitor paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPaintTiming(entry);
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Monitor largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackLCP(entry);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      this.observers.push(navObserver, resourceObserver, paintObserver, lcpObserver);
    }
  }

  setupIntersectionObserver() {
    // Monitor element visibility for performance insights
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.trackElementVisibility(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe key elements
    document.querySelectorAll('[data-track-visibility]').forEach(el => {
      visibilityObserver.observe(el);
    });

    this.observers.push(visibilityObserver);
  }

  setupMutationObserver() {
    // Monitor DOM changes that might affect performance
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 10) {
          this.trackDOMChanges(mutation);
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(mutationObserver);
  }

  trackNavigationTiming(entry) {
    this.metrics.navigation = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      ssl: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
      ttfb: entry.responseStart - entry.requestStart,
      download: entry.responseEnd - entry.responseStart,
      domParse: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      domReady: entry.domContentLoadedEventEnd - entry.navigationStart,
      loadComplete: entry.loadEventEnd - entry.navigationStart
    };

    this.reportMetrics('navigation', this.metrics.navigation);
  }

  trackResourceTiming(entry) {
    if (entry.duration > 1000) { // Resources taking more than 1 second
      this.metrics.slowResources = this.metrics.slowResources || [];
      this.metrics.slowResources.push({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
        type: this.getResourceType(entry.name)
      });
    }
  }

  trackPaintTiming(entry) {
    this.metrics.paint = this.metrics.paint || {};
    this.metrics.paint[entry.name] = entry.startTime;

    if (entry.name === 'first-contentful-paint') {
      this.reportMetrics('fcp', entry.startTime);
    }
  }

  trackLCP(entry) {
    this.metrics.lcp = entry.startTime;
    this.reportMetrics('lcp', entry.startTime);
  }

  trackUserInteractions() {
    let interactionCount = 0;
    
    ['click', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        if (interactionCount % 10 === 0) {
          this.reportMetrics('interactions', interactionCount);
        }
      }, { passive: true });
    });
  }

  monitorResourceLoading() {
    // Track failed resource loads
    window.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.metrics.failedResources = this.metrics.failedResources || [];
        this.metrics.failedResources.push({
          src: e.target.src || e.target.href,
          type: e.target.tagName,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  trackElementVisibility(element) {
    const elementId = element.id || element.className || element.tagName;
    this.metrics.elementVisibility = this.metrics.elementVisibility || {};
    this.metrics.elementVisibility[elementId] = Date.now();
  }

  trackDOMChanges(mutation) {
    this.metrics.domChanges = this.metrics.domChanges || 0;
    this.metrics.domChanges++;
    
    if (this.metrics.domChanges > 100) {
      console.warn('High DOM mutation count detected:', this.metrics.domChanges);
    }
  }

  getResourceType(url) {
    if (url.includes('.css')) return 'css';
    if (url.includes('.js')) return 'js';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  reportMetrics(type, data) {
    // Send metrics to analytics or logging service
    console.log(`Performance Metric [${type}]:`, data);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_type: type,
        metric_value: typeof data === 'number' ? data : JSON.stringify(data)
      });
    }
  }

  getPerformanceReport() {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      recommendations: this.generateRecommendations()
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.navigation?.ttfb > 500) {
      recommendations.push('Consider server-side optimizations to reduce TTFB');
    }
    
    if (this.metrics.lcp > 2500) {
      recommendations.push('Optimize largest contentful paint by improving image loading');
    }
    
    if (this.metrics.slowResources?.length > 0) {
      recommendations.push(`Optimize ${this.metrics.slowResources.length} slow-loading resources`);
    }
    
    if (this.metrics.failedResources?.length > 0) {
      recommendations.push(`Fix ${this.metrics.failedResources.length} failed resource loads`);
    }
    
    return recommendations;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for external use
window.PerformanceMonitor = performanceMonitor;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  performanceMonitor.cleanup();
});