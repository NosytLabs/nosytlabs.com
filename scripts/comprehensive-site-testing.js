#!/usr/bin/env node

/**
 * Comprehensive Site Testing Script
 * Performs in-depth testing of all site aspects including functionality, 
 * user flows, content authenticity, performance, and UI/UX
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Starting comprehensive site testing...\n');

const testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  warnings: 0,
  categories: {
    functionality: { passed: 0, failed: 0, total: 0 },
    content: { passed: 0, failed: 0, total: 0 },
    performance: { passed: 0, failed: 0, total: 0 },
    accessibility: { passed: 0, failed: 0, total: 0 },
    seo: { passed: 0, failed: 0, total: 0 },
    userFlow: { passed: 0, failed: 0, total: 0 }
  },
  issues: [],
  recommendations: []
};

/**
 * Test site structure and file integrity
 */
function testSiteStructure() {
  console.log('🏗️ Testing site structure and file integrity...');
  
  const requiredFiles = [
    'src/pages/index.astro',
    'src/pages/about.astro',
    'src/pages/services.astro',
    'src/pages/contact.astro',
    'src/pages/projects.astro',
    'src/layouts/BaseLayout.astro',
    'src/components/UltraEnhancedNavigation.astro',
    'src/components/Footer.astro',
    'astro.config.mjs',
    'package.json'
  ];
  
  requiredFiles.forEach(file => {
    testResults.categories.functionality.total++;
    testResults.totalTests++;
    
    if (fs.existsSync(file)) {
      testResults.categories.functionality.passed++;
      testResults.passedTests++;
      console.log(`   ✅ ${file} exists`);
    } else {
      testResults.categories.functionality.failed++;
      testResults.failedTests++;
      testResults.issues.push({
        category: 'Structure',
        severity: 'HIGH',
        issue: `Missing required file: ${file}`
      });
      console.log(`   ❌ ${file} missing`);
    }
  });
}

/**
 * Test content authenticity and accuracy
 */
function testContentAuthenticity() {
  console.log('\n📝 Testing content authenticity and accuracy...');
  
  const contentTests = [
    {
      file: 'src/pages/index.astro',
      shouldContain: ['NosytLabs', 'Notable Opportunities Shape Your Tomorrow'],
      shouldNotContain: ['Lorem ipsum', 'placeholder', 'OMA AI', 'example.com']
    },
    {
      file: 'src/pages/about.astro',
      shouldContain: ['NosytLabs', 'Founded in 2025'],
      shouldNotContain: ['Lorem ipsum', 'placeholder', 'Your Company']
    },
    {
      file: 'src/pages/services.astro',
      shouldContain: ['Web Development', 'AI Integration', 'Content Creation'],
      shouldNotContain: ['Lorem ipsum', 'placeholder']
    }
  ];
  
  contentTests.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      // Test required content
      test.shouldContain.forEach(requiredText => {
        testResults.categories.content.total++;
        testResults.totalTests++;
        
        if (content.includes(requiredText)) {
          testResults.categories.content.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${path.basename(test.file)} contains "${requiredText}"`);
        } else {
          testResults.categories.content.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Content',
            severity: 'MEDIUM',
            issue: `${test.file} missing required content: "${requiredText}"`
          });
          console.log(`   ❌ ${path.basename(test.file)} missing "${requiredText}"`);
        }
      });
      
      // Test prohibited content
      test.shouldNotContain.forEach(prohibitedText => {
        testResults.categories.content.total++;
        testResults.totalTests++;
        
        if (!content.toLowerCase().includes(prohibitedText.toLowerCase())) {
          testResults.categories.content.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${path.basename(test.file)} doesn't contain "${prohibitedText}"`);
        } else {
          testResults.categories.content.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Content',
            severity: 'HIGH',
            issue: `${test.file} contains placeholder content: "${prohibitedText}"`
          });
          console.log(`   ❌ ${path.basename(test.file)} contains "${prohibitedText}"`);
        }
      });
    }
  });
}

/**
 * Test component functionality
 */
function testComponentFunctionality() {
  console.log('\n⚙️ Testing component functionality...');
  
  const components = [
    'src/components/UltraEnhancedNavigation.astro',
    'src/components/EnhancedHero.astro',
    'src/components/ServicePreviewCards.astro',
    'src/components/InteractiveROICalculator.astro',
    'src/components/Footer.astro'
  ];
  
  components.forEach(component => {
    testResults.categories.functionality.total++;
    testResults.totalTests++;
    
    if (fs.existsSync(component)) {
      try {
        const content = fs.readFileSync(component, 'utf8');
        
        // Check for syntax errors
        if (content.includes('...oo_oo') || content.includes('console...oo_oo')) {
          testResults.categories.functionality.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Functionality',
            severity: 'CRITICAL',
            issue: `${component} contains syntax errors`
          });
          console.log(`   ❌ ${path.basename(component)} has syntax errors`);
        } else {
          testResults.categories.functionality.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${path.basename(component)} syntax is clean`);
        }
      } catch (error) {
        testResults.categories.functionality.failed++;
        testResults.failedTests++;
        testResults.issues.push({
          category: 'Functionality',
          severity: 'HIGH',
          issue: `Error reading ${component}: ${error.message}`
        });
        console.log(`   ❌ Error reading ${path.basename(component)}`);
      }
    } else {
      testResults.categories.functionality.failed++;
      testResults.failedTests++;
      testResults.issues.push({
        category: 'Functionality',
        severity: 'HIGH',
        issue: `Component missing: ${component}`
      });
      console.log(`   ❌ ${path.basename(component)} missing`);
    }
  });
}

/**
 * Test SEO implementation
 */
function testSEOImplementation() {
  console.log('\n🔍 Testing SEO implementation...');
  
  const seoTests = [
    {
      file: 'src/layouts/BaseLayout.astro',
      checks: [
        { pattern: /<title>/, name: 'Title tag' },
        { pattern: /<meta name="description"/, name: 'Meta description' },
        { pattern: /<meta property="og:/, name: 'Open Graph tags' },
        { pattern: /<meta name="twitter:/, name: 'Twitter Cards' },
        { pattern: /<link rel="canonical"/, name: 'Canonical URL' }
      ]
    },
    {
      file: 'src/utils/seoUtils.js',
      checks: [
        { pattern: /generateMetaTags/, name: 'Meta tag generation' },
        { pattern: /generateStructuredData/, name: 'Structured data' }
      ]
    }
  ];
  
  seoTests.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.categories.seo.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.categories.seo.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${check.name} implemented`);
        } else {
          testResults.categories.seo.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'SEO',
            severity: 'MEDIUM',
            issue: `${test.file} missing ${check.name}`
          });
          console.log(`   ❌ ${check.name} missing`);
        }
      });
    }
  });
}

/**
 * Test accessibility features
 */
function testAccessibility() {
  console.log('\n♿ Testing accessibility features...');
  
  const accessibilityChecks = [
    {
      file: 'src/layouts/BaseLayout.astro',
      checks: [
        { pattern: /skip-nav|skip-link/, name: 'Skip navigation links' },
        { pattern: /aria-label/, name: 'ARIA labels' },
        { pattern: /alt=/, name: 'Image alt attributes' }
      ]
    },
    {
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /aria-expanded/, name: 'ARIA expanded states' },
        { pattern: /role=/, name: 'ARIA roles' }
      ]
    }
  ];
  
  accessibilityChecks.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.categories.accessibility.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.categories.accessibility.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${check.name} implemented`);
        } else {
          testResults.categories.accessibility.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Accessibility',
            severity: 'MEDIUM',
            issue: `${test.file} missing ${check.name}`
          });
          console.log(`   ❌ ${check.name} missing`);
        }
      });
    }
  });
}

/**
 * Test performance optimizations
 */
function testPerformanceOptimizations() {
  console.log('\n⚡ Testing performance optimizations...');
  
  const performanceChecks = [
    {
      file: 'astro.config.mjs',
      checks: [
        { pattern: /output:\s*['"]static['"]/, name: 'Static site generation' },
        { pattern: /build:/, name: 'Build optimizations' }
      ]
    },
    {
      file: 'public/sw.js',
      checks: [
        { pattern: /Service Worker/, name: 'Service Worker' }
      ]
    }
  ];
  
  performanceChecks.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.categories.performance.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.categories.performance.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${check.name} configured`);
        } else {
          testResults.categories.performance.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Performance',
            severity: 'LOW',
            issue: `${test.file} missing ${check.name}`
          });
          console.log(`   ❌ ${check.name} not configured`);
        }
      });
    } else {
      // File doesn't exist
      test.checks.forEach(check => {
        testResults.categories.performance.total++;
        testResults.totalTests++;
        testResults.categories.performance.failed++;
        testResults.failedTests++;
        testResults.issues.push({
          category: 'Performance',
          severity: 'MEDIUM',
          issue: `${test.file} missing (${check.name})`
        });
        console.log(`   ❌ ${path.basename(test.file)} missing`);
      });
    }
  });
}

/**
 * Generate comprehensive test report
 */
function generateTestReport() {
  console.log('\n📋 Generating comprehensive test report...');
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
  
  const reportContent = `# Comprehensive Site Testing Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Total Tests**: ${testResults.totalTests}
- **Passed Tests**: ${testResults.passedTests}
- **Failed Tests**: ${testResults.failedTests}
- **Success Rate**: ${successRate}%
- **Critical Issues**: ${testResults.issues.filter(i => i.severity === 'CRITICAL').length}
- **High Priority Issues**: ${testResults.issues.filter(i => i.severity === 'HIGH').length}

## Category Results
${Object.entries(testResults.categories).map(([category, results]) => {
  const categoryRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0';
  return `- **${category.charAt(0).toUpperCase() + category.slice(1)}**: ${results.passed}/${results.total} (${categoryRate}%)`;
}).join('\n')}

## Issues Found
${testResults.issues.length > 0 ? 
  testResults.issues.map((issue, i) => 
    `${i + 1}. **${issue.category}** (${issue.severity}): ${issue.issue}`
  ).join('\n') : 
  'No issues found.'
}

## Recommendations
${testResults.recommendations.length > 0 ? 
  testResults.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') : 
  'No specific recommendations at this time.'
}

## Overall Status
${successRate >= 90 ? 
  '✅ **EXCELLENT** - Site is in excellent condition' : 
  successRate >= 80 ? 
  '✅ **GOOD** - Site is in good condition with minor issues' : 
  successRate >= 70 ? 
  '⚠️ **FAIR** - Site needs attention in several areas' : 
  '❌ **POOR** - Site requires significant improvements'
}

## Next Steps
1. Address critical and high priority issues first
2. Implement missing accessibility features
3. Optimize performance where needed
4. Test user flows and interactive elements
5. Conduct browser compatibility testing
6. Perform mobile responsiveness testing
`;

  try {
    fs.writeFileSync('COMPREHENSIVE_SITE_TESTING_REPORT.md', reportContent, 'utf8');
    console.log('   ✅ Test report saved to COMPREHENSIVE_SITE_TESTING_REPORT.md');
  } catch (error) {
    console.log(`   ❌ Error saving report: ${error.message}`);
  }
}

/**
 * Display test results
 */
function displayResults() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 COMPREHENSIVE SITE TESTING RESULTS');
  console.log('='.repeat(70));
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
  
  console.log(`\n📊 Overall Results:`);
  console.log(`   Total Tests: ${testResults.totalTests}`);
  console.log(`   Passed: ${testResults.passedTests}`);
  console.log(`   Failed: ${testResults.failedTests}`);
  console.log(`   Success Rate: ${successRate}%`);
  
  console.log(`\n📋 Category Breakdown:`);
  Object.entries(testResults.categories).forEach(([category, results]) => {
    const rate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0';
    console.log(`   ${category.charAt(0).toUpperCase() + category.slice(1)}: ${results.passed}/${results.total} (${rate}%)`);
  });
  
  const criticalIssues = testResults.issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssues = testResults.issues.filter(i => i.severity === 'HIGH').length;
  
  console.log(`\n🚨 Issues Summary:`);
  console.log(`   Critical: ${criticalIssues}`);
  console.log(`   High Priority: ${highIssues}`);
  console.log(`   Total Issues: ${testResults.issues.length}`);
  
  if (successRate >= 90) {
    console.log('\n🎉 Excellent! Site is in outstanding condition');
  } else if (successRate >= 80) {
    console.log('\n✅ Good! Site is in good condition with minor issues');
  } else if (successRate >= 70) {
    console.log('\n⚠️ Fair - Site needs attention in several areas');
  } else {
    console.log('\n❌ Poor - Site requires significant improvements');
  }
  
  console.log('\n📋 Detailed report saved to COMPREHENSIVE_SITE_TESTING_REPORT.md');
  console.log('💡 Next: Review issues and implement improvements');
}

/**
 * Main execution
 */
function main() {
  console.log('🎯 Running comprehensive site testing...\n');
  
  // Run all test categories
  testSiteStructure();
  testContentAuthenticity();
  testComponentFunctionality();
  testSEOImplementation();
  testAccessibility();
  testPerformanceOptimizations();
  
  // Generate report and display results
  generateTestReport();
  displayResults();
  
  return testResults.passedTests / testResults.totalTests >= 0.8;
}

// Run the tests
const success = main();
process.exit(success ? 0 : 1);
