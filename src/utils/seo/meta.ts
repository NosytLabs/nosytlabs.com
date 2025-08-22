/**
 * SEO Utilities for NosytLabs Website
 * Comprehensive SEO meta tag generation and structured data utilities
 */

import { COMPANY, SITE, CONTACT } from '../../config';
// import { generateCanonicalUrl } from './path-resolvers'; // Commented out as unused

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'service' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Service' | 'Article' | 'BreadcrumbList' | 'LocalBusiness';
  data: Record<string, any>;
}

/**
 * Generate optimized page title with proper length and branding
 */
export function generateTitle(title?: string, includeCompany = true): string {
  if (!title) {
    return `${COMPANY.NAME} - ${COMPANY.TAGLINE}`;
  }

  const baseTitle = title.trim();
  const companyName = includeCompany ? ` | ${COMPANY.NAME}` : '';
  const fullTitle = `${baseTitle}${companyName}`;

  // Optimize for search engines (50-60 characters ideal)
  if (fullTitle.length > 60) {
    const truncated = baseTitle.substring(0, 60 - companyName.length - 3) + '...';
    return `${truncated}${companyName}`;
  }

  return fullTitle;
}

/**
 * Generate optimized meta description with proper length
 */
export function generateDescription(description?: string): string {
  if (!description) {
    return COMPANY.DESCRIPTION;
  }

  const cleanDescription = description.trim();

  // Optimize for search engines (150-160 characters ideal)
  if (cleanDescription.length > 160) {
    return cleanDescription.substring(0, 157) + '...';
  }

  return cleanDescription;
}

/**
 * Generate Open Graph image URL with fallback
 */
export function generateOGImage(image?: string, baseUrl = SITE.SITE_URL): string {
  if (!image) {
    return `${baseUrl}/images/nosytlabs-og.jpg`;
  }

  if (image.startsWith('http')) {
    return image;
  }

  const cleanImage = image.startsWith('/') ? image : `/${image}`;
  return `${baseUrl}${cleanImage}`;
}

/**
 * Generate keywords string from array
 */
export function generateKeywords(keywords?: string[]): string {
  const defaultKeywords = [
    'web development',
    'AI integration',
    'TypeScript',
    'React',
    'Astro',
    'professional services',
    'NosytLabs',
  ];

  const allKeywords = keywords ? [...keywords, ...defaultKeywords] : defaultKeywords;
  return [...new Set(allKeywords)].join(', ');
}

/**
 * Generate robots meta content
 */
export function generateRobots(noindex = false, nofollow = false): string {
  const directives = [];

  if (noindex) {
    directives.push('noindex');
  } else {
    directives.push('index');
  }

  if (nofollow) {
    directives.push('nofollow');
  } else {
    directives.push('follow');
  }

  directives.push('max-image-preview:large', 'max-snippet:-1', 'max-video-preview:-1');

  return directives.join(', ');
}

/**
 * Generate structured data for Organization
 */
export function generateOrganizationStructuredData(): StructuredDataProps {
  return {
    type: 'Organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: COMPANY.NAME,
      legalName: COMPANY.FULL_NAME,
      description: COMPANY.DESCRIPTION,
      url: SITE.SITE_URL,
      logo: `${SITE.SITE_URL}/images/logo.svg`,
      foundingDate: COMPANY.FOUNDED,
      email: CONTACT.EMAIL.MAIN,
      sameAs: [CONTACT.SOCIAL.GITHUB, CONTACT.SOCIAL.YOUTUBE],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Remote-First',
        addressCountry: 'US',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: CONTACT.EMAIL.MAIN,
        contactType: 'customer service',
      },
    },
  };
}

/**
 * Generate structured data for WebSite
 */
export function generateWebSiteStructuredData(): StructuredDataProps {
  return {
    type: 'WebSite',
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: COMPANY.NAME,
      description: COMPANY.DESCRIPTION,
      url: SITE.SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE.SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  };
}

/**
 * Generate structured data for Service
 */
export function generateServiceStructuredData(
  name: string,
  description: string,
  category?: string,
  price?: string
): StructuredDataProps {
  return {
    type: 'Service',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description,
      provider: {
        '@type': 'Organization',
        name: COMPANY.NAME,
        url: SITE.SITE_URL,
      },
      category: category || 'Web Development',
      offers: price
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
): StructuredDataProps {
  return {
    type: 'BreadcrumbList',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
  };
}

/**
 * Generate complete SEO meta tags object
 */
export function generateSEOTags(props: SEOProps, currentUrl: string) {
  const title = generateTitle(props.title);
  const description = generateDescription(props.description);
  const canonicalUrl = props.canonicalUrl || currentUrl;
  const ogImage = generateOGImage(props.image);
  const keywords = generateKeywords(props.keywords);
  const robots = generateRobots(props.noindex, props.nofollow);

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    robots,
    ogImage,
    imageAlt: props.imageAlt || `${COMPANY.NAME} - ${title}`,
    type: props.type || 'website',
    author: props.author || COMPANY.NAME,
    publishedTime: props.publishedTime,
    modifiedTime: props.modifiedTime,
    section: props.section,
    tags: props.tags,
  };
}

/**
 * Validate internal links (for build-time checking)
 */
export function validateInternalLink(href: string): boolean {
  // Basic validation for internal links
  if (!href || typeof href !== 'string') return false;

  // External links are valid
  if (href.startsWith('http://') || href.startsWith('https://')) return true;

  // Internal links should start with / or be relative
  if (href.startsWith('/') || !href.includes('://')) return true;

  return false;
}

/**
 * Extract and validate all internal links from content
 */
export function extractInternalLinks(content: string): string[] {
  const linkRegex = /href=["']([^"']+)["']/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      links.push(href);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}
