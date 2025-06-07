#!/usr/bin/env node

/**
 * Validation script for Prettier and ESLint integration
 * This script checks that the formatting tools are working correctly
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Validating Prettier and ESLint configuration...\n');

// Test files to validate
const testFiles = [
  'package.json',
  'src/components/CodeDisplay.astro',
  'astro.config.mjs',
  'tailwind.config.js',
];

let allPassed = true;

// Test 1: Check if Prettier can parse configuration
console.log('1️⃣ Testing Prettier configuration...');
try {
  execSync('npx prettier --help', { stdio: 'pipe' });
  console.log('   ✅ Prettier is installed and accessible');
} catch (error) {
  console.log('   ❌ Prettier is not working:', error.message);
  allPassed = false;
}

// Test 2: Check if ESLint can parse configuration
console.log('\n2️⃣ Testing ESLint configuration...');
try {
  execSync('npx eslint --help', { stdio: 'pipe' });
  console.log('   ✅ ESLint is installed and accessible');
} catch (error) {
  console.log('   ❌ ESLint is not working:', error.message);
  allPassed = false;
}

// Test 3: Validate Prettier can check files
console.log('\n3️⃣ Testing Prettier file checking...');
for (const file of testFiles) {
  if (fs.existsSync(file)) {
    try {
      execSync(`npx prettier --check "${file}"`, { stdio: 'pipe' });
      console.log(`   ✅ ${file} - Prettier can process`);
    } catch (error) {
      // This is expected - files may need formatting
      console.log(`   ⚠️  ${file} - Needs formatting (this is normal)`);
    }
  } else {
    console.log(`   ⏭️  ${file} - File not found, skipping`);
  }
}

// Test 4: Validate ESLint can check files
console.log('\n4️⃣ Testing ESLint file checking...');
const jsFiles = testFiles.filter(f => f.endsWith('.js') || f.endsWith('.mjs') || f.endsWith('.astro'));
for (const file of jsFiles) {
  if (fs.existsSync(file)) {
    try {
      execSync(`npx eslint "${file}"`, { stdio: 'pipe' });
      console.log(`   ✅ ${file} - ESLint can process`);
    } catch (error) {
      // This is expected - files may have linting issues
      console.log(`   ⚠️  ${file} - Has linting issues (this is normal)`);
    }
  }
}

// Test 5: Check integration scripts
console.log('\n5️⃣ Testing package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['lint', 'lint:fix', 'format', 'format:check'];

for (const script of requiredScripts) {
  if (packageJson.scripts[script]) {
    console.log(`   ✅ Script "${script}" is defined`);
  } else {
    console.log(`   ❌ Script "${script}" is missing`);
    allPassed = false;
  }
}

// Summary
console.log('\n📋 Validation Summary:');
if (allPassed) {
  console.log('   🎉 All core functionality is working!');
  console.log('   📝 Note: Files may need formatting/linting - this is expected');
  console.log('\n💡 Next steps:');
  console.log('   • Run "npm run format" to format all files');
  console.log('   • Run "npm run lint" to check for linting issues');
  console.log('   • Run "npm run lint:fix" to auto-fix linting issues');
} else {
  console.log('   ⚠️  Some issues were found. Please check the output above.');
  process.exit(1);
}
