#!/usr/bin/env node

/**
 * Playwright Visual Testing Script
 * Tests visual elements, responsiveness, and user interactions
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🎭 NosytLabs Playwright Visual Testing\n');

class VisualTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      screenshots: []
    };
  }

  /**
   * Initialize browser and page
   */
  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    
    // Set viewport for desktop testing
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Run visual tests
   */
  async runTests() {
    console.log('🚀 Starting visual tests...\n');

    try {
      await this.init();
      
      // Test if we can access a local server
      const testUrls = [
        'http://localhost:4321',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080'
      ];

      let workingUrl = null;
      for (const url of testUrls) {
        try {
          await this.page.goto(url, { timeout: 5000 });
          const title = await this.page.title();
          if (title && !title.includes('Upgrade Required') && !title.includes('OMA AI')) {
            workingUrl = url;
            break;
          }
        } catch (error) {
          // Continue to next URL
        }
      }

      if (workingUrl) {
        console.log(`✅ Found working server at ${workingUrl}`);
        await this.testLivePages(workingUrl);
      } else {
        console.log('⚠️  No live server found, running static file tests...');
        await this.testStaticFiles();
      }

      await this.generateReport();

    } catch (error) {
      console.error('❌ Error during testing:', error.message);
      this.results.failed.push(`❌ Testing error: ${error.message}`);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }

    console.log('\n✅ Visual testing completed!');
  }

  /**
   * Test live pages
   */
  async testLivePages(baseUrl) {
    console.log('🌐 Testing live pages...');

    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/about', name: 'About' },
      { path: '/services', name: 'Services' },
      { path: '/projects', name: 'Projects' },
      { path: '/content-creation', name: 'Content Creation' }
    ];

    for (const pageInfo of pages) {
      try {
        const url = `${baseUrl}${pageInfo.path}`;
        await this.page.goto(url, { waitUntil: 'networkidle' });

        // Test page load
        const title = await this.page.title();
        if (title && title.length > 0) {
          this.results.passed.push(`✅ ${pageInfo.name}: Page loads successfully`);
        } else {
          this.results.failed.push(`❌ ${pageInfo.name}: Page failed to load or has no title`);
        }

        // Test for NosytLabs branding
        const hasNosytLabs = await this.page.locator('text=NosytLabs').count() > 0;
        if (hasNosytLabs) {
          this.results.passed.push(`✅ ${pageInfo.name}: Contains NosytLabs branding`);
        } else {
          this.results.failed.push(`❌ ${pageInfo.name}: Missing NosytLabs branding`);
        }

        // Test responsive design
        await this.testResponsiveness(pageInfo.name);

        // Take screenshot
        const screenshotPath = path.join(rootDir, 'test-screenshots', `${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png`);
        await this.ensureDirectoryExists(path.dirname(screenshotPath));
        await this.page.screenshot({ path: screenshotPath, fullPage: true });
        this.results.screenshots.push(screenshotPath);

      } catch (error) {
        this.results.failed.push(`❌ ${pageInfo.name}: Error testing page - ${error.message}`);
      }
    }
  }

  /**
   * Test responsiveness
   */
  async testResponsiveness(pageName) {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      try {
        await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
        await this.page.waitForTimeout(1000); // Allow layout to adjust

        // Check if navigation is accessible
        const navVisible = await this.page.locator('nav').isVisible();
        if (navVisible) {
          this.results.passed.push(`✅ ${pageName}: Navigation visible on ${viewport.name}`);
        } else {
          this.results.warnings.push(`⚠️  ${pageName}: Navigation not visible on ${viewport.name}`);
        }

        // Check for horizontal scroll
        const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
        if (bodyWidth <= viewport.width + 20) { // Allow small tolerance
          this.results.passed.push(`✅ ${pageName}: No horizontal scroll on ${viewport.name}`);
        } else {
          this.results.warnings.push(`⚠️  ${pageName}: Horizontal scroll detected on ${viewport.name}`);
        }

      } catch (error) {
        this.results.warnings.push(`⚠️  ${pageName}: Error testing ${viewport.name} viewport - ${error.message}`);
      }
    }

    // Reset to desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  /**
   * Test static files when no server is available
   */
  async testStaticFiles() {
    console.log('📁 Testing static file structure...');

    // Check if dist directory exists (built files)
    const distPath = path.join(rootDir, 'dist');
    if (fs.existsSync(distPath)) {
      this.results.passed.push('✅ Static: Dist directory exists');
      
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        this.results.passed.push('✅ Static: Index.html exists in dist');
        
        // Test index.html content
        const content = fs.readFileSync(indexPath, 'utf8');
        if (content.includes('NosytLabs')) {
          this.results.passed.push('✅ Static: Index.html contains NosytLabs branding');
        } else {
          this.results.failed.push('❌ Static: Index.html missing NosytLabs branding');
        }
      } else {
        this.results.failed.push('❌ Static: Index.html not found in dist');
      }
    } else {
      this.results.warnings.push('⚠️  Static: Dist directory not found - site may not be built');
    }

    // Test source files
    const srcPages = [
      'src/pages/index.astro',
      'src/pages/about.astro',
      'src/pages/services.astro',
      'src/pages/projects.astro',
      'src/pages/content-creation.astro'
    ];

    for (const page of srcPages) {
      const filePath = path.join(rootDir, page);
      if (fs.existsSync(filePath)) {
        this.results.passed.push(`✅ Static: Source file exists - ${page}`);
      } else {
        this.results.failed.push(`❌ Static: Source file missing - ${page}`);
      }
    }
  }

  /**
   * Ensure directory exists
   */
  async ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Generate test report
   */
  async generateReport() {
    console.log('\n📋 Visual Test Report\n');
    console.log('=' .repeat(60));

    const totalTests = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const passRate = totalTests > 0 ? Math.round((this.results.passed.length / totalTests) * 100) : 0;

    console.log(`\n🎯 Summary:`);
    console.log(`   Passed: ${this.results.passed.length}`);
    console.log(`   Failed: ${this.results.failed.length}`);
    console.log(`   Warnings: ${this.results.warnings.length}`);
    console.log(`   Screenshots: ${this.results.screenshots.length}`);
    console.log(`   Pass Rate: ${passRate}%`);

    if (this.results.failed.length > 0) {
      console.log(`\n❌ Failed Tests (${this.results.failed.length}):`);
      this.results.failed.forEach(test => console.log(`   ${test}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.results.warnings.length}):`);
      this.results.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (this.results.passed.length > 0) {
      console.log(`\n✅ Passed Tests (${this.results.passed.length}):`);
      this.results.passed.forEach(test => console.log(`   ${test}`));
    }

    if (this.results.screenshots.length > 0) {
      console.log(`\n📸 Screenshots saved:`);
      this.results.screenshots.forEach(screenshot => console.log(`   ${screenshot}`));
    }

    // Overall assessment
    console.log(`\n🏆 Overall Visual Assessment:`);
    
    if (passRate >= 90) {
      console.log('   Status: ✅ Excellent - Visual design and functionality are solid');
    } else if (passRate >= 75) {
      console.log('   Status: ✅ Good - Minor visual issues detected');
    } else if (passRate >= 60) {
      console.log('   Status: ⚠️  Fair - Visual improvements needed');
    } else {
      console.log('   Status: ❌ Poor - Significant visual issues found');
    }

    console.log('\n' + '=' .repeat(60));
  }
}

// Run the visual tests
const tester = new VisualTester();
tester.runTests().catch(console.error);
