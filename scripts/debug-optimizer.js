#!/usr/bin/env node

console.log('🚀 Starting debug optimization...');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Root directory:', rootDir);
console.log('Current files in root:', fs.readdirSync(rootDir));

// Check for duplicate directories
const duplicateDir = path.join(rootDir, '%USERPROFILE%');
console.log('Checking for duplicate directory:', duplicateDir);
console.log('Duplicate exists:', fs.existsSync(duplicateDir));

// List JavaScript files to identify duplicates
console.log('\n📁 Analyzing JavaScript file structure...');

const jsFiles = [];
function findJSFiles(dir, basePath = '') {
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === 'node_modules' || item === '.git') continue;
      
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        findJSFiles(fullPath, relativePath);
      } else if (item.endsWith('.js')) {
        jsFiles.push(relativePath);
      }
    }
  } catch (error) {
    console.log(`Error reading directory ${dir}:`, error.message);
  }
}

findJSFiles(rootDir);
console.log('\n📄 Found JavaScript files:');
jsFiles.sort().forEach(file => console.log(`  - ${file}`));

// Identify potential duplicates
console.log('\n🔍 Identifying potential duplicates...');
const duplicates = [];
const fileMap = new Map();

jsFiles.forEach(file => {
  const basename = path.basename(file);
  if (!fileMap.has(basename)) {
    fileMap.set(basename, []);
  }
  fileMap.get(basename).push(file);
});

fileMap.forEach((paths, basename) => {
  if (paths.length > 1) {
    duplicates.push({ name: basename, paths });
  }
});

if (duplicates.length > 0) {
  console.log('\n⚠️ Potential duplicate files found:');
  duplicates.forEach(dup => {
    console.log(`\n${dup.name}:`);
    dup.paths.forEach(path => console.log(`  - ${path}`));
  });
} else {
  console.log('✅ No duplicate JavaScript files found');
}

console.log('\n✅ Debug optimization completed');
