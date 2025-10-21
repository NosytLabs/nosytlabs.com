import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    author: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string())
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
