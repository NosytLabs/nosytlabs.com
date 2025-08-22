// Direct blog data type definition
export type BlogData = {
  title: string;
  description: string;
  excerpt: string;
  slug?: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: Date;
  lastModified?: Date;
  featuredImage?: string;
  readingTime?: string;
  draft: boolean;
  featured: boolean;
};

// BlogPost interface for compatibility
export interface BlogPost {
  title: string;
  description: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: Date;
  lastModified?: Date;
  featuredImage?: string;
  readingTime?: string;
  draft: boolean;
  featured: boolean;
}

// Blog category types
export type BlogCategory =
  | 'web-development'
  | 'ai-integration'
  | 'consulting'
  | 'mobile-development'
  | 'automation'
  | 'tutorials'
  | 'case-studies'
  | 'industry-insights';

// Blog status types
export type BlogStatus = 'published' | 'draft' | 'archived' | 'featured';

// Enhanced blog post with additional metadata
export interface EnhancedBlogPost extends BlogPost {
  id: string;
  url: string;
  readTime: number;
  wordCount: number;
  relatedPosts?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    ogImage?: string;
  };
}
