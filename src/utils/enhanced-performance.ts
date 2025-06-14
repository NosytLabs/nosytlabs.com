// Enhanced Performance Utilities
export interface PerformanceMetrics {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
}

export interface PerformanceConfig {
  monitoring: {
    enabled: boolean;
    interval: number;
    metrics: string[];
  };
  thresholds: PerformanceMetrics;
  reporting: {
    console: boolean;
    analytics: boolean;
  };
}

export class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: Partial<PerformanceMetrics> = {};

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.init();
  }

  private init() {
    if (!this.config.monitoring.enabled) return;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();
  }

  private observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.FID = entry.processingStart - entry.startTime;
        this.reportMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
  }

  private observeCLS() {
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.CLS = clsValue;
      this.reportMetric('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private observeFCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.FCP = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });
  }

  private observeTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.TTFB = ttfb;
      this.reportMetric('TTFB', ttfb);
    }
  }

  private reportMetric(name: string, value: number) {
    if (this.config.reporting.console) {
      const threshold = this.config.thresholds[name as keyof PerformanceMetrics];
      const status = value <= threshold ? '✅' : '❌';
      console.log(`${status} ${name}: ${value.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
}

// Default configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  monitoring: {
    enabled: true,
    interval: 5000,
    metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB']
  },
  thresholds: {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1800,
    TTFB: 600
  },
  reporting: {
    console: true,
    analytics: false
  }
};

// Initialize performance monitoring
export function initPerformanceMonitoring(config?: Partial<PerformanceConfig>) {
  const finalConfig = { ...defaultPerformanceConfig, ...config };
  return new PerformanceMonitor(finalConfig);
}
