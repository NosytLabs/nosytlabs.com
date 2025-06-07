#!/usr/bin/env node

/**
 * Quick Site Validation for NosytLabs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🧪 NosytLabs Quick Site Validation\n');

function findFiles(dir, pattern) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;

  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...findFiles(fullPath, pattern));
        } else if (stat.isFile() && pattern.test(item)) {
          files.push(fullPath);
        }
      } catch (error) {
        // Skip files we can't access
      }
    });
  } catch (error) {
    // Skip directories we can't read
  }

  return files;
}

function calculateTotalSize(files) {
  return files.reduce((total, file) => {
    try {
      const stat = fs.statSync(file);
      return total + stat.size;
    } catch (error) {
      return total;
    }
  }, 0);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 1. Check build structure
console.log('🏗️  Checking build structure...');
const distPath = path.join(rootDir, 'dist');
const buildExists = fs.existsSync(distPath);
console.log(`   Build directory: ${buildExists ? '✅ Found' : '❌ Missing'}`);

if (buildExists) {
  // Check essential pages
  const essentialPages = [
    'index.html',
    'services.html', 
    'projects.html',
    'content-creation.html',
    '3d-printing.html',
    'passive-income.html',
    'crypto-mining.html',
    'nosytos95.html'
  ];

  let pagesFound = 0;
  essentialPages.forEach(page => {
    const pagePath = path.join(distPath, page);
    const exists = fs.existsSync(pagePath);
    console.log(`   ${page}: ${exists ? '✅ Found' : '❌ Missing'}`);
    if (exists) pagesFound++;
  });

  console.log(`   📊 Pages: ${pagesFound}/${essentialPages.length} (${Math.round((pagesFound/essentialPages.length)*100)}%)`);
}

// 2. Check assets
console.log('\n📁 Checking assets...');
const publicPath = path.join(rootDir, 'public');
const assetChecks = {
  'Favicon': fs.existsSync(path.join(publicPath, 'images', 'favicon.svg')),
  'Logo': fs.existsSync(path.join(publicPath, 'images', 'nosytlabs-logo-2025.svg')),
  'OG Image': fs.existsSync(path.join(publicPath, 'images', 'nosytlabs-og.svg')),
  'Scripts': fs.existsSync(path.join(publicPath, 'scripts')),
  'Styles': fs.existsSync(path.join(publicPath, 'styles'))
};

Object.entries(assetChecks).forEach(([asset, exists]) => {
  console.log(`   ${asset}: ${exists ? '✅ Found' : '⚠️  Missing'}`);
});

// 3. Check performance features
console.log('\n⚡ Checking performance features...');
const scriptsPath = path.join(publicPath, 'scripts');
const lazyFiles = findFiles(scriptsPath, /lazy.*\.js$/);
const performanceFiles = findFiles(scriptsPath, /performance/);
const a11yFiles = findFiles(scriptsPath, /a11y|accessibility/);

console.log(`   Lazy loading: ${lazyFiles.length > 0 ? '✅ Implemented' : '⚠️  Missing'}`);
console.log(`   Performance scripts: ${performanceFiles.length > 0 ? '✅ Found' : '⚠️  Missing'}`);
console.log(`   Accessibility scripts: ${a11yFiles.length > 0 ? '✅ Found' : '⚠️  Missing'}`);

// 4. Check bundle sizes
console.log('\n📦 Checking bundle sizes...');
if (buildExists) {
  const jsFiles = findFiles(distPath, /\.js$/);
  const cssFiles = findFiles(distPath, /\.css$/);
  const jsSize = calculateTotalSize(jsFiles);
  const cssSize = calculateTotalSize(cssFiles);
  
  console.log(`   JavaScript: ${jsFiles.length} files (${formatBytes(jsSize)})`);
  console.log(`   CSS: ${cssFiles.length} files (${formatBytes(cssSize)})`);
  console.log(`   Total: ${formatBytes(jsSize + cssSize)}`);
}

// 5. Check image optimization
console.log('\n🖼️  Checking image optimization...');
const imagesPath = path.join(publicPath, 'images');
const webpFiles = findFiles(imagesPath, /\.webp$/);
const avifFiles = findFiles(imagesPath, /\.avif$/);
const totalImages = findFiles(imagesPath, /\.(jpg|jpeg|png|webp|avif|svg)$/);

console.log(`   WebP files: ${webpFiles.length}`);
console.log(`   AVIF files: ${avifFiles.length}`);
console.log(`   Total images: ${totalImages.length}`);

const modernFormats = webpFiles.length + avifFiles.length;
const optimizationRatio = totalImages.length > 0 ? (modernFormats / totalImages.length) * 100 : 0;
console.log(`   Modern format ratio: ${Math.round(optimizationRatio)}%`);

// 6. Check accessibility features
console.log('\n♿ Checking accessibility...');
if (buildExists) {
  const htmlFiles = findFiles(distPath, /\.html$/);
  let totalImages = 0;
  let imagesWithAlt = 0;
  let ariaCount = 0;

  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check alt text
      const imgMatches = content.match(/<img[^>]*>/g) || [];
      totalImages += imgMatches.length;
      imgMatches.forEach(img => {
        if (img.includes('alt=')) {
          imagesWithAlt++;
        }
      });

      // Check ARIA labels
      const ariaMatches = content.match(/aria-\w+=/g) || [];
      ariaCount += ariaMatches.length;
    } catch (error) {
      // Skip files we can't read
    }
  });

  const altTextCoverage = totalImages > 0 ? (imagesWithAlt / totalImages) * 100 : 100;
  console.log(`   Alt text coverage: ${Math.round(altTextCoverage)}% (${imagesWithAlt}/${totalImages})`);
  console.log(`   ARIA attributes: ${ariaCount}`);
}

// 7. Check functionality
console.log('\n⚙️  Checking functionality...');
const srcPath = path.join(rootDir, 'src');
const utilFiles = findFiles(srcPath, /\.js$/);

const hasYouTubeAPI = utilFiles.some(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('youtube') || content.includes('YouTube');
  } catch {
    return false;
  }
});

const hasAnalytics = utilFiles.some(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('analytics') || content.includes('vercel');
  } catch {
    return false;
  }
});

console.log(`   YouTube API: ${hasYouTubeAPI ? '✅ Found' : '⚠️  Missing'}`);
console.log(`   Analytics: ${hasAnalytics ? '✅ Found' : '⚠️  Missing'}`);

// 8. Generate summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('====================');

const checks = [
  buildExists,
  assetChecks['Scripts'],
  assetChecks['Styles'],
  lazyFiles.length > 0,
  a11yFiles.length > 0,
  optimizationRatio > 30,
  hasYouTubeAPI,
  hasAnalytics
];

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;
const overallScore = (passedChecks / totalChecks) * 100;

console.log(`Overall Score: ${Math.round(overallScore)}% (${passedChecks}/${totalChecks} checks passed)`);

if (overallScore >= 80) {
  console.log('✅ Site validation PASSED - Ready for testing!');
} else if (overallScore >= 60) {
  console.log('⚠️  Site validation PARTIAL - Some improvements needed');
} else {
  console.log('❌ Site validation FAILED - Significant issues found');
}

console.log('\n🎯 Next Steps:');
console.log('1. Run Playwright tests for interactive validation');
console.log('2. Test responsive design on multiple devices');
console.log('3. Validate forms and user interactions');
console.log('4. Check cross-browser compatibility');
console.log('5. Performance test with real users');

console.log('\n✅ Quick validation completed!');
