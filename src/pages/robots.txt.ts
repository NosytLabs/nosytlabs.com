/**
 * Robots.txt Endpoint
 * Generates dynamic robots.txt for SEO
 */

import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '../utils/sitemap';
import { SITE } from '../config/constants/index';
import { logger } from '../utils/logger';

export const GET: APIRoute = async () => {
  try {
    const robotsTxt = generateRobotsTxt(SITE.SITE_URL);

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    logger.error(
      'Error generating robots.txt:',
      error instanceof Error ? error : new Error(String(error)),
      'sitemap'
    );

    return new Response('Error generating robots.txt', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};

export const prerender = true;
