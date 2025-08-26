import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';
import { performanceAlerting } from './performance-alerting';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
}

interface PerformanceConfig {
  endpoint?: string;
  sampleRate?: number;
  enableConsoleLog?: boolean;
  enableLocalStorage?: boolean;
  thresholds?: {
    lcp: { good: number; poor: number };
    fid: { good: number; poor: number };
    cls: { good: number; poor: number };
    fcp: { good: number; poor: number };
    ttfb: { good: number; poor: number };
  };
}

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      endpoint: '/api/performance-metrics',
      sampleRate: 1.0,
      enableConsoleLog: process.env.NODE_ENV === 'development',
      enableLocalStorage: true,
      thresholds: {
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 },
        fcp: { good: 1800, poor: 3000 },
        ttfb: { good: 800, poor: 1800 }
      },
      ...config
    };
  }

  init(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isInitialized = true;

    // Sample rate check
    if (Math.random() > this.config.sampleRate!) {
      return;
    }

    // Initialize Web Vitals metrics collection
    getCLS(this.handleMetric.bind(this));
    getFID(this.handleMetric.bind(this));
    getFCP(this.handleMetric.bind(this));
    getLCP(this.handleMetric.bind(this));
    getTTFB(this.handleMetric.bind(this));

    // Set up page visibility change handler for final metrics
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendMetrics();
      }
    });

    // Set up beforeunload handler as fallback
    window.addEventListener('beforeunload', () => {
      this.sendMetrics();
    });

    // Periodic metric sending (every 30 seconds)
    setInterval(() => {
      this.sendMetrics();
    }, 30000);
  }

  private handleMetric(metric: Metric): void {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: this.getRating(metric.name, metric.value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory()
    };

    this.metrics.push(performanceMetric);
    
    // Check for performance alerts
    performanceAlerting.checkMetric(metric.name, metric.value, window.location.href);

    if (this.config.enableConsoleLog) {
      console.log(`[Performance] ${metric.name}:`, performanceMetric);
    }

    if (this.config.enableLocalStorage) {
      this.saveToLocalStorage(performanceMetric);
    }

    // Send critical metrics immediately
    if (performanceMetric.rating === 'poor') {
      this.sendMetrics([performanceMetric]);
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = this.config.thresholds![metricName.toLowerCase() as keyof typeof this.config.thresholds];
    if (!thresholds) return 'good';

    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  private getConnectionType(): string | undefined {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType;
  }

  private getDeviceMemory(): number | undefined {
    return (navigator as any).deviceMemory;
  }

  private saveToLocalStorage(metric: PerformanceMetric): void {
    try {
      const stored = localStorage.getItem('performance-metrics');
      const metrics = stored ? JSON.parse(stored) : [];
      metrics.push(metric);
      
      // Keep only last 100 metrics to prevent storage overflow
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }
      
      localStorage.setItem('performance-metrics', JSON.stringify(metrics));
    } catch (error) {
      console.warn('[Performance] Failed to save to localStorage:', error);
    }
  }

  private async sendMetrics(metricsToSend?: PerformanceMetric[]): Promise<void> {
    const metrics = metricsToSend || this.metrics.splice(0);
    
    if (metrics.length === 0) {
      return;
    }

    try {
      const response = await fetch(this.config.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          sessionId: this.getSessionId(),
          timestamp: Date.now()
        }),
        keepalive: true
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('[Performance] Failed to send metrics:', error);
      // Re-add metrics to queue for retry
      this.metrics.unshift(...metrics);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('performance-session-id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('performance-session-id', sessionId);
    }
    return sessionId;
  }

  // Public methods for manual metric collection
  trackCustomMetric(name: string, value: number, additionalData?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name: `custom-${name}`,
      value,
      rating: 'good', // Custom metrics don't have predefined ratings
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...additionalData
    };

    this.metrics.push(metric);

    if (this.config.enableConsoleLog) {
      console.log(`[Performance] Custom metric ${name}:`, metric);
    }
  }

  getStoredMetrics(): PerformanceMetric[] {
    try {
      const stored = localStorage.getItem('performance-metrics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearStoredMetrics(): void {
    localStorage.removeItem('performance-metrics');
  }

  // Get current performance summary
  getPerformanceSummary(): Record<string, any> {
    const metrics = this.getStoredMetrics();
    const summary: Record<string, any> = {};

    ['lcp', 'fid', 'cls', 'fcp', 'ttfb'].forEach(metricName => {
      const metricData = metrics.filter(m => m.name === metricName.toUpperCase());
      if (metricData.length > 0) {
        const latest = metricData[metricData.length - 1];
        summary[metricName] = {
          value: latest.value,
          rating: latest.rating,
          timestamp: latest.timestamp
        };
      }
    });

    return summary;
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.init();
    });
  } else {
    performanceMonitor.init();
  }
}

export default performanceMonitor;
export { PerformanceMonitor, type PerformanceMetric, type PerformanceConfig };