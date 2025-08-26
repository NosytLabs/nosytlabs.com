import type { StructuredDataConfig } from './types';
import { COMPANY_INFO } from './defaults';

/**
 * Structured data configurations for rich snippets and SEO
 * Provides schema.org markup for better search engine understanding
 */
export const STRUCTURED_DATA_CONFIG: StructuredDataConfig = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    description: COMPANY_INFO.description,
    url: COMPANY_INFO.url,
    logo: `${COMPANY_INFO.url}/images/logo.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phone,
      contactType: 'customer service',
      availableLanguage: ['English']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'Global',
      addressLocality: 'Remote'
    },
    sameAs: [
      'https://github.com/nosytlabs',
      'https://linkedin.com/company/nosytlabs',
      'https://twitter.com/nosytlabs'
    ],
    foundingDate: '2023',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 20
    },
    knowsAbout: [
      'Web Development',
      'AI Integration',
      'Technical Consulting',
      'React Development',
      'Next.js',
      'TypeScript',
      'Machine Learning',
      'Process Automation'
    ]
  },

  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY_INFO.name,
    description: COMPANY_INFO.description,
    url: COMPANY_INFO.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${COMPANY_INFO.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${COMPANY_INFO.url}/images/logo.svg`
      }
    },
    copyrightYear: new Date().getFullYear(),
    inLanguage: 'en-US'
  },

  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      url: COMPANY_INFO.url
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${COMPANY_INFO.url}/contact`,
      serviceSmsNumber: COMPANY_INFO.phone,
      servicePhone: COMPANY_INFO.phone
    },
    category: 'Technology Services',
    serviceType: [
      'Web Development',
      'AI Integration',
      'Technical Consulting'
    ]
  },

  breadcrumbs: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: []
  },

  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: []
  },

  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    publisher: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${COMPANY_INFO.url}/images/logo.svg`
      }
    },
    author: {
      '@type': 'Organization',
      name: COMPANY_INFO.name
    },
    mainEntityOfPage: {
      '@type': 'WebPage'
    }
  },

  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: COMPANY_INFO.name,
    description: COMPANY_INFO.description,
    url: COMPANY_INFO.url,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    priceRange: '$$',
    paymentAccepted: ['Credit Card', 'PayPal', 'Bank Transfer'],
    currenciesAccepted: 'USD',
    openingHours: 'Mo-Fr 09:00-18:00',
    serviceArea: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Web Development Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom Web Applications',
                description: 'Modern web application development using React, Next.js, and TypeScript with AI-assisted development'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'E-commerce Solutions',
                description: 'Complete e-commerce platform development and integration'
              }
            }
          ]
        },
        {
          '@type': 'OfferCatalog',
          name: 'AI Integration Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI Tool Integration',
                description: 'Integration of modern AI services and platforms like OpenAI into business workflows'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Process Automation',
                description: 'Workflow automation using modern AI tools and development practices'
              }
            }
          ]
        }
      ]
    }
  }
};