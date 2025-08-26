import { analyticsIntegration } from './analytics-integration';

interface ReportConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  metrics: string[];
  thresholds: Record<string, { warning: number; critical: number }>;
  includeCharts: boolean;
  includeRecommendations: boolean;
}

interface PerformanceReport {
  id: string;
  timestamp: string;
  period: { start: string; end: string };
  summary: {
    totalUsers: number;
    totalPageViews: number;
    avgSessionDuration: number;
    errorRate: number;
  };
  webVitals: {
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; change: number };
    fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; change: number };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; change: number };
    fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; change: number };
    ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; change: number };
  };
  errors: {
    total: number;
    byType: Record<string, number>;
    topErrors: Array<{ message: string; count: number; impact: 'low' | 'medium' | 'high' }>;
  };
  performance: {
    budgetViolations: number;
    regressions: Array<{
      metric: string;
      current: number;
      baseline: number;
      severity: 'warning' | 'critical';
    }>;
  };
  recommendations: string[];
  alerts: Array<{
    type: 'performance' | 'error' | 'user-experience';
    severity: 'warning' | 'critical';
    message: string;
    action: string;
  }>;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'change_percent';
  threshold: number;
  severity: 'warning' | 'critical';
  enabled: boolean;
  cooldown: number; // minutes
  lastTriggered?: string;
}

class AutomatedReportingService {
  private reportConfigs: Map<string, ReportConfig> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private reportHistory: PerformanceReport[] = [];
  private isInitialized = false;

  constructor() {
    this.setupDefaultAlertRules();
  }

  /**
   * Initialize the automated reporting service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load saved configurations from localStorage
      this.loadConfigurations();
      
      // Set up scheduled reporting
      this.setupScheduledReporting();
      
      // Set up real-time alerting
      this.setupRealTimeAlerting();
      
      this.isInitialized = true;
      console.log('[Automated Reporting] Service initialized successfully');
      
    } catch (error) {
      console.error('[Automated Reporting] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Configure automated reporting
   */
  configureReporting(id: string, config: ReportConfig): void {
    this.reportConfigs.set(id, config);
    this.saveConfigurations();
    
    // Track configuration change
    analyticsIntegration.trackEvent({
      name: 'reporting_configured',
      category: 'Analytics',
      label: id,
      customParameters: {
        frequency: config.frequency,
        metrics_count: config.metrics.length,
        recipients_count: config.recipients.length
      }
    });
  }

  /**
   * Add or update alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule);
    this.saveConfigurations();
    
    analyticsIntegration.trackEvent({
      name: 'alert_rule_added',
      category: 'Analytics',
      label: rule.name,
      customParameters: {
        metric: rule.metric,
        severity: rule.severity,
        condition: rule.condition
      }
    });
  }

  /**
   * Generate performance report
   */
  async generateReport(configId: string, customPeriod?: { start: Date; end: Date }): Promise<PerformanceReport> {
    const config = this.reportConfigs.get(configId);
    if (!config) {
      throw new Error(`Report configuration '${configId}' not found`);
    }

    const now = new Date();
    const period = customPeriod || this.getReportPeriod(config.frequency, now);
    
    try {
      // Collect analytics data
      const analyticsData = await this.collectAnalyticsData(period, config.metrics);
      
      // Generate report
      const report: PerformanceReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: now.toISOString(),
        period: {
          start: period.start.toISOString(),
          end: period.end.toISOString()
        },
        summary: analyticsData.summary,
        webVitals: analyticsData.webVitals,
        errors: analyticsData.errors,
        performance: analyticsData.performance,
        recommendations: this.generateRecommendations(analyticsData),
        alerts: this.generateAlerts(analyticsData, config.thresholds)
      };
      
      // Store report
      this.reportHistory.push(report);
      
      // Keep only last 100 reports
      if (this.reportHistory.length > 100) {
        this.reportHistory = this.reportHistory.slice(-100);
      }
      
      // Track report generation
      analyticsIntegration.trackEvent({
        name: 'report_generated',
        category: 'Analytics',
        label: configId,
        customParameters: {
          period_days: Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24)),
          alerts_count: report.alerts.length,
          recommendations_count: report.recommendations.length
        }
      });
      
      return report;
      
    } catch (error) {
      console.error('[Automated Reporting] Failed to generate report:', error);
      analyticsIntegration.trackError(error as Error, {
        level: 'error',
        tags: { source: 'automated-reporting', action: 'generate-report' }
      });
      throw error;
    }
  }

  /**
   * Send report via email (mock implementation)
   */
  async sendReport(report: PerformanceReport, recipients: string[]): Promise<void> {
    try {
      // In a real implementation, this would integrate with an email service
      console.log(`[Automated Reporting] Sending report ${report.id} to:`, recipients);
      
      const emailContent = this.formatReportForEmail(report);
      
      // Mock email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('[Automated Reporting] Report sent successfully');
      
      analyticsIntegration.trackEvent({
        name: 'report_sent',
        category: 'Analytics',
        label: report.id,
        customParameters: {
          recipients_count: recipients.length,
          alerts_count: report.alerts.length
        }
      });
      
    } catch (error) {
      console.error('[Automated Reporting] Failed to send report:', error);
      analyticsIntegration.trackError(error as Error, {
        level: 'error',
        tags: { source: 'automated-reporting', action: 'send-report' }
      });
      throw error;
    }
  }

  /**
   * Check for performance regressions and send alerts
   */
  async checkForRegressions(): Promise<void> {
    try {
      const currentMetrics = await this.getCurrentMetrics();
      const baselineMetrics = await this.getBaselineMetrics();
      
      for (const [ruleId, rule] of this.alertRules) {
        if (!rule.enabled) continue;
        
        // Check cooldown
        if (rule.lastTriggered) {
          const lastTriggered = new Date(rule.lastTriggered);
          const cooldownEnd = new Date(lastTriggered.getTime() + rule.cooldown * 60 * 1000);
          if (new Date() < cooldownEnd) continue;
        }
        
        const shouldAlert = this.evaluateAlertRule(rule, currentMetrics, baselineMetrics);
        
        if (shouldAlert) {
          await this.triggerAlert(rule, currentMetrics[rule.metric], baselineMetrics[rule.metric]);
          rule.lastTriggered = new Date().toISOString();
        }
      }
      
    } catch (error) {
      console.error('[Automated Reporting] Failed to check for regressions:', error);
      analyticsIntegration.trackError(error as Error, {
        level: 'error',
        tags: { source: 'automated-reporting', action: 'check-regressions' }
      });
    }
  }

  /**
   * Get report history
   */
  getReportHistory(limit = 10): PerformanceReport[] {
    return this.reportHistory.slice(-limit).reverse();
  }

  /**
   * Get active alert rules
   */
  getAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  /**
   * Setup default alert rules
   */
  private setupDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'lcp_regression',
        name: 'LCP Regression',
        metric: 'lcp',
        condition: 'greater_than',
        threshold: 2500,
        severity: 'warning',
        enabled: true,
        cooldown: 30
      },
      {
        id: 'fid_regression',
        name: 'FID Regression',
        metric: 'fid',
        condition: 'greater_than',
        threshold: 100,
        severity: 'warning',
        enabled: true,
        cooldown: 30
      },
      {
        id: 'cls_regression',
        name: 'CLS Regression',
        metric: 'cls',
        condition: 'greater_than',
        threshold: 0.1,
        severity: 'warning',
        enabled: true,
        cooldown: 30
      },
      {
        id: 'error_rate_spike',
        name: 'Error Rate Spike',
        metric: 'error_rate',
        condition: 'change_percent',
        threshold: 50, // 50% increase
        severity: 'critical',
        enabled: true,
        cooldown: 15
      }
    ];
    
    defaultRules.forEach(rule => this.alertRules.set(rule.id, rule));
  }

  /**
   * Setup scheduled reporting
   */
  private setupScheduledReporting(): void {
    // Check for scheduled reports every hour
    setInterval(() => {
      this.processScheduledReports();
    }, 60 * 60 * 1000);
    
    // Initial check
    setTimeout(() => this.processScheduledReports(), 5000);
  }

  /**
   * Setup real-time alerting
   */
  private setupRealTimeAlerting(): void {
    // Check for regressions every 5 minutes
    setInterval(() => {
      this.checkForRegressions();
    }, 5 * 60 * 1000);
    
    // Initial check
    setTimeout(() => this.checkForRegressions(), 10000);
  }

  /**
   * Process scheduled reports
   */
  private async processScheduledReports(): Promise<void> {
    const now = new Date();
    
    for (const [configId, config] of this.reportConfigs) {
      try {
        const shouldGenerate = this.shouldGenerateReport(config, now);
        
        if (shouldGenerate) {
          const report = await this.generateReport(configId);
          await this.sendReport(report, config.recipients);
        }
        
      } catch (error) {
        console.error(`[Automated Reporting] Failed to process scheduled report ${configId}:`, error);
      }
    }
  }

  /**
   * Check if report should be generated based on frequency
   */
  private shouldGenerateReport(config: ReportConfig, now: Date): boolean {
    // In a real implementation, this would check the last report generation time
    // For now, we'll use a simple time-based check
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();
    
    switch (config.frequency) {
      case 'daily':
        return hour === 9; // 9 AM daily
      case 'weekly':
        return dayOfWeek === 1 && hour === 9; // Monday 9 AM
      case 'monthly':
        return dayOfMonth === 1 && hour === 9; // 1st of month 9 AM
      default:
        return false;
    }
  }

  /**
   * Get report period based on frequency
   */
  private getReportPeriod(frequency: string, now: Date): { start: Date; end: Date } {
    const end = new Date(now);
    const start = new Date(now);
    
    switch (frequency) {
      case 'daily':
        start.setDate(start.getDate() - 1);
        break;
      case 'weekly':
        start.setDate(start.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(start.getMonth() - 1);
        break;
    }
    
    return { start, end };
  }

  /**
   * Collect analytics data for report
   */
  private async collectAnalyticsData(period: { start: Date; end: Date }, metrics: string[]): Promise<any> {
    // Mock data collection - in a real implementation, this would query your analytics database
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      summary: {
        totalUsers: Math.floor(Math.random() * 10000) + 5000,
        totalPageViews: Math.floor(Math.random() * 50000) + 20000,
        avgSessionDuration: Math.floor(Math.random() * 300) + 180,
        errorRate: Math.random() * 0.5
      },
      webVitals: {
        lcp: { value: 2000 + Math.random() * 1000, rating: 'good', change: (Math.random() - 0.5) * 20 },
        fid: { value: 50 + Math.random() * 100, rating: 'good', change: (Math.random() - 0.5) * 30 },
        cls: { value: 0.05 + Math.random() * 0.1, rating: 'good', change: (Math.random() - 0.5) * 40 },
        fcp: { value: 1200 + Math.random() * 800, rating: 'good', change: (Math.random() - 0.5) * 15 },
        ttfb: { value: 400 + Math.random() * 600, rating: 'needs-improvement', change: (Math.random() - 0.5) * 25 }
      },
      errors: {
        total: Math.floor(Math.random() * 100) + 10,
        byType: {
          'JavaScript': Math.floor(Math.random() * 50),
          'Network': Math.floor(Math.random() * 30),
          'Resource': Math.floor(Math.random() * 20)
        },
        topErrors: [
          { message: 'TypeError: Cannot read property of undefined', count: 15, impact: 'high' },
          { message: 'Network request failed', count: 8, impact: 'medium' },
          { message: 'Resource not found', count: 5, impact: 'low' }
        ]
      },
      performance: {
        budgetViolations: Math.floor(Math.random() * 10),
        regressions: []
      }
    };
  }

  /**
   * Generate recommendations based on analytics data
   */
  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    if (data.webVitals.lcp.value > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing critical resources.');
    }
    
    if (data.webVitals.fid.value > 100) {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time and breaking up long tasks.');
    }
    
    if (data.webVitals.cls.value > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content insertion.');
    }
    
    if (data.summary.errorRate > 0.5) {
      recommendations.push('High error rate detected. Review error logs and implement better error handling.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance metrics are within acceptable ranges. Continue monitoring for any regressions.');
    }
    
    return recommendations;
  }

  /**
   * Generate alerts based on thresholds
   */
  private generateAlerts(data: any, thresholds: Record<string, { warning: number; critical: number }>): any[] {
    const alerts: any[] = [];
    
    // Check Web Vitals against thresholds
    Object.entries(data.webVitals).forEach(([metric, vitals]: [string, any]) => {
      const threshold = thresholds[metric];
      if (!threshold) return;
      
      if (vitals.value > threshold.critical) {
        alerts.push({
          type: 'performance',
          severity: 'critical',
          message: `${metric.toUpperCase()} is critically high: ${vitals.value}`,
          action: `Immediate optimization required for ${metric.toUpperCase()}`
        });
      } else if (vitals.value > threshold.warning) {
        alerts.push({
          type: 'performance',
          severity: 'warning',
          message: `${metric.toUpperCase()} exceeds warning threshold: ${vitals.value}`,
          action: `Monitor and optimize ${metric.toUpperCase()}`
        });
      }
    });
    
    // Check error rate
    if (data.summary.errorRate > 1.0) {
      alerts.push({
        type: 'error',
        severity: 'critical',
        message: `Error rate is critically high: ${(data.summary.errorRate * 100).toFixed(2)}%`,
        action: 'Investigate and fix critical errors immediately'
      });
    }
    
    return alerts;
  }

  /**
   * Evaluate alert rule
   */
  private evaluateAlertRule(rule: AlertRule, current: any, baseline: any): boolean {
    const currentValue = current || 0;
    const baselineValue = baseline || 0;
    
    switch (rule.condition) {
      case 'greater_than':
        return currentValue > rule.threshold;
      case 'less_than':
        return currentValue < rule.threshold;
      case 'equals':
        return currentValue === rule.threshold;
      case 'change_percent':
        if (baselineValue === 0) return false;
        const changePercent = ((currentValue - baselineValue) / baselineValue) * 100;
        return Math.abs(changePercent) > rule.threshold;
      default:
        return false;
    }
  }

  /**
   * Trigger alert
   */
  private async triggerAlert(rule: AlertRule, currentValue: number, baselineValue: number): Promise<void> {
    console.log(`[Automated Reporting] Alert triggered: ${rule.name}`);
    
    // Track alert
    analyticsIntegration.trackEvent({
      name: 'alert_triggered',
      category: 'Analytics',
      label: rule.name,
      customParameters: {
        metric: rule.metric,
        severity: rule.severity,
        current_value: currentValue,
        baseline_value: baselineValue
      }
    });
    
    // In a real implementation, this would send notifications via email, Slack, etc.
  }

  /**
   * Get current metrics
   */
  private async getCurrentMetrics(): Promise<Record<string, number>> {
    // Mock current metrics - in a real implementation, this would query live data
    return {
      lcp: 2000 + Math.random() * 1500,
      fid: 50 + Math.random() * 150,
      cls: 0.05 + Math.random() * 0.15,
      fcp: 1200 + Math.random() * 1000,
      ttfb: 400 + Math.random() * 800,
      error_rate: Math.random() * 2
    };
  }

  /**
   * Get baseline metrics
   */
  private async getBaselineMetrics(): Promise<Record<string, number>> {
    // Mock baseline metrics - in a real implementation, this would be historical averages
    return {
      lcp: 2200,
      fid: 80,
      cls: 0.08,
      fcp: 1400,
      ttfb: 600,
      error_rate: 0.3
    };
  }

  /**
   * Format report for email
   */
  private formatReportForEmail(report: PerformanceReport): string {
    return `
      Performance Report - ${new Date(report.timestamp).toLocaleDateString()}
      
      Summary:
      - Total Users: ${report.summary.totalUsers.toLocaleString()}
      - Page Views: ${report.summary.totalPageViews.toLocaleString()}
      - Avg Session Duration: ${Math.floor(report.summary.avgSessionDuration / 60)}m ${report.summary.avgSessionDuration % 60}s
      - Error Rate: ${(report.summary.errorRate * 100).toFixed(2)}%
      
      Web Vitals:
      - LCP: ${(report.webVitals.lcp.value / 1000).toFixed(1)}s (${report.webVitals.lcp.rating})
      - FID: ${report.webVitals.fid.value}ms (${report.webVitals.fid.rating})
      - CLS: ${report.webVitals.cls.value.toFixed(3)} (${report.webVitals.cls.rating})
      
      Alerts: ${report.alerts.length}
      Recommendations: ${report.recommendations.length}
    `;
  }

  /**
   * Load configurations from storage
   */
  private loadConfigurations(): void {
    try {
      const configs = localStorage.getItem('automated-reporting-configs');
      const rules = localStorage.getItem('automated-reporting-rules');
      
      if (configs) {
        const parsedConfigs = JSON.parse(configs);
        Object.entries(parsedConfigs).forEach(([id, config]) => {
          this.reportConfigs.set(id, config as ReportConfig);
        });
      }
      
      if (rules) {
        const parsedRules = JSON.parse(rules);
        Object.entries(parsedRules).forEach(([id, rule]) => {
          this.alertRules.set(id, rule as AlertRule);
        });
      }
      
    } catch (error) {
      console.warn('[Automated Reporting] Failed to load configurations:', error);
    }
  }

  /**
   * Save configurations to storage
   */
  private saveConfigurations(): void {
    try {
      const configs = Object.fromEntries(this.reportConfigs);
      const rules = Object.fromEntries(this.alertRules);
      
      localStorage.setItem('automated-reporting-configs', JSON.stringify(configs));
      localStorage.setItem('automated-reporting-rules', JSON.stringify(rules));
      
    } catch (error) {
      console.warn('[Automated Reporting] Failed to save configurations:', error);
    }
  }
}

// Export singleton instance
export const automatedReporting = new AutomatedReportingService();
export { AutomatedReportingService, type ReportConfig, type PerformanceReport, type AlertRule };