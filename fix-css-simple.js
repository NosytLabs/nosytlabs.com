/**
 * Simple CSS Fix Script
 * 
 * This script fixes the empty selector issue in CSS files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix CSS files
function fixCssFile(filePath) {
  try {
    console.log(`Fixing CSS file: ${filePath}`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace empty selectors with comments
    const fixedContent = content.replace(/([^{}]+){\s*}/g, '/* Empty selector removed: $1 */');
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    
    console.log(`Fixed CSS file: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing CSS file ${filePath}:`, error.message);
  }
}

// Function to fix all CSS files in a directory
function fixCssFilesInDirectory(dirPath) {
  try {
    console.log(`Scanning directory: ${dirPath}`);
    
    // Read the directory
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Process each entry
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        fixCssFilesInDirectory(fullPath);
      } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.css') {
        // Fix CSS files
        fixCssFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('Simple CSS Fix Script');
  console.log('====================');
  
  // Directories to scan
  const directories = [
    path.join(__dirname, 'src', 'styles'),
    path.join(__dirname, 'public', 'styles'),
    path.join(__dirname, 'dist', 'styles')
  ];
  
  // Fix CSS files in each directory
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      fixCssFilesInDirectory(dir);
    } else {
      console.warn(`Directory ${dir} does not exist, skipping.`);
    }
  }
  
  console.log('Done!');
}

// Run the script
main();
