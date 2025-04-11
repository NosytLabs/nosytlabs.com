/**
 * Comprehensive Analytics Service
 * Tracks user interactions, performance metrics, and errors
 */

import errorHandler from './errorHandler';

class AnalyticsService {
  constructor() {
    this.enabled = true;
    this.queue = [];
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = performance.now();
    this.performanceMetrics = {};
    this.consentGranted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Check for analytics consent
    this.checkConsent();
    
    // Track initial page load
    this.trackPageView();
    
    // Setup performance monitoring
    this.capturePerformanceMetrics();
    
    // Setup error tracking integration
    errorHandler.init();
    errorHandler.captureError = this.trackError.bind(this);
    
    this.initialized = true;
  }

  checkConsent() {
    // Check localStorage for existing consent
    const consent = localStorage.getItem('analyticsConsent');
    this.consentGranted = consent === 'granted';
    this.enabled = this.consentGranted;
  }

  requestConsent() {
    if (this.consentGranted) return true;
    
    // In a real app, show a consent dialog here
    // For now we'll assume consent is granted
    this.consentGranted = true;
    localStorage.setItem('analyticsConsent', 'granted');
    this.enabled = true;
    return true;
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  trackPageView() {
    const pageData = {
      url: window.location.href,
      referrer: document.referrer,
      loadTime: performance.now() - this.pageLoadTime,
      timestamp: new Date().toISOString()
    };

    this.sendEvent('page_view', pageData);
  }

  trackEvent(eventName, eventData = {}) {
    if (!this.enabled) return;
    
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.sendEvent('custom_event', event);
  }

  trackError(errorData) {
    if (!this.enabled) return;
    
    const errorEvent = {
      type: 'error',
      error: errorData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.sendEvent('error', errorEvent);
  }

  capturePerformanceMetrics() {
    if (!window.performance) return;
    
    // Capture navigation timing
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (navigationTiming) {
      this.performanceMetrics.navigation = {
        dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
        connect: navigationTiming.connectEnd - navigationTiming.connectStart,
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        response: navigationTiming.responseEnd - navigationTiming.responseStart,
        domLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        load: navigationTiming.loadEventEnd - navigationTiming.loadEventStart
      };
    }

    // Capture resource timing
    const resources = performance.getEntriesByType('resource');
    this.performanceMetrics.resources = resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      initiatorType: resource.initiatorType,
      transferSize: resource.transferSize
    }));

    // Send initial performance data
    this.sendEvent('performance', this.performanceMetrics);
    
    // Set up periodic performance monitoring
    setInterval(() => {
      this.captureRuntimePerformance();
    }, 30000);
  }

  captureRuntimePerformance() {
    if (!window.performance || !window.performance.memory) return;
    
    const memory = performance.memory;
    this.performanceMetrics.runtime = {
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      timestamp: new Date().toISOString()
    };

    this.sendEvent('performance', this.performanceMetrics);
  }

  sendEvent(eventType, eventData) {
    if (!this.enabled) return;
    
    const payload = {
      type: eventType,
      data: eventData,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    };

    // In development, log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics]', payload);
    }

    // Queue events if offline
    if (!navigator.onLine) {
      this.queue.push(payload);
      return;
    }

    // Send to analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).catch(error => {
      errorHandler.captureError(error, { context: 'analytics' });
    });
  }

  flushQueue() {
    if (!this.queue.length) return;
    
    while (this.queue.length) {
      const event = this.queue.shift();
      this.sendEvent(event.type, event.data);
    }
  }
}

// Singleton instance
const analyticsService = new AnalyticsService();
analyticsService.init();

export default analyticsService;