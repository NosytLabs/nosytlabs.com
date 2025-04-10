// Theme Manager for Nosyt Labs
// This component adds dark/light mode toggle functionality

export class ThemeManager {
  constructor() {
    this.darkModeClass = 'dark-mode';
    this.lightModeClass = 'light-mode';
    this.storageKey = 'nosyt-labs-theme';
    this.defaultTheme = 'dark';
    this.currentTheme = this.getStoredTheme() || this.defaultTheme;
  }

  /**
   * Initialize the theme manager
   * @param {boolean} addToggleButton - Whether to add a toggle button to the DOM
   */
  initialize(addToggleButton = true) {
    // Apply the stored theme on page load
    this.applyTheme(this.currentTheme);
    
    // Add theme toggle button if requested
    if (addToggleButton) {
      this.addThemeToggleButton();
    }
    
    // Listen for system preference changes
    this.listenForSystemPreferenceChanges();
    
    console.log('Theme Manager initialized with theme:', this.currentTheme);
  }

  /**
   * Get the stored theme from localStorage
   * @returns {string|null} The stored theme or null if not found
   */
  getStoredTheme() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.storageKey);
  }

  /**
   * Store the current theme in localStorage
   */
  storeTheme() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, this.currentTheme);
  }

  /**
   * Apply the specified theme to the document
   * @param {string} theme - The theme to apply ('dark' or 'light')
   */
  applyTheme(theme) {
    if (typeof document === 'undefined') return;
    
    const body = document.body;
    
    if (theme === 'dark') {
      body.classList.remove(this.lightModeClass);
      body.classList.add(this.darkModeClass);
    } else {
      body.classList.remove(this.darkModeClass);
      body.classList.add(this.lightModeClass);
    }
    
    // Update current theme
    this.currentTheme = theme;
    
    // Store the theme preference
    this.storeTheme();
    
    // Dispatch theme change event
    this.dispatchThemeChangeEvent();
  }

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  /**
   * Add a theme toggle button to the DOM
   */
  addThemeToggleButton() {
    if (typeof document === 'undefined') return;
    
    // Check if button already exists
    if (document.getElementById('theme-toggle')) return;
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'theme-toggle';
    toggleButton.className = 'terminal-mode-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle theme');
    toggleButton.innerHTML = this.currentTheme === 'dark' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    
    // Add click event listener
    toggleButton.addEventListener('click', () => {
      this.toggleTheme();
      
      // Update button icon
      toggleButton.innerHTML = this.currentTheme === 'dark' 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    });
    
    // Add button to the DOM
    document.body.appendChild(toggleButton);
  }

  /**
   * Listen for system preference changes
   */
  listenForSystemPreferenceChanges() {
    if (typeof window === 'undefined') return;
    
    // Check if the user has a stored preference
    const hasStoredPreference = !!this.getStoredTheme();
    
    // If no stored preference, use system preference
    if (!hasStoredPreference && window.matchMedia) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Apply initial system preference
      if (prefersDarkMode.matches) {
        this.applyTheme('dark');
      } else {
        this.applyTheme('light');
      }
      
      // Listen for changes
      prefersDarkMode.addEventListener('change', (e) => {
        // Only apply if user hasn't set a preference
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Dispatch a custom event when the theme changes
   */
  dispatchThemeChangeEvent() {
    if (typeof window === 'undefined') return;
    
    const event = new CustomEvent('theme-change', {
      detail: { theme: this.currentTheme }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Get the current theme
   * @returns {string} The current theme ('dark' or 'light')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}

export default ThemeManager;
