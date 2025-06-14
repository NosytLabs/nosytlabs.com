#!/usr/bin/env node

/**
 * CSS Optimization Script for NosytLabs
 * Implements build-optimization.js configuration
 * Consolidates, minifies, and optimizes CSS files
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from '../src/config/build-optimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class CSSOptimizer {
  constructor() {
    this.results = {
      originalSize: 0,
      optimizedSize: 0,
      duplicatesRemoved: 0,
      filesProcessed: 0,
      bundlesCreated: 0
    };
  }

  async run() {
    console.log('🎨 Starting CSS Optimization...\n');
    
    try {
      // Create optimized directory
      await this.ensureOptimizedDirectory();
      
      // Process CSS bundles according to build config
      await this.processCSSBundles();
      
      // Analyze and remove duplicates
      await this.analyzeDuplicates();
      
      // Generate optimization report
      await this.generateReport();
      
      console.log('✅ CSS Optimization completed successfully!\n');
      
    } catch (error) {
      console.error('❌ CSS Optimization failed:', error);
      process.exit(1);
    }
  }

  async ensureOptimizedDirectory() {
    const optimizedDir = path.join(projectRoot, 'src/styles/optimized');
    try {
      await fs.access(optimizedDir);
    } catch {
      await fs.mkdir(optimizedDir, { recursive: true });
      console.log('📁 Created optimized styles directory');
    }
  }

  async processCSSBundles() {
    console.log('📦 Processing CSS bundles...');
    
    const bundles = buildConfig.bundles.css;
    
    for (const [bundleName, bundleConfig] of Object.entries(bundles)) {
      try {
        await this.createBundle(bundleName, bundleConfig);
        this.results.bundlesCreated++;
        console.log(`✅ Created ${bundleName} bundle`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not create ${bundleName} bundle:`, error.message);
      }
    }
  }

  async createBundle(bundleName, bundleConfig) {
    const bundleContent = [];
    let totalSize = 0;

    // Add bundle header
    bundleContent.push(`/**`);
    bundleContent.push(` * ${bundleName.toUpperCase()} CSS Bundle - NosytLabs`);
    bundleContent.push(` * Generated: ${new Date().toISOString()}`);
    bundleContent.push(` * Optimized for performance and maintainability`);
    bundleContent.push(` */\n`);

    // Process each file in the bundle
    for (const filePath of bundleConfig.files) {
      try {
        const fullPath = path.resolve(projectRoot, filePath);
        const content = await fs.readFile(fullPath, 'utf-8');
        const fileSize = Buffer.byteLength(content, 'utf-8');
        
        totalSize += fileSize;
        this.results.originalSize += fileSize;
        this.results.filesProcessed++;

        // Add file separator comment
        bundleContent.push(`/* ========== ${path.basename(filePath)} ========== */`);
        bundleContent.push(content);
        bundleContent.push(''); // Empty line for separation
        
      } catch (error) {
        console.warn(`⚠️  Warning: Could not read ${filePath}:`, error.message);
      }
    }

    // Optimize the bundle content
    const optimizedContent = this.optimizeCSS(bundleContent.join('\n'));
    const optimizedSize = Buffer.byteLength(optimizedContent, 'utf-8');
    this.results.optimizedSize += optimizedSize;

    // Write the optimized bundle
    const outputPath = path.resolve(projectRoot, bundleConfig.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, optimizedContent, 'utf-8');

    // Log bundle statistics
    const compressionRatio = ((totalSize - optimizedSize) / totalSize * 100).toFixed(1);
    console.log(`  📊 ${bundleName}: ${this.formatBytes(totalSize)} → ${this.formatBytes(optimizedSize)} (${compressionRatio}% reduction)`);
  }

  optimizeCSS(content) {
    if (!buildConfig.optimization.css.minify) {
      return content;
    }

    let optimized = content;

    // Remove comments (but preserve important ones)
    if (buildConfig.optimization.css.removeComments) {
      optimized = optimized.replace(/\/\*(?!\*\/)[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    }

    // Remove empty rules
    if (buildConfig.optimization.css.removeEmptyRules) {
      optimized = optimized.replace(/[^{}]+\{\s*\}/g, '');
    }

    // Minify whitespace
    optimized = optimized
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .replace(/,\s*/g, ',') // Remove spaces after commas
      .replace(/:\s*/g, ':') // Remove spaces after colons
      .trim();

    return optimized;
  }

  async analyzeDuplicates() {
    console.log('🔍 Analyzing CSS duplicates...');
    
    const stylesDir = path.join(projectRoot, 'src/styles');
    const files = await this.getAllCSSFiles(stylesDir);
    
    const duplicateRules = new Map();
    const duplicateSelectors = new Map();
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        
        // Extract CSS rules (simplified)
        const rules = content.match(/[^{}]+\{[^{}]*\}/g) || [];
        
        for (const rule of rules) {
          const trimmedRule = rule.trim();
          if (duplicateRules.has(trimmedRule)) {
            duplicateRules.set(trimmedRule, duplicateRules.get(trimmedRule) + 1);
            this.results.duplicatesRemoved++;
          } else {
            duplicateRules.set(trimmedRule, 1);
          }
        }
        
      } catch (error) {
        console.warn(`⚠️  Warning: Could not analyze ${file}:`, error.message);
      }
    }

    // Report duplicates
    const duplicates = Array.from(duplicateRules.entries())
      .filter(([rule, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);

    if (duplicates.length > 0) {
      console.log(`📋 Found ${duplicates.length} duplicate CSS rules:`);
      duplicates.slice(0, 5).forEach(([rule, count]) => {
        const preview = rule.substring(0, 50) + (rule.length > 50 ? '...' : '');
        console.log(`  • ${preview} (${count} times)`);
      });
    }
  }

  async getAllCSSFiles(dir) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && entry.name !== 'optimized') {
          files.push(...await this.getAllCSSFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.css')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not read directory ${dir}:`, error.message);
    }
    
    return files;
  }

  async generateReport() {
    const totalReduction = this.results.originalSize > 0 
      ? ((this.results.originalSize - this.results.optimizedSize) / this.results.originalSize * 100).toFixed(1)
      : 0;

    console.log('\n📊 CSS Optimization Report:');
    console.log('================================');
    console.log(`Files Processed: ${this.results.filesProcessed}`);
    console.log(`Bundles Created: ${this.results.bundlesCreated}`);
    console.log(`Original Size: ${this.formatBytes(this.results.originalSize)}`);
    console.log(`Optimized Size: ${this.formatBytes(this.results.optimizedSize)}`);
    console.log(`Size Reduction: ${totalReduction}%`);
    console.log(`Duplicates Found: ${this.results.duplicatesRemoved}`);
    
    // Check against thresholds
    const cssThreshold = buildConfig.thresholds.cssSize;
    if (this.results.optimizedSize > cssThreshold) {
      console.log(`⚠️  Warning: Optimized CSS size (${this.formatBytes(this.results.optimizedSize)}) exceeds threshold (${this.formatBytes(cssThreshold)})`);
    } else {
      console.log(`✅ CSS size is within threshold (${this.formatBytes(cssThreshold)})`);
    }

    // Save report to file
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      thresholds: buildConfig.thresholds,
      optimization: buildConfig.optimization.css
    };

    const reportPath = path.join(projectRoot, 'src/styles/optimized/optimization-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${reportPath}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run the optimizer
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new CSSOptimizer();
  optimizer.run().catch(console.error);
}

export default CSSOptimizer;
