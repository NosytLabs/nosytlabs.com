// Performance Monitor Script
(function() {
  'use strict';

  // Performance monitoring configuration
  const config = {
    enabled: true,
    interval: 5000,
    thresholds: {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      FCP: 1800,
      TTFB: 600
    }
  };

  // Performance metrics storage
  const metrics = {
    LCP: null,
    FID: null,
    CLS: 0,
    FCP: null,
    TTFB: null
  };

  // Initialize performance monitoring
  function initPerformanceMonitoring() {
    if (!config.enabled || typeof PerformanceObserver === 'undefined') {
      return;
    }

    // Monitor Largest Contentful Paint
    observeLCP();
    
    // Monitor First Input Delay
    observeFID();
    
    // Monitor Cumulative Layout Shift
    observeCLS();
    
    // Monitor First Contentful Paint
    observeFCP();
    
    // Monitor Time to First Byte
    observeTTFB();

    // Update dashboard periodically
    setInterval(updateDashboard, config.interval);
  }

  function observeLCP() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.LCP = Math.round(lastEntry.startTime);
        updateMetric('LCP', metrics.LCP);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }
  }

  function observeFID() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          metrics.FID = Math.round(entry.processingStart - entry.startTime);
          updateMetric('FID', metrics.FID);
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  }

  function observeCLS() {
    try {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        metrics.CLS = Math.round(clsValue * 1000) / 1000;
        updateMetric('CLS', metrics.CLS);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  function observeFCP() {
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.FCP = Math.round(entry.startTime);
            updateMetric('FCP', metrics.FCP);
          }
        });
      }).observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP monitoring not supported');
    }
  }

  function observeTTFB() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        metrics.TTFB = Math.round(navigation.responseStart - navigation.requestStart);
        updateMetric('TTFB', metrics.TTFB);
      }
    } catch (e) {
      console.warn('TTFB monitoring not supported');
    }
  }

  function updateMetric(name, value) {
    const element = document.querySelector(`[data-metric="${name}"]`);
    if (element) {
      element.textContent = formatMetricValue(name, value);
      
      // Update status based on threshold
      const threshold = config.thresholds[name];
      const isGood = name === 'CLS' ? value <= threshold : value <= threshold;
      element.className = `metric-value ${isGood ? 'metric-good' : 'metric-poor'}`;
    }
  }

  function formatMetricValue(name, value) {
    if (value === null || value === undefined) {
      return '-';
    }
    
    switch (name) {
      case 'CLS':
        return value.toFixed(3);
      case 'LCP':
      case 'FID':
      case 'FCP':
      case 'TTFB':
        return value + 'ms';
      default:
        return value.toString();
    }
  }

  function updateDashboard() {
    // Update performance score
    const score = calculatePerformanceScore();
    const scoreElement = document.querySelector('[data-metric="score"]');
    if (scoreElement) {
      scoreElement.textContent = score + '/100';
      scoreElement.className = `metric-value ${score >= 90 ? 'metric-good' : score >= 50 ? 'metric-fair' : 'metric-poor'}`;
    }

    // Update additional metrics
    updateAdditionalMetrics();
  }

  function calculatePerformanceScore() {
    let score = 100;
    
    // Deduct points based on thresholds
    if (metrics.LCP && metrics.LCP > config.thresholds.LCP) score -= 20;
    if (metrics.FID && metrics.FID > config.thresholds.FID) score -= 20;
    if (metrics.CLS && metrics.CLS > config.thresholds.CLS) score -= 20;
    if (metrics.FCP && metrics.FCP > config.thresholds.FCP) score -= 20;
    if (metrics.TTFB && metrics.TTFB > config.thresholds.TTFB) score -= 20;
    
    return Math.max(0, score);
  }

  function updateAdditionalMetrics() {
    // Update image count
    const images = document.querySelectorAll('img').length;
    const imageElement = document.querySelector('[data-metric="images"]');
    if (imageElement) {
      imageElement.textContent = images;
    }

    // Update resource count
    const resources = performance.getEntriesByType('resource').length;
    const resourceElement = document.querySelector('[data-metric="resources"]');
    if (resourceElement) {
      resourceElement.textContent = resources;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
  } else {
    initPerformanceMonitoring();
  }

  // Export for debugging
  window.performanceMetrics = metrics;
  window.performanceConfig = config;

})();
