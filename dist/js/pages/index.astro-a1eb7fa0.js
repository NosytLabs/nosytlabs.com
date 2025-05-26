import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { f as fetchChannelData, a as fetchChannelVideos } from "./content-creation.astro-e64a2a0d.js";
/* empty css                 */import "clsx";
/* empty css                       *//* empty css                          *//* empty css                        *//* empty css                      */import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
import { $ as $$GlitchText } from "./blog.astro-7e133ed6.js";
/* empty css                        */const featured = [
  {
    id: "dev-toolkit",
    title: "Dev Toolkit",
    description: "A collection of utilities to streamline development workflows, including code snippets, documentation templates, and productivity tools for common programming tasks. Currently in active development with regular updates.",
    imageUrl: "/images/projects/data-dashboard.jpg",
    category: "Web Development",
    technologies: [
      "JavaScript",
      "Python",
      "React",
      "Node.js"
    ],
    completionDate: "2025-03-15",
    client: "Open Source Community",
    githubUrl: "https://github.com/NosytLabs/dev-toolkit",
    demoUrl: "https://dev-toolkit-demo.nosytlabs.com",
    outcome: "A powerful toolkit used by over 500 developers to improve productivity and code quality. Featured in multiple YouTube tutorials on the TycenYT channel with positive community feedback."
  },
  {
    id: "mining-dashboard",
    title: "Mining Dashboard",
    description: "A monitoring dashboard for cryptocurrency miners that tracks hashrate, power consumption, temperature, and profitability metrics. Helps miners optimize their operations and monitor equipment health. Beta version available for testing.",
    imageUrl: "/images/projects/iot-platform.jpg",
    category: "Crypto Mining",
    technologies: [
      "React",
      "Node.js",
      "WebSockets",
      "Chart.js",
      "MongoDB"
    ],
    completionDate: "2025-02-10",
    client: "Crypto Mining Community",
    githubUrl: "https://github.com/NosytLabs/mining-dashboard",
    demoUrl: "https://mining-dashboard.nosytlabs.com",
    outcome: "A powerful tool used by over 500 miners to optimize their operations and increase profitability by an average of 15%. Featured in multiple TycenYT tutorials about mining optimization and showcased in the 'What's Inside This Mystery Crypto Mining Box?' video."
  },
  {
    id: "stream-helper",
    title: "Stream Helper",
    description: "A basic streaming toolkit for content creators on platforms like Kick.com and YouTube. Includes customizable overlays, alerts, and chat integration. Used in my own streams on Kick.com/Tycen.",
    imageUrl: "/images/projects/mobile-banking.jpg",
    category: "Content Creation",
    technologies: [
      "JavaScript",
      "OBS Integration",
      "WebSockets",
      "Canvas API"
    ],
    completionDate: "2025-01-15",
    client: "Content Creators",
    githubUrl: "https://github.com/NosytLabs/stream-helper",
    demoUrl: "https://stream-helper.nosytlabs.com",
    outcome: "Used in my own streams on Kick.com/Tycen and shared with a small community of content creators. Helps streamline the streaming workflow and improve viewer engagement."
  },
  {
    id: "nosytos95",
    title: "NosytOS95",
    description: "A Windows 95-inspired web interface featuring applications like Doom II, Duck Hunt, Notepad, and Nosyt AI. Includes basic sounds, animations, and a command line terminal. Currently in development with new features being added regularly.",
    imageUrl: "/images/projects/vr-training.jpg",
    category: "Web Development",
    technologies: [
      "JavaScript",
      "HTML",
      "CSS",
      "Canvas"
    ],
    completionDate: "2025-04-01",
    client: "NosytLabs",
    githubUrl: "https://github.com/NosytLabs/NosytOS95",
    demoUrl: "https://nosytlabs.com/nosytos95",
    outcome: "A fun showcase project demonstrating front-end development skills. Used as a creative portfolio piece that highlights technical capabilities while providing a nostalgic interactive experience. Still in active development."
  }
];
const recent = [
  {
    id: "code-navigator",
    title: "Code Navigator Pro",
    description: "An advanced browser extension that enhances code repository navigation with AI-powered search, intelligent code folding, and contextual documentation integration. Supports GitHub, GitLab, and Bitbucket with customizable keyboard shortcuts and themes.",
    imageUrl: "/images/projects/e-commerce.jpg",
    category: "Developer Tools",
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Browser Extension API",
      "OpenAI API"
    ],
    completionDate: "2025-03-05",
    client: "Developer Community",
    githubUrl: "https://github.com/NosytLabs/code-navigator",
    demoUrl: "https://code-navigator-demo.nosytlabs.com",
    outcome: "Downloaded by over 5,000 developers with a 4.8/5 star rating in the Chrome Web Store. Featured in multiple TycenYT videos about developer productivity tools and received positive reviews from prominent tech bloggers. Actively maintained with regular feature updates based on community feedback."
  },
  {
    id: "mining-calculator",
    title: "Mining Profitability Suite",
    description: "A comprehensive web application for cryptocurrency miners featuring real-time profitability calculations, hardware comparison tools, and predictive analytics. Includes electricity cost optimization, network difficulty forecasting, and ROI projections for over 50 mining algorithms and 200+ hardware configurations.",
    imageUrl: "/images/projects/blockchain-supply.jpg",
    category: "Crypto Mining",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "CoinGecko API",
      "Chart.js",
      "TailwindCSS",
      "Machine Learning"
    ],
    completionDate: "2025-01-22",
    client: "Mining Community",
    githubUrl: "https://github.com/NosytLabs/mining-calculator",
    demoUrl: "https://mining-calculator.nosytlabs.com",
    outcome: "A leading tool in the mining community with over 15,000 monthly active users. Helped miners increase profitability by an average of 23% through optimized configurations and electricity usage. Featured in multiple TycenYT videos including the popular 'Jasminer X16Q Review' and 'What's Inside This Mystery Crypto Mining Box?' series."
  },
  {
    id: "print-settings-helper",
    title: "3D Print Master",
    description: "An advanced web application for 3D printing enthusiasts featuring AI-powered print optimization, real-time slicing preview, and a comprehensive material database. Supports over 50 printer models including Creality Ender 3 S1 Pro and Elegoo Saturn 2 with customizable profiles for 100+ materials and filament brands.",
    imageUrl: "/images/projects/ai-solutions.jpg",
    category: "3D Printing",
    technologies: [
      "React",
      "TypeScript",
      "Firebase",
      "TailwindCSS",
      "Progressive Web App",
      "Machine Learning",
      "WebGL"
    ],
    completionDate: "2025-02-15",
    client: "3D Printing Community",
    githubUrl: "https://github.com/NosytLabs/print-settings-helper",
    demoUrl: "https://print-settings.nosytlabs.com",
    outcome: "A leading 3D printing resource with over 10,000 active users that has improved print success rates by an average of 65%. Featured in multiple 3D printing tutorials on the TycenYT channel and officially endorsed by Creality with integration on their cloud platform. Recognized in 3D printing communities for its innovative approach to print optimization and user-friendly interface."
  },
  {
    id: "code-snippets",
    title: "DevSnippets Hub",
    description: "A comprehensive library of optimized code snippets for modern web development. Features over 1,000 curated examples across 15 programming languages with syntax highlighting, copy-to-clipboard functionality, and AI-powered search. Includes performance benchmarks and best practice annotations.",
    imageUrl: "/images/projects/data-dashboard.jpg",
    category: "Developer Tools",
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Algolia Search"
    ],
    completionDate: "2025-01-05",
    client: "Developer Community",
    githubUrl: "https://github.com/NosytLabs/code-snippets",
    demoUrl: "https://devsnippets.nosytlabs.com",
    outcome: "A popular developer resource with over 25,000 monthly users and 5,000+ GitHub stars. Regularly featured in web development newsletters and programming communities. Actively maintained with weekly updates and community contributions. Used in educational settings and professional development teams for standardizing code practices."
  },
  {
    id: "content-analytics",
    title: "CreatorMetrics Pro",
    description: "An enterprise-grade analytics platform for professional content creators featuring cross-platform data integration from YouTube, Kick.com, Twitch, TikTok, and Instagram. Provides AI-powered audience insights, content performance prediction, optimal posting schedules, and monetization optimization with customizable dashboards.",
    imageUrl: "/images/projects/iot-platform.jpg",
    category: "Content Creation",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "YouTube API",
      "Twitch API",
      "TikTok API",
      "Instagram Graph API",
      "Chart.js",
      "Firebase",
      "Machine Learning",
      "BigQuery"
    ],
    completionDate: "2025-03-10",
    client: "Content Creators",
    githubUrl: "https://github.com/NosytLabs/content-analytics",
    demoUrl: "https://creator-metrics.nosytlabs.com",
    outcome: "A premium analytics solution used by over 2,000 professional content creators including several with 1M+ subscribers. Helped creators increase audience growth by an average of 45% and boost monetization by 60% through data-driven content strategies. Actively used by the TycenYT channel and featured in multiple tutorials about content optimization. Recognized in the creator economy space as a leading analytics solution for serious content professionals."
  }
];
const categories = [
  {
    id: "developer-tools",
    name: "Developer Tools"
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence"
  },
  {
    id: "crypto-mining",
    name: "Crypto Mining"
  },
  {
    id: "3d-printing",
    name: "3D Printing"
  },
  {
    id: "content-creation",
    name: "Content Creation"
  },
  {
    id: "web-development",
    name: "Web Development"
  }
];
const projectsData = {
  featured,
  recent,
  categories
};
const $$Astro$3 = createAstro("https://nosytlabs.com");
const $$Index$4 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$4;
  await fetchChannelData("@TycenYT");
  const recentVideos = await fetchChannelVideos("@TycenYT", 3);
  const featuredProjects = projectsData.featured || [];
  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications built with React, Astro, and modern frameworks. Specializing in responsive design, performance optimization, and SEO.",
      icon: "code",
      link: "/services#web-development"
    },
    {
      title: "Content Creation",
      description: "Technology and programming content on YouTube (@TycenYT) and live streaming on Kick.com/Tycen featuring coding tutorials, tech reviews, and AI tools.",
      icon: "video",
      link: "/content-creation"
    },
    {
      title: "3D Printing",
      description: "Custom 3D printing services using Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin) printers for prototypes, models, and functional parts.",
      icon: "cube",
      link: "/3d-printing"
    },
    {
      title: "Passive Income",
      description: "Educational resources about passive income opportunities including bandwidth sharing, content creation, and investments with realistic earnings expectations.",
      icon: "chart-line",
      link: "/passive-income"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "NosytLabs - Notable Opportunities Shape Your Tomorrow", "description": "NosytLabs provides innovative digital solutions including web development, content creation, 3D printing services, and passive income resources.", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero-section bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="flex flex-col lg:flex-row items-center" data-astro-cid-j7pv25f6> <div class="lg:w-1/2 mb-10 lg:mb-0" data-astro-cid-j7pv25f6> <h1 class="text-4xl md:text-5xl font-bold mb-6 animate-fade-in" data-astro-cid-j7pv25f6>
Notable Opportunities Shape Your Tomorrow
</h1> <p class="text-xl mb-8 animate-fade-in" style="animation-delay: 0.2s;" data-astro-cid-j7pv25f6>
NosytLabs provides innovative digital solutions including web development,
            content creation, 3D printing services, and passive income resources.
</p> <div class="flex flex-wrap gap-4 animate-fade-in" style="animation-delay: 0.4s;" data-astro-cid-j7pv25f6> <a href="/services" class="btn btn-accent hover:btn-accent-hover" data-astro-cid-j7pv25f6>
Our Services
</a> <a href="/contact" class="btn btn-outline-light hover:btn-light" data-astro-cid-j7pv25f6>
Contact Us
</a> </div> </div> <div class="lg:w-1/2 flex justify-center" data-astro-cid-j7pv25f6> <div class="relative w-full max-w-md animate-fade-in" style="animation-delay: 0.6s;" data-astro-cid-j7pv25f6> <img src="/images/nosytlabs-hero.webp" alt="NosytLabs Digital Solutions" class="rounded-lg shadow-2xl" width="600" height="400" data-astro-cid-j7pv25f6> <div class="absolute -bottom-4 -right-4 bg-accent text-white p-4 rounded-lg shadow-lg" data-astro-cid-j7pv25f6> <p class="font-bold" data-astro-cid-j7pv25f6>Est. 2025</p> </div> </div> </div> </div> </div> </section>  <section id="services" class="py-16 bg-gray-50 dark:bg-gray-900" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="text-center mb-12" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>
Our Services
</h2> <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-astro-cid-j7pv25f6>
We provide a range of services to help you achieve your goals, from web development to content creation and 3D printing.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-astro-cid-j7pv25f6> ${services.map((service) => renderTemplate`<div class="service-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:transform hover:scale-105" data-astro-cid-j7pv25f6> <div class="p-6" data-astro-cid-j7pv25f6> <div class="w-16 h-16 bg-primary-light dark:bg-primary rounded-full flex items-center justify-center mb-4 mx-auto" data-astro-cid-j7pv25f6> <i${addAttribute(`fas fa-${service.icon} text-white text-2xl`, "class")} data-astro-cid-j7pv25f6></i> </div> <h3 class="text-xl font-bold mb-2 text-center text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>${service.title}</h3> <p class="text-gray-600 dark:text-gray-300 text-center mb-4" data-astro-cid-j7pv25f6>${service.description}</p> <div class="text-center" data-astro-cid-j7pv25f6> <a${addAttribute(service.link, "href")} class="inline-block text-accent hover:text-accent-dark font-medium" data-astro-cid-j7pv25f6>
Learn More <i class="fas fa-arrow-right ml-1" data-astro-cid-j7pv25f6></i> </a> </div> </div> </div>`)} </div> </div> </section>  <section id="projects" class="py-16" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="text-center mb-12" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>
Featured Projects
</h2> <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-astro-cid-j7pv25f6>
Explore our latest projects showcasing our expertise in web development, AI integration, and innovative solutions.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-j7pv25f6> ${featuredProjects.map((project) => renderTemplate`<div class="project-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" data-astro-cid-j7pv25f6> <div class="relative overflow-hidden" data-astro-cid-j7pv25f6> <img${addAttribute(project.image || "/images/projects/default-project.jpg", "src")}${addAttribute(project.title, "alt")} class="w-full h-48 object-cover transition-transform hover:scale-110" loading="lazy" data-astro-cid-j7pv25f6> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end" data-astro-cid-j7pv25f6> <div class="p-4 text-white" data-astro-cid-j7pv25f6> <h4 class="font-bold" data-astro-cid-j7pv25f6>${project.title}</h4> </div> </div> </div> <div class="p-6" data-astro-cid-j7pv25f6> <h3 class="text-xl font-bold mb-2 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>${project.title}</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-j7pv25f6>${project.description}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-j7pv25f6> ${project.technologies && project.technologies.map((tech) => renderTemplate`<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded" data-astro-cid-j7pv25f6> ${tech} </span>`)} </div> <a${addAttribute(project.link || project.githubUrl || project.demoUrl || `https://github.com/NosytLabs/${project.id}`, "href")} target="_blank" rel="noopener noreferrer" class="inline-block text-accent hover:text-accent-dark font-medium" data-astro-cid-j7pv25f6>
View Project <i class="fas fa-external-link-alt ml-1" data-astro-cid-j7pv25f6></i> </a> </div> </div>`)} </div> <div class="text-center mt-12" data-astro-cid-j7pv25f6> <a href="/projects" class="btn btn-primary" data-astro-cid-j7pv25f6>View All Projects</a> </div> </div> </section>  <section id="content" class="py-16 bg-gray-50 dark:bg-gray-900" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="text-center mb-12" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>
Content Creation
</h2> <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-astro-cid-j7pv25f6>
Check out our latest content on YouTube and Kick.com, featuring tech reviews, coding tutorials, and live streams.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-j7pv25f6> <!-- YouTube Videos --> <div class="content-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6" data-astro-cid-j7pv25f6> <h3 class="text-2xl font-semibold mb-6 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>Latest YouTube Videos</h3> <div class="space-y-4 mb-6" data-astro-cid-j7pv25f6> ${recentVideos.map((video) => renderTemplate`<div class="flex flex-col sm:flex-row gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors" data-astro-cid-j7pv25f6> <div class="sm:w-1/3" data-astro-cid-j7pv25f6> <a${addAttribute(`https://www.youtube.com/watch?v=${video.videoId}`, "href")} target="_blank" rel="noopener noreferrer" class="block relative" data-astro-cid-j7pv25f6> <img${addAttribute(video.thumbnail, "src")}${addAttribute(video.title, "alt")} class="w-full rounded-lg" loading="lazy" data-astro-cid-j7pv25f6> <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded" data-astro-cid-j7pv25f6> ${video.duration} </div> </a> </div> <div class="sm:w-2/3" data-astro-cid-j7pv25f6> <a${addAttribute(`https://www.youtube.com/watch?v=${video.videoId}`, "href")} target="_blank" rel="noopener noreferrer" class="block hover:text-accent" data-astro-cid-j7pv25f6> <h4 class="font-medium line-clamp-2" data-astro-cid-j7pv25f6>${video.title}</h4> </a> <p class="text-sm text-gray-500 dark:text-gray-400 mt-1" data-astro-cid-j7pv25f6> ${video.views} views • ${video.publishedAt} </p> </div> </div>`)} </div> <a href="https://www.youtube.com/@TycenYT" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-astro-cid-j7pv25f6>
Visit YouTube Channel
</a> </div> <!-- Live Stream --> <div class="content-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6" data-astro-cid-j7pv25f6> <h3 class="text-2xl font-semibold mb-6 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>Live on Kick.com</h3> <div class="aspect-video mb-6 rounded-lg overflow-hidden" data-astro-cid-j7pv25f6> <iframe src="https://player.kick.com/Tycen?muted=true&autoplay=true" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="rounded-lg" data-astro-cid-j7pv25f6></iframe> </div> <p class="text-gray-600 dark:text-gray-300 mb-6" data-astro-cid-j7pv25f6>
Join us live on Kick.com for coding sessions, tech discussions, and gaming streams. Follow the channel to get notified when we go live.
</p> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-astro-cid-j7pv25f6>
Watch Live Stream
</a> </div> </div> </div> </section>  <section id="3d-printing" class="py-16" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="text-center mb-12" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>
3D Printing Services
</h2> <p class="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-astro-cid-j7pv25f6>
We offer custom 3D printing services for prototypes, models, and functional parts using high-quality materials.
</p> </div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" data-astro-cid-j7pv25f6> <div data-astro-cid-j7pv25f6> <h3 class="text-2xl font-semibold mb-4 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>Custom 3D Printing</h3> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-j7pv25f6>
Our 3D printing services use the latest technology to create high-quality prints for various applications:
</p> <ul class="list-disc pl-5 mb-6 space-y-2 text-gray-600 dark:text-gray-300" data-astro-cid-j7pv25f6> <li data-astro-cid-j7pv25f6>Prototyping for product development</li> <li data-astro-cid-j7pv25f6>Custom models and figurines</li> <li data-astro-cid-j7pv25f6>Functional parts and components</li> <li data-astro-cid-j7pv25f6>Architectural models and displays</li> <li data-astro-cid-j7pv25f6>Educational tools and visual aids</li> </ul> <p class="text-gray-600 dark:text-gray-300 mb-6" data-astro-cid-j7pv25f6>
We use a Creality Ender 3 S1 Pro for FDM printing and an Elegoo Saturn 2 for resin printing, allowing us to create both functional parts and highly detailed models.
</p> <a href="/3d-printing" class="btn btn-primary" data-astro-cid-j7pv25f6>Learn More</a> </div> <div class="3d-model-showcase" data-astro-cid-j7pv25f6> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" data-astro-cid-j7pv25f6> <img src="/images/3d-printing/sample-prints.jpg" alt="Sample 3D Prints" class="w-full h-auto rounded-t-lg" loading="lazy" data-astro-cid-j7pv25f6> <div class="p-4" data-astro-cid-j7pv25f6> <h4 class="text-lg font-semibold mb-2 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>Our 3D Printing Equipment</h4> <div class="grid grid-cols-2 gap-4" data-astro-cid-j7pv25f6> <div class="text-center" data-astro-cid-j7pv25f6> <img src="/images/3d-printing/ender-3-s1-pro.jpg" alt="Creality Ender 3 S1 Pro" class="w-full h-auto rounded-lg mb-2" loading="lazy" data-astro-cid-j7pv25f6> <p class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-j7pv25f6>Creality Ender 3 S1 Pro (FDM)</p> </div> <div class="text-center" data-astro-cid-j7pv25f6> <img src="/images/3d-printing/elegoo-saturn-2.jpg" alt="Elegoo Saturn 2" class="w-full h-auto rounded-lg mb-2" loading="lazy" data-astro-cid-j7pv25f6> <p class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-j7pv25f6>Elegoo Saturn 2 (Resin)</p> </div> </div> </div> </div> </div> </div> </div> </section>  <section id="about" class="py-16 bg-gray-50 dark:bg-gray-900" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center" data-astro-cid-j7pv25f6> <div class="order-2 lg:order-1" data-astro-cid-j7pv25f6> <div class="relative overflow-hidden rounded-lg shadow-xl" data-astro-cid-j7pv25f6> <img src="/images/about-nosytlabs.jpg" alt="About NosytLabs" class="w-full h-auto rounded-lg" loading="lazy" data-astro-cid-j7pv25f6> <div class="absolute bottom-4 right-4 bg-accent text-white px-4 py-2 rounded-lg shadow-lg" data-astro-cid-j7pv25f6> <p class="font-bold" data-astro-cid-j7pv25f6>Est. 2025</p> </div> </div> </div> <div class="order-1 lg:order-2" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-6 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>
About NosytLabs
</h2> <div class="space-y-4 text-gray-600 dark:text-gray-300" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>
Founded in 2025, NosytLabs is the portfolio site for NOSYT LLC, showcasing our technology projects and services. Our name represents our mission: <span class="font-semibold text-accent" data-astro-cid-j7pv25f6>Notable Opportunities Shape Your Tomorrow</span>.
</p> <p data-astro-cid-j7pv25f6>
We develop web applications, create technology content on YouTube (@TycenYT) and Kick.com/Tycen, provide educational resources on passive income opportunities, and offer 3D printing services using our Creality and Elegoo printers.
</p> <div class="mt-6" data-astro-cid-j7pv25f6> <h3 class="text-xl font-semibold mb-3 text-primary dark:text-primary-light" data-astro-cid-j7pv25f6>Our Core Offerings</h3> <ul class="list-disc pl-5 space-y-2" data-astro-cid-j7pv25f6> <li data-astro-cid-j7pv25f6>Custom web development with React, Astro, and modern frameworks</li> <li data-astro-cid-j7pv25f6>Technology content creation on YouTube and Kick.com</li> <li data-astro-cid-j7pv25f6>3D printing services with Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin)</li> <li data-astro-cid-j7pv25f6>Educational resources on passive income opportunities</li> <li data-astro-cid-j7pv25f6>Open-source GitHub projects and development tools</li> </ul> </div> <div class="flex flex-wrap gap-4 mt-8" data-astro-cid-j7pv25f6> <a href="/about" class="btn btn-primary" data-astro-cid-j7pv25f6>
Learn More <i class="fas fa-arrow-right ml-2" data-astro-cid-j7pv25f6></i> </a> <a href="/contact" class="btn btn-outline-primary" data-astro-cid-j7pv25f6>
Contact Us <i class="fas fa-envelope ml-2" data-astro-cid-j7pv25f6></i> </a> </div> </div> </div> </div> </div> </section>  <section id="cta" class="py-16 bg-gradient-to-r from-primary to-primary-dark text-white" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <div class="text-center" data-astro-cid-j7pv25f6> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-j7pv25f6>Ready to Get Started?</h2> <p class="max-w-2xl mx-auto mb-8" data-astro-cid-j7pv25f6>
Contact us today to discuss your project requirements and how we can help bring your ideas to life.
</p> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-j7pv25f6> <a href="/contact" class="btn btn-accent" data-astro-cid-j7pv25f6>Contact Us</a> <a href="/services" class="btn btn-outline-light" data-astro-cid-j7pv25f6>Explore Services</a> </div> </div> </div> </section> ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/index.astro", void 0);
const $$file$4 = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/index.astro";
const $$url$4 = "";
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$4, file: $$file$4, url: $$url$4 }, Symbol.toStringTag, { value: "Module" }));
const $$Astro$2 = createAstro("https://nosytlabs.com");
const $$AdminSidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$AdminSidebar;
  return renderTemplate`${maybeRenderHead()}<aside class="admin-sidebar" data-astro-cid-upom7in7> <div class="sidebar-header" data-astro-cid-upom7in7> <img src="/images/nosytlabs-logo-2025.svg" alt="NosytLabs Logo" class="sidebar-logo" data-astro-cid-upom7in7> <h2 data-astro-cid-upom7in7>NosytLabs</h2> </div> <nav class="sidebar-nav" data-astro-cid-upom7in7> <ul data-astro-cid-upom7in7> <li data-astro-cid-upom7in7> <a href="/admin" class="sidebar-link"${addAttribute(Astro2.url.pathname === "/admin", "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Dashboard</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/projects" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/projects"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Projects</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/blog" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/blog"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Blog Posts</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/media" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/media"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Media</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/settings" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/settings"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-upom7in7></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Settings</span> </a> </li> </ul> </nav> <div class="sidebar-footer" data-astro-cid-upom7in7> <button id="logout-btn" class="logout-btn" data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Logout</span> </button> </div> </aside>  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/admin/AdminSidebar.astro", void 0);
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$AdminHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminHeader;
  const { title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="admin-header" data-astro-cid-ezdk3gz6> <h1 data-astro-cid-ezdk3gz6>${title}</h1> <div class="header-actions" data-astro-cid-ezdk3gz6> <button id="theme-toggle-admin" class="theme-toggle-btn" aria-label="Toggle dark mode" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon light-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-ezdk3gz6></path> </svg> <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon dark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" data-astro-cid-ezdk3gz6></path> </svg> </button> <div class="user-menu" data-astro-cid-ezdk3gz6> <button id="user-menu-btn" class="user-menu-btn" data-astro-cid-ezdk3gz6> <img src="/images/admin/avatar.png" alt="Admin User" class="user-avatar" onerror="this.src='/images/admin/avatar-placeholder.png'" data-astro-cid-ezdk3gz6> <span data-astro-cid-ezdk3gz6>Admin</span> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-ezdk3gz6></path> </svg> </button> <div id="user-dropdown" class="user-dropdown" data-astro-cid-ezdk3gz6> <a href="/admin/profile" class="dropdown-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Profile</span> </a> <a href="/admin/settings" class="dropdown-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-ezdk3gz6></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Settings</span> </a> <div class="dropdown-divider" data-astro-cid-ezdk3gz6></div> <button id="logout-dropdown-btn" class="dropdown-item logout-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Logout</span> </button> </div> </div> </div> </header>  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/admin/AdminHeader.astro", void 0);
const $$AdminDashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="dashboard-container" data-astro-cid-wevncqq4> <div class="dashboard-stats" data-astro-cid-wevncqq4> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon projects-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Projects</h3> <p class="stat-value" data-astro-cid-wevncqq4>12</p> <p class="stat-description" data-astro-cid-wevncqq4>Total projects</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon blog-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Blog Posts</h3> <p class="stat-value" data-astro-cid-wevncqq4>8</p> <p class="stat-description" data-astro-cid-wevncqq4>Published posts</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon media-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Media</h3> <p class="stat-value" data-astro-cid-wevncqq4>24</p> <p class="stat-description" data-astro-cid-wevncqq4>Uploaded files</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon messages-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Messages</h3> <p class="stat-value" data-astro-cid-wevncqq4>5</p> <p class="stat-description" data-astro-cid-wevncqq4>Unread messages</p> </div> </div> </div> <div class="dashboard-sections" data-astro-cid-wevncqq4> <div class="dashboard-section" data-astro-cid-wevncqq4> <div class="section-header" data-astro-cid-wevncqq4> <h2 data-astro-cid-wevncqq4>Recent Projects</h2> <a href="/admin/projects" class="view-all-link" data-astro-cid-wevncqq4>View All</a> </div> <div class="section-content" data-astro-cid-wevncqq4> <table class="admin-table" data-astro-cid-wevncqq4> <thead data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <th data-astro-cid-wevncqq4>Title</th> <th data-astro-cid-wevncqq4>Category</th> <th data-astro-cid-wevncqq4>Date</th> <th data-astro-cid-wevncqq4>Status</th> <th data-astro-cid-wevncqq4>Actions</th> </tr> </thead> <tbody data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>NosytOS95</td> <td data-astro-cid-wevncqq4>Web Development</td> <td data-astro-cid-wevncqq4>2025-01-15</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>3D Printing Service</td> <td data-astro-cid-wevncqq4>Service</td> <td data-astro-cid-wevncqq4>2025-01-10</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>AI Content Generator</td> <td data-astro-cid-wevncqq4>AI</td> <td data-astro-cid-wevncqq4>2024-12-28</td> <td data-astro-cid-wevncqq4><span class="status-badge status-draft" data-astro-cid-wevncqq4>Draft</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> </tbody> </table> </div> </div> <div class="dashboard-section" data-astro-cid-wevncqq4> <div class="section-header" data-astro-cid-wevncqq4> <h2 data-astro-cid-wevncqq4>Recent Blog Posts</h2> <a href="/admin/blog" class="view-all-link" data-astro-cid-wevncqq4>View All</a> </div> <div class="section-content" data-astro-cid-wevncqq4> <table class="admin-table" data-astro-cid-wevncqq4> <thead data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <th data-astro-cid-wevncqq4>Title</th> <th data-astro-cid-wevncqq4>Category</th> <th data-astro-cid-wevncqq4>Date</th> <th data-astro-cid-wevncqq4>Status</th> <th data-astro-cid-wevncqq4>Actions</th> </tr> </thead> <tbody data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>Cursor AI: The Future of Coding</td> <td data-astro-cid-wevncqq4>AI Tools</td> <td data-astro-cid-wevncqq4>2025-01-20</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>Trae AI: Revolutionizing Content Creation</td> <td data-astro-cid-wevncqq4>AI Tools</td> <td data-astro-cid-wevncqq4>2025-01-12</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>The Rise of No-Code AI Editors</td> <td data-astro-cid-wevncqq4>Technology</td> <td data-astro-cid-wevncqq4>2025-01-05</td> <td data-astro-cid-wevncqq4><span class="status-badge status-draft" data-astro-cid-wevncqq4>Draft</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> </tbody> </table> </div> </div> </div> </div> `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/admin/AdminDashboard.astro", void 0);
const $$Index$3 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Admin Panel - NosytLabs", "description": "NosytLabs Admin Panel for managing content", "data-astro-cid-u2h3djql": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-container" data-astro-cid-u2h3djql>${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "data-astro-cid-u2h3djql": true })}<div class="admin-content" data-astro-cid-u2h3djql>${renderComponent($$result2, "AdminHeader", $$AdminHeader, { "title": "Dashboard", "data-astro-cid-u2h3djql": true })}${renderComponent($$result2, "AdminDashboard", $$AdminDashboard, { "data-astro-cid-u2h3djql": true })}</div></div>` })}`}`;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/index.astro", void 0);
const $$file$3 = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/index.astro";
const $$url$3 = "/admin.html";
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$3, file: $$file$3, url: $$url$3 }, Symbol.toStringTag, { value: "Module" }));
const $$Index$2 = createComponent(($$result, $$props, $$slots) => {
  const projects = [
    {
      id: "1",
      title: "NosytOS95",
      description: "A Windows 95-style interface with working applications.",
      category: "Web Development",
      image: "/images/projects/nosytos95.jpg",
      link: "/nosytos95",
      date: "2025-01-15",
      status: "published"
    },
    {
      id: "2",
      title: "3D Printing Service",
      description: "Custom 3D printing service for various needs.",
      category: "Service",
      image: "/images/projects/3d-printing.jpg",
      link: "/3d-printing",
      date: "2025-01-10",
      status: "published"
    },
    {
      id: "3",
      title: "AI Content Generator",
      description: "Generate content using advanced AI models.",
      category: "AI",
      image: "/images/projects/ai-generator.jpg",
      link: "/projects/ai-generator",
      date: "2024-12-28",
      status: "draft"
    },
    {
      id: "4",
      title: "Streaming Setup",
      description: "Professional streaming setup for content creators.",
      category: "Streaming",
      image: "/images/projects/streaming.jpg",
      link: "/projects/streaming",
      date: "2024-12-15",
      status: "published"
    }
  ];
  return renderTemplate`${renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Projects Management - NosytLabs Admin", "description": "Manage your projects in the NosytLabs Admin Panel", "data-astro-cid-rtrcrstu": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-container" data-astro-cid-rtrcrstu>${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "data-astro-cid-rtrcrstu": true })}<div class="admin-content" data-astro-cid-rtrcrstu>${renderComponent($$result2, "AdminHeader", $$AdminHeader, { "title": "Projects Management", "data-astro-cid-rtrcrstu": true })}<div class="content-container" data-astro-cid-rtrcrstu><div class="content-header" data-astro-cid-rtrcrstu><h2 data-astro-cid-rtrcrstu>All Projects</h2><a href="/admin/projects/new" class="btn-primary" data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-astro-cid-rtrcrstu></path></svg>
Add New Project
</a></div><div class="filter-bar" data-astro-cid-rtrcrstu><div class="search-box" data-astro-cid-rtrcrstu><input type="text" id="search-projects" placeholder="Search projects..." data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-rtrcrstu></path></svg></div><div class="filter-options" data-astro-cid-rtrcrstu><select id="category-filter" data-astro-cid-rtrcrstu><option value="" data-astro-cid-rtrcrstu>All Categories</option><option value="Web Development" data-astro-cid-rtrcrstu>Web Development</option><option value="Service" data-astro-cid-rtrcrstu>Service</option><option value="AI" data-astro-cid-rtrcrstu>AI</option><option value="Streaming" data-astro-cid-rtrcrstu>Streaming</option></select><select id="status-filter" data-astro-cid-rtrcrstu><option value="" data-astro-cid-rtrcrstu>All Status</option><option value="published" data-astro-cid-rtrcrstu>Published</option><option value="draft" data-astro-cid-rtrcrstu>Draft</option></select></div></div><div class="projects-table-container" data-astro-cid-rtrcrstu><table class="admin-table projects-table" data-astro-cid-rtrcrstu><thead data-astro-cid-rtrcrstu><tr data-astro-cid-rtrcrstu><th data-astro-cid-rtrcrstu>Image</th><th data-astro-cid-rtrcrstu>Title</th><th data-astro-cid-rtrcrstu>Category</th><th data-astro-cid-rtrcrstu>Date</th><th data-astro-cid-rtrcrstu>Status</th><th data-astro-cid-rtrcrstu>Actions</th></tr></thead><tbody id="projects-table-body" data-astro-cid-rtrcrstu>${projects.map((project) => renderTemplate`<tr${addAttribute(project.id, "data-id")} data-astro-cid-rtrcrstu><td class="image-cell" data-astro-cid-rtrcrstu><img${addAttribute(project.image, "src")}${addAttribute(project.title, "alt")} class="project-thumbnail" onerror="this.src='/images/placeholder.jpg'" data-astro-cid-rtrcrstu></td><td data-astro-cid-rtrcrstu>${project.title}</td><td data-astro-cid-rtrcrstu>${project.category}</td><td data-astro-cid-rtrcrstu>${project.date}</td><td data-astro-cid-rtrcrstu><span${addAttribute(`status-badge status-${project.status}`, "class")} data-astro-cid-rtrcrstu>${project.status === "published" ? "Published" : "Draft"}</span></td><td class="actions-cell" data-astro-cid-rtrcrstu><a${addAttribute(`/admin/projects/edit/${project.id}`, "href")} class="action-btn edit-btn" aria-label="Edit" data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-rtrcrstu></path></svg></a><button class="action-btn view-btn" aria-label="View"${addAttribute(project.link, "data-link")} data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-rtrcrstu></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-astro-cid-rtrcrstu></path></svg></button><button class="action-btn delete-btn" aria-label="Delete"${addAttribute(project.id, "data-id")} data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-rtrcrstu></path></svg></button></td></tr>`)}</tbody></table></div><div class="pagination" data-astro-cid-rtrcrstu><button class="pagination-btn" disabled data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-rtrcrstu></path></svg></button><span class="pagination-info" data-astro-cid-rtrcrstu>Page 1 of 1</span><button class="pagination-btn" disabled data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-rtrcrstu></path></svg></button></div></div></div></div><div id="delete-modal" class="modal" data-astro-cid-rtrcrstu><div class="modal-content" data-astro-cid-rtrcrstu><div class="modal-header" data-astro-cid-rtrcrstu><h3 data-astro-cid-rtrcrstu>Confirm Deletion</h3><button id="close-modal" class="close-modal" data-astro-cid-rtrcrstu><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-rtrcrstu><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-rtrcrstu></path></svg></button></div><div class="modal-body" data-astro-cid-rtrcrstu><p data-astro-cid-rtrcrstu>Are you sure you want to delete this project? This action cannot be undone.</p></div><div class="modal-footer" data-astro-cid-rtrcrstu><button id="cancel-delete" class="btn-secondary" data-astro-cid-rtrcrstu>Cancel</button><button id="confirm-delete" class="btn-danger" data-astro-cid-rtrcrstu>Delete</button></div></div></div>` })}`}`;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/projects/index.astro", void 0);
const $$file$2 = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/projects/index.astro";
const $$url$2 = "/admin/projects.html";
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$2, file: $$file$2, url: $$url$2 }, Symbol.toStringTag, { value: "Module" }));
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const blogPosts = [
    {
      id: "1",
      title: "Cursor AI: The Future of Coding",
      excerpt: "Explore how Cursor AI is revolutionizing the way developers write code.",
      category: "AI Tools",
      image: "/images/blog/cursor-ai.jpg",
      slug: "cursor-ai",
      date: "2025-01-20",
      status: "published",
      author: "Admin"
    },
    {
      id: "2",
      title: "Trae AI: Revolutionizing Content Creation",
      excerpt: "Discover how Trae AI is changing the landscape of content creation.",
      category: "AI Tools",
      image: "/images/blog/trae-ai.jpg",
      slug: "trae-ai",
      date: "2025-01-12",
      status: "published",
      author: "Admin"
    },
    {
      id: "3",
      title: "The Rise of No-Code AI Editors",
      excerpt: "Learn about the growing trend of no-code AI editors and their impact.",
      category: "Technology",
      image: "/images/blog/no-code-ai.jpg",
      slug: "no-code-ai-editors",
      date: "2025-01-05",
      status: "draft",
      author: "Admin"
    },
    {
      id: "4",
      title: "Roo Code: AI-Powered Development",
      excerpt: "An in-depth look at Roo Code and its AI-powered development capabilities.",
      category: "AI Tools",
      image: "/images/blog/roo-code.jpg",
      slug: "roo-code",
      date: "2024-12-28",
      status: "published",
      author: "Admin"
    }
  ];
  return renderTemplate`${renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Blog Posts Management - NosytLabs Admin", "description": "Manage your blog posts in the NosytLabs Admin Panel", "data-astro-cid-mxlyrly4": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="admin-container" data-astro-cid-mxlyrly4>${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "data-astro-cid-mxlyrly4": true })}<div class="admin-content" data-astro-cid-mxlyrly4>${renderComponent($$result2, "AdminHeader", $$AdminHeader, { "title": "Blog Posts Management", "data-astro-cid-mxlyrly4": true })}<div class="content-container" data-astro-cid-mxlyrly4><div class="content-header" data-astro-cid-mxlyrly4><h2 data-astro-cid-mxlyrly4>All Blog Posts</h2><a href="/admin/blog/new" class="btn-primary" data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-astro-cid-mxlyrly4></path></svg>
Add New Post
</a></div><div class="filter-bar" data-astro-cid-mxlyrly4><div class="search-box" data-astro-cid-mxlyrly4><input type="text" id="search-posts" placeholder="Search posts..." data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-mxlyrly4></path></svg></div><div class="filter-options" data-astro-cid-mxlyrly4><select id="category-filter" data-astro-cid-mxlyrly4><option value="" data-astro-cid-mxlyrly4>All Categories</option><option value="AI Tools" data-astro-cid-mxlyrly4>AI Tools</option><option value="Technology" data-astro-cid-mxlyrly4>Technology</option><option value="Web Development" data-astro-cid-mxlyrly4>Web Development</option><option value="Streaming" data-astro-cid-mxlyrly4>Streaming</option></select><select id="status-filter" data-astro-cid-mxlyrly4><option value="" data-astro-cid-mxlyrly4>All Status</option><option value="published" data-astro-cid-mxlyrly4>Published</option><option value="draft" data-astro-cid-mxlyrly4>Draft</option></select></div></div><div class="posts-table-container" data-astro-cid-mxlyrly4><table class="admin-table posts-table" data-astro-cid-mxlyrly4><thead data-astro-cid-mxlyrly4><tr data-astro-cid-mxlyrly4><th data-astro-cid-mxlyrly4>Image</th><th data-astro-cid-mxlyrly4>Title</th><th data-astro-cid-mxlyrly4>Category</th><th data-astro-cid-mxlyrly4>Date</th><th data-astro-cid-mxlyrly4>Status</th><th data-astro-cid-mxlyrly4>Actions</th></tr></thead><tbody id="posts-table-body" data-astro-cid-mxlyrly4>${blogPosts.map((post) => renderTemplate`<tr${addAttribute(post.id, "data-id")} data-astro-cid-mxlyrly4><td class="image-cell" data-astro-cid-mxlyrly4><img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="post-thumbnail" onerror="this.src='/images/placeholder.jpg'" data-astro-cid-mxlyrly4></td><td data-astro-cid-mxlyrly4>${post.title}</td><td data-astro-cid-mxlyrly4>${post.category}</td><td data-astro-cid-mxlyrly4>${post.date}</td><td data-astro-cid-mxlyrly4><span${addAttribute(`status-badge status-${post.status}`, "class")} data-astro-cid-mxlyrly4>${post.status === "published" ? "Published" : "Draft"}</span></td><td class="actions-cell" data-astro-cid-mxlyrly4><a${addAttribute(`/admin/blog/edit/${post.id}`, "href")} class="action-btn edit-btn" aria-label="Edit" data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-mxlyrly4></path></svg></a><button class="action-btn view-btn" aria-label="View"${addAttribute(post.slug, "data-slug")} data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-mxlyrly4></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-astro-cid-mxlyrly4></path></svg></button><button class="action-btn delete-btn" aria-label="Delete"${addAttribute(post.id, "data-id")} data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-mxlyrly4></path></svg></button></td></tr>`)}</tbody></table></div><div class="pagination" data-astro-cid-mxlyrly4><button class="pagination-btn" disabled data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-mxlyrly4></path></svg></button><span class="pagination-info" data-astro-cid-mxlyrly4>Page 1 of 1</span><button class="pagination-btn" disabled data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" class="pagination-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-mxlyrly4></path></svg></button></div></div></div></div><div id="delete-modal" class="modal" data-astro-cid-mxlyrly4><div class="modal-content" data-astro-cid-mxlyrly4><div class="modal-header" data-astro-cid-mxlyrly4><h3 data-astro-cid-mxlyrly4>Confirm Deletion</h3><button id="close-modal" class="close-modal" data-astro-cid-mxlyrly4><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-mxlyrly4><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-mxlyrly4></path></svg></button></div><div class="modal-body" data-astro-cid-mxlyrly4><p data-astro-cid-mxlyrly4>Are you sure you want to delete this blog post? This action cannot be undone.</p></div><div class="modal-footer" data-astro-cid-mxlyrly4><button id="cancel-delete" class="btn-secondary" data-astro-cid-mxlyrly4>Cancel</button><button id="confirm-delete" class="btn-danger" data-astro-cid-mxlyrly4>Delete</button></div></div></div>` })}`}`;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/blog/index.astro", void 0);
const $$file$1 = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/admin/blog/index.astro";
const $$url$1 = "/admin/blog.html";
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$1, file: $$file$1, url: $$url$1 }, Symbol.toStringTag, { value: "Module" }));
const $$Astro = createAstro("https://nosytlabs.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const pageTitle = "Blog - NosytLabs";
  const pageDescription = "Explore our blog for insights on AI tools, web development, 3D printing, and content creation.";
  const allPosts = await Astro2.glob(/* @__PURE__ */ Object.assign({ "./ai-tools-comparison-2025.astro": () => import("./ai-tools-comparison-2025.astro-6a4cb5b4.js").then((n) => n.a), "./ai-trends-2025.astro": () => import("./ai-trends-2025.astro-9f909e07.js"), "./cursor-ai-review.astro": () => import("./cursor-ai-review.astro-25ff9d5d.js"), "./cursor-ai.astro": () => import("./cursor-ai.astro-47cb217c.js"), "./future-of-3d-printing-2025.astro": () => import("./future-of-3d-printing-2025.astro-2252fe49.js"), "./roo-code-windsurf-comparison.astro": () => import("./roo-code-windsurf-comparison.astro-96e83346.js"), "./trae-ai-guide.astro": () => import("../../pages/passive-income/guide.astro.mjs").then((n) => n.t) }), () => "./*.astro").then(
    (posts) => posts.filter((post) => {
      var _a, _b;
      return !((_a = post.url) == null ? void 0 : _a.endsWith("/blog")) && !((_b = post.url) == null ? void 0 : _b.endsWith("/blog/"));
    })
  );
  const blogPosts = allPosts.map((post) => {
    var _a, _b, _c;
    const frontmatter = post.frontmatter || {};
    const title = frontmatter.title || "Untitled Post";
    const excerpt = frontmatter.description || frontmatter.excerpt || "No excerpt available";
    const date = frontmatter.date || "2025-01-01";
    const author = frontmatter.author || "NosytLabs";
    const tags = frontmatter.tags || ["AI Tools"];
    const image = frontmatter.image || "/images/blog/default.jpg";
    let readTime = "5 min read";
    try {
      const estimatedWords = 800;
      readTime = `${Math.ceil(estimatedWords / 200)} min read`;
    } catch (e) {
      readTime = "5 min read";
    }
    const slug = ((_a = post.url) == null ? void 0 : _a.split("/").pop()) || ((_c = (_b = post.file) == null ? void 0 : _b.split("/").pop()) == null ? void 0 : _c.replace(".astro", "")) || "";
    return {
      id: slug,
      title,
      slug,
      excerpt,
      date: new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      author,
      category: tags[0] || "AI Tools",
      tags,
      image,
      readTime
    };
  }).filter((post) => post.title !== "Untitled Post" && post.slug);
  const categories2 = [...new Set(blogPosts.map((post) => post.category))];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-5tznm7mj": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-5tznm7mj> <div class="container mx-auto px-4" data-astro-cid-5tznm7mj> <div class="max-w-3xl mx-auto text-center animate-fade-in" data-astro-cid-5tznm7mj> ${renderComponent($$result2, "GlitchText", $$GlitchText, { "text": "NosytLabs Blog", "tag": "h1", "color": "text-white", "size": "text-4xl md:text-5xl", "weight": "font-bold", "className": "mb-4", "glitchOnHover": true, "data-astro-cid-5tznm7mj": true })} <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-5tznm7mj>
Insights on AI tools, web development, 3D printing, and content creation
</p> </div> </div> <!-- Background particles with enhanced animation --> <div class="absolute inset-0 overflow-hidden -z-10" data-astro-cid-5tznm7mj> <div class="particles-enhanced" data-astro-cid-5tznm7mj></div> </div> </div>  ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in", "class": "py-16 bg-gray-50 dark:bg-gray-900", "data-astro-cid-5tznm7mj": true }, { "default": async ($$result3) => renderTemplate` <div class="container mx-auto px-4" data-astro-cid-5tznm7mj> <!-- Category Filter --> <div class="flex flex-wrap justify-center gap-3 mb-12" data-astro-cid-5tznm7mj> <button class="category-filter active px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors" data-category="all" data-astro-cid-5tznm7mj>
All Posts
</button> ${categories2.map((category) => renderTemplate`<button class="category-filter px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-accent hover:text-white transition-colors"${addAttribute(category, "data-category")} data-astro-cid-5tznm7mj> ${category} </button>`)} </div> <!-- Blog Posts Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-5tznm7mj> ${blogPosts.map((post) => renderTemplate`<article class="blog-post-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"${addAttribute(post.category, "data-category")} data-astro-cid-5tznm7mj> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block" data-astro-cid-5tznm7mj> <div class="relative" data-astro-cid-5tznm7mj> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover" onerror="this.src='/images/fallback-image.svg'; this.onerror=null;" data-astro-cid-5tznm7mj> <div class="absolute top-4 right-4 bg-accent text-white text-xs px-2 py-1 rounded-full" data-astro-cid-5tznm7mj> ${post.category} </div> </div> <div class="p-6" data-astro-cid-5tznm7mj> <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2" data-astro-cid-5tznm7mj> <span data-astro-cid-5tznm7mj>${post.date}</span> <span class="mx-2" data-astro-cid-5tznm7mj>•</span> <span data-astro-cid-5tznm7mj>${post.readTime}</span> </div> <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-5tznm7mj>${post.title}</h2> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-5tznm7mj>${post.excerpt}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-5tznm7mj> ${post.tags.map((tag) => renderTemplate`<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded" data-astro-cid-5tznm7mj> ${tag} </span>`)} </div> <div class="flex items-center justify-between" data-astro-cid-5tznm7mj> <div class="flex items-center" data-astro-cid-5tznm7mj> <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2" data-astro-cid-5tznm7mj> <span class="text-sm font-bold" data-astro-cid-5tznm7mj>${post.author.charAt(0)}</span> </div> <span class="text-sm text-gray-700 dark:text-gray-300" data-astro-cid-5tznm7mj>${post.author}</span> </div> <span class="text-accent hover:text-accent-dark font-medium text-sm" data-astro-cid-5tznm7mj>Read More →</span> </div> </div> </a> </article>`)} </div> <!-- Newsletter Signup --> <div class="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto" data-astro-cid-5tznm7mj> <div class="text-center mb-6" data-astro-cid-5tznm7mj> <h2 class="text-2xl font-bold mb-2 text-gray-800 dark:text-white" data-astro-cid-5tznm7mj>Subscribe to Our Newsletter</h2> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-5tznm7mj>Get the latest articles, tutorials, and updates delivered to your inbox.</p> </div> <form class="flex flex-col sm:flex-row gap-4" data-astro-cid-5tznm7mj> <input type="email" placeholder="Enter your email" class="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required data-astro-cid-5tznm7mj> <button type="submit" class="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-6 rounded-lg transition-colors" data-astro-cid-5tznm7mj>
Subscribe
</button> </form> </div> </div> ` })} ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog/index.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog/index.astro";
const $$url = "/blog.html";
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index, file: $$file, url: $$url }, Symbol.toStringTag, { value: "Module" }));
export {
  index$3 as a,
  index$2 as b,
  index$1 as c,
  index as d,
  index$4 as i,
  projectsData as p
};
