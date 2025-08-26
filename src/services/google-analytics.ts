/**
 * Google Analytics Integration Service
 * Tracks performance metrics, user interactions, and custom events
 */

interface GAConfig {
  measurementId: string;
  debug?: boolean;
  customDimensions?: Record<string, string>;
}

interface PerformanceEvent {
  event_name: string;
  custom_parameters?: Record<string, any>;
}

class GoogleAnalyticsService {
  private config: GAConfig;
  private isInitialized = false;
  private gtag: any;

  constructor(config: GAConfig) {
    this.config = config;
  }

  /**
   * Initialize Google Analytics
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      // Setup gtag function
      (window as any).dataLayer = (window as any).dataLayer || [];
      this.gtag = function() {
        (window as any).dataLayer.push(arguments);
      };

      this.gtag('js', new Date());
      this.gtag('config', this.config.measurementId, {
        debug_mode: this.config.debug,
        custom_map: this.config.customDimensions
      });

      this.isInitialized = true;
      console.log('Google Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(metric: any): void {
    if (!this.isInitialized) return;

    this.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_parameters: {
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: this.getMetricRating(metric.name, metric.value)
      }
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number, additionalData?: Record<string, any>): void {
    if (!this.isInitialized) return;

    this.gtag('event', 'performance_metric', {
      event_category: 'Performance',
      event_label: metricName,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metricName,
        metric_value: value,
        ...additionalData
      }
    });
  }

  /**
   * Track errors
   */
  trackError(error: {
    type: string;
    message: string;
    url?: string;
    line?: number;
    column?: number;
    stack?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    if (!this.isInitialized) return;

    this.gtag('event', 'exception', {
      description: error.message,
      fatal: error.severity === 'critical',
      custom_parameters: {
        error_type: error.type,
        error_url: error.url,
        error_line: error.line,
        error_column: error.column,
        error_severity: error.severity || 'medium',
        error_stack: error.stack?.substring(0, 500) // Limit stack trace length
      }
    });
  }

  /**
   * Track user interactions
   */
  trackInteraction(action: string, element?: string, value?: number): void {
    if (!this.isInitialized) return;

    this.gtag('event', action, {
      event_category: 'User Interaction',
      event_label: element,
      value: value
    });
  }

  /**
   * Track page performance
   */
  trackPagePerformance(pageData: {
    url: string;
    loadTime: number;
    domContentLoaded: number;
    firstByte: number;
    resourceCount: number;
  }): void {
    if (!this.isInitialized) return;

    // Track overall page load time
    this.gtag('event', 'page_load_time', {
      event_category: 'Performance',
      event_label: pageData.url,
      value: Math.round(pageData.loadTime),
      custom_parameters: {
        dom_content_loaded: pageData.domContentLoaded,
        time_to_first_byte: pageData.firstByte,
        resource_count: pageData.resourceCount,
        page_url: pageData.url
      }
    });

    // Track individual metrics
    this.trackPerformanceMetric('TTFB', pageData.firstByte, { page_url: pageData.url });
    this.trackPerformanceMetric('DCL', pageData.domContentLoaded, { page_url: pageData.url });
    this.trackPerformanceMetric('ResourceCount', pageData.resourceCount, { page_url: pageData.url });
  }

  /**
   * Track custom events
   */
  trackCustomEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isInitialized) return;

    this.gtag('event', eventName, {
      event_category: 'Custom',
      ...parameters
    });
  }

  /**
   * Set user properties
   */
  setUserProperty(propertyName: string, value: string): void {
    if (!this.isInitialized) return;

    this.gtag('config', this.config.measurementId, {
      user_properties: {
        [propertyName]: value
      }
    });
  }

  /**
   * Track performance budget violations
   */
  trackBudgetViolation(violation: {
    metric: string;
    actual: number;
    threshold: number;
    severity: 'warning' | 'error';
  }): void {
    if (!this.isInitialized) return;

    this.gtag('event', 'budget_violation', {
      event_category: 'Performance Budget',
      event_label: violation.metric,
      value: Math.round(violation.actual),
      custom_parameters: {
        metric_name: violation.metric,
        actual_value: violation.actual,
        threshold_value: violation.threshold,
        violation_severity: violation.severity,
        violation_percentage: Math.round(((violation.actual - violation.threshold) / violation.threshold) * 100)
      }
    });
  }

  /**
   * Get metric rating based on thresholds
   */
  private getMetricRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      'CLS': [0.1, 0.25],
      'FID': [100, 300],
      'LCP': [2500, 4000],
      'FCP': [1800, 3000],
      'TTFB': [800, 1800]
    };

    const [good, poor] = thresholds[metricName] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Enable enhanced measurement
   */
  enableEnhancedMeasurement(): void {
    if (!this.isInitialized) return;

    this.gtag('config', this.config.measurementId, {
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true
      }
    });
  }

  /**
   * Get initialization status
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

export { GoogleAnalyticsService, type GAConfig, type PerformanceEvent };