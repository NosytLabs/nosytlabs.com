/**
 * UI Components Tests
 * 
 * This test suite checks the functionality and appearance of UI components.
 * It verifies that components render correctly and respond to user interactions.
 */

// @ts-check
import { test, expect } from '@playwright/test';

// Test the ProjectCard component
test('ProjectCard component should work correctly', async ({ page }) => {
  // Navigate to the homepage or projects page
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find a project card
  const projectCard = await page.locator('.project-card').first();
  await expect(projectCard).toBeVisible();
  
  // Check if the card has the expected elements
  const image = await projectCard.locator('.project-card__image');
  await expect(image).toBeVisible();
  
  const title = await projectCard.locator('.project-card__title');
  await expect(title).toBeVisible();
  
  const description = await projectCard.locator('.project-card__description');
  await expect(description).toBeVisible();
  
  // Test hover effects
  await projectCard.hover();
  
  // Check if the overlay appears on hover
  const overlay = await projectCard.locator('.project-card__overlay');
  await expect(overlay).toBeVisible();
  
  // Check if action buttons appear in the overlay
  const actionButtons = await overlay.locator('.project-card__action-btn');
  await expect(actionButtons.first()).toBeVisible();
  
  // Test clicking a project link
  const viewButton = await overlay.locator('.project-card__view-btn');
  
  // Get the href attribute to check if it's a valid URL
  const href = await viewButton.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href?.startsWith('http')).toBeTruthy();
});

// Test the ProjectGrid component
test('ProjectGrid component should work correctly', async ({ page }) => {
  // Navigate to the homepage or projects page
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find the project grid
  const projectGrid = await page.locator('.projects-section__grid');
  await expect(projectGrid).toBeVisible();
  
  // Check if there are multiple project cards
  const projectCards = await projectGrid.locator('.project-card');
  const cardCount = await projectCards.count();
  expect(cardCount).toBeGreaterThan(0);
  
  // Test filtering if filters are present
  const filterButtons = await page.locator('.projects-section__filter-btn');
  const hasFilters = await filterButtons.count() > 0;
  
  if (hasFilters) {
    // Get the first filter button that's not "All"
    const filterButton = await filterButtons.nth(1);
    const filterText = await filterButton.textContent();
    
    // Click the filter button
    await filterButton.click();
    
    // Check if the button is now active
    await expect(filterButton).toHaveClass(/active/);
    
    // Check if the filtered cards match the filter
    const visibleCards = await page.locator('.project-card:visible');
    const visibleCount = await visibleCards.count();
    
    // There should be at least one visible card or fewer cards than before
    expect(visibleCount).toBeGreaterThan(0);
    
    // Click the "All" filter to reset
    const allFilterButton = await filterButtons.first();
    await allFilterButton.click();
    
    // Check if all cards are visible again
    const resetVisibleCards = await page.locator('.project-card:visible');
    const resetVisibleCount = await resetVisibleCards.count();
    expect(resetVisibleCount).toBe(cardCount);
  }
});

// Test the HeroSection component
test('HeroSection component should work correctly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find the hero section
  const heroSection = await page.locator('.hero-section');
  await expect(heroSection).toBeVisible();
  
  // Check if the hero section has the expected elements
  const title = await heroSection.locator('.hero-section__title');
  await expect(title).toBeVisible();
  
  const subtitle = await heroSection.locator('.hero-section__subtitle');
  const hasSubtitle = await subtitle.count() > 0;
  
  if (hasSubtitle) {
    await expect(subtitle).toBeVisible();
  }
  
  // Check if the buttons are present
  const buttons = await heroSection.locator('.hero-section__button');
  await expect(buttons.first()).toBeVisible();
  
  // Check if the particle background is present
  const particleBackground = await heroSection.locator('#hero-particles');
  await expect(particleBackground).toBeVisible();
  
  // Check if the scroll indicator is present
  const scrollIndicator = await heroSection.locator('.hero-section__scroll-indicator');
  const hasScrollIndicator = await scrollIndicator.count() > 0;
  
  if (hasScrollIndicator) {
    await expect(scrollIndicator).toBeVisible();
  }
});

// Test the FeatureCard component
test('FeatureCard component should work correctly', async ({ page }) => {
  // Navigate to the homepage or features page
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find a feature card
  const featureCard = await page.locator('.feature-card').first();
  const hasFeatureCards = await featureCard.count() > 0;
  
  if (hasFeatureCards) {
    await expect(featureCard).toBeVisible();
    
    // Check if the card has the expected elements
    const icon = await featureCard.locator('.feature-card__icon');
    await expect(icon).toBeVisible();
    
    const title = await featureCard.locator('.feature-card__title');
    await expect(title).toBeVisible();
    
    const description = await featureCard.locator('.feature-card__description');
    await expect(description).toBeVisible();
    
    // Test hover effects
    await featureCard.hover();
    
    // Check if the card is a link
    const isLink = await featureCard.evaluate(el => el.tagName.toLowerCase() === 'a');
    
    if (isLink) {
      // Check if the arrow appears or changes on hover
      const arrow = await featureCard.locator('.feature-card__arrow');
      const hasArrow = await arrow.count() > 0;
      
      if (hasArrow) {
        await expect(arrow).toBeVisible();
      }
    }
  }
});

// Test the ContactForm component
test('ContactForm component should work correctly', async ({ page }) => {
  // Navigate to the contact page
  await page.goto('http://localhost:3000/contact');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find the contact form
  const contactForm = await page.locator('.contact-form');
  await expect(contactForm).toBeVisible();
  
  // Check if the form has the expected fields
  const nameInput = await contactForm.locator('#name');
  await expect(nameInput).toBeVisible();
  
  const emailInput = await contactForm.locator('#email');
  await expect(emailInput).toBeVisible();
  
  const messageInput = await contactForm.locator('#message');
  await expect(messageInput).toBeVisible();
  
  // Check if the submit button is present
  const submitButton = await contactForm.locator('.submit-button');
  await expect(submitButton).toBeVisible();
  
  // Test form validation
  await submitButton.click();
  
  // Required fields should show validation errors
  const nameValidation = await nameInput.evaluate(el => {
    if (el instanceof HTMLInputElement) return el.validity.valid;
    return false;
  });
  const emailValidation = await emailInput.evaluate(el => {
    if (el instanceof HTMLInputElement) return el.validity.valid;
    return false;
  });
  const messageValidation = await messageInput.evaluate(el => {
    if (el instanceof HTMLTextAreaElement) return el.validity.valid;
    return false;
  });
  
  // At least one field should be invalid
  expect(nameValidation && emailValidation && messageValidation).toBeFalsy();
  
  // Fill in the form
  await nameInput.fill('Test User');
  await emailInput.fill('test@example.com');
  await messageInput.fill('This is a test message');
  
  // Check if the fields have the correct values
  await expect(nameInput).toHaveValue('Test User');
  await expect(emailInput).toHaveValue('test@example.com');
  await expect(messageInput).toHaveValue('This is a test message');
  
  // Check if the form is now valid
  const isFormValid = await contactForm.evaluate(form => {
    if (form instanceof HTMLFormElement) return form.checkValidity();
    return false;
  });
  expect(isFormValid).toBeTruthy();
});

// Test the ParticleBackground component
test('ParticleBackground component should work correctly', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Find the particle background
  const particleBackground = await page.locator('.particle-background');
  await expect(particleBackground).toBeVisible();
  
  // Check if particles.js is initialized or fallback is active
  const hasCanvas = await page.locator('.particle-background canvas').count() > 0;
  const hasFallback = await page.locator('.particles-fallback').count() > 0;
  
  // Either particles.js should be initialized or the fallback should be active
  expect(hasCanvas || hasFallback).toBeTruthy();
  
  // If particles.js is initialized, check if it's working properly
  if (hasCanvas) {
    // Check if the canvas is visible
    const canvas = await page.locator('.particle-background canvas');
    await expect(canvas).toBeVisible();
  }
  
  // If fallback is active, check if it's working properly
  if (hasFallback) {
    // Check if fallback particles are visible
    const fallbackParticles = await page.locator('.fallback-particle');
    const particleCount = await fallbackParticles.count();
    expect(particleCount).toBeGreaterThan(0);
  }
});
