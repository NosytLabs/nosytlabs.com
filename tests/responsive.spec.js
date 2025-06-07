import { test, expect } from '@playwright/test';

/**
 * Comprehensive Responsive Design Testing
 * Tests layout behavior across different screen sizes and devices
 */

const viewports = [
  { name: 'Mobile Portrait', width: 375, height: 667 },
  { name: 'Mobile Landscape', width: 667, height: 375 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop Small', width: 1280, height: 720 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
  { name: 'Ultra Wide', width: 2560, height: 1440 },
];

test.describe('Responsive Design Testing', () => {

  viewports.forEach(viewport => {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {

      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      });

      test('Navigation responsiveness', async ({ page }) => {
        const header = page.locator('header, .ultra-nav-header').first();
        await expect(header).toBeVisible();

        const headerBox = await header.boundingBox();

        // Header should span full width
        expect(headerBox.width).toBe(viewport.width);

        // Check mobile menu behavior
        if (viewport.width < 768) {
          // Mobile: should have hamburger menu
          const mobileMenuButton = page.locator('.mobile-menu-button, .hamburger, [aria-label*="menu"]');
          if (await mobileMenuButton.count() > 0) {
            await expect(mobileMenuButton.first()).toBeVisible();
          }

          // Desktop navigation should be hidden on mobile
          const desktopNav = page.locator('.desktop-nav, .nav-links:not(.mobile)');
          if (await desktopNav.count() > 0) {
            const isHidden = await desktopNav.first().isHidden();
            expect(isHidden).toBe(true);
          }
        } else {
          // Desktop: navigation items should be visible
          const navItems = page.locator('nav a, .nav-link');
          const navCount = await navItems.count();

          if (navCount > 0) {
            await expect(navItems.first()).toBeVisible();
          }
        }
      });

      test('Hero section responsiveness', async ({ page }) => {
        const heroSection = page.locator('.hero-section, [class*="hero"]').first();

        if (await heroSection.isVisible()) {
          const heroBox = await heroSection.boundingBox();

          // Hero should span full width
          expect(heroBox.width).toBe(viewport.width);

          // Check hero content layout
          const heroContent = page.locator('.hero-content, .hero-container').first();
          if (await heroContent.isVisible()) {
            const contentBox = await heroContent.boundingBox();

            // Content should fit within viewport
            expect(contentBox.width).toBeLessThanOrEqual(viewport.width);

            // Check if content is properly centered
            const leftMargin = contentBox.x;
            const rightMargin = viewport.width - (contentBox.x + contentBox.width);

            if (viewport.width >= 768) {
              // Desktop: content should be centered with margins
              expect(leftMargin).toBeGreaterThan(0);
              expect(rightMargin).toBeGreaterThan(0);
            }
          }

          // Check hero text sizing
          const heroTitle = page.locator('.hero-section h1, .hero-title').first();
          if (await heroTitle.isVisible()) {
            const titleBox = await heroTitle.boundingBox();

            // Title should not overflow
            expect(titleBox.width).toBeLessThanOrEqual(heroBox.width - 40); // 20px margin each side

            // Check font size responsiveness
            const fontSize = await heroTitle.evaluate(el =>
              window.getComputedStyle(el).fontSize
            );
            const fontSizeNum = parseFloat(fontSize);

            if (viewport.width < 768) {
              // Mobile: smaller font size
              expect(fontSizeNum).toBeLessThan(48);
            } else {
              // Desktop: larger font size
              expect(fontSizeNum).toBeGreaterThan(24);
            }
          }
        }
      });

      test('Content sections responsiveness', async ({ page }) => {
        const sections = page.locator('section, .section');
        const sectionCount = await sections.count();

        for (let i = 0; i < Math.min(sectionCount, 5); i++) {
          const section = sections.nth(i);
          if (await section.isVisible()) {
            const sectionBox = await section.boundingBox();

            // Section should not exceed viewport width
            expect(sectionBox.width).toBeLessThanOrEqual(viewport.width);

            // Check section padding
            const paddingLeft = await section.evaluate(el =>
              parseInt(window.getComputedStyle(el).paddingLeft)
            );
            const paddingRight = await section.evaluate(el =>
              parseInt(window.getComputedStyle(el).paddingRight)
            );

            if (viewport.width < 768) {
              // Mobile: smaller padding
              expect(paddingLeft + paddingRight).toBeLessThan(64);
            } else {
              // Desktop: adequate padding
              expect(paddingLeft + paddingRight).toBeGreaterThan(32);
            }
          }
        }
      });

      test('Grid layouts responsiveness', async ({ page }) => {
        const gridContainers = page.locator('.grid, .grid-cols-1, .grid-cols-2, .grid-cols-3, .grid-cols-4');
        const gridCount = await gridContainers.count();

        for (let i = 0; i < gridCount; i++) {
          const grid = gridContainers.nth(i);
          if (await grid.isVisible()) {
            const gridItems = grid.locator('> *');
            const itemCount = await gridItems.count();

            if (itemCount > 1) {
              // Check grid item layout
              const firstItem = gridItems.first();
              const secondItem = gridItems.nth(1);

              const firstBox = await firstItem.boundingBox();
              const secondBox = await secondItem.boundingBox();

              if (viewport.width < 768) {
                // Mobile: items should stack vertically
                expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 10);
              } else if (viewport.width >= 1024) {
                // Desktop: items can be side by side
                const isHorizontal = Math.abs(firstBox.y - secondBox.y) < 10;
                const isVertical = secondBox.y > firstBox.y + firstBox.height - 10;
                expect(isHorizontal || isVertical).toBe(true);
              }
            }
          }
        }
      });

      test('Images and media responsiveness', async ({ page }) => {
        const images = page.locator('img');
        const imageCount = await images.count();

        for (let i = 0; i < Math.min(imageCount, 10); i++) {
          const img = images.nth(i);
          if (await img.isVisible()) {
            const imgBox = await img.boundingBox();

            // Images should not exceed viewport width
            expect(imgBox.width).toBeLessThanOrEqual(viewport.width);

            // Check if image has proper responsive attributes
            const srcset = await img.getAttribute('srcset');
            const sizes = await img.getAttribute('sizes');

            // At least one responsive attribute should be present for optimization
            if (imgBox.width > 300) {
              expect(srcset || sizes).toBeTruthy();
            }
          }
        }
      });

      test('Text readability and spacing', async ({ page }) => {
        const textElements = page.locator('p, h1, h2, h3, h4, h5, h6');
        const textCount = await textElements.count();

        for (let i = 0; i < Math.min(textCount, 10); i++) {
          const element = textElements.nth(i);
          if (await element.isVisible()) {
            const elementBox = await element.boundingBox();

            // Text should not exceed viewport width
            expect(elementBox.width).toBeLessThanOrEqual(viewport.width - 20);

            // Check line height for readability
            const lineHeight = await element.evaluate(el =>
              window.getComputedStyle(el).lineHeight
            );

            if (lineHeight !== 'normal') {
              const lineHeightNum = parseFloat(lineHeight);
              expect(lineHeightNum).toBeGreaterThan(1.2); // Minimum readable line height
            }
          }
        }
      });

      test('Interactive elements accessibility', async ({ page }) => {
        const buttons = page.locator('button, .btn, a[role="button"]');
        const buttonCount = await buttons.count();

        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible()) {
            const buttonBox = await button.boundingBox();

            // Buttons should have minimum touch target size (44px)
            if (viewport.width < 768) {
              expect(buttonBox.height).toBeGreaterThanOrEqual(44);
              expect(buttonBox.width).toBeGreaterThanOrEqual(44);
            }

            // Buttons should not exceed viewport width
            expect(buttonBox.width).toBeLessThanOrEqual(viewport.width - 20);
          }
        }
      });
    });
  });
});