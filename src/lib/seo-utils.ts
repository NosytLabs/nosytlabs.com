/**
 * SEO Utilities for NOSYT Labs
 * Provides functions for generating structured data and meta tags
 */

import { SITE_CONFIG, COMPANY_INFO } from "./constants";

export interface StructuredDataOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
  };
  contactPoint: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

export interface StructuredDataWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  url: string;
  name: string;
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface StructuredDataBlogPosting {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    "@type": "Organization";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  image?: string;
  keywords?: string[];
}

export interface StructuredDataService {
  "@context": "https://schema.org";
  "@type": "Service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  areaServed: string;
  serviceType: string;
  offers?: {
    "@type": "Offer";
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}

export interface StructuredDataLocalBusiness {
  "@context": "https://schema.org";
  "@type": "LocalBusiness";
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality?: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(): StructuredDataOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_INFO.NAME,
    url: SITE_CONFIG.BASE_URL,
    logo: SITE_CONFIG.LOGO_PATH,
    description: COMPANY_INFO.DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE_CONFIG.EMAILS.HELLO,
    },
    sameAs: [
      "https://twitter.com/nosytlabs",
      "https://linkedin.com/company/nosytlabs",
      "https://github.com/nosytlabs",
    ],
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema(): StructuredDataWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_CONFIG.BASE_URL,
    name: COMPANY_INFO.NAME,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_CONFIG.BASE_URL}/blog/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BlogPosting structured data
 */
export function generateBlogPostingSchema(
  title: string,
  description: string,
  url: string,
  datePublished: Date,
  dateModified?: Date,
  image?: string,
  keywords?: string[],
): StructuredDataBlogPosting {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
    author: {
      "@type": "Organization",
      name: COMPANY_INFO.NAME,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.NAME,
      logo: {
        "@type": "ImageObject",
        url: SITE_CONFIG.LOGO_ICON_PATH,
      },
    },
    ...(image && { image }),
    ...(keywords && keywords.length > 0 && { keywords }),
  };
}

/**
 * Generate Service structured data
 */
export function generateServiceSchema(
  name: string,
  description: string,
  serviceType: string,
  price?: string,
): StructuredDataService {
  const schema: StructuredDataService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: COMPANY_INFO.NAME,
      url: SITE_CONFIG.BASE_URL,
    },
    areaServed: "Worldwide",
    serviceType,
  };

  if (price) {
    schema.offers = {
      "@type": "Offer",
      price: price.replace(/[^0-9]/g, ""),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    };
  }

  return schema;
}

/**
 * Generate LocalBusiness structured data for GEO targeting
 */
export function generateLocalBusinessSchema(): StructuredDataLocalBusiness {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_INFO.NAME,
    description: COMPANY_INFO.DESCRIPTION,
    url: SITE_CONFIG.BASE_URL,
    email: SITE_CONFIG.EMAILS.HELLO,
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
      addressLocality: "Remote",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };
}

/**
 * Generate meta keywords string from array
 */
export function generateKeywordsString(keywords: string[]): string {
  return keywords.join(", ");
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(pathname: string): string {
  const cleanPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;
  return `${SITE_CONFIG.BASE_URL}${cleanPath}`;
}

/**
 * Generate OG image URL
 */
export function generateOgImageUrl(imagePath?: string): string {
  // Default to site OG image when none provided
  const basePrefix = import.meta.env.BASE_URL || "/";
  const normalizedBase = basePrefix.endsWith("/")
    ? basePrefix
    : `${basePrefix}/`;

  if (!imagePath) {
    imagePath = SITE_CONFIG.OG_IMAGE_PATH;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If the path already includes the base prefix, strip it once to avoid double prefixing
  let cleanPath = imagePath;
  if (cleanPath.startsWith(normalizedBase)) {
    cleanPath = `/${cleanPath.slice(normalizedBase.length)}`;
  } else if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  // Prepend absolute site BASE_URL
  return `${SITE_CONFIG.BASE_URL}${cleanPath}`;
}
