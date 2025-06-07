#!/usr/bin/env node

/**
 * Comprehensive Test Runner for NosytLabs UI/UX Testing
 * Runs all Playwright tests and generates detailed reports
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  const border = '='.repeat(60);
  log(`\n${border}`, 'cyan');
  log(`${message}`, 'bright');
  log(`${border}`, 'cyan');
}

function logSection(message) {
  log(`\n${'─'.repeat(40)}`, 'blue');
  log(`${message}`, 'blue');
  log(`${'─'.repeat(40)}`, 'blue');
}

async function checkPrerequisites() {
  logSection('🔍 Checking Prerequisites');
  
  try {
    // Check if Playwright is installed
    execSync('npx playwright --version', { stdio: 'pipe' });
    log('✅ Playwright is installed', 'green');
  } catch (error) {
    log('❌ Playwright not found. Installing...', 'red');
    try {
      execSync('npm install @playwright/test', { stdio: 'inherit' });
      log('✅ Playwright installed successfully', 'green');
    } catch (installError) {
      log('❌ Failed to install Playwright', 'red');
      process.exit(1);
    }
  }
  
  // Check if browsers are installed
  try {
    execSync('npx playwright install', { stdio: 'inherit' });
    log('✅ Playwright browsers are ready', 'green');
  } catch (error) {
    log('⚠️ Browser installation may have issues', 'yellow');
  }
  
  // Check if development server can start
  try {
    log('🔍 Checking if port 3000 is available...', 'blue');
    const { exec } = await import('child_process');
    exec('netstat -an | findstr :3000', (error, stdout) => {
      if (stdout) {
        log('⚠️ Port 3000 is in use. Tests will attempt to use existing server.', 'yellow');
      } else {
        log('✅ Port 3000 is available', 'green');
      }
    });
  } catch (error) {
    log('⚠️ Could not check port availability', 'yellow');
  }
}

async function runTestSuite(suiteName, testFile, options = {}) {
  logSection(`🧪 Running ${suiteName} Tests`);
  
  try {
    const command = [
      'npx', 'playwright', 'test',
      testFile,
      '--reporter=list',
      '--reporter=html',
      '--reporter=json',
      ...(options.headed ? ['--headed'] : []),
      ...(options.debug ? ['--debug'] : []),
      ...(options.project ? [`--project=${options.project}`] : [])
    ];
    
    log(`Running: ${command.join(' ')}`, 'blue');
    
    const result = execSync(command.join(' '), { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    log(`✅ ${suiteName} tests completed successfully`, 'green');
    return { success: true, suite: suiteName };
    
  } catch (error) {
    log(`❌ ${suiteName} tests failed`, 'red');
    log(`Error: ${error.message}`, 'red');
    return { success: false, suite: suiteName, error: error.message };
  }
}

async function generateSummaryReport(results) {
  logSection('📊 Generating Summary Report');
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  
  const summary = {
    timestamp: new Date().toISOString(),
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    passRate: ((passedTests / totalTests) * 100).toFixed(1),
    results: results
  };
  
  // Create test-results directory if it doesn't exist
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Write summary to file
  const summaryPath = path.join(resultsDir, 'test-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  
  // Generate HTML summary
  const htmlSummary = `
<!DOCTYPE html>
<html>
<head>
    <title>NosytLabs Test Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .total { color: #007bff; }
        .pass-rate { color: #17a2b8; }
        .results { margin-top: 20px; }
        .result-item { padding: 10px; margin: 5px 0; border-radius: 5px; }
        .result-success { background: #d4edda; border-left: 4px solid #28a745; }
        .result-failure { background: #f8d7da; border-left: 4px solid #dc3545; }
        .timestamp { text-align: center; color: #6c757d; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 NosytLabs UI/UX Test Summary</h1>
            <p>Comprehensive testing results for alignment, responsiveness, and functionality</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value total">${summary.total}</div>
                <div>Total Test Suites</div>
            </div>
            <div class="stat-card">
                <div class="stat-value passed">${summary.passed}</div>
                <div>Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value failed">${summary.failed}</div>
                <div>Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value pass-rate">${summary.passRate}%</div>
                <div>Pass Rate</div>
            </div>
        </div>
        
        <div class="results">
            <h2>Test Suite Results</h2>
            ${results.map(result => `
                <div class="result-item ${result.success ? 'result-success' : 'result-failure'}">
                    <strong>${result.success ? '✅' : '❌'} ${result.suite}</strong>
                    ${result.error ? `<br><small>Error: ${result.error}</small>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            Generated on ${new Date(summary.timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  
  const htmlPath = path.join(resultsDir, 'test-summary.html');
  fs.writeFileSync(htmlPath, htmlSummary);
  
  log(`📄 Summary report saved to: ${summaryPath}`, 'green');
  log(`🌐 HTML report saved to: ${htmlPath}`, 'green');
  
  return summary;
}

async function main() {
  logHeader('🚀 NosytLabs Comprehensive UI/UX Testing Suite');
  
  const startTime = Date.now();
  
  try {
    // Check prerequisites
    await checkPrerequisites();
    
    // Define test suites
    const testSuites = [
      {
        name: 'UI Components & Alignment',
        file: 'tests/ui-components.spec.js',
        description: 'Tests component alignment, positioning, and visual consistency'
      },
      {
        name: 'Responsive Design',
        file: 'tests/responsive.spec.js',
        description: 'Tests layout behavior across different screen sizes'
      },
      {
        name: 'Accessibility & Missing Elements',
        file: 'tests/accessibility-and-missing-elements.spec.js',
        description: 'Scans for accessibility issues and missing content'
      },
      {
        name: 'Browser Compatibility',
        file: 'tests/browser-compatibility.spec.js',
        description: 'Tests cross-browser functionality and feature support'
      },
      {
        name: 'Resource Loading & Performance',
        file: 'tests/resource-loading.spec.js',
        description: 'Tests page load performance and resource optimization'
      }
    ];
    
    log(`\n📋 Test Plan: ${testSuites.length} test suites to run`, 'bright');
    testSuites.forEach((suite, index) => {
      log(`   ${index + 1}. ${suite.name} - ${suite.description}`, 'blue');
    });
    
    // Run all test suites
    const results = [];
    
    for (const suite of testSuites) {
      const result = await runTestSuite(suite.name, suite.file);
      results.push(result);
      
      // Small delay between test suites
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Generate summary report
    const summary = await generateSummaryReport(results);
    
    // Final results
    logHeader('🎯 Final Results');
    
    if (summary.failed === 0) {
      log(`🎉 All ${summary.total} test suites passed! (${summary.passRate}%)`, 'green');
    } else {
      log(`⚠️ ${summary.failed} out of ${summary.total} test suites failed (${summary.passRate}% pass rate)`, 'yellow');
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`⏱️ Total execution time: ${duration} seconds`, 'blue');
    
    log('\n📁 Test artifacts available in:', 'bright');
    log('   • test-results/html-report/ - Detailed HTML reports', 'blue');
    log('   • test-results/test-summary.html - Summary report', 'blue');
    log('   • test-results/test-summary.json - JSON results', 'blue');
    
    // Exit with appropriate code
    process.exit(summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    log(`💥 Test runner failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Test execution interrupted by user', 'yellow');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`💥 Uncaught exception: ${error.message}`, 'red');
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
