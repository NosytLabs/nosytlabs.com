#!/usr/bin/env node

/**
 * Clean Rewrite Script
 * Completely rewrites problematic files with clean content
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Starting clean rewrite of problematic files...\n');

// Files that are causing build errors
const problematicFiles = [
  'src/components/InteractiveROICalculator.astro',
  'src/components/ServicePreviewCards.astro',
  'src/components/UltraEnhancedNavigation.astro',
  'src/pages/live.astro'
];

function cleanRewrite(filePath) {
  try {
    console.log(`🔍 Processing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove any potential hidden characters and normalize
    content = content
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')   // Handle old Mac line endings
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Keep only printable ASCII and common Unicode characters
        const code = char.charCodeAt(0);
        if (code > 127 && code < 160) return ''; // Remove control characters
        return char;
      });
    
    // Clean up any remaining problematic patterns more aggressively
    content = content
      .replace(/console\.log?\.{3}[^;]*oo_oo[^;]*/g, '// Fixed malformed console.log')
      .replace(/conso[^;]*\.{3}[^;]*oo_oo[^;]*/g, '// Fixed malformed console statement')
      .replace(/[^a-zA-Z]\.{3}[^;]*oo_oo[^;]*/g, '// Fixed malformed statement')
      .replace(/oo_oo/g, '')
      .replace(/\.{3}(?![.\s])/g, '')
      .replace(/console\.log\.{3}/g, 'console.log')
      .replace(/console\.{3}/g, 'console.')
      .replace(/\.{3}(?=\()/g, '');
    
    // Write the cleaned content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned and rewrote: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process each problematic file
let processedCount = 0;

for (const filePath of problematicFiles) {
  if (cleanRewrite(filePath)) {
    processedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${processedCount}/${problematicFiles.length}`);

console.log('\n🎉 Clean rewrite completed!');
console.log('💡 Try restarting the development server now');
