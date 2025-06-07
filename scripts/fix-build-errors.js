#!/usr/bin/env node

/**
 * Fix Build Errors Script
 * Fixes malformed console.log statements and other syntax errors
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing critical build errors...\n');

// Files with known issues from the error log
const problematicFiles = [
  'src/components/InteractiveROICalculator.astro',
  'src/components/ServicePreviewCards.astro', 
  'src/components/UltraEnhancedNavigation.astro',
  'src/pages/live.astro'
];

// Function to fix malformed console statements
function fixConsoleStatements(content) {
  // Fix patterns like: console...oo_oo(`...`) 
  let fixed = content.replace(/console\.log?\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console.log');
  
  // Fix patterns like: conso...oo_oo(`...`)
  fixed = fixed.replace(/conso[^l]*\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console statement');
  
  // Fix patterns like: ...oo_oo(`...`)
  fixed = fixed.replace(/\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed statement');
  
  // Fix patterns with eslint-disable comments
  fixed = fixed.replace(/\/\*\s*eslint-disable\s*\*\/\s*console\.log\.{3}oo_oo[^;]*/g, '/* eslint-disable */ // Fixed malformed console.log');
  
  // Remove any remaining oo_oo patterns
  fixed = fixed.replace(/oo_oo/g, '');
  
  // Fix any remaining ellipsis that might cause issues
  fixed = fixed.replace(/\.{3}(?![.\s])/g, '');
  
  return fixed;
}

let fixedCount = 0;
let errors = [];

for (const filePath of problematicFiles) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`🔍 Checking: ${filePath}`);
      
      const content = fs.readFileSync(filePath, 'utf8');
      const fixedContent = fixConsoleStatements(content);
      
      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
        fixedCount++;
      } else {
        console.log(`✓ Clean: ${filePath}`);
      }
    } else {
      console.log(`⚠️  Not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errors.push({ file: filePath, error: error.message });
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files fixed: ${fixedCount}`);
console.log(`   Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(({ file, error }) => {
    console.log(`   ${file}: ${error}`);
  });
}

console.log('\n🎉 Build error fixing completed!');
console.log('💡 Next: Restart the development server to test fixes');
