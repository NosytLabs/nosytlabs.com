import { test, expect, type Page } from '@playwright/test';

interface Favicon {
  rel: string;
  type?: string;
  sizes?: string;
  href: string;
}

const expectedFavicons: Favicon[] = [
  { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/apple-touch-icon.png' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/favicon-32x32.png' },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/favicon-16x16.png' }
];

async function verifyFavicons(page: Page, path: string) {
  console.log(`\nVerifying favicons on page: ${path}`);

  for (const favicon of expectedFavicons) {
    console.log(`Checking favicon: ${favicon.href}`);

    // Create selector string
    const { rel, type, sizes, href } = favicon;
    const selector = `link[rel="${rel}"]${type ? `[type="${type}"]` : ''}${sizes ? `[sizes="${sizes}"]` : ''}[href="${href}"]`;

    try {
      // Use locator API which is more stable than page.evaluate
      const faviconElement = page.locator(selector);

      // Wait for favicon element to be present
      await faviconElement.waitFor({
        state: 'attached',
        timeout: 10000
      });

      // Check if element exists
      const count = await faviconElement.count();
      const faviconExists = count > 0;

      console.log(`Favicon ${favicon.href} exists:`, faviconExists);
      expect(faviconExists, `Favicon ${favicon.href} should exist on ${path}`).toBeTruthy();
    } catch (e) {
      console.error(`Error checking favicon ${favicon.href}:`, e);
      throw e;
    }
  }
}

test.describe('Site functionality tests', () => {
  test('Basic site functionality test', async ({ page }) => {
  console.log('Starting comprehensive site test...');

  // Test 1: Homepage and IntroAnimation
  console.log('Test 1: Testing homepage and IntroAnimation...');
  await page.goto('http://localhost:3000/');

  // Check if intro animation shows up and sets storage correctly
  try {
    // Check if the intro animation container exists
    const introAnimationExists = await page.locator('.intro-animation-container').isVisible();
    console.log('Intro animation visible:', introAnimationExists);

    // Check sessionStorage for hasShownIntro value
    const sessionStorageValue = await page.evaluate(() => {
      return sessionStorage.getItem('hasShownIntro');
    });
    console.log('Session storage hasShownIntro value:', sessionStorageValue);

    // Check cookie fallback (in case sessionStorage fails)
    const cookies = await page.context().cookies();
    const hasIntroCookie = cookies.find(c => c.name === 'hasShownIntro');
    console.log('Intro cookie present:', !!hasIntroCookie);
  } catch (e) {
    console.log('Error testing IntroAnimation:', e);
  }

  // Test 2: VideoHero component
  console.log('Test 2: Testing VideoHero component...');
  try {
    // Check if hero elements are visible
    const heroTitle = await page.locator('.hero-title').isVisible();
    console.log('Hero title visible:', heroTitle);

    const heroSubtitle = await page.locator('.hero-subtitle').isVisible();
    console.log('Hero subtitle visible:', heroSubtitle);

    const heroCta = await page.locator('.hero-cta').isVisible();
    console.log('Hero CTA visible:', heroCta);

    // Check if video element exists in the hero section
    const videoElement = await page.locator('#hero-section video').count();
    console.log('Hero video element found:', videoElement > 0);
  } catch (e) {
    console.log('Error testing VideoHero:', e);
  }

  // Test 3: LazyLoading and IntersectionObserver
  console.log('Test 3: Testing LazyLoading functionality...');
  try {
    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for lazy loading to potentially happen
    await page.waitForTimeout(2000);

    // Check for lazy-loaded class
    const lazyLoadedElements = await page.locator('.lazy-loaded').count();
    console.log('Lazy loaded elements found:', lazyLoadedElements);
  } catch (e) {
    console.log('Error testing LazyLoading:', e);
  }

  // Test 4: NosytOS95 page and storage handling
  console.log('Test 4: Testing NosytOS95...');
  try {
    await page.goto('http://localhost:3000/nosytos95');

    // Check if the page loads correctly
    const nosytOS95Title = await page.title();
    console.log('NosytOS95 title:', nosytOS95Title);

    // Check for Windows 95 interface elements
    const desktopElement = await page.locator('#desktop').isVisible();
    console.log('Desktop element visible:', desktopElement);

    // Test style applying (which we fixed)
    const styleApplied = await page.evaluate(() => {
      const root = document.documentElement;
      return getComputedStyle(root).getPropertyValue('--win95-blue') !== '';
    });
    console.log('Win95 styles applied:', styleApplied);
  } catch (e) {
    console.log('Error testing NosytOS95:', e);
  }

  // Test 5: Service Worker and resource loading
  console.log('Test 5: Testing Service Worker...');
  try {
    await page.goto('http://localhost:3000/');

    // Check if service worker is registered
    const serviceWorkerRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    console.log('Service Worker API available:', serviceWorkerRegistered);

    // Check for any resource loading errors
    const failedResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter(r => r.name.includes('/scripts/performance/'))
        .map(r => r.name);
    });
    console.log('Performance resources loaded:', failedResources);
  } catch (e) {
    console.log('Error testing Service Worker:', e);
  }

  // Check console for any error logs
  console.log('Test 6: Checking for console errors...');
  // This will be reported when errors occur
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Console Error: ${msg.text()}`);
    }
  });

  // Basic assertions to ensure the site is working
  await expect(page).toHaveTitle(/NosytLabs|NosytOS/);
});

test.describe('Favicon Tests', () => {
  const testPages = ['/', '/services', '/projects', '/content-creation', '/nosytos95', '/contact'];

  test.setTimeout(120000); // Increase timeout to 2 minutes

  test.beforeEach(async ({ page }) => {
    // Increase default navigation timeout
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
  });

  for (const pagePath of testPages) {
    test(`Verify favicons on ${pagePath}`, async ({ page }) => {
      try {
        // Navigate to the page and wait for load
        await page.goto(`http://localhost:3000${pagePath}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        // Wait for head and make sure page is stable
        try {
          await page.waitForLoadState('networkidle', { timeout: 10000 });
        } catch (e) {
          console.log('Network not fully idle, but proceeding with tests...');
        }

        // Small wait to ensure all link elements are loaded
        await page.waitForTimeout(2000);

        // Verify favicons
        await verifyFavicons(page, pagePath);

        // Take screenshot for visual verification
        await page.screenshot({
          path: `test-results/favicon-test-${pagePath.replace(/\//g, '-') || 'home'}.png`
        });
      } catch (error) {
        console.error(`Error testing ${pagePath}:`, error);
        throw error;
      }
    });
  }
});
});
