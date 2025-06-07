#!/usr/bin/env node

/**
 * @fileoverview Error Handling Standardization Script
 * 
 * This script analyzes and standardizes error handling patterns across the codebase,
 * replacing inconsistent try-catch blocks and console.error calls with the
 * consolidated error handling utilities from @/utils/errorUtils.
 * 
 * @module standardize-error-handling
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

console.log('🔧 Standardizing error handling across the codebase...\n');

/**
 * Configuration for error handling analysis
 * 
 * @type {object}
 */
const config = {
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.astro'],
  scanDirs: ['src', 'public/scripts', 'scripts'],
  ignoreDirs: ['node_modules', 'dist', '.astro', '.git'],
  ignoreFiles: ['*.min.js', '*.bundle.js', 'vendor/**', 'errorUtils.js']
};

/**
 * Results tracking
 * 
 * @type {object}
 */
const results = {
  filesAnalyzed: 0,
  filesUpdated: 0,
  patterns: {
    inconsistentTryCatch: [],
    directConsoleError: [],
    missingAsyncErrorHandling: [],
    resourceErrorHandling: [],
    apiErrorHandling: []
  },
  improvements: [],
  errors: []
};

/**
 * Error handling patterns to standardize
 * 
 * @type {object[]}
 */
const errorPatterns = [
  {
    name: 'Direct console.error calls',
    pattern: /console\.error\s*\(/g,
    replacement: 'handleError(',
    severity: 'medium',
    category: 'logging'
  },
  {
    name: 'Direct console.warn calls for errors',
    pattern: /console\.warn\s*\(\s*['"`].*error.*['"`]/gi,
    replacement: 'handleError(',
    severity: 'low',
    category: 'logging'
  },
  {
    name: 'Basic try-catch with console.error',
    pattern: /try\s*\{([^}]*)\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]*\);?\s*\}/g,
    replacement: 'tryExecute(() => {$1}, context)',
    severity: 'medium',
    category: 'error-handling'
  },
  {
    name: 'Async try-catch with console.error',
    pattern: /try\s*\{([^}]*await[^}]*)\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]*\);?\s*\}/g,
    replacement: 'await tryExecuteAsync(async () => {$1}, context)',
    severity: 'high',
    category: 'async-error-handling'
  }
];

/**
 * Files that need specific error handling updates
 * 
 * @type {object[]}
 */
const filesToUpdate = [
  {
    file: 'public/scripts/core/main.js',
    updates: [
      {
        description: 'Replace resource error handling with standardized utility',
        search: /console\.warn\('Image failed to load:', target\.src\);/g,
        replace: 'handleResourceError(event);'
      },
      {
        description: 'Replace script error logging with standardized utility',
        search: /console\.error\('Script failed to load:', target\.src\);/g,
        replace: 'handleResourceError(event);'
      },
      {
        description: 'Replace stylesheet error logging with standardized utility',
        search: /console\.error\('Stylesheet failed to load:', target\.href\);/g,
        replace: 'handleResourceError(event);'
      }
    ]
  },
  {
    file: 'public/scripts/core/utils.js',
    updates: [
      {
        description: 'Replace basic error handler with standardized utility',
        search: /console\.error\(`Error in \${context}:`, error\);/g,
        replace: 'handleError(error, context, ErrorSeverity.MEDIUM, ErrorCategory.RUNTIME, report);'
      }
    ]
  },
  {
    file: 'public/scripts/contact-booking.js',
    updates: [
      {
        description: 'Replace form submission error with standardized utility',
        search: /showNotification\('Error submitting form\. Please try again\.', 'error'\);/g,
        replace: 'handleError(error, \'Form submission\', ErrorSeverity.MEDIUM, ErrorCategory.USER_INPUT); showNotification(\'Error submitting form. Please try again.\', \'error\');'
      }
    ]
  },
  {
    file: 'public/service-worker.js',
    updates: [
      {
        description: 'Replace service worker error logging with standardized utility',
        search: /console\.error\('\[Service Worker\] Sound fetch failed:', error, request\.url\);/g,
        replace: 'handleError(error, `Service Worker sound fetch: ${request.url}`, ErrorSeverity.MEDIUM, ErrorCategory.NETWORK);'
      }
    ]
  }
];

/**
 * Recursively finds all files with specified extensions
 * 
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to include
 * @returns {string[]} Array of file paths
 * @example
 * const files = findFiles('src', ['.js', '.ts']);
 * 
 * @since 1.0.0
 */
function findFiles(dir, extensions) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !config.ignoreDirs.includes(item)) {
        files.push(...findFiles(fullPath, extensions));
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        if (!config.ignoreFiles.some(pattern => 
          fullPath.includes(pattern.replace('*', '')) || 
          fullPath.includes(pattern.replace('**/', '')) ||
          item.includes(pattern.replace('*.', '').replace('.js', ''))
        )) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Analyzes error handling patterns in a file
 * 
 * @param {string} filePath - Path to the file to analyze
 * @returns {object} Analysis results
 * @example
 * const analysis = analyzeErrorHandling('src/utils/example.js');
 * 
 * @since 1.0.0
 */
function analyzeErrorHandling(filePath) {
  const analysis = {
    file: filePath,
    patterns: [],
    needsImport: false,
    hasStandardizedHandling: false
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file already uses standardized error handling
    if (content.includes('handleError') || content.includes('tryExecute') || content.includes('@/utils/errorUtils')) {
      analysis.hasStandardizedHandling = true;
    }
    
    // Analyze each error pattern
    errorPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches && matches.length > 0) {
        analysis.patterns.push({
          name: pattern.name,
          count: matches.length,
          severity: pattern.severity,
          category: pattern.category
        });
        
        // Track in global results
        if (!results.patterns[pattern.category]) {
          results.patterns[pattern.category] = [];
        }
        results.patterns[pattern.category].push({
          file: path.relative(rootDir, filePath),
          pattern: pattern.name,
          count: matches.length
        });
      }
    });
    
    // Check if import is needed
    if (analysis.patterns.length > 0 && !analysis.hasStandardizedHandling) {
      analysis.needsImport = true;
    }
    
  } catch (error) {
    results.errors.push(`Failed to analyze ${filePath}: ${error.message}`);
  }
  
  return analysis;
}

/**
 * Updates specific files with standardized error handling
 * 
 * @returns {Promise<void>}
 * @example
 * await updateSpecificFiles();
 * 
 * @since 1.0.0
 */
async function updateSpecificFiles() {
  console.log('1️⃣ Updating specific files with standardized error handling...');
  
  for (const fileUpdate of filesToUpdate) {
    const fullPath = path.join(rootDir, fileUpdate.file);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⏭️  File not found: ${fileUpdate.file}`);
      continue;
    }
    
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let hasChanges = false;
      
      // Add import if needed and not already present
      if (!content.includes('@/utils/errorUtils') && !content.includes('handleError')) {
        const importStatement = `import { handleError, handleResourceError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';\n`;
        
        // Find the best place to add the import
        if (content.includes('import ')) {
          // Add after existing imports
          const lastImportIndex = content.lastIndexOf('import ');
          const nextLineIndex = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);
        } else {
          // Add at the beginning
          content = importStatement + '\n' + content;
        }
        hasChanges = true;
      }
      
      // Apply specific updates
      for (const update of fileUpdate.updates) {
        if (update.search.test(content)) {
          content = content.replace(update.search, update.replace);
          hasChanges = true;
          console.log(`   ✅ ${fileUpdate.file}: ${update.description}`);
          results.improvements.push(`${fileUpdate.file}: ${update.description}`);
        }
      }
      
      if (hasChanges) {
        fs.writeFileSync(fullPath, content, 'utf8');
        results.filesUpdated++;
      }
      
    } catch (error) {
      results.errors.push(`Failed to update ${fileUpdate.file}: ${error.message}`);
      console.log(`   ❌ Failed to update: ${fileUpdate.file} - ${error.message}`);
    }
  }
}

/**
 * Analyzes all files for error handling patterns
 * 
 * @param {string[]} files - Array of file paths to analyze
 * @returns {Promise<void>}
 * @example
 * await analyzeAllFiles(files);
 * 
 * @since 1.0.0
 */
async function analyzeAllFiles(files) {
  console.log('\n2️⃣ Analyzing error handling patterns across all files...');
  
  const analyses = [];
  
  for (const filePath of files) {
    const analysis = analyzeErrorHandling(filePath);
    if (analysis.patterns.length > 0) {
      analyses.push(analysis);
    }
    results.filesAnalyzed++;
  }
  
  // Report findings
  if (analyses.length > 0) {
    console.log(`   Found error handling patterns in ${analyses.length} files:`);
    
    analyses.slice(0, 10).forEach(analysis => {
      const relativePath = path.relative(rootDir, analysis.file);
      const patternCount = analysis.patterns.reduce((sum, p) => sum + p.count, 0);
      console.log(`   • ${relativePath}: ${patternCount} patterns (${analysis.hasStandardizedHandling ? 'partially standardized' : 'needs standardization'})`);
    });
    
    if (analyses.length > 10) {
      console.log(`   ... and ${analyses.length - 10} more files`);
    }
  }
}

/**
 * Creates global error handler setup
 * 
 * @returns {Promise<void>}
 * @example
 * await createGlobalErrorHandler();
 * 
 * @since 1.0.0
 */
async function createGlobalErrorHandler() {
  console.log('\n3️⃣ Creating global error handler setup...');
  
  const globalErrorHandlerPath = path.join(rootDir, 'public/scripts/global-error-handler.js');
  
  const globalErrorHandlerContent = `/**
 * Global Error Handler Setup
 * 
 * Sets up standardized error handling for the entire application.
 * This should be loaded early in the application lifecycle.
 */

import { setupGlobalErrorHandler, handleResourceError } from '@/utils/errorUtils';

// Set up global error handling
const cleanup = setupGlobalErrorHandler({
  handlePromiseRejections: true,
  handleGlobalErrors: true
});

// Set up resource error handling
document.addEventListener('error', handleResourceError, true);

// Store cleanup function for potential use
window.nosytErrorHandlerCleanup = cleanup;

console.log('✅ Global error handling initialized');
`;
  
  fs.writeFileSync(globalErrorHandlerPath, globalErrorHandlerContent);
  console.log(`   ✅ Created global error handler: public/scripts/global-error-handler.js`);
  results.improvements.push('Created global error handler setup');
}

/**
 * Generates error handling standards documentation
 * 
 * @returns {void}
 * @example
 * generateErrorHandlingDocs();
 * 
 * @since 1.0.0
 */
function generateErrorHandlingDocs() {
  console.log('\n4️⃣ Generating error handling standards documentation...');
  
  const docsContent = `# Error Handling Standards

## Overview
This document defines standardized error handling patterns for the NosytLabs codebase using the consolidated error utilities from \`@/utils/errorUtils\`.

## Quick Reference

### Basic Error Handling
\`\`\`javascript
import { handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

// Handle an error with context
handleError(error, 'User authentication', ErrorSeverity.HIGH, ErrorCategory.VALIDATION);
\`\`\`

### Safe Function Execution
\`\`\`javascript
import { tryExecute, tryExecuteAsync } from '@/utils/errorUtils';

// Synchronous function
const result = tryExecute(() => riskyOperation(), 'Risky operation');

// Asynchronous function
const result = await tryExecuteAsync(() => fetch('/api/data'), 'API call');
\`\`\`

### Resource Error Handling
\`\`\`javascript
import { handleResourceError } from '@/utils/errorUtils';

// Set up resource error handling
document.addEventListener('error', handleResourceError, true);

// Or handle specific resource errors
img.addEventListener('error', (event) => {
  handleResourceError(event, { fallbackImage: '/images/custom-fallback.png' });
});
\`\`\`

## Migration Examples

### Before: Inconsistent Error Handling
\`\`\`javascript
// ❌ Inconsistent patterns
try {
  riskyOperation();
} catch (error) {
  console.error('Something went wrong:', error);
}

// ❌ Direct console calls
console.error('Image failed to load:', src);
console.warn('API call failed');
\`\`\`

### After: Standardized Error Handling
\`\`\`javascript
// ✅ Standardized patterns
import { tryExecute, handleError, ErrorSeverity, ErrorCategory } from '@/utils/errorUtils';

const result = tryExecute(() => riskyOperation(), 'Risky operation');

// ✅ Proper error categorization
handleError(error, 'Image loading', ErrorSeverity.LOW, ErrorCategory.RESOURCE);
handleError(error, 'API call', ErrorSeverity.HIGH, ErrorCategory.NETWORK);
\`\`\`

## Error Severity Levels
- **LOW**: Minor issues that don't affect functionality
- **MEDIUM**: Issues that may affect user experience
- **HIGH**: Serious issues that impact functionality
- **CRITICAL**: System-breaking errors

## Error Categories
- **RUNTIME**: General runtime errors
- **NETWORK**: Network and API related errors
- **VALIDATION**: Input validation errors
- **RESOURCE**: Resource loading errors
- **PERMISSION**: Permission and authorization errors
- **USER_INPUT**: User input related errors

## Best Practices
1. Always use \`tryExecute\` or \`tryExecuteAsync\` for risky operations
2. Provide meaningful context for all errors
3. Use appropriate severity levels and categories
4. Set up global error handling early in the application
5. Use \`handleResourceError\` for all resource loading errors
6. Avoid direct \`console.error\` calls - use \`handleError\` instead
`;

  const docsPath = path.join(rootDir, 'docs/ERROR_HANDLING_STANDARDS.md');
  fs.writeFileSync(docsPath, docsContent);
  console.log(`   ✅ Created documentation: docs/ERROR_HANDLING_STANDARDS.md`);
}

/**
 * Main standardization function
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
    // Find all files to analyze
    const allFiles = [];
    for (const dir of config.scanDirs) {
      const dirPath = path.join(rootDir, dir);
      if (fs.existsSync(dirPath)) {
        allFiles.push(...findFiles(dirPath, config.extensions));
      }
    }
    
    console.log(`Found ${allFiles.length} files to analyze\n`);
    
    await updateSpecificFiles();
    await analyzeAllFiles(allFiles);
    await createGlobalErrorHandler();
    generateErrorHandlingDocs();
    
    // Generate summary report
    const reportPath = path.join(rootDir, 'error-handling-standardization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        filesAnalyzed: results.filesAnalyzed,
        filesUpdated: results.filesUpdated,
        improvements: results.improvements.length,
        errors: results.errors.length
      },
      details: results
    }, null, 2));
    
    console.log('\n📊 Error Handling Standardization Summary:');
    console.log(`   Files analyzed: ${results.filesAnalyzed}`);
    console.log(`   Files updated: ${results.filesUpdated}`);
    console.log(`   Improvements made: ${results.improvements.length}`);
    console.log(`   Errors encountered: ${results.errors.length}`);
    
    if (results.improvements.length > 0) {
      console.log('\n🎉 Improvements Made:');
      results.improvements.forEach(improvement => console.log(`   • ${improvement}`));
    }
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    console.log('\n✅ Error handling standardization completed!');
    console.log('\n💡 Next steps:');
    console.log('   • Include global-error-handler.js in your main application');
    console.log('   • Review remaining files for manual error handling updates');
    console.log('   • Test error handling in development environment');
    console.log('   • Consider adding error reporting service integration');
    
    console.log(`\n📄 Detailed report saved to: error-handling-standardization-report.json`);
    
  } catch (error) {
    console.error('❌ Standardization failed:', error.message);
    process.exit(1);
  }
}

// Run the standardization
main();
