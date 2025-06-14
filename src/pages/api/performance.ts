/**
 * Performance Monitoring API Endpoint
 * Collects and analyzes Core Web Vitals and custom metrics
 */

import type { APIRoute } from 'astro';
import { performanceConfig } from '../../config/build-optimization.js';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceData {
  url: string;
  userAgent: string;
  timestamp: number;
  sessionId: string;
  metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
    [key: string]: number | undefined;
  };
  customMetrics?: Record<string, number>;
  buildInfo?: {
    bundleSize?: number;
    thresholdsPassed?: boolean;
    recommendations?: number;
  };
}

// Core Web Vitals thresholds (in milliseconds, except CLS)
const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 }
};

function getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function validateMetrics(data: PerformanceData): PerformanceMetric[] {
  const validatedMetrics: PerformanceMetric[] = [];
  
  Object.entries(data.metrics).forEach(([name, value]) => {
    if (typeof value === 'number' && value >= 0) {
      validatedMetrics.push({
        name,
        value,
        rating: getRating(name, value),
        timestamp: data.timestamp
      });
    }
  });
  
  return validatedMetrics;
}

function analyzePerformance(metrics: PerformanceMetric[]): {
  score: number;
  grade: string;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let totalScore = 0;
  let metricCount = 0;
  
  metrics.forEach(metric => {
    metricCount++;
    
    switch (metric.rating) {
      case 'good':
        totalScore += 100;
        break;
      case 'needs-improvement':
        totalScore += 75;
        issues.push(`${metric.name.toUpperCase()} needs improvement (${metric.value})`);
        break;
      case 'poor':
        totalScore += 50;
        issues.push(`${metric.name.toUpperCase()} is poor (${metric.value})`);
        break;
    }
    
    // Specific recommendations
    if (metric.name === 'lcp' && metric.rating !== 'good') {
      recommendations.push('Optimize images and reduce server response times for better LCP');
    }
    if (metric.name === 'fid' && metric.rating !== 'good') {
      recommendations.push('Reduce JavaScript execution time and optimize event handlers for better FID');
    }
    if (metric.name === 'cls' && metric.rating !== 'good') {
      recommendations.push('Add size attributes to images and avoid inserting content above existing content for better CLS');
    }
  });
  
  const averageScore = metricCount > 0 ? totalScore / metricCount : 0;
  
  let grade = 'F';
  if (averageScore >= 90) grade = 'A';
  else if (averageScore >= 80) grade = 'B';
  else if (averageScore >= 70) grade = 'C';
  else if (averageScore >= 60) grade = 'D';
  
  return {
    score: Math.round(averageScore),
    grade,
    issues,
    recommendations
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const data: PerformanceData = await request.json();
    
    // Validate required fields
    if (!data.url || !data.timestamp || !data.metrics) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: url, timestamp, metrics'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate and process metrics
    const validatedMetrics = validateMetrics(data);
    
    if (validatedMetrics.length === 0) {
      return new Response(JSON.stringify({
        error: 'No valid metrics provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Analyze performance
    const analysis = analyzePerformance(validatedMetrics);
    
    // Create response with analysis
    const response = {
      success: true,
      timestamp: Date.now(),
      analysis: {
        ...analysis,
        metrics: validatedMetrics,
        thresholds: performanceConfig.thresholds,
        url: data.url
      },
      buildInfo: data.buildInfo || null
    };
    
    // Log performance data (in production, you might want to store this in a database)
    // Performance data received and processed successfully
    
    // Check if performance is below thresholds
    if (analysis.score < 70) {
      console.warn('⚠️ Poor performance detected:', {
        url: data.url,
        score: analysis.score,
        issues: analysis.issues
      });
    }
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('Performance API Error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async () => {
  // Return performance monitoring configuration
  const config = {
    metrics: performanceConfig.metrics,
    thresholds: performanceConfig.thresholds,
    sampleRate: performanceConfig.reporting.sampleRate,
    endpoint: performanceConfig.reporting.endpoint,
    timestamp: Date.now()
  };
  
  return new Response(JSON.stringify(config), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
    }
  });
};
