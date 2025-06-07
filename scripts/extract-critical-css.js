#!/usr/bin/env node

/**
 * Critical CSS Extraction for NosytLabs
 * Extracts above-the-fold CSS for faster initial page loads
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🎨 NosytLabs Critical CSS Extraction\n');

/**
 * Critical CSS extractor
 */
class CriticalCSSExtractor {
  constructor() {
    this.criticalSelectors = [
      // Layout essentials
      'html', 'body', '*', '*::before', '*::after',
      
      // Header and navigation
      'header', '.site-header', 'nav', '.navigation',
      '.logo', '.nav-link', '.mobile-menu-toggle',
      
      // Hero section (above the fold)
      '.hero', '.hero-section', '.hero-content',
      '.hero-title', '.hero-subtitle', '.hero-description',
      '.hero-cta', '.btn-primary', '.btn-secondary',
      
      // Critical layout components
      '.container', '.wrapper', '.grid', '.flex',
      '.sr-only', '.skip-nav', '.skip-link',
      
      // Typography essentials
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'button', 'input', 'textarea',
      
      // Utility classes that might be above the fold
      '.text-center', '.text-left', '.text-right',
      '.hidden', '.visible', '.block', '.inline-block',
      '.relative', '.absolute', '.fixed',
      
      // Dark mode toggle (if visible)
      '.theme-toggle', '.dark-mode-toggle',
      
      // Loading states
      '.loading', '.spinner', '.skeleton',
      
      // Critical animations
      '.fade-in', '.slide-in', '.scale-in'
    ];

    this.criticalCSS = '';
    this.nonCriticalCSS = '';
  }

  /**
   * Extract critical CSS from all CSS files
   */
  async extractCriticalCSS() {
    console.log('📋 Analyzing CSS files...');

    const cssFiles = this.findCSSFiles();
    console.log(`   Found ${cssFiles.length} CSS files`);

    for (const cssFile of cssFiles) {
      await this.processCSSFile(cssFile);
    }

    await this.generateCriticalFiles();
    this.generateReport();
  }

  /**
   * Find all CSS files
   */
  findCSSFiles() {
    const cssFiles = [];
    const searchPaths = [
      path.join(rootDir, 'src', 'styles'),
      path.join(rootDir, 'public', 'styles'),
      path.join(rootDir, 'dist', 'styles')
    ];

    searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        this.findFilesRecursive(searchPath, /\.css$/, cssFiles);
      }
    });

    return cssFiles;
  }

  /**
   * Find files recursively
   */
  findFilesRecursive(dir, pattern, results = []) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !file.startsWith('.')) {
          this.findFilesRecursive(fullPath, pattern, results);
        } else if (stat.isFile() && pattern.test(file)) {
          results.push(fullPath);
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dir}`);
    }

    return results;
  }

  /**
   * Process individual CSS file
   */
  async processCSSFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      console.log(`   Processing ${fileName}...`);

      // Parse CSS and separate critical from non-critical
      const { critical, nonCritical } = this.parseCSSContent(content, fileName);
      
      this.criticalCSS += `\n/* Critical CSS from ${fileName} */\n${critical}\n`;
      this.nonCriticalCSS += `\n/* Non-critical CSS from ${fileName} */\n${nonCritical}\n`;

    } catch (error) {
      console.warn(`   Warning: Could not process ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse CSS content and separate critical from non-critical
   */
  parseCSSContent(content, fileName) {
    let critical = '';
    let nonCritical = '';

    // Remove comments for easier parsing
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // Split into rules (basic CSS parsing)
    const rules = this.extractCSSRules(cleanContent);

    rules.forEach(rule => {
      if (this.isCriticalRule(rule, fileName)) {
        critical += rule + '\n';
      } else {
        nonCritical += rule + '\n';
      }
    });

    return { critical, nonCritical };
  }

  /**
   * Extract CSS rules from content
   */
  extractCSSRules(content) {
    const rules = [];
    let currentRule = '';
    let braceCount = 0;
    let inRule = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      if (char === '{') {
        braceCount++;
        inRule = true;
        currentRule += char;
      } else if (char === '}') {
        braceCount--;
        currentRule += char;
        
        if (braceCount === 0 && inRule) {
          rules.push(currentRule.trim());
          currentRule = '';
          inRule = false;
        }
      } else {
        currentRule += char;
      }
    }

    return rules.filter(rule => rule.length > 0);
  }

  /**
   * Determine if a CSS rule is critical
   */
  isCriticalRule(rule, fileName) {
    // Always include reset/normalize CSS
    if (fileName.includes('reset') || fileName.includes('normalize')) {
      return true;
    }

    // Always include global styles
    if (fileName.includes('global') || fileName.includes('base')) {
      return true;
    }

    // Check if rule contains critical selectors
    const isCritical = this.criticalSelectors.some(selector => {
      // Handle different selector formats
      const patterns = [
        new RegExp(`^\\s*${this.escapeRegex(selector)}\\s*[,{]`, 'i'),
        new RegExp(`^\\s*${this.escapeRegex(selector)}:`, 'i'),
        new RegExp(`^\\s*${this.escapeRegex(selector)}\\.`, 'i'),
        new RegExp(`\\s+${this.escapeRegex(selector)}\\s*[,{]`, 'i')
      ];

      return patterns.some(pattern => pattern.test(rule));
    });

    // Check for media queries that might be critical
    if (rule.includes('@media')) {
      // Include mobile-first media queries
      if (rule.includes('max-width: 768px') || rule.includes('max-width: 480px')) {
        return true;
      }
      // Include print styles as critical for accessibility
      if (rule.includes('print')) {
        return true;
      }
    }

    // Include CSS custom properties (variables)
    if (rule.includes('--') && rule.includes(':root')) {
      return true;
    }

    // Include font-face declarations
    if (rule.includes('@font-face')) {
      return true;
    }

    return isCritical;
  }

  /**
   * Escape regex special characters
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Generate critical CSS files
   */
  async generateCriticalFiles() {
    console.log('\n📝 Generating critical CSS files...');

    // Create output directory
    const outputDir = path.join(rootDir, 'src', 'styles', 'critical');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write critical CSS
    const criticalPath = path.join(outputDir, 'critical.css');
    const minifiedCritical = this.minifyCSS(this.criticalCSS);
    
    fs.writeFileSync(criticalPath, minifiedCritical);
    console.log(`   ✅ Critical CSS saved: ${criticalPath}`);

    // Write non-critical CSS
    const nonCriticalPath = path.join(outputDir, 'non-critical.css');
    const minifiedNonCritical = this.minifyCSS(this.nonCriticalCSS);
    
    fs.writeFileSync(nonCriticalPath, minifiedNonCritical);
    console.log(`   ✅ Non-critical CSS saved: ${nonCriticalPath}`);

    // Generate inline critical CSS for HTML
    const inlinePath = path.join(outputDir, 'inline-critical.html');
    const inlineHTML = `<!-- Critical CSS for inline inclusion -->
<style>
${minifiedCritical}
</style>`;
    
    fs.writeFileSync(inlinePath, inlineHTML);
    console.log(`   ✅ Inline critical CSS saved: ${inlinePath}`);
  }

  /**
   * Basic CSS minification
   */
  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon in blocks
      .replace(/\s*{\s*/g, '{') // Clean up braces
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*,\s*/g, ',') // Clean up commas
      .replace(/\s*:\s*/g, ':') // Clean up colons
      .replace(/\s*;\s*/g, ';') // Clean up semicolons
      .trim();
  }

  /**
   * Generate extraction report
   */
  generateReport() {
    console.log('\n📊 Critical CSS Extraction Report');
    console.log('==================================');

    const criticalSize = Buffer.byteLength(this.criticalCSS, 'utf8');
    const nonCriticalSize = Buffer.byteLength(this.nonCriticalCSS, 'utf8');
    const totalSize = criticalSize + nonCriticalSize;

    console.log(`Critical CSS: ${this.formatBytes(criticalSize)} (${Math.round((criticalSize / totalSize) * 100)}%)`);
    console.log(`Non-critical CSS: ${this.formatBytes(nonCriticalSize)} (${Math.round((nonCriticalSize / totalSize) * 100)}%)`);
    console.log(`Total CSS: ${this.formatBytes(totalSize)}`);

    console.log('\n💡 Implementation Tips:');
    console.log('1. Inline critical CSS in <head> for fastest rendering');
    console.log('2. Load non-critical CSS asynchronously');
    console.log('3. Use preload hints for non-critical CSS');
    console.log('4. Consider using CSS-in-JS for component-specific styles');

    console.log('\n✅ Critical CSS extraction completed!');
  }

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run extraction if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new CriticalCSSExtractor();
  extractor.extractCriticalCSS().catch(console.error);
}

export default CriticalCSSExtractor;
