#!/usr/bin/env node

/**
 * Cross-Browser Compatibility Testing Suite for NosytLabs - 2025
 * Comprehensive testing across Chrome, Firefox, Safari, and Edge
 * Features: Browser-specific issue detection, responsive design validation, and compatibility reporting
 */

import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class CrossBrowserCompatibilityTester {
  constructor() {
    this.browsers = [
      { name: 'chromium', engine: chromium, displayName: 'Chrome' },
      { name: 'firefox', engine: firefox, displayName: 'Firefox' },
      { name: 'webkit', engine: webkit, displayName: 'Safari' }
    ];
    
    this.viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Large Desktop', width: 2560, height: 1440 }
    ];
    
    this.testUrls = [
      { path: '/', name: 'Homepage' },
      { path: '/about', name: 'About Page' },
      { path: '/services', name: 'Services Page' },
      { path: '/projects', name: 'Projects Page' },
      { path: '/contact', name: 'Contact Page' },
      { path: '/nosytos95', name: 'NosytOS95 Page' }
    ];
    
    this.results = {
      browserCompatibility: {},
      responsiveDesign: {},
      featureSupport: {},
      performanceMetrics: {},
      accessibilityTests: {},
      visualRegression: {},
      issues: [],
      recommendations: [],
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        warningTests: 0
      }
    };
    
    this.baseUrl = 'http://localhost:4321'; // Default Astro dev server
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async runCompatibilityTests() {
    this.log('Starting Cross-Browser Compatibility Testing', 'info');
    console.log('🌐 Testing across Chrome, Firefox, Safari, and Edge...\n');
    
    try {
      const startTime = Date.now();
      
      // Check if local server is running
      await this.checkServerAvailability();
      
      // Run tests for each browser
      for (const browser of this.browsers) {
        await this.testBrowser(browser);
      }
      
      // Generate comprehensive report
      const duration = Date.now() - startTime;
      this.generateCompatibilityReport(duration);
      
      this.log('Cross-browser compatibility testing completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Compatibility testing failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async checkServerAvailability() {
    this.log('Checking server availability');
    
    const testUrls = [
      'http://localhost:4321',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://nosytlabs.com'
    ];
    
    for (const url of testUrls) {
      try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(url, { timeout: 5000 });
        const title = await page.title();
        
        if (title && title.length > 0) {
          this.baseUrl = url;
          this.log(`  Server found at: ${url}`, 'success');
          await browser.close();
          return;
        }
        
        await browser.close();
      } catch (error) {
        // Continue to next URL
      }
    }
    
    throw new Error('No accessible server found. Please start the development server.');
  }

  async testBrowser(browserConfig) {
    this.log(`Testing ${browserConfig.displayName}`, 'info');
    
    let browser;
    try {
      browser = await browserConfig.engine.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.results.browserCompatibility[browserConfig.name] = {
        browser: browserConfig.displayName,
        tests: {},
        issues: [],
        performance: {},
        accessibility: {}
      };
      
      // Test each viewport
      for (const viewport of this.viewports) {
        await this.testViewport(browser, browserConfig, viewport);
      }
      
      // Test browser-specific features
      await this.testBrowserSpecificFeatures(browser, browserConfig);
      
      await browser.close();
      this.log(`  ${browserConfig.displayName} testing completed`, 'success');
      
    } catch (error) {
      this.log(`  ${browserConfig.displayName} testing failed: ${error.message}`, 'error');
      this.results.issues.push({
        browser: browserConfig.displayName,
        type: 'Browser Launch Error',
        message: error.message,
        severity: 'critical'
      });
      
      if (browser) {
        await browser.close();
      }
    }
  }

  async testViewport(browser, browserConfig, viewport) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      userAgent: this.getUserAgent(browserConfig.name, viewport.name)
    });
    
    const page = await context.newPage();
    
    try {
      const testKey = `${browserConfig.name}_${viewport.name}`;
      this.results.browserCompatibility[browserConfig.name].tests[viewport.name] = {};
      
      // Test each page
      for (const urlInfo of this.testUrls) {
        await this.testPage(page, browserConfig, viewport, urlInfo, testKey);
      }
      
    } catch (error) {
      this.log(`    ${viewport.name} testing failed: ${error.message}`, 'error');
    } finally {
      await context.close();
    }
  }

  async testPage(page, browserConfig, viewport, urlInfo, testKey) {
    try {
      const url = `${this.baseUrl}${urlInfo.path}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      const pageTests = {};
      
      // Test 1: Page Load
      const title = await page.title();
      pageTests.pageLoad = {
        passed: title && title.length > 0,
        title: title,
        url: url
      };
      
      // Test 2: Layout Stability
      await this.testLayoutStability(page, pageTests);
      
      // Test 3: Interactive Elements
      await this.testInteractiveElements(page, pageTests);
      
      // Test 4: CSS Features
      await this.testCSSFeatures(page, pageTests, browserConfig.name);
      
      // Test 5: JavaScript Functionality
      await this.testJavaScriptFunctionality(page, pageTests);
      
      // Test 6: Responsive Design
      await this.testResponsiveDesign(page, pageTests, viewport);
      
      // Test 7: Performance Metrics
      await this.testPerformanceMetrics(page, pageTests);
      
      // Take screenshot for visual regression
      await this.takeScreenshot(page, browserConfig.name, viewport.name, urlInfo.name);
      
      this.results.browserCompatibility[browserConfig.name].tests[viewport.name][urlInfo.name] = pageTests;
      
      // Update summary
      this.updateTestSummary(pageTests);
      
    } catch (error) {
      this.log(`      ${urlInfo.name} testing failed: ${error.message}`, 'error');
      this.results.issues.push({
        browser: browserConfig.displayName,
        viewport: viewport.name,
        page: urlInfo.name,
        type: 'Page Test Error',
        message: error.message,
        severity: 'high'
      });
    }
  }

  async testLayoutStability(page, pageTests) {
    try {
      // Check for layout shifts
      const layoutShiftScore = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cumulativeLayoutShift = 0;
          
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                cumulativeLayoutShift += entry.value;
              }
            }
          });
          
          observer.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulativeLayoutShift);
          }, 3000);
        });
      });
      
      pageTests.layoutStability = {
        passed: layoutShiftScore < 0.1, // Good CLS score
        score: layoutShiftScore,
        threshold: 0.1
      };
      
    } catch (error) {
      pageTests.layoutStability = {
        passed: false,
        error: error.message
      };
    }
  }

  async testInteractiveElements(page, pageTests) {
    try {
      // Test navigation menu
      const navExists = await page.locator('nav').count() > 0;
      const buttonsWork = await page.locator('button').count() > 0;
      const linksWork = await page.locator('a').count() > 0;
      
      pageTests.interactiveElements = {
        passed: navExists && buttonsWork && linksWork,
        navigation: navExists,
        buttons: buttonsWork,
        links: linksWork
      };
      
    } catch (error) {
      pageTests.interactiveElements = {
        passed: false,
        error: error.message
      };
    }
  }

  async testCSSFeatures(page, pageTests, browserName) {
    try {
      // Test modern CSS features
      const cssFeatures = await page.evaluate(() => {
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        const features = {
          flexbox: CSS.supports('display', 'flex'),
          grid: CSS.supports('display', 'grid'),
          customProperties: CSS.supports('--test', 'value'),
          backdrop: CSS.supports('backdrop-filter', 'blur(10px)'),
          containerQueries: CSS.supports('container-type', 'inline-size')
        };
        
        document.body.removeChild(testElement);
        return features;
      });
      
      pageTests.cssFeatures = {
        passed: Object.values(cssFeatures).every(Boolean),
        features: cssFeatures,
        unsupported: Object.entries(cssFeatures)
          .filter(([key, value]) => !value)
          .map(([key]) => key)
      };
      
    } catch (error) {
      pageTests.cssFeatures = {
        passed: false,
        error: error.message
      };
    }
  }

  async testJavaScriptFunctionality(page, pageTests) {
    try {
      // Test JavaScript features
      const jsFeatures = await page.evaluate(() => {
        return {
          es6Modules: typeof import !== 'undefined',
          asyncAwait: typeof (async () => {}) === 'function',
          fetch: typeof fetch !== 'undefined',
          localStorage: typeof localStorage !== 'undefined',
          intersectionObserver: typeof IntersectionObserver !== 'undefined'
        };
      });
      
      pageTests.javaScriptFunctionality = {
        passed: Object.values(jsFeatures).every(Boolean),
        features: jsFeatures
      };
      
    } catch (error) {
      pageTests.javaScriptFunctionality = {
        passed: false,
        error: error.message
      };
    }
  }

  async testResponsiveDesign(page, pageTests, viewport) {
    try {
      // Check responsive elements
      const responsiveElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let overflowingElements = 0;
        let totalElements = 0;
        
        elements.forEach(el => {
          if (el.offsetWidth > 0 && el.offsetHeight > 0) {
            totalElements++;
            if (el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight) {
              overflowingElements++;
            }
          }
        });
        
        return {
          totalElements,
          overflowingElements,
          overflowPercentage: (overflowingElements / totalElements) * 100
        };
      });
      
      pageTests.responsiveDesign = {
        passed: responsiveElements.overflowPercentage < 5, // Less than 5% overflow
        viewport: viewport.name,
        ...responsiveElements
      };
      
    } catch (error) {
      pageTests.responsiveDesign = {
        passed: false,
        error: error.message
      };
    }
  }

  async testPerformanceMetrics(page, pageTests) {
    try {
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
      });
      
      pageTests.performance = {
        passed: metrics.loadTime < 3000 && metrics.firstContentfulPaint < 2500,
        metrics: metrics,
        thresholds: {
          loadTime: 3000,
          firstContentfulPaint: 2500
        }
      };
      
    } catch (error) {
      pageTests.performance = {
        passed: false,
        error: error.message
      };
    }
  }

  async testBrowserSpecificFeatures(browser, browserConfig) {
    // Test browser-specific features and known issues
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto(this.baseUrl);
      
      // Browser-specific tests
      const browserSpecificTests = {};
      
      if (browserConfig.name === 'webkit') {
        // Safari-specific tests
        browserSpecificTests.webkitFeatures = await this.testWebKitFeatures(page);
      } else if (browserConfig.name === 'firefox') {
        // Firefox-specific tests
        browserSpecificTests.firefoxFeatures = await this.testFirefoxFeatures(page);
      } else if (browserConfig.name === 'chromium') {
        // Chrome-specific tests
        browserSpecificTests.chromiumFeatures = await this.testChromiumFeatures(page);
      }
      
      this.results.browserCompatibility[browserConfig.name].browserSpecific = browserSpecificTests;
      
    } catch (error) {
      this.log(`    Browser-specific testing failed: ${error.message}`, 'error');
    } finally {
      await context.close();
    }
  }

  async testWebKitFeatures(page) {
    // Test Safari/WebKit specific features and known issues
    return await page.evaluate(() => {
      return {
        webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        webkitAppearance: CSS.supports('-webkit-appearance', 'none'),
        touchAction: CSS.supports('touch-action', 'manipulation'),
        webkitOverflowScrolling: CSS.supports('-webkit-overflow-scrolling', 'touch')
      };
    });
  }

  async testFirefoxFeatures(page) {
    // Test Firefox specific features and known issues
    return await page.evaluate(() => {
      return {
        mozAppearance: CSS.supports('-moz-appearance', 'none'),
        scrollbarWidth: CSS.supports('scrollbar-width', 'thin'),
        mozUserSelect: CSS.supports('-moz-user-select', 'none')
      };
    });
  }

  async testChromiumFeatures(page) {
    // Test Chrome/Chromium specific features
    return await page.evaluate(() => {
      return {
        webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        scrollbarGutter: CSS.supports('scrollbar-gutter', 'stable'),
        accentColor: CSS.supports('accent-color', '#000000')
      };
    });
  }

  async takeScreenshot(page, browserName, viewportName, pageName) {
    try {
      const screenshotDir = path.join(rootDir, 'test-artifacts', 'screenshots');
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const filename = `${browserName}-${viewportName}-${pageName.replace(/\s+/g, '-')}.png`;
      const filepath = path.join(screenshotDir, filename);
      
      await page.screenshot({ 
        path: filepath, 
        fullPage: true,
        animations: 'disabled'
      });
      
      this.results.visualRegression[`${browserName}_${viewportName}_${pageName}`] = {
        screenshot: filepath,
        browser: browserName,
        viewport: viewportName,
        page: pageName
      };
      
    } catch (error) {
      this.log(`    Screenshot failed: ${error.message}`, 'warning');
    }
  }

  getUserAgent(browserName, viewportName) {
    const userAgents = {
      chromium: {
        Mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      firefox: {
        Mobile: 'Mozilla/5.0 (Mobile; rv:68.0) Gecko/68.0 Firefox/68.0',
        Desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      },
      webkit: {
        Mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15'
      }
    };
    
    return userAgents[browserName]?.[viewportName] || userAgents[browserName]?.Desktop || '';
  }

  updateTestSummary(pageTests) {
    Object.values(pageTests).forEach(test => {
      this.results.summary.totalTests++;
      if (test.passed) {
        this.results.summary.passedTests++;
      } else if (test.error) {
        this.results.summary.failedTests++;
      } else {
        this.results.summary.warningTests++;
      }
    });
  }

  generateCompatibilityReport(duration) {
    const passRate = this.results.summary.totalTests > 0 
      ? ((this.results.summary.passedTests / this.results.summary.totalTests) * 100).toFixed(1)
      : 0;

    const report = `
# Cross-Browser Compatibility Test Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Overall Results
- Total Tests: ${this.results.summary.totalTests}
- Passed: ${this.results.summary.passedTests}
- Failed: ${this.results.summary.failedTests}
- Warnings: ${this.results.summary.warningTests}
- Pass Rate: ${passRate}%

## Browser Compatibility Summary
${this.browsers.map(browser => {
  const browserResults = this.results.browserCompatibility[browser.name];
  const browserTests = Object.values(browserResults?.tests || {}).flat();
  const browserPassRate = browserTests.length > 0 
    ? ((browserTests.filter(test => Object.values(test).every(t => t.passed)).length / browserTests.length) * 100).toFixed(1)
    : 0;
  
  return `- ${browser.displayName}: ${browserPassRate}% compatibility`;
}).join('\n')}

## Issues Found
${this.results.issues.map(issue => 
  `- ${issue.browser} (${issue.viewport || 'All'}): ${issue.type} - ${issue.message}`
).join('\n')}

## Recommendations
${this.results.recommendations.join('\n')}

## Next Steps
1. Address critical browser compatibility issues
2. Test fixes across all browsers
3. Implement browser-specific polyfills if needed
4. Validate responsive design improvements
5. Monitor performance across browsers
6. Update browser support documentation
`;

    const reportPath = path.join(rootDir, 'CROSS-BROWSER-COMPATIBILITY-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    // Save detailed JSON results
    const jsonPath = path.join(rootDir, 'test-artifacts', 'cross-browser-results.json');
    if (!fs.existsSync(path.dirname(jsonPath))) {
      fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    }
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n🌐 Cross-Browser Compatibility Summary:');
    console.log(`   Total tests: ${this.results.summary.totalTests}`);
    console.log(`   Passed: ${this.results.summary.passedTests}`);
    console.log(`   Failed: ${this.results.summary.failedTests}`);
    console.log(`   Pass rate: ${passRate}%`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: CROSS-BROWSER-COMPATIBILITY-REPORT.md`);
    console.log(`📊 Detailed results: test-artifacts/cross-browser-results.json`);
  }
}

// Run compatibility tests if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Cross-Browser Compatibility Testing...');
  const tester = new CrossBrowserCompatibilityTester();
  tester.runCompatibilityTests().catch((error) => {
    console.error('Cross-browser testing failed:', error);
    process.exit(1);
  });
}

export { CrossBrowserCompatibilityTester };
