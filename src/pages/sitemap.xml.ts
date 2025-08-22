/**
 * Sitemap XML Endpoint
 * Generates dynamic sitemap.xml for SEO
 */

import type { APIRoute } from 'astro';
import { generateCompleteSitemap } from '../utils/sitemap';
import { logger } from '../utils/logger';

export const GET: APIRoute = async () => {
  try {
    const sitemap = await generateCompleteSitemap();

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    logger.error(
      'Error generating sitemap:',
      error instanceof Error ? error : new Error(String(error)),
      'sitemap'
    );

    return new Response('Error generating sitemap', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};

export const prerender = true;
