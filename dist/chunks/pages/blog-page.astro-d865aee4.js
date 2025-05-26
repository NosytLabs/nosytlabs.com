/* empty css                              */import {c as createAstro,a as createComponent,r as renderTemplate,g as defineScriptVars,e as renderSlot,b as addAttribute,m as maybeRenderHead,d as renderComponent}from'../astro-6c4e0209.js';import {$ as $$BaseLayout}from'./3d-printing.astro-671fe4d5.js';import'clsx';/* empty css                            *//* empty css                            *//* empty css                            */var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$AnimatedSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AnimatedSection;
  const {
    animation = "fade-in",
    delay = 0,
    duration = 0.8,
    threshold = 0.1,
    once = true,
    stagger = false,
    staggerDelay = 0.1,
    class: className = "",
    id
  } = Astro2.props;
  const sectionId = id || `animated-section-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(_a || (_a = __template(["", "<section", "", "", "", "", "", "", "", "", " data-astro-cid-cch7oa3t> ", " </section>  <script>(function(){", "\n  document.addEventListener('DOMContentLoaded', () => {\n    const section = document.getElementById(sectionId);\n    if (!section) return;\n    \n    const animation = section.dataset.animation || 'fade-in';\n    const delay = parseFloat(section.dataset.delay || '0');\n    const duration = parseFloat(section.dataset.duration || '0.8');\n    const threshold = parseFloat(section.dataset.threshold || '0.1');\n    const once = section.dataset.once === 'true';\n    const stagger = section.dataset.stagger === 'true';\n    const staggerDelay = parseFloat(section.dataset.staggerDelay || '0.1');\n    \n    // Apply animation class\n    section.classList.add(`animate-${animation}`);\n    \n    // Set animation duration and delay\n    section.style.animationDuration = `${duration}s`;\n    section.style.animationDelay = `${delay}s`;\n    section.style.animationFillMode = 'forwards';\n    \n    // If staggered, prepare child elements\n    if (stagger) {\n      const children = Array.from(section.children);\n      children.forEach((child, index) => {\n        child.classList.add('staggered-child');\n        child.style.animationName = animation;\n        child.style.animationDuration = `${duration}s`;\n        child.style.animationDelay = `${delay + (index * staggerDelay)}s`;\n        child.style.animationFillMode = 'forwards';\n      });\n    }\n    \n    // Create Intersection Observer\n    const observer = new IntersectionObserver((entries) => {\n      entries.forEach(entry => {\n        if (entry.isIntersecting) {\n          // Animate the section\n          section.style.opacity = '1';\n          \n          // If staggered, animate children\n          if (stagger) {\n            const children = Array.from(section.children);\n            children.forEach((child, index) => {\n              setTimeout(() => {\n                child.style.opacity = '1';\n              }, index * (staggerDelay * 1000));\n            });\n          }\n          \n          // Unobserve if only animating once\n          if (once) {\n            observer.unobserve(section);\n          }\n        } else if (!once) {\n          // Reset animation if not once\n          section.style.opacity = '0';\n          \n          if (stagger) {\n            const children = Array.from(section.children);\n            children.forEach(child => {\n              child.style.opacity = '0';\n            });\n          }\n        }\n      });\n    }, { threshold });\n    \n    // Start observing\n    observer.observe(section);\n  });\n})();<\/script>"], ["", "<section", "", "", "", "", "", "", "", "", " data-astro-cid-cch7oa3t> ", " </section>  <script>(function(){", "\n  document.addEventListener('DOMContentLoaded', () => {\n    const section = document.getElementById(sectionId);\n    if (!section) return;\n    \n    const animation = section.dataset.animation || 'fade-in';\n    const delay = parseFloat(section.dataset.delay || '0');\n    const duration = parseFloat(section.dataset.duration || '0.8');\n    const threshold = parseFloat(section.dataset.threshold || '0.1');\n    const once = section.dataset.once === 'true';\n    const stagger = section.dataset.stagger === 'true';\n    const staggerDelay = parseFloat(section.dataset.staggerDelay || '0.1');\n    \n    // Apply animation class\n    section.classList.add(\\`animate-\\${animation}\\`);\n    \n    // Set animation duration and delay\n    section.style.animationDuration = \\`\\${duration}s\\`;\n    section.style.animationDelay = \\`\\${delay}s\\`;\n    section.style.animationFillMode = 'forwards';\n    \n    // If staggered, prepare child elements\n    if (stagger) {\n      const children = Array.from(section.children);\n      children.forEach((child, index) => {\n        child.classList.add('staggered-child');\n        child.style.animationName = animation;\n        child.style.animationDuration = \\`\\${duration}s\\`;\n        child.style.animationDelay = \\`\\${delay + (index * staggerDelay)}s\\`;\n        child.style.animationFillMode = 'forwards';\n      });\n    }\n    \n    // Create Intersection Observer\n    const observer = new IntersectionObserver((entries) => {\n      entries.forEach(entry => {\n        if (entry.isIntersecting) {\n          // Animate the section\n          section.style.opacity = '1';\n          \n          // If staggered, animate children\n          if (stagger) {\n            const children = Array.from(section.children);\n            children.forEach((child, index) => {\n              setTimeout(() => {\n                child.style.opacity = '1';\n              }, index * (staggerDelay * 1000));\n            });\n          }\n          \n          // Unobserve if only animating once\n          if (once) {\n            observer.unobserve(section);\n          }\n        } else if (!once) {\n          // Reset animation if not once\n          section.style.opacity = '0';\n          \n          if (stagger) {\n            const children = Array.from(section.children);\n            children.forEach(child => {\n              child.style.opacity = '0';\n            });\n          }\n        }\n      });\n    }, { threshold });\n    \n    // Start observing\n    observer.observe(section);\n  });\n})();<\/script>"])), maybeRenderHead(), addAttribute(sectionId, "id"), addAttribute(`animated-section ${className}`, "class"), addAttribute(animation, "data-animation"), addAttribute(delay, "data-delay"), addAttribute(duration, "data-duration"), addAttribute(threshold, "data-threshold"), addAttribute(once, "data-once"), addAttribute(stagger, "data-stagger"), addAttribute(staggerDelay, "data-stagger-delay"), renderSlot($$result, $$slots["default"]), defineScriptVars({ sectionId }));
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/animations/AnimatedSection.astro", void 0);const $$Astro = createAstro("https://nosytlabs.com");
const $$GlitchText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GlitchText;
  const {
    text,
    tag = "h2",
    color = "text-white",
    size = "text-3xl md:text-4xl",
    weight = "font-bold",
    className = "",
    glitchOnHover = false
  } = Astro2.props;
  const Tag = tag;
  const effectClass = glitchOnHover ? "highlight-text-hover" : "highlight-text";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": `${effectClass} ${color} ${size} ${weight} ${className}`, "data-astro-cid-274sirgd": true }, { "default": ($$result2) => renderTemplate`${text}` })} `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/GlitchText.astro", void 0);const $$BlogPage = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Blog - NosytLabs";
  const pageDescription = "Explore our blog for insights on AI tools, web development, 3D printing, and content creation.";
  const blogPosts = [
    {
      id: "cursor-ai",
      title: "Cursor AI: A Powerful Code Editor with Advanced AI Features",
      slug: "cursor-ai",
      excerpt: "Learn about Cursor AI, a code editor built on VSCode that offers AI-assisted features, code suggestions, and helpful tools for developers.",
      date: "January 15, 2025",
      author: "Tycen",
      category: "AI Tools",
      tags: ["AI Tools", "Development", "Productivity"],
      image: "/images/blog/cursor-ai.jpg",
      readTime: "5 min read"
    },
    {
      id: "ai-trends-2025",
      title: "AI Trends to Watch in 2025",
      slug: "ai-trends-2025",
      excerpt: "Exploring the cutting-edge developments in artificial intelligence that will shape the coming year.",
      date: "January 10, 2025",
      author: "Tycen",
      category: "AI Tools",
      tags: ["AI Tools", "Technology", "Future"],
      image: "/images/blog/ai-trends.jpg",
      readTime: "7 min read"
    },
    {
      id: "future-of-3d-printing-2025",
      title: "The Future of 3D Printing in 2025",
      slug: "future-of-3d-printing-2025",
      excerpt: "Discover the latest innovations in 3D printing technology and how they're transforming manufacturing, healthcare, and more.",
      date: "January 5, 2025",
      author: "Tycen",
      category: "3D Printing",
      tags: ["3D Printing", "Technology", "Manufacturing"],
      image: "/images/blog/3d-printing.jpg",
      readTime: "6 min read"
    },
    {
      id: "trae-ai-guide",
      title: "Trae AI Guide: Mastering Adaptive Coding",
      slug: "trae-ai-guide",
      excerpt: "A comprehensive guide to using Trae AI for adaptive coding, with tips, tricks, and real-world examples.",
      date: "December 28, 2024",
      author: "Tycen",
      category: "AI Tools",
      tags: ["AI Tools", "Development", "Coding"],
      image: "/images/blog/trae-ai.jpg",
      readTime: "8 min read"
    },
    {
      id: "roo-code-windsurf-comparison",
      title: "Roo Code vs Windsurf: AI Coding Tools Comparison",
      slug: "roo-code-windsurf-comparison",
      excerpt: "An in-depth comparison of two popular AI coding assistants, Roo Code and Windsurf, with pros, cons, and use cases for each.",
      date: "December 20, 2024",
      author: "Tycen",
      category: "AI Tools",
      tags: ["AI Tools", "Development", "Comparison"],
      image: "/images/blog/ai-coding-tools.jpg",
      readTime: "10 min read"
    },
    {
      id: "passive-income-apps-2025",
      title: "Best Passive Income Apps for 2025",
      slug: "passive-income-apps-2025",
      excerpt: "A comprehensive review of the most effective passive income apps and services for 2025, with real earnings data and honest assessments.",
      date: "December 15, 2024",
      author: "Tycen",
      category: "Passive Income",
      tags: ["Passive Income", "Apps", "Money"],
      image: "/images/blog/passive-income.jpg",
      readTime: "9 min read"
    }
  ];
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-flzyivbc": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-flzyivbc> <div class="container mx-auto px-4" data-astro-cid-flzyivbc> <div class="max-w-3xl mx-auto text-center animate-fade-in" data-astro-cid-flzyivbc> ${renderComponent($$result2, "GlitchText", $$GlitchText, { "text": "NosytLabs Blog", "tag": "h1", "color": "text-white", "size": "text-4xl md:text-5xl", "weight": "font-bold", "className": "mb-4", "glitchOnHover": true, "data-astro-cid-flzyivbc": true })} <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-flzyivbc>
Insights on AI tools, web development, 3D printing, and content creation
</p> </div> </div> <!-- Background particles with enhanced animation --> <div class="absolute inset-0 overflow-hidden -z-10" data-astro-cid-flzyivbc> <div class="particles-enhanced" data-astro-cid-flzyivbc></div> </div> </div>  ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in", "class": "py-16 bg-gray-50 dark:bg-gray-900", "data-astro-cid-flzyivbc": true }, { "default": ($$result3) => renderTemplate` <div class="container mx-auto px-4" data-astro-cid-flzyivbc> <!-- Category Filter --> <div class="flex flex-wrap justify-center gap-3 mb-12" data-astro-cid-flzyivbc> <button class="category-filter active px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors" data-category="all" data-astro-cid-flzyivbc>
All Posts
</button> ${categories.map((category) => renderTemplate`<button class="category-filter px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-accent hover:text-white transition-colors"${addAttribute(category, "data-category")} data-astro-cid-flzyivbc> ${category} </button>`)} </div> <!-- Blog Posts Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-flzyivbc> ${blogPosts.map((post) => renderTemplate`<article class="blog-post-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"${addAttribute(post.category, "data-category")} data-astro-cid-flzyivbc> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block" data-astro-cid-flzyivbc> <div class="relative" data-astro-cid-flzyivbc> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover" onerror="this.src='/images/fallback-image.svg'; this.onerror=null;" data-astro-cid-flzyivbc> <div class="absolute top-4 right-4 bg-accent text-white text-xs px-2 py-1 rounded-full" data-astro-cid-flzyivbc> ${post.category} </div> </div> <div class="p-6" data-astro-cid-flzyivbc> <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2" data-astro-cid-flzyivbc> <span data-astro-cid-flzyivbc>${post.date}</span> <span class="mx-2" data-astro-cid-flzyivbc>•</span> <span data-astro-cid-flzyivbc>${post.readTime}</span> </div> <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-flzyivbc>${post.title}</h2> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-flzyivbc>${post.excerpt}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-flzyivbc> ${post.tags.map((tag) => renderTemplate`<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded" data-astro-cid-flzyivbc> ${tag} </span>`)} </div> <div class="flex items-center justify-between" data-astro-cid-flzyivbc> <div class="flex items-center" data-astro-cid-flzyivbc> <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2" data-astro-cid-flzyivbc> <span class="text-sm font-bold" data-astro-cid-flzyivbc>${post.author.charAt(0)}</span> </div> <span class="text-sm text-gray-700 dark:text-gray-300" data-astro-cid-flzyivbc>${post.author}</span> </div> <span class="text-accent hover:text-accent-dark font-medium text-sm" data-astro-cid-flzyivbc>Read More →</span> </div> </div> </a> </article>`)} </div> <!-- Newsletter Signup --> <div class="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto" data-astro-cid-flzyivbc> <div class="text-center mb-6" data-astro-cid-flzyivbc> <h2 class="text-2xl font-bold mb-2 text-gray-800 dark:text-white" data-astro-cid-flzyivbc>Subscribe to Our Newsletter</h2> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-flzyivbc>Get the latest articles, tutorials, and updates delivered to your inbox.</p> </div> <form class="flex flex-col sm:flex-row gap-4" data-astro-cid-flzyivbc> <input type="email" placeholder="Enter your email" class="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required data-astro-cid-flzyivbc> <button type="submit" class="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-6 rounded-lg transition-colors" data-astro-cid-flzyivbc>
Subscribe
</button> </form> </div> </div> ` })} ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog-page.astro", void 0);

const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog-page.astro";
const $$url = "/blog-page.html";const blogPage=/*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({__proto__:null,default:$$BlogPage,file:$$file,url:$$url},Symbol.toStringTag,{value:'Module'}));export{$$GlitchText as $,$$AnimatedSection as a,blogPage as b};