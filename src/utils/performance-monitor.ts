/**
 * Performance Monitor Utility
 * Advanced performance monitoring and Core Web Vitals tracking
 * 
 * @fileoverview Comprehensive performance monitoring system
 * @module utils/performance-monitor
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 2025-06-16
 * 
 * @description Monitors Core Web Vitals, resource loading, and user interactions
 * to provide insights into real-world performance metrics.
 */

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  loadTime?: number;
  domContentLoaded?: number;
  resourceCount?: number;
  cacheHitRate?: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  initiatorType: string;
}

/**
 * Advanced Performance Monitor Class
 * Tracks Core Web Vitals and provides performance insights
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  private init(): void {
    if (typeof window === 'undefined' || this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupCoreWebVitals();
    this.setupResourceTiming();
    this.setupNavigationTiming();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupCoreWebVitals(): void {
    // First Contentful Paint (FCP)
    this.observePerformanceEntry('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        this.metrics.lcp = lcpEntry.startTime;
      }
    });

    // First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      const fidEntry = entries[0];
      if (fidEntry) {
        this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
      }
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entries) => {
      let clsValue = 0;
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cls = clsValue;
    });
  }

  /**
   * Setup resource timing monitoring
   */
  private setupResourceTiming(): void {
    this.observePerformanceEntry('resource', (entries) => {
      this.metrics.resourceCount = entries.length;
      
      // Calculate cache hit rate
      const cachedResources = entries.filter(entry => 
        (entry as PerformanceResourceTiming).transferSize === 0 &&
        (entry as PerformanceResourceTiming).decodedBodySize > 0
      );
      
      this.metrics.cacheHitRate = cachedResources.length / entries.length;
    });
  }

  /**
   * Setup navigation timing
   */
  private setupNavigationTiming(): void {
    this.observePerformanceEntry('navigation', (entries) => {
      const navEntry = entries[0] as PerformanceNavigationTiming;
      if (navEntry) {
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        this.metrics.loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        this.metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
      }
    });
  }

  /**
   * Generic performance observer setup
   */
  private observePerformanceEntry(
    entryType: string, 
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get resource timing details
   */
  public getResourceTiming(): ResourceTiming[] {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
      decodedBodySize: resource.decodedBodySize,
      initiatorType: resource.initiatorType
    }));
  }

  /**
   * Generate performance report
   */
  public generateReport(): string {
    const metrics = this.getMetrics();
    const resources = this.getResourceTiming();
    
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics,
      resourceSummary: {
        total: resources.length,
        totalSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
        cacheHitRate: metrics.cacheHitRate || 0
      }
    }, null, 2);
  }

  /**
   * Send metrics to analytics
   */
  public sendToAnalytics(): void {
    const metrics = this.getMetrics();
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          window.gtag('event', 'performance_metric', {
            metric_name: key,
            metric_value: Math.round(value),
            custom_parameter: window.location.pathname
          });
        }
      });
    }
  }

  /**
   * Cleanup observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

/**
 * Global performance monitor instance
 */
let globalMonitor: PerformanceMonitor | null = null;

/**
 * Get or create global performance monitor
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    const monitor = getPerformanceMonitor();
    
    // Send metrics on page unload
    window.addEventListener('beforeunload', () => {
      monitor.sendToAnalytics();
    });
    
    // Send metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        monitor.sendToAnalytics();
      }, 1000);
    });
  }
}
