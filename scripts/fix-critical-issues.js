#!/usr/bin/env node

/**
 * Critical Issues Fix Script
 * Addresses the most urgent issues found in the comprehensive audit
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  const border = '='.repeat(60);
  log(`\n${border}`, 'cyan');
  log(`${message}`, 'bright');
  log(`${border}`, 'cyan');
}

function logSection(message) {
  log(`\n${'─'.repeat(40)}`, 'blue');
  log(`${message}`, 'blue');
  log(`${'─'.repeat(40)}`, 'blue');
}

async function fixSecurityVulnerabilities() {
  logSection('🚨 Fixing Security Vulnerabilities');
  
  try {
    log('Running npm audit fix...', 'blue');
    execSync('npm audit fix', { stdio: 'inherit' });
    log('✅ Security vulnerabilities fixed', 'green');
    return true;
  } catch (error) {
    log('⚠️ Some vulnerabilities require manual intervention', 'yellow');
    log('Run: npm audit fix --force (may cause breaking changes)', 'yellow');
    return false;
  }
}

async function createSecurityHeaders() {
  logSection('🔒 Adding Security Headers');
  
  const securityConfig = `
// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https:;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};`;

  const configPath = path.join(process.cwd(), 'src', 'config', 'security.js');
  fs.writeFileSync(configPath, securityConfig);
  
  log('✅ Security headers configuration created', 'green');
  log(`   📁 ${configPath}`, 'blue');
  
  return true;
}

async function createPWAManifest() {
  logSection('📱 Creating PWA Manifest');
  
  const manifest = {
    name: 'NosytLabs - Notable Opportunities Shape Your Tomorrow',
    short_name: 'NosytLabs',
    description: 'Innovative digital solutions including web development, content creation, 3D printing services, and passive income resources.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#7C3AED',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'technology'],
    lang: 'en',
    dir: 'ltr',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    screenshots: [
      {
        src: '/images/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/images/screenshot-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  };
  
  const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log('✅ PWA manifest created', 'green');
  log(`   📁 ${manifestPath}`, 'blue');
  
  return true;
}

async function createServiceWorker() {
  logSection('⚙️ Creating Service Worker');
  
  const serviceWorker = `
// NosytLabs Service Worker
const CACHE_NAME = 'nosytlabs-v1';
const STATIC_CACHE = 'nosytlabs-static-v1';
const DYNAMIC_CACHE = 'nosytlabs-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/styles/consolidated-styles.css',
  '/scripts/core/performance-monitor.js',
  '/images/logo.svg',
  '/images/favicon.svg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(fetchResponse => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            const responseToCache = fetchResponse.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return fetchResponse;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});`;

  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  fs.writeFileSync(swPath, serviceWorker);
  
  log('✅ Service worker created', 'green');
  log(`   📁 ${swPath}`, 'blue');
  
  return true;
}

async function createOfflinePage() {
  logSection('📄 Creating Offline Page');
  
  const offlineHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - NosytLabs</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #7C3AED 0%, #F97316 100%);
            color: white;
            text-align: center;
        }
        .container {
            max-width: 400px;
            padding: 2rem;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 2rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
        }
        h1 {
            margin: 0 0 1rem;
            font-size: 2rem;
        }
        p {
            margin: 0 0 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">NL</div>
        <h1>You're Offline</h1>
        <p>It looks like you've lost your internet connection. Don't worry, you can still browse some of our cached content.</p>
        <a href="/" class="btn">Try Again</a>
    </div>
</body>
</html>`;

  const offlinePath = path.join(process.cwd(), 'public', 'offline.html');
  fs.writeFileSync(offlinePath, offlineHtml);
  
  log('✅ Offline page created', 'green');
  log(`   📁 ${offlinePath}`, 'blue');
  
  return true;
}

async function updateRobotsTxt() {
  logSection('🤖 Updating robots.txt');
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://nosytlabs.com/sitemap.xml
Sitemap: https://nosytlabs.com/sitemap-blog.xml
Sitemap: https://nosytlabs.com/sitemap-projects.xml
Sitemap: https://nosytlabs.com/sitemap-services.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_astro/
Disallow: /test-results/

# Allow important resources
Allow: /images/
Allow: /styles/
Allow: /scripts/

# Crawl delay
Crawl-delay: 1`;

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  
  log('✅ robots.txt updated', 'green');
  log(`   📁 ${robotsPath}`, 'blue');
  
  return true;
}

async function generateSummaryReport() {
  logSection('📊 Generating Fix Summary');
  
  const report = {
    timestamp: new Date().toISOString(),
    fixesApplied: [
      'Security vulnerabilities addressed',
      'Security headers configuration created',
      'PWA manifest implemented',
      'Service worker created',
      'Offline page added',
      'robots.txt updated'
    ],
    nextSteps: [
      'Update Astro config to include security headers',
      'Register service worker in main application',
      'Test PWA functionality',
      'Verify security headers in production',
      'Run security audit again'
    ],
    manualActions: [
      'Replace stock images with custom NosytLabs visuals',
      'Fix mobile navigation issues',
      'Implement error boundaries',
      'Add unit tests for utilities',
      'Complete API documentation'
    ]
  };
  
  const reportPath = path.join(process.cwd(), 'critical-fixes-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log('📄 Fix summary report saved', 'green');
  log(`   📁 ${reportPath}`, 'blue');
  
  return report;
}

async function main() {
  logHeader('🚨 NosytLabs Critical Issues Fix');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    // Run all fixes
    results.push({ name: 'Security Vulnerabilities', success: await fixSecurityVulnerabilities() });
    results.push({ name: 'Security Headers', success: await createSecurityHeaders() });
    results.push({ name: 'PWA Manifest', success: await createPWAManifest() });
    results.push({ name: 'Service Worker', success: await createServiceWorker() });
    results.push({ name: 'Offline Page', success: await createOfflinePage() });
    results.push({ name: 'robots.txt', success: await updateRobotsTxt() });
    
    // Generate summary
    const report = await generateSummaryReport();
    
    // Final results
    logHeader('📊 Fix Results Summary');
    
    results.forEach(result => {
      const icon = result.success ? '✅' : '❌';
      const color = result.success ? 'green' : 'red';
      log(`   ${icon} ${result.name}`, color);
    });
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    log(`\n🎯 Overall Status: ${successCount}/${totalCount} fixes applied`, 
        successCount === totalCount ? 'green' : 'yellow');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    log(`⏱️ Fix process completed in ${duration} seconds`, 'blue');
    
    logSection('📋 Next Manual Steps');
    log('1. Update astro.config.mjs to include security headers', 'yellow');
    log('2. Register service worker in BaseLayout.astro', 'yellow');
    log('3. Test PWA functionality on mobile devices', 'yellow');
    log('4. Replace stock images with custom visuals', 'yellow');
    log('5. Fix mobile navigation issues', 'yellow');
    
    process.exit(successCount === totalCount ? 0 : 1);
    
  } catch (error) {
    log(`💥 Critical fix process failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Fix process interrupted by user', 'yellow');
  process.exit(1);
});

// Run the main function
main().catch(error => {
  log(`💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
