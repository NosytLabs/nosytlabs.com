/**
 * CSS Consolidation and Optimization Script
 * Merges multiple CSS files into optimized bundles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CSSConsolidator {
  constructor() {
    this.distPath = path.join(__dirname, '..', 'dist');
    this.srcPath = path.join(__dirname, '..', 'src');
    this.outputPath = path.join(__dirname, '..', 'dist', 'assets', 'optimized');

    // CSS bundle configuration
    this.bundles = {
      critical: {
        name: 'critical.css',
        files: [
          'src/styles/nosytlabs.css', // Main stylesheet
          'dist/styles/global.css'
        ],
        inline: true // This will be inlined in HTML
      },
      main: {
        name: 'main.css',
        files: [
          'dist/styles/design-system.css',
          'dist/styles/hero-animations.css',
          'dist/styles/consolidated-styles.css'
        ]
      },
      components: {
        name: 'components.css',
        files: [
          'dist/styles/contact-booking.css',
          'dist/styles/passive-income.css',
          'dist/styles/streaming-hub.css'
        ]
      },
      nosytos95: {
        name: 'nosytos95.css',
        files: [
          'dist/styles/win95-authentic.css',
          'dist/styles/win95-taskbar.css',
          'dist/styles/win95-menu.css',
          'dist/styles/enhanced-win95.css',
          'dist/styles/duck-hunt.css',
          'dist/styles/doom.css',
          'dist/styles/minesweeper.css'
        ]
      }
    };
  }

  /**
   * Consolidate all CSS files
   */
  async consolidate() {
    console.log('🎨 Starting CSS consolidation...');

    // Create output directory
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }

    // Process each bundle
    for (const [bundleName, config] of Object.entries(this.bundles)) {
      await this.createBundle(bundleName, config);
    }

    // Generate critical CSS
    await this.generateCriticalCSS();

    // Update HTML files to use new bundles
    await this.updateHTMLReferences();

    console.log('✅ CSS consolidation completed!');
  }

  /**
   * Create a CSS bundle
   */
  async createBundle(bundleName, config) {
    console.log(`📦 Creating ${bundleName} bundle...`);

    let combinedCSS = '';
    let processedFiles = 0;

    // Add bundle header
    combinedCSS += `/*!\n * ${config.name} - ${bundleName} bundle\n * Generated: ${new Date().toISOString()}\n * NosytLabs Performance Optimization\n */\n\n`;

    // Process each file in the bundle
    for (const filePath of config.files) {
      const fullPath = path.resolve(filePath);

      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');

          // Add file separator comment
          combinedCSS += `/* === ${path.basename(filePath)} === */\n`;
          combinedCSS += content;
          combinedCSS += '\n\n';

          processedFiles++;
        } catch (error) {
          console.warn(`⚠️  Could not read ${filePath}: ${error.message}`);
        }
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    }

    if (processedFiles === 0) {
      console.warn(`⚠️  No files processed for ${bundleName} bundle`);
      return;
    }

    // Basic CSS optimization (without PostCSS for now)
    try {
      // Simple minification
      let optimizedCSS = combinedCSS
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/\s*{\s*/g, '{') // Clean up braces
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*:\s*/g, ':')
        .trim();

      const result = { css: optimizedCSS };

      // Write optimized bundle
      const outputFile = path.join(this.outputPath, config.name);
      fs.writeFileSync(outputFile, result.css);

      // Get file size
      const stats = fs.statSync(outputFile);
      const sizeKB = Math.round(stats.size / 1024);

      console.log(`✅ ${bundleName} bundle created: ${config.name} (${sizeKB}KB, ${processedFiles} files)`);

    } catch (error) {
      console.error(`❌ Error processing ${bundleName} bundle:`, error.message);
    }
  }

  /**
   * Generate critical CSS for above-the-fold content
   */
  async generateCriticalCSS() {
    console.log('🎯 Generating critical CSS...');

    // Critical CSS should include:
    // - CSS variables
    // - Typography basics
    // - Header styles
    // - Hero section styles
    // - Layout fundamentals

    const criticalCSS = `
/* Critical CSS - Above the fold styles */
:root {
  --nosyt-purple-main: #4C1D95;
  --nosyt-orange-main: #FF6B00;
  --color-primary: var(--nosyt-purple-main);
  --color-secondary: var(--nosyt-orange-main);
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-family);
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-4) 0;
}

.container {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.hero {
  padding: var(--spacing-8) 0;
  background-color: var(--color-primary);
  color: white;
}

h1, h2, h3 {
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-primary);
}

h1 { font-size: 3rem; margin-bottom: var(--spacing-6); }
h2 { font-size: 2.25rem; margin-bottom: var(--spacing-6); }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
  background-color: var(--color-primary);
  color: white;
}

.btn:hover {
  background-color: var(--nosyt-purple-dark);
  transform: translateY(-2px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.875rem; }
  .hero { padding: var(--spacing-6) 0; }
}
`;

    // Write critical CSS
    const criticalPath = path.join(this.outputPath, 'critical.css');
    fs.writeFileSync(criticalPath, criticalCSS.trim());

    console.log('✅ Critical CSS generated');
  }

  /**
   * Update HTML files to reference new CSS bundles
   */
  async updateHTMLReferences() {
    console.log('🔗 Updating HTML references...');

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

      // Remove old CSS references
      content = content.replace(/<link[^>]*href="[^"]*\.css"[^>]*>/g, '');

      // Add new optimized CSS bundles
      const cssLinks = this.generateCSSLinks(htmlFile);

      // Insert before closing head tag
      content = content.replace('</head>', `${cssLinks}</head>`);

      fs.writeFileSync(htmlFile, content);

    } catch (error) {
      console.warn(`⚠️  Could not update ${htmlFile}: ${error.message}`);
    }
  }

  /**
   * Generate CSS links for HTML file
   */
  generateCSSLinks(htmlFile) {
    const fileName = path.basename(htmlFile, '.html');
    let links = '';

    // Add critical CSS inline
    const criticalPath = path.join(this.outputPath, 'critical.css');
    if (fs.existsSync(criticalPath)) {
      const criticalCSS = fs.readFileSync(criticalPath, 'utf8');
      links += `  <style>${criticalCSS}</style>\n`;
    }

    // Add main CSS bundle
    links += `  <link rel="preload" href="/assets/optimized/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">\n`;
    links += `  <noscript><link rel="stylesheet" href="/assets/optimized/main.css"></noscript>\n`;

    // Add component CSS if needed
    if (fileName.includes('contact') || fileName.includes('passive-income')) {
      links += `  <link rel="stylesheet" href="/assets/optimized/components.css">\n`;
    }

    // Add NosytOS95 CSS if needed
    if (fileName.includes('nosytos95')) {
      links += `  <link rel="stylesheet" href="/assets/optimized/nosytos95.css">\n`;
    }

    return links;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const consolidator = new CSSConsolidator();
  consolidator.consolidate().catch(console.error);
}

export default CSSConsolidator;
