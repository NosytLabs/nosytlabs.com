#!/usr/bin/env node

/**
 * Comprehensive Site Analysis & Fix Script
 * Identifies and fixes critical issues with the NosytLabs website
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Starting comprehensive site analysis...\n');

const analysisResults = {
  criticalIssues: [],
  contentIssues: [],
  technicalIssues: [],
  missingFiles: [],
  incorrectContent: [],
  fixesApplied: [],
  recommendations: []
};

/**
 * Analyze critical site issues
 */
function analyzeCriticalIssues() {
  console.log('🚨 Analyzing critical site issues...');
  
  // Check for wrong content in index.astro
  const indexPath = 'src/pages/index.astro';
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    if (content.includes('OMA AI') || content.includes('OMA AI Content Platform')) {
      analysisResults.criticalIssues.push({
        type: 'Wrong Content',
        file: indexPath,
        issue: 'Index page contains OMA AI content instead of NosytLabs',
        severity: 'CRITICAL'
      });
    }
    
    if (!content.includes('NosytLabs') && !content.includes('Notable Opportunities')) {
      analysisResults.criticalIssues.push({
        type: 'Missing Branding',
        file: indexPath,
        issue: 'Index page missing NosytLabs branding',
        severity: 'CRITICAL'
      });
    }
  }
  
  // Check for JavaScript syntax errors
  const componentsDir = 'src/components';
  if (fs.existsSync(componentsDir)) {
    const components = fs.readdirSync(componentsDir).filter(file => file.endsWith('.astro'));
    
    for (const component of components) {
      const componentPath = path.join(componentsDir, component);
      const content = fs.readFileSync(componentPath, 'utf8');
      
      // Check for syntax errors
      if (content.includes('...oo_oo') || content.includes('console...oo_oo')) {
        analysisResults.criticalIssues.push({
          type: 'Syntax Error',
          file: componentPath,
          issue: 'JavaScript syntax error with malformed console statements',
          severity: 'CRITICAL'
        });
      }
      
      // Check for React imports in Astro files
      if (content.includes('import React') && !content.includes('---\nimport React')) {
        analysisResults.technicalIssues.push({
          type: 'Import Error',
          file: componentPath,
          issue: 'React import outside of frontmatter',
          severity: 'HIGH'
        });
      }
    }
  }
  
  console.log(`   Found ${analysisResults.criticalIssues.length} critical issues`);
}

/**
 * Analyze content authenticity
 */
function analyzeContentAuthenticity() {
  console.log('📝 Analyzing content authenticity...');
  
  const pagesToCheck = [
    'src/pages/index.astro',
    'src/pages/about.astro',
    'src/pages/services.astro',
    'src/pages/contact.astro'
  ];
  
  for (const pagePath of pagesToCheck) {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      // Check for placeholder content
      const placeholders = [
        'Lorem ipsum',
        'placeholder',
        'example.com',
        'Your Company',
        'Company Name',
        'OMA AI',
        'placeholder@example.com'
      ];
      
      for (const placeholder of placeholders) {
        if (content.toLowerCase().includes(placeholder.toLowerCase())) {
          analysisResults.contentIssues.push({
            type: 'Placeholder Content',
            file: pagePath,
            issue: `Contains placeholder: "${placeholder}"`,
            severity: 'MEDIUM'
          });
        }
      }
      
      // Check for NosytLabs branding
      if (!content.includes('NosytLabs') && !content.includes('Notable Opportunities')) {
        analysisResults.contentIssues.push({
          type: 'Missing Branding',
          file: pagePath,
          issue: 'Missing NosytLabs branding',
          severity: 'HIGH'
        });
      }
    } else {
      analysisResults.missingFiles.push({
        type: 'Missing Page',
        file: pagePath,
        issue: 'Required page file missing',
        severity: 'HIGH'
      });
    }
  }
  
  console.log(`   Found ${analysisResults.contentIssues.length} content issues`);
}

/**
 * Analyze technical implementation
 */
function analyzeTechnicalImplementation() {
  console.log('⚙️ Analyzing technical implementation...');
  
  // Check for missing React components that are being imported
  const reactComponents = [
    'src/main.tsx',
    'src/App.tsx',
    'src/contexts/AuthContext.tsx',
    'src/components/GameCanvas.tsx',
    'src/components/UserProfile.tsx'
  ];
  
  for (const component of reactComponents) {
    if (!fs.existsSync(component)) {
      analysisResults.technicalIssues.push({
        type: 'Missing React Component',
        file: component,
        issue: 'Component referenced but file missing',
        severity: 'HIGH'
      });
    }
  }
  
  // Check for missing assets
  const requiredAssets = [
    'public/logo.svg',
    'public/favicon.svg',
    'public/images/nosytlabs-logo-2025.svg'
  ];
  
  for (const asset of requiredAssets) {
    if (!fs.existsSync(asset)) {
      analysisResults.missingFiles.push({
        type: 'Missing Asset',
        file: asset,
        issue: 'Required asset file missing',
        severity: 'MEDIUM'
      });
    }
  }
  
  console.log(`   Found ${analysisResults.technicalIssues.length} technical issues`);
}

/**
 * Fix critical JavaScript syntax errors
 */
function fixJavaScriptErrors() {
  console.log('🔧 Fixing JavaScript syntax errors...');
  
  const componentsDir = 'src/components';
  if (fs.existsSync(componentsDir)) {
    const components = fs.readdirSync(componentsDir).filter(file => file.endsWith('.astro'));
    
    for (const component of components) {
      const componentPath = path.join(componentsDir, component);
      let content = fs.readFileSync(componentPath, 'utf8');
      let modified = false;
      
      // Fix malformed console statements
      if (content.includes('...oo_oo') || content.includes('console...oo_oo')) {
        content = content.replace(/console\.\.\.oo_oo\([^)]*\),?\s*/g, '');
        content = content.replace(/\.\.\.oo_oo\([^)]*\),?\s*/g, '');
        content = content.replace(/console\.log\([^)]*\)\.\.\.oo_oo\([^)]*\)/g, '');
        modified = true;
      }
      
      // Remove malformed eslint comments
      if (content.includes('/* eslint-disable */')) {
        content = content.replace(/\/\* eslint-disable \*\/\s*console\.log[^;]*;?/g, '');
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(componentPath, content, 'utf8');
        analysisResults.fixesApplied.push({
          type: 'JavaScript Syntax Fix',
          file: componentPath,
          fix: 'Removed malformed console statements and syntax errors'
        });
        console.log(`   ✅ Fixed syntax errors in ${component}`);
      }
    }
  }
}

/**
 * Fix content authenticity issues
 */
function fixContentAuthenticity() {
  console.log('📝 Fixing content authenticity issues...');
  
  // Create correct index.astro content
  const correctIndexContent = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/HeroSection.astro';
import FeatureGrid from '../components/FeatureGrid.astro';
import ServicePreviewCards from '../components/ServicePreviewCards.astro';
import InteractiveROICalculator from '../components/InteractiveROICalculator.astro';
import { generateMetaTags } from '../utils/seoUtils.js';

const metaTags = generateMetaTags('home');
---

<BaseLayout 
  title={metaTags.title}
  description={metaTags.description}
  keywords={metaTags.keywords}
>
  <main>
    <HeroSection />
    <FeatureGrid />
    <ServicePreviewCards />
    <InteractiveROICalculator />
  </main>
</BaseLayout>`;

  const indexPath = 'src/pages/index.astro';
  if (fs.existsSync(indexPath)) {
    const currentContent = fs.readFileSync(indexPath, 'utf8');
    
    if (currentContent.includes('OMA AI') || !currentContent.includes('NosytLabs')) {
      fs.writeFileSync(indexPath, correctIndexContent, 'utf8');
      analysisResults.fixesApplied.push({
        type: 'Content Fix',
        file: indexPath,
        fix: 'Replaced incorrect content with proper NosytLabs homepage'
      });
      console.log('   ✅ Fixed index.astro content');
    }
  }
}

/**
 * Create missing essential files
 */
function createMissingFiles() {
  console.log('📁 Creating missing essential files...');
  
  // Create missing logo file
  const logoPath = 'public/logo.svg';
  if (!fs.existsSync(logoPath)) {
    const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="10" y="35" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="url(#logoGradient)">
    NosytLabs
  </text>
  <text x="10" y="50" font-family="Arial, sans-serif" font-size="8" fill="#6b7280">
    Notable Opportunities Shape Your Tomorrow
  </text>
</svg>`;
    
    fs.writeFileSync(logoPath, logoSVG, 'utf8');
    analysisResults.fixesApplied.push({
      type: 'Asset Creation',
      file: logoPath,
      fix: 'Created NosytLabs logo SVG'
    });
    console.log('   ✅ Created logo.svg');
  }
  
  // Create favicon
  const faviconPath = 'public/favicon.svg';
  if (!fs.existsSync(faviconPath)) {
    const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" fill="#3b82f6" rx="4"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">N</text>
</svg>`;
    
    fs.writeFileSync(faviconPath, faviconSVG, 'utf8');
    analysisResults.fixesApplied.push({
      type: 'Asset Creation',
      file: faviconPath,
      fix: 'Created favicon SVG'
    });
    console.log('   ✅ Created favicon.svg');
  }
}

/**
 * Generate comprehensive analysis report
 */
function generateAnalysisReport() {
  console.log('\n📋 Generating comprehensive analysis report...');
  
  const reportContent = `# Comprehensive Site Analysis Report
Generated: ${new Date().toISOString()}

## Executive Summary
- **Critical Issues**: ${analysisResults.criticalIssues.length}
- **Content Issues**: ${analysisResults.contentIssues.length}
- **Technical Issues**: ${analysisResults.technicalIssues.length}
- **Missing Files**: ${analysisResults.missingFiles.length}
- **Fixes Applied**: ${analysisResults.fixesApplied.length}

## Critical Issues Found
${analysisResults.criticalIssues.length > 0 ? 
  analysisResults.criticalIssues.map((issue, i) => 
    `${i + 1}. **${issue.type}** (${issue.severity})
   - File: ${issue.file}
   - Issue: ${issue.issue}`
  ).join('\n\n') : 
  'No critical issues found.'
}

## Content Issues Found
${analysisResults.contentIssues.length > 0 ? 
  analysisResults.contentIssues.map((issue, i) => 
    `${i + 1}. **${issue.type}** (${issue.severity})
   - File: ${issue.file}
   - Issue: ${issue.issue}`
  ).join('\n\n') : 
  'No content issues found.'
}

## Technical Issues Found
${analysisResults.technicalIssues.length > 0 ? 
  analysisResults.technicalIssues.map((issue, i) => 
    `${i + 1}. **${issue.type}** (${issue.severity})
   - File: ${issue.file}
   - Issue: ${issue.issue}`
  ).join('\n\n') : 
  'No technical issues found.'
}

## Missing Files
${analysisResults.missingFiles.length > 0 ? 
  analysisResults.missingFiles.map((issue, i) => 
    `${i + 1}. **${issue.type}** (${issue.severity})
   - File: ${issue.file}
   - Issue: ${issue.issue}`
  ).join('\n\n') : 
  'No missing files found.'
}

## Fixes Applied
${analysisResults.fixesApplied.length > 0 ? 
  analysisResults.fixesApplied.map((fix, i) => 
    `${i + 1}. **${fix.type}**
   - File: ${fix.file}
   - Fix: ${fix.fix}`
  ).join('\n\n') : 
  'No fixes were applied.'
}

## Recommendations
1. **Restart Development Server** - After syntax fixes, restart the server
2. **Clear Browser Cache** - Clear cache to see updated content
3. **Verify All Pages** - Test navigation to all main pages
4. **Check Console Errors** - Monitor browser console for remaining errors
5. **Test Interactive Elements** - Verify all interactive components work
6. **Mobile Testing** - Test responsive design on mobile devices
7. **Performance Testing** - Run Lighthouse audit for performance metrics

## Next Steps
1. Restart the development server
2. Navigate to http://localhost:3000
3. Verify the homepage shows "NosytLabs" content
4. Test all navigation links
5. Check browser console for errors
6. Test interactive elements and forms
7. Verify mobile responsiveness

## Status
${analysisResults.criticalIssues.length === 0 ? 
  '✅ **READY FOR TESTING** - All critical issues resolved' : 
  '⚠️ **NEEDS ATTENTION** - Critical issues require immediate action'
}
`;

  try {
    fs.writeFileSync('COMPREHENSIVE_SITE_ANALYSIS_REPORT.md', reportContent, 'utf8');
    console.log('   ✅ Analysis report saved to COMPREHENSIVE_SITE_ANALYSIS_REPORT.md');
  } catch (error) {
    console.log(`   ❌ Error saving report: ${error.message}`);
  }
}

/**
 * Display analysis results
 */
function displayResults() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 COMPREHENSIVE SITE ANALYSIS RESULTS');
  console.log('='.repeat(70));
  
  console.log(`\n📊 Issues Found:`);
  console.log(`   Critical Issues: ${analysisResults.criticalIssues.length}`);
  console.log(`   Content Issues: ${analysisResults.contentIssues.length}`);
  console.log(`   Technical Issues: ${analysisResults.technicalIssues.length}`);
  console.log(`   Missing Files: ${analysisResults.missingFiles.length}`);
  
  console.log(`\n🔧 Fixes Applied: ${analysisResults.fixesApplied.length}`);
  
  if (analysisResults.fixesApplied.length > 0) {
    console.log('\n✅ Fixes Applied:');
    analysisResults.fixesApplied.forEach((fix, index) => {
      console.log(`   ${index + 1}. ${fix.type}: ${fix.file}`);
    });
  }
  
  if (analysisResults.criticalIssues.length === 0) {
    console.log('\n🎉 All critical issues resolved!');
    console.log('✅ Site is ready for testing');
    console.log('🔄 Restart the development server to see changes');
  } else {
    console.log('\n⚠️  Critical issues still need attention:');
    analysisResults.criticalIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue.type}: ${issue.file}`);
    });
  }
  
  console.log('\n📋 Detailed report saved to COMPREHENSIVE_SITE_ANALYSIS_REPORT.md');
  console.log('💡 Next: Restart server and test the site');
}

/**
 * Main execution
 */
function main() {
  console.log('🎯 Running comprehensive site analysis and fixes...\n');
  
  // Execute analysis
  analyzeCriticalIssues();
  analyzeContentAuthenticity();
  analyzeTechnicalImplementation();
  
  // Apply fixes
  fixJavaScriptErrors();
  fixContentAuthenticity();
  createMissingFiles();
  
  // Generate report and display results
  generateAnalysisReport();
  displayResults();
}

// Run the analysis
main();
