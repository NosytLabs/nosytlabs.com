import type { PageSEOConfig } from './types';
import { DEFAULT_SEO } from './defaults';
import { PAGE_SEO_CONFIG } from './pages';
import { SERVICE_SEO_TEMPLATES } from './service-templates';

/**
 * Utility functions for SEO configuration management
 */

/**
 * Get SEO configuration for a specific page
 * Merges default SEO with page-specific overrides
 */
export function getPageSEO(pageKey: string): PageSEOConfig {
  const pageSEO = PAGE_SEO_CONFIG[pageKey];
  
  if (!pageSEO) {
    const result: PageSEOConfig = {};
    if (DEFAULT_SEO.title) result.title = DEFAULT_SEO.title;
    if (DEFAULT_SEO.description) result.description = DEFAULT_SEO.description;
    if (DEFAULT_SEO.keywords) result.keywords = DEFAULT_SEO.keywords;
    // openGraph and twitter are not part of DEFAULT_SEO
    if (DEFAULT_SEO.canonicalUrl) result.canonical = DEFAULT_SEO.canonicalUrl;
    // alternates and robots are not part of DEFAULT_SEO
    return result;
  }

  const result: PageSEOConfig = {};
  const title = pageSEO.title || DEFAULT_SEO.title;
  if (title) result.title = title;
  const description = pageSEO.description || DEFAULT_SEO.description;
  if (description) result.description = description;
  const keywords = pageSEO.keywords || DEFAULT_SEO.keywords;
  if (keywords) result.keywords = keywords;
  if (pageSEO.openGraph) result.openGraph = pageSEO.openGraph;
  if (pageSEO.twitter) result.twitter = pageSEO.twitter;
  const canonical = pageSEO.canonical || DEFAULT_SEO.canonicalUrl;
  if (canonical) result.canonical = canonical;
  if (pageSEO.alternates) result.alternates = pageSEO.alternates;
  if (pageSEO.robots) result.robots = pageSEO.robots;
  return result;
}

/**
 * Generate SEO configuration for a specific service
 * Uses service templates to create dynamic SEO metadata
 */
export function generateServiceSEO(
  serviceName: string,
  serviceSlug: string,
  serviceCategory: string,
  shortDescription: string,
  additionalKeywords: string[] = []
): PageSEOConfig {
  const template = SERVICE_SEO_TEMPLATES[serviceCategory];
  
  if (!template) {
    return getPageSEO('services');
  }

  // Replace template placeholders
  const replacePlaceholders = (text: string): string => {
    return text
      .replace(/{serviceName}/g, serviceName)
      .replace(/{slug}/g, serviceSlug)
      .replace(/{shortDescription}/g, shortDescription);
  };

  const title = replacePlaceholders(template.titleTemplate);
  const description = replacePlaceholders(template.descriptionTemplate);
  const canonical = replacePlaceholders(template.canonicalTemplate);

  // Combine base keywords with additional ones
  const keywords = [
    ...template.keywordBase,
    ...additionalKeywords,
    serviceName.toLowerCase(),
    serviceSlug.replace(/-/g, ' ')
  ];

  const openGraph = {
    title: replacePlaceholders(template.openGraph.titleTemplate),
    description: replacePlaceholders(template.openGraph.descriptionTemplate),
    type: template.openGraph.type,
    images: [{
      url: replacePlaceholders(template.openGraph.imageTemplate),
      width: 1200,
      height: 630,
      alt: `${serviceName} - NosytLabs`
    }]
  };

  const twitter = {
    card: template.twitter.card,
    title: replacePlaceholders(template.twitter.titleTemplate),
    description: replacePlaceholders(template.twitter.descriptionTemplate),
    images: [replacePlaceholders(template.twitter.imageTemplate)]
  };

  return {
    title,
    description,
    keywords,
    openGraph,
    twitter,
    canonical,
    robots: 'index, follow'
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate article structured data
 */
export function generateArticleData({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'NosytLabs',
  imageUrl
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'NosytLabs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nosytlabs.com/images/logo.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630
      }
    })
  };
}

/**
 * Validate and sanitize SEO data
 */
export function sanitizeSEOData(seoData: Partial<PageSEOConfig>): PageSEOConfig {
  const title = seoData.title || DEFAULT_SEO.title || '';
  const description = seoData.description || DEFAULT_SEO.description || '';
  
  const sanitized: PageSEOConfig = {};
  
  // Only add properties if they have defined values
  if (title) {
    sanitized.title = title.slice(0, 60);
  }
  if (description) {
    sanitized.description = description.slice(0, 160);
  }
  const keywords = seoData.keywords || DEFAULT_SEO.keywords;
  if (keywords) {
    sanitized.keywords = keywords;
  }
  if (seoData.openGraph) {
    sanitized.openGraph = seoData.openGraph;
  }
  if (seoData.twitter) {
    sanitized.twitter = seoData.twitter;
  }
  if (seoData.canonical) {
    sanitized.canonical = seoData.canonical;
  }
  if (seoData.alternates) {
    sanitized.alternates = seoData.alternates;
  }
  if (seoData.robots) {
    sanitized.robots = seoData.robots;
  }

  // Ensure title doesn't exceed recommended length
  if (sanitized.title && sanitized.title.length > 60) {
    sanitized.title = sanitized.title.slice(0, 57) + '...';
  }

  // Ensure description doesn't exceed recommended length
  if (sanitized.description && sanitized.description.length > 160) {
    sanitized.description = sanitized.description.slice(0, 157) + '...';
  }

  return sanitized;
}