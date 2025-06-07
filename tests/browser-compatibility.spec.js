import { test, expect } from '@playwright/test';

/**
 * Browser Compatibility and Cross-Platform Testing
 * Tests functionality across different browsers and platforms
 */

test.describe('Browser Compatibility Testing', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('CSS Grid and Flexbox support', async ({ page, browserName }) => {
    // Test CSS Grid support
    const gridSupport = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.style.display = 'grid';
      return testElement.style.display === 'grid';
    });

    expect(gridSupport, `CSS Grid should be supported in ${browserName}`).toBe(true);

    // Test Flexbox support
    const flexSupport = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.style.display = 'flex';
      return testElement.style.display === 'flex';
    });

    expect(flexSupport, `Flexbox should be supported in ${browserName}`).toBe(true);

    // Test CSS Custom Properties (CSS Variables)
    const customPropsSupport = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.style.setProperty('--test-var', 'test');
      return testElement.style.getPropertyValue('--test-var') === 'test';
    });

    expect(customPropsSupport, `CSS Custom Properties should be supported in ${browserName}`).toBe(true);
  });

  test('JavaScript ES6+ features', async ({ page, browserName }) => {
    const jsFeatures = await page.evaluate(() => {
      const results = {};

      // Test arrow functions
      try {
        eval('() => {}');
        results.arrowFunctions = true;
      } catch (e) {
        results.arrowFunctions = false;
      }

      // Test const/let
      try {
        eval('const test = 1; let test2 = 2;');
        results.constLet = true;
      } catch (e) {
        results.constLet = false;
      }

      // Test template literals
      try {
        eval('`template ${1} literal`');
        results.templateLiterals = true;
      } catch (e) {
        results.templateLiterals = false;
      }

      // Test async/await
      try {
        eval('async function test() { await Promise.resolve(); }');
        results.asyncAwait = true;
      } catch (e) {
        results.asyncAwait = false;
      }

      return results;
    });

    expect(jsFeatures.arrowFunctions, `Arrow functions should be supported in ${browserName}`).toBe(true);
    expect(jsFeatures.constLet, `const/let should be supported in ${browserName}`).toBe(true);
    expect(jsFeatures.templateLiterals, `Template literals should be supported in ${browserName}`).toBe(true);
    expect(jsFeatures.asyncAwait, `async/await should be supported in ${browserName}`).toBe(true);
  });

  test('Font loading and rendering', async ({ page, browserName }) => {
    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);

    // Check if custom fonts are loaded
    const fontFaces = await page.evaluate(() => {
      const fonts = [];
      for (const font of document.fonts) {
        fonts.push({
          family: font.family,
          status: font.status,
          weight: font.weight,
          style: font.style
        });
      }
      return fonts;
    });

    // Check for common web fonts
    const hasWebFonts = fontFaces.some(font =>
      font.family.includes('Inter') ||
      font.family.includes('Roboto') ||
      font.family.includes('Open Sans')
    );

    if (hasWebFonts) {
      const loadedFonts = fontFaces.filter(font => font.status === 'loaded');
      expect(loadedFonts.length, `Fonts should load properly in ${browserName}`).toBeGreaterThan(0);
    }

    // Test font fallbacks
    const bodyFont = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).fontFamily;
    });

    expect(bodyFont, `Body should have font family defined in ${browserName}`).toBeTruthy();
  });

  test('Image format support and loading', async ({ page, browserName }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < Math.min(imageCount, 10); i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src) {
        // Check if image loads successfully
        const isLoaded = await img.evaluate((el) => {
          return el.complete && el.naturalHeight !== 0;
        });

        if (!isLoaded) {
          // Wait a bit more for slow loading images
          await page.waitForTimeout(2000);
          const isLoadedAfterWait = await img.evaluate((el) => {
            return el.complete && el.naturalHeight !== 0;
          });

          expect(isLoadedAfterWait, `Image ${src} should load in ${browserName}`).toBe(true);
        }

        // Check for modern image format support
        if (src.includes('.webp')) {
          const webpSupport = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
          });

          if (!webpSupport) {
            console.warn(`WebP not supported in ${browserName}, fallback should be provided`);
          }
        }
      }
    }
  });

  test('CSS animations and transitions', async ({ page, browserName }) => {
    // Check for elements with animations
    const animatedElements = page.locator('[class*="animate"], [style*="animation"], [style*="transition"]');
    const animatedCount = await animatedElements.count();

    if (animatedCount > 0) {
      const firstAnimated = animatedElements.first();

      // Check if animations are working
      const animationSupport = await firstAnimated.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.animationName !== 'none' || styles.transitionProperty !== 'none';
      });

      if (animationSupport) {
        // Check for reduced motion preference
        const prefersReducedMotion = await page.evaluate(() => {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        });

        if (prefersReducedMotion) {
          console.log(`User prefers reduced motion in ${browserName}`);
        }
      }
    }
  });

  test('Local storage and session storage', async ({ page, browserName }) => {
    const storageSupport = await page.evaluate(() => {
      const results = {};

      // Test localStorage
      try {
        localStorage.setItem('test', 'value');
        results.localStorage = localStorage.getItem('test') === 'value';
        localStorage.removeItem('test');
      } catch (e) {
        results.localStorage = false;
      }

      // Test sessionStorage
      try {
        sessionStorage.setItem('test', 'value');
        results.sessionStorage = sessionStorage.getItem('test') === 'value';
        sessionStorage.removeItem('test');
      } catch (e) {
        results.sessionStorage = false;
      }

      return results;
    });

    expect(storageSupport.localStorage, `localStorage should be supported in ${browserName}`).toBe(true);
    expect(storageSupport.sessionStorage, `sessionStorage should be supported in ${browserName}`).toBe(true);
  });

  test('Form input types and validation', async ({ page, browserName }) => {
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    const supportedTypes = [];

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const type = await input.getAttribute('type');

      if (type && !supportedTypes.includes(type)) {
        const isSupported = await input.evaluate((el, inputType) => {
          const testInput = document.createElement('input');
          testInput.type = inputType;
          return testInput.type === inputType;
        }, type);

        supportedTypes.push({ type, supported: isSupported });
      }
    }

    // Check for HTML5 input types
    const html5Types = ['email', 'url', 'tel', 'number', 'date', 'time', 'color'];
    for (const type of html5Types) {
      const typeSupport = await page.evaluate((inputType) => {
        const testInput = document.createElement('input');
        testInput.type = inputType;
        return testInput.type === inputType;
      }, type);

      if (!typeSupport) {
        console.warn(`Input type "${type}" not supported in ${browserName}`);
      }
    }
  });

  test('Viewport and media queries', async ({ page, browserName }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Check if media queries are working
      const mediaQuerySupport = await page.evaluate((vp) => {
        const mq = window.matchMedia(`(max-width: ${vp.width}px)`);
        return typeof mq.matches === 'boolean';
      }, viewport);

      expect(mediaQuerySupport, `Media queries should work in ${browserName}`).toBe(true);

      // Check if layout adapts to viewport
      const header = page.locator('header').first();
      if (await header.isVisible()) {
        const headerBox = await header.boundingBox();
        expect(headerBox.width, `Header should adapt to viewport in ${browserName}`).toBeLessThanOrEqual(viewport.width);
      }
    }
  });
});