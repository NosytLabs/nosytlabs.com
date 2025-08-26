#!/usr/bin/env node

/**
 * Load Testing Script
 * Tests application performance under various load conditions
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class LoadTester {
  constructor(options = {}) {
    this.options = {
      url: options.url || 'http://localhost:4321',
      concurrent: parseInt(options.concurrent) || 5,
      duration: parseInt(options.duration) || 60, // seconds
      rampUp: parseInt(options.rampUp) || 10, // seconds
      outputDir: options.outputDir || './load-test-results',
      scenarios: options.scenarios || ['light', 'moderate', 'heavy'],
      ...options
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      url: this.options.url,
      scenarios: [],
      summary: {}
    };
    
    this.scenarios = {
      light: { concurrent: 2, duration: 30, rampUp: 5 },
      moderate: { concurrent: 5, duration: 60, rampUp: 10 },
      heavy: { concurrent: 10, duration: 90, rampUp: 15 },
      stress: { concurrent: 20, duration: 120, rampUp: 20 }
    };
  }

  async runLoadTests() {
    console.log(`🚀 Starting Load Testing Suite`);
    console.log(`📊 URL: ${this.options.url}`);
    console.log(`🎯 Scenarios: ${this.options.scenarios.join(', ')}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    for (const scenarioName of this.options.scenarios) {
      if (!this.scenarios[scenarioName]) {
        console.warn(`⚠️  Unknown scenario: ${scenarioName}`);
        continue;
      }
      
      console.log(`\n🎬 Running ${scenarioName} load scenario...`);
      const scenarioResult = await this.runScenario(scenarioName, this.scenarios[scenarioName]);
      this.results.scenarios.push(scenarioResult);
      
      // Cool down between scenarios
      if (this.options.scenarios.indexOf(scenarioName) < this.options.scenarios.length - 1) {
        console.log('😴 Cooling down for 10 seconds...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    await this.calculateSummary();
    await this.generateReports();
    
    return this.results;
  }

  async runScenario(name, config) {
    const scenario = {
      name,
      config,
      startTime: new Date().toISOString(),
      sessions: [],
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        requestsPerSecond: 0,
        errors: []
      }
    };

    console.log(`  👥 Concurrent users: ${config.concurrent}`);
    console.log(`  ⏱️  Duration: ${config.duration}s`);
    console.log(`  📈 Ramp-up: ${config.rampUp}s`);

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const sessions = [];
      const startTime = Date.now();
      const endTime = startTime + (config.duration * 1000);
      
      // Ramp up users gradually
      const rampUpInterval = (config.rampUp * 1000) / config.concurrent;
      
      for (let i = 0; i < config.concurrent; i++) {
        setTimeout(async () => {
          const session = await this.createUserSession(browser, i + 1, endTime, scenario);
          sessions.push(session);
        }, i * rampUpInterval);
      }

      // Wait for all sessions to complete
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (Date.now() >= endTime + 5000) { // 5s grace period
            clearInterval(checkInterval);
            resolve();
          }
        }, 1000);
      });

      // Wait for all sessions to finish
      await Promise.allSettled(sessions);
      
      scenario.endTime = new Date().toISOString();
      scenario.actualDuration = (Date.now() - startTime) / 1000;
      
      this.calculateScenarioMetrics(scenario);
      
    } finally {
      await browser.close();
    }

    return scenario;
  }

  async createUserSession(browser, userId, endTime, scenario) {
    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      userAgent: `LoadTest-User-${userId}`
    });
    
    const page = await context.newPage();
    const session = {
      userId,
      startTime: Date.now(),
      requests: [],
      errors: []
    };

    try {
      while (Date.now() < endTime) {
        const requestStart = Date.now();
        
        try {
          await page.goto(this.options.url, { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
          });
          
          const responseTime = Date.now() - requestStart;
          
          session.requests.push({
            timestamp: new Date().toISOString(),
            responseTime,
            success: true,
            url: this.options.url
          });
          
          scenario.metrics.totalRequests++;
          scenario.metrics.successfulRequests++;
          scenario.metrics.minResponseTime = Math.min(scenario.metrics.minResponseTime, responseTime);
          scenario.metrics.maxResponseTime = Math.max(scenario.metrics.maxResponseTime, responseTime);
          
          // Simulate user behavior - random think time
          const thinkTime = Math.random() * 2000 + 1000; // 1-3 seconds
          await new Promise(resolve => setTimeout(resolve, thinkTime));
          
        } catch (error) {
          const responseTime = Date.now() - requestStart;
          
          session.errors.push({
            timestamp: new Date().toISOString(),
            error: error.message,
            responseTime
          });
          
          scenario.metrics.totalRequests++;
          scenario.metrics.failedRequests++;
          scenario.metrics.errors.push({
            userId,
            timestamp: new Date().toISOString(),
            error: error.message
          });
          
          console.log(`  ❌ User ${userId} error: ${error.message}`);
        }
      }
      
    } finally {
      session.endTime = Date.now();
      session.duration = (session.endTime - session.startTime) / 1000;
      scenario.sessions.push(session);
      await context.close();
    }

    return session;
  }

  calculateScenarioMetrics(scenario) {
    const { metrics, sessions } = scenario;
    
    if (metrics.totalRequests === 0) {
      console.log(`  ⚠️  No requests completed for ${scenario.name}`);
      return;
    }

    // Calculate average response time
    const totalResponseTime = sessions.reduce((sum, session) => {
      return sum + session.requests.reduce((reqSum, req) => reqSum + req.responseTime, 0);
    }, 0);
    
    metrics.averageResponseTime = totalResponseTime / metrics.successfulRequests || 0;
    metrics.requestsPerSecond = metrics.totalRequests / scenario.actualDuration;
    metrics.successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
    
    if (metrics.minResponseTime === Infinity) {
      metrics.minResponseTime = 0;
    }

    console.log(`  📊 Results for ${scenario.name}:`);
    console.log(`     Total Requests: ${metrics.totalRequests}`);
    console.log(`     Success Rate: ${metrics.successRate.toFixed(1)}%`);
    console.log(`     Avg Response Time: ${Math.round(metrics.averageResponseTime)}ms`);
    console.log(`     Min/Max Response Time: ${Math.round(metrics.minResponseTime)}ms / ${Math.round(metrics.maxResponseTime)}ms`);
    console.log(`     Requests/Second: ${metrics.requestsPerSecond.toFixed(2)}`);
    console.log(`     Errors: ${metrics.errors.length}`);
  }

  async calculateSummary() {
    const allMetrics = this.results.scenarios.map(s => s.metrics);
    
    this.results.summary = {
      totalScenarios: this.results.scenarios.length,
      totalRequests: allMetrics.reduce((sum, m) => sum + m.totalRequests, 0),
      totalSuccessful: allMetrics.reduce((sum, m) => sum + m.successfulRequests, 0),
      totalFailed: allMetrics.reduce((sum, m) => sum + m.failedRequests, 0),
      overallSuccessRate: 0,
      averageResponseTime: 0,
      maxRequestsPerSecond: Math.max(...allMetrics.map(m => m.requestsPerSecond)),
      totalErrors: allMetrics.reduce((sum, m) => sum + m.errors.length, 0)
    };
    
    if (this.results.summary.totalRequests > 0) {
      this.results.summary.overallSuccessRate = 
        (this.results.summary.totalSuccessful / this.results.summary.totalRequests) * 100;
      
      this.results.summary.averageResponseTime = 
        allMetrics.reduce((sum, m) => sum + (m.averageResponseTime * m.successfulRequests), 0) / 
        this.results.summary.totalSuccessful;
    }

    console.log('\n📊 Load Test Summary:');
    console.log(`   Total Requests: ${this.results.summary.totalRequests}`);
    console.log(`   Overall Success Rate: ${this.results.summary.overallSuccessRate.toFixed(1)}%`);
    console.log(`   Average Response Time: ${Math.round(this.results.summary.averageResponseTime)}ms`);
    console.log(`   Peak RPS: ${this.results.summary.maxRequestsPerSecond.toFixed(2)}`);
    console.log(`   Total Errors: ${this.results.summary.totalErrors}`);
  }

  async generateReports() {
    // JSON Report
    const jsonPath = path.join(this.options.outputDir, 'load-test-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 JSON report saved: ${jsonPath}`);

    // Markdown Report
    const mdPath = path.join(this.options.outputDir, 'load-test-report.md');
    const markdown = this.generateMarkdownReport();
    fs.writeFileSync(mdPath, markdown);
    console.log(`📄 Markdown report saved: ${mdPath}`);

    // CSV Report
    const csvPath = path.join(this.options.outputDir, 'load-test-data.csv');
    const csv = this.generateCSVReport();
    fs.writeFileSync(csvPath, csv);
    console.log(`📄 CSV report saved: ${csvPath}`);
  }

  generateMarkdownReport() {
    let md = `# Load Test Report\n\n`;
    md += `**URL:** ${this.results.url}\n`;
    md += `**Timestamp:** ${this.results.timestamp}\n`;
    md += `**Scenarios:** ${this.results.scenarios.map(s => s.name).join(', ')}\n\n`;

    md += `## Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Requests | ${this.results.summary.totalRequests} |\n`;
    md += `| Success Rate | ${this.results.summary.overallSuccessRate.toFixed(1)}% |\n`;
    md += `| Average Response Time | ${Math.round(this.results.summary.averageResponseTime)}ms |\n`;
    md += `| Peak RPS | ${this.results.summary.maxRequestsPerSecond.toFixed(2)} |\n`;
    md += `| Total Errors | ${this.results.summary.totalErrors} |\n\n`;

    md += `## Scenario Results\n\n`;
    md += `| Scenario | Concurrent Users | Duration | Requests | Success Rate | Avg Response Time | RPS | Errors |\n`;
    md += `|----------|------------------|----------|----------|--------------|-------------------|-----|--------|\n`;
    
    this.results.scenarios.forEach(scenario => {
      const m = scenario.metrics;
      md += `| ${scenario.name} | ${scenario.config.concurrent} | ${scenario.config.duration}s | ${m.totalRequests} | ${m.successRate.toFixed(1)}% | ${Math.round(m.averageResponseTime)}ms | ${m.requestsPerSecond.toFixed(2)} | ${m.errors.length} |\n`;
    });
    
    md += `\n`;

    // Error details
    if (this.results.summary.totalErrors > 0) {
      md += `## Error Details\n\n`;
      
      this.results.scenarios.forEach(scenario => {
        if (scenario.metrics.errors.length > 0) {
          md += `### ${scenario.name} Errors\n\n`;
          scenario.metrics.errors.forEach(error => {
            md += `- **User ${error.userId}** (${error.timestamp}): ${error.error}\n`;
          });
          md += `\n`;
        }
      });
    }

    return md;
  }

  generateCSVReport() {
    const headers = ['scenario', 'concurrent_users', 'duration', 'total_requests', 'successful_requests', 'failed_requests', 'success_rate', 'avg_response_time', 'min_response_time', 'max_response_time', 'requests_per_second', 'errors'];
    let csv = headers.join(',') + '\n';
    
    this.results.scenarios.forEach(scenario => {
      const m = scenario.metrics;
      const row = [
        scenario.name,
        scenario.config.concurrent,
        scenario.config.duration,
        m.totalRequests,
        m.successfulRequests,
        m.failedRequests,
        m.successRate.toFixed(2),
        Math.round(m.averageResponseTime),
        Math.round(m.minResponseTime),
        Math.round(m.maxResponseTime),
        m.requestsPerSecond.toFixed(2),
        m.errors.length
      ];
      csv += row.join(',') + '\n';
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
    
    if (key === 'scenarios') {
      options[key] = value.split(',');
    } else {
      options[key] = value;
    }
  }

  const loadTester = new LoadTester(options);
  
  loadTester.runLoadTests()
    .then(results => {
      console.log('\n🎉 Load testing completed successfully!');
      
      // Exit with error code if success rate is too low
      if (results.summary.overallSuccessRate < 95) {
        console.error(`❌ Success rate too low: ${results.summary.overallSuccessRate.toFixed(1)}%`);
        process.exit(1);
      }
      
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Load testing failed:', error);
      process.exit(1);
    });
}

module.exports = LoadTester;