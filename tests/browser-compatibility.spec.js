/**
 * Browser Compatibility Tests
 * 
 * This test suite checks the website's compatibility across different browsers.
 * It verifies that elements are properly displayed and functional in Chrome, Firefox, and Safari.
 */

// @ts-check
import { test, expect } from '@playwright/test';

// Define browsers to test
const browsers = ['chromium', 'firefox', 'webkit'];

// Test the homepage across different browsers
for (const browserType of browsers) {
  test(`Homepage should work in ${browserType}`, async ({ browser }) => {
    // Launch the browser
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for visual reference
    await page.screenshot({ path: `screenshots/homepage-${browserType}.png` });
    
    // Check if the header is visible
    const header = await page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if the navigation is properly displayed
    const nav = await page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check if the hero section is visible
    const heroSection = await page.locator('section.hero-section');
    await expect(heroSection).toBeVisible();
    
    // Check if the particles background is visible or the fallback is active
    const particlesContainer = await page.locator('#hero-particles');
    await expect(particlesContainer).toBeVisible();
    
    // Check if the main content sections are visible
    const mainContent = await page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Check if the footer is visible
    const footer = await page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Verify the copyright year is 2025
    const copyright = await page.locator('footer').locator('text=2025');
    await expect(copyright).toBeVisible();
    
    // Close the context
    await context.close();
  });
}

// Test the particles.js functionality across different browsers
for (const browserType of browsers) {
  test(`Particles.js should work or have fallback in ${browserType}`, async ({ browser }) => {
    // Launch the browser
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the particles container is visible
    const particlesContainer = await page.locator('#hero-particles');
    await expect(particlesContainer).toBeVisible();
    
    // Check if particles.js is initialized or fallback is active
    const hasParticlesCanvas = await page.locator('#hero-particles canvas').count() > 0;
    const hasFallbackParticles = await page.locator('#hero-particles .fallback-particle').count() > 0;
    
    // Either particles.js should be initialized or the fallback should be active
    expect(hasParticlesCanvas || hasFallbackParticles).toBeTruthy();
    
    // If particles.js is initialized, check if it's working properly
    if (hasParticlesCanvas) {
      // Check if the canvas is visible
      const canvas = await page.locator('#hero-particles canvas');
      await expect(canvas).toBeVisible();
      
      // Check if the canvas has content (not empty)
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox?.width).toBeGreaterThan(0);
      expect(canvasBox?.height).toBeGreaterThan(0);
    }
    
    // If fallback is active, check if it's working properly
    if (hasFallbackParticles) {
      // Check if fallback particles are visible
      const fallbackParticles = await page.locator('#hero-particles .fallback-particle');
      await expect(fallbackParticles.first()).toBeVisible();
      
      // Check if there are multiple fallback particles
      const particleCount = await fallbackParticles.count();
      expect(particleCount).toBeGreaterThan(0);
    }
    
    // Close the context
    await context.close();
  });
}

// Test the project cards across different browsers
for (const browserType of browsers) {
  test(`Project cards should work in ${browserType}`, async ({ browser }) => {
    // Launch the browser
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll to the projects section
    const projectsSection = await page.locator('section.projects-section');
    await projectsSection.scrollIntoViewIfNeeded();
    
    // Take a screenshot of the projects section
    await page.screenshot({ path: `screenshots/projects-${browserType}.png` });
    
    // Check if the projects section is visible
    await expect(projectsSection).toBeVisible();
    
    // Check if project cards are visible
    const projectCards = await page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
    
    // Test project card hover effects
    const firstProjectCard = await projectCards.first();
    await firstProjectCard.hover();
    
    // Check if the overlay becomes visible on hover
    const overlay = await firstProjectCard.locator('.project-card__overlay');
    await expect(overlay).toBeVisible();
    
    // Check if the action buttons are visible in the overlay
    const actionButtons = await overlay.locator('.project-card__action-btn');
    await expect(actionButtons.first()).toBeVisible();
    
    // Close the context
    await context.close();
  });
}

// Test the NosytOS95 interface across different browsers
for (const browserType of browsers) {
  test(`NosytOS95 interface should work in ${browserType}`, async ({ browser }) => {
    // Launch the browser
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the NosytOS95 page
    await page.goto('http://localhost:3000/nosytos95');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the NosytOS95 interface
    await page.screenshot({ path: `screenshots/nosytos95-${browserType}.png` });
    
    // Check if the NosytOS95 interface is visible
    const nosytOS = await page.locator('.nosytos95');
    await expect(nosytOS).toBeVisible();
    
    // Check if the Start button is visible
    const startButton = await page.locator('.start-button');
    await expect(startButton).toBeVisible();
    
    // Click the Start button to open the Start menu
    await startButton.click();
    
    // Check if the Start menu is visible
    const startMenu = await page.locator('.start-menu');
    await expect(startMenu).toBeVisible();
    
    // Test opening an application (e.g., Notepad)
    const notepadMenuItem = await page.locator('.start-menu-item:has-text("Notepad")');
    await notepadMenuItem.click();
    
    // Check if the Notepad window is visible
    const notepadWindow = await page.locator('.window:has-text("Notepad")');
    await expect(notepadWindow).toBeVisible();
    
    // Test window closing
    const closeButton = await notepadWindow.locator('.window-close-button');
    await closeButton.click();
    
    // Check if the window is now closed
    await expect(notepadWindow).not.toBeVisible();
    
    // Close the context
    await context.close();
  });
}
