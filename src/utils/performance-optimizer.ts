/**
 * Performance Optimizer for NosytLabs
 *
 * @fileoverview Comprehensive performance optimization system targeting 95+ Lighthouse scores
 * across all metrics including FCP, LCP, FID, CLS, and TTI.
 *
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import type { CoreWebVitals } from '@/types/performance';

/**
 * Performance metrics targets for Lighthouse optimization
 */
export const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  
  // Additional metrics
  FCP: 1800, // First Contentful Paint (ms)
  TTI: 3500, // Time to Interactive (ms)
  TBT: 300,  // Total Blocking Time (ms)
  SI: 3400,  // Speed Index (ms)
  
  // Lighthouse score targets
  PERFORMANCE_SCORE: 95,
  ACCESSIBILITY_SCORE: 95,
  BEST_PRACTICES_SCORE: 95,
  SEO_SCORE: 95
} as const;

/**
 * Critical resources that should be preloaded
 */
interface CriticalResource {
  href: string;
  as: string;
  type?: string;
  crossorigin?: string;
}

export const CRITICAL_RESOURCES: readonly CriticalResource[] = [
  {
    href: '/fonts/inter-var.woff2',
    as: 'font',
    type: 'font/woff2',
    crossorigin: 'anonymous'
  },
  {
    href: '/images/nosytlabs-logo-2025.svg',
    as: 'image'
  },
  {
    href: '/css/critical.css',
    as: 'style'
  }
] as const;

/**
 * Resource hints for external domains
 */
interface ResourceHintExtended {
  rel: string;
  href: string;
  crossorigin?: boolean | string;
}

export const RESOURCE_HINTS: readonly ResourceHintExtended[] = [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
  { rel: 'dns-prefetch', href: 'https://vercel.live' },
  { rel: 'dns-prefetch', href: 'https://vitals.vercel-analytics.com' }
] as const;

/**
 * Performance Optimizer class
 */
export class PerformanceOptimizer {
  private observer: IntersectionObserver | null = null;
  private metrics: Partial<CoreWebVitals> = {};

  constructor() {
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize comprehensive performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor layout shifts
    this.monitorLayoutShifts();
    
    // Monitor long tasks
    this.monitorLongTasks();
  }

  /**
   * Monitor Core Web Vitals (LCP, FID, CLS)
   */
  private monitorCoreWebVitals(): void {
    // Monitor LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.LCP = lastEntry.startTime;
        
        if (lastEntry.startTime > PERFORMANCE_TARGETS.LCP) {
          console.warn(`LCP is ${lastEntry.startTime}ms, target is ${PERFORMANCE_TARGETS.LCP}ms`);
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support LCP
      }

      // Monitor FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.FID = entry.processingStart - entry.startTime;
          
          if (this.metrics.FID > PERFORMANCE_TARGETS.FID) {
            console.warn(`FID is ${this.metrics.FID}ms, target is ${PERFORMANCE_TARGETS.FID}ms`);
          }
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support FID
      }
    }
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const resource = entry as PerformanceResourceTiming;
          
          // Check for slow resources
          if (resource.duration > 1000) {
            console.warn(`Slow resource: ${resource.name} took ${resource.duration}ms`);
          }
          
          // Check for failed resources
          if (resource.transferSize === 0 && resource.decodedBodySize === 0) {
            console.warn(`Failed to load resource: ${resource.name}`);
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Fallback
      }
    }
  }

  /**
   * Monitor layout shifts for CLS
   */
  private monitorLayoutShifts(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.CLS = clsValue;
        
        if (clsValue > PERFORMANCE_TARGETS.CLS) {
          console.warn(`CLS is ${clsValue}, target is ${PERFORMANCE_TARGETS.CLS}`);
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback
      }
    }
  }

  /**
   * Monitor long tasks that block the main thread
   */
  private monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Fallback
      }
    }
  }

  /**
   * Preload critical resources
   */
  public preloadCriticalResources(): void {
    if (typeof document === 'undefined') return;

    CRITICAL_RESOURCES.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      
      if (resource.type) {
        link.type = resource.type;
      }
      
      if (resource.crossorigin) {
        link.crossOrigin = resource.crossorigin;
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * Add resource hints for external domains
   */
  public addResourceHints(): void {
    if (typeof document === 'undefined') return;

    RESOURCE_HINTS.forEach((hint) => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      
      if (hint.crossorigin) {
        link.crossOrigin = typeof hint.crossorigin === 'string' ? hint.crossorigin : 'anonymous';
      }
      
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize images with lazy loading and modern formats
   */
  public optimizeImages(): void {
    if (typeof document === 'undefined') return;

    const images = document.querySelectorAll('img[data-src]');
    
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              this.observer?.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
    }

    images.forEach((img) => {
      this.observer?.observe(img);
    });
  }

  /**
   * Optimize fonts with font-display: swap
   */
  public optimizeFonts(): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): Partial<CoreWebVitals> {
    return { ...this.metrics };
  }

  /**
   * Check if performance targets are met
   */
  public checkPerformanceTargets(): { passed: boolean; issues: string[] } {
    const issues: string[] = [];

    if (this.metrics.LCP && this.metrics.LCP > PERFORMANCE_TARGETS.LCP) {
      issues.push(`LCP: ${this.metrics.LCP}ms (target: ${PERFORMANCE_TARGETS.LCP}ms)`);
    }

    if (this.metrics.FID && this.metrics.FID > PERFORMANCE_TARGETS.FID) {
      issues.push(`FID: ${this.metrics.FID}ms (target: ${PERFORMANCE_TARGETS.FID}ms)`);
    }

    if (this.metrics.CLS && this.metrics.CLS > PERFORMANCE_TARGETS.CLS) {
      issues.push(`CLS: ${this.metrics.CLS} (target: ${PERFORMANCE_TARGETS.CLS})`);
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  /**
   * Initialize all performance optimizations
   */
  public initialize(): void {
    this.preloadCriticalResources();
    this.addResourceHints();
    this.optimizeImages();
    this.optimizeFonts();
  }
}

/**
 * Global performance optimizer instance
 */
export const performanceOptimizer = new PerformanceOptimizer();
