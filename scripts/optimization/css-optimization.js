#!/usr/bin/env node

/**
 * Advanced CSS Optimization Pipeline
 * - Removes unused CSS
 * - Optimizes critical CSS
 * - Generates CSS bundles
 * - Implements CSS containment
 */

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const criticalCss = require('critical');

class CSSOptimizer {
  constructor(options = {}) {
    this.options = {
      inputDir: options.inputDir || 'src',
      outputDir: options.outputDir || 'public/styles/optimized',
      htmlDir: options.htmlDir || 'dist',
      criticalDir: options.criticalDir || 'public/styles/critical',
      purgeContent: options.purgeContent || ['src/**/*.{astro,html,js,jsx,ts,tsx}', 'dist/**/*.html'],
      safelist: options.safelist || [
        // Common utility classes
        /^animate-/,
        /^transition-/,
        /^duration-/,
        /^ease-/,
        /^delay-/,
        // State classes
        /^hover:/,
        /^focus:/,
        /^active:/,
        /^disabled:/,
        // Responsive classes
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,
        // Dynamic classes
        /^loading/,
        /^loaded/,
        /^error/,
        // Win95 theme classes
        /^win95-/,
        /^nosyt-/
      ],
      ...options
    };
    
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      criticalSize: 0,
      removedRules: 0,
      processedFiles: 0
    };
  }
  
  async optimize() {
    console.log('🎨 Starting CSS optimization pipeline...');
    
    try {
      // Ensure output directories exist
      await this.ensureDirectory(this.options.outputDir);
      await this.ensureDirectory(this.options.criticalDir);
      
      // Find all CSS files
      const cssFiles = await this.findCSSFiles();
      console.log(`Found ${cssFiles.length} CSS files to process`);
      
      // Process each CSS file
      for (const cssFile of cssFiles) {
        await this.processCSSFile(cssFile);
      }
      
      // Generate critical CSS for each page
      await this.generateCriticalCSS();
      
      // Create optimized bundles
      await this.createOptimizedBundles();
      
      // Generate CSS manifest
      await this.generateManifest();
      
      // Print statistics
      this.printStats();
      
    } catch (error) {
      console.error('❌ CSS optimization failed:', error);
      process.exit(1);
    }
  }
  
  async findCSSFiles() {
    const patterns = [
      path.join(this.options.inputDir, '**/*.css'),
      'public/styles/**/*.css'
    ];
    
    const files = [];
    for (const pattern of patterns) {
      const matches = await new Promise((resolve, reject) => {
        glob(pattern, (err, files) => {
          if (err) reject(err);
          else resolve(files);
        });
      });
      files.push(...matches);
    }
    
    return [...new Set(files)]; // Remove duplicates
  }
  
  async processCSSFile(cssFile) {
    try {
      console.log(`Processing: ${cssFile}`);
      
      const css = await fs.readFile(cssFile, 'utf8');
      this.stats.originalSize += Buffer.byteLength(css, 'utf8');
      
      // Create PostCSS processor
      const processor = postcss([
        // Remove unused CSS
        purgecss({
          content: this.options.purgeContent,
          safelist: this.options.safelist,
          keyframes: true,
          fontFace: true,
          variables: true
        }),
        
        // Add CSS containment
        this.addCSSContainment(),
        
        // Optimize and minify
        cssnano({
          preset: ['advanced', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            colormin: true,
            convertValues: true,
            discardDuplicates: true,
            discardEmpty: true,
            mergeIdents: true,
            mergeRules: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifyParams: true,
            minifySelectors: true,
            normalizeCharset: true,
            normalizeDisplayValues: true,
            normalizePositions: true,
            normalizeRepeatStyle: true,
            normalizeString: true,
            normalizeTimingFunctions: true,
            normalizeUnicode: true,
            normalizeUrl: true,
            orderedValues: true,
            reduceIdents: true,
            reduceInitial: true,
            reduceTransforms: true,
            svgo: true,
            uniqueSelectors: true,
            zindex: false // Preserve z-index values
          }]
        })
      ]);
      
      const result = await processor.process(css, {
        from: cssFile,
        to: undefined
      });
      
      // Calculate output path
      const relativePath = path.relative(process.cwd(), cssFile);
      const outputPath = path.join(this.options.outputDir, path.basename(cssFile));
      
      // Write optimized CSS
      await fs.writeFile(outputPath, result.css);
      
      this.stats.optimizedSize += Buffer.byteLength(result.css, 'utf8');
      this.stats.processedFiles++;
      
      console.log(`✅ Optimized: ${cssFile} -> ${outputPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to process ${cssFile}:`, error.message);
    }
  }
  
  addCSSContainment() {
    return {
      postcssPlugin: 'css-containment',
      Rule(rule) {
        // Add containment to component selectors
        if (rule.selector.match(/\.(card|modal|sidebar|header|footer|nav)/)) {
          rule.append({
            prop: 'contain',
            value: 'layout style'
          });
        }
        
        // Add containment to grid/flex containers
        if (rule.nodes.some(node => 
          node.prop === 'display' && 
          (node.value.includes('grid') || node.value.includes('flex'))
        )) {
          rule.append({
            prop: 'contain',
            value: 'layout'
          });
        }
        
        // Add will-change for animated elements
        if (rule.nodes.some(node => 
          node.prop === 'transform' || 
          node.prop === 'animation' ||
          node.prop.startsWith('transition')
        )) {
          rule.append({
            prop: 'will-change',
            value: 'transform'
          });
        }
      }
    };
  }
  
  async generateCriticalCSS() {
    console.log('🔥 Generating critical CSS...');
    
    // Find HTML files
    const htmlFiles = await new Promise((resolve, reject) => {
      glob(path.join(this.options.htmlDir, '**/*.html'), (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
    
    for (const htmlFile of htmlFiles.slice(0, 10)) { // Limit to first 10 pages
      try {
        const relativePath = path.relative(this.options.htmlDir, htmlFile);
        const pageName = path.parse(relativePath).name;
        const outputPath = path.join(this.options.criticalDir, `${pageName}.css`);
        
        const { css } = await criticalCss.generate({
          inline: false,
          base: this.options.htmlDir,
          src: relativePath,
          target: {
            css: outputPath
          },
          width: 1300,
          height: 900,
          dimensions: [
            { width: 375, height: 667 },   // Mobile
            { width: 768, height: 1024 },  // Tablet
            { width: 1300, height: 900 }   // Desktop
          ],
          penthouse: {
            blockJSRequests: false,
            timeout: 30000
          }
        });
        
        this.stats.criticalSize += Buffer.byteLength(css, 'utf8');
        console.log(`✅ Critical CSS generated for: ${pageName}`);
        
      } catch (error) {
        console.warn(`⚠️  Failed to generate critical CSS for ${htmlFile}:`, error.message);
      }
    }
  }
  
  async createOptimizedBundles() {
    console.log('📦 Creating optimized CSS bundles...');
    
    // Create different bundles for different page types
    const bundles = {
      'core.css': [
        'public/styles/global.css',
        'public/styles/components.css'
      ],
      'blog.css': [
        'public/styles/blog.css',
        'public/styles/markdown.css'
      ],
      'win95.css': [
        'public/styles/win95-authentic.css',
        'public/styles/nosyt-window-manager.css'
      ],
      'admin.css': [
        'public/styles/admin.css'
      ]
    };
    
    for (const [bundleName, files] of Object.entries(bundles)) {
      try {
        let combinedCSS = '';
        
        for (const file of files) {
          try {
            const css = await fs.readFile(file, 'utf8');
            combinedCSS += `/* ${file} */\n${css}\n\n`;
          } catch (error) {
            console.warn(`⚠️  Could not read ${file} for bundle ${bundleName}`);
          }
        }
        
        if (combinedCSS) {
          // Process combined CSS
          const processor = postcss([
            cssnano({
              preset: ['default', {
                discardComments: { removeAll: true }
              }]
            })
          ]);
          
          const result = await processor.process(combinedCSS, {
            from: undefined,
            to: undefined
          });
          
          const outputPath = path.join(this.options.outputDir, bundleName);
          await fs.writeFile(outputPath, result.css);
          
          console.log(`✅ Bundle created: ${bundleName} (${this.formatBytes(Buffer.byteLength(result.css, 'utf8'))})`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to create bundle ${bundleName}:`, error.message);
      }
    }
  }
  
  async generateManifest() {
    const manifestPath = path.join(this.options.outputDir, 'manifest.json');
    
    // Scan output directory
    const optimizedFiles = await new Promise((resolve, reject) => {
      glob(path.join(this.options.outputDir, '**/*.css'), (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
    
    const criticalFiles = await new Promise((resolve, reject) => {
      glob(path.join(this.options.criticalDir, '**/*.css'), (err, files) => {
        if (err) reject(err);
        else resolve(files);
      });
    });
    
    const fileInfo = async (files, baseDir) => {
      const info = {};
      for (const file of files) {
        const relativePath = path.relative(baseDir, file);
        const stats = await fs.stat(file);
        info[relativePath] = {
          size: stats.size,
          sizeFormatted: this.formatBytes(stats.size),
          modified: stats.mtime
        };
      }
      return info;
    };
    
    const manifest = {
      generated: new Date().toISOString(),
      stats: this.stats,
      optimized: await fileInfo(optimizedFiles, this.options.outputDir),
      critical: await fileInfo(criticalFiles, this.options.criticalDir),
      compressionRatio: this.stats.originalSize > 0 
        ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize * 100).toFixed(2) + '%'
        : '0%'
    };
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Generated CSS manifest: ${manifestPath}`);
  }
  
  async ensureDirectory(dir) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
  
  printStats() {
    const compressionRatio = this.stats.originalSize > 0 
      ? (1 - this.stats.optimizedSize / this.stats.originalSize) * 100 
      : 0;
    
    console.log('\n📊 CSS Optimization Statistics:');
    console.log(`✅ Processed: ${this.stats.processedFiles} files`);
    console.log(`📦 Original size: ${this.formatBytes(this.stats.originalSize)}`);
    console.log(`📦 Optimized size: ${this.formatBytes(this.stats.optimizedSize)}`);
    console.log(`🔥 Critical CSS size: ${this.formatBytes(this.stats.criticalSize)}`);
    console.log(`💾 Compression: ${compressionRatio.toFixed(1)}%`);
    console.log(`💰 Saved: ${this.formatBytes(this.stats.originalSize - this.stats.optimizedSize)}`);
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
      case 'html':
        options.htmlDir = value;
        break;
      case 'critical':
        options.criticalDir = value;
        break;
    }
  }
  
  const optimizer = new CSSOptimizer(options);
  optimizer.optimize().catch(console.error);
}

module.exports = CSSOptimizer;
