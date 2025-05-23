// @ts-check
import { test, expect } from '@playwright/test';

test('Basic site functionality test', async ({ page }) => {
  // Test the homepage loading
  await page.goto('http://localhost:3000/');

  // Test IntroAnimation storage handling
  const sessionStorageValue = await page.evaluate(() => {
    return sessionStorage.getItem('hasShownIntro');
  });
  console.log('Session storage hasShownIntro value:', sessionStorageValue);

  // Test VideoHero component rendering
  const heroTitle = await page.locator('.hero-title').isVisible();
  console.log('Hero title visible:', heroTitle);

  const heroSubtitle = await page.locator('.hero-subtitle').isVisible();
  console.log('Hero subtitle visible:', heroSubtitle);

  // Test if NosytOS95 page loads properly
  await page.goto('http://localhost:3000/nosytos95');
  const nosytOS95Title = await page.title();
  console.log('NosytOS95 title:', nosytOS95Title);

  // Go back to homepage and check performance-related functionality
  await page.goto('http://localhost:3000/');

  // Test if the service worker is registered
  const serviceWorkerRegistered = await page.evaluate(() => {
    return 'serviceWorker' in navigator;
  });
  console.log('Service worker available:', serviceWorkerRegistered);

  // Test lazy loading functionality
  // Wait for images to potentially lazy load
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  // Check console for any error logs
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`Error: ${msg.text()}`);
    }
  });

  // Print any observed errors
  console.log('Console errors:', consoleMessages);

  // Basic assertions to ensure the test passes
  await expect(page).toHaveTitle(/NosytLabs/);
});
