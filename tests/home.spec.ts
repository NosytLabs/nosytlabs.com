import { test, expect } from '@playwright/test';

test.describe('Homepage smoke tests', () => {
  test('loads and renders key sections', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/NosytLabs|AI-Powered|Digital Solutions/i);

  // Hero content visible (target the hero banner specifically)
  await expect(page.getByRole('banner', { name: /Hero section/i })).toBeVisible();

    // Services section heading
    await expect(page.getByRole('heading', { name: /Comprehensive Digital Solutions/i })).toBeVisible();

    // Final CTA section heading
    await expect(page.getByRole('heading', { name: /Let's Build Something Amazing Together/i })).toBeVisible();
  });

  test('no severe console errors', async ({ page }) => {
  const severe: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') severe.push(msg.text());
  });

  await page.goto('/');
  // Ignore common benign 404 noise from optional assets
  const filtered = severe.filter((m) => !/404 \(Not Found\)/i.test(m));
  expect(filtered.join('\n')).toEqual('');
  });
});

