import { test, expect } from '@playwright/test';

/**
 * Comprehensive UI Components Testing
 * Tests alignment, positioning, and visual consistency of all UI components
 */

test.describe('UI Components - Alignment & Positioning', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('Navigation header alignment and positioning', async ({ page }) => {
    const header = page.locator('header, .ultra-nav-header').first();

    // Check if header exists and is visible
    await expect(header).toBeVisible();

    // Check header positioning
    const headerBox = await header.boundingBox();
    expect(headerBox.x).toBe(0); // Should start at left edge
    expect(headerBox.y).toBe(0); // Should be at top

    // Check if navigation items are properly aligned
    const navItems = page.locator('nav a, .nav-link');
    const navCount = await navItems.count();

    if (navCount > 0) {
      // Check first and last nav items alignment
      const firstNav = navItems.first();
      const lastNav = navItems.last();

      await expect(firstNav).toBeVisible();
      await expect(lastNav).toBeVisible();

      // Verify they're on the same horizontal line (within tolerance)
      const firstBox = await firstNav.boundingBox();
      const lastBox = await lastNav.boundingBox();
      const yDifference = Math.abs(firstBox.y - lastBox.y);
      expect(yDifference).toBeLessThan(5); // 5px tolerance
    }
  });

  test('Hero section alignment and content positioning', async ({ page }) => {
    const heroSection = page.locator('.hero-section, [class*="hero"]').first();

    if (await heroSection.isVisible()) {
      // Check hero section positioning
      const heroBox = await heroSection.boundingBox();
      expect(heroBox.x).toBe(0); // Should span full width from left

      // Check hero content alignment
      const heroContent = page.locator('.hero-content, .hero-container').first();
      if (await heroContent.isVisible()) {
        const contentBox = await heroContent.boundingBox();

        // Content should be centered or properly aligned
        expect(contentBox.x).toBeGreaterThan(0);
        expect(contentBox.width).toBeLessThan(heroBox.width);
      }

      // Check hero title alignment
      const heroTitle = page.locator('.hero-section h1, .hero-title').first();
      if (await heroTitle.isVisible()) {
        await expect(heroTitle).toBeVisible();

        // Title should not overflow
        const titleBox = await heroTitle.boundingBox();
        expect(titleBox.width).toBeLessThan(heroBox.width);
      }

      // Check hero buttons alignment
      const heroButtons = page.locator('.hero-section .btn, .hero-actions a');
      const buttonCount = await heroButtons.count();

      if (buttonCount > 1) {
        // Check if buttons are properly spaced
        const firstButton = heroButtons.first();
        const secondButton = heroButtons.nth(1);

        const firstBox = await firstButton.boundingBox();
        const secondBox = await secondButton.boundingBox();

        // Buttons should have proper spacing
        const spacing = secondBox.x - (firstBox.x + firstBox.width);
        expect(spacing).toBeGreaterThan(8); // Minimum 8px spacing
      }
    }
  });

  test('Service cards alignment and grid layout', async ({ page }) => {
    const serviceCards = page.locator('.service-card, .card, [class*="service"]');
    const cardCount = await serviceCards.count();

    if (cardCount > 0) {
      // Check if cards are visible
      await expect(serviceCards.first()).toBeVisible();

      if (cardCount > 1) {
        // Check grid alignment for multiple cards
        const firstCard = serviceCards.first();
        const secondCard = serviceCards.nth(1);

        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();

        // Cards should be properly aligned
        if (firstBox.y === secondBox.y) {
          // Horizontal layout - check vertical alignment
          const yDifference = Math.abs(firstBox.y - secondBox.y);
          expect(yDifference).toBeLessThan(5);
        } else {
          // Vertical layout - check horizontal alignment
          const xDifference = Math.abs(firstBox.x - secondBox.x);
          expect(xDifference).toBeLessThan(5);
        }
      }

      // Check card content alignment
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = serviceCards.nth(i);
        const cardTitle = card.locator('h2, h3, .card-title').first();
        const cardContent = card.locator('p, .card-content').first();

        if (await cardTitle.isVisible()) {
          const cardBox = await card.boundingBox();
          const titleBox = await cardTitle.boundingBox();

          // Title should be within card bounds
          expect(titleBox.x).toBeGreaterThanOrEqual(cardBox.x);
          expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
        }
      }
    }
  });

  test('Footer alignment and content positioning', async ({ page }) => {
    const footer = page.locator('footer').first();

    if (await footer.isVisible()) {
      const footerBox = await footer.boundingBox();

      // Footer should span full width
      expect(footerBox.x).toBe(0);

      // Check footer content alignment
      const footerContent = page.locator('footer .container, footer .footer-content').first();
      if (await footerContent.isVisible()) {
        const contentBox = await footerContent.boundingBox();

        // Content should be centered within footer
        const leftMargin = contentBox.x - footerBox.x;
        const rightMargin = (footerBox.x + footerBox.width) - (contentBox.x + contentBox.width);
        const marginDifference = Math.abs(leftMargin - rightMargin);

        expect(marginDifference).toBeLessThan(20); // 20px tolerance for centering
      }
    }
  });

  test('Text alignment consistency', async ({ page }) => {
    // Check for consistent text alignment across sections
    const textElements = page.locator('h1, h2, h3, p, .text-center, .text-left');
    const elementCount = await textElements.count();

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const textAlign = await element.evaluate(el =>
          window.getComputedStyle(el).textAlign
        );

        // Text alignment should be valid
        expect(['left', 'center', 'right', 'justify', 'start', 'end']).toContain(textAlign);
      }
    }
  });

  test('No overlapping elements', async ({ page }) => {
    // Check for overlapping elements that might indicate layout issues
    const mainElements = page.locator('header, main, section, footer, .hero-section, .service-card');
    const elementCount = await mainElements.count();

    const elementBoxes = [];

    // Collect bounding boxes
    for (let i = 0; i < elementCount; i++) {
      const element = mainElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        elementBoxes.push({ index: i, box });
      }
    }

    // Check for overlaps
    for (let i = 0; i < elementBoxes.length; i++) {
      for (let j = i + 1; j < elementBoxes.length; j++) {
        const box1 = elementBoxes[i].box;
        const box2 = elementBoxes[j].box;

        // Check if boxes overlap
        const noOverlap = (
          box1.x + box1.width <= box2.x ||
          box2.x + box2.width <= box1.x ||
          box1.y + box1.height <= box2.y ||
          box2.y + box2.height <= box1.y
        );

        if (!noOverlap) {
          // Allow small overlaps for design elements (shadows, borders)
          const overlapX = Math.min(box1.x + box1.width, box2.x + box2.width) - Math.max(box1.x, box2.x);
          const overlapY = Math.min(box1.y + box1.height, box2.y + box2.height) - Math.max(box1.y, box2.y);

          // Fail if overlap is significant
          expect(overlapX * overlapY).toBeLessThan(100); // Less than 100 square pixels
        }
      }
    }
  });
});