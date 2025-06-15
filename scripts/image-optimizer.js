#!/usr/bin/env node

/**
 * Image Optimizer for NosytLabs
 * Optimizes images in the public directory for better performance
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from '../src/config/build-optimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class ImageOptimizer {
  constructor() {
    this.results = {
      processed: 0,
      optimized: 0,
      totalSavings: 0,
      errors: 0,
      files: []
    };
    
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];
    this.maxSize = buildConfig.thresholds.imageSize;
  }

  async run() {
    console.log('🖼️  Starting Image Optimization...\n');
    
    try {
      // Find all images
      const images = await this.findImages();
      
      // Analyze images
      await this.analyzeImages(images);
      
      // Generate optimization report
      await this.generateReport();
      
      console.log('✅ Image Optimization completed successfully!\n');
      
    } catch (error) {
      console.error('❌ Image Optimization failed:', error);
      process.exit(1);
    }
  }

  async findImages() {
    console.log('🔍 Finding images...');
    
    const imageDirectories = [
      path.join(projectRoot, 'public'),
      path.join(projectRoot, 'src/assets'),
      path.join(projectRoot, 'dist')
    ];
    
    const images = [];
    
    for (const dir of imageDirectories) {
      try {
        await fs.access(dir);
        const dirImages = await this.findImagesInDirectory(dir);
        images.push(...dirImages);
      } catch (error) {
        // Directory doesn't exist, skip
        continue;
      }
    }
    
    console.log(`📸 Found ${images.length} images`);
    return images;
  }

  async findImagesInDirectory(dir) {
    const images = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subImages = await this.findImagesInDirectory(fullPath);
          images.push(...subImages);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (this.supportedFormats.includes(ext)) {
            images.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read directory ${dir}:`, error.message);
    }
    
    return images;
  }

  async analyzeImages(images) {
    console.log('📊 Analyzing images...');
    
    for (const imagePath of images) {
      try {
        await this.analyzeImage(imagePath);
        this.results.processed++;
      } catch (error) {
        console.warn(`⚠️  Error analyzing ${imagePath}:`, error.message);
        this.results.errors++;
      }
    }
  }

  async analyzeImage(imagePath) {
    const stat = await fs.stat(imagePath);
    const size = stat.size;
    const ext = path.extname(imagePath).toLowerCase();
    const relativePath = path.relative(projectRoot, imagePath);
    
    const imageInfo = {
      path: relativePath,
      size: size,
      format: ext,
      oversized: size > this.maxSize,
      recommendations: []
    };
    
    // Check if image is oversized
    if (size > this.maxSize) {
      imageInfo.recommendations.push({
        type: 'size',
        message: `Image exceeds recommended size (${this.formatBytes(size)} > ${this.formatBytes(this.maxSize)})`,
        actions: ['Compress image', 'Resize dimensions', 'Convert to modern format']
      });
    }
    
    // Format-specific recommendations
    if (ext === '.png' && size > 100 * 1024) {
      imageInfo.recommendations.push({
        type: 'format',
        message: 'Large PNG could benefit from WebP conversion',
        actions: ['Convert to WebP', 'Use AVIF for even better compression']
      });
    }
    
    if (ext === '.jpg' || ext === '.jpeg') {
      imageInfo.recommendations.push({
        type: 'format',
        message: 'JPEG could benefit from modern format conversion',
        actions: ['Convert to WebP', 'Use AVIF for better compression', 'Implement progressive JPEG']
      });
    }
    
    if (ext === '.gif' && size > 50 * 1024) {
      imageInfo.recommendations.push({
        type: 'format',
        message: 'Large GIF could be optimized',
        actions: ['Convert to WebP (animated)', 'Use video format for large animations']
      });
    }
    
    // SVG-specific recommendations
    if (ext === '.svg') {
      imageInfo.recommendations.push({
        type: 'optimization',
        message: 'SVG can be optimized',
        actions: ['Minify SVG', 'Remove unnecessary metadata', 'Optimize paths']
      });
    }
    
    this.results.files.push(imageInfo);
    
    if (imageInfo.recommendations.length > 0) {
      this.results.optimized++;
    }
  }

  async generateReport() {
    console.log('📄 Generating optimization report...');
    
    // Calculate statistics
    const oversizedImages = this.results.files.filter(img => img.oversized);
    const totalSize = this.results.files.reduce((sum, img) => sum + img.size, 0);
    const avgSize = totalSize / this.results.files.length;
    
    // Group by format
    const byFormat = {};
    this.results.files.forEach(img => {
      if (!byFormat[img.format]) {
        byFormat[img.format] = { count: 0, size: 0 };
      }
      byFormat[img.format].count++;
      byFormat[img.format].size += img.size;
    });
    
    const report = {
      summary: {
        timestamp: new Date().toISOString(),
        totalImages: this.results.processed,
        totalSize: totalSize,
        averageSize: avgSize,
        oversizedImages: oversizedImages.length,
        optimizationOpportunities: this.results.optimized,
        errors: this.results.errors
      },
      byFormat,
      recommendations: this.generateGlobalRecommendations(),
      files: this.results.files
    };
    
    // Save report
    const reportPath = path.join(projectRoot, 'dist/image-analysis.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Image analysis report saved to: ${reportPath}`);
    
    // Display summary
    this.displaySummary(report);
  }

  generateGlobalRecommendations() {
    const recommendations = [];
    
    // Check for modern format adoption
    const modernFormats = this.results.files.filter(img => 
      img.format === '.webp' || img.format === '.avif'
    ).length;
    
    const totalImages = this.results.files.length;
    const modernFormatRatio = modernFormats / totalImages;
    
    if (modernFormatRatio < 0.5) {
      recommendations.push({
        type: 'format-modernization',
        priority: 'high',
        title: 'Adopt modern image formats',
        description: `Only ${Math.round(modernFormatRatio * 100)}% of images use modern formats (WebP/AVIF)`,
        actions: [
          'Convert JPEG/PNG to WebP',
          'Use AVIF for even better compression',
          'Implement responsive images with multiple formats'
        ]
      });
    }
    
    // Check for oversized images
    const oversizedCount = this.results.files.filter(img => img.oversized).length;
    if (oversizedCount > 0) {
      recommendations.push({
        type: 'size-optimization',
        priority: 'high',
        title: 'Optimize oversized images',
        description: `${oversizedCount} images exceed the recommended size limit`,
        actions: [
          'Compress images without quality loss',
          'Resize images to appropriate dimensions',
          'Implement responsive images'
        ]
      });
    }
    
    // Check for lazy loading opportunities
    if (totalImages > 10) {
      recommendations.push({
        type: 'loading-optimization',
        priority: 'medium',
        title: 'Implement lazy loading',
        description: 'Large number of images could benefit from lazy loading',
        actions: [
          'Add loading="lazy" to img tags',
          'Implement intersection observer',
          'Prioritize above-the-fold images'
        ]
      });
    }
    
    return recommendations;
  }

  displaySummary(report) {
    console.log('\n📊 Image Optimization Summary:');
    console.log('═'.repeat(50));
    console.log(`📸 Total Images: ${report.summary.totalImages}`);
    console.log(`📦 Total Size: ${this.formatBytes(report.summary.totalSize)}`);
    console.log(`📏 Average Size: ${this.formatBytes(report.summary.averageSize)}`);
    console.log(`⚠️  Oversized Images: ${report.summary.oversizedImages}`);
    console.log(`🎯 Optimization Opportunities: ${report.summary.optimizationOpportunities}`);
    
    if (report.summary.errors > 0) {
      console.log(`❌ Errors: ${report.summary.errors}`);
    }
    
    console.log('\n📊 By Format:');
    Object.entries(report.byFormat).forEach(([format, data]) => {
      console.log(`  ${format}: ${data.count} files, ${this.formatBytes(data.size)}`);
    });
    
    if (report.recommendations.length > 0) {
      console.log('\n🎯 Top Recommendations:');
      report.recommendations.slice(0, 3).forEach((rec, index) => {
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

// Run the optimizer
const optimizer = new ImageOptimizer();
optimizer.run().catch(console.error);
