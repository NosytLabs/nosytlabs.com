// Blog and Content Collection Type Definitions

import type { CollectionEntry } from 'astro:content';

/**
 * Blog post data interface matching content collection schema
 */
export interface BlogPostData {
  title: string
  description: string
  pubDate: Date
  author: string
  category?: string
  tags: string[]
  seoKeywords?: string[]
  excerpt?: string
  draft: boolean
  featured: boolean
  updatedDate?: Date
  readingTime?: number
  heroImage?: string
  headingStructure?: {
    h1Count: number
    hasH2: boolean
    maxDepth: number
  }
}

/**
 * Service data interface matching content collection schema
 */
export interface ServiceData {
  title: string
  description: string
  icon: string
  heroSubtitle?: string
  price?: string
  delivery?: string
  popular?: boolean
  benefits?: string[]
  features?: string[]
  ctaPrimary?: {
    href: string
    text: string
  }
  ctaSecondary?: {
    href: string
    text: string
  }
  category?: string
  tags?: string[]
  featured: boolean
  deliverables?: string[]
  timeline?: string
}

/**
 * Typed content collection entries using Astro's built-in types
 */
export type BlogPost = CollectionEntry<'blog'>
export type Service = CollectionEntry<'services'>

/**
 * Content collection types
 */
export interface Collections {
  blog: BlogPost[]
  services: Service[]
}
