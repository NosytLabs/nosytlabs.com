#!/usr/bin/env node

/**
 * Advanced Bundle Analyzer for NosytLabs
 * Provides detailed analysis of bundle composition, dependencies, and optimization opportunities
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig, getPerformanceConfig } from '../src/config/build-optimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class BundleAnalyzer {
  constructor() {
    this.results = {
      bundles: {},
      dependencies: {},
      duplicates: [],
      recommendations: [],
      performance: {},
      timestamp: new Date().toISOString()
    };
    this.performanceConfig = getPerformanceConfig();
  }

  async run() {
    console.log('📊 Starting Advanced Bundle Analysis...\n');
    
    try {
      // Analyze bundle composition
      await this.analyzeBundleComposition();
      
      // Analyze dependencies
      await this.analyzeDependencies();
      
      // Detect duplicate code
      await this.detectDuplicates();
      
      // Performance analysis
      await this.analyzePerformance();
      
      // Generate optimization recommendations
      await this.generateRecommendations();
      
      // Create detailed report
      await this.generateReport();
      
      console.log('✅ Bundle Analysis completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Bundle Analysis failed:', error);
      process.exit(1);
    }
  }

  async analyzeBundleComposition() {
    console.log('🔍 Analyzing bundle composition...');
    
    const distDir = path.join(projectRoot, 'dist');
    
    try {
      const stats = await this.getDetailedStats(distDir);
      
      this.results.bundles = {
        total: stats.totalSize,
        count: stats.fileCount,
        byType: stats.byType,
        byChunk: stats.byChunk,
        compression: stats.compression
      };
      
      console.log(`📦 Total bundle size: ${this.formatBytes(stats.totalSize)}`);
      console.log(`📄 Total files: ${stats.fileCount}`);
      
      // Log breakdown by type
      Object.entries(stats.byType).forEach(([type, data]) => {
        console.log(`  ${type}: ${this.formatBytes(data.size)} (${data.count} files)`);
      });
      
    } catch (error) {
      console.warn('⚠️  Bundle output not found. Run build first.');
      this.results.bundles.error = 'Bundle output not found';
    }
  }

  async getDetailedStats(dir) {
    const stats = {
      totalSize: 0,
      fileCount: 0,
      byType: {},
      byChunk: {},
      compression: {}
    };

    const files = await this.getAllFiles(dir);
    
    for (const file of files) {
      const fileStat = await fs.stat(file);
      const ext = path.extname(file);
      const relativePath = path.relative(dir, file);
      
      stats.totalSize += fileStat.size;
      stats.fileCount++;
      
      // Group by file type
      if (!stats.byType[ext]) {
        stats.byType[ext] = { size: 0, count: 0, files: [] };
      }
      stats.byType[ext].size += fileStat.size;
      stats.byType[ext].count++;
      stats.byType[ext].files.push({
        path: relativePath,
        size: fileStat.size
      });
      
      // Group by chunk (for JS files)
      if (ext === '.js') {
        const chunkName = this.extractChunkName(relativePath);
        if (!stats.byChunk[chunkName]) {
          stats.byChunk[chunkName] = { size: 0, files: [] };
        }
        stats.byChunk[chunkName].size += fileStat.size;
        stats.byChunk[chunkName].files.push(relativePath);
      }
    }
    
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

  extractChunkName(filePath) {
    const fileName = path.basename(filePath, '.js');
    
    // Extract chunk name from hashed filename
    const match = fileName.match(/^(.+?)-[a-f0-9]+$/);
    return match ? match[1] : fileName;
  }

  async analyzeDependencies() {
    console.log('📦 Analyzing dependencies...');
    
    try {
      const packageJson = JSON.parse(
        await fs.readFile(path.join(projectRoot, 'package.json'), 'utf-8')
      );
      
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      this.results.dependencies = {
        total: Object.keys(dependencies).length,
        production: Object.keys(packageJson.dependencies || {}).length,
        development: Object.keys(packageJson.devDependencies || {}).length,
        list: dependencies
      };
      
      console.log(`📚 Total dependencies: ${this.results.dependencies.total}`);
      console.log(`🏭 Production: ${this.results.dependencies.production}`);
      console.log(`🔧 Development: ${this.results.dependencies.development}`);
      
    } catch (error) {
      console.warn('⚠️  Could not analyze dependencies:', error.message);
    }
  }

  async detectDuplicates() {
    console.log('🔍 Detecting duplicate code...');
    
    // This is a simplified duplicate detection
    // In a real implementation, you might use tools like webpack-bundle-analyzer
    const distDir = path.join(projectRoot, 'dist');
    
    try {
      const jsFiles = await this.getJSFiles(distDir);
      const duplicates = [];
      
      // Simple duplicate detection based on file size
      const sizeMap = new Map();
      
      for (const file of jsFiles) {
        const stat = await fs.stat(file);
        const size = stat.size;
        
        if (sizeMap.has(size)) {
          duplicates.push({
            size,
            files: [sizeMap.get(size), file]
          });
        } else {
          sizeMap.set(size, file);
        }
      }
      
      this.results.duplicates = duplicates;
      
      if (duplicates.length > 0) {
        console.log(`⚠️  Found ${duplicates.length} potential duplicates`);
      } else {
        console.log('✅ No obvious duplicates detected');
      }
      
    } catch (error) {
      console.warn('⚠️  Could not detect duplicates:', error.message);
    }
  }

  async getJSFiles(dir) {
    const allFiles = await this.getAllFiles(dir);
    return allFiles.filter(file => path.extname(file) === '.js');
  }

  async analyzePerformance() {
    console.log('⚡ Analyzing performance metrics...');
    
    const budgets = this.performanceConfig.budgets;
    const vitals = this.performanceConfig.vitals;
    
    this.results.performance = {
      budgets: {
        passed: true,
        details: {}
      },
      vitals,
      recommendations: []
    };
    
    // Check against performance budgets
    if (this.results.bundles.total) {
      const totalSize = this.results.bundles.total;
      
      if (totalSize > budgets.maximumError) {
        this.results.performance.budgets.passed = false;
        this.results.performance.budgets.details.totalSize = {
          current: totalSize,
          threshold: budgets.maximumError,
          status: 'error'
        };
      } else if (totalSize > budgets.maximumWarning) {
        this.results.performance.budgets.details.totalSize = {
          current: totalSize,
          threshold: budgets.maximumWarning,
          status: 'warning'
        };
      }
    }
    
    console.log(`📊 Performance budget: ${this.results.performance.budgets.passed ? '✅ Passed' : '❌ Failed'}`);
  }

  async generateRecommendations() {
    console.log('💡 Generating optimization recommendations...');
    
    const recommendations = [];
    
    // Bundle size recommendations
    if (this.results.bundles.total > buildConfig.thresholds.totalSize) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        title: 'Bundle size exceeds threshold',
        description: `Total bundle size (${this.formatBytes(this.results.bundles.total)}) exceeds recommended threshold (${this.formatBytes(buildConfig.thresholds.totalSize)})`,
        actions: [
          'Enable code splitting',
          'Implement lazy loading',
          'Remove unused dependencies',
          'Use dynamic imports'
        ]
      });
    }
    
    // Dependency recommendations
    if (this.results.dependencies.total > 50) {
      recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        title: 'High number of dependencies',
        description: `Project has ${this.results.dependencies.total} dependencies`,
        actions: [
          'Audit and remove unused dependencies',
          'Consider lighter alternatives',
          'Bundle analyze to identify heavy packages'
        ]
      });
    }
    
    // Duplicate code recommendations
    if (this.results.duplicates.length > 0) {
      recommendations.push({
        type: 'duplicates',
        priority: 'medium',
        title: 'Potential duplicate code detected',
        description: `Found ${this.results.duplicates.length} potential duplicates`,
        actions: [
          'Review and consolidate duplicate code',
          'Implement proper code splitting',
          'Use shared modules'
        ]
      });
    }
    
    this.results.recommendations = recommendations;
    
    console.log(`💡 Generated ${recommendations.length} recommendations`);
  }

  async generateReport() {
    const report = {
      summary: {
        timestamp: this.results.timestamp,
        totalSize: this.results.bundles.total,
        fileCount: this.results.bundles.count,
        dependencies: this.results.dependencies.total,
        recommendations: this.results.recommendations.length
      },
      details: this.results
    };
    
    // Save detailed report
    const reportPath = path.join(projectRoot, 'dist/bundle-analysis.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    // Display summary
    this.displaySummary();
  }

  displaySummary() {
    console.log('\n📊 Bundle Analysis Summary:');
    console.log('═'.repeat(50));
    console.log(`📦 Total Size: ${this.formatBytes(this.results.bundles.total || 0)}`);
    console.log(`📄 File Count: ${this.results.bundles.count || 0}`);
    console.log(`📚 Dependencies: ${this.results.dependencies.total || 0}`);
    console.log(`💡 Recommendations: ${this.results.recommendations.length}`);
    
    if (this.results.recommendations.length > 0) {
      console.log('\n🎯 Top Recommendations:');
      this.results.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.title} (${rec.priority})`);
      });
    }
    
    console.log('═'.repeat(50));
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
const analyzer = new BundleAnalyzer();
analyzer.run().catch(console.error);
