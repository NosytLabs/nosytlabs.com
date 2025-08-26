import performanceBudget from '../../performance-budget.json';

export interface BudgetViolation {
  metric: string;
  category: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'error';
  description: string;
  unit: string;
  priority: string;
}

export interface BudgetCheckResult {
  passed: boolean;
  violations: BudgetViolation[];
  score: number;
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
  };
}

export class PerformanceBudgetValidator {
  private budget = performanceBudget.budgets;

  /**
   * Check Core Web Vitals against budget thresholds
   */
  checkCoreWebVitals(metrics: Record<string, number>): BudgetCheckResult {
    const violations: BudgetViolation[] = [];
    const coreWebVitals = this.budget.coreWebVitals;

    Object.entries(metrics).forEach(([metric, value]) => {
      const budget = coreWebVitals[metric as keyof typeof coreWebVitals];
      if (!budget) return;

      if (value > budget.needsImprovement) {
        violations.push({
          metric,
          category: 'coreWebVitals',
          value,
          threshold: budget.needsImprovement,
          severity: 'error',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      } else if (value > budget.good) {
        violations.push({
          metric,
          category: 'coreWebVitals',
          value,
          threshold: budget.good,
          severity: 'warning',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      }
    });

    return this.createResult(violations, Object.keys(metrics).length);
  }

  /**
   * Check resource budgets (bundle sizes, etc.)
   */
  checkResourceBudgets(resources: Record<string, number>): BudgetCheckResult {
    const violations: BudgetViolation[] = [];
    const resourceBudgets = this.budget.resourceBudgets;

    Object.entries(resources).forEach(([resource, size]) => {
      const budget = resourceBudgets[resource as keyof typeof resourceBudgets];
      if (!budget) return;

      if (size > budget.error) {
        violations.push({
          metric: resource,
          category: 'resourceBudgets',
          value: size,
          threshold: budget.error,
          severity: 'error',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      } else if (size > budget.warning) {
        violations.push({
          metric: resource,
          category: 'resourceBudgets',
          value: size,
          threshold: budget.warning,
          severity: 'warning',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      }
    });

    return this.createResult(violations, Object.keys(resources).length);
  }

  /**
   * Check network budgets (request counts, etc.)
   */
  checkNetworkBudgets(network: Record<string, number>): BudgetCheckResult {
    const violations: BudgetViolation[] = [];
    const networkBudgets = this.budget.networkBudgets;

    Object.entries(network).forEach(([metric, count]) => {
      const budget = networkBudgets[metric as keyof typeof networkBudgets];
      if (!budget) return;

      if (count > budget.error) {
        violations.push({
          metric,
          category: 'networkBudgets',
          value: count,
          threshold: budget.error,
          severity: 'error',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      } else if (count > budget.warning) {
        violations.push({
          metric,
          category: 'networkBudgets',
          value: count,
          threshold: budget.warning,
          severity: 'warning',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      }
    });

    return this.createResult(violations, Object.keys(network).length);
  }

  /**
   * Check custom metrics against budget thresholds
   */
  checkCustomMetrics(metrics: Record<string, number>): BudgetCheckResult {
    const violations: BudgetViolation[] = [];
    const customMetrics = this.budget.customMetrics;

    Object.entries(metrics).forEach(([metric, value]) => {
      const budget = customMetrics[metric as keyof typeof customMetrics];
      if (!budget) return;

      if (value > budget.needsImprovement) {
        violations.push({
          metric,
          category: 'customMetrics',
          value,
          threshold: budget.needsImprovement,
          severity: 'error',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      } else if (value > budget.good) {
        violations.push({
          metric,
          category: 'customMetrics',
          value,
          threshold: budget.good,
          severity: 'warning',
          description: budget.description,
          unit: budget.unit,
          priority: budget.priority
        });
      }
    });

    return this.createResult(violations, Object.keys(metrics).length);
  }

  /**
   * Comprehensive budget check across all categories
   */
  checkAllBudgets(data: {
    coreWebVitals?: Record<string, number>;
    resources?: Record<string, number>;
    network?: Record<string, number>;
    custom?: Record<string, number>;
  }): BudgetCheckResult {
    const allViolations: BudgetViolation[] = [];
    let totalMetrics = 0;

    if (data.coreWebVitals) {
      const result = this.checkCoreWebVitals(data.coreWebVitals);
      allViolations.push(...result.violations);
      totalMetrics += Object.keys(data.coreWebVitals).length;
    }

    if (data.resources) {
      const result = this.checkResourceBudgets(data.resources);
      allViolations.push(...result.violations);
      totalMetrics += Object.keys(data.resources).length;
    }

    if (data.network) {
      const result = this.checkNetworkBudgets(data.network);
      allViolations.push(...result.violations);
      totalMetrics += Object.keys(data.network).length;
    }

    if (data.custom) {
      const result = this.checkCustomMetrics(data.custom);
      allViolations.push(...result.violations);
      totalMetrics += Object.keys(data.custom).length;
    }

    return this.createResult(allViolations, totalMetrics);
  }

  /**
   * Get budget configuration for a specific metric
   */
  getBudgetForMetric(category: string, metric: string) {
    const categoryBudgets = this.budget[category as keyof typeof this.budget];
    if (!categoryBudgets) return null;
    
    return categoryBudgets[metric as keyof typeof categoryBudgets] || null;
  }

  /**
   * Get all budget thresholds
   */
  getAllBudgets() {
    return this.budget;
  }

  /**
   * Format violation for display
   */
  formatViolation(violation: BudgetViolation): string {
    const formattedValue = this.formatValue(violation.value, violation.unit);
    const formattedThreshold = this.formatValue(violation.threshold, violation.unit);
    
    return `${violation.severity.toUpperCase()}: ${violation.metric} (${formattedValue}) exceeds ${violation.severity} threshold (${formattedThreshold})`;
  }

  /**
   * Generate performance report
   */
  generateReport(result: BudgetCheckResult): string {
    const lines = [
      '=== Performance Budget Report ===',
      `Overall Status: ${result.passed ? 'PASSED' : 'FAILED'}`,
      `Score: ${result.score}%`,
      '',
      `Summary:`,
      `  Total Metrics: ${result.summary.total}`,
      `  Passed: ${result.summary.passed}`,
      `  Warnings: ${result.summary.warnings}`,
      `  Errors: ${result.summary.errors}`,
      ''
    ];

    if (result.violations.length > 0) {
      lines.push('Violations:');
      result.violations
        .sort((a, b) => {
          // Sort by severity (errors first), then by priority
          if (a.severity !== b.severity) {
            return a.severity === 'error' ? -1 : 1;
          }
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        })
        .forEach(violation => {
          lines.push(`  - ${this.formatViolation(violation)}`);
        });
    } else {
      lines.push('No violations found! 🎉');
    }

    return lines.join('\n');
  }

  private createResult(violations: BudgetViolation[], totalMetrics: number): BudgetCheckResult {
    const warnings = violations.filter(v => v.severity === 'warning').length;
    const errors = violations.filter(v => v.severity === 'error').length;
    const passed = totalMetrics - violations.length;
    
    return {
      passed: errors === 0,
      violations,
      score: totalMetrics > 0 ? Math.round((passed / totalMetrics) * 100) : 100,
      summary: {
        total: totalMetrics,
        passed,
        warnings,
        errors
      }
    };
  }

  private formatValue(value: number, unit: string): string {
    switch (unit) {
      case 'ms':
        return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${Math.round(value)}ms`;
      case 'bytes':
        if (value >= 1024 * 1024) {
          return `${(value / (1024 * 1024)).toFixed(2)}MB`;
        } else if (value >= 1024) {
          return `${(value / 1024).toFixed(2)}KB`;
        }
        return `${value}B`;
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'score':
        return value.toFixed(3);
      case 'count':
        return value.toString();
      default:
        return value.toString();
    }
  }
}

// Export singleton instance
export const performanceBudgetValidator = new PerformanceBudgetValidator();

// Export utility functions
export const checkPerformanceBudget = (data: Parameters<PerformanceBudgetValidator['checkAllBudgets']>[0]) => {
  return performanceBudgetValidator.checkAllBudgets(data);
};

export const generatePerformanceReport = (result: BudgetCheckResult) => {
  return performanceBudgetValidator.generateReport(result);
};