#!/usr/bin/env node

/**
 * Aggressive Fix Script
 * Uses multiple methods to find and fix problematic patterns
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Starting aggressive fix for persistent syntax errors...\n');

// Specific files mentioned in the error
const problematicFiles = [
  'src/components/InteractiveROICalculator.astro',
  'src/components/ServicePreviewCards.astro',
  'src/components/UltraEnhancedNavigation.astro',
  'src/pages/live.astro'
];

// Function to fix all possible problematic patterns
function aggressiveFix(content) {
  let fixed = content;
  
  // Fix all variations of the problematic patterns
  fixed = fixed.replace(/console\.log?\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console.log');
  fixed = fixed.replace(/conso[^l]*\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console statement');
  fixed = fixed.replace(/\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed statement');
  
  // More aggressive patterns
  fixed = fixed.replace(/console[^;]*\.{3}oo_oo[^;]*/g, '// Fixed console statement');
  fixed = fixed.replace(/conso[^;]*\.{3}oo_oo[^;]*/g, '// Fixed console statement');
  fixed = fixed.replace(/[^a-zA-Z]\.{3}oo_oo[^;]*/g, '// Fixed statement');
  
  // Remove any remaining oo_oo patterns
  fixed = fixed.replace(/oo_oo/g, '');
  
  // Fix ellipsis patterns that might cause issues
  fixed = fixed.replace(/\.{3}(?![.\s])/g, '');
  
  // Fix specific patterns from the error messages
  fixed = fixed.replace(/\/\*\s*eslint-disable\s*\*\/\s*console\.log\.{3}[^;]*/g, '/* eslint-disable */ // Fixed console.log');
  fixed = fixed.replace(/\/\*\s*eslint-disable\s*\*\/\s*console\.{3}[^;]*/g, '/* eslint-disable */ // Fixed console');
  
  // Remove any remaining problematic patterns with numbers
  fixed = fixed.replace(/console\.log\.{3}[^;]*`[0-9_]*`[^;]*/g, '// Fixed console.log with numbers');
  fixed = fixed.replace(/conso\.{3}[^;]*`[0-9_]*`[^;]*/g, '// Fixed console with numbers');
  fixed = fixed.replace(/\.{3}[^;]*`[0-9_]*`[^;]*/g, '// Fixed statement with numbers');
  
  return fixed;
}

// Function to create a backup and fix file
function fixFile(filePath) {
  try {
    console.log(`🔍 Processing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create backup
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`💾 Backup created: ${backupPath}`);
    
    // Apply aggressive fix
    const fixedContent = aggressiveFix(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`✓ Clean: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
let fixedCount = 0;

console.log('Targeting specific problematic files...\n');

for (const filePath of problematicFiles) {
  if (fixFile(filePath)) {
    fixedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${problematicFiles.length}`);
console.log(`   Files fixed: ${fixedCount}`);

console.log('\n🎉 Aggressive fix completed!');
console.log('💡 Restarting development server recommended');
