import { test, expect } from '@playwright/test';

async function getNumberPx(value: string | null) {
  if (!value) return 0;
  const m = /([\d.]+)/.exec(value);
  return m ? parseFloat(m[1]) : 0;
}

test.describe('Layout: alignment and spacing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('no horizontal overflow (no unintended x-scroll)', async ({ page }) => {
    const hasOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth;
    });
    expect(hasOverflow).toBeFalsy();
  });

  test('containers are centered within viewport', async ({ page }) => {
    const offCenter = await page.evaluate(() => {
      const containers = Array.from(document.querySelectorAll('.container')) as HTMLElement[];
      const tolerance = 3; // px
      return containers.some((el) => {
        const rect = el.getBoundingClientRect();
        const leftGap = rect.left;
        const rightGap = window.innerWidth - rect.right;
        return Math.abs(leftGap - rightGap) > tolerance;
      });
    });
    expect(offCenter).toBeFalsy();
  });

  test('section vertical padding is applied and symmetrical', async ({ page }) => {
    const issues = await page.evaluate(async () => {
      const sections = Array.from(document.querySelectorAll('section.section-xs, section.section-sm, section.section-md, section.section-lg, section.section-xl, section.section-2xl')) as HTMLElement[];
      const problems: string[] = [];
      for (const el of sections) {
        const cs = getComputedStyle(el);
        const pt = parseFloat(cs.paddingTop);
        const pb = parseFloat(cs.paddingBottom);
        if (pt < 24 || pb < 24) problems.push('padding too small');
        if (Math.abs(pt - pb) > 2) problems.push('padding not symmetrical');
      }
      return problems;
    });
    expect(issues, issues.join(', ')).toHaveLength(0);
  });

  test('services grid has adequate gaps', async ({ page }) => {
    // grid near "Comprehensive Digital Solutions"
    const gapsOk = await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => /Comprehensive Digital Solutions/i.test(h.textContent || ''));
      if (!heading) return true; // if heading missing, skip to not block unrelated pages
      const grid = heading.closest('section')?.querySelector('[class*="grid"]') as HTMLElement | null;
      if (!grid) return true;
      const cs = getComputedStyle(grid);
      const colGap = parseFloat(cs.columnGap);
      const rowGap = parseFloat(cs.rowGap);
      return colGap >= 24 && rowGap >= 24; // ~gap-6 or larger
    });
    expect(gapsOk).toBeTruthy();
  });

  test('hero heading is centered and within viewport padding safely', async ({ page }) => {
    const centered = await page.evaluate(() => {
      const banner = document.querySelector('section#hero, [role="banner"]') as HTMLElement | null;
      if (!banner) return true;
      const h1 = banner.querySelector('h1');
      if (!h1) return true;
      const cs = getComputedStyle(h1);
      const textAlign = cs.textAlign;
      const rect = (h1 as HTMLElement).getBoundingClientRect();
      return textAlign === 'center' && rect.left >= 8 && (window.innerWidth - rect.right) >= 8;
    });
    expect(centered).toBeTruthy();
  });

  test.describe('mobile viewport checks', () => {
    test.use({ viewport: { width: 390, height: 800 } });

    test('no x-overflow and sections padded on mobile', async ({ page }) => {
      await page.goto('/');
      const result = await page.evaluate(() => {
        const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        const firstSection = document.querySelector('main section');
        if (!firstSection) return { overflow, pt: 24, pb: 24 };
        const cs = getComputedStyle(firstSection as HTMLElement);
        return { overflow, pt: parseFloat(cs.paddingTop), pb: parseFloat(cs.paddingBottom) };
      });
      expect(result.overflow).toBeFalsy();
      expect(result.pt).toBeGreaterThanOrEqual(16);
      expect(result.pb).toBeGreaterThanOrEqual(16);
    });
  });
});

