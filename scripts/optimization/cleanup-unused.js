#!/usr/bin/env node

/**
 * Cleanup Unused Files
 * Removes unused assets, temporary files, and duplicates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLEANUP_PATTERNS = [
  // Temporary files
  '**/*.tmp',
  '**/*.temp',
  '**/.DS_Store',
  '**/Thumbs.db',

  // Backup files
  '**/*.backup',
  '**/*.bak',
  '**/*.old',

  // Log files
  '**/*.log',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',

  // Editor files
  '**/.vscode/settings.json',
  '**/*.swp',
  '**/*.swo',

  // Build artifacts that shouldn't be in source
  '**/node_modules/.cache',
  '**/dist/.temp'
];

const UNUSED_DIRECTORIES = [
  'public/scripts/temp',
  'public/styles/temp',
  'src/temp',
  'temp'
];

const DUPLICATE_FILES = [
  // Files that are duplicates and can be safely removed
  'public/js/nosytos95.js', // Duplicate of the one in scripts/windows95/
];

function cleanupUnusedFiles() {
  console.log('Starting cleanup of unused files...\n');

  // Remove duplicate files
  console.log('Removing duplicate files:');
  DUPLICATE_FILES.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`  Removed: ${filePath}`);
    }
  });

  // Remove unused directories
  console.log('\nRemoving unused directories:');
  UNUSED_DIRECTORIES.forEach(dirPath => {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`  Removed directory: ${dirPath}`);
    }
  });

  // Clean up empty directories
  console.log('\nCleaning up empty directories...');
  cleanupEmptyDirectories('public');
  cleanupEmptyDirectories('src');

  console.log('\nCleanup complete!');
}

function cleanupEmptyDirectories(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      cleanupEmptyDirectories(fullPath);

      // Check if directory is now empty
      const remainingItems = fs.readdirSync(fullPath);
      if (remainingItems.length === 0) {
        fs.rmdirSync(fullPath);
        console.log(`  Removed empty directory: ${fullPath}`);
      }
    }
  });
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupUnusedFiles();
}

export { cleanupUnusedFiles };
