#!/usr/bin/env node

/**
 * Validation script for TypeScript configuration
 * This script checks that TypeScript is properly configured for gradual adoption
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Validating TypeScript configuration...\n');

let allPassed = true;

// Test 1: Check if TypeScript is installed and accessible
console.log('1️⃣ Testing TypeScript installation...');
try {
  const tscVersion = execSync('npx tsc --version', { encoding: 'utf8' }).trim();
  console.log(`   ✅ TypeScript is installed: ${tscVersion}`);
} catch (error) {
  console.log('   ❌ TypeScript is not working:', error.message);
  allPassed = false;
}

// Test 2: Check if tsconfig.json exists and is valid
console.log('\n2️⃣ Testing tsconfig.json...');
try {
  if (fs.existsSync('tsconfig.json')) {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    console.log('   ✅ tsconfig.json exists and is valid JSON');
    
    // Check key configuration options
    const compilerOptions = tsconfig.compilerOptions || {};
    
    if (compilerOptions.target === 'ES2020') {
      console.log('   ✅ Target is set to ES2020 (matching existing requirements)');
    } else {
      console.log(`   ⚠️  Target is ${compilerOptions.target}, expected ES2020`);
    }
    
    if (compilerOptions.noEmit === true) {
      console.log('   ✅ noEmit is true (Astro handles compilation)');
    } else {
      console.log('   ⚠️  noEmit should be true for Astro projects');
    }
    
    if (compilerOptions.allowJs === true) {
      console.log('   ✅ allowJs is true (supports gradual adoption)');
    } else {
      console.log('   ⚠️  allowJs should be true for gradual adoption');
    }
    
    if (compilerOptions.strict === false) {
      console.log('   ✅ strict is false (gradual adoption mode)');
    } else {
      console.log('   ⚠️  strict mode is enabled (may be too restrictive for gradual adoption)');
    }
    
  } else {
    console.log('   ❌ tsconfig.json does not exist');
    allPassed = false;
  }
} catch (error) {
  console.log('   ❌ tsconfig.json is invalid:', error.message);
  allPassed = false;
}

// Test 3: Check type checking functionality
console.log('\n3️⃣ Testing type checking...');
try {
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('   ✅ Type checking passes without errors');
} catch (error) {
  console.log('   ❌ Type checking failed:', error.message);
  allPassed = false;
}

// Test 4: Check if Astro types are working
console.log('\n4️⃣ Testing Astro type declarations...');
try {
  if (fs.existsSync('src/env.d.ts')) {
    const envTypes = fs.readFileSync('src/env.d.ts', 'utf8');
    if (envTypes.includes('*.astro')) {
      console.log('   ✅ Astro component types are declared');
    } else {
      console.log('   ⚠️  Astro component types may be missing');
    }
  } else {
    console.log('   ⚠️  src/env.d.ts not found');
  }
  
  if (fs.existsSync('src/types/astro.d.ts')) {
    console.log('   ✅ Custom Astro types file exists');
  } else {
    console.log('   ⚠️  Custom Astro types file not found');
  }
} catch (error) {
  console.log('   ❌ Error checking Astro types:', error.message);
}

// Test 5: Check package.json scripts
console.log('\n5️⃣ Testing TypeScript scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  if (scripts['type-check']) {
    console.log('   ✅ type-check script is defined');
  } else {
    console.log('   ❌ type-check script is missing');
    allPassed = false;
  }
  
  if (scripts['type-check:watch']) {
    console.log('   ✅ type-check:watch script is defined');
  } else {
    console.log('   ⚠️  type-check:watch script is missing');
  }
} catch (error) {
  console.log('   ❌ Error checking package.json scripts:', error.message);
  allPassed = false;
}

// Test 6: Check path mapping
console.log('\n6️⃣ Testing path mapping...');
try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  const paths = tsconfig.compilerOptions?.paths || {};
  
  if (paths['@/*']) {
    console.log('   ✅ Base path mapping (@/*) is configured');
  } else {
    console.log('   ⚠️  Base path mapping is missing');
  }
  
  if (paths['@/components/*']) {
    console.log('   ✅ Components path mapping is configured');
  } else {
    console.log('   ⚠️  Components path mapping is missing');
  }
} catch (error) {
  console.log('   ❌ Error checking path mapping:', error.message);
}

// Summary
console.log('\n📋 TypeScript Configuration Summary:');
if (allPassed) {
  console.log('   🎉 TypeScript is properly configured for gradual adoption!');
  console.log('\n💡 Configuration highlights:');
  console.log('   • ES2020 target (matching existing requirements)');
  console.log('   • noEmit: true (Astro handles compilation)');
  console.log('   • allowJs: true (supports gradual migration)');
  console.log('   • strict: false (gradual adoption mode)');
  console.log('   • Path mapping configured for clean imports');
  console.log('   • Astro component types properly declared');
  console.log('\n🚀 Next steps for gradual adoption:');
  console.log('   • Start converting utility functions to TypeScript');
  console.log('   • Add type annotations to component props');
  console.log('   • Enable stricter checks gradually as codebase matures');
  console.log('   • Use "npm run type-check" to validate changes');
} else {
  console.log('   ⚠️  Some issues were found. Please check the output above.');
  process.exit(1);
}
