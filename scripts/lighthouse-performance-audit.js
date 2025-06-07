#!/usr/bin/env node

/**
 * Lighthouse Performance Audit Script for NosytLabs
 * 
 * @fileoverview Comprehensive performance auditing using Lighthouse to achieve
 * 95+ scores across all metrics with detailed reporting and optimization suggestions.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 NosytLabs Lighthouse Performance Audit\n');

/**
 * Performance audit configuration
 */
const AUDIT_CONFIG = {
  // Target URLs to audit
  urls: [
    'http://localhost:3000/',
    'http://localhost:3000/services',
    'http://localhost:3000/projects',
    'http://localhost:3000/blog',
    'http://localhost:3000/contact',
    'http://localhost:3000/nosytos95'
  ],
  
  // Performance targets
  targets: {
    performance: 95,
    accessibility: 95,
    bestPractices: 95,
    seo: 95,
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    tti: 3500
  },
  
  // Lighthouse options
  lighthouse: {
    preset: 'desktop',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    skipAudits: ['screenshot-thumbnails', 'final-screenshot'],
    budgetPath: './performance-budget.json'
  },
  
  // Output configuration
  output: {
    format: ['json', 'html'],
    outputPath: './lighthouse-reports',
    timestamp: new Date().toISOString().replace(/[:.]/g, '-')
  }
};

/**
 * Results tracking
 */
const auditResults = {
  totalPages: 0,
  passedPages: 0,
  failedPages: 0,
  averageScores: {
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0
  },
  issues: [],
  recommendations: [],
  detailedResults: []
};

/**
 * Check if Lighthouse is installed
 */
function checkLighthouseInstallation() {
  try {
    execSync('lighthouse --version', { stdio: 'pipe' });
    console.log('✅ Lighthouse is installed\n');
    return true;
  } catch (error) {
    console.log('❌ Lighthouse is not installed');
    console.log('💡 Install with: npm install -g lighthouse\n');
    return false;
  }
}

/**
 * Start development server
 */
function startDevServer() {
  console.log('🔧 Starting development server...');
  
  try {
    // Check if server is already running
    execSync('curl -f http://localhost:3000 > /dev/null 2>&1', { stdio: 'pipe' });
    console.log('✅ Development server is already running\n');
    return true;
  } catch (error) {
    console.log('🚀 Starting new development server...');
    
    try {
      // Start server in background
      execSync('npm run dev > /dev/null 2>&1 &', { 
        cwd: rootDir,
        stdio: 'pipe'
      });
      
      // Wait for server to start
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        try {
          execSync('curl -f http://localhost:3000 > /dev/null 2>&1', { stdio: 'pipe' });
          console.log('✅ Development server started successfully\n');
          return true;
        } catch (e) {
          attempts++;
          console.log(`   Waiting for server... (${attempts}/${maxAttempts})`);
          
          // Wait 2 seconds before next attempt
          execSync('sleep 2', { stdio: 'pipe' });
        }
      }
      
      console.log('❌ Failed to start development server\n');
      return false;
    } catch (startError) {
      console.log('❌ Error starting development server:', startError.message);
      return false;
    }
  }
}

/**
 * Create output directory
 */
function createOutputDirectory() {
  const outputDir = path.join(rootDir, AUDIT_CONFIG.output.outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  return outputDir;
}

/**
 * Run Lighthouse audit for a single URL
 */
function runLighthouseAudit(url, outputDir) {
  console.log(`🔍 Auditing: ${url}`);
  
  try {
    const urlPath = new URL(url).pathname.replace(/\//g, '_') || 'home';
    const timestamp = AUDIT_CONFIG.output.timestamp;
    const outputFile = path.join(outputDir, `lighthouse-${urlPath}-${timestamp}`);
    
    // Build Lighthouse command
    const lighthouseCmd = [
      'lighthouse',
      url,
      `--output=${AUDIT_CONFIG.output.format.join(',')}`,
      `--output-path=${outputFile}`,
      `--preset=${AUDIT_CONFIG.lighthouse.preset}`,
      `--only-categories=${AUDIT_CONFIG.lighthouse.onlyCategories.join(',')}`,
      `--skip-audits=${AUDIT_CONFIG.lighthouse.skipAudits.join(',')}`,
      '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"',
      '--quiet'
    ].join(' ');
    
    // Run Lighthouse
    execSync(lighthouseCmd, { 
      cwd: rootDir,
      stdio: 'pipe'
    });
    
    // Read and parse results
    const jsonFile = `${outputFile}.report.json`;
    if (fs.existsSync(jsonFile)) {
      const results = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
      return parseResults(url, results);
    } else {
      throw new Error('Lighthouse report not generated');
    }
    
  } catch (error) {
    console.log(`   ❌ Audit failed: ${error.message}`);
    auditResults.issues.push(`Audit failed for ${url}: ${error.message}`);
    return null;
  }
}

/**
 * Parse Lighthouse results
 */
function parseResults(url, results) {
  const categories = results.categories;
  const audits = results.audits;
  
  const scores = {
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility.score * 100),
    bestPractices: Math.round(categories['best-practices'].score * 100),
    seo: Math.round(categories.seo.score * 100)
  };
  
  const metrics = {
    fcp: audits['first-contentful-paint']?.numericValue || 0,
    lcp: audits['largest-contentful-paint']?.numericValue || 0,
    fid: audits['first-input-delay']?.numericValue || 0,
    cls: audits['cumulative-layout-shift']?.numericValue || 0,
    tti: audits['interactive']?.numericValue || 0,
    tbt: audits['total-blocking-time']?.numericValue || 0,
    si: audits['speed-index']?.numericValue || 0
  };
  
  // Check if targets are met
  const passed = 
    scores.performance >= AUDIT_CONFIG.targets.performance &&
    scores.accessibility >= AUDIT_CONFIG.targets.accessibility &&
    scores.bestPractices >= AUDIT_CONFIG.targets.bestPractices &&
    scores.seo >= AUDIT_CONFIG.targets.seo &&
    metrics.fcp <= AUDIT_CONFIG.targets.fcp &&
    metrics.lcp <= AUDIT_CONFIG.targets.lcp &&
    metrics.cls <= AUDIT_CONFIG.targets.cls &&
    metrics.tti <= AUDIT_CONFIG.targets.tti;
  
  const result = {
    url,
    passed,
    scores,
    metrics,
    issues: [],
    recommendations: []
  };
  
  // Analyze issues and recommendations
  analyzePerformanceIssues(result, audits);
  
  // Log results
  console.log(`   📊 Performance: ${scores.performance}% (target: ${AUDIT_CONFIG.targets.performance}%)`);
  console.log(`   ♿ Accessibility: ${scores.accessibility}% (target: ${AUDIT_CONFIG.targets.accessibility}%)`);
  console.log(`   ✅ Best Practices: ${scores.bestPractices}% (target: ${AUDIT_CONFIG.targets.bestPractices}%)`);
  console.log(`   🔍 SEO: ${scores.seo}% (target: ${AUDIT_CONFIG.targets.seo}%)`);
  console.log(`   ⚡ FCP: ${Math.round(metrics.fcp)}ms (target: ${AUDIT_CONFIG.targets.fcp}ms)`);
  console.log(`   🎯 LCP: ${Math.round(metrics.lcp)}ms (target: ${AUDIT_CONFIG.targets.lcp}ms)`);
  console.log(`   📱 CLS: ${metrics.cls.toFixed(3)} (target: ${AUDIT_CONFIG.targets.cls})`);
  console.log(`   🚀 TTI: ${Math.round(metrics.tti)}ms (target: ${AUDIT_CONFIG.targets.tti}ms)`);
  console.log(`   ${passed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
  return result;
}

/**
 * Analyze performance issues and generate recommendations
 */
function analyzePerformanceIssues(result, audits) {
  // Check for common performance issues
  const issues = [
    {
      audit: 'render-blocking-resources',
      message: 'Render-blocking resources detected',
      recommendation: 'Inline critical CSS and defer non-critical resources'
    },
    {
      audit: 'unused-css-rules',
      message: 'Unused CSS detected',
      recommendation: 'Remove unused CSS rules to reduce bundle size'
    },
    {
      audit: 'unused-javascript',
      message: 'Unused JavaScript detected',
      recommendation: 'Remove unused JavaScript code'
    },
    {
      audit: 'unminified-css',
      message: 'Unminified CSS detected',
      recommendation: 'Minify CSS files for production'
    },
    {
      audit: 'unminified-javascript',
      message: 'Unminified JavaScript detected',
      recommendation: 'Minify JavaScript files for production'
    },
    {
      audit: 'uses-optimized-images',
      message: 'Unoptimized images detected',
      recommendation: 'Use modern image formats (WebP, AVIF) and optimize images'
    },
    {
      audit: 'modern-image-formats',
      message: 'Legacy image formats detected',
      recommendation: 'Serve images in modern formats (WebP, AVIF)'
    },
    {
      audit: 'uses-text-compression',
      message: 'Text compression not enabled',
      recommendation: 'Enable Gzip or Brotli compression'
    },
    {
      audit: 'font-display',
      message: 'Font loading not optimized',
      recommendation: 'Use font-display: swap for better loading performance'
    }
  ];
  
  issues.forEach(issue => {
    const audit = audits[issue.audit];
    if (audit && audit.score !== null && audit.score < 1) {
      result.issues.push(issue.message);
      result.recommendations.push(issue.recommendation);
    }
  });
}

/**
 * Generate comprehensive report
 */
function generateReport() {
  console.log('📋 Performance Audit Report');
  console.log('===========================\n');
  
  console.log('📊 **Summary**');
  console.log(`   • Total pages audited: ${auditResults.totalPages}`);
  console.log(`   • Pages passed: ${auditResults.passedPages}`);
  console.log(`   • Pages failed: ${auditResults.failedPages}`);
  console.log(`   • Success rate: ${Math.round((auditResults.passedPages / auditResults.totalPages) * 100)}%\n`);
  
  if (auditResults.totalPages > 0) {
    console.log('📈 **Average Scores**');
    console.log(`   • Performance: ${Math.round(auditResults.averageScores.performance)}%`);
    console.log(`   • Accessibility: ${Math.round(auditResults.averageScores.accessibility)}%`);
    console.log(`   • Best Practices: ${Math.round(auditResults.averageScores.bestPractices)}%`);
    console.log(`   • SEO: ${Math.round(auditResults.averageScores.seo)}%\n`);
  }
  
  if (auditResults.issues.length > 0) {
    console.log('❌ **Issues Found**');
    [...new Set(auditResults.issues)].forEach(issue => {
      console.log(`   • ${issue}`);
    });
    console.log('');
  }
  
  if (auditResults.recommendations.length > 0) {
    console.log('💡 **Recommendations**');
    [...new Set(auditResults.recommendations)].forEach(rec => {
      console.log(`   • ${rec}`);
    });
    console.log('');
  }
  
  console.log('🎯 **Next Steps**');
  if (auditResults.passedPages === auditResults.totalPages) {
    console.log('   🎉 All pages meet performance targets!');
    console.log('   • Monitor performance regularly');
    console.log('   • Set up automated performance testing');
    console.log('   • Consider further optimizations for edge cases');
  } else {
    console.log('   • Address performance issues identified above');
    console.log('   • Re-run audit after implementing fixes');
    console.log('   • Focus on critical path optimizations');
    console.log('   • Consider implementing performance monitoring');
  }
  console.log('');
  
  console.log('📚 **Resources**');
  console.log('   • Web Vitals: https://web.dev/vitals/');
  console.log('   • Lighthouse: https://developers.google.com/web/tools/lighthouse');
  console.log('   • Performance Budget: ./performance-budget.json\n');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting comprehensive performance audit...\n');
  
  // Check prerequisites
  if (!checkLighthouseInstallation()) {
    process.exit(1);
  }
  
  if (!startDevServer()) {
    process.exit(1);
  }
  
  // Create output directory
  const outputDir = createOutputDirectory();
  console.log(`📁 Reports will be saved to: ${outputDir}\n`);
  
  // Run audits for each URL
  for (const url of AUDIT_CONFIG.urls) {
    const result = runLighthouseAudit(url, outputDir);
    
    if (result) {
      auditResults.totalPages++;
      auditResults.detailedResults.push(result);
      
      if (result.passed) {
        auditResults.passedPages++;
      } else {
        auditResults.failedPages++;
      }
      
      // Update average scores
      auditResults.averageScores.performance += result.scores.performance;
      auditResults.averageScores.accessibility += result.scores.accessibility;
      auditResults.averageScores.bestPractices += result.scores.bestPractices;
      auditResults.averageScores.seo += result.scores.seo;
      
      // Collect issues and recommendations
      auditResults.issues.push(...result.issues);
      auditResults.recommendations.push(...result.recommendations);
    }
  }
  
  // Calculate averages
  if (auditResults.totalPages > 0) {
    auditResults.averageScores.performance /= auditResults.totalPages;
    auditResults.averageScores.accessibility /= auditResults.totalPages;
    auditResults.averageScores.bestPractices /= auditResults.totalPages;
    auditResults.averageScores.seo /= auditResults.totalPages;
  }
  
  // Generate report
  generateReport();
  
  // Save detailed results
  const resultsFile = path.join(outputDir, `audit-results-${AUDIT_CONFIG.output.timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(auditResults, null, 2));
  console.log(`💾 Detailed results saved to: ${resultsFile}\n`);
  
  // Exit with appropriate code
  const success = auditResults.passedPages === auditResults.totalPages;
  console.log(success ? '🎉 All performance targets met!' : '⚠️  Some performance targets not met');
  process.exit(success ? 0 : 1);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Performance audit failed:', error);
    process.exit(1);
  });
}

export { main as runPerformanceAudit, AUDIT_CONFIG, auditResults };
