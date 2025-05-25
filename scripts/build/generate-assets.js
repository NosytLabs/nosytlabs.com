/**
 * Unified Asset Generation Script
 * 
 * This script combines all asset generation steps into a single command.
 * It generates:
 * - Windows 95 icons
 * - Resize handle
 * - Favicons
 * - Optimizes images
 * 
 * Usage: node scripts/generate-assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.join(__dirname, '..');
const scriptsDir = path.join(rootDir, 'scripts');

// Log function with timestamp
function log(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${timestamp}] ${message}`);
}

// Error handler
function handleError(error, step) {
  log(`❌ Error during ${step}: ${error.message}`);
  console.error(error);
  process.exit(1);
}

// Run a script and handle errors
async function runScript(scriptName, description) {
  const scriptPath = path.join(scriptsDir, scriptName);
  
  log(`🔄 Running ${description}...`);
  
  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    handleError(error, description);
    return false;
  }
}

// Main function
async function generateAssets() {
  log('🚀 Starting unified asset generation');
  
  // Create necessary directories if they don't exist
  const directories = [
    path.join(rootDir, 'public', 'images', 'win95'),
    path.join(rootDir, 'public', 'images', 'icons')
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`📁 Created directory: ${dir}`);
    }
  });
  
  // Run all asset generation scripts in sequence
  const scripts = [
    { name: 'generate-win95-icons.js', description: 'Windows 95 icons generation' },
    { name: 'generate-resize-handle.js', description: 'Resize handle generation' },
    { name: 'generate-favicons.js', description: 'Favicons generation' },
    { name: 'optimize-images.js', description: 'Image optimization' }
  ];
  
  let successCount = 0;
  
  for (const script of scripts) {
    const success = await runScript(script.name, script.description);
    if (success) successCount++;
  }
  
  // Summary
  log(`🏁 Asset generation completed: ${successCount}/${scripts.length} tasks successful`);
  
  if (successCount === scripts.length) {
    log('✨ All assets generated successfully!');
    return 0;
  } else {
    log('⚠️ Some asset generation tasks failed. Check the logs above for details.');
    return 1;
  }
}

// Run the main function
generateAssets().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  handleError(error, 'asset generation');
});
