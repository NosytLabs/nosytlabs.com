/**
 * Security Alerting System
 * Handles security alerts, notifications, and monitoring thresholds
 */

import type { SecurityEvent, SecurityEventType } from './security-logger.ts';
import { getSecurityConfig } from '../config/security.ts';

// Alert configuration
export interface AlertConfig {
  enabled: boolean;
  thresholds: Record<SecurityEventType, number>;
  timeWindow: number; // minutes
  cooldown: number; // minutes
  channels: AlertChannel[];
}

// Alert channels
export type AlertChannel = 'console' | 'email' | 'webhook' | 'slack';

// Alert severity levels
export type AlertSeverity = 'info' | 'warning' | 'critical';

// Alert interface
export interface SecurityAlert {
  id: string;
  type: 'threshold_exceeded' | 'suspicious_pattern' | 'critical_event';
  severity: AlertSeverity;
  title: string;
  message: string;
  eventType: SecurityEventType;
  eventCount: number;
  threshold: number;
  timeWindow: number;
  affectedIPs: string[];
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
  metadata: Record<string, any>;
}

// Security monitoring patterns
export interface SecurityPattern {
  name: string;
  description: string;
  conditions: PatternCondition[];
  severity: AlertSeverity;
  action: 'alert' | 'block' | 'monitor';
}

export interface PatternCondition {
  field: keyof SecurityEvent;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex';
  value: any;
  timeWindow?: number; // minutes
  count?: number;
}

// Default alert configuration
const DEFAULT_ALERT_CONFIG: AlertConfig = {
  enabled: true,
  thresholds: {
    csrf_violation: 5,
    rate_limit_exceeded: 10,
    invalid_input: 20,
    suspicious_request: 15,
    authentication_failure: 5,
    authorization_failure: 3,
    sql_injection_attempt: 1,
    xss_attempt: 1,
    file_upload_violation: 3,
    api_abuse: 10,
    bot_detection: 50,
    geo_blocking: 100,
    security_header_violation: 20,
    csp_violation: 10,
    unusual_user_agent: 30,
    suspicious_ip: 25,
    brute_force_attempt: 3,
    session_hijack_attempt: 1,
    privilege_escalation_attempt: 1,
    data_exfiltration_attempt: 1,
  },
  timeWindow: 60, // 1 hour
  cooldown: 30, // 30 minutes
  channels: ['console'],
};

// Predefined security patterns
const SECURITY_PATTERNS: SecurityPattern[] = [
  {
    name: 'Brute Force Attack',
    description: 'Multiple authentication failures from same IP',
    conditions: [
      {
        field: 'type',
        operator: 'equals',
        value: 'authentication_failure',
        timeWindow: 15,
        count: 5,
      },
    ],
    severity: 'critical',
    action: 'block',
  },
  {
    name: 'SQL Injection Campaign',
    description: 'Multiple SQL injection attempts detected',
    conditions: [
      {
        field: 'type',
        operator: 'equals',
        value: 'sql_injection_attempt',
        timeWindow: 30,
        count: 2,
      },
    ],
    severity: 'critical',
    action: 'alert',
  },
  {
    name: 'Suspicious User Agent',
    description: 'Requests from known malicious user agents',
    conditions: [
      {
        field: 'userAgent',
        operator: 'regex',
        value: /(sqlmap|nikto|nmap|masscan|zap|burp|acunetix)/i,
      },
    ],
    severity: 'warning',
    action: 'monitor',
  },
  {
    name: 'High Risk Score Pattern',
    description: 'Multiple high-risk events from same source',
    conditions: [
      {
        field: 'riskScore',
        operator: 'greater_than',
        value: 75,
        timeWindow: 30,
        count: 3,
      },
    ],
    severity: 'critical',
    action: 'alert',
  },
  {
    name: 'Rapid Fire Requests',
    description: 'Unusually high request rate from single IP',
    conditions: [
      {
        field: 'type',
        operator: 'equals',
        value: 'rate_limit_exceeded',
        timeWindow: 5,
        count: 10,
      },
    ],
    severity: 'warning',
    action: 'monitor',
  },
];

// Security Alert Manager
export class SecurityAlertManager {
  private static instance: SecurityAlertManager;
  private config: AlertConfig;
  private alerts: SecurityAlert[] = [];
  private alertCooldowns: Map<string, number> = new Map();
  private patterns: SecurityPattern[];

  private constructor() {
    const securityConfig = getSecurityConfig();

    // Convert security config to alert config format
    const defaultChannels: AlertChannel[] = [];
    if (securityConfig.alerts?.channels?.console) defaultChannels.push('console');
    if (securityConfig.alerts?.channels?.email) defaultChannels.push('email');
    if (securityConfig.alerts?.channels?.webhook) defaultChannels.push('webhook');
    if (securityConfig.alerts?.channels?.slack) defaultChannels.push('slack');

    this.config = {
      ...DEFAULT_ALERT_CONFIG,
      enabled: securityConfig.alerts?.enabled ?? DEFAULT_ALERT_CONFIG.enabled,
      channels: defaultChannels.length > 0 ? defaultChannels : DEFAULT_ALERT_CONFIG.channels,
      cooldown: securityConfig.alerts?.cooldown ?? DEFAULT_ALERT_CONFIG.cooldown,
      timeWindow: securityConfig.alerts?.thresholds.timeWindow ?? DEFAULT_ALERT_CONFIG.timeWindow,
    };

    // Override thresholds if provided in security config
    if (securityConfig.alerts?.thresholds) {
      this.config.thresholds = {
        ...this.config.thresholds,
        ...securityConfig.alerts.thresholds,
      };
    }

    this.patterns = [...SECURITY_PATTERNS];
  }

  public static getInstance(): SecurityAlertManager {
    if (!SecurityAlertManager.instance) {
      SecurityAlertManager.instance = new SecurityAlertManager();
    }
    return SecurityAlertManager.instance;
  }

  /**
   * Process security event for alerting
   */
  public processEvent(event: SecurityEvent, recentEvents: SecurityEvent[]): void {
    if (!this.config.enabled) return;

    // Check threshold-based alerts
    this.checkThresholdAlerts(event, recentEvents);

    // Check pattern-based alerts
    this.checkPatternAlerts(event, recentEvents);

    // Check for critical events that need immediate alerting
    this.checkCriticalEvents(event);
  }

  /**
   * Check threshold-based alerts
   */
  private checkThresholdAlerts(event: SecurityEvent, recentEvents: SecurityEvent[]): void {
    const threshold = this.config.thresholds[event.type];
    if (!threshold) return;

    // Count events of same type in time window
    const windowStart = new Date(Date.now() - this.config.timeWindow * 60 * 1000);
    const eventsInWindow = recentEvents.filter(
      e => e.type === event.type && new Date(e.timestamp) > windowStart
    );

    if (eventsInWindow.length >= threshold) {
      const alertKey = `threshold_${event.type}`;

      // Check cooldown
      if (this.isInCooldown(alertKey)) return;

      const alert: SecurityAlert = {
        id: this.generateAlertId(),
        type: 'threshold_exceeded',
        severity: this.getAlertSeverity(event.type),
        title: `Security Threshold Exceeded: ${this.formatEventType(event.type)}`,
        message: `${eventsInWindow.length} ${event.type} events detected in ${this.config.timeWindow} minutes (threshold: ${threshold})`,
        eventType: event.type,
        eventCount: eventsInWindow.length,
        threshold,
        timeWindow: this.config.timeWindow,
        affectedIPs: [...new Set(eventsInWindow.map(e => e.ip))],
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: {
          triggerEvent: event.id,
          windowStart: windowStart.toISOString(),
          uniqueIPs: new Set(eventsInWindow.map(e => e.ip)).size,
        },
      };

      this.triggerAlert(alert);
      this.setCooldown(alertKey);
    }
  }

  /**
   * Check pattern-based alerts
   */
  private checkPatternAlerts(event: SecurityEvent, recentEvents: SecurityEvent[]): void {
    for (const pattern of this.patterns) {
      if (this.matchesPattern(event, recentEvents, pattern)) {
        const alertKey = `pattern_${pattern.name.toLowerCase().replace(/\s+/g, '_')}`;

        // Check cooldown
        if (this.isInCooldown(alertKey)) continue;

        const alert: SecurityAlert = {
          id: this.generateAlertId(),
          type: 'suspicious_pattern',
          severity: pattern.severity,
          title: `Security Pattern Detected: ${pattern.name}`,
          message: pattern.description,
          eventType: event.type,
          eventCount: 1,
          threshold: 1,
          timeWindow: this.config.timeWindow,
          affectedIPs: [event.ip],
          timestamp: new Date().toISOString(),
          acknowledged: false,
          metadata: {
            patternName: pattern.name,
            triggerEvent: event.id,
            action: pattern.action,
          },
        };

        this.triggerAlert(alert);
        this.setCooldown(alertKey);
      }
    }
  }

  /**
   * Check for critical events requiring immediate alerts
   */
  private checkCriticalEvents(event: SecurityEvent): void {
    const criticalTypes: SecurityEventType[] = [
      'sql_injection_attempt',
      'xss_attempt',
      'session_hijack_attempt',
      'privilege_escalation_attempt',
      'data_exfiltration_attempt',
    ];

    if (criticalTypes.includes(event.type)) {
      const alert: SecurityAlert = {
        id: this.generateAlertId(),
        type: 'critical_event',
        severity: 'critical',
        title: `Critical Security Event: ${this.formatEventType(event.type)}`,
        message: `Immediate attention required: ${event.type} detected from ${event.ip}`,
        eventType: event.type,
        eventCount: 1,
        threshold: 1,
        timeWindow: 0,
        affectedIPs: [event.ip],
        timestamp: new Date().toISOString(),
        acknowledged: false,
        metadata: {
          triggerEvent: event.id,
          riskScore: event.riskScore,
          userAgent: event.userAgent,
          url: event.url,
        },
      };

      this.triggerAlert(alert);
    }
  }

  /**
   * Check if pattern matches event and recent events
   */
  private matchesPattern(
    event: SecurityEvent,
    recentEvents: SecurityEvent[],
    pattern: SecurityPattern
  ): boolean {
    return pattern.conditions.every(condition => {
      if (condition.timeWindow && condition.count) {
        // Time-based condition
        const windowStart = new Date(Date.now() - condition.timeWindow * 60 * 1000);
        const matchingEvents = recentEvents.filter(e => {
          if (new Date(e.timestamp) <= windowStart) return false;
          return this.evaluateCondition(e, condition);
        });
        return matchingEvents.length >= condition.count;
      } else {
        // Single event condition
        return this.evaluateCondition(event, condition);
      }
    });
  }

  /**
   * Evaluate single condition against event
   */
  private evaluateCondition(event: SecurityEvent, condition: PatternCondition): boolean {
    const fieldValue = event[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'regex':
        return condition.value.test(String(fieldValue));
      default:
        return false;
    }
  }

  /**
   * Trigger security alert
   */
  private triggerAlert(alert: SecurityAlert): void {
    this.alerts.push(alert);

    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    // Send alert through configured channels
    this.sendAlert(alert);

    // Log alert
    console.error(`🚨 SECURITY ALERT [${alert.severity.toUpperCase()}]:`, {
      title: alert.title,
      message: alert.message,
      affectedIPs: alert.affectedIPs,
      eventCount: alert.eventCount,
    });
  }

  /**
   * Send alert through configured channels
   */
  private async sendAlert(alert: SecurityAlert): Promise<void> {
    for (const channel of this.config.channels) {
      try {
        switch (channel) {
          case 'console':
            this.sendConsoleAlert(alert);
            break;
          case 'email':
            // eslint-disable-next-line no-await-in-loop
            await this.sendEmailAlert(alert);
            break;
          case 'webhook':
            // eslint-disable-next-line no-await-in-loop
            await this.sendWebhookAlert(alert);
            break;
          case 'slack':
            // eslint-disable-next-line no-await-in-loop
            await this.sendSlackAlert(alert);
            break;
        }
      } catch (error) {
        console.error(`Failed to send alert via ${channel}:`, error);
      }
    }
  }

  /**
   * Send console alert
   */
  private sendConsoleAlert(alert: SecurityAlert): void {
    const emoji = alert.severity === 'critical' ? '🔥' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.warn(`${emoji} ${alert.title}`);
    console.warn(`   ${alert.message}`);
    console.warn(`   Affected IPs: ${alert.affectedIPs.join(', ')}`);
    console.warn(`   Timestamp: ${alert.timestamp}`);
  }

  /**
   * Send email alert (placeholder)
   */
  private async sendEmailAlert(alert: SecurityAlert): Promise<void> {
    // In production, integrate with email service
    console.log('Email alert would be sent:', alert.title);
  }

  /**
   * Send webhook alert (placeholder)
   */
  private async sendWebhookAlert(alert: SecurityAlert): Promise<void> {
    // In production, send to webhook endpoint
    console.log('Webhook alert would be sent:', alert.title);
  }

  /**
   * Send Slack alert (placeholder)
   */
  private async sendSlackAlert(alert: SecurityAlert): Promise<void> {
    // In production, integrate with Slack API
    console.log('Slack alert would be sent:', alert.title);
  }

  /**
   * Get recent alerts
   */
  public getRecentAlerts(limit = 50): SecurityAlert[] {
    return this.alerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  /**
   * Update alert configuration
   */
  public updateConfig(newConfig: Partial<AlertConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Add custom security pattern
   */
  public addPattern(pattern: SecurityPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Helper methods
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private formatEventType(type: SecurityEventType): string {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getAlertSeverity(eventType: SecurityEventType): AlertSeverity {
    const criticalTypes: SecurityEventType[] = [
      'sql_injection_attempt',
      'xss_attempt',
      'session_hijack_attempt',
      'privilege_escalation_attempt',
      'data_exfiltration_attempt',
    ];

    const warningTypes: SecurityEventType[] = [
      'csrf_violation',
      'authentication_failure',
      'authorization_failure',
      'brute_force_attempt',
    ];

    if (criticalTypes.includes(eventType)) return 'critical';
    if (warningTypes.includes(eventType)) return 'warning';
    return 'info';
  }

  private isInCooldown(alertKey: string): boolean {
    const lastAlert = this.alertCooldowns.get(alertKey);
    if (!lastAlert) return false;

    const cooldownEnd = lastAlert + this.config.cooldown * 60 * 1000;
    return Date.now() < cooldownEnd;
  }

  private setCooldown(alertKey: string): void {
    this.alertCooldowns.set(alertKey, Date.now());
  }
}

// Export singleton instance
export const securityAlertManager = SecurityAlertManager.getInstance();

// Convenience functions
export function processSecurityEvent(event: SecurityEvent, recentEvents: SecurityEvent[]): void {
  securityAlertManager.processEvent(event, recentEvents);
}

export function getRecentAlerts(limit?: number): SecurityAlert[] {
  return securityAlertManager.getRecentAlerts(limit);
}

export function acknowledgeAlert(alertId: string): boolean {
  return securityAlertManager.acknowledgeAlert(alertId);
}

export function resolveAlert(alertId: string): boolean {
  return securityAlertManager.resolveAlert(alertId);
}
