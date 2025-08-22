/**
 * Unified Performance Monitoring System
 * Performance monitoring utility (consolidated from multiple files)
 * Provides comprehensive Core Web Vitals tracking and performance auditing
 */

import { logger } from './logger';

// Environment detection for performance monitoring
const isDev = (): boolean => {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.includes('.local') ||
      hostname.includes('dev.') ||
      hostname.includes('staging.')
    );
  }
  return false;
};

// Development-aware logging
const devLog = {
  log: (message: string, ...args: any[]) => {
    if (isDev()) logger.info(message, ...args, 'Performance');
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev()) logger.warn(message, ...args, 'Performance');
  },
  error: (message: string, ...args: any[]) => {
    logger.error(message, ...args, 'Performance'); // Always log errors
  },
};

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceAuditMetrics {
  coreWebVitals: Record<string, number>;
  navigationTiming: Record<string, number>;
  resources: {
    totalRequests: number;
    totalSize: number;
    largestResources: Array<{
      name: string;
      size: number;
      duration: number;
      type: string;
    }>;
    slowestResources: Array<{
      name: string;
      size: number;
      duration: number;
      type: string;
    }>;
  };
  bundles: {
    cssSize: number;
    jsSize: number;
    imageSize: number;
    fontSize: number;
  };
  memory: Record<string, number>;
  opportunities: string[];
}

class UnifiedPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private auditMetrics: PerformanceAuditMetrics = {
    coreWebVitals: {},
    navigationTiming: {},
    resources: {
      totalRequests: 0,
      totalSize: 0,
      largestResources: [],
      slowestResources: []
    },
    bundles: {
      cssSize: 0,
      jsSize: 0,
      imageSize: 0,
      fontSize: 0
    },
    memory: {},
    opportunities: []
  };
  private observers = new Map<string, PerformanceObserver>();

  private thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
    FCP: { good: 1800, poor: 3000 },
  };

  constructor() {
    // ... (existing constructor code)
    this.initializeObservers();
    this.runAudit(); // Run audit on initialization
  }

  // ... (existing observer methods)

  public runAudit(): void {
    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observeMemory();
  }

  public getAuditMetrics(): PerformanceAuditMetrics {
    return this.auditMetrics;
  }

  private observeNavigationTiming(): void {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.auditMetrics.navigationTiming = {
          domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          domInteractive: navigationEntry.domInteractive,
          loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
        };
      }
    } catch (_error) {
      devLog.warn('Navigation timing audit failed');
    }
  }

  private observeMemory(): void {
    try {
      if ('memory' in performance) {
        this.auditMetrics.memory = {
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        };
      }
    } catch (_error) {
      devLog.warn('Memory audit failed');
    }
  }

  private initializeObservers(): void {
    // Only run in development or when explicitly enabled
    if (
      isDev() ||
      (typeof localStorage !== 'undefined' &&
        localStorage.getItem('performance-monitoring') === 'enabled')
    ) {
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
      this.observeTTFB();
      this.observeResourceTiming();
    }
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        if (lastEntry) {
          const value = lastEntry.startTime;
          this.recordMetric('LCP', value);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    } catch (_error) {
      devLog.warn('LCP observer not supported');
    }
  }

  private observeFID(): void {
    try {
      const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          if ('processingStart' in entry && typeof entry.processingStart === 'number') {
            const value = entry.processingStart - entry.startTime;
            this.recordMetric('FID', value);
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    } catch (_error) {
      devLog.warn('FID observer not supported');
    }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.recordMetric('CLS', clsValue);
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    } catch (_error) {
      devLog.warn('CLS observer not supported');
    }
  }

  private observeTTFB(): void {
    try {
      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.recordMetric('TTFB', ttfb);
      }
    } catch (_error) {
      devLog.warn('TTFB measurement failed');
    }
  }

  private observeResourceTiming(): void {
    try {
      const observer = new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          const resource = entry as PerformanceResourceTiming;

          // Monitor slow resources
          if (resource.duration > 1000) {
            devLog.warn(
              `Slow resource detected: ${resource.name} (${Math.round(resource.duration)}ms)`
            );
          }

          // Monitor large resources
          if (resource.transferSize && resource.transferSize > 500000) {
            // 500KB
            devLog.warn(
              `Large resource detected: ${resource.name} (${Math.round(resource.transferSize / 1024)}KB)`
            );
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    } catch (_error) {
      devLog.warn('Resource timing observer not supported');
    }
  }

  private recordMetric(name: string, value: number): void {
    const threshold = this.thresholds[name as keyof typeof this.thresholds];
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

    if (threshold) {
      if (value > threshold.poor) {
        rating = 'poor';
      } else if (value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    const metric: PerformanceMetric = {
      name,
      value: Math.round(value * 100) / 100,
      rating,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Log in development
    if (isDev()) {
      devLog.log(`${name}: ${metric.value}${name === 'CLS' ? '' : 'ms'} (${rating})`);
    }

    // Send to analytics in production (if configured)
    if (!isDev() && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        custom_parameter_1: rating,
      });
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      metrics: this.metrics.reduce(
        (acc, metric) => {
          if (!acc[metric.name]) {
            acc[metric.name] = [];
          }
          acc[metric.name]!.push({
            value: metric.value,
            rating: metric.rating,
            timestamp: metric.timestamp,
          });
          return acc;
        },
        {} as Record<string, any[]>
      ),
    };

    return JSON.stringify(report, null, 2);
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Initialize performance monitoring
let performanceMonitor: UnifiedPerformanceMonitor | null = null;

export function initPerformanceMonitoring(): UnifiedPerformanceMonitor | null {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    performanceMonitor = new UnifiedPerformanceMonitor();
  }
  return performanceMonitor;
}

export function getPerformanceMonitor(): UnifiedPerformanceMonitor | null {
  return performanceMonitor;
}

export { UnifiedPerformanceMonitor };
export type { PerformanceMetric, PerformanceAuditMetrics };
