/**
 * Sentry Integration Service
 * Enhanced error tracking and performance monitoring with Sentry
 */

import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

interface SentryConfig {
  dsn: string;
  environment?: string;
  release?: string;
  sampleRate?: number;
  tracesSampleRate?: number;
  debug?: boolean;
  beforeSend?: (event: Sentry.Event) => Sentry.Event | null;
}

interface PerformanceContext {
  url: string;
  userAgent: string;
  viewport: string;
  connection?: string;
  deviceMemory?: number;
}

class SentryIntegrationService {
  private config: SentryConfig;
  private isInitialized = false;
  private performanceContext: PerformanceContext;

  constructor(config: SentryConfig) {
    this.config = config;
    this.performanceContext = this.getPerformanceContext();
  }

  /**
   * Initialize Sentry with performance monitoring
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      Sentry.init({
        dsn: this.config.dsn,
        environment: this.config.environment || 'production',
        release: this.config.release,
        sampleRate: this.config.sampleRate || 1.0,
        tracesSampleRate: this.config.tracesSampleRate || 0.1,
        debug: this.config.debug || false,
        beforeSend: this.config.beforeSend || this.defaultBeforeSend.bind(this),
        
        integrations: [
          new BrowserTracing({
            // Capture interactions like clicks, navigation
            routingInstrumentation: Sentry.browserTracingIntegration(),
            
            // Track Core Web Vitals
            enableLongTask: true,
            enableInp: true,
            
            // Custom performance marks
            markBackgroundTransactions: true,
            
            // Network request tracking
            traceFetch: true,
            traceXHR: true,
          }),
        ],
        
        // Performance monitoring
        profilesSampleRate: 0.1,
        
        // Additional context
        initialScope: {
          tags: {
            component: 'performance-monitoring'
          },
          contexts: {
            performance: this.performanceContext
          }
        }
      });

      // Set user context
      this.setUserContext();
      
      // Setup custom error boundaries
      this.setupErrorBoundaries();
      
      this.isInitialized = true;
      console.log('Sentry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }

  /**
   * Track Core Web Vitals with Sentry
   */
  trackWebVitals(metric: any): void {
    if (!this.isInitialized) return;

    // Add metric as breadcrumb
    Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: 'info',
      data: {
        metricName: metric.name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        rating: this.getMetricRating(metric.name, metric.value)
      }
    });

    // Create performance measurement
    Sentry.setMeasurement(metric.name, metric.value, 'millisecond');
    
    // Track poor performance as issues
    const rating = this.getMetricRating(metric.name, metric.value);
    if (rating === 'poor') {
      Sentry.captureMessage(`Poor ${metric.name} performance: ${metric.value}ms`, {
        level: 'warning',
        tags: {
          metric: metric.name,
          rating: rating
        },
        extra: {
          metricData: metric,
          performanceContext: this.performanceContext
        }
      });
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformanceMetric(metricName: string, value: number, context?: Record<string, any>): void {
    if (!this.isInitialized) return;

    Sentry.setMeasurement(metricName, value, 'millisecond');
    
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${metricName}: ${value}ms`,
      level: 'info',
      data: {
        metric: metricName,
        value: value,
        ...context
      }
    });
  }

  /**
   * Track errors with enhanced context
   */
  trackError(error: Error | string, context?: {
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    user?: Record<string, any>;
    fingerprint?: string[];
  }): void {
    if (!this.isInitialized) return;

    Sentry.withScope((scope) => {
      if (context?.level) scope.setLevel(context.level);
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      if (context?.user) scope.setUser(context.user);
      if (context?.fingerprint) scope.setFingerprint(context.fingerprint);
      
      // Add performance context
      scope.setContext('performance', this.performanceContext);
      
      if (typeof error === 'string') {
        Sentry.captureMessage(error);
      } else {
        Sentry.captureException(error);
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

    const level = regression.severity === 'critical' ? 'error' : 'warning';
    const percentageIncrease = ((regression.current - regression.baseline) / regression.baseline) * 100;

    Sentry.captureMessage(`Performance regression detected: ${regression.metric}`, {
      level: level,
      tags: {
        type: 'performance-regression',
        metric: regression.metric,
        severity: regression.severity
      },
      extra: {
        currentValue: regression.current,
        baselineValue: regression.baseline,
        threshold: regression.threshold,
        percentageIncrease: percentageIncrease.toFixed(2),
        performanceContext: this.performanceContext
      }
    });
  }

  /**
   * Track budget violations
   */
  trackBudgetViolation(violation: {
    metric: string;
    actual: number;
    threshold: number;
    severity: 'warning' | 'error';
  }): void {
    if (!this.isInitialized) return;

    const level = violation.severity === 'error' ? 'error' : 'warning';
    const overage = ((violation.actual - violation.threshold) / violation.threshold) * 100;

    Sentry.captureMessage(`Performance budget violation: ${violation.metric}`, {
      level: level,
      tags: {
        type: 'budget-violation',
        metric: violation.metric,
        severity: violation.severity
      },
      extra: {
        actualValue: violation.actual,
        thresholdValue: violation.threshold,
        overagePercentage: overage.toFixed(2),
        performanceContext: this.performanceContext
      }
    });
  }

  /**
   * Start performance transaction
   */
  startTransaction(name: string, operation: string = 'navigation'): Sentry.Transaction | undefined {
    if (!this.isInitialized) return;

    return Sentry.startTransaction({
      name,
      op: operation,
      tags: {
        component: 'performance-monitoring'
      }
    });
  }

  /**
   * Add breadcrumb for user actions
   */
  addBreadcrumb(message: string, category: string = 'user', data?: Record<string, any>): void {
    if (!this.isInitialized) return;

    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data
    });
  }

  /**
   * Set user context
   */
  setUser(user: {
    id?: string;
    email?: string;
    username?: string;
    segment?: string;
  }): void {
    if (!this.isInitialized) return;

    Sentry.setUser(user);
  }

  /**
   * Set custom tags
   */
  setTag(key: string, value: string): void {
    if (!this.isInitialized) return;

    Sentry.setTag(key, value);
  }

  /**
   * Set custom context
   */
  setContext(key: string, context: Record<string, any>): void {
    if (!this.isInitialized) return;

    Sentry.setContext(key, context);
  }

  /**
   * Flush events (useful before page unload)
   */
  async flush(timeout: number = 2000): Promise<boolean> {
    if (!this.isInitialized) return false;

    return await Sentry.flush(timeout);
  }

  /**
   * Get performance context
   */
  private getPerformanceContext(): PerformanceContext {
    const nav = navigator as any;
    
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: nav.connection?.effectiveType || 'unknown',
      deviceMemory: nav.deviceMemory || undefined
    };
  }

  /**
   * Set user context based on browser info
   */
  private setUserContext(): void {
    const nav = navigator as any;
    
    Sentry.setContext('device', {
      memory: nav.deviceMemory,
      hardwareConcurrency: nav.hardwareConcurrency,
      platform: nav.platform,
      cookieEnabled: nav.cookieEnabled
    });

    if (nav.connection) {
      Sentry.setContext('network', {
        effectiveType: nav.connection.effectiveType,
        downlink: nav.connection.downlink,
        rtt: nav.connection.rtt,
        saveData: nav.connection.saveData
      });
    }
  }

  /**
   * Setup error boundaries for unhandled errors
   */
  private setupErrorBoundaries(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message), {
        level: 'error',
        tags: {
          source: 'global-error-handler'
        },
        extra: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        level: 'error',
        tags: {
          source: 'unhandled-promise-rejection'
        }
      });
    });
  }

  /**
   * Default beforeSend filter
   */
  private defaultBeforeSend(event: Sentry.Event): Sentry.Event | null {
    // Filter out known non-critical errors
    const ignoredErrors = [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error.'
    ];

    if (event.exception?.values?.[0]?.value) {
      const errorMessage = event.exception.values[0].value;
      if (ignoredErrors.some(ignored => errorMessage.includes(ignored))) {
        return null;
      }
    }

    return event;
  }

  /**
   * Get metric rating
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
   * Get initialization status
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

export { SentryIntegrationService, type SentryConfig, type PerformanceContext };