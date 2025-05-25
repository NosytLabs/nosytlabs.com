import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
    test('critical resources are preloaded', async ({ page }) => {
        const response = await page.goto('/');
        expect(response).not.toBeNull();
        
        if (!response) {
            throw new Error('Failed to load page');
        }
        
        const html = await response.text();
        expect(html).toContain('rel="preload" href="images/logo-new.svg"');
        expect(html).toContain('rel="preload" href="styles/main.css"');
        expect(html).toContain('rel="preload" href="scripts/main.js"');
    });

    test('images use modern formats and lazy loading', async ({ page }) => {
        await page.goto('/');
        
        // Check WebP support
        const webpSources = await page.$$('source[type="image/webp"]');
        expect(webpSources.length).toBeGreaterThan(0);
        
        // Verify proper image loading attributes
        const heroImage = await page.$('.hero-image');
        expect(heroImage).not.toBeNull();
        
        if (heroImage) {
            const priority = await heroImage.getAttribute('fetchpriority');
            expect(priority).toBe('high');
        }
        
        const nonCriticalImages = await page.$$('img:not(.hero-image):not([src*="logo"])');
        for (const img of nonCriticalImages) {
            const loading = await img.getAttribute('loading');
            expect(loading).toBe('lazy');
        }
    });

    test('service worker is registered', async ({ page }) => {
        await page.goto('/');
        
        // Check service worker registration
        const swRegistered = await page.evaluate(() => {
            return navigator.serviceWorker.getRegistration('/');
        });
        
        expect(swRegistered).toBeTruthy();
    });
});

test.describe('Accessibility Tests', () => {
    test('page has proper ARIA roles', async ({ page }) => {
        await page.goto('/');
        
        // Check essential ARIA roles
        const banner = await page.$('[role="banner"]');
        const nav = await page.$('[role="navigation"]');
        const main = await page.$('[role="main"]');
        const footer = await page.$('[role="contentinfo"]');
        
        expect(banner).toBeTruthy();
        expect(nav).toBeTruthy();
        expect(main).toBeTruthy();
        expect(footer).toBeTruthy();
    });

    test('images have alt text', async ({ page }) => {
        await page.goto('/');
        
        const images = await page.$$('img');
        for (const img of images) {
            const alt = await img.getAttribute('alt');
            expect(alt).not.toBeNull();
            expect(alt?.length).toBeGreaterThan(0);
        }
    });

    test('keyboard navigation works', async ({ page }) => {
        await page.goto('/');
        
        // Test tab navigation
        await page.keyboard.press('Tab');
        const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
        expect(firstFocused).toBeTruthy();
        
        // Navigate through all focusable elements
        const focusableElements = await page.$$('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        for (let i = 0; i < focusableElements.length; i++) {
            await page.keyboard.press('Tab');
            const focused = await page.evaluate(() => document.activeElement?.tagName);
            expect(focused).toBeTruthy();
        }
    });
});

test.describe('Offline Functionality Tests', () => {
    test('offline page is served when offline', async ({ page, context }) => {
        // Enable offline mode
        await context.setOffline(true);
        
        // Try to navigate to the main page
        const response = await page.goto('/');
        expect(response).not.toBeNull();
        
        if (!response) {
            throw new Error('Failed to load page');
        }
        
        const html = await response.text();
        expect(html).toContain('You\'re currently offline');
        expect(html).toContain('No Internet Connection');
    });

    test('cached resources are available offline', async ({ page, context }) => {
        // First load page normally
        await page.goto('/');
        
        // Enable offline mode
        await context.setOffline(true);
        
        // Try to load cached resources
        const cachedResources = [
            '/styles/main.css',
            '/images/logo-new.svg',
            '/scripts/main.js'
        ];
        
        for (const resource of cachedResources) {
            const response = await page.goto(resource);
            expect(response).not.toBeNull();
            
            if (response) {
                expect(response.ok()).toBeTruthy();
            }
        }
    });
});

test.describe('Performance Benchmarks', () => {
    test('page load metrics meet requirements', async ({ page }) => {
        // Measure navigation timing
        const loadMetrics = await page.evaluate(() => {
            const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                domContentLoaded: navigationEntry.domContentLoadedEventEnd,
                loadComplete: navigationEntry.loadEventEnd
            };
        });
        
        // Check load times
        expect(loadMetrics.domContentLoaded).toBeLessThan(2000);
        expect(loadMetrics.loadComplete).toBeLessThan(3000);
        
        // Check Web Vitals
        const webVitals = await page.evaluate(() => {
            const getFCP = () => {
                const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
                return fcpEntry ? fcpEntry.startTime : null;
            };
            
            const getLCP = () => {
                const lcpEntry = performance.getEntriesByName('largest-contentful-paint')[0];
                return lcpEntry ? lcpEntry.startTime : null;
            };
            
            return {
                fcp: getFCP(),
                lcp: getLCP()
            };
        });
        
        // Verify Core Web Vitals meet requirements
        if (webVitals.fcp) {
            expect(webVitals.fcp).toBeLessThan(1000); // FCP under 1s
        }
        
        if (webVitals.lcp) {
            expect(webVitals.lcp).toBeLessThan(2500); // LCP under 2.5s
        }
    });
});