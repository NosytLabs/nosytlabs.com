#!/usr/bin/env node

/**
 * Comprehensive Performance Test Suite
 * Runs multiple performance tests and generates detailed reports
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class PerformanceTestSuite {
  constructor(options = {}) {
    this.options = {
      url: options.url || 'http://localhost:4321',
      runs: parseInt(options.runs) || 3,
      outputDir: options.outputDir || './performance-results',
      timeout: options.timeout || 30000,
      ...options
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.options.url,
      runs: [],
      summary: {},
      budget: null
    };
  }

  async runTests() {
    console.log(`🚀 Starting Performance Test Suite`);
    console.log(`📊 URL: ${this.options.url}`);
    console.log(`🔄 Runs: ${this.options.runs}`);
    console.log(`⏱️  Timeout: ${this.options.timeout}ms`);
    
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      for (let i = 0; i < this.options.runs; i++) {
        console.log(`\n📈 Run ${i + 1}/${this.options.runs}`);
        const runResult = await this.performSingleRun(browser, i + 1);
        this.results.runs.push(runResult);
        
        // Wait between runs to avoid throttling
        if (i < this.options.runs - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      await this.calculateSummary();
      await this.checkBudget();
      await this.generateReports();
      
    } finally {
      await browser.close();
    }

    return this.results;
  }

  async performSingleRun(browser, runNumber) {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    const runResult = {
      run: runNumber,
      timestamp: new Date().toISOString(),
      metrics: {},
      errors: [],
      resources: []
    };

    try {
      // Track network requests
      page.on('response', response => {
        runResult.resources.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0,
          type: response.request().resourceType()
        });
      });

      // Track console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          runResult.errors.push({
            type: 'console',
            message: msg.text(),
            timestamp: new Date().toISOString()
          });
        }
      });

      // Track page errors
      page.on('pageerror', error => {
        runResult.errors.push({
          type: 'page',
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });

      console.log(`  🌐 Loading ${this.options.url}...`);
      const startTime = Date.now();
      
      await page.goto(this.options.url, { 
        waitUntil: 'networkidle',
        timeout: this.options.timeout 
      });

      // Wait for page to be fully interactive
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Collect Core Web Vitals and performance metrics
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const metrics = {};
          
          // Performance timing
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            metrics.navigationTiming = {
              loadTime: navigation.loadEventEnd - navigation.navigationStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
              firstByte: navigation.responseStart - navigation.navigationStart,
              domInteractive: navigation.domInteractive - navigation.navigationStart,
              domComplete: navigation.domComplete - navigation.navigationStart
            };
          }

          // Resource timing
          const resources = performance.getEntriesByType('resource');
          metrics.resourceTiming = {
            totalResources: resources.length,
            totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            slowestResource: Math.max(...resources.map(r => r.duration))
          };

          // Memory usage (if available)
          if (performance.memory) {
            metrics.memory = {
              used: performance.memory.usedJSHeapSize,
              total: performance.memory.totalJSHeapSize,
              limit: performance.memory.jsHeapSizeLimit
            };
          }

          // Layout metrics
          metrics.layout = {
            layoutShifts: 0,
            largestShift: 0
          };

          // Try to get Web Vitals if available
          if (window.webVitals) {
            window.webVitals.getCLS(cls => metrics.cls = cls.value);
            window.webVitals.getFID(fid => metrics.fid = fid.value);
            window.webVitals.getFCP(fcp => metrics.fcp = fcp.value);
            window.webVitals.getLCP(lcp => metrics.lcp = lcp.value);
            window.webVitals.getTTFB(ttfb => metrics.ttfb = ttfb.value);
          }

          resolve(metrics);
        });
      });

      runResult.metrics = {
        ...metrics,
        totalLoadTime: Date.now() - startTime,
        resourceCount: runResult.resources.length,
        errorCount: runResult.errors.length
      };

      console.log(`  ✅ Run ${runNumber} completed in ${runResult.metrics.totalLoadTime}ms`);
      console.log(`     📦 Resources: ${runResult.metrics.resourceCount}`);
      console.log(`     ❌ Errors: ${runResult.metrics.errorCount}`);
      
      if (runResult.metrics.navigationTiming) {
        console.log(`     ⚡ TTFB: ${Math.round(runResult.metrics.navigationTiming.firstByte)}ms`);
        console.log(`     🎯 Load: ${Math.round(runResult.metrics.navigationTiming.loadTime)}ms`);
      }

    } catch (error) {
      console.error(`  ❌ Run ${runNumber} failed:`, error.message);
      runResult.errors.push({
        type: 'test',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    } finally {
      await context.close();
    }

    return runResult;
  }

  async calculateSummary() {
    const validRuns = this.results.runs.filter(run => 
      run.metrics && run.metrics.navigationTiming
    );

    if (validRuns.length === 0) {
      console.warn('⚠️  No valid runs to calculate summary');
      return;
    }

    const calculateStats = (values) => {
      const sorted = values.sort((a, b) => a - b);
      return {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.floor(sorted.length * 0.95)]
      };
    };

    this.results.summary = {
      validRuns: validRuns.length,
      totalRuns: this.results.runs.length,
      loadTime: calculateStats(validRuns.map(r => r.metrics.navigationTiming.loadTime)),
      firstByte: calculateStats(validRuns.map(r => r.metrics.navigationTiming.firstByte)),
      domContentLoaded: calculateStats(validRuns.map(r => r.metrics.navigationTiming.domContentLoaded)),
      resourceCount: calculateStats(validRuns.map(r => r.metrics.resourceCount)),
      errorCount: calculateStats(validRuns.map(r => r.metrics.errorCount)),
      totalErrors: this.results.runs.reduce((sum, run) => sum + run.errors.length, 0)
    };

    console.log('\n📊 Performance Summary:');
    console.log(`   Load Time: ${Math.round(this.results.summary.loadTime.avg)}ms (avg)`);
    console.log(`   TTFB: ${Math.round(this.results.summary.firstByte.avg)}ms (avg)`);
    console.log(`   Resources: ${Math.round(this.results.summary.resourceCount.avg)} (avg)`);
    console.log(`   Errors: ${this.results.summary.totalErrors} total`);
  }

  async checkBudget() {
    const budgetPath = path.join(process.cwd(), 'performance-budget.json');
    
    if (!fs.existsSync(budgetPath)) {
      console.log('⚠️  No performance budget found');
      return;
    }

    try {
      const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
      this.results.budget = {
        config: budget,
        violations: [],
        warnings: []
      };

      const summary = this.results.summary;
      
      // Check Core Web Vitals
      if (budget.coreWebVitals) {
        if (summary.loadTime && summary.loadTime.avg > budget.coreWebVitals.lcp.warning) {
          this.results.budget.violations.push({
            metric: 'Load Time',
            actual: Math.round(summary.loadTime.avg),
            threshold: budget.coreWebVitals.lcp.warning,
            severity: summary.loadTime.avg > budget.coreWebVitals.lcp.error ? 'error' : 'warning'
          });
        }

        if (summary.firstByte && summary.firstByte.avg > budget.coreWebVitals.ttfb.warning) {
          this.results.budget.violations.push({
            metric: 'TTFB',
            actual: Math.round(summary.firstByte.avg),
            threshold: budget.coreWebVitals.ttfb.warning,
            severity: summary.firstByte.avg > budget.coreWebVitals.ttfb.error ? 'error' : 'warning'
          });
        }
      }

      console.log(`\n💰 Budget Check: ${this.results.budget.violations.length} violations found`);
      
    } catch (error) {
      console.error('❌ Failed to check performance budget:', error.message);
    }
  }

  async generateReports() {
    // JSON Report
    const jsonPath = path.join(this.options.outputDir, 'performance-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 JSON report saved: ${jsonPath}`);

    // Markdown Report
    const mdPath = path.join(this.options.outputDir, 'performance-report.md');
    const markdown = this.generateMarkdownReport();
    fs.writeFileSync(mdPath, markdown);
    console.log(`📄 Markdown report saved: ${mdPath}`);

    // CSV Report
    const csvPath = path.join(this.options.outputDir, 'performance-data.csv');
    const csv = this.generateCSVReport();
    fs.writeFileSync(csvPath, csv);
    console.log(`📄 CSV report saved: ${csvPath}`);
  }

  generateMarkdownReport() {
    const { summary, budget } = this.results;
    
    let md = `# Performance Test Report\n\n`;
    md += `**URL:** ${this.results.url}\n`;
    md += `**Timestamp:** ${this.results.timestamp}\n`;
    md += `**Runs:** ${summary.validRuns}/${this.results.runs.length}\n\n`;

    md += `## Summary\n\n`;
    md += `| Metric | Min | Avg | Max | P95 |\n`;
    md += `|--------|-----|-----|-----|-----|\n`;
    md += `| Load Time | ${Math.round(summary.loadTime.min)}ms | ${Math.round(summary.loadTime.avg)}ms | ${Math.round(summary.loadTime.max)}ms | ${Math.round(summary.loadTime.p95)}ms |\n`;
    md += `| TTFB | ${Math.round(summary.firstByte.min)}ms | ${Math.round(summary.firstByte.avg)}ms | ${Math.round(summary.firstByte.max)}ms | ${Math.round(summary.firstByte.p95)}ms |\n`;
    md += `| DOM Content Loaded | ${Math.round(summary.domContentLoaded.min)}ms | ${Math.round(summary.domContentLoaded.avg)}ms | ${Math.round(summary.domContentLoaded.max)}ms | ${Math.round(summary.domContentLoaded.p95)}ms |\n`;
    md += `| Resources | ${summary.resourceCount.min} | ${Math.round(summary.resourceCount.avg)} | ${summary.resourceCount.max} | ${summary.resourceCount.p95} |\n\n`;

    if (budget && budget.violations.length > 0) {
      md += `## Budget Violations\n\n`;
      md += `| Metric | Actual | Threshold | Severity |\n`;
      md += `|--------|--------|-----------|----------|\n`;
      budget.violations.forEach(v => {
        const icon = v.severity === 'error' ? '❌' : '⚠️';
        md += `| ${icon} ${v.metric} | ${v.actual}ms | ${v.threshold}ms | ${v.severity} |\n`;
      });
      md += `\n`;
    }

    if (summary.totalErrors > 0) {
      md += `## Errors\n\n`;
      md += `Total errors found: **${summary.totalErrors}**\n\n`;
      
      this.results.runs.forEach((run, index) => {
        if (run.errors.length > 0) {
          md += `### Run ${index + 1}\n\n`;
          run.errors.forEach(error => {
            md += `- **${error.type}**: ${error.message}\n`;
          });
          md += `\n`;
        }
      });
    }

    return md;
  }

  generateCSVReport() {
    const headers = ['run', 'timestamp', 'loadTime', 'ttfb', 'domContentLoaded', 'resourceCount', 'errorCount'];
    let csv = headers.join(',') + '\n';
    
    this.results.runs.forEach(run => {
      if (run.metrics && run.metrics.navigationTiming) {
        const row = [
          run.run,
          run.timestamp,
          Math.round(run.metrics.navigationTiming.loadTime),
          Math.round(run.metrics.navigationTiming.firstByte),
          Math.round(run.metrics.navigationTiming.domContentLoaded),
          run.metrics.resourceCount,
          run.metrics.errorCount
        ];
        csv += row.join(',') + '\n';
      }
    });
    
    return csv;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }

  const suite = new PerformanceTestSuite(options);
  
  suite.runTests()
    .then(results => {
      console.log('\n🎉 Performance testing completed successfully!');
      
      // Exit with error code if budget violations found
      if (results.budget && results.budget.violations.some(v => v.severity === 'error')) {
        console.error('❌ Performance budget violations found!');
        process.exit(1);
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Performance testing failed:', error);
      process.exit(1);
    });
}

module.exports = PerformanceTestSuite;