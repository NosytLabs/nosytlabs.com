#!/usr/bin/env node

/**
 * Script Consolidation Tool
 * Consolidates related JavaScript files to reduce HTTP requests
 * and improve loading performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

const SCRIPT_GROUPS = {
  'nosytos95-core.js': [
    'public/scripts/nosytos95/window-manager.js',
    'public/scripts/nosytos95/taskbar.js',
    'public/scripts/nosytos95/start-menu.js',
    'public/scripts/nosytos95/desktop-icons.js'
  ],
  'nosytos95-apps.js': [
    'public/scripts/nosytos95/notepad.js',
    'public/scripts/nosytos95/file-explorer.js',
    'public/scripts/nosytos95/terminal.js',
    'public/scripts/nosytos95/nosyt-ai.js'
  ],
  'games-bundle.js': [
    'public/scripts/nosytos95/duck-hunt.js',
    'public/scripts/minesweeper.js'
  ],
  'utils-bundle.js': [
    'public/scripts/sound-manager.js',
    'public/scripts/sound-paths.js',
    'public/scripts/service-worker-registration.js',
    'public/scripts/performance-monitor.js'
  ],
  'core-bundle.js': [
    'public/scripts/core/utils.js',
    'public/scripts/core/main.js',
    'public/scripts/animations.js',
    'public/scripts/theme.js'
  ]
};

function consolidateScripts() {
  console.log('🔄 Starting script consolidation...');
  
  const outputDir = path.join(rootDir, 'public/scripts/bundles');

  // Create bundles directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  let bundlesCreated = 0;
  let totalSize = 0;

  Object.entries(SCRIPT_GROUPS).forEach(([bundleName, files]) => {
    console.log(`🔄 Creating bundle: ${bundleName}`);

    let consolidatedContent = `/**\n * ${bundleName} - Consolidated Bundle\n * Generated automatically - do not edit directly\n * Generated on: ${new Date().toISOString()}\n */\n\n`;

    let bundleSize = 0;
    files.forEach(filePath => {
      const fullPath = path.join(rootDir, filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`  ✅ Adding: ${filePath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        consolidatedContent += `\n/* ===== ${path.basename(filePath)} ===== */\n`;
        consolidatedContent += content;
        consolidatedContent += '\n\n';
        bundleSize += content.length;
      } else {
        console.log(`  ⚠️ Warning: File not found: ${filePath}`);
      }
    });

    const outputPath = path.join(outputDir, bundleName);
    fs.writeFileSync(outputPath, consolidatedContent);
    console.log(`  ✅ Bundle created: ${outputPath} (${(bundleSize / 1024).toFixed(2)} KB)`);
    
    bundlesCreated++;
    totalSize += bundleSize;
  });

  console.log(`\n🎉 Script consolidation complete!`);
  console.log(`📊 Created ${bundlesCreated} bundles`);
  console.log(`📦 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  // Create bundle index for easy loading
  createBundleIndex(outputDir);
}

function createBundleIndex(outputDir) {
  const indexContent = `/**
 * Bundle Index
 * Auto-generated bundle loader
 */

const BUNDLES = {
  core: '/scripts/bundles/core-bundle.js',
  nosytos95Core: '/scripts/bundles/nosytos95-core.js',
  nosytos95Apps: '/scripts/bundles/nosytos95-apps.js',
  games: '/scripts/bundles/games-bundle.js',
  utils: '/scripts/bundles/utils-bundle.js'
};

class BundleLoader {
  static async loadBundle(bundleName) {
    if (!BUNDLES[bundleName]) {
      throw new Error(\`Bundle '\${bundleName}' not found\`);
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = BUNDLES[bundleName];
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  static async loadBundles(bundleNames) {
    return Promise.all(bundleNames.map(name => this.loadBundle(name)));
  }
}

// Export for use
window.BundleLoader = BundleLoader;
export { BundleLoader, BUNDLES };
`;

  const indexPath = path.join(outputDir, 'bundle-loader.js');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`📄 Created bundle index: ${indexPath}`);
}

// Run if this file is executed directly
if (import.meta.url.includes('consolidate-scripts.js')) {
  consolidateScripts();
}

export { consolidateScripts };
