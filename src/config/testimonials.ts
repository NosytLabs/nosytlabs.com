/**
 * Testimonials and Client Data Configuration
 * 
 * Centralized data for testimonials, client showcases, and success stories
 * across the entire website.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured?: boolean;
  service?: string;
  date?: string;
  location?: string;
  projectType?: string;
  metrics?: {
    label: string;
    value: string;
    improvement?: string;
  }[];
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  logoAlt?: string;
  industry: string;
  website?: string;
  description?: string;
  caseStudyUrl?: string;
  featured?: boolean;
  metrics?: {
    label: string;
    value: string;
    improvement?: string;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

// Main testimonials data
export const testimonials: Testimonial[] = [
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content: 'NosyT Labs transformed our digital presence completely. Their expertise in modern web development and AI integration helped us increase our conversion rates by 300%. The team is professional, responsive, and truly understands business needs.',
    rating: 5,
    avatar: '/images/testimonials/sarah-johnson.jpg',
    featured: true,
    service: 'Web Development',
    date: '2024-01-15',
    location: 'San Francisco, CA',
    projectType: 'E-commerce Platform',
    metrics: [
      { label: 'Conversion Rate', value: '+300%', improvement: 'vs previous site' },
      { label: 'Page Load Time', value: '1.2s', improvement: '60% faster' },
      { label: 'Mobile Score', value: '98/100', improvement: 'Perfect optimization' },
      { label: 'SEO Ranking', value: 'Top 3', improvement: 'All target keywords' }
    ]
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    role: 'CTO',
    company: 'DataFlow Solutions',
    content: 'The AI integration project exceeded all our expectations. NosyT Labs delivered a sophisticated machine learning solution that automated 80% of our data processing tasks. Their technical expertise is unmatched.',
    rating: 5,
    avatar: '/images/testimonials/michael-chen.jpg',
    featured: true,
    service: 'AI Integration',
    date: '2024-02-20',
    location: 'New York, NY',
    projectType: 'AI Automation Platform',
    metrics: [
      { label: 'Process Automation', value: '80%', improvement: 'Tasks automated' },
      { label: 'Processing Speed', value: '10x', improvement: 'Faster than manual' },
      { label: 'Accuracy Rate', value: '99.7%', improvement: 'Error reduction' },
      { label: 'Cost Savings', value: '$2M/year', improvement: 'Operational efficiency' }
    ]
  },
  {
    id: 'emily-rodriguez',
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'GrowthCorp',
    content: 'Working with NosyT Labs was a game-changer for our marketing efforts. They built us a comprehensive analytics dashboard that gives us real-time insights into our campaigns. ROI improved by 250%.',
    rating: 5,
    avatar: '/images/testimonials/emily-rodriguez.jpg',
    featured: false,
    service: 'Web Development',
    date: '2024-03-10',
    location: 'Austin, TX',
    projectType: 'Analytics Dashboard',
    metrics: [
      { label: 'ROI Improvement', value: '+250%', improvement: 'Campaign performance' },
      { label: 'Data Processing', value: 'Real-time', improvement: 'Instant insights' },
      { label: 'User Engagement', value: '+180%', improvement: 'Dashboard usage' }
    ]
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    role: 'Founder',
    company: 'InnovateLab',
    content: 'The consulting services provided by NosyT Labs helped us define our entire digital strategy. Their insights into emerging technologies and market trends were invaluable for our product roadmap.',
    rating: 5,
    avatar: '/images/testimonials/david-kim.jpg',
    featured: false,
    service: 'Consulting',
    date: '2024-01-25',
    location: 'Seattle, WA',
    projectType: 'Digital Strategy',
    metrics: [
      { label: 'Strategy Clarity', value: '100%', improvement: 'Clear roadmap' },
      { label: 'Time to Market', value: '-40%', improvement: 'Faster launches' },
      { label: 'Investment ROI', value: '400%', improvement: 'Strategic decisions' }
    ]
  },
  {
    id: 'lisa-thompson',
    name: 'Lisa Thompson',
    role: 'Operations Manager',
    company: 'EfficiencyFirst',
    content: 'NosyT Labs automated our entire workflow management system. What used to take our team hours now happens automatically. The productivity gains have been incredible.',
    rating: 5,
    avatar: '/images/testimonials/lisa-thompson.jpg',
    featured: false,
    service: 'AI Integration',
    date: '2024-02-05',
    location: 'Chicago, IL',
    projectType: 'Workflow Automation',
    metrics: [
      { label: 'Time Savings', value: '75%', improvement: 'Process efficiency' },
      { label: 'Error Reduction', value: '95%', improvement: 'Quality improvement' },
      { label: 'Team Productivity', value: '+200%', improvement: 'Output increase' }
    ]
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    role: 'Product Manager',
    company: 'NextGen Apps',
    content: 'The mobile app development expertise at NosyT Labs is outstanding. They delivered a cross-platform solution that performs flawlessly on both iOS and Android. User ratings are consistently 4.8+.',
    rating: 5,
    avatar: '/images/testimonials/james-wilson.jpg',
    featured: false,
    service: 'Web Development',
    date: '2024-03-15',
    location: 'Los Angeles, CA',
    projectType: 'Mobile Application',
    metrics: [
      { label: 'App Store Rating', value: '4.8/5', improvement: 'User satisfaction' },
      { label: 'Performance Score', value: '95/100', improvement: 'Optimal speed' },
      { label: 'User Retention', value: '85%', improvement: '30-day retention' }
    ]
  },
  {
    id: 'maria-garcia',
    name: 'Maria Garcia',
    role: 'VP of Technology',
    company: 'ScaleTech',
    content: 'NosyT Labs helped us scale our infrastructure to handle 10x more traffic. Their cloud architecture expertise and performance optimization strategies were exactly what we needed.',
    rating: 5,
    avatar: '/images/testimonials/maria-garcia.jpg',
    featured: false,
    service: 'Consulting',
    date: '2024-01-30',
    location: 'Denver, CO',
    projectType: 'Infrastructure Scaling',
    metrics: [
      { label: 'Traffic Capacity', value: '10x', improvement: 'Scalability boost' },
      { label: 'Uptime', value: '99.99%', improvement: 'Reliability' },
      { label: 'Response Time', value: '200ms', improvement: '50% faster' }
    ]
  },
  {
    id: 'robert-brown',
    name: 'Robert Brown',
    role: 'Digital Director',
    company: 'RetailMax',
    content: 'The e-commerce platform built by NosyT Labs revolutionized our online sales. The user experience is seamless, and our conversion rates have never been higher. Exceptional work!',
    rating: 5,
    avatar: '/images/testimonials/robert-brown.jpg',
    featured: false,
    service: 'Web Development',
    date: '2024-02-28',
    location: 'Miami, FL',
    projectType: 'E-commerce Platform',
    metrics: [
      { label: 'Conversion Rate', value: '+220%', improvement: 'Sales increase' },
      { label: 'Cart Abandonment', value: '-60%', improvement: 'UX optimization' },
      { label: 'Page Speed', value: '1.1s', improvement: 'Lightning fast' }
    ]
  }
];

// Client showcase data
export const clients: Client[] = [
  {
    id: 'techstart-inc',
    name: 'TechStart Inc.',
    logo: '/images/clients/techstart-logo.svg',
    logoAlt: 'TechStart Inc. logo',
    industry: 'Technology Startup',
    website: 'https://techstart.example.com',
    description: 'Leading technology startup focused on innovative SaaS solutions for enterprise clients.',
    caseStudyUrl: '/case-studies/techstart-transformation',
    featured: true,
    metrics: [
      { label: 'Revenue Growth', value: '+400%', improvement: 'Year over year' },
      { label: 'User Base', value: '50K+', improvement: 'Active users' },
      { label: 'Market Expansion', value: '15 countries', improvement: 'Global reach' },
      { label: 'Funding Raised', value: '$25M', improvement: 'Series B' }
    ],
    testimonial: {
      quote: 'NosyT Labs transformed our digital presence completely. Their expertise helped us increase conversion rates by 300%.',
      author: 'Sarah Johnson',
      role: 'CEO'
    }
  },
  {
    id: 'dataflow-solutions',
    name: 'DataFlow Solutions',
    logo: '/images/clients/dataflow-logo.svg',
    logoAlt: 'DataFlow Solutions logo',
    industry: 'Data Analytics',
    website: 'https://dataflow.example.com',
    description: 'Enterprise data analytics platform serving Fortune 500 companies worldwide.',
    caseStudyUrl: '/case-studies/dataflow-ai-integration',
    featured: true,
    metrics: [
      { label: 'Data Processing', value: '10TB/day', improvement: 'Capacity increase' },
      { label: 'Processing Speed', value: '10x faster', improvement: 'Performance boost' },
      { label: 'Cost Reduction', value: '60%', improvement: 'Operational savings' },
      { label: 'Accuracy', value: '99.7%', improvement: 'Error reduction' }
    ],
    testimonial: {
      quote: 'The AI integration project exceeded all our expectations. Their technical expertise is unmatched.',
      author: 'Michael Chen',
      role: 'CTO'
    }
  },
  {
    id: 'growthcorp',
    name: 'GrowthCorp',
    logo: '/images/clients/growthcorp-logo.svg',
    logoAlt: 'GrowthCorp logo',
    industry: 'Marketing & Advertising',
    website: 'https://growthcorp.example.com',
    description: 'Full-service marketing agency specializing in digital transformation and growth strategies.',
    featured: false
  },
  {
    id: 'innovatelab',
    name: 'InnovateLab',
    logo: '/images/clients/innovatelab-logo.svg',
    logoAlt: 'InnovateLab logo',
    industry: 'Research & Development',
    website: 'https://innovatelab.example.com',
    description: 'Cutting-edge R&D lab developing next-generation technology solutions.',
    featured: false
  },
  {
    id: 'efficiencyfirst',
    name: 'EfficiencyFirst',
    logo: '/images/clients/efficiencyfirst-logo.svg',
    logoAlt: 'EfficiencyFirst logo',
    industry: 'Business Process Optimization',
    website: 'https://efficiencyfirst.example.com',
    description: 'Business optimization consultancy helping companies streamline operations.',
    featured: false
  },
  {
    id: 'nextgen-apps',
    name: 'NextGen Apps',
    logo: '/images/clients/nextgen-logo.svg',
    logoAlt: 'NextGen Apps logo',
    industry: 'Mobile App Development',
    website: 'https://nextgenapps.example.com',
    description: 'Mobile-first development studio creating innovative consumer applications.',
    featured: false
  },
  {
    id: 'scaletech',
    name: 'ScaleTech',
    logo: '/images/clients/scaletech-logo.svg',
    logoAlt: 'ScaleTech logo',
    industry: 'Cloud Infrastructure',
    website: 'https://scaletech.example.com',
    description: 'Cloud infrastructure provider offering scalable solutions for growing businesses.',
    featured: false
  },
  {
    id: 'retailmax',
    name: 'RetailMax',
    logo: '/images/clients/retailmax-logo.svg',
    logoAlt: 'RetailMax logo',
    industry: 'E-commerce & Retail',
    website: 'https://retailmax.example.com',
    description: 'Multi-channel retail platform connecting brands with consumers globally.',
    featured: false
  },
  {
    id: 'financeplus',
    name: 'FinancePlus',
    logo: '/images/clients/financeplus-logo.svg',
    logoAlt: 'FinancePlus logo',
    industry: 'Financial Services',
    website: 'https://financeplus.example.com',
    description: 'Digital banking platform providing innovative financial solutions.',
    featured: false
  },
  {
    id: 'healthtech-pro',
    name: 'HealthTech Pro',
    logo: '/images/clients/healthtech-logo.svg',
    logoAlt: 'HealthTech Pro logo',
    industry: 'Healthcare Technology',
    website: 'https://healthtechpro.example.com',
    description: 'Healthcare technology company developing patient management systems.',
    featured: false
  },
  {
    id: 'edulearn',
    name: 'EduLearn',
    logo: '/images/clients/edulearn-logo.svg',
    logoAlt: 'EduLearn logo',
    industry: 'Education Technology',
    website: 'https://edulearn.example.com',
    description: 'Online learning platform revolutionizing digital education experiences.',
    featured: false
  },
  {
    id: 'greentech-solutions',
    name: 'GreenTech Solutions',
    logo: '/images/clients/greentech-logo.svg',
    logoAlt: 'GreenTech Solutions logo',
    industry: 'Sustainable Technology',
    website: 'https://greentech.example.com',
    description: 'Sustainable technology company focused on environmental solutions.',
    featured: false
  }
];

// Helper functions
export const getFeaturedTestimonials = (limit?: number): Testimonial[] => {
  const featured = testimonials.filter(t => t.featured);
  return limit ? featured.slice(0, limit) : featured;
};

export const getTestimonialsByService = (service: string): Testimonial[] => {
  return testimonials.filter(t => t.service === service);
};

export const getFeaturedClients = (limit?: number): Client[] => {
  const featured = clients.filter(c => c.featured);
  return limit ? featured.slice(0, limit) : featured;
};

export const getClientsByIndustry = (industry: string): Client[] => {
  return clients.filter(c => c.industry.toLowerCase().includes(industry.toLowerCase()));
};

export const getRandomTestimonials = (count: number): Testimonial[] => {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomClients = (count: number): Client[] => {
  const shuffled = [...clients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};