/**
 * Conversion Optimization Configuration
 * 
 * Centralized configuration for all conversion-related settings,
 * CTAs, social proof elements, and urgency messaging.
 */

export interface ConversionConfig {
  urgencyMessages: {
    consultation: string[];
    project: string[];
    response: string[];
  };
  socialProof: {
    clientLogos: ClientLogo[];
    testimonials: ConversionTestimonial[];
    stats: ConversionStat[];
  };
  ctaVariants: {
    primary: CTAVariant[];
    secondary: CTAVariant[];
    urgency: CTAVariant[];
  };
  forms: {
    serviceSpecific: ServiceFormConfig[];
    quickQuote: QuickQuoteConfig;
  };
}

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  alt: string;
  industry: string;
  featured: boolean;
}

export interface ConversionTestimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  role: string;
  avatar: string;
  rating: number;
  serviceType: string;
  results?: string[];
  featured: boolean;
}

export interface ConversionStat {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: string;
  category: 'projects' | 'clients' | 'satisfaction' | 'time';
}

export interface CTAVariant {
  id: string;
  text: string;
  subtext?: string;
  variant: 'primary' | 'secondary' | 'urgency';
  action: 'form' | 'calendar' | 'quote' | 'consultation';
  serviceTypes?: string[];
}

export interface ServiceFormConfig {
  serviceSlug: string;
  formFields: FormField[];
  ctaText: string;
  urgencyMessage?: string;
  valueProposition: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'textarea' | 'range' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface QuickQuoteConfig {
  services: QuickQuoteService[];
  basePrice: number;
  factors: QuickQuoteFactor[];
}

export interface QuickQuoteService {
  id: string;
  name: string;
  basePrice: number;
  factors: string[];
}

export interface QuickQuoteFactor {
  id: string;
  name: string;
  multiplier: number;
  description: string;
}

// Main conversion configuration
export const conversionConfig: ConversionConfig = {
  urgencyMessages: {
    consultation: [
      "Limited free consultations available this month",
      "Book your strategy session - only 3 slots remaining",
      "Free consultation (normally $200) - limited time",
      "Priority booking available for this week only"
    ],
    project: [
      "Q1 project slots filling up - secure your spot",
      "Next available start date: 2 weeks",
      "Limited capacity - reserve your project timeline",
      "Fast-track option available for qualified projects"
    ],
    response: [
      "We respond within 24 hours",
      "Same-day response guaranteed",
      "Priority response for qualified leads",
      "Instant project assessment available"
    ]
  },

  socialProof: {
    clientLogos: [
      {
        id: 'tech-startup-1',
        name: 'InnovateTech',
        logo: '/images/clients/innovate-tech.svg',
        alt: 'InnovateTech logo',
        industry: 'Technology',
        featured: true
      },
      {
        id: 'ecommerce-1',
        name: 'ShopSmart',
        logo: '/images/clients/shop-smart.svg',
        alt: 'ShopSmart logo',
        industry: 'E-commerce',
        featured: true
      },
      {
        id: 'healthcare-1',
        name: 'HealthPlus',
        logo: '/images/clients/health-plus.svg',
        alt: 'HealthPlus logo',
        industry: 'Healthcare',
        featured: true
      },
      {
        id: 'finance-1',
        name: 'FinanceFlow',
        logo: '/images/clients/finance-flow.svg',
        alt: 'FinanceFlow logo',
        industry: 'Finance',
        featured: true
      }
    ],

    testimonials: [
      {
        id: 'web-dev-success',
        quote: "NosytLabs transformed our online presence completely. Our conversion rate increased by 300% within 2 months of launch.",
        author: 'Sarah Johnson',
        company: 'InnovateTech',
        role: 'CEO',
        avatar: '/images/testimonials/client-1.jpg',
        rating: 5,
        serviceType: 'web-development',
        results: ['300% conversion increase', '2-month delivery', '24/7 support'],
        featured: true
      },
      {
        id: 'ai-integration-success',
        quote: "The AI integration saved us 40 hours per week on manual tasks. ROI was achieved in just 6 weeks.",
        author: 'Michael Chen',
        company: 'DataDrive Solutions',
        role: 'CTO',
        avatar: '/images/testimonials/client-2.jpg',
        rating: 5,
        serviceType: 'ai-integration',
        results: ['40 hours/week saved', '6-week ROI', 'Automated workflows'],
        featured: true
      },
      {
        id: 'consulting-success',
        quote: "Their strategic guidance helped us scale from $100K to $1M ARR in 18 months.",
        author: 'Emily Rodriguez',
        company: 'GrowthCorp',
        role: 'Founder',
        avatar: '/images/testimonials/client-1.jpg',
        rating: 5,
        serviceType: 'technology-consulting',
        results: ['$100K to $1M ARR', '18-month growth', 'Strategic roadmap'],
        featured: true
      }
    ],

    stats: [
      {
        id: 'projects-completed',
        value: '150+',
        label: 'Projects Completed',
        description: 'Successfully delivered projects across various industries',
        icon: 'CheckCircle',
        category: 'projects'
      },
      {
        id: 'client-satisfaction',
        value: '98%',
        label: 'Client Satisfaction',
        description: 'Based on post-project surveys and testimonials',
        icon: 'Star',
        category: 'satisfaction'
      },
      {
        id: 'response-time',
        value: '<24h',
        label: 'Response Time',
        description: 'Average response time to new inquiries',
        icon: 'Clock',
        category: 'time'
      },
      {
        id: 'clients-served',
        value: '50+',
        label: 'Clients Served',
        description: 'Businesses we\'ve helped grow and scale',
        icon: 'Users',
        category: 'clients'
      }
    ]
  },

  ctaVariants: {
    primary: [
      {
        id: 'free-consultation',
        text: 'Get Free Consultation',
        subtext: 'Discover how we can help your business grow',
        variant: 'primary',
        action: 'consultation'
      },
      {
        id: 'start-project',
        text: 'Start Your Project',
        subtext: 'Let\'s bring your vision to life',
        variant: 'primary',
        action: 'form'
      },
      {
        id: 'get-quote',
        text: 'Get Custom Quote',
        subtext: 'Tailored solution for your needs',
        variant: 'primary',
        action: 'quote'
      }
    ],
    secondary: [
      {
        id: 'view-portfolio',
        text: 'View Our Work',
        subtext: 'See what we\'ve built for others',
        variant: 'secondary',
        action: 'form'
      },
      {
        id: 'schedule-call',
        text: 'Schedule a Call',
        subtext: 'Speak with our team directly',
        variant: 'secondary',
        action: 'calendar'
      }
    ],
    urgency: [
      {
        id: 'limited-spots',
        text: 'Secure Your Spot',
        subtext: 'Limited availability this month',
        variant: 'urgency',
        action: 'consultation'
      },
      {
        id: 'fast-track',
        text: 'Fast-Track Your Project',
        subtext: 'Priority delivery available',
        variant: 'urgency',
        action: 'form'
      }
    ]
  },

  forms: {
    serviceSpecific: [
      {
        serviceSlug: 'web-development',
        formFields: [
          {
            id: 'project-type',
            type: 'select',
            label: 'Project Type',
            placeholder: 'Select project type',
            required: true,
            options: [
              'New website',
              'Website redesign',
              'E-commerce store',
              'Web application',
              'Landing page',
              'Other'
            ]
          },
          {
            id: 'timeline',
            type: 'select',
            label: 'Desired Timeline',
            placeholder: 'When do you need this completed?',
            required: true,
            options: [
              'ASAP (Rush job)',
              'Within 1 month',
              '1-2 months',
              '2-3 months',
              '3+ months',
              'Flexible'
            ]
          },
          {
            id: 'budget',
            type: 'select',
            label: 'Project Budget',
            placeholder: 'Select budget range',
            required: true,
            options: [
              '$2,000 - $5,000',
              '$5,000 - $10,000',
              '$10,000 - $25,000',
              '$25,000 - $50,000',
              '$50,000+',
              'Not sure yet'
            ]
          },
          {
            id: 'features',
            type: 'checkbox',
            label: 'Required Features',
            placeholder: 'Select all that apply',
            required: false,
            options: [
              'Content Management System',
              'E-commerce functionality',
              'User authentication',
              'Payment processing',
              'Third-party integrations',
              'Mobile app',
              'SEO optimization',
              'Analytics setup'
            ]
          }
        ],
        ctaText: 'Get My Web Development Quote',
        urgencyMessage: 'Limited spots available for Q1 projects',
        valueProposition: 'Professional websites that drive results and grow your business'
      },
      {
        serviceSlug: 'ai-integration',
        formFields: [
          {
            id: 'business-type',
            type: 'select',
            label: 'Business Type',
            placeholder: 'Select your industry',
            required: true,
            options: [
              'E-commerce',
              'Healthcare',
              'Finance',
              'Education',
              'Manufacturing',
              'Professional Services',
              'Technology',
              'Other'
            ]
          },
          {
            id: 'ai-goal',
            type: 'select',
            label: 'AI Integration Goal',
            placeholder: 'What do you want to achieve?',
            required: true,
            options: [
              'Automate repetitive tasks',
              'Improve customer service',
              'Enhance data analysis',
              'Personalize user experience',
              'Optimize operations',
              'Generate content',
              'Predict trends',
              'Other'
            ]
          },
          {
            id: 'current-tools',
            type: 'textarea',
            label: 'Current Tools & Systems',
            placeholder: 'Describe your current tech stack and tools',
            required: true
          },
          {
            id: 'team-size',
            type: 'select',
            label: 'Team Size',
            placeholder: 'How many people will use this?',
            required: true,
            options: [
              '1-5 people',
              '6-20 people',
              '21-50 people',
              '51-100 people',
              '100+ people'
            ]
          }
        ],
        ctaText: 'Get My AI Integration Plan',
        urgencyMessage: 'AI implementation slots filling up fast',
        valueProposition: 'Custom AI solutions that save time and increase efficiency'
      }
    ],

    quickQuote: {
      services: [
        {
          id: 'web-development',
          name: 'Web Development',
          basePrice: 5000,
          factors: ['complexity', 'timeline', 'features']
        },
        {
          id: 'ai-integration',
          name: 'AI Integration',
          basePrice: 8000,
          factors: ['complexity', 'timeline', 'data-volume']
        },
        {
          id: 'technology-consulting',
          name: 'Technology Consulting',
          basePrice: 2500,
          factors: ['duration', 'team-size', 'complexity']
        }
      ],
      basePrice: 2500,
      factors: [
        {
          id: 'complexity',
          name: 'Project Complexity',
          multiplier: 1.5,
          description: 'Simple (1x), Medium (1.3x), Complex (1.5x)'
        },
        {
          id: 'timeline',
          name: 'Rush Delivery',
          multiplier: 1.25,
          description: 'Standard (1x), Rush (1.25x), Emergency (1.5x)'
        },
        {
          id: 'features',
          name: 'Additional Features',
          multiplier: 1.2,
          description: 'Basic (1x), Enhanced (1.2x), Premium (1.4x)'
        }
      ]
    }
  }
};

// Helper functions
export const getUrgencyMessage = (category: keyof ConversionConfig['urgencyMessages']): string => {
  const messages = conversionConfig.urgencyMessages[category];
  if (!messages || messages.length === 0) {
    return 'Limited time offer - contact us today!';
  }
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex]!;
};

export const getTestimonialByService = (serviceType: string): ConversionTestimonial | null => {
  return conversionConfig.socialProof.testimonials.find(t => t.serviceType === serviceType) || null;
};

export const getFeaturedTestimonials = (limit: number = 3): ConversionTestimonial[] => {
  console.log('DEBUG: getFeaturedTestimonials called with limit:', limit);
  console.log('DEBUG: Total testimonials:', conversionConfig.socialProof.testimonials.length);
  
  const featured = conversionConfig.socialProof.testimonials.filter(t => t.featured);
  console.log('DEBUG: Featured testimonials found:', featured.length);
  console.log('DEBUG: Featured testimonials:', featured.map(t => ({ id: t.id, author: t.author, featured: t.featured })));
  
  const result = featured.slice(0, limit);
  console.log('DEBUG: Returning testimonials:', result.length);
  
  return result;
};

export const getServiceFormConfig = (serviceSlug: string): ServiceFormConfig | null => {
  return conversionConfig.forms.serviceSpecific.find(f => f.serviceSlug === serviceSlug) || null;
};

export const getCTAVariant = (type: keyof ConversionConfig['ctaVariants'], serviceType?: string): CTAVariant => {
  const variants = conversionConfig.ctaVariants[type];
  const filteredVariants = serviceType
    ? variants.filter(v => !v.serviceTypes || v.serviceTypes.includes(serviceType))
    : variants;
  
  if (!filteredVariants || filteredVariants.length === 0) {
    // Return default fallback CTA
    return {
      id: 'default-cta',
      text: 'Get Started',
      variant: 'primary',
      action: 'consultation'
    };
  }
  
  const randomIndex = Math.floor(Math.random() * filteredVariants.length);
  return filteredVariants[randomIndex]!;
};