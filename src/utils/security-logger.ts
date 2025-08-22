/**
 * Security Logger Module
 * Handles security event logging and monitoring
 */

// Security event types
export type SecurityEventType = 
  | 'csrf_violation'
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'suspicious_request'
  | 'authentication_failure'
  | 'authorization_failure'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'file_upload_violation'
  | 'api_abuse'
  | 'bot_detection'
  | 'geo_blocking'
  | 'security_header_violation'
  | 'csp_violation'
  | 'unusual_user_agent'
  | 'suspicious_ip'
  | 'brute_force_attempt'
  | 'session_hijack_attempt'
  | 'privilege_escalation_attempt'
  | 'data_exfiltration_attempt';

// Security event interface
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: string;
  ip: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  payload?: any;
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  reason: string;
  metadata: Record<string, any>;
}

// Security logger class
export class SecurityLogger {
  private static instance: SecurityLogger;
  private events: SecurityEvent[] = [];
  private maxEvents = 10000; // Keep last 10k events in memory

  private constructor() {}

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  /**
   * Log a security event
   */
  public logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
    };

    // Add to in-memory storage
    this.events.push(securityEvent);

    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] ${event.type}: ${event.reason}`, {
        ip: event.ip,
        url: event.url,
        riskScore: event.riskScore,
        blocked: event.blocked,
      });
    }

    return securityEvent;
  }

  /**
   * Get recent events by type
   */
  public getRecentEvents(type?: SecurityEventType, timeWindow = 3600000): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > cutoff && (!type || event.type === type);
    });
  }

  /**
   * Get events by IP
   */
  public getEventsByIP(ip: string, timeWindow = 3600000): SecurityEvent[] {
    const cutoff = Date.now() - timeWindow;
    return this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > cutoff && event.ip === ip;
    });
  }

  /**
   * Clear old events
   */
  public clearOldEvents(maxAge = 86400000): void { // 24 hours default
    const cutoff = Date.now() - maxAge;
    this.events = this.events.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      return eventTime > cutoff;
    });
  }

  /**
   * Get security statistics
   */
  public getStats(timeWindow = 3600000): Record<SecurityEventType, number> {
    const recentEvents = this.getRecentEvents(undefined, timeWindow);
    const stats = {} as Record<SecurityEventType, number>;
    
    // Initialize all event types to 0
    const eventTypes: SecurityEventType[] = [
      'csrf_violation', 'rate_limit_exceeded', 'invalid_input', 'suspicious_request',
      'authentication_failure', 'authorization_failure', 'sql_injection_attempt', 'xss_attempt',
      'file_upload_violation', 'api_abuse', 'bot_detection', 'geo_blocking',
      'security_header_violation', 'csp_violation', 'unusual_user_agent', 'suspicious_ip',
      'brute_force_attempt', 'session_hijack_attempt', 'privilege_escalation_attempt', 'data_exfiltration_attempt'
    ];
    
    eventTypes.forEach(type => {
      stats[type] = 0;
    });
    
    // Count events
    recentEvents.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + 1;
    });
    
    return stats;
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();

/**
 * Log a suspicious request
 */
export function logSuspiciousRequest(
  type: SecurityEventType,
  ip: string,
  url: string,
  reason: string,
  options: {
    method?: string;
    userAgent?: string;
    userId?: string;
    sessionId?: string;
    headers?: Record<string, string>;
    payload?: any;
    riskScore?: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    blocked?: boolean;
    metadata?: Record<string, any>;
  } = {}
): SecurityEvent {
  const eventData: any = {
    type,
    ip,
    url,
    reason,
    method: options.method || 'GET',
    headers: options.headers || {},
    payload: options.payload,
    riskScore: options.riskScore || 50,
    severity: options.severity || 'medium',
    blocked: options.blocked || false,
    metadata: options.metadata || {},
  };

  // Only add optional properties if they have values
  if (options.userAgent) eventData.userAgent = options.userAgent;
  if (options.userId) eventData.userId = options.userId;
  if (options.sessionId) eventData.sessionId = options.sessionId;

  return securityLogger.logEvent(eventData);
}

/**
 * Helper function to create security events
 */
export function createSecurityEvent(
  type: SecurityEventType,
  data: Partial<SecurityEvent>
): Omit<SecurityEvent, 'id' | 'timestamp'> {
  return {
    type,
    ip: data.ip || '0.0.0.0',
    url: data.url || '/',
    method: data.method || 'GET',
    headers: data.headers || {},
    riskScore: data.riskScore || 50,
    severity: data.severity || 'medium',
    blocked: data.blocked || false,
    reason: data.reason || 'Security event detected',
    metadata: data.metadata || {},
    ...data,
  };
}