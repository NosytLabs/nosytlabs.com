/**
 * Responsive Optimizer
 * Phase 2 Performance Enhancement: Optimized responsive utilities with memoization and debouncing
 */

import { logger } from '../logger';
import type { ResponsiveState } from '../responsive/types';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface OptimizedResponsiveState extends ResponsiveState {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  aspectRatio: number;
  lastUpdated: number;
  changeCount: number;
}

export interface ResponsiveObserverOptions {
  debounceMs?: number;
  throttleMs?: number;
  enableMemoization?: boolean;
  maxCacheSize?: number;
}

export interface ViewportMetrics {
  width: number;
  height: number;
  devicePixelRatio: number;
  orientation: 'portrait' | 'landscape';
  aspectRatio: number;
}

export interface PerformanceMetrics {
  calculationTime: number;
  cacheHitRate: number;
  totalCalculations: number;
  averageCalculationTime: number;
}

// ============================================================================
// MEMOIZATION CACHE
// ============================================================================

/**
 * High-performance memoization cache for responsive calculations
 */
export class ResponsiveMemoCache {
  private static instance: ResponsiveMemoCache;
  private cache = new Map<string, { result: any; timestamp: number; hitCount: number }>();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds
  private hitCount = 0;
  private missCount = 0;

  constructor(maxSize = 100, ttl = 5000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  static getInstance(maxSize?: number, ttl?: number): ResponsiveMemoCache {
    if (!ResponsiveMemoCache.instance) {
      ResponsiveMemoCache.instance = new ResponsiveMemoCache(maxSize, ttl);
    }
    return ResponsiveMemoCache.instance;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    entry.hitCount++;
    this.hitCount++;
    return entry.result as T;
  }

  set<T>(key: string, value: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      result: value,
      timestamp: Date.now(),
      hitCount: 0,
    });
  }

  private evictOldest(): void {
    // Find entry with lowest hit count and oldest timestamp
    let oldestKey = '';
    let oldestScore = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      const age = Date.now() - entry.timestamp;
      const score = entry.hitCount / (age / 1000); // Hits per second

      if (score < oldestScore) {
        oldestScore = score;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats(): { hitRate: number; size: number; totalRequests: number } {
    const totalRequests = this.hitCount + this.missCount;
    return {
      hitRate: totalRequests > 0 ? this.hitCount / totalRequests : 0,
      size: this.cache.size,
      totalRequests,
    };
  }
}

// ============================================================================
// DEBOUNCED EVENT HANDLER
// ============================================================================

/**
 * High-performance debounced event handler for responsive events
 */
export class DebouncedEventHandler {
  private timeouts = new Map<string, NodeJS.Timeout>();
  private lastExecution = new Map<string, number>();
  private executionCount = new Map<string, number>();

  /**
   * Debounce function execution
   */
  debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    key: string = 'default'
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      // Clear existing timeout
      const existingTimeout = this.timeouts.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        const now = Date.now();
        this.lastExecution.set(key, now);
        this.executionCount.set(key, (this.executionCount.get(key) || 0) + 1);

        fn(...args);
        this.timeouts.delete(key);
      }, delay);

      this.timeouts.set(key, timeout);
    };
  }

  /**
   * Throttle function execution
   */
  throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    key: string = 'default'
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const now = Date.now();
      const lastExec = this.lastExecution.get(key) || 0;

      if (now - lastExec >= delay) {
        this.lastExecution.set(key, now);
        this.executionCount.set(key, (this.executionCount.get(key) || 0) + 1);
        fn(...args);
      }
    };
  }

  /**
   * Get execution statistics
   */
  getStats(key: string): { executionCount: number; lastExecution: number } {
    return {
      executionCount: this.executionCount.get(key) || 0,
      lastExecution: this.lastExecution.get(key) || 0,
    };
  }

  /**
   * Clear all timeouts and reset stats
   */
  clear(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    this.lastExecution.clear();
    this.executionCount.clear();
  }
}

// ============================================================================
// OPTIMIZED RESPONSIVE CALCULATOR
// ============================================================================

/**
 * High-performance responsive state calculator with memoization
 */
export class OptimizedResponsiveCalculator {
  private static instance: OptimizedResponsiveCalculator;
  private cache: ResponsiveMemoCache;
  private eventHandler: DebouncedEventHandler;
  private performanceMetrics: PerformanceMetrics;
  private lastViewportMetrics: ViewportMetrics | null = null;
  private state: OptimizedResponsiveState | null = null;

  constructor(options: ResponsiveObserverOptions = {}) {
    this.cache = ResponsiveMemoCache.getInstance(
      options.maxCacheSize || 100,
      5000 // 5 second TTL
    );
    this.eventHandler = new DebouncedEventHandler();
    this.performanceMetrics = {
      calculationTime: 0,
      cacheHitRate: 0,
      totalCalculations: 0,
      averageCalculationTime: 0,
    };
  }

  static getInstance(options?: ResponsiveObserverOptions): OptimizedResponsiveCalculator {
    if (!OptimizedResponsiveCalculator.instance) {
      OptimizedResponsiveCalculator.instance = new OptimizedResponsiveCalculator(options);
    }
    return OptimizedResponsiveCalculator.instance;
  }

  /**
   * Calculate responsive state with optional memoization
   */
  calculateResponsiveState(
    width: number,
    height: number,
    options: { enableMemoization?: boolean } = {}
  ): OptimizedResponsiveState {
    const enableMemoization = options.enableMemoization !== false;
    const cacheKey = this.generateCacheKey(width, height);

    // Try cache first if memoization is enabled
    if (enableMemoization) {
      const cached = this.cache.get<OptimizedResponsiveState>(cacheKey);
      if (cached) {
        this.updatePerformanceMetrics(0, true);
        return cached;
      }
    }

    // Perform calculation
    const startTime = performance.now();
    const result = this.performCalculation(width, height);
    const calculationTime = performance.now() - startTime;

    // Cache the result if memoization is enabled
    if (enableMemoization) {
      this.cache.set(cacheKey, result);
    }

    this.updatePerformanceMetrics(calculationTime, false);
    this.state = result;
    return result;
  }

  private generateCacheKey(width: number, height: number): string {
    // Round to nearest 10px to improve cache hit rate for similar sizes
    const roundedWidth = Math.round(width / 10) * 10;
    const roundedHeight = Math.round(height / 10) * 10;

    // Include device pixel ratio and orientation
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    const orientation = width > height ? 'landscape' : 'portrait';

    return `${roundedWidth}x${roundedHeight}@${dpr}:${orientation}`;
  }

  private performCalculation(width: number, height: number): OptimizedResponsiveState {
    // Determine breakpoint
    const breakpoint = this.getBreakpoint(width);
    const isMobile = breakpoint === 'mobile';
    const isTablet = breakpoint === 'tablet';
    const isDesktop = breakpoint === 'desktop';

    // Calculate additional metrics
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const orientation: 'portrait' | 'landscape' = width <= height ? 'portrait' : 'landscape';
    const aspectRatio = width && height ? Number((width / height).toFixed(2)) : 0;

    const touchDevice = this.detectTouchDevice();
    const reducedMotion = this.getMediaQuery('(prefers-reduced-motion: reduce)');
    const highContrast = this.getMediaQuery('(prefers-contrast: high)');
    const screenReader = this.detectScreenReader();

    const now = Date.now();

    return {
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      width,
      height,
      devicePixelRatio,
      orientation,
      aspectRatio,
      touchDevice,
      screenReader,
      reducedMotion,
      highContrast,
      lastUpdated: now,
      changeCount: (this.state?.changeCount ?? 0) + 1,
    };
  }

  private getBreakpoint(width: number): 'mobile' | 'tablet' | 'desktop' {
    if (width < 768) {
      return 'mobile';
    } else if (width < 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  private detectTouchDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      (navigator as any).maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }

  private getMediaQuery(query: string): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  }

  private detectScreenReader(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return !!(
        (navigator as any).userAgent.match(/NVDA|JAWS|DRAGON/i) ||
        window.speechSynthesis ||
        (document as any).querySelector('[aria-live]')
      );
    } catch {
      return false;
    }
  }

  private updatePerformanceMetrics(calculationTime: number, wasCacheHit: boolean): void {
    this.performanceMetrics.totalCalculations++;

    if (!wasCacheHit) {
      this.performanceMetrics.calculationTime += calculationTime;
      this.performanceMetrics.averageCalculationTime =
        this.performanceMetrics.calculationTime / this.performanceMetrics.totalCalculations;
    }

    const cacheStats = this.cache.getStats();
    this.performanceMetrics.cacheHitRate = cacheStats.hitRate;
  }

  /**
   * Create optimized viewport change observer
   */
  createViewportObserver(
    callback: (state: OptimizedResponsiveState) => void,
    options: ResponsiveObserverOptions = {}
  ): () => void {
    const debounceMs = options.debounceMs || 100;
    const throttleMs = options.throttleMs || 16; // ~60fps

    const debouncedResize = this.eventHandler.debounce(
      () => {
        if (typeof window !== 'undefined') {
          const newMetrics: ViewportMetrics = {
             width: window.innerWidth,
             height: window.innerHeight,
             orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
             devicePixelRatio: window.devicePixelRatio || 1,
             aspectRatio: window.innerWidth / window.innerHeight
           };
          
          // Only proceed if there's a significant change
          if (this.hasSignificantChange(newMetrics)) {
            const state = this.calculateResponsiveState(
              window.innerWidth,
              window.innerHeight,
              { enableMemoization: options.enableMemoization ?? true }
            );
            callback(state);
          }
        }
      },
      debounceMs,
      'viewport-resize'
    );

    const throttledOrientationChange = this.eventHandler.throttle(
      () => {
        if (typeof window !== 'undefined') {
          // Small delay to ensure dimensions are updated after orientation change
          setTimeout(() => {
            const state = this.calculateResponsiveState(
              window.innerWidth,
              window.innerHeight,
              { enableMemoization: options.enableMemoization ?? true }
            );
            callback(state);
          }, 100);
        }
      },
      throttleMs,
      'orientation-change'
    );

    // Attach event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', debouncedResize);
      window.addEventListener('orientationchange', throttledOrientationChange);
    }

    // Return cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', debouncedResize);
        window.removeEventListener('orientationchange', throttledOrientationChange);
      }
    };
  }

  private hasSignificantChange(newMetrics: ViewportMetrics): boolean {
    if (!this.lastViewportMetrics) return true;

    const threshold = 10; // 10px threshold
    const hasChange = (
      Math.abs(newMetrics.width - this.lastViewportMetrics.width) > threshold ||
      Math.abs(newMetrics.height - this.lastViewportMetrics.height) > threshold ||
      newMetrics.orientation !== this.lastViewportMetrics.orientation
    );
    
    if (hasChange) {
      this.lastViewportMetrics = newMetrics;
    }
    
    return hasChange;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  reset(): void {
    this.cache.clear();
    this.eventHandler.clear();
    this.performanceMetrics = {
      calculationTime: 0,
      cacheHitRate: 0,
      totalCalculations: 0,
      averageCalculationTime: 0,
    };
    this.lastViewportMetrics = null;
    this.state = null;
  }
}

// ============================================================================
// FORM VALIDATION OPTIMIZER
// ============================================================================

/**
 * Optimized form validation with debouncing and memoization
 */
export class FormValidationOptimizer {
  private static instance: FormValidationOptimizer;
  private validationCache = new Map<string, { result: any; timestamp: number }>();
  private eventHandler: DebouncedEventHandler;
  private readonly CACHE_TTL = 30000; // 30 seconds

  constructor() {
    this.eventHandler = new DebouncedEventHandler();
  }

  static getInstance(): FormValidationOptimizer {
    if (!FormValidationOptimizer.instance) {
      FormValidationOptimizer.instance = new FormValidationOptimizer();
    }
    return FormValidationOptimizer.instance;
  }

  /**
   * Create a debounced field validator with caching
   */
  createFieldValidator<T>(
    validator: (value: T) => Promise<string | null>,
    debounceMs: number = 300
  ): (value: T, fieldName: string) => Promise<string | null> {
    return (value: T, fieldName: string) => {
      return new Promise((resolve) => {
        const cacheKey = `${fieldName}:${JSON.stringify(value)}`;
        
        // Check cache first
        const cached = this.validationCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          resolve(cached.result);
          return;
        }

        // Debounce validation
        const debouncedValidate = this.eventHandler.debounce(
          async () => {
            try {
              const result = await validator(value);
              this.validationCache.set(cacheKey, {
                result,
                timestamp: Date.now(),
              });
              resolve(result);
            } catch (error) {
              logger.error('Validation error:', error instanceof Error ? error : { error });
              resolve('Validation failed');
            }
          },
          debounceMs,
          `validation:${fieldName}`
        );

        debouncedValidate();
      });
    };
  }

  /**
   * Batch validate multiple fields
   */
  async batchValidate<T extends Record<string, any>>(
    values: T,
    validators: Record<keyof T, (value: any) => Promise<string | null>>
  ): Promise<Record<keyof T, string | null>> {
    const results: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;
    
    const validationPromises = Object.entries(validators).map(async ([fieldName, validator]) => {
      const value = values[fieldName as keyof T];
      const result = await validator(value);
      results[fieldName as keyof T] = result;
    });

    await Promise.all(validationPromises);
    return results;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  OptimizedResponsiveCalculator,
  FormValidationOptimizer,
  ResponsiveMemoCache,
  DebouncedEventHandler,
};
