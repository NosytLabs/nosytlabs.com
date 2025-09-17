#!/usr/bin/env node
/**
 * Performance Budget Validation Script
 * 
 * Validates performance metrics against defined budgets and generates reports
 * Supports multiple output formats and CI/CD integration
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface PerformanceBudget {
  resourceSizes: {
    script: number;
    stylesheet: number;
    image: number;
    font: number;
    document: number;
    other: number;
  };
  resourceCounts: {
    script: number;
    stylesheet: number;
    image: number;
    font: number;
    document: number;
    other: number;
  };
  timings: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
  };
}

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    resource: string;
    type: string;
    actual: number;
    budget: number;
    severity: 'error' | 'warning';
  }>;
  summary: {
    totalViolations: number;
    errorViolations: number;
    warningViolations: number;
  };
}

export class PerformanceBudgetValidator {
  private budget: PerformanceBudget;
  private strict: boolean;

  constructor(budgetPath?: string, strict = false) {
    this.strict = strict;
    this.budget = this.loadBudget(budgetPath);
  }

  private loadBudget(budgetPath?: string): PerformanceBudget {
    const defaultBudgetPath = resolve(process.cwd(), 'performance-budget.json');
    const path = budgetPath || defaultBudgetPath;

    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        return JSON.parse(content);
      } catch (error) {
        console.warn(`Failed to load budget from ${path}, using defaults`);
      }
    }

    // Default performance budget
    return {
      resourceSizes: {
        script: 250000, // 250KB
        stylesheet: 50000, // 50KB
        image: 500000, // 500KB
        font: 100000, // 100KB
        document: 25000, // 25KB
        other: 50000, // 50KB
      },
      resourceCounts: {
        script: 10,
        stylesheet: 5,
        image: 20,
        font: 5,
        document: 1,
        other: 10,
      },
      timings: {
        lcp: 2500, // 2.5s
        fid: 100, // 100ms
        cls: 0.1, // 0.1
        fcp: 1800, // 1.8s
        ttfb: 800, // 800ms
      },
    };
  }

  validate(metricsPath?: string): ValidationResult {
    const defaultMetricsPath = resolve(process.cwd(), 'performance-metrics.json');
    const path = metricsPath || defaultMetricsPath;

    let metrics: any = {};
    if (existsSync(path)) {
      try {
        const content = readFileSync(path, 'utf-8');
        metrics = JSON.parse(content);
      } catch (error) {
        console.warn(`Failed to load metrics from ${path}`);
      }
    }

    const violations: ValidationResult['violations'] = [];

    // Validate resource sizes
    if (metrics.resourceSizes) {
      Object.entries(this.budget.resourceSizes).forEach(([resource, budget]) => {
        const actual = metrics.resourceSizes[resource] || 0;
        if (actual > budget) {
          violations.push({
            resource: `${resource} size`,
            type: 'resource-size',
            actual,
            budget,
            severity: this.strict ? 'error' : 'warning',
          });
        }
      });
    }

    // Validate resource counts
    if (metrics.resourceCounts) {
      Object.entries(this.budget.resourceCounts).forEach(([resource, budget]) => {
        const actual = metrics.resourceCounts[resource] || 0;
        if (actual > budget) {
          violations.push({
            resource: `${resource} count`,
            type: 'resource-count',
            actual,
            budget,
            severity: 'warning',
          });
        }
      });
    }

    // Validate timing metrics
    if (metrics.timings) {
      Object.entries(this.budget.timings).forEach(([metric, budget]) => {
        const actual = metrics.timings[metric];
        if (actual !== undefined && actual > budget) {
          violations.push({
            resource: metric.toUpperCase(),
            type: 'timing',
            actual,
            budget,
            severity: actual > budget * 1.5 ? 'error' : 'warning',
          });
        }
      });
    }

    const errorViolations = violations.filter(v => v.severity === 'error').length;
    const warningViolations = violations.filter(v => v.severity === 'warning').length;

    return {
      passed: this.strict ? errorViolations === 0 : violations.length === 0,
      violations,
      summary: {
        totalViolations: violations.length,
        errorViolations,
        warningViolations,
      },
    };
  }

  generateReport(result: ValidationResult): string {
    const { passed, violations, summary } = result;
    
    let report = '\n=== Performance Budget Validation Report ===\n\n';
    
    if (passed) {
      report += '✅ All performance budgets are within limits!\n';
    } else {
      report += `❌ Performance budget validation failed\n`;
      report += `   Total violations: ${summary.totalViolations}\n`;
      report += `   Errors: ${summary.errorViolations}\n`;
      report += `   Warnings: ${summary.warningViolations}\n\n`;
      
      report += 'Violations:\n';
      violations.forEach(violation => {
        const icon = violation.severity === 'error' ? '🚨' : '⚠️';
        const percentage = ((violation.actual / violation.budget - 1) * 100).toFixed(1);
        report += `${icon} ${violation.resource}: ${violation.actual} (${percentage}% over budget of ${violation.budget})\n`;
      });
    }
    
    return report;
  }

  saveReport(result: ValidationResult, outputPath?: string): void {
    const defaultOutputPath = resolve(process.cwd(), 'performance-budget-report.json');
    const path = outputPath || defaultOutputPath;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      passed: result.passed,
      summary: result.summary,
      violations: result.violations,
      budget: this.budget,
    };
    
    writeFileSync(path, JSON.stringify(reportData, null, 2));
    console.log(`📊 Performance budget report saved to: ${path}`);
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const verbose = args.includes('--verbose');
  const budgetPath = args.find(arg => arg.endsWith('.json') && !arg.includes('report'));
  const outputPath = args.find(arg => arg.includes('report') && arg.endsWith('.json'));

  console.log('🔍 Validating performance budget...');
  
  const validator = new PerformanceBudgetValidator(budgetPath, strict);
  const result = validator.validate();
  
  if (verbose || !result.passed) {
    console.log(validator.generateReport(result));
  }
  
  if (outputPath) {
    validator.saveReport(result, outputPath);
  }
  
  if (!result.passed && strict) {
    console.error('❌ Performance budget validation failed in strict mode');
    process.exit(1);
  } else if (result.passed) {
    console.log('✅ Performance budget validation passed!');
  } else {
    console.log('⚠️ Performance budget validation completed with warnings');
  }
}