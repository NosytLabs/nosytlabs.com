#!/usr/bin/env node

/**
 * @fileoverview Fix Syntax Errors Script
 * 
 * This script identifies and fixes syntax errors in the codebase,
 * particularly obfuscated or corrupted console.log statements.
 * 
 * @module fix-syntax-errors
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔧 Fixing syntax errors in the codebase...\n');

/**
 * Results tracking
 * 
 * @type {object}
 */
const results = {
  filesFixed: [],
  errorsFixed: [],
  errors: []
};

/**
 * Problematic patterns to fix
 * 
 * @type {object[]}
 */
const syntaxFixes = [
  {
    name: 'Obfuscated console.log statements',
    pattern: /console\.log.*oo_oo\([^)]*\)[^;]*/g,
    replacement: '// Removed obfuscated console.log statement',
    description: 'Remove obfuscated console.log statements'
  },
  {
    name: 'Malformed console statements',
    pattern: /consol.*oo_oo\([^)]*\)[^;]*/g,
    replacement: '// Removed malformed console statement',
    description: 'Remove malformed console statements'
  },
  {
    name: 'Ellipsis in code',
    pattern: /\.{3}(?![\s]*\/\/|[\s]*\*)/g,
    replacement: '',
    description: 'Remove problematic ellipsis'
  },
  {
    name: 'ESLint disable with malformed code',
    pattern: /\/\*\s*eslint-disable\s*\*\/\s*console\.log.*oo_oo[^;]*/g,
    replacement: '/* eslint-disable */ // Cleaned up malformed code',
    description: 'Fix ESLint disable with malformed code'
  }
];

/**
 * Files that need specific fixes
 * 
 * @type {string[]}
 */
const filesToFix = [
  'src/pages/live.astro',
  'src/pages/vault-shelter.astro'
];

/**
 * Fix syntax errors in a file
 * 
 * @param {string} filePath - Path to the file to fix
 * @returns {boolean} Whether any fixes were applied
 * @example
 * const fixed = fixSyntaxErrors('src/pages/example.astro');
 * 
 * @since 1.0.0
 */
function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    const appliedFixes = [];
    
    // Apply each syntax fix
    for (const fix of syntaxFixes) {
      const matches = content.match(fix.pattern);
      if (matches && matches.length > 0) {
        content = content.replace(fix.pattern, fix.replacement);
        hasChanges = true;
        appliedFixes.push(`${fix.name} (${matches.length} instances)`);
        
        console.log(`   ✅ ${path.relative(rootDir, filePath)}: ${fix.description} (${matches.length} instances)`);
      }
    }
    
    // Write back the fixed content
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      results.filesFixed.push(path.relative(rootDir, filePath));
      results.errorsFixed.push(...appliedFixes);
      return true;
    }
    
    return false;
  } catch (error) {
    results.errors.push(`Failed to fix ${filePath}: ${error.message}`);
    console.log(`   ❌ Failed to fix: ${path.relative(rootDir, filePath)} - ${error.message}`);
    return false;
  }
}

/**
 * Scan and fix all files with potential syntax errors
 * 
 * @returns {Promise<void>}
 * @example
 * await scanAndFixFiles();
 * 
 * @since 1.0.0
 */
async function scanAndFixFiles() {
  console.log('1️⃣ Fixing known problematic files...');
  
  for (const filePath of filesToFix) {
    const fullPath = path.join(rootDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      fixSyntaxErrors(fullPath);
    } else {
      console.log(`   ⏭️  File not found: ${filePath}`);
    }
  }
  
  console.log('\n2️⃣ Scanning for additional syntax issues...');
  
  // Scan additional files that might have similar issues
  const additionalFiles = [
    'src/pages/nosytos95.astro',
    'src/pages/crypto-mining.astro',
    'src/pages/3d-printing.astro'
  ];
  
  for (const filePath of additionalFiles) {
    const fullPath = path.join(rootDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for potential issues
        const hasObfuscatedCode = /oo_oo|\.{3}[^.\s]/.test(content);
        const hasMalformedConsole = /consol[^e]/.test(content);
        
        if (hasObfuscatedCode || hasMalformedConsole) {
          console.log(`   🔍 Found potential issues in: ${path.relative(rootDir, fullPath)}`);
          fixSyntaxErrors(fullPath);
        }
      } catch (error) {
        console.log(`   ⚠️  Could not scan: ${path.relative(rootDir, fullPath)} - ${error.message}`);
      }
    }
  }
}

/**
 * Validate that fixes were successful
 * 
 * @returns {Promise<void>}
 * @example
 * await validateFixes();
 * 
 * @since 1.0.0
 */
async function validateFixes() {
  console.log('\n3️⃣ Validating fixes...');
  
  for (const filePath of filesToFix) {
    const fullPath = path.join(rootDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check if problematic patterns still exist
        const stillHasIssues = syntaxFixes.some(fix => fix.pattern.test(content));
        
        if (stillHasIssues) {
          console.log(`   ⚠️  ${path.relative(rootDir, fullPath)}: May still have syntax issues`);
        } else {
          console.log(`   ✅ ${path.relative(rootDir, fullPath)}: Syntax issues resolved`);
        }
      } catch (error) {
        console.log(`   ❌ Could not validate: ${path.relative(rootDir, fullPath)} - ${error.message}`);
      }
    }
  }
}

/**
 * Generate fix report
 * 
 * @returns {void}
 * @example
 * generateFixReport();
 * 
 * @since 1.0.0
 */
function generateFixReport() {
  console.log('\n4️⃣ Generating fix report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      filesFixed: results.filesFixed.length,
      errorsFixed: results.errorsFixed.length,
      errors: results.errors.length
    },
    details: {
      filesFixed: results.filesFixed,
      errorsFixed: results.errorsFixed,
      errors: results.errors
    },
    recommendations: [
      'Run the development server to verify fixes',
      'Check for any remaining syntax errors in the console',
      'Consider adding ESLint rules to prevent similar issues',
      'Review code for any obfuscated or minified content'
    ]
  };
  
  const reportPath = path.join(rootDir, 'syntax-fix-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`   📄 Report saved to: syntax-fix-report.json`);
}

/**
 * Main fix function
 * 
 * @async
 * @returns {Promise<void>}
 * @example
 * await main();
 * 
 * @since 1.0.0
 */
async function main() {
  try {
    await scanAndFixFiles();
    await validateFixes();
    generateFixReport();
    
    console.log('\n📊 Syntax Fix Summary:');
    console.log(`   Files fixed: ${results.filesFixed.length}`);
    console.log(`   Errors fixed: ${results.errorsFixed.length}`);
    console.log(`   Errors encountered: ${results.errors.length}`);
    
    if (results.filesFixed.length > 0) {
      console.log('\n🔧 Fixed Files:');
      results.filesFixed.forEach(file => console.log(`   • ${file}`));
    }
    
    if (results.errorsFixed.length > 0) {
      console.log('\n✅ Errors Fixed:');
      results.errorsFixed.forEach(error => console.log(`   • ${error}`));
    }
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    console.log('\n✅ Syntax error fixing completed!');
    console.log('\n💡 Next steps:');
    console.log('   • Restart the development server');
    console.log('   • Test the site functionality');
    console.log('   • Check for any remaining console errors');
    console.log('   • Consider code review for obfuscated content');
    
  } catch (error) {
    console.error('❌ Syntax fixing failed:', error.message);
    process.exit(1);
  }
}

// Run the syntax fixing
main();
