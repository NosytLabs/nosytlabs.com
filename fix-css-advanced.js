const fs = require('fs');
const path = require('path');

// Function to fix CSS empty selectors
function fixCssEmptySelectors(content) {
  // Replace empty selectors with a comment
  let fixedContent = content;
  
  // Fix empty selectors like "selector {}"
  fixedContent = fixedContent.replace(/([^{}]+)\s*{\s*}/g, '$1 { /* empty */ }');
  
  // Fix empty selectors with commas like "selector1, selector2, {}"
  fixedContent = fixedContent.replace(/([^{}]+),\s*{\s*}/g, '$1 { /* empty */ }');
  
  // Fix trailing commas in selector lists
  fixedContent = fixedContent.replace(/,\s*}/g, ' }');
  
  // Fix multiple consecutive commas
  fixedContent = fixedContent.replace(/,\s*,/g, ',');
  
  // Fix completely empty selectors
  fixedContent = fixedContent.replace(/{\s*}/g, '{ /* empty */ }');
  
  return fixedContent;
}

// Function to process a file
function processFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixCssEmptySelectors(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed empty selectors in ${filePath}`);
      return true;
    } else {
      console.log(`No empty selectors found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to extract CSS from Astro files
function extractAndFixCssInAstroFile(filePath) {
  console.log(`Extracting and fixing CSS in Astro file: ${filePath}`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all style blocks in the Astro file
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let match;
    let modified = false;
    let newContent = content;
    
    while ((match = styleRegex.exec(content)) !== null) {
      const styleContent = match[1];
      const fixedStyleContent = fixCssEmptySelectors(styleContent);
      
      if (styleContent !== fixedStyleContent) {
        // Replace the style block with the fixed one
        newContent = newContent.replace(
          `<style${match[0].substring(6, match[0].indexOf('>') + 1)}${styleContent}</style>`,
          `<style${match[0].substring(6, match[0].indexOf('>') + 1)}${fixedStyleContent}</style>`
        );
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed CSS in Astro file: ${filePath}`);
      return true;
    } else {
      console.log(`No CSS issues found in Astro file: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error processing Astro file ${filePath}:`, error);
    return false;
  }
}

// Process all CSS and Astro files in a directory
function processDirectory(directory) {
  console.log(`Scanning directory: ${directory}`);
  try {
    const entries = fs.readdirSync(directory);
    let fixedFiles = 0;
    
    for (const entry of entries) {
      const entryPath = path.join(directory, entry);
      const stats = fs.statSync(entryPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and .git directories
        if (entry === 'node_modules' || entry === '.git') {
          console.log(`Skipping directory: ${entryPath}`);
          continue;
        }
        
        // Recursively process subdirectories
        fixedFiles += processDirectory(entryPath);
      } else if (stats.isFile()) {
        const ext = path.extname(entry).toLowerCase();
        
        if (ext === '.css') {
          // Process CSS file
          if (processFile(entryPath)) {
            fixedFiles++;
          }
        } else if (ext === '.astro') {
          // Process Astro file
          if (extractAndFixCssInAstroFile(entryPath)) {
            fixedFiles++;
          }
        }
      }
    }
    
    return fixedFiles;
  } catch (error) {
    console.error(`Error scanning directory ${directory}:`, error);
    return 0;
  }
}

// Main function
function main() {
  console.log('Advanced CSS Empty Selector Fix Script');
  console.log('=====================================');
  
  // Process the src directory
  const srcDir = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    const fixedInSrc = processDirectory(srcDir);
    console.log(`Fixed ${fixedInSrc} files in src directory`);
  } else {
    console.log('src directory not found');
  }
  
  // Process the public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    const fixedInPublic = processDirectory(publicDir);
    console.log(`Fixed ${fixedInPublic} files in public directory`);
  } else {
    console.log('public directory not found');
  }
  
  console.log('Done!');
}

// Run the script
main();
