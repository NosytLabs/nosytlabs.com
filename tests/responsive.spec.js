/**
 * Responsive Design Tests
 * 
 * This test suite checks the website's responsiveness across different screen sizes.
 * It verifies that elements are properly displayed and functional at various viewport dimensions.
 */

// @ts-check
import { test, expect } from '@playwright/test';

// Define screen sizes to test
const screenSizes = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Desktop', width: 1920, height: 1080 }
];

// Test the homepage across different screen sizes
for (const size of screenSizes) {
  test(`Homepage should be responsive on ${size.name} (${size.width}x${size.height})`, async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: size.width, height: size.height });
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for visual reference
    await page.screenshot({ path: `screenshots/homepage-${size.name.toLowerCase()}.png` });
    
    // Check if the header is visible
    const header = await page.locator('header');
    await expect(header).toBeVisible();
    
    // Check if the navigation is properly displayed
    if (size.width < 768) {
      // On mobile, the navigation should be hidden behind a menu button
      const mobileMenuButton = await page.locator('button.mobile-menu-button');
      await expect(mobileMenuButton).toBeVisible();
      
      // Click the menu button to open the mobile menu
      await mobileMenuButton.click();
      
      // Check if the mobile menu is now visible
      const mobileMenu = await page.locator('nav.mobile-menu');
      await expect(mobileMenu).toBeVisible();
      
      // Close the mobile menu
      await mobileMenuButton.click();
    } else {
      // On larger screens, the navigation should be visible
      const desktopNav = await page.locator('nav.desktop-nav');
      await expect(desktopNav).toBeVisible();
    }
    
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
  });
}

// Test the projects section across different screen sizes
for (const size of screenSizes) {
  test(`Projects section should be responsive on ${size.name} (${size.width}x${size.height})`, async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: size.width, height: size.height });
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll to the projects section
    const projectsSection = await page.locator('section.projects-section');
    await projectsSection.scrollIntoViewIfNeeded();
    
    // Take a screenshot of the projects section
    await page.screenshot({ path: `screenshots/projects-${size.name.toLowerCase()}.png` });
    
    // Check if the projects section is visible
    await expect(projectsSection).toBeVisible();
    
    // Check if project cards are visible
    const projectCards = await page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
    
    // Check the grid layout based on screen size
    const projectGrid = await page.locator('.projects-section__grid');
    
    if (size.width < 640) {
      // On mobile, expect a single column layout
      await expect(projectGrid).toHaveCSS('grid-template-columns', /repeat\(1, 1fr\)/);
    } else if (size.width < 1024) {
      // On tablet, expect a two-column layout
      await expect(projectGrid).toHaveCSS('grid-template-columns', /repeat\(2, 1fr\)/);
    } else {
      // On desktop, expect a three-column layout
      await expect(projectGrid).toHaveCSS('grid-template-columns', /repeat\(3, 1fr\)/);
    }
    
    // Test project card hover effects
    const firstProjectCard = await projectCards.first();
    await firstProjectCard.hover();
    
    // Check if the overlay becomes visible on hover
    const overlay = await firstProjectCard.locator('.project-card__overlay');
    await expect(overlay).toBeVisible();
    
    // Check if the action buttons are visible in the overlay
    const actionButtons = await overlay.locator('.project-card__action-btn');
    await expect(actionButtons.first()).toBeVisible();
  });
}

// Test the contact form across different screen sizes
for (const size of screenSizes) {
  test(`Contact form should be responsive on ${size.name} (${size.width}x${size.height})`, async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: size.width, height: size.height });
    
    // Navigate to the contact page
    await page.goto('http://localhost:3000/contact');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the contact form
    await page.screenshot({ path: `screenshots/contact-${size.name.toLowerCase()}.png` });
    
    // Check if the contact form is visible
    const contactForm = await page.locator('form.contact-form');
    await expect(contactForm).toBeVisible();
    
    // Check the form layout based on screen size
    const formGrid = await page.locator('.form-grid');
    
    if (size.width < 640) {
      // On mobile, expect a single column layout
      await expect(formGrid).toHaveCSS('grid-template-columns', /1fr/);
    } else {
      // On larger screens, expect a two-column layout
      await expect(formGrid).toHaveCSS('grid-template-columns', /repeat\(2, 1fr\)/);
    }
    
    // Test form field interactions
    const nameInput = await page.locator('#name');
    await nameInput.fill('Test User');
    await expect(nameInput).toHaveValue('Test User');
    
    const emailInput = await page.locator('#email');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
    
    const messageInput = await page.locator('#message');
    await messageInput.fill('This is a test message');
    await expect(messageInput).toHaveValue('This is a test message');
    
    // Check if the submit button is visible
    const submitButton = await page.locator('button.submit-button');
    await expect(submitButton).toBeVisible();
  });
}

// Test the NosytOS95 interface across different screen sizes
for (const size of screenSizes) {
  test(`NosytOS95 interface should be responsive on ${size.name} (${size.width}x${size.height})`, async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: size.width, height: size.height });
    
    // Navigate to the NosytOS95 page
    await page.goto('http://localhost:3000/nosytos95');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the NosytOS95 interface
    await page.screenshot({ path: `screenshots/nosytos95-${size.name.toLowerCase()}.png` });
    
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
    
    // Close the Start menu by clicking elsewhere
    await page.mouse.click(size.width / 2, size.height / 2);
    
    // Check if the Start menu is now hidden
    await expect(startMenu).not.toBeVisible();
    
    // Test opening an application (e.g., Notepad)
    await startButton.click();
    const notepadMenuItem = await page.locator('.start-menu-item:has-text("Notepad")');
    await notepadMenuItem.click();
    
    // Check if the Notepad window is visible
    const notepadWindow = await page.locator('.window:has-text("Notepad")');
    await expect(notepadWindow).toBeVisible();
    
    // Test window dragging (move the window a bit)
    const notepadTitleBar = await notepadWindow.locator('.window-title-bar');
    const titleBarBox = await notepadTitleBar.boundingBox();
    
    if (titleBarBox) {
      await page.mouse.move(titleBarBox.x + titleBarBox.width / 2, titleBarBox.y + titleBarBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(titleBarBox.x + 50, titleBarBox.y + 50);
      await page.mouse.up();
    }
    
    // Test window closing
    const closeButton = await notepadWindow.locator('.window-close-button');
    await closeButton.click();
    
    // Check if the window is now closed
    await expect(notepadWindow).not.toBeVisible();
  });
}
