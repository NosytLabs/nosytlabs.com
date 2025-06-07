/**
 * Performance Monitor for Core Web Vitals
 * Tracks and reports performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null
    };

    this.observers = new Map();
    this.init();
  }

  init() {
    this.measureFCP();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTFB();
  }

  measureFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
        this.reportMetric('FCP', fcpEntry.startTime);
        observer.disconnect();
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('fcp', observer);
  }

  measureLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  measureFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0];

      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
      this.reportMetric('FID', this.metrics.fid);
      observer.disconnect();
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', observer);
  }

  measureCLS() {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      this.metrics.cls = clsValue;
      this.reportMetric('CLS', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', observer);
  }

  measureTTFB() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const navigationEntry = entries[0];

      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.reportMetric('TTFB', this.metrics.ttfb);
      observer.disconnect();
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.set('ttfb', observer);
  }

  reportMetric(name, value) {
    console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize performance monitoring
window.PerformanceMonitor = new PerformanceMonitor();

export default PerformanceMonitor;