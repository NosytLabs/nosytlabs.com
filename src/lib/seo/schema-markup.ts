/**
 * Schema Markup Generator for SEO
 * Generates JSON-LD structured data for Google, ChatGPT, Gemini, and other search engines
 */

export interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
  minPrice: number;
  maxPrice?: number;
  priceCurrency?: string;
  areaServed?: string[];
  reviewRating?: number;
  reviewCount?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate Service schema (for AI search optimization)
 */
export function generateServiceSchema(props: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: props.name,
    description: props.description,
    provider: {
      "@type": "Organization",
      name: props.provider || "NOSYT Labs",
      url: "https://nosytlabs.com",
      logo: "https://nosytlabs.com/images/logo.svg",
    },
    areaServed: props.areaServed || ["Worldwide"],
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: props.minPrice.toString(),
        ...(props.maxPrice && { maxPrice: props.maxPrice.toString() }),
        priceCurrency: props.priceCurrency || "USD",
      },
    },
    ...(props.reviewRating &&
      props.reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: props.reviewRating.toString(),
          reviewCount: props.reviewCount.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      }),
  };
}

/**
 * Generate FAQ Page schema (for featured snippets + AI answers)
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Local Business schema (for local SEO)
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "NOSYT Labs",
    url: "https://nosytlabs.com",
    logo: "https://nosytlabs.com/images/logo.svg",
    description: "Web development and AI integration agency",
    email: "hi@nosytlabs.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hi@nosytlabs.com",
      availableLanguage: "English",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
  };
}

/**
 * Generate Organization schema (for brand authority)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NOSYT Labs",
    url: "https://nosytlabs.com",
    logo: "https://nosytlabs.com/images/logo.svg",
    description:
      "Premium web development and AI integration agency specializing in custom solutions for modern businesses.",
    email: "hi@nosytlabs.com",
    sameAs: [
      "https://github.com/nosytlabs",
      "https://linkedin.com/company/nosyt-labs",
      "https://twitter.com/nosytlabs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hi@nosytlabs.com",
    },
  };
}

/**
 * Generate HowTo schema (for how-to content)
 */
export interface HowToStep {
  name: string;
  text: string;
}

export function generateHowToSchema(title: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: (index + 1).toString(),
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Generate BreadcrumbList schema (for site navigation)
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: (index + 1).toString(),
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Convert schema object to JSON-LD script tag (for use in Astro)
 */
export function schemaToScriptTag(schema: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
