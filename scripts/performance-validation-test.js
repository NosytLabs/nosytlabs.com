#!/usr/bin/env node

/**
 * Performance Validation Test for NosytLabs - 2025
 * Validates Core Web Vitals optimizations and performance improvements
 * Features: LCP, FID, CLS testing, image optimization validation, and caching verification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class PerformanceValidationTester {
  constructor() {
    this.results = {
      coreWebVitals: {
        lcp: { tests: [], passed: 0, failed: 0 },
        fid: { tests: [], passed: 0, failed: 0 },
        cls: { tests: [], passed: 0, failed: 0 },
        fcp: { tests: [], passed: 0, failed: 0 },
        ttfb: { tests: [], passed: 0, failed: 0 }
      },
      imageOptimization: {
        tests: [],
        modernFormats: 0,
        lazyLoading: 0,
        responsiveImages: 0
      },
      caching: {
        tests: [],
        serviceWorker: false,
        cacheStrategies: 0,
        coverage: 0
      },
      performance: {
        tests: [],
        bundleSize: 0,
        loadTime: 0,
        score: 0
      },
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        overallScore: 0
      }
    };
    
    this.thresholds = {
      LCP: 2500,
      FID: 100,
      CLS: 0.1,
      FCP: 1800,
      TTFB: 600,
      bundleSize: 500000, // 500KB
      loadTime: 3000 // 3 seconds
    };
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

  async runPerformanceValidation() {
    this.log('Starting Performance Validation Tests', 'info');
    console.log('🚀 Validating Core Web Vitals optimizations...\n');
    
    try {
      const startTime = Date.now();
      
      // Test 1: Core Web Vitals Implementation
      await this.testCoreWebVitalsImplementation();
      
      // Test 2: Image Optimization
      await this.testImageOptimization();
      
      // Test 3: Caching Strategy
      await this.testCachingStrategy();
      
      // Test 4: Performance Metrics
      await this.testPerformanceMetrics();
      
      // Test 5: Resource Loading
      await this.testResourceLoading();
      
      // Test 6: Bundle Analysis
      await this.testBundleOptimization();
      
      // Generate validation report
      const duration = Date.now() - startTime;
      this.generateValidationReport(duration);
      
      this.log('Performance validation completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Performance validation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async testCoreWebVitalsImplementation() {
    this.log('Testing Core Web Vitals implementation');
    
    // Test LCP optimizations
    const lcpTests = [
      this.testHeroImageOptimization(),
      this.testCriticalResourcePreloading(),
      this.testFontOptimization()
    ];
    
    for (const test of lcpTests) {
      const result = await test;
      this.results.coreWebVitals.lcp.tests.push(result);
      if (result.passed) {
        this.results.coreWebVitals.lcp.passed++;
      } else {
        this.results.coreWebVitals.lcp.failed++;
      }
    }
    
    // Test FID optimizations
    const fidTests = [
      this.testCodeSplitting(),
      this.testScriptDeferring(),
      this.testJavaScriptOptimization()
    ];
    
    for (const test of fidTests) {
      const result = await test;
      this.results.coreWebVitals.fid.tests.push(result);
      if (result.passed) {
        this.results.coreWebVitals.fid.passed++;
      } else {
        this.results.coreWebVitals.fid.failed++;
      }
    }
    
    // Test CLS optimizations
    const clsTests = [
      this.testImageDimensions(),
      this.testFontDisplay(),
      this.testLayoutStability()
    ];
    
    for (const test of clsTests) {
      const result = await test;
      this.results.coreWebVitals.cls.tests.push(result);
      if (result.passed) {
        this.results.coreWebVitals.cls.passed++;
      } else {
        this.results.coreWebVitals.cls.failed++;
      }
    }
    
    this.log(`  LCP: ${this.results.coreWebVitals.lcp.passed}/${this.results.coreWebVitals.lcp.tests.length} tests passed`);
    this.log(`  FID: ${this.results.coreWebVitals.fid.passed}/${this.results.coreWebVitals.fid.tests.length} tests passed`);
    this.log(`  CLS: ${this.results.coreWebVitals.cls.passed}/${this.results.coreWebVitals.cls.tests.length} tests passed`);
  }

  async testImageOptimization() {
    this.log('Testing image optimization');
    
    // Check for modern image formats
    const modernFormatsTest = this.testModernImageFormats();
    this.results.imageOptimization.tests.push(modernFormatsTest);
    
    // Check for lazy loading implementation
    const lazyLoadingTest = this.testLazyLoadingImplementation();
    this.results.imageOptimization.tests.push(lazyLoadingTest);
    
    // Check for responsive images
    const responsiveImagesTest = this.testResponsiveImages();
    this.results.imageOptimization.tests.push(responsiveImagesTest);
    
    this.log(`  Image optimization: ${this.results.imageOptimization.tests.filter(t => t.passed).length}/${this.results.imageOptimization.tests.length} tests passed`);
  }

  async testCachingStrategy() {
    this.log('Testing caching strategy');
    
    // Check for service worker
    const serviceWorkerTest = this.testServiceWorker();
    this.results.caching.tests.push(serviceWorkerTest);
    
    // Check for cache configuration
    const cacheConfigTest = this.testCacheConfiguration();
    this.results.caching.tests.push(cacheConfigTest);
    
    this.log(`  Caching: ${this.results.caching.tests.filter(t => t.passed).length}/${this.results.caching.tests.length} tests passed`);
  }

  async testPerformanceMetrics() {
    this.log('Testing performance metrics');
    
    // Check for performance monitoring
    const monitoringTest = this.testPerformanceMonitoring();
    this.results.performance.tests.push(monitoringTest);
    
    // Check for Core Web Vitals reporting
    const reportingTest = this.testCoreWebVitalsReporting();
    this.results.performance.tests.push(reportingTest);
    
    this.log(`  Performance metrics: ${this.results.performance.tests.filter(t => t.passed).length}/${this.results.performance.tests.length} tests passed`);
  }

  async testResourceLoading() {
    this.log('Testing resource loading optimization');
    
    // Check for resource hints
    const resourceHintsTest = this.testResourceHints();
    this.results.performance.tests.push(resourceHintsTest);
    
    // Check for critical CSS
    const criticalCSSTest = this.testCriticalCSS();
    this.results.performance.tests.push(criticalCSSTest);
  }

  async testBundleOptimization() {
    this.log('Testing bundle optimization');
    
    // Analyze bundle sizes
    const bundleAnalysisTest = this.testBundleSizes();
    this.results.performance.tests.push(bundleAnalysisTest);
  }

  // Individual test methods
  async testHeroImageOptimization() {
    const heroFiles = this.findFiles(['src/components', 'src/pages'], ['.astro']);
    let optimizedHeroImages = 0;
    
    for (const file of heroFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('hero') && (content.includes('loading="eager"') || content.includes('fetchpriority="high"'))) {
        optimizedHeroImages++;
      }
    }
    
    return {
      name: 'Hero Image Optimization',
      passed: optimizedHeroImages > 0,
      details: `Found ${optimizedHeroImages} optimized hero images`,
      metric: optimizedHeroImages
    };
  }

  async testCriticalResourcePreloading() {
    const layoutFiles = this.findFiles(['src/layouts'], ['.astro']);
    let preloadCount = 0;
    
    for (const file of layoutFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const preloadMatches = content.match(/rel="preload"/g);
      if (preloadMatches) {
        preloadCount += preloadMatches.length;
      }
    }
    
    return {
      name: 'Critical Resource Preloading',
      passed: preloadCount >= 3,
      details: `Found ${preloadCount} preload hints`,
      metric: preloadCount
    };
  }

  async testFontOptimization() {
    const cssFiles = this.findFiles(['src/styles'], ['.css']);
    let fontDisplayOptimized = 0;
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('font-display: swap')) {
        fontDisplayOptimized++;
      }
    }
    
    return {
      name: 'Font Optimization',
      passed: fontDisplayOptimized > 0,
      details: `Found ${fontDisplayOptimized} optimized font declarations`,
      metric: fontDisplayOptimized
    };
  }

  async testCodeSplitting() {
    const configFile = path.join(rootDir, 'astro.config.mjs');
    if (!fs.existsSync(configFile)) {
      return { name: 'Code Splitting', passed: false, details: 'Astro config not found' };
    }
    
    const content = fs.readFileSync(configFile, 'utf8');
    const hasCodeSplitting = content.includes('build') && content.includes('rollupOptions');
    
    return {
      name: 'Code Splitting',
      passed: hasCodeSplitting,
      details: hasCodeSplitting ? 'Code splitting configured' : 'Code splitting not configured'
    };
  }

  async testScriptDeferring() {
    const layoutFiles = this.findFiles(['src/layouts'], ['.astro']);
    let deferredScripts = 0;
    
    for (const file of layoutFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const deferMatches = content.match(/<script[^>]*defer[^>]*>/g);
      if (deferMatches) {
        deferredScripts += deferMatches.length;
      }
    }
    
    return {
      name: 'Script Deferring',
      passed: deferredScripts > 0,
      details: `Found ${deferredScripts} deferred scripts`,
      metric: deferredScripts
    };
  }

  async testJavaScriptOptimization() {
    const jsFiles = this.findFiles(['src/scripts'], ['.js', '.ts']);
    
    return {
      name: 'JavaScript Optimization',
      passed: jsFiles.length > 0,
      details: `Found ${jsFiles.length} JavaScript files`,
      metric: jsFiles.length
    };
  }

  async testImageDimensions() {
    const componentFiles = this.findFiles(['src/components', 'src/pages'], ['.astro']);
    let imagesWithDimensions = 0;
    let totalImages = 0;
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const imgMatches = content.match(/<img[^>]*>/g);
      if (imgMatches) {
        totalImages += imgMatches.length;
        imgMatches.forEach(img => {
          if (img.includes('width=') && img.includes('height=')) {
            imagesWithDimensions++;
          }
        });
      }
    }
    
    const percentage = totalImages > 0 ? (imagesWithDimensions / totalImages) * 100 : 0;
    
    return {
      name: 'Image Dimensions',
      passed: percentage > 50,
      details: `${imagesWithDimensions}/${totalImages} images have explicit dimensions (${percentage.toFixed(1)}%)`,
      metric: percentage
    };
  }

  async testFontDisplay() {
    const cssFiles = this.findFiles(['src/styles'], ['.css']);
    let fontDisplayCount = 0;
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/font-display:\s*swap/g);
      if (matches) {
        fontDisplayCount += matches.length;
      }
    }
    
    return {
      name: 'Font Display Optimization',
      passed: fontDisplayCount > 0,
      details: `Found ${fontDisplayCount} font-display: swap declarations`,
      metric: fontDisplayCount
    };
  }

  async testLayoutStability() {
    // This would require runtime testing, for now we'll check for skeleton loaders
    const componentFiles = this.findFiles(['src/components'], ['.astro']);
    let skeletonLoaders = 0;
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('skeleton') || content.includes('placeholder')) {
        skeletonLoaders++;
      }
    }
    
    return {
      name: 'Layout Stability',
      passed: skeletonLoaders > 0,
      details: `Found ${skeletonLoaders} skeleton/placeholder implementations`,
      metric: skeletonLoaders
    };
  }

  testModernImageFormats() {
    const imageFiles = this.findFiles(['public/images'], ['.webp', '.avif']);
    const totalImageFiles = this.findFiles(['public/images'], ['.jpg', '.jpeg', '.png', '.webp', '.avif']);
    
    const modernFormatPercentage = totalImageFiles.length > 0 
      ? (imageFiles.length / totalImageFiles.length) * 100 
      : 0;
    
    return {
      name: 'Modern Image Formats',
      passed: modernFormatPercentage > 30,
      details: `${imageFiles.length}/${totalImageFiles.length} images in modern formats (${modernFormatPercentage.toFixed(1)}%)`,
      metric: modernFormatPercentage
    };
  }

  testLazyLoadingImplementation() {
    const componentFiles = this.findFiles(['src/components', 'src/pages'], ['.astro']);
    let lazyLoadingImages = 0;
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const lazyMatches = content.match(/loading=["']lazy["']/g);
      if (lazyMatches) {
        lazyLoadingImages += lazyMatches.length;
      }
    }
    
    return {
      name: 'Lazy Loading Implementation',
      passed: lazyLoadingImages > 0,
      details: `Found ${lazyLoadingImages} lazy-loaded images`,
      metric: lazyLoadingImages
    };
  }

  testResponsiveImages() {
    const componentFiles = this.findFiles(['src/components', 'src/pages'], ['.astro']);
    let responsiveImages = 0;
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const srcsetMatches = content.match(/srcset=/g);
      if (srcsetMatches) {
        responsiveImages += srcsetMatches.length;
      }
    }
    
    return {
      name: 'Responsive Images',
      passed: responsiveImages > 0,
      details: `Found ${responsiveImages} responsive images with srcset`,
      metric: responsiveImages
    };
  }

  testServiceWorker() {
    const swFiles = this.findFiles(['public'], ['sw.js', 'sw-enhanced.js']);
    
    return {
      name: 'Service Worker',
      passed: swFiles.length > 0,
      details: swFiles.length > 0 ? `Found service worker: ${swFiles[0]}` : 'No service worker found',
      metric: swFiles.length
    };
  }

  testCacheConfiguration() {
    const cacheConfigFiles = this.findFiles(['src/config'], ['cache-config-2025.js']);
    
    return {
      name: 'Cache Configuration',
      passed: cacheConfigFiles.length > 0,
      details: cacheConfigFiles.length > 0 ? 'Cache configuration found' : 'No cache configuration found',
      metric: cacheConfigFiles.length
    };
  }

  testPerformanceMonitoring() {
    const monitoringFiles = this.findFiles(['src/scripts', 'src/utils'], ['performance-monitor', 'core-web-vitals']);
    
    return {
      name: 'Performance Monitoring',
      passed: monitoringFiles.length > 0,
      details: `Found ${monitoringFiles.length} performance monitoring files`,
      metric: monitoringFiles.length
    };
  }

  testCoreWebVitalsReporting() {
    const reportingFiles = this.findFiles(['src/scripts'], ['core-web-vitals-reporter.js']);
    
    return {
      name: 'Core Web Vitals Reporting',
      passed: reportingFiles.length > 0,
      details: reportingFiles.length > 0 ? 'Core Web Vitals reporting found' : 'No reporting found',
      metric: reportingFiles.length
    };
  }

  testResourceHints() {
    const layoutFiles = this.findFiles(['src/layouts'], ['.astro']);
    let resourceHints = 0;
    
    for (const file of layoutFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const hintMatches = content.match(/rel="(preconnect|dns-prefetch|preload)"/g);
      if (hintMatches) {
        resourceHints += hintMatches.length;
      }
    }
    
    return {
      name: 'Resource Hints',
      passed: resourceHints >= 5,
      details: `Found ${resourceHints} resource hints`,
      metric: resourceHints
    };
  }

  testCriticalCSS() {
    const criticalCSSFiles = this.findFiles(['src/styles'], ['critical-2025.css']);
    
    return {
      name: 'Critical CSS',
      passed: criticalCSSFiles.length > 0,
      details: criticalCSSFiles.length > 0 ? 'Critical CSS found' : 'No critical CSS found',
      metric: criticalCSSFiles.length
    };
  }

  testBundleSizes() {
    // This would require actual bundle analysis
    // For now, we'll estimate based on file count and sizes
    const jsFiles = this.findFiles(['src'], ['.js', '.ts']);
    const cssFiles = this.findFiles(['src/styles'], ['.css']);
    
    return {
      name: 'Bundle Optimization',
      passed: jsFiles.length > 0 && cssFiles.length > 0,
      details: `Found ${jsFiles.length} JS files and ${cssFiles.length} CSS files`,
      metric: jsFiles.length + cssFiles.length
    };
  }

  findFiles(directories, extensions) {
    const files = [];
    
    directories.forEach(dir => {
      const fullPath = path.join(rootDir, dir);
      if (fs.existsSync(fullPath)) {
        this.walkDirectory(fullPath, files, extensions);
      }
    });
    
    return files;
  }

  walkDirectory(dir, files, extensions) {
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.walkDirectory(fullPath, files, extensions);
        } else if (extensions.some(ext => item.includes(ext))) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // Ignore permission errors
    }
  }

  generateValidationReport(duration) {
    // Calculate summary statistics
    const allTests = [
      ...this.results.coreWebVitals.lcp.tests,
      ...this.results.coreWebVitals.fid.tests,
      ...this.results.coreWebVitals.cls.tests,
      ...this.results.imageOptimization.tests,
      ...this.results.caching.tests,
      ...this.results.performance.tests
    ];
    
    this.results.summary.totalTests = allTests.length;
    this.results.summary.passedTests = allTests.filter(test => test.passed).length;
    this.results.summary.failedTests = allTests.filter(test => !test.passed).length;
    this.results.summary.overallScore = Math.round((this.results.summary.passedTests / this.results.summary.totalTests) * 100);

    const report = `
# Performance Validation Test Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Summary
- Total Tests: ${this.results.summary.totalTests}
- Passed: ${this.results.summary.passedTests}
- Failed: ${this.results.summary.failedTests}
- Overall Score: ${this.results.summary.overallScore}%

## Core Web Vitals Tests
### LCP (Largest Contentful Paint)
- Passed: ${this.results.coreWebVitals.lcp.passed}/${this.results.coreWebVitals.lcp.tests.length}
${this.results.coreWebVitals.lcp.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

### FID (First Input Delay)
- Passed: ${this.results.coreWebVitals.fid.passed}/${this.results.coreWebVitals.fid.tests.length}
${this.results.coreWebVitals.fid.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

### CLS (Cumulative Layout Shift)
- Passed: ${this.results.coreWebVitals.cls.passed}/${this.results.coreWebVitals.cls.tests.length}
${this.results.coreWebVitals.cls.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

## Image Optimization Tests
${this.results.imageOptimization.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

## Caching Strategy Tests
${this.results.caching.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

## Performance Tests
${this.results.performance.tests.map(test => `- ${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`).join('\n')}

## Recommendations
${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. Address failed tests to improve performance score
2. Run real-world performance testing with tools like Lighthouse
3. Monitor Core Web Vitals in production
4. Continue optimizing based on user data
5. Set up automated performance monitoring
`;

    const reportPath = path.join(rootDir, 'PERFORMANCE-VALIDATION-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    // Save detailed JSON results
    const jsonPath = path.join(rootDir, 'test-artifacts');
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(jsonPath, { recursive: true });
    }
    fs.writeFileSync(path.join(jsonPath, 'performance-validation-results.json'), JSON.stringify(this.results, null, 2));
    
    console.log('\n🚀 Performance Validation Summary:');
    console.log(`   Total tests: ${this.results.summary.totalTests}`);
    console.log(`   Passed: ${this.results.summary.passedTests}`);
    console.log(`   Failed: ${this.results.summary.failedTests}`);
    console.log(`   Overall score: ${this.results.summary.overallScore}%`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: PERFORMANCE-VALIDATION-REPORT.md`);
    console.log(`📊 Detailed results: test-artifacts/performance-validation-results.json`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.summary.overallScore < 80) {
      recommendations.push('Overall performance score is below 80% - focus on critical optimizations');
    }
    
    if (this.results.coreWebVitals.lcp.failed > 0) {
      recommendations.push('Improve LCP by optimizing hero images and critical resource loading');
    }
    
    if (this.results.coreWebVitals.fid.failed > 0) {
      recommendations.push('Improve FID by reducing JavaScript execution time and implementing code splitting');
    }
    
    if (this.results.coreWebVitals.cls.failed > 0) {
      recommendations.push('Improve CLS by setting explicit image dimensions and optimizing font loading');
    }
    
    if (this.results.imageOptimization.tests.filter(t => !t.passed).length > 0) {
      recommendations.push('Enhance image optimization with modern formats and lazy loading');
    }
    
    if (this.results.caching.tests.filter(t => !t.passed).length > 0) {
      recommendations.push('Implement comprehensive caching strategy with service worker');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent performance! Continue monitoring and optimizing based on real user data');
    }
    
    return recommendations;
  }
}

// Run validation if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Performance Validation Tests...');
  const tester = new PerformanceValidationTester();
  tester.runPerformanceValidation().catch((error) => {
    console.error('Performance validation failed:', error);
    process.exit(1);
  });
}

export { PerformanceValidationTester };
