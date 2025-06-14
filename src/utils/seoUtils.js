/**
 * SEO Utilities - Simplified and Optimized
 * Generates meta tags and structured data for enhanced SEO
 */

const defaultSEOData = {
  siteName: 'NosytLabs',
  siteUrl: 'https://nosytlabs.com',
  defaultTitle: 'NosytLabs - Digital Innovation & Technology Solutions',
  defaultDescription: 'Professional digital solutions including web development, AI integration, 3D printing, content creation, and passive income strategies.',
  defaultImage: '/images/nosytlabs-og-image.jpg',
  defaultKeywords: 'web development, AI integration, 3D printing, content creation, passive income, digital solutions, technology consulting'
};

const pageData = {
  home: {
    title: 'NosytLabs - Digital Innovation & Technology Solutions',
    description: 'Transform your digital presence with our comprehensive technology solutions. Web development, AI integration, 3D printing, and more.',
    keywords: 'digital innovation, technology solutions, web development, AI integration, 3D printing, content creation'
  },
  about: {
    title: 'About NosytLabs - Our Story & Mission',
    description: 'Learn about NosytLabs\' journey in digital innovation and our commitment to delivering cutting-edge technology solutions.',
    keywords: 'about nosytlabs, company story, mission, digital innovation team, technology experts'
  },
  services: {
    title: 'Professional Digital Services - NosytLabs',
    description: 'Comprehensive digital services including web development, AI integration, 3D printing solutions, and content creation.',
    keywords: 'digital services, web development services, AI integration, 3D printing services, content creation'
  },
  projects: {
    title: 'Our Projects & Portfolio - NosytLabs',
    description: 'Explore our portfolio of successful digital projects and innovative technology solutions.',
    keywords: 'portfolio, projects, digital solutions, technology projects, case studies'
  },
  contact: {
    title: 'Contact NosytLabs - Get In Touch',
    description: 'Ready to start your digital transformation? Contact NosytLabs for professional technology solutions.',
    keywords: 'contact nosytlabs, get quote, digital solutions consultation, technology services'
  },
  blog: {
    title: 'NosytLabs Blog - Technology Insights & Trends',
    description: 'Stay updated with the latest technology trends, insights, and tutorials from the NosytLabs team.',
    keywords: 'technology blog, tech insights, digital trends, tutorials, industry news'
  },
  nosytos: {
    title: 'NosytOS - Retro Computing Experience',
    description: 'Experience the nostalgia of classic computing with NosytOS, our Windows 95-inspired web interface.',
    keywords: 'nosytos, retro computing, windows 95, vintage interface, nostalgic computing'
  }
};

export function generateMetaTags(pageKey = 'home', customData = {}) {
  const page = pageData[pageKey] || pageData.home;
  
  const seoData = {
    title: customData.title || page.title || defaultSEOData.defaultTitle,
    description: customData.description || page.description || defaultSEOData.defaultDescription,
    keywords: customData.keywords || page.keywords || defaultSEOData.defaultKeywords,
    ogImage: customData.ogImage || defaultSEOData.defaultImage,
    canonical: `${defaultSEOData.siteUrl}${pageKey === 'home' ? '' : '/' + pageKey}`,
    
    // Open Graph specific
    ogTitle: customData.ogTitle || customData.title || page.title || defaultSEOData.defaultTitle,
    ogDescription: customData.ogDescription || customData.description || page.description || defaultSEOData.defaultDescription,
    ogType: customData.ogType || 'website',
    
    // Twitter specific
    twitterTitle: customData.twitterTitle || customData.title || page.title || defaultSEOData.defaultTitle,
    twitterDescription: customData.twitterDescription || customData.description || page.description || defaultSEOData.defaultDescription,
    twitterImage: customData.twitterImage || customData.ogImage || defaultSEOData.defaultImage
  };
  
  return seoData;
}

export function generateStructuredData(type = 'Organization', customData = {}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type
  };
  
  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: defaultSEOData.siteName,
        url: defaultSEOData.siteUrl,
        description: defaultSEOData.defaultDescription,
        logo: `${defaultSEOData.siteUrl}/images/nosytlabs-logo.svg`,
        sameAs: [
          'https://github.com/nosytlabs',
          'https://twitter.com/nosytlabs',
          'https://linkedin.com/company/nosytlabs'
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contact@nosytlabs.com'
        },
        ...customData
      };
      
    case 'WebSite':
      return {
        ...baseData,
        name: defaultSEOData.siteName,
        url: defaultSEOData.siteUrl,
        description: defaultSEOData.defaultDescription,
        publisher: {
          '@type': 'Organization',
          name: defaultSEOData.siteName
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${defaultSEOData.siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        ...customData
      };
      
    case 'Article':
      return {
        ...baseData,
        headline: customData.title || defaultSEOData.defaultTitle,
        description: customData.description || defaultSEOData.defaultDescription,
        author: {
          '@type': 'Organization',
          name: defaultSEOData.siteName
        },
        publisher: {
          '@type': 'Organization',
          name: defaultSEOData.siteName,
          logo: {
            '@type': 'ImageObject',
            url: `${defaultSEOData.siteUrl}/images/nosytlabs-logo.svg`
          }
        },
        datePublished: customData.datePublished || new Date().toISOString(),
        dateModified: customData.dateModified || new Date().toISOString(),
        ...customData
      };
      
    case 'Service':
      return {
        ...baseData,
        name: customData.name || 'Digital Technology Solutions',
        description: customData.description || defaultSEOData.defaultDescription,
        provider: {
          '@type': 'Organization',
          name: defaultSEOData.siteName
        },
        serviceType: customData.serviceType || 'Technology Consulting',
        areaServed: customData.areaServed || 'Worldwide',
        ...customData
      };
      
    default:
      return {
        ...baseData,
        ...customData
      };
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

export function generateFAQStructuredData(faqs = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateLocalBusinessStructuredData(businessData = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessData.name || defaultSEOData.siteName,
    description: businessData.description || defaultSEOData.defaultDescription,
    url: businessData.url || defaultSEOData.siteUrl,
    telephone: businessData.telephone || '+1-555-0123',
    email: businessData.email || 'contact@nosytlabs.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessData.streetAddress || '123 Tech Street',
      addressLocality: businessData.city || 'Innovation City',
      addressRegion: businessData.state || 'CA',
      postalCode: businessData.postalCode || '12345',
      addressCountry: businessData.country || 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: businessData.latitude || '37.7749',
      longitude: businessData.longitude || '-122.4194'
    },
    openingHours: businessData.openingHours || 'Mo-Fr 09:00-17:00',
    priceRange: businessData.priceRange || '$$',
    ...businessData
  };
}

// Export default for backward compatibility
export default {
  generateMetaTags,
  generateStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateLocalBusinessStructuredData
};
