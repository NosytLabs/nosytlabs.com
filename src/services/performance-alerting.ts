import { PerformanceBudgetValidator } from '../utils/performance-budget';

interface AlertConfig {
  email?: string;
  webhook?: string;
  slack?: string;
  enableConsoleAlerts?: boolean;
  enableBrowserNotifications?: boolean;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface AlertRule {
  metric: string;
  threshold: number;
  type: 'warning' | 'critical';
  enabled: boolean;
  cooldown?: number; // minutes
}

export class PerformanceAlertingService {
  private config: AlertConfig;
  private validator: PerformanceBudgetValidator;
  private alertHistory: Map<string, number> = new Map();
  private defaultRules: AlertRule[] = [
    { metric: 'LCP', threshold: 2500, type: 'warning', enabled: true, cooldown: 5 },
    { metric: 'LCP', threshold: 4000, type: 'critical', enabled: true, cooldown: 5 },
    { metric: 'FID', threshold: 100, type: 'warning', enabled: true, cooldown: 5 },
    { metric: 'FID', threshold: 300, type: 'critical', enabled: true, cooldown: 5 },
    { metric: 'CLS', threshold: 0.1, type: 'warning', enabled: true, cooldown: 5 },
    { metric: 'CLS', threshold: 0.25, type: 'critical', enabled: true, cooldown: 5 },
    { metric: 'FCP', threshold: 1800, type: 'warning', enabled: true, cooldown: 5 },
    { metric: 'FCP', threshold: 3000, type: 'critical', enabled: true, cooldown: 5 },
    { metric: 'TTFB', threshold: 800, type: 'warning', enabled: true, cooldown: 5 },
    { metric: 'TTFB', threshold: 1800, type: 'critical', enabled: true, cooldown: 5 },
  ];

  constructor(config: AlertConfig = {}) {
    this.config = {
      enableConsoleAlerts: true,
      enableBrowserNotifications: false,
      ...config
    };
    this.validator = new PerformanceBudgetValidator();
    this.requestNotificationPermission();
  }

  private async requestNotificationPermission(): Promise<void> {
    if (this.config.enableBrowserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  }

  public checkMetric(metric: string, value: number, url: string = window.location.href): void {
    const applicableRules = this.defaultRules.filter(rule => 
      rule.metric === metric && rule.enabled
    );

    for (const rule of applicableRules) {
      if (this.shouldTriggerAlert(metric, value, rule)) {
        const alert = this.createAlert(metric, value, rule, url);
        this.processAlert(alert);
      }
    }
  }

  private shouldTriggerAlert(metric: string, value: number, rule: AlertRule): boolean {
    // Check if value exceeds threshold
    const exceedsThreshold = value > rule.threshold;
    if (!exceedsThreshold) return false;

    // Check cooldown period
    const alertKey = `${metric}-${rule.type}`;
    const lastAlert = this.alertHistory.get(alertKey);
    const now = Date.now();
    const cooldownMs = (rule.cooldown || 5) * 60 * 1000;

    if (lastAlert && (now - lastAlert) < cooldownMs) {
      return false;
    }

    return true;
  }

  private createAlert(metric: string, value: number, rule: AlertRule, url: string): Alert {
    const alert: Alert = {
      id: crypto.randomUUID(),
      type: rule.type,
      metric,
      value,
      threshold: rule.threshold,
      message: this.generateAlertMessage(metric, value, rule.threshold, rule.type),
      timestamp: Date.now(),
      url,
      userAgent: navigator.userAgent
    };

    // Update alert history
    const alertKey = `${metric}-${rule.type}`;
    this.alertHistory.set(alertKey, alert.timestamp);

    return alert;
  }

  private generateAlertMessage(metric: string, value: number, threshold: number, type: string): string {
    const unit = this.getMetricUnit(metric);
    const formattedValue = this.formatMetricValue(metric, value);
    const formattedThreshold = this.formatMetricValue(metric, threshold);
    
    return `${type.toUpperCase()}: ${metric} is ${formattedValue}${unit}, exceeding ${type} threshold of ${formattedThreshold}${unit}`;
  }

  private getMetricUnit(metric: string): string {
    switch (metric) {
      case 'LCP':
      case 'FID':
      case 'FCP':
      case 'TTFB':
        return 'ms';
      case 'CLS':
        return '';
      default:
        return '';
    }
  }

  private formatMetricValue(metric: string, value: number): string {
    switch (metric) {
      case 'CLS':
        return value.toFixed(3);
      default:
        return Math.round(value).toString();
    }
  }

  private async processAlert(alert: Alert): Promise<void> {
    // Console logging
    if (this.config.enableConsoleAlerts) {
      const style = alert.type === 'critical' ? 'color: red; font-weight: bold;' : 'color: orange;';
      console.warn(`%c[Performance Alert] ${alert.message}`, style, alert);
    }

    // Browser notification
    if (this.config.enableBrowserNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Performance ${alert.type.toUpperCase()}`, {
        body: alert.message,
        icon: '/favicon.svg',
        tag: `perf-${alert.metric}`,
        requireInteraction: alert.type === 'critical'
      });
    }

    // Send to backend for processing
    try {
      await fetch('/api/performance-metrics/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Failed to send alert to backend:', error);
    }

    // External integrations
    await this.sendExternalAlerts(alert);
  }

  private async sendExternalAlerts(alert: Alert): Promise<void> {
    const promises: Promise<void>[] = [];

    // Webhook integration
    if (this.config.webhook) {
      promises.push(this.sendWebhookAlert(alert));
    }

    // Slack integration
    if (this.config.slack) {
      promises.push(this.sendSlackAlert(alert));
    }

    // Email integration (would require backend service)
    if (this.config.email) {
      promises.push(this.sendEmailAlert(alert));
    }

    await Promise.allSettled(promises);
  }

  private async sendWebhookAlert(alert: Alert): Promise<void> {
    try {
      await fetch(this.config.webhook!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `Performance Alert: ${alert.message}`,
          alert,
          timestamp: new Date(alert.timestamp).toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  private async sendSlackAlert(alert: Alert): Promise<void> {
    try {
      const color = alert.type === 'critical' ? 'danger' : 'warning';
      const payload = {
        attachments: [{
          color,
          title: `Performance ${alert.type.toUpperCase()} Alert`,
          text: alert.message,
          fields: [
            { title: 'Metric', value: alert.metric, short: true },
            { title: 'Value', value: `${this.formatMetricValue(alert.metric, alert.value)}${this.getMetricUnit(alert.metric)}`, short: true },
            { title: 'Threshold', value: `${this.formatMetricValue(alert.metric, alert.threshold)}${this.getMetricUnit(alert.metric)}`, short: true },
            { title: 'URL', value: alert.url, short: true },
          ],
          timestamp: Math.floor(alert.timestamp / 1000)
        }]
      };

      await fetch(this.config.slack!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  private async sendEmailAlert(alert: Alert): Promise<void> {
    try {
      await fetch('/api/performance-metrics/email-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: this.config.email,
          alert
        })
      });
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  public getAlertHistory(): Alert[] {
    // This would typically fetch from backend
    return [];
  }

  public clearAlertHistory(): void {
    this.alertHistory.clear();
  }

  public updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public addCustomRule(rule: AlertRule): void {
    this.defaultRules.push(rule);
  }

  public removeRule(metric: string, type: 'warning' | 'critical'): void {
    this.defaultRules = this.defaultRules.filter(rule => 
      !(rule.metric === metric && rule.type === type)
    );
  }
}

// Export singleton instance
export const performanceAlerting = new PerformanceAlertingService();