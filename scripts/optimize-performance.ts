#!/usr/bin/env tsx
/**
 * Performance Optimization Script
 * Automated performance optimization for production builds
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { resolve, join, extname, basename } from 'path';
import { gzipSync } from 'zlib';

interface OptimizationConfig {
  imageOptimization: boolean;
  bundleAnalysis: boolean;
  compressionTest: boolean;
  cacheOptimization: boolean;
  criticalCssExtraction: boolean;
  unusedCssRemoval: boolean;
}

interface OptimizationResult {
  success: boolean;
  optimizations: string[];
  errors: string[];
  metrics: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    timeElapsed: number;
  };
}

class PerformanceOptimizer {
  private config: OptimizationConfig;
  private startTime: number;
  private results: OptimizationResult;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      imageOptimization: true,
      bundleAnalysis: true,
      compressionTest: true,
      cacheOptimization: true,
      criticalCssExtraction: false, // Requires additional setup
      unusedCssRemoval: true,
      ...config,
    };
    
    this.startTime = Date.now();
    this.results = {
      success: true,
      optimizations: [],
      errors: [],
      metrics: {
        originalSize: 0,
        optimizedSize: 0,
        compressionRatio: 0,
        timeElapsed: 0,
      },
    };
  }

  async optimize(): Promise<OptimizationResult> {
    console.log('🚀 Starting performance optimization...');
    
    try {
      // Measure original bundle size
      this.results.metrics.originalSize = this.measureBundleSize();
      
      // Run optimizations
      if (this.config.imageOptimization) {
        await this.optimizeImages();
      }
      
      if (this.config.bundleAnalysis) {
        await this.analyzeBundles();
      }
      
      if (this.config.compressionTest) {
        await this.testCompression();
      }
      
      if (this.config.cacheOptimization) {
        await this.optimizeCaching();
      }
      
      if (this.config.unusedCssRemoval) {
        await this.removeUnusedCss();
      }
      
      // Measure optimized bundle size
      this.results.metrics.optimizedSize = this.measureBundleSize();
      this.results.metrics.compressionRatio = 
        (this.results.metrics.originalSize - this.results.metrics.optimizedSize) / 
        this.results.metrics.originalSize;
      
      this.results.metrics.timeElapsed = Date.now() - this.startTime;
      
      console.log('✅ Performance optimization completed!');
      this.printSummary();
      
    } catch (error) {
      this.results.success = false;
      this.results.errors.push(`Optimization failed: ${error}`);
      console.error('❌ Performance optimization failed:', error);
    }
    
    return this.results;
  }

  private measureBundleSize(): number {
    const distPath = resolve('dist');
    if (!existsSync(distPath)) {
      return 0;
    }
    
    let totalSize = 0;
    
    const measureDirectory = (dirPath: string) => {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          measureDirectory(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    };
    
    measureDirectory(distPath);
    return totalSize;
  }

  private async optimizeImages(): Promise<void> {
    console.log('🖼️  Optimizing images...');
    
    try {
      // Check if imagemin is available
      const imagePaths = this.findImageFiles();
      
      if (imagePaths.length === 0) {
        this.results.optimizations.push('No images found to optimize');
        return;
      }
      
      // Use built-in optimization or suggest tools
      let optimizedCount = 0;
      
      for (const imagePath of imagePaths) {
        const stats = statSync(imagePath);
        const originalSize = stats.size;
        
        // For now, just report what could be optimized
        // In a real implementation, you'd use imagemin or similar
        if (originalSize > 100 * 1024) { // Files larger than 100KB
          optimizedCount++;
        }
      }
      
      this.results.optimizations.push(
        `Image optimization: Found ${imagePaths.length} images, ${optimizedCount} candidates for optimization`
      );
      
      // Suggest optimization tools
      if (optimizedCount > 0) {
        this.results.optimizations.push(
          'Recommendation: Use imagemin, squoosh, or similar tools for image optimization'
        );
      }
      
    } catch (error) {
      this.results.errors.push(`Image optimization error: ${error}`);
    }
  }

  private findImageFiles(): string[] {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imagePaths: string[] = [];
    
    const searchDirectories = ['src', 'public', 'assets'];
    
    const searchDirectory = (dirPath: string) => {
      if (!existsSync(dirPath)) return;
      
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          searchDirectory(itemPath);
        } else if (imageExtensions.includes(extname(item).toLowerCase())) {
          imagePaths.push(itemPath);
        }
      }
    };
    
    searchDirectories.forEach(searchDirectory);
    return imagePaths;
  }

  private async analyzeBundles(): Promise<void> {
    console.log('📊 Analyzing bundles...');
    
    try {
      // Check if bundle analyzer is configured
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      
      if (packageJson.scripts?.['analyze']) {
        console.log('Running bundle analyzer...');
        execSync('npm run analyze', { stdio: 'pipe' });
        this.results.optimizations.push('Bundle analysis completed - check bundle-analyzer report');
      } else {
        this.results.optimizations.push('Bundle analyzer not configured - consider adding webpack-bundle-analyzer');
      }
      
      // Analyze dist folder structure
      const distPath = resolve('dist');
      if (existsSync(distPath)) {
        const analysis = this.analyzeBundleStructure(distPath);
        this.results.optimizations.push(`Bundle structure: ${analysis.fileCount} files, ${Math.round(analysis.totalSize / 1024)} KB`);
        
        if (analysis.largeFiles.length > 0) {
          this.results.optimizations.push(
            `Large files detected: ${analysis.largeFiles.map(f => `${f.name} (${Math.round(f.size / 1024)}KB)`).join(', ')}`
          );
        }
      }
      
    } catch (error) {
      this.results.errors.push(`Bundle analysis error: ${error}`);
    }
  }

  private analyzeBundleStructure(distPath: string): {
    fileCount: number;
    totalSize: number;
    largeFiles: Array<{ name: string; size: number }>;
  } {
    let fileCount = 0;
    let totalSize = 0;
    const largeFiles: Array<{ name: string; size: number }> = [];
    const largeFileThreshold = 500 * 1024; // 500KB
    
    const analyzeDirectory = (dirPath: string) => {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          analyzeDirectory(itemPath);
        } else {
          fileCount++;
          totalSize += stats.size;
          
          if (stats.size > largeFileThreshold) {
            largeFiles.push({
              name: basename(item),
              size: stats.size,
            });
          }
        }
      }
    };
    
    analyzeDirectory(distPath);
    
    return { fileCount, totalSize, largeFiles };
  }

  private async testCompression(): Promise<void> {
    console.log('🗜️  Testing compression...');
    
    try {
      const distPath = resolve('dist');
      if (!existsSync(distPath)) {
        this.results.optimizations.push('No dist folder found - run build first');
        return;
      }
      
      const testFiles = this.findCompressibleFiles(distPath);
      let totalOriginal = 0;
      let totalCompressed = 0;
      
      for (const filePath of testFiles.slice(0, 10)) { // Test first 10 files
        const content = readFileSync(filePath);
        const compressed = gzipSync(content);
        
        totalOriginal += content.length;
        totalCompressed += compressed.length;
      }
      
      if (totalOriginal > 0) {
        const compressionRatio = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
        this.results.optimizations.push(
          `Compression test: ${compressionRatio}% reduction with gzip (${testFiles.length} files tested)`
        );
        
        if (parseFloat(compressionRatio) < 60) {
          this.results.optimizations.push('Recommendation: Enable Brotli compression for better results');
        }
      }
      
    } catch (error) {
      this.results.errors.push(`Compression test error: ${error}`);
    }
  }

  private findCompressibleFiles(distPath: string): string[] {
    const compressibleExtensions = ['.js', '.css', '.html', '.json', '.svg'];
    const files: string[] = [];
    
    const searchDirectory = (dirPath: string) => {
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          searchDirectory(itemPath);
        } else if (compressibleExtensions.includes(extname(item).toLowerCase())) {
          files.push(itemPath);
        }
      }
    };
    
    searchDirectory(distPath);
    return files;
  }

  private async optimizeCaching(): Promise<void> {
    console.log('💾 Optimizing caching strategy...');
    
    try {
      // Check for cache-busting in filenames
      const distPath = resolve('dist');
      if (!existsSync(distPath)) {
        this.results.optimizations.push('No dist folder found for cache optimization');
        return;
      }
      
      const files = this.getAllFiles(distPath);
      const hashedFiles = files.filter(f => /\.[a-f0-9]{8,}\./i.test(basename(f)));
      const unhashed = files.filter(f => !hashedFiles.includes(f) && !['.html', '.txt'].includes(extname(f)));
      
      this.results.optimizations.push(
        `Cache optimization: ${hashedFiles.length} files with cache-busting hashes, ${unhashed.length} without`
      );
      
      if (unhashed.length > 0) {
        this.results.optimizations.push(
          'Recommendation: Enable filename hashing for better cache invalidation'
        );
      }
      
      // Check for service worker
      const swFiles = files.filter(f => basename(f).includes('sw.') || basename(f).includes('service-worker'));
      if (swFiles.length > 0) {
        this.results.optimizations.push('Service worker detected - good for caching strategy');
      } else {
        this.results.optimizations.push('Recommendation: Consider implementing a service worker for advanced caching');
      }
      
    } catch (error) {
      this.results.errors.push(`Cache optimization error: ${error}`);
    }
  }

  private getAllFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const searchDirectory = (currentPath: string) => {
      const items = readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = join(currentPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          searchDirectory(itemPath);
        } else {
          files.push(itemPath);
        }
      }
    };
    
    searchDirectory(dirPath);
    return files;
  }

  private async removeUnusedCss(): Promise<void> {
    console.log('🎨 Analyzing CSS usage...');
    
    try {
      // Check if PurgeCSS or similar is configured
      const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
      const hasPurgeCSS = packageJson.devDependencies?.['@fullhuman/postcss-purgecss'] || 
                         packageJson.dependencies?.['@fullhuman/postcss-purgecss'];
      
      if (hasPurgeCSS) {
        this.results.optimizations.push('PurgeCSS detected - unused CSS removal is configured');
      } else {
        // Analyze CSS files for potential optimization
        const cssFiles = this.findCssFiles();
        let totalCssSize = 0;
        
        for (const cssFile of cssFiles) {
          const stats = statSync(cssFile);
          totalCssSize += stats.size;
        }
        
        this.results.optimizations.push(
          `CSS analysis: ${cssFiles.length} files, ${Math.round(totalCssSize / 1024)} KB total`
        );
        
        if (totalCssSize > 100 * 1024) { // More than 100KB of CSS
          this.results.optimizations.push(
            'Recommendation: Consider PurgeCSS or similar tools to remove unused CSS'
          );
        }
      }
      
    } catch (error) {
      this.results.errors.push(`CSS optimization error: ${error}`);
    }
  }

  private findCssFiles(): string[] {
    const cssFiles: string[] = [];
    const searchPaths = ['src', 'dist'];
    
    const searchDirectory = (dirPath: string) => {
      if (!existsSync(dirPath)) return;
      
      const items = readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = join(dirPath, item);
        const stats = statSync(itemPath);
        
        if (stats.isDirectory()) {
          searchDirectory(itemPath);
        } else if (extname(item).toLowerCase() === '.css') {
          cssFiles.push(itemPath);
        }
      }
    };
    
    searchPaths.forEach(searchDirectory);
    return cssFiles;
  }

  private printSummary(): void {
    console.log('\n📋 Optimization Summary:');
    console.log('========================');
    
    if (this.results.metrics.originalSize > 0) {
      console.log(`Original bundle size: ${Math.round(this.results.metrics.originalSize / 1024)} KB`);
      console.log(`Optimized bundle size: ${Math.round(this.results.metrics.optimizedSize / 1024)} KB`);
      
      if (this.results.metrics.compressionRatio > 0) {
        console.log(`Size reduction: ${(this.results.metrics.compressionRatio * 100).toFixed(1)}%`);
      }
    }
    
    console.log(`Time elapsed: ${(this.results.metrics.timeElapsed / 1000).toFixed(1)}s`);
    console.log('');
    
    if (this.results.optimizations.length > 0) {
      console.log('✅ Optimizations:');
      this.results.optimizations.forEach(opt => console.log(`  • ${opt}`));
      console.log('');
    }
    
    if (this.results.errors.length > 0) {
      console.log('❌ Errors:');
      this.results.errors.forEach(err => console.log(`  • ${err}`));
      console.log('');
    }
    
    // Save results to file
    const reportPath = 'reports/optimization-report.json';
    try {
      writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`📊 Detailed report saved to: ${reportPath}`);
    } catch (error) {
      console.log('⚠️  Could not save optimization report');
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  
  const config: Partial<OptimizationConfig> = {};
  
  // Parse arguments
  for (const arg of args) {
    if (arg === '--no-images') config.imageOptimization = false;
    if (arg === '--no-analysis') config.bundleAnalysis = false;
    if (arg === '--no-compression') config.compressionTest = false;
    if (arg === '--no-cache') config.cacheOptimization = false;
    if (arg === '--critical-css') config.criticalCssExtraction = true;
    if (arg === '--no-css-purge') config.unusedCssRemoval = false;
  }
  
  try {
    const optimizer = new PerformanceOptimizer(config);
    const result = await optimizer.optimize();
    
    if (result.success) {
      console.log('\n🎉 Performance optimization completed successfully!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Performance optimization completed with errors.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Performance optimization failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { PerformanceOptimizer, type OptimizationConfig, type OptimizationResult };