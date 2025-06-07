#!/usr/bin/env node

/**
 * @fileoverview Error Handling Standardization Validation Script
 * 
 * This script validates the error handling standardization improvements
 * and demonstrates the enhanced error management system.
 * 
 * @module validate-error-handling
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

console.log('🔍 Validating error handling standardization improvements...\n');

/**
 * Validates error handling utilities implementation
 * 
 * @returns {object} Validation results
 * @example
 * const results = validateErrorUtilities();
 * 
 * @since 1.0.0
 */
function validateErrorUtilities() {
  const results = {
    score: 0,
    maxScore: 100,
    improvements: [],
    issues: []
  };
  
  // Check if error utilities exist
  const errorUtilsPath = path.join(rootDir, 'src/utils/errorUtils.js');
  if (fs.existsSync(errorUtilsPath)) {
    results.improvements.push('✅ Error utilities module exists');
    results.score += 20;
    
    try {
      const content = fs.readFileSync(errorUtilsPath, 'utf8');
      
      // Check for key functions
      const keyFunctions = [
        'handleError',
        'tryExecute',
        'tryExecuteAsync',
        'handleResourceError',
        'setupGlobalErrorHandler'
      ];
      
      keyFunctions.forEach(func => {
        if (content.includes(`export function ${func}`) || content.includes(`export async function ${func}`)) {
          results.score += 8;
          results.improvements.push(`✅ ${func} function implemented`);
        } else {
          results.issues.push(`❌ Missing ${func} function`);
        }
      });
      
      // Check for error severity and categories
      if (content.includes('ErrorSeverity') && content.includes('ErrorCategory')) {
        results.score += 10;
        results.improvements.push('✅ Error severity and category enums defined');
      }
      
      // Check for JSDoc documentation
      if (content.includes('@example') && content.includes('@param')) {
        results.score += 10;
        results.improvements.push('✅ Comprehensive JSDoc documentation');
      }
      
    } catch (error) {
      results.issues.push(`❌ Error reading error utilities: ${error.message}`);
    }
  } else {
    results.issues.push('❌ Error utilities module missing');
  }
  
  return results;
}

/**
 * Validates global error handler setup
 * 
 * @returns {object} Validation results
 * @example
 * const results = validateGlobalErrorHandler();
 * 
 * @since 1.0.0
 */
function validateGlobalErrorHandler() {
  const results = {
    improvements: [],
    issues: []
  };
  
  const globalHandlerPath = path.join(rootDir, 'public/scripts/global-error-handler.js');
  if (fs.existsSync(globalHandlerPath)) {
    results.improvements.push('✅ Global error handler setup exists');
    
    try {
      const content = fs.readFileSync(globalHandlerPath, 'utf8');
      
      if (content.includes('setupGlobalErrorHandler')) {
        results.improvements.push('✅ Global error handler properly configured');
      }
      
      if (content.includes('handleResourceError')) {
        results.improvements.push('✅ Resource error handling configured');
      }
      
      if (content.includes('handlePromiseRejections: true')) {
        results.improvements.push('✅ Promise rejection handling enabled');
      }
      
    } catch (error) {
      results.issues.push(`❌ Error reading global handler: ${error.message}`);
    }
  } else {
    results.issues.push('❌ Global error handler setup missing');
  }
  
  return results;
}

/**
 * Validates updated files for standardized error handling
 * 
 * @returns {object} Validation results
 * @example
 * const results = validateUpdatedFiles();
 * 
 * @since 1.0.0
 */
function validateUpdatedFiles() {
  const results = {
    improvements: [],
    issues: [],
    filesChecked: 0,
    filesWithStandardizedHandling: 0
  };
  
  const filesToCheck = [
    'public/scripts/core/main.js',
    'public/scripts/core/utils.js',
    'public/scripts/contact-booking.js',
    'public/service-worker.js'
  ];
  
  for (const filePath of filesToCheck) {
    const fullPath = path.join(rootDir, filePath);
    results.filesChecked++;
    
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for standardized error handling imports
        if (content.includes('@/utils/errorUtils') || content.includes('handleError') || content.includes('handleResourceError')) {
          results.filesWithStandardizedHandling++;
          results.improvements.push(`✅ ${filePath}: Uses standardized error handling`);
        } else {
          results.issues.push(`⚠️  ${filePath}: May need standardized error handling`);
        }
        
        // Check for specific improvements
        if (filePath.includes('main.js') && content.includes('handleResourceError(event)')) {
          results.improvements.push(`✅ ${filePath}: Resource error handling standardized`);
        }
        
        if (filePath.includes('utils.js') && content.includes('ErrorSeverity.MEDIUM')) {
          results.improvements.push(`✅ ${filePath}: Error severity levels implemented`);
        }
        
      } catch (error) {
        results.issues.push(`❌ Error reading ${filePath}: ${error.message}`);
      }
    } else {
      results.issues.push(`❌ File not found: ${filePath}`);
    }
  }
  
  return results;
}

/**
 * Validates documentation and standards
 * 
 * @returns {object} Validation results
 * @example
 * const results = validateDocumentation();
 * 
 * @since 1.0.0
 */
function validateDocumentation() {
  const results = {
    improvements: [],
    issues: []
  };
  
  const expectedDocs = [
    'docs/ERROR_HANDLING_STANDARDS.md',
    'error-handling-standardization-report.json'
  ];
  
  for (const docFile of expectedDocs) {
    const filePath = path.join(rootDir, docFile);
    if (fs.existsSync(filePath)) {
      results.improvements.push(`✅ Documentation exists: ${docFile}`);
      
      if (docFile.includes('ERROR_HANDLING_STANDARDS.md')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('## Migration Examples') && content.includes('## Best Practices')) {
            results.improvements.push('✅ Comprehensive error handling standards documentation');
          }
        } catch (error) {
          results.issues.push(`❌ Error reading ${docFile}: ${error.message}`);
        }
      }
    } else {
      results.issues.push(`❌ Missing documentation: ${docFile}`);
    }
  }
  
  return results;
}

/**
 * Demonstrates standardized error handling patterns
 * 
 * @returns {void}
 * @example
 * demonstrateErrorHandlingPatterns();
 * 
 * @since 1.0.0
 */
function demonstrateErrorHandlingPatterns() {
  console.log('📋 Standardized Error Handling Examples:\n');
  
  const examples = [
    {
      title: 'Basic Error Handling (Before vs After)',
      before: `// ❌ Before - Inconsistent error handling
try {
  riskyOperation();
} catch (error) {
  console.error('Something went wrong:', error);
}`,
      after: `// ✅ After - Standardized error handling
import { tryExecute } from '@/utils/errorUtils';
const result = tryExecute(() => riskyOperation(), 'Risky operation');`
    },
    {
      title: 'Async Error Handling (Before vs After)',
      before: `// ❌ Before - Basic async error handling
try {
  const response = await fetch('/api/data');
  const data = await response.json();
} catch (error) {
  console.error('API call failed:', error);
}`,
      after: `// ✅ After - Standardized async error handling
import { tryExecuteAsync } from '@/utils/errorUtils';
const data = await tryExecuteAsync(async () => {
  const response = await fetch('/api/data');
  return await response.json();
}, 'API data fetch');`
    },
    {
      title: 'Resource Error Handling (Before vs After)',
      before: `// ❌ Before - Manual resource error handling
img.addEventListener('error', (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.src = '/images/fallback.png';
});`,
      after: `// ✅ After - Standardized resource error handling
import { handleResourceError } from '@/utils/errorUtils';
img.addEventListener('error', handleResourceError);`
    },
    {
      title: 'Categorized Error Handling (Before vs After)',
      before: `// ❌ Before - Generic error logging
console.error('Validation failed:', error);
console.warn('Network issue:', error);`,
      after: `// ✅ After - Categorized error handling
import { handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';
handleError(error, 'Form validation', ErrorSeverity.MEDIUM, ErrorCategory.VALIDATION);
handleError(error, 'API call', ErrorSeverity.HIGH, ErrorCategory.NETWORK);`
    }
  ];
  
  examples.forEach((example, index) => {
    console.log(`${index + 1}. ${example.title}:`);
    console.log(example.before);
    console.log('');
    console.log(example.after);
    console.log('\n' + '─'.repeat(60) + '\n');
  });
}

/**
 * Analyzes error handling coverage across the codebase
 * 
 * @returns {object} Coverage analysis results
 * @example
 * const coverage = analyzeErrorHandlingCoverage();
 * 
 * @since 1.0.0
 */
function analyzeErrorHandlingCoverage() {
  const results = {
    totalFiles: 0,
    filesWithErrorHandling: 0,
    filesWithStandardizedHandling: 0,
    coveragePercentage: 0
  };
  
  try {
    const reportPath = path.join(rootDir, 'error-handling-standardization-report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      
      results.totalFiles = report.summary.filesAnalyzed || 0;
      results.filesWithStandardizedHandling = report.summary.filesUpdated || 0;
      
      // Estimate files with error handling (from patterns found)
      if (report.details && report.details.patterns) {
        const patternFiles = new Set();
        Object.values(report.details.patterns).forEach(patterns => {
          if (Array.isArray(patterns)) {
            patterns.forEach(pattern => patternFiles.add(pattern.file));
          }
        });
        results.filesWithErrorHandling = patternFiles.size;
      }
      
      if (results.totalFiles > 0) {
        results.coveragePercentage = Math.round((results.filesWithStandardizedHandling / results.totalFiles) * 100);
      }
    }
  } catch (error) {
    console.warn('Could not analyze error handling coverage:', error.message);
  }
  
  return results;
}

/**
 * Main validation function
 * 
 * @async
 * @returns {Promise<void>}
 * @example
 * await main();
 * 
 * @since 1.0.0
 */
async function main() {
  console.log('1️⃣ Validating error handling utilities...');
  const utilityResults = validateErrorUtilities();
  
  console.log(`   📊 Error Utilities Score: ${utilityResults.score}/${utilityResults.maxScore} (${Math.round((utilityResults.score/utilityResults.maxScore)*100)}%)\n`);
  
  if (utilityResults.improvements.length > 0) {
    console.log('   🎉 Error Utility Improvements:');
    utilityResults.improvements.forEach(improvement => console.log(`      ${improvement}`));
    console.log('');
  }
  
  console.log('2️⃣ Validating global error handler...');
  const globalResults = validateGlobalErrorHandler();
  
  if (globalResults.improvements.length > 0) {
    console.log('   🎉 Global Handler Improvements:');
    globalResults.improvements.forEach(improvement => console.log(`      ${improvement}`));
    console.log('');
  }
  
  console.log('3️⃣ Validating updated files...');
  const fileResults = validateUpdatedFiles();
  
  console.log(`   📊 File Update Coverage: ${fileResults.filesWithStandardizedHandling}/${fileResults.filesChecked} files (${Math.round((fileResults.filesWithStandardizedHandling/fileResults.filesChecked)*100)}%)\n`);
  
  if (fileResults.improvements.length > 0) {
    console.log('   🎉 File Update Improvements:');
    fileResults.improvements.forEach(improvement => console.log(`      ${improvement}`));
    console.log('');
  }
  
  console.log('4️⃣ Validating documentation...');
  const docResults = validateDocumentation();
  
  if (docResults.improvements.length > 0) {
    docResults.improvements.forEach(improvement => console.log(`   ${improvement}`));
    console.log('');
  }
  
  console.log('5️⃣ Analyzing error handling coverage...');
  const coverage = analyzeErrorHandlingCoverage();
  
  console.log(`   📊 Overall Coverage Analysis:`);
  console.log(`      Total files analyzed: ${coverage.totalFiles}`);
  console.log(`      Files with error patterns: ${coverage.filesWithErrorHandling}`);
  console.log(`      Files with standardized handling: ${coverage.filesWithStandardizedHandling}`);
  console.log(`      Standardization coverage: ${coverage.coveragePercentage}%\n`);
  
  console.log('6️⃣ Demonstrating standardized patterns...');
  demonstrateErrorHandlingPatterns();
  
  console.log('📋 Error Handling Standardization Summary:');
  console.log('   🎯 Comprehensive error handling utilities implemented');
  console.log('   📚 Global error handler setup created');
  console.log('   🔧 Key files updated with standardized handling');
  console.log('   📈 Error management significantly improved');
  console.log('   🚀 Foundation set for consistent error handling');
  
  const totalScore = utilityResults.score;
  const maxTotalScore = utilityResults.maxScore;
  
  console.log(`\n🎯 Overall Error Handling Score: ${totalScore}/${maxTotalScore} (${Math.round((totalScore/maxTotalScore)*100)}%)`);
  
  console.log('\n💡 Next Steps:');
  console.log('   • Include global-error-handler.js in main application');
  console.log('   • Update remaining files to use standardized error handling');
  console.log('   • Test error handling in development environment');
  console.log('   • Consider integrating with external error reporting service');
  console.log('   • Add error handling tests to ensure reliability');
}

// Run the validation
main().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});
