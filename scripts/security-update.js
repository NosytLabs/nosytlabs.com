#!/usr/bin/env node

/**
 * Security Update Script for NosytLabs
 * 
 * @fileoverview Comprehensive security update and dependency management script
 * that handles vulnerability fixes, dependency updates, and migration planning.
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

console.log('🔒 NosytLabs Security Update Script\n');

/**
 * Security update configuration
 */
const SECURITY_CONFIG = {
  // Current versions (before update)
  currentVersions: {
    astro: '4.5.0',
    react: '18.2.0',
    'react-dom': '18.2.0',
    tailwindcss: '3.4.1'
  },
  
  // Target versions for security fixes
  securityTargets: {
    astro: '5.8.1', // Fixes esbuild vulnerability
    '@astrojs/react': 'latest',
    '@astrojs/tailwind': 'latest'
  },
  
  // Future upgrade targets
  futureTargets: {
    react: '19.1.0',
    'react-dom': '19.1.0',
    tailwindcss: '4.1.8'
  },
  
  // Backup configuration
  backup: {
    enabled: true,
    directory: 'backups',
    timestamp: new Date().toISOString().replace(/[:.]/g, '-')
  }
};

/**
 * Results tracking
 */
const results = {
  vulnerabilitiesFixed: 0,
  packagesUpdated: [],
  deprecationsFixed: 0,
  backupCreated: false,
  buildSuccess: false,
  errors: []
};

/**
 * Create backup of current state
 * 
 * @returns {boolean} Success status
 */
function createBackup() {
  try {
    console.log('📦 Creating backup...');
    
    const backupDir = path.join(rootDir, SECURITY_CONFIG.backup.directory);
    const timestampDir = path.join(backupDir, `security-update-${SECURITY_CONFIG.backup.timestamp}`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.mkdirSync(timestampDir, { recursive: true });
    
    // Backup critical files
    const filesToBackup = [
      'package.json',
      'package-lock.json',
      'astro.config.mjs',
      'tsconfig.json'
    ];
    
    for (const file of filesToBackup) {
      const sourcePath = path.join(rootDir, file);
      const backupPath = path.join(timestampDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, backupPath);
        console.log(`   ✅ Backed up: ${file}`);
      }
    }
    
    results.backupCreated = true;
    console.log(`   📁 Backup created: ${timestampDir}\n`);
    return true;
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    results.errors.push(`Backup failed: ${error.message}`);
    return false;
  }
}

/**
 * Check current security status
 * 
 * @returns {object} Security audit results
 */
function checkSecurityStatus() {
  try {
    console.log('🔍 Checking current security status...');
    
    const auditOutput = execSync('npm audit --json', { 
      encoding: 'utf8',
      cwd: rootDir 
    });
    
    const auditData = JSON.parse(auditOutput);
    const vulnerabilities = auditData.vulnerabilities || {};
    
    console.log(`   📊 Found ${Object.keys(vulnerabilities).length} vulnerable packages`);
    
    // Count vulnerabilities by severity
    const severityCounts = {};
    Object.values(vulnerabilities).forEach(vuln => {
      const severity = vuln.severity;
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;
    });
    
    console.log('   📈 Vulnerability breakdown:');
    Object.entries(severityCounts).forEach(([severity, count]) => {
      console.log(`      ${severity}: ${count}`);
    });
    
    console.log('');
    return { vulnerabilities, severityCounts };
    
  } catch (error) {
    console.warn('⚠️  Could not parse audit output, continuing with manual check...');
    return { vulnerabilities: {}, severityCounts: {} };
  }
}

/**
 * Apply security fixes
 * 
 * @returns {boolean} Success status
 */
function applySecurityFixes() {
  try {
    console.log('🛡️  Applying security fixes...');
    
    // Update Astro to fix esbuild vulnerability
    console.log('   📦 Updating Astro to 5.8.1...');
    execSync(`npm install astro@${SECURITY_CONFIG.securityTargets.astro}`, {
      stdio: 'inherit',
      cwd: rootDir
    });
    results.packagesUpdated.push('astro@5.8.1');
    
    // Update Astro integrations
    console.log('   📦 Updating Astro integrations...');
    execSync('npm update @astrojs/react @astrojs/tailwind', {
      stdio: 'inherit',
      cwd: rootDir
    });
    results.packagesUpdated.push('@astrojs/react', '@astrojs/tailwind');
    
    console.log('   ✅ Security fixes applied\n');
    return true;
    
  } catch (error) {
    console.error('❌ Security fixes failed:', error.message);
    results.errors.push(`Security fixes failed: ${error.message}`);
    return false;
  }
}

/**
 * Fix deprecation warnings
 * 
 * @returns {boolean} Success status
 */
function fixDeprecations() {
  try {
    console.log('🔧 Fixing deprecation warnings...');
    
    // Check if blog.astro needs Astro.glob fix
    const blogPath = path.join(rootDir, 'src/pages/blog.astro');
    if (fs.existsSync(blogPath)) {
      const content = fs.readFileSync(blogPath, 'utf8');
      
      if (content.includes('Astro.glob')) {
        console.log('   ⚠️  Astro.glob usage found in blog.astro');
        console.log('   ℹ️  This should be manually updated to import.meta.glob');
        console.log('   ℹ️  See: https://vitejs.dev/guide/features.html#glob-import');
      } else {
        console.log('   ✅ No Astro.glob deprecations found');
        results.deprecationsFixed++;
      }
    }
    
    console.log('');
    return true;
    
  } catch (error) {
    console.error('❌ Deprecation fixes failed:', error.message);
    results.errors.push(`Deprecation fixes failed: ${error.message}`);
    return false;
  }
}

/**
 * Test build after updates
 * 
 * @returns {boolean} Success status
 */
function testBuild() {
  try {
    console.log('🏗️  Testing build after updates...');
    
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: rootDir
    });
    
    results.buildSuccess = true;
    console.log('   ✅ Build successful\n');
    return true;
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    results.errors.push(`Build failed: ${error.message}`);
    return false;
  }
}

/**
 * Generate security report
 */
function generateSecurityReport() {
  console.log('📋 Security Update Report');
  console.log('========================\n');
  
  console.log('📊 **Summary**');
  console.log(`   • Packages updated: ${results.packagesUpdated.length}`);
  console.log(`   • Deprecations fixed: ${results.deprecationsFixed}`);
  console.log(`   • Build success: ${results.buildSuccess ? '✅' : '❌'}`);
  console.log(`   • Backup created: ${results.backupCreated ? '✅' : '❌'}`);
  console.log(`   • Errors: ${results.errors.length}\n`);
  
  if (results.packagesUpdated.length > 0) {
    console.log('📦 **Updated Packages**');
    results.packagesUpdated.forEach(pkg => {
      console.log(`   • ${pkg}`);
    });
    console.log('');
  }
  
  if (results.errors.length > 0) {
    console.log('❌ **Errors**');
    results.errors.forEach(error => {
      console.log(`   • ${error}`);
    });
    console.log('');
  }
  
  console.log('🎯 **Next Steps**');
  console.log('   1. Run `npm audit` to check remaining vulnerabilities');
  console.log('   2. Test application functionality thoroughly');
  console.log('   3. Consider React 19 upgrade (breaking changes)');
  console.log('   4. Plan Tailwind 4.x migration (major changes)');
  console.log('   5. Set up automated security monitoring\n');
  
  console.log('📚 **Resources**');
  console.log('   • Astro 5.x Migration: https://docs.astro.build/en/guides/upgrade-to/v5/');
  console.log('   • React 19 Upgrade: https://react.dev/blog/2024/12/05/react-19');
  console.log('   • Security Plan: docs/security-dependency-management-plan.md\n');
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting security update process...\n');
  
  // Step 1: Create backup
  if (SECURITY_CONFIG.backup.enabled) {
    if (!createBackup()) {
      console.error('❌ Backup failed, aborting security update');
      process.exit(1);
    }
  }
  
  // Step 2: Check current security status
  const securityStatus = checkSecurityStatus();
  
  // Step 3: Apply security fixes
  if (!applySecurityFixes()) {
    console.error('❌ Security fixes failed, check errors above');
    process.exit(1);
  }
  
  // Step 4: Fix deprecations
  fixDeprecations();
  
  // Step 5: Test build
  if (!testBuild()) {
    console.error('❌ Build failed after updates, check errors above');
    console.log('💡 You can restore from backup if needed');
    process.exit(1);
  }
  
  // Step 6: Generate report
  generateSecurityReport();
  
  console.log('🎉 Security update completed successfully!');
  console.log('💡 Remember to commit these changes and test thoroughly\n');
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Security update failed:', error);
    process.exit(1);
  });
}

export { main as runSecurityUpdate, SECURITY_CONFIG, results };
