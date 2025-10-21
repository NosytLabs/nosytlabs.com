import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default("NOSYT Labs"),
    tags: z.array(z.string()),
    
    // Optional fields
    category: z.string().optional(),
    seoKeywords: z.array(z.string()).optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    updatedDate: z.date().optional(),
    readingTime: z.number().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
  })
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    icon: z.string().optional(),
    price: z.string().optional(),
    delivery: z.string().optional(),
    features: z.array(z.string()).optional(),
    category: z.string().optional(),
    featured: z.boolean().optional(),
  })
});

export const collections = {
  'blog': blogCollection,
  'services': servicesCollection,
};
