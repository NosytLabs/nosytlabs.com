#!/usr/bin/env node

/**
 * Fix Specific Syntax Errors Script
 * Targets the exact syntax errors seen in the server logs
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing specific syntax errors from server logs...\n');

const fixResults = {
  filesFixed: 0,
  errorsFixed: 0,
  filesScanned: 0
};

/**
 * Fix specific syntax errors in a file
 */
function fixSpecificErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let errorsInFile = 0;
    
    // Specific patterns from the server error logs
    const errorPatterns = [
      // Pattern from InteractiveROICalculator.astro line 255
      /\/\*\s*eslint-disable\s*\*\/\s*console\.\.\.oo_oo\([^)]*\)/g,
      
      // Pattern from ServicePreviewCards.astro line 77
      /conso\.\.\.oo_oo\([^)]*\),?le\.log\([^)]*\)/g,
      
      // Pattern from UltraEnhancedNavigation.astro line 342
      /\.\.\.oo_oo\([^)]*\),?\s*console\.log\([^)]*\)/g,
      
      // Pattern from live.astro line 401
      /\/\*\s*eslint-disable\s*\*\/\s*console\.log\.\.\.oo_oo\([^)]*\)/g,
      
      // General malformed console patterns
      /console\.\.\.oo_oo\([^)]*\)/g,
      /\.\.\.oo_oo\([^)]*\)/g,
      /console\.log[^;]*\.\.\.oo_oo[^;]*/g,
      
      // Broken console.log patterns
      /conso[^l]*\.\.\.oo_oo[^)]*\)[^l]*le\.log/g
    ];
    
    errorPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '');
        errorsInFile += matches.length;
        console.log(`   Fixed pattern ${index + 1}: ${matches.length} occurrences in ${path.basename(filePath)}`);
      }
    });
    
    // Clean up any remaining malformed code
    content = content.replace(/\/\*\s*eslint-disable\s*\*\/\s*$/gm, '');
    content = content.replace(/^\s*,\s*$/gm, '');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixResults.filesFixed++;
      fixResults.errorsFixed += errorsInFile;
      console.log(`   ✅ Fixed ${errorsInFile} errors in ${path.basename(filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`   ❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

/**
 * Fix the specific files mentioned in the error logs
 */
function fixSpecificFiles() {
  console.log('🎯 Fixing specific files from error logs...');
  
  const problematicFiles = [
    'src/components/InteractiveROICalculator.astro',
    'src/components/ServicePreviewCards.astro',
    'src/components/UltraEnhancedNavigation.astro',
    'src/pages/live.astro'
  ];
  
  for (const filePath of problematicFiles) {
    if (fs.existsSync(filePath)) {
      fixResults.filesScanned++;
      console.log(`   Scanning: ${path.basename(filePath)}`);
      fixSpecificErrors(filePath);
    } else {
      console.log(`   ⚠️  File not found: ${filePath}`);
    }
  }
}

/**
 * Scan all Astro files for similar patterns
 */
function scanAllAstroFiles() {
  console.log('\n🔍 Scanning all Astro files for similar patterns...');
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (item.endsWith('.astro')) {
        fixResults.filesScanned++;
        
        // Check if file contains problematic patterns
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          if (content.includes('...oo_oo') || content.includes('console...oo_oo')) {
            console.log(`   Found issues in: ${path.relative('.', itemPath)}`);
            fixSpecificErrors(itemPath);
          }
        } catch (error) {
          console.log(`   ❌ Error reading ${itemPath}: ${error.message}`);
        }
      }
    }
  }
  
  scanDirectory('src/components');
  scanDirectory('src/pages');
  scanDirectory('src/layouts');
}

/**
 * Validate that all errors are fixed
 */
function validateFixes() {
  console.log('\n🔍 Validating that all syntax errors are fixed...');
  
  let remainingErrors = 0;
  
  function checkDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        checkDirectory(itemPath);
      } else if (item.endsWith('.astro')) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for remaining problematic patterns
          const problemPatterns = [
            /\.\.\.oo_oo/g,
            /console\.\.\.oo_oo/g,
            /conso[^l]*\.\.\.oo_oo/g
          ];
          
          for (const pattern of problemPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              remainingErrors += matches.length;
              console.log(`   ⚠️  Remaining errors in ${path.basename(itemPath)}: ${matches.length}`);
            }
          }
        } catch (error) {
          console.log(`   ❌ Error validating ${itemPath}: ${error.message}`);
        }
      }
    }
  }
  
  checkDirectory('src');
  
  if (remainingErrors === 0) {
    console.log('   ✅ All syntax errors have been fixed!');
  } else {
    console.log(`   ⚠️  ${remainingErrors} syntax errors still remain`);
  }
  
  return remainingErrors === 0;
}

/**
 * Display results
 */
function displayResults() {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 SPECIFIC SYNTAX ERROR FIX RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files Scanned: ${fixResults.filesScanned}`);
  console.log(`   Files Fixed: ${fixResults.filesFixed}`);
  console.log(`   Errors Fixed: ${fixResults.errorsFixed}`);
  
  if (fixResults.errorsFixed > 0) {
    console.log('\n🎉 Specific syntax errors have been fixed!');
    console.log('✅ Development server should now start without errors');
    console.log('🔄 Restart the server to see the changes');
  } else {
    console.log('\n✅ No specific syntax errors were found');
    console.log('🎯 Codebase appears to be clean');
  }
  
  console.log('\n💡 Next steps:');
  console.log('   1. Restart the development server');
  console.log('   2. Navigate to http://localhost:3000');
  console.log('   3. Check browser console for any remaining errors');
  console.log('   4. Test all interactive elements');
}

/**
 * Main execution
 */
function main() {
  console.log('🎯 Running specific syntax error fixes...\n');
  
  // Fix specific problematic files
  fixSpecificFiles();
  
  // Scan all files for similar patterns
  scanAllAstroFiles();
  
  // Validate fixes
  const allFixed = validateFixes();
  
  // Display results
  displayResults();
  
  return allFixed;
}

// Run the fixes
const success = main();
process.exit(success ? 0 : 1);
