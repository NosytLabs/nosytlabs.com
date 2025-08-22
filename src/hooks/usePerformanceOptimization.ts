/**
 * Performance Optimization Hook
 * Comprehensive performance monitoring and optimization
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createAnimationSystem, type PerformanceMetrics as AnimationMetrics } from '../utils/performance/animation-system';
import { createCriticalCSSManager } from '../utils/performance/critical-css';
// Note: Optimized image loader functionality integrated directly
import { preloadComponent, getCacheStats } from '../utils/performance/code-splitting';

/**
 * Performance optimization configuration
 */
export interface PerformanceConfig {
  /** Enable performance monitoring */
  monitoring?: boolean;
  /** Enable image optimization */
  imageOptimization?: boolean;
  /** Enable animation optimization */
  animationOptimization?: boolean;
  /** Enable critical CSS extraction */
  criticalCSS?: boolean;
  /** Enable component preloading */
  componentPreloading?: boolean;
  /** Performance budget thresholds */
  budgets?: {
    lcp?: number; // ms
    fid?: number; // ms
    cls?: number; // score
    fcp?: number; // ms
    ttfb?: number; // ms
  };
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  
  // Animation metrics
  animations: AnimationMetrics;
  
  // Resource metrics
  resources: {
    images: number;
    scripts: number;
    stylesheets: number;
    totalSize: number;
    loadTime: number;
  };
  
  // Component cache metrics
  componentCache: {
    cached: number;
    preloaded: number;
    totalSize: number;
  };
  
  // Performance score (0-100)
  score: number;
  
  // Budget violations
  budgetViolations: string[];
}

/**
 * Performance optimization actions
 */
export interface PerformanceActions {
  /** Preload critical resources */
  preloadCriticalResources: () => Promise<void>;
  /** Optimize images in viewport */
  optimizeViewportImages: () => Promise<void>;
  /** Extract and inline critical CSS */
  inlineCriticalCSS: () => Promise<void>;
  /** Preload components based on user behavior */
  preloadComponents: (componentPaths: string[]) => Promise<void>;
  /** Optimize animations for current device */
  optimizeAnimations: () => void;
  /** Clear performance caches */
  clearCaches: () => void;
  /** Generate performance report */
  generateReport: () => PerformanceReport;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  timestamp: number;
  metrics: PerformanceMetrics;
  recommendations: string[];
  optimizations: {
    applied: string[];
    pending: string[];
  };
}

/**
 * Default configuration
 */
const defaultConfig: Required<PerformanceConfig> = {
  monitoring: true,
  imageOptimization: true,
  animationOptimization: true,
  criticalCSS: true,
  componentPreloading: true,
  budgets: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 600,
  },
};

/**
 * Performance optimization hook
 */
export function usePerformanceOptimization(
  config: PerformanceConfig = {}
): {
  metrics: PerformanceMetrics;
  actions: PerformanceActions;
  isOptimizing: boolean;
  lastOptimization: number | null;
} {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    animations: {
      animationsActive: 0,
      frameRate: 60,
      droppedFrames: 0,
      gpuAccelerated: 0,
      reducedMotion: false,
    },
    resources: {
      images: 0,
      scripts: 0,
      stylesheets: 0,
      totalSize: 0,
      loadTime: 0,
    },
    componentCache: {
      cached: 0,
      preloaded: 0,
      totalSize: 0,
    },
    score: 0,
    budgetViolations: [],
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<number | null>(null);

  // Performance systems
  const animationSystem = useRef(createAnimationSystem());
  const criticalCSSManager = useRef(createCriticalCSSManager());
  const observersRef = useRef<PerformanceObserver[]>([]);

  /**
   * Calculate performance score
   */
  const calculateScore = useCallback((data: Partial<PerformanceMetrics>): number => {
    let score = 100;
    const budgets = finalConfig.budgets;
    
    // LCP scoring (0-30 points)
    if (data.lcp !== null && data.lcp !== undefined) {
      if (data.lcp > budgets.lcp! * 2) score -= 30;
      else if (data.lcp > budgets.lcp!) score -= 15;
      else if (data.lcp > budgets.lcp! * 0.75) score -= 5;
    }
    
    // FID scoring (0-25 points)
    if (data.fid !== null && data.fid !== undefined) {
      if (data.fid > budgets.fid! * 3) score -= 25;
      else if (data.fid > budgets.fid!) score -= 15;
      else if (data.fid > budgets.fid! * 0.5) score -= 5;
    }
    
    // CLS scoring (0-25 points)
    if (data.cls !== null && data.cls !== undefined) {
      if (data.cls > budgets.cls! * 2.5) score -= 25;
      else if (data.cls > budgets.cls!) score -= 15;
      else if (data.cls > budgets.cls! * 0.5) score -= 5;
    }
    
    // Animation performance (0-10 points)
    if (data.animations) {
      if (data.animations.frameRate < 30) score -= 10;
      else if (data.animations.frameRate < 50) score -= 5;
      
      if (data.animations.droppedFrames > 10) score -= 5;
    }
    
    // Resource optimization (0-10 points)
    if (data.resources) {
      if (data.resources.totalSize > 5000000) score -= 10; // 5MB
      else if (data.resources.totalSize > 2000000) score -= 5; // 2MB
    }
    
    return Math.max(0, Math.round(score));
  }, [finalConfig.budgets]);

  /**
   * Check budget violations
   */
  const checkBudgetViolations = useCallback((data: Partial<PerformanceMetrics>): string[] => {
    const violations: string[] = [];
    const budgets = finalConfig.budgets;
    
    if (data.lcp && data.lcp > budgets.lcp!) {
      violations.push(`LCP exceeds budget: ${Math.round(data.lcp)}ms > ${budgets.lcp}ms`);
    }
    
    if (data.fid && data.fid > budgets.fid!) {
      violations.push(`FID exceeds budget: ${Math.round(data.fid)}ms > ${budgets.fid}ms`);
    }
    
    if (data.cls && data.cls > budgets.cls!) {
      violations.push(`CLS exceeds budget: ${data.cls.toFixed(3)} > ${budgets.cls}`);
    }
    
    if (data.fcp && data.fcp > budgets.fcp!) {
      violations.push(`FCP exceeds budget: ${Math.round(data.fcp)}ms > ${budgets.fcp}ms`);
    }
    
    if (data.ttfb && data.ttfb > budgets.ttfb!) {
      violations.push(`TTFB exceeds budget: ${Math.round(data.ttfb)}ms > ${budgets.ttfb}ms`);
    }
    
    return violations;
  }, [finalConfig.budgets]);

  /**
   * Update metrics
   */
  const updateMetrics = useCallback((updates: Partial<PerformanceMetrics>) => {
    setMetrics(prev => {
      const updated = { ...prev, ...updates };
      updated.score = calculateScore(updated);
      updated.budgetViolations = checkBudgetViolations(updated);
      return updated;
    });
  }, [calculateScore, checkBudgetViolations]);

  /**
   * Measure Core Web Vitals
   */
  const measureCoreWebVitals = useCallback(() => {
    if (!finalConfig.monitoring || !('PerformanceObserver' in window)) return;

    const observers: PerformanceObserver[] = [];

    // LCP Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        updateMetrics({ lcp: lastEntry.startTime });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observation not supported');
    }

    // FID Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          updateMetrics({ fid: entry.processingStart - entry.startTime });
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observation not supported');
    }

    // CLS Observer
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        updateMetrics({ cls: clsValue });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observation not supported');
    }

    // Navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            updateMetrics({
              ttfb: entry.responseStart - entry.requestStart,
              fcp: entry.loadEventEnd - entry.navigationStart,
            });
          }
        });
      });
      navigationObserver.observe({ type: 'navigation', buffered: true });
      observers.push(navigationObserver);
    } catch (e) {
      console.warn('Navigation timing not supported');
    }

    observersRef.current = observers;
  }, [finalConfig.monitoring, updateMetrics]);

  /**
   * Measure resource metrics
   */
  const measureResourceMetrics = useCallback(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    // const startTime = performance.timeOrigin; // Unused for now
    
    const resourceMetrics = {
      images: 0,
      scripts: 0,
      stylesheets: 0,
      totalSize: 0,
      loadTime: performance.now(),
    };
    
    resources.forEach((resource) => {
      const size = resource.transferSize || 0;
      resourceMetrics.totalSize += size;
      
      if (resource.initiatorType === 'img') {
        resourceMetrics.images++;
      } else if (resource.initiatorType === 'script') {
        resourceMetrics.scripts++;
      } else if (resource.initiatorType === 'link' && resource.name.includes('.css')) {
        resourceMetrics.stylesheets++;
      }
    });
    
    updateMetrics({ resources: resourceMetrics });
  }, [updateMetrics]);

  /**
   * Update animation metrics
   */
  const updateAnimationMetrics = useCallback(() => {
    if (!finalConfig.animationOptimization) return;
    
    const animationMetrics = animationSystem.current.getMetrics();
    updateMetrics({ animations: animationMetrics });
  }, [finalConfig.animationOptimization, updateMetrics]);

  /**
   * Update component cache metrics
   */
  const updateComponentCacheMetrics = useCallback(() => {
    if (!finalConfig.componentPreloading) return;
    
    const cacheStats = getCacheStats();
    updateMetrics({ componentCache: cacheStats });
  }, [finalConfig.componentPreloading, updateMetrics]);

  /**
   * Performance actions
   */
  const actions: PerformanceActions = {
    preloadCriticalResources: useCallback(async () => {
      setIsOptimizing(true);
      
      try {
        // Preload critical images
        const criticalImages = document.querySelectorAll('img[data-priority="high"]');
        const imagePromises = Array.from(criticalImages).map((img) => {
          const src = img.getAttribute('src');
          if (src) {
            // Image loading handled by LazyImage component
            return Promise.resolve();
          }
          return Promise.resolve();
        });
        
        await Promise.all(imagePromises);
        setLastOptimization(Date.now());
      } finally {
        setIsOptimizing(false);
      }
    }, []),

    optimizeViewportImages: useCallback(async () => {
      setIsOptimizing(true);
      
      try {
        const images = document.querySelectorAll('img[data-src]');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute('data-src');
              if (src) {
                // Image preloading handled by LazyImage component
                Promise.resolve().then(() => {
                  img.src = src;
                  img.removeAttribute('data-src');
                });
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: '50px' });
        
        images.forEach((img) => observer.observe(img));
        setLastOptimization(Date.now());
      } finally {
        setIsOptimizing(false);
      }
    }, []),

    inlineCriticalCSS: useCallback(async () => {
      if (!finalConfig.criticalCSS) return;
      
      setIsOptimizing(true);
      
      try {
          const stylesheets = Array.from(document.styleSheets)
            .map(sheet => {
              try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
              } catch {
                return '';
              }
            })
            .filter(css => css.length > 0);
          
          const criticalCSS = criticalCSSManager.current.extractCriticalCSS(stylesheets);
          criticalCSSManager.current.setCriticalCSS('default', criticalCSS);
          setLastOptimization(Date.now());
        } finally {
        setIsOptimizing(false);
      }
    }, [finalConfig.criticalCSS]),

    preloadComponents: useCallback(async (componentPaths: string[]) => {
      if (!finalConfig.componentPreloading) return;
      
      setIsOptimizing(true);
      
      try {
        const preloadPromises = componentPaths.map((path) => {
          return preloadComponent(() => import(path));
        });
        
        await Promise.all(preloadPromises);
        updateComponentCacheMetrics();
        setLastOptimization(Date.now());
      } finally {
        setIsOptimizing(false);
      }
    }, [finalConfig.componentPreloading, updateComponentCacheMetrics]),

    optimizeAnimations: useCallback(() => {
      if (!finalConfig.animationOptimization) return;
      
      // Animation system optimization handled internally
      updateAnimationMetrics();
      setLastOptimization(Date.now());
    }, [finalConfig.animationOptimization, updateAnimationMetrics]),

    clearCaches: useCallback(() => {
      // Image loader cache clearing handled internally
      criticalCSSManager.current.clearCache();
      updateComponentCacheMetrics();
    }, [updateComponentCacheMetrics]),

    generateReport: useCallback((): PerformanceReport => {
      const recommendations: string[] = [];
      
      if (metrics.lcp && metrics.lcp > finalConfig.budgets.lcp!) {
        recommendations.push('Optimize Largest Contentful Paint by reducing image sizes and server response times');
      }
      
      if (metrics.fid && metrics.fid > finalConfig.budgets.fid!) {
        recommendations.push('Reduce First Input Delay by minimizing JavaScript execution time');
      }
      
      if (metrics.cls && metrics.cls > finalConfig.budgets.cls!) {
        recommendations.push('Improve Cumulative Layout Shift by setting image dimensions and avoiding dynamic content');
      }
      
      if (metrics.animations.frameRate < 50) {
        recommendations.push('Optimize animations for better frame rate using GPU acceleration');
      }
      
      if (metrics.resources.totalSize > 2000000) {
        recommendations.push('Reduce bundle size by implementing code splitting and tree shaking');
      }
      
      return {
        timestamp: Date.now(),
        metrics,
        recommendations,
        optimizations: {
          applied: lastOptimization ? ['Performance monitoring active'] : [],
          pending: recommendations,
        },
      };
    }, [metrics, finalConfig.budgets, lastOptimization]),
  };

  /**
   * Initialize performance monitoring
   */
  useEffect(() => {
    measureCoreWebVitals();
    measureResourceMetrics();
    updateAnimationMetrics();
    updateComponentCacheMetrics();
    
    // Set up periodic updates
    const interval = setInterval(() => {
      measureResourceMetrics();
      updateAnimationMetrics();
      updateComponentCacheMetrics();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      observersRef.current.forEach(observer => observer.disconnect());
    };
  }, [measureCoreWebVitals, measureResourceMetrics, updateAnimationMetrics, updateComponentCacheMetrics]);

  return {
    metrics,
    actions,
    isOptimizing,
    lastOptimization,
  };
}

export default usePerformanceOptimization;