/**
 * Core Web Vitals monitoring and optimization utilities
 * Tracks LCP, FID, CLS, FCP, and TTFB metrics
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000,
  },
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300,
  },
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000,
  },
  TTFB: {
    GOOD: 800,
    NEEDS_IMPROVEMENT: 1800,
  },
} as const;

// Performance budget configuration
export const PERFORMANCE_BUDGET = {
  // Bundle size limits (in KB)
  BUNDLE_SIZE: {
    MAIN: 250,
    VENDOR: 500,
    TOTAL: 1000,
  },
  // Resource limits
  RESOURCES: {
    IMAGES: 2000, // KB
    FONTS: 100,   // KB
    CSS: 50,      // KB
    JS: 500,      // KB
  },
  // Network limits
  NETWORK: {
    REQUESTS: 50,
    DOMAINS: 5,
  },
} as const;

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

class CoreWebVitalsMonitor {
  private metrics: Map<string, WebVitalMetric> = new Map();
  private observers: ((metric: WebVitalMetric) => void)[] = [];
  private isInitialized = false;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Monitor Largest Contentful Paint (LCP)
    getLCP((metric) => {
      this.recordMetric('LCP', metric.value, metric.delta, metric.id);
    });

    // Monitor First Input Delay (FID)
    getFID((metric) => {
      this.recordMetric('FID', metric.value, metric.delta, metric.id);
    });

    // Monitor Cumulative Layout Shift (CLS)
    getCLS((metric) => {
      this.recordMetric('CLS', metric.value, metric.delta, metric.id);
    });

    // Monitor First Contentful Paint (FCP)
    getFCP((metric) => {
      this.recordMetric('FCP', metric.value, metric.delta, metric.id);
    });

    // Monitor Time to First Byte (TTFB)
    getTTFB((metric) => {
      this.recordMetric('TTFB', metric.value, metric.delta, metric.id);
    });

    this.isInitialized = true;
  }

  private recordMetric(name: string, value: number, delta: number, id: string): void {
    const rating = this.getRating(name, value);
    const metric: WebVitalMetric = {
      name,
      value,
      rating,
      delta,
      id,
      timestamp: Date.now(),
    };

    this.metrics.set(name, metric);
    this.notifyObservers(metric);

    // Log performance issues
    if (rating === 'poor') {
      console.warn(`Poor ${name} performance detected:`, {
        value,
        threshold: this.getThreshold(name),
        improvement: this.getSuggestions(name),
      });
    }

    // Send to analytics if available
    this.sendToAnalytics(metric);
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!thresholds) return 'good';

    if (value <= thresholds.GOOD) return 'good';
    if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
    return 'poor';
  }

  private getThreshold(name: string): { good: number; needsImprovement: number } {
    const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    return {
      good: thresholds?.GOOD || 0,
      needsImprovement: thresholds?.NEEDS_IMPROVEMENT || 0,
    };
  }

  private getSuggestions(name: string): string[] {
    const suggestions: Record<string, string[]> = {
      LCP: [
        'Optimize images with modern formats (WebP/AVIF)',
        'Implement lazy loading for below-fold images',
        'Preload critical resources',
        'Optimize server response times',
        'Use a CDN for static assets',
      ],
      FID: [
        'Reduce JavaScript execution time',
        'Code split large bundles',
        'Remove unused JavaScript',
        'Optimize third-party scripts',
        'Use web workers for heavy computations',
      ],
      CLS: [
        'Set explicit dimensions for images and videos',
        'Reserve space for dynamic content',
        'Avoid inserting content above existing content',
        'Use transform animations instead of layout changes',
      ],
      FCP: [
        'Eliminate render-blocking resources',
        'Minify CSS and JavaScript',
        'Remove unused CSS',
        'Optimize web fonts',
      ],
      TTFB: [
        'Optimize server performance',
        'Use a CDN',
        'Implement caching strategies',
        'Optimize database queries',
      ],
    };

    return suggestions[name] || [];
  }

  private sendToAnalytics(metric: WebVitalMetric): void {
    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'Web Vital', {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.rating,
        non_interaction: true,
      });
    }
  }

  private notifyObservers(metric: WebVitalMetric): void {
    this.observers.forEach(observer => {
      try {
        observer(metric);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  // Public API
  public subscribe(observer: (metric: WebVitalMetric) => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  public getMetrics(): WebVitalMetric[] {
    return Array.from(this.metrics.values());
  }

  public getMetric(name: string): WebVitalMetric | undefined {
    return this.metrics.get(name);
  }

  public getPerformanceScore(): number {
    const metrics = this.getMetrics();
    if (metrics.length === 0) return 0;

    const scores = metrics.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 50;
        case 'poor': return 0;
        default: return 0;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  public generateReport(): {
    score: number;
    metrics: WebVitalMetric[];
    suggestions: string[];
  } {
    const metrics = this.getMetrics();
    const score = this.getPerformanceScore();
    const poorMetrics = metrics.filter(m => m.rating === 'poor');
    const suggestions = poorMetrics.flatMap(m => this.getSuggestions(m.name));

    return {
      score,
      metrics,
      suggestions: [...new Set(suggestions)], // Remove duplicates
    };
  }
}

// Performance budget checker
export class PerformanceBudgetChecker {
  private static instance: PerformanceBudgetChecker;
  private violations: string[] = [];

  static getInstance(): PerformanceBudgetChecker {
    if (!PerformanceBudgetChecker.instance) {
      PerformanceBudgetChecker.instance = new PerformanceBudgetChecker();
    }
    return PerformanceBudgetChecker.instance;
  }

  public checkBudget(): Promise<{
    passed: boolean;
    violations: string[];
    recommendations: string[];
  }> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({ passed: true, violations: [], recommendations: [] });
        return;
      }

      // Check after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.violations = [];
          
          this.checkResourceSizes();
          this.checkNetworkRequests();
          
          const recommendations = this.generateRecommendations();
          
          resolve({
            passed: this.violations.length === 0,
            violations: this.violations,
            recommendations,
          });
        }, 1000);
      });
    });
  }

  private checkResourceSizes(): void {
    if (!window.performance || !window.performance.getEntriesByType) {
      return;
    }

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let imageSize = 0;
    let scriptSize = 0;
    let styleSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        imageSize += size;
      } else if (resource.name.match(/\.js$/i)) {
        scriptSize += size;
      } else if (resource.name.match(/\.css$/i)) {
        styleSize += size;
      }
    });

    // Convert to KB
    totalSize = Math.round(totalSize / 1024);
    imageSize = Math.round(imageSize / 1024);
    scriptSize = Math.round(scriptSize / 1024);
    styleSize = Math.round(styleSize / 1024);

    if (totalSize > PERFORMANCE_BUDGET.BUNDLE_SIZE.TOTAL) {
      this.violations.push(`Total bundle size (${totalSize}KB) exceeds budget (${PERFORMANCE_BUDGET.BUNDLE_SIZE.TOTAL}KB)`);
    }

    if (imageSize > PERFORMANCE_BUDGET.RESOURCES.IMAGES) {
      this.violations.push(`Image size (${imageSize}KB) exceeds budget (${PERFORMANCE_BUDGET.RESOURCES.IMAGES}KB)`);
    }

    if (scriptSize > PERFORMANCE_BUDGET.RESOURCES.JS) {
      this.violations.push(`JavaScript size (${scriptSize}KB) exceeds budget (${PERFORMANCE_BUDGET.RESOURCES.JS}KB)`);
    }

    if (styleSize > PERFORMANCE_BUDGET.RESOURCES.CSS) {
      this.violations.push(`CSS size (${styleSize}KB) exceeds budget (${PERFORMANCE_BUDGET.RESOURCES.CSS}KB)`);
    }
  }

  private checkNetworkRequests(): void {
    if (!window.performance || !window.performance.getEntriesByType) {
      return;
    }

    const resources = window.performance.getEntriesByType('resource');
    const domains = new Set(resources.map(r => new URL(r.name).hostname));

    if (resources.length > PERFORMANCE_BUDGET.NETWORK.REQUESTS) {
      this.violations.push(`Too many requests (${resources.length}) exceeds budget (${PERFORMANCE_BUDGET.NETWORK.REQUESTS})`);
    }

    if (domains.size > PERFORMANCE_BUDGET.NETWORK.DOMAINS) {
      this.violations.push(`Too many domains (${domains.size}) exceeds budget (${PERFORMANCE_BUDGET.NETWORK.DOMAINS})`);
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.violations.some(v => v.includes('bundle size'))) {
      recommendations.push('Implement code splitting and lazy loading');
      recommendations.push('Remove unused dependencies');
      recommendations.push('Use tree shaking to eliminate dead code');
    }

    if (this.violations.some(v => v.includes('Image size'))) {
      recommendations.push('Optimize images with modern formats (WebP/AVIF)');
      recommendations.push('Implement responsive images with srcset');
      recommendations.push('Use lazy loading for below-fold images');
    }

    if (this.violations.some(v => v.includes('requests'))) {
      recommendations.push('Combine and minify CSS/JS files');
      recommendations.push('Use HTTP/2 server push for critical resources');
      recommendations.push('Implement resource bundling');
    }

    return recommendations;
  }
}

// Singleton instance
export const webVitalsMonitor = new CoreWebVitalsMonitor();
export const budgetChecker = PerformanceBudgetChecker.getInstance();

// Utility functions
export const trackWebVitals = (callback?: (metric: WebVitalMetric) => void) => {
  if (callback) {
    return webVitalsMonitor.subscribe(callback);
  }
  return () => {};
};

export const getPerformanceReport = () => {
  return webVitalsMonitor.generateReport();
};

export const checkPerformanceBudget = () => {
  return budgetChecker.checkBudget();
};