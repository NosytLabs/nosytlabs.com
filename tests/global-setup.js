/**
 * Global Setup for Playwright Tests
 * Prepares the testing environment and ensures the site is ready
 */

import { chromium } from '@playwright/test';

async function globalSetup(config) {
  console.log('🚀 Starting global setup for NosytLabs UI tests...');
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...');
    const baseURL = config.use?.baseURL || 'http://localhost:3001';
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Verify critical resources are loaded
    console.log('🔍 Verifying critical resources...');
    
    // Check if main CSS is loaded
    const cssLoaded = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      return links.length > 0;
    });
    
    if (!cssLoaded) {
      throw new Error('Critical CSS files not loaded');
    }
    
    // Check if main navigation is present
    const navExists = await page.locator('header, nav').first().isVisible();
    if (!navExists) {
      throw new Error('Main navigation not found');
    }
    
    // Check if hero section is present
    const heroExists = await page.locator('.hero-section, [class*="hero"]').first().isVisible();
    if (!heroExists) {
      console.warn('⚠️ Hero section not found - this may be expected for some pages');
    }
    
    console.log('✅ Global setup completed successfully');
    
    // Store setup data for tests
    process.env.SETUP_TIMESTAMP = Date.now().toString();
    
  } catch (error) {
    console.error('❌ Global setup failed:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
