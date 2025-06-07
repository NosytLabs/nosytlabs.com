#!/usr/bin/env node

/**
 * Comprehensive Fix Script
 * Fixes all malformed console statements and syntax errors
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Starting comprehensive fix...\n');

// Function to recursively find all .astro files
function findAstroFiles(dir) {
  const files = [];
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...findAstroFiles(fullPath));
      } else if (item.endsWith('.astro')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Function to fix all problematic patterns
function fixAllPatterns(content) {
  let fixed = content;
  
  // Fix patterns like: console...oo_oo(`...`)
  fixed = fixed.replace(/console\.log?\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console.log');
  
  // Fix patterns like: conso...oo_oo(`...`)
  fixed = fixed.replace(/conso[^l]*\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed console statement');
  
  // Fix patterns like: ...oo_oo(`...`)
  fixed = fixed.replace(/\.{3}oo_oo\([^)]*\)/g, '// Fixed malformed statement');
  
  // Fix patterns with eslint-disable comments
  fixed = fixed.replace(/\/\*\s*eslint-disable\s*\*\/\s*console\.log\.{3}oo_oo[^;]*/g, '/* eslint-disable */ // Fixed malformed console.log');
  
  // Fix specific patterns from error messages
  fixed = fixed.replace(/console\.log\.{3}oo_oo\(`[^`]*`[^)]*\)/g, '// Fixed malformed console.log');
  fixed = fixed.replace(/console\.{3}oo_oo\(`[^`]*`[^)]*\)/g, '// Fixed malformed console statement');
  
  // Remove any remaining oo_oo patterns
  fixed = fixed.replace(/oo_oo/g, '');
  
  // Fix any remaining ellipsis that might cause issues
  fixed = fixed.replace(/\.{3}(?![.\s])/g, '');
  
  // Fix specific error patterns from the build log
  fixed = fixed.replace(/\/\*\s*eslint-disable\s*\*\/\s*console\.{3}oo_oo/g, '/* eslint-disable */ // Fixed');
  fixed = fixed.replace(/conso\.{3}oo_oo/g, '// Fixed console');
  fixed = fixed.replace(/\.{3}oo_oo\(`[^`]*`,/g, '// Fixed statement (');
  
  return fixed;
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');
const astroFiles = findAstroFiles(srcDir);

console.log(`Found ${astroFiles.length} .astro files to check...`);

let fixedCount = 0;
let errors = [];

for (const filePath of astroFiles) {
  try {
    console.log(`🔍 Checking: ${path.relative(process.cwd(), filePath)}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixAllPatterns(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      fixedCount++;
    } else {
      console.log(`✓ Clean: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    errors.push({ file: filePath, error: error.message });
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${astroFiles.length}`);
console.log(`   Files fixed: ${fixedCount}`);
console.log(`   Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(({ file, error }) => {
    console.log(`   ${path.relative(process.cwd(), file)}: ${error}`);
  });
}

console.log('\n🎉 Comprehensive fix completed!');
console.log('💡 Next: Clear cache and restart the development server');
