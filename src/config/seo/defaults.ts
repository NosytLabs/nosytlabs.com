/**
 * Default SEO Configuration
 * Base SEO settings and defaults for all pages
 */

import type { SEOProps } from '../../utils/seo';

/**
 * Default SEO configuration for all pages
 */
export const DEFAULT_SEO: SEOProps = {
  title: 'NosytLabs - Innovative Technology Solutions',
  description:
    'Expert web development and AI integration services. Delivering innovative technology solutions with modern frameworks and proven methodologies.',
  keywords: [
    'web development',
    'AI integration',
    'TypeScript development',
    'React applications',
    'Astro framework',
    'professional services',
    'technical consulting',
    'performance optimization',
    'accessibility compliance',
    'modern web technologies',
  ],
  image: '/images/nosytlabs-og.jpg',
  imageAlt: 'NosytLabs - Innovative Technology Solutions',
  type: 'website',
  author: 'NosytLabs',
  canonicalUrl: 'https://nosytlabs.com',
};

/**
 * Company information for structured data
 */
export const COMPANY_INFO = {
  name: 'NosytLabs',
  description: 'Expert web development and AI integration services. Delivering innovative technology solutions with modern frameworks and proven methodologies.',
  url: 'https://nosytlabs.com',
  phone: '+1-555-0123',
  email: 'contact@nosytlabs.com',
  socialProfiles: [
    'https://github.com/nosytlabs',
    'https://linkedin.com/company/nosytlabs',
    'https://twitter.com/nosytlabs',
  ],
};

/**
 * Internal link patterns for validation
 */
export const INTERNAL_LINK_PATTERNS = [
  '/',
  '/services',
  '/projects',
  '/blog',
  '/contact',
] as const;

/**
 * Validate if a link is an internal link
 */
export function isValidInternalLink(href: string): boolean {
  if (!href || typeof href !== 'string') return false;
  
  // Check if it's a relative path or matches our internal patterns
  return href.startsWith('/') || INTERNAL_LINK_PATTERNS.some(pattern => 
    href === pattern || href.startsWith(`${pattern}/`)
  );
}