/**
 * Performance Monitoring Utilities
 *
 * Comprehensive performance monitoring including Core Web Vitals tracking,
 * custom metrics, and analytics integration.
 *
 * @module performance/monitoring
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Extended PerformanceEntry for event timing
 */
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
  target: EventTarget | null;
}

/**
 * Extended PerformanceEntry for layout shifts
 */
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Core Web Vitals and performance metrics
 */
export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
}

/**
 * Custom metric entry
 */
export interface CustomMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: Record<string, unknown>;
}

// ========================================
// PERFORMANCE MONITOR CLASS
// ========================================

/**
 * Performance monitoring class for tracking Core Web Vitals and custom metrics.
 *
 * @example
 * ```typescript
 * const monitor = new PerformanceMonitor();
 *
 * // Track custom metric
 * monitor.trackCustomMetric('api_call_duration', 250);
 *
 * // Get all metrics
 * const metrics = monitor.getMetrics();
 *
 * // Send to analytics
 * await monitor.sendMetrics();
 *
 * // Cleanup
 * monitor.cleanup();
 * ```
 */
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private customMetrics: Map<string, CustomMetric[]> = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers for Core Web Vitals
   */
  private initializeObservers(): void {
    if (!("PerformanceObserver" in window)) return;

    // Largest Contentful Paint (LCP) Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn("LCP observer not supported:", error);
    }

    // First Input Delay (FID) Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEventTiming;
          this.metrics.firstInputDelay =
            eventEntry.processingStart - eventEntry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn("FID observer not supported:", error);
    }

    // Cumulative Layout Shift (CLS) Observer
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = this.metrics.cumulativeLayoutShift || 0;
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutEntry = entry as LayoutShift;
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value;
          }
        });
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    } catch (_error) {
      // CLS observer not supported
    }

    // First Contentful Paint (FCP) Observer
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === "first-contentful-paint") {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);
    } catch (_error) {
      // FCP observer not supported
    }

    // Navigation timing
    window.addEventListener("load", () => {
      this.captureNavigationTiming();
    });
  }

  /**
   * Capture navigation timing metrics
   */
  private captureNavigationTiming(): void {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.domContentLoaded =
        navigation.domContentLoadedEventEnd - navigation.fetchStart;

      // Calculate Time to Interactive (TTI) approximation
      if (navigation.domInteractive) {
        this.metrics.timeToInteractive =
          navigation.domInteractive - navigation.fetchStart;
      }
    }
  }

  /**
   * Get all collected performance metrics
   *
   * @returns Object containing all performance metrics
   */
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Get all custom metrics
   *
   * @returns Map of custom metrics by name
   */
  public getCustomMetrics(): Map<string, CustomMetric[]> {
    return new Map(this.customMetrics);
  }

  /**
   * Log metrics to console (development only)
   */
  public logMetrics(): void {
    if (process.env.NODE_ENV === "development") {
      // Performance Metrics
      // this.metrics
      // End Performance Metrics
    }
  }

  /**
   * Track a custom performance metric
   *
   * @param name - Metric name
   * @param value - Metric value
   * @param context - Optional context data
   *
   * @example
   * ```typescript
   * monitor.trackCustomMetric('api_response_time', 150, { endpoint: '/api/users' });
   * ```
   */
  public trackCustomMetric(
    name: string,
    value: number,
    context?: Record<string, unknown>,
  ): void {
    const metric: CustomMetric = {
      name,
      value,
      timestamp: Date.now(),
      context,
    };

    if (!this.customMetrics.has(name)) {
      this.customMetrics.set(name, []);
    }
    this.customMetrics.get(name)!.push(metric);

    if (process.env.NODE_ENV === "development") {
      // Custom metric tracked
    }
  }

  /**
   * Alias for trackCustomMetric for backward compatibility
   */
  public recordCustomMetric(name: string, value: number): void {
    this.trackCustomMetric(name, value);
  }

  /**
   * Record a metric with arbitrary data
   *
   * @param name - Metric name
   * @param data - Metric data
   */
  public recordMetric(name: string, data: unknown): void {
    if (typeof data === "number") {
      this.trackCustomMetric(name, data);
    } else if (process.env.NODE_ENV === "development") {
      console.warn(`📊 Recording metric "${name}":`, data);
    }
  }

  /**
   * Send metrics to analytics service
   *
   * @returns Promise that resolves when metrics are sent
   */
  public async sendMetrics(): Promise<void> {
    const payload = {
      type: "performance",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      metrics: this.metrics,
      customMetrics: Array.from(this.customMetrics.entries()).map(
        ([name, values]) => ({
          name,
          values,
        }),
      ),
      timestamp: Date.now(),
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    };

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "📤 Performance metrics (would be sent to analytics):",
        payload,
      );
      return;
    }

    try {
      // Analytics service integration would go here
      // Currently metrics are collected but not sent to external service
    } catch (error) {
      console.error("Failed to send performance metrics:", error);
    }
  }

  /**
   * Track an error with performance context
   *
   * @param error - Error to track
   * @param context - Additional context
   */
  public trackError(error: Error, context?: string): void {
    // Delegate to unified error handler
    import("../error-handling")
      .then(({ trackError }) => {
        trackError(error, context || "performance_monitor", "medium");
      })
      .catch((err) => {
        console.error("Failed to track error:", err);
      });
  }

  /**
   * Measure the duration of a function execution
   *
   * @param name - Metric name
   * @param fn - Function to measure
   * @returns Result of the function
   *
   * @example
   * ```typescript
   * const result = await monitor.measure('data_fetch', async () => {
   *   return await fetchData();
   * });
   * ```
   */
  public async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.trackCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.trackCustomMetric(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Measure synchronous function execution
   *
   * @param name - Metric name
   * @param fn - Function to measure
   * @returns Result of the function
   */
  public measureSync<T>(name: string, fn: () => T): T {
    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      this.trackCustomMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.trackCustomMetric(`${name}_error`, duration);
      throw error;
    }
  }

  /**
   * Mark a performance milestone
   *
   * @param name - Milestone name
   */
  public mark(name: string): void {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   *
   * @param name - Measure name
   * @param startMark - Start mark name
   * @param endMark - End mark name
   */
  public measureBetweenMarks(
    name: string,
    startMark: string,
    endMark: string,
  ): void {
    if (typeof performance !== "undefined" && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, "measure")[0];
        if (measure) {
          this.trackCustomMetric(name, measure.duration);
        }
      } catch (_error) {
        // Failed to measure between marks
      }
    }
  }

  /**
   * Get performance report summary
   *
   * @returns Performance report with recommendations
   */
  public getPerformanceReport(): {
    metrics: Partial<PerformanceMetrics>;
    customMetrics: Map<string, CustomMetric[]>;
    score: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let score = 100;

    // Check LCP (should be < 2.5s)
    if (this.metrics.largestContentfulPaint) {
      if (this.metrics.largestContentfulPaint > 4000) {
        recommendations.push(
          "LCP is too high (>4s). Optimize images and reduce render-blocking resources.",
        );
        score -= 20;
      } else if (this.metrics.largestContentfulPaint > 2500) {
        recommendations.push(
          "LCP needs improvement (>2.5s). Consider lazy loading and image optimization.",
        );
        score -= 10;
      }
    }

    // Check FID (should be < 100ms)
    if (this.metrics.firstInputDelay) {
      if (this.metrics.firstInputDelay > 300) {
        recommendations.push(
          "FID is too high (>300ms). Reduce JavaScript execution time.",
        );
        score -= 20;
      } else if (this.metrics.firstInputDelay > 100) {
        recommendations.push(
          "FID needs improvement (>100ms). Optimize JavaScript and use code splitting.",
        );
        score -= 10;
      }
    }

    // Check CLS (should be < 0.1)
    if (this.metrics.cumulativeLayoutShift) {
      if (this.metrics.cumulativeLayoutShift > 0.25) {
        recommendations.push(
          "CLS is too high (>0.25). Add size attributes to images and avoid dynamic content insertion.",
        );
        score -= 20;
      } else if (this.metrics.cumulativeLayoutShift > 0.1) {
        recommendations.push(
          "CLS needs improvement (>0.1). Reserve space for dynamic content.",
        );
        score -= 10;
      }
    }

    return {
      metrics: this.metrics,
      customMetrics: this.customMetrics,
      score: Math.max(0, score),
      recommendations,
    };
  }

  /**
   * Cleanup all observers and resources
   */
  public cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.customMetrics.clear();
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Create and start a performance monitor
 *
 * @returns New PerformanceMonitor instance
 *
 * @example
 * ```typescript
 * const monitor = startPerformanceMonitoring();
 * ```
 */
export function startPerformanceMonitoring(): PerformanceMonitor {
  return new PerformanceMonitor();
}

/**
 * Create a lazy loader using Intersection Observer
 *
 * @param callback - Function to call when element is visible
 * @param options - Intersection Observer options
 * @returns IntersectionObserver instance
 *
 * @example
 * ```typescript
 * const observer = createLazyLoader(() => {
 *   console.log('Element is visible!');
 * }, { threshold: 0.5 });
 *
 * observer.observe(element);
 * ```
 */
export function createLazyLoader(
  callback: () => void,
  options?: IntersectionObserverInit,
): IntersectionObserver | undefined {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.1,
      ...options,
    },
  );

  return observer;
}

/**
 * Preload a critical resource
 *
 * @param href - Resource URL
 * @param as - Resource type
 * @param type - MIME type (optional)
 *
 * @example
 * ```typescript
 * preloadResource('/fonts/inter.woff2', 'font', 'font/woff2');
 * preloadResource('/critical.css', 'style');
 * ```
 */
export function preloadResource(href: string, as: string, type?: string): void {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;

  document.head.appendChild(link);
}

/**
 * Dynamic import with fallback
 *
 * @param importFn - Import function
 * @param fallback - Fallback value if import fails
 * @returns Imported module or fallback
 *
 * @example
 * ```typescript
 * const module = await dynamicImport(
 *   () => import('./heavy-module'),
 *   { default: null }
 * );
 * ```
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: T,
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.warn("Dynamic import failed:", error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}
