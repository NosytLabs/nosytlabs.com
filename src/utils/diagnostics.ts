/**
 * Comprehensive Site Diagnostics and Performance Monitoring System
 * Provides real-time monitoring, system health reports, and performance metrics
 */

export interface DiagnosticReport {
  timestamp: string;
  systemHealth: SystemHealth;
  performanceMetrics: PerformanceMetrics;
  networkDiagnostics: NetworkDiagnostics;
  resourceUsage: ResourceUsage;
  errors: DiagnosticError[];
  recommendations: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskSpace: number;
  activeConnections: number;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

export interface NetworkDiagnostics {
  latency: number;
  bandwidth: number;
  packetLoss: number;
  dnsResolutionTime: number;
  sslHandshakeTime: number;
}

export interface ResourceUsage {
  jsSize: number;
  cssSize: number;
  imageSize: number;
  totalSize: number;
  cacheHitRate: number;
  compressionRatio: number;
}

export interface DiagnosticError {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  source: string;
  stackTrace?: string;
}

class SiteDiagnostics {
  private static instance: SiteDiagnostics;
  private diagnosticHistory: DiagnosticReport[] = [];
  private monitoringInterval: number | null = null;
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializePerformanceObservers();
  }

  public static getInstance(): SiteDiagnostics {
    if (!SiteDiagnostics.instance) {
      SiteDiagnostics.instance = new SiteDiagnostics();
    }
    return SiteDiagnostics.instance;
  }

  /**
   * Initialize performance observers for real-time monitoring
   */
  private initializePerformanceObservers(): void {
    if (typeof window === 'undefined') return;

    // Core Web Vitals Observer
    if ('PerformanceObserver' in window) {
      const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordPerformanceEntry(entry);
        }
      });

      try {
        vitalsObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
        this.observers.push(vitalsObserver);
      } catch (error) {
        console.warn('Performance observer not supported:', error);
      }
    }
  }

  /**
   * Record performance entries for analysis
   */
  private recordPerformanceEntry(entry: PerformanceEntry): void {
    const timestamp = new Date().toISOString();
    
    // Store performance data for analysis
    if (!window.diagnosticData) {
      window.diagnosticData = { entries: [] };
    }
    
    window.diagnosticData.entries.push({
      ...entry.toJSON(),
      recordedAt: timestamp
    });
  }

  /**
   * Generate comprehensive diagnostic report
   */
  public async generateDiagnosticReport(): Promise<DiagnosticReport> {
    const timestamp = new Date().toISOString();
    
    const report: DiagnosticReport = {
      timestamp,
      systemHealth: await this.getSystemHealth(),
      performanceMetrics: await this.getPerformanceMetrics(),
      networkDiagnostics: await this.getNetworkDiagnostics(),
      resourceUsage: await this.getResourceUsage(),
      errors: this.getRecentErrors(),
      recommendations: this.generateRecommendations()
    };

    this.diagnosticHistory.push(report);
    
    // Keep only last 100 reports
    if (this.diagnosticHistory.length > 100) {
      this.diagnosticHistory = this.diagnosticHistory.slice(-100);
    }

    return report;
  }

  /**
   * Get system health metrics
   */
  private async getSystemHealth(): Promise<SystemHealth> {
    return {
      status: this.calculateHealthStatus(),
      uptime: performance.now(),
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.estimateCPUUsage(),
      diskSpace: await this.estimateDiskUsage(),
      activeConnections: this.getActiveConnections()
    };
  }

  /**
   * Calculate overall system health status
   */
  private calculateHealthStatus(): 'healthy' | 'warning' | 'critical' {
    const errors = this.getRecentErrors();
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    const highErrors = errors.filter(e => e.severity === 'high').length;
    
    if (criticalErrors > 0) return 'critical';
    if (highErrors > 2) return 'warning';
    return 'healthy';
  }

  /**
   * Get memory usage information
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.totalJSHeapSize;
    }
    return 0;
  }

  /**
   * Estimate CPU usage based on performance timing
   */
  private estimateCPUUsage(): number {
    const entries = performance.getEntriesByType('measure');
    if (entries.length === 0) return 0;
    
    const totalDuration = entries.reduce((sum, entry) => sum + entry.duration, 0);
    const avgDuration = totalDuration / entries.length;
    
    // Normalize to 0-1 scale (rough estimation)
    return Math.min(avgDuration / 100, 1);
  }

  /**
   * Estimate disk usage based on resource sizes
   */
  private async estimateDiskUsage(): Promise<number> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return estimate.usage ? estimate.usage / (estimate.quota || 1) : 0;
      } catch (error) {
        console.warn('Storage estimation not available:', error);
      }
    }
    return 0;
  }

  /**
   * Get active network connections estimate
   */
  private getActiveConnections(): number {
    const resources = performance.getEntriesByType('resource');
    const recentResources = resources.filter(r => 
      performance.now() - r.startTime < 5000 // Last 5 seconds
    );
    return recentResources.length;
  }

  /**
   * Get comprehensive performance metrics
   */
  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcp = this.getLargestContentfulPaint();
    const cls = this.getCumulativeLayoutShift();
    const fid = this.getFirstInputDelay();
    
    return {
      pageLoadTime: navigation ? (navigation.loadEventEnd || 0) - (navigation.fetchStart || 0) : 0,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid,
      timeToInteractive: this.calculateTimeToInteractive(),
      totalBlockingTime: this.calculateTotalBlockingTime()
    };
  }

  /**
   * Get Largest Contentful Paint metric
   */
  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
  }

  /**
   * Get Cumulative Layout Shift metric
   */
  private getCumulativeLayoutShift(): number {
    const clsEntries = performance.getEntriesByType('layout-shift');
    return clsEntries.reduce((sum, entry: any) => {
      if (!entry.hadRecentInput) {
        return sum + entry.value;
      }
      return sum;
    }, 0);
  }

  /**
   * Get First Input Delay metric
   */
  private getFirstInputDelay(): number {
    const fidEntries = performance.getEntriesByType('first-input');
    return fidEntries.length > 0 ? (fidEntries[0] as any).processingStart - fidEntries[0].startTime : 0;
  }

  /**
   * Calculate Time to Interactive
   */
  private calculateTimeToInteractive(): number {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return 0;
    
    // Simplified TTI calculation
    return (navigation.domInteractive || 0) - (navigation.fetchStart || 0);
  }

  /**
   * Calculate Total Blocking Time
   */
  private calculateTotalBlockingTime(): number {
    const longTasks = performance.getEntriesByType('longtask');
    return longTasks.reduce((sum, task) => {
      const blockingTime = Math.max(0, task.duration - 50); // Tasks over 50ms are blocking
      return sum + blockingTime;
    }, 0);
  }

  /**
   * Get network diagnostics
   */
  private async getNetworkDiagnostics(): Promise<NetworkDiagnostics> {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const connection = (navigator as any).connection;
    
    return {
      latency: navigation ? navigation.responseStart - navigation.requestStart : 0,
      bandwidth: connection ? connection.downlink : 0,
      packetLoss: 0, // Not directly measurable in browser
      dnsResolutionTime: navigation ? navigation.domainLookupEnd - navigation.domainLookupStart : 0,
      sslHandshakeTime: navigation ? navigation.connectEnd - navigation.secureConnectionStart : 0
    };
  }

  /**
   * Get resource usage statistics
   */
  private async getResourceUsage(): Promise<ResourceUsage> {
    const resources = performance.getEntriesByType('resource');
    
    let jsSize = 0, cssSize = 0, imageSize = 0;
    
    resources.forEach((resource: any) => {
      const size = resource.transferSize || 0;
      
      if (resource.name.includes('.js')) jsSize += size;
      else if (resource.name.includes('.css')) cssSize += size;
      else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) imageSize += size;
    });
    
    const totalSize = jsSize + cssSize + imageSize;
    const cachedResources = resources.filter((r: any) => r.transferSize === 0).length;
    const cacheHitRate = resources.length > 0 ? cachedResources / resources.length : 0;
    
    return {
      jsSize,
      cssSize,
      imageSize,
      totalSize,
      cacheHitRate,
      compressionRatio: this.calculateCompressionRatio(resources)
    };
  }

  /**
   * Calculate compression ratio from resources
   */
  private calculateCompressionRatio(resources: PerformanceEntry[]): number {
    let totalTransferred = 0;
    let totalDecodedSize = 0;
    
    resources.forEach((resource: any) => {
      totalTransferred += resource.transferSize || 0;
      totalDecodedSize += resource.decodedBodySize || resource.transferSize || 0;
    });
    
    return totalDecodedSize > 0 ? totalTransferred / totalDecodedSize : 1;
  }

  /**
   * Get recent diagnostic errors
   */
  private getRecentErrors(): DiagnosticError[] {
    const errors: DiagnosticError[] = [];
    
    // Check for JavaScript errors
    if (window.diagnosticErrors) {
      errors.push(...window.diagnosticErrors);
    }
    
    // Check for performance issues
    const performanceIssues = this.detectPerformanceIssues();
    errors.push(...performanceIssues);
    
    return errors.slice(-50); // Last 50 errors
  }

  /**
   * Detect performance issues and convert to diagnostic errors
   */
  private detectPerformanceIssues(): DiagnosticError[] {
    const issues: DiagnosticError[] = [];
    const timestamp = new Date().toISOString();
    
    // Check for slow page load
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation && (navigation.loadEventEnd || 0) - (navigation.fetchStart || 0) > 3000) {
      issues.push({
        severity: 'medium',
        message: `Slow page load detected: ${Math.round((navigation.loadEventEnd || 0) - (navigation.fetchStart || 0))}ms`,
        timestamp,
        source: 'performance-monitor'
      });
    }
    
    // Check for high CLS
    const cls = this.getCumulativeLayoutShift();
    if (cls > 0.1) {
      issues.push({
        severity: 'high',
        message: `High Cumulative Layout Shift detected: ${cls.toFixed(3)}`,
        timestamp,
        source: 'performance-monitor'
      });
    }
    
    // Check for high FID
    const fid = this.getFirstInputDelay();
    if (fid > 100) {
      issues.push({
        severity: 'medium',
        message: `High First Input Delay detected: ${Math.round(fid)}ms`,
        timestamp,
        source: 'performance-monitor'
      });
    }
    
    return issues;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Page load recommendations
    if (navigation && (navigation.loadEventEnd || 0) - (navigation.fetchStart || 0) > 2000) {
      recommendations.push('Consider optimizing images and reducing bundle size to improve page load time');
    }
    
    // CLS recommendations
    const cls = this.getCumulativeLayoutShift();
    if (cls > 0.1) {
      recommendations.push('Add size attributes to images and reserve space for dynamic content to reduce layout shift');
    }
    
    // Resource recommendations
    const resources = performance.getEntriesByType('resource');
    const largeResources = resources.filter((r: any) => r.transferSize > 1000000); // > 1MB
    if (largeResources.length > 0) {
      recommendations.push('Consider compressing or lazy-loading large resources to improve performance');
    }
    
    // Memory recommendations
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage > 0.8) {
      recommendations.push('High memory usage detected. Consider optimizing JavaScript and reducing memory leaks');
    }
    
    return recommendations;
  }

  /**
   * Start continuous monitoring
   */
  public startMonitoring(intervalMs: number = 30000): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.monitoringInterval = window.setInterval(async () => {
      const report = await this.generateDiagnosticReport();
      this.notifyMonitoringUpdate(report);
    }, intervalMs);
  }

  /**
   * Stop continuous monitoring
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Notify monitoring update
   */
  private notifyMonitoringUpdate(report: DiagnosticReport): void {
    // Dispatch custom event for monitoring updates
    window.dispatchEvent(new CustomEvent('diagnosticUpdate', { detail: report }));
    
    // Log critical issues
    const criticalErrors = report.errors.filter(e => e.severity === 'critical');
    if (criticalErrors.length > 0) {
      console.error('Critical diagnostic issues detected:', criticalErrors);
    }
  }

  /**
   * Get diagnostic history
   */
  public getDiagnosticHistory(): DiagnosticReport[] {
    return [...this.diagnosticHistory];
  }

  /**
   * Export diagnostic data
   */
  public exportDiagnosticData(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      reports: this.diagnosticHistory,
      summary: this.generateSummaryReport()
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate summary report
   */
  private generateSummaryReport() {
    const recentReports = this.diagnosticHistory.slice(-10);
    if (recentReports.length === 0) return null;
    
    const avgLoadTime = recentReports.reduce((sum, r) => sum + r.performanceMetrics.pageLoadTime, 0) / recentReports.length;
    const avgCLS = recentReports.reduce((sum, r) => sum + r.performanceMetrics.cumulativeLayoutShift, 0) / recentReports.length;
    const totalErrors = recentReports.reduce((sum, r) => sum + r.errors.length, 0);
    
    return {
      averageLoadTime: Math.round(avgLoadTime),
      averageCLS: parseFloat(avgCLS.toFixed(3)),
      totalErrors,
      healthStatus: recentReports[recentReports.length - 1]?.systemHealth.status || 'unknown'
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.stopMonitoring();
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global error tracking
if (typeof window !== 'undefined') {
  window.diagnosticErrors = window.diagnosticErrors || [];
  
  window.addEventListener('error', (event) => {
    window.diagnosticErrors.push({
      severity: 'high',
      message: event.message,
      timestamp: new Date().toISOString(),
      source: event.filename || 'unknown',
      stackTrace: event.error?.stack
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    window.diagnosticErrors.push({
      severity: 'high',
      message: `Unhandled Promise Rejection: ${event.reason}`,
      timestamp: new Date().toISOString(),
      source: 'promise-rejection'
    });
  });
}

// Export singleton instance
export const diagnostics = typeof window !== 'undefined' ? SiteDiagnostics.getInstance() : null;

// Type declarations for global objects
declare global {
  interface Window {
    diagnosticData: any;
    diagnosticErrors: DiagnosticError[];
  }
}