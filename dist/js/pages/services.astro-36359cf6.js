import { c as createAstro, a as createComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, d as renderComponent, u as unescapeHTML, F as Fragment } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
import "clsx";
/* empty css                    */const $$Astro$2 = createAstro("https://nosytlabs.com");
const $$PDFViewer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PDFViewer;
  const {
    pdfUrl,
    title = "",
    height = "500px",
    width = "100%",
    showControls = true,
    showDownload = true,
    fallbackText = "PDF document could not be displayed. Please download to view."
  } = Astro2.props;
  const embedId = `pdf-embed-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate`${maybeRenderHead()}<div class="pdf-viewer-container"${addAttribute(embedId, "id")} data-astro-cid-4wmd6pub> <!-- PDF Embed --> <div class="pdf-embed-wrapper"${addAttribute(`height: ${height}; width: ${width};`, "style")} data-astro-cid-4wmd6pub> <object${addAttribute(pdfUrl, "data")} type="application/pdf" width="100%" height="100%" class="pdf-object"${addAttribute(title || "PDF Document", "aria-label")} data-astro-cid-4wmd6pub> <!-- Fallback for browsers that don't support PDF embedding --> <div class="pdf-fallback" data-astro-cid-4wmd6pub> <div class="pdf-fallback-content" data-astro-cid-4wmd6pub> <svg xmlns="http://www.w3.org/2000/svg" class="pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4wmd6pub> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-4wmd6pub></path> <polyline points="14 2 14 8 20 8" data-astro-cid-4wmd6pub></polyline> <line x1="16" y1="13" x2="8" y2="13" data-astro-cid-4wmd6pub></line> <line x1="16" y1="17" x2="8" y2="17" data-astro-cid-4wmd6pub></line> <polyline points="10 9 9 9 8 9" data-astro-cid-4wmd6pub></polyline> </svg> <p class="pdf-fallback-message" data-astro-cid-4wmd6pub>${fallbackText}</p> <a${addAttribute(pdfUrl, "href")} target="_blank" rel="noopener noreferrer" class="pdf-download-button" download data-astro-cid-4wmd6pub>
Download PDF
</a> </div> </div> </object> </div> <!-- Controls (optional) --> ${showControls && renderTemplate`<div class="pdf-controls" data-astro-cid-4wmd6pub> ${showDownload && renderTemplate`<a${addAttribute(pdfUrl, "href")} target="_blank" rel="noopener noreferrer" class="pdf-control-button" download data-astro-cid-4wmd6pub> <svg xmlns="http://www.w3.org/2000/svg" class="pdf-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4wmd6pub> <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-4wmd6pub></path> <polyline points="7 10 12 15 17 10" data-astro-cid-4wmd6pub></polyline> <line x1="12" y1="15" x2="12" y2="3" data-astro-cid-4wmd6pub></line> </svg> <span data-astro-cid-4wmd6pub>Download</span> </a>`} <button class="pdf-control-button pdf-fullscreen-button" aria-label="View in fullscreen"${addAttribute(pdfUrl, "data-pdf-url")} data-astro-cid-4wmd6pub> <svg xmlns="http://www.w3.org/2000/svg" class="pdf-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-4wmd6pub> <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" data-astro-cid-4wmd6pub></path> </svg> <span data-astro-cid-4wmd6pub>Fullscreen</span> </button> </div>`} </div>  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/PDFViewer.astro", void 0);
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$ServiceIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ServiceIcon;
  const {
    type,
    size = "md",
    color = "currentColor",
    className = ""
  } = Astro2.props;
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  const getSvg = (iconType) => {
    switch (iconType) {
      case "web":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>`;
      case "content":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>`;
      case "crypto":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
      </svg>`;
      case "3dprinting":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>`;
      case "mobile":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>`;
      case "tools":
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>`;
      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="${color}" class="${sizeMap[size]} ${className}">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>`;
    }
  };
  return renderTemplate`${maybeRenderHead()}<div class="service-icon-wrapper flex items-center justify-center" data-astro-cid-55kn6775> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(getSvg(type))}` })} </div> `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/ServiceIcon.astro", void 0);
const $$Astro = createAstro("https://nosytlabs.com");
const $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ServiceCard;
  const {
    title,
    description,
    iconType,
    link,
    style = "modern",
    className = ""
  } = Astro2.props;
  return renderTemplate`${style === "modern" ? renderTemplate`${maybeRenderHead()}<div${addAttribute(`service-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`, "class")} data-astro-cid-uhzbvkqe><div class="service-icon-container mb-4" data-astro-cid-uhzbvkqe>${renderComponent($$result, "ServiceIcon", $$ServiceIcon, { "type": iconType, "size": "lg", "color": "var(--nosyt-orange-main)", "data-astro-cid-uhzbvkqe": true })}</div><h3 class="text-xl font-semibold mb-2" data-astro-cid-uhzbvkqe>${title}</h3><p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-uhzbvkqe>${description}</p><a${addAttribute(link, "href")} class="inline-flex items-center text-accent hover:text-accent-dark font-medium" data-astro-cid-uhzbvkqe>
Learn more
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-uhzbvkqe><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-uhzbvkqe></path></svg></a></div>` : renderTemplate`<div class="win95-card" data-astro-cid-uhzbvkqe><div class="win95-card-header" data-astro-cid-uhzbvkqe><div class="win95-card-icon" data-astro-cid-uhzbvkqe>${renderComponent($$result, "ServiceIcon", $$ServiceIcon, { "type": iconType, "size": "sm", "color": "white", "data-astro-cid-uhzbvkqe": true })}</div><h3 class="win95-card-title ml-2" data-astro-cid-uhzbvkqe>${title}</h3></div><div class="win95-card-body" data-astro-cid-uhzbvkqe><p data-astro-cid-uhzbvkqe>${description}</p><a${addAttribute(link, "href")} class="win95-btn win95-btn-primary mt-3 inline-block" data-astro-cid-uhzbvkqe>
Learn More
</a></div></div>`}`;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/ServiceCard.astro", void 0);
const services = [
  {
    id: "dev-tools",
    title: "Development Tools",
    shortDescription: "Development tools and resources to help streamline your coding workflow and improve productivity.",
    fullDescription: "We offer resources and guidance on development tools that can help improve your coding workflow. Based on our experience with tools like Cursor AI, VS Code extensions, and other productivity enhancers, we can provide recommendations tailored to your specific needs. Note that our services in this area are currently limited to consultation and guidance rather than full implementation.",
    icon: "🛠️",
    iconType: "tools",
    image: "/images/services/web-development.jpg",
    features: [
      "Development environment recommendations",
      "VS Code extension suggestions",
      "AI coding tool guidance (Cursor AI, GitHub Copilot)",
      "Basic workflow optimization tips",
      "Code quality tool recommendations",
      "Resource sharing and tutorials",
      "Limited consultation services (subject to availability)"
    ],
    aiTools: [
      {
        name: "Cursor AI",
        description: "A revolutionary code editor built on VSCode that integrates Claude and GPT-4 language models to provide intelligent coding assistance with full codebase context understanding.",
        logo: "/images/ai-tools/cursor-ai-logo.png",
        website: "https://cursor.com"
      },
      {
        name: "GitHub Copilot",
        description: "An AI pair programmer that offers suggestions for whole lines or entire functions right inside your editor, powered by OpenAI Codex.",
        logo: "/images/ai-tools/github-copilot-logo.png",
        website: "https://github.com/features/copilot"
      },
      {
        name: "Docker",
        description: "A platform for developing, shipping, and running applications in containers, ensuring consistency across development and production environments.",
        logo: "/images/ai-tools/docker-logo.png",
        website: "https://www.docker.com"
      },
      {
        name: "Jest",
        description: "A comprehensive JavaScript testing framework with a focus on simplicity, supporting projects using Babel, TypeScript, Node.js, React, and more with intelligent test generation capabilities.",
        logo: "/images/ai-tools/jest-logo.png",
        website: "https://jestjs.io"
      }
    ],
    caseStudies: [
      {
        title: "Development Workflow Optimization",
        client: "Fortune 500 Financial Institution",
        date: "May 2025",
        outcome: "25% reduction in development time and 40% improvement in code quality metrics"
      },
      {
        title: "Developer Productivity Enhancement",
        client: "Enterprise Software Company",
        date: "April 2025",
        outcome: "40% increase in developer productivity and 30% reduction in bugs by implementing modern development tools and practices"
      }
    ]
  },
  {
    id: "vibe-coding",
    title: "Vibe Coding",
    shortDescription: "Custom web development with a focus on aesthetics, user experience, and unique visual identity.",
    fullDescription: "Our upcoming 'Vibe Coding' services will focus on creating visually stunning and unique web experiences that capture your brand's essence and personality. We combine modern frameworks like React and Astro with creative design principles to build websites that stand out from the crowd. This service is currently in development and will be launching soon.",
    icon: "🌐",
    iconType: "web",
    image: "/images/services/web-development.jpg",
    features: [
      "Unique visual identity and aesthetic design",
      "Custom animations and interactive elements",
      "Immersive user experiences",
      "Modern frameworks (React, Astro, Three.js)",
      "Responsive design with visual flair",
      "Brand personality integration",
      "Coming soon (currently in development)"
    ],
    caseStudies: [
      {
        title: "NosytLabs Website",
        client: "Internal Project",
        date: "2025",
        outcome: "Our own website showcases our Vibe Coding approach with unique aesthetics, animations, and interactive elements"
      }
    ]
  },
  {
    id: "web-development",
    title: "Web Development",
    shortDescription: "Web development services with a focus on modern frameworks like React and Astro.",
    fullDescription: "We offer web development services with a focus on modern frameworks like React, Vue, and Astro. Our availability is limited as we primarily work on select projects that align with our expertise. We prioritize responsive design, performance optimization, and SEO best practices in all our web development work.",
    icon: "🌐",
    iconType: "web",
    image: "/images/services/web-development.jpg",
    features: [
      "Responsive design for all devices",
      "Front-end development (React, Astro, Vue)",
      "Basic back-end development (Node.js)",
      "Simple content management systems",
      "Performance optimization",
      "SEO best practices implementation",
      "Limited availability (select projects only)"
    ],
    caseStudies: [
      {
        title: "Portfolio Website Redesign",
        client: "Freelance Developer",
        date: "February 2025",
        outcome: "Created a responsive portfolio website using Astro and TailwindCSS, improving page load times and mobile experience"
      }
    ]
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    shortDescription: "Basic mobile application development with React Native for simple use cases.",
    fullDescription: "We offer limited mobile development services primarily using React Native for cross-platform applications. Our focus is on simple, functional applications rather than complex enterprise solutions. Please note that our mobile development services are currently in beta and have limited availability.",
    icon: "📱",
    iconType: "mobile",
    image: "/images/services/mobile-development.jpg",
    features: [
      "Cross-platform development with React Native",
      "Basic UI/UX design for mobile",
      "Simple app functionality implementation",
      "Testing on limited device configurations",
      "Guidance for App Store and Google Play submission",
      "Basic push notification setup",
      "Limited availability (beta service)"
    ],
    caseStudies: [
      {
        title: "Simple Task Management App",
        client: "Independent Contractor",
        date: "January 2025",
        outcome: "Developed a basic task management app with React Native for personal productivity tracking"
      }
    ]
  },
  {
    id: "3d-printing",
    title: "3D Printing Services",
    shortDescription: "Small-scale 3D printing services for simple models and prototypes using Creality and Elegoo printers.",
    fullDescription: "We offer small-scale 3D printing services for simple models and prototypes using our Creality and Elegoo printers. Our service is best suited for hobbyists, small projects, and educational purposes. Please note that our capacity is limited, and we primarily focus on FDM printing with PLA and PETG materials, with some resin printing capabilities for smaller detailed objects.",
    icon: "🖨️",
    iconType: "3dprinting",
    image: "/images/services/3d-printing.jpg",
    features: [
      "FDM printing with Creality Ender printers",
      "Resin printing with Elegoo Mars (limited capacity)",
      "Basic materials: PLA and PETG for FDM, standard resins",
      "Simple post-processing (support removal)",
      "STL file preparation assistance",
      "Local pickup or basic shipping options",
      "Limited capacity (small batch projects only)"
    ],
    caseStudies: [
      {
        title: "Tabletop Gaming Miniatures",
        client: "Local Gaming Group",
        date: "February 2025",
        outcome: "Created a set of custom gaming miniatures and terrain pieces for a local D&D group using resin printing"
      },
      {
        title: "Replacement Parts for Home Appliances",
        client: "Residential Customer",
        date: "January 2025",
        outcome: "Printed replacement knobs and brackets for household appliances, saving the cost of full replacements"
      },
      {
        title: "Educational Models",
        client: "High School Teacher",
        date: "March 2025",
        outcome: "Produced anatomical models for a biology class to enhance hands-on learning experiences"
      }
    ]
  },
  {
    id: "content-creation",
    title: "Content Creation",
    shortDescription: "Basic content creation guidance for YouTube and Kick.com with a focus on tech and gaming content.",
    fullDescription: "Based on our experience creating content for YouTube (formerly TycenYT) and Kick.com, we offer basic guidance and tips for content creators. Our focus is on tech reviews, gaming content, and tutorials. Please note that we offer limited consultation services rather than full production services, and our availability depends on our own content creation schedule.",
    icon: "🎬",
    iconType: "video",
    image: "/images/services/content-creation.jpg",
    features: [
      "Basic YouTube channel setup guidance",
      "Kick.com streaming setup recommendations",
      "Simple content strategy suggestions",
      "Thumbnail design tips and feedback",
      "Video editing software recommendations",
      "Equipment recommendations for beginners",
      "Basic SEO and discoverability tips",
      "Limited consultation availability"
    ],
    caseStudies: [
      {
        title: "YouTube Setup Guidance",
        client: "Tech Enthusiast",
        date: "March 2025",
        outcome: "Helped a tech enthusiast set up their first YouTube channel with proper equipment and basic SEO practices"
      },
      {
        title: "Kick.com Stream Setup",
        client: "Gaming Hobbyist",
        date: "January 2025",
        outcome: "Provided guidance on basic stream setup, OBS configuration, and engagement strategies for a new Kick.com streamer"
      }
    ]
  }
];
const servicesData = {
  services
};
const $$Services = createComponent(($$result, $$props, $$slots) => {
  const { services: services2 } = servicesData;
  const pdfDocuments = [
    {
      id: "services-overview",
      title: "NosytLabs Services Overview",
      description: "A comprehensive guide to all services offered by NosytLabs, including pricing, process, and deliverables.",
      path: "/documents/nosytlabs-services-overview.pdf"
    },
    {
      id: "website-audit-sample",
      title: "Sample Website Audit",
      description: "A sample website audit report showcasing our comprehensive analysis methodology and recommendations.",
      path: "/documents/sample-website-audit.pdf"
    },
    {
      id: "dev-tools-guide",
      title: "Development Tools Guide",
      description: "Detailed information about our web development services, tools, and implementation strategies.",
      path: "/documents/dev-tools-guide.pdf"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Services - NosytLabs", "description": "Explore our comprehensive range of services including AI solutions, web development, mobile apps, and 3D printing." }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-indigo-700 text-white py-20"> <div class="container mx-auto px-4"> <div class="max-w-3xl"> <h1 class="text-4xl md:text-5xl font-bold mb-4">Our Services</h1> <p class="text-xl mb-4">
Comprehensive digital solutions tailored to your business needs.
</p> <div class="bg-yellow-500/20 backdrop-blur-sm p-4 rounded-lg mt-4"> <p class="text-sm"> <strong>Startup Status:</strong> As a new startup, we're currently focused on our YouTube channel (@TycenYT) and Kick.com stream (Kick.com/Tycen).
            Many of our services are in development and will be launching soon. The information below represents our planned offerings.
</p> </div> </div> </div> </div>  <section class="py-20 bg-white"> <div class="container mx-auto px-4"> <div class="text-center mb-16"> <h2 class="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2> <p class="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
We provide cutting-edge solutions to help businesses thrive in the digital landscape.
          Our team of experts is dedicated to delivering exceptional results that drive growth and innovation.
</p> <div class="bg-indigo-50 p-4 rounded-lg max-w-3xl mx-auto mt-6"> <h3 class="text-xl font-bold text-indigo-700 mb-2">Coming Soon: Vibe Coding Services</h3> <p class="text-gray-700">
We're excited to announce our upcoming "Vibe Coding" services, focusing on custom web development with an emphasis on aesthetics,
            user experience, and unique visual identity. Our approach combines modern frameworks with creative design principles to build websites
            that stand out from the crowd. Stay tuned for the official launch!
</p> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> ${services2.map((service) => renderTemplate`${renderComponent($$result2, "ServiceCard", $$ServiceCard, { "title": service.title, "description": service.shortDescription, "iconType": service.iconType || "tools", "link": `#${service.id}`, "style": "modern" })}`)} </div> </div> </section>  ${services2.map((service, index) => renderTemplate`<section${addAttribute(service.id, "id")}${addAttribute(`py-20 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`, "class")}> <div class="container mx-auto px-4"> <div class="flex flex-col lg:flex-row items-center gap-12"> <div${addAttribute(`lg:w-1/2 ${index % 2 === 1 ? "order-2" : ""}`, "class")}> <img${addAttribute(service.image, "src")}${addAttribute(service.title, "alt")} class="rounded-lg shadow-lg w-full" loading="lazy"> </div> <div${addAttribute(`lg:w-1/2 ${index % 2 === 1 ? "order-1" : ""}`, "class")}> <h2 class="text-3xl font-bold mb-6">${service.title}</h2> <p class="text-lg text-gray-600 mb-6"> ${service.fullDescription} </p> <h3 class="text-xl font-semibold mb-4">Key Features</h3> <ul class="space-y-2 mb-6"> ${service.features.map((feature) => renderTemplate`<li class="flex items-start"> <svg class="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span>${feature}</span> </li>`)} </ul> ${service.aiTools && service.aiTools.length > 0 && renderTemplate`<div class="mb-6"> <h3 class="text-xl font-semibold mb-4">AI Development Tools</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"> ${service.aiTools.map((tool) => renderTemplate`<div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"> <div class="flex items-center mb-3"> <img${addAttribute(tool.logo, "src")}${addAttribute(tool.name, "alt")} class="w-10 h-10 mr-3 rounded-md"> <h4 class="font-semibold">${tool.name}</h4> </div> <p class="text-sm text-gray-600 mb-3">${tool.description}</p> <a${addAttribute(tool.website, "href")} target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center">
Learn more
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> </div>`)} </div> </div>`} ${service.caseStudies && service.caseStudies.length > 0 && renderTemplate`<div> <h3 class="text-xl font-semibold mb-4">Success Stories</h3> <div class="space-y-4"> ${service.caseStudies.map((caseStudy) => renderTemplate`<div class="bg-indigo-50 p-4 rounded-lg"> <h4 class="font-semibold">${caseStudy.title}</h4> <p class="text-sm text-gray-600 mb-2">Client: ${caseStudy.client}</p> <p class="text-gray-700">${caseStudy.outcome}</p> </div>`)} </div> </div>`} <div class="mt-8"> <a href="/contact" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
Discuss Your Project
</a> </div> </div> </div> </div> </section>`)} <section class="py-20 bg-indigo-700 text-white"> <div class="container mx-auto px-4 text-center"> <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2> <p class="text-xl mb-8 max-w-3xl mx-auto">
Let's discuss how NosytLabs can help you achieve your goals with our innovative solutions.
</p> <div class="flex flex-wrap justify-center gap-4"> <a href="/contact" class="inline-block bg-white text-indigo-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
Get in Touch
</a> <a href="/projects" class="inline-block border-2 border-white text-white hover:bg-white hover:text-indigo-700 font-medium py-3 px-8 rounded-lg transition-colors">
View Our Projects
</a> </div> </div> </section>  ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in", "class": "py-16 bg-gray-100 dark:bg-gray-800" }, { "default": ($$result3) => renderTemplate` <div class="container mx-auto px-4"> <div class="max-w-3xl mx-auto text-center mb-12"> <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Service Documentation & Audits</h2> <p class="text-gray-600 dark:text-gray-300">
Explore our detailed service documentation, sample website audits, and other resources to better understand our approach and methodology.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"> ${pdfDocuments.map((doc) => renderTemplate`<div class="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"> <div class="p-6"> <div class="flex items-center mb-3"> <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mr-3"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <h3 class="text-xl font-bold text-gray-800 dark:text-white">${doc.title}</h3> </div> <p class="text-gray-600 dark:text-gray-300 mb-4">${doc.description}</p> <div class="flex space-x-3"> <a${addAttribute(`#view-${doc.id}`, "href")} class="inline-block bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded transition-colors duration-300">
View Document
</a> <a${addAttribute(doc.path, "href")} target="_blank" rel="noopener noreferrer" class="inline-block bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-2 px-4 rounded transition-colors duration-300" download>
Download
</a> </div> </div> </div>`)} </div> <!-- PDF Viewer Sections --> ${pdfDocuments.map((doc) => renderTemplate`<div${addAttribute(`view-${doc.id}`, "id")} class="mb-16 scroll-mt-24"> <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl"> <div class="bg-gradient-to-r from-primary to-accent p-4 flex justify-between items-center"> <h3 class="text-xl font-bold text-white">${doc.title}</h3> <div class="flex space-x-2"> <button${addAttribute(`fullscreen-${doc.id}`, "id")} class="bg-white/20 hover:bg-white/30 text-white font-medium py-1 px-3 rounded-lg text-sm transition-colors duration-300 flex items-center"${addAttribute(doc.path, "data-pdf-url")}> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path> </svg>
Fullscreen
</button> <a${addAttribute(doc.path, "href")} target="_blank" rel="noopener noreferrer" class="bg-white text-accent hover:bg-gray-100 font-medium py-1 px-3 rounded-lg text-sm transition-colors duration-300 flex items-center" download> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path> </svg>
Download
</a> </div> </div> <div class="p-4"> ${renderComponent($$result3, "PDFViewer", $$PDFViewer, { "pdfUrl": doc.path, "height": "600px", "width": "100%", "title": doc.title, "showControls": false })} </div> </div> </div>`)} </div> ` })}  ` })}`;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/services.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/services.astro";
const $$url = "/services.html";
export {
  $$Services as default,
  $$file as file,
  $$url as url
};
