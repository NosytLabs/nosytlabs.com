#!/usr/bin/env node

/**
 * Performance Budget Validation Script
 * Validates performance metrics against defined budgets in CI/CD pipeline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PerformanceBudgetValidator {
  constructor(budgetPath, reportPath) {
    this.budgetPath = budgetPath;
    this.reportPath = reportPath;
    this.budget = null;
    this.report = null;
    this.violations = [];
    this.warnings = [];
  }

  async loadBudget() {
    try {
      const budgetContent = fs.readFileSync(this.budgetPath, 'utf8');
      this.budget = JSON.parse(budgetContent);
      console.log('✅ Performance budget loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load performance budget:', error.message);
      process.exit(1);
    }
  }

  async loadReport() {
    try {
      if (!fs.existsSync(this.reportPath)) {
        console.warn('⚠️  Performance report not found, skipping validation');
        return false;
      }
      
      const reportContent = fs.readFileSync(this.reportPath, 'utf8');
      this.report = JSON.parse(reportContent);
      console.log('✅ Performance report loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to load performance report:', error.message);
      return false;
    }
  }

  validateCoreWebVitals() {
    if (!this.report.coreWebVitals) return;

    const vitals = this.budget.budgets.coreWebVitals;
    const reportVitals = this.report.coreWebVitals;

    Object.entries(vitals).forEach(([metric, thresholds]) => {
      const value = reportVitals[metric];
      if (value === undefined) return;

      if (value > thresholds.needsImprovement) {
        this.violations.push({
          type: 'coreWebVitals',
          metric,
          value,
          threshold: thresholds.needsImprovement,
          severity: 'error',
          description: thresholds.description,
          unit: thresholds.unit
        });
      } else if (value > thresholds.good) {
        this.warnings.push({
          type: 'coreWebVitals',
          metric,
          value,
          threshold: thresholds.good,
          severity: 'warning',
          description: thresholds.description,
          unit: thresholds.unit
        });
      }
    });
  }

  validateResourceBudgets() {
    if (!this.report.resourceBudgets) return;

    const budgets = this.budget.budgets.resourceBudgets;
    const reportBudgets = this.report.resourceBudgets;

    Object.entries(budgets).forEach(([resource, thresholds]) => {
      const value = reportBudgets[resource];
      if (value === undefined) return;

      if (value > thresholds.error) {
        this.violations.push({
          type: 'resourceBudgets',
          metric: resource,
          value,
          threshold: thresholds.error,
          severity: 'error',
          description: thresholds.description,
          unit: thresholds.unit
        });
      } else if (value > thresholds.warning) {
        this.warnings.push({
          type: 'resourceBudgets',
          metric: resource,
          value,
          threshold: thresholds.warning,
          severity: 'warning',
          description: thresholds.description,
          unit: thresholds.unit
        });
      }
    });
  }

  validateNetworkBudgets() {
    if (!this.report.networkBudgets) return;

    const budgets = this.budget.budgets.networkBudgets;
    const reportBudgets = this.report.networkBudgets;

    Object.entries(budgets).forEach(([metric, thresholds]) => {
      const value = reportBudgets[metric];
      if (value === undefined) return;

      if (value > thresholds.error) {
        this.violations.push({
          type: 'networkBudgets',
          metric,
          value,
          threshold: thresholds.error,
          severity: 'error',
          description: thresholds.description,
          unit: thresholds.unit
        });
      } else if (value > thresholds.warning) {
        this.warnings.push({
          type: 'networkBudgets',
          metric,
          value,
          threshold: thresholds.warning,
          severity: 'warning',
          description: thresholds.description,
          unit: thresholds.unit
        });
      }
    });
  }

  validateCustomMetrics() {
    if (!this.report.customMetrics) return;

    const metrics = this.budget.budgets.customMetrics;
    const reportMetrics = this.report.customMetrics;

    Object.entries(metrics).forEach(([metric, thresholds]) => {
      const value = reportMetrics[metric];
      if (value === undefined) return;

      if (value > thresholds.needsImprovement) {
        this.violations.push({
          type: 'customMetrics',
          metric,
          value,
          threshold: thresholds.needsImprovement,
          severity: 'error',
          description: thresholds.description,
          unit: thresholds.unit
        });
      } else if (value > thresholds.good) {
        this.warnings.push({
          type: 'customMetrics',
          metric,
          value,
          threshold: thresholds.good,
          severity: 'warning',
          description: thresholds.description,
          unit: thresholds.unit
        });
      }
    });
  }

  generateReport() {
    const totalIssues = this.violations.length + this.warnings.length;
    
    console.log('\n📊 Performance Budget Validation Report');
    console.log('=' .repeat(50));
    
    if (totalIssues === 0) {
      console.log('✅ All performance budgets are within acceptable limits!');
      return;
    }

    if (this.violations.length > 0) {
      console.log('\n❌ Budget Violations (Errors):');
      this.violations.forEach(violation => {
        console.log(`  • ${violation.metric}: ${violation.value}${violation.unit} > ${violation.threshold}${violation.unit}`);
        console.log(`    ${violation.description}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  Budget Warnings:');
      this.warnings.forEach(warning => {
        console.log(`  • ${warning.metric}: ${warning.value}${warning.unit} > ${warning.threshold}${warning.unit}`);
        console.log(`    ${warning.description}`);
      });
    }

    console.log(`\n📈 Summary: ${this.violations.length} violations, ${this.warnings.length} warnings`);
  }

  saveValidationReport() {
    const validationReport = {
      timestamp: new Date().toISOString(),
      violations: this.violations,
      warnings: this.warnings,
      summary: {
        totalViolations: this.violations.length,
        totalWarnings: this.warnings.length,
        passed: this.violations.length === 0
      }
    };

    const outputPath = path.join(__dirname, '..', 'performance-budget-validation.json');
    fs.writeFileSync(outputPath, JSON.stringify(validationReport, null, 2));
    console.log(`\n💾 Validation report saved to: ${outputPath}`);
  }

  async validate() {
    console.log('🚀 Starting performance budget validation...');
    
    await this.loadBudget();
    const hasReport = await this.loadReport();
    
    if (!hasReport) {
      console.log('⏭️  Skipping validation - no performance report available');
      return 0;
    }

    this.validateCoreWebVitals();
    this.validateResourceBudgets();
    this.validateNetworkBudgets();
    this.validateCustomMetrics();

    this.generateReport();
    this.saveValidationReport();

    // Exit with error code if there are violations and failOnBudgetExceeded is true
    if (this.budget.cicd.failOnBudgetExceeded && this.violations.length > 0) {
      console.log('\n💥 Exiting with error code due to budget violations');
      return 1;
    }

    // Exit with warning code if there are warnings and warningOnBudgetExceeded is true
    if (this.budget.cicd.warningOnBudgetExceeded && this.warnings.length > 0) {
      console.log('\n⚠️  Exiting with warning code due to budget warnings');
      return 2;
    }

    console.log('\n✅ Performance budget validation completed successfully');
    return 0;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const budgetPath = process.argv[2] || path.join(__dirname, '..', 'performance-budget.json');
  const reportPath = process.argv[3] || path.join(__dirname, '..', 'performance-report.json');

  const validator = new PerformanceBudgetValidator(budgetPath, reportPath);
  
  validator.validate()
    .then(exitCode => {
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('❌ Validation failed:', error.message);
      process.exit(1);
    });
}

export { PerformanceBudgetValidator };