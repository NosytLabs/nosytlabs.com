/**
 * SEO Utilities for NosytLabs
 * Comprehensive SEO optimization tools and configurations
 */

// Enhanced SEO configuration
export const seoConfig = {
  site: {
    name: 'NosytLabs',
    title: 'NosytLabs - Notable Opportunities Shape Your Tomorrow',
    description: 'Innovative digital solutions including web development, AI integration, content creation, 3D printing services, and passive income strategies. Transform your business with cutting-edge technology.',
    url: 'https://nosytlabs.com',
    logo: 'https://nosytlabs.com/images/nosytlabs-logo-2025.svg',
    ogImage: 'https://nosytlabs.com/images/nosytlabs-og.svg',
    author: 'NosytLabs Team',
    language: 'en',
    locale: 'en_US',
    type: 'website'
  },
  
  social: {
    youtube: '@TycenYT',
    github: 'https://github.com/NosytLabs',
    kick: 'https://kick.com/Tycen',
    creality: 'https://crealitycloud.com/user/9519489699'
  },
  
  keywords: {
    primary: [
      'web development',
      'AI integration',
      'content creation',
      '3D printing services',
      'passive income strategies',
      'digital solutions',
      'technology consulting'
    ],
    secondary: [
      'React development',
      'Astro framework',
      'YouTube automation',
      'crypto mining',
      'AI coding assistants',
      'modern web design',
      'responsive websites',
      'SEO optimization',
      'performance optimization',
      'accessibility compliance'
    ]
  },
  
  pages: {
    home: {
      title: 'NosytLabs - Notable Opportunities Shape Your Tomorrow',
      description: 'Transform your business with innovative digital solutions. Expert web development, AI integration, content creation, 3D printing services, and passive income education. Free consultations available.',
      keywords: 'web development, AI solutions, content creation, 3D printing, passive income, digital transformation, technology consulting, custom software'
    },
    services: {
      title: 'Professional Digital Services & Solutions | NosytLabs',
      description: 'Comprehensive digital services including custom web development with React & Astro, AI integration solutions, content creation for YouTube & streaming, and 3D printing services. Get expert consultation.',
      keywords: 'web development services, AI integration, content creation, digital consulting, custom software development, React development, Astro framework, YouTube content'
    },
    projects: {
      title: 'Portfolio & Case Studies | NosytLabs Projects',
      description: 'Explore our portfolio of innovative projects including NosytLabs website, crypto mining calculator, Kick.com MCP integration, and NosytOS95. Real-world solutions with modern technologies.',
      keywords: 'portfolio, case studies, web development projects, crypto mining tools, streaming integration, retro computing, JavaScript projects'
    },
    'content-creation': {
      title: 'Content Creation Services | YouTube & Digital Marketing | NosytLabs',
      description: 'Professional content creation services for YouTube, social media, and digital marketing. From video production to channel optimization, we help you grow your online presence.',
      keywords: 'content creation, YouTube services, video production, digital marketing, social media management, channel optimization'
    },
    '3d-printing': {
      title: '3D Printing Services & Solutions | NosytLabs',
      description: 'Professional 3D printing services including prototyping, custom manufacturing, and design consultation. From concept to creation with cutting-edge 3D printing technology.',
      keywords: '3D printing services, prototyping, custom manufacturing, 3D design, additive manufacturing, rapid prototyping'
    },
    'passive-income': {
      title: 'Passive Income Strategies & Resources | NosytLabs',
      description: 'Discover proven passive income strategies including crypto mining, affiliate marketing, and digital product creation. Build sustainable income streams with our expert guidance.',
      keywords: 'passive income, crypto mining, affiliate marketing, digital products, income streams, financial freedom'
    },
    'crypto-mining': {
      title: 'Crypto Mining Solutions & Hardware Reviews | NosytLabs',
      description: 'Expert crypto mining solutions, hardware reviews, and profitability analysis. Get the latest insights on mining rigs, pools, and optimization strategies.',
      keywords: 'crypto mining, mining hardware, mining rigs, cryptocurrency, blockchain, mining profitability'
    },
    nosytos95: {
      title: 'NosytOS95 - Retro Computing Experience | NosytLabs',
      description: 'Experience the nostalgia of Windows 95 with NosytOS95, a fully functional retro computing environment built with modern web technologies.',
      keywords: 'NosytOS95, Windows 95, retro computing, vintage OS, web-based operating system, nostalgia'
    },
    about: {
      title: 'About NosytLabs - Our Story & Mission | Technology Innovation',
      description: 'Learn about NosytLabs mission to create notable opportunities that shape your tomorrow. Founded in 2025, we specialize in web development, content creation, and innovative technology solutions.',
      keywords: 'about NosytLabs, company mission, technology innovation, web development team, content creation experts, startup story'
    },
    contact: {
      title: 'Contact NosytLabs - Get Your Free Consultation Today',
      description: 'Ready to transform your digital presence? Contact NosytLabs for expert web development, content creation, and technology consulting. Free consultations available. Email: contact@nosytlabs.com',
      keywords: 'contact NosytLabs, free consultation, web development quote, technology consulting, digital solutions, project inquiry'
    },
    blog: {
      title: 'NosytLabs Blog - Technology Insights & Tutorials',
      description: 'Stay updated with the latest in web development, AI tools, crypto mining, and 3D printing. Expert insights, tutorials, and industry analysis from the NosytLabs team.',
      keywords: 'technology blog, web development tutorials, AI tools, crypto mining guides, 3D printing tips, programming insights'
    },
    'passive-income': {
      title: 'Passive Income Strategies & Resources | NosytLabs Education',
      description: 'Learn about legitimate passive income opportunities including bandwidth sharing, content creation, and digital investments. Honest reviews and realistic earning expectations.',
      keywords: 'passive income, bandwidth sharing, HoneyGain, EarnApp, content creation income, digital investments, online earning'
    },
    '3d-printing': {
      title: '3D Printing Services | Custom Prototypes & Models | NosytLabs',
      description: 'Professional 3D printing services using Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin). Custom prototypes, functional parts, and detailed models.',
      keywords: '3D printing services, custom prototypes, FDM printing, resin printing, Creality Ender 3, Elegoo Saturn 2, product development'
    }
  }
};

/**
 * Generate comprehensive meta tags for a page
 */
export function generateMetaTags(pageKey, customData = {}) {
  const pageConfig = seoConfig.pages[pageKey] || seoConfig.pages.home;
  const config = { ...pageConfig, ...customData };
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogTitle: config.ogTitle || config.title,
    ogDescription: config.ogDescription || config.description,
    ogImage: config.ogImage || seoConfig.site.ogImage,
    ogType: config.ogType || 'website',
    twitterTitle: config.twitterTitle || config.title,
    twitterDescription: config.twitterDescription || config.description,
    twitterImage: config.twitterImage || config.ogImage || seoConfig.site.ogImage,
    canonical: config.canonical || `${seoConfig.site.url}${pageKey === 'home' ? '' : `/${pageKey}`}`
  };
}

/**
 * Generate structured data for different content types
 */
export function generateStructuredData(type, data = {}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: seoConfig.site.name,
        url: seoConfig.site.url,
        logo: seoConfig.site.logo,
        description: seoConfig.site.description,
        sameAs: Object.values(seoConfig.social),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contact@nosytlabs.com',
          availableLanguage: 'English'
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US',
          addressRegion: 'Digital'
        },
        ...data
      };

    case 'WebSite':
      return {
        ...baseData,
        name: seoConfig.site.name,
        url: seoConfig.site.url,
        description: seoConfig.site.description,
        publisher: {
          '@type': 'Organization',
          name: seoConfig.site.name
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${seoConfig.site.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        },
        ...data
      };

    case 'Service':
      return {
        ...baseData,
        name: data.name || 'Digital Solutions',
        description: data.description || 'Comprehensive digital services',
        provider: {
          '@type': 'Organization',
          name: seoConfig.site.name,
          url: seoConfig.site.url
        },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Digital Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Web Development',
                description: 'Custom web development solutions'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'AI Integration',
                description: 'AI-powered business solutions'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Content Creation',
                description: 'Professional content creation services'
              }
            }
          ]
        },
        ...data
      };

    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Organization',
          name: seoConfig.site.name
        },
        publisher: {
          '@type': 'Organization',
          name: seoConfig.site.name,
          logo: {
            '@type': 'ImageObject',
            url: seoConfig.site.logo
          }
        },
        datePublished: data.datePublished || new Date().toISOString(),
        dateModified: data.dateModified || new Date().toISOString(),
        image: data.image || seoConfig.site.ogImage,
        ...data
      };

    case 'FAQPage':
      return {
        ...baseData,
        mainEntity: data.questions?.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
          }
        })) || [],
        ...data
      };

    case 'Service':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'Organization',
          name: seoConfig.site.name,
          url: seoConfig.site.url
        },
        serviceType: data.serviceType || 'Technology Consulting',
        areaServed: data.areaServed || 'Worldwide',
        ...data
      };

    case 'VideoObject':
      return {
        ...baseData,
        name: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnail,
        uploadDate: data.publishedDate,
        duration: data.duration,
        embedUrl: data.embedUrl,
        contentUrl: data.url,
        author: {
          '@type': 'Person',
          name: data.channel || 'TycenYT'
        },
        publisher: {
          '@type': 'Organization',
          name: seoConfig.site.name
        },
        ...data
      };

    default:
      return { ...baseData, ...data };
  }
}

/**
 * Generate comprehensive sitemap data
 */
export function generateSitemapData() {
  const pages = Object.keys(seoConfig.pages).map(pageKey => ({
    url: `${seoConfig.site.url}${pageKey === 'home' ? '' : `/${pageKey}`}`,
    lastmod: new Date().toISOString(),
    changefreq: getChangeFrequency(pageKey),
    priority: getPriority(pageKey)
  }));

  // Add additional important pages
  const additionalPages = [
    { url: `${seoConfig.site.url}/live`, changefreq: 'daily', priority: '0.7' },
    { url: `${seoConfig.site.url}/tools`, changefreq: 'weekly', priority: '0.6' },
    { url: `${seoConfig.site.url}/nosytos95`, changefreq: 'monthly', priority: '0.5' }
  ];

  return [...pages, ...additionalPages.map(page => ({
    ...page,
    lastmod: new Date().toISOString()
  }))];
}

/**
 * Get change frequency for different page types
 */
function getChangeFrequency(pageKey) {
  const frequencies = {
    'home': 'daily',
    'blog': 'daily',
    'projects': 'weekly',
    'services': 'weekly',
    'content-creation': 'weekly',
    'passive-income': 'monthly',
    '3d-printing': 'monthly',
    'about': 'monthly',
    'contact': 'yearly'
  };
  return frequencies[pageKey] || 'monthly';
}

/**
 * Get priority for different page types
 */
function getPriority(pageKey) {
  const priorities = {
    'home': '1.0',
    'services': '0.9',
    'projects': '0.8',
    'content-creation': '0.8',
    'about': '0.7',
    'contact': '0.7',
    'blog': '0.6',
    'passive-income': '0.5',
    '3d-printing': '0.5'
  };
  return priorities[pageKey] || '0.4';
}

/**
 * Optimize content for SEO
 */
export function optimizeContent(content, targetKeywords = []) {
  // Basic content optimization suggestions
  const suggestions = [];
  
  // Check content length
  if (content.length < 300) {
    suggestions.push('Content is too short. Aim for at least 300 words for better SEO.');
  }
  
  // Check keyword density
  targetKeywords.forEach(keyword => {
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
    const density = (keywordCount / content.split(' ').length) * 100;
    
    if (density < 0.5) {
      suggestions.push(`Consider including "${keyword}" more frequently (current density: ${density.toFixed(2)}%).`);
    } else if (density > 3) {
      suggestions.push(`Keyword "${keyword}" may be overused (current density: ${density.toFixed(2)}%). Consider reducing usage.`);
    }
  });
  
  return {
    wordCount: content.split(' ').length,
    characterCount: content.length,
    suggestions
  };
}

export default seoConfig;
