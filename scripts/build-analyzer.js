#!/usr/bin/env node

/**
 * Build Analyzer and Performance Monitor for NosytLabs
 * Implements build-optimization.js configuration with comprehensive analysis
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from '../src/config/build-optimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class BuildAnalyzer {
  constructor() {
    this.results = {
      bundles: {},
      performance: {},
      thresholds: {},
      recommendations: [],
      timestamp: new Date().toISOString()
    };
  }

  async run() {
    console.log('🔍 Starting Build Analysis...\n');
    
    try {
      // Analyze build output
      await this.analyzeBuildOutput();
      
      // Check performance thresholds
      await this.checkThresholds();
      
      // Analyze bundle composition
      await this.analyzeBundleComposition();
      
      // Generate performance recommendations
      await this.generateRecommendations();
      
      // Create build summary
      await this.setupBuildSummary();
      
      // Generate comprehensive report
      await this.generateReport();
      
      console.log('✅ Build Analysis completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Build Analysis failed:', error);
      process.exit(1);
    }
  }

  async analyzeBuildOutput() {
    console.log('📦 Analyzing build output...');
    
    const distDir = path.join(projectRoot, 'dist');
    
    try {
      await fs.access(distDir);
      const stats = await this.getDirectoryStats(distDir);
      
      this.results.bundles = {
        totalSize: stats.totalSize,
        fileCount: stats.fileCount,
        breakdown: stats.breakdown,
        largestFiles: stats.largestFiles
      };
      
      console.log(`📊 Total build size: ${this.formatBytes(stats.totalSize)}`);
      console.log(`📄 Total files: ${stats.fileCount}`);
      
    } catch (error) {
      console.warn('⚠️  Build output not found. Run `npm run build` first.');
      this.results.bundles.error = 'Build output not found';
    }
  }

  async getDirectoryStats(dir) {
    const stats = {
      totalSize: 0,
      fileCount: 0,
      breakdown: {},
      largestFiles: []
    };
    
    const files = await this.getAllFiles(dir);
    
    for (const file of files) {
      try {
        const fileStat = await fs.stat(file);
        const ext = path.extname(file).toLowerCase();
        const relativePath = path.relative(projectRoot, file);
        
        stats.totalSize += fileStat.size;
        stats.fileCount++;
        
        // Breakdown by file type
        if (!stats.breakdown[ext]) {
          stats.breakdown[ext] = { size: 0, count: 0 };
        }
        stats.breakdown[ext].size += fileStat.size;
        stats.breakdown[ext].count++;
        
        // Track largest files
        stats.largestFiles.push({
          path: relativePath,
          size: fileStat.size,
          type: ext
        });
        
      } catch (error) {
        console.warn(`⚠️  Could not analyze ${file}:`, error.message);
      }
    }
    
    // Sort largest files
    stats.largestFiles.sort((a, b) => b.size - a.size);
    stats.largestFiles = stats.largestFiles.slice(0, 10);
    
    return stats;
  }

  async getAllFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.getAllFiles(fullPath));
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read directory ${dir}:`, error.message);
    }
    
    return files;
  }

  async checkThresholds() {
    console.log('⚡ Checking performance thresholds...');
    
    const thresholds = buildConfig.thresholds;
    const results = {};
    
    // Check total bundle size
    if (this.results.bundles.totalSize) {
      results.totalSize = {
        current: this.results.bundles.totalSize,
        threshold: thresholds.totalSize,
        passed: this.results.bundles.totalSize <= thresholds.totalSize,
        percentage: (this.results.bundles.totalSize / thresholds.totalSize * 100).toFixed(1)
      };
    }
    
    // Check individual file types
    if (this.results.bundles.breakdown) {
      results.css = this.checkFileTypeThreshold('.css', thresholds.cssSize);
      results.js = this.checkFileTypeThreshold('.js', thresholds.jsSize);
      results.images = this.checkFileTypeThreshold(['.jpg', '.jpeg', '.png', '.webp', '.avif'], thresholds.imageSize);
    }
    
    this.results.thresholds = results;
    
    // Log threshold results
    Object.entries(results).forEach(([key, result]) => {
      if (result.passed) {
        console.log(`✅ ${key}: ${this.formatBytes(result.current)} / ${this.formatBytes(result.threshold)} (${result.percentage}%)`);
      } else {
        console.log(`❌ ${key}: ${this.formatBytes(result.current)} / ${this.formatBytes(result.threshold)} (${result.percentage}%)`);
      }
    });
  }

  checkFileTypeThreshold(extensions, threshold) {
    const exts = Array.isArray(extensions) ? extensions : [extensions];
    let totalSize = 0;
    
    exts.forEach(ext => {
      if (this.results.bundles.breakdown[ext]) {
        totalSize += this.results.bundles.breakdown[ext].size;
      }
    });
    
    return {
      current: totalSize,
      threshold: threshold,
      passed: totalSize <= threshold,
      percentage: (totalSize / threshold * 100).toFixed(1)
    };
  }

  async analyzeBundleComposition() {
    console.log('🧩 Analyzing bundle composition...');
    
    if (!this.results.bundles.breakdown) {
      return;
    }
    
    const breakdown = this.results.bundles.breakdown;
    const composition = {};
    
    Object.entries(breakdown).forEach(([ext, data]) => {
      composition[ext] = {
        size: data.size,
        count: data.count,
        percentage: (data.size / this.results.bundles.totalSize * 100).toFixed(1),
        averageSize: Math.round(data.size / data.count)
      };
    });
    
    this.results.bundles.composition = composition;
    
    // Log composition
    console.log('📊 Bundle composition:');
    Object.entries(composition)
      .sort((a, b) => b[1].size - a[1].size)
      .forEach(([ext, data]) => {
        console.log(`  ${ext || 'no-ext'}: ${this.formatBytes(data.size)} (${data.percentage}%) - ${data.count} files`);
      });
  }

  async generateRecommendations() {
    console.log('💡 Generating optimization recommendations...');
    
    const recommendations = [];
    
    // Check for large files
    if (this.results.bundles.largestFiles) {
      const largeFiles = this.results.bundles.largestFiles.filter(file => file.size > 100 * 1024);
      if (largeFiles.length > 0) {
        recommendations.push({
          type: 'optimization',
          priority: 'high',
          title: 'Large files detected',
          description: `${largeFiles.length} files are larger than 100KB`,
          files: largeFiles.slice(0, 3).map(f => f.path),
          action: 'Consider code splitting, compression, or lazy loading'
        });
      }
    }
    
    // Check threshold violations
    Object.entries(this.results.thresholds).forEach(([key, result]) => {
      if (!result.passed) {
        recommendations.push({
          type: 'threshold',
          priority: 'high',
          title: `${key} threshold exceeded`,
          description: `Current size: ${this.formatBytes(result.current)}, Threshold: ${this.formatBytes(result.threshold)}`,
          action: `Optimize ${key} files to reduce bundle size`
        });
      }
    });
    
    // Check for optimization opportunities
    if (this.results.bundles.composition) {
      const jsSize = this.results.bundles.composition['.js']?.size || 0;
      const cssSize = this.results.bundles.composition['.css']?.size || 0;
      
      if (jsSize > cssSize * 3) {
        recommendations.push({
          type: 'optimization',
          priority: 'medium',
          title: 'JavaScript bundle is significantly larger than CSS',
          description: `JS: ${this.formatBytes(jsSize)}, CSS: ${this.formatBytes(cssSize)}`,
          action: 'Consider code splitting and tree shaking for JavaScript'
        });
      }
    }
    
    this.results.recommendations = recommendations;
    
    // Log recommendations
    if (recommendations.length > 0) {
      console.log('💡 Recommendations:');
      recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
        console.log(`     ${rec.description}`);
        console.log(`     Action: ${rec.action}\n`);
      });
    } else {
      console.log('✅ No optimization recommendations - build looks good!');
    }
  }

  async setupBuildSummary() {
    console.log('📈 Creating build summary...');

    // Create build analysis summary
    const buildSummary = {
      bundleSize: this.results.bundles.totalSize,
      thresholdsPassed: Object.values(this.results.thresholds).every(t => t.passed),
      recommendations: this.results.recommendations.length,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Build analysis complete');
    return buildSummary;
  }

  async generateReport() {
    const report = {
      ...this.results,
      buildConfig: {
        thresholds: buildConfig.thresholds,
        optimization: buildConfig.optimization
      },
      summary: {
        totalSize: this.results.bundles.totalSize,
        thresholdsPassed: Object.values(this.results.thresholds).filter(t => t.passed).length,
        totalThresholds: Object.keys(this.results.thresholds).length,
        recommendationsCount: this.results.recommendations.length,
        grade: this.calculateGrade()
      }
    };

    // Save detailed report
    const reportPath = path.join(projectRoot, 'build-analysis-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Log summary
    console.log('\n📊 Build Analysis Summary:');
    console.log('================================');
    console.log(`Total Bundle Size: ${this.formatBytes(report.summary.totalSize)}`);
    console.log(`Thresholds Passed: ${report.summary.thresholdsPassed}/${report.summary.totalThresholds}`);
    console.log(`Recommendations: ${report.summary.recommendationsCount}`);
    console.log(`Overall Grade: ${report.summary.grade}`);
    console.log(`Report saved to: ${reportPath}`);
  }

  calculateGrade() {
    const thresholdScore = Object.values(this.results.thresholds).filter(t => t.passed).length / Object.keys(this.results.thresholds).length;
    const recommendationPenalty = Math.min(this.results.recommendations.length * 0.1, 0.3);
    const finalScore = Math.max(0, thresholdScore - recommendationPenalty);
    
    if (finalScore >= 0.9) return 'A';
    if (finalScore >= 0.8) return 'B';
    if (finalScore >= 0.7) return 'C';
    if (finalScore >= 0.6) return 'D';
    return 'F';
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the analyzer
if (import.meta.url === `file://${process.argv[1]}`) {
  const analyzer = new BuildAnalyzer();
  analyzer.run().catch(console.error);
}

export default BuildAnalyzer;
