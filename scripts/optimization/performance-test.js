#!/usr/bin/env node

/**
 * Comprehensive Performance Testing Suite
 * Tests Core Web Vitals, bundle sizes, and performance metrics
 */

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs').promises;
const path = require('path');

class PerformanceTester {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || 'http://localhost:4321',
      outputDir: options.outputDir || 'performance-reports',
      pages: options.pages || [
        '/',
        '/about',
        '/services',
        '/projects',
        '/blog',
        '/contact',
        '/nosytos95'
      ],
      devices: options.devices || [
        { name: 'Desktop', viewport: { width: 1920, height: 1080 } },
        { name: 'Tablet', viewport: { width: 768, height: 1024 } },
        { name: 'Mobile', viewport: { width: 375, height: 667 } }
      ],
      ...options
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      pages: {},
      devices: {},
      recommendations: []
    };
  }
  
  async runTests() {
    console.log('🚀 Starting comprehensive performance testing...');
    console.log(`Base URL: ${this.options.baseUrl}`);
    console.log(`Pages: ${this.options.pages.length}`);
    console.log(`Devices: ${this.options.devices.length}`);
    
    try {
      // Ensure output directory exists
      await this.ensureDirectory(this.options.outputDir);
      
      // Launch browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Test each page on each device
      for (const device of this.options.devices) {
        console.log(`\n📱 Testing on ${device.name}...`);
        
        for (const pagePath of this.options.pages) {
          await this.testPage(browser, pagePath, device);
        }
      }
      
      await browser.close();
      
      // Run Lighthouse tests
      await this.runLighthouseTests();
      
      // Analyze bundle sizes
      await this.analyzeBundleSizes();
      
      // Generate recommendations
      this.generateRecommendations();
      
      // Save results
      await this.saveResults();
      
      // Print summary
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Performance testing failed:', error);
      process.exit(1);
    }
  }
  
  async testPage(browser, pagePath, device) {
    const url = `${this.options.baseUrl}${pagePath}`;
    console.log(`  Testing: ${pagePath} on ${device.name}`);
    
    try {
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewport(device.viewport);
      
      // Enable performance monitoring
      await page.evaluateOnNewDocument(() => {
        window.performanceMetrics = {
          navigationStart: performance.timeOrigin,
          metrics: []
        };
      });
      
      // Navigate to page
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      const loadTime = Date.now() - startTime;
      
      // Collect Core Web Vitals
      const vitals = await this.collectWebVitals(page);
      
      // Collect resource metrics
      const resources = await this.collectResourceMetrics(page);
      
      // Collect runtime metrics
      const runtime = await this.collectRuntimeMetrics(page);
      
      // Take screenshot
      const screenshotPath = path.join(
        this.options.outputDir, 
        'screenshots', 
        `${pagePath.replace(/\//g, '_') || 'home'}_${device.name.toLowerCase()}.png`
      );
      await this.ensureDirectory(path.dirname(screenshotPath));
      await page.screenshot({ path: screenshotPath, fullPage: true });
      
      // Store results
      const pageKey = pagePath || '/';
      if (!this.results.pages[pageKey]) {
        this.results.pages[pageKey] = {};
      }
      
      this.results.pages[pageKey][device.name] = {
        url,
        loadTime,
        vitals,
        resources,
        runtime,
        screenshot: screenshotPath,
        timestamp: new Date().toISOString()
      };
      
      await page.close();
      
    } catch (error) {
      console.error(`❌ Failed to test ${pagePath} on ${device.name}:`, error.message);
    }
  }
  
  async collectWebVitals(page) {
    return await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Collect existing performance entries
        const paintEntries = performance.getEntriesByType('paint');
        const navigationEntries = performance.getEntriesByType('navigation');
        
        // First Contentful Paint
        const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          vitals.fcp = fcpEntry.startTime;
        }
        
        // Time to First Byte
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          vitals.ttfb = nav.responseStart - nav.requestStart;
          vitals.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
          vitals.loadComplete = nav.loadEventEnd - nav.loadEventStart;
        }
        
        // Use observers for other metrics
        let metricsCollected = 0;
        const totalMetrics = 3; // LCP, FID, CLS
        
        const checkComplete = () => {
          metricsCollected++;
          if (metricsCollected >= totalMetrics) {
            resolve(vitals);
          }
        };
        
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              vitals.lcp = lastEntry.startTime;
              lcpObserver.disconnect();
              checkComplete();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          } catch (e) {
            checkComplete();
          }
          
          // First Input Delay
          try {
            const fidObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach(entry => {
                vitals.fid = entry.processingStart - entry.startTime;
              });
              fidObserver.disconnect();
              checkComplete();
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
          } catch (e) {
            checkComplete();
          }
          
          // Cumulative Layout Shift
          try {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              });
              vitals.cls = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            
            // Stop observing after 5 seconds
            setTimeout(() => {
              clsObserver.disconnect();
              checkComplete();
            }, 5000);
          } catch (e) {
            checkComplete();
          }
        } else {
          // Fallback if PerformanceObserver is not available
          setTimeout(() => resolve(vitals), 1000);
        }
        
        // Timeout fallback
        setTimeout(() => resolve(vitals), 10000);
      });
    });
  }
  
  async collectResourceMetrics(page) {
    return await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const metrics = {
        totalRequests: resources.length,
        totalSize: 0,
        byType: {},
        slowResources: [],
        largeResources: []
      };
      
      resources.forEach(resource => {
        const type = resource.initiatorType || 'other';
        const size = resource.transferSize || 0;
        const duration = resource.duration;
        
        // Count by type
        if (!metrics.byType[type]) {
          metrics.byType[type] = { count: 0, size: 0, duration: 0 };
        }
        metrics.byType[type].count++;
        metrics.byType[type].size += size;
        metrics.byType[type].duration += duration;
        
        metrics.totalSize += size;
        
        // Flag slow resources (>1s)
        if (duration > 1000) {
          metrics.slowResources.push({
            name: resource.name,
            duration: Math.round(duration),
            size: size
          });
        }
        
        // Flag large resources (>500KB)
        if (size > 500000) {
          metrics.largeResources.push({
            name: resource.name,
            size: size,
            duration: Math.round(duration)
          });
        }
      });
      
      return metrics;
    });
  }
  
  async collectRuntimeMetrics(page) {
    return await page.evaluate(() => {
      const metrics = {};
      
      // Memory usage (if available)
      if ('memory' in performance) {
        metrics.memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }
      
      // DOM metrics
      metrics.dom = {
        elements: document.querySelectorAll('*').length,
        scripts: document.querySelectorAll('script').length,
        stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
        images: document.querySelectorAll('img').length
      };
      
      // Viewport metrics
      metrics.viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      };
      
      return metrics;
    });
  }
  
  async runLighthouseTests() {
    console.log('\n🔍 Running Lighthouse audits...');
    
    const chrome = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    for (const pagePath of this.options.pages.slice(0, 5)) { // Limit to first 5 pages
      try {
        const url = `${this.options.baseUrl}${pagePath}`;
        console.log(`  Auditing: ${pagePath}`);
        
        const { lhr } = await lighthouse(url, {
          port: new URL(chrome.wsEndpoint()).port,
          output: 'json',
          logLevel: 'error'
        });
        
        const pageKey = pagePath || '/';
        if (!this.results.pages[pageKey]) {
          this.results.pages[pageKey] = {};
        }
        
        this.results.pages[pageKey].lighthouse = {
          performance: lhr.categories.performance.score * 100,
          accessibility: lhr.categories.accessibility.score * 100,
          bestPractices: lhr.categories['best-practices'].score * 100,
          seo: lhr.categories.seo.score * 100,
          pwa: lhr.categories.pwa ? lhr.categories.pwa.score * 100 : null,
          metrics: {
            fcp: lhr.audits['first-contentful-paint'].numericValue,
            lcp: lhr.audits['largest-contentful-paint'].numericValue,
            cls: lhr.audits['cumulative-layout-shift'].numericValue,
            tti: lhr.audits['interactive'].numericValue,
            tbt: lhr.audits['total-blocking-time'].numericValue,
            si: lhr.audits['speed-index'].numericValue
          }
        };
        
      } catch (error) {
        console.error(`❌ Lighthouse audit failed for ${pagePath}:`, error.message);
      }
    }
    
    await chrome.close();
  }
  
  async analyzeBundleSizes() {
    console.log('\n📦 Analyzing bundle sizes...');
    
    try {
      // Check if dist directory exists
      const distPath = 'dist';
      await fs.access(distPath);
      
      // Find JavaScript files
      const jsFiles = await this.findFiles(distPath, /\.js$/);
      const cssFiles = await this.findFiles(distPath, /\.css$/);
      
      const bundleAnalysis = {
        javascript: await this.analyzeFiles(jsFiles),
        css: await this.analyzeFiles(cssFiles),
        total: 0
      };
      
      bundleAnalysis.total = bundleAnalysis.javascript.totalSize + bundleAnalysis.css.totalSize;
      
      this.results.bundles = bundleAnalysis;
      
    } catch (error) {
      console.warn('⚠️  Could not analyze bundle sizes:', error.message);
    }
  }
  
  async findFiles(dir, pattern) {
    const files = [];
    
    async function scan(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (pattern.test(entry.name)) {
          files.push(fullPath);
        }
      }
    }
    
    await scan(dir);
    return files;
  }
  
  async analyzeFiles(files) {
    const analysis = {
      files: [],
      totalSize: 0,
      totalGzipSize: 0,
      count: files.length
    };
    
    for (const file of files) {
      try {
        const stats = await fs.stat(file);
        const content = await fs.readFile(file, 'utf8');
        
        // Estimate gzip size (rough approximation)
        const gzipSize = Math.round(content.length * 0.3);
        
        analysis.files.push({
          path: path.relative('dist', file),
          size: stats.size,
          gzipSize: gzipSize,
          sizeFormatted: this.formatBytes(stats.size),
          gzipFormatted: this.formatBytes(gzipSize)
        });
        
        analysis.totalSize += stats.size;
        analysis.totalGzipSize += gzipSize;
        
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${file}:`, error.message);
      }
    }
    
    // Sort by size
    analysis.files.sort((a, b) => b.size - a.size);
    
    return analysis;
  }
  
  generateRecommendations() {
    console.log('\n💡 Generating recommendations...');
    
    const recommendations = [];
    
    // Analyze Lighthouse scores
    Object.entries(this.results.pages).forEach(([page, data]) => {
      if (data.lighthouse) {
        const lh = data.lighthouse;
        
        if (lh.performance < 90) {
          recommendations.push({
            type: 'performance',
            priority: 'high',
            page: page,
            issue: `Performance score is ${lh.performance}/100`,
            suggestion: 'Optimize images, reduce JavaScript bundle size, implement lazy loading'
          });
        }
        
        if (lh.accessibility < 95) {
          recommendations.push({
            type: 'accessibility',
            priority: 'medium',
            page: page,
            issue: `Accessibility score is ${lh.accessibility}/100`,
            suggestion: 'Add alt text to images, improve color contrast, ensure keyboard navigation'
          });
        }
        
        if (lh.metrics.lcp > 2500) {
          recommendations.push({
            type: 'core-web-vitals',
            priority: 'high',
            page: page,
            issue: `LCP is ${Math.round(lh.metrics.lcp)}ms (should be < 2500ms)`,
            suggestion: 'Optimize largest contentful paint element, preload critical resources'
          });
        }
        
        if (lh.metrics.cls > 0.1) {
          recommendations.push({
            type: 'core-web-vitals',
            priority: 'high',
            page: page,
            issue: `CLS is ${lh.metrics.cls.toFixed(3)} (should be < 0.1)`,
            suggestion: 'Add size attributes to images, reserve space for dynamic content'
          });
        }
      }
    });
    
    // Analyze bundle sizes
    if (this.results.bundles) {
      const jsTotal = this.results.bundles.javascript.totalSize;
      const cssTotal = this.results.bundles.css.totalSize;
      
      if (jsTotal > 500000) { // 500KB
        recommendations.push({
          type: 'bundle-size',
          priority: 'medium',
          issue: `JavaScript bundle size is ${this.formatBytes(jsTotal)}`,
          suggestion: 'Implement code splitting, remove unused dependencies, use dynamic imports'
        });
      }
      
      if (cssTotal > 100000) { // 100KB
        recommendations.push({
          type: 'bundle-size',
          priority: 'low',
          issue: `CSS bundle size is ${this.formatBytes(cssTotal)}`,
          suggestion: 'Remove unused CSS, implement critical CSS inlining'
        });
      }
    }
    
    this.results.recommendations = recommendations;
  }
  
  async saveResults() {
    const reportPath = path.join(this.options.outputDir, 'performance-report.json');
    const htmlReportPath = path.join(this.options.outputDir, 'performance-report.html');
    
    // Save JSON report
    await fs.writeFile(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    await fs.writeFile(htmlReportPath, htmlReport);
    
    console.log(`\n📄 Reports saved:`);
    console.log(`  JSON: ${reportPath}`);
    console.log(`  HTML: ${htmlReportPath}`);
  }
  
  generateHTMLReport() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1, h2, h3 { color: #333; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f8f9fa; border-radius: 6px; min-width: 120px; text-align: center; }
        .metric.good { background: #d4edda; color: #155724; }
        .metric.needs-improvement { background: #fff3cd; color: #856404; }
        .metric.poor { background: #f8d7da; color: #721c24; }
        .recommendation { margin: 10px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }
        .recommendation.high { border-color: #dc3545; }
        .recommendation.medium { border-color: #ffc107; }
        .recommendation.low { border-color: #28a745; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8f9fa; }
        .score { font-weight: bold; font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Performance Report</h1>
        <p>Generated: ${this.results.timestamp}</p>
        
        <h2>Summary</h2>
        ${this.generateSummaryHTML()}
        
        <h2>Page Performance</h2>
        ${this.generatePagePerformanceHTML()}
        
        <h2>Bundle Analysis</h2>
        ${this.generateBundleAnalysisHTML()}
        
        <h2>Recommendations</h2>
        ${this.generateRecommendationsHTML()}
    </div>
</body>
</html>`;
  }
  
  generateSummaryHTML() {
    // Calculate averages
    const pages = Object.values(this.results.pages);
    const lighthousePages = pages.filter(p => p.lighthouse);
    
    if (lighthousePages.length === 0) {
      return '<p>No Lighthouse data available</p>';
    }
    
    const avgPerformance = lighthousePages.reduce((sum, p) => sum + p.lighthouse.performance, 0) / lighthousePages.length;
    const avgAccessibility = lighthousePages.reduce((sum, p) => sum + p.lighthouse.accessibility, 0) / lighthousePages.length;
    const avgBestPractices = lighthousePages.reduce((sum, p) => sum + p.lighthouse.bestPractices, 0) / lighthousePages.length;
    const avgSEO = lighthousePages.reduce((sum, p) => sum + p.lighthouse.seo, 0) / lighthousePages.length;
    
    return `
        <div class="metric ${this.getScoreClass(avgPerformance)}">
            <div class="score">${Math.round(avgPerformance)}</div>
            <div>Performance</div>
        </div>
        <div class="metric ${this.getScoreClass(avgAccessibility)}">
            <div class="score">${Math.round(avgAccessibility)}</div>
            <div>Accessibility</div>
        </div>
        <div class="metric ${this.getScoreClass(avgBestPractices)}">
            <div class="score">${Math.round(avgBestPractices)}</div>
            <div>Best Practices</div>
        </div>
        <div class="metric ${this.getScoreClass(avgSEO)}">
            <div class="score">${Math.round(avgSEO)}</div>
            <div>SEO</div>
        </div>
    `;
  }
  
  generatePagePerformanceHTML() {
    let html = '<table><tr><th>Page</th><th>Performance</th><th>LCP</th><th>CLS</th><th>FCP</th></tr>';
    
    Object.entries(this.results.pages).forEach(([page, data]) => {
      if (data.lighthouse) {
        const lh = data.lighthouse;
        html += `
            <tr>
                <td>${page}</td>
                <td class="${this.getScoreClass(lh.performance)}">${Math.round(lh.performance)}</td>
                <td>${Math.round(lh.metrics.lcp)}ms</td>
                <td>${lh.metrics.cls.toFixed(3)}</td>
                <td>${Math.round(lh.metrics.fcp)}ms</td>
            </tr>
        `;
      }
    });
    
    html += '</table>';
    return html;
  }
  
  generateBundleAnalysisHTML() {
    if (!this.results.bundles) {
      return '<p>No bundle analysis available</p>';
    }
    
    const bundles = this.results.bundles;
    
    return `
        <h3>JavaScript Files</h3>
        <p>Total: ${this.formatBytes(bundles.javascript.totalSize)} (${bundles.javascript.count} files)</p>
        
        <h3>CSS Files</h3>
        <p>Total: ${this.formatBytes(bundles.css.totalSize)} (${bundles.css.count} files)</p>
        
        <h3>Overall Bundle Size</h3>
        <p>Total: ${this.formatBytes(bundles.total)}</p>
    `;
  }
  
  generateRecommendationsHTML() {
    if (this.results.recommendations.length === 0) {
      return '<p>No recommendations at this time. Great job!</p>';
    }
    
    return this.results.recommendations.map(rec => `
        <div class="recommendation ${rec.priority}">
            <h4>${rec.type.toUpperCase()} - ${rec.priority.toUpperCase()} Priority</h4>
            ${rec.page ? `<p><strong>Page:</strong> ${rec.page}</p>` : ''}
            <p><strong>Issue:</strong> ${rec.issue}</p>
            <p><strong>Suggestion:</strong> ${rec.suggestion}</p>
        </div>
    `).join('');
  }
  
  getScoreClass(score) {
    if (score >= 90) return 'good';
    if (score >= 50) return 'needs-improvement';
    return 'poor';
  }
  
  printSummary() {
    console.log('\n📊 Performance Test Summary:');
    console.log(`Pages tested: ${Object.keys(this.results.pages).length}`);
    console.log(`Devices tested: ${this.options.devices.length}`);
    console.log(`Recommendations: ${this.results.recommendations.length}`);
    
    if (this.results.bundles) {
      console.log(`Total bundle size: ${this.formatBytes(this.results.bundles.total)}`);
    }
  }
  
  async ensureDirectory(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    
    switch (key) {
      case 'url':
        options.baseUrl = value;
        break;
      case 'output':
        options.outputDir = value;
        break;
      case 'pages':
        options.pages = value.split(',');
        break;
    }
  }
  
  const tester = new PerformanceTester(options);
  tester.runTests().catch(console.error);
}

module.exports = PerformanceTester;
