import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from "../vendor-027e926a.js";
import { $ as $$BaseLayout } from "../../renderers.mjs";
import { $ as $$AnimatedSection } from "../../pages/passive-income/guide.astro.mjs";
import "clsx";
/* empty css                  *//* empty css                */const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$GlitchText = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
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
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/GlitchText.astro", void 0);
const $$Astro = createAstro("https://nosytlabs.com");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const pageTitle = "Blog - NosytLabs";
  const pageDescription = "Explore our blog for insights on AI tools, web development, 3D printing, and content creation.";
  const mdPosts = await Astro2.glob(/* @__PURE__ */ Object.assign({}), () => "./blog/*.md");
  const astroPosts = await Astro2.glob(/* @__PURE__ */ Object.assign({ "./blog/ai-tools-comparison-2025.astro": () => import("./ai-tools-comparison-2025.astro-6a4cb5b4.js").then((n) => n.a), "./blog/ai-trends-2025.astro": () => import("./ai-trends-2025.astro-9f909e07.js"), "./blog/cursor-ai-review.astro": () => import("./cursor-ai-review.astro-25ff9d5d.js"), "./blog/cursor-ai.astro": () => import("./cursor-ai.astro-47cb217c.js"), "./blog/future-of-3d-printing-2025.astro": () => import("./future-of-3d-printing-2025.astro-2252fe49.js"), "./blog/index.astro": () => import("./index.astro-a1eb7fa0.js").then((n) => n.d), "./blog/roo-code-windsurf-comparison.astro": () => import("./roo-code-windsurf-comparison.astro-96e83346.js"), "./blog/trae-ai-guide.astro": () => import("../../pages/passive-income/guide.astro.mjs").then((n) => n.t) }), () => "./blog/*.astro").then(
    (posts) => (
      // Filter out the index.astro file
      posts.filter((post) => post.url !== "/blog")
    )
  );
  const allPosts = [...mdPosts, ...astroPosts];
  const blogPosts = allPosts.map((post) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return {
      id: ((_a = post.url) == null ? void 0 : _a.split("/").pop()) || "",
      title: ((_b = post.frontmatter) == null ? void 0 : _b.title) || "Untitled Post",
      slug: ((_c = post.url) == null ? void 0 : _c.split("/").pop()) || "",
      excerpt: ((_d = post.frontmatter) == null ? void 0 : _d.excerpt) || "No excerpt available",
      date: ((_e = post.frontmatter) == null ? void 0 : _e.date) ? new Date(post.frontmatter.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }) : "No date",
      author: ((_f = post.frontmatter) == null ? void 0 : _f.author) || "Tycen",
      category: ((_h = (_g = post.frontmatter) == null ? void 0 : _g.tags) == null ? void 0 : _h[0]) || "AI Tools",
      tags: ((_i = post.frontmatter) == null ? void 0 : _i.tags) || [],
      image: ((_j = post.frontmatter) == null ? void 0 : _j.image) || "/images/blog/default.jpg",
      readTime: post.rawContent ? `${Math.ceil(post.rawContent().split(" ").length / 200)} min read` : "5 min read"
    };
  });
  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-ijnerlr2": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="relative bg-gradient-to-br from-primary-dark to-primary-main text-white py-20" data-astro-cid-ijnerlr2> <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <div class="max-w-3xl mx-auto text-center animate-fade-in" data-astro-cid-ijnerlr2> ${renderComponent($$result2, "GlitchText", $$GlitchText, { "text": "NosytLabs Blog", "tag": "h1", "color": "text-white", "size": "text-4xl md:text-5xl", "weight": "font-bold", "className": "mb-4", "glitchOnHover": true, "data-astro-cid-ijnerlr2": true })} <p class="text-xl animate-slide-up" style="animation-delay: 0.2s;" data-astro-cid-ijnerlr2>
Insights on AI tools, web development, 3D printing, and content creation
</p> </div> </div> <!-- Background particles with enhanced animation --> <div class="absolute inset-0 overflow-hidden -z-10" data-astro-cid-ijnerlr2> <div class="particles-enhanced" data-astro-cid-ijnerlr2></div> </div> </div>  ${renderComponent($$result2, "AnimatedSection", $$AnimatedSection, { "animation": "fade-in", "class": "py-16 bg-gray-50 dark:bg-gray-900", "data-astro-cid-ijnerlr2": true }, { "default": async ($$result3) => renderTemplate` <div class="container mx-auto px-4" data-astro-cid-ijnerlr2> <!-- Category Filter --> <div class="flex flex-wrap justify-center gap-3 mb-12" data-astro-cid-ijnerlr2> <button class="category-filter active px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors" data-category="all" data-astro-cid-ijnerlr2>
All Posts
</button> ${categories.map((category) => renderTemplate`<button class="category-filter px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-accent hover:text-white transition-colors"${addAttribute(category, "data-category")} data-astro-cid-ijnerlr2> ${category} </button>`)} </div> <!-- Blog Posts Grid --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-ijnerlr2> ${blogPosts.map((post) => renderTemplate`<article class="blog-post-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"${addAttribute(post.category, "data-category")} data-astro-cid-ijnerlr2> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block" data-astro-cid-ijnerlr2> <div class="relative" data-astro-cid-ijnerlr2> <img${addAttribute(post.image, "src")}${addAttribute(post.title, "alt")} class="w-full h-48 object-cover" onerror="this.src='/images/fallback-image.svg'; this.onerror=null;" data-astro-cid-ijnerlr2> <div class="absolute top-4 right-4 bg-accent text-white text-xs px-2 py-1 rounded-full" data-astro-cid-ijnerlr2> ${post.category} </div> </div> <div class="p-6" data-astro-cid-ijnerlr2> <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2" data-astro-cid-ijnerlr2> <span data-astro-cid-ijnerlr2>${post.date}</span> <span class="mx-2" data-astro-cid-ijnerlr2>•</span> <span data-astro-cid-ijnerlr2>${post.readTime}</span> </div> <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white" data-astro-cid-ijnerlr2>${post.title}</h2> <p class="text-gray-600 dark:text-gray-300 mb-4" data-astro-cid-ijnerlr2>${post.excerpt}</p> <div class="flex flex-wrap gap-2 mb-4" data-astro-cid-ijnerlr2> ${post.tags.map((tag) => renderTemplate`<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded" data-astro-cid-ijnerlr2> ${tag} </span>`)} </div> <div class="flex items-center justify-between" data-astro-cid-ijnerlr2> <div class="flex items-center" data-astro-cid-ijnerlr2> <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2" data-astro-cid-ijnerlr2> <span class="text-sm font-bold" data-astro-cid-ijnerlr2>${post.author.charAt(0)}</span> </div> <span class="text-sm text-gray-700 dark:text-gray-300" data-astro-cid-ijnerlr2>${post.author}</span> </div> <span class="text-accent hover:text-accent-dark font-medium text-sm" data-astro-cid-ijnerlr2>Read More →</span> </div> </div> </a> </article>`)} </div> <!-- Newsletter Signup --> <div class="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto" data-astro-cid-ijnerlr2> <div class="text-center mb-6" data-astro-cid-ijnerlr2> <h2 class="text-2xl font-bold mb-2 text-gray-800 dark:text-white" data-astro-cid-ijnerlr2>Subscribe to Our Newsletter</h2> <p class="text-gray-600 dark:text-gray-300" data-astro-cid-ijnerlr2>Get the latest articles, tutorials, and updates delivered to your inbox.</p> </div> <form class="flex flex-col sm:flex-row gap-4" data-astro-cid-ijnerlr2> <input type="email" placeholder="Enter your email" class="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-accent focus:border-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required data-astro-cid-ijnerlr2> <button type="submit" class="bg-accent hover:bg-accent-dark text-white font-medium py-2 px-6 rounded-lg transition-colors" data-astro-cid-ijnerlr2>
Subscribe
</button> </form> </div> </div> ` })} ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/blog.astro";
const $$url = "/blog.html";
const blog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Blog, file: $$file, url: $$url }, Symbol.toStringTag, { value: "Module" }));
export {
  $$GlitchText as $,
  blog as b
};
