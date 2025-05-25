#!/usr/bin/env node

/**
 * Performance Monitoring & Continuous Optimization
 * Monitors repository performance and suggests optimizations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fileCount: {},
      bundleSizes: {},
      duplicates: [],
      suggestions: []
    };
  }

  async analyzeRepository() {
    console.log('🔍 Analyzing repository performance...\n');
    
    // Analyze file structure
    await this.analyzeFileStructure();
    
    // Check bundle sizes
    await this.analyzeBundleSizes();
    
    // Look for potential optimizations
    await this.findOptimizationOpportunities();
    
    // Generate report
    await this.generatePerformanceReport();
    
    console.log('✅ Performance analysis complete!\n');
  }

  async analyzeFileStructure() {
    console.log('📁 Analyzing file structure...');
    
    const directories = [
      'public/scripts',
      'public/styles', 
      'public/images',
      'src'
    ];
    
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = this.countFiles(dir);
        this.metrics.fileCount[dir] = files;
        console.log(`  ${dir}: ${files.total} files (${files.js} JS, ${files.css} CSS, ${files.images} images)`);
      }
    });
  }

  countFiles(directory) {
    const counts = { total: 0, js: 0, css: 0, images: 0 };
    
    const traverse = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.isDirectory()) {
          traverse(path.join(dir, item.name));
        } else {
          counts.total++;
          const ext = path.extname(item.name).toLowerCase();
          
          if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            counts.js++;
          } else if (['.css', '.scss', '.sass'].includes(ext)) {
            counts.css++;
          } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'].includes(ext)) {
            counts.images++;
          }
        }
      });
    };
    
    traverse(directory);
    return counts;
  }

  async analyzeBundleSizes() {
    console.log('\n📦 Analyzing bundle sizes...');
    
    const bundleDir = 'public/scripts/bundles';
    if (fs.existsSync(bundleDir)) {
      const bundles = fs.readdirSync(bundleDir).filter(f => f.endsWith('.js'));
      
      bundles.forEach(bundle => {
        const filePath = path.join(bundleDir, bundle);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        this.metrics.bundleSizes[bundle] = {
          size: stats.size,
          sizeKB: sizeKB
        };
        
        console.log(`  ${bundle}: ${sizeKB} KB`);
        
        // Flag large bundles
        if (stats.size > 500000) { // 500KB
          this.metrics.suggestions.push({
            type: 'warning',
            message: `Bundle ${bundle} is large (${sizeKB} KB) - consider splitting`
          });
        }
      });
    } else {
      console.log('  No bundles found - run npm run consolidate:scripts');
      this.metrics.suggestions.push({
        type: 'info',
        message: 'Run npm run consolidate:scripts to create optimized bundles'
      });
    }
  }

  async findOptimizationOpportunities() {
    console.log('\n🎯 Finding optimization opportunities...');
    
    // Check for large individual files
    await this.checkLargeFiles();
    
    // Check for potential duplicates
    await this.checkPotentialDuplicates();
    
    // Check for unused files
    await this.checkUnusedFiles();
    
    // Check image optimization opportunities
    await this.checkImageOptimization();
  }

  async checkLargeFiles() {
    const largeFiles = [];
    
    const checkDirectory = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          checkDirectory(fullPath);
        } else if (item.isFile()) {
          const stats = fs.statSync(fullPath);
          
          // Flag files larger than 100KB
          if (stats.size > 100000) {
            largeFiles.push({
              path: fullPath,
              size: stats.size,
              sizeKB: (stats.size / 1024).toFixed(2)
            });
          }
        }
      });
    };
    
    checkDirectory('public/scripts');
    checkDirectory('src');
    
    if (largeFiles.length > 0) {
      console.log('  Large files found:');
      largeFiles.forEach(file => {
        console.log(`    ${file.path}: ${file.sizeKB} KB`);
        
        if (file.size > 500000) { // 500KB
          this.metrics.suggestions.push({
            type: 'warning',
            message: `Large file detected: ${file.path} (${file.sizeKB} KB) - consider optimization`
          });
        }
      });
    } else {
      console.log('  ✅ No unusually large files found');
    }
  }

  async checkPotentialDuplicates() {
    // Check for files with similar names that might be duplicates
    const files = [];
    
    const collectFiles = (dir) => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.isDirectory()) {
          collectFiles(path.join(dir, item.name));
        } else if (item.isFile() && item.name.endsWith('.js')) {
          files.push({
            name: item.name,
            path: path.join(dir, item.name),
            baseName: item.name.replace(/[-_](new|old|backup|copy|fix|\d+)\.js$/, '.js')
          });
        }
      });
    };
    
    collectFiles('public/scripts');
    collectFiles('src');
    
    // Group by base name
    const groups = {};
    files.forEach(file => {
      if (!groups[file.baseName]) {
        groups[file.baseName] = [];
      }
      groups[file.baseName].push(file);
    });
    
    // Find potential duplicates
    const potentialDuplicates = Object.entries(groups).filter(([_, files]) => files.length > 1);
    
    if (potentialDuplicates.length > 0) {
      console.log('  Potential duplicates found:');
      potentialDuplicates.forEach(([baseName, files]) => {
        console.log(`    ${baseName}:`);
        files.forEach(file => console.log(`      - ${file.path}`));
        
        this.metrics.suggestions.push({
          type: 'info',
          message: `Potential duplicates: ${files.map(f => f.name).join(', ')}`
        });
      });
    } else {
      console.log('  ✅ No potential duplicates found');
    }
  }

  async checkUnusedFiles() {
    // This is a simplified check - in a real scenario, you'd analyze imports/references
    console.log('  ℹ️  For unused file detection, consider using tools like unimported or depcheck');
    
    this.metrics.suggestions.push({
      type: 'info',
      message: 'Consider running: npx unimported to find unused files'
    });
  }

  async checkImageOptimization() {
    const imageDir = 'public/images';
    if (!fs.existsSync(imageDir)) return;
    
    let totalSize = 0;
    let imageCount = 0;
    let largeImages = 0;
    
    const checkImages = (dir) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      items.forEach(item => {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          checkImages(fullPath);
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          
          if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            const stats = fs.statSync(fullPath);
            totalSize += stats.size;
            imageCount++;
            
            if (stats.size > 500000) { // 500KB
              largeImages++;
            }
          }
        }
      });
    };
    
    checkImages(imageDir);
    
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`  Images: ${imageCount} files, ${totalSizeMB} MB total`);
    
    if (largeImages > 0) {
      console.log(`  ⚠️  ${largeImages} large images found (>500KB)`);
      this.metrics.suggestions.push({
        type: 'warning',
        message: `${largeImages} large images found - consider optimization with npm run optimize:images`
      });
    }
  }

  async generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      summary: {
        totalFiles: Object.values(this.metrics.fileCount).reduce((sum, counts) => sum + counts.total, 0),
        totalBundles: Object.keys(this.metrics.bundleSizes).length,
        totalSuggestions: this.metrics.suggestions.length,
        warnings: this.metrics.suggestions.filter(s => s.type === 'warning').length
      }
    };
    
    // Save detailed report
    fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
    
    // Console summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE SUMMARY');
    console.log('='.repeat(60));
    console.log(`📁 Total files: ${report.summary.totalFiles}`);
    console.log(`📦 Bundles created: ${report.summary.totalBundles}`);
    console.log(`💡 Optimization suggestions: ${report.summary.totalSuggestions}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    
    if (this.metrics.suggestions.length > 0) {
      console.log('\n🎯 RECOMMENDATIONS:');
      this.metrics.suggestions.forEach((suggestion, index) => {
        const icon = suggestion.type === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon}  ${index + 1}. ${suggestion.message}`);
      });
    }
    
    console.log('\n📄 Detailed report saved to: performance-report.json');
    console.log('='.repeat(60));
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  monitor.analyzeRepository().catch(console.error);
}

export { PerformanceMonitor };
