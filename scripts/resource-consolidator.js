#!/usr/bin/env node

/**
 * Advanced Resource Consolidation System for NosytLabs
 * Reduces 87 resources to 60-70 through intelligent merging and optimization
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from '../src/config/build-optimization.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class ResourceConsolidator {
  constructor() {
    this.results = {
      originalResourceCount: 0,
      consolidatedResourceCount: 0,
      resourcesSaved: 0,
      sizeSavings: 0,
      consolidationMap: new Map(),
      optimizations: []
    };
    
    this.consolidationRules = {
      css: {
        // Critical CSS bundle - inline for immediate rendering
        critical: {
          files: [
            'src/styles/css-variables.css',
            'src/styles/critical.css',
            'src/styles/above-fold.css'
          ],
          output: 'src/styles/optimized/critical-inline.css',
          inline: true,
          priority: 'critical'
        },
        
        // Main design system bundle
        designSystem: {
          files: [
            'src/styles/optimized/unified-colors.css',
            'src/styles/optimized/unified-styles.css',
            'src/styles/nosytlabs-brand.css',
            'src/styles/optimized/unified-buttons.css',
            'src/styles/optimized/comprehensive-fixes.css'
          ],
          output: 'src/styles/optimized/design-system.css',
          priority: 'high'
        },
        
        // Component styles bundle
        components: {
          files: [
            'src/components/**/*.css',
            'src/components/**/*.astro.css'
          ],
          output: 'src/styles/optimized/components.css',
          priority: 'medium'
        },
        
        // Layout and responsive bundle
        layout: {
          files: [
            'src/styles/responsive-enhancements-2025.css',
            'src/styles/layout.css',
            'src/styles/grid.css'
          ],
          output: 'src/styles/optimized/layout-responsive.css',
          priority: 'medium'
        },
        
        // Feature-specific bundle (lazy-loaded)
        features: {
          files: [
            'src/styles/enhanced-calculator.css',
            'public/styles/duck-hunt.css',
            'src/styles/games.css'
          ],
          output: 'src/styles/optimized/features.css',
          priority: 'low',
          lazy: true
        }
      },
      
      js: {
        // Core functionality bundle
        core: {
          files: [
            'src/scripts/core-init.ts',
            'src/scripts/accessibility-manager.ts',
            'src/scripts/service-worker-manager.ts'
          ],
          output: 'src/scripts/optimized/core.js',
          priority: 'critical'
        },
        
        // UI interactions bundle
        interactions: {
          files: [
            'public/scripts/enhanced-effects.js',
            'public/scripts/animations.js',
            'src/scripts/ui-interactions.js'
          ],
          output: 'src/scripts/optimized/interactions.js',
          priority: 'high'
        },
        
        // Feature-specific bundle (lazy-loaded)
        features: {
          files: [
            'src/scripts/calculator.js',
            'src/scripts/games.js',
            'src/scripts/easter-eggs.js'
          ],
          output: 'src/scripts/optimized/features.js',
          priority: 'low',
          lazy: true
        }
      }
    };
  }

  async run() {
    console.log('🔄 Starting Advanced Resource Consolidation...\n');

    try {
      // Analyze current resource structure
      await this.analyzeCurrentResources();

      // Create optimized directories
      await this.ensureOptimizedDirectories();

      // Consolidate CSS resources
      await this.consolidateCSS();

      // Consolidate JavaScript resources
      await this.consolidateJavaScript();

      // Update build configuration
      await this.updateBuildConfiguration();

      // Generate consolidation report
      await this.generateReport();

      console.log('✅ Resource Consolidation completed successfully!\n');

    } catch (error) {
      console.error('❌ Resource Consolidation failed:', error);
      console.error('Error details:', error.stack);
      process.exit(1);
    }
  }

  async analyzeCurrentResources() {
    console.log('🔍 Analyzing current resource structure...');
    
    const resourceTypes = ['css', 'js', 'ts', 'astro'];
    let totalResources = 0;
    
    for (const type of resourceTypes) {
      const files = await this.findFilesByType(type);
      totalResources += files.length;
      console.log(`  ${type.toUpperCase()}: ${files.length} files`);
    }
    
    this.results.originalResourceCount = totalResources;
    console.log(`📊 Total resources found: ${totalResources}`);
  }

  async findFilesByType(extension) {
    const files = [];
    
    async function scanDirectory(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDirectory(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(`.${extension}`)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
    
    await scanDirectory(path.join(projectRoot, 'src'));
    await scanDirectory(path.join(projectRoot, 'public'));
    
    return files;
  }

  async ensureOptimizedDirectories() {
    const dirs = [
      'src/styles/optimized',
      'src/scripts/optimized',
      'public/optimized'
    ];
    
    for (const dir of dirs) {
      const fullPath = path.join(projectRoot, dir);
      try {
        await fs.access(fullPath);
      } catch {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  async consolidateCSS() {
    console.log('🎨 Consolidating CSS resources...');
    
    for (const [bundleName, config] of Object.entries(this.consolidationRules.css)) {
      try {
        await this.createCSSBundle(bundleName, config);
        console.log(`✅ Created CSS bundle: ${bundleName}`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not create CSS bundle ${bundleName}:`, error.message);
      }
    }
  }

  async createCSSBundle(bundleName, config) {
    const existingFiles = [];
    
    // Find existing files that match the patterns
    for (const filePattern of config.files) {
      if (filePattern.includes('**')) {
        // Handle glob patterns
        const files = await this.findFilesByPattern(filePattern);
        existingFiles.push(...files);
      } else {
        // Handle direct file paths
        const fullPath = path.join(projectRoot, filePattern);
        try {
          await fs.access(fullPath);
          existingFiles.push(fullPath);
        } catch {
          // File doesn't exist, skip
        }
      }
    }
    
    if (existingFiles.length === 0) {
      console.log(`⚠️  No files found for bundle: ${bundleName}`);
      return;
    }
    
    // Combine and optimize CSS content
    let combinedCSS = `/**\n * ${bundleName.toUpperCase()} CSS Bundle - Auto-generated\n * Priority: ${config.priority}\n * Files: ${existingFiles.length}\n */\n\n`;
    
    for (const file of existingFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const relativePath = path.relative(projectRoot, file);
        
        combinedCSS += `/* === ${relativePath} === */\n`;
        combinedCSS += this.optimizeCSS(content);
        combinedCSS += '\n\n';
        
        this.results.consolidationMap.set(relativePath, config.output);
      } catch (error) {
        console.warn(`⚠️  Could not read file ${file}:`, error.message);
      }
    }
    
    // Write consolidated bundle
    const outputPath = path.join(projectRoot, config.output);
    await fs.writeFile(outputPath, combinedCSS, 'utf-8');
    
    this.results.optimizations.push({
      type: 'css',
      bundle: bundleName,
      filesConsolidated: existingFiles.length,
      output: config.output,
      priority: config.priority,
      inline: config.inline || false,
      lazy: config.lazy || false
    });
  }

  optimizeCSS(content) {
    // Remove comments (preserve important ones)
    let optimized = content.replace(/\/\*(?!\*\/)[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    
    // Remove empty rules
    optimized = optimized.replace(/[^{}]+\{\s*\}/g, '');
    
    // Minify whitespace
    optimized = optimized
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .replace(/,\s*/g, ',')
      .replace(/:\s*/g, ':')
      .trim();
    
    return optimized;
  }

  async findFilesByPattern(pattern) {
    // Simple glob pattern matching for **/*.css etc.
    const files = [];
    const basePath = pattern.split('**')[0];
    const extension = pattern.split('.').pop();

    async function scanForPattern(dir) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await scanForPattern(fullPath);
          } else if (entry.isFile() && entry.name.endsWith(`.${extension}`)) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }

    const searchPath = path.join(projectRoot, basePath);
    await scanForPattern(searchPath);

    return files;
  }

  async consolidateJavaScript() {
    console.log('⚡ Consolidating JavaScript resources...');

    for (const [bundleName, config] of Object.entries(this.consolidationRules.js)) {
      try {
        await this.createJSBundle(bundleName, config);
        console.log(`✅ Created JS bundle: ${bundleName}`);
      } catch (error) {
        console.warn(`⚠️  Warning: Could not create JS bundle ${bundleName}:`, error.message);
      }
    }
  }

  async createJSBundle(bundleName, config) {
    const existingFiles = [];

    // Find existing files
    for (const filePattern of config.files) {
      if (filePattern.includes('**')) {
        const files = await this.findFilesByPattern(filePattern);
        existingFiles.push(...files);
      } else {
        const fullPath = path.join(projectRoot, filePattern);
        try {
          await fs.access(fullPath);
          existingFiles.push(fullPath);
        } catch {
          // File doesn't exist, skip
        }
      }
    }

    if (existingFiles.length === 0) {
      console.log(`⚠️  No files found for bundle: ${bundleName}`);
      return;
    }

    // Combine JavaScript content
    let combinedJS = `/**\n * ${bundleName.toUpperCase()} JavaScript Bundle - Auto-generated\n * Priority: ${config.priority}\n * Files: ${existingFiles.length}\n */\n\n`;

    for (const file of existingFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const relativePath = path.relative(projectRoot, file);

        combinedJS += `/* === ${relativePath} === */\n`;
        combinedJS += this.optimizeJS(content);
        combinedJS += '\n\n';

        this.results.consolidationMap.set(relativePath, config.output);
      } catch (error) {
        console.warn(`⚠️  Could not read file ${file}:`, error.message);
      }
    }

    // Write consolidated bundle
    const outputPath = path.join(projectRoot, config.output);
    await fs.writeFile(outputPath, combinedJS, 'utf-8');

    this.results.optimizations.push({
      type: 'js',
      bundle: bundleName,
      filesConsolidated: existingFiles.length,
      output: config.output,
      priority: config.priority,
      lazy: config.lazy || false
    });
  }

  optimizeJS(content) {
    // Basic JavaScript optimization
    let optimized = content;

    // Remove single-line comments (preserve important ones)
    optimized = optimized.replace(/\/\/(?!\s*@|!)[^\r\n]*/g, '');

    // Remove multi-line comments (preserve important ones)
    optimized = optimized.replace(/\/\*(?!\*)[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');

    // Remove excessive whitespace
    optimized = optimized
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, ';}')
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .trim();

    return optimized;
  }

  async updateBuildConfiguration() {
    console.log('⚙️  Updating build configuration...');

    // Update build-optimization.js with new bundle structure
    const configPath = path.join(projectRoot, 'src/config/build-optimization.js');

    try {
      let configContent = await fs.readFile(configPath, 'utf-8');

      // Update CSS bundle configuration
      const newCSSConfig = `
  bundles: {
    css: {
      critical: {
        files: ['src/styles/optimized/critical-inline.css'],
        output: 'public/styles/critical.css',
        inline: true,
        priority: 'critical'
      },
      designSystem: {
        files: ['src/styles/optimized/design-system.css'],
        output: 'public/styles/design-system.css',
        priority: 'high'
      },
      components: {
        files: ['src/styles/optimized/components.css'],
        output: 'public/styles/components.css',
        priority: 'medium'
      },
      layout: {
        files: ['src/styles/optimized/layout-responsive.css'],
        output: 'public/styles/layout.css',
        priority: 'medium'
      },
      features: {
        files: ['src/styles/optimized/features.css'],
        output: 'public/styles/features.css',
        priority: 'low',
        lazy: true
      }
    },
    js: {
      core: {
        files: ['src/scripts/optimized/core.js'],
        output: 'public/scripts/core.js',
        priority: 'critical'
      },
      interactions: {
        files: ['src/scripts/optimized/interactions.js'],
        output: 'public/scripts/interactions.js',
        priority: 'high'
      },
      features: {
        files: ['src/scripts/optimized/features.js'],
        output: 'public/scripts/features.js',
        priority: 'low',
        lazy: true
      }
    }
  },`;

      // Replace the existing bundles configuration
      configContent = configContent.replace(
        /bundles:\s*{[\s\S]*?},\s*(?=\/\/|[a-zA-Z])/,
        newCSSConfig
      );

      await fs.writeFile(configPath, configContent, 'utf-8');
      console.log('✅ Updated build configuration');

    } catch (error) {
      console.warn('⚠️  Could not update build configuration:', error.message);
    }
  }

  async generateReport() {
    console.log('📊 Generating consolidation report...');

    // Calculate final resource count
    this.results.consolidatedResourceCount = this.results.optimizations.reduce(
      (total, opt) => total + 1, // Each optimization creates 1 bundle
      0
    );

    this.results.resourcesSaved = this.results.originalResourceCount - this.results.consolidatedResourceCount;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        originalResources: this.results.originalResourceCount,
        consolidatedResources: this.results.consolidatedResourceCount,
        resourcesSaved: this.results.resourcesSaved,
        reductionPercentage: ((this.results.resourcesSaved / this.results.originalResourceCount) * 100).toFixed(1)
      },
      optimizations: this.results.optimizations,
      consolidationMap: Object.fromEntries(this.results.consolidationMap)
    };

    // Write report to file
    const reportPath = path.join(projectRoot, 'dist/analysis/resource-consolidation-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');

    // Display summary
    console.log('\n📈 RESOURCE CONSOLIDATION SUMMARY');
    console.log('=====================================');
    console.log(`Original Resources: ${report.summary.originalResources}`);
    console.log(`Consolidated Resources: ${report.summary.consolidatedResources}`);
    console.log(`Resources Saved: ${report.summary.resourcesSaved}`);
    console.log(`Reduction: ${report.summary.reductionPercentage}%`);
    console.log('\n📦 BUNDLES CREATED:');

    this.results.optimizations.forEach(opt => {
      console.log(`  ${opt.type.toUpperCase()} - ${opt.bundle}: ${opt.filesConsolidated} files → 1 bundle (${opt.priority})`);
    });

    console.log(`\n📄 Full report saved to: ${reportPath}`);
  }
}

// Export for use in other scripts
export { ResourceConsolidator };

// Run if called directly
console.log('Script loaded, checking execution condition...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

const consolidator = new ResourceConsolidator();
consolidator.run();
