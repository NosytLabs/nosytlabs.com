import { performanceAlerting } from './performance-alerting';

export interface ErrorEvent {
  id: string;
  type: 'javascript' | 'network' | 'performance' | 'unhandled';
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  sessionId: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  performanceImpact?: {
    beforeError: PerformanceMetrics;
    afterError: PerformanceMetrics;
  };
}

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

class ErrorTrackingService {
  private errors: ErrorEvent[] = [];
  private maxErrors = 1000;
  private performanceBaseline: PerformanceMetrics = {};
  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        severity: this.determineSeverity(event.error),
        context: {
          lineno: event.lineno,
          colno: event.colno,
          filename: event.filename
        }
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'unhandled',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        severity: 'high',
        context: {
          reason: event.reason
        }
      });
    });

    // Network error tracking
    this.setupNetworkErrorTracking();

    // Performance regression detection
    this.setupPerformanceRegression();

    this.isInitialized = true;
    console.log('[Error Tracking] Service initialized');
  }

  private setupNetworkErrorTracking(): void {
    // Override fetch to track network errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.trackError({
            type: 'network',
            message: `Network error: ${response.status} ${response.statusText}`,
            url: typeof args[0] === 'string' ? args[0] : args[0].url,
            severity: response.status >= 500 ? 'high' : 'medium',
            context: {
              status: response.status,
              statusText: response.statusText,
              method: typeof args[1] === 'object' ? args[1]?.method || 'GET' : 'GET'
            }
          });
        }
        
        return response;
      } catch (error) {
        this.trackError({
          type: 'network',
          message: `Network request failed: ${error.message}`,
          stack: error.stack,
          url: typeof args[0] === 'string' ? args[0] : args[0].url,
          severity: 'high',
          context: {
            method: typeof args[1] === 'object' ? args[1]?.method || 'GET' : 'GET',
            error: error.message
          }
        });
        throw error;
      }
    };
  }

  private setupPerformanceRegression(): void {
    // Monitor for performance regressions
    setInterval(() => {
      this.checkPerformanceRegression();
    }, 30000); // Check every 30 seconds
  }

  private async checkPerformanceRegression(): Promise<void> {
    try {
      const currentMetrics = await this.getCurrentPerformanceMetrics();
      
      if (Object.keys(this.performanceBaseline).length === 0) {
        this.performanceBaseline = currentMetrics;
        return;
      }

      // Check for significant performance degradation
      const regressions = this.detectRegressions(this.performanceBaseline, currentMetrics);
      
      if (regressions.length > 0) {
        regressions.forEach(regression => {
          this.trackError({
            type: 'performance',
            message: `Performance regression detected: ${regression.metric} increased by ${regression.percentageIncrease}%`,
            url: window.location.href,
            severity: regression.percentageIncrease > 50 ? 'critical' : 'high',
            context: {
              metric: regression.metric,
              baseline: regression.baseline,
              current: regression.current,
              percentageIncrease: regression.percentageIncrease
            },
            performanceImpact: {
              beforeError: this.performanceBaseline,
              afterError: currentMetrics
            }
          });

          // Send alert for critical regressions
          if (regression.percentageIncrease > 50) {
            performanceAlerting.sendAlert({
              type: 'critical',
              metric: regression.metric,
              value: regression.current,
              threshold: regression.baseline * 1.5, // 50% increase threshold
              message: `Critical performance regression: ${regression.metric}`,
              url: window.location.href,
              timestamp: Date.now()
            });
          }
        });

        // Update baseline with current metrics for next comparison
        this.performanceBaseline = currentMetrics;
      }
    } catch (error) {
      console.error('[Error Tracking] Failed to check performance regression:', error);
    }
  }

  private async getCurrentPerformanceMetrics(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      // Use Performance Observer to get current metrics
      const metrics: PerformanceMetrics = {};
      
      // Get LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.lcp = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Get FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.fcp = entries[0].startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Get CLS from layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Resolve after a short delay to collect metrics
      setTimeout(() => {
        lcpObserver.disconnect();
        fcpObserver.disconnect();
        clsObserver.disconnect();
        resolve(metrics);
      }, 1000);
    });
  }

  private detectRegressions(baseline: PerformanceMetrics, current: PerformanceMetrics): Array<{
    metric: string;
    baseline: number;
    current: number;
    percentageIncrease: number;
  }> {
    const regressions = [];
    const threshold = 25; // 25% increase threshold

    for (const [metric, baselineValue] of Object.entries(baseline)) {
      const currentValue = current[metric as keyof PerformanceMetrics];
      
      if (baselineValue && currentValue && currentValue > baselineValue) {
        const percentageIncrease = ((currentValue - baselineValue) / baselineValue) * 100;
        
        if (percentageIncrease > threshold) {
          regressions.push({
            metric,
            baseline: baselineValue,
            current: currentValue,
            percentageIncrease: Math.round(percentageIncrease)
          });
        }
      }
    }

    return regressions;
  }

  private trackError(errorData: Omit<ErrorEvent, 'id' | 'timestamp' | 'sessionId' | 'userAgent'>): void {
    const error: ErrorEvent = {
      ...errorData,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent
    };

    this.errors.push(error);

    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error
    console.error('[Error Tracking]', error);

    // Send to backend
    this.sendErrorToBackend(error);

    // Send alert for critical errors
    if (error.severity === 'critical') {
      performanceAlerting.sendAlert({
        type: 'critical',
        metric: 'error_rate',
        value: this.getErrorRate(),
        threshold: 5, // 5% error rate threshold
        message: `Critical error: ${error.message}`,
        url: error.url,
        timestamp: error.timestamp
      });
    }
  }

  private determineSeverity(error: Error): 'low' | 'medium' | 'high' | 'critical' {
    if (!error) return 'low';

    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (message.includes('out of memory') || 
        message.includes('maximum call stack') ||
        message.includes('script error')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('network') ||
        message.includes('fetch') ||
        message.includes('cors') ||
        stack.includes('react') ||
        stack.includes('component')) {
      return 'high';
    }

    // Medium severity errors
    if (message.includes('warning') ||
        message.includes('deprecated')) {
      return 'medium';
    }

    return 'low';
  }

  private async sendErrorToBackend(error: ErrorEvent): Promise<void> {
    try {
      await fetch('/api/performance-metrics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
    } catch (err) {
      console.error('[Error Tracking] Failed to send error to backend:', err);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('performance-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('performance-session-id', sessionId);
    }
    return sessionId;
  }

  private getErrorRate(): number {
    const recentErrors = this.errors.filter(e => Date.now() - e.timestamp < 60000); // Last minute
    const totalRequests = this.getTotalRequests(); // Implement based on your tracking
    return totalRequests > 0 ? (recentErrors.length / totalRequests) * 100 : 0;
  }

  private getTotalRequests(): number {
    // This should be implemented based on your request tracking
    // For now, return a reasonable estimate
    return 100;
  }

  getErrors(filters?: {
    type?: string;
    severity?: string;
    startTime?: number;
    endTime?: number;
  }): ErrorEvent[] {
    let filteredErrors = this.errors;

    if (filters) {
      if (filters.type) {
        filteredErrors = filteredErrors.filter(e => e.type === filters.type);
      }
      if (filters.severity) {
        filteredErrors = filteredErrors.filter(e => e.severity === filters.severity);
      }
      if (filters.startTime) {
        filteredErrors = filteredErrors.filter(e => e.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        filteredErrors = filteredErrors.filter(e => e.timestamp <= filters.endTime!);
      }
    }

    return filteredErrors.sort((a, b) => b.timestamp - a.timestamp);
  }

  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    errorRate: number;
  } {
    const errorsByType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorsBySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors: this.errors.length,
      errorsByType,
      errorsBySeverity,
      errorRate: this.getErrorRate()
    };
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorTracking = new ErrorTrackingService();