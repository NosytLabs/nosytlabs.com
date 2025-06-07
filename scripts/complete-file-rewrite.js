#!/usr/bin/env node

/**
 * Complete File Rewrite Script
 * Completely rewrites problematic files to eliminate any hidden characters or encoding issues
 */

import fs from 'fs';
import path from 'path';

console.log('🔄 Starting complete file rewrite...\n');

const problematicFiles = [
  'src/components/InteractiveROICalculator.astro',
  'src/components/ServicePreviewCards.astro',
  'src/components/UltraEnhancedNavigation.astro',
  'src/pages/live.astro'
];

function rewriteFile(filePath) {
  try {
    console.log(`🔄 Rewriting: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup
    const backupPath = `${filePath}.backup-${Date.now()}`;
    fs.writeFileSync(backupPath, content, 'utf8');
    console.log(`💾 Backup created: ${backupPath}`);
    
    // Clean the content aggressively
    content = content
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove any zero-width characters
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      // Remove any non-printable characters except newlines and tabs
      .replace(/[^\x09\x0A\x20-\x7E\u00A0-\uFFFF]/g, '')
      // Fix any remaining problematic patterns
      .replace(/console\.log?\.{3}[^;]*oo_oo[^;]*/g, '// Fixed console.log')
      .replace(/conso[^;]*\.{3}[^;]*oo_oo[^;]*/g, '// Fixed console statement')
      .replace(/[^a-zA-Z]\.{3}[^;]*oo_oo[^;]*/g, '// Fixed statement')
      .replace(/oo_oo/g, '')
      .replace(/\.{3}(?![.\s])/g, '')
      // Remove any script sections that might contain problematic code
      .replace(/<script[^>]*>[\s\S]*?<\/script>/g, (match) => {
        // Check if the script contains any problematic patterns
        if (match.includes('oo_oo') || 
            match.includes('console...') || 
            match.includes('conso...') ||
            match.includes('...oo_oo')) {
          console.log(`   ⚠️  Removing problematic script section`);
          return '<script>\n// Script section removed due to syntax errors\n// Will be restored with clean implementation\n</script>';
        }
        return match;
      });
    
    // Write the cleaned content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully rewrote: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error rewriting ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
let rewrittenCount = 0;

console.log('Rewriting problematic files to eliminate build errors...\n');

for (const filePath of problematicFiles) {
  if (rewriteFile(filePath)) {
    rewrittenCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${problematicFiles.length}`);
console.log(`   Files rewritten: ${rewrittenCount}`);

if (rewrittenCount > 0) {
  console.log('\n✅ File rewrite completed!');
  console.log('💡 Try restarting the development server now');
  console.log('🔧 Script sections have been cleaned and will need to be restored');
} else {
  console.log('\n⚠️  No files were rewritten');
  console.log('💡 Files may already be clean or there may be permission issues');
}

console.log('\n🎯 Next steps:');
console.log('1. Restart the development server');
console.log('2. Check if build errors are resolved');
console.log('3. Restore script functionality if needed');
