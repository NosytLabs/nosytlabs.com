// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Test suite for verifying the NosytLabs logo appears correctly throughout the site
 */
test.describe('Logo Tests', () => {
  // Before each test, navigate to the homepage
  test.beforeEach(async ({ page }) => {
    // Use file:// protocol for local testing without a dev server
    await page.goto('file:///C:/Users/Tyson/Downloads/nosytlabs-github-ready/public/index.html');
  });

  // Test that the logo appears in the header
  test('logo should appear in the header', async ({ page }) => {
    // Check if the logo image exists in the header
    const headerLogo = page.locator('header img[alt="NosytLabs Logo"]');

    // Verify the logo exists
    await expect(headerLogo).toBeVisible();

    // Verify the logo has the correct source
    await expect(headerLogo).toHaveAttribute('src', 'images/nosytlabs-logo-2025.svg');

    // Verify the logo has appropriate dimensions
    const logoBox = await headerLogo.boundingBox();
    expect(logoBox).not.toBeNull();
    if (logoBox) {
      expect(logoBox.width).toBeGreaterThan(0);
      expect(logoBox.height).toBeGreaterThan(0);
    }
  });

  // Test that the logo appears in the footer
  test('logo should appear in the footer', async ({ page }) => {
    // Check if the logo image exists in the footer
    const footerLogo = page.locator('footer img[alt="NosytLabs Logo"]');

    // Verify the logo exists
    await expect(footerLogo).toBeVisible();

    // Verify the logo has the correct source
    await expect(footerLogo).toHaveAttribute('src', 'images/nosytlabs-logo-2025.svg');

    // Verify the logo has appropriate dimensions
    const logoBox = await footerLogo.boundingBox();
    expect(logoBox).not.toBeNull();
    if (logoBox) {
      expect(logoBox.width).toBeGreaterThan(0);
      expect(logoBox.height).toBeGreaterThan(0);
    }
  });

  // Test that the favicon is correctly set
  test('favicon should be correctly set', async ({ page }) => {
    // Check if the favicon link exists in the head
    const favicon = page.locator('link[rel="icon"][type="image/svg+xml"]');

    // Verify the favicon exists
    await expect(favicon).toHaveCount(1);

    // Verify the favicon has the correct href
    await expect(favicon).toHaveAttribute('href', 'images/nosytlabs-logo-2025.svg');
  });

  // Test that the logo is preloaded for performance
  test('logo should be preloaded for performance', async ({ page }) => {
    // Check if the logo is preloaded
    const preloadedLogo = page.locator('link[rel="preload"][as="image"]');

    // Verify the preloaded logo exists
    await expect(preloadedLogo).toHaveCount(1);

    // Verify the preloaded logo has the correct href
    await expect(preloadedLogo).toHaveAttribute('href', 'images/nosytlabs-logo-2025.svg');
  });

  // Test that the structured data contains the correct logo URL
  test('structured data should contain the correct logo URL', async ({ page }) => {
    // Get all script elements with type="application/ld+json"
    const structuredDataScripts = page.locator('script[type="application/ld+json"]');

    // Get the content of the first structured data script
    const structuredDataContent = await structuredDataScripts.first().textContent();

    // Make sure we have content before parsing
    expect(structuredDataContent).not.toBeNull();

    if (structuredDataContent) {
      // Parse the JSON content
      const structuredData = JSON.parse(structuredDataContent);

      // Verify the logo URL is correct - this might need to be updated based on the actual content
      // For local testing, we'll just check that it contains 'nosytlabs-logo-2025.svg'
      expect(structuredData.logo).toContain('nosytlabs-logo-2025.svg');
    }
  });

  // Take a screenshot of the header logo for visual verification
  test('take screenshot of header logo for visual verification', async ({ page }) => {
    // Get the header logo
    const headerLogo = page.locator('header img[alt="NosytLabs Logo"]');

    // Take a screenshot of the logo
    await headerLogo.screenshot({ path: 'test-results/header-logo.png' });
  });

  // Take a screenshot of the footer logo for visual verification
  test('take screenshot of footer logo for visual verification', async ({ page }) => {
    // Get the footer logo
    const footerLogo = page.locator('footer img[alt="NosytLabs Logo"]');

    // Take a screenshot of the logo
    await footerLogo.screenshot({ path: 'test-results/footer-logo.png' });
  });
});
