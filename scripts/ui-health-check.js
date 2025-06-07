#!/usr/bin/env node

/**
 * UI Health Check - Quick validation of UI alignment and accessibility
 * Run this script to get a fast overview of the site's UI status
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  const border = '='.repeat(50);
  log(`\n${border}`, 'cyan');
  log(`${message}`, 'bright');
  log(`${border}`, 'cyan');
}

function logSection(message) {
  log(`\n${'─'.repeat(30)}`, 'blue');
  log(`${message}`, 'blue');
  log(`${'─'.repeat(30)}`, 'blue');
}

async function checkBuildStatus() {
  logSection('🔍 Checking Build Status');
  
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(distPath)) {
    log('❌ Build directory not found', 'red');
    log('   Run: npm run build', 'yellow');
    return false;
  }
  
  if (!fs.existsSync(indexPath)) {
    log('❌ index.html not found in build', 'red');
    log('   Run: npm run build', 'yellow');
    return false;
  }
  
  const stats = fs.statSync(indexPath);
  const buildAge = (Date.now() - stats.mtime.getTime()) / (1000 * 60); // minutes
  
  log(`✅ Build found (${Math.round(buildAge)} minutes old)`, 'green');
  
  if (buildAge > 60) {
    log('⚠️ Build is older than 1 hour, consider rebuilding', 'yellow');
  }
  
  return true;
}

async function runQuickTests() {
  logSection('🧪 Running Quick UI Tests');
  
  try {
    log('Running static UI analysis...', 'blue');
    
    const result = execSync(
      'npx playwright test tests/static-ui-analysis.spec.js --project=chromium --reporter=list --grep="Generate comprehensive report"',
      { encoding: 'utf8', stdio: 'pipe' }
    );
    
    log('✅ Quick tests completed successfully', 'green');
    
    // Extract key metrics from output
    const lines = result.split('\n');
    const metricsLines = lines.filter(line => line.includes('•'));
    
    if (metricsLines.length > 0) {
      log('\n📊 Key Metrics:', 'bright');
      metricsLines.forEach(line => {
        const cleanLine = line.trim();
        if (cleanLine.includes('Images without alt: 0') || 
            cleanLine.includes('Inputs without labels: 0') ||
            cleanLine.includes('Has skip links: true')) {
          log(`   ${cleanLine}`, 'green');
        } else {
          log(`   ${cleanLine}`, 'blue');
        }
      });
    }
    
    return true;
    
  } catch (error) {
    log('❌ Quick tests failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function checkTestResults() {
  logSection('📊 Checking Test Results');
  
  const resultsPath = path.join(process.cwd(), 'test-results', 'ui-analysis-report.json');
  
  if (!fs.existsSync(resultsPath)) {
    log('⚠️ No recent test results found', 'yellow');
    log('   Run: npm run test or node scripts/run-comprehensive-tests.js', 'yellow');
    return false;
  }
  
  try {
    const report = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const reportAge = (Date.now() - new Date(report.timestamp).getTime()) / (1000 * 60); // minutes
    
    log(`✅ Test report found (${Math.round(reportAge)} minutes old)`, 'green');
    
    // Analyze results
    const { structure, accessibility, performance } = report;
    
    log('\n🏗️ Structure Analysis:', 'bright');
    log(`   • Total Elements: ${structure.totalElements}`, 'blue');
    log(`   • Sections: ${structure.totalSections}`, 'blue');
    log(`   • Images: ${structure.totalImages}`, 'blue');
    log(`   • Buttons: ${structure.totalButtons}`, 'blue');
    log(`   • Forms: ${structure.totalForms}`, 'blue');
    
    log('\n♿ Accessibility Status:', 'bright');
    if (accessibility.imagesWithoutAlt === 0) {
      log(`   ✅ All images have alt text`, 'green');
    } else {
      log(`   ❌ ${accessibility.imagesWithoutAlt} images missing alt text`, 'red');
    }
    
    if (accessibility.inputsWithoutLabels === 0) {
      log(`   ✅ All inputs have labels`, 'green');
    } else {
      log(`   ❌ ${accessibility.inputsWithoutLabels} inputs missing labels`, 'red');
    }
    
    if (accessibility.hasSkipLinks) {
      log(`   ✅ Skip links implemented`, 'green');
    } else {
      log(`   ❌ Skip links missing`, 'red');
    }
    
    log('\n⚡ Performance Overview:', 'bright');
    log(`   • Stylesheets: ${performance.totalStylesheets}`, 'blue');
    log(`   • Scripts: ${performance.totalScripts}`, 'blue');
    log(`   • External Resources: ${performance.totalExternalResources}`, 'blue');
    
    // Overall health score
    let score = 100;
    if (accessibility.imagesWithoutAlt > 0) score -= 20;
    if (accessibility.inputsWithoutLabels > 0) score -= 20;
    if (!accessibility.hasSkipLinks) score -= 10;
    if (performance.totalStylesheets > 15) score -= 10;
    if (performance.totalScripts > 10) score -= 10;
    
    log(`\n🎯 Overall UI Health Score: ${score}/100`, score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red');
    
    return true;
    
  } catch (error) {
    log('❌ Failed to read test results', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

async function checkScreenshots() {
  logSection('📸 Checking Screenshots');
  
  const screenshotPaths = [
    'test-results/index-page-analysis.png',
    'test-results/responsive-mobile.png',
    'test-results/responsive-tablet.png',
    'test-results/responsive-desktop.png'
  ];
  
  let foundScreenshots = 0;
  
  screenshotPaths.forEach(screenshotPath => {
    const fullPath = path.join(process.cwd(), screenshotPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const age = (Date.now() - stats.mtime.getTime()) / (1000 * 60); // minutes
      log(`   ✅ ${path.basename(screenshotPath)} (${Math.round(age)}m old)`, 'green');
      foundScreenshots++;
    } else {
      log(`   ❌ ${path.basename(screenshotPath)} missing`, 'red');
    }
  });
  
  if (foundScreenshots === 0) {
    log('⚠️ No screenshots found. Run tests to generate visual evidence.', 'yellow');
    return false;
  } else if (foundScreenshots < screenshotPaths.length) {
    log(`⚠️ Only ${foundScreenshots}/${screenshotPaths.length} screenshots found`, 'yellow');
    return true;
  } else {
    log(`✅ All ${foundScreenshots} screenshots available`, 'green');
    return true;
  }
}

async function generateQuickReport() {
  logSection('📋 Quick Actions');
  
  log('Available commands:', 'bright');
  log('   npm run build              - Build the site', 'blue');
  log('   npm run dev                - Start development server', 'blue');
  log('   npm run preview            - Preview built site', 'blue');
  log('   npm run test               - Run all tests', 'blue');
  log('   npm run fix-css            - Fix CSS issues', 'blue');
  log('', 'reset');
  log('Test commands:', 'bright');
  log('   node scripts/run-comprehensive-tests.js  - Full test suite', 'blue');
  log('   npx playwright test --headed              - Visual test run', 'blue');
  log('   npx playwright show-report               - View test reports', 'blue');
  log('', 'reset');
  log('Generated files:', 'bright');
  log('   UI-ALIGNMENT-REPORT.md     - Comprehensive report', 'blue');
  log('   test-results/              - Test artifacts', 'blue');
  log('   playwright.config.js       - Test configuration', 'blue');
}

async function main() {
  logHeader('🎨 NosytLabs UI Health Check');
  
  const startTime = Date.now();
  
  try {
    // Run all checks
    const buildOk = await checkBuildStatus();
    const testsOk = await runQuickTests();
    const resultsOk = await checkTestResults();
    const screenshotsOk = await checkScreenshots();
    
    // Generate summary
    logHeader('📊 Health Check Summary');
    
    const checks = [
      { name: 'Build Status', status: buildOk },
      { name: 'Quick Tests', status: testsOk },
      { name: 'Test Results', status: resultsOk },
      { name: 'Screenshots', status: screenshotsOk }
    ];
    
    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      const color = check.status ? 'green' : 'red';
      log(`   ${icon} ${check.name}`, color);
    });
    
    const passedChecks = checks.filter(c => c.status).length;
    const totalChecks = checks.length;
    
    log(`\n🎯 Overall Status: ${passedChecks}/${totalChecks} checks passed`, 
        passedChecks === totalChecks ? 'green' : passedChecks >= totalChecks * 0.75 ? 'yellow' : 'red');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`⏱️ Health check completed in ${duration} seconds`, 'blue');
    
    await generateQuickReport();
    
    // Exit with appropriate code
    process.exit(passedChecks === totalChecks ? 0 : 1);
    
  } catch (error) {
    log(`💥 Health check failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Health check interrupted by user', 'yellow');
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
