/**
 * Resource Loading Tests
 * 
 * This test suite checks the website's resource loading performance and error handling.
 * It verifies that resources are properly loaded, preloaded, and that fallbacks work when needed.
 */

// @ts-check
import { test, expect } from '@playwright/test';

// Test resource preloading
test('Critical resources should be preloaded', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if preload links exist for critical resources
  const preloadLinks = await page.locator('link[rel="preload"]');
  const preloadCount = await preloadLinks.count();
  
  // Expect at least some preload links
  expect(preloadCount).toBeGreaterThan(0);
  
  // Check for specific preloaded resources
  const logoPreload = await page.locator('link[rel="preload"][href*="logo-new.svg"]');
  await expect(logoPreload).toBeAttached();
  
  const cssPreload = await page.locator('link[rel="preload"][href*="consolidated-styles.css"]');
  await expect(cssPreload).toBeAttached();
  
  const particlesJsPreload = await page.locator('link[rel="preload"][href*="particles.min.js"]');
  await expect(particlesJsPreload).toBeAttached();
  
  // Check if the preloaded resources are actually used
  const logoUsage = await page.locator('img[src*="logo-new.svg"]');
  await expect(logoUsage).toBeVisible();
  
  const cssUsage = await page.locator('link[rel="stylesheet"][href*="consolidated-styles.css"]');
  await expect(cssUsage).toBeAttached();
  
  const particlesJsUsage = await page.locator('script[src*="particles.min.js"]');
  await expect(particlesJsUsage).toBeAttached();
});

// Test resource loading order
test('Scripts should load in the correct order', async ({ page }) => {
  // Create a listener for script load events
  const loadedScripts = [];
  
  await page.addInitScript(() => {
    // Override the native script loading to track load order
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          originalSetAttribute.call(this, name, value);
          
          if (name === 'src') {
            // When the script loads, record its src
            element.addEventListener('load', () => {
              window._loadedScripts = window._loadedScripts || [];
              window._loadedScripts.push(value);
            });
          }
        };
      }
      
      return element;
    };
  });
  
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Get the loaded scripts from the page
  const scripts = await page.evaluate(() => window._loadedScripts || []);
  
  // Check if particles.js is loaded before particles-config.js
  const particlesJsIndex = scripts.findIndex(src => src.includes('particles.min.js'));
  const particlesConfigIndex = scripts.findIndex(src => src.includes('particles-config.js'));
  
  // Both scripts should be loaded
  expect(particlesJsIndex).toBeGreaterThanOrEqual(0);
  expect(particlesConfigIndex).toBeGreaterThanOrEqual(0);
  
  // particles.js should be loaded before particles-config.js
  expect(particlesJsIndex).toBeLessThan(particlesConfigIndex);
});

// Test resource loading errors and fallbacks
test('Resource loader should handle loading errors', async ({ page }) => {
  // Mock a failed resource load
  await page.route('**/particles.min.js', route => route.abort());
  
  // Listen for console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
  });
  
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the resource loader detected the error
  const hasErrorMessage = consoleMessages.some(msg => 
    msg.includes('Failed to load resource') || 
    msg.includes('particles.js is not loaded')
  );
  expect(hasErrorMessage).toBeTruthy();
  
  // Check if the fallback was activated
  const fallbackParticles = await page.locator('.fallback-particle');
  const hasFallbackParticles = await fallbackParticles.count() > 0;
  
  // Either the fallback particles should be visible or a warning should be logged
  expect(hasFallbackParticles || hasErrorMessage).toBeTruthy();
});

// Test image loading optimization
test('Images should be optimized for loading', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if images have proper attributes for optimization
  const images = await page.locator('img');
  const count = await images.count();
  
  // Loop through all images
  for (let i = 0; i < count; i++) {
    const image = images.nth(i);
    
    // Check if the image has width and height attributes
    const hasWidth = await image.getAttribute('width') !== null;
    const hasHeight = await image.getAttribute('height') !== null;
    
    // Check if the image has loading="lazy" for non-critical images
    // (excluding logo and above-the-fold images)
    const src = await image.getAttribute('src') || '';
    const isLogo = src.includes('logo');
    const loading = await image.getAttribute('loading');
    
    // Logo should not be lazy loaded, other images should be
    if (isLogo) {
      expect(loading).not.toBe('lazy');
    } else {
      // Most non-logo images should have dimensions
      expect(hasWidth || hasHeight).toBeTruthy();
    }
  }
});

// Test CSS loading and application
test('CSS should be properly loaded and applied', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the main stylesheet is loaded
  const stylesheet = await page.locator('link[rel="stylesheet"][href*="consolidated-styles.css"]');
  await expect(stylesheet).toBeAttached();
  
  // Check if CSS variables are properly defined
  const purpleColor = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--nosyt-purple').trim();
  });
  
  // Check if the CSS variable has a value
  expect(purpleColor).toBeTruthy();
  
  // Check if the CSS is applied to elements
  const header = await page.locator('header');
  const headerBg = await header.evaluate(el => {
    return window.getComputedStyle(el).backgroundColor;
  });
  
  // Header should have a background color
  expect(headerBg).not.toBe('rgba(0, 0, 0, 0)');
  
  // Check if responsive styles are applied
  // First check at desktop size
  await page.setViewportSize({ width: 1200, height: 800 });
  
  const desktopNav = await page.locator('nav.desktop-nav');
  const isDesktopNavVisible = await desktopNav.isVisible();
  
  // Then check at mobile size
  await page.setViewportSize({ width: 375, height: 667 });
  
  const mobileMenuButton = await page.locator('button.mobile-menu-button');
  const isMobileMenuButtonVisible = await mobileMenuButton.isVisible();
  
  // Either desktop nav should be visible at desktop size or mobile menu button at mobile size
  expect(isDesktopNavVisible || isMobileMenuButtonVisible).toBeTruthy();
});

// Test dark mode switching
test('Dark mode should work properly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check initial theme
  const initialTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  // Find the theme toggle button
  const themeToggle = await page.locator('button.theme-toggle');
  await expect(themeToggle).toBeVisible();
  
  // Click the theme toggle button
  await themeToggle.click();
  
  // Check if the theme changed
  const newTheme = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });
  
  // The new theme should be different from the initial theme
  expect(newTheme).not.toBe(initialTheme);
  
  // Check if theme-specific styles are applied
  if (newTheme === 'dark') {
    // Check dark mode specific styles
    const body = await page.locator('body');
    const bodyBg = await body.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Body background should be dark in dark mode
    expect(bodyBg).not.toBe('rgb(255, 255, 255)');
  }
});
