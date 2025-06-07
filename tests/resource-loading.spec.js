import { test, expect } from '@playwright/test';

/**
 * Resource Loading and Performance Testing
 * Tests page load performance, resource optimization, and loading behavior
 */

test.describe('Resource Loading and Performance', () => {

  test.beforeEach(async ({ page }) => {
    // Clear cache and start fresh
    await page.context().clearCookies();
  });

  test('Page load performance metrics', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Page should load within reasonable time (5 seconds)
    expect(loadTime, 'Page should load within 5 seconds').toBeLessThan(5000);

    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        domInteractive: navigation.domInteractive - navigation.navigationStart,
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
      };
    });

    console.log('Performance Metrics:', performanceMetrics);

    // DOM should be interactive quickly
    expect(performanceMetrics.domInteractive, 'DOM should be interactive within 2 seconds').toBeLessThan(2000);

    // First contentful paint should happen quickly
    if (performanceMetrics.firstContentfulPaint > 0) {
      expect(performanceMetrics.firstContentfulPaint, 'First contentful paint should be under 1.5 seconds').toBeLessThan(1500);
    }
  });

  test('CSS resource loading and optimization', async ({ page }) => {
    const cssRequests = [];

    // Monitor CSS requests
    page.on('request', request => {
      if (request.resourceType() === 'stylesheet') {
        cssRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    const cssResponses = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'stylesheet') {
        cssResponses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Found ${cssRequests.length} CSS requests`);
    console.log(`Received ${cssResponses.length} CSS responses`);

    // Check that CSS files load successfully
    for (const response of cssResponses) {
      expect(response.status, `CSS file ${response.url} should load successfully`).toBeLessThan(400);
    }

    // Check for CSS optimization
    const largeCssFiles = cssResponses.filter(response => parseInt(response.size) > 100000); // 100KB
    if (largeCssFiles.length > 0) {
      console.warn(`Large CSS files detected (>100KB):`, largeCssFiles.map(f => f.url));
    }

    // Should not have too many CSS requests (indicates lack of bundling)
    expect(cssRequests.length, 'Should not have excessive CSS requests').toBeLessThan(10);
  });

  test('JavaScript resource loading and errors', async ({ page }) => {
    const jsErrors = [];
    const jsRequests = [];

    // Monitor JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });

    // Monitor JS requests
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        jsRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    const jsResponses = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'script') {
        jsResponses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Found ${jsRequests.length} JavaScript requests`);
    console.log(`Received ${jsResponses.length} JavaScript responses`);

    // Should not have JavaScript errors
    if (jsErrors.length > 0) {
      console.log('JavaScript errors found:', jsErrors);
    }
    expect(jsErrors.length, `JavaScript errors found: ${jsErrors.join(', ')}`).toBe(0);

    // Check that JS files load successfully
    for (const response of jsResponses) {
      expect(response.status, `JS file ${response.url} should load successfully`).toBeLessThan(400);
    }

    // Check for JS optimization
    const largeJsFiles = jsResponses.filter(response => parseInt(response.size) > 250000); // 250KB
    if (largeJsFiles.length > 0) {
      console.warn(`Large JavaScript files detected (>250KB):`, largeJsFiles.map(f => f.url));
    }
  });

  test('Image loading and optimization', async ({ page }) => {
    const imageRequests = [];
    const imageResponses = [];

    // Monitor image requests
    page.on('request', request => {
      if (request.resourceType() === 'image') {
        imageRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    page.on('response', response => {
      if (response.request().resourceType() === 'image') {
        imageResponses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0,
          contentType: response.headers()['content-type'] || ''
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Found ${imageRequests.length} image requests`);
    console.log(`Received ${imageResponses.length} image responses`);

    // Check that images load successfully
    for (const response of imageResponses) {
      expect(response.status, `Image ${response.url} should load successfully`).toBeLessThan(400);
    }

    // Check for image optimization
    const largeImages = imageResponses.filter(response => parseInt(response.size) > 1000000); // 1MB
    if (largeImages.length > 0) {
      console.warn(`Large images detected (>1MB):`, largeImages.map(f => ({ url: f.url, size: f.size })));
    }

    // Check for modern image formats
    const modernFormats = imageResponses.filter(response =>
      response.contentType.includes('webp') ||
      response.contentType.includes('avif')
    );

    if (imageResponses.length > 0 && modernFormats.length === 0) {
      console.warn('No modern image formats (WebP/AVIF) detected. Consider optimization.');
    }

    // Verify images on page are actually loaded
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0);
      const src = await img.getAttribute('src');

      expect(isLoaded, `Image ${src} should be loaded and displayed`).toBe(true);
    }
  });

  test('Font loading performance', async ({ page }) => {
    const fontRequests = [];

    // Monitor font requests
    page.on('request', request => {
      if (request.resourceType() === 'font') {
        fontRequests.push({
          url: request.url(),
          method: request.method()
        });
      }
    });

    const fontResponses = [];
    page.on('response', response => {
      if (response.request().resourceType() === 'font') {
        fontResponses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      }
    });

    await page.goto('/');

    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);

    console.log(`Found ${fontRequests.length} font requests`);
    console.log(`Received ${fontResponses.length} font responses`);

    // Check that fonts load successfully
    for (const response of fontResponses) {
      expect(response.status, `Font ${response.url} should load successfully`).toBeLessThan(400);
    }

    // Check font loading strategy
    const fontDisplayValues = await page.evaluate(() => {
      const styles = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.style && rule.style.fontDisplay) {
              styles.push(rule.style.fontDisplay);
            }
          }
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      }
      return styles;
    });

    // Should use font-display for better loading performance
    if (fontRequests.length > 0 && fontDisplayValues.length === 0) {
      console.warn('Consider using font-display CSS property for better font loading performance');
    }
  });

  test('Network request optimization', async ({ page }) => {
    const allRequests = [];

    page.on('request', request => {
      allRequests.push({
        url: request.url(),
        resourceType: request.resourceType(),
        method: request.method()
      });
    });

    const allResponses = [];
    page.on('response', response => {
      allResponses.push({
        url: response.url(),
        status: response.status(),
        resourceType: response.request().resourceType(),
        size: response.headers()['content-length'] || 0,
        cacheControl: response.headers()['cache-control'] || '',
        contentEncoding: response.headers()['content-encoding'] || ''
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log(`Total requests: ${allRequests.length}`);
    console.log(`Total responses: ${allResponses.length}`);

    // Check for failed requests
    const failedRequests = allResponses.filter(response => response.status >= 400);
    expect(failedRequests.length, `Failed requests found: ${JSON.stringify(failedRequests)}`).toBe(0);

    // Check for compression
    const compressibleResponses = allResponses.filter(response =>
      response.resourceType === 'document' ||
      response.resourceType === 'stylesheet' ||
      response.resourceType === 'script'
    );

    const uncompressedResponses = compressibleResponses.filter(response =>
      !response.contentEncoding.includes('gzip') &&
      !response.contentEncoding.includes('br') &&
      parseInt(response.size) > 1000 // Only check files larger than 1KB
    );

    if (uncompressedResponses.length > 0) {
      console.warn(`Uncompressed resources detected:`, uncompressedResponses.map(r => r.url));
    }

    // Check for caching headers
    const cacheableResponses = allResponses.filter(response =>
      response.resourceType === 'stylesheet' ||
      response.resourceType === 'script' ||
      response.resourceType === 'image' ||
      response.resourceType === 'font'
    );

    const uncachedResponses = cacheableResponses.filter(response =>
      !response.cacheControl.includes('max-age') &&
      !response.cacheControl.includes('public')
    );

    if (uncachedResponses.length > 0) {
      console.warn(`Resources without caching headers:`, uncachedResponses.map(r => r.url));
    }

    // Should not have excessive requests
    expect(allRequests.length, 'Should not have excessive network requests').toBeLessThan(100);
  });
});