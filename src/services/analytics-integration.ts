/**
 * Analytics Integration Service
 * Combines Google Analytics and Sentry for comprehensive monitoring
 */

import { GoogleAnalyticsService, type GAConfig } from './google-analytics';
import { SentryIntegrationService, type SentryConfig } from './sentry-integration';
import { performanceMonitor } from './performance-monitor';
import { errorTracking } from './error-tracking';

interface AnalyticsConfig {
  googleAnalytics?: GAConfig;
  sentry?: SentryConfig;
  enableAutoTracking?: boolean;
  enableWebVitalsTracking?: boolean;
  enableErrorTracking?: boolean;
  enableUserInteractionTracking?: boolean;
}

interface TrackingEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

class AnalyticsIntegrationService {
  private config: AnalyticsConfig;
  private googleAnalytics?: GoogleAnalyticsService;
  private sentry?: SentryIntegrationService;
  private isInitialized = false;
  private sessionId: string;
  private pageLoadTime: number;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = Date.now();
  }

  /**
   * Initialize all analytics services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Google Analytics
      if (this.config.googleAnalytics) {
        this.googleAnalytics = new GoogleAnalyticsService(this.config.googleAnalytics);
        await this.googleAnalytics.initialize();
        
        if (this.config.googleAnalytics.debug) {
          console.log('Google Analytics initialized');
        }
      }

      // Initialize Sentry
      if (this.config.sentry) {
        this.sentry = new SentryIntegrationService(this.config.sentry);
        await this.sentry.initialize();
        
        if (this.config.sentry.debug) {
          console.log('Sentry initialized');
        }
      }

      // Setup automatic tracking
      if (this.config.enableAutoTracking) {
        this.setupAutoTracking();
      }

      // Setup Web Vitals tracking
      if (this.config.enableWebVitalsTracking) {
        this.setupWebVitalsTracking();
      }

      // Setup error tracking integration
      if (this.config.enableErrorTracking) {
        this.setupErrorTracking();
      }

      // Setup user interaction tracking
      if (this.config.enableUserInteractionTracking) {
        this.setupUserInteractionTracking();
      }

      this.isInitialized = true;
      
      // Track initialization
      this.trackEvent({
        name: 'analytics_initialized',
        category: 'System',
        customParameters: {
          session_id: this.sessionId,
          services: {
            google_analytics: !!this.googleAnalytics,
            sentry: !!this.sentry
          }
        }
      });

      console.log('Analytics Integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Analytics Integration:', error);
      this.trackError(error as Error, { level: 'error', tags: { source: 'analytics-init' } });
    }
  }

  /**
   * Track custom events to all services
   */
  trackEvent(event: TrackingEvent): void {
    if (!this.isInitialized) return;

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackCustomEvent(event.name, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParameters
      });
    }

    // Track to Sentry as breadcrumb
    if (this.sentry?.isReady()) {
      this.sentry.addBreadcrumb(
        `${event.category || 'Event'}: ${event.name}`,
        'user',
        {
          label: event.label,
          value: event.value,
          ...event.customParameters
        }
      );
    }
  }

  /**
   * Track performance metrics to all services
   */
  trackPerformanceMetric(metricName: string, value: number, context?: Record<string, any>): void {
    if (!this.isInitialized) return;

    const enrichedContext = {
      session_id: this.sessionId,
      page_url: window.location.href,
      timestamp: Date.now(),
      ...context
    };

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackPerformanceMetric(metricName, value, enrichedContext);
    }

    // Track to Sentry
    if (this.sentry?.isReady()) {
      this.sentry.trackPerformanceMetric(metricName, value, enrichedContext);
    }
  }

  /**
   * Track errors to all services
   */
  trackError(error: Error | string, context?: {
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }): void {
    if (!this.isInitialized) return;

    const enrichedContext = {
      session_id: this.sessionId,
      page_url: window.location.href,
      timestamp: Date.now(),
      ...context?.extra
    };

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      const errorData = {
        type: typeof error === 'string' ? 'message' : error.name,
        message: typeof error === 'string' ? error : error.message,
        url: window.location.href,
        severity: context?.severity || 'medium',
        stack: typeof error === 'object' ? error.stack : undefined
      };
      
      this.googleAnalytics.trackError(errorData);
    }

    // Track to Sentry
    if (this.sentry?.isReady()) {
      this.sentry.trackError(error, {
        level: context?.level || 'error',
        tags: {
          session_id: this.sessionId,
          ...context?.tags
        },
        extra: enrichedContext
      });
    }
  }

  /**
   * Track Web Vitals to all services
   */
  trackWebVitals(metric: any): void {
    if (!this.isInitialized) return;

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackWebVitals(metric);
    }

    // Track to Sentry
    if (this.sentry?.isReady()) {
      this.sentry.trackWebVitals(metric);
    }

    // Track as custom event
    this.trackEvent({
      name: 'web_vital_measured',
      category: 'Performance',
      label: metric.name,
      value: Math.round(metric.value),
      customParameters: {
        metric_id: metric.id,
        metric_delta: metric.delta,
        session_id: this.sessionId
      }
    });
  }

  /**
   * Track performance regression
   */
  trackPerformanceRegression(regression: {
    metric: string;
    current: number;
    baseline: number;
    threshold: number;
    severity: 'warning' | 'error' | 'critical';
  }): void {
    if (!this.isInitialized) return;

    // Track to Sentry
    if (this.sentry?.isReady()) {
      this.sentry.trackPerformanceRegression(regression);
    }

    // Track to Google Analytics
    this.trackEvent({
      name: 'performance_regression',
      category: 'Performance',
      label: regression.metric,
      value: Math.round(regression.current),
      customParameters: {
        baseline: regression.baseline,
        threshold: regression.threshold,
        severity: regression.severity,
        session_id: this.sessionId
      }
    });
  }

  /**
   * Set user properties for all services
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.isInitialized) return;

    // Set for Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.setUserProperties(properties);
    }

    // Set for Sentry
    if (this.sentry?.isReady()) {
      this.sentry.setUserContext(properties);
    }
  }

  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    if (!this.isInitialized) return;

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackPageView(page, title);
    }

    // Track as custom event
    this.trackEvent({
      name: 'page_view',
      category: 'Navigation',
      label: page,
      customParameters: {
        page_title: title,
        session_id: this.sessionId
      }
    });
  }

  /**
   * Track user interaction
   */
  trackUserInteraction(interaction: {
    type: 'click' | 'scroll' | 'form_submit' | 'download' | 'video_play' | 'search';
    element?: string;
    value?: string | number;
    context?: Record<string, any>;
  }): void {
    if (!this.isInitialized) return;

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackUserInteraction(interaction);
    }

    // Track as custom event
    this.trackEvent({
      name: `user_${interaction.type}`,
      category: 'User Interaction',
      label: interaction.element,
      value: typeof interaction.value === 'number' ? interaction.value : undefined,
      customParameters: {
        interaction_type: interaction.type,
        element: interaction.element,
        value: interaction.value,
        session_id: this.sessionId,
        ...interaction.context
      }
    });
  }

  /**
   * Track performance budget violation
   */
  trackBudgetViolation(violation: {
    metric: string;
    actual: number;
    budget: number;
    severity: 'warning' | 'error';
  }): void {
    if (!this.isInitialized) return;

    // Track to Google Analytics
    if (this.googleAnalytics?.isReady()) {
      this.googleAnalytics.trackBudgetViolation(violation);
    }

    // Track to Sentry
    if (this.sentry?.isReady()) {
      this.sentry.trackBudgetViolation(violation);
    }

    // Track as custom event
    this.trackEvent({
      name: 'performance_budget_violation',
      category: 'Performance',
      label: violation.metric,
      value: Math.round(violation.actual),
      customParameters: {
        budget: violation.budget,
        overage: violation.actual - violation.budget,
        severity: violation.severity,
        session_id: this.sessionId
      }
    });
  }

  /**
   * Setup automatic tracking
   */
  private setupAutoTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent({
        name: 'page_visibility_change',
        category: 'User Behavior',
        label: document.hidden ? 'hidden' : 'visible'
      });
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.pageLoadTime;
      this.trackEvent({
        name: 'page_unload',
        category: 'User Behavior',
        value: Math.round(sessionDuration / 1000),
        customParameters: {
          session_duration: sessionDuration,
          session_id: this.sessionId
        }
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.trackEvent({
          name: 'scroll_depth',
          category: 'User Behavior',
          label: `${scrollDepth}%`,
          value: scrollDepth
        });
      }
    };
    
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
  }

  /**
   * Setup Web Vitals tracking
   */
  private setupWebVitalsTracking(): void {
    // Import and setup web-vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.trackWebVitals.bind(this));
      getFID(this.trackWebVitals.bind(this));
      getFCP(this.trackWebVitals.bind(this));
      getLCP(this.trackWebVitals.bind(this));
      getTTFB(this.trackWebVitals.bind(this));
    }).catch(error => {
      console.warn('Failed to load web-vitals:', error);
    });

    // Setup performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.trackPerformanceMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
              this.trackPerformanceMetric('load_complete', navEntry.loadEventEnd - navEntry.loadEventStart);
            }
          }
        });
        
        observer.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  /**
   * Setup error tracking integration
   */
  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message), {
        level: 'error',
        tags: {
          source: 'global-error-handler',
          filename: event.filename,
          lineno: event.lineno?.toString(),
          colno: event.colno?.toString()
        },
        extra: {
          event_type: 'error',
          timestamp: event.timeStamp
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`), {
        level: 'error',
        tags: {
          source: 'unhandled-promise-rejection'
        },
        extra: {
          reason: event.reason,
          promise: event.promise
        }
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.trackError(new Error(`Resource loading failed: ${target.tagName}`), {
          level: 'warning',
          tags: {
            source: 'resource-loading-error',
            element: target.tagName.toLowerCase()
          },
          extra: {
            src: (target as any).src || (target as any).href,
            outerHTML: target.outerHTML
          }
        });
      }
    }, true);
  }

  /**
   * Setup user interaction tracking
   */
  private setupUserInteractionTracking(): void {
    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      
      // Track important clicks
      if (['a', 'button', 'input'].includes(tagName) || target.getAttribute('role') === 'button') {
        this.trackUserInteraction({
          type: 'click',
          element: tagName,
          value: target.textContent?.trim() || target.getAttribute('aria-label') || 'unknown',
          context: {
            href: (target as HTMLAnchorElement).href,
            type: (target as HTMLInputElement).type,
            id: target.id,
            className: target.className
          }
        });
      }
    });

    // Form submission tracking
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackUserInteraction({
        type: 'form_submit',
        element: 'form',
        value: form.id || form.className || 'unknown',
        context: {
          action: form.action,
          method: form.method,
          elements: form.elements.length
        }
      });
    });

    // Download tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const url = new URL(target.href, window.location.origin);
        const extension = url.pathname.split('.').pop()?.toLowerCase();
        
        if (extension && ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'].includes(extension)) {
          this.trackUserInteraction({
            type: 'download',
            element: 'link',
            value: url.pathname,
            context: {
              file_extension: extension,
              file_size: target.getAttribute('data-size'),
              download_url: target.href
            }
          });
        }
      }
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Flush all pending events
   */
  async flush(): Promise<void> {
    const promises: Promise<void>[] = [];

    if (this.googleAnalytics?.isReady()) {
      // Google Analytics doesn't have a flush method, but we can send a custom event
      this.googleAnalytics.trackCustomEvent('analytics_flush', {
        session_id: this.sessionId,
        timestamp: Date.now()
      });
    }

    if (this.sentry?.isReady()) {
      promises.push(this.sentry.flush());
    }

    await Promise.all(promises);
  }

  /**
   * Cleanup and destroy the service
   */
  destroy(): void {
    this.isInitialized = false;
    
    // Remove event listeners
    // Note: In a real implementation, you'd want to store references to the listeners
    // and remove them properly to avoid memory leaks
    
    this.flush().catch(console.error);
  }
}

// Export singleton instance
export const analyticsIntegration = new AnalyticsIntegrationService({
  enableAutoTracking: true,
  enableWebVitalsTracking: true,
  enableErrorTracking: true,
  enableUserInteractionTracking: true
});

export { AnalyticsIntegrationService, type AnalyticsConfig, type TrackingEvent };