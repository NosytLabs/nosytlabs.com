export interface ServiceData {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  href: string;
  cta: string;
  className: string;
  background: string;
  icon: string;
  emoji: string;
  features: string[];
  price: string;
  timeline: string;
  popular?: boolean;
  category: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  detailedFeatures: {
    title: string;
    description: string;
    items: string[];
  }[];
  testimonial?: {
    quote: string;
    author: string;
    company: string;
  };
}

export const services: ServiceData[] = [
  {
    name: "AI-Enhanced Web Development",
    slug: "web-development",
    description: "Lightning-fast websites built with AI assistance - 50% faster delivery than traditional development.",
    shortDescription: "Professional web development with AI optimization",
    href: "/services/web-development",
    cta: "Start Project",
    className: "col-span-3 lg:col-span-2",
    background: "gradient-blue-purple",
    icon: "Globe",
    emoji: "🌐",
    features: ["AI-Accelerated Development", "Mobile-First Design", "Lightning-Fast Performance"],
    price: "From $1,200",
    timeline: "1-3 weeks",
    popular: true,
    category: "Development",
    metadata: {
      title: "AI-Enhanced Web Development Services | NosytLabs",
      description: "Lightning-fast websites built with AI assistance. 50% faster delivery than traditional development with mobile-first design and performance optimization.",
      keywords: ["web development", "AI development", "responsive design", "fast websites", "mobile-first"]
    },
    detailedFeatures: [
      {
        title: "AI-Accelerated Development",
        description: "Leverage cutting-edge AI tools to speed up development without compromising quality",
        items: [
          "50% faster development cycles",
          "AI-assisted code generation and optimization",
          "Automated testing and quality assurance",
          "Smart debugging and error detection"
        ]
      },
      {
        title: "Mobile-First Design",
        description: "Every website is designed with mobile users as the priority",
        items: [
          "Responsive design across all devices",
          "Touch-optimized interfaces",
          "Progressive Web App (PWA) capabilities",
          "Offline functionality where applicable"
        ]
      },
      {
        title: "Lightning-Fast Performance",
        description: "Optimized for speed and user experience",
        items: [
          "Core Web Vitals optimization",
          "Image and asset optimization",
          "CDN integration and caching strategies",
          "Performance monitoring and reporting"
        ]
      }
    ]
  },
  {
    name: "Rapid MVP Development",
    slug: "mvp",
    description: "AI-powered prototypes and MVPs in days, not months. Perfect for startups and quick validation.",
    shortDescription: "Fast MVP development for startup validation",
    href: "/services/mvp",
    cta: "Build MVP",
    className: "col-span-3 lg:col-span-1",
    background: "gradient-orange-red",
    icon: "Zap",
    emoji: "⚡",
    features: ["3-5 Day Delivery", "User Testing Ready"],
    price: "From $800",
    timeline: "3-7 days",
    category: "Development",
    metadata: {
      title: "Rapid MVP Development | Quick Prototypes | NosytLabs",
      description: "AI-powered MVPs and prototypes delivered in 3-7 days. Perfect for startup validation and quick market testing.",
      keywords: ["MVP development", "rapid prototyping", "startup development", "quick validation", "AI MVP"]
    },
    detailedFeatures: [
      {
        title: "Ultra-Fast Delivery",
        description: "Get your MVP ready for user testing in record time",
        items: [
          "3-5 day turnaround guaranteed",
          "Daily progress updates and demos",
          "Agile development methodology",
          "Rapid iteration based on feedback"
        ]
      },
      {
        title: "User Testing Ready",
        description: "MVPs designed specifically for gathering user feedback",
        items: [
          "Analytics and tracking integration",
          "A/B testing capabilities",
          "User feedback collection systems",
          "Performance monitoring from day one"
        ]
      }
    ]
  },
  {
    name: "AI Integration & Automation",
    slug: "ai-integration",
    description: "Smart automation and AI chatbots that work 24/7 to improve efficiency and customer service.",
    shortDescription: "AI-powered automation and intelligent chatbots",
    href: "/services/ai-integration",
    cta: "Automate Now",
    className: "col-span-3 lg:col-span-1",
    background: "gradient-green-teal",
    icon: "Bot",
    emoji: "🤖",
    features: ["24/7 AI Support", "Workflow Automation"],
    price: "From $2,200",
    timeline: "2-4 weeks",
    category: "AI & Automation",
    metadata: {
      title: "AI Integration & Automation Services | NosytLabs",
      description: "Smart automation and AI chatbots that work 24/7. Improve efficiency and customer service with intelligent AI solutions.",
      keywords: ["AI integration", "automation", "chatbots", "workflow automation", "AI support"]
    },
    detailedFeatures: [
      {
        title: "24/7 AI Support",
        description: "Never miss a customer inquiry with intelligent AI assistants",
        items: [
          "Custom chatbot development",
          "Natural language processing",
          "Multi-platform integration (website, social media, messaging apps)",
          "Escalation to human agents when needed"
        ]
      },
      {
        title: "Workflow Automation",
        description: "Streamline business processes with intelligent automation",
        items: [
          "Custom workflow design and implementation",
          "Integration with existing tools and systems",
          "Data processing and analysis automation",
          "Reporting and analytics dashboards"
        ]
      }
    ]
  },
  {
    name: "Tech Consulting & SEO Audits",
    slug: "consulting",
    description: "Professional audits and strategic guidance at competitive freelancer rates with quick turnaround.",
    shortDescription: "Expert tech consulting and comprehensive SEO audits",
    href: "/services/consulting",
    cta: "Get Audit",
    className: "col-span-3 lg:col-span-2",
    background: "gradient-yellow-orange",
    icon: "Lightbulb",
    emoji: "💡",
    features: ["SEO Audits", "Performance Analysis", "Tech Recommendations"],
    price: "From $300",
    timeline: "3-5 days",
    category: "Consulting",
    metadata: {
      title: "Tech Consulting & SEO Audits | Expert Analysis | NosytLabs",
      description: "Professional tech audits and strategic guidance. SEO analysis, performance optimization, and technology recommendations.",
      keywords: ["tech consulting", "SEO audit", "performance analysis", "technology consulting", "website audit"]
    },
    detailedFeatures: [
      {
        title: "Comprehensive SEO Audits",
        description: "In-depth analysis of your website's search engine optimization",
        items: [
          "Technical SEO analysis",
          "Content and keyword optimization review",
          "Competitor analysis and benchmarking",
          "Actionable improvement recommendations"
        ]
      },
      {
        title: "Performance Analysis",
        description: "Detailed performance review and optimization strategies",
        items: [
          "Core Web Vitals assessment",
          "Page speed optimization recommendations",
          "Mobile performance analysis",
          "User experience (UX) evaluation"
        ]
      },
      {
        title: "Strategic Tech Recommendations",
        description: "Expert guidance on technology decisions and architecture",
        items: [
          "Technology stack evaluation",
          "Scalability and performance planning",
          "Security assessment and recommendations",
          "Cost optimization strategies"
        ]
      }
    ]
  },
  {
    name: "Mobile App Development",
    slug: "mobile-apps",
    description: "Cross-platform mobile apps with AI-accelerated development for iOS and Android.",
    shortDescription: "Cross-platform mobile app development",
    href: "/services/mobile-apps",
    cta: "Build App",
    className: "col-span-3 lg:col-span-2",
    background: "gradient-purple-pink",
    icon: "Smartphone",
    emoji: "📱",
    features: ["Cross-Platform", "Native Performance", "App Store Ready"],
    price: "From $2,800",
    timeline: "3-6 weeks",
    category: "Development",
    metadata: {
      title: "Mobile App Development | iOS & Android Apps | NosytLabs",
      description: "Cross-platform mobile apps with AI-accelerated development. Native performance for iOS and Android with app store optimization.",
      keywords: ["mobile app development", "iOS development", "Android development", "cross-platform apps", "React Native"]
    },
    detailedFeatures: [
      {
        title: "Cross-Platform Excellence",
        description: "One codebase, multiple platforms with native performance",
        items: [
          "React Native and Flutter development",
          "Shared business logic across platforms",
          "Platform-specific optimizations",
          "Consistent user experience"
        ]
      },
      {
        title: "Native Performance",
        description: "Performance indistinguishable from native apps",
        items: [
          "Optimized rendering and animations",
          "Native module integration",
          "Platform-specific UI components",
          "Hardware acceleration utilization"
        ]
      },
      {
        title: "App Store Ready",
        description: "Complete deployment and optimization for app stores",
        items: [
          "App Store Optimization (ASO)",
          "Compliance with platform guidelines",
          "Beta testing and feedback integration",
          "Launch support and monitoring"
        ]
      }
    ]
  },
  {
    name: "3D Printing Services",
    slug: "3d-printing",
    description: "Professional prototyping and custom parts at competitive rates with fast turnaround.",
    shortDescription: "Professional 3D printing and rapid prototyping",
    href: "/services/3d-printing",
    cta: "Print Now",
    className: "col-span-3 lg:col-span-1",
    background: "gradient-gray-slate",
    icon: "Settings",
    emoji: "🔧",
    features: ["24-48hr Turnaround", "Multiple Materials"],
    price: "From $15",
    timeline: "1-3 days",
    category: "Manufacturing",
    metadata: {
      title: "3D Printing Services | Rapid Prototyping | NosytLabs",
      description: "Professional 3D printing and prototyping services with 24-48 hour turnaround. Multiple materials and competitive rates.",
      keywords: ["3D printing", "rapid prototyping", "custom parts", "manufacturing", "product development"]
    },
    detailedFeatures: [
      {
        title: "Lightning-Fast Turnaround",
        description: "From design to finished product in 24-48 hours",
        items: [
          "Same-day printing for simple parts",
          "24-48 hour standard turnaround",
          "Rush orders available",
          "Real-time progress tracking"
        ]
      },
      {
        title: "Multiple Materials & Finishes",
        description: "Wide range of materials for different applications",
        items: [
          "PLA, ABS, PETG, and specialty filaments",
          "Resin printing for high detail",
          "Post-processing and finishing options",
          "Color matching and custom finishes"
        ]
      }
    ]
  }
];

// Helper function to get service by slug
export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return services.find(service => service.slug === slug);
};

// Helper function to get services by category
export const getServicesByCategory = (category: string): ServiceData[] => {
  return services.filter(service => service.category === category);
};

// Helper function to get all unique categories
export const getServiceCategories = (): string[] => {
  return [...new Set(services.map(service => service.category))];
};