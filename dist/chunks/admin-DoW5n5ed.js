import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, u as unescapeHTML, d as renderComponent, F as Fragment, e as defineScriptVars, f as renderSlot, g as renderHead } from "./vendor-LjYnI_ua.js";
import "kleur/colors";
import "clsx";
/* empty css                            */
import { _ as _renderer0 } from "./react-vendor-CA6bMpfV.js";
const renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: _renderer0 })];
const $$Astro$9 = createAstro("https://nosytlabs.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Header;
  const { currentPath = Astro2.url.pathname } = Astro2.props;
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Services", path: "/services" },
    { name: "Resume", path: "/resume" },
    { name: "NosytOS95", path: "/nosytos95" },
    { name: "Contact", path: "/contact" }
  ];
  const isActive = (path) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };
  return renderTemplate`${maybeRenderHead()}<header class="site-header bg-white dark:bg-gray-900 shadow-md" data-astro-cid-3ef6ksr2> <div class="container mx-auto px-4" data-astro-cid-3ef6ksr2> <div class="flex items-center justify-between py-4" data-astro-cid-3ef6ksr2> <!-- Logo --> <a href="/" class="flex items-center space-x-2 group" data-astro-cid-3ef6ksr2> <div class="w-10 h-10 flex items-center justify-center overflow-hidden" data-astro-cid-3ef6ksr2> <img src="/images/nosytlabs-logo-2025.svg" alt="NosytLabs Logo" width="40" height="40" class="transition-transform duration-300 group-hover:scale-110" data-astro-cid-3ef6ksr2> </div> <span class="text-xl font-bold text-primary dark:text-primary-light transition-colors duration-300" data-astro-cid-3ef6ksr2>
NosytLabs
</span> </a> <!-- Desktop Navigation --> <nav class="hidden md:flex items-center space-x-6" data-astro-cid-3ef6ksr2> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.path, "href")}${addAttribute(`
              text-sm font-medium transition-colors duration-300 relative
              ${isActive(item.path) ? "text-primary dark:text-primary-light" : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"}
            `, "class")} data-astro-cid-3ef6ksr2> ${item.name} ${isActive(item.path) && renderTemplate`<span class="absolute -bottom-1.5 left-0 w-full h-0.5 bg-accent rounded-full" data-astro-cid-3ef6ksr2></span>`} </a>`)} </nav> <!-- Search and Theme Toggle --> <div class="hidden md:flex items-center space-x-3" data-astro-cid-3ef6ksr2> <!-- Search Trigger --> <button id="search-trigger" class="search-trigger" aria-label="Open search" data-astro-cid-3ef6ksr2> <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-3ef6ksr2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-3ef6ksr2></path> </svg> <span class="search-text" data-astro-cid-3ef6ksr2>Search</span> <kbd class="search-kbd" data-astro-cid-3ef6ksr2>⌘K</kbd> </button> <!-- Theme Toggle --> <button id="theme-toggle" class="p-2 rounded-md text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors duration-300" aria-label="Toggle theme" data-astro-cid-3ef6ksr2> <svg id="theme-icon-light" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-3ef6ksr2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-3ef6ksr2></path> </svg> <svg id="theme-icon-dark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-3ef6ksr2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" data-astro-cid-3ef6ksr2></path> </svg> </button> </div> <!-- Mobile Menu Button --> <button id="mobile-menu-button" class="md:hidden flex items-center p-2 rounded-md text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light" aria-label="Toggle mobile menu" data-astro-cid-3ef6ksr2> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-3ef6ksr2> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-3ef6ksr2></path> </svg> </button> </div> </div> <!-- Mobile Navigation --> <div id="mobile-menu" class="md:hidden hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" data-astro-cid-3ef6ksr2> <div class="container mx-auto px-4 py-3" data-astro-cid-3ef6ksr2> <nav class="flex flex-col space-y-3" data-astro-cid-3ef6ksr2> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.path, "href")}${addAttribute(`
              py-2 px-3 rounded-md transition-colors duration-300
              ${isActive(item.path) ? "bg-gray-100 dark:bg-gray-800 text-primary dark:text-primary-light" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"}
            `, "class")} data-astro-cid-3ef6ksr2> ${item.name} </a>`)} </nav> </div> </div> </header>  `;
}, "/mnt/persist/workspace/src/components/Header.astro", void 0);
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const footerNavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Services", path: "/services" },
    { name: "Resume", path: "/resume" },
    { name: "NosytOS95", path: "/nosytos95" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" }
  ];
  const socialLinks = [
    { name: "YouTube", icon: "youtube", url: "https://www.youtube.com/@TycenYT" },
    { name: "Kick", icon: "tv", url: "https://kick.com/Tycen" },
    { name: "GitHub", icon: "github", url: "https://github.com/NosytLabs" },
    { name: "Twitter", icon: "twitter", url: "https://twitter.com/NosytLabs" }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-900 text-white pt-16 pb-8" data-astro-cid-sz7xmlte> <div class="container mx-auto px-4" data-astro-cid-sz7xmlte> <!-- Footer Top Section --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12" data-astro-cid-sz7xmlte> <!-- Company Info --> <div data-astro-cid-sz7xmlte> <div class="flex items-center space-x-2 mb-4" data-astro-cid-sz7xmlte> <img src="/images/nosytlabs-logo-2025.svg" alt="NosytLabs Logo" width="40" height="40" class="w-10 h-10" data-astro-cid-sz7xmlte> <span class="text-xl font-bold text-white" data-astro-cid-sz7xmlte>NosytLabs</span> </div> <p class="text-gray-400 mb-4" data-astro-cid-sz7xmlte>
Notable Opportunities Shape Your Tomorrow
</p> <div class="flex space-x-4" data-astro-cid-sz7xmlte> ${socialLinks.map((link) => renderTemplate`<a${addAttribute(link.url, "href")} target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-accent transition-colors duration-300"${addAttribute(`Follow us on ${link.name}`, "aria-label")} data-astro-cid-sz7xmlte> <i${addAttribute(`fab fa-${link.icon} text-xl`, "class")} data-astro-cid-sz7xmlte></i> </a>`)} </div> </div> <!-- Quick Links --> <div data-astro-cid-sz7xmlte> <h3 class="text-lg font-bold mb-4 text-white" data-astro-cid-sz7xmlte>Quick Links</h3> <ul class="space-y-2" data-astro-cid-sz7xmlte> ${footerNavItems.slice(0, 5).map((item) => renderTemplate`<li data-astro-cid-sz7xmlte> <a${addAttribute(item.path, "href")} class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte> ${item.name} </a> </li>`)} </ul> </div> <!-- Services --> <div data-astro-cid-sz7xmlte> <h3 class="text-lg font-bold mb-4 text-white" data-astro-cid-sz7xmlte>Services</h3> <ul class="space-y-2" data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte> <a href="/services#web-development" class="text-gray-400 hover:text-accent transition-colors duration-300" data-astro-cid-sz7xmlte>
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
&copy; ${currentYear} NosytLabs. All rights reserved.
</div> <div class="flex flex-wrap justify-center gap-4" data-astro-cid-sz7xmlte> ${footerNavItems.slice(6).map((item) => renderTemplate`<a${addAttribute(item.path, "href")} class="text-gray-500 hover:text-accent text-sm transition-colors duration-300" data-astro-cid-sz7xmlte> ${item.name} </a>`)} </div> </div> </div> </footer> `;
}, "/mnt/persist/workspace/src/components/Footer.astro", void 0);
var __freeze$6 = Object.freeze;
var __defProp$6 = Object.defineProperty;
var __template$6 = (cooked, raw) => __freeze$6(__defProp$6(cooked, "raw", { value: __freeze$6(raw || cooked.slice()) }));
var _a$6;
const $$Astro$8 = createAstro("https://nosytlabs.com");
const $$SearchModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$SearchModal;
  const {
    placeholder = "Search NosytLabs...",
    showCategories = true,
    maxResults = 10
  } = Astro2.props;
  return renderTemplate(_a$6 || (_a$6 = __template$6(["<!-- Search Modal Trigger -->", '<button id="search-trigger" class="search-trigger" aria-label="Open search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <span class="search-text" data-astro-cid-qk3db3zz>Search</span> <kbd class="search-kbd" data-astro-cid-qk3db3zz>⌘K</kbd> </button> <!-- Search Modal --> <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title" data-astro-cid-qk3db3zz> <div class="search-backdrop" data-astro-cid-qk3db3zz></div> <div class="search-container" data-astro-cid-qk3db3zz> <div class="search-header" data-astro-cid-qk3db3zz> <div class="search-input-container" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <input type="text" id="search-input" class="search-input"', ' autocomplete="off" spellcheck="false" aria-label="Search query" data-astro-cid-qk3db3zz> <button id="search-clear" class="search-clear" aria-label="Clear search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> <button id="search-close" class="search-close" aria-label="Close search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> ', ` <div class="search-content" data-astro-cid-qk3db3zz> <!-- Loading State --> <div id="search-loading" class="search-loading" style="display: none;" data-astro-cid-qk3db3zz> <div class="loading-spinner" data-astro-cid-qk3db3zz></div> <p data-astro-cid-qk3db3zz>Searching...</p> </div> <!-- Empty State --> <div id="search-empty" class="search-empty" data-astro-cid-qk3db3zz> <div class="empty-icon" data-astro-cid-qk3db3zz>🔍</div> <h3 data-astro-cid-qk3db3zz>Search NosytLabs</h3> <p data-astro-cid-qk3db3zz>Find pages, blog posts, projects, and services</p> <div class="popular-searches" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Popular searches:</h4> <div class="popular-tags" data-astro-cid-qk3db3zz> <button class="popular-tag" data-query="web development" data-astro-cid-qk3db3zz>Web Development</button> <button class="popular-tag" data-query="3d printing" data-astro-cid-qk3db3zz>3D Printing</button> <button class="popular-tag" data-query="cursor ai" data-astro-cid-qk3db3zz>Cursor AI</button> <button class="popular-tag" data-query="nosytos95" data-astro-cid-qk3db3zz>NosytOS95</button> <button class="popular-tag" data-query="passive income" data-astro-cid-qk3db3zz>Passive Income</button> </div> </div> </div> <!-- No Results State --> <div id="search-no-results" class="search-no-results" style="display: none;" data-astro-cid-qk3db3zz> <div class="no-results-icon" data-astro-cid-qk3db3zz>😔</div> <h3 data-astro-cid-qk3db3zz>No results found</h3> <p id="no-results-text" data-astro-cid-qk3db3zz>Try adjusting your search terms or browse our popular content.</p> <div class="search-suggestions" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Suggestions:</h4> <ul id="search-suggestions-list" data-astro-cid-qk3db3zz></ul> </div> </div> <!-- Results --> <div id="search-results" class="search-results" style="display: none;" data-astro-cid-qk3db3zz> <div id="search-results-header" class="results-header" data-astro-cid-qk3db3zz> <span id="results-count" data-astro-cid-qk3db3zz>0 results</span> <span id="results-query" data-astro-cid-qk3db3zz></span> </div> <div id="search-results-content" class="results-content" data-astro-cid-qk3db3zz></div> </div> </div> <div class="search-footer" data-astro-cid-qk3db3zz> <div class="search-shortcuts" data-astro-cid-qk3db3zz> <kbd data-astro-cid-qk3db3zz>↑↓</kbd> Navigate
<kbd data-astro-cid-qk3db3zz>↵</kbd> Select
<kbd data-astro-cid-qk3db3zz>Esc</kbd> Close
</div> </div> </div> </div>  <script type="module">
  import searchService, { searchUtils } from '../utils/searchService.js';

  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize search service
    await searchService.initialize();

    // DOM elements
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const searchClose = document.getElementById('search-close');
    const searchBackdrop = document.querySelector('.search-backdrop');
    const searchFilters = document.getElementById('search-filters');
    const searchLoading = document.getElementById('search-loading');
    const searchEmpty = document.getElementById('search-empty');
    const searchNoResults = document.getElementById('search-no-results');
    const searchResults = document.getElementById('search-results');
    const searchResultsContent = document.getElementById('search-results-content');
    const resultsCount = document.getElementById('results-count');
    const resultsQuery = document.getElementById('results-query');

    // State
    let currentQuery = '';
    let currentCategory = 'all';
    let selectedIndex = -1;
    let searchResults = [];

    // Debounced search function
    const debouncedSearch = searchUtils.debounce(performSearch, 300);

    // Event listeners
    searchTrigger?.addEventListener('click', openModal);
    searchClose?.addEventListener('click', closeModal);
    searchBackdrop?.addEventListener('click', closeModal);
    searchClear?.addEventListener('click', clearSearch);
    searchInput?.addEventListener('input', handleSearchInput);
    searchInput?.addEventListener('keydown', handleKeyDown);

    // Filter buttons
    searchFilters?.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        handleFilterChange(e.target);
      }
    });

    // Popular tags
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popular-tag')) {
        const query = e.target.dataset.query;
        if (query) {
          searchInput.value = query;
          handleSearchInput();
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      
      // Escape to close
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Functions
    function openModal() {
      searchModal.classList.add('active');
      searchInput.focus();
      document.body.style.overflow = 'hidden';
      showEmptyState();
    }

    function closeModal() {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
      clearSearch();
    }

    function clearSearch() {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      currentQuery = '';
      selectedIndex = -1;
      showEmptyState();
    }

    function handleSearchInput() {
      const query = searchInput.value.trim();
      
      if (query.length > 0) {
        searchClear.classList.add('visible');
      } else {
        searchClear.classList.remove('visible');
      }

      if (query !== currentQuery) {
        currentQuery = query;
        selectedIndex = -1;
        
        if (query.length >= 2) {
          showLoading();
          debouncedSearch(query);
        } else if (query.length === 0) {
          showEmptyState();
        }
      }
    }

    function handleFilterChange(button) {
      // Update active filter
      searchFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      currentCategory = button.dataset.category;
      
      // Re-search with new filter
      if (currentQuery.length >= 2) {
        performSearch(currentQuery);
      }
    }

    function handleKeyDown(e) {
      if (!searchResults.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
          updateSelection();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          updateSelection();
          break;
          
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            navigateToResult(searchResults[selectedIndex]);
          }
          break;
      }
    }

    async function performSearch(query) {
      try {
        const options = currentCategory !== 'all' ? { category: currentCategory } : {};
        const results = await searchService.search(query, options);
        
        searchResults = [];
        Object.values(results.categories).forEach(categoryResults => {
          searchResults.push(...categoryResults.map(r => r.document));
        });

        if (searchResults.length > 0) {
          showResults(results);
        } else {
          showNoResults(query, results.suggestions);
        }
      } catch (error) {
        console.error('Search error:', error);
        showNoResults(query, []);
      }
    }

    function showLoading() {
      hideAllStates();
      searchLoading.style.display = 'flex';
    }

    function showEmptyState() {
      hideAllStates();
      searchEmpty.style.display = 'block';
    }

    function showNoResults(query, suggestions) {
      hideAllStates();
      document.getElementById('no-results-text').textContent = 
        \`No results found for "\${query}". Try adjusting your search terms.\`;
      
      const suggestionsList = document.getElementById('search-suggestions-list');
      suggestionsList.innerHTML = '';
      
      if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
          const li = document.createElement('li');
          li.innerHTML = \`<button class="popular-tag" data-query="\${suggestion}">\${suggestion}</button>\`;
          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.innerHTML = '<li>Try searching for "web development", "3d printing", or "nosytos95"</li>';
      }
      
      searchNoResults.style.display = 'block';
    }

    function showResults(results) {
      hideAllStates();
      
      resultsCount.textContent = \`\${results.total} result\${results.total !== 1 ? 's' : ''}\`;
      resultsQuery.textContent = \`for "\${results.query}"\`;
      
      const formattedResults = searchUtils.formatResults(results);
      searchResultsContent.innerHTML = '';
      
      formattedResults.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'result-category';
        
        categoryDiv.innerHTML = \`
          <div class="category-header">
            <span class="category-icon">\${searchUtils.getCategoryIcon(category.category.toLowerCase())}</span>
            <span>\${category.category}</span>
          </div>
        \`;
        
        category.items.forEach(item => {
          const resultDiv = document.createElement('a');
          resultDiv.className = 'result-item';
          resultDiv.href = item.url;
          resultDiv.addEventListener('click', () => navigateToResult(item));
          
          const highlightedTitle = searchUtils.highlightSearchTerms(item.title, results.query);
          const highlightedDescription = searchUtils.highlightSearchTerms(item.description, results.query);
          
          resultDiv.innerHTML = \`
            <div class="result-title">\${highlightedTitle}</div>
            <div class="result-description">\${highlightedDescription}</div>
            <div class="result-url">\${item.url}</div>
          \`;
          
          categoryDiv.appendChild(resultDiv);
        });
        
        searchResultsContent.appendChild(categoryDiv);
      });
      
      searchResults.style.display = 'block';
      selectedIndex = -1;
    }

    function hideAllStates() {
      searchLoading.style.display = 'none';
      searchEmpty.style.display = 'none';
      searchNoResults.style.display = 'none';
      searchResults.style.display = 'none';
    }

    function updateSelection() {
      const resultItems = searchResultsContent.querySelectorAll('.result-item');
      resultItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedIndex);
      });
      
      if (selectedIndex >= 0 && resultItems[selectedIndex]) {
        resultItems[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    function navigateToResult(result) {
      closeModal();
      window.location.href = result.url;
    }
  });
<\/script>`], ["<!-- Search Modal Trigger -->", '<button id="search-trigger" class="search-trigger" aria-label="Open search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <span class="search-text" data-astro-cid-qk3db3zz>Search</span> <kbd class="search-kbd" data-astro-cid-qk3db3zz>⌘K</kbd> </button> <!-- Search Modal --> <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title" data-astro-cid-qk3db3zz> <div class="search-backdrop" data-astro-cid-qk3db3zz></div> <div class="search-container" data-astro-cid-qk3db3zz> <div class="search-header" data-astro-cid-qk3db3zz> <div class="search-input-container" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <input type="text" id="search-input" class="search-input"', ' autocomplete="off" spellcheck="false" aria-label="Search query" data-astro-cid-qk3db3zz> <button id="search-clear" class="search-clear" aria-label="Clear search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> <button id="search-close" class="search-close" aria-label="Close search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> ', ` <div class="search-content" data-astro-cid-qk3db3zz> <!-- Loading State --> <div id="search-loading" class="search-loading" style="display: none;" data-astro-cid-qk3db3zz> <div class="loading-spinner" data-astro-cid-qk3db3zz></div> <p data-astro-cid-qk3db3zz>Searching...</p> </div> <!-- Empty State --> <div id="search-empty" class="search-empty" data-astro-cid-qk3db3zz> <div class="empty-icon" data-astro-cid-qk3db3zz>🔍</div> <h3 data-astro-cid-qk3db3zz>Search NosytLabs</h3> <p data-astro-cid-qk3db3zz>Find pages, blog posts, projects, and services</p> <div class="popular-searches" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Popular searches:</h4> <div class="popular-tags" data-astro-cid-qk3db3zz> <button class="popular-tag" data-query="web development" data-astro-cid-qk3db3zz>Web Development</button> <button class="popular-tag" data-query="3d printing" data-astro-cid-qk3db3zz>3D Printing</button> <button class="popular-tag" data-query="cursor ai" data-astro-cid-qk3db3zz>Cursor AI</button> <button class="popular-tag" data-query="nosytos95" data-astro-cid-qk3db3zz>NosytOS95</button> <button class="popular-tag" data-query="passive income" data-astro-cid-qk3db3zz>Passive Income</button> </div> </div> </div> <!-- No Results State --> <div id="search-no-results" class="search-no-results" style="display: none;" data-astro-cid-qk3db3zz> <div class="no-results-icon" data-astro-cid-qk3db3zz>😔</div> <h3 data-astro-cid-qk3db3zz>No results found</h3> <p id="no-results-text" data-astro-cid-qk3db3zz>Try adjusting your search terms or browse our popular content.</p> <div class="search-suggestions" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Suggestions:</h4> <ul id="search-suggestions-list" data-astro-cid-qk3db3zz></ul> </div> </div> <!-- Results --> <div id="search-results" class="search-results" style="display: none;" data-astro-cid-qk3db3zz> <div id="search-results-header" class="results-header" data-astro-cid-qk3db3zz> <span id="results-count" data-astro-cid-qk3db3zz>0 results</span> <span id="results-query" data-astro-cid-qk3db3zz></span> </div> <div id="search-results-content" class="results-content" data-astro-cid-qk3db3zz></div> </div> </div> <div class="search-footer" data-astro-cid-qk3db3zz> <div class="search-shortcuts" data-astro-cid-qk3db3zz> <kbd data-astro-cid-qk3db3zz>↑↓</kbd> Navigate
<kbd data-astro-cid-qk3db3zz>↵</kbd> Select
<kbd data-astro-cid-qk3db3zz>Esc</kbd> Close
</div> </div> </div> </div>  <script type="module">
  import searchService, { searchUtils } from '../utils/searchService.js';

  document.addEventListener('DOMContentLoaded', async () => {
    // Initialize search service
    await searchService.initialize();

    // DOM elements
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const searchClose = document.getElementById('search-close');
    const searchBackdrop = document.querySelector('.search-backdrop');
    const searchFilters = document.getElementById('search-filters');
    const searchLoading = document.getElementById('search-loading');
    const searchEmpty = document.getElementById('search-empty');
    const searchNoResults = document.getElementById('search-no-results');
    const searchResults = document.getElementById('search-results');
    const searchResultsContent = document.getElementById('search-results-content');
    const resultsCount = document.getElementById('results-count');
    const resultsQuery = document.getElementById('results-query');

    // State
    let currentQuery = '';
    let currentCategory = 'all';
    let selectedIndex = -1;
    let searchResults = [];

    // Debounced search function
    const debouncedSearch = searchUtils.debounce(performSearch, 300);

    // Event listeners
    searchTrigger?.addEventListener('click', openModal);
    searchClose?.addEventListener('click', closeModal);
    searchBackdrop?.addEventListener('click', closeModal);
    searchClear?.addEventListener('click', clearSearch);
    searchInput?.addEventListener('input', handleSearchInput);
    searchInput?.addEventListener('keydown', handleKeyDown);

    // Filter buttons
    searchFilters?.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        handleFilterChange(e.target);
      }
    });

    // Popular tags
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popular-tag')) {
        const query = e.target.dataset.query;
        if (query) {
          searchInput.value = query;
          handleSearchInput();
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openModal();
      }
      
      // Escape to close
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Functions
    function openModal() {
      searchModal.classList.add('active');
      searchInput.focus();
      document.body.style.overflow = 'hidden';
      showEmptyState();
    }

    function closeModal() {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
      clearSearch();
    }

    function clearSearch() {
      searchInput.value = '';
      searchClear.classList.remove('visible');
      currentQuery = '';
      selectedIndex = -1;
      showEmptyState();
    }

    function handleSearchInput() {
      const query = searchInput.value.trim();
      
      if (query.length > 0) {
        searchClear.classList.add('visible');
      } else {
        searchClear.classList.remove('visible');
      }

      if (query !== currentQuery) {
        currentQuery = query;
        selectedIndex = -1;
        
        if (query.length >= 2) {
          showLoading();
          debouncedSearch(query);
        } else if (query.length === 0) {
          showEmptyState();
        }
      }
    }

    function handleFilterChange(button) {
      // Update active filter
      searchFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      currentCategory = button.dataset.category;
      
      // Re-search with new filter
      if (currentQuery.length >= 2) {
        performSearch(currentQuery);
      }
    }

    function handleKeyDown(e) {
      if (!searchResults.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
          updateSelection();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = Math.max(selectedIndex - 1, -1);
          updateSelection();
          break;
          
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            navigateToResult(searchResults[selectedIndex]);
          }
          break;
      }
    }

    async function performSearch(query) {
      try {
        const options = currentCategory !== 'all' ? { category: currentCategory } : {};
        const results = await searchService.search(query, options);
        
        searchResults = [];
        Object.values(results.categories).forEach(categoryResults => {
          searchResults.push(...categoryResults.map(r => r.document));
        });

        if (searchResults.length > 0) {
          showResults(results);
        } else {
          showNoResults(query, results.suggestions);
        }
      } catch (error) {
        console.error('Search error:', error);
        showNoResults(query, []);
      }
    }

    function showLoading() {
      hideAllStates();
      searchLoading.style.display = 'flex';
    }

    function showEmptyState() {
      hideAllStates();
      searchEmpty.style.display = 'block';
    }

    function showNoResults(query, suggestions) {
      hideAllStates();
      document.getElementById('no-results-text').textContent = 
        \\\`No results found for "\\\${query}". Try adjusting your search terms.\\\`;
      
      const suggestionsList = document.getElementById('search-suggestions-list');
      suggestionsList.innerHTML = '';
      
      if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
          const li = document.createElement('li');
          li.innerHTML = \\\`<button class="popular-tag" data-query="\\\${suggestion}">\\\${suggestion}</button>\\\`;
          suggestionsList.appendChild(li);
        });
      } else {
        suggestionsList.innerHTML = '<li>Try searching for "web development", "3d printing", or "nosytos95"</li>';
      }
      
      searchNoResults.style.display = 'block';
    }

    function showResults(results) {
      hideAllStates();
      
      resultsCount.textContent = \\\`\\\${results.total} result\\\${results.total !== 1 ? 's' : ''}\\\`;
      resultsQuery.textContent = \\\`for "\\\${results.query}"\\\`;
      
      const formattedResults = searchUtils.formatResults(results);
      searchResultsContent.innerHTML = '';
      
      formattedResults.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'result-category';
        
        categoryDiv.innerHTML = \\\`
          <div class="category-header">
            <span class="category-icon">\\\${searchUtils.getCategoryIcon(category.category.toLowerCase())}</span>
            <span>\\\${category.category}</span>
          </div>
        \\\`;
        
        category.items.forEach(item => {
          const resultDiv = document.createElement('a');
          resultDiv.className = 'result-item';
          resultDiv.href = item.url;
          resultDiv.addEventListener('click', () => navigateToResult(item));
          
          const highlightedTitle = searchUtils.highlightSearchTerms(item.title, results.query);
          const highlightedDescription = searchUtils.highlightSearchTerms(item.description, results.query);
          
          resultDiv.innerHTML = \\\`
            <div class="result-title">\\\${highlightedTitle}</div>
            <div class="result-description">\\\${highlightedDescription}</div>
            <div class="result-url">\\\${item.url}</div>
          \\\`;
          
          categoryDiv.appendChild(resultDiv);
        });
        
        searchResultsContent.appendChild(categoryDiv);
      });
      
      searchResults.style.display = 'block';
      selectedIndex = -1;
    }

    function hideAllStates() {
      searchLoading.style.display = 'none';
      searchEmpty.style.display = 'none';
      searchNoResults.style.display = 'none';
      searchResults.style.display = 'none';
    }

    function updateSelection() {
      const resultItems = searchResultsContent.querySelectorAll('.result-item');
      resultItems.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedIndex);
      });
      
      if (selectedIndex >= 0 && resultItems[selectedIndex]) {
        resultItems[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    function navigateToResult(result) {
      closeModal();
      window.location.href = result.url;
    }
  });
<\/script>`])), maybeRenderHead(), addAttribute(placeholder, "placeholder"), showCategories && renderTemplate`<div id="search-filters" class="search-filters" data-astro-cid-qk3db3zz> <button class="filter-btn active" data-category="all" data-astro-cid-qk3db3zz>All</button> <button class="filter-btn" data-category="page" data-astro-cid-qk3db3zz>Pages</button> <button class="filter-btn" data-category="blog" data-astro-cid-qk3db3zz>Blog</button> <button class="filter-btn" data-category="project" data-astro-cid-qk3db3zz>Projects</button> <button class="filter-btn" data-category="service" data-astro-cid-qk3db3zz>Services</button> </div>`);
}, "/mnt/persist/workspace/src/components/SearchModal.astro", void 0);
const $$VercelAnalytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/mnt/persist/workspace/src/components/VercelAnalytics.astro", void 0);
const $$Astro$7 = createAstro("https://nosytlabs.com");
const $$CriticalCSS = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$CriticalCSS;
  const { page: page2 = "default" } = Astro2.props;
  const criticalCSS = {
    default: `
    /* Critical CSS for all pages */
    :root {
      --nosyt-purple-main: #4C1D95;
      --nosyt-orange-main: #FF6B00;
      --white: #FFFFFF;
      --gray-900: #111827;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: var(--gray-900);
      background-color: var(--white);
    }
    
    .site-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .hero-section {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem 1rem;
    }
    
    .btn-primary {
      background-color: var(--nosyt-purple-main);
      color: var(--white);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      display: inline-block;
      transition: transform 0.2s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
    }
    
    /* Loading states */
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
    home: `
    /* Additional critical CSS for home page */
    .hero-showcase {
      background: linear-gradient(135deg, var(--nosyt-purple-main) 0%, var(--nosyt-orange-main) 100%);
      color: var(--white);
    }
    
    .service-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      padding: 2rem 0;
    }
  `,
    blog: `
    /* Critical CSS for blog pages */
    .blog-header {
      padding: 3rem 0;
      text-align: center;
      background: linear-gradient(135deg, var(--nosyt-purple-main) 0%, var(--nosyt-orange-main) 100%);
      color: var(--white);
    }
    
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      padding: 2rem 0;
    }
  `,
    nosytos95: `
    /* Critical CSS for NosytOS95 page */
    .win95-desktop {
      background: #2D0A4F;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }
    
    .win95-taskbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: #c0c0c0;
      border-top: 2px solid #dfdfdf;
      z-index: 1000;
    }
  `
  };
  const currentCriticalCSS = criticalCSS[page2] || criticalCSS.default;
  const baseCriticalCSS = page2 !== "default" ? criticalCSS.default + currentCriticalCSS : currentCriticalCSS;
  return renderTemplate`<style>${unescapeHTML(baseCriticalCSS)}</style><!-- Preload non-critical CSS --><link rel="preload" href="/styles/global.css" as="style" onload="this.onload=null;this.rel='stylesheet'">${maybeRenderHead()}<noscript><link rel="stylesheet" href="/styles/global.css"></noscript><!-- Page-specific CSS preloading -->${page2 === "nosytos95" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<link rel="preload" href="/styles/win95-authentic.css" as="style" onload="this.onload=null;this.rel='stylesheet'"><link rel="preload" href="/styles/nosyt-window-manager.css" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/styles/win95-authentic.css"><link rel="stylesheet" href="/styles/nosyt-window-manager.css"></noscript>` })}`}${page2 === "blog" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<link rel="preload" href="/blog/styles/blog.css" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/blog/styles/blog.css"></noscript>` })}`}`;
}, "/mnt/persist/workspace/src/components/CriticalCSS.astro", void 0);
var __freeze$5 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$5(cooked, "raw", { value: __freeze$5(raw || cooked.slice()) }));
var _a$5;
const $$Astro$6 = createAstro("https://nosytlabs.com");
const $$PerformanceMonitor = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$PerformanceMonitor;
  const {
    enableAnalytics = true,
    enableConsoleLogging = false,
    sampleRate = 1
  } = Astro2.props;
  return renderTemplate(_a$5 || (_a$5 = __template$5(["<script>(function(){", "\n  class PerformanceMonitor {\n    private metrics = {\n      navigation: {},\n      vitals: {},\n      resources: [],\n      errors: []\n    };\n    \n    private observers = new Map();\n    private startTime = performance.now();\n    \n    constructor() {\n      this.init();\n    }\n    \n    init() {\n      // Only run for a sample of users\n      if (Math.random() > sampleRate) return;\n      \n      this.observeNavigationTiming();\n      this.observeCoreWebVitals();\n      this.observeResourceTiming();\n      this.observeErrors();\n      this.observeUserInteractions();\n      \n      // Report metrics when page is about to unload\n      window.addEventListener('beforeunload', () => {\n        this.reportMetrics();\n      });\n      \n      // Report metrics after page is fully loaded\n      window.addEventListener('load', () => {\n        setTimeout(() => this.reportMetrics(), 1000);\n      });\n    }\n    \n    observeNavigationTiming() {\n      window.addEventListener('load', () => {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        \n        this.metrics.navigation = {\n          // DNS and Connection\n          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,\n          tcpConnection: navigation.connectEnd - navigation.connectStart,\n          tlsHandshake: navigation.secureConnectionStart > 0 ? \n            navigation.connectEnd - navigation.secureConnectionStart : 0,\n          \n          // Request and Response\n          requestTime: navigation.responseStart - navigation.requestStart,\n          responseTime: navigation.responseEnd - navigation.responseStart,\n          \n          // DOM Processing\n          domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,\n          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,\n          \n          // Resource Loading\n          resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd,\n          \n          // Total Times\n          totalTime: navigation.loadEventEnd - navigation.startTime,\n          domInteractive: navigation.domInteractive - navigation.startTime,\n          domComplete: navigation.domComplete - navigation.startTime,\n          \n          // Page Load Type\n          navigationType: navigation.type,\n          redirectCount: navigation.redirectCount\n        };\n        \n        this.logMetric('Navigation Timing', this.metrics.navigation);\n      });\n    }\n    \n    observeCoreWebVitals() {\n      // Largest Contentful Paint (LCP)\n      this.observeLCP();\n      \n      // First Input Delay (FID)\n      this.observeFID();\n      \n      // Cumulative Layout Shift (CLS)\n      this.observeCLS();\n      \n      // First Contentful Paint (FCP)\n      this.observeFCP();\n      \n      // Time to First Byte (TTFB)\n      this.observeTTFB();\n    }\n    \n    observeLCP() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          const lastEntry = entries[entries.length - 1];\n          \n          this.metrics.vitals.lcp = {\n            value: lastEntry.startTime,\n            rating: this.getRating(lastEntry.startTime, [2500, 4000]),\n            element: lastEntry.element?.tagName || 'unknown'\n          };\n          \n          this.logMetric('LCP', this.metrics.vitals.lcp);\n        });\n        \n        observer.observe({ entryTypes: ['largest-contentful-paint'] });\n        this.observers.set('lcp', observer);\n      }\n    }\n    \n    observeFID() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          entries.forEach(entry => {\n            this.metrics.vitals.fid = {\n              value: entry.processingStart - entry.startTime,\n              rating: this.getRating(entry.processingStart - entry.startTime, [100, 300]),\n              eventType: entry.name\n            };\n            \n            this.logMetric('FID', this.metrics.vitals.fid);\n          });\n        });\n        \n        observer.observe({ entryTypes: ['first-input'] });\n        this.observers.set('fid', observer);\n      }\n    }\n    \n    observeCLS() {\n      if ('PerformanceObserver' in window) {\n        let clsValue = 0;\n        let sessionValue = 0;\n        let sessionEntries = [];\n        \n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          \n          entries.forEach(entry => {\n            if (!entry.hadRecentInput) {\n              const firstSessionEntry = sessionEntries[0];\n              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];\n              \n              if (sessionValue && \n                  entry.startTime - lastSessionEntry.startTime < 1000 &&\n                  entry.startTime - firstSessionEntry.startTime < 5000) {\n                sessionValue += entry.value;\n                sessionEntries.push(entry);\n              } else {\n                sessionValue = entry.value;\n                sessionEntries = [entry];\n              }\n              \n              if (sessionValue > clsValue) {\n                clsValue = sessionValue;\n                \n                this.metrics.vitals.cls = {\n                  value: clsValue,\n                  rating: this.getRating(clsValue, [0.1, 0.25]),\n                  entries: sessionEntries.length\n                };\n                \n                this.logMetric('CLS', this.metrics.vitals.cls);\n              }\n            }\n          });\n        });\n        \n        observer.observe({ entryTypes: ['layout-shift'] });\n        this.observers.set('cls', observer);\n      }\n    }\n    \n    observeFCP() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          entries.forEach(entry => {\n            if (entry.name === 'first-contentful-paint') {\n              this.metrics.vitals.fcp = {\n                value: entry.startTime,\n                rating: this.getRating(entry.startTime, [1800, 3000])\n              };\n              \n              this.logMetric('FCP', this.metrics.vitals.fcp);\n            }\n          });\n        });\n        \n        observer.observe({ entryTypes: ['paint'] });\n        this.observers.set('fcp', observer);\n      }\n    }\n    \n    observeTTFB() {\n      window.addEventListener('load', () => {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        const ttfb = navigation.responseStart - navigation.requestStart;\n        \n        this.metrics.vitals.ttfb = {\n          value: ttfb,\n          rating: this.getRating(ttfb, [800, 1800])\n        };\n        \n        this.logMetric('TTFB', this.metrics.vitals.ttfb);\n      });\n    }\n    \n    observeResourceTiming() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          \n          entries.forEach(entry => {\n            const resource = {\n              name: entry.name,\n              type: this.getResourceType(entry.name),\n              size: entry.transferSize || 0,\n              duration: entry.duration,\n              startTime: entry.startTime,\n              cached: entry.transferSize === 0 && entry.decodedBodySize > 0\n            };\n            \n            this.metrics.resources.push(resource);\n          });\n        });\n        \n        observer.observe({ entryTypes: ['resource'] });\n        this.observers.set('resource', observer);\n      }\n    }\n    \n    observeErrors() {\n      window.addEventListener('error', (event) => {\n        this.metrics.errors.push({\n          type: 'javascript',\n          message: event.message,\n          filename: event.filename,\n          line: event.lineno,\n          column: event.colno,\n          timestamp: Date.now()\n        });\n      });\n      \n      window.addEventListener('unhandledrejection', (event) => {\n        this.metrics.errors.push({\n          type: 'promise',\n          message: event.reason?.message || 'Unhandled promise rejection',\n          timestamp: Date.now()\n        });\n      });\n    }\n    \n    observeUserInteractions() {\n      let interactionCount = 0;\n      \n      ['click', 'keydown', 'scroll'].forEach(eventType => {\n        document.addEventListener(eventType, () => {\n          interactionCount++;\n        }, { passive: true });\n      });\n      \n      // Track engagement time\n      let engagementTime = 0;\n      let lastActiveTime = Date.now();\n      \n      const updateEngagementTime = () => {\n        const now = Date.now();\n        engagementTime += now - lastActiveTime;\n        lastActiveTime = now;\n      };\n      \n      document.addEventListener('visibilitychange', () => {\n        if (document.hidden) {\n          updateEngagementTime();\n        } else {\n          lastActiveTime = Date.now();\n        }\n      });\n      \n      window.addEventListener('beforeunload', () => {\n        updateEngagementTime();\n        this.metrics.engagement = {\n          interactions: interactionCount,\n          timeOnPage: engagementTime\n        };\n      });\n    }\n    \n    getRating(value: number, thresholds: [number, number]) {\n      if (value <= thresholds[0]) return 'good';\n      if (value <= thresholds[1]) return 'needs-improvement';\n      return 'poor';\n    }\n    \n    getResourceType(url: string) {\n      if (url.includes('.css')) return 'css';\n      if (url.includes('.js')) return 'javascript';\n      if (url.match(/\\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';\n      if (url.match(/\\.(woff|woff2|ttf|otf)$/i)) return 'font';\n      return 'other';\n    }\n    \n    logMetric(name: string, data: any) {\n      if (enableConsoleLogging) {\n        console.log(`[Performance] ${name}:`, data);\n      }\n    }\n    \n    reportMetrics() {\n      const report = {\n        url: window.location.href,\n        userAgent: navigator.userAgent,\n        timestamp: Date.now(),\n        sessionId: this.getSessionId(),\n        ...this.metrics\n      };\n      \n      if (enableAnalytics) {\n        this.sendToAnalytics(report);\n      }\n      \n      if (enableConsoleLogging) {\n        console.log('[Performance] Final Report:', report);\n      }\n    }\n    \n    sendToAnalytics(data: any) {\n      // Send to Google Analytics 4\n      if ('gtag' in window) {\n        // Core Web Vitals\n        Object.entries(data.vitals).forEach(([metric, value]: [string, any]) => {\n          (window as any).gtag('event', metric.toUpperCase(), {\n            event_category: 'Web Vitals',\n            value: Math.round(value.value),\n            custom_parameter_1: value.rating\n          });\n        });\n        \n        // Navigation timing\n        if (data.navigation.totalTime) {\n          (window as any).gtag('event', 'page_load_time', {\n            event_category: 'Performance',\n            value: Math.round(data.navigation.totalTime)\n          });\n        }\n      }\n      \n      // Send to custom analytics endpoint\n      if ('fetch' in window) {\n        fetch('/api/analytics/performance', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify(data)\n        }).catch(error => {\n          console.warn('Failed to send performance data:', error);\n        });\n      }\n    }\n    \n    getSessionId() {\n      let sessionId = sessionStorage.getItem('performance-session-id');\n      if (!sessionId) {\n        sessionId = Math.random().toString(36).substring(2, 15);\n        sessionStorage.setItem('performance-session-id', sessionId);\n      }\n      return sessionId;\n    }\n    \n    disconnect() {\n      this.observers.forEach(observer => observer.disconnect());\n      this.observers.clear();\n    }\n  }\n  \n  // Initialize performance monitoring\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      new PerformanceMonitor();\n    });\n  } else {\n    new PerformanceMonitor();\n  }\n})();<\/script> <!-- Performance monitoring styles -->"], ["<script>(function(){", "\n  class PerformanceMonitor {\n    private metrics = {\n      navigation: {},\n      vitals: {},\n      resources: [],\n      errors: []\n    };\n    \n    private observers = new Map();\n    private startTime = performance.now();\n    \n    constructor() {\n      this.init();\n    }\n    \n    init() {\n      // Only run for a sample of users\n      if (Math.random() > sampleRate) return;\n      \n      this.observeNavigationTiming();\n      this.observeCoreWebVitals();\n      this.observeResourceTiming();\n      this.observeErrors();\n      this.observeUserInteractions();\n      \n      // Report metrics when page is about to unload\n      window.addEventListener('beforeunload', () => {\n        this.reportMetrics();\n      });\n      \n      // Report metrics after page is fully loaded\n      window.addEventListener('load', () => {\n        setTimeout(() => this.reportMetrics(), 1000);\n      });\n    }\n    \n    observeNavigationTiming() {\n      window.addEventListener('load', () => {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        \n        this.metrics.navigation = {\n          // DNS and Connection\n          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,\n          tcpConnection: navigation.connectEnd - navigation.connectStart,\n          tlsHandshake: navigation.secureConnectionStart > 0 ? \n            navigation.connectEnd - navigation.secureConnectionStart : 0,\n          \n          // Request and Response\n          requestTime: navigation.responseStart - navigation.requestStart,\n          responseTime: navigation.responseEnd - navigation.responseStart,\n          \n          // DOM Processing\n          domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,\n          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,\n          \n          // Resource Loading\n          resourceLoading: navigation.loadEventStart - navigation.domContentLoadedEventEnd,\n          \n          // Total Times\n          totalTime: navigation.loadEventEnd - navigation.startTime,\n          domInteractive: navigation.domInteractive - navigation.startTime,\n          domComplete: navigation.domComplete - navigation.startTime,\n          \n          // Page Load Type\n          navigationType: navigation.type,\n          redirectCount: navigation.redirectCount\n        };\n        \n        this.logMetric('Navigation Timing', this.metrics.navigation);\n      });\n    }\n    \n    observeCoreWebVitals() {\n      // Largest Contentful Paint (LCP)\n      this.observeLCP();\n      \n      // First Input Delay (FID)\n      this.observeFID();\n      \n      // Cumulative Layout Shift (CLS)\n      this.observeCLS();\n      \n      // First Contentful Paint (FCP)\n      this.observeFCP();\n      \n      // Time to First Byte (TTFB)\n      this.observeTTFB();\n    }\n    \n    observeLCP() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          const lastEntry = entries[entries.length - 1];\n          \n          this.metrics.vitals.lcp = {\n            value: lastEntry.startTime,\n            rating: this.getRating(lastEntry.startTime, [2500, 4000]),\n            element: lastEntry.element?.tagName || 'unknown'\n          };\n          \n          this.logMetric('LCP', this.metrics.vitals.lcp);\n        });\n        \n        observer.observe({ entryTypes: ['largest-contentful-paint'] });\n        this.observers.set('lcp', observer);\n      }\n    }\n    \n    observeFID() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          entries.forEach(entry => {\n            this.metrics.vitals.fid = {\n              value: entry.processingStart - entry.startTime,\n              rating: this.getRating(entry.processingStart - entry.startTime, [100, 300]),\n              eventType: entry.name\n            };\n            \n            this.logMetric('FID', this.metrics.vitals.fid);\n          });\n        });\n        \n        observer.observe({ entryTypes: ['first-input'] });\n        this.observers.set('fid', observer);\n      }\n    }\n    \n    observeCLS() {\n      if ('PerformanceObserver' in window) {\n        let clsValue = 0;\n        let sessionValue = 0;\n        let sessionEntries = [];\n        \n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          \n          entries.forEach(entry => {\n            if (!entry.hadRecentInput) {\n              const firstSessionEntry = sessionEntries[0];\n              const lastSessionEntry = sessionEntries[sessionEntries.length - 1];\n              \n              if (sessionValue && \n                  entry.startTime - lastSessionEntry.startTime < 1000 &&\n                  entry.startTime - firstSessionEntry.startTime < 5000) {\n                sessionValue += entry.value;\n                sessionEntries.push(entry);\n              } else {\n                sessionValue = entry.value;\n                sessionEntries = [entry];\n              }\n              \n              if (sessionValue > clsValue) {\n                clsValue = sessionValue;\n                \n                this.metrics.vitals.cls = {\n                  value: clsValue,\n                  rating: this.getRating(clsValue, [0.1, 0.25]),\n                  entries: sessionEntries.length\n                };\n                \n                this.logMetric('CLS', this.metrics.vitals.cls);\n              }\n            }\n          });\n        });\n        \n        observer.observe({ entryTypes: ['layout-shift'] });\n        this.observers.set('cls', observer);\n      }\n    }\n    \n    observeFCP() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          entries.forEach(entry => {\n            if (entry.name === 'first-contentful-paint') {\n              this.metrics.vitals.fcp = {\n                value: entry.startTime,\n                rating: this.getRating(entry.startTime, [1800, 3000])\n              };\n              \n              this.logMetric('FCP', this.metrics.vitals.fcp);\n            }\n          });\n        });\n        \n        observer.observe({ entryTypes: ['paint'] });\n        this.observers.set('fcp', observer);\n      }\n    }\n    \n    observeTTFB() {\n      window.addEventListener('load', () => {\n        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;\n        const ttfb = navigation.responseStart - navigation.requestStart;\n        \n        this.metrics.vitals.ttfb = {\n          value: ttfb,\n          rating: this.getRating(ttfb, [800, 1800])\n        };\n        \n        this.logMetric('TTFB', this.metrics.vitals.ttfb);\n      });\n    }\n    \n    observeResourceTiming() {\n      if ('PerformanceObserver' in window) {\n        const observer = new PerformanceObserver((list) => {\n          const entries = list.getEntries();\n          \n          entries.forEach(entry => {\n            const resource = {\n              name: entry.name,\n              type: this.getResourceType(entry.name),\n              size: entry.transferSize || 0,\n              duration: entry.duration,\n              startTime: entry.startTime,\n              cached: entry.transferSize === 0 && entry.decodedBodySize > 0\n            };\n            \n            this.metrics.resources.push(resource);\n          });\n        });\n        \n        observer.observe({ entryTypes: ['resource'] });\n        this.observers.set('resource', observer);\n      }\n    }\n    \n    observeErrors() {\n      window.addEventListener('error', (event) => {\n        this.metrics.errors.push({\n          type: 'javascript',\n          message: event.message,\n          filename: event.filename,\n          line: event.lineno,\n          column: event.colno,\n          timestamp: Date.now()\n        });\n      });\n      \n      window.addEventListener('unhandledrejection', (event) => {\n        this.metrics.errors.push({\n          type: 'promise',\n          message: event.reason?.message || 'Unhandled promise rejection',\n          timestamp: Date.now()\n        });\n      });\n    }\n    \n    observeUserInteractions() {\n      let interactionCount = 0;\n      \n      ['click', 'keydown', 'scroll'].forEach(eventType => {\n        document.addEventListener(eventType, () => {\n          interactionCount++;\n        }, { passive: true });\n      });\n      \n      // Track engagement time\n      let engagementTime = 0;\n      let lastActiveTime = Date.now();\n      \n      const updateEngagementTime = () => {\n        const now = Date.now();\n        engagementTime += now - lastActiveTime;\n        lastActiveTime = now;\n      };\n      \n      document.addEventListener('visibilitychange', () => {\n        if (document.hidden) {\n          updateEngagementTime();\n        } else {\n          lastActiveTime = Date.now();\n        }\n      });\n      \n      window.addEventListener('beforeunload', () => {\n        updateEngagementTime();\n        this.metrics.engagement = {\n          interactions: interactionCount,\n          timeOnPage: engagementTime\n        };\n      });\n    }\n    \n    getRating(value: number, thresholds: [number, number]) {\n      if (value <= thresholds[0]) return 'good';\n      if (value <= thresholds[1]) return 'needs-improvement';\n      return 'poor';\n    }\n    \n    getResourceType(url: string) {\n      if (url.includes('.css')) return 'css';\n      if (url.includes('.js')) return 'javascript';\n      if (url.match(/\\\\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';\n      if (url.match(/\\\\.(woff|woff2|ttf|otf)$/i)) return 'font';\n      return 'other';\n    }\n    \n    logMetric(name: string, data: any) {\n      if (enableConsoleLogging) {\n        console.log(\\`[Performance] \\${name}:\\`, data);\n      }\n    }\n    \n    reportMetrics() {\n      const report = {\n        url: window.location.href,\n        userAgent: navigator.userAgent,\n        timestamp: Date.now(),\n        sessionId: this.getSessionId(),\n        ...this.metrics\n      };\n      \n      if (enableAnalytics) {\n        this.sendToAnalytics(report);\n      }\n      \n      if (enableConsoleLogging) {\n        console.log('[Performance] Final Report:', report);\n      }\n    }\n    \n    sendToAnalytics(data: any) {\n      // Send to Google Analytics 4\n      if ('gtag' in window) {\n        // Core Web Vitals\n        Object.entries(data.vitals).forEach(([metric, value]: [string, any]) => {\n          (window as any).gtag('event', metric.toUpperCase(), {\n            event_category: 'Web Vitals',\n            value: Math.round(value.value),\n            custom_parameter_1: value.rating\n          });\n        });\n        \n        // Navigation timing\n        if (data.navigation.totalTime) {\n          (window as any).gtag('event', 'page_load_time', {\n            event_category: 'Performance',\n            value: Math.round(data.navigation.totalTime)\n          });\n        }\n      }\n      \n      // Send to custom analytics endpoint\n      if ('fetch' in window) {\n        fetch('/api/analytics/performance', {\n          method: 'POST',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify(data)\n        }).catch(error => {\n          console.warn('Failed to send performance data:', error);\n        });\n      }\n    }\n    \n    getSessionId() {\n      let sessionId = sessionStorage.getItem('performance-session-id');\n      if (!sessionId) {\n        sessionId = Math.random().toString(36).substring(2, 15);\n        sessionStorage.setItem('performance-session-id', sessionId);\n      }\n      return sessionId;\n    }\n    \n    disconnect() {\n      this.observers.forEach(observer => observer.disconnect());\n      this.observers.clear();\n    }\n  }\n  \n  // Initialize performance monitoring\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      new PerformanceMonitor();\n    });\n  } else {\n    new PerformanceMonitor();\n  }\n})();<\/script> <!-- Performance monitoring styles -->"])), defineScriptVars({ enableAnalytics, enableConsoleLogging, sampleRate }));
}, "/mnt/persist/workspace/src/components/PerformanceMonitor.astro", void 0);
var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(raw || cooked.slice()) }));
var _a$4;
const $$Astro$5 = createAstro("https://nosytlabs.com");
const $$WebVitalsTracker = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$WebVitalsTracker;
  const {
    enableReporting = true,
    sampleRate = 0.1,
    endpoint = "/api/analytics/vitals"
  } = Astro2.props;
  return renderTemplate(_a$4 || (_a$4 = __template$4(["<script>(function(){", "\n  class WebVitalsTracker {\n    constructor() {\n      this.vitals = {};\n      this.sessionId = this.generateSessionId();\n      this.init();\n    }\n    \n    init() {\n      // Only track for a sample of users\n      if (Math.random() > sampleRate) return;\n      \n      this.trackCoreWebVitals();\n      this.trackCustomMetrics();\n      this.setupReporting();\n    }\n    \n    trackCoreWebVitals() {\n      // LCP - Largest Contentful Paint\n      this.observeMetric('largest-contentful-paint', (entry) => {\n        this.vitals.lcp = {\n          value: entry.startTime,\n          rating: this.getRating(entry.startTime, [2500, 4000]),\n          element: entry.element?.tagName || 'unknown',\n          url: entry.url || window.location.href\n        };\n        this.reportVital('LCP', this.vitals.lcp);\n      });\n      \n      // FID - First Input Delay\n      this.observeMetric('first-input', (entry) => {\n        this.vitals.fid = {\n          value: entry.processingStart - entry.startTime,\n          rating: this.getRating(entry.processingStart - entry.startTime, [100, 300]),\n          eventType: entry.name,\n          target: entry.target?.tagName || 'unknown'\n        };\n        this.reportVital('FID', this.vitals.fid);\n      });\n      \n      // CLS - Cumulative Layout Shift\n      let clsValue = 0;\n      let sessionValue = 0;\n      let sessionEntries = [];\n      \n      this.observeMetric('layout-shift', (entry) => {\n        if (!entry.hadRecentInput) {\n          const firstSessionEntry = sessionEntries[0];\n          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];\n          \n          if (sessionValue && \n              entry.startTime - lastSessionEntry.startTime < 1000 &&\n              entry.startTime - firstSessionEntry.startTime < 5000) {\n            sessionValue += entry.value;\n            sessionEntries.push(entry);\n          } else {\n            sessionValue = entry.value;\n            sessionEntries = [entry];\n          }\n          \n          if (sessionValue > clsValue) {\n            clsValue = sessionValue;\n            this.vitals.cls = {\n              value: clsValue,\n              rating: this.getRating(clsValue, [0.1, 0.25]),\n              entries: sessionEntries.length,\n              sources: sessionEntries.map(e => e.sources?.[0]?.node?.tagName).filter(Boolean)\n            };\n            this.reportVital('CLS', this.vitals.cls);\n          }\n        }\n      });\n      \n      // FCP - First Contentful Paint\n      this.observeMetric('paint', (entry) => {\n        if (entry.name === 'first-contentful-paint') {\n          this.vitals.fcp = {\n            value: entry.startTime,\n            rating: this.getRating(entry.startTime, [1800, 3000])\n          };\n          this.reportVital('FCP', this.vitals.fcp);\n        }\n      });\n      \n      // TTFB - Time to First Byte\n      this.observeMetric('navigation', (entry) => {\n        const ttfb = entry.responseStart - entry.requestStart;\n        this.vitals.ttfb = {\n          value: ttfb,\n          rating: this.getRating(ttfb, [800, 1800]),\n          connectionType: navigator.connection?.effectiveType || 'unknown'\n        };\n        this.reportVital('TTFB', this.vitals.ttfb);\n      });\n    }\n    \n    trackCustomMetrics() {\n      // Time to Interactive (TTI) approximation\n      this.trackTimeToInteractive();\n      \n      // Resource loading performance\n      this.trackResourcePerformance();\n      \n      // User interaction metrics\n      this.trackUserInteractions();\n      \n      // Memory usage\n      this.trackMemoryUsage();\n    }\n    \n    trackTimeToInteractive() {\n      let ttiStartTime = performance.now();\n      let isInteractive = false;\n      \n      const checkInteractive = () => {\n        if (!isInteractive && document.readyState === 'complete') {\n          // Wait for main thread to be idle\n          if ('requestIdleCallback' in window) {\n            requestIdleCallback(() => {\n              const tti = performance.now() - ttiStartTime;\n              this.vitals.tti = {\n                value: tti,\n                rating: this.getRating(tti, [3800, 7300])\n              };\n              this.reportVital('TTI', this.vitals.tti);\n              isInteractive = true;\n            });\n          } else {\n            // Fallback for browsers without requestIdleCallback\n            setTimeout(() => {\n              const tti = performance.now() - ttiStartTime;\n              this.vitals.tti = {\n                value: tti,\n                rating: this.getRating(tti, [3800, 7300])\n              };\n              this.reportVital('TTI', this.vitals.tti);\n              isInteractive = true;\n            }, 100);\n          }\n        }\n      };\n      \n      if (document.readyState === 'complete') {\n        checkInteractive();\n      } else {\n        window.addEventListener('load', checkInteractive);\n      }\n    }\n    \n    trackResourcePerformance() {\n      this.observeMetric('resource', (entry) => {\n        const resourceType = this.getResourceType(entry.name);\n        const size = entry.transferSize || 0;\n        const duration = entry.duration;\n        \n        // Track slow resources\n        if (duration > 1000 || size > 500000) {\n          this.reportCustomMetric('slow_resource', {\n            name: entry.name,\n            type: resourceType,\n            size: size,\n            duration: duration,\n            cached: entry.transferSize === 0 && entry.decodedBodySize > 0\n          });\n        }\n        \n        // Track resource efficiency\n        if (size > 0 && duration > 0) {\n          const efficiency = size / duration; // bytes per ms\n          if (efficiency < 100) {\n            this.reportCustomMetric('inefficient_resource', {\n              name: entry.name,\n              type: resourceType,\n              efficiency: efficiency\n            });\n          }\n        }\n      });\n    }\n    \n    trackUserInteractions() {\n      let interactionCount = 0;\n      let firstInteractionTime = null;\n      \n      ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {\n        document.addEventListener(eventType, (event) => {\n          interactionCount++;\n          \n          if (!firstInteractionTime) {\n            firstInteractionTime = performance.now();\n            this.reportCustomMetric('first_interaction', {\n              type: eventType,\n              time: firstInteractionTime,\n              element: event.target?.tagName || 'unknown'\n            });\n          }\n        }, { passive: true, once: eventType !== 'scroll' });\n      });\n      \n      // Track engagement time\n      let engagementStartTime = Date.now();\n      let totalEngagementTime = 0;\n      \n      const updateEngagementTime = () => {\n        const now = Date.now();\n        totalEngagementTime += now - engagementStartTime;\n        engagementStartTime = now;\n      };\n      \n      document.addEventListener('visibilitychange', () => {\n        if (document.hidden) {\n          updateEngagementTime();\n        } else {\n          engagementStartTime = Date.now();\n        }\n      });\n      \n      window.addEventListener('beforeunload', () => {\n        updateEngagementTime();\n        this.reportCustomMetric('engagement', {\n          totalTime: totalEngagementTime,\n          interactions: interactionCount,\n          engagementRate: totalEngagementTime / (Date.now() - performance.timeOrigin)\n        });\n      });\n    }\n    \n    trackMemoryUsage() {\n      if ('memory' in performance) {\n        const memoryInfo = performance.memory;\n        this.reportCustomMetric('memory_usage', {\n          usedJSHeapSize: memoryInfo.usedJSHeapSize,\n          totalJSHeapSize: memoryInfo.totalJSHeapSize,\n          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,\n          memoryPressure: memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit\n        });\n      }\n    }\n    \n    observeMetric(entryType, callback) {\n      if ('PerformanceObserver' in window) {\n        try {\n          const observer = new PerformanceObserver((list) => {\n            list.getEntries().forEach(callback);\n          });\n          observer.observe({ entryTypes: [entryType] });\n        } catch (error) {\n          console.warn(`Failed to observe ${entryType}:`, error);\n        }\n      }\n    }\n    \n    getRating(value, thresholds) {\n      if (value <= thresholds[0]) return 'good';\n      if (value <= thresholds[1]) return 'needs-improvement';\n      return 'poor';\n    }\n    \n    getResourceType(url) {\n      if (url.includes('.css')) return 'css';\n      if (url.includes('.js')) return 'javascript';\n      if (url.match(/\\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';\n      if (url.match(/\\.(woff|woff2|ttf|otf)$/i)) return 'font';\n      if (url.includes('/api/')) return 'api';\n      return 'other';\n    }\n    \n    setupReporting() {\n      // Batch reports to reduce network overhead\n      this.reportQueue = [];\n      this.reportTimer = null;\n      \n      // Send reports when page is about to unload\n      window.addEventListener('beforeunload', () => {\n        this.flushReports(true);\n      });\n      \n      // Send reports periodically\n      setInterval(() => {\n        this.flushReports();\n      }, 30000); // Every 30 seconds\n    }\n    \n    reportVital(name, data) {\n      if (!enableReporting) return;\n      \n      this.queueReport({\n        type: 'vital',\n        name: name,\n        data: data,\n        timestamp: Date.now(),\n        sessionId: this.sessionId,\n        url: window.location.href,\n        userAgent: navigator.userAgent,\n        connection: navigator.connection ? {\n          effectiveType: navigator.connection.effectiveType,\n          downlink: navigator.connection.downlink,\n          rtt: navigator.connection.rtt\n        } : null\n      });\n      \n      // Send to Google Analytics if available\n      if ('gtag' in window) {\n        window.gtag('event', name, {\n          event_category: 'Web Vitals',\n          value: Math.round(data.value),\n          custom_parameter_1: data.rating,\n          custom_parameter_2: this.sessionId\n        });\n      }\n    }\n    \n    reportCustomMetric(name, data) {\n      if (!enableReporting) return;\n      \n      this.queueReport({\n        type: 'custom',\n        name: name,\n        data: data,\n        timestamp: Date.now(),\n        sessionId: this.sessionId,\n        url: window.location.href\n      });\n    }\n    \n    queueReport(report) {\n      this.reportQueue.push(report);\n      \n      // Auto-flush if queue gets too large\n      if (this.reportQueue.length >= 10) {\n        this.flushReports();\n      }\n    }\n    \n    flushReports(immediate = false) {\n      if (this.reportQueue.length === 0) return;\n      \n      const reports = [...this.reportQueue];\n      this.reportQueue = [];\n      \n      const sendReports = () => {\n        if ('fetch' in window) {\n          fetch(endpoint, {\n            method: 'POST',\n            headers: {\n              'Content-Type': 'application/json'\n            },\n            body: JSON.stringify({\n              reports: reports,\n              meta: {\n                timestamp: Date.now(),\n                sessionId: this.sessionId,\n                url: window.location.href,\n                referrer: document.referrer,\n                viewport: {\n                  width: window.innerWidth,\n                  height: window.innerHeight\n                }\n              }\n            })\n          }).catch(error => {\n            console.warn('Failed to send performance reports:', error);\n          });\n        }\n      };\n      \n      if (immediate) {\n        // Use sendBeacon for immediate sending (e.g., on page unload)\n        if ('sendBeacon' in navigator) {\n          navigator.sendBeacon(endpoint, JSON.stringify({\n            reports: reports,\n            meta: {\n              timestamp: Date.now(),\n              sessionId: this.sessionId,\n              url: window.location.href\n            }\n          }));\n        } else {\n          sendReports();\n        }\n      } else {\n        sendReports();\n      }\n    }\n    \n    generateSessionId() {\n      return Math.random().toString(36).substring(2, 15) + \n             Math.random().toString(36).substring(2, 15);\n    }\n    \n    // Public API\n    getVitals() {\n      return { ...this.vitals };\n    }\n    \n    forceReport() {\n      this.flushReports(true);\n    }\n  }\n  \n  // Initialize Web Vitals tracking\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      window.webVitalsTracker = new WebVitalsTracker();\n    });\n  } else {\n    window.webVitalsTracker = new WebVitalsTracker();\n  }\n})();<\/script> "], ["<script>(function(){", "\n  class WebVitalsTracker {\n    constructor() {\n      this.vitals = {};\n      this.sessionId = this.generateSessionId();\n      this.init();\n    }\n    \n    init() {\n      // Only track for a sample of users\n      if (Math.random() > sampleRate) return;\n      \n      this.trackCoreWebVitals();\n      this.trackCustomMetrics();\n      this.setupReporting();\n    }\n    \n    trackCoreWebVitals() {\n      // LCP - Largest Contentful Paint\n      this.observeMetric('largest-contentful-paint', (entry) => {\n        this.vitals.lcp = {\n          value: entry.startTime,\n          rating: this.getRating(entry.startTime, [2500, 4000]),\n          element: entry.element?.tagName || 'unknown',\n          url: entry.url || window.location.href\n        };\n        this.reportVital('LCP', this.vitals.lcp);\n      });\n      \n      // FID - First Input Delay\n      this.observeMetric('first-input', (entry) => {\n        this.vitals.fid = {\n          value: entry.processingStart - entry.startTime,\n          rating: this.getRating(entry.processingStart - entry.startTime, [100, 300]),\n          eventType: entry.name,\n          target: entry.target?.tagName || 'unknown'\n        };\n        this.reportVital('FID', this.vitals.fid);\n      });\n      \n      // CLS - Cumulative Layout Shift\n      let clsValue = 0;\n      let sessionValue = 0;\n      let sessionEntries = [];\n      \n      this.observeMetric('layout-shift', (entry) => {\n        if (!entry.hadRecentInput) {\n          const firstSessionEntry = sessionEntries[0];\n          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];\n          \n          if (sessionValue && \n              entry.startTime - lastSessionEntry.startTime < 1000 &&\n              entry.startTime - firstSessionEntry.startTime < 5000) {\n            sessionValue += entry.value;\n            sessionEntries.push(entry);\n          } else {\n            sessionValue = entry.value;\n            sessionEntries = [entry];\n          }\n          \n          if (sessionValue > clsValue) {\n            clsValue = sessionValue;\n            this.vitals.cls = {\n              value: clsValue,\n              rating: this.getRating(clsValue, [0.1, 0.25]),\n              entries: sessionEntries.length,\n              sources: sessionEntries.map(e => e.sources?.[0]?.node?.tagName).filter(Boolean)\n            };\n            this.reportVital('CLS', this.vitals.cls);\n          }\n        }\n      });\n      \n      // FCP - First Contentful Paint\n      this.observeMetric('paint', (entry) => {\n        if (entry.name === 'first-contentful-paint') {\n          this.vitals.fcp = {\n            value: entry.startTime,\n            rating: this.getRating(entry.startTime, [1800, 3000])\n          };\n          this.reportVital('FCP', this.vitals.fcp);\n        }\n      });\n      \n      // TTFB - Time to First Byte\n      this.observeMetric('navigation', (entry) => {\n        const ttfb = entry.responseStart - entry.requestStart;\n        this.vitals.ttfb = {\n          value: ttfb,\n          rating: this.getRating(ttfb, [800, 1800]),\n          connectionType: navigator.connection?.effectiveType || 'unknown'\n        };\n        this.reportVital('TTFB', this.vitals.ttfb);\n      });\n    }\n    \n    trackCustomMetrics() {\n      // Time to Interactive (TTI) approximation\n      this.trackTimeToInteractive();\n      \n      // Resource loading performance\n      this.trackResourcePerformance();\n      \n      // User interaction metrics\n      this.trackUserInteractions();\n      \n      // Memory usage\n      this.trackMemoryUsage();\n    }\n    \n    trackTimeToInteractive() {\n      let ttiStartTime = performance.now();\n      let isInteractive = false;\n      \n      const checkInteractive = () => {\n        if (!isInteractive && document.readyState === 'complete') {\n          // Wait for main thread to be idle\n          if ('requestIdleCallback' in window) {\n            requestIdleCallback(() => {\n              const tti = performance.now() - ttiStartTime;\n              this.vitals.tti = {\n                value: tti,\n                rating: this.getRating(tti, [3800, 7300])\n              };\n              this.reportVital('TTI', this.vitals.tti);\n              isInteractive = true;\n            });\n          } else {\n            // Fallback for browsers without requestIdleCallback\n            setTimeout(() => {\n              const tti = performance.now() - ttiStartTime;\n              this.vitals.tti = {\n                value: tti,\n                rating: this.getRating(tti, [3800, 7300])\n              };\n              this.reportVital('TTI', this.vitals.tti);\n              isInteractive = true;\n            }, 100);\n          }\n        }\n      };\n      \n      if (document.readyState === 'complete') {\n        checkInteractive();\n      } else {\n        window.addEventListener('load', checkInteractive);\n      }\n    }\n    \n    trackResourcePerformance() {\n      this.observeMetric('resource', (entry) => {\n        const resourceType = this.getResourceType(entry.name);\n        const size = entry.transferSize || 0;\n        const duration = entry.duration;\n        \n        // Track slow resources\n        if (duration > 1000 || size > 500000) {\n          this.reportCustomMetric('slow_resource', {\n            name: entry.name,\n            type: resourceType,\n            size: size,\n            duration: duration,\n            cached: entry.transferSize === 0 && entry.decodedBodySize > 0\n          });\n        }\n        \n        // Track resource efficiency\n        if (size > 0 && duration > 0) {\n          const efficiency = size / duration; // bytes per ms\n          if (efficiency < 100) {\n            this.reportCustomMetric('inefficient_resource', {\n              name: entry.name,\n              type: resourceType,\n              efficiency: efficiency\n            });\n          }\n        }\n      });\n    }\n    \n    trackUserInteractions() {\n      let interactionCount = 0;\n      let firstInteractionTime = null;\n      \n      ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {\n        document.addEventListener(eventType, (event) => {\n          interactionCount++;\n          \n          if (!firstInteractionTime) {\n            firstInteractionTime = performance.now();\n            this.reportCustomMetric('first_interaction', {\n              type: eventType,\n              time: firstInteractionTime,\n              element: event.target?.tagName || 'unknown'\n            });\n          }\n        }, { passive: true, once: eventType !== 'scroll' });\n      });\n      \n      // Track engagement time\n      let engagementStartTime = Date.now();\n      let totalEngagementTime = 0;\n      \n      const updateEngagementTime = () => {\n        const now = Date.now();\n        totalEngagementTime += now - engagementStartTime;\n        engagementStartTime = now;\n      };\n      \n      document.addEventListener('visibilitychange', () => {\n        if (document.hidden) {\n          updateEngagementTime();\n        } else {\n          engagementStartTime = Date.now();\n        }\n      });\n      \n      window.addEventListener('beforeunload', () => {\n        updateEngagementTime();\n        this.reportCustomMetric('engagement', {\n          totalTime: totalEngagementTime,\n          interactions: interactionCount,\n          engagementRate: totalEngagementTime / (Date.now() - performance.timeOrigin)\n        });\n      });\n    }\n    \n    trackMemoryUsage() {\n      if ('memory' in performance) {\n        const memoryInfo = performance.memory;\n        this.reportCustomMetric('memory_usage', {\n          usedJSHeapSize: memoryInfo.usedJSHeapSize,\n          totalJSHeapSize: memoryInfo.totalJSHeapSize,\n          jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,\n          memoryPressure: memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit\n        });\n      }\n    }\n    \n    observeMetric(entryType, callback) {\n      if ('PerformanceObserver' in window) {\n        try {\n          const observer = new PerformanceObserver((list) => {\n            list.getEntries().forEach(callback);\n          });\n          observer.observe({ entryTypes: [entryType] });\n        } catch (error) {\n          console.warn(\\`Failed to observe \\${entryType}:\\`, error);\n        }\n      }\n    }\n    \n    getRating(value, thresholds) {\n      if (value <= thresholds[0]) return 'good';\n      if (value <= thresholds[1]) return 'needs-improvement';\n      return 'poor';\n    }\n    \n    getResourceType(url) {\n      if (url.includes('.css')) return 'css';\n      if (url.includes('.js')) return 'javascript';\n      if (url.match(/\\\\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';\n      if (url.match(/\\\\.(woff|woff2|ttf|otf)$/i)) return 'font';\n      if (url.includes('/api/')) return 'api';\n      return 'other';\n    }\n    \n    setupReporting() {\n      // Batch reports to reduce network overhead\n      this.reportQueue = [];\n      this.reportTimer = null;\n      \n      // Send reports when page is about to unload\n      window.addEventListener('beforeunload', () => {\n        this.flushReports(true);\n      });\n      \n      // Send reports periodically\n      setInterval(() => {\n        this.flushReports();\n      }, 30000); // Every 30 seconds\n    }\n    \n    reportVital(name, data) {\n      if (!enableReporting) return;\n      \n      this.queueReport({\n        type: 'vital',\n        name: name,\n        data: data,\n        timestamp: Date.now(),\n        sessionId: this.sessionId,\n        url: window.location.href,\n        userAgent: navigator.userAgent,\n        connection: navigator.connection ? {\n          effectiveType: navigator.connection.effectiveType,\n          downlink: navigator.connection.downlink,\n          rtt: navigator.connection.rtt\n        } : null\n      });\n      \n      // Send to Google Analytics if available\n      if ('gtag' in window) {\n        window.gtag('event', name, {\n          event_category: 'Web Vitals',\n          value: Math.round(data.value),\n          custom_parameter_1: data.rating,\n          custom_parameter_2: this.sessionId\n        });\n      }\n    }\n    \n    reportCustomMetric(name, data) {\n      if (!enableReporting) return;\n      \n      this.queueReport({\n        type: 'custom',\n        name: name,\n        data: data,\n        timestamp: Date.now(),\n        sessionId: this.sessionId,\n        url: window.location.href\n      });\n    }\n    \n    queueReport(report) {\n      this.reportQueue.push(report);\n      \n      // Auto-flush if queue gets too large\n      if (this.reportQueue.length >= 10) {\n        this.flushReports();\n      }\n    }\n    \n    flushReports(immediate = false) {\n      if (this.reportQueue.length === 0) return;\n      \n      const reports = [...this.reportQueue];\n      this.reportQueue = [];\n      \n      const sendReports = () => {\n        if ('fetch' in window) {\n          fetch(endpoint, {\n            method: 'POST',\n            headers: {\n              'Content-Type': 'application/json'\n            },\n            body: JSON.stringify({\n              reports: reports,\n              meta: {\n                timestamp: Date.now(),\n                sessionId: this.sessionId,\n                url: window.location.href,\n                referrer: document.referrer,\n                viewport: {\n                  width: window.innerWidth,\n                  height: window.innerHeight\n                }\n              }\n            })\n          }).catch(error => {\n            console.warn('Failed to send performance reports:', error);\n          });\n        }\n      };\n      \n      if (immediate) {\n        // Use sendBeacon for immediate sending (e.g., on page unload)\n        if ('sendBeacon' in navigator) {\n          navigator.sendBeacon(endpoint, JSON.stringify({\n            reports: reports,\n            meta: {\n              timestamp: Date.now(),\n              sessionId: this.sessionId,\n              url: window.location.href\n            }\n          }));\n        } else {\n          sendReports();\n        }\n      } else {\n        sendReports();\n      }\n    }\n    \n    generateSessionId() {\n      return Math.random().toString(36).substring(2, 15) + \n             Math.random().toString(36).substring(2, 15);\n    }\n    \n    // Public API\n    getVitals() {\n      return { ...this.vitals };\n    }\n    \n    forceReport() {\n      this.flushReports(true);\n    }\n  }\n  \n  // Initialize Web Vitals tracking\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      window.webVitalsTracker = new WebVitalsTracker();\n    });\n  } else {\n    window.webVitalsTracker = new WebVitalsTracker();\n  }\n})();<\/script> "])), defineScriptVars({ enableReporting, sampleRate, endpoint }));
}, "/mnt/persist/workspace/src/components/WebVitalsTracker.astro", void 0);
var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(raw || cooked.slice()) }));
var _a$3;
const $$Astro$4 = createAstro("https://nosytlabs.com");
const $$FontOptimizer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$FontOptimizer;
  const {
    fonts = [
      {
        family: "Inter",
        weights: [400, 500, 600, 700],
        styles: ["normal"],
        display: "swap",
        preload: true,
        subset: "latin"
      }
    ],
    strategy = "swap"
  } = Astro2.props;
  const fontPreloads = fonts.filter((font) => font.preload).map((font) => {
    const weights = font.weights || [400];
    const styles = font.styles || ["normal"];
    return weights.flatMap(
      (weight) => styles.map((style) => ({
        family: font.family,
        weight,
        style,
        display: font.display || "swap",
        subset: font.subset || "latin"
      }))
    );
  }).flat();
  const googleFontsUrl = fonts.filter((font) => font.family !== "system").map((font) => {
    const weights = font.weights || [400];
    const styles = font.styles || ["normal"];
    const weightString = weights.join(";");
    const styleString = styles.includes("italic") ? "ital," : "";
    return `${font.family}:${styleString}wght@${weightString}`;
  }).join("&family=");
  return renderTemplate(_a$3 || (_a$3 = __template$3(['<!-- Font Preconnect --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Critical Font Preloads -->', "<!-- Font CSS with optimized loading -->", "<!-- Fallback for no-JS -->", "<noscript></noscript>", " <!-- Font Loading Optimization Script --> <script>(function(){", "\n  class FontOptimizer {\n    constructor() {\n      this.loadedFonts = new Set();\n      this.fontLoadPromises = new Map();\n      this.init();\n    }\n    \n    init() {\n      this.setupFontDisplay();\n      this.preloadCriticalFonts();\n      this.setupFontLoadingEvents();\n      this.optimizeFontRendering();\n    }\n    \n    setupFontDisplay() {\n      // Add font-display CSS if not already present\n      const style = document.createElement('style');\n      style.textContent = `\n        @font-face {\n          font-family: 'Inter-fallback';\n          src: local('Arial'), local('Helvetica'), local('sans-serif');\n          font-display: block;\n          ascent-override: 90%;\n          descent-override: 22%;\n          line-gap-override: 0%;\n        }\n        \n        .font-loading {\n          font-family: 'Inter-fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        }\n        \n        .font-loaded {\n          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        }\n        \n        /* Prevent invisible text during font swap period */\n        .font-loading * {\n          font-display: ${strategy};\n        }\n      `;\n      document.head.appendChild(style);\n    }\n    \n    preloadCriticalFonts() {\n      fonts.forEach(font => {\n        if (font.preload) {\n          this.loadFont(font.family, font.weights?.[0] || 400, font.styles?.[0] || 'normal');\n        }\n      });\n    }\n    \n    async loadFont(family, weight = 400, style = 'normal') {\n      const fontKey = `${family}-${weight}-${style}`;\n      \n      if (this.loadedFonts.has(fontKey)) {\n        return Promise.resolve();\n      }\n      \n      if (this.fontLoadPromises.has(fontKey)) {\n        return this.fontLoadPromises.get(fontKey);\n      }\n      \n      const fontFace = new FontFace(\n        family,\n        `url(https://fonts.gstatic.com/s/${family.toLowerCase()}/v1/${family.toLowerCase()}-${weight}-latin.woff2)`,\n        {\n          weight: weight.toString(),\n          style: style,\n          display: strategy\n        }\n      );\n      \n      const loadPromise = fontFace.load().then(() => {\n        document.fonts.add(fontFace);\n        this.loadedFonts.add(fontKey);\n        this.onFontLoaded(family, weight, style);\n        return fontFace;\n      }).catch(error => {\n        console.warn(`Failed to load font ${fontKey}:`, error);\n        this.onFontError(family, weight, style, error);\n      });\n      \n      this.fontLoadPromises.set(fontKey, loadPromise);\n      return loadPromise;\n    }\n    \n    setupFontLoadingEvents() {\n      // Monitor font loading status\n      if ('fonts' in document) {\n        document.fonts.addEventListener('loadingdone', () => {\n          this.onAllFontsLoaded();\n        });\n        \n        document.fonts.addEventListener('loadingerror', (event) => {\n          console.warn('Font loading error:', event);\n        });\n      }\n      \n      // Fallback timeout for font loading\n      setTimeout(() => {\n        if (document.fonts.status !== 'loaded') {\n          this.onFontTimeout();\n        }\n      }, 3000); // 3 second timeout\n    }\n    \n    optimizeFontRendering() {\n      // Add loading class to body\n      document.body.classList.add('font-loading');\n      \n      // Use Intersection Observer to load fonts for visible text\n      if ('IntersectionObserver' in window) {\n        const textObserver = new IntersectionObserver((entries) => {\n          entries.forEach(entry => {\n            if (entry.isIntersecting) {\n              this.loadFontsForElement(entry.target);\n              textObserver.unobserve(entry.target);\n            }\n          });\n        }, {\n          rootMargin: '50px'\n        });\n        \n        // Observe text elements\n        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');\n        textElements.forEach(el => {\n          if (this.hasCustomFont(el)) {\n            textObserver.observe(el);\n          }\n        });\n      }\n    }\n    \n    hasCustomFont(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      return fontFamily.includes('Inter') || fontFamily.includes('custom');\n    }\n    \n    loadFontsForElement(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      const fontWeight = computedStyle.fontWeight;\n      const fontStyle = computedStyle.fontStyle;\n      \n      // Extract font family name\n      const familyMatch = fontFamily.match(/['\"]?([^'\"]+)['\"]?/);\n      if (familyMatch) {\n        const family = familyMatch[1];\n        this.loadFont(family, parseInt(fontWeight) || 400, fontStyle);\n      }\n    }\n    \n    onFontLoaded(family, weight, style) {\n      // Dispatch custom event\n      document.dispatchEvent(new CustomEvent('fontLoaded', {\n        detail: { family, weight, style }\n      }));\n      \n      // Update classes for better font rendering\n      this.updateFontClasses();\n      \n      // Track font loading performance\n      this.trackFontPerformance(family, weight, style);\n    }\n    \n    onFontError(family, weight, style, error) {\n      console.warn(`Font loading failed: ${family} ${weight} ${style}`, error);\n      \n      // Dispatch error event\n      document.dispatchEvent(new CustomEvent('fontError', {\n        detail: { family, weight, style, error }\n      }));\n      \n      // Fallback to system fonts\n      this.fallbackToSystemFonts();\n    }\n    \n    onAllFontsLoaded() {\n      document.body.classList.remove('font-loading');\n      document.body.classList.add('font-loaded');\n      \n      // Dispatch event\n      document.dispatchEvent(new CustomEvent('allFontsLoaded'));\n      \n      // Track performance\n      this.trackAllFontsLoaded();\n    }\n    \n    onFontTimeout() {\n      console.warn('Font loading timeout reached');\n      document.body.classList.remove('font-loading');\n      document.body.classList.add('font-timeout');\n      \n      // Fallback to system fonts\n      this.fallbackToSystemFonts();\n    }\n    \n    updateFontClasses() {\n      // Update elements with loaded fonts\n      const elements = document.querySelectorAll('.font-loading');\n      elements.forEach(el => {\n        if (this.elementFontsLoaded(el)) {\n          el.classList.remove('font-loading');\n          el.classList.add('font-loaded');\n        }\n      });\n    }\n    \n    elementFontsLoaded(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      const fontWeight = computedStyle.fontWeight;\n      const fontStyle = computedStyle.fontStyle;\n      \n      const familyMatch = fontFamily.match(/['\"]?([^'\"]+)['\"]?/);\n      if (familyMatch) {\n        const family = familyMatch[1];\n        const fontKey = `${family}-${fontWeight}-${fontStyle}`;\n        return this.loadedFonts.has(fontKey);\n      }\n      \n      return false;\n    }\n    \n    fallbackToSystemFonts() {\n      const style = document.createElement('style');\n      style.textContent = `\n        * {\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n        }\n      `;\n      document.head.appendChild(style);\n    }\n    \n    trackFontPerformance(family, weight, style) {\n      // Track font loading time\n      if ('performance' in window && 'getEntriesByType' in performance) {\n        const resourceEntries = performance.getEntriesByType('resource');\n        const fontEntry = resourceEntries.find(entry => \n          entry.name.includes(family.toLowerCase()) && \n          entry.name.includes('woff')\n        );\n        \n        if (fontEntry) {\n          const loadTime = fontEntry.responseEnd - fontEntry.startTime;\n          \n          // Send to analytics\n          if ('gtag' in window) {\n            window.gtag('event', 'font_load', {\n              event_category: 'Performance',\n              event_label: `${family}-${weight}-${style}`,\n              value: Math.round(loadTime)\n            });\n          }\n        }\n      }\n    }\n    \n    trackAllFontsLoaded() {\n      const loadTime = performance.now();\n      \n      // Send to analytics\n      if ('gtag' in window) {\n        window.gtag('event', 'all_fonts_loaded', {\n          event_category: 'Performance',\n          value: Math.round(loadTime)\n        });\n      }\n    }\n    \n    // Public API\n    async loadFontFamily(family, weights = [400], styles = ['normal']) {\n      const promises = weights.flatMap(weight => \n        styles.map(style => this.loadFont(family, weight, style))\n      );\n      \n      return Promise.all(promises);\n    }\n    \n    getFontLoadStatus() {\n      return {\n        loaded: Array.from(this.loadedFonts),\n        pending: Array.from(this.fontLoadPromises.keys()).filter(key => !this.loadedFonts.has(key)),\n        status: document.fonts.status\n      };\n    }\n  }\n  \n  // Initialize font optimizer\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      window.fontOptimizer = new FontOptimizer();\n    });\n  } else {\n    window.fontOptimizer = new FontOptimizer();\n  }\n})();<\/script> "], ['<!-- Font Preconnect --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- Critical Font Preloads -->', "<!-- Font CSS with optimized loading -->", "<!-- Fallback for no-JS -->", "<noscript></noscript>", " <!-- Font Loading Optimization Script --> <script>(function(){", "\n  class FontOptimizer {\n    constructor() {\n      this.loadedFonts = new Set();\n      this.fontLoadPromises = new Map();\n      this.init();\n    }\n    \n    init() {\n      this.setupFontDisplay();\n      this.preloadCriticalFonts();\n      this.setupFontLoadingEvents();\n      this.optimizeFontRendering();\n    }\n    \n    setupFontDisplay() {\n      // Add font-display CSS if not already present\n      const style = document.createElement('style');\n      style.textContent = \\`\n        @font-face {\n          font-family: 'Inter-fallback';\n          src: local('Arial'), local('Helvetica'), local('sans-serif');\n          font-display: block;\n          ascent-override: 90%;\n          descent-override: 22%;\n          line-gap-override: 0%;\n        }\n        \n        .font-loading {\n          font-family: 'Inter-fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        }\n        \n        .font-loaded {\n          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        }\n        \n        /* Prevent invisible text during font swap period */\n        .font-loading * {\n          font-display: \\${strategy};\n        }\n      \\`;\n      document.head.appendChild(style);\n    }\n    \n    preloadCriticalFonts() {\n      fonts.forEach(font => {\n        if (font.preload) {\n          this.loadFont(font.family, font.weights?.[0] || 400, font.styles?.[0] || 'normal');\n        }\n      });\n    }\n    \n    async loadFont(family, weight = 400, style = 'normal') {\n      const fontKey = \\`\\${family}-\\${weight}-\\${style}\\`;\n      \n      if (this.loadedFonts.has(fontKey)) {\n        return Promise.resolve();\n      }\n      \n      if (this.fontLoadPromises.has(fontKey)) {\n        return this.fontLoadPromises.get(fontKey);\n      }\n      \n      const fontFace = new FontFace(\n        family,\n        \\`url(https://fonts.gstatic.com/s/\\${family.toLowerCase()}/v1/\\${family.toLowerCase()}-\\${weight}-latin.woff2)\\`,\n        {\n          weight: weight.toString(),\n          style: style,\n          display: strategy\n        }\n      );\n      \n      const loadPromise = fontFace.load().then(() => {\n        document.fonts.add(fontFace);\n        this.loadedFonts.add(fontKey);\n        this.onFontLoaded(family, weight, style);\n        return fontFace;\n      }).catch(error => {\n        console.warn(\\`Failed to load font \\${fontKey}:\\`, error);\n        this.onFontError(family, weight, style, error);\n      });\n      \n      this.fontLoadPromises.set(fontKey, loadPromise);\n      return loadPromise;\n    }\n    \n    setupFontLoadingEvents() {\n      // Monitor font loading status\n      if ('fonts' in document) {\n        document.fonts.addEventListener('loadingdone', () => {\n          this.onAllFontsLoaded();\n        });\n        \n        document.fonts.addEventListener('loadingerror', (event) => {\n          console.warn('Font loading error:', event);\n        });\n      }\n      \n      // Fallback timeout for font loading\n      setTimeout(() => {\n        if (document.fonts.status !== 'loaded') {\n          this.onFontTimeout();\n        }\n      }, 3000); // 3 second timeout\n    }\n    \n    optimizeFontRendering() {\n      // Add loading class to body\n      document.body.classList.add('font-loading');\n      \n      // Use Intersection Observer to load fonts for visible text\n      if ('IntersectionObserver' in window) {\n        const textObserver = new IntersectionObserver((entries) => {\n          entries.forEach(entry => {\n            if (entry.isIntersecting) {\n              this.loadFontsForElement(entry.target);\n              textObserver.unobserve(entry.target);\n            }\n          });\n        }, {\n          rootMargin: '50px'\n        });\n        \n        // Observe text elements\n        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');\n        textElements.forEach(el => {\n          if (this.hasCustomFont(el)) {\n            textObserver.observe(el);\n          }\n        });\n      }\n    }\n    \n    hasCustomFont(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      return fontFamily.includes('Inter') || fontFamily.includes('custom');\n    }\n    \n    loadFontsForElement(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      const fontWeight = computedStyle.fontWeight;\n      const fontStyle = computedStyle.fontStyle;\n      \n      // Extract font family name\n      const familyMatch = fontFamily.match(/['\"]?([^'\"]+)['\"]?/);\n      if (familyMatch) {\n        const family = familyMatch[1];\n        this.loadFont(family, parseInt(fontWeight) || 400, fontStyle);\n      }\n    }\n    \n    onFontLoaded(family, weight, style) {\n      // Dispatch custom event\n      document.dispatchEvent(new CustomEvent('fontLoaded', {\n        detail: { family, weight, style }\n      }));\n      \n      // Update classes for better font rendering\n      this.updateFontClasses();\n      \n      // Track font loading performance\n      this.trackFontPerformance(family, weight, style);\n    }\n    \n    onFontError(family, weight, style, error) {\n      console.warn(\\`Font loading failed: \\${family} \\${weight} \\${style}\\`, error);\n      \n      // Dispatch error event\n      document.dispatchEvent(new CustomEvent('fontError', {\n        detail: { family, weight, style, error }\n      }));\n      \n      // Fallback to system fonts\n      this.fallbackToSystemFonts();\n    }\n    \n    onAllFontsLoaded() {\n      document.body.classList.remove('font-loading');\n      document.body.classList.add('font-loaded');\n      \n      // Dispatch event\n      document.dispatchEvent(new CustomEvent('allFontsLoaded'));\n      \n      // Track performance\n      this.trackAllFontsLoaded();\n    }\n    \n    onFontTimeout() {\n      console.warn('Font loading timeout reached');\n      document.body.classList.remove('font-loading');\n      document.body.classList.add('font-timeout');\n      \n      // Fallback to system fonts\n      this.fallbackToSystemFonts();\n    }\n    \n    updateFontClasses() {\n      // Update elements with loaded fonts\n      const elements = document.querySelectorAll('.font-loading');\n      elements.forEach(el => {\n        if (this.elementFontsLoaded(el)) {\n          el.classList.remove('font-loading');\n          el.classList.add('font-loaded');\n        }\n      });\n    }\n    \n    elementFontsLoaded(element) {\n      const computedStyle = window.getComputedStyle(element);\n      const fontFamily = computedStyle.fontFamily;\n      const fontWeight = computedStyle.fontWeight;\n      const fontStyle = computedStyle.fontStyle;\n      \n      const familyMatch = fontFamily.match(/['\"]?([^'\"]+)['\"]?/);\n      if (familyMatch) {\n        const family = familyMatch[1];\n        const fontKey = \\`\\${family}-\\${fontWeight}-\\${fontStyle}\\`;\n        return this.loadedFonts.has(fontKey);\n      }\n      \n      return false;\n    }\n    \n    fallbackToSystemFonts() {\n      const style = document.createElement('style');\n      style.textContent = \\`\n        * {\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n        }\n      \\`;\n      document.head.appendChild(style);\n    }\n    \n    trackFontPerformance(family, weight, style) {\n      // Track font loading time\n      if ('performance' in window && 'getEntriesByType' in performance) {\n        const resourceEntries = performance.getEntriesByType('resource');\n        const fontEntry = resourceEntries.find(entry => \n          entry.name.includes(family.toLowerCase()) && \n          entry.name.includes('woff')\n        );\n        \n        if (fontEntry) {\n          const loadTime = fontEntry.responseEnd - fontEntry.startTime;\n          \n          // Send to analytics\n          if ('gtag' in window) {\n            window.gtag('event', 'font_load', {\n              event_category: 'Performance',\n              event_label: \\`\\${family}-\\${weight}-\\${style}\\`,\n              value: Math.round(loadTime)\n            });\n          }\n        }\n      }\n    }\n    \n    trackAllFontsLoaded() {\n      const loadTime = performance.now();\n      \n      // Send to analytics\n      if ('gtag' in window) {\n        window.gtag('event', 'all_fonts_loaded', {\n          event_category: 'Performance',\n          value: Math.round(loadTime)\n        });\n      }\n    }\n    \n    // Public API\n    async loadFontFamily(family, weights = [400], styles = ['normal']) {\n      const promises = weights.flatMap(weight => \n        styles.map(style => this.loadFont(family, weight, style))\n      );\n      \n      return Promise.all(promises);\n    }\n    \n    getFontLoadStatus() {\n      return {\n        loaded: Array.from(this.loadedFonts),\n        pending: Array.from(this.fontLoadPromises.keys()).filter(key => !this.loadedFonts.has(key)),\n        status: document.fonts.status\n      };\n    }\n  }\n  \n  // Initialize font optimizer\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n      window.fontOptimizer = new FontOptimizer();\n    });\n  } else {\n    window.fontOptimizer = new FontOptimizer();\n  }\n})();<\/script> "])), fontPreloads.slice(0, 2).map((font) => renderTemplate`<link rel="preload"${addAttribute(`https://fonts.gstatic.com/s/${font.family.toLowerCase()}/v1/${font.family.toLowerCase()}-${font.weight}-${font.subset}.woff2`, "href")} as="font" type="font/woff2" crossorigin>`), googleFontsUrl && renderTemplate`<link rel="stylesheet"${addAttribute(`https://fonts.googleapis.com/css2?family=${googleFontsUrl}&display=${strategy}`, "href")} media="print" onload="this.media='all'">`, maybeRenderHead(), googleFontsUrl && renderTemplate`<link rel="stylesheet"${addAttribute(`https://fonts.googleapis.com/css2?family=${googleFontsUrl}&display=${strategy}`, "href")}>`, defineScriptVars({ fonts, strategy }));
}, "/mnt/persist/workspace/src/components/FontOptimizer.astro", void 0);
var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2, _b;
const $$Astro$3 = createAstro("https://nosytlabs.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "NosytLabs - Notable Opportunities Shape Your Tomorrow",
    description = "NosytLabs - Innovative digital solutions that help businesses thrive in the modern landscape.",
    ogImage = "/images/nosytlabs-og.jpg",
    isNosytOS95 = false,
    pageType = "default"
  } = Astro2.props;
  const pageId = `page-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(_b || (_b = __template$2(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><!-- Favicons - Updated with NosytLabs logo 2025 --><link rel="icon" type="image/svg+xml" href="/images/nosytlabs-logo-2025.svg"><link rel="shortcut icon" href="/favicon.ico"><!-- Standard Favicons --><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"><!-- Apple Touch Icon --><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><!-- Web Manifest --><link rel="manifest" href="/site.webmanifest"><!-- Theme Colors --><meta name="theme-color" content="#4C1D95"><meta name="msapplication-TileColor" content="#4C1D95"><!-- Open Graph / Social Media --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="twitter:card" content="summary_large_image"><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Canonical URL --><link rel="canonical"', '><!-- Keywords --><meta name="keywords" content="AI solutions, web development, mobile apps, 3D printing, technology"><!-- Structured Data for Organization --><script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "Organization",\n      "name": "NosytLabs",\n      "url": "https://nosytlabs.com",\n      "logo": "https://nosytlabs.com/images/nosytlabs-logo-2025.svg",\n      "description": "Notable Opportunities Shape Your Tomorrow - Innovative digital solutions that help businesses thrive in the modern landscape.",\n      "sameAs": [\n        "https://github.com/NosytLabs",\n        "https://kick.com/Tycen",\n        "https://www.youtube.com/@TycenYT",\n        "https://crealitycloud.com/user/9519489699"\n      ]\n    }\n  <\/script><!-- Critical CSS Inlining -->', "<!-- Font Optimization -->", `<!-- Resource hints for critical resources --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin><link rel="dns-prefetch" href="https://vercel-insights.com"><link rel="dns-prefetch" href="https://vitals.vercel-analytics.com"><!-- Preload critical resources --><link rel="preload" href="/images/nosytlabs-logo-2025.svg" as="image" fetchpriority="high"><link rel="preload" href="/styles/global.css" as="style"><link rel="preload" href="/scripts/main.js" as="script"><!-- DNS prefetch for external resources --><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"><!-- Fonts with optimized loading --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">`, '<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript><!-- Font Awesome --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><!-- Global styles --><link rel="stylesheet" href="/styles/global.css"><!-- NosytOS95 specific styles - only loaded on the NosytOS95 page -->', '<!-- Core functionality - high priority --><script src="/scripts/main.js" defer fetchpriority="high"><\/script><!-- NosytOS95 specific scripts are now loaded directly in the nosytos95.astro page -->', "<!-- Service Worker Registration -->", "</head> <body", ' class="overflow-x-hidden overflow-y-auto"> <!-- Skip to main content link for accessibility --> <a href="#main-content" class="skip-link">Skip to main content</a> <!-- Header - Only show modern header on non-NosytOS95 pages --> ', ' <!-- Main Content --> <main id="main-content" class="min-h-screen relative"> ', ' <!-- Main Content --> <div class="relative z-10"> ', " </div> </main> <!-- Footer - Only show modern footer on non-NosytOS95 pages --> ", " <!-- Search Modal - Available on all pages --> ", " <!-- Back to top button --> ", " <!-- Theme toggle script --> <script>\n    // Check for saved theme preference or use system preference\n    const getThemePreference = () => {\n      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {\n        return localStorage.getItem('theme');\n      }\n      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n    };\n\n    // Apply theme\n    const theme = getThemePreference();\n    document.documentElement.classList.toggle('dark', theme === 'dark');\n\n    // Store theme preference\n    if (typeof localStorage !== 'undefined') {\n      localStorage.setItem('theme', theme);\n    }\n  <\/script> <!-- Back to top button script -->  <!-- Performance Monitoring --> ", " <!-- Web Vitals Tracking --> ", " <!-- Vercel Analytics --> ", " </body></html>"])), title, addAttribute(description, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(new URL(Astro2.url.pathname, Astro2.site || "https://nosytlabs.com").href, "href"), renderComponent($$result, "CriticalCSS", $$CriticalCSS, { "page": isNosytOS95 ? "nosytos95" : pageType }), renderComponent($$result, "FontOptimizer", $$FontOptimizer, { "strategy": "swap" }), maybeRenderHead(), isNosytOS95 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<link rel="stylesheet" href="/styles/win95-authentic.css"><link rel="stylesheet" href="/styles/ms-sans-serif.css"><link rel="stylesheet" href="/styles/nosyt-window-manager.css"><link rel="stylesheet" href="/styles/nosyt-bsod.css"><link rel="stylesheet" href="/styles/nosyt-ai.css"><link rel="stylesheet" href="/styles/nosyt-file-explorer.css">` })}`, isNosytOS95 && renderTemplate(_a$2 || (_a$2 = __template$2(["<script>\n      // NosytOS95 scripts are loaded inline to avoid import errors\n      console.log('NosytOS95 scripts loaded');\n    <\/script>"]))), renderHead(), addAttribute(pageId, "id"), !isNosytOS95 && renderTemplate`${renderComponent($$result, "Header", $$Header, {})}`, !isNosytOS95 && renderTemplate`<div id="particle-background" class="particle-background absolute inset-0 pointer-events-none z-0" data-color="rgba(76, 29, 149, 0.2)" data-secondary-color="rgba(255, 107, 0, 0.2)" data-particle-count="100" data-particle-size="3" data-particle-speed="1" data-interactive="true" data-connect-particles="true" data-gradient="true"></div>`, renderSlot($$result, $$slots["default"]), !isNosytOS95 && renderTemplate`${renderComponent($$result, "Footer", $$Footer, {})}`, !isNosytOS95 && renderTemplate`${renderComponent($$result, "SearchModal", $$SearchModal, {})}`, !isNosytOS95 && renderTemplate`<button id="back-to-top" class="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 invisible z-50" aria-label="Back to top"> <i class="fas fa-arrow-up"></i> </button>`, renderComponent($$result, "PerformanceMonitor", $$PerformanceMonitor, { "enableAnalytics": true, "enableConsoleLogging": false, "sampleRate": 0.1 }), renderComponent($$result, "WebVitalsTracker", $$WebVitalsTracker, { "enableReporting": true, "sampleRate": 0.1 }), renderComponent($$result, "VercelAnalytics", $$VercelAnalytics, {}));
}, "/mnt/persist/workspace/src/layouts/BaseLayout.astro", void 0);
const $$Astro$2 = createAstro("https://nosytlabs.com");
const $$AdminSidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$AdminSidebar;
  return renderTemplate`${maybeRenderHead()}<aside class="admin-sidebar" data-astro-cid-upom7in7> <div class="sidebar-header" data-astro-cid-upom7in7> <img src="/images/nosytlabs-logo-2025.svg" alt="NosytLabs Logo" class="sidebar-logo" data-astro-cid-upom7in7> <h2 data-astro-cid-upom7in7>NosytLabs</h2> </div> <nav class="sidebar-nav" data-astro-cid-upom7in7> <ul data-astro-cid-upom7in7> <li data-astro-cid-upom7in7> <a href="/admin" class="sidebar-link"${addAttribute(Astro2.url.pathname === "/admin", "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Dashboard</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/projects" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/projects"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Projects</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/blog" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/blog"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Blog Posts</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/media" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/media"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Media</span> </a> </li> <li data-astro-cid-upom7in7> <a href="/admin/settings" class="sidebar-link"${addAttribute(Astro2.url.pathname.includes("/admin/settings"), "data-active")} data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-upom7in7></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Settings</span> </a> </li> </ul> </nav> <div class="sidebar-footer" data-astro-cid-upom7in7> <button id="logout-btn" class="logout-btn" data-astro-cid-upom7in7> <svg xmlns="http://www.w3.org/2000/svg" class="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-upom7in7> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-astro-cid-upom7in7></path> </svg> <span data-astro-cid-upom7in7>Logout</span> </button> </div> </aside>  `;
}, "/mnt/persist/workspace/src/components/admin/AdminSidebar.astro", void 0);
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$AdminHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$AdminHeader;
  const { title } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="admin-header" data-astro-cid-ezdk3gz6> <h1 data-astro-cid-ezdk3gz6>${title}</h1> <div class="header-actions" data-astro-cid-ezdk3gz6> <button id="theme-toggle-admin" class="theme-toggle-btn" aria-label="Toggle dark mode" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon light-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" data-astro-cid-ezdk3gz6></path> </svg> <svg xmlns="http://www.w3.org/2000/svg" class="theme-icon dark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" data-astro-cid-ezdk3gz6></path> </svg> </button> <div class="user-menu" data-astro-cid-ezdk3gz6> <button id="user-menu-btn" class="user-menu-btn" data-astro-cid-ezdk3gz6> <img src="/images/admin/avatar.png" alt="Admin User" class="user-avatar" onerror="this.src='/images/admin/avatar-placeholder.png'" data-astro-cid-ezdk3gz6> <span class="admin-user-info" data-astro-cid-ezdk3gz6>Admin</span> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-ezdk3gz6></path> </svg> </button> <div id="user-dropdown" class="user-dropdown" data-astro-cid-ezdk3gz6> <a href="/admin/profile" class="dropdown-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Profile</span> </a> <a href="/admin/settings" class="dropdown-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" data-astro-cid-ezdk3gz6></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Settings</span> </a> <div class="dropdown-divider" data-astro-cid-ezdk3gz6></div> <button id="logout-btn" class="dropdown-item logout-item" data-astro-cid-ezdk3gz6> <svg xmlns="http://www.w3.org/2000/svg" class="dropdown-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-ezdk3gz6> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-astro-cid-ezdk3gz6></path> </svg> <span data-astro-cid-ezdk3gz6>Logout</span> </button> </div> </div> </div> </header>  `;
}, "/mnt/persist/workspace/src/components/admin/AdminHeader.astro", void 0);
const $$Index$2 = createComponent(($$result, $$props, $$slots) => {
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
}, "/mnt/persist/workspace/src/pages/admin/blog/index.astro", void 0);
const $$file$2 = "/mnt/persist/workspace/src/pages/admin/blog/index.astro";
const $$url$2 = "/admin/blog.html";
const _page$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$2, file: $$file$2, url: $$url$2 }, Symbol.toStringTag, { value: "Module" }));
const page$2 = () => _page$2;
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
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
}, "/mnt/persist/workspace/src/pages/admin/projects/index.astro", void 0);
const $$file$1 = "/mnt/persist/workspace/src/pages/admin/projects/index.astro";
const $$url$1 = "/admin/projects.html";
const _page$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index$1, file: $$file$1, url: $$url$1 }, Symbol.toStringTag, { value: "Module" }));
const page$1 = () => _page$1;
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro = createAstro("https://nosytlabs.com");
const $$AdminMessages = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminMessages;
  const { title = "Messages & Submissions" } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="admin-messages" data-astro-cid-kiit2kx7> <div class="messages-header" data-astro-cid-kiit2kx7> <h2 data-astro-cid-kiit2kx7>', `</h2> <div class="messages-stats" data-astro-cid-kiit2kx7> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="contact-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Contact Forms</div> </div> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="booking-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Service Bookings</div> </div> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="newsletter-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Newsletter Subs</div> </div> </div> </div> <div class="messages-tabs" data-astro-cid-kiit2kx7> <button class="tab-btn active" data-tab="contact" data-astro-cid-kiit2kx7>Contact Forms</button> <button class="tab-btn" data-tab="bookings" data-astro-cid-kiit2kx7>Service Bookings</button> <button class="tab-btn" data-tab="newsletter" data-astro-cid-kiit2kx7>Newsletter</button> </div> <div class="messages-content" data-astro-cid-kiit2kx7> <!-- Contact Forms Tab --> <div class="tab-content active" id="contact-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="contact-search" placeholder="Search contact forms..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-contact" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-contact" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="contact-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📧</div> <h3 data-astro-cid-kiit2kx7>No contact forms yet</h3> <p data-astro-cid-kiit2kx7>Contact form submissions will appear here</p> </div> </div> </div> <!-- Service Bookings Tab --> <div class="tab-content" id="bookings-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="booking-search" placeholder="Search bookings..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-bookings" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-bookings" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="bookings-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📅</div> <h3 data-astro-cid-kiit2kx7>No service bookings yet</h3> <p data-astro-cid-kiit2kx7>Service booking requests will appear here</p> </div> </div> </div> <!-- Newsletter Tab --> <div class="tab-content" id="newsletter-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="newsletter-search" placeholder="Search subscribers..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-newsletter" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-newsletter" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="newsletter-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📰</div> <h3 data-astro-cid-kiit2kx7>No newsletter subscribers yet</h3> <p data-astro-cid-kiit2kx7>Newsletter subscriptions will appear here</p> </div> </div> </div> </div> </div>  <script type="module">
  import emailService from '../../utils/emailService.js';

  document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(\`\${tabId}-tab\`).classList.add('active');
        
        // Load data for the active tab
        loadTabData(tabId);
      });
    });

    // Load initial data
    loadTabData('contact');
    updateStats();

    // Search functionality
    setupSearch('contact');
    setupSearch('bookings');
    setupSearch('newsletter');

    // Export functionality
    setupExport('contact');
    setupExport('bookings');
    setupExport('newsletter');

    // Clear functionality
    setupClear('contact');
    setupClear('bookings');
    setupClear('newsletter');

    function loadTabData(tab) {
      switch (tab) {
        case 'contact':
          loadContactForms();
          break;
        case 'bookings':
          loadBookings();
          break;
        case 'newsletter':
          loadNewsletterSubscriptions();
          break;
      }
    }

    function loadContactForms() {
      const submissions = emailService.getContactSubmissions();
      const container = document.getElementById('contact-list');
      
      if (submissions.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">📧</div>
            <h3>No contact forms yet</h3>
            <p>Contact form submissions will appear here</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = submissions.map(submission => \`
        <div class="message-item" data-id="\${submission.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\${submission.name}</h4>
              <div class="message-meta">
                \${submission.email} • \${new Date(submission.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="replyToContact('\${submission.email}')">Reply</button>
              <button class="action-btn" onclick="deleteMessage('contact', '\${submission.id}')">Delete</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Subject:</span>
              <span class="field-value">\${submission.subject}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Message:</span>
              <div class="field-value">\${submission.message.replace(/\\n/g, '<br>')}</div>
            </div>
            <div class="message-field">
              <span class="field-label">IP:</span>
              <span class="field-value">\${submission.ip}</span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function loadBookings() {
      const bookings = emailService.getBookingSubmissions();
      const container = document.getElementById('bookings-list');
      
      if (bookings.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No service bookings yet</h3>
            <p>Service booking requests will appear here</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = bookings.map(booking => \`
        <div class="message-item" data-id="\${booking.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\${booking.name}</h4>
              <div class="message-meta">
                \${booking.email} • \${new Date(booking.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="replyToContact('\${booking.email}')">Reply</button>
              <button class="action-btn" onclick="deleteMessage('bookings', '\${booking.id}')">Delete</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Service:</span>
              <span class="field-value">\${booking.service}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Budget:</span>
              <span class="field-value">\${booking.budget || 'Not specified'}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Timeline:</span>
              <span class="field-value">\${booking.timeline || 'Not specified'}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Description:</span>
              <div class="field-value">\${(booking.description || 'No description provided').replace(/\\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function loadNewsletterSubscriptions() {
      const subscriptions = emailService.getNewsletterSubscriptions();
      const container = document.getElementById('newsletter-list');
      
      if (subscriptions.length === 0) {
        container.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">📰</div>
            <h3>No newsletter subscribers yet</h3>
            <p>Newsletter subscriptions will appear here</p>
          </div>
        \`;
        return;
      }

      container.innerHTML = subscriptions.map(subscription => \`
        <div class="message-item" data-id="\${subscription.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\${subscription.name || 'Anonymous'}</h4>
              <div class="message-meta">
                \${subscription.email} • \${new Date(subscription.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="deleteMessage('newsletter', '\${subscription.id}')">Remove</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Source:</span>
              <span class="field-value">\${subscription.source}</span>
            </div>
          </div>
        </div>
      \`).join('');
    }

    function updateStats() {
      const contactCount = emailService.getContactSubmissions().length;
      const bookingCount = emailService.getBookingSubmissions().length;
      const newsletterCount = emailService.getNewsletterSubscriptions().length;

      document.getElementById('contact-count').textContent = contactCount;
      document.getElementById('booking-count').textContent = bookingCount;
      document.getElementById('newsletter-count').textContent = newsletterCount;
    }

    function setupSearch(type) {
      const searchInput = document.getElementById(\`\${type}-search\`);
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll(\`#\${type}-list .message-item\`);
        
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'block' : 'none';
        });
      });
    }

    function setupExport(type) {
      const exportBtn = document.getElementById(\`export-\${type}\`);
      exportBtn.addEventListener('click', () => {
        let data = [];
        
        switch (type) {
          case 'contact':
            data = emailService.getContactSubmissions();
            break;
          case 'bookings':
            data = emailService.getBookingSubmissions();
            break;
          case 'newsletter':
            data = emailService.getNewsletterSubscriptions();
            break;
        }

        if (data.length === 0) {
          alert('No data to export');
          return;
        }

        exportToCSV(data, \`nosytlabs-\${type}-\${new Date().toISOString().split('T')[0]}.csv\`);
      });
    }

    function setupClear(type) {
      const clearBtn = document.getElementById(\`clear-\${type}\`);
      clearBtn.addEventListener('click', () => {
        if (confirm(\`Are you sure you want to clear all \${type} data? This cannot be undone.\`)) {
          localStorage.removeItem(\`nosytlabs_\${type}_submissions\`);
          loadTabData(type);
          updateStats();
        }
      });
    }

    function exportToCSV(data, filename) {
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            return \`"\${value.toString().replace(/"/g, '""')}"\`;
          }).join(',')
        )
      ].join('\\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    // Global functions for button actions
    window.replyToContact = function(email) {
      window.location.href = \`mailto:\${email}\`;
    };

    window.deleteMessage = function(type, id) {
      if (confirm('Are you sure you want to delete this message?')) {
        let storageKey = '';
        switch (type) {
          case 'contact':
            storageKey = 'nosytlabs_contact_submissions';
            break;
          case 'bookings':
            storageKey = 'nosytlabs_booking_submissions';
            break;
          case 'newsletter':
            storageKey = 'nosytlabs_newsletter_subscriptions';
            break;
        }

        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filteredData = data.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filteredData));
        
        loadTabData(type);
        updateStats();
      }
    };

    // Auto-refresh data every 30 seconds
    setInterval(() => {
      const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
      loadTabData(activeTab);
      updateStats();
    }, 30000);
  });
<\/script>`], ["", '<div class="admin-messages" data-astro-cid-kiit2kx7> <div class="messages-header" data-astro-cid-kiit2kx7> <h2 data-astro-cid-kiit2kx7>', `</h2> <div class="messages-stats" data-astro-cid-kiit2kx7> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="contact-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Contact Forms</div> </div> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="booking-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Service Bookings</div> </div> <div class="stat-card" data-astro-cid-kiit2kx7> <div class="stat-number" id="newsletter-count" data-astro-cid-kiit2kx7>0</div> <div class="stat-label" data-astro-cid-kiit2kx7>Newsletter Subs</div> </div> </div> </div> <div class="messages-tabs" data-astro-cid-kiit2kx7> <button class="tab-btn active" data-tab="contact" data-astro-cid-kiit2kx7>Contact Forms</button> <button class="tab-btn" data-tab="bookings" data-astro-cid-kiit2kx7>Service Bookings</button> <button class="tab-btn" data-tab="newsletter" data-astro-cid-kiit2kx7>Newsletter</button> </div> <div class="messages-content" data-astro-cid-kiit2kx7> <!-- Contact Forms Tab --> <div class="tab-content active" id="contact-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="contact-search" placeholder="Search contact forms..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-contact" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-contact" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="contact-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📧</div> <h3 data-astro-cid-kiit2kx7>No contact forms yet</h3> <p data-astro-cid-kiit2kx7>Contact form submissions will appear here</p> </div> </div> </div> <!-- Service Bookings Tab --> <div class="tab-content" id="bookings-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="booking-search" placeholder="Search bookings..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-bookings" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-bookings" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="bookings-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📅</div> <h3 data-astro-cid-kiit2kx7>No service bookings yet</h3> <p data-astro-cid-kiit2kx7>Service booking requests will appear here</p> </div> </div> </div> <!-- Newsletter Tab --> <div class="tab-content" id="newsletter-tab" data-astro-cid-kiit2kx7> <div class="messages-toolbar" data-astro-cid-kiit2kx7> <div class="search-box" data-astro-cid-kiit2kx7> <input type="text" id="newsletter-search" placeholder="Search subscribers..." data-astro-cid-kiit2kx7> <button class="search-btn" data-astro-cid-kiit2kx7>🔍</button> </div> <div class="toolbar-actions" data-astro-cid-kiit2kx7> <button class="btn-secondary" id="export-newsletter" data-astro-cid-kiit2kx7>Export CSV</button> <button class="btn-danger" id="clear-newsletter" data-astro-cid-kiit2kx7>Clear All</button> </div> </div> <div class="messages-list" id="newsletter-list" data-astro-cid-kiit2kx7> <div class="empty-state" data-astro-cid-kiit2kx7> <div class="empty-icon" data-astro-cid-kiit2kx7>📰</div> <h3 data-astro-cid-kiit2kx7>No newsletter subscribers yet</h3> <p data-astro-cid-kiit2kx7>Newsletter subscriptions will appear here</p> </div> </div> </div> </div> </div>  <script type="module">
  import emailService from '../../utils/emailService.js';

  document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        document.getElementById(\\\`\\\${tabId}-tab\\\`).classList.add('active');
        
        // Load data for the active tab
        loadTabData(tabId);
      });
    });

    // Load initial data
    loadTabData('contact');
    updateStats();

    // Search functionality
    setupSearch('contact');
    setupSearch('bookings');
    setupSearch('newsletter');

    // Export functionality
    setupExport('contact');
    setupExport('bookings');
    setupExport('newsletter');

    // Clear functionality
    setupClear('contact');
    setupClear('bookings');
    setupClear('newsletter');

    function loadTabData(tab) {
      switch (tab) {
        case 'contact':
          loadContactForms();
          break;
        case 'bookings':
          loadBookings();
          break;
        case 'newsletter':
          loadNewsletterSubscriptions();
          break;
      }
    }

    function loadContactForms() {
      const submissions = emailService.getContactSubmissions();
      const container = document.getElementById('contact-list');
      
      if (submissions.length === 0) {
        container.innerHTML = \\\`
          <div class="empty-state">
            <div class="empty-icon">📧</div>
            <h3>No contact forms yet</h3>
            <p>Contact form submissions will appear here</p>
          </div>
        \\\`;
        return;
      }

      container.innerHTML = submissions.map(submission => \\\`
        <div class="message-item" data-id="\\\${submission.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\\\${submission.name}</h4>
              <div class="message-meta">
                \\\${submission.email} • \\\${new Date(submission.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="replyToContact('\\\${submission.email}')">Reply</button>
              <button class="action-btn" onclick="deleteMessage('contact', '\\\${submission.id}')">Delete</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Subject:</span>
              <span class="field-value">\\\${submission.subject}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Message:</span>
              <div class="field-value">\\\${submission.message.replace(/\\\\n/g, '<br>')}</div>
            </div>
            <div class="message-field">
              <span class="field-label">IP:</span>
              <span class="field-value">\\\${submission.ip}</span>
            </div>
          </div>
        </div>
      \\\`).join('');
    }

    function loadBookings() {
      const bookings = emailService.getBookingSubmissions();
      const container = document.getElementById('bookings-list');
      
      if (bookings.length === 0) {
        container.innerHTML = \\\`
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No service bookings yet</h3>
            <p>Service booking requests will appear here</p>
          </div>
        \\\`;
        return;
      }

      container.innerHTML = bookings.map(booking => \\\`
        <div class="message-item" data-id="\\\${booking.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\\\${booking.name}</h4>
              <div class="message-meta">
                \\\${booking.email} • \\\${new Date(booking.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="replyToContact('\\\${booking.email}')">Reply</button>
              <button class="action-btn" onclick="deleteMessage('bookings', '\\\${booking.id}')">Delete</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Service:</span>
              <span class="field-value">\\\${booking.service}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Budget:</span>
              <span class="field-value">\\\${booking.budget || 'Not specified'}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Timeline:</span>
              <span class="field-value">\\\${booking.timeline || 'Not specified'}</span>
            </div>
            <div class="message-field">
              <span class="field-label">Description:</span>
              <div class="field-value">\\\${(booking.description || 'No description provided').replace(/\\\\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      \\\`).join('');
    }

    function loadNewsletterSubscriptions() {
      const subscriptions = emailService.getNewsletterSubscriptions();
      const container = document.getElementById('newsletter-list');
      
      if (subscriptions.length === 0) {
        container.innerHTML = \\\`
          <div class="empty-state">
            <div class="empty-icon">📰</div>
            <h3>No newsletter subscribers yet</h3>
            <p>Newsletter subscriptions will appear here</p>
          </div>
        \\\`;
        return;
      }

      container.innerHTML = subscriptions.map(subscription => \\\`
        <div class="message-item" data-id="\\\${subscription.id}">
          <div class="message-header">
            <div class="message-info">
              <h4>\\\${subscription.name || 'Anonymous'}</h4>
              <div class="message-meta">
                \\\${subscription.email} • \\\${new Date(subscription.timestamp).toLocaleString()}
              </div>
            </div>
            <div class="message-actions">
              <button class="action-btn" onclick="deleteMessage('newsletter', '\\\${subscription.id}')">Remove</button>
            </div>
          </div>
          <div class="message-content">
            <div class="message-field">
              <span class="field-label">Source:</span>
              <span class="field-value">\\\${subscription.source}</span>
            </div>
          </div>
        </div>
      \\\`).join('');
    }

    function updateStats() {
      const contactCount = emailService.getContactSubmissions().length;
      const bookingCount = emailService.getBookingSubmissions().length;
      const newsletterCount = emailService.getNewsletterSubscriptions().length;

      document.getElementById('contact-count').textContent = contactCount;
      document.getElementById('booking-count').textContent = bookingCount;
      document.getElementById('newsletter-count').textContent = newsletterCount;
    }

    function setupSearch(type) {
      const searchInput = document.getElementById(\\\`\\\${type}-search\\\`);
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll(\\\`#\\\${type}-list .message-item\\\`);
        
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'block' : 'none';
        });
      });
    }

    function setupExport(type) {
      const exportBtn = document.getElementById(\\\`export-\\\${type}\\\`);
      exportBtn.addEventListener('click', () => {
        let data = [];
        
        switch (type) {
          case 'contact':
            data = emailService.getContactSubmissions();
            break;
          case 'bookings':
            data = emailService.getBookingSubmissions();
            break;
          case 'newsletter':
            data = emailService.getNewsletterSubscriptions();
            break;
        }

        if (data.length === 0) {
          alert('No data to export');
          return;
        }

        exportToCSV(data, \\\`nosytlabs-\\\${type}-\\\${new Date().toISOString().split('T')[0]}.csv\\\`);
      });
    }

    function setupClear(type) {
      const clearBtn = document.getElementById(\\\`clear-\\\${type}\\\`);
      clearBtn.addEventListener('click', () => {
        if (confirm(\\\`Are you sure you want to clear all \\\${type} data? This cannot be undone.\\\`)) {
          localStorage.removeItem(\\\`nosytlabs_\\\${type}_submissions\\\`);
          loadTabData(type);
          updateStats();
        }
      });
    }

    function exportToCSV(data, filename) {
      if (data.length === 0) return;

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header] || '';
            return \\\`"\\\${value.toString().replace(/"/g, '""')}"\\\`;
          }).join(',')
        )
      ].join('\\\\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    }

    // Global functions for button actions
    window.replyToContact = function(email) {
      window.location.href = \\\`mailto:\\\${email}\\\`;
    };

    window.deleteMessage = function(type, id) {
      if (confirm('Are you sure you want to delete this message?')) {
        let storageKey = '';
        switch (type) {
          case 'contact':
            storageKey = 'nosytlabs_contact_submissions';
            break;
          case 'bookings':
            storageKey = 'nosytlabs_booking_submissions';
            break;
          case 'newsletter':
            storageKey = 'nosytlabs_newsletter_subscriptions';
            break;
        }

        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const filteredData = data.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filteredData));
        
        loadTabData(type);
        updateStats();
      }
    };

    // Auto-refresh data every 30 seconds
    setInterval(() => {
      const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
      loadTabData(activeTab);
      updateStats();
    }, 30000);
  });
<\/script>`])), maybeRenderHead(), title);
}, "/mnt/persist/workspace/src/components/admin/AdminMessages.astro", void 0);
const $$AdminDashboard = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="dashboard-container" data-astro-cid-wevncqq4> <div class="dashboard-stats" data-astro-cid-wevncqq4> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon projects-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Projects</h3> <p class="stat-value" data-astro-cid-wevncqq4>12</p> <p class="stat-description" data-astro-cid-wevncqq4>Total projects</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon blog-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Blog Posts</h3> <p class="stat-value" data-astro-cid-wevncqq4>8</p> <p class="stat-description" data-astro-cid-wevncqq4>Published posts</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon media-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Media</h3> <p class="stat-value" data-astro-cid-wevncqq4>24</p> <p class="stat-description" data-astro-cid-wevncqq4>Uploaded files</p> </div> </div> <div class="stat-card" data-astro-cid-wevncqq4> <div class="stat-icon messages-icon" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" data-astro-cid-wevncqq4></path> </svg> </div> <div class="stat-content" data-astro-cid-wevncqq4> <h3 data-astro-cid-wevncqq4>Messages</h3> <p class="stat-value" data-astro-cid-wevncqq4>5</p> <p class="stat-description" data-astro-cid-wevncqq4>Unread messages</p> </div> </div> </div> <div class="dashboard-sections" data-astro-cid-wevncqq4> <div class="dashboard-section" data-astro-cid-wevncqq4> <div class="section-header" data-astro-cid-wevncqq4> <h2 data-astro-cid-wevncqq4>Recent Projects</h2> <a href="/admin/projects" class="view-all-link" data-astro-cid-wevncqq4>View All</a> </div> <div class="section-content" data-astro-cid-wevncqq4> <table class="admin-table" data-astro-cid-wevncqq4> <thead data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <th data-astro-cid-wevncqq4>Title</th> <th data-astro-cid-wevncqq4>Category</th> <th data-astro-cid-wevncqq4>Date</th> <th data-astro-cid-wevncqq4>Status</th> <th data-astro-cid-wevncqq4>Actions</th> </tr> </thead> <tbody data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>NosytOS95</td> <td data-astro-cid-wevncqq4>Web Development</td> <td data-astro-cid-wevncqq4>2025-01-15</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>3D Printing Service</td> <td data-astro-cid-wevncqq4>Service</td> <td data-astro-cid-wevncqq4>2025-01-10</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>AI Content Generator</td> <td data-astro-cid-wevncqq4>AI</td> <td data-astro-cid-wevncqq4>2024-12-28</td> <td data-astro-cid-wevncqq4><span class="status-badge status-draft" data-astro-cid-wevncqq4>Draft</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> </tbody> </table> </div> </div> <div class="dashboard-section" data-astro-cid-wevncqq4> <div class="section-header" data-astro-cid-wevncqq4> <h2 data-astro-cid-wevncqq4>Recent Blog Posts</h2> <a href="/admin/blog" class="view-all-link" data-astro-cid-wevncqq4>View All</a> </div> <div class="section-content" data-astro-cid-wevncqq4> <table class="admin-table" data-astro-cid-wevncqq4> <thead data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <th data-astro-cid-wevncqq4>Title</th> <th data-astro-cid-wevncqq4>Category</th> <th data-astro-cid-wevncqq4>Date</th> <th data-astro-cid-wevncqq4>Status</th> <th data-astro-cid-wevncqq4>Actions</th> </tr> </thead> <tbody data-astro-cid-wevncqq4> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>Cursor AI: The Future of Coding</td> <td data-astro-cid-wevncqq4>AI Tools</td> <td data-astro-cid-wevncqq4>2025-01-20</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>Trae AI: Revolutionizing Content Creation</td> <td data-astro-cid-wevncqq4>AI Tools</td> <td data-astro-cid-wevncqq4>2025-01-12</td> <td data-astro-cid-wevncqq4><span class="status-badge status-published" data-astro-cid-wevncqq4>Published</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> <tr data-astro-cid-wevncqq4> <td data-astro-cid-wevncqq4>The Rise of No-Code AI Editors</td> <td data-astro-cid-wevncqq4>Technology</td> <td data-astro-cid-wevncqq4>2025-01-05</td> <td data-astro-cid-wevncqq4><span class="status-badge status-draft" data-astro-cid-wevncqq4>Draft</span></td> <td class="actions-cell" data-astro-cid-wevncqq4> <button class="action-btn edit-btn" aria-label="Edit" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" data-astro-cid-wevncqq4></path> </svg> </button> <button class="action-btn delete-btn" aria-label="Delete" data-astro-cid-wevncqq4> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-wevncqq4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" data-astro-cid-wevncqq4></path> </svg> </button> </td> </tr> </tbody> </table> </div> </div> <!-- Messages Section --> <div class="dashboard-section" data-astro-cid-wevncqq4> ${renderComponent($$result, "AdminMessages", $$AdminMessages, { "data-astro-cid-wevncqq4": true })} </div> </div> </div> `;
}, "/mnt/persist/workspace/src/components/admin/AdminDashboard.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", "  <script type=\"module\">\n  import { clientAuth } from '../../utils/auth.js';\n\n  // Client-side authentication logic\n  document.addEventListener('DOMContentLoaded', async function() {\n    const loginContainer = document.getElementById('login-container');\n    const adminContainer = document.getElementById('admin-container');\n    const loginForm = document.getElementById('login-form');\n    const loginBtn = document.getElementById('login-btn');\n    const loginError = document.getElementById('login-error');\n\n    // Check if user is already authenticated\n    if (clientAuth.checkAuth()) {\n      showAdminPanel();\n    } else {\n      showLoginForm();\n    }\n\n    // Handle login form submission\n    if (loginForm) {\n      loginForm.addEventListener('submit', async function(e) {\n        e.preventDefault();\n\n        const formData = new FormData(loginForm);\n\n        // Show loading state\n        loginBtn.classList.add('loading');\n        loginBtn.disabled = true;\n        hideError();\n\n        try {\n          const result = await clientAuth.handleLogin(formData);\n\n          if (result.success) {\n            // Success - show admin panel\n            showAdminPanel();\n          } else {\n            // Show error\n            showError(result.error);\n          }\n        } catch (error) {\n          showError('An unexpected error occurred. Please try again.');\n        } finally {\n          // Hide loading state\n          loginBtn.classList.remove('loading');\n          loginBtn.disabled = false;\n        }\n      });\n    }\n\n    // Add logout functionality to admin header\n    document.addEventListener('click', function(e) {\n      if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {\n        e.preventDefault();\n        clientAuth.logout();\n      }\n    });\n\n    function showLoginForm() {\n      if (loginContainer) loginContainer.style.display = 'flex';\n      if (adminContainer) adminContainer.style.display = 'none';\n    }\n\n    function showAdminPanel() {\n      if (loginContainer) loginContainer.style.display = 'none';\n      if (adminContainer) adminContainer.style.display = 'flex';\n\n      // Update user info in header\n      const user = clientAuth.getCurrentUser();\n      if (user) {\n        const userInfo = document.querySelector('.admin-user-info');\n        if (userInfo) {\n          userInfo.textContent = `Welcome, ${user.username}`;\n        }\n      }\n    }\n\n    function showError(message) {\n      if (loginError) {\n        loginError.textContent = message;\n        loginError.style.display = 'block';\n      }\n    }\n\n    function hideError() {\n      if (loginError) {\n        loginError.style.display = 'none';\n      }\n    }\n\n    // Demo credentials auto-fill (for development)\n    const demoCredentials = document.querySelectorAll('.login-footer code');\n    demoCredentials.forEach(code => {\n      code.addEventListener('click', function() {\n        const text = this.textContent;\n        if (text === 'admin' || text === 'nosytlabs') {\n          document.getElementById('username').value = text;\n        } else if (text === 'password') {\n          document.getElementById('password').value = text;\n        }\n      });\n    });\n  });\n<\/script>"], ["", "  <script type=\"module\">\n  import { clientAuth } from '../../utils/auth.js';\n\n  // Client-side authentication logic\n  document.addEventListener('DOMContentLoaded', async function() {\n    const loginContainer = document.getElementById('login-container');\n    const adminContainer = document.getElementById('admin-container');\n    const loginForm = document.getElementById('login-form');\n    const loginBtn = document.getElementById('login-btn');\n    const loginError = document.getElementById('login-error');\n\n    // Check if user is already authenticated\n    if (clientAuth.checkAuth()) {\n      showAdminPanel();\n    } else {\n      showLoginForm();\n    }\n\n    // Handle login form submission\n    if (loginForm) {\n      loginForm.addEventListener('submit', async function(e) {\n        e.preventDefault();\n\n        const formData = new FormData(loginForm);\n\n        // Show loading state\n        loginBtn.classList.add('loading');\n        loginBtn.disabled = true;\n        hideError();\n\n        try {\n          const result = await clientAuth.handleLogin(formData);\n\n          if (result.success) {\n            // Success - show admin panel\n            showAdminPanel();\n          } else {\n            // Show error\n            showError(result.error);\n          }\n        } catch (error) {\n          showError('An unexpected error occurred. Please try again.');\n        } finally {\n          // Hide loading state\n          loginBtn.classList.remove('loading');\n          loginBtn.disabled = false;\n        }\n      });\n    }\n\n    // Add logout functionality to admin header\n    document.addEventListener('click', function(e) {\n      if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {\n        e.preventDefault();\n        clientAuth.logout();\n      }\n    });\n\n    function showLoginForm() {\n      if (loginContainer) loginContainer.style.display = 'flex';\n      if (adminContainer) adminContainer.style.display = 'none';\n    }\n\n    function showAdminPanel() {\n      if (loginContainer) loginContainer.style.display = 'none';\n      if (adminContainer) adminContainer.style.display = 'flex';\n\n      // Update user info in header\n      const user = clientAuth.getCurrentUser();\n      if (user) {\n        const userInfo = document.querySelector('.admin-user-info');\n        if (userInfo) {\n          userInfo.textContent = \\`Welcome, \\${user.username}\\`;\n        }\n      }\n    }\n\n    function showError(message) {\n      if (loginError) {\n        loginError.textContent = message;\n        loginError.style.display = 'block';\n      }\n    }\n\n    function hideError() {\n      if (loginError) {\n        loginError.style.display = 'none';\n      }\n    }\n\n    // Demo credentials auto-fill (for development)\n    const demoCredentials = document.querySelectorAll('.login-footer code');\n    demoCredentials.forEach(code => {\n      code.addEventListener('click', function() {\n        const text = this.textContent;\n        if (text === 'admin' || text === 'nosytlabs') {\n          document.getElementById('username').value = text;\n        } else if (text === 'password') {\n          document.getElementById('password').value = text;\n        }\n      });\n    });\n  });\n<\/script>"])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Admin Panel - NosytLabs", "description": "NosytLabs Admin Panel for managing content", "data-astro-cid-u2h3djql": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div id="login-container" class="login-container" data-astro-cid-u2h3djql> <div class="login-form" data-astro-cid-u2h3djql> <div class="login-header" data-astro-cid-u2h3djql> <img src="/images/logo.svg" alt="NosytLabs" class="login-logo" data-astro-cid-u2h3djql> <h1 data-astro-cid-u2h3djql>Admin Login</h1> <p data-astro-cid-u2h3djql>Access the NosytLabs administration panel</p> </div> <form id="login-form" data-astro-cid-u2h3djql> <div class="form-group" data-astro-cid-u2h3djql> <label for="username" data-astro-cid-u2h3djql>Username</label> <input type="text" id="username" name="username" required autocomplete="username" data-astro-cid-u2h3djql> </div> <div class="form-group" data-astro-cid-u2h3djql> <label for="password" data-astro-cid-u2h3djql>Password</label> <input type="password" id="password" name="password" required autocomplete="current-password" data-astro-cid-u2h3djql> </div> <div class="form-group" data-astro-cid-u2h3djql> <label class="checkbox-label" data-astro-cid-u2h3djql> <input type="checkbox" id="remember" name="remember" data-astro-cid-u2h3djql> <span class="checkmark" data-astro-cid-u2h3djql></span>
Remember me
</label> </div> <button type="submit" class="btn-primary" id="login-btn" data-astro-cid-u2h3djql> <span class="btn-text" data-astro-cid-u2h3djql>Login</span> <span class="btn-loading" style="display: none;" data-astro-cid-u2h3djql>Logging in...</span> </button> <div id="login-error" class="error-message" style="display: none;" data-astro-cid-u2h3djql></div> </form> <div class="login-footer" data-astro-cid-u2h3djql> <p data-astro-cid-u2h3djql><strong data-astro-cid-u2h3djql>Demo Credentials:</strong></p> <p data-astro-cid-u2h3djql>Username: <code data-astro-cid-u2h3djql>admin</code> | Password: <code data-astro-cid-u2h3djql>password</code></p> <p data-astro-cid-u2h3djql>Username: <code data-astro-cid-u2h3djql>nosytlabs</code> | Password: <code data-astro-cid-u2h3djql>password</code></p> </div> </div> </div>  <div id="admin-container" class="admin-container" style="display: none;" data-astro-cid-u2h3djql> ${renderComponent($$result2, "AdminSidebar", $$AdminSidebar, { "data-astro-cid-u2h3djql": true })} <div class="admin-content" data-astro-cid-u2h3djql> ${renderComponent($$result2, "AdminHeader", $$AdminHeader, { "title": "Dashboard", "data-astro-cid-u2h3djql": true })} ${renderComponent($$result2, "AdminDashboard", $$AdminDashboard, { "data-astro-cid-u2h3djql": true })} </div> </div> ` }));
}, "/mnt/persist/workspace/src/pages/admin/index.astro", void 0);
const $$file = "/mnt/persist/workspace/src/pages/admin/index.astro";
const $$url = "/admin.html";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({ __proto__: null, default: $$Index, file: $$file, url: $$url }, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  $$BaseLayout as $,
  page$1 as a,
  page as b,
  page$2 as p,
  renderers as r
};
