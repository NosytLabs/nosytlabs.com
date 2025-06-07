#!/usr/bin/env node

/**
 * Comprehensive Test Runner for NosytLabs
 * 
 * @fileoverview Runs all test suites including unit tests, integration tests,
 * performance benchmarks, and end-to-end tests with comprehensive reporting.
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

console.log('🧪 NosytLabs Comprehensive Test Suite\n');

/**
 * Test configuration
 */
const TEST_CONFIG = {
  // Test suites to run
  suites: {
    unit: {
      name: 'Unit Tests',
      command: 'npm run test:unit',
      description: 'Vitest unit tests for utilities and components',
      required: true
    },
    performance: {
      name: 'Performance Benchmarks',
      command: 'npm run test:performance',
      description: 'Performance regression tests and benchmarks',
      required: false
    },
    e2e: {
      name: 'End-to-End Tests',
      command: 'npm run test',
      description: 'Playwright browser tests for UI and functionality',
      required: true
    },
    coverage: {
      name: 'Coverage Report',
      command: 'npm run test:unit:coverage',
      description: 'Generate code coverage report',
      required: false
    }
  },
  
  // Output configuration
  output: {
    directory: './test-results',
    timestamp: new Date().toISOString().replace(/[:.]/g, '-'),
    formats: ['json', 'html', 'console']
  },
  
  // Thresholds
  thresholds: {
    coverage: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    },
    performance: {
      maxRegressionPercent: 20
    }
  }
};

/**
 * Test results tracking
 */
const testResults = {
  suites: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0
  },
  coverage: null,
  performance: null,
  startTime: Date.now(),
  endTime: null
};

/**
 * Utility functions
 */
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Create output directory
 */
function createOutputDirectory() {
  const outputDir = path.join(rootDir, TEST_CONFIG.output.directory);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  return outputDir;
}

/**
 * Check if development server is running
 */
function checkDevServer() {
  try {
    execSync('curl -f http://localhost:3000 > /dev/null 2>&1', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Start development server if needed
 */
function startDevServer() {
  if (checkDevServer()) {
    log('✅ Development server is already running', 'green');
    return true;
  }
  
  log('🚀 Starting development server...', 'blue');
  
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
      if (checkDevServer()) {
        log('✅ Development server started successfully', 'green');
        return true;
      }
      
      attempts++;
      log(`   Waiting for server... (${attempts}/${maxAttempts})`, 'yellow');
      
      // Wait 2 seconds before next attempt
      execSync('sleep 2', { stdio: 'pipe' });
    }
    
    log('❌ Failed to start development server', 'red');
    return false;
  } catch (error) {
    log(`❌ Error starting development server: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Run a test suite
 */
function runTestSuite(suiteKey, suite) {
  logSection(`🧪 Running ${suite.name}`);
  log(suite.description, 'blue');
  
  const startTime = Date.now();
  
  try {
    log(`\nExecuting: ${suite.command}`, 'cyan');
    
    const output = execSync(suite.command, {
      cwd: rootDir,
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    const duration = Date.now() - startTime;
    
    testResults.suites[suiteKey] = {
      name: suite.name,
      status: 'passed',
      duration,
      output: output || 'Test completed successfully'
    };
    
    log(`✅ ${suite.name} completed successfully in ${formatDuration(duration)}`, 'green');
    testResults.summary.passed++;
    
    return true;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    testResults.suites[suiteKey] = {
      name: suite.name,
      status: 'failed',
      duration,
      error: error.message,
      output: error.stdout || error.stderr || 'Test failed'
    };
    
    log(`❌ ${suite.name} failed after ${formatDuration(duration)}`, 'red');
    log(`Error: ${error.message}`, 'red');
    testResults.summary.failed++;
    
    return false;
  }
}

/**
 * Parse coverage results
 */
function parseCoverageResults() {
  try {
    const coveragePath = path.join(rootDir, 'test-results/coverage/coverage-summary.json');
    
    if (fs.existsSync(coveragePath)) {
      const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      testResults.coverage = coverage.total;
      
      log('\n📊 Coverage Summary:', 'cyan');
      log(`   Statements: ${coverage.total.statements.pct}%`, 'blue');
      log(`   Branches: ${coverage.total.branches.pct}%`, 'blue');
      log(`   Functions: ${coverage.total.functions.pct}%`, 'blue');
      log(`   Lines: ${coverage.total.lines.pct}%`, 'blue');
      
      // Check coverage thresholds
      const thresholds = TEST_CONFIG.thresholds.coverage;
      const failed = [];
      
      if (coverage.total.statements.pct < thresholds.statements) {
        failed.push(`Statements: ${coverage.total.statements.pct}% < ${thresholds.statements}%`);
      }
      if (coverage.total.branches.pct < thresholds.branches) {
        failed.push(`Branches: ${coverage.total.branches.pct}% < ${thresholds.branches}%`);
      }
      if (coverage.total.functions.pct < thresholds.functions) {
        failed.push(`Functions: ${coverage.total.functions.pct}% < ${thresholds.functions}%`);
      }
      if (coverage.total.lines.pct < thresholds.lines) {
        failed.push(`Lines: ${coverage.total.lines.pct}% < ${thresholds.lines}%`);
      }
      
      if (failed.length > 0) {
        log('\n⚠️  Coverage thresholds not met:', 'yellow');
        failed.forEach(failure => log(`   ${failure}`, 'yellow'));
      } else {
        log('\n✅ All coverage thresholds met', 'green');
      }
    }
  } catch (error) {
    log(`⚠️  Could not parse coverage results: ${error.message}`, 'yellow');
  }
}

/**
 * Generate comprehensive report
 */
function generateReport() {
  testResults.endTime = Date.now();
  testResults.summary.duration = testResults.endTime - testResults.startTime;
  testResults.summary.total = testResults.summary.passed + testResults.summary.failed + testResults.summary.skipped;
  
  logSection('📋 Test Results Summary');
  
  log(`📊 Overall Results:`, 'cyan');
  log(`   Total Suites: ${testResults.summary.total}`, 'blue');
  log(`   Passed: ${testResults.summary.passed}`, 'green');
  log(`   Failed: ${testResults.summary.failed}`, testResults.summary.failed > 0 ? 'red' : 'blue');
  log(`   Skipped: ${testResults.summary.skipped}`, 'yellow');
  log(`   Duration: ${formatDuration(testResults.summary.duration)}`, 'blue');
  
  // Suite details
  log(`\n📝 Suite Details:`, 'cyan');
  Object.entries(testResults.suites).forEach(([key, suite]) => {
    const statusColor = suite.status === 'passed' ? 'green' : 'red';
    log(`   ${suite.name}: ${suite.status.toUpperCase()} (${formatDuration(suite.duration)})`, statusColor);
  });
  
  // Parse coverage if available
  parseCoverageResults();
  
  // Success/failure summary
  const success = testResults.summary.failed === 0;
  log(`\n🎯 Final Result: ${success ? 'SUCCESS' : 'FAILURE'}`, success ? 'green' : 'red');
  
  if (!success) {
    log('\n💡 Next Steps:', 'yellow');
    log('   1. Review failed test output above', 'yellow');
    log('   2. Fix failing tests and re-run', 'yellow');
    log('   3. Check coverage thresholds if applicable', 'yellow');
  } else {
    log('\n🎉 All tests passed successfully!', 'green');
    log('💡 Consider running performance benchmarks for optimization insights', 'blue');
  }
  
  // Save detailed results
  const outputDir = createOutputDirectory();
  const resultsFile = path.join(outputDir, `test-results-${TEST_CONFIG.output.timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(testResults, null, 2));
  log(`\n💾 Detailed results saved to: ${resultsFile}`, 'blue');
  
  return success;
}

/**
 * Main execution function
 */
async function main() {
  log('🚀 Starting comprehensive test suite...', 'cyan');
  
  // Create output directory
  createOutputDirectory();
  
  // Check if dev server is needed for E2E tests
  const needsDevServer = TEST_CONFIG.suites.e2e && !process.env.CI;
  
  if (needsDevServer && !startDevServer()) {
    log('❌ Cannot run E2E tests without development server', 'red');
    process.exit(1);
  }
  
  // Run test suites
  for (const [suiteKey, suite] of Object.entries(TEST_CONFIG.suites)) {
    testResults.summary.total++;
    
    if (suite.required || process.env.RUN_ALL_TESTS) {
      const success = runTestSuite(suiteKey, suite);
      
      // Stop on critical failures unless in CI
      if (!success && suite.required && !process.env.CI) {
        log('\n⚠️  Critical test suite failed. Stopping execution.', 'yellow');
        log('💡 Use RUN_ALL_TESTS=true to continue despite failures', 'blue');
        break;
      }
    } else {
      log(`⏭️  Skipping ${suite.name} (not required)`, 'yellow');
      testResults.summary.skipped++;
    }
  }
  
  // Generate final report
  const success = generateReport();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    log(`❌ Test runner failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

export { main as runAllTests, TEST_CONFIG, testResults };
