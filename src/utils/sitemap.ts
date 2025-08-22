/**
 * Sitemap Generation Utilities
 * Generate XML sitemaps for better SEO indexing
 */

import { SITE } from '../config/constants/index';
import { logger } from './logger';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Static pages configuration for sitemap
 */
export const STATIC_PAGES: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    url: '/services',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    url: '/services/web-development',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    url: '/services/ai-integration',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    url: '/services/technical-consulting',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    url: '/projects',
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.6,
  },
];

/**
 * Generate XML sitemap from entries
 */
export function generateSitemap(entries: SitemapEntry[], baseUrl: string = SITE.SITE_URL): string {
  const now = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${entry.url}</loc>\n`;

    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    } else {
      xml += `    <lastmod>${now}</lastmod>\n`;
    }

    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    xml += '  </url>\n';
  }

  xml += '</urlset>';

  return xml;
}

/**
 * Generate robots.txt content optimized for production
 */
export function generateRobotsTxt(baseUrl: string = SITE.SITE_URL): string {
  let robots = '# Robots.txt for nosytlabs.com\n';
  robots += '# Generated automatically for production\n\n';
  
  // Main user agent rules
  robots += 'User-agent: *\n';
  robots += 'Allow: /\n';
  robots += 'Allow: /images/\n';
  robots += 'Allow: /assets/\n';
  robots += 'Allow: /icons/\n\n';

  // Disallow sensitive and technical paths
  robots += 'Disallow: /api/\n';
  robots += 'Disallow: /_astro/\n';
  robots += 'Disallow: /admin/\n';
  robots += 'Disallow: /temp/\n';
  robots += 'Disallow: /test/\n';
  robots += 'Disallow: /scripts/\n';
  robots += 'Disallow: /.env\n';
  robots += 'Disallow: /package.json\n';
  robots += 'Disallow: /tsconfig.json\n';
  robots += 'Disallow: /astro.config.*\n';
  robots += 'Disallow: /tailwind.config.*\n';
  robots += 'Disallow: /reports/\n';
  robots += 'Disallow: /__tests__/\n';
  robots += 'Disallow: /tests/\n\n';
  
  // Specific bot rules for better SEO
  robots += 'User-agent: Googlebot\n';
  robots += 'Allow: /\n';
  robots += 'Allow: /images/\n';
  robots += 'Allow: /assets/\n\n';
  
  robots += 'User-agent: Bingbot\n';
  robots += 'Allow: /\n';
  robots += 'Allow: /images/\n';
  robots += 'Allow: /assets/\n\n';
  
  // Crawl delay for respectful crawling
  robots += 'Crawl-delay: 1\n\n';

  // Add sitemap references
  robots += `Sitemap: ${baseUrl}/sitemap.xml\n`;
  robots += `Sitemap: ${baseUrl}/sitemap-index.xml\n\n`;
  
  // Host directive for canonical domain
  robots += `Host: ${baseUrl.replace('https://', '')}\n`;

  return robots;
}

/**
 * Validate sitemap entries
 */
export function validateSitemapEntries(entries: SitemapEntry[]): {
  valid: SitemapEntry[];
  invalid: Array<{ entry: SitemapEntry; errors: string[] }>;
} {
  const valid: SitemapEntry[] = [];
  const invalid: Array<{ entry: SitemapEntry; errors: string[] }> = [];

  for (const entry of entries) {
    const errors: string[] = [];

    // Validate URL
    if (!entry.url || typeof entry.url !== 'string') {
      errors.push('URL is required and must be a string');
    } else if (!entry.url.startsWith('/')) {
      errors.push('URL must start with /');
    }

    // Validate priority
    if (entry.priority !== undefined) {
      if (typeof entry.priority !== 'number' || entry.priority < 0 || entry.priority > 1) {
        errors.push('Priority must be a number between 0 and 1');
      }
    }

    // Validate changefreq
    if (entry.changefreq) {
      const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (!validFreqs.includes(entry.changefreq)) {
        errors.push(`Invalid changefreq. Must be one of: ${validFreqs.join(', ')}`);
      }
    }

    // Validate lastmod
    if (entry.lastmod) {
      const date = new Date(entry.lastmod);
      if (isNaN(date.getTime())) {
        errors.push('lastmod must be a valid ISO date string');
      }
    }

    if (errors.length === 0) {
      valid.push(entry);
    } else {
      invalid.push({ entry, errors });
    }
  }

  return { valid, invalid };
}

/**
 * Generate sitemap index for multiple sitemaps
 */
export function generateSitemapIndex(
  sitemaps: Array<{ url: string; lastmod?: string }>,
  baseUrl: string = SITE.SITE_URL
): string {
  const now = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const sitemap of sitemaps) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${baseUrl}${sitemap.url}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod || now}</lastmod>\n`;
    xml += '  </sitemap>\n';
  }

  xml += '</sitemapindex>';

  return xml;
}

/**
 * Get dynamic pages for sitemap (services, projects, etc.)
 */
export async function getDynamicPages(): Promise<SitemapEntry[]> {
  const dynamicPages: SitemapEntry[] = [];

  try {
    // Add service pages
    const { allServices } = await import('../config/services');
    if (allServices && allServices.length > 0) {
      for (const service of allServices) {
        dynamicPages.push({
          url: `/services/${service.slug}`,
          changefreq: 'monthly',
          priority: 0.7,
        });
      }
      logger.info(`Added ${allServices.length} service pages to sitemap`, 'sitemap');
    } else {
      logger.info('No services found for sitemap', 'sitemap');
    }
  } catch (error) {
    logger.warn(`Error loading services for sitemap: ${error}`);
  }

  try {
    // Add project pages from content collection
    const { getCollection } = await import('astro:content');
    const projects = await getCollection('projects');

    // Only add projects if collection has content
    if (projects && projects.length > 0) {
      for (const project of projects) {
        if (project.data.status !== 'archived' && !project.data.draft) {
          dynamicPages.push({
            url: `/projects/${project.slug}`,
            lastmod: project.data.publishedAt?.toISOString(),
            changefreq: 'monthly',
            priority: 0.6,
          });
        }
      }
      logger.info(`Added ${projects.length} project pages to sitemap`, 'sitemap');
    } else {
      logger.info('No projects found for sitemap - this is normal for new sites', 'sitemap');
    }
  } catch (error) {
    // Only log as warning if it's not a "collection does not exist" error
    if (error instanceof Error && !error.message.includes('Collection "projects" does not exist')) {
      logger.warn(`Error loading projects for sitemap: ${error}`);
    } else {
      logger.info(
        'Projects collection not available for sitemap - this is normal if collection is not configured',
        'sitemap'
      );
    }
  }

  return dynamicPages;
}

/**
 * Generate complete sitemap with static and dynamic pages
 */
export async function generateCompleteSitemap(): Promise<string> {
  const staticPages = STATIC_PAGES;
  const dynamicPages = await getDynamicPages();

  const allPages = [...staticPages, ...dynamicPages];
  const { valid, invalid } = validateSitemapEntries(allPages);

  if (invalid.length > 0) {
    logger.warn('Invalid sitemap entries found:', 'sitemap');
  }

  return generateSitemap(valid);
}

/**
 * Generate sitemap for Astro integration
 */
export default async function createSitemap() {
  return await generateCompleteSitemap();
}
