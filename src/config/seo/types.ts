/**
 * SEO Configuration Types
 * Shared interfaces and types for SEO configurations
 */

export interface PageSEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    type?: string;
    images?: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  canonical?: string;
  alternates?: {
    languages?: Record<string, string>;
  };
  robots?: string;
}

export interface ServiceSEOTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  canonicalTemplate: string;
  keywordBase: string[];
  openGraph: {
    titleTemplate: string;
    descriptionTemplate: string;
    type: string;
    imageTemplate: string;
  };
  twitter: {
    card: string;
    titleTemplate: string;
    descriptionTemplate: string;
    imageTemplate: string;
  };
}

export interface StructuredDataSchema {
  '@context'?: string;
  '@type'?: string;
  [key: string]: any;
}

export interface StructuredDataConfig {
  organization: StructuredDataSchema;
  website: StructuredDataSchema;
  service: StructuredDataSchema;
  breadcrumbs: StructuredDataSchema;
  faq: StructuredDataSchema;
  article: StructuredDataSchema;
  localBusiness: StructuredDataSchema;
}