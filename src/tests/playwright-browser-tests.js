#!/usr/bin/env node

/**
 * Playwright Browser Testing Suite for NosytLabs - 2025
 * Cross-browser testing with real browser automation for comprehensive validation
 * Features: Multi-browser testing, responsive design validation, accessibility testing, and performance monitoring
 */

import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('🎭 Starting Playwright Browser Testing Suite...\n');

class PlaywrightBrowserTests {
  constructor() {
    this.browsers = ['chromium', 'firefox', 'webkit'];
    this.viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    this.results = {
      browserTests: {},
      responsiveTests: {},
      accessibilityTests: {},
      performanceTests: {},
      functionalityTests: {},
      errors: [],
      warnings: [],
      screenshots: []
    };
    
    this.testUrl = 'https://nosytlabs.com'; // Use live site for testing
  }

  async runAllTests() {
    console.log(`🌐 Testing URL: ${this.testUrl}`);
    console.log(`📱 Viewports: ${this.viewports.map(v => `${v.name} (${v.width}x${v.height})`).join(', ')}`);
    console.log(`🌍 Browsers: ${this.browsers.join(', ')}\n`);

    for (const browserName of this.browsers) {
      await this.testBrowser(browserName);
    }

    this.generateTestReport();
  }

  async testBrowser(browserName) {
    console.log(`🔍 Testing ${browserName.toUpperCase()}...`);
    
    let browser;
    try {
      // Launch browser
      switch (browserName) {
        case 'chromium':
          browser = await chromium.launch({ headless: true });
          break;
        case 'firefox':
          browser = await firefox.launch({ headless: true });
          break;
        case 'webkit':
          browser = await webkit.launch({ headless: true });
          break;
      }

      this.results.browserTests[browserName] = {};

      // Test each viewport
      for (const viewport of this.viewports) {
        await this.testViewport(browser, browserName, viewport);
      }

      await browser.close();
      console.log(`   ✅ ${browserName} testing completed\n`);

    } catch (error) {
      console.error(`   ❌ ${browserName} testing failed: ${error.message}\n`);
      this.results.errors.push(`${browserName}: ${error.message}`);
      if (browser) await browser.close();
    }
  }

  async testViewport(browser, browserName, viewport) {
    console.log(`   📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      userAgent: this.getUserAgent(browserName, viewport.name)
    });

    const page = await context.newPage();
    
    try {
      // Navigate to the site
      await page.goto(this.testUrl, { waitUntil: 'networkidle' });
      
      // Initialize test results for this browser/viewport combination
      const testKey = `${browserName}_${viewport.name}`;
      this.results.browserTests[browserName][viewport.name] = {};

      // Run comprehensive tests
      await this.testPageLoad(page, testKey);
      await this.testResponsiveLayout(page, testKey, viewport);
      await this.testNavigation(page, testKey);
      await this.testAccessibility(page, testKey);
      await this.testInteractiveElements(page, testKey);
      await this.testPerformance(page, testKey);
      await this.takeScreenshots(page, testKey);

      console.log(`     ✅ ${viewport.name} tests completed`);

    } catch (error) {
      console.error(`     ❌ ${viewport.name} tests failed: ${error.message}`);
      this.results.errors.push(`${browserName} ${viewport.name}: ${error.message}`);
    } finally {
      await context.close();
    }
  }

  async testPageLoad(page, testKey) {
    try {
      // Test page load performance
      const startTime = Date.now();
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Check for console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Check for network failures
      const networkFailures = [];
      page.on('response', response => {
        if (!response.ok()) {
          networkFailures.push(`${response.status()} ${response.url()}`);
        }
      });

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].pageLoad = {
        loadTime,
        consoleErrors: consoleErrors.length,
        networkFailures: networkFailures.length,
        passed: loadTime < 5000 && consoleErrors.length === 0 && networkFailures.length === 0
      };

    } catch (error) {
      this.results.errors.push(`Page Load Test (${testKey}): ${error.message}`);
    }
  }

  async testResponsiveLayout(page, testKey, viewport) {
    try {
      // Test layout elements
      const layoutTests = {
        navigation: await page.isVisible('nav, [role="navigation"]'),
        mainContent: await page.isVisible('main, [role="main"]'),
        footer: await page.isVisible('footer'),
        logo: await page.isVisible('[alt*="NosytLabs"], [alt*="logo"]'),
        mobileMenu: viewport.width < 768 ? await page.isVisible('[data-mobile-menu], .mobile-menu') : true
      };

      // Check for horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Check touch targets on mobile
      let touchTargetsValid = true;
      if (viewport.width < 768) {
        const buttons = await page.$$('button, a, input[type="button"], input[type="submit"]');
        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box && (box.width < 44 || box.height < 44)) {
            touchTargetsValid = false;
            break;
          }
        }
      }

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].responsive = {
        layoutElements: layoutTests,
        noHorizontalScroll: !hasHorizontalScroll,
        touchTargetsValid,
        passed: Object.values(layoutTests).every(Boolean) && !hasHorizontalScroll && touchTargetsValid
      };

    } catch (error) {
      this.results.errors.push(`Responsive Layout Test (${testKey}): ${error.message}`);
    }
  }

  async testNavigation(page, testKey) {
    try {
      // Test main navigation links
      const navLinks = await page.$$('nav a, [role="navigation"] a');
      const workingLinks = [];
      const brokenLinks = [];

      for (const link of navLinks.slice(0, 5)) { // Test first 5 links
        try {
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            const response = await page.request.get(href);
            if (response.ok()) {
              workingLinks.push(href);
            } else {
              brokenLinks.push(href);
            }
          }
        } catch (error) {
          brokenLinks.push(await link.getAttribute('href'));
        }
      }

      // Test mobile menu toggle (if mobile)
      let mobileMenuWorks = true;
      if (testKey.includes('Mobile')) {
        try {
          const menuToggle = await page.$('[data-mobile-toggle], .mobile-toggle, .hamburger');
          if (menuToggle) {
            await menuToggle.click();
            await page.waitForTimeout(500);
            const menuVisible = await page.isVisible('[data-mobile-menu], .mobile-menu');
            mobileMenuWorks = menuVisible;
          }
        } catch (error) {
          mobileMenuWorks = false;
        }
      }

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].navigation = {
        workingLinks: workingLinks.length,
        brokenLinks: brokenLinks.length,
        mobileMenuWorks,
        passed: brokenLinks.length === 0 && mobileMenuWorks
      };

    } catch (error) {
      this.results.errors.push(`Navigation Test (${testKey}): ${error.message}`);
    }
  }

  async testAccessibility(page, testKey) {
    try {
      // Test basic accessibility features
      const accessibilityTests = {
        hasMainLandmark: await page.isVisible('main, [role="main"]'),
        hasNavLandmark: await page.isVisible('nav, [role="navigation"]'),
        hasH1: await page.isVisible('h1'),
        hasSkipLink: await page.isVisible('.skip-link, .skip-nav'),
        imagesHaveAlt: await this.checkImageAltText(page),
        formsHaveLabels: await this.checkFormLabels(page),
        focusVisible: await this.checkFocusVisibility(page)
      };

      // Test keyboard navigation
      const keyboardNavWorks = await this.testKeyboardNavigation(page);

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].accessibility = {
        ...accessibilityTests,
        keyboardNavigation: keyboardNavWorks,
        passed: Object.values(accessibilityTests).every(Boolean) && keyboardNavWorks
      };

    } catch (error) {
      this.results.errors.push(`Accessibility Test (${testKey}): ${error.message}`);
    }
  }

  async testInteractiveElements(page, testKey) {
    try {
      // Test buttons and interactive elements
      const buttons = await page.$$('button:not([disabled])');
      let buttonsWork = true;
      
      for (const button of buttons.slice(0, 3)) { // Test first 3 buttons
        try {
          await button.click();
          await page.waitForTimeout(100);
        } catch (error) {
          buttonsWork = false;
          break;
        }
      }

      // Test form interactions
      const forms = await page.$$('form');
      let formsWork = true;
      
      for (const form of forms.slice(0, 2)) { // Test first 2 forms
        try {
          const inputs = await form.$$('input[type="text"], input[type="email"], textarea');
          for (const input of inputs.slice(0, 2)) {
            await input.fill('test');
            await page.waitForTimeout(50);
          }
        } catch (error) {
          formsWork = false;
          break;
        }
      }

      // Test theme toggle if present
      let themeToggleWorks = true;
      try {
        const themeToggle = await page.$('[data-theme-toggle], .theme-toggle');
        if (themeToggle) {
          await themeToggle.click();
          await page.waitForTimeout(500);
        }
      } catch (error) {
        themeToggleWorks = false;
      }

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].interactive = {
        buttonsWork,
        formsWork,
        themeToggleWorks,
        passed: buttonsWork && formsWork && themeToggleWorks
      };

    } catch (error) {
      this.results.errors.push(`Interactive Elements Test (${testKey}): ${error.message}`);
    }
  }

  async testPerformance(page, testKey) {
    try {
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });

      // Check Core Web Vitals
      const coreWebVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {};
          
          // Simulate LCP measurement
          if ('PerformanceObserver' in window) {
            try {
              const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.LCP = lastEntry.startTime;
              });
              observer.observe({ entryTypes: ['largest-contentful-paint'] });
              
              setTimeout(() => {
                resolve(vitals);
              }, 1000);
            } catch (error) {
              resolve(vitals);
            }
          } else {
            resolve(vitals);
          }
        });
      });

      this.results.browserTests[testKey.split('_')[0]][testKey.split('_')[1]].performance = {
        metrics,
        coreWebVitals,
        passed: metrics.firstContentfulPaint < 2000 && metrics.domContentLoaded < 1000
      };

    } catch (error) {
      this.results.errors.push(`Performance Test (${testKey}): ${error.message}`);
    }
  }

  async takeScreenshots(page, testKey) {
    try {
      const screenshotPath = `screenshots/${testKey}_${Date.now()}.png`;
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      
      this.results.screenshots.push({
        testKey,
        path: screenshotPath,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.results.warnings.push(`Screenshot failed for ${testKey}: ${error.message}`);
    }
  }

  // Helper methods
  async checkImageAltText(page) {
    const images = await page.$$('img');
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) return false;
    }
    return true;
  }

  async checkFormLabels(page) {
    const inputs = await page.$$('input[type="text"], input[type="email"], textarea');
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (!ariaLabel && !ariaLabelledBy && id) {
        const label = await page.$(`label[for="${id}"]`);
        if (!label) return false;
      }
    }
    return true;
  }

  async checkFocusVisibility(page) {
    try {
      const focusableElements = await page.$$('button, a, input, textarea, select');
      if (focusableElements.length > 0) {
        await focusableElements[0].focus();
        const focusVisible = await page.evaluate(() => {
          const focused = document.activeElement;
          const styles = window.getComputedStyle(focused);
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        });
        return focusVisible;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async testKeyboardNavigation(page) {
    try {
      // Test Tab navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const activeElement = await page.evaluate(() => {
        return document.activeElement.tagName.toLowerCase();
      });
      
      return ['a', 'button', 'input', 'textarea', 'select'].includes(activeElement);
    } catch (error) {
      return false;
    }
  }

  getUserAgent(browserName, deviceType) {
    const userAgents = {
      chromium: {
        Mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Tablet: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      firefox: {
        Mobile: 'Mozilla/5.0 (Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
        Tablet: 'Mozilla/5.0 (Tablet; rv:68.0) Gecko/68.0 Firefox/88.0',
        Desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      },
      webkit: {
        Mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Tablet: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        Desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15'
      }
    };
    
    return userAgents[browserName]?.[deviceType] || userAgents.chromium.Desktop;
  }

  generateTestReport() {
    console.log('\n📊 Playwright Browser Testing Report');
    console.log('====================================');
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    // Count test results
    for (const browser of Object.keys(this.results.browserTests)) {
      for (const viewport of Object.keys(this.results.browserTests[browser])) {
        const tests = this.results.browserTests[browser][viewport];
        for (const testType of Object.keys(tests)) {
          totalTests++;
          if (tests[testType].passed) {
            passedTests++;
          } else {
            failedTests++;
          }
        }
      }
    }

    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    console.log(`\n📈 Overall Results:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} (${passRate}%)`);
    console.log(`   Failed: ${failedTests}`);
    console.log(`   Errors: ${this.results.errors.length}`);
    console.log(`   Warnings: ${this.results.warnings.length}`);
    console.log(`   Screenshots: ${this.results.screenshots.length}`);

    // Browser-specific results
    console.log(`\n🌍 Browser Results:`);
    for (const browser of Object.keys(this.results.browserTests)) {
      console.log(`   ${browser.toUpperCase()}:`);
      for (const viewport of Object.keys(this.results.browserTests[browser])) {
        const tests = this.results.browserTests[browser][viewport];
        const browserPassed = Object.values(tests).filter(t => t.passed).length;
        const browserTotal = Object.keys(tests).length;
        console.log(`     ${viewport}: ${browserPassed}/${browserTotal} tests passed`);
      }
    }

    if (this.results.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      this.results.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    // Save detailed report
    const reportPath = 'playwright-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2), 'utf8');
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Overall assessment
    if (failedTests === 0) {
      console.log('\n🎉 All browser tests passed! Cross-browser compatibility confirmed.');
    } else if (failedTests < 3) {
      console.log('\n✅ Most tests passed with minor issues. Review failed tests.');
    } else {
      console.log('\n⚠️  Multiple test failures detected. Address issues before deployment.');
    }
  }
}

// Run the Playwright browser tests
const browserTests = new PlaywrightBrowserTests();
browserTests.runAllTests().catch(console.error);
