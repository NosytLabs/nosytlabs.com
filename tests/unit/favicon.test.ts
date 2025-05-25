import { test, expect } from '@playwright/test';

// Define standard sizes for favicons
const STANDARD_SIZES = ['16x16', '32x32', '96x96', '128x128'];
const ANDROID_SIZES = ['96x96', '128x128', '192x192', '512x512'];

test.describe('Favicon Tests', () => {
  test('should have all required favicon links in head', async ({ page }) => {
    await page.goto('/');
    
    // Check basic favicon links
    const faviconLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('link[rel*="icon"]')).map(link => ({
        rel: link.getAttribute('rel'),
        href: link.getAttribute('href'),
        sizes: link.getAttribute('sizes'),
        type: link.getAttribute('type')
      }));
    });
    
    console.log('Found favicon links:', faviconLinks);
    
    // Verify standard favicons
    STANDARD_SIZES.forEach(size => {
      expect(faviconLinks).toContainEqual(expect.objectContaining({
        rel: 'icon',
        href: `/images/favicon-${size}.png`,
        sizes: size
      }));
    });
    
    // Verify Apple touch icon
    expect(faviconLinks).toContainEqual(expect.objectContaining({
      rel: 'apple-touch-icon',
      href: '/images/apple-touch-icon.png',
      sizes: '180x180'
    }));
    
    // Verify Android Chrome icons
    ANDROID_SIZES.forEach(size => {
      // Regular icons
      expect(faviconLinks).toContainEqual(expect.objectContaining({
        rel: 'icon',
        href: `/images/icons/android-chrome-${size}.png`,
        sizes: size
      }));
      
      // Maskable icons
      expect(faviconLinks).toContainEqual(expect.objectContaining({
        rel: 'icon',
        href: `/images/icons/android-chrome-maskable-${size}.png`,
        sizes: size
      }));
    });
  });

  test('should have valid manifest file', async ({ page }) => {
    await page.goto('/');
    
    // Check manifest link
    const manifestLink = await page.$('link[rel="manifest"]');
    expect(manifestLink).not.toBeNull();
    
    // Verify manifest content
    const manifestResponse = await page.goto('/site.webmanifest');
    if (!manifestResponse) {
      throw new Error('Failed to fetch manifest');
    }
    expect(manifestResponse.ok()).toBeTruthy();
    
    const manifest = await manifestResponse.json();
    expect(manifest).toMatchObject({
      name: 'NosytLabs',
      theme_color: '#1E0E3A',
      icons: expect.arrayContaining([
        expect.objectContaining({
          sizes: '192x192',
          src: '/icons/android-chrome-192x192.png'
        }),
        expect.objectContaining({
          sizes: '512x512',
          src: '/icons/android-chrome-512x512.png'
        })
      ])
    });
  });

  test('should load all favicon resources', async ({ page }) => {
    await page.goto('/');

    // Define the faviconFiles array
    const faviconFiles = [
      '/images/favicon-16x16.png',
      '/images/favicon-32x32.png',
      '/images/favicon-96x96.png',
      '/images/favicon-128x128.png',
      '/images/icons/android-chrome-96x96.png',
      '/images/icons/android-chrome-128x128.png',
      '/images/icons/android-chrome-192x192.png',
      '/images/icons/android-chrome-512x512.png',
      '/images/icons/android-chrome-maskable-96x96.png',
      '/images/icons/android-chrome-maskable-128x128.png',
      '/images/icons/android-chrome-maskable-192x192.png',
      '/images/icons/android-chrome-maskable-512x512.png',
      '/images/apple-touch-icon.png'
    ];

    // Check all favicon files in parallel
    const results = await Promise.all(
      faviconFiles.map(async (file) => {
        const response = await page.goto(file);
        if (!response) {
          return `❌ File ${file} not found.`;
        } else if (!response.ok()) {
          return `❌ File ${file} returned an error: ${response.statusText()}`;
        } else {
          return `✅ File ${file} found successfully.`;
        }
      })
    );

    // Log results
    results.forEach(result => console.log(result));

    // Verify no errors
    const errors = results.filter(result => result.includes('❌'));
    expect(errors).toEqual([]);
  });
});
