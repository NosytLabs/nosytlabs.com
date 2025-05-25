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

const SCRIPT_GROUPS = {
  'games-bundle.js': [
    'public/scripts/games/duck-hunt.js',
    'public/scripts/games/duck-hunt-dog.js',
    'public/scripts/games/doom.js',
    'public/scripts/games/minesweeper.js'
  ],
  'windows95-core.js': [
    'public/scripts/windows95/nosytos95.js',
    'public/scripts/windows95/win95-window-manager.js',
    'public/scripts/windows95/win95-taskbar-manager.js',
    'public/scripts/windows95/win95-dialog-manager.js'
  ],
  'windows95-apps.js': [
    'public/scripts/windows95/nosytos95-chat.js',
    'public/scripts/windows95/nosytos95-explorer.js',
    'public/scripts/windows95/nosytos95-ipod.js',
    'public/scripts/windows95/nosytos95-photobooth.js',
    'public/scripts/windows95/nosytos95-soundboard.js',
    'public/scripts/windows95/nosytos95-virtualpc.js'
  ],
  'utils-bundle.js': [
    'public/scripts/utils/resource-loader.js',
    'public/scripts/utils/sound-manager.js',
    'public/scripts/utils/service-worker-registration.js',
    'public/scripts/utils/resource-error-handler.js'
  ]
};

function consolidateScripts() {
  const outputDir = 'public/scripts/bundles';

  // Create bundles directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  Object.entries(SCRIPT_GROUPS).forEach(([bundleName, files]) => {
    console.log(`Creating bundle: ${bundleName}`);

    let consolidatedContent = `/**\n * ${bundleName} - Consolidated Bundle\n * Generated automatically - do not edit directly\n */\n\n`;

    files.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        console.log(`  Adding: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        consolidatedContent += `\n/* ===== ${path.basename(filePath)} ===== */\n`;
        consolidatedContent += content;
        consolidatedContent += '\n\n';
      } else {
        console.warn(`  Warning: File not found: ${filePath}`);
      }
    });

    const outputPath = path.join(outputDir, bundleName);
    fs.writeFileSync(outputPath, consolidatedContent);
    console.log(`  Bundle created: ${outputPath}`);
  });

  console.log('\nScript consolidation complete!');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  consolidateScripts();
}

export { consolidateScripts };
