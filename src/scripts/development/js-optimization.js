/**
 * JavaScript Bundle Optimization Script
 * Consolidates and optimizes JavaScript modules for better performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JSOptimizer {
  constructor() {
    this.distPath = path.join(__dirname, '..', 'dist');
    this.srcPath = path.join(__dirname, '..', 'src');
    this.outputPath = path.join(__dirname, '..', 'dist', 'assets', 'js');

    // JavaScript bundle configuration
    this.bundles = {
      core: {
        name: 'core.min.js',
        files: [
          'dist/scripts/main.js',
          'dist/scripts/core/main.js',
          'dist/scripts/core/utils.js',
          'dist/scripts/theme.js',
          'dist/scripts/resource-loader.js'
        ],
        priority: 'high'
      },
      performance: {
        name: 'performance.min.js',
        files: [
          'dist/scripts/performance/lazy-loading.js',
          'dist/scripts/performance/resource-optimization.js',
          'dist/scripts/image-optimization.js',
          'dist/scripts/service-worker-registration.js',
          'dist/scripts/resource-hints.js',
          'dist/scripts/resource-error-handler.js'
        ],
        priority: 'high'
      },
      ui: {
        name: 'ui.min.js',
        files: [
          'dist/scripts/animations.js',
          'dist/scripts/ui/animations.js',
          'dist/scripts/ui/theme.js',
          'dist/scripts/particles-init.js',
          'dist/scripts/particles-config.js',
          'dist/scripts/passive-income-particles.js'
        ],
        priority: 'medium'
      },
      nosytos95: {
        name: 'nosytos95.min.js',
        files: [
          'dist/scripts/nosytos95.js',
          'dist/scripts/nosytos95/window-manager.js',
          'dist/scripts/nosytos95/start-menu.js',
          'dist/scripts/nosytos95/taskbar.js',
          'dist/scripts/nosytos95/desktop-icons.js',
          'dist/scripts/nosytos95/file-system.js'
        ],
        priority: 'low',
        loadCondition: 'nosytos95' // Only load on NosytOS95 pages
      },
      games: {
        name: 'games.min.js',
        files: [
          'dist/scripts/duck-hunt-game.js',
          'dist/scripts/nosytos95/duck-hunt.js',
          'dist/scripts/minesweeper.js'
        ],
        priority: 'low',
        loadCondition: 'games'
      }
    };
  }

  /**
   * Optimize all JavaScript bundles
   */
  async optimize() {
    console.log('⚡ Starting JavaScript optimization...');
    console.log('📁 Output path:', this.outputPath);
    console.log('📁 Dist path:', this.distPath);

    // Create output directory
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
      console.log('✅ Created output directory');
    }

    // Process each bundle
    for (const [bundleName, config] of Object.entries(this.bundles)) {
      await this.createBundle(bundleName, config);
    }

    // Generate module loader
    await this.generateModuleLoader();

    // Update HTML files
    await this.updateHTMLReferences();

    console.log('✅ JavaScript optimization completed!');
  }

  /**
   * Create optimized JavaScript bundle
   */
  async createBundle(bundleName, config) {
    console.log(`📦 Creating ${bundleName} bundle...`);

    let combinedJS = '';
    let processedFiles = 0;

    // Add bundle header
    combinedJS += `/*!\n * ${config.name} - ${bundleName} bundle\n * Generated: ${new Date().toISOString()}\n * Priority: ${config.priority}\n */\n\n`;

    // Add IIFE wrapper to prevent global pollution
    combinedJS += '(function() {\n"use strict";\n\n';

    // Process each file in the bundle
    for (const filePath of config.files) {
      const fullPath = path.resolve(filePath);

      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');

          // Add file separator comment
          combinedJS += `/* === ${path.basename(filePath)} === */\n`;

          // Clean up the content (remove duplicate IIFE wrappers, etc.)
          const cleanedContent = this.cleanJSContent(content);
          combinedJS += cleanedContent;
          combinedJS += '\n\n';

          processedFiles++;
        } catch (error) {
          console.warn(`⚠️  Could not read ${filePath}: ${error.message}`);
        }
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    }

    // Close IIFE wrapper
    combinedJS += '})();\n';

    if (processedFiles === 0) {
      console.warn(`⚠️  No files processed for ${bundleName} bundle`);
      return;
    }

    // Basic minification (without Terser for now)
    try {
      // Simple minification
      let minifiedJS = combinedJS
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/;\s*}/g, '}') // Clean up semicolons
        .replace(/\s*{\s*/g, '{') // Clean up braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .trim();

      const minified = { code: minifiedJS };

      // Write optimized bundle
      const outputFile = path.join(this.outputPath, config.name);
      fs.writeFileSync(outputFile, minified.code);

      // Get file sizes
      const originalSize = Buffer.byteLength(combinedJS, 'utf8');
      const minifiedSize = Buffer.byteLength(minified.code, 'utf8');
      const savings = Math.round((1 - minifiedSize / originalSize) * 100);

      console.log(`✅ ${bundleName} bundle created: ${config.name}`);
      console.log(`   📊 ${Math.round(originalSize/1024)}KB → ${Math.round(minifiedSize/1024)}KB (${savings}% reduction, ${processedFiles} files)`);

    } catch (error) {
      console.error(`❌ Error minifying ${bundleName} bundle:`, error.message);

      // Fallback: save unminified version
      const outputFile = path.join(this.outputPath, config.name.replace('.min.js', '.js'));
      fs.writeFileSync(outputFile, combinedJS);
      console.log(`⚠️  Saved unminified version: ${path.basename(outputFile)}`);
    }
  }

  /**
   * Clean JavaScript content for bundling
   */
  cleanJSContent(content) {
    // Remove existing IIFE wrappers
    content = content.replace(/^\s*\(function\(\)\s*\{\s*['"]use strict['"];\s*/gm, '');
    content = content.replace(/\}\)\(\);\s*$/gm, '');

    // Remove duplicate 'use strict' declarations
    content = content.replace(/['"]use strict['"];\s*/g, '');

    // Remove empty lines at start/end
    content = content.trim();

    return content;
  }

  /**
   * Generate intelligent module loader
   */
  async generateModuleLoader() {
    console.log('🔧 Generating module loader...');

    const loaderCode = `
/**
 * NosytLabs Intelligent Module Loader
 * Loads JavaScript bundles based on page requirements and user interaction
 */
(function() {
  'use strict';

  const ModuleLoader = {
    loaded: new Set(),
    loading: new Set(),

    /**
     * Load a module bundle
     */
    load: function(bundleName, priority = 'medium') {
      if (this.loaded.has(bundleName) || this.loading.has(bundleName)) {
        return Promise.resolve();
      }

      this.loading.add(bundleName);

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/assets/js/' + bundleName + '.min.js';
        script.async = true;

        // Set loading priority
        if (priority === 'high') {
          script.setAttribute('importance', 'high');
        }

        script.onload = () => {
          this.loading.delete(bundleName);
          this.loaded.add(bundleName);
          console.log('✅ Loaded module:', bundleName);
          resolve();
        };

        script.onerror = () => {
          this.loading.delete(bundleName);
          console.error('❌ Failed to load module:', bundleName);
          reject(new Error('Failed to load module: ' + bundleName));
        };

        document.head.appendChild(script);
      });
    },

    /**
     * Load modules based on page content
     */
    loadForPage: function() {
      const path = window.location.pathname;

      // Always load core modules
      this.load('core', 'high');
      this.load('performance', 'high');

      // Load UI modules after core
      setTimeout(() => {
        this.load('ui', 'medium');
      }, 100);

      // Load page-specific modules
      if (path.includes('nosytos95')) {
        this.load('nosytos95', 'medium').then(() => {
          this.load('games', 'low');
        });
      }

      // Load modules on user interaction
      this.setupInteractionLoading();
    },

    /**
     * Setup interaction-based loading
     */
    setupInteractionLoading: function() {
      // Load games on first user interaction
      const loadGames = () => {
        this.load('games', 'low');
        document.removeEventListener('click', loadGames);
        document.removeEventListener('touchstart', loadGames);
      };

      document.addEventListener('click', loadGames, { once: true });
      document.addEventListener('touchstart', loadGames, { once: true });
    }
  };

  // Auto-load modules when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModuleLoader.loadForPage());
  } else {
    ModuleLoader.loadForPage();
  }

  // Expose to global scope
  window.NosytModuleLoader = ModuleLoader;
})();
`;

    // Write module loader
    const loaderPath = path.join(this.outputPath, 'module-loader.js');
    fs.writeFileSync(loaderPath, loaderCode.trim());

    console.log('✅ Module loader generated');
  }

  /**
   * Update HTML files to use new JavaScript bundles
   */
  async updateHTMLReferences() {
    console.log('🔗 Updating HTML JavaScript references...');

    const htmlFiles = this.findHTMLFiles(this.distPath);

    for (const htmlFile of htmlFiles) {
      await this.updateHTMLFile(htmlFile);
    }

    console.log(`✅ Updated ${htmlFiles.length} HTML files`);
  }

  /**
   * Find all HTML files
   */
  findHTMLFiles(dir) {
    let htmlFiles = [];

    if (!fs.existsSync(dir)) return htmlFiles;

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.')) {
        htmlFiles = htmlFiles.concat(this.findHTMLFiles(fullPath));
      } else if (path.extname(item) === '.html') {
        htmlFiles.push(fullPath);
      }
    });

    return htmlFiles;
  }

  /**
   * Update individual HTML file
   */
  async updateHTMLFile(htmlFile) {
    try {
      let content = fs.readFileSync(htmlFile, 'utf8');

      // Remove old script references (except essential ones)
      content = content.replace(/<script[^>]*src="[^"]*\/scripts\/[^"]*"[^>]*><\/script>/g, '');

      // Add module loader before closing body tag
      const moduleLoaderScript = '  <script src="/assets/js/module-loader.js"></script>\n';
      content = content.replace('</body>', `${moduleLoaderScript}</body>`);

      fs.writeFileSync(htmlFile, content);

    } catch (error) {
      console.warn(`⚠️  Could not update ${htmlFile}: ${error.message}`);
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new JSOptimizer();
  optimizer.optimize().catch(console.error);
}

export default JSOptimizer;
