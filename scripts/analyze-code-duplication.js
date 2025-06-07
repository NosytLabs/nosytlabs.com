#!/usr/bin/env node

/**
 * @fileoverview Code Duplication Analysis Script
 * 
 * This script analyzes the codebase for duplicate code patterns,
 * functions, and utilities that can be consolidated.
 * 
 * @module analyze-code-duplication
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

console.log('🔍 Analyzing code duplication across the codebase...\n');

/**
 * Configuration for duplication analysis
 * 
 * @type {object}
 */
const config = {
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.astro'],
  scanDirs: ['src', 'public/scripts', 'scripts'],
  ignoreDirs: ['node_modules', 'dist', '.astro', '.git', 'doom'],
  ignoreFiles: ['*.min.js', '*.bundle.js', 'vendor/**'],
  
  // Minimum function size to consider for duplication (lines)
  minFunctionSize: 5,
  
  // Similarity threshold for considering functions as duplicates
  similarityThreshold: 0.8
};

/**
 * Analysis results storage
 * 
 * @type {object}
 */
const results = {
  filesAnalyzed: 0,
  duplicates: {
    exactFunctions: [],
    similarFunctions: [],
    duplicateConstants: [],
    duplicateUtilities: [],
    redundantFiles: []
  },
  consolidationOpportunities: [],
  recommendations: []
};

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
 * Extracts functions from file content
 * 
 * @param {string} content - File content
 * @param {string} filePath - Path to the file
 * @returns {object[]} Array of function objects
 * @example
 * const functions = extractFunctions(content, 'utils.js');
 * 
 * @since 1.0.0
 */
function extractFunctions(content, filePath) {
  const functions = [];
  
  // Patterns to match different function declarations
  const patterns = [
    // Regular functions: function name() {}
    /function\s+(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
    // Arrow functions: const name = () => {}
    /const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])\s*=>\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
    // Method definitions: name() {}
    /(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g
  ];
  
  patterns.forEach((pattern, patternIndex) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const name = match[1];
      const body = match[2];
      const lines = body.split('\n').filter(line => line.trim()).length;
      
      if (lines >= config.minFunctionSize) {
        functions.push({
          name,
          body: body.trim(),
          lines,
          file: filePath,
          pattern: patternIndex,
          hash: simpleHash(body.trim())
        });
      }
    }
  });
  
  return functions;
}

/**
 * Simple hash function for comparing function bodies
 * 
 * @param {string} str - String to hash
 * @returns {number} Hash value
 * @example
 * const hash = simpleHash('function body');
 * 
 * @since 1.0.0
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Calculates similarity between two strings
 * 
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 * @example
 * const similarity = calculateSimilarity('hello', 'hallo');
 * 
 * @since 1.0.0
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculates Levenshtein distance between two strings
 * 
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 * @example
 * const distance = levenshteinDistance('hello', 'hallo');
 * 
 * @since 1.0.0
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Finds duplicate functions across files
 * 
 * @param {object[]} allFunctions - Array of all extracted functions
 * @returns {void}
 * @example
 * findDuplicateFunctions(functions);
 * 
 * @since 1.0.0
 */
function findDuplicateFunctions(allFunctions) {
  const functionGroups = new Map();
  const similarGroups = [];
  
  // Group by exact hash
  allFunctions.forEach(func => {
    if (!functionGroups.has(func.hash)) {
      functionGroups.set(func.hash, []);
    }
    functionGroups.get(func.hash).push(func);
  });
  
  // Find exact duplicates
  functionGroups.forEach((functions, hash) => {
    if (functions.length > 1) {
      results.duplicates.exactFunctions.push({
        hash,
        functions: functions.map(f => ({
          name: f.name,
          file: path.relative(rootDir, f.file),
          lines: f.lines
        }))
      });
    }
  });
  
  // Find similar functions
  for (let i = 0; i < allFunctions.length; i++) {
    for (let j = i + 1; j < allFunctions.length; j++) {
      const func1 = allFunctions[i];
      const func2 = allFunctions[j];
      
      if (func1.hash !== func2.hash) {
        const similarity = calculateSimilarity(func1.body, func2.body);
        
        if (similarity >= config.similarityThreshold) {
          results.duplicates.similarFunctions.push({
            similarity: Math.round(similarity * 100),
            function1: {
              name: func1.name,
              file: path.relative(rootDir, func1.file),
              lines: func1.lines
            },
            function2: {
              name: func2.name,
              file: path.relative(rootDir, func2.file),
              lines: func2.lines
            }
          });
        }
      }
    }
  }
}

/**
 * Identifies specific duplication patterns
 * 
 * @param {string[]} files - Array of file paths
 * @returns {void}
 * @example
 * identifyDuplicationPatterns(files);
 * 
 * @since 1.0.0
 */
function identifyDuplicationPatterns(files) {
  // Known duplicate patterns to look for
  const patterns = {
    domUtils: {
      pattern: /getElementById|querySelector|createElement/g,
      description: 'DOM manipulation utilities'
    },
    errorHandling: {
      pattern: /try\s*\{[\s\S]*catch\s*\([^)]*\)\s*\{[\s\S]*console\.(error|warn)/g,
      description: 'Error handling patterns'
    },
    dateFormatting: {
      pattern: /toLocaleDateString|formatDate|new Date/g,
      description: 'Date formatting utilities'
    },
    prefersReducedMotion: {
      pattern: /prefers-reduced-motion/g,
      description: 'Reduced motion detection'
    },
    resourceErrorHandling: {
      pattern: /addEventListener.*error.*IMG|tagName.*IMG/g,
      description: 'Resource error handling'
    }
  };
  
  const patternOccurrences = {};
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(rootDir, filePath);
      
      Object.entries(patterns).forEach(([key, { pattern, description }]) => {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
          if (!patternOccurrences[key]) {
            patternOccurrences[key] = {
              description,
              files: [],
              totalMatches: 0
            };
          }
          
          patternOccurrences[key].files.push({
            file: relativePath,
            matches: matches.length
          });
          patternOccurrences[key].totalMatches += matches.length;
        }
      });
    } catch (error) {
      console.warn(`⚠️  Could not analyze ${filePath}: ${error.message}`);
    }
  });
  
  // Store patterns with multiple occurrences
  Object.entries(patternOccurrences).forEach(([key, data]) => {
    if (data.files.length > 1) {
      results.duplicates.duplicateUtilities.push({
        type: key,
        description: data.description,
        occurrences: data.files.length,
        totalMatches: data.totalMatches,
        files: data.files
      });
    }
  });
}

/**
 * Generates consolidation recommendations
 * 
 * @returns {string[]} Array of recommendations
 * @example
 * const recommendations = generateRecommendations();
 * 
 * @since 1.0.0
 */
function generateRecommendations() {
  const recommendations = [];
  
  recommendations.push('📋 Code Deduplication Recommendations:');
  
  if (results.duplicates.exactFunctions.length > 0) {
    recommendations.push(`   • Consolidate ${results.duplicates.exactFunctions.length} exact duplicate functions`);
  }
  
  if (results.duplicates.similarFunctions.length > 0) {
    recommendations.push(`   • Review ${results.duplicates.similarFunctions.length} similar functions for consolidation`);
  }
  
  if (results.duplicates.duplicateUtilities.length > 0) {
    recommendations.push(`   • Create shared utilities for ${results.duplicates.duplicateUtilities.length} common patterns`);
  }
  
  // Specific recommendations based on patterns found
  const domUtils = results.duplicates.duplicateUtilities.find(u => u.type === 'domUtils');
  if (domUtils && domUtils.occurrences > 2) {
    recommendations.push('   • Create shared DOM utility functions (getElementById, querySelector patterns)');
  }
  
  const errorHandling = results.duplicates.duplicateUtilities.find(u => u.type === 'errorHandling');
  if (errorHandling && errorHandling.occurrences > 2) {
    recommendations.push('   • Standardize error handling with shared utility functions');
  }
  
  const dateFormatting = results.duplicates.duplicateUtilities.find(u => u.type === 'dateFormatting');
  if (dateFormatting && dateFormatting.occurrences > 2) {
    recommendations.push('   • Consolidate date formatting into shared dateUtils module');
  }
  
  return recommendations;
}

/**
 * Main analysis function
 * 
 * @async
 * @returns {Promise<void>}
 * @example
 * await main();
 * 
 * @since 1.0.0
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
  
  console.log('2️⃣ Extracting functions...');
  
  const allFunctions = [];
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const functions = extractFunctions(content, filePath);
      allFunctions.push(...functions);
      results.filesAnalyzed++;
    } catch (error) {
      console.warn(`⚠️  Could not analyze ${filePath}: ${error.message}`);
    }
  }
  
  console.log(`   Extracted ${allFunctions.length} functions\n`);
  
  console.log('3️⃣ Finding duplicate functions...');
  findDuplicateFunctions(allFunctions);
  
  console.log('4️⃣ Identifying duplication patterns...');
  identifyDuplicationPatterns(allFiles);
  
  console.log('5️⃣ Generating recommendations...');
  results.recommendations = generateRecommendations();
  
  // Display results
  console.log('\n📊 Code Duplication Analysis Results:');
  console.log(`   Files analyzed: ${results.filesAnalyzed}`);
  console.log(`   Functions extracted: ${allFunctions.length}`);
  console.log(`   Exact duplicates: ${results.duplicates.exactFunctions.length}`);
  console.log(`   Similar functions: ${results.duplicates.similarFunctions.length}`);
  console.log(`   Duplicate patterns: ${results.duplicates.duplicateUtilities.length}`);
  
  if (results.duplicates.exactFunctions.length > 0) {
    console.log('\n🔄 Exact Duplicate Functions:');
    results.duplicates.exactFunctions.slice(0, 5).forEach((group, index) => {
      console.log(`   ${index + 1}. Function group (${group.functions.length} duplicates):`);
      group.functions.forEach(func => {
        console.log(`      • ${func.name} in ${func.file} (${func.lines} lines)`);
      });
    });
    
    if (results.duplicates.exactFunctions.length > 5) {
      console.log(`   ... and ${results.duplicates.exactFunctions.length - 5} more groups`);
    }
  }
  
  if (results.duplicates.duplicateUtilities.length > 0) {
    console.log('\n🔧 Duplicate Utility Patterns:');
    results.duplicates.duplicateUtilities.forEach((pattern, index) => {
      console.log(`   ${index + 1}. ${pattern.description}:`);
      console.log(`      Found in ${pattern.occurrences} files (${pattern.totalMatches} total matches)`);
      pattern.files.slice(0, 3).forEach(file => {
        console.log(`      • ${file.file} (${file.matches} matches)`);
      });
      if (pattern.files.length > 3) {
        console.log(`      ... and ${pattern.files.length - 3} more files`);
      }
    });
  }
  
  console.log('\n💡 Recommendations:');
  results.recommendations.forEach(rec => console.log(rec));
  
  console.log('\n📚 Next steps:');
  console.log('   • Create shared utility modules for common patterns');
  console.log('   • Consolidate exact duplicate functions');
  console.log('   • Review similar functions for potential merging');
  console.log('   • Update imports to use consolidated utilities');
  
  // Save detailed results
  const reportPath = path.join(rootDir, 'code-duplication-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: results,
    config
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: code-duplication-analysis.json`);
}

// Run the analysis
main().catch(error => {
  console.error('❌ Analysis failed:', error.message);
  process.exit(1);
});
