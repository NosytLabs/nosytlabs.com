/**
 * CSS Consolidation and Optimization Script
 * Merges multiple CSS files into optimized bundles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

class CSSConsolidator {
  constructor() {
    this.outputPath = path.join(rootDir, 'public/styles/bundles');
    
    // CSS bundle configuration
    this.bundles = {
      'main-styles.css': [
        'src/styles/global.css',
        'src/styles/nosytlabs.css',
        'src/styles/modern-design-system.css'
      ],
      'win95-styles.css': [
        'public/styles/win95-authentic.css',
        'public/styles/win95-taskbar.css',
        'public/styles/win95-menu.css',
        'public/styles/win95-desktop-icons.css',
        'public/styles/enhanced-win95.css'
      ],
      'component-styles.css': [
        'public/styles/nosyt-window-manager.css',
        'public/styles/nosyt-file-explorer.css',
        'public/styles/nosyt-ai.css',
        'public/styles/nosyt-bsod.css'
      ],
      'game-styles.css': [
        'public/styles/duck-hunt.css',
        'public/styles/minesweeper.css'
      ],
      'page-styles.css': [
        'public/styles/contact-booking.css',
        'public/styles/streaming-hub.css',
        'public/styles/passive-income.css',
        'public/styles/ie95.css'
      ]
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🔄';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async consolidateCSS() {
    this.log('Starting CSS consolidation');
    
    // Create output directory
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
      this.log(`Created directory: ${this.outputPath}`);
    }

    let bundlesCreated = 0;
    let totalSize = 0;

    for (const [bundleName, files] of Object.entries(this.bundles)) {
      this.log(`Creating CSS bundle: ${bundleName}`);
      
      let consolidatedCSS = `/*\n * ${bundleName} - Consolidated CSS Bundle\n * Generated automatically - do not edit directly\n * Generated on: ${new Date().toISOString()}\n */\n\n`;
      
      let bundleSize = 0;
      let filesAdded = 0;

      for (const filePath of files) {
        const fullPath = path.join(rootDir, filePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          consolidatedCSS += `\n/* ===== ${path.basename(filePath)} ===== */\n`;
          consolidatedCSS += content;
          consolidatedCSS += '\n\n';
          bundleSize += content.length;
          filesAdded++;
          this.log(`  Added: ${filePath}`);
        } else {
          this.log(`  File not found: ${filePath}`, 'warning');
        }
      }

      if (filesAdded > 0) {
        // Basic CSS optimization
        consolidatedCSS = this.optimizeCSS(consolidatedCSS);
        
        const outputPath = path.join(this.outputPath, bundleName);
        fs.writeFileSync(outputPath, consolidatedCSS);
        
        bundlesCreated++;
        totalSize += consolidatedCSS.length;
        
        this.log(`Bundle created: ${bundleName} (${filesAdded} files, ${(consolidatedCSS.length / 1024).toFixed(2)} KB)`, 'success');
      } else {
        this.log(`Skipped empty bundle: ${bundleName}`, 'warning');
      }
    }

    this.log(`CSS consolidation complete: ${bundlesCreated} bundles, ${(totalSize / 1024).toFixed(2)} KB total`, 'success');
    
    // Create CSS loader
    this.createCSSLoader();
  }

  optimizeCSS(css) {
    // Remove comments (except important ones)
    css = css.replace(/\/\*(?!\*\/)[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    
    // Remove unnecessary whitespace
    css = css.replace(/\s+/g, ' ');
    css = css.replace(/;\s*}/g, '}');
    css = css.replace(/{\s*/g, '{');
    css = css.replace(/;\s*/g, ';');
    css = css.replace(/,\s*/g, ',');
    
    // Remove empty rules
    css = css.replace(/[^{}]+{\s*}/g, '');
    
    return css.trim();
  }

  createCSSLoader() {
    const loaderContent = `/**
 * CSS Bundle Loader
 * Auto-generated CSS bundle management
 */

const CSS_BUNDLES = {
  main: '/styles/bundles/main-styles.css',
  win95: '/styles/bundles/win95-styles.css',
  components: '/styles/bundles/component-styles.css',
  games: '/styles/bundles/game-styles.css',
  pages: '/styles/bundles/page-styles.css'
};

class CSSBundleLoader {
  static loadedBundles = new Set();
  
  static loadBundle(bundleName) {
    if (this.loadedBundles.has(bundleName)) {
      return Promise.resolve();
    }
    
    if (!CSS_BUNDLES[bundleName]) {
      return Promise.reject(new Error(\`CSS bundle '\${bundleName}' not found\`));
    }
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CSS_BUNDLES[bundleName];
      link.onload = () => {
        this.loadedBundles.add(bundleName);
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
  
  static async loadBundles(bundleNames) {
    return Promise.all(bundleNames.map(name => this.loadBundle(name)));
  }
  
  static preloadBundle(bundleName) {
    if (!CSS_BUNDLES[bundleName]) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = CSS_BUNDLES[bundleName];
    document.head.appendChild(link);
  }
}

// Export for use
window.CSSBundleLoader = CSSBundleLoader;
export { CSSBundleLoader, CSS_BUNDLES };
`;

    const loaderPath = path.join(this.outputPath, 'css-loader.js');
    fs.writeFileSync(loaderPath, loaderContent);
    this.log(`Created CSS loader: ${loaderPath}`);
  }
}

// Run if this file is executed directly
if (import.meta.url.includes('css-consolidation-new.js')) {
  const consolidator = new CSSConsolidator();
  consolidator.consolidateCSS().catch(error => {
    console.error('CSS consolidation failed:', error);
    process.exit(1);
  });
}

export { CSSConsolidator };
