#!/usr/bin/env node

/**
 * Advanced Image Optimization Pipeline
 * Generates responsive images in multiple formats (WebP, AVIF, optimized JPEG/PNG)
 * Creates responsive image sets with proper sizing
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

class ImageOptimizer {
  constructor(options = {}) {
    this.options = {
      inputDir: options.inputDir || 'src/assets/images',
      outputDir: options.outputDir || 'public/images/optimized',
      formats: options.formats || ['webp', 'avif', 'jpeg'],
      sizes: options.sizes || [320, 640, 768, 1024, 1280, 1920],
      quality: {
        jpeg: 80,
        webp: 80,
        avif: 70,
        png: 90,
        ...options.quality
      },
      ...options
    };
    
    this.stats = {
      processed: 0,
      skipped: 0,
      errors: 0,
      totalSizeBefore: 0,
      totalSizeAfter: 0
    };
  }
  
  async optimize() {
    console.log('🖼️  Starting image optimization pipeline...');
    console.log(`Input: ${this.options.inputDir}`);
    console.log(`Output: ${this.options.outputDir}`);
    console.log(`Formats: ${this.options.formats.join(', ')}`);
    console.log(`Sizes: ${this.options.sizes.join(', ')}`);
    
    try {
      // Ensure output directory exists
      await this.ensureDirectory(this.options.outputDir);
      
      // Find all images
      const images = await this.findImages();
      console.log(`Found ${images.length} images to process`);
      
      // Process images in batches to avoid memory issues
      const batchSize = 5;
      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize);
        await Promise.all(batch.map(image => this.processImage(image)));
        
        const progress = Math.round(((i + batch.length) / images.length) * 100);
        console.log(`Progress: ${progress}% (${i + batch.length}/${images.length})`);
      }
      
      // Generate manifest
      await this.generateManifest();
      
      // Print statistics
      this.printStats();
      
    } catch (error) {
      console.error('❌ Optimization failed:', error);
      process.exit(1);
    }
  }
  
  async findImages() {
    const pattern = path.join(this.options.inputDir, '**/*.{jpg,jpeg,png,gif,svg}');
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
  }
  
  async processImage(imagePath) {
    try {
      const relativePath = path.relative(this.options.inputDir, imagePath);
      const parsedPath = path.parse(relativePath);
      const outputBasePath = path.join(this.options.outputDir, parsedPath.dir, parsedPath.name);
      
      // Get original file stats
      const originalStats = await fs.stat(imagePath);
      this.stats.totalSizeBefore += originalStats.size;
      
      // Skip SVG files (copy as-is)
      if (parsedPath.ext.toLowerCase() === '.svg') {
        await this.copySvg(imagePath, outputBasePath + '.svg');
        this.stats.skipped++;
        return;
      }
      
      // Load image with Sharp
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Generate responsive variants
      const variants = await this.generateVariants(image, metadata, outputBasePath);
      
      // Update stats
      this.stats.processed++;
      
      console.log(`✅ Processed: ${relativePath} (${variants.length} variants)`);
      
    } catch (error) {
      console.error(`❌ Failed to process ${imagePath}:`, error.message);
      this.stats.errors++;
    }
  }
  
  async generateVariants(image, metadata, outputBasePath) {
    const variants = [];
    
    // Filter sizes that make sense for this image
    const validSizes = this.options.sizes.filter(size => size <= metadata.width);
    if (validSizes.length === 0) {
      validSizes.push(metadata.width);
    }
    
    for (const size of validSizes) {
      for (const format of this.options.formats) {
        try {
          const outputPath = `${outputBasePath}-${size}w.${format}`;
          await this.ensureDirectory(path.dirname(outputPath));
          
          let pipeline = image.clone().resize(size, null, {
            withoutEnlargement: true,
            fastShrinkOnLoad: true
          });
          
          // Apply format-specific optimizations
          switch (format) {
            case 'webp':
              pipeline = pipeline.webp({
                quality: this.options.quality.webp,
                effort: 6,
                smartSubsample: true
              });
              break;
              
            case 'avif':
              pipeline = pipeline.avif({
                quality: this.options.quality.avif,
                effort: 9,
                chromaSubsampling: '4:2:0'
              });
              break;
              
            case 'jpeg':
              pipeline = pipeline.jpeg({
                quality: this.options.quality.jpeg,
                progressive: true,
                mozjpeg: true,
                optimizeScans: true
              });
              break;
              
            case 'png':
              pipeline = pipeline.png({
                quality: this.options.quality.png,
                compressionLevel: 9,
                adaptiveFiltering: true,
                palette: true
              });
              break;
          }
          
          await pipeline.toFile(outputPath);
          
          // Update stats
          const stats = await fs.stat(outputPath);
          this.stats.totalSizeAfter += stats.size;
          
          variants.push({
            path: outputPath,
            size: size,
            format: format,
            fileSize: stats.size
          });
          
        } catch (error) {
          console.warn(`⚠️  Failed to generate ${format} variant at ${size}w:`, error.message);
        }
      }
    }
    
    return variants;
  }
  
  async copySvg(inputPath, outputPath) {
    await this.ensureDirectory(path.dirname(outputPath));
    await fs.copyFile(inputPath, outputPath);
    
    const stats = await fs.stat(outputPath);
    this.stats.totalSizeAfter += stats.size;
  }
  
  async generateManifest() {
    const manifestPath = path.join(this.options.outputDir, 'manifest.json');
    
    // Scan output directory for generated images
    const pattern = path.join(this.options.outputDir, '**/*.{webp,avif,jpeg,jpg,png,svg}');
    const files = await new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
    
    // Group files by base name
    const imageGroups = {};
    
    for (const file of files) {
      const relativePath = path.relative(this.options.outputDir, file);
      const parsedPath = path.parse(relativePath);
      
      // Extract base name and size
      const match = parsedPath.name.match(/^(.+?)(?:-(\d+)w)?$/);
      if (match) {
        const baseName = match[1];
        const size = match[2] ? parseInt(match[2]) : null;
        const format = parsedPath.ext.substring(1);
        
        if (!imageGroups[baseName]) {
          imageGroups[baseName] = {
            baseName,
            variants: []
          };
        }
        
        const stats = await fs.stat(file);
        imageGroups[baseName].variants.push({
          path: relativePath,
          size,
          format,
          fileSize: stats.size
        });
      }
    }
    
    // Sort variants by size and format
    Object.values(imageGroups).forEach(group => {
      group.variants.sort((a, b) => {
        if (a.size !== b.size) return (a.size || 0) - (b.size || 0);
        return a.format.localeCompare(b.format);
      });
    });
    
    const manifest = {
      generated: new Date().toISOString(),
      stats: this.stats,
      images: imageGroups
    };
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Generated manifest: ${manifestPath}`);
  }
  
  async ensureDirectory(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  
  printStats() {
    const compressionRatio = this.stats.totalSizeBefore > 0 
      ? (1 - this.stats.totalSizeAfter / this.stats.totalSizeBefore) * 100 
      : 0;
    
    console.log('\n📊 Optimization Statistics:');
    console.log(`✅ Processed: ${this.stats.processed} images`);
    console.log(`⏭️  Skipped: ${this.stats.skipped} images`);
    console.log(`❌ Errors: ${this.stats.errors} images`);
    console.log(`📦 Original size: ${this.formatBytes(this.stats.totalSizeBefore)}`);
    console.log(`📦 Optimized size: ${this.formatBytes(this.stats.totalSizeAfter)}`);
    console.log(`💾 Compression: ${compressionRatio.toFixed(1)}%`);
    console.log(`💰 Saved: ${this.formatBytes(this.stats.totalSizeBefore - this.stats.totalSizeAfter)}`);
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    
    switch (key) {
      case 'input':
        options.inputDir = value;
        break;
      case 'output':
        options.outputDir = value;
        break;
      case 'formats':
        options.formats = value.split(',');
        break;
      case 'sizes':
        options.sizes = value.split(',').map(Number);
        break;
      case 'quality':
        options.quality = JSON.parse(value);
        break;
    }
  }
  
  const optimizer = new ImageOptimizer(options);
  optimizer.optimize().catch(console.error);
}

module.exports = ImageOptimizer;
