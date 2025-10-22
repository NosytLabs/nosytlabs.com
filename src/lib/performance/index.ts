/**
 * Performance Module
 *
 * Unified performance management including monitoring, caching, and optimization.
 * This module provides a single entry point for all performance-related functionality.
 *
 * @module performance
 */

import { PerformanceMonitor, type PerformanceMetrics } from "./monitoring.js";
import { CacheManager, BrowserCache } from "./caching.js";
import { CodeSplitter, TaskScheduler, BundleAnalyzer } from "./optimization.js";

// Export all sub-modules
export * from "./monitoring.js";
export * from "./caching.js";
export * from "./optimization.js";

// ========================================
// UNIFIED PERFORMANCE MANAGER
// ========================================

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  enableMonitoring: boolean;
  enableCaching: boolean;
  enableOptimization: boolean;
  reportingInterval?: number;
  autoCleanup?: boolean;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  metrics: Partial<PerformanceMetrics>;
  cacheStats: {
    browserCacheKeys: number;
    serviceCacheEnabled: boolean;
  };
  optimizationStats: {
    modulesLoaded: number;
    modulesLoading: number;
    pendingTasks: number;
    totalBundleSize: number;
  };
  recommendations: string[];
  score: number;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  browserCacheKeys: number;
  serviceCacheEnabled: boolean;
}

/**
 * Optimization statistics
 */
export interface OptimizationStats {
  modulesLoaded: number;
  modulesLoading: number;
  pendingTasks: number;
  totalBundleSize: number;
}

/**
 * Unified Performance Manager
 * Coordinates all performance features including monitoring, caching, and optimization.
 *
 * @example
 * ```typescript
 * const manager = new UnifiedPerformanceManager({
 *   enableMonitoring: true,
 *   enableCaching: true,
 *   enableOptimization: true
 * });
 *
 * manager.initialize();
 *
 * // Get comprehensive performance report
 * const report = manager.getPerformanceReport();
 * console.log('Performance Score:', report.score);
 *
 * // Cleanup when done
 * manager.cleanup();
 * ```
 */
export class UnifiedPerformanceManager {
  private monitor?: PerformanceMonitor;
  private cacheManager?: CacheManager;
  private browserCache?: BrowserCache;
  private codeSplitter?: CodeSplitter;
  private taskScheduler?: TaskScheduler;
  private bundleAnalyzer?: BundleAnalyzer;
  private config: PerformanceConfig;
  private reportingInterval?: ReturnType<typeof setInterval>;

  constructor(config: PerformanceConfig) {
    this.config = {
      reportingInterval: 60000, // 1 minute
      autoCleanup: true,
      ...config,
    };
  }

  /**
   * Initialize all performance features
   */
  public initialize(): void {
    if (this.config.enableMonitoring) {
      this.monitor = new PerformanceMonitor();
    }

    if (this.config.enableCaching) {
      this.cacheManager = new CacheManager();
      this.browserCache = new BrowserCache();

      // Setup periodic cache cleanup
      if (this.config.autoCleanup && typeof setInterval !== "undefined") {
        setInterval(() => {
          this.browserCache?.cleanup();
        }, 300000); // 5 minutes
      }
    }

    if (this.config.enableOptimization) {
      this.codeSplitter = new CodeSplitter();
      this.taskScheduler = new TaskScheduler();
      this.bundleAnalyzer = new BundleAnalyzer();
    }

    // Setup periodic reporting
    if (this.config.reportingInterval && typeof setInterval !== "undefined") {
      this.reportingInterval = setInterval(() => {
        this.sendPerformanceReport();
      }, this.config.reportingInterval);
    }
  }

  /**
   * Get performance monitor instance
   */
  public getMonitor(): PerformanceMonitor | undefined {
    return this.monitor;
  }

  /**
   * Get cache manager instance
   */
  public getCacheManager(): CacheManager | undefined {
    return this.cacheManager;
  }

  /**
   * Get browser cache instance
   */
  public getBrowserCache(): BrowserCache | undefined {
    return this.browserCache;
  }

  /**
   * Get code splitter instance
   */
  public getCodeSplitter(): CodeSplitter | undefined {
    return this.codeSplitter;
  }

  /**
   * Get task scheduler instance
   */
  public getTaskScheduler(): TaskScheduler | undefined {
    return this.taskScheduler;
  }

  /**
   * Get bundle analyzer instance
   */
  public getBundleAnalyzer(): BundleAnalyzer | undefined {
    return this.bundleAnalyzer;
  }

  /**
   * Get comprehensive performance report
   *
   * @returns Performance report with metrics, stats, and recommendations
   */
  public getPerformanceReport(): PerformanceReport {
    const recommendations: string[] = [];
    let score = 100;

    // Get monitoring metrics
    const metrics = this.monitor?.getMetrics() || {};
    if (this.monitor) {
      const monitorReport = this.monitor.getPerformanceReport();
      recommendations.push(...monitorReport.recommendations);
      score = Math.min(score, monitorReport.score);
    }

    // Get cache stats
    const cacheStats: CacheStats = {
      browserCacheKeys: this.browserCache?.keys().length || 0,
      serviceCacheEnabled:
        typeof navigator !== "undefined" && "serviceWorker" in navigator,
    };

    // Get optimization stats
    const optimizationStats: OptimizationStats = {
      modulesLoaded: this.codeSplitter?.getCacheStats().loaded || 0,
      modulesLoading: this.codeSplitter?.getCacheStats().loading || 0,
      pendingTasks: this.taskScheduler?.getQueueStats().pending || 0,
      totalBundleSize: this.bundleAnalyzer?.getTotalBundleSize() || 0,
    };

    // Add optimization recommendations
    if (optimizationStats.totalBundleSize > 500000) {
      // > 500KB
      recommendations.push(
        "Total bundle size is large (>500KB). Consider code splitting and lazy loading.",
      );
      score -= 10;
    }

    if (optimizationStats.pendingTasks > 100) {
      recommendations.push(
        "High number of pending tasks. Consider optimizing task scheduling.",
      );
      score -= 5;
    }

    return {
      metrics,
      cacheStats,
      optimizationStats,
      recommendations,
      score: Math.max(0, score),
    };
  }

  /**
   * Send performance report to analytics
   */
  private async sendPerformanceReport(): Promise<void> {
    if (!this.monitor) return;

    try {
      await this.monitor.sendMetrics();
    } catch (error) {
      console.error("Failed to send performance report:", error);
    }
  }

  /**
   * Track custom metric
   *
   * @param name - Metric name
   * @param value - Metric value
   * @param context - Optional context
   */
  public trackMetric(
    name: string,
    value: number,
    context?: Record<string, unknown>,
  ): void {
    this.monitor?.trackCustomMetric(name, value, context);
  }

  /**
   * Measure async operation
   *
   * @param name - Operation name
   * @param fn - Async function to measure
   * @returns Result of the function
   */
  public async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (this.monitor) {
      return this.monitor.measure(name, fn);
    }
    return fn();
  }

  /**
   * Cache data in browser storage
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds
   */
  public cacheData<T>(key: string, value: T, ttl?: number): void {
    this.browserCache?.set(key, value, ttl);
  }

  /**
   * Get cached data
   *
   * @param key - Cache key
   * @returns Cached value or null
   */
  public getCachedData<T>(key: string): T | null {
    return this.browserCache?.get<T>(key) || null;
  }

  /**
   * Schedule a task
   *
   * @param task - Task function
   */
  public scheduleTask(task: () => void): void {
    this.taskScheduler?.addTask(task);
  }

  /**
   * Import module with code splitting
   *
   * @param modulePath - Module path
   * @returns Imported module
   */
  public async importModule<T>(modulePath: string): Promise<T> {
    if (this.codeSplitter) {
      return this.codeSplitter.importModule<T>(modulePath);
    }
    return import(modulePath);
  }

  /**
   * Log performance metrics to console
   */
  public logMetrics(): void {
    this.monitor?.logMetrics();

    if (this.bundleAnalyzer) {
      this.bundleAnalyzer.analyzeBundleSize();
    }

    // Performance report is generated and tracked internally
  }

  /**
   * Cleanup all resources
   */
  public cleanup(): void {
    this.monitor?.cleanup();
    this.browserCache?.clear();
    this.codeSplitter?.clearCache();
    this.taskScheduler?.clearTasks();

    if (this.reportingInterval) {
      clearInterval(this.reportingInterval);
    }
  }
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Create and initialize a unified performance manager
 *
 * @param config - Performance configuration
 * @returns Initialized performance manager
 *
 * @example
 * ```typescript
 * const manager = createPerformanceManager({
 *   enableMonitoring: true,
 *   enableCaching: true,
 *   enableOptimization: true
 * });
 * ```
 */
export function createPerformanceManager(
  config: PerformanceConfig,
): UnifiedPerformanceManager {
  const manager = new UnifiedPerformanceManager(config);
  manager.initialize();
  return manager;
}

/**
 * Create a default performance manager with all features enabled
 *
 * @returns Initialized performance manager
 */
export function createDefaultPerformanceManager(): UnifiedPerformanceManager {
  return createPerformanceManager({
    enableMonitoring: true,
    enableCaching: true,
    enableOptimization: true,
    reportingInterval: 60000,
    autoCleanup: true,
  });
}
