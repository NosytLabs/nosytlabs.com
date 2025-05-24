import {c as createAstro,a as createComponent,m as maybeRenderHead,b as addAttribute,r as renderTemplate,e as renderComponent,f as renderSlot,g as renderHead,F as Fragment}from'./astro/server-CSpupoyF.js';import'kleur/colors';import'clsx';/* empty css                           */const $$Astro$2 = createAstro("https://nosytlabs.com");
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
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
}, "/mnt/persist/workspace/src/components/Header.astro", void 0);const $$Footer = createComponent(($$result, $$props, $$slots) => {
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
}, "/mnt/persist/workspace/src/components/Footer.astro", void 0);var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://nosytlabs.com");
const $$SearchModal = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SearchModal;
  const {
    placeholder = "Search NosytLabs...",
    showCategories = true,
    maxResults = 10
  } = Astro2.props;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<!-- Search Modal Trigger -->", '<button id="search-trigger" class="search-trigger" aria-label="Open search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <span class="search-text" data-astro-cid-qk3db3zz>Search</span> <kbd class="search-kbd" data-astro-cid-qk3db3zz>\u2318K</kbd> </button> <!-- Search Modal --> <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title" data-astro-cid-qk3db3zz> <div class="search-backdrop" data-astro-cid-qk3db3zz></div> <div class="search-container" data-astro-cid-qk3db3zz> <div class="search-header" data-astro-cid-qk3db3zz> <div class="search-input-container" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <input type="text" id="search-input" class="search-input"', ' autocomplete="off" spellcheck="false" aria-label="Search query" data-astro-cid-qk3db3zz> <button id="search-clear" class="search-clear" aria-label="Clear search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> <button id="search-close" class="search-close" aria-label="Close search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> ', ` <div class="search-content" data-astro-cid-qk3db3zz> <!-- Loading State --> <div id="search-loading" class="search-loading" style="display: none;" data-astro-cid-qk3db3zz> <div class="loading-spinner" data-astro-cid-qk3db3zz></div> <p data-astro-cid-qk3db3zz>Searching...</p> </div> <!-- Empty State --> <div id="search-empty" class="search-empty" data-astro-cid-qk3db3zz> <div class="empty-icon" data-astro-cid-qk3db3zz>\u{1F50D}</div> <h3 data-astro-cid-qk3db3zz>Search NosytLabs</h3> <p data-astro-cid-qk3db3zz>Find pages, blog posts, projects, and services</p> <div class="popular-searches" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Popular searches:</h4> <div class="popular-tags" data-astro-cid-qk3db3zz> <button class="popular-tag" data-query="web development" data-astro-cid-qk3db3zz>Web Development</button> <button class="popular-tag" data-query="3d printing" data-astro-cid-qk3db3zz>3D Printing</button> <button class="popular-tag" data-query="cursor ai" data-astro-cid-qk3db3zz>Cursor AI</button> <button class="popular-tag" data-query="nosytos95" data-astro-cid-qk3db3zz>NosytOS95</button> <button class="popular-tag" data-query="passive income" data-astro-cid-qk3db3zz>Passive Income</button> </div> </div> </div> <!-- No Results State --> <div id="search-no-results" class="search-no-results" style="display: none;" data-astro-cid-qk3db3zz> <div class="no-results-icon" data-astro-cid-qk3db3zz>\u{1F614}</div> <h3 data-astro-cid-qk3db3zz>No results found</h3> <p id="no-results-text" data-astro-cid-qk3db3zz>Try adjusting your search terms or browse our popular content.</p> <div class="search-suggestions" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Suggestions:</h4> <ul id="search-suggestions-list" data-astro-cid-qk3db3zz></ul> </div> </div> <!-- Results --> <div id="search-results" class="search-results" style="display: none;" data-astro-cid-qk3db3zz> <div id="search-results-header" class="results-header" data-astro-cid-qk3db3zz> <span id="results-count" data-astro-cid-qk3db3zz>0 results</span> <span id="results-query" data-astro-cid-qk3db3zz></span> </div> <div id="search-results-content" class="results-content" data-astro-cid-qk3db3zz></div> </div> </div> <div class="search-footer" data-astro-cid-qk3db3zz> <div class="search-shortcuts" data-astro-cid-qk3db3zz> <kbd data-astro-cid-qk3db3zz>\u2191\u2193</kbd> Navigate
<kbd data-astro-cid-qk3db3zz>\u21B5</kbd> Select
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
<\/script>`], ["<!-- Search Modal Trigger -->", '<button id="search-trigger" class="search-trigger" aria-label="Open search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <span class="search-text" data-astro-cid-qk3db3zz>Search</span> <kbd class="search-kbd" data-astro-cid-qk3db3zz>\u2318K</kbd> </button> <!-- Search Modal --> <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title" data-astro-cid-qk3db3zz> <div class="search-backdrop" data-astro-cid-qk3db3zz></div> <div class="search-container" data-astro-cid-qk3db3zz> <div class="search-header" data-astro-cid-qk3db3zz> <div class="search-input-container" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" class="search-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qk3db3zz></path> </svg> <input type="text" id="search-input" class="search-input"', ' autocomplete="off" spellcheck="false" aria-label="Search query" data-astro-cid-qk3db3zz> <button id="search-clear" class="search-clear" aria-label="Clear search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> <button id="search-close" class="search-close" aria-label="Close search" data-astro-cid-qk3db3zz> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-qk3db3zz> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-qk3db3zz></path> </svg> </button> </div> ', ` <div class="search-content" data-astro-cid-qk3db3zz> <!-- Loading State --> <div id="search-loading" class="search-loading" style="display: none;" data-astro-cid-qk3db3zz> <div class="loading-spinner" data-astro-cid-qk3db3zz></div> <p data-astro-cid-qk3db3zz>Searching...</p> </div> <!-- Empty State --> <div id="search-empty" class="search-empty" data-astro-cid-qk3db3zz> <div class="empty-icon" data-astro-cid-qk3db3zz>\u{1F50D}</div> <h3 data-astro-cid-qk3db3zz>Search NosytLabs</h3> <p data-astro-cid-qk3db3zz>Find pages, blog posts, projects, and services</p> <div class="popular-searches" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Popular searches:</h4> <div class="popular-tags" data-astro-cid-qk3db3zz> <button class="popular-tag" data-query="web development" data-astro-cid-qk3db3zz>Web Development</button> <button class="popular-tag" data-query="3d printing" data-astro-cid-qk3db3zz>3D Printing</button> <button class="popular-tag" data-query="cursor ai" data-astro-cid-qk3db3zz>Cursor AI</button> <button class="popular-tag" data-query="nosytos95" data-astro-cid-qk3db3zz>NosytOS95</button> <button class="popular-tag" data-query="passive income" data-astro-cid-qk3db3zz>Passive Income</button> </div> </div> </div> <!-- No Results State --> <div id="search-no-results" class="search-no-results" style="display: none;" data-astro-cid-qk3db3zz> <div class="no-results-icon" data-astro-cid-qk3db3zz>\u{1F614}</div> <h3 data-astro-cid-qk3db3zz>No results found</h3> <p id="no-results-text" data-astro-cid-qk3db3zz>Try adjusting your search terms or browse our popular content.</p> <div class="search-suggestions" data-astro-cid-qk3db3zz> <h4 data-astro-cid-qk3db3zz>Suggestions:</h4> <ul id="search-suggestions-list" data-astro-cid-qk3db3zz></ul> </div> </div> <!-- Results --> <div id="search-results" class="search-results" style="display: none;" data-astro-cid-qk3db3zz> <div id="search-results-header" class="results-header" data-astro-cid-qk3db3zz> <span id="results-count" data-astro-cid-qk3db3zz>0 results</span> <span id="results-query" data-astro-cid-qk3db3zz></span> </div> <div id="search-results-content" class="results-content" data-astro-cid-qk3db3zz></div> </div> </div> <div class="search-footer" data-astro-cid-qk3db3zz> <div class="search-shortcuts" data-astro-cid-qk3db3zz> <kbd data-astro-cid-qk3db3zz>\u2191\u2193</kbd> Navigate
<kbd data-astro-cid-qk3db3zz>\u21B5</kbd> Select
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
}, "/mnt/persist/workspace/src/components/SearchModal.astro", void 0);const $$VercelAnalytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/mnt/persist/workspace/src/components/VercelAnalytics.astro", void 0);var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://nosytlabs.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "NosytLabs - Notable Opportunities Shape Your Tomorrow",
    description = "NosytLabs - Innovative digital solutions that help businesses thrive in the modern landscape.",
    ogImage = "/images/nosytlabs-og.jpg",
    isNosytOS95 = false
  } = Astro2.props;
  const pageId = `page-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate(_b || (_b = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><!-- Favicons - Updated with NosytLabs logo 2025 --><link rel="icon" type="image/svg+xml" href="/images/nosytlabs-logo-2025.svg"><link rel="shortcut icon" href="/favicon.ico"><!-- Standard Favicons --><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"><!-- Apple Touch Icon --><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><!-- Web Manifest --><link rel="manifest" href="/site.webmanifest"><!-- Theme Colors --><meta name="theme-color" content="#4C1D95"><meta name="msapplication-TileColor" content="#4C1D95"><!-- Open Graph / Social Media --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="twitter:card" content="summary_large_image"><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Canonical URL --><link rel="canonical"', `><!-- Keywords --><meta name="keywords" content="AI solutions, web development, mobile apps, 3D printing, technology"><!-- Structured Data for Organization --><script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "NosytLabs",
      "url": "https://nosytlabs.com",
      "logo": "https://nosytlabs.com/images/nosytlabs-logo-2025.svg",
      "description": "Notable Opportunities Shape Your Tomorrow - Innovative digital solutions that help businesses thrive in the modern landscape.",
      "sameAs": [
        "https://github.com/NosytLabs",
        "https://kick.com/Tycen",
        "https://www.youtube.com/@TycenYT",
        "https://crealitycloud.com/user/9519489699"
      ]
    }
  <\/script><!-- Resource hints for critical resources --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin><!-- Preload critical resources --><link rel="preload" href="/images/nosytlabs-logo-2025.svg" as="image" fetchpriority="high"><link rel="preload" href="/styles/global.css" as="style"><link rel="preload" href="/scripts/main.js" as="script"><!-- DNS prefetch for external resources --><link rel="dns-prefetch" href="https://fonts.googleapis.com"><link rel="dns-prefetch" href="https://cdnjs.cloudflare.com"><!-- Fonts with optimized loading --><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">`, '<noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript><!-- Font Awesome --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><!-- Global styles --><link rel="stylesheet" href="/styles/global.css"><!-- NosytOS95 specific styles - only loaded on the NosytOS95 page -->', '<!-- Core functionality - high priority --><script src="/scripts/main.js" defer fetchpriority="high"><\/script><!-- NosytOS95 specific scripts are now loaded directly in the nosytos95.astro page -->', "<!-- Service Worker Registration -->", "</head> <body", ' class="overflow-x-hidden overflow-y-auto"> <!-- Skip to main content link for accessibility --> <a href="#main-content" class="skip-link">Skip to main content</a> <!-- Header - Only show modern header on non-NosytOS95 pages --> ', ' <!-- Main Content --> <main id="main-content" class="min-h-screen relative"> ', ' <!-- Main Content --> <div class="relative z-10"> ', " </div> </main> <!-- Footer - Only show modern footer on non-NosytOS95 pages --> ", " <!-- Search Modal - Available on all pages --> ", " <!-- Back to top button --> ", " <!-- Theme toggle script --> <script>\n    // Check for saved theme preference or use system preference\n    const getThemePreference = () => {\n      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {\n        return localStorage.getItem('theme');\n      }\n      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';\n    };\n\n    // Apply theme\n    const theme = getThemePreference();\n    document.documentElement.classList.toggle('dark', theme === 'dark');\n\n    // Store theme preference\n    if (typeof localStorage !== 'undefined') {\n      localStorage.setItem('theme', theme);\n    }\n  <\/script> <!-- Back to top button script -->  <!-- Vercel Analytics --> ", " </body></html>"])), title, addAttribute(description, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(new URL(Astro2.url.pathname, Astro2.site || "https://nosytlabs.com").href, "href"), maybeRenderHead(), isNosytOS95 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`<link rel="stylesheet" href="/styles/win95-authentic.css"><link rel="stylesheet" href="/styles/ms-sans-serif.css"><link rel="stylesheet" href="/styles/nosyt-window-manager.css"><link rel="stylesheet" href="/styles/nosyt-bsod.css"><link rel="stylesheet" href="/styles/nosyt-ai.css"><link rel="stylesheet" href="/styles/nosyt-file-explorer.css">` })}`, isNosytOS95 && renderTemplate(_a || (_a = __template(["<script>\n      // NosytOS95 scripts are loaded inline to avoid import errors\n      console.log('NosytOS95 scripts loaded');\n    <\/script>"]))), renderHead(), addAttribute(pageId, "id"), !isNosytOS95 && renderTemplate`${renderComponent($$result, "Header", $$Header, {})}`, !isNosytOS95 && renderTemplate`<div id="particle-background" class="particle-background absolute inset-0 pointer-events-none z-0" data-color="rgba(76, 29, 149, 0.2)" data-secondary-color="rgba(255, 107, 0, 0.2)" data-particle-count="100" data-particle-size="3" data-particle-speed="1" data-interactive="true" data-connect-particles="true" data-gradient="true"></div>`, renderSlot($$result, $$slots["default"]), !isNosytOS95 && renderTemplate`${renderComponent($$result, "Footer", $$Footer, {})}`, !isNosytOS95 && renderTemplate`${renderComponent($$result, "SearchModal", $$SearchModal, {})}`, !isNosytOS95 && renderTemplate`<button id="back-to-top" class="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 invisible z-50" aria-label="Back to top"> <i class="fas fa-arrow-up"></i> </button>`, renderComponent($$result, "VercelAnalytics", $$VercelAnalytics, {}));
}, "/mnt/persist/workspace/src/layouts/BaseLayout.astro", void 0);export{$$BaseLayout as $};