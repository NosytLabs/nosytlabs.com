/**
 * SEO Utilities for NosytLabs Website
 * Comprehensive SEO meta tag generation and structured data utilities
 */

import { COMPANY, SITE, CONTACT } from '../config/constants/index';
import { generateCanonicalUrl } from './path-resolvers';
import type { BlogPost } from '../types/blog';

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
  const canonicalUrl = generateCanonicalUrl(props.canonicalUrl || currentUrl);
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

/**
 * Generate SEO metadata for blog posts
 */
export function generateBlogPostSEO(post: BlogPost, baseUrl: string = SITE.SITE_URL): SEOProps {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage ? 
    (post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`) : 
    `${baseUrl}/images/blog-default.jpg`;

  // Generate keywords from tags and category
  const keywords = [
    ...post.tags,
    post.category,
    'web development',
    'NosyT Labs',
    'technology',
    'programming'
  ];

  const seoProps: SEOProps = {
    title: post.title,
    description: post.description,
    keywords,
    image: imageUrl,
    type: 'article',
    author: post.author,
    publishedTime: post.publishDate instanceof Date ? post.publishDate.toISOString() : post.publishDate,
    section: post.category,
    tags: post.tags,
    canonicalUrl: postUrl
  };

  // Only add modifiedTime if it exists
  if (post.lastModified) {
    seoProps.modifiedTime = post.lastModified instanceof Date ? post.lastModified.toISOString() : post.lastModified;
  }

  return seoProps;
}

/**
 * Generate SEO metadata for blog category pages
 */
export function generateCategorySEO(category: string, postCount: number, baseUrl: string = SITE.SITE_URL): SEOProps {
  const categoryUrl = `${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`;
  
  return {
    title: `${category} Articles`,
    description: `Explore ${postCount} articles about ${category} from NosyT Labs. Stay updated with the latest insights, tutorials, and best practices.`,
    keywords: [category, 'articles', 'tutorials', 'NosyT Labs', 'web development'],
    canonicalUrl: categoryUrl,
    type: 'website'
  };
}

/**
 * Generate SEO metadata for blog tag pages
 */
export function generateTagSEO(tag: string, postCount: number, baseUrl: string = SITE.SITE_URL): SEOProps {
  const tagUrl = `${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`;
  
  return {
    title: `${tag} Posts`,
    description: `Browse ${postCount} posts tagged with ${tag}. Find relevant content and insights from NosyT Labs.`,
    keywords: [tag, 'posts', 'articles', 'NosyT Labs'],
    canonicalUrl: tagUrl,
    type: 'website'
  };
}

/**
 * Generate structured data for blog posts
 */
export function generateBlogPostStructuredData(post: BlogPost, baseUrl: string = SITE.SITE_URL): StructuredDataProps {
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage ? 
    (post.featuredImage.startsWith('http') ? post.featuredImage : `${baseUrl}${post.featuredImage}`) : 
    `${baseUrl}/images/blog-default.jpg`;

  return {
    type: 'Article',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: imageUrl,
      author: {
        '@type': 'Person',
        name: post.author
      },
      publisher: {
        '@type': 'Organization',
        name: COMPANY.NAME,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.svg`
        }
      },
      datePublished: post.publishDate instanceof Date ? post.publishDate.toISOString() : post.publishDate,
      dateModified: post.lastModified instanceof Date ? post.lastModified.toISOString() : (post.lastModified || (post.publishDate instanceof Date ? post.publishDate.toISOString() : post.publishDate)),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl
      },
      keywords: [...post.tags, post.category].join(', '),
      articleSection: post.category,
      wordCount: estimateWordCount(post.excerpt || post.description || ''),
      timeRequired: post.readingTime
    }
  };
}

/**
 * Estimate word count from content
 */
export function estimateWordCount(content: string): number {
  // Remove markdown syntax and HTML tags
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[#*_~\[\]()]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return cleanContent ? cleanContent.split(' ').length : 0;
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): string {
  const wordCount = estimateWordCount(content);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown and HTML
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_~\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Find the last complete sentence within the limit
  const truncated = cleanContent.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  // If no good sentence break, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}
