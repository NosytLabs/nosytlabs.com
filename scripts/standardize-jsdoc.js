#!/usr/bin/env node

/**
 * @fileoverview JSDoc Standardization Script
 * 
 * This script analyzes existing JSDoc comments across the codebase
 * and provides recommendations for standardization according to
 * NosytLabs documentation standards.
 * 
 * @module standardize-jsdoc
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

console.log('🔍 Analyzing JSDoc documentation across the codebase...\n');

/**
 * Configuration for JSDoc analysis
 * 
 * @type {object}
 */
const config = {
  // File extensions to analyze
  extensions: ['.js', '.ts', '.jsx', '.tsx', '.astro'],
  
  // Directories to scan
  scanDirs: ['src', 'public/scripts', 'scripts'],
  
  // Directories to ignore
  ignoreDirs: ['node_modules', 'dist', '.astro', '.git'],
  
  // Required JSDoc tags for different types
  requiredTags: {
    function: ['@param', '@returns', '@example'],
    class: ['@class', '@example'],
    component: ['@component', '@example'],
    module: ['@fileoverview', '@module']
  }
};

/**
 * Analysis results storage
 * 
 * @type {object}
 */
const results = {
  filesAnalyzed: 0,
  functionsFound: 0,
  classesFound: 0,
  componentsFound: 0,
  documented: 0,
  undocumented: 0,
  needsImprovement: 0,
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
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read directory ${dir}: ${error.message}`);
  }
  
  return files;
}

/**
 * Extracts JSDoc comments from file content
 * 
 * @param {string} content - File content to analyze
 * @returns {object[]} Array of JSDoc comment objects
 */
function extractJSDocComments(content) {
  const jsdocPattern = /\/\*\*([\s\S]*?)\*\//g;
  const comments = [];
  let match;
  
  while ((match = jsdocPattern.exec(content)) !== null) {
    const comment = match[1];
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    
    // Find the next function/class/component after this comment
    const afterComment = content.substring(endIndex);
    const functionMatch = afterComment.match(/^\s*(export\s+)?(async\s+)?function\s+(\w+)/);
    const classMatch = afterComment.match(/^\s*(export\s+)?class\s+(\w+)/);
    const componentMatch = afterComment.match(/^\s*export\s+interface\s+Props/);
    
    let type = 'unknown';
    let name = 'unknown';
    
    if (functionMatch) {
      type = 'function';
      name = functionMatch[3];
    } else if (classMatch) {
      type = 'class';
      name = classMatch[2];
    } else if (componentMatch) {
      type = 'component';
      name = 'Component';
    }
    
    comments.push({
      content: comment,
      type,
      name,
      startIndex,
      endIndex
    });
  }
  
  return comments;
}

/**
 * Analyzes JSDoc comment quality and completeness
 * 
 * @param {object} comment - JSDoc comment object
 * @returns {object} Analysis results with score and issues
 */
function analyzeJSDocQuality(comment) {
  const analysis = {
    score: 0,
    maxScore: 10,
    issues: [],
    hasDescription: false,
    hasParams: false,
    hasReturns: false,
    hasExample: false,
    hasProperTags: false
  };
  
  const content = comment.content;
  
  // Check for description (first non-tag line)
  const lines = content.split('\n').map(line => line.trim().replace(/^\*\s?/, ''));
  const nonEmptyLines = lines.filter(line => line && !line.startsWith('@'));
  
  if (nonEmptyLines.length > 0) {
    analysis.hasDescription = true;
    analysis.score += 3;
  } else {
    analysis.issues.push('Missing description');
  }
  
  // Check for @param tags
  if (content.includes('@param')) {
    analysis.hasParams = true;
    analysis.score += 2;
  }
  
  // Check for @returns tag
  if (content.includes('@returns') || content.includes('@return')) {
    analysis.hasReturns = true;
    analysis.score += 2;
  }
  
  // Check for @example tag
  if (content.includes('@example')) {
    analysis.hasExample = true;
    analysis.score += 2;
  } else {
    analysis.issues.push('Missing @example tag');
  }
  
  // Check for proper tags based on type
  const requiredTags = config.requiredTags[comment.type] || [];
  const missingTags = requiredTags.filter(tag => !content.includes(tag));
  
  if (missingTags.length === 0) {
    analysis.hasProperTags = true;
    analysis.score += 1;
  } else {
    analysis.issues.push(`Missing required tags: ${missingTags.join(', ')}`);
  }
  
  return analysis;
}

/**
 * Analyzes a single file for JSDoc documentation
 * 
 * @param {string} filePath - Path to the file to analyze
 * @returns {object} File analysis results
 */
function analyzeFile(filePath) {
  const fileResults = {
    path: filePath,
    comments: [],
    functions: 0,
    classes: 0,
    components: 0,
    documented: 0,
    undocumented: 0,
    issues: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const comments = extractJSDocComments(content);
    
    // Count functions, classes, and components
    const functionMatches = content.match(/(export\s+)?(async\s+)?function\s+\w+/g) || [];
    const classMatches = content.match(/(export\s+)?class\s+\w+/g) || [];
    const componentMatches = content.match(/export\s+interface\s+Props/g) || [];
    
    fileResults.functions = functionMatches.length;
    fileResults.classes = classMatches.length;
    fileResults.components = componentMatches.length;
    
    // Analyze each comment
    for (const comment of comments) {
      const analysis = analyzeJSDocQuality(comment);
      
      fileResults.comments.push({
        ...comment,
        analysis
      });
      
      if (analysis.score >= 7) {
        fileResults.documented++;
      } else {
        fileResults.undocumented++;
        fileResults.issues.push({
          type: comment.type,
          name: comment.name,
          issues: analysis.issues,
          score: analysis.score
        });
      }
    }
    
    // Check for undocumented functions/classes
    const totalItems = fileResults.functions + fileResults.classes + fileResults.components;
    const documentedItems = fileResults.comments.length;
    
    if (documentedItems < totalItems) {
      fileResults.issues.push({
        type: 'missing',
        message: `${totalItems - documentedItems} items lack JSDoc comments`
      });
    }
    
  } catch (error) {
    console.warn(`⚠️  Could not analyze ${filePath}: ${error.message}`);
    fileResults.issues.push({
      type: 'error',
      message: error.message
    });
  }
  
  return fileResults;
}

/**
 * Generates recommendations for improving JSDoc documentation
 * 
 * @param {object[]} fileResults - Array of file analysis results
 * @returns {string[]} Array of recommendation strings
 */
function generateRecommendations(fileResults) {
  const recommendations = [];
  
  // Find files with the most issues
  const filesWithIssues = fileResults
    .filter(file => file.issues.length > 0)
    .sort((a, b) => b.issues.length - a.issues.length)
    .slice(0, 5);
  
  if (filesWithIssues.length > 0) {
    recommendations.push('📋 Priority files for JSDoc improvement:');
    filesWithIssues.forEach(file => {
      const relativePath = path.relative(rootDir, file.path);
      recommendations.push(`   • ${relativePath} (${file.issues.length} issues)`);
    });
  }
  
  // Common issues
  const allIssues = fileResults.flatMap(file => file.issues);
  const missingExamples = allIssues.filter(issue => 
    issue.issues && issue.issues.some(i => i.includes('Missing @example'))
  ).length;
  
  if (missingExamples > 0) {
    recommendations.push(`📝 ${missingExamples} functions/components need @example tags`);
  }
  
  // Suggest standardization
  recommendations.push('🔧 Recommended actions:');
  recommendations.push('   • Add @example tags to all public functions');
  recommendations.push('   • Ensure all parameters have @param documentation');
  recommendations.push('   • Add @returns documentation for non-void functions');
  recommendations.push('   • Include @component tag for Astro components');
  recommendations.push('   • Add @fileoverview for module-level documentation');
  
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
  
  // Find all files to analyze
  const allFiles = [];
  for (const dir of config.scanDirs) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      allFiles.push(...findFiles(dirPath, config.extensions));
    }
  }
  
  console.log(`   Found ${allFiles.length} files to analyze\n`);
  
  console.log('2️⃣ Analyzing JSDoc documentation...');
  
  const fileResults = [];
  
  for (const filePath of allFiles) {
    const fileResult = analyzeFile(filePath);
    fileResults.push(fileResult);
    
    results.filesAnalyzed++;
    results.functionsFound += fileResult.functions;
    results.classesFound += fileResult.classes;
    results.componentsFound += fileResult.components;
    results.documented += fileResult.documented;
    results.undocumented += fileResult.undocumented;
    
    if (fileResult.issues.length > 0) {
      results.needsImprovement++;
    }
  }
  
  console.log('3️⃣ Generating recommendations...');
  results.recommendations = generateRecommendations(fileResults);
  
  // Display results
  console.log('\n📊 JSDoc Analysis Results:');
  console.log(`   Files analyzed: ${results.filesAnalyzed}`);
  console.log(`   Functions found: ${results.functionsFound}`);
  console.log(`   Classes found: ${results.classesFound}`);
  console.log(`   Components found: ${results.componentsFound}`);
  console.log(`   Well documented: ${results.documented}`);
  console.log(`   Need improvement: ${results.undocumented}`);
  console.log(`   Files needing work: ${results.needsImprovement}`);
  
  const documentationRate = results.functionsFound > 0 
    ? Math.round((results.documented / (results.documented + results.undocumented)) * 100)
    : 0;
  
  console.log(`   Documentation rate: ${documentationRate}%`);
  
  console.log('\n💡 Recommendations:');
  results.recommendations.forEach(rec => console.log(rec));
  
  console.log('\n📚 Next steps:');
  console.log('   • Review docs/JSDOC_STANDARDS.md for formatting guidelines');
  console.log('   • Focus on high-priority files identified above');
  console.log('   • Add missing @example tags for better developer experience');
  console.log('   • Run "npm run lint" to validate JSDoc formatting');
  
  // Save detailed results
  const reportPath = path.join(rootDir, 'jsdoc-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: results,
    files: fileResults
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: jsdoc-analysis-report.json`);
}

// Run the analysis
main().catch(error => {
  console.error('❌ Analysis failed:', error.message);
  process.exit(1);
});
