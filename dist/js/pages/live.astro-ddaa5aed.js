import { a as createComponent, r as renderTemplate, m as maybeRenderHead, c as createAstro, b as addAttribute, u as unescapeHTML, d as renderComponent } from "../vendor-027e926a.js";
import "clsx";
import { $ as $$BaseLayout } from "../../renderers.mjs";
/* empty css                */const $$StreamSchedule = createComponent(($$result, $$props, $$slots) => {
  const scheduleItems = [
    {
      day: "Check Kick.com/Tycen",
      time: "For current stream status",
      title: "AI Development & Coding",
      icon: "💻"
    },
    {
      day: "Follow on social media",
      time: "For stream announcements",
      title: "Game Development & Tech Talk",
      icon: "🎮"
    },
    {
      day: "Subscribe for notifications",
      time: "Never miss a stream",
      title: "3D Printing & Projects",
      icon: "🖨️"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="stream-schedule" data-astro-cid-delizkop> <ul class="space-y-4" data-astro-cid-delizkop> ${scheduleItems.map((item) => renderTemplate`<li class="flex items-start p-3 rounded-md bg-primary-main bg-opacity-50 hover:bg-opacity-70 transition-all duration-300" data-astro-cid-delizkop> <div class="icon-container flex-shrink-0 w-10 h-10 flex items-center justify-center bg-accent rounded-full mr-4 text-xl" data-astro-cid-delizkop> ${item.icon} </div> <div data-astro-cid-delizkop> <h3 class="font-bold text-white" data-astro-cid-delizkop>${item.title}</h3> <div class="schedule-details text-sm text-white" data-astro-cid-delizkop> <div class="flex items-center" data-astro-cid-delizkop> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-delizkop> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-delizkop></path> </svg> <span class="text-white font-medium" data-astro-cid-delizkop>${item.day}</span> </div> <div class="flex items-center mt-1" data-astro-cid-delizkop> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-delizkop> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-delizkop></path> </svg> <span class="text-white font-medium" data-astro-cid-delizkop>${item.time}</span> </div> </div> </div> </li>`)} </ul> <div class="mt-4 text-center" data-astro-cid-delizkop> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-lg transition-all duration-300" data-astro-cid-delizkop> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-delizkop> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" data-astro-cid-delizkop></path> </svg>
Get notified when stream goes live
</a> </div> </div> `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/StreamSchedule.astro", void 0);
const $$Astro$2 = createAstro("https://nosytlabs.com");
const $$SocialLinks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$SocialLinks;
  const {
    className = "",
    showLabels = false,
    size = "md"
  } = Astro2.props;
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/NosytLabs",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>`
    },
    {
      name: "Kick",
      url: "https://kick.com/Tycen",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>`
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@TycenYT",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>`
    },
    {
      name: "Creality Cloud",
      url: "https://crealitycloud.com/user/9519489699",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
            <path d="M22 8.608v8.142a3.25 3.25 0 01-3.066 3.245L18.75 20H5.25a3.25 3.25 0 01-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 00.696 0L22 8.608zM5.25 4h13.5a3.25 3.25 0 013.245 3.066L22 7.25v.29l-10 5.232L2 7.54V7.25a3.25 3.25 0 013.066-3.245L5.25 4z" />
          </svg>`
    }
  ];
  let iconSize = "w-6 h-6";
  if (size === "sm")
    iconSize = "w-5 h-5";
  if (size === "lg")
    iconSize = "w-8 h-8";
  let containerSize = "w-10 h-10";
  if (size === "sm")
    containerSize = "w-8 h-8";
  if (size === "lg")
    containerSize = "w-12 h-12";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`social-links flex items-center space-x-4 ${className}`, "class")} data-astro-cid-zamss57n> ${socialLinks.map((link) => renderTemplate`<a${addAttribute(link.url, "href")} target="_blank" rel="noopener noreferrer" class="social-link flex items-center hover:-translate-y-1 transition-transform duration-300"${addAttribute(link.name, "aria-label")} data-astro-cid-zamss57n> <div${addAttribute(`${containerSize} p-2 bg-primary-main hover:bg-accent rounded-full transition-colors duration-300 flex items-center justify-center`, "class")} data-astro-cid-zamss57n> <div${addAttribute(`${iconSize} text-white`, "class")} data-astro-cid-zamss57n>${unescapeHTML(link.icon)}</div> </div> ${showLabels && renderTemplate`<span class="ml-2 text-sm font-medium" data-astro-cid-zamss57n>${link.name}</span>`} </a>`)} </div> `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/SocialLinks.astro", void 0);
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$AnimatedHeading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AnimatedHeading;
  const {
    text,
    accentText,
    level = 2,
    className = "",
    animation = "fade",
    textAlign = "left"
  } = Astro2.props;
  const HeadingTag = `h${level}`;
  let animationClass = "";
  if (animation === "fade")
    animationClass = "animate-fade-in";
  if (animation === "slide")
    animationClass = "animate-slide-in";
  if (animation === "highlight")
    animationClass = "animate-highlight";
  let alignClass = "";
  if (textAlign === "center")
    alignClass = "text-center";
  if (textAlign === "right")
    alignClass = "text-right";
  let sizeClass = "";
  switch (level) {
    case 1:
      sizeClass = "text-4xl md:text-5xl lg:text-6xl";
      break;
    case 2:
      sizeClass = "text-3xl md:text-4xl";
      break;
    case 3:
      sizeClass = "text-2xl md:text-3xl";
      break;
    case 4:
      sizeClass = "text-xl md:text-2xl";
      break;
    case 5:
      sizeClass = "text-lg md:text-xl";
      break;
    case 6:
      sizeClass = "text-base md:text-lg";
      break;
  }
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`animated-heading ${alignClass} ${className}`, "class")} data-astro-cid-mfbamgy5> ${renderComponent($$result, "HeadingTag", HeadingTag, { "class": `font-bold ${sizeClass} ${animationClass}`, "data-astro-cid-mfbamgy5": true }, { "default": ($$result2) => renderTemplate`${text}${accentText && renderTemplate`<span class="text-accent relative" data-astro-cid-mfbamgy5> ${" "}${accentText} <span class="accent-underline" data-astro-cid-mfbamgy5></span> </span>`}` })} </div> `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/components/AnimatedHeading.astro", void 0);
const $$Astro = createAstro("https://nosytlabs.com");
const $$Live = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Live;
  const pageTitle = "Live Stream - NosytLabs";
  const pageDescription = "Watch Tycen's live stream on Kick.com featuring coding, tech discussions, gaming, and 3D printing content.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-4an7u5kh": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-12" data-astro-cid-4an7u5kh> ${renderComponent($$result2, "AnimatedHeading", $$AnimatedHeading, { "level": 1, "text": "Live Stream", "accentText": "Tycen", "className": "mb-6 text-center", "data-astro-cid-4an7u5kh": true })} <p class="text-lg text-center mb-4 max-w-3xl mx-auto" data-astro-cid-4an7u5kh>
Join Tycen's live stream on Kick.com for real-time coding, tech discussions, crypto mining, and 3D printing content.
      Interact with the community and get your questions answered live!
</p> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-3xl mx-auto mb-8" data-astro-cid-4an7u5kh> <p class="text-sm text-gray-600 dark:text-gray-300 text-center" data-astro-cid-4an7u5kh> <strong data-astro-cid-4an7u5kh>Stream Schedule:</strong> Streams typically happen on weekends and select weekday evenings.
        Follow on <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline" data-astro-cid-4an7u5kh>Kick.com/Tycen</a>
to get notifications when we go live.
</p> </div> <div class="stream-container mb-12" data-astro-cid-4an7u5kh> <!-- Realistic Stream Player Fallback --> <div class="stream-player-fallback relative overflow-hidden bg-gray-900 rounded-lg shadow-xl" style="aspect-ratio: 16/9; max-width: 1280px; margin: 0 auto;" data-astro-cid-4an7u5kh> <!-- Stream Preview Image with Overlay --> <div class="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" data-astro-cid-4an7u5kh> <img src="/images/stream-preview.jpg" alt="Stream Preview" class="w-full h-full object-cover opacity-80" onerror="this.src='/images/placeholder.svg'; this.onerror=null; this.classList.add('bg-gray-800');" data-astro-cid-4an7u5kh> </div> <!-- Stream Player Controls Overlay --> <div class="absolute inset-0 flex flex-col justify-between p-4" data-astro-cid-4an7u5kh> <!-- Top Bar with Logo and Live Indicator --> <div class="flex items-center justify-between" data-astro-cid-4an7u5kh> <div class="flex items-center space-x-2" data-astro-cid-4an7u5kh> <img src="/images/kick-logo.png" alt="Kick.com" class="h-8" onerror="this.src='/images/placeholder.svg'; this.onerror=null;" data-astro-cid-4an7u5kh> <span class="text-white font-medium" data-astro-cid-4an7u5kh>Tycen's Stream</span> </div> <div class="flex items-center space-x-2" data-astro-cid-4an7u5kh> <div class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center" data-astro-cid-4an7u5kh> <span class="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" data-astro-cid-4an7u5kh></span>
LIVE
</div> <div class="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded-md" data-astro-cid-4an7u5kh> <span id="viewer-count" data-astro-cid-4an7u5kh>Live</span> </div> </div> </div> <!-- Center Play Button --> <div class="absolute inset-0 flex items-center justify-center" data-astro-cid-4an7u5kh> <div class="bg-accent bg-opacity-90 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform group" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-4an7u5kh></path> </svg> </div> </div> <!-- Bottom Controls Bar --> <div class="flex flex-col space-y-2" data-astro-cid-4an7u5kh> <!-- Progress Bar --> <div class="w-full bg-gray-700 h-1 rounded-full overflow-hidden" data-astro-cid-4an7u5kh> <div class="bg-accent h-full rounded-full" style="width: 0%" data-astro-cid-4an7u5kh></div> </div> <!-- Controls --> <div class="flex items-center justify-between" data-astro-cid-4an7u5kh> <div class="flex items-center space-x-4" data-astro-cid-4an7u5kh> <button class="text-white hover:text-accent transition-colors" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m-2.828 9.9a9 9 0 010-12.728" data-astro-cid-4an7u5kh></path> </svg> </button> <div class="text-white text-sm" data-astro-cid-4an7u5kh>LIVE</div> </div> <div class="flex items-center space-x-4" data-astro-cid-4an7u5kh> <button class="text-white hover:text-accent transition-colors" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" data-astro-cid-4an7u5kh></path> </svg> </button> <button class="text-white hover:text-accent transition-colors" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-4an7u5kh></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-4an7u5kh></path> </svg> </button> </div> </div> </div> </div> <!-- Stream Unavailable Message --> <div class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-6 text-center" data-astro-cid-4an7u5kh> <img src="/images/kick-logo.png" alt="Kick.com" class="h-16 mb-4" onerror="this.src='/images/placeholder.svg'; this.onerror=null;" data-astro-cid-4an7u5kh> <h3 class="text-2xl font-bold mb-2 text-white" data-astro-cid-4an7u5kh>Stream Embed Unavailable</h3> <p class="mb-6 max-w-md text-gray-300" data-astro-cid-4an7u5kh>The live stream cannot be embedded due to security restrictions from Kick.com. <strong data-astro-cid-4an7u5kh>Click below to watch the stream directly on Kick.com</strong> for the full experience.</p> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" data-astro-cid-4an7u5kh></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg>
Watch on Kick.com
</a> </div> </div> <!-- Enhanced Kick.com iframe with fixed parameters for proper embedding --> <div class="kick-embed-container relative" style="aspect-ratio: 16/9; max-width: 1280px; margin: 0 auto;" data-astro-cid-4an7u5kh> <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-w-3xl mx-auto mb-4 text-center" data-astro-cid-4an7u5kh> <p class="text-sm text-gray-600 dark:text-gray-300" data-astro-cid-4an7u5kh> <strong data-astro-cid-4an7u5kh>Note:</strong> The stream embed below will only show content when we're live.
            If you don't see anything, we're currently offline. Check back later or follow on Kick.com for notifications.
</p> </div> <iframe src="https://player.kick.com/Tycen?muted=true&autoplay=true" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms" loading="lazy" class="kick-embed w-full h-full" referrerpolicy="origin" title="Tycen's Live Stream on Kick.com" importance="high" style="display: none; z-index: 10;" onload="try {
            if (this.contentWindow) {
              this.style.display='block';
              document.querySelector('.stream-player-fallback').style.display='none';

              // Add unmute button
              const unmuteButton = document.createElement('button');
              unmuteButton.className = 'unmute-button';
              unmuteButton.innerHTML = '🔇 Unmute Stream';
              unmuteButton.style.position = 'absolute';
              unmuteButton.style.bottom = '20px';
              unmuteButton.style.left = '20px';
              unmuteButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              unmuteButton.style.color = 'white';
              unmuteButton.style.border = 'none';
              unmuteButton.style.borderRadius = '4px';
              unmuteButton.style.padding = '8px 16px';
              unmuteButton.style.cursor = 'pointer';
              unmuteButton.style.zIndex = '100';
              unmuteButton.style.fontWeight = 'bold';
              unmuteButton.style.transition = 'all 0.3s ease';

              unmuteButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(255, 107, 0, 0.8)';
              });

              unmuteButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              });

              unmuteButton.addEventListener('click', function() {
                // Change iframe src to unmuted version
                const iframe = document.querySelector('.kick-embed');
                if (iframe) {
                  iframe.src = 'https://player.kick.com/Tycen?muted=false&autoplay=true';
                  this.remove(); // Remove the button after clicking
                }
              });

              document.querySelector('.kick-embed-container').appendChild(unmuteButton);
            } else {
              throw new Error('Cannot access iframe content');
            }
          } catch(e) {
            console.error('Kick embed load error:', e);
            this.style.display='none';
            document.querySelector('.stream-player-fallback').style.display='block';
          }" onerror="try {
            console.error('Kick embed error');
            this.style.display='none';
            document.querySelector('.stream-player-fallback').style.display='block';
          } catch(e) {
            console.error('Kick embed error handler error:', e);
          }" data-astro-cid-4an7u5kh></iframe> <!-- Stream Controls Overlay --> <div class="stream-controls absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" style="display: none;" data-astro-cid-4an7u5kh> <div class="flex items-center justify-between" data-astro-cid-4an7u5kh> <div class="flex items-center space-x-4" data-astro-cid-4an7u5kh> <button class="text-white hover:text-accent transition-colors" id="volume-toggle" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m-2.828 9.9a9 9 0 010-12.728" data-astro-cid-4an7u5kh></path> </svg> </button> <div class="text-white text-sm" data-astro-cid-4an7u5kh>LIVE</div> </div> <div class="flex items-center space-x-4" data-astro-cid-4an7u5kh> <button class="text-white hover:text-accent transition-colors" id="fullscreen-toggle" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" data-astro-cid-4an7u5kh></path> </svg> </button> <a href="https://kick.com/Tycen" target="_blank" rel="noopener noreferrer" class="text-white hover:text-accent transition-colors" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" data-astro-cid-4an7u5kh></path> </svg> </a> </div> </div> </div> </div> <!-- Enhanced Stream Status Indicator with Chat Simulation --> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4" data-astro-cid-4an7u5kh> <!-- Stream Status Card --> <div class="bg-primary-dark rounded-lg p-4 shadow-lg md:col-span-1" data-astro-cid-4an7u5kh> <div class="flex items-center justify-between mb-4" data-astro-cid-4an7u5kh> <h3 class="text-lg font-bold text-white" data-astro-cid-4an7u5kh>Stream Status</h3> <button id="refresh-status" class="bg-primary-main hover:bg-primary-dark rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300" title="Refresh Status" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-astro-cid-4an7u5kh></path> </svg> </button> </div> <!-- Status Indicators --> <div class="space-y-4" data-astro-cid-4an7u5kh> <!-- Live Status --> <div class="flex items-center space-x-3" data-astro-cid-4an7u5kh> <div class="pulse-dot w-4 h-4 rounded-full bg-green-500 relative" data-astro-cid-4an7u5kh> <div class="pulse-ring absolute inset-0 rounded-full" data-astro-cid-4an7u5kh></div> </div> <div class="flex flex-col" data-astro-cid-4an7u5kh> <span class="text-sm font-medium text-white" data-astro-cid-4an7u5kh>Status:</span> <span id="stream-status-text" class="text-green-400 font-bold" data-astro-cid-4an7u5kh>Live Now</span> </div> </div> <!-- Viewers --> <div class="flex items-center space-x-3" data-astro-cid-4an7u5kh> <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-4an7u5kh></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" data-astro-cid-4an7u5kh></path> </svg> </div> <div class="flex flex-col" data-astro-cid-4an7u5kh> <span class="text-sm font-medium text-white" data-astro-cid-4an7u5kh>Status:</span> <span id="stream-viewers" class="text-blue-400 font-bold" data-astro-cid-4an7u5kh>Streaming</span> </div> </div> <!-- Stream Duration --> <div class="flex items-center space-x-3" data-astro-cid-4an7u5kh> <div class="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> </div> <div class="flex flex-col" data-astro-cid-4an7u5kh> <span class="text-sm font-medium text-white" data-astro-cid-4an7u5kh>Duration:</span> <span id="stream-duration" class="text-purple-400 font-bold" data-astro-cid-4an7u5kh>Live</span> </div> </div> <!-- Stream Category --> <div class="flex items-center space-x-3" data-astro-cid-4an7u5kh> <div class="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" data-astro-cid-4an7u5kh></path> </svg> </div> <div class="flex flex-col" data-astro-cid-4an7u5kh> <span class="text-sm font-medium text-white" data-astro-cid-4an7u5kh>Category:</span> <span class="text-yellow-400 font-bold" data-astro-cid-4an7u5kh>Coding & Development</span> </div> </div> </div> </div> <!-- Chat Simulation --> <div class="bg-primary-dark rounded-lg p-4 shadow-lg md:col-span-3 flex flex-col h-80" data-astro-cid-4an7u5kh> <div class="flex items-center justify-between mb-4" data-astro-cid-4an7u5kh> <h3 class="text-lg font-bold text-white" data-astro-cid-4an7u5kh>Live Chat</h3> <div class="flex items-center space-x-2" data-astro-cid-4an7u5kh> <span class="text-xs text-gray-400" data-astro-cid-4an7u5kh>Live Chat</span> <button class="bg-primary-main hover:bg-primary-dark rounded-full w-6 h-6 flex items-center justify-center transition-all duration-300" title="Chat Settings" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-4an7u5kh></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-4an7u5kh></path> </svg> </button> </div> </div> <!-- Chat Messages Container --> <div class="flex-1 overflow-y-auto space-y-3 mb-4 bg-gray-900 bg-opacity-50 p-3 rounded-lg" id="chat-messages" data-astro-cid-4an7u5kh> <!-- Chat messages will be dynamically added when stream is live --> <div class="chat-message" data-astro-cid-4an7u5kh> <span class="font-bold text-blue-400" data-astro-cid-4an7u5kh>System:</span> <span class="text-white" data-astro-cid-4an7u5kh>Chat is only available on Kick.com. Please visit the stream to participate.</span> </div> </div> <!-- Chat Input (Disabled) --> <div class="flex items-center space-x-2" data-astro-cid-4an7u5kh> <div class="relative flex-1" data-astro-cid-4an7u5kh> <input type="text" placeholder="Chat is only available on Kick.com..." disabled class="w-full bg-gray-800 text-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent cursor-not-allowed" data-astro-cid-4an7u5kh> <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500" data-astro-cid-4an7u5kh>
Login required
</div> </div> <button disabled class="bg-accent bg-opacity-50 text-white px-4 py-2 rounded-lg cursor-not-allowed" data-astro-cid-4an7u5kh>
Send
</button> </div> </div> </div> </div> <div class="grid md:grid-cols-2 gap-8 mb-12" data-astro-cid-4an7u5kh> <div class="bg-primary-dark rounded-lg p-6 shadow-lg" data-astro-cid-4an7u5kh> <h2 class="text-2xl font-bold mb-4 text-white" data-astro-cid-4an7u5kh>Stream <span class="text-accent" data-astro-cid-4an7u5kh>Information</span></h2> ${renderComponent($$result2, "StreamSchedule", $$StreamSchedule, { "data-astro-cid-4an7u5kh": true })} </div> <div class="bg-primary-dark rounded-lg p-6 shadow-lg" data-astro-cid-4an7u5kh> <h2 class="text-2xl font-bold mb-4 text-white" data-astro-cid-4an7u5kh>Stream <span class="text-accent" data-astro-cid-4an7u5kh>Features</span></h2> <ul class="space-y-3" data-astro-cid-4an7u5kh> <li class="flex items-start" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> <span class="text-white font-medium" data-astro-cid-4an7u5kh>Live coding sessions with AI tools like Cursor and GitHub Copilot</span> </li> <li class="flex items-start" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> <span class="text-white font-medium" data-astro-cid-4an7u5kh>Crypto mining hardware reviews and profitability analysis</span> </li> <li class="flex items-start" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> <span class="text-white font-medium" data-astro-cid-4an7u5kh>3D printing demonstrations with Creality and Elegoo printers</span> </li> <li class="flex items-start" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> <span class="text-white font-medium" data-astro-cid-4an7u5kh>Web development tutorials and project walkthroughs</span> </li> <li class="flex items-start" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-4an7u5kh></path> </svg> <span class="text-white font-medium" data-astro-cid-4an7u5kh>Q&A sessions and viewer-requested topics</span> </li> </ul> <div class="mt-4 bg-gray-800 p-3 rounded-lg text-sm text-gray-300" data-astro-cid-4an7u5kh> <p data-astro-cid-4an7u5kh><strong data-astro-cid-4an7u5kh>Note:</strong> Stream content varies based on viewer interest and ongoing projects.
          Not all topics are covered in every stream. Check the Kick.com channel for the latest schedule.</p> </div> </div> </div> <div class="text-center mb-12" data-astro-cid-4an7u5kh> <h2 class="text-2xl font-bold mb-4" data-astro-cid-4an7u5kh>Follow Tycen on <span class="text-accent" data-astro-cid-4an7u5kh>Social Media</span></h2> <p class="mb-6" data-astro-cid-4an7u5kh>Stay updated with stream announcements and never miss a live session!</p> ${renderComponent($$result2, "SocialLinks", $$SocialLinks, { "className": "justify-center", "data-astro-cid-4an7u5kh": true })} </div> <div class="text-center" data-astro-cid-4an7u5kh> <a href="/content-creation" class="inline-flex items-center bg-primary-main hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg" data-astro-cid-4an7u5kh> <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-4an7u5kh> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-astro-cid-4an7u5kh></path> </svg>
Back to Content Creation
</a> </div> </div> ` })}  `;
}, "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/live.astro", void 0);
const $$file = "C:/Users/Tyson/Downloads/nosytlabs-github-ready/src/pages/live.astro";
const $$url = "/live.html";
export {
  $$Live as default,
  $$file as file,
  $$url as url
};
