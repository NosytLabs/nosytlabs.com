import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, e as renderTemplate, r as renderComponent, f as renderScript, h as renderSlot, i as renderHead, F as Fragment } from "./vendor-DUem_BGh.js";
/* empty css                   */
/* empty css                       */
const d$1 = createAstro("https://nosytlabs.com"), s$1 = createComponent((l2, c2, h2) => {
  const t2 = l2.createAstro(d$1, c2, h2);
  t2.self = s$1;
  const { name: a, size: v2 = "md", variant: e = "outline", color: r2 = "currentColor", className: p2 = "", ariaLabel: m2 } = t2.props, u = { xs: "w-3 h-3", sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6", xl: "w-8 h-8", "2xl": "w-10 h-10" }, i = { "web-development": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>', solid: '<path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>', viewBox: "0 0 24 24" }, "mobile-development": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>', solid: '<path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>', viewBox: "0 0 24 24" }, "ai-solutions": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>', solid: '<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>', viewBox: "0 0 24 24" }, "content-creation": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>', solid: '<path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>', viewBox: "0 0 24 24" }, "3d-printing": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>', solid: '<path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>', viewBox: "0 0 24 24" }, "crypto-mining": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75-.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>', solid: '<path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75-.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>', viewBox: "0 0 24 24" }, "arrow-right": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>', solid: '<path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L19.19 12H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, check: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>', solid: '<path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, star: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>', solid: '<path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, menu: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>', solid: '<path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, close: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>', solid: '<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, "external-link": { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>', solid: '<path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75H15.75a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v9.75a1.5 1.5 0 001.5 1.5h9.75a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v7.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3H13.5a.75.75 0 010 1.5H5.25z" clip-rule="evenodd"/>', viewBox: "0 0 24 24" }, github: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>', solid: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>', viewBox: "0 0 24 24" }, twitter: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>', solid: '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>', viewBox: "0 0 24 24" }, linkedin: { outline: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>', solid: '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>', viewBox: "0 0 24 24" } }, n2 = i[a];
  n2 || console.warn(`Icon "${a}" not found in ModernIconSystem`);
  const M = (n2 == null ? void 0 : n2[e]) || i.star[e], L = (n2 == null ? void 0 : n2.viewBox) || "0 0 24 24", $ = e === "mini" ? "2" : "1.5";
  return renderTemplate`${maybeRenderHead()}<svg${addAttribute(`modern-icon ${u[v2]} ${p2}`, "class")} xmlns="http://www.w3.org/2000/svg"${addAttribute(e === "solid" ? r2 : "none", "fill")}${addAttribute(L, "viewBox")}${addAttribute(e === "solid" ? "none" : r2, "stroke")}${addAttribute(e === "solid" ? "0" : $, "stroke-width")}${addAttribute(m2 || a, "aria-label")} role="img" data-astro-cid-syatlx4k> <path data-astro-cid-syatlx4k>${unescapeHTML(M)}</path> </svg> `;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/ModernIconSystem.astro", void 0);
const v = createAstro("https://nosytlabs.com"), b = createComponent((e, f2, g2) => {
  const c2 = e.createAstro(v, f2, g2);
  c2.self = b;
  const { currentPath: m2 = "", variant: d2 = "modern", className: $ = "", showMobileMenu: p2 = true, logoVariant: l2 = "full" } = c2.props, n2 = { primary: [{ name: "Services", path: "/services", icon: "web-development", description: "Web development, AI solutions, and digital services" }, { name: "Projects", path: "/projects", icon: "external-link", description: "Portfolio of completed work and case studies" }, { name: "Content", path: "/content-creation", icon: "content-creation", description: "YouTube, streaming, and educational content", badge: "New" }, { name: "Blog", path: "/blog", icon: "star", description: "Latest insights and tutorials" }], secondary: [{ name: "Income", path: "/passive-income", icon: "star", description: "Passive income strategies and resources", badge: "Hot" }, { name: "Mining", path: "/crypto-mining", icon: "crypto-mining", description: "Cryptocurrency mining guides and hardware" }, { name: "3D Print", path: "/3d-printing", icon: "3d-printing", description: "3D printing services and tutorials" }, { name: "Contact", path: "/contact", icon: "external-link", description: "Get in touch with us" }], special: [{ name: "NosytOS95", path: "/nosytos95", icon: "mobile-development", description: "Retro Windows 95 experience", badge: "Retro", isSpecial: true }, { name: "Live", path: "/live", icon: "star", description: "Live streaming on Kick.com", badge: "Live", isLive: true }] }, s2 = (a) => m2 === a || m2.startsWith(a + "/"), x = () => `navigation-unified ${{ modern: "nav-modern", retro: "nav-retro win95-header", minimal: "nav-minimal" }[d2]} ${$}`;
  return renderTemplate`${maybeRenderHead()}<header${addAttribute(x(), "class")} role="banner" data-astro-cid-ifzmrtlx> <div class="nav-container" data-astro-cid-ifzmrtlx> <!-- Logo/Brand Section --> <div class="nav-brand" data-astro-cid-ifzmrtlx> <a href="/" class="brand-link" aria-label="NosytLabs Home" data-astro-cid-ifzmrtlx> ${l2 === "full" && renderTemplate`<div class="brand-full" data-astro-cid-ifzmrtlx> <div class="brand-icon" data-astro-cid-ifzmrtlx>N</div> <div class="brand-text" data-astro-cid-ifzmrtlx> <span class="brand-name" data-astro-cid-ifzmrtlx>NosytLabs</span> <span class="brand-tagline" data-astro-cid-ifzmrtlx>Notable Opportunities</span> </div> </div>`} ${l2 === "icon" && renderTemplate`<div class="brand-icon-only" data-astro-cid-ifzmrtlx>N</div>`} ${l2 === "text" && renderTemplate`<span class="brand-text-only" data-astro-cid-ifzmrtlx>NosytLabs</span>`} </a> </div> <!-- Desktop Navigation --> <nav class="nav-desktop" role="navigation" aria-label="Main navigation" data-astro-cid-ifzmrtlx> ${d2 !== "retro" && renderTemplate`<ul class="nav-list" role="menubar" data-astro-cid-ifzmrtlx> ${n2.primary.map((a) => renderTemplate`<li class="nav-item" role="none" data-astro-cid-ifzmrtlx> <a${addAttribute(a.path, "href")}${addAttribute(`nav-link ${s2(a.path) ? "active" : ""}`, "class")} role="menuitem"${addAttribute(s2(a.path) ? "page" : void 0, "aria-current")}${addAttribute(a.description, "title")} data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: a.icon, size: "sm", className: "nav-icon", "data-astro-cid-ifzmrtlx": true })} <span class="nav-text" data-astro-cid-ifzmrtlx>${a.name}</span> ${a.badge && renderTemplate`<span${addAttribute(`nav-badge badge-${a.badge.toLowerCase()}`, "class")} data-astro-cid-ifzmrtlx>${a.badge}</span>`} </a> </li>`)} </ul>`} ${d2 === "retro" && renderTemplate`<div class="nav-retro-links" data-astro-cid-ifzmrtlx> ${n2.primary.slice(0, 4).map((a) => renderTemplate`<a${addAttribute(a.path, "href")}${addAttribute(`retro-link ${s2(a.path) ? "active" : ""}`, "class")} data-astro-cid-ifzmrtlx> ${a.name} </a>`)} </div>`} </nav> <!-- Mobile Menu Toggle --> ${p2 && renderTemplate`<button class="mobile-toggle" aria-label="Toggle mobile menu" aria-expanded="false" data-mobile-toggle data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: "menu", size: "md", "data-astro-cid-ifzmrtlx": true })} </button>`} <!-- Theme Toggle --> <button class="theme-toggle" aria-label="Toggle dark mode" data-theme-toggle data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: "star", size: "sm", "data-astro-cid-ifzmrtlx": true })} </button> </div> <!-- Mobile Navigation Overlay --> ${p2 && renderTemplate`<div class="mobile-nav-overlay" data-mobile-overlay aria-hidden="true" data-astro-cid-ifzmrtlx> <div class="mobile-nav-panel" data-astro-cid-ifzmrtlx> <!-- Mobile Header --> <div class="mobile-nav-header" data-astro-cid-ifzmrtlx> <div class="mobile-brand" data-astro-cid-ifzmrtlx> <div class="mobile-logo" data-astro-cid-ifzmrtlx>N</div> <span class="mobile-brand-text" data-astro-cid-ifzmrtlx>NosytLabs</span> </div> <button class="mobile-close" aria-label="Close mobile menu" data-mobile-close data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: "close", size: "sm", "data-astro-cid-ifzmrtlx": true })} </button> </div> <!-- Mobile Navigation Content --> <nav class="mobile-nav-content" role="navigation" aria-label="Mobile navigation" data-astro-cid-ifzmrtlx> <!-- Primary Section --> <div class="mobile-nav-section" data-astro-cid-ifzmrtlx> <h3 class="mobile-section-title" data-astro-cid-ifzmrtlx>Main</h3> <ul class="mobile-nav-list" data-astro-cid-ifzmrtlx> ${n2.primary.map((a) => renderTemplate`<li data-astro-cid-ifzmrtlx> <a${addAttribute(a.path, "href")}${addAttribute(`mobile-nav-link ${s2(a.path) ? "active" : ""}`, "class")}${addAttribute(s2(a.path) ? "page" : void 0, "aria-current")} data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: a.icon, size: "sm", className: "mobile-nav-icon", "data-astro-cid-ifzmrtlx": true })} <div class="mobile-nav-content" data-astro-cid-ifzmrtlx> <span class="mobile-nav-text" data-astro-cid-ifzmrtlx>${a.name}</span> <span class="mobile-nav-desc" data-astro-cid-ifzmrtlx>${a.description}</span> </div> ${a.badge && renderTemplate`<span class="mobile-nav-badge" data-astro-cid-ifzmrtlx>${a.badge}</span>`} </a> </li>`)} </ul> </div> <!-- Secondary Section --> <div class="mobile-nav-section" data-astro-cid-ifzmrtlx> <h3 class="mobile-section-title" data-astro-cid-ifzmrtlx>More</h3> <ul class="mobile-nav-list" data-astro-cid-ifzmrtlx> ${n2.secondary.map((a) => renderTemplate`<li data-astro-cid-ifzmrtlx> <a${addAttribute(a.path, "href")}${addAttribute(`mobile-nav-link ${s2(a.path) ? "active" : ""}`, "class")}${addAttribute(s2(a.path) ? "page" : void 0, "aria-current")} data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: a.icon, size: "sm", className: "mobile-nav-icon", "data-astro-cid-ifzmrtlx": true })} <div class="mobile-nav-content" data-astro-cid-ifzmrtlx> <span class="mobile-nav-text" data-astro-cid-ifzmrtlx>${a.name}</span> <span class="mobile-nav-desc" data-astro-cid-ifzmrtlx>${a.description}</span> </div> ${a.badge && renderTemplate`<span class="mobile-nav-badge" data-astro-cid-ifzmrtlx>${a.badge}</span>`} </a> </li>`)} </ul> </div> <!-- Special Section --> <div class="mobile-nav-section" data-astro-cid-ifzmrtlx> <h3 class="mobile-section-title" data-astro-cid-ifzmrtlx>Special</h3> <ul class="mobile-nav-list" data-astro-cid-ifzmrtlx> ${n2.special.map((a) => renderTemplate`<li data-astro-cid-ifzmrtlx> <a${addAttribute(a.path, "href")}${addAttribute(`mobile-nav-link ${s2(a.path) ? "active" : ""} ${a.isSpecial ? "special" : ""} ${a.isLive ? "live" : ""}`, "class")}${addAttribute(s2(a.path) ? "page" : void 0, "aria-current")} data-astro-cid-ifzmrtlx> ${renderComponent(e, "ModernIconSystem", s$1, { name: a.icon, size: "sm", className: "mobile-nav-icon", "data-astro-cid-ifzmrtlx": true })} <div class="mobile-nav-content" data-astro-cid-ifzmrtlx> <span class="mobile-nav-text" data-astro-cid-ifzmrtlx>${a.name}</span> <span class="mobile-nav-desc" data-astro-cid-ifzmrtlx>${a.description}</span> </div> ${a.badge && renderTemplate`<span class="mobile-nav-badge" data-astro-cid-ifzmrtlx>${a.badge}</span>`} </a> </li>`)} </ul> </div> </nav> </div> </div>`} </header>  ${renderScript(e, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/unified/Navigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/unified/Navigation.astro", void 0);
const l = createComponent((o, d2, m2) => {
  const r2 = (/* @__PURE__ */ new Date()).getFullYear(), s2 = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Skills", path: "/skills" }, { name: "Projects", path: "/projects" }, { name: "Content Creation", path: "/content-creation" }, { name: "3D Printing", path: "/3d-printing" }, { name: "Passive Income", path: "/passive-income" }, { name: "NosytOS95", path: "/nosytos95" }, { name: "Contact", path: "/contact" }, { name: "Privacy Policy", path: "/privacy-policy" }, { name: "Terms of Service", path: "/terms-of-service" }], i = [{ name: "YouTube", icon: "youtube", url: "https://www.youtube.com/@TycenYT" }, { name: "Kick", icon: "tv", url: "https://kick.com/Tycen" }, { name: "GitHub", icon: "github", url: "https://github.com/NosytLabs" }];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-900 text-white pt-16 pb-8" data-astro-cid-sz7xmlte> <div class="container mx-auto px-4" data-astro-cid-sz7xmlte> <!-- Footer Top Section --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" data-astro-cid-sz7xmlte> <!-- Company Info --> <div data-astro-cid-sz7xmlte> <div class="flex items-center space-x-2 mb-4" data-astro-cid-sz7xmlte> <img src="/images/nosytlabs-logo-2025.svg" alt="NosytLabs Logo" width="40" height="40" class="w-10 h-10" data-astro-cid-sz7xmlte> <span class="text-xl font-bold text-white" data-astro-cid-sz7xmlte>NosytLabs</span> </div> <p class="text-gray-400 mb-4" data-astro-cid-sz7xmlte>
Notable Opportunities Shape Your Tomorrow
</p> <div class="flex space-x-4" data-astro-cid-sz7xmlte> ${i.map((t2) => renderTemplate`<a${addAttribute(t2.url, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent transition-colors duration-300"${addAttribute(`Follow us on ${t2.name}`, "aria-label")} data-astro-cid-sz7xmlte> <i${addAttribute(`fab fa-${t2.icon} text-xl`, "class")} data-astro-cid-sz7xmlte></i> </a>`)} </div> </div> <!-- Quick Links --> <div data-astro-cid-sz7xmlte> <h3 class="text-lg font-bold mb-4 text-white" data-astro-cid-sz7xmlte>Quick Links</h3> <ul class="space-y-2" data-astro-cid-sz7xmlte> ${s2.slice(0, 5).map((t2) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(t2.path, "href")} class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte> ${t2.name} </a> </li>`)} </ul> </div> <!-- Services --> <div data-astro-cid-sz7xmlte> <h3 class="text-lg font-bold mb-4 text-white" data-astro-cid-sz7xmlte>Services</h3> <ul class="space-y-2" data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte> <a href="/services#web-development" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
Web Development
</a> </li> <li data-astro-cid-sz7xmlte> <a href="/content-creation" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
Content Creation
</a> </li> <li data-astro-cid-sz7xmlte> <a href="/3d-printing" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
3D Printing Services
</a> </li> <li data-astro-cid-sz7xmlte> <a href="/passive-income" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
Passive Income Resources
</a> </li> <li data-astro-cid-sz7xmlte> <a href="/services#seo" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
SEO & Website Audits
</a> </li> </ul> </div> <!-- Contact Info --> <div data-astro-cid-sz7xmlte> <h3 class="text-lg font-bold mb-4 text-white" data-astro-cid-sz7xmlte>Contact Us</h3> <ul class="space-y-2" data-astro-cid-sz7xmlte> <li class="flex items-start space-x-2" data-astro-cid-sz7xmlte> <i class="fas fa-envelope text-accent mt-1" data-astro-cid-sz7xmlte></i> <a href="mailto:contact@nosytlabs.com" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
contact@nosytlabs.com
</a> </li> <li class="flex items-start space-x-2" data-astro-cid-sz7xmlte> <i class="fas fa-map-marker-alt text-accent mt-1" data-astro-cid-sz7xmlte></i> <span class="text-gray-400" data-astro-cid-sz7xmlte>
United States
</span> </li> <li class="mt-4" data-astro-cid-sz7xmlte> <a href="/contact" class="inline-block bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-md transition-colors duration-300" data-astro-cid-sz7xmlte>
Contact Us
</a> </li> </ul> </div> </div> <!-- Divider --> <div class="border-t border-gray-800 my-8" data-astro-cid-sz7xmlte></div> <!-- Footer Bottom Section --> <div class="flex flex-col md:flex-row justify-between items-center" data-astro-cid-sz7xmlte> <div class="text-gray-500 text-sm mb-4 md:mb-0" data-astro-cid-sz7xmlte>
&copy; ${r2} NosytLabs. All rights reserved.
</div> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-sz7xmlte> ${s2.slice(6).map((t2) => renderTemplate`<a${addAttribute(t2.path, "href")} class="text-gray-500 hover:text-accent text-sm transition-colors duration-300" data-astro-cid-sz7xmlte> ${t2.name} </a>`)} </div> </div> </div> </footer> `;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/Footer.astro", void 0);
const n$1 = createComponent((e, a, o) => renderTemplate`${renderScript(e, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/VercelAnalytics.astro?astro&type=script&index=0&lang.ts")}`, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/VercelAnalytics.astro", void 0);
const n = createAstro("https://nosytlabs.com"), c$2 = createComponent((a, o, r2) => {
  const t2 = a.createAstro(n, o, r2);
  t2.self = c$2;
  const { skipLinks: l2 = [{ href: "#main-content", text: "Skip to main content" }, { href: "#navigation", text: "Skip to navigation" }, { href: "#footer", text: "Skip to footer" }], enableAccessibilityTools: d2 = true, enableHighContrast: p2 = true, enableFocusIndicators: b2 = true, className: g2 = "" } = t2.props;
  return renderTemplate`<!-- Accessibility Enhancement Container -->${maybeRenderHead()}<div${addAttribute(`accessibility-enhancer ${g2}`, "class")} role="complementary" aria-label="Accessibility tools" data-astro-cid-nqgwspnh> <!-- Skip Links --> <div class="skip-links" role="navigation" aria-label="Skip links" data-astro-cid-nqgwspnh> ${l2.map((i) => renderTemplate`<a${addAttribute(i.href, "href")} class="skip-link" data-astro-cid-nqgwspnh> ${i.text} </a>`)} </div> <!-- Accessibility Toolbar --> ${d2 && renderTemplate`<div class="accessibility-toolbar" role="toolbar" aria-label="Accessibility options" data-astro-cid-nqgwspnh> <button class="accessibility-toggle" aria-label="Open accessibility options" aria-expanded="false" aria-controls="accessibility-panel" data-accessibility-toggle data-astro-cid-nqgwspnh> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-astro-cid-nqgwspnh> <circle cx="12" cy="12" r="3" data-astro-cid-nqgwspnh></circle> <path d="M12 1v6m0 6v6" data-astro-cid-nqgwspnh></path> <path d="m21 12-6-3-6 3-6-3" data-astro-cid-nqgwspnh></path> </svg> <span class="sr-only" data-astro-cid-nqgwspnh>Accessibility Options</span> </button> <div class="accessibility-panel" id="accessibility-panel" role="dialog" aria-labelledby="accessibility-panel-title" aria-hidden="true" data-accessibility-panel data-astro-cid-nqgwspnh> <div class="accessibility-panel-header" data-astro-cid-nqgwspnh> <h2 id="accessibility-panel-title" class="accessibility-panel-title" data-astro-cid-nqgwspnh>
Accessibility Options
</h2> <button class="accessibility-panel-close" aria-label="Close accessibility options" data-accessibility-close data-astro-cid-nqgwspnh> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-astro-cid-nqgwspnh> <line x1="18" y1="6" x2="6" y2="18" data-astro-cid-nqgwspnh></line> <line x1="6" y1="6" x2="18" y2="18" data-astro-cid-nqgwspnh></line> </svg> </button> </div> <div class="accessibility-panel-content" data-astro-cid-nqgwspnh> <!-- Font Size Controls --> <div class="accessibility-group" data-astro-cid-nqgwspnh> <h3 class="accessibility-group-title" data-astro-cid-nqgwspnh>Text Size</h3> <div class="accessibility-controls" role="group" aria-labelledby="font-size-controls" data-astro-cid-nqgwspnh> <button class="accessibility-control" aria-label="Decrease text size" data-font-size="decrease" data-astro-cid-nqgwspnh>
A-
</button> <button class="accessibility-control" aria-label="Reset text size" data-font-size="reset" data-astro-cid-nqgwspnh>
A
</button> <button class="accessibility-control" aria-label="Increase text size" data-font-size="increase" data-astro-cid-nqgwspnh>
A+
</button> </div> </div> <!-- Contrast Controls --> ${p2 && renderTemplate`<div class="accessibility-group" data-astro-cid-nqgwspnh> <h3 class="accessibility-group-title" data-astro-cid-nqgwspnh>Contrast</h3> <div class="accessibility-controls" data-astro-cid-nqgwspnh> <button class="accessibility-control accessibility-toggle-btn" aria-label="Toggle high contrast mode" aria-pressed="false" data-high-contrast data-astro-cid-nqgwspnh>
High Contrast
</button> </div> </div>`} <!-- Focus Indicators --> ${b2 && renderTemplate`<div class="accessibility-group" data-astro-cid-nqgwspnh> <h3 class="accessibility-group-title" data-astro-cid-nqgwspnh>Navigation</h3> <div class="accessibility-controls" data-astro-cid-nqgwspnh> <button class="accessibility-control accessibility-toggle-btn" aria-label="Toggle enhanced focus indicators" aria-pressed="false" data-focus-indicators data-astro-cid-nqgwspnh>
Enhanced Focus
</button> </div> </div>`} <!-- Motion Controls --> <div class="accessibility-group" data-astro-cid-nqgwspnh> <h3 class="accessibility-group-title" data-astro-cid-nqgwspnh>Motion</h3> <div class="accessibility-controls" data-astro-cid-nqgwspnh> <button class="accessibility-control accessibility-toggle-btn" aria-label="Toggle reduced motion" aria-pressed="false" data-reduced-motion data-astro-cid-nqgwspnh>
Reduce Motion
</button> </div> </div> <!-- Reading Mode --> <div class="accessibility-group" data-astro-cid-nqgwspnh> <h3 class="accessibility-group-title" data-astro-cid-nqgwspnh>Reading</h3> <div class="accessibility-controls" data-astro-cid-nqgwspnh> <button class="accessibility-control accessibility-toggle-btn" aria-label="Toggle reading mode" aria-pressed="false" data-reading-mode data-astro-cid-nqgwspnh>
Reading Mode
</button> </div> </div> <!-- Reset All --> <div class="accessibility-group" data-astro-cid-nqgwspnh> <button class="accessibility-control accessibility-reset" aria-label="Reset all accessibility settings" data-reset-accessibility data-astro-cid-nqgwspnh>
Reset All Settings
</button> </div> </div> </div> </div>`} <!-- Screen Reader Announcements --> <div class="sr-announcements" aria-live="polite" aria-atomic="true" id="sr-announcements" data-astro-cid-nqgwspnh></div> <!-- Focus Trap for Modals --> <div class="focus-trap-boundary" data-focus-trap data-astro-cid-nqgwspnh></div> </div>  ${renderScript(a, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/accessibility/AccessibilityEnhancer.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/accessibility/AccessibilityEnhancer.astro", void 0);
const c$1 = createAstro("https://nosytlabs.com"), d = createComponent((a, o, r2) => {
  const s2 = a.createAstro(c$1, o, r2);
  s2.self = d;
  const { enableKeyboardShortcuts: i = true, enableVirtualCursor: e = true, className: n2 = "" } = s2.props;
  return renderTemplate`<!-- Keyboard Navigation Enhancement Container -->${maybeRenderHead()}<div${addAttribute(`keyboard-navigation ${n2}`, "class")} data-keyboard-nav data-astro-cid-mqc2nzh7> <!-- Focus Management --> <div class="focus-manager" data-focus-manager data-astro-cid-mqc2nzh7> <!-- Focus Indicator --> <div class="focus-indicator" data-focus-indicator aria-hidden="true" data-astro-cid-mqc2nzh7></div> <!-- Focus Trap Boundaries --> <div class="focus-trap-start" tabindex="0" data-focus-trap-start aria-hidden="true" data-astro-cid-mqc2nzh7></div> <div class="focus-trap-end" tabindex="0" data-focus-trap-end aria-hidden="true" data-astro-cid-mqc2nzh7></div> </div> <!-- Keyboard Shortcuts Help --> ${i && renderTemplate`<div class="keyboard-shortcuts-help" data-shortcuts-help role="dialog" aria-labelledby="shortcuts-title" aria-hidden="true" data-astro-cid-mqc2nzh7> <div class="shortcuts-overlay" data-shortcuts-overlay data-astro-cid-mqc2nzh7></div> <div class="shortcuts-panel" data-astro-cid-mqc2nzh7> <div class="shortcuts-header" data-astro-cid-mqc2nzh7> <h2 id="shortcuts-title" class="shortcuts-title" data-astro-cid-mqc2nzh7>Keyboard Shortcuts</h2> <button class="shortcuts-close" data-shortcuts-close aria-label="Close keyboard shortcuts" data-astro-cid-mqc2nzh7> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-mqc2nzh7> <line x1="18" y1="6" x2="6" y2="18" data-astro-cid-mqc2nzh7></line> <line x1="6" y1="6" x2="18" y2="18" data-astro-cid-mqc2nzh7></line> </svg> </button> </div> <div class="shortcuts-content" data-astro-cid-mqc2nzh7> <div class="shortcuts-section" data-astro-cid-mqc2nzh7> <h3 class="shortcuts-section-title" data-astro-cid-mqc2nzh7>Navigation</h3> <div class="shortcuts-list" data-astro-cid-mqc2nzh7> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Tab</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Navigate forward</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Shift + Tab</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Navigate backward</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Arrow Keys</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Spatial navigation</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Home</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Go to top of page</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>End</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Go to bottom of page</span> </div> </div> </div> <div class="shortcuts-section" data-astro-cid-mqc2nzh7> <h3 class="shortcuts-section-title" data-astro-cid-mqc2nzh7>Actions</h3> <div class="shortcuts-list" data-astro-cid-mqc2nzh7> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Enter</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Activate element</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Space</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Toggle/Select</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Escape</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Close modal/menu</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Ctrl + /</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Show this help</span> </div> </div> </div> <div class="shortcuts-section" data-astro-cid-mqc2nzh7> <h3 class="shortcuts-section-title" data-astro-cid-mqc2nzh7>Accessibility</h3> <div class="shortcuts-list" data-astro-cid-mqc2nzh7> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Alt + A</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Open accessibility options</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Alt + H</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Go to main heading</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Alt + M</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Go to main content</span> </div> <div class="shortcut-item" data-astro-cid-mqc2nzh7> <kbd class="shortcut-key" data-astro-cid-mqc2nzh7>Alt + N</kbd> <span class="shortcut-description" data-astro-cid-mqc2nzh7>Go to navigation</span> </div> </div> </div> </div> </div> </div>`} <!-- Virtual Cursor --> ${e && renderTemplate`<div class="virtual-cursor" data-virtual-cursor aria-hidden="true" data-astro-cid-mqc2nzh7> <div class="cursor-highlight" data-astro-cid-mqc2nzh7></div> <div class="cursor-info" data-cursor-info data-astro-cid-mqc2nzh7></div> </div>`} <!-- Screen Reader Announcements --> <div class="sr-announcements" aria-live="polite" aria-atomic="true" data-nav-announcements data-astro-cid-mqc2nzh7></div> </div>  ${renderScript(a, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/accessibility/KeyboardNavigation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/accessibility/KeyboardNavigation.astro", void 0);
const r$1 = createAstro("https://nosytlabs.com"), s = createComponent((t2, o, i) => {
  const e = t2.createAstro(r$1, o, i);
  e.self = s;
  const { enableLoadingStates: d2 = true, enableProgressIndicators: n2 = true, enableInteractiveFeedback: c2 = true, className: l2 = "" } = e.props;
  return renderTemplate`<!-- Micro-Animations Container -->${maybeRenderHead()}<div${addAttribute(`micro-animations ${l2}`, "class")} data-astro-cid-bmwrftru> <!-- Loading States --> ${d2 && renderTemplate`<div class="loading-states" data-astro-cid-bmwrftru> <!-- Skeleton Loader --> <div class="skeleton-loader" data-skeleton data-astro-cid-bmwrftru> <div class="skeleton-line skeleton-title" data-astro-cid-bmwrftru></div> <div class="skeleton-line skeleton-text" data-astro-cid-bmwrftru></div> <div class="skeleton-line skeleton-text short" data-astro-cid-bmwrftru></div> </div> <!-- Pulse Loader --> <div class="pulse-loader" data-pulse-loader data-astro-cid-bmwrftru> <div class="pulse-dot" data-astro-cid-bmwrftru></div> <div class="pulse-dot" data-astro-cid-bmwrftru></div> <div class="pulse-dot" data-astro-cid-bmwrftru></div> </div> <!-- Spinner Loader --> <div class="spinner-loader" data-spinner-loader data-astro-cid-bmwrftru> <div class="spinner" data-astro-cid-bmwrftru></div> </div> <!-- Progress Bar --> <div class="progress-bar" data-progress-bar data-astro-cid-bmwrftru> <div class="progress-fill" data-progress-fill data-astro-cid-bmwrftru></div> </div> </div>`} <!-- Interactive Feedback Elements --> ${c2 && renderTemplate`<div class="interactive-feedback" data-astro-cid-bmwrftru> <!-- Ripple Effect Container --> <div class="ripple-container" data-ripple-container data-astro-cid-bmwrftru></div> <!-- Toast Notifications --> <div class="toast-container" data-toast-container role="region" aria-label="Notifications" data-astro-cid-bmwrftru></div> <!-- Floating Action Button --> <button class="fab" data-fab aria-label="Floating action" data-astro-cid-bmwrftru> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-bmwrftru> <line x1="12" y1="5" x2="12" y2="19" data-astro-cid-bmwrftru></line> <line x1="5" y1="12" x2="19" y2="12" data-astro-cid-bmwrftru></line> </svg> </button> </div>`} <!-- Scroll Progress Indicator --> ${n2 && renderTemplate`<div class="scroll-progress" data-scroll-progress data-astro-cid-bmwrftru> <div class="scroll-progress-bar" data-scroll-progress-bar data-astro-cid-bmwrftru></div> </div>`} </div>  ${renderScript(t2, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/interactive/MicroAnimations.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/interactive/MicroAnimations.astro", void 0);
const t = createAstro("https://nosytlabs.com"), r = createComponent((a, s2, i) => {
  const e = a.createAstro(t, s2, i);
  e.self = r;
  const { className: o = "" } = e.props;
  return renderTemplate`<!-- Enhanced Form Validation Container -->${maybeRenderHead()}<div${addAttribute(`form-validation-enhancer ${o}`, "class")} data-form-enhancer data-astro-cid-5kzqeytb> <!-- Form Validation Styles and Indicators --> <div class="validation-indicators" aria-live="polite" aria-atomic="true" data-astro-cid-5kzqeytb> <!-- Success Indicator --> <div class="validation-success" data-validation-success role="status" aria-hidden="true" data-astro-cid-5kzqeytb> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-astro-cid-5kzqeytb> <polyline points="20,6 9,17 4,12" data-astro-cid-5kzqeytb></polyline> </svg> <span class="validation-message" data-astro-cid-5kzqeytb>Field is valid</span> </div> <!-- Error Indicator --> <div class="validation-error" data-validation-error role="alert" aria-hidden="true" data-astro-cid-5kzqeytb> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-astro-cid-5kzqeytb> <circle cx="12" cy="12" r="10" data-astro-cid-5kzqeytb></circle> <line x1="15" y1="9" x2="9" y2="15" data-astro-cid-5kzqeytb></line> <line x1="9" y1="9" x2="15" y2="15" data-astro-cid-5kzqeytb></line> </svg> <span class="validation-message" data-astro-cid-5kzqeytb>Please correct this field</span> </div> <!-- Loading Indicator --> <div class="validation-loading" data-validation-loading aria-hidden="true" data-astro-cid-5kzqeytb> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" data-astro-cid-5kzqeytb> <path d="M21 12a9 9 0 11-6.219-8.56" data-astro-cid-5kzqeytb></path> </svg> <span class="validation-message" data-astro-cid-5kzqeytb>Validating...</span> </div> </div> <!-- Form Progress Indicator --> <div class="form-progress" data-form-progress role="progressbar" aria-label="Form completion progress" data-astro-cid-5kzqeytb> <div class="form-progress-bar" data-form-progress-bar data-astro-cid-5kzqeytb></div> <span class="form-progress-text" data-form-progress-text data-astro-cid-5kzqeytb>0% Complete</span> </div> <!-- Accessibility Announcements --> <div class="sr-announcements" aria-live="assertive" aria-atomic="true" data-form-announcements data-astro-cid-5kzqeytb></div> </div>  ${renderScript(a, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/forms/EnhancedFormValidation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/components/forms/EnhancedFormValidation.astro", void 0);
const seoConfig = {
  site: {
    name: "NosytLabs",
    description: "Innovative digital solutions including web development, AI integration, content creation, 3D printing services, and passive income strategies. Transform your business with cutting-edge technology.",
    url: "https://nosytlabs.com",
    logo: "https://nosytlabs.com/images/nosytlabs-logo-2025.svg",
    ogImage: "https://nosytlabs.com/images/nosytlabs-og.svg"
  },
  social: {
    youtube: "@TycenYT",
    github: "https://github.com/NosytLabs",
    kick: "https://kick.com/Tycen",
    creality: "https://crealitycloud.com/user/9519489699"
  },
  pages: {
    home: {
      title: "NosytLabs - Notable Opportunities Shape Your Tomorrow",
      description: "Transform your business with innovative digital solutions. Expert web development, AI integration, content creation, 3D printing services, and passive income education. Free consultations available.",
      keywords: "web development, AI solutions, content creation, 3D printing, passive income, digital transformation, technology consulting, custom software"
    },
    services: {
      title: "Professional Digital Services & Solutions | NosytLabs",
      description: "Comprehensive digital services including custom web development with React & Astro, AI integration solutions, content creation for YouTube & streaming, and 3D printing services. Get expert consultation.",
      keywords: "web development services, AI integration, content creation, digital consulting, custom software development, React development, Astro framework, YouTube content"
    },
    projects: {
      title: "Portfolio & Case Studies | NosytLabs Projects",
      description: "Explore our portfolio of innovative projects including NosytLabs website, crypto mining calculator, Kick.com MCP integration, and NosytOS95. Real-world solutions with modern technologies.",
      keywords: "portfolio, case studies, web development projects, crypto mining tools, streaming integration, retro computing, JavaScript projects"
    },
    "content-creation": {
      title: "Content Creation Services | YouTube & Digital Marketing | NosytLabs",
      description: "Professional content creation services for YouTube, social media, and digital marketing. From video production to channel optimization, we help you grow your online presence.",
      keywords: "content creation, YouTube services, video production, digital marketing, social media management, channel optimization"
    },
    "3d-printing": {
      title: "3D Printing Services & Solutions | NosytLabs",
      description: "Professional 3D printing services including prototyping, custom manufacturing, and design consultation. From concept to creation with cutting-edge 3D printing technology.",
      keywords: "3D printing services, prototyping, custom manufacturing, 3D design, additive manufacturing, rapid prototyping"
    },
    "passive-income": {
      title: "Passive Income Strategies & Resources | NosytLabs",
      description: "Discover proven passive income strategies including crypto mining, affiliate marketing, and digital product creation. Build sustainable income streams with our expert guidance.",
      keywords: "passive income, crypto mining, affiliate marketing, digital products, income streams, financial freedom"
    },
    "crypto-mining": {
      title: "Crypto Mining Solutions & Hardware Reviews | NosytLabs",
      description: "Expert crypto mining solutions, hardware reviews, and profitability analysis. Get the latest insights on mining rigs, pools, and optimization strategies.",
      keywords: "crypto mining, mining hardware, mining rigs, cryptocurrency, blockchain, mining profitability"
    },
    nosytos95: {
      title: "NosytOS95 - Retro Computing Experience | NosytLabs",
      description: "Experience the nostalgia of Windows 95 with NosytOS95, a fully functional retro computing environment built with modern web technologies.",
      keywords: "NosytOS95, Windows 95, retro computing, vintage OS, web-based operating system, nostalgia"
    },
    about: {
      title: "About NosytLabs - Our Story & Mission | Technology Innovation",
      description: "Learn about NosytLabs mission to create notable opportunities that shape your tomorrow. Founded in 2025, we specialize in web development, content creation, and innovative technology solutions.",
      keywords: "about NosytLabs, company mission, technology innovation, web development team, content creation experts, startup story"
    },
    contact: {
      title: "Contact NosytLabs - Get Your Free Consultation Today",
      description: "Ready to transform your digital presence? Contact NosytLabs for expert web development, content creation, and technology consulting. Free consultations available. Email: contact@nosytlabs.com",
      keywords: "contact NosytLabs, free consultation, web development quote, technology consulting, digital solutions, project inquiry"
    },
    blog: {
      title: "NosytLabs Blog - Technology Insights & Tutorials",
      description: "Stay updated with the latest in web development, AI tools, crypto mining, and 3D printing. Expert insights, tutorials, and industry analysis from the NosytLabs team.",
      keywords: "technology blog, web development tutorials, AI tools, crypto mining guides, 3D printing tips, programming insights"
    },
    "passive-income": {
      title: "Passive Income Strategies & Resources | NosytLabs Education",
      description: "Learn about legitimate passive income opportunities including bandwidth sharing, content creation, and digital investments. Honest reviews and realistic earning expectations.",
      keywords: "passive income, bandwidth sharing, HoneyGain, EarnApp, content creation income, digital investments, online earning"
    },
    "3d-printing": {
      title: "3D Printing Services | Custom Prototypes & Models | NosytLabs",
      description: "Professional 3D printing services using Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin). Custom prototypes, functional parts, and detailed models.",
      keywords: "3D printing services, custom prototypes, FDM printing, resin printing, Creality Ender 3, Elegoo Saturn 2, product development"
    }
  }
};
function generateMetaTags(pageKey, customData = {}) {
  const pageConfig = seoConfig.pages[pageKey] || seoConfig.pages.home;
  const config = { ...pageConfig, ...customData };
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    ogTitle: config.ogTitle || config.title,
    ogDescription: config.ogDescription || config.description,
    ogImage: config.ogImage || seoConfig.site.ogImage,
    ogType: config.ogType || "website",
    twitterTitle: config.twitterTitle || config.title,
    twitterDescription: config.twitterDescription || config.description,
    twitterImage: config.twitterImage || config.ogImage || seoConfig.site.ogImage,
    canonical: config.canonical || `${seoConfig.site.url}${pageKey === "home" ? "" : `/${pageKey}`}`
  };
}
function generateStructuredData(type, data = {}) {
  var _a;
  const baseData = {
    "@context": "https://schema.org",
    "@type": type
  };
  switch (type) {
    case "Organization":
      return {
        ...baseData,
        name: seoConfig.site.name,
        url: seoConfig.site.url,
        logo: seoConfig.site.logo,
        description: seoConfig.site.description,
        sameAs: Object.values(seoConfig.social),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "contact@nosytlabs.com",
          availableLanguage: "English"
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
          addressRegion: "Digital"
        },
        ...data
      };
    case "WebSite":
      return {
        ...baseData,
        name: seoConfig.site.name,
        url: seoConfig.site.url,
        description: seoConfig.site.description,
        publisher: {
          "@type": "Organization",
          name: seoConfig.site.name
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${seoConfig.site.url}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        },
        ...data
      };
    case "Service":
      return {
        ...baseData,
        name: data.name || "Digital Solutions",
        description: data.description || "Comprehensive digital services",
        provider: {
          "@type": "Organization",
          name: seoConfig.site.name,
          url: seoConfig.site.url
        },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Web Development",
                description: "Custom web development solutions"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "AI Integration",
                description: "AI-powered business solutions"
              }
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Content Creation",
                description: "Professional content creation services"
              }
            }
          ]
        },
        ...data
      };
    case "Article":
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Organization",
          name: seoConfig.site.name
        },
        publisher: {
          "@type": "Organization",
          name: seoConfig.site.name,
          logo: {
            "@type": "ImageObject",
            url: seoConfig.site.logo
          }
        },
        datePublished: data.datePublished || (/* @__PURE__ */ new Date()).toISOString(),
        dateModified: data.dateModified || (/* @__PURE__ */ new Date()).toISOString(),
        image: data.image || seoConfig.site.ogImage,
        ...data
      };
    case "FAQPage":
      return {
        ...baseData,
        mainEntity: ((_a = data.questions) == null ? void 0 : _a.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer
          }
        }))) || [],
        ...data
      };
    case "Service":
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        provider: {
          "@type": "Organization",
          name: seoConfig.site.name,
          url: seoConfig.site.url
        },
        serviceType: data.serviceType || "Technology Consulting",
        areaServed: data.areaServed || "Worldwide",
        ...data
      };
    case "VideoObject":
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
          "@type": "Person",
          name: data.channel || "TycenYT"
        },
        publisher: {
          "@type": "Organization",
          name: seoConfig.site.name
        },
        ...data
      };
    default:
      return { ...baseData, ...data };
  }
}
var p = Object.freeze, T = Object.defineProperty;
var c = (e, i) => p(T(e, "raw", { value: p(e.slice()) }));
var g, f;
const m = createAstro("https://nosytlabs.com"), h = createComponent((e, i, l$1) => {
  const n2 = e.createAstro(m, i, l$1);
  n2.self = h;
  const { title: y, description: u, ogImage: b$1, isNosytOS95: a = false, pageKey: k = "home", keywords: v2, ogType: w = "website", structuredDataType: S = "Organization", structuredData: $ = {} } = n2.props, t2 = generateMetaTags(k, { title: y, description: u, ogImage: b$1, keywords: v2, ogType: w }), x = generateStructuredData(S, $);
  `page-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(f || (f = c(['<html lang="en" data-astro-cid-37fxchfa> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><meta name="author" content="NosytLabs"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow"><meta name="bingbot" content="index, follow"><!-- Enhanced Keywords --><meta name="keywords"', '><!-- Additional SEO Meta Tags --><meta name="language" content="en"><meta name="revisit-after" content="7 days"><meta name="distribution" content="global"><meta name="rating" content="general"><meta name="referrer" content="origin-when-cross-origin"><!-- Modern Favicons - Enhanced 2025 Design --><link rel="icon" type="image/svg+xml" href="/images/favicon-modern.svg"><link rel="shortcut icon" href="/favicon.ico"><!-- Standard Favicons --><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"><!-- Apple Touch Icon --><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><!-- Web Manifest --><link rel="manifest" href="/manifest.json"><!-- Preload critical modern assets --><link rel="preload" as="image" href="/images/nosytlabs-logo-modern.svg" type="image/svg+xml"><link rel="preload" as="image" href="/images/hero-background-optimized.webp" type="image/webp"><!-- Theme Colors --><meta name="theme-color" content="#4C1D95"><meta name="msapplication-TileColor" content="#4C1D95"><!-- Enhanced Open Graph / Social Media --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/svg+xml"><meta property="og:site_name" content="NosytLabs"><meta property="og:locale" content="en_US"><!-- Enhanced Twitter Cards --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:image:alt" content="NosytLabs - Notable Opportunities Shape Your Tomorrow"><!-- Canonical URL --><link rel="canonical"', '><!-- Enhanced Structured Data --><script type="application/ld+json">', `<\/script><!-- Additional Structured Data for WebSite --><script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "NosytLabs",
      "url": "https://nosytlabs.com",
      "description": "Notable Opportunities Shape Your Tomorrow - Innovative digital solutions including web development, AI integration, content creation, and 3D printing services.",
      "publisher": {
        "@type": "Organization",
        "name": "NosytLabs",
        "logo": "https://nosytlabs.com/images/nosytlabs-logo-2025.svg"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://nosytlabs.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  <\/script><!-- Critical CSS - Inline for fastest rendering --><!-- Resource hints for critical resources --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin><link rel="dns-prefetch" href="https://vercel.live"><link rel="dns-prefetch" href="https://vitals.vercel-analytics.com"><!-- Preload critical resources with high priority --><link rel="preload" href="/images/nosytlabs-logo-2025.svg" as="image" fetchpriority="high"><link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin="anonymous"><link rel="preload" href="/styles/critical.css" as="style"><link rel="preload" href="/scripts/core/main.js" as="script"><!-- DNS prefetch for external resources --><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"><!-- Fonts with optimized loading --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">`, '<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript><!-- Font Awesome --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><!-- Global styles --><link rel="stylesheet" href="/styles/global.css"><!-- Enhanced Design System 2025 - Consolidated & Optimized --><link rel="stylesheet" href="/src/styles/design-system-2025.css"><link rel="stylesheet" href="/src/styles/layout-system-2025.css"><link rel="stylesheet" href="/src/styles/typography-2025.css"><link rel="stylesheet" href="/src/styles/responsive-enhancements-2025.css"><link rel="stylesheet" href="/src/styles/consolidated-styles.css"><!-- Performance & Cache Management --><script type="module" src="/src/utils/cache-manager-2025.js"><\/script><script type="module" src="/src/utils/performance-monitor-2025.js"><\/script><!-- NosytOS95 specific styles - only loaded on the NosytOS95 page -->', '<!-- Core functionality - high priority --><script src="/scripts/core/main.js" defer fetchpriority="high"><\/script><!-- Enhanced lazy loading for performance --><script src="/scripts/performance/enhanced-lazy-loading.js" defer><\/script><!-- Enhanced accessibility features --><script src="/scripts/accessibility/enhanced-a11y.js" defer><\/script><!-- Modern animations system --><script src="/src/scripts/modern-animations.js" defer><\/script><!-- Mobile interactions system --><script src="/src/scripts/mobile-interactions.js" defer><\/script><!-- NosytOS95 specific scripts are now loaded directly in the nosytos95.astro page -->', `<!-- Performance Optimization Script --><script type="module">
    // Initialize performance optimizer
    import { performanceOptimizer } from '/src/utils/performance-optimizer.ts';

    // Initialize all performance optimizations
    performanceOptimizer.initialize();

    // Monitor performance metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = performanceOptimizer.getMetrics();
        const targets = performanceOptimizer.checkPerformanceTargets();

        if (!targets.passed) {
          console.warn('Performance targets not met:', targets.issues);
        }
      }, 1000);
    });
  <\/script><!-- Service Worker Registration -->`, "", "</head> <body data-astro-cid-37fxchfa> <!-- Enhanced Accessibility Features --> ", " <!-- Advanced Keyboard Navigation --> ", " <!-- Interactive Micro-Animations --> ", " <!-- Enhanced Form Validation --> ", ' <a href="#main-content" class="skip-nav" data-astro-cid-37fxchfa>Skip to main content</a> <!-- Skip to main content link for accessibility --> <a href="#main-content" class="skip-link" data-astro-cid-37fxchfa>Skip to main content</a> <!-- Header - Only show modern header on non-NosytOS95 pages --> ', ' <!-- Main Content --> <main id="main-content" class="min-h-screen relative" data-astro-cid-37fxchfa> ', ' <!-- Main Content --> <div class="relative z-10" data-astro-cid-37fxchfa> ', " </div> </main> <!-- Footer - Only show modern footer on non-NosytOS95 pages --> ", " <!-- Back to top button --> ", ` <!-- Theme toggle script --> <script>
    // Check for saved theme preference or use system preference
    const getThemePreference = () => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply theme
    const theme = getThemePreference();
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Store theme preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  <\/script> <!-- Back to top button script --> `, " <!-- Vercel Analytics --> ", " </body></html>"])), t2.title, addAttribute(t2.description, "content"), addAttribute(t2.keywords, "content"), addAttribute(t2.ogType, "content"), addAttribute(n2.url, "content"), addAttribute(t2.ogTitle, "content"), addAttribute(t2.ogDescription, "content"), addAttribute(t2.ogImage, "content"), addAttribute(t2.twitterTitle, "content"), addAttribute(t2.twitterDescription, "content"), addAttribute(t2.twitterImage, "content"), addAttribute(t2.canonical, "href"), unescapeHTML(JSON.stringify(x)), maybeRenderHead(), a && renderTemplate`${renderComponent(e, "Fragment", Fragment, { "data-astro-cid-37fxchfa": true }, { default: (K) => renderTemplate`<link rel="stylesheet" href="/styles/win95-authentic.css"><link rel="stylesheet" href="/styles/ms-sans-serif.css"><link rel="stylesheet" href="/styles/nosyt-window-manager.css"><link rel="stylesheet" href="/styles/nosyt-bsod.css"><link rel="stylesheet" href="/styles/nosyt-ai.css"><link rel="stylesheet" href="/styles/nosyt-file-explorer.css">` })}`, a && renderTemplate(g || (g = c([`<script>
      // NosytOS95 scripts are loaded inline to avoid import errors
      console.log('NosytOS95 scripts loaded');
    <\/script>`]))), renderScript(e, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent(e, "AccessibilityEnhancer", c$2, { enableAccessibilityTools: true, enableHighContrast: true, enableFocusIndicators: true, "data-astro-cid-37fxchfa": true }), renderComponent(e, "KeyboardNavigation", d, { enableFocusTrapping: true, enableKeyboardShortcuts: true, enableSpatialNavigation: true, enableVirtualCursor: true, "data-astro-cid-37fxchfa": true }), renderComponent(e, "MicroAnimations", s, { enableHoverEffects: true, enableLoadingStates: true, enableProgressIndicators: true, enableInteractiveFeedback: true, "data-astro-cid-37fxchfa": true }), renderComponent(e, "EnhancedFormValidation", r, { enableRealTimeValidation: true, enableAccessibilityFeatures: true, enableProgressiveEnhancement: true, "data-astro-cid-37fxchfa": true }), !a && renderTemplate`${renderComponent(e, "Navigation", b, { currentPath: n2.url.pathname, variant: a ? "retro" : "modern", isRetroMode: a, "data-astro-cid-37fxchfa": true })}`, !a && renderTemplate`<div id="particle-background" class="particle-background absolute inset-0 pointer-events-none z-0" data-color="rgba(76, 29, 149, 0.2)" data-secondary-color="rgba(255, 107, 0, 0.2)" data-particle-count="100" data-particle-size="3" data-particle-speed="1" data-interactive="true" data-connect-particles="true" data-gradient="true" data-astro-cid-37fxchfa></div>`, renderSlot(e, l$1.default), !a && renderTemplate`${renderComponent(e, "Footer", l, { "data-astro-cid-37fxchfa": true })}`, !a && renderTemplate`<button id="back-to-top" class="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 invisible z-50" aria-label="Back to top" data-astro-cid-37fxchfa> <i class="fas fa-arrow-up" data-astro-cid-37fxchfa></i> </button>`, renderScript(e, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts"), renderComponent(e, "VercelAnalytics", n$1, { "data-astro-cid-37fxchfa": true }));
}, "C:/Users/Tyson/Desktop/Development Tools/nosytlabs-github-ready/src/layouts/BaseLayout.astro", void 0);
export {
  h,
  s$1 as s
};
