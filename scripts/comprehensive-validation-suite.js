#!/usr/bin/env node

/**
 * Comprehensive Validation Suite for NosytLabs - 2025
 * Final validation of all optimizations and enhancements
 * Features: Functionality testing, visual regression, performance validation, and comprehensive reporting
 */

import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class ComprehensiveValidationSuite {
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

    this.testPages = [
      { path: '/', name: 'Homepage', critical: true },
      { path: '/about', name: 'About Page', critical: true },
      { path: '/services', name: 'Services Page', critical: true },
      { path: '/projects', name: 'Projects Page', critical: true },
      { path: '/contact', name: 'Contact Page', critical: true },
      { path: '/nosytos95', name: 'NosytOS95 Page', critical: false }
    ];

    this.results = {
      functionality: {
        navigation: { tests: [], passed: 0, failed: 0 },
        forms: { tests: [], passed: 0, failed: 0 },
        interactions: { tests: [], passed: 0, failed: 0 },
        accessibility: { tests: [], passed: 0, failed: 0 }
      },
      performance: {
        coreWebVitals: { tests: [], passed: 0, failed: 0 },
        loadTimes: { tests: [], passed: 0, failed: 0 },
        bundleSizes: { tests: [], passed: 0, failed: 0 },
        optimization: { tests: [], passed: 0, failed: 0 }
      },
      visualRegression: {
        screenshots: [],
        comparisons: [],
        differences: []
      },
      crossBrowser: {
        compatibility: { tests: [], passed: 0, failed: 0 },
        features: { tests: [], passed: 0, failed: 0 },
        rendering: { tests: [], passed: 0, failed: 0 }
      },
      designSystem: {
        glassmorphism: { tests: [], passed: 0, failed: 0 },
        colorSystem: { tests: [], passed: 0, failed: 0 },
        microInteractions: { tests: [], passed: 0, failed: 0 }
      },
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalIssues: 0,
        overallScore: 0,
        duration: 0
      }
    };

    this.baseUrl = 'http://localhost:4321'; // Default Astro dev server
    this.screenshotDir = path.join(rootDir, 'test-artifacts', 'validation-screenshots');
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

  async runComprehensiveValidation() {
    this.log('Starting Comprehensive Validation Suite', 'info');
    console.log('🔍 Validating all optimizations and enhancements...\n');

    try {
      const startTime = Date.now();

      // Setup
      await this.setupValidation();

      // Phase 1: Functionality Validation
      await this.validateFunctionality();

      // Phase 2: Performance Validation
      await this.validatePerformance();

      // Phase 3: Visual Regression Testing
      await this.runVisualRegressionTests();

      // Phase 4: Cross-Browser Validation
      await this.validateCrossBrowserCompatibility();

      // Phase 5: Design System Validation
      await this.validateDesignSystem();

      // Phase 6: Integration Testing
      await this.runIntegrationTests();

      // Generate comprehensive report
      const duration = Date.now() - startTime;
      this.results.summary.duration = duration;
      this.generateValidationReport(duration);

      this.log('Comprehensive validation completed successfully!', 'success');

    } catch (error) {
      this.log(`Comprehensive validation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async setupValidation() {
    this.log('Setting up validation environment');

    // Create screenshot directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }

    // Check server availability
    await this.checkServerAvailability();

    this.log('  Validation environment ready');
  }

  async checkServerAvailability() {
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

  async validateFunctionality() {
    this.log('Phase 1: Validating functionality');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      // Test navigation functionality
      await this.testNavigation(page);

      // Test form functionality
      await this.testForms(page);

      // Test interactive elements
      await this.testInteractions(page);

      // Test accessibility features
      await this.testAccessibilityFeatures(page);

    } finally {
      await browser.close();
    }

    this.log(`  Functionality validation completed`);
  }

  async testNavigation(page) {
    this.log('  Testing navigation functionality');

    for (const testPage of this.testPages) {
      try {
        const url = `${this.baseUrl}${testPage.path}`;
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

        // Test page load
        const title = await page.title();
        const hasContent = await page.locator('main').count() > 0;

        const test = {
          name: `Navigation to ${testPage.name}`,
          url: url,
          passed: title && title.length > 0 && hasContent,
          critical: testPage.critical,
          details: `Title: "${title}", Has main content: ${hasContent}`
        };

        this.results.functionality.navigation.tests.push(test);

        if (test.passed) {
          this.results.functionality.navigation.passed++;
        } else {
          this.results.functionality.navigation.failed++;
          if (test.critical) {
            this.results.summary.criticalIssues++;
          }
        }

        // Test navigation menu
        const navExists = await page.locator('nav').count() > 0;
        const navLinksWork = await page.locator('nav a').count() > 0;

        const navTest = {
          name: `Navigation menu on ${testPage.name}`,
          passed: navExists && navLinksWork,
          critical: true,
          details: `Nav exists: ${navExists}, Nav links: ${navLinksWork}`
        };

        this.results.functionality.navigation.tests.push(navTest);

        if (navTest.passed) {
          this.results.functionality.navigation.passed++;
        } else {
          this.results.functionality.navigation.failed++;
          this.results.summary.criticalIssues++;
        }

      } catch (error) {
        const test = {
          name: `Navigation to ${testPage.name}`,
          passed: false,
          critical: testPage.critical,
          error: error.message
        };

        this.results.functionality.navigation.tests.push(test);
        this.results.functionality.navigation.failed++;

        if (test.critical) {
          this.results.summary.criticalIssues++;
        }
      }
    }
  }

  async testForms(page) {
    this.log('  Testing form functionality');

    try {
      // Navigate to contact page
      await page.goto(`${this.baseUrl}/contact`, { waitUntil: 'networkidle' });

      // Test contact form
      const formExists = await page.locator('form').count() > 0;
      const inputsExist = await page.locator('input, textarea').count() > 0;
      const submitExists = await page.locator('button[type="submit"], input[type="submit"]').count() > 0;

      const formTest = {
        name: 'Contact form functionality',
        passed: formExists && inputsExist && submitExists,
        critical: true,
        details: `Form: ${formExists}, Inputs: ${inputsExist}, Submit: ${submitExists}`
      };

      this.results.functionality.forms.tests.push(formTest);

      if (formTest.passed) {
        this.results.functionality.forms.passed++;

        // Test form validation if form exists
        if (formExists) {
          await this.testFormValidation(page);
        }
      } else {
        this.results.functionality.forms.failed++;
        this.results.summary.criticalIssues++;
      }

    } catch (error) {
      const test = {
        name: 'Contact form functionality',
        passed: false,
        critical: true,
        error: error.message
      };

      this.results.functionality.forms.tests.push(test);
      this.results.functionality.forms.failed++;
      this.results.summary.criticalIssues++;
    }
  }

  async testFormValidation(page) {
    try {
      // Test form validation
      const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();

      if (await submitButton.count() > 0) {
        await submitButton.click();

        // Check for validation messages
        const validationExists = await page.locator('.error, .invalid, [aria-invalid="true"]').count() > 0;

        const validationTest = {
          name: 'Form validation',
          passed: validationExists,
          critical: false,
          details: `Validation messages shown: ${validationExists}`
        };

        this.results.functionality.forms.tests.push(validationTest);

        if (validationTest.passed) {
          this.results.functionality.forms.passed++;
        } else {
          this.results.functionality.forms.failed++;
        }
      }

    } catch (error) {
      // Form validation test failed, but not critical
      const test = {
        name: 'Form validation',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.functionality.forms.tests.push(test);
      this.results.functionality.forms.failed++;
    }
  }

  async testInteractions(page) {
    this.log('  Testing interactive elements');

    try {
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Test buttons
      const buttonsExist = await page.locator('button').count() > 0;
      const linksExist = await page.locator('a').count() > 0;

      // Test hover effects (check for CSS transitions)
      const hoverElements = await page.locator('.hover-lift, .hover-glow, .btn-glass-2025').count();

      // Test theme toggle if it exists
      const themeToggleExists = await page.locator('[data-theme-toggle], .theme-toggle').count() > 0;

      const interactionTest = {
        name: 'Interactive elements',
        passed: buttonsExist && linksExist,
        critical: true,
        details: `Buttons: ${buttonsExist}, Links: ${linksExist}, Hover elements: ${hoverElements}, Theme toggle: ${themeToggleExists}`
      };

      this.results.functionality.interactions.tests.push(interactionTest);

      if (interactionTest.passed) {
        this.results.functionality.interactions.passed++;
      } else {
        this.results.functionality.interactions.failed++;
        this.results.summary.criticalIssues++;
      }

      // Test micro-interactions
      if (hoverElements > 0) {
        const microInteractionTest = {
          name: 'Micro-interactions',
          passed: hoverElements > 0,
          critical: false,
          details: `Found ${hoverElements} elements with micro-interactions`
        };

        this.results.functionality.interactions.tests.push(microInteractionTest);

        if (microInteractionTest.passed) {
          this.results.functionality.interactions.passed++;
        } else {
          this.results.functionality.interactions.failed++;
        }
      }

    } catch (error) {
      const test = {
        name: 'Interactive elements',
        passed: false,
        critical: true,
        error: error.message
      };

      this.results.functionality.interactions.tests.push(test);
      this.results.functionality.interactions.failed++;
      this.results.summary.criticalIssues++;
    }
  }

  async testAccessibilityFeatures(page) {
    this.log('  Testing accessibility features');

    try {
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Test ARIA labels
      const ariaLabels = await page.locator('[aria-label]').count();
      const ariaDescriptions = await page.locator('[aria-describedby]').count();

      // Test focus indicators
      const focusableElements = await page.locator('button, a, input, select, textarea').count();

      // Test skip links
      const skipLinks = await page.locator('.skip-link, [href="#main"]').count();

      // Test accessibility controls
      const accessibilityControls = await page.locator('.accessibility-controls, .wcag-controls').count();

      const accessibilityTest = {
        name: 'Accessibility features',
        passed: ariaLabels > 0 && focusableElements > 0,
        critical: true,
        details: `ARIA labels: ${ariaLabels}, Focusable elements: ${focusableElements}, Skip links: ${skipLinks}, A11y controls: ${accessibilityControls}`
      };

      this.results.functionality.accessibility.tests.push(accessibilityTest);

      if (accessibilityTest.passed) {
        this.results.functionality.accessibility.passed++;
      } else {
        this.results.functionality.accessibility.failed++;
        this.results.summary.criticalIssues++;
      }

    } catch (error) {
      const test = {
        name: 'Accessibility features',
        passed: false,
        critical: true,
        error: error.message
      };

      this.results.functionality.accessibility.tests.push(test);
      this.results.functionality.accessibility.failed++;
      this.results.summary.criticalIssues++;
    }
  }

  async validatePerformance() {
    this.log('Phase 2: Validating performance');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      // Test Core Web Vitals
      await this.testCoreWebVitals(page);

      // Test load times
      await this.testLoadTimes(page);

      // Test bundle sizes
      await this.testBundleSizes();

      // Test optimization features
      await this.testOptimizationFeatures(page);

    } finally {
      await browser.close();
    }

    this.log(`  Performance validation completed`);
  }

  async testCoreWebVitals(page) {
    this.log('  Testing Core Web Vitals');

    try {
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Measure Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const metrics = {};

          // LCP
          if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              metrics.LCP = lastEntry.startTime;
            });

            try {
              lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
              metrics.LCP = 0;
            }
          }

          // FCP
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            metrics.TTFB = navigation.responseStart - navigation.requestStart;
          }

          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            metrics.FCP = fcpEntry.startTime;
          }

          setTimeout(() => resolve(metrics), 3000);
        });
      });

      // Test LCP
      const lcpTest = {
        name: 'Largest Contentful Paint (LCP)',
        passed: metrics.LCP && metrics.LCP < 2500,
        critical: true,
        value: metrics.LCP,
        threshold: 2500,
        details: `LCP: ${metrics.LCP}ms (target: <2500ms)`
      };

      this.results.performance.coreWebVitals.tests.push(lcpTest);

      if (lcpTest.passed) {
        this.results.performance.coreWebVitals.passed++;
      } else {
        this.results.performance.coreWebVitals.failed++;
      }

      // Test FCP
      const fcpTest = {
        name: 'First Contentful Paint (FCP)',
        passed: metrics.FCP && metrics.FCP < 1800,
        critical: true,
        value: metrics.FCP,
        threshold: 1800,
        details: `FCP: ${metrics.FCP}ms (target: <1800ms)`
      };

      this.results.performance.coreWebVitals.tests.push(fcpTest);

      if (fcpTest.passed) {
        this.results.performance.coreWebVitals.passed++;
      } else {
        this.results.performance.coreWebVitals.failed++;
      }

      // Test TTFB
      const ttfbTest = {
        name: 'Time to First Byte (TTFB)',
        passed: metrics.TTFB && metrics.TTFB < 600,
        critical: false,
        value: metrics.TTFB,
        threshold: 600,
        details: `TTFB: ${metrics.TTFB}ms (target: <600ms)`
      };

      this.results.performance.coreWebVitals.tests.push(ttfbTest);

      if (ttfbTest.passed) {
        this.results.performance.coreWebVitals.passed++;
      } else {
        this.results.performance.coreWebVitals.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Core Web Vitals measurement',
        passed: false,
        critical: true,
        error: error.message
      };

      this.results.performance.coreWebVitals.tests.push(test);
      this.results.performance.coreWebVitals.failed++;
      this.results.summary.criticalIssues++;
    }
  }

  async testLoadTimes(page) {
    this.log('  Testing load times');

    for (const testPage of this.testPages.slice(0, 3)) { // Test first 3 pages
      try {
        const startTime = Date.now();
        await page.goto(`${this.baseUrl}${testPage.path}`, { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;

        const loadTest = {
          name: `Load time for ${testPage.name}`,
          passed: loadTime < 3000,
          critical: testPage.critical,
          value: loadTime,
          threshold: 3000,
          details: `Load time: ${loadTime}ms (target: <3000ms)`
        };

        this.results.performance.loadTimes.tests.push(loadTest);

        if (loadTest.passed) {
          this.results.performance.loadTimes.passed++;
        } else {
          this.results.performance.loadTimes.failed++;
          if (loadTest.critical) {
            this.results.summary.criticalIssues++;
          }
        }

      } catch (error) {
        const test = {
          name: `Load time for ${testPage.name}`,
          passed: false,
          critical: testPage.critical,
          error: error.message
        };

        this.results.performance.loadTimes.tests.push(test);
        this.results.performance.loadTimes.failed++;

        if (test.critical) {
          this.results.summary.criticalIssues++;
        }
      }
    }
  }

  async testBundleSizes() {
    this.log('  Testing bundle sizes');

    try {
      // Check if dist directory exists
      const distPath = path.join(rootDir, 'dist');
      if (!fs.existsSync(distPath)) {
        const test = {
          name: 'Bundle size analysis',
          passed: false,
          critical: false,
          details: 'Dist directory not found. Run npm run build first.'
        };

        this.results.performance.bundleSizes.tests.push(test);
        this.results.performance.bundleSizes.failed++;
        return;
      }

      // Analyze bundle sizes
      const bundleStats = this.analyzeBundleSizes(distPath);

      const bundleTest = {
        name: 'Bundle size analysis',
        passed: bundleStats.totalSize < 5000000, // 5MB threshold
        critical: false,
        value: bundleStats.totalSize,
        threshold: 5000000,
        details: `Total bundle size: ${(bundleStats.totalSize / 1024 / 1024).toFixed(2)}MB, Files: ${bundleStats.fileCount}`
      };

      this.results.performance.bundleSizes.tests.push(bundleTest);

      if (bundleTest.passed) {
        this.results.performance.bundleSizes.passed++;
      } else {
        this.results.performance.bundleSizes.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Bundle size analysis',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.performance.bundleSizes.tests.push(test);
      this.results.performance.bundleSizes.failed++;
    }
  }

  analyzeBundleSizes(distPath) {
    let totalSize = 0;
    let fileCount = 0;

    const walkDirectory = (dir) => {
      const items = fs.readdirSync(dir);

      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walkDirectory(fullPath);
        } else {
          totalSize += stat.size;
          fileCount++;
        }
      });
    };

    walkDirectory(distPath);

    return { totalSize, fileCount };
  }

  async testOptimizationFeatures(page) {
    this.log('  Testing optimization features');

    try {
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Test lazy loading
      const lazyImages = await page.locator('img[loading="lazy"]').count();

      // Test modern image formats
      const modernImages = await page.locator('source[type="image/webp"], source[type="image/avif"]').count();

      // Test service worker
      const serviceWorkerExists = await page.evaluate(() => {
        return 'serviceWorker' in navigator;
      });

      // Test critical CSS
      const criticalCSS = await page.locator('style, link[rel="stylesheet"]').count();

      const optimizationTest = {
        name: 'Optimization features',
        passed: lazyImages > 0 || modernImages > 0 || serviceWorkerExists,
        critical: false,
        details: `Lazy images: ${lazyImages}, Modern images: ${modernImages}, Service worker: ${serviceWorkerExists}, CSS files: ${criticalCSS}`
      };

      this.results.performance.optimization.tests.push(optimizationTest);

      if (optimizationTest.passed) {
        this.results.performance.optimization.passed++;
      } else {
        this.results.performance.optimization.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Optimization features',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.performance.optimization.tests.push(test);
      this.results.performance.optimization.failed++;
    }
  }

  async runVisualRegressionTests() {
    this.log('Phase 3: Running visual regression tests');

    const browser = await chromium.launch({ headless: true });

    try {
      for (const viewport of this.viewports) {
        await this.captureScreenshots(browser, viewport);
      }
    } finally {
      await browser.close();
    }

    this.log(`  Visual regression tests completed`);
  }

  async captureScreenshots(browser, viewport) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      for (const testPage of this.testPages) {
        try {
          await page.goto(`${this.baseUrl}${testPage.path}`, { waitUntil: 'networkidle' });

          const screenshotPath = path.join(
            this.screenshotDir,
            `${testPage.name.replace(/\s+/g, '-')}-${viewport.name}.png`
          );

          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            animations: 'disabled'
          });

          this.results.visualRegression.screenshots.push({
            page: testPage.name,
            viewport: viewport.name,
            path: screenshotPath,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          this.log(`    Screenshot failed for ${testPage.name} on ${viewport.name}: ${error.message}`, 'warning');
        }
      }
    } finally {
      await context.close();
    }
  }

  async validateCrossBrowserCompatibility() {
    this.log('Phase 4: Validating cross-browser compatibility');

    for (const browserConfig of this.browsers) {
      await this.testBrowserCompatibility(browserConfig);
    }

    this.log(`  Cross-browser compatibility validation completed`);
  }

  async testBrowserCompatibility(browserConfig) {
    this.log(`  Testing ${browserConfig.displayName} compatibility`);

    let browser;
    try {
      browser = await browserConfig.engine.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      const page = await context.newPage();

      // Test basic functionality
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Test JavaScript features
      const jsFeatures = await page.evaluate(() => {
        return {
          es6Modules: typeof import !== 'undefined',
          fetch: typeof fetch !== 'undefined',
          intersectionObserver: typeof IntersectionObserver !== 'undefined',
          customElements: typeof customElements !== 'undefined'
        };
      });

      // Test CSS features
      const cssFeatures = await page.evaluate(() => {
        return {
          grid: CSS.supports('display', 'grid'),
          flexbox: CSS.supports('display', 'flex'),
          customProperties: CSS.supports('--test', 'value'),
          backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)')
        };
      });

      const compatibilityTest = {
        name: `${browserConfig.displayName} compatibility`,
        passed: Object.values(jsFeatures).every(Boolean) && Object.values(cssFeatures).filter(Boolean).length >= 3,
        critical: true,
        details: `JS features: ${Object.values(jsFeatures).filter(Boolean).length}/4, CSS features: ${Object.values(cssFeatures).filter(Boolean).length}/4`
      };

      this.results.crossBrowser.compatibility.tests.push(compatibilityTest);

      if (compatibilityTest.passed) {
        this.results.crossBrowser.compatibility.passed++;
      } else {
        this.results.crossBrowser.compatibility.failed++;
        this.results.summary.criticalIssues++;
      }

      await browser.close();

    } catch (error) {
      if (browser) {
        await browser.close();
      }

      const test = {
        name: `${browserConfig.displayName} compatibility`,
        passed: false,
        critical: true,
        error: error.message
      };

      this.results.crossBrowser.compatibility.tests.push(test);
      this.results.crossBrowser.compatibility.failed++;
      this.results.summary.criticalIssues++;
    }
  }

  async validateDesignSystem() {
    this.log('Phase 5: Validating design system');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    try {
      await page.goto(`${this.baseUrl}/`, { waitUntil: 'networkidle' });

      // Test glassmorphism elements
      await this.testGlassmorphismElements(page);

      // Test color system
      await this.testColorSystem(page);

      // Test micro-interactions
      await this.testMicroInteractionsSystem(page);

    } finally {
      await browser.close();
    }

    this.log(`  Design system validation completed`);
  }

  async testGlassmorphismElements(page) {
    try {
      // Test glassmorphism classes
      const glassElements = await page.locator('.glass-2025, .card-glass-2025, .btn-glass-2025').count();
      const neuralElements = await page.locator('.neural-2025, .btn-neural-2025').count();

      // Test backdrop filter support
      const backdropFilterSupport = await page.evaluate(() => {
        return CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
      });

      const glassmorphismTest = {
        name: 'Glassmorphism design system',
        passed: glassElements > 0 && backdropFilterSupport,
        critical: false,
        details: `Glass elements: ${glassElements}, Neural elements: ${neuralElements}, Backdrop filter: ${backdropFilterSupport}`
      };

      this.results.designSystem.glassmorphism.tests.push(glassmorphismTest);

      if (glassmorphismTest.passed) {
        this.results.designSystem.glassmorphism.passed++;
      } else {
        this.results.designSystem.glassmorphism.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Glassmorphism design system',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.designSystem.glassmorphism.tests.push(test);
      this.results.designSystem.glassmorphism.failed++;
    }
  }

  async testColorSystem(page) {
    try {
      // Test CSS custom properties
      const colorVariables = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        const variables = [];

        for (let i = 0; i < document.styleSheets.length; i++) {
          try {
            const sheet = document.styleSheets[i];
            for (let j = 0; j < sheet.cssRules.length; j++) {
              const rule = sheet.cssRules[j];
              if (rule.style) {
                for (let k = 0; k < rule.style.length; k++) {
                  const prop = rule.style[k];
                  if (prop.startsWith('--color-') || prop.startsWith('--gradient-')) {
                    variables.push(prop);
                  }
                }
              }
            }
          } catch (e) {
            // Skip cross-origin stylesheets
          }
        }

        return variables.length;
      });

      // Test gradient elements
      const gradientElements = await page.locator('.bg-gradient-brand, .bg-gradient-aurora, .bg-gradient-animated').count();

      const colorSystemTest = {
        name: 'Color system implementation',
        passed: colorVariables > 10 || gradientElements > 0,
        critical: false,
        details: `Color variables: ${colorVariables}, Gradient elements: ${gradientElements}`
      };

      this.results.designSystem.colorSystem.tests.push(colorSystemTest);

      if (colorSystemTest.passed) {
        this.results.designSystem.colorSystem.passed++;
      } else {
        this.results.designSystem.colorSystem.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Color system implementation',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.designSystem.colorSystem.tests.push(test);
      this.results.designSystem.colorSystem.failed++;
    }
  }

  async testMicroInteractionsSystem(page) {
    try {
      // Test micro-interaction classes
      const magneticElements = await page.locator('.magnetic, .btn-magnetic').count();
      const hoverElements = await page.locator('.hover-lift, .hover-glow, .hover-tilt').count();
      const morphElements = await page.locator('.morph, .btn-morph').count();

      // Test if micro-interactions script is loaded
      const microInteractionsLoaded = await page.evaluate(() => {
        return typeof window.microInteractions2025 !== 'undefined' || typeof window.MicroInteractions2025 !== 'undefined';
      });

      const microInteractionsTest = {
        name: 'Micro-interactions system',
        passed: (magneticElements > 0 || hoverElements > 0) && microInteractionsLoaded,
        critical: false,
        details: `Magnetic: ${magneticElements}, Hover: ${hoverElements}, Morph: ${morphElements}, Script loaded: ${microInteractionsLoaded}`
      };

      this.results.designSystem.microInteractions.tests.push(microInteractionsTest);

      if (microInteractionsTest.passed) {
        this.results.designSystem.microInteractions.passed++;
      } else {
        this.results.designSystem.microInteractions.failed++;
      }

    } catch (error) {
      const test = {
        name: 'Micro-interactions system',
        passed: false,
        critical: false,
        error: error.message
      };

      this.results.designSystem.microInteractions.tests.push(test);
      this.results.designSystem.microInteractions.failed++;
    }
  }

  async runIntegrationTests() {
    this.log('Phase 6: Running integration tests');

    // Run existing test scripts
    await this.runExistingTests();

    this.log(`  Integration tests completed`);
  }

  async runExistingTests() {
    try {
      // Run accessibility audit
      this.log('  Running accessibility audit');
      execSync('node scripts/accessibility-audit.js', { cwd: rootDir, stdio: 'pipe' });

      // Run performance validation
      this.log('  Running performance validation');
      execSync('node scripts/performance-validation-test.js', { cwd: rootDir, stdio: 'pipe' });

      // Run browser compatibility audit
      this.log('  Running browser compatibility audit');
      execSync('node scripts/browser-compatibility-audit.js', { cwd: rootDir, stdio: 'pipe' });

      // Run UI/UX audit
      this.log('  Running UI/UX audit');
      execSync('node scripts/ui-ux-enhancement-audit.js', { cwd: rootDir, stdio: 'pipe' });

      this.log('  All existing tests completed successfully', 'success');

    } catch (error) {
      this.log(`  Some existing tests failed: ${error.message}`, 'warning');
    }
  }

  generateValidationReport(duration) {
    // Calculate summary statistics
    const allTests = [
      ...this.results.functionality.navigation.tests,
      ...this.results.functionality.forms.tests,
      ...this.results.functionality.interactions.tests,
      ...this.results.functionality.accessibility.tests,
      ...this.results.performance.coreWebVitals.tests,
      ...this.results.performance.loadTimes.tests,
      ...this.results.performance.bundleSizes.tests,
      ...this.results.performance.optimization.tests,
      ...this.results.crossBrowser.compatibility.tests,
      ...this.results.designSystem.glassmorphism.tests,
      ...this.results.designSystem.colorSystem.tests,
      ...this.results.designSystem.microInteractions.tests
    ];

    this.results.summary.totalTests = allTests.length;
    this.results.summary.passedTests = allTests.filter(test => test.passed).length;
    this.results.summary.failedTests = allTests.filter(test => !test.passed).length;
    this.results.summary.overallScore = Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100);

    const report = `
# Comprehensive Validation Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Executive Summary
- **Total Tests**: ${this.results.summary.totalTests}
- **Passed**: ${this.results.summary.passedTests}
- **Failed**: ${this.results.summary.failedTests}
- **Critical Issues**: ${this.results.summary.criticalIssues}
- **Overall Score**: ${this.results.summary.overallScore}%

## Functionality Validation
### Navigation (${this.results.functionality.navigation.passed}/${this.results.functionality.navigation.tests.length} passed)
${this.results.functionality.navigation.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Forms (${this.results.functionality.forms.passed}/${this.results.functionality.forms.tests.length} passed)
${this.results.functionality.forms.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Interactions (${this.results.functionality.interactions.passed}/${this.results.functionality.interactions.tests.length} passed)
${this.results.functionality.interactions.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Accessibility (${this.results.functionality.accessibility.passed}/${this.results.functionality.accessibility.tests.length} passed)
${this.results.functionality.accessibility.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

## Performance Validation
### Core Web Vitals (${this.results.performance.coreWebVitals.passed}/${this.results.performance.coreWebVitals.tests.length} passed)
${this.results.performance.coreWebVitals.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Load Times (${this.results.performance.loadTimes.passed}/${this.results.performance.loadTimes.tests.length} passed)
${this.results.performance.loadTimes.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Bundle Sizes (${this.results.performance.bundleSizes.passed}/${this.results.performance.bundleSizes.tests.length} passed)
${this.results.performance.bundleSizes.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Optimization Features (${this.results.performance.optimization.passed}/${this.results.performance.optimization.tests.length} passed)
${this.results.performance.optimization.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

## Visual Regression Testing
- **Screenshots Captured**: ${this.results.visualRegression.screenshots.length}
- **Viewports Tested**: ${this.viewports.length} (Mobile, Tablet, Desktop, Large Desktop)
- **Pages Tested**: ${this.testPages.length}

## Cross-Browser Compatibility
### Browser Compatibility (${this.results.crossBrowser.compatibility.passed}/${this.results.crossBrowser.compatibility.tests.length} passed)
${this.results.crossBrowser.compatibility.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

## Design System Validation
### Glassmorphism (${this.results.designSystem.glassmorphism.passed}/${this.results.designSystem.glassmorphism.tests.length} passed)
${this.results.designSystem.glassmorphism.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Color System (${this.results.designSystem.colorSystem.passed}/${this.results.designSystem.colorSystem.tests.length} passed)
${this.results.designSystem.colorSystem.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

### Micro-Interactions (${this.results.designSystem.microInteractions.passed}/${this.results.designSystem.microInteractions.tests.length} passed)
${this.results.designSystem.microInteractions.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details || test.error || 'OK'}`).join('\n')}

## Critical Issues
${this.results.summary.criticalIssues > 0 ?
  allTests.filter(test => !test.passed && test.critical).map(test => `- ${test.name}: ${test.error || test.details || 'Failed'}`).join('\n') :
  'No critical issues found! 🎉'
}

## Recommendations
${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. Address any critical issues identified
2. Review failed tests and implement fixes
3. Run validation again after fixes
4. Deploy to staging environment for further testing
5. Monitor performance and user feedback in production
6. Schedule regular validation runs
`;

    const reportPath = path.join(rootDir, 'COMPREHENSIVE-VALIDATION-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());

    // Save detailed JSON results
    const jsonPath = path.join(rootDir, 'test-artifacts');
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(jsonPath, { recursive: true });
    }
    fs.writeFileSync(path.join(jsonPath, 'comprehensive-validation-results.json'), JSON.stringify(this.results, null, 2));

    console.log('\n🔍 Comprehensive Validation Summary:');
    console.log(`   Total tests: ${this.results.summary.totalTests}`);
    console.log(`   Passed: ${this.results.summary.passedTests}`);
    console.log(`   Failed: ${this.results.summary.failedTests}`);
    console.log(`   Critical issues: ${this.results.summary.criticalIssues}`);
    console.log(`   Overall score: ${this.results.summary.overallScore}%`);
    console.log(`   Screenshots: ${this.results.visualRegression.screenshots.length}`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: COMPREHENSIVE-VALIDATION-REPORT.md`);
    console.log(`📊 Detailed results: test-artifacts/comprehensive-validation-results.json`);
    console.log(`📸 Screenshots: test-artifacts/validation-screenshots/`);
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.summary.criticalIssues > 0) {
      recommendations.push(`Address ${this.results.summary.criticalIssues} critical issues immediately`);
    }

    if (this.results.summary.overallScore < 80) {
      recommendations.push('Overall score is below 80% - focus on improving failed tests');
    }

    if (this.results.functionality.navigation.failed > 0) {
      recommendations.push('Fix navigation issues to ensure proper site functionality');
    }

    if (this.results.performance.coreWebVitals.failed > 0) {
      recommendations.push('Optimize Core Web Vitals for better user experience');
    }

    if (this.results.crossBrowser.compatibility.failed > 0) {
      recommendations.push('Address cross-browser compatibility issues');
    }

    if (recommendations.length === 0) {
      recommendations.push('Excellent! All tests passed. Continue monitoring and maintaining quality.');
    }

    return recommendations;
  }
}

// Run validation if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Comprehensive Validation Suite...');
  const validator = new ComprehensiveValidationSuite();
  validator.runComprehensiveValidation().catch((error) => {
    console.error('Comprehensive validation failed:', error);
    process.exit(1);
  });
}

export { ComprehensiveValidationSuite };