#!/usr/bin/env node

/**
 * Comprehensive User Flow Testing Script
 * Tests all user flows, interactive elements, and site functionality
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Starting comprehensive user flow testing...\n');

const testResults = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  userFlows: {
    navigation: { passed: 0, failed: 0, total: 0 },
    forms: { passed: 0, failed: 0, total: 0 },
    interactive: { passed: 0, failed: 0, total: 0 },
    responsive: { passed: 0, failed: 0, total: 0 },
    performance: { passed: 0, failed: 0, total: 0 }
  },
  issues: [],
  recommendations: []
};

/**
 * Test navigation functionality
 */
function testNavigationFlow() {
  console.log('🧭 Testing navigation functionality...');
  
  const navigationTests = [
    {
      name: 'Main Navigation Menu',
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /href=["']\/["']/, description: 'Home link' },
        { pattern: /href=["']\/about["']/, description: 'About link' },
        { pattern: /href=["']\/services["']/, description: 'Services link' },
        { pattern: /href=["']\/projects["']/, description: 'Projects link' },
        { pattern: /href=["']\/contact["']/, description: 'Contact link' }
      ]
    },
    {
      name: 'Mobile Navigation',
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /mobile-menu|hamburger|toggle.*menu/i, description: 'Mobile menu toggle' },
        { pattern: /aria-expanded/, description: 'ARIA expanded states' },
        { pattern: /@media.*max-width|sm:|md:|lg:/, description: 'Responsive breakpoints' }
      ]
    },
    {
      name: 'Footer Navigation',
      file: 'src/components/Footer.astro',
      checks: [
        { pattern: /Quick Links|Navigation/i, description: 'Footer navigation section' },
        { pattern: /href=["']\//, description: 'Internal links' },
        { pattern: /mailto:|tel:/, description: 'Contact links' }
      ]
    }
  ];
  
  navigationTests.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.userFlows.navigation.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.userFlows.navigation.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${test.name}: ${check.description}`);
        } else {
          testResults.userFlows.navigation.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Navigation',
            severity: 'MEDIUM',
            issue: `${test.name}: Missing ${check.description}`
          });
          console.log(`   ❌ ${test.name}: Missing ${check.description}`);
        }
      });
    } else {
      test.checks.forEach(check => {
        testResults.userFlows.navigation.total++;
        testResults.userFlows.navigation.failed++;
        testResults.totalTests++;
        testResults.failedTests++;
        testResults.issues.push({
          category: 'Navigation',
          severity: 'HIGH',
          issue: `${test.name}: File missing (${test.file})`
        });
      });
      console.log(`   ❌ ${test.name}: File missing`);
    }
  });
}

/**
 * Test form functionality
 */
function testFormFunctionality() {
  console.log('\n📝 Testing form functionality...');
  
  const formTests = [
    {
      name: 'Contact Form',
      file: 'src/pages/contact.astro',
      checks: [
        { pattern: /<form/, description: 'Form element' },
        { pattern: /type=["']email["']/, description: 'Email input' },
        { pattern: /required/, description: 'Required field validation' },
        { pattern: /submit|button.*type=["']submit["']/, description: 'Submit button' }
      ]
    },
    {
      name: 'ROI Calculator Form',
      file: 'src/components/InteractiveROICalculator.astro',
      checks: [
        { pattern: /<input|<select/, description: 'Input elements' },
        { pattern: /addEventListener|onclick/, description: 'JavaScript interaction' },
        { pattern: /calculate|compute/i, description: 'Calculation functionality' }
      ]
    }
  ];
  
  formTests.forEach(test => {
    if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.userFlows.forms.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.userFlows.forms.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${test.name}: ${check.description}`);
        } else {
          testResults.userFlows.forms.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Forms',
            severity: 'MEDIUM',
            issue: `${test.name}: Missing ${check.description}`
          });
          console.log(`   ❌ ${test.name}: Missing ${check.description}`);
        }
      });
    } else {
      test.checks.forEach(check => {
        testResults.userFlows.forms.total++;
        testResults.userFlows.forms.failed++;
        testResults.totalTests++;
        testResults.failedTests++;
      });
      console.log(`   ❌ ${test.name}: File missing`);
    }
  });
}

/**
 * Test interactive elements
 */
function testInteractiveElements() {
  console.log('\n🎮 Testing interactive elements...');
  
  const interactiveTests = [
    {
      name: 'Dark Mode Toggle',
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /dark.*mode|theme.*toggle/i, description: 'Dark mode functionality' },
        { pattern: /localStorage|sessionStorage/, description: 'Theme persistence' },
        { pattern: /addEventListener.*click/, description: 'Click event handling' }
      ]
    },
    {
      name: 'Interactive Animations',
      file: 'src/components',
      checks: [
        { pattern: /animation|transition|transform/, description: 'CSS animations' },
        { pattern: /hover|focus|active/, description: 'Interactive states' },
        { pattern: /@keyframes/, description: 'Custom animations' }
      ]
    },
    {
      name: 'Search Functionality',
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /search|filter/i, description: 'Search feature' },
        { pattern: /input.*search|type=["']search["']/, description: 'Search input' }
      ]
    }
  ];
  
  interactiveTests.forEach(test => {
    if (test.file === 'src/components') {
      // Check all component files for animations
      const componentsDir = 'src/components';
      if (fs.existsSync(componentsDir)) {
        const components = fs.readdirSync(componentsDir).filter(file => file.endsWith('.astro'));
        let hasAnimations = false;
        
        for (const component of components) {
          const content = fs.readFileSync(path.join(componentsDir, component), 'utf8');
          if (/animation|transition|transform|@keyframes/.test(content)) {
            hasAnimations = true;
            break;
          }
        }
        
        testResults.userFlows.interactive.total++;
        testResults.totalTests++;
        
        if (hasAnimations) {
          testResults.userFlows.interactive.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${test.name}: Found in components`);
        } else {
          testResults.userFlows.interactive.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Interactive',
            severity: 'LOW',
            issue: `${test.name}: No animations found in components`
          });
          console.log(`   ❌ ${test.name}: No animations found`);
        }
      }
    } else if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.userFlows.interactive.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.userFlows.interactive.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${test.name}: ${check.description}`);
        } else {
          testResults.userFlows.interactive.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Interactive',
            severity: 'LOW',
            issue: `${test.name}: Missing ${check.description}`
          });
          console.log(`   ❌ ${test.name}: Missing ${check.description}`);
        }
      });
    }
  });
}

/**
 * Test responsive design
 */
function testResponsiveDesign() {
  console.log('\n📱 Testing responsive design...');
  
  const responsiveTests = [
    {
      name: 'TailwindCSS Responsive Classes',
      files: ['src/components', 'src/pages', 'src/layouts'],
      checks: [
        { pattern: /sm:|md:|lg:|xl:/, description: 'Responsive breakpoints' },
        { pattern: /grid-cols-|flex-col|flex-row/, description: 'Responsive layouts' },
        { pattern: /hidden.*sm:|block.*md:/, description: 'Responsive visibility' }
      ]
    },
    {
      name: 'Mobile Navigation',
      file: 'src/components/UltraEnhancedNavigation.astro',
      checks: [
        { pattern: /mobile.*menu|hamburger/i, description: 'Mobile menu' },
        { pattern: /max-width.*768|md:/, description: 'Mobile breakpoints' }
      ]
    }
  ];
  
  responsiveTests.forEach(test => {
    if (Array.isArray(test.files)) {
      // Check multiple directories
      let hasResponsive = false;
      
      for (const dir of test.files) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir).filter(file => file.endsWith('.astro'));
          
          for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf8');
            if (test.checks.some(check => check.pattern.test(content))) {
              hasResponsive = true;
              break;
            }
          }
          
          if (hasResponsive) break;
        }
      }
      
      testResults.userFlows.responsive.total++;
      testResults.totalTests++;
      
      if (hasResponsive) {
        testResults.userFlows.responsive.passed++;
        testResults.passedTests++;
        console.log(`   ✅ ${test.name}: Found responsive classes`);
      } else {
        testResults.userFlows.responsive.failed++;
        testResults.failedTests++;
        testResults.issues.push({
          category: 'Responsive',
          severity: 'HIGH',
          issue: `${test.name}: No responsive classes found`
        });
        console.log(`   ❌ ${test.name}: No responsive classes found`);
      }
    } else if (fs.existsSync(test.file)) {
      const content = fs.readFileSync(test.file, 'utf8');
      
      test.checks.forEach(check => {
        testResults.userFlows.responsive.total++;
        testResults.totalTests++;
        
        if (check.pattern.test(content)) {
          testResults.userFlows.responsive.passed++;
          testResults.passedTests++;
          console.log(`   ✅ ${test.name}: ${check.description}`);
        } else {
          testResults.userFlows.responsive.failed++;
          testResults.failedTests++;
          testResults.issues.push({
            category: 'Responsive',
            severity: 'MEDIUM',
            issue: `${test.name}: Missing ${check.description}`
          });
          console.log(`   ❌ ${test.name}: Missing ${check.description}`);
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
  
  const performanceTests = [
    {
      name: 'Image Optimization',
      files: ['src/components', 'src/pages'],
      checks: [
        { pattern: /loading=["']lazy["']/, description: 'Lazy loading images' },
        { pattern: /\.webp|\.avif/, description: 'Modern image formats' },
        { pattern: /alt=/, description: 'Image alt attributes' }
      ]
    },
    {
      name: 'CSS Optimization',
      files: ['src/styles', 'src/components'],
      checks: [
        { pattern: /will-change|transform3d/, description: 'GPU acceleration' },
        { pattern: /transition|animation/, description: 'Smooth animations' }
      ]
    }
  ];
  
  performanceTests.forEach(test => {
    let hasOptimizations = false;
    
    for (const dir of test.files) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(file => 
          file.endsWith('.astro') || file.endsWith('.css') || file.endsWith('.js')
        );
        
        for (const file of files) {
          const content = fs.readFileSync(path.join(dir, file), 'utf8');
          if (test.checks.some(check => check.pattern.test(content))) {
            hasOptimizations = true;
            break;
          }
        }
        
        if (hasOptimizations) break;
      }
    }
    
    testResults.userFlows.performance.total++;
    testResults.totalTests++;
    
    if (hasOptimizations) {
      testResults.userFlows.performance.passed++;
      testResults.passedTests++;
      console.log(`   ✅ ${test.name}: Optimizations found`);
    } else {
      testResults.userFlows.performance.failed++;
      testResults.failedTests++;
      testResults.issues.push({
        category: 'Performance',
        severity: 'MEDIUM',
        issue: `${test.name}: No optimizations found`
      });
      console.log(`   ❌ ${test.name}: No optimizations found`);
    }
  });
}

/**
 * Generate recommendations
 */
function generateRecommendations() {
  console.log('\n💡 Generating recommendations...');
  
  // Analyze issues and generate recommendations
  const criticalIssues = testResults.issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssues = testResults.issues.filter(i => i.severity === 'HIGH').length;
  const mediumIssues = testResults.issues.filter(i => i.severity === 'MEDIUM').length;
  
  if (criticalIssues > 0) {
    testResults.recommendations.push('Address critical issues immediately - these may prevent the site from functioning properly');
  }
  
  if (highIssues > 0) {
    testResults.recommendations.push('Fix high priority issues to improve user experience and functionality');
  }
  
  if (testResults.userFlows.navigation.failed > 0) {
    testResults.recommendations.push('Improve navigation functionality to ensure users can easily move through the site');
  }
  
  if (testResults.userFlows.responsive.failed > 0) {
    testResults.recommendations.push('Enhance responsive design to ensure proper display on all devices');
  }
  
  if (testResults.userFlows.interactive.failed > 0) {
    testResults.recommendations.push('Add more interactive elements and animations to improve user engagement');
  }
  
  if (testResults.userFlows.performance.failed > 0) {
    testResults.recommendations.push('Implement performance optimizations for faster loading and better user experience');
  }
  
  // Add general recommendations
  testResults.recommendations.push('Conduct browser testing across different devices and browsers');
  testResults.recommendations.push('Test all user flows manually to ensure smooth user experience');
  testResults.recommendations.push('Monitor site performance and user analytics after deployment');
}

/**
 * Generate comprehensive report
 */
function generateUserFlowReport() {
  console.log('\n📋 Generating user flow testing report...');
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
  
  const reportContent = `# Comprehensive User Flow Testing Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Total Tests**: ${testResults.totalTests}
- **Passed Tests**: ${testResults.passedTests}
- **Failed Tests**: ${testResults.failedTests}
- **Success Rate**: ${successRate}%

## User Flow Results
${Object.entries(testResults.userFlows).map(([flow, results]) => {
  const flowRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0';
  return `- **${flow.charAt(0).toUpperCase() + flow.slice(1)}**: ${results.passed}/${results.total} (${flowRate}%)`;
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
  '✅ **EXCELLENT** - All user flows working properly' : 
  successRate >= 80 ? 
  '✅ **GOOD** - Most user flows working with minor issues' : 
  successRate >= 70 ? 
  '⚠️ **FAIR** - User flows need attention' : 
  '❌ **POOR** - Significant user flow issues need immediate attention'
}

## Next Steps
1. Address critical and high priority issues
2. Test all interactive elements manually
3. Verify responsive design on multiple devices
4. Conduct cross-browser compatibility testing
5. Monitor user behavior and analytics
6. Implement additional performance optimizations
`;

  try {
    fs.writeFileSync('USER_FLOW_TESTING_REPORT.md', reportContent, 'utf8');
    console.log('   ✅ User flow report saved to USER_FLOW_TESTING_REPORT.md');
  } catch (error) {
    console.log(`   ❌ Error saving report: ${error.message}`);
  }
}

/**
 * Display results
 */
function displayResults() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 COMPREHENSIVE USER FLOW TESTING RESULTS');
  console.log('='.repeat(70));
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
  
  console.log(`\n📊 Overall Results:`);
  console.log(`   Total Tests: ${testResults.totalTests}`);
  console.log(`   Passed: ${testResults.passedTests}`);
  console.log(`   Failed: ${testResults.failedTests}`);
  console.log(`   Success Rate: ${successRate}%`);
  
  console.log(`\n📋 User Flow Breakdown:`);
  Object.entries(testResults.userFlows).forEach(([flow, results]) => {
    const rate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0';
    console.log(`   ${flow.charAt(0).toUpperCase() + flow.slice(1)}: ${results.passed}/${results.total} (${rate}%)`);
  });
  
  const criticalIssues = testResults.issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssues = testResults.issues.filter(i => i.severity === 'HIGH').length;
  
  console.log(`\n🚨 Issues Summary:`);
  console.log(`   Critical: ${criticalIssues}`);
  console.log(`   High Priority: ${highIssues}`);
  console.log(`   Total Issues: ${testResults.issues.length}`);
  
  if (successRate >= 90) {
    console.log('\n🎉 Excellent! All user flows working properly');
  } else if (successRate >= 80) {
    console.log('\n✅ Good! Most user flows working with minor issues');
  } else if (successRate >= 70) {
    console.log('\n⚠️ Fair - User flows need attention');
  } else {
    console.log('\n❌ Poor - Significant user flow issues need immediate attention');
  }
  
  console.log('\n📋 Detailed report saved to USER_FLOW_TESTING_REPORT.md');
  console.log('💡 Next: Manual testing of interactive elements');
}

/**
 * Main execution
 */
function main() {
  console.log('🎯 Running comprehensive user flow testing...\n');
  
  // Run all test categories
  testNavigationFlow();
  testFormFunctionality();
  testInteractiveElements();
  testResponsiveDesign();
  testPerformanceOptimizations();
  
  // Generate recommendations and report
  generateRecommendations();
  generateUserFlowReport();
  displayResults();
  
  return testResults.passedTests / testResults.totalTests >= 0.8;
}

// Run the tests
const success = main();
process.exit(success ? 0 : 1);
