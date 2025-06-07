#!/usr/bin/env node

/**
 * Constants Validation Script
 * This script validates the shared constants file and demonstrates usage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔍 Validating shared constants configuration...\n');

let allPassed = true;

// Test 1: Check if constants files exist
console.log('1️⃣ Testing constants file existence...');
const constantsFiles = [
  'src/config/constants.js',
  'src/config/constants.ts',
  'src/config/index.js',
  'src/config/index.ts'
];

for (const file of constantsFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} is missing`);
    allPassed = false;
  }
}

// Test 2: Try to import constants (JavaScript version)
console.log('\n2️⃣ Testing JavaScript constants import...');
try {
  const constantsPath = path.join(rootDir, 'src/config/constants.js');
  if (fs.existsSync(constantsPath)) {
    // Read and validate the file content
    const content = fs.readFileSync(constantsPath, 'utf8');
    
    // Check for key sections
    const requiredSections = [
      'COMPANY',
      'CONTACT',
      'COLORS',
      'TIMING',
      'PATHS',
      'FEATURES'
    ];
    
    for (const section of requiredSections) {
      if (content.includes(`export const ${section}`)) {
        console.log(`   ✅ ${section} section found`);
      } else {
        console.log(`   ❌ ${section} section missing`);
        allPassed = false;
      }
    }
  }
} catch (error) {
  console.log(`   ❌ Error reading constants file: ${error.message}`);
  allPassed = false;
}

// Test 3: Check for duplicate values that should be replaced
console.log('\n3️⃣ Scanning for values that should use constants...');

const filesToScan = [
  'src/components/passive-income/PassiveIncomeCTA.astro',
  'astro.config.mjs',
  'public/service-worker.js'
];

const duplicateValues = {
  'contact@nosytlabs.com': 'CONTACT.EMAIL.MAIN',
  'https://nosytlabs.com': 'COMPANY.WEBSITE',
  'NosytLabs': 'COMPANY.NAME',
  '#4C1D95': 'COLORS.PRIMARY.PURPLE_MAIN',
  '#FF6B00': 'COLORS.SECONDARY.ORANGE_MAIN',
  '30000': 'TIMING.TIMEOUTS.PAGE_LOAD',
  '5000': 'TIMING.TIMEOUTS.LONG'
};

for (const file of filesToScan) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const [value, constantPath] of Object.entries(duplicateValues)) {
      if (content.includes(value)) {
        console.log(`   ⚠️  Found "${value}" in ${file} - should use ${constantPath}`);
      }
    }
  }
}

// Test 4: Validate color consistency
console.log('\n4️⃣ Testing color consistency...');
try {
  const cssVariablesPath = path.join(rootDir, 'src/styles/css-variables.css');
  const tailwindConfigPath = path.join(rootDir, 'tailwind.config.js');
  
  if (fs.existsSync(cssVariablesPath) && fs.existsSync(tailwindConfigPath)) {
    const cssContent = fs.readFileSync(cssVariablesPath, 'utf8');
    const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');
    
    // Check if key colors are consistent
    const keyColors = ['#4C1D95', '#FF6B00', '#2D0A4F'];
    
    for (const color of keyColors) {
      const inCSS = cssContent.includes(color);
      const inTailwind = tailwindContent.includes(color);
      
      if (inCSS && inTailwind) {
        console.log(`   ✅ Color ${color} is consistent across CSS and Tailwind`);
      } else if (inCSS || inTailwind) {
        console.log(`   ⚠️  Color ${color} found in only one config file`);
      }
    }
  }
} catch (error) {
  console.log(`   ❌ Error checking color consistency: ${error.message}`);
}

// Test 5: Check TypeScript types
console.log('\n5️⃣ Testing TypeScript type definitions...');
try {
  const tsConstantsPath = path.join(rootDir, 'src/config/constants.ts');
  if (fs.existsSync(tsConstantsPath)) {
    const content = fs.readFileSync(tsConstantsPath, 'utf8');
    
    const requiredTypes = [
      'CompanyInfo',
      'ContactInfo',
      'ColorPalette',
      'TimingConfig',
      'AnimationType',
      'CacheStrategy'
    ];
    
    for (const type of requiredTypes) {
      if (content.includes(`interface ${type}`) || content.includes(`type ${type}`)) {
        console.log(`   ✅ Type ${type} is defined`);
      } else {
        console.log(`   ❌ Type ${type} is missing`);
        allPassed = false;
      }
    }
  }
} catch (error) {
  console.log(`   ❌ Error checking TypeScript types: ${error.message}`);
}

// Test 6: Generate usage examples
console.log('\n6️⃣ Generating usage examples...');

const usageExamples = `
// ========== USAGE EXAMPLES ==========

// JavaScript Import
import { COMPANY, COLORS, TIMING } from '@/config/constants';

// TypeScript Import with types
import { COMPANY, COLORS, type AnimationType } from '@/config/constants';

// Usage in components
const companyName = COMPANY.NAME; // 'NosytLabs'
const primaryColor = COLORS.PRIMARY.PURPLE_MAIN; // '#4C1D95'
const animationDuration = TIMING.ANIMATION.NORMAL; // 300

// Usage in CSS-in-JS
const styles = {
  color: COLORS.PRIMARY.PURPLE_MAIN,
  backgroundColor: COLORS.SECONDARY.ORANGE_MAIN,
  transition: \`all \${TIMING.ANIMATION.NORMAL}ms ease-in-out\`
};

// Usage in configuration
const cacheConfig = {
  maxAge: TIMING.CACHE.DAILY,
  strategy: CACHE_CONFIG.STRATEGIES.CACHE_FIRST
};

// Usage in email templates
const contactEmail = CONTACT.EMAIL.MAIN; // 'contact@nosytlabs.com'
const websiteUrl = COMPANY.WEBSITE; // 'https://nosytlabs.com'
`;

console.log(usageExamples);

// Summary
console.log('\n📋 Constants Validation Summary:');
if (allPassed) {
  console.log('   🎉 All constants are properly configured!');
  console.log('\n💡 Benefits of using shared constants:');
  console.log('   • Single source of truth for all repeated values');
  console.log('   • Type safety with TypeScript definitions');
  console.log('   • Easy maintenance and updates');
  console.log('   • Consistent branding across the application');
  console.log('   • Reduced magic numbers and hardcoded values');
  console.log('\n🚀 Next steps:');
  console.log('   • Replace hardcoded values with constants imports');
  console.log('   • Update existing files to use the new constants');
  console.log('   • Add constants to ESLint rules to enforce usage');
} else {
  console.log('   ⚠️  Some issues were found. Please check the output above.');
  process.exit(1);
}
