#!/usr/bin/env node

/**
 * @fileoverview Export Pattern Analysis Script
 * 
 * This script analyzes import/export patterns across the codebase
 * and identifies inconsistencies that need standardization.
 * 
 * @module analyze-export-patterns
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

console.log('🔍 Analyzing import/export patterns across the codebase...\n');

/**
 * Configuration for export pattern analysis
 * 
 * @type {object}
 */
const config = {
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.astro'],
  scanDirs: ['src', 'public/scripts', 'scripts'],
  ignoreDirs: ['node_modules', 'dist', '.astro', '.git', 'doom'],
  ignoreFiles: ['*.min.js', '*.bundle.js', 'vendor/**']
};

/**
 * Analysis results storage
 * 
 * @type {object}
 */
const results = {
  filesAnalyzed: 0,
  patterns: {
    defaultExports: [],
    namedExports: [],
    barrelExports: [],
    dynamicImports: [],
    relativeImports: [],
    absoluteImports: [],
    typeOnlyImports: [],
    mixedPatterns: []
  },
  issues: [],
  recommendations: []
};

/**
 * Recursively finds all files with specified extensions
 * 
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to include
 * @returns {string[]} Array of file paths
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
        // Skip ignored files
        if (!config.ignoreFiles.some(pattern => 
          fullPath.includes(pattern.replace('*', '')) || 
          fullPath.includes(pattern.replace('**/', ''))
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
 * Analyzes import/export patterns in a file
 * 
 * @param {string} filePath - Path to the file to analyze
 * @returns {object} Analysis results for the file
 */
function analyzeFile(filePath) {
  const fileResults = {
    path: filePath,
    type: path.extname(filePath),
    patterns: {
      defaultExports: [],
      namedExports: [],
      dynamicImports: [],
      relativeImports: [],
      absoluteImports: [],
      typeOnlyImports: [],
      barrelExport: false
    },
    issues: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Analyze export patterns
    analyzeExports(content, fileResults);
    
    // Analyze import patterns
    analyzeImports(content, fileResults);
    
    // Check for barrel export pattern
    if (path.basename(filePath).startsWith('index.')) {
      fileResults.patterns.barrelExport = true;
      results.patterns.barrelExports.push(filePath);
    }
    
    // Identify issues
    identifyIssues(fileResults);
    
  } catch (error) {
    fileResults.issues.push(`Error reading file: ${error.message}`);
  }
  
  return fileResults;
}

/**
 * Analyzes export patterns in file content
 * 
 * @param {string} content - File content
 * @param {object} fileResults - Results object to update
 * @returns {void}
 */
function analyzeExports(content, fileResults) {
  // Default exports
  const defaultExportPatterns = [
    /export\s+default\s+/g,
    /export\s*{\s*\w+\s+as\s+default\s*}/g
  ];
  
  defaultExportPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      fileResults.patterns.defaultExports.push(...matches);
      results.patterns.defaultExports.push({
        file: fileResults.path,
        matches: matches.length
      });
    }
  });
  
  // Named exports
  const namedExportPatterns = [
    /export\s+(?:const|let|var|function|class|interface|type)\s+\w+/g,
    /export\s*{\s*[^}]+\s*}/g
  ];
  
  namedExportPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      fileResults.patterns.namedExports.push(...matches);
      results.patterns.namedExports.push({
        file: fileResults.path,
        matches: matches.length
      });
    }
  });
}

/**
 * Analyzes import patterns in file content
 * 
 * @param {string} content - File content
 * @param {object} fileResults - Results object to update
 * @returns {void}
 */
function analyzeImports(content, fileResults) {
  // Dynamic imports
  const dynamicImportPattern = /import\s*\(\s*['"`][^'"`]+['"`]\s*\)/g;
  const dynamicMatches = content.match(dynamicImportPattern);
  if (dynamicMatches) {
    fileResults.patterns.dynamicImports.push(...dynamicMatches);
    results.patterns.dynamicImports.push({
      file: fileResults.path,
      matches: dynamicMatches.length
    });
  }
  
  // Relative vs absolute imports
  const importPattern = /import\s+[^;]+from\s+['"`]([^'"`]+)['"`]/g;
  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importPath = match[1];
    
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      fileResults.patterns.relativeImports.push(importPath);
      results.patterns.relativeImports.push({
        file: fileResults.path,
        path: importPath
      });
    } else if (importPath.startsWith('@/')) {
      fileResults.patterns.absoluteImports.push(importPath);
      results.patterns.absoluteImports.push({
        file: fileResults.path,
        path: importPath
      });
    }
  }
  
  // Type-only imports (TypeScript)
  const typeImportPattern = /import\s+type\s+/g;
  const typeMatches = content.match(typeImportPattern);
  if (typeMatches) {
    fileResults.patterns.typeOnlyImports.push(...typeMatches);
    results.patterns.typeOnlyImports.push({
      file: fileResults.path,
      matches: typeMatches.length
    });
  }
}

/**
 * Identifies issues in file patterns
 * 
 * @param {object} fileResults - File analysis results
 * @returns {void}
 */
function identifyIssues(fileResults) {
  const { patterns } = fileResults;
  
  // Mixed export patterns (both default and named)
  if (patterns.defaultExports.length > 0 && patterns.namedExports.length > 0) {
    fileResults.issues.push('Mixed default and named exports');
    results.patterns.mixedPatterns.push(fileResults.path);
  }
  
  // Multiple default exports
  if (patterns.defaultExports.length > 1) {
    fileResults.issues.push('Multiple default exports detected');
  }
  
  // Inconsistent import styles
  if (patterns.relativeImports.length > 0 && patterns.absoluteImports.length > 0) {
    fileResults.issues.push('Mixed relative and absolute imports');
  }
  
  // Add to global issues
  if (fileResults.issues.length > 0) {
    results.issues.push({
      file: fileResults.path,
      issues: fileResults.issues
    });
  }
}

/**
 * Generates recommendations based on analysis
 * 
 * @param {object[]} fileResults - Array of file analysis results
 * @returns {string[]} Array of recommendations
 */
function generateRecommendations(fileResults) {
  const recommendations = [];
  
  // Analyze patterns
  const totalFiles = fileResults.length;
  const defaultExportFiles = results.patterns.defaultExports.length;
  const namedExportFiles = results.patterns.namedExports.length;
  const mixedPatternFiles = results.patterns.mixedPatterns.length;
  
  recommendations.push('📋 Export Pattern Standardization Recommendations:');
  
  if (mixedPatternFiles > 0) {
    recommendations.push(`   • Standardize ${mixedPatternFiles} files with mixed export patterns`);
  }
  
  if (defaultExportFiles > namedExportFiles) {
    recommendations.push('   • Consider standardizing on default exports for components');
  } else {
    recommendations.push('   • Consider standardizing on named exports for utilities');
  }
  
  // Barrel export recommendations
  const barrelFiles = results.patterns.barrelExports.length;
  if (barrelFiles > 0) {
    recommendations.push(`   • Review ${barrelFiles} barrel export files for consistency`);
  }
  
  // Import pattern recommendations
  const relativeImports = results.patterns.relativeImports.length;
  const absoluteImports = results.patterns.absoluteImports.length;
  
  if (relativeImports > 0 && absoluteImports > 0) {
    recommendations.push('   • Standardize on absolute imports (@/) for better maintainability');
  }
  
  // Dynamic import recommendations
  const dynamicImports = results.patterns.dynamicImports.length;
  if (dynamicImports > 0) {
    recommendations.push(`   • Review ${dynamicImports} dynamic imports for optimization opportunities`);
  }
  
  return recommendations;
}

/**
 * Main analysis function
 * 
 * @async
 * @returns {Promise<void>}
 */
async function main() {
  console.log('1️⃣ Scanning for files...');
  
  const allFiles = [];
  for (const dir of config.scanDirs) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      allFiles.push(...findFiles(dirPath, config.extensions));
    }
  }
  
  console.log(`   Found ${allFiles.length} files to analyze\n`);
  
  console.log('2️⃣ Analyzing export patterns...');
  
  const fileResults = [];
  for (const filePath of allFiles) {
    const fileResult = analyzeFile(filePath);
    fileResults.push(fileResult);
    results.filesAnalyzed++;
  }
  
  console.log('3️⃣ Generating recommendations...');
  results.recommendations = generateRecommendations(fileResults);
  
  // Display results
  console.log('\n📊 Export Pattern Analysis Results:');
  console.log(`   Files analyzed: ${results.filesAnalyzed}`);
  console.log(`   Default exports: ${results.patterns.defaultExports.length} files`);
  console.log(`   Named exports: ${results.patterns.namedExports.length} files`);
  console.log(`   Barrel exports: ${results.patterns.barrelExports.length} files`);
  console.log(`   Dynamic imports: ${results.patterns.dynamicImports.length} files`);
  console.log(`   Mixed patterns: ${results.patterns.mixedPatterns.length} files`);
  console.log(`   Issues found: ${results.issues.length} files`);
  
  console.log('\n💡 Recommendations:');
  results.recommendations.forEach(rec => console.log(rec));
  
  if (results.issues.length > 0) {
    console.log('\n⚠️  Files with issues:');
    results.issues.slice(0, 10).forEach(issue => {
      const relativePath = path.relative(rootDir, issue.file);
      console.log(`   • ${relativePath}: ${issue.issues.join(', ')}`);
    });
    
    if (results.issues.length > 10) {
      console.log(`   ... and ${results.issues.length - 10} more files`);
    }
  }
  
  console.log('\n📚 Next steps:');
  console.log('   • Review docs/EXPORT_PATTERNS.md for standardization guidelines');
  console.log('   • Focus on files with mixed patterns first');
  console.log('   • Implement barrel exports for component groups');
  console.log('   • Standardize on absolute imports (@/) where possible');
  
  // Save detailed results
  const reportPath = path.join(rootDir, 'export-patterns-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: results,
    files: fileResults
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: export-patterns-analysis.json`);
}

// Run the analysis
main().catch(error => {
  console.error('❌ Analysis failed:', error.message);
  process.exit(1);
});
