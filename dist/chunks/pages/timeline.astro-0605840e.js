/* empty css                              */import {c as createAstro,a as createComponent,r as renderTemplate,m as maybeRenderHead,b as addAttribute,d as renderComponent}from'../astro-6c4e0209.js';import'clsx';import {$ as $$BaseLayout}from'./3d-printing.astro-671fe4d5.js';/* empty css                           */const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$ProjectTimeline = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ProjectTimeline;
  const {
    title = "Our Journey",
    subtitle = "The evolution of NosytLabs projects over time",
    items = [],
    theme = "light",
    animated = true
  } = Astro2.props;
  const themeClasses = {
    light: "bg-white text-gray-800",
    dark: "bg-gray-900 text-white",
    gradient: "bg-gradient-to-br from-primary-dark via-primary to-secondary text-white"
  };
  const containerClass = themeClasses[theme];
  const timelineClass = theme === "dark" ? "timeline-dark" : "timeline-light";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`project-timeline-section py-16 ${containerClass}`, "class")} data-astro-cid-ekevbqja> <div class="container mx-auto px-4" data-astro-cid-ekevbqja> <div class="text-center mb-12" data-astro-cid-ekevbqja> <h2 class="text-3xl md:text-4xl font-bold mb-4" data-astro-cid-ekevbqja>${title}</h2> <p class="text-lg opacity-80 max-w-3xl mx-auto" data-astro-cid-ekevbqja>${subtitle}</p> </div> <div${addAttribute(`timeline-container ${timelineClass} ${animated ? "timeline-animated" : ""}`, "class")} data-astro-cid-ekevbqja> ${items.map((item, index) => renderTemplate`<div${addAttribute(`timeline-item ${index % 2 === 0 ? "timeline-left" : "timeline-right"}`, "class")}${addAttribute(item.year, "data-year")} data-astro-cid-ekevbqja> <div class="timeline-content" data-astro-cid-ekevbqja> <div class="timeline-marker" data-astro-cid-ekevbqja></div> <div class="timeline-card" data-astro-cid-ekevbqja>  <div class="timeline-text" data-astro-cid-ekevbqja> <h3 class="timeline-title" data-astro-cid-ekevbqja>${item.title}</h3> <p class="timeline-description" data-astro-cid-ekevbqja>${item.description}</p> ${item.technologies && item.technologies.length > 0 && renderTemplate`<div class="timeline-technologies" data-astro-cid-ekevbqja> ${item.technologies.map((tech) => renderTemplate`<span class="timeline-tech-tag" data-astro-cid-ekevbqja>${tech}</span>`)} </div>`} ${item.link && renderTemplate`<a${addAttribute(item.link, "href")} class="timeline-link" target="_blank" rel="noopener noreferrer" data-astro-cid-ekevbqja>
View Project
<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ekevbqja> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-astro-cid-ekevbqja></path> </svg> </a>`} </div> </div> </div> </div>`)} <!-- Timeline line --> <div class="timeline-line" data-astro-cid-ekevbqja></div> </div> </div> </section>  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/ProjectTimeline.astro", void 0);const $$Astro = createAstro("https://nosytlabs.com");
const $$Timeline = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Timeline;
  const timelineItems = [
    {
      year: "2025",
      title: "Promptpedia Platform",
      description: "A comprehensive prompt engineering platform that helps AI practitioners create, test, and optimize prompts for various AI models. Features include version control, collaborative editing, A/B testing, and performance analytics.",
      technologies: ["Next.js", "React", "TypeScript", "MongoDB", "OpenAI API"],
      category: "Artificial Intelligence",
      link: "https://github.com/NosytLabs/promptpedia-platform"
    },
    {
      year: "2025",
      title: "NosytLabs.com Website",
      description: "A unique portfolio website featuring a Windows 95 retro aesthetic (NosytOS95) with fully functional interactive applications, including a terminal, Clippy assistant, Duck Hunt game, and more.",
      technologies: ["Astro", "React", "TailwindCSS", "JavaScript", "CSS"],
      category: "Web Development",
      link: "https://github.com/NosytLabs/nosytlabs.com"
    },
    {
      year: "2025",
      title: "Kick API MCP",
      description: "A Multimodal Control Protocol (MCP) for the Kick.com streaming platform that enables seamless integration with stream management tools. Features include chat interaction, stream status monitoring, viewer analytics, and automated content moderation using AI.",
      technologies: ["TypeScript", "Node.js", "WebSockets", "OAuth2", "Redis"],
      category: "API Development",
      link: "https://github.com/NosytLabs/KickMCP"
    },
    {
      year: "2024",
      title: "NosytCoder AI Assistant",
      description: "A sophisticated VSCode extension that leverages fine-tuned AI models to provide context-aware code suggestions, automated refactoring, bug detection, and natural language code generation.",
      technologies: ["TypeScript", "Python", "TensorFlow", "LangChain", "VSCode API"],
      category: "Artificial Intelligence",
      link: "https://github.com/NosytLabs"
    },
    {
      year: "2024",
      title: "3D Model Repository",
      description: "A comprehensive repository of 3D models for printing, featuring customizable designs, optimization tools, and integration with popular slicing software. Includes models for practical household items, gaming accessories, and decorative pieces.",
      technologies: ["Three.js", "WebGL", "React", "Node.js", "MongoDB"],
      category: "3D Printing",
      link: "https://github.com/NosytLabs"
    },
    {
      year: "2023",
      title: "Streaming Toolkit",
      description: "A comprehensive toolkit for content creators that integrates with popular streaming platforms like Kick and YouTube. Features include custom overlays, alerts, chat moderation tools, and analytics dashboards.",
      technologies: ["Electron", "React", "WebSockets", "OBS Integration", "API"],
      category: "Content Creation",
      link: "https://github.com/NosytLabs"
    }
  ];
  const pageTitle = "Project Timeline - NosytLabs";
  const pageDescription = "Explore the evolution of NosytLabs projects over time, from our earliest work to our latest innovations.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-qlh7ngej": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12" data-astro-cid-qlh7ngej> <div class="text-center mb-16" data-astro-cid-qlh7ngej> <h1 class="text-4xl md:text-5xl font-bold mb-6" data-astro-cid-qlh7ngej>
Project <span class="text-accent" data-astro-cid-qlh7ngej>Timeline</span> </h1> <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" data-astro-cid-qlh7ngej>
Explore our journey through technology and innovation. This timeline showcases the evolution of NosytLabs projects from our earliest work to our latest cutting-edge solutions.
</p> </div> ${renderComponent($$result2, "ProjectTimeline", $$ProjectTimeline, { "title": "NosytLabs Project Evolution", "subtitle": "From concept to creation, follow our journey of innovation and development", "items": timelineItems, "theme": "light", "animated": true, "data-astro-cid-qlh7ngej": true })} <div class="mt-20 text-center" data-astro-cid-qlh7ngej> <h2 class="text-2xl font-bold mb-6" data-astro-cid-qlh7ngej>Our Development Philosophy</h2> <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-qlh7ngej> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" data-astro-cid-qlh7ngej> <div class="text-accent text-4xl mb-4" data-astro-cid-qlh7ngej> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qlh7ngej> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" data-astro-cid-qlh7ngej></path> </svg> </div> <h3 class="text-xl font-semibold mb-2" data-astro-cid-qlh7ngej>Innovation First</h3> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-qlh7ngej>
We prioritize innovative solutions that push boundaries and explore new possibilities in technology.
</p> </div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" data-astro-cid-qlh7ngej> <div class="text-accent text-4xl mb-4" data-astro-cid-qlh7ngej> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qlh7ngej> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" data-astro-cid-qlh7ngej></path> </svg> </div> <h3 class="text-xl font-semibold mb-2" data-astro-cid-qlh7ngej>User-Centered</h3> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-qlh7ngej>
Every project begins and ends with the user experience in mind, ensuring our solutions are intuitive and valuable.
</p> </div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" data-astro-cid-qlh7ngej> <div class="text-accent text-4xl mb-4" data-astro-cid-qlh7ngej> <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qlh7ngej> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" data-astro-cid-qlh7ngej></path> </svg> </div> <h3 class="text-xl font-semibold mb-2" data-astro-cid-qlh7ngej>Quality & Security</h3> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-qlh7ngej>
We maintain the highest standards of code quality, performance, and security in every project we undertake.
</p> </div> </div> </div> <div class="mt-20 text-center" data-astro-cid-qlh7ngej> <div class="bg-gradient-to-r from-primary to-accent text-white p-10 rounded-xl shadow-lg" data-astro-cid-qlh7ngej> <h2 class="text-2xl font-bold mb-4" data-astro-cid-qlh7ngej>Ready to Start Your Project?</h2> <p class="text-lg mb-6 max-w-2xl mx-auto" data-astro-cid-qlh7ngej>
Let's collaborate to bring your vision to life with cutting-edge technology and innovative solutions.
</p> <a href="/contact" class="inline-block bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors" data-astro-cid-qlh7ngej>
Get in Touch
</a> </div> </div> </div> ` })} `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/timeline.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/timeline.astro";
const $$url = "/timeline.html";export{$$Timeline as default,$$file as file,$$url as url};