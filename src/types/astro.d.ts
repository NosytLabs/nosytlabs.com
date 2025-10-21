// Astro-specific type definitions

/**
 * Astro pagination interface for getStaticPaths
 */
export interface AstroPaginationPage<T = any> {
  data: T[];
  start: number;
  end: number;
  size: number;
  total: number;
  currentPage: number;
  lastPage: number;
  url: {
    current: string;
    prev?: string;
    next?: string;
  };
}

/**
 * Astro getStaticPaths return type with pagination
 */
export interface AstroStaticPath {
  params: Record<string, string | number>;
  props?: Record<string, any>;
}

/**
 * Astro page props interface
 */
export interface AstroPageProps {
  page?: AstroPaginationPage;
  [key: string]: any;
}

/**
 * Content collection entry interface
 */
export interface ContentCollectionEntry<T = any> {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: T;
  render: () => Promise<{
    Content: any;
    headings: Array<{
      depth: number;
      slug: string;
      text: string;
    }>;
    remarkPluginFrontmatter: Record<string, any>;
  }>;
}

/**
 * Blog post frontmatter interface
 */
export interface BlogPostFrontmatter {
  title: string;
  description: string;
  publishDate: string | Date;
  author?: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  draft?: boolean;
  image?: string;
  imageAlt?: string;
}

/**
 * Service page frontmatter interface
 */
export interface ServiceFrontmatter {
  title: string;
  description: string;
  icon?: string;
  heroSubtitle?: string;
  price?: string;
  delivery?: string;
  popular?: boolean;
  benefits?: string[];
  features?: string[];
  category?: string;
  tags?: string[];
  featured?: boolean;
  timeline?: string;
  deliverables?: string[];
  ctaPrimary?: {
    text: string;
    href: string;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
}
