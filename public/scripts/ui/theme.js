/**
 * theme.js
 * Theme management for the NosytLabs website
 * 
 * This module handles theme switching between light and dark modes,
 * as well as other theme-related functionality.
 */

import NosytUtils from '../core/utils.js';

/**
 * Theme module
 */
const Theme = {
  /**
   * Configuration
   */
  config: {
    // Theme storage key
    storageKey: 'nosyt-theme',
    
    // Theme options
    themes: {
      light: 'light',
      dark: 'dark',
      system: 'system'
    },
    
    // Theme class
    themeClass: 'dark',
    
    // Selectors
    selectors: {
      themeToggle: '[data-theme-toggle]',
      themeSelect: '[data-theme-select]',
      darkIcon: '[data-theme-icon="dark"]',
      lightIcon: '[data-theme-icon="light"]',
      systemIcon: '[data-theme-icon="system"]'
    },
    
    // Transition duration in milliseconds
    transitionDuration: 300
  },
  
  /**
   * State
   */
  state: {
    currentTheme: null,
    systemTheme: null,
    mediaQuery: null,
    transitionStylesheet: null
  },
  
  /**
   * Initialize theme functionality
   * @param {Object} options - Configuration options
   */
  init: function(options = {}) {
    console.log('Initializing theme functionality...');
    
    try {
      // Merge options with default config
      this.config = { ...this.config, ...options };
      
      // Set up system theme detection
      this.setupSystemThemeDetection();
      
      // Set initial theme
      this.setInitialTheme();
      
      // Set up theme toggle
      this.setupThemeToggle();
      
      // Set up theme select
      this.setupThemeSelect();
      
      console.log('Theme functionality initialized successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme initialization');
    }
  },
  
  /**
   * Set up system theme detection
   */
  setupSystemThemeDetection: function() {
    try {
      // Create media query
      this.state.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Set initial system theme
      this.state.systemTheme = this.state.mediaQuery.matches ? 
        this.config.themes.dark : 
        this.config.themes.light;
      
      // Add change listener
      this.state.mediaQuery.addEventListener('change', (e) => {
        // Update system theme
        this.state.systemTheme = e.matches ? 
          this.config.themes.dark : 
          this.config.themes.light;
        
        // Update theme if using system preference
        if (this.state.currentTheme === this.config.themes.system) {
          this.applyTheme(this.state.systemTheme);
        }
      });
      
      console.log('System theme detection set up successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'System theme detection');
    }
  },
  
  /**
   * Set initial theme
   */
  setInitialTheme: function() {
    try {
      // Get saved theme
      const savedTheme = localStorage.getItem(this.config.storageKey);
      
      // Set current theme
      if (savedTheme && Object.values(this.config.themes).includes(savedTheme)) {
        this.state.currentTheme = savedTheme;
      } else {
        this.state.currentTheme = this.config.themes.system;
      }
      
      // Apply theme
      if (this.state.currentTheme === this.config.themes.system) {
        this.applyTheme(this.state.systemTheme);
      } else {
        this.applyTheme(this.state.currentTheme);
      }
      
      // Update UI
      this.updateThemeUI();
      
      console.log(`Initial theme set to ${this.state.currentTheme}`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Initial theme setting');
    }
  },
  
  /**
   * Set up theme toggle
   */
  setupThemeToggle: function() {
    try {
      // Get all theme toggles
      const toggles = document.querySelectorAll(this.config.selectors.themeToggle);
      
      // Add click event listener to each toggle
      toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      });
      
      console.log(`Set up ${toggles.length} theme toggles`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme toggle setup');
    }
  },
  
  /**
   * Set up theme select
   */
  setupThemeSelect: function() {
    try {
      // Get all theme selects
      const selects = document.querySelectorAll(this.config.selectors.themeSelect);
      
      // Add change event listener to each select
      selects.forEach(select => {
        // Set initial value
        select.value = this.state.currentTheme;
        
        // Add change event listener
        select.addEventListener('change', () => {
          const theme = select.value;
          
          // Set theme
          this.setTheme(theme);
        });
      });
      
      console.log(`Set up ${selects.length} theme selects`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme select setup');
    }
  },
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme: function() {
    try {
      // Get current effective theme
      const currentEffectiveTheme = this.getEffectiveTheme();
      
      // Toggle theme
      const newTheme = currentEffectiveTheme === this.config.themes.dark ? 
        this.config.themes.light : 
        this.config.themes.dark;
      
      // Set theme
      this.setTheme(newTheme);
      
      console.log(`Toggled theme from ${currentEffectiveTheme} to ${newTheme}`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme toggling');
    }
  },
  
  /**
   * Set theme
   * @param {string} theme - The theme to set
   */
  setTheme: function(theme) {
    try {
      // Validate theme
      if (!Object.values(this.config.themes).includes(theme)) {
        console.warn(`Invalid theme: ${theme}`);
        return;
      }
      
      // Set current theme
      this.state.currentTheme = theme;
      
      // Save theme
      localStorage.setItem(this.config.storageKey, theme);
      
      // Apply theme
      if (theme === this.config.themes.system) {
        this.applyTheme(this.state.systemTheme);
      } else {
        this.applyTheme(theme);
      }
      
      // Update UI
      this.updateThemeUI();
      
      console.log(`Theme set to ${theme}`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme setting');
    }
  },
  
  /**
   * Apply theme
   * @param {string} theme - The theme to apply
   */
  applyTheme: function(theme) {
    try {
      // Add transition
      this.addThemeTransition();
      
      // Apply theme class
      if (theme === this.config.themes.dark) {
        document.documentElement.classList.add(this.config.themeClass);
      } else {
        document.documentElement.classList.remove(this.config.themeClass);
      }
      
      // Remove transition after duration
      setTimeout(() => {
        this.removeThemeTransition();
      }, this.config.transitionDuration);
      
      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('themechange', {
        detail: {
          theme,
          currentTheme: this.state.currentTheme,
          systemTheme: this.state.systemTheme
        }
      }));
      
      console.log(`Applied theme: ${theme}`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme application');
    }
  },
  
  /**
   * Add theme transition
   */
  addThemeTransition: function() {
    try {
      // Skip if transition already added
      if (this.state.transitionStylesheet) {
        return;
      }
      
      // Create stylesheet
      const stylesheet = document.createElement('style');
      stylesheet.innerHTML = `
        * {
          transition: background-color ${this.config.transitionDuration}ms ease,
                    color ${this.config.transitionDuration}ms ease,
                    border-color ${this.config.transitionDuration}ms ease,
                    box-shadow ${this.config.transitionDuration}ms ease !important;
        }
      `;
      
      // Add stylesheet to head
      document.head.appendChild(stylesheet);
      
      // Store stylesheet
      this.state.transitionStylesheet = stylesheet;
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme transition addition');
    }
  },
  
  /**
   * Remove theme transition
   */
  removeThemeTransition: function() {
    try {
      // Skip if no transition
      if (!this.state.transitionStylesheet) {
        return;
      }
      
      // Remove stylesheet
      this.state.transitionStylesheet.remove();
      
      // Clear stylesheet
      this.state.transitionStylesheet = null;
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme transition removal');
    }
  },
  
  /**
   * Update theme UI
   */
  updateThemeUI: function() {
    try {
      // Get current effective theme
      const currentEffectiveTheme = this.getEffectiveTheme();
      
      // Update theme toggles
      const toggles = document.querySelectorAll(this.config.selectors.themeToggle);
      toggles.forEach(toggle => {
        // Update toggle state
        toggle.setAttribute('aria-pressed', currentEffectiveTheme === this.config.themes.dark);
        
        // Update icons
        const darkIcon = toggle.querySelector(this.config.selectors.darkIcon);
        const lightIcon = toggle.querySelector(this.config.selectors.lightIcon);
        
        if (darkIcon) {
          darkIcon.classList.toggle('hidden', currentEffectiveTheme === this.config.themes.dark);
        }
        
        if (lightIcon) {
          lightIcon.classList.toggle('hidden', currentEffectiveTheme === this.config.themes.light);
        }
      });
      
      // Update theme selects
      const selects = document.querySelectorAll(this.config.selectors.themeSelect);
      selects.forEach(select => {
        select.value = this.state.currentTheme;
      });
      
      console.log('Theme UI updated');
    } catch (error) {
      NosytUtils.error.handle(error, 'Theme UI update');
    }
  },
  
  /**
   * Get effective theme
   * @returns {string} - The effective theme
   */
  getEffectiveTheme: function() {
    try {
      // Return system theme if using system preference
      if (this.state.currentTheme === this.config.themes.system) {
        return this.state.systemTheme;
      }
      
      // Return current theme
      return this.state.currentTheme;
    } catch (error) {
      NosytUtils.error.handle(error, 'Effective theme getting');
      return this.config.themes.light;
    }
  }
};

// Export Theme module
export default Theme;
