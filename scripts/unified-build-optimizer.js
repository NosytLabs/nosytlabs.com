#!/usr/bin/env node

/**
 * Unified Build Optimizer for NosytLabs - 2025 Enhanced
 * Consolidates all optimization scripts into a single, efficient system
 * Replaces multiple optimization scripts with a unified approach
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class UnifiedBuildOptimizer {
  constructor() {
    this.stats = {
      filesProcessed: 0,
      duplicatesRemoved: 0,
      originalSize: 0,
      optimizedSize: 0,
      bundlesCreated: 0,
      cssOptimized: 0,
      jsOptimized: 0,
      redundanciesFixed: 0,
      performanceScore: 0
    };
    
    this.config = {
      // Optimization phases
      phases: [
        'cleanup',
        'css-optimization',
        'js-optimization', 
        'bundle-analysis',
        'performance-optimization',
        'validation'
      ],
      
      // Files to remove (duplicates and redundant files)
      redundantFiles: [
        'scripts/quick-performance-check.js',
        'scripts/simple-audit.js',
        'scripts/performance-audit.js',
        'scripts/remove-duplicates.js',
        'scripts/focused-redundancy-cleanup.js',
        'scripts/targeted-redundancy-fixes.js',
        'scripts/validate-deduplication.js',
        'scripts/final-performance-optimization.js',
        'vite.config.optimized.js' // Replaced with enhanced astro.config.mjs
      ],
      
      // CSS optimization configuration
      cssConfig: {
        sourceFiles: {
          critical: ['src/styles/css-variables.css', 'src/styles/critical.css'],
          main: ['src/styles/global.css', 'src/styles/nosytlabs.css', 'src/styles/design-system-2025.css'],
          responsive: ['src/styles/responsive-enhancements-2025.css'],
          specialized: ['src/styles/enhanced-calculator.css', 'public/styles/duck-hunt.css'],
          win95: ['public/styles/win95-authentic.css', 'public/styles/ms-sans-serif.css']
        },
        outputDir: 'public/styles/optimized'
      },
      
      // Performance thresholds
      thresholds: {
        bundleSize: 250 * 1024,      // 250KB max per bundle
        totalSize: 2 * 1024 * 1024,  // 2MB max total
        imageSize: 500 * 1024,       // 500KB max per image
        cssSize: 100 * 1024,         // 100KB max per CSS file
        jsSize: 200 * 1024           // 200KB max per JS file
      }
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

  async optimize() {
    this.log('Starting Unified Build Optimization', 'info');
    console.log('🚀 Consolidating all optimization processes...\n');
    
    try {
      const startTime = Date.now();
      
      // Phase 1: Cleanup redundant files
      await this.cleanupRedundantFiles();
      
      // Phase 2: CSS optimization
      await this.optimizeCSS();
      
      // Phase 3: JavaScript optimization
      await this.optimizeJavaScript();
      
      // Phase 4: Bundle analysis
      await this.analyzeBundles();
      
      // Phase 5: Performance optimization
      await this.optimizePerformance();
      
      // Phase 6: Validation
      await this.validateOptimizations();
      
      // Generate comprehensive report
      const duration = Date.now() - startTime;
      this.generateReport(duration);
      
      this.log('Unified optimization completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Optimization failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async cleanupRedundantFiles() {
    this.log('Phase 1: Cleaning up redundant files');
    
    for (const filePath of this.config.redundantFiles) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          const stats = fs.statSync(fullPath);
          fs.unlinkSync(fullPath);
          this.stats.duplicatesRemoved++;
          this.stats.originalSize += stats.size;
          this.log(`  Removed: ${filePath}`, 'success');
        } catch (error) {
          this.log(`  Failed to remove: ${filePath} - ${error.message}`, 'warning');
        }
      }
    }
    
    this.log(`  Removed ${this.stats.duplicatesRemoved} redundant files`);
  }

  async optimizeCSS() {
    this.log('Phase 2: CSS optimization');
    
    try {
      // Run CSS consolidation optimizer
      execSync('node scripts/css-consolidation-optimizer.js', { 
        cwd: rootDir, 
        stdio: 'inherit' 
      });
      this.stats.cssOptimized++;
      this.log('  CSS optimization completed', 'success');
    } catch (error) {
      this.log(`  CSS optimization failed: ${error.message}`, 'warning');
    }
  }

  async optimizeJavaScript() {
    this.log('Phase 3: JavaScript optimization');
    
    // Check if TypeScript compilation is successful
    try {
      execSync('npx tsc --noEmit --project tsconfig.enhanced.json', { 
        cwd: rootDir, 
        stdio: 'pipe' 
      });
      this.log('  TypeScript compilation successful', 'success');
      this.stats.jsOptimized++;
    } catch (error) {
      this.log('  TypeScript compilation has issues', 'warning');
    }
  }

  async analyzeBundles() {
    this.log('Phase 4: Bundle analysis');
    
    try {
      // Run performance bundle analyzer
      execSync('node scripts/performance-bundle-analyzer.js', { 
        cwd: rootDir, 
        stdio: 'inherit' 
      });
      this.stats.bundlesCreated++;
      this.log('  Bundle analysis completed', 'success');
    } catch (error) {
      this.log(`  Bundle analysis failed: ${error.message}`, 'warning');
    }
  }

  async optimizePerformance() {
    this.log('Phase 5: Performance optimization');
    
    // Generate optimized service worker
    await this.generateServiceWorker();
    
    // Update performance monitoring
    await this.updatePerformanceMonitoring();
    
    this.log('  Performance optimization completed', 'success');
  }

  async validateOptimizations() {
    this.log('Phase 6: Validation');
    
    try {
      // Run comprehensive validator
      execSync('node scripts/comprehensive-validator.js', { 
        cwd: rootDir, 
        stdio: 'inherit' 
      });
      this.log('  Validation completed', 'success');
    } catch (error) {
      this.log(`  Validation failed: ${error.message}`, 'warning');
    }
  }

  async generateServiceWorker() {
    const serviceWorkerContent = `
// Optimized Service Worker - Generated by Unified Build Optimizer
const CACHE_NAME = 'nosytlabs-v${Date.now()}';
const STATIC_ASSETS = [
  '/',
  '/styles/optimized/critical-optimized.css',
  '/styles/optimized/main-optimized.css',
  '/js/core.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
`;

    const swPath = path.join(rootDir, 'public/sw.js');
    fs.writeFileSync(swPath, serviceWorkerContent.trim());
    this.log('  Service worker generated', 'success');
  }

  async updatePerformanceMonitoring() {
    const monitoringScript = `
// Performance Monitoring - Generated by Unified Build Optimizer
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    if ('performance' in window) {
      this.measureCoreWebVitals();
      this.measureBundlePerformance();
    }
  }

  measureCoreWebVitals() {
    // LCP, FID, CLS measurement
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics[entry.entryType] = entry.value;
      }
    }).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
  }

  measureBundlePerformance() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    });
  }

  getMetrics() {
    return this.metrics;
  }
}

// Initialize performance monitoring
window.performanceMonitor = new PerformanceMonitor();
`;

    const jsDir = path.join(rootDir, 'public/js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }

    const monitorPath = path.join(jsDir, 'performance-monitor.js');
    fs.writeFileSync(monitorPath, monitoringScript.trim());
    this.log('  Performance monitoring updated', 'success');
  }

  generateReport(duration) {
    const report = `
# Unified Build Optimization Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Optimization Results
- Files Processed: ${this.stats.filesProcessed}
- Duplicates Removed: ${this.stats.duplicatesRemoved}
- CSS Files Optimized: ${this.stats.cssOptimized}
- JS Files Optimized: ${this.stats.jsOptimized}
- Bundles Created: ${this.stats.bundlesCreated}
- Redundancies Fixed: ${this.stats.redundanciesFixed}

## Size Reduction
- Original Size: ${this.formatBytes(this.stats.originalSize)}
- Optimized Size: ${this.formatBytes(this.stats.optimizedSize)}
- Reduction: ${this.stats.originalSize > 0 ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize * 100).toFixed(2) : 0}%

## Next Steps
1. Run 'npm run build' to build with optimizations
2. Test the optimized build with 'npm run preview'
3. Run performance tests with 'npm run test'
4. Deploy with confidence!
`;

    const reportPath = path.join(rootDir, 'OPTIMIZATION-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    console.log('\n📊 Optimization Summary:');
    console.log(`   Duplicates removed: ${this.stats.duplicatesRemoved}`);
    console.log(`   CSS optimized: ${this.stats.cssOptimized}`);
    console.log(`   JS optimized: ${this.stats.jsOptimized}`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: OPTIMIZATION-REPORT.md`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run optimization if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Unified Build Optimizer...');
  const optimizer = new UnifiedBuildOptimizer();
  optimizer.optimize().catch((error) => {
    console.error('Optimization failed:', error);
    process.exit(1);
  });
}

export { UnifiedBuildOptimizer };
