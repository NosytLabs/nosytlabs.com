#!/usr/bin/env tsx
/**
 * Performance Budget Report Generator
 * Generates comprehensive performance budget reports in multiple formats
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { PerformanceBudgetValidator } from './validate-performance-budget';

interface ReportOptions {
  format: 'html' | 'json' | 'markdown';
  output: string;
  includeTrends: boolean;
  includeCharts: boolean;
}

class BudgetReportGenerator {
  private validator: PerformanceBudgetValidator;
  private options: ReportOptions;

  constructor(budgetPath: string, options: Partial<ReportOptions> = {}) {
    this.validator = new PerformanceBudgetValidator(budgetPath);
    this.options = {
      format: 'markdown',
      output: 'performance-budget-report.md',
      includeTrends: false,
      includeCharts: false,
      ...options,
    };
  }

  async generateReport(): Promise<void> {
    const result = await this.validator.validate();
    
    let content: string;
    
    switch (this.options.format) {
      case 'html':
        content = this.generateHtmlReport(result);
        break;
      case 'json':
        content = this.generateJsonReport(result);
        break;
      case 'markdown':
      default:
        content = this.generateMarkdownReport(result);
        break;
    }

    // Ensure output directory exists
    const outputDir = dirname(this.options.output);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(this.options.output, content, 'utf-8');
    console.log(`📊 Report generated: ${this.options.output}`);
  }

  private generateMarkdownReport(result: any): string {
    const lines: string[] = [];
    const timestamp = new Date().toISOString();
    
    lines.push('# Performance Budget Report');
    lines.push('');
    lines.push(`**Generated:** ${timestamp}`);
    lines.push(`**Status:** ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    lines.push('');

    // Executive Summary
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`- **Total Bundle Size:** ${Math.round(result.summary.totalSize / 1024)} KB`);
    lines.push(`- **Gzipped Size:** ${Math.round(result.summary.gzippedSize / 1024)} KB`);
    lines.push(`- **Compression Ratio:** ${Math.round((1 - result.summary.gzippedSize / result.summary.totalSize) * 100)}%`);
    lines.push(`- **Budget Violations:** ${result.violations.length}`);
    lines.push('');

    // Performance Score
    const score = this.calculatePerformanceScore(result);
    lines.push('## Performance Score');
    lines.push('');
    lines.push(`### ${score.grade} (${score.value}/100)`);
    lines.push('');
    lines.push(this.getScoreDescription(score.grade));
    lines.push('');

    // Budget Violations
    if (result.violations.length > 0) {
      lines.push('## 🚨 Budget Violations');
      lines.push('');
      
      const errors = result.violations.filter((v: any) => v.severity === 'error');
      const warnings = result.violations.filter((v: any) => v.severity === 'warning');
      
      if (errors.length > 0) {
        lines.push('### Critical Issues');
        lines.push('');
        errors.forEach((violation: any) => {
          lines.push(`- 🚨 **${violation.resource}** ${violation.type}: ${violation.actual}${violation.type === 'size' ? ' KB' : ''} (budget: ${violation.budget}${violation.type === 'size' ? ' KB' : ''})`);
        });
        lines.push('');
      }
      
      if (warnings.length > 0) {
        lines.push('### Warnings');
        lines.push('');
        warnings.forEach((violation: any) => {
          lines.push(`- ⚠️ **${violation.resource}** ${violation.type}: ${violation.actual}${violation.type === 'size' ? ' KB' : ''} (budget: ${violation.budget}${violation.type === 'size' ? ' KB' : ''})`);
        });
        lines.push('');
      }
    } else {
      lines.push('## ✅ All Budget Checks Passed');
      lines.push('');
      lines.push('Congratulations! Your application meets all performance budget requirements.');
      lines.push('');
    }

    // Resource Breakdown
    lines.push('## Resource Breakdown');
    lines.push('');
    lines.push('| Resource Type | Count | Size (KB) | Gzipped (KB) |');
    lines.push('|---------------|-------|-----------|--------------|');
    
    Object.entries(result.summary.resourceCounts).forEach(([type, count]) => {
      const typeData = result.byType?.[type] || { size: 0, gzippedSize: 0 };
      lines.push(`| ${type} | ${count} | ${Math.round(typeData.size / 1024)} | ${Math.round(typeData.gzippedSize / 1024)} |`);
    });
    lines.push('');

    // Recommendations
    lines.push('## 🎯 Optimization Recommendations');
    lines.push('');
    const recommendations = this.generateRecommendations(result);
    recommendations.forEach(rec => {
      lines.push(`- ${rec}`);
    });
    lines.push('');

    // Trends (if enabled)
    if (this.options.includeTrends) {
      lines.push('## 📈 Performance Trends');
      lines.push('');
      lines.push('*Trend analysis requires historical data - feature coming soon*');
      lines.push('');
    }

    return lines.join('\n');
  }

  private generateHtmlReport(result: any): string {
    const timestamp = new Date().toISOString();
    const score = this.calculatePerformanceScore(result);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Budget Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 48px; font-weight: bold; margin: 20px 0; }
        .score.A { color: #22c55e; }
        .score.B { color: #84cc16; }
        .score.C { color: #eab308; }
        .score.D { color: #f97316; }
        .score.F { color: #ef4444; }
        .status { padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .status.passed { background: #dcfce7; color: #166534; }
        .status.failed { background: #fecaca; color: #991b1b; }
        .metric { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .violation { padding: 15px; margin: 10px 0; border-radius: 6px; }
        .violation.error { background: #fef2f2; border-left: 4px solid #ef4444; }
        .violation.warning { background: #fffbeb; border-left: 4px solid #f59e0b; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .recommendations { background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Performance Budget Report</h1>
            <p>Generated: ${timestamp}</p>
            <div class="status ${result.passed ? 'passed' : 'failed'}">
                ${result.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>
        </div>
        
        <div class="score-section">
            <h2>Performance Score</h2>
            <div class="score ${score.grade}">${score.grade} (${score.value}/100)</div>
            <p>${this.getScoreDescription(score.grade)}</p>
        </div>
        
        <div class="metrics">
            <h2>Bundle Metrics</h2>
            <div class="metric">
                <span>Total Bundle Size</span>
                <strong>${Math.round(result.summary.totalSize / 1024)} KB</strong>
            </div>
            <div class="metric">
                <span>Gzipped Size</span>
                <strong>${Math.round(result.summary.gzippedSize / 1024)} KB</strong>
            </div>
            <div class="metric">
                <span>Compression Ratio</span>
                <strong>${Math.round((1 - result.summary.gzippedSize / result.summary.totalSize) * 100)}%</strong>
            </div>
        </div>
        
        ${result.violations.length > 0 ? `
        <div class="violations">
            <h2>Budget Violations</h2>
            ${result.violations.map((v: any) => `
            <div class="violation ${v.severity}">
                <strong>${v.severity === 'error' ? '🚨' : '⚠️'} ${v.resource}</strong>
                <p>${v.type}: ${v.actual}${v.type === 'size' ? ' KB' : ''} (budget: ${v.budget}${v.type === 'size' ? ' KB' : ''})</p>
            </div>
            `).join('')}
        </div>
        ` : '<div><h2>✅ All Budget Checks Passed</h2></div>'}
        
        <div class="resources">
            <h2>Resource Breakdown</h2>
            <table>
                <thead>
                    <tr>
                        <th>Resource Type</th>
                        <th>Count</th>
                        <th>Size (KB)</th>
                        <th>Gzipped (KB)</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(result.summary.resourceCounts).map(([type, count]) => {
                      const typeData = result.byType?.[type] || { size: 0, gzippedSize: 0 };
                      return `<tr>
                        <td>${type}</td>
                        <td>${count}</td>
                        <td>${Math.round(typeData.size / 1024)}</td>
                        <td>${Math.round(typeData.gzippedSize / 1024)}</td>
                      </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="recommendations">
            <h2>🎯 Optimization Recommendations</h2>
            <ul>
                ${this.generateRecommendations(result).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;
  }

  private generateJsonReport(result: any): string {
    const report = {
      timestamp: new Date().toISOString(),
      score: this.calculatePerformanceScore(result),
      summary: result.summary,
      violations: result.violations,
      recommendations: this.generateRecommendations(result),
      passed: result.passed,
    };
    
    return JSON.stringify(report, null, 2);
  }

  private calculatePerformanceScore(result: any): { value: number; grade: string } {
    let score = 100;
    
    // Deduct points for violations
    result.violations.forEach((violation: any) => {
      const deduction = violation.severity === 'error' ? 15 : 5;
      score -= deduction;
    });
    
    // Deduct points for large bundle size
    const totalSizeKB = result.summary.totalSize / 1024;
    if (totalSizeKB > 1000) {
      score -= Math.min(20, (totalSizeKB - 1000) / 100);
    }
    
    score = Math.max(0, Math.round(score));
    
    let grade: string;
    if (score >= 90) grade = 'A';
    else if (score >= 80) grade = 'B';
    else if (score >= 70) grade = 'C';
    else if (score >= 60) grade = 'D';
    else grade = 'F';
    
    return { value: score, grade };
  }

  private getScoreDescription(grade: string): string {
    const descriptions = {
      A: 'Excellent! Your application has outstanding performance characteristics.',
      B: 'Good performance with minor optimization opportunities.',
      C: 'Acceptable performance but could benefit from optimization.',
      D: 'Below average performance. Optimization recommended.',
      F: 'Poor performance. Immediate optimization required.',
    };
    
    return descriptions[grade as keyof typeof descriptions] || 'Performance assessment unavailable.';
  }

  private generateRecommendations(result: any): string[] {
    const recommendations: string[] = [];
    
    // Bundle size recommendations
    const totalSizeKB = result.summary.totalSize / 1024;
    if (totalSizeKB > 1000) {
      recommendations.push('Consider code splitting to reduce initial bundle size');
      recommendations.push('Implement lazy loading for non-critical components');
    }
    
    // Compression recommendations
    const compressionRatio = 1 - (result.summary.gzippedSize / result.summary.totalSize);
    if (compressionRatio < 0.7) {
      recommendations.push('Enable better compression (Brotli) on your server');
    }
    
    // Resource-specific recommendations
    Object.entries(result.summary.resourceCounts).forEach(([type, count]) => {
      if (type === 'image' && (count as number) > 20) {
        recommendations.push('Optimize images: use WebP format and appropriate sizing');
      }
      if (type === 'script' && (count as number) > 10) {
        recommendations.push('Consider bundling JavaScript files to reduce HTTP requests');
      }
    });
    
    // Violation-based recommendations
    result.violations.forEach((violation: any) => {
      if (violation.resource === 'script' && violation.type === 'size') {
        recommendations.push('Minify and tree-shake JavaScript bundles');
      }
      if (violation.resource === 'stylesheet' && violation.type === 'size') {
        recommendations.push('Remove unused CSS and consider critical CSS extraction');
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('Great job! Your application is well-optimized.');
      recommendations.push('Continue monitoring performance as your application grows.');
    }
    
    return recommendations;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  let format: 'html' | 'json' | 'markdown' = 'markdown';
  let output = 'performance-budget-report.md';
  let includeTrends = false;
  let budgetFile = 'reports/performance-budget.json';
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--format' && args[i + 1]) {
      format = args[i + 1] as 'html' | 'json' | 'markdown';
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      output = args[i + 1];
      i++;
    } else if (args[i] === '--include-trends') {
      includeTrends = true;
    } else if (!args[i].startsWith('--')) {
      budgetFile = args[i];
    }
  }
  
  try {
    const generator = new BudgetReportGenerator(budgetFile, {
      format,
      output,
      includeTrends,
    });
    
    await generator.generateReport();
    console.log(`✅ Performance budget report generated successfully`);
    
  } catch (error) {
    console.error('❌ Failed to generate performance budget report:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { BudgetReportGenerator };