/**
 * Link Checker for NosytLabs Website
 *
 * This script checks for broken links in the built website.
 * It crawls the site starting from the homepage and reports any broken links.
 *
 * Usage:
 * - Run with Node.js: node scripts/check-links.js
 * - Requires puppeteer: npm install puppeteer
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  // Base URL for the site
  baseUrl: 'http://localhost:3000',
  // Output file for the report
  outputFile: 'link-check-report.json',
  // Maximum number of pages to check
  maxPages: 100,
  // Timeout for page load in milliseconds
  pageTimeout: 30000,
  // Whether to check external links
  checkExternalLinks: false,
  // Whether to check images
  checkImages: true,
  // Whether to check scripts
  checkScripts: true,
  // Whether to check stylesheets
  checkStylesheets: true,
  // Exclude patterns (regex)
  excludePatterns: [
    /\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|zip|rar|exe|dmg|apk)$/i,
    /^mailto:/,
    /^tel:/,
    /^javascript:/,
    /^#/,
    /\/api\//
  ]
};

// Results storage
const results = {
  checkedUrls: new Set(),
  brokenLinks: [],
  validLinks: [],
  skippedLinks: [],
  startTime: new Date(),
  endTime: null,
  summary: {
    totalChecked: 0,
    totalBroken: 0,
    totalValid: 0,
    totalSkipped: 0
  }
};

// Check if a URL should be excluded
function shouldExclude(url) {
  return config.excludePatterns.some(pattern => pattern.test(url));
}

// Check if a URL is external
function isExternalUrl(url) {
  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(config.baseUrl);
    return urlObj.hostname !== baseUrlObj.hostname;
  } catch (error) {
    return false;
  }
}

// Normalize URL
function normalizeUrl(url, baseUrl) {
  try {
    // Handle relative URLs
    if (url.startsWith('/')) {
      const baseUrlObj = new URL(baseUrl);
      return `${baseUrlObj.origin}${url}`;
    }

    // Handle full URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Handle relative URLs without leading slash
    const baseUrlWithoutPath = baseUrl.split('/').slice(0, 3).join('/');
    return `${baseUrlWithoutPath}/${url}`;
  } catch (error) {
    console.error(`Error normalizing URL ${url}: ${error.message}`);
    return url;
  }
}

// Check a single URL
async function checkUrl(url, referrer) {
  // Skip if already checked
  if (results.checkedUrls.has(url)) {
    return;
  }

  // Skip if should be excluded
  if (shouldExclude(url)) {
    results.skippedLinks.push({
      url,
      referrer,
      reason: 'Excluded by pattern'
    });
    results.summary.totalSkipped++;
    return;
  }

  // Skip external URLs if configured
  if (!config.checkExternalLinks && isExternalUrl(url)) {
    results.skippedLinks.push({
      url,
      referrer,
      reason: 'External URL'
    });
    results.summary.totalSkipped++;
    return;
  }

  // Mark as checked
  results.checkedUrls.add(url);
  results.summary.totalChecked++;

  try {
    // Use fetch to check the URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow'
    });

    if (response.ok) {
      results.validLinks.push({
        url,
        referrer,
        status: response.status
      });
      results.summary.totalValid++;
    } else {
      results.brokenLinks.push({
        url,
        referrer,
        status: response.status,
        statusText: response.statusText
      });
      results.summary.totalBroken++;
    }
  } catch (error) {
    results.brokenLinks.push({
      url,
      referrer,
      error: error.message
    });
    results.summary.totalBroken++;
  }
}

// Crawl a page and extract links
async function crawlPage(browser, url, depth = 0, maxDepth = 3) {
  if (depth > maxDepth || results.summary.totalChecked >= config.maxPages) {
    return;
  }

  console.log(`Crawling: ${url} (Depth: ${depth})`);

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(config.pageTimeout);

    // Navigate to the page
    const response = await page.goto(url, { waitUntil: 'networkidle2' });

    if (!response.ok()) {
      results.brokenLinks.push({
        url,
        status: response.status(),
        statusText: response.statusText()
      });
      results.summary.totalBroken++;
      await page.close();
      return;
    }

    // Extract all links
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      return anchors.map(anchor => {
        return {
          href: anchor.href,
          text: anchor.textContent.trim()
        };
      });
    });

    // Check images if configured
    if (config.checkImages) {
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => {
          return {
            src: img.src,
            alt: img.alt
          };
        });
      });

      for (const image of images) {
        if (image.src) {
          await checkUrl(image.src, url);
        }
      }
    }

    // Check scripts if configured
    if (config.checkScripts) {
      const scripts = await page.evaluate(() => {
        const scriptElements = Array.from(document.querySelectorAll('script'));
        return scriptElements
          .filter(script => script.src)
          .map(script => script.src);
      });

      for (const script of scripts) {
        await checkUrl(script, url);
      }
    }

    // Check stylesheets if configured
    if (config.checkStylesheets) {
      const stylesheets = await page.evaluate(() => {
        const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        return linkElements.map(link => link.href);
      });

      for (const stylesheet of stylesheets) {
        await checkUrl(stylesheet, url);
      }
    }

    // Close the page
    await page.close();

    // Process links
    const internalLinks = [];

    for (const link of links) {
      if (!link.href) continue;

      const normalizedUrl = normalizeUrl(link.href, url);

      // Check the link
      await checkUrl(normalizedUrl, url);

      // Add internal links for crawling
      if (!isExternalUrl(normalizedUrl) && !shouldExclude(normalizedUrl)) {
        internalLinks.push(normalizedUrl);
      }
    }

    // Crawl internal links
    for (const link of internalLinks) {
      if (!results.checkedUrls.has(link)) {
        await crawlPage(browser, link, depth + 1, maxDepth);
      }
    }
  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
    results.brokenLinks.push({
      url,
      error: error.message
    });
    results.summary.totalBroken++;
  }
}

// Main function
async function main() {
  console.log('Starting link checker...');
  console.log(`Base URL: ${config.baseUrl}`);

  const browser = await puppeteer.launch();

  try {
    await crawlPage(browser, config.baseUrl);
  } finally {
    await browser.close();
  }

  // Complete the results
  results.endTime = new Date();
  results.duration = (results.endTime - results.startTime) / 1000;

  // Write the report
  fs.writeFileSync(
    config.outputFile,
    JSON.stringify(results, null, 2)
  );

  // Print summary
  console.log('\nLink Check Summary:');
  console.log(`Total URLs checked: ${results.summary.totalChecked}`);
  console.log(`Valid links: ${results.summary.totalValid}`);
  console.log(`Broken links: ${results.summary.totalBroken}`);
  console.log(`Skipped links: ${results.summary.totalSkipped}`);
  console.log(`Duration: ${results.duration.toFixed(2)} seconds`);
  console.log(`Report written to: ${config.outputFile}`);

  // Print broken links
  if (results.brokenLinks.length > 0) {
    console.log('\nBroken Links:');
    results.brokenLinks.forEach((link, index) => {
      console.log(`${index + 1}. ${link.url}`);
      console.log(`   Referrer: ${link.referrer || 'N/A'}`);
      console.log(`   Status: ${link.status || 'N/A'}`);
      console.log(`   Error: ${link.error || 'N/A'}`);
      console.log('');
    });
  }

  // Exit with error code if broken links found
  process.exit(results.brokenLinks.length > 0 ? 1 : 0);
}

// Run the script
main().catch(error => {
  console.error('Error running link checker:', error);
  process.exit(1);
});
