/**
 * NosytLabs Performance Optimization Script
 * Comprehensive performance analysis and optimization tool
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PerformanceOptimizer {
  constructor() {
    this.distPath = path.join(__dirname, '..', 'dist');
    this.srcPath = path.join(__dirname, '..', 'src');
    this.publicPath = path.join(__dirname, '..', 'public');
    this.metrics = {
      cssFiles: 0,
      jsFiles: 0,
      totalSize: 0,
      imageFiles: 0,
      duplicateFiles: []
    };
  }

  /**
   * Analyze current performance baseline
   */
  analyzeBaseline() {
    console.log('🔍 Analyzing performance baseline...');
    
    // Analyze CSS files
    this.analyzeCSSFiles();
    
    // Analyze JavaScript files
    this.analyzeJSFiles();
    
    // Analyze images
    this.analyzeImages();
    
    // Generate report
    this.generateReport();
  }

  /**
   * Analyze CSS files and identify consolidation opportunities
   */
  analyzeCSSFiles() {
    const cssFiles = this.findFiles(this.distPath, '.css');
    this.metrics.cssFiles = cssFiles.length;
    
    console.log(`📊 Found ${cssFiles.length} CSS files`);
    
    // Analyze file sizes
    cssFiles.forEach(file => {
      const stats = fs.statSync(file);
      this.metrics.totalSize += stats.size;
      
      if (stats.size < 1024) { // Files smaller than 1KB
        console.log(`⚠️  Small CSS file detected: ${path.basename(file)} (${stats.size} bytes)`);
      }
    });
  }

  /**
   * Analyze JavaScript files and identify optimization opportunities
   */
  analyzeJSFiles() {
    const jsFiles = this.findFiles(this.distPath, '.js');
    this.metrics.jsFiles = jsFiles.length;
    
    console.log(`📊 Found ${jsFiles.length} JavaScript files`);
    
    // Check for duplicate functionality
    this.findDuplicateJS(jsFiles);
  }

  /**
   * Analyze images and optimization opportunities
   */
  analyzeImages() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
    let imageFiles = [];
    
    imageExtensions.forEach(ext => {
      imageFiles = imageFiles.concat(this.findFiles(this.distPath, ext));
    });
    
    this.metrics.imageFiles = imageFiles.length;
    console.log(`📊 Found ${imageFiles.length} image files`);
    
    // Check for multiple formats of same image
    this.findDuplicateImages(imageFiles);
  }

  /**
   * Find files with specific extension
   */
  findFiles(dir, extension) {
    let files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.findFiles(fullPath, extension));
      } else if (path.extname(item) === extension) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  /**
   * Find duplicate JavaScript functionality
   */
  findDuplicateJS(jsFiles) {
    const functionNames = new Map();
    
    jsFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Look for common patterns that might indicate duplicates
        const patterns = [
          /function\s+(\w+)/g,
          /const\s+(\w+)\s*=/g,
          /class\s+(\w+)/g
        ];
        
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const name = match[1];
            if (!functionNames.has(name)) {
              functionNames.set(name, []);
            }
            functionNames.get(name).push(file);
          }
        });
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${file}: ${error.message}`);
      }
    });
    
    // Find duplicates
    functionNames.forEach((files, name) => {
      if (files.length > 1) {
        console.log(`🔄 Potential duplicate function '${name}' found in:`);
        files.forEach(file => console.log(`   - ${path.relative(this.distPath, file)}`));
      }
    });
  }

  /**
   * Find duplicate images (same name, different formats)
   */
  findDuplicateImages(imageFiles) {
    const imageGroups = new Map();
    
    imageFiles.forEach(file => {
      const basename = path.basename(file, path.extname(file));
      if (!imageGroups.has(basename)) {
        imageGroups.set(basename, []);
      }
      imageGroups.get(basename).push(file);
    });
    
    imageGroups.forEach((files, basename) => {
      if (files.length > 1) {
        console.log(`🖼️  Multiple formats for '${basename}':`);
        files.forEach(file => {
          const stats = fs.statSync(file);
          console.log(`   - ${path.extname(file)} (${Math.round(stats.size/1024)}KB)`);
        });
      }
    });
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
      totalSizeMB: Math.round(this.metrics.totalSize / (1024 * 1024) * 100) / 100
    };
    
    console.log('\n📋 PERFORMANCE ANALYSIS REPORT');
    console.log('================================');
    console.log(`📁 CSS Files: ${report.metrics.cssFiles}`);
    console.log(`📁 JS Files: ${report.metrics.jsFiles}`);
    console.log(`🖼️  Image Files: ${report.metrics.imageFiles}`);
    console.log(`💾 Total Size: ${report.totalSizeMB}MB`);
    console.log('\n🎯 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    // Save report
    fs.writeFileSync(
      path.join(__dirname, '..', 'performance-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n✅ Report saved to performance-report.json');
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.metrics.cssFiles > 20) {
      recommendations.push(`Consolidate ${this.metrics.cssFiles} CSS files into 3-5 optimized bundles`);
    }
    
    if (this.metrics.jsFiles > 50) {
      recommendations.push(`Optimize ${this.metrics.jsFiles} JavaScript files through better code splitting`);
    }
    
    recommendations.push('Implement critical CSS inlining for above-the-fold content');
    recommendations.push('Add resource hints (preload, prefetch) for critical assets');
    recommendations.push('Optimize image loading with responsive images and lazy loading');
    recommendations.push('Implement advanced service worker caching strategies');
    
    return recommendations;
  }

  /**
   * Run optimization process
   */
  async optimize() {
    console.log('🚀 Starting NosytLabs Performance Optimization...\n');
    
    // Step 1: Baseline analysis
    this.analyzeBaseline();
    
    // Step 2: CSS optimization
    await this.optimizeCSS();
    
    // Step 3: JavaScript optimization
    await this.optimizeJS();
    
    // Step 4: Image optimization
    await this.optimizeImages();
    
    console.log('\n✅ Performance optimization completed!');
  }

  /**
   * Optimize CSS files
   */
  async optimizeCSS() {
    console.log('\n🎨 Optimizing CSS...');
    // Implementation will be added in next steps
  }

  /**
   * Optimize JavaScript files
   */
  async optimizeJS() {
    console.log('\n⚡ Optimizing JavaScript...');
    // Implementation will be added in next steps
  }

  /**
   * Optimize images
   */
  async optimizeImages() {
    console.log('\n🖼️  Optimizing images...');
    // Implementation will be added in next steps
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.optimize().catch(console.error);
}

module.exports = PerformanceOptimizer;
