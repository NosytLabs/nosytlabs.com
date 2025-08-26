import { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const router = Router();

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  sessionId?: string;
}

interface PerformancePayload {
  metrics: PerformanceMetric[];
  sessionId: string;
  timestamp: number;
}

// Rate limiting for performance metrics endpoint
const performanceMetricsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many performance metric requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validatePerformanceMetrics = [
  body('metrics').isArray().withMessage('Metrics must be an array'),
  body('metrics.*.name').isString().withMessage('Metric name must be a string'),
  body('metrics.*.value').isNumeric().withMessage('Metric value must be numeric'),
  body('metrics.*.rating').isIn(['good', 'needs-improvement', 'poor']).withMessage('Invalid rating'),
  body('metrics.*.timestamp').isNumeric().withMessage('Timestamp must be numeric'),
  body('metrics.*.url').isURL().withMessage('URL must be valid'),
  body('sessionId').isString().withMessage('Session ID must be a string'),
  body('timestamp').isNumeric().withMessage('Timestamp must be numeric')
];

// In-memory storage for metrics (in production, use a proper database)
class MetricsStore {
  private metrics: PerformanceMetric[] = [];
  private alerts: any[] = [];
  private readonly maxMetrics = 10000; // Limit memory usage
  private readonly maxAlerts = 1000;

  addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics to prevent memory issues
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  addAlert(alert: any): void {
    this.alerts.push(alert);
    
    // Keep only recent alerts to prevent memory issues
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }
  }

  getMetrics(filters?: {
    startTime?: number;
    endTime?: number;
    metric?: string;
    url?: string;
    sessionId?: string;
  }): PerformanceMetric[] {
    let filteredMetrics = this.metrics;

    if (filters) {
      if (filters.startTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        filteredMetrics = filteredMetrics.filter(m => m.timestamp <= filters.endTime!);
      }
      if (filters.metric) {
        filteredMetrics = filteredMetrics.filter(m => m.name === filters.metric);
      }
      if (filters.url) {
        filteredMetrics = filteredMetrics.filter(m => m.url === filters.url);
      }
      if (filters.sessionId) {
        filteredMetrics = filteredMetrics.filter(m => m.sessionId === filters.sessionId);
      }
    }

    return filteredMetrics;
  }

  getStats(): {
    totalMetrics: number;
    uniqueSessions: number;
    avgLCP: number;
    avgFID: number;
    avgCLS: number;
    avgFCP: number;
    avgTTFB: number;
  } {
    const lcpMetrics = this.metrics.filter(m => m.name === 'LCP');
    const fidMetrics = this.metrics.filter(m => m.name === 'FID');
    const clsMetrics = this.metrics.filter(m => m.name === 'CLS');
    const fcpMetrics = this.metrics.filter(m => m.name === 'FCP');
    const ttfbMetrics = this.metrics.filter(m => m.name === 'TTFB');
    
    const uniqueSessions = new Set(this.metrics.map(m => m.sessionId)).size;
    
    return {
      totalMetrics: this.metrics.length,
      uniqueSessions,
      avgLCP: lcpMetrics.length > 0 ? lcpMetrics.reduce((sum, m) => sum + m.value, 0) / lcpMetrics.length : 0,
      avgFID: fidMetrics.length > 0 ? fidMetrics.reduce((sum, m) => sum + m.value, 0) / fidMetrics.length : 0,
      avgCLS: clsMetrics.length > 0 ? clsMetrics.reduce((sum, m) => sum + m.value, 0) / clsMetrics.length : 0,
      avgFCP: fcpMetrics.length > 0 ? fcpMetrics.reduce((sum, m) => sum + m.value, 0) / fcpMetrics.length : 0,
      avgTTFB: ttfbMetrics.length > 0 ? ttfbMetrics.reduce((sum, m) => sum + m.value, 0) / ttfbMetrics.length : 0,
    };
  }

  getAlerts(filters?: {
    startTime?: number;
    endTime?: number;
    type?: string;
    metric?: string;
  }): any[] {
    let filteredAlerts = this.alerts;

    if (filters) {
      if (filters.startTime) {
        filteredAlerts = filteredAlerts.filter(a => a.timestamp >= filters.startTime!);
      }
      if (filters.endTime) {
        filteredAlerts = filteredAlerts.filter(a => a.timestamp <= filters.endTime!);
      }
      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(a => a.type === filters.type);
      }
      if (filters.metric) {
        filteredAlerts = filteredAlerts.filter(a => a.metric === filters.metric);
      }
    }

    return filteredAlerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  clear(): void {
    this.metrics = [];
    this.alerts = [];
  }
}

const metricsStore = new MetricsStore();

// Helper function to calculate percentiles
function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

// Helper function to get metric statistics
function getMetricStats(metricName: string, timeRange: number = 24 * 60 * 60 * 1000): any {
  const now = Date.now();
  const cutoff = now - timeRange;
  
  const relevantMetrics = metricsStore.getMetrics({ startTime: cutoff })
    .filter(metric => metric.name.toLowerCase() === metricName.toLowerCase());
  
  if (relevantMetrics.length === 0) {
    return null;
  }
  
  const values = relevantMetrics.map(m => m.value);
  const ratings = relevantMetrics.map(m => m.rating);
  
  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    p50: calculatePercentile(values, 50),
    p75: calculatePercentile(values, 75),
    p90: calculatePercentile(values, 90),
    p95: calculatePercentile(values, 95),
    p99: calculatePercentile(values, 99),
    ratings: {
      good: ratings.filter(r => r === 'good').length,
      'needs-improvement': ratings.filter(r => r === 'needs-improvement').length,
      poor: ratings.filter(r => r === 'poor').length
    }
  };
}

import { csrfMiddleware } from '../../src/lib/csrf';

// POST /api/performance-metrics - Receive performance metrics
router.post('/', performanceMetricsLimiter, csrfMiddleware, validatePerformanceMetrics, (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const payload: PerformancePayload = req.body;
    
    // Basic payload validation
    if (!payload.metrics || !Array.isArray(payload.metrics) || payload.metrics.length === 0) {
      return res.status(400).json({ error: 'Invalid metrics payload' });
    }

    // Store individual metrics
    payload.metrics.forEach(metric => {
      const performanceMetric: PerformanceMetric = {
        ...metric,
        sessionId: payload.sessionId,
        timestamp: payload.timestamp
      };
      metricsStore.addMetric(performanceMetric);
    });

    // Log critical performance issues
    const criticalMetrics = payload.metrics.filter(m => m.rating === 'poor');
    if (criticalMetrics.length > 0) {
      console.warn('[Performance Alert] Critical metrics detected:', {
        sessionId: payload.sessionId,
        url: criticalMetrics[0].url,
        metrics: criticalMetrics.map(m => ({ name: m.name, value: m.value }))
      });
    }

    res.status(200).json({ 
      success: true, 
      received: payload.metrics.length,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[Performance Metrics] Error processing metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/performance-metrics/stats - Get performance statistics
router.get('/stats', (req: Request, res: Response) => {
  try {
    const { timeRange = '24h', metric } = req.query;
    
    // Convert time range to milliseconds
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[timeRange as string] || 24 * 60 * 60 * 1000;

    if (metric && typeof metric === 'string') {
      // Get stats for specific metric
      const stats = getMetricStats(metric, timeRangeMs);
      if (!stats) {
        return res.status(404).json({ error: 'No data found for the specified metric' });
      }
      return res.json({ metric, stats, timeRange });
    }

    // Get stats for all Core Web Vitals
    const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
    const allStats: Record<string, any> = {};
    
    coreMetrics.forEach(metricName => {
      const stats = getMetricStats(metricName, timeRangeMs);
      if (stats) {
        allStats[metricName.toLowerCase()] = stats;
      }
    });

    const overallStats = metricsStore.getStats();

    res.json({
      stats: allStats,
      timeRange,
      totalSessions: overallStats.uniqueSessions,
      totalMetrics: overallStats.totalMetrics,
      overallStats
    });
  } catch (error) {
    console.error('[Performance Stats] Error generating stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/performance-metrics/health - Health check for performance monitoring
router.get('/health', (req: Request, res: Response) => {
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;
  const recentMetrics = metricsStore.getMetrics({ startTime: fiveMinutesAgo });
  const stats = metricsStore.getStats();
  
  res.json({
    status: 'healthy',
    timestamp: now,
    recentMetrics: recentMetrics.length,
    totalMetrics: stats.totalMetrics,
    uniqueSessions: stats.uniqueSessions,
    uptime: process.uptime()
  });
});

// GET /api/performance-metrics/alerts - Get performance alerts
router.get('/alerts', (req: Request, res: Response) => {
  const { startTime, endTime, type, metric } = req.query;
  
  const filters: any = {};
  if (startTime) filters.startTime = parseInt(startTime as string);
  if (endTime) filters.endTime = parseInt(endTime as string);
  if (type) filters.type = type as string;
  if (metric) filters.metric = metric as string;
  
  const alerts = metricsStore.getAlerts(filters);
  
  res.json({
    success: true,
    alerts,
    total: alerts.length,
    filters
  });
});

// POST /api/performance-metrics/alerts - Receive performance alerts
router.post('/alerts', [
  body('type').isString().notEmpty(),
  body('metric').isString().notEmpty(),
  body('value').isNumeric(),
  body('threshold').isNumeric(),
  body('url').isURL().optional(),
  body('timestamp').isNumeric().optional(),
  body('sessionId').isString().optional(),
  body('userAgent').isString().optional(),
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const alert = {
    ...req.body,
    timestamp: req.body.timestamp || Date.now(),
    receivedAt: new Date().toISOString(),
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  console.log('Performance Alert Received:', alert);
  
  // Store alert in memory store
  metricsStore.addAlert(alert);
  
  // Implement email notification using SendGrid
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key (in production, use environment variables)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'your-api-key-here');

// Function to send email notification
async function sendEmailNotification(alert) {
  const msg = {
    to: 'admin@example.com', // Change to your recipient
    from: 'notifications@nosytlabs.com', // Change to your verified sender
    subject: `Performance Alert: ${alert.type}`,
    text: `Alert Details:\nType: ${alert.type}\nMetric: ${alert.metric}\nValue: ${alert.value}\nThreshold: ${alert.threshold}\nURL: ${alert.url}\nTimestamp: ${new Date(alert.timestamp).toISOString()}`,
    html: `<strong>Performance Alert</strong><p>Type: ${alert.type}</p><p>Metric: ${alert.metric}</p><p>Value: ${alert.value}</p><p>Threshold: ${alert.threshold}</p><p>URL: ${alert.url}</p><p>Timestamp: ${new Date(alert.timestamp).toISOString()}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Call the function
await sendEmailNotification(alert);
  
  res.status(200).json({ 
    success: true, 
    message: 'Alert received and processed',
    alertId: alert.id
  });
});

// POST /api/performance-metrics/email-alert - Email alert endpoint (placeholder)
router.post('/email-alert', [
  body('to').isEmail(),
  body('subject').isString().notEmpty(),
  body('message').isString().notEmpty(),
  body('alertData').isObject().optional(),
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { to, subject, message, alertData } = req.body;
  
  console.log('Email Alert Request:', { to, subject, message, alertData });
  
  // TODO: Implement actual email sending service
  // This could integrate with SendGrid, AWS SES, or similar service
  
  res.status(200).json({ 
    success: true, 
    message: 'Email alert queued for sending',
    emailId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });
});

// POST /api/performance-metrics/errors - Receive error reports
router.post('/errors', [
  body('type').isIn(['javascript', 'network', 'performance', 'unhandled']),
  body('message').isString().notEmpty(),
  body('url').isURL(),
  body('timestamp').isNumeric(),
  body('sessionId').isString().notEmpty(),
  body('severity').isIn(['low', 'medium', 'high', 'critical']),
  body('stack').isString().optional(),
  body('context').isObject().optional(),
  body('performanceImpact').isObject().optional(),
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const errorReport = {
    ...req.body,
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    receivedAt: new Date().toISOString()
  };

  console.log(`[Error Report] ${errorReport.severity.toUpperCase()}: ${errorReport.message}`);
  
  // Store error in MetricsStore
  metricsStore.addError(errorReport);
  // In production, save to database
  
  // Log critical errors with more detail
  if (errorReport.severity === 'critical') {
    console.error('[CRITICAL ERROR]', {
      message: errorReport.message,
      url: errorReport.url,
      stack: errorReport.stack,
      context: errorReport.context,
      performanceImpact: errorReport.performanceImpact
    });
  }
  
  res.status(201).json({ 
    success: true, 
    message: 'Error report received',
    errorId: errorReport.id
  });
});

// GET /api/performance-metrics/errors - Get error reports
router.get('/errors', (req: Request, res: Response) => {
  const { type, severity, startTime, endTime, limit = '100' } = req.query;
  
  // TODO: Implement error retrieval from storage
  // For now, return empty array as placeholder
  
  res.json({
    success: true,
    errors: [],
    total: 0,
    filters: { type, severity, startTime, endTime, limit }
  });
});

// GET /api/performance-metrics/error-stats - Get error statistics
router.get('/error-stats', (req: Request, res: Response) => {
  const { timeRange = '24h' } = req.query;
  
  // TODO: Implement error statistics calculation
  // For now, return placeholder data
  
  res.json({
    success: true,
    timeRange,
    stats: {
      totalErrors: 0,
      errorsByType: {
        javascript: 0,
        network: 0,
        performance: 0,
        unhandled: 0
      },
      errorsBySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      errorRate: 0
    }
  });
});

export default router;