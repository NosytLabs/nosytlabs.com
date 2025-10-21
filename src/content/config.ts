import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    // Required fields
    title: z.string().min(10).max(100),
    description: z.string().min(50).max(200),
    pubDate: z.date(),
    author: z.string().default("NOSYT Labs"),

    // Content categorization
    category: z.string().optional(),
    tags: z.array(z.string()).min(1).max(10),

    // SEO and metadata
    seoKeywords: z.array(z.string()).optional(),
    excerpt: z.string().min(100).max(300).optional(),

    // Content status and timing
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    updatedDate: z.date().optional(),
    readingTime: z.number().min(1).max(30).optional(),

    // Visual content
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    // Content structure validation
    headingStructure: z
      .object({
        h1Count: z.number().max(1).default(1),
        hasH2: z.boolean().default(true),
        maxDepth: z.number().max(6).default(3),
      })
      .optional(),
  }),
});

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    image: z.string().optional(),
    heroSubtitle: z.string().optional(),
    price: z.string().optional(),
    delivery: z.string().optional(),
    popular: z.boolean().optional(),
    benefits: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    ctaPrimary: z
      .object({
        href: z.string(),
        text: z.string(),
      })
      .optional(),
    ctaSecondary: z
      .object({
        href: z.string(),
        text: z.string(),
      })
      .optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    deliverables: z.array(z.string()).optional(),
    timeline: z.string().optional(),
  }),
});

export const collections = { blog, services };
