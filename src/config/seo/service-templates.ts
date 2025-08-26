import type { ServiceSEOTemplate } from './types';

/**
 * SEO templates for different service categories
 * Used to generate dynamic SEO metadata for individual services
 */
export const SERVICE_SEO_TEMPLATES: Record<string, ServiceSEOTemplate> = {
  'web-development': {
    titleTemplate: '{serviceName} - Professional Web Development | NosytLabs',
    descriptionTemplate: 'Modern {serviceName} services using current technologies. {shortDescription} Get web development solutions built with AI assistance and modern tools.',
    keywordBase: [
      'web development',
      'React development',
      'Next.js',
      'TypeScript',
      'responsive design',
      'modern web apps'
    ],
    openGraph: {
      titleTemplate: '{serviceName} - NosytLabs',
      descriptionTemplate: 'Professional {serviceName} services. {shortDescription}',
      type: 'website',
      imageTemplate: '/images/services/web-development/{slug}-og.webp'
    },
    twitter: {
      card: 'summary_large_image',
      titleTemplate: '{serviceName} - NosytLabs',
      descriptionTemplate: 'Professional {serviceName} services. {shortDescription}',
      imageTemplate: '/images/services/web-development/{slug}-twitter.webp'
    },
    canonicalTemplate: 'https://nosytlabs.com/services/web-development/{slug}/'
  },

  'ai-integration': {
    titleTemplate: '{serviceName} - AI Integration Services | NosytLabs',
    descriptionTemplate: 'AI-assisted {serviceName} services using modern AI tools. {shortDescription} Enhance your business with intelligent automation built using AI development tools.',
    keywordBase: [
      'AI integration',
      'machine learning',
      'artificial intelligence',
      'automation',
      'intelligent systems',
      'AI consulting'
    ],
    openGraph: {
      titleTemplate: '{serviceName} - AI Integration | NosytLabs',
      descriptionTemplate: 'Expert {serviceName} with AI technology. {shortDescription}',
      type: 'website',
      imageTemplate: '/images/services/ai-integration/{slug}-og.webp'
    },
    twitter: {
      card: 'summary_large_image',
      titleTemplate: '{serviceName} - AI Integration | NosytLabs',
      descriptionTemplate: 'Expert {serviceName} with AI technology. {shortDescription}',
      imageTemplate: '/images/services/ai-integration/{slug}-twitter.webp'
    },
    canonicalTemplate: 'https://nosytlabs.com/services/ai-integration/{slug}/'
  },

  'consulting': {
    titleTemplate: '{serviceName} - Technical Consulting | NosytLabs',
    descriptionTemplate: 'Collaborative {serviceName} for your business growth. {shortDescription} AI-assisted guidance for technical decision-making.',
    keywordBase: [
      'technical consulting',
      'software architecture',
      'technology strategy',
      'digital transformation',
      'technical advisory',
      'system design'
    ],
    openGraph: {
      titleTemplate: '{serviceName} - Technical Consulting | NosytLabs',
      descriptionTemplate: 'Strategic {serviceName} services. {shortDescription}',
      type: 'website',
      imageTemplate: '/images/services/consulting/{slug}-og.webp'
    },
    twitter: {
      card: 'summary_large_image',
      titleTemplate: '{serviceName} - Technical Consulting | NosytLabs',
      descriptionTemplate: 'Strategic {serviceName} services. {shortDescription}',
      imageTemplate: '/images/services/consulting/{slug}-twitter.webp'
    },
    canonicalTemplate: 'https://nosytlabs.com/services/consulting/{slug}/'
  }
};