import { defineCollection, z } from 'astro:content';

const projectCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic Information
    title: z.string(),
    description: z.string(),
    excerpt: z.string().max(160), // For meta descriptions and previews

    // Project Classification
    category: z.enum([
      'web-development',
      'ai-integration',
      'consulting',
      'mobile-development',
      'automation',
    ]),
    subcategory: z.string().optional(),
    status: z.enum(['completed', 'in-progress', 'featured', 'archived']),
    featured: z.boolean().default(false),

    // Client Information
    client: z.object({
      name: z.string(),
      industry: z.string(),
      companySize: z.enum(['startup', 'small-business', 'mid-market', 'enterprise']),
      website: z.string().url().optional(),
      testimonial: z
        .object({
          quote: z.string(),
          author: z.string(),
          role: z.string().optional(),
          position: z.string().optional(),
          rating: z.number().optional(),
          avatar: z.string().optional(),
          featured: z.boolean().default(false),
        })
        .optional(),
    }),

    // Project Timeline
    timeline: z.object({
      startDate: z.date(),
      endDate: z.date().optional(),
      duration: z.string(), // e.g., "3 months", "6 weeks"
      phases: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            startDate: z.date(),
            endDate: z.date().optional(),
            status: z.enum(['completed', 'in-progress', 'planned']),
          })
        )
        .optional(),
    }),

    // Project Scope
    scope: z.object({
      budgetRange: z.enum([
        'under-10k',
        '10k-25k',
        '25k-50k',
        '50k-100k',
        '100k-250k',
        'over-100k',
      ]),
      teamSize: z.number().min(1),
      technologies: z.array(z.string()),
      services: z.array(z.string()), // Services provided
    }),

    // Challenges & Solutions
    challenges: z
      .array(
        z.object({
          challenge: z.string(),
          solution: z.string(),
          impact: z.string(),
        })
      )
      .optional(),

    // Measurable Results
    results: z.object({
      metrics: z.array(
        z.object({
          name: z.string().optional(),
          label: z.string(),
          value: z.string(),
          description: z.string().optional(),
          improvement: z.string().optional(), // e.g., "+150%", "500% faster"
          icon: z.string().optional(),
        })
      ),
      roi: z.string().optional(),
      userEngagement: z
        .object({
          before: z.string().optional(),
          after: z.string().optional(),
          improvement: z.string().optional(),
        })
        .optional(),
      performanceMetrics: z
        .object({
          pageLoadTime: z.string().optional(),
          seoImprovement: z.string().optional(),
          conversionRate: z.string().optional(),
        })
        .optional(),
    }),

    // Media Assets
    media: z.object({
      heroImage: z.string(),
      gallery: z
        .array(
          z.object({
            src: z.string(),
            alt: z.string(),
            caption: z.string().optional(),
            type: z.enum(['screenshot', 'mockup', 'diagram', 'result']),
          })
        )
        .optional(),
      videos: z
        .array(
          z.object({
            src: z.string(), // YouTube, Vimeo, or direct URL
            title: z.string(),
            description: z.string().optional(),
            thumbnail: z.string().optional(),
            type: z.enum(['demo', 'testimonial', 'presentation', 'tutorial']),
          })
        )
        .optional(),
      beforeAfter: z
        .array(
          z.object({
            before: z.string(),
            after: z.string(),
            description: z.string().optional(),
          })
        )
        .optional(),
      downloads: z
        .array(
          z.object({
            title: z.string(),
            description: z.string().optional(),
            url: z.string(),
            type: z.enum([
              'case-study-pdf',
              'technical-report',
              'presentation',
              'mockups',
              'compliance-guide',
            ]),
          })
        )
        .optional(),
    }),

    // Technical Details
    technical: z
      .object({
        architecture: z.string().optional(),
        deployment: z.string().optional(),
        apis: z.array(z.string()).optional(),
        database: z.string().optional(),
        hosting: z.string().optional(),
        codeRepository: z.string().url().optional(), // If public
      })
      .optional(),

    // SEO & Metadata
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()),
      ogImage: z.string().optional(),
      canonicalUrl: z.string().url().optional(),
    }),

    // Related Projects
    relatedProjects: z.array(z.string()).optional(), // Slugs of related projects

    // Publishing
    publishedAt: z.date(),
    lastModified: z.date(),
    draft: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().max(160),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    publishDate: z.date(),
    lastModified: z.date().optional(),
    featuredImage: z.string().optional(),
    readingTime: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectCollection,
  blog: blogCollection,
};
