/**
 * CSS Fix Script
 *
 * This script scans CSS files for empty selectors and fixes them
 * to prevent build errors with the CSS minifier.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Configuration
const config = {
  // Directories to scan
  directories: [
    'src/styles',
    'src/components',
    'public/styles',
    'dist/styles',
    'dist/scripts',
    'src/pages',
    'src/layouts'
  ],
  // File extensions to process
  extensions: ['.css', '.scss', '.astro'],
  // Verbose logging
  verbose: true,
  // Dry run (don't actually modify files)
  dryRun: false,
  // Debug mode
  debug: true
};

// Regular expressions to find empty selectors
const emptySelectorsRegex = /([^{}]+){\s*}/g;
const emptySelectorsRegexAlt = /([^{]*)\{\s*\}/g;
const emptySelectorsRegexAlt2 = /([^{]*)\{\s*\/\*.*?\*\/\s*\}/g; // Matches selectors with only comments
const emptySelectorsRegexAlt3 = /([^{]*)\{\s*\/\/.*?\s*\}/g; // Matches selectors with only single-line comments
const emptySelectorsRegexAstro = /<style[^>]*>([\s\S]*?)<\/style>/g;

// Function to scan a file for empty selectors
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileExt = path.extname(filePath).toLowerCase();
    let matches = [];
    let styleBlocks = [];

    if (config.debug) {
      console.log(`Scanning file: ${filePath} (${fileExt})`);
    }

    // For .astro files, extract style blocks first
    if (fileExt === '.astro') {
      const styleMatches = content.match(emptySelectorsRegexAstro);
      if (styleMatches) {
        if (config.debug) {
          console.log(`Found ${styleMatches.length} style block(s) in ${filePath}`);
        }

        styleBlocks = styleMatches.map(block => {
          return block.replace(/<style[^>]*>/, '').replace(/<\/style>/, '');
        });

        // Scan each style block for empty selectors
        styleBlocks.forEach((styleBlock, index) => {
          if (config.debug) {
            console.log(`Scanning style block ${index + 1} in ${filePath}`);
            console.log(`Style block content: ${styleBlock.substring(0, 100)}...`);
          }

          const blockMatches1 = styleBlock.match(emptySelectorsRegex) || [];
          const blockMatches2 = styleBlock.match(emptySelectorsRegexAlt) || [];
          const blockMatches3 = styleBlock.match(emptySelectorsRegexAlt2) || [];
          const blockMatches4 = styleBlock.match(emptySelectorsRegexAlt3) || [];

          if (config.debug) {
            console.log(`Found ${blockMatches1.length} matches with regex 1, ${blockMatches2.length} matches with regex 2, ${blockMatches3.length} matches with regex 3, and ${blockMatches4.length} matches with regex 4`);
          }

          matches = [...matches, ...blockMatches1, ...blockMatches2, ...blockMatches3, ...blockMatches4];
        });
      } else if (config.debug) {
        console.log(`No style blocks found in ${filePath}`);
      }
    } else {
      // For CSS/SCSS files, scan directly
      if (config.debug) {
        console.log(`Scanning CSS/SCSS file: ${filePath}`);
      }

      const matches1 = content.match(emptySelectorsRegex) || [];
      const matches2 = content.match(emptySelectorsRegexAlt) || [];
      const matches3 = content.match(emptySelectorsRegexAlt2) || [];
      const matches4 = content.match(emptySelectorsRegexAlt3) || [];

      if (config.debug) {
        console.log(`Found ${matches1.length} matches with regex 1, ${matches2.length} matches with regex 2, ${matches3.length} matches with regex 3, and ${matches4.length} matches with regex 4`);
      }

      matches = [...matches1, ...matches2, ...matches3, ...matches4];
    }

    // Filter out duplicates
    const originalLength = matches.length;
    matches = [...new Set(matches)];

    if (config.debug && originalLength !== matches.length) {
      console.log(`Removed ${originalLength - matches.length} duplicate matches`);
    }

    if (matches && matches.length > 0) {
      console.log(`Found ${matches.length} empty selector(s) in ${filePath}`);

      if (config.verbose) {
        matches.forEach(match => {
          console.log(`  - ${match.trim()}`);
        });
      }

      return {
        path: filePath,
        content,
        matches,
        styleBlocks: fileExt === '.astro' ? styleBlocks : null
      };
    }

    return null;
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
    return null;
  }
}

// Function to fix empty selectors in a file
function fixFile(fileInfo) {
  if (config.dryRun) {
    console.log(`[DRY RUN] Would fix ${fileInfo.path}`);
    return;
  }

  try {
    const fileExt = path.extname(fileInfo.path).toLowerCase();
    let fixedContent = fileInfo.content;

    if (config.debug) {
      console.log(`Fixing file: ${fileInfo.path} (${fileExt})`);
      console.log(`Found ${fileInfo.matches.length} matches to fix`);
    }

    if (fileExt === '.astro' && fileInfo.styleBlocks) {
      // For .astro files, we need to fix each style block separately
      const styleMatches = fixedContent.match(emptySelectorsRegexAstro);

      if (styleMatches) {
        if (config.debug) {
          console.log(`Found ${styleMatches.length} style blocks to fix in ${fileInfo.path}`);
        }

        for (let i = 0; i < styleMatches.length; i++) {
          const originalBlock = styleMatches[i];
          let fixedBlock = fileInfo.styleBlocks[i];

          if (config.debug) {
            console.log(`Fixing style block ${i + 1} in ${fileInfo.path}`);
            console.log(`Original block: ${originalBlock.substring(0, 100)}...`);
          }

          // Fix empty selectors in this block
          let fixCount = 0;
          fileInfo.matches.forEach(match => {
            if (fixedBlock.includes(match)) {
              const selector = match.replace('{', '').trim();
              const replacement = `/* Empty selector removed: ${selector} */`;

              if (config.debug) {
                console.log(`Replacing "${match}" with "${replacement}"`);
              }

              fixedBlock = fixedBlock.replace(match, replacement);
              fixCount++;
            }
          });

          if (config.debug) {
            console.log(`Fixed ${fixCount} empty selectors in style block ${i + 1}`);
          }

          // Replace the original block with the fixed one
          const newBlock = originalBlock.replace(/<style([^>]*)>([\s\S]*?)<\/style>/,
            (_, attrs, _content) => `<style${attrs}>${fixedBlock}</style>`);

          if (config.debug) {
            console.log(`New block: ${newBlock.substring(0, 100)}...`);
          }

          fixedContent = fixedContent.replace(originalBlock, newBlock);
        }
      }
    } else {
      // For CSS/SCSS files, replace directly
      if (config.debug) {
        console.log(`Fixing CSS/SCSS file: ${fileInfo.path}`);
      }

      let fixCount = 0;
      fileInfo.matches.forEach(match => {
        const selector = match.replace('{', '').trim();
        const replacement = `/* Empty selector removed: ${selector} */`;

        if (config.debug) {
          console.log(`Replacing "${match}" with "${replacement}"`);
        }

        fixedContent = fixedContent.replace(match, replacement);
        fixCount++;
      });

      if (config.debug) {
        console.log(`Fixed ${fixCount} empty selectors in ${fileInfo.path}`);
      }
    }

    // Write the fixed content back to the file
    fs.writeFileSync(fileInfo.path, fixedContent, 'utf8');
    console.log(`Fixed ${fileInfo.path}`);
  } catch (error) {
    console.error(`Error fixing file ${fileInfo.path}:`, error.message);
  }
}

// Function to scan a directory recursively
function scanDirectory(dirPath) {
  try {
    if (config.debug) {
      console.log(`Scanning directory: ${dirPath}`);
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    if (config.debug) {
      console.log(`Found ${entries.length} entries in ${dirPath}`);
    }

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (config.debug) {
          console.log(`Found directory: ${entry.name}`);
        }
        scanDirectory(fullPath);
      } else if (entry.isFile() && config.extensions.includes(path.extname(entry.name).toLowerCase())) {
        if (config.debug) {
          console.log(`Found file with matching extension: ${entry.name}`);
        }
        const fileInfo = scanFile(fullPath);

        if (fileInfo) {
          fixFile(fileInfo);
        } else if (config.debug) {
          console.log(`No empty selectors found in ${fullPath}`);
        }
      } else if (config.debug) {
        console.log(`Skipping ${entry.name} (not a matching file)`);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error.message);
  }
}

// Main function
function main() {
  console.log('CSS Fix Script');
  console.log('==============');
  console.log(`Mode: ${config.dryRun ? 'Dry Run' : 'Fix'}`);
  console.log(`Directories: ${config.directories.join(', ')}`);
  console.log(`Extensions: ${config.extensions.join(', ')}`);
  console.log(`Debug: ${config.debug ? 'Enabled' : 'Disabled'}`);
  console.log('');

  // Check if dist directory exists
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) {
    console.warn(`Warning: 'dist' directory does not exist. This may indicate that the build has not been run yet.`);
  }

  // Scan directories
  let scannedDirs = 0;
  let skippedDirs = 0;

  for (const dir of config.directories) {
    const dirPath = path.join(rootDir, dir);

    if (fs.existsSync(dirPath)) {
      console.log(`Scanning ${dirPath}...`);
      scanDirectory(dirPath);
      scannedDirs++;
    } else {
      console.warn(`Directory ${dirPath} does not exist, skipping.`);
      skippedDirs++;
    }
  }

  console.log('');
  console.log(`Summary:`);
  console.log(`- Scanned directories: ${scannedDirs}`);
  console.log(`- Skipped directories: ${skippedDirs}`);
  console.log('Done!');
}

// Run the script
main();
