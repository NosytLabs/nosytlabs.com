#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all .astro files
function findAstroFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findAstroFiles(fullPath));
    } else if (item.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix problematic console.log statements
function fixConsoleStatements(content) {
  // Fix malformed console.log statements with ...oo_oo pattern
  let fixed = content.replace(/console\.log?\.\.\.oo_oo\([^)]*\)/g, '// Fixed malformed console.log');
  fixed = fixed.replace(/console\.\.\.oo_oo\([^)]*\)/g, '// Fixed malformed console statement');
  fixed = fixed.replace(/\.\.\.oo_oo\([^)]*\)/g, '// Fixed malformed statement');
  fixed = fixed.replace(/console\.log\.\.\.oo_oo/g, 'console.log');
  fixed = fixed.replace(/\.\.\.oo_oo/g, '');
  
  // Fix any remaining malformed patterns
  fixed = fixed.replace(/console\s*\.\s*\.\s*\.\s*oo_oo/g, 'console.log');
  fixed = fixed.replace(/\s*\.\s*\.\s*\.\s*oo_oo\s*\(/g, '(');
  
  return fixed;
}

// Main execution
const srcDir = path.join(process.cwd(), 'src');
const astroFiles = findAstroFiles(srcDir);

console.log(`Found ${astroFiles.length} .astro files to check...`);

let fixedCount = 0;

for (const filePath of astroFiles) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixConsoleStatements(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files with console.log issues!`);
