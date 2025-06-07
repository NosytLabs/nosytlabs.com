#!/usr/bin/env node

/**
 * Simple Deployment Check for NosytLabs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 NosytLabs Deployment Check\n');

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

// 1. Check build status
console.log('🏗️  Checking build status...');
const distPath = path.join(rootDir, 'dist');
const buildExists = fs.existsSync(distPath);
console.log(`   Build directory: ${buildExists ? '✅ Found' : '❌ Missing'}`);

if (!buildExists) {
  console.log('❌ Build not found. Run npm run build first.');
  process.exit(1);
}

// 2. Check essential pages
console.log('\n📄 Checking essential pages...');
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

// 3. Check build size
console.log('\n📦 Checking build size...');
const jsFiles = findFiles(distPath, /\.js$/);
const cssFiles = findFiles(distPath, /\.css$/);
const htmlFiles = findFiles(distPath, /\.html$/);
const imageFiles = findFiles(distPath, /\.(png|jpg|jpeg|webp|svg|ico)$/);

const jsSize = calculateTotalSize(jsFiles);
const cssSize = calculateTotalSize(cssFiles);
const htmlSize = calculateTotalSize(htmlFiles);
const imageSize = calculateTotalSize(imageFiles);
const totalSize = jsSize + cssSize + htmlSize + imageSize;

console.log(`   JavaScript: ${jsFiles.length} files (${formatBytes(jsSize)})`);
console.log(`   CSS: ${cssFiles.length} files (${formatBytes(cssSize)})`);
console.log(`   HTML: ${htmlFiles.length} files (${formatBytes(htmlSize)})`);
console.log(`   Images: ${imageFiles.length} files (${formatBytes(imageSize)})`);
console.log(`   📊 Total: ${formatBytes(totalSize)}`);

// 4. Check Vercel configuration
console.log('\n⚙️  Checking Vercel configuration...');
const vercelConfigPath = path.join(rootDir, 'vercel.json');
const vercelConfigExists = fs.existsSync(vercelConfigPath);
console.log(`   vercel.json: ${vercelConfigExists ? '✅ Found' : '❌ Missing'}`);

if (vercelConfigExists) {
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log(`   Clean URLs: ${config.cleanUrls ? '✅ Enabled' : '⚠️  Disabled'}`);
  console.log(`   Security headers: ${config.headers ? '✅ Configured' : '⚠️  Missing'}`);
  console.log(`   Image optimization: ${config.images ? '✅ Configured' : '⚠️  Missing'}`);
}

// 5. Check analytics integration
console.log('\n📊 Checking analytics integration...');
const analyticsComponent = path.join(rootDir, 'src', 'components', 'VercelAnalytics.astro');
const hasAnalytics = fs.existsSync(analyticsComponent);
console.log(`   Vercel Analytics: ${hasAnalytics ? '✅ Integrated' : '❌ Missing'}`);

const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const hasVercelDeps = packageJson.dependencies['@vercel/analytics'] && packageJson.dependencies['@vercel/speed-insights'];
console.log(`   Analytics dependencies: ${hasVercelDeps ? '✅ Installed' : '❌ Missing'}`);

// 6. Check SEO and meta tags
console.log('\n🔍 Checking SEO and meta tags...');
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const hasTitle = indexContent.includes('<title>');
  const hasDescription = indexContent.includes('name="description"');
  const hasOG = indexContent.includes('property="og:');
  const hasTwitter = indexContent.includes('name="twitter:');
  const hasCanonical = indexContent.includes('rel="canonical"');
  const hasSitemap = fs.existsSync(path.join(rootDir, 'public', 'sitemap.xml'));
  
  console.log(`   Title tag: ${hasTitle ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Meta description: ${hasDescription ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Open Graph: ${hasOG ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Twitter Cards: ${hasTwitter ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Canonical URL: ${hasCanonical ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Sitemap: ${hasSitemap ? '✅ Found' : '❌ Missing'}`);
}

// 7. Check performance features
console.log('\n⚡ Checking performance features...');
const publicPath = path.join(rootDir, 'public');
const lazyFiles = findFiles(path.join(publicPath, 'scripts'), /lazy.*\.js$/);
const performanceFiles = findFiles(path.join(publicPath, 'scripts'), /performance/);
const swFiles = findFiles(publicPath, /sw\.js$|service-worker\.js$/);

console.log(`   Lazy loading: ${lazyFiles.length > 0 ? '✅ Implemented' : '⚠️  Missing'}`);
console.log(`   Performance scripts: ${performanceFiles.length > 0 ? '✅ Found' : '⚠️  Missing'}`);
console.log(`   Service worker: ${swFiles.length > 0 ? '✅ Found' : '⚠️  Missing'}`);

// 8. Check accessibility features
console.log('\n♿ Checking accessibility features...');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const hasAriaLabels = indexContent.includes('aria-');
  const hasAltText = indexContent.includes('alt=');
  const hasSkipLinks = indexContent.includes('skip');
  const a11yFiles = findFiles(path.join(publicPath, 'scripts'), /a11y|accessibility/);
  
  console.log(`   ARIA labels: ${hasAriaLabels ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Alt text: ${hasAltText ? '✅ Found' : '❌ Missing'}`);
  console.log(`   Skip links: ${hasSkipLinks ? '✅ Found' : '❌ Missing'}`);
  console.log(`   A11y scripts: ${a11yFiles.length > 0 ? '✅ Found' : '⚠️  Missing'}`);
}

// 9. Generate deployment score
console.log('\n📊 DEPLOYMENT READINESS SCORE');
console.log('==============================');

const checks = [
  buildExists,
  pagesFound >= 6, // At least 6 essential pages
  totalSize < 10 * 1024 * 1024, // Less than 10MB
  vercelConfigExists,
  hasAnalytics,
  hasVercelDeps,
  lazyFiles.length > 0,
  performanceFiles.length > 0
];

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;
const score = Math.round((passedChecks / totalChecks) * 100);

console.log(`Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`);

if (score >= 90) {
  console.log('✅ EXCELLENT - Ready for production deployment!');
} else if (score >= 75) {
  console.log('✅ GOOD - Ready for deployment with minor optimizations');
} else if (score >= 60) {
  console.log('⚠️  FAIR - Consider addressing issues before deployment');
} else {
  console.log('❌ POOR - Significant issues need resolution');
}

// 10. Deployment instructions
console.log('\n🚀 DEPLOYMENT INSTRUCTIONS');
console.log('==========================');
console.log('1. Ensure all checks above are passing');
console.log('2. Install Vercel CLI: npm i -g vercel');
console.log('3. Login to Vercel: vercel login');
console.log('4. Deploy: vercel --prod');
console.log('5. Configure custom domain in Vercel dashboard');
console.log('6. Set up monitoring and alerts');

console.log('\n📋 MONITORING SETUP');
console.log('===================');
console.log('1. Vercel Analytics: Automatically enabled');
console.log('2. Speed Insights: Automatically enabled');
console.log('3. Error tracking: Monitor Vercel dashboard');
console.log('4. Uptime monitoring: Set up external service');
console.log('5. Performance monitoring: Use Lighthouse CI');

console.log('\n✅ Deployment check completed!');

// Save deployment report
const deploymentReport = {
  timestamp: new Date().toISOString(),
  score: score,
  passedChecks: passedChecks,
  totalChecks: totalChecks,
  buildInfo: {
    size: formatBytes(totalSize),
    pages: htmlFiles.length,
    jsFiles: jsFiles.length,
    cssFiles: cssFiles.length,
    imageFiles: imageFiles.length
  },
  readyForDeployment: score >= 75
};

fs.writeFileSync(path.join(rootDir, 'deployment-report.json'), JSON.stringify(deploymentReport, null, 2));
console.log('\n📄 Deployment report saved to deployment-report.json');
