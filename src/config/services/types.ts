/**
 * Service Types and Interfaces
 * Shared types used across all service configurations
 */

export interface DetailedFeatureGroup {
  title: string;
  description: string;
  items: string[];
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  company: string;
}

export interface ServiceData {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  category: string;
  href: string;
  features: string[];
  detailedFeatures: DetailedFeatureGroup[];
  price: string;
  timeline: string;
  cta: string;
  popular?: boolean;
  background?: string;
  testimonial?: ServiceTestimonial;
  metadata: {
    keywords?: string[];
    title?: string;
    description?: string;
  };
}