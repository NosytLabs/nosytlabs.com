/**
 * Theme Initialization Script
 * Simple theme system for dark/light mode switching
 */

/**
 * Simple theme initialization script content
 */
const getThemeInitScript = (): string => {
  return `
    (function() {
      // Get saved theme mode from localStorage
      const savedMode = localStorage.getItem('theme') || 'system';
      
      // Check if dark mode should be applied
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedMode === 'dark' || (savedMode === 'system' && prefersDark);
      
      // Apply dark mode class if needed
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Set up system preference listener
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Function to update theme based on mode and system preference
      const updateTheme = () => {
        const currentMode = localStorage.getItem('theme') || 'system';
        if (currentMode === 'system') {
          if (mediaQuery.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      };
      
      // Listen for system preference changes
      mediaQuery.addEventListener('change', updateTheme);
    })();
  `;
};

/**
 * Adds the theme initialization script to the document head
 * This function should be called in Astro layouts
 */
export const addThemeInitScript = (): void => {
  // Create script element
  const script = document.createElement('script');
  script.id = 'nosyt-theme-init';
  script.textContent = getThemeInitScript();

  // Add script to head
  document.head.appendChild(script);
};

/**
 * Initializes the theme system
 * This function should be called as early as possible in the client-side lifecycle
 */
export const initializeTheme = (): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  // Get saved theme mode from localStorage
  const savedMode = localStorage.getItem('theme') || 'system';

  // Check if dark mode should be applied
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedMode === 'dark' || (savedMode === 'system' && prefersDark);

  // Apply dark mode class if needed
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Set up system preference listener
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Function to update theme based on mode and system preference
  const updateTheme = () => {
    if (savedMode === 'system') {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Listen for system preference changes
  mediaQuery.addEventListener('change', updateTheme);
};

/**
 * Returns the theme initialization script content as a string
 * This can be used with createNonceScript() for CSP compliance
 * @returns The theme initialization script content as a string
 */
export const getThemeScript = (): string => {
  return getThemeInitScript();
};

// Export default object
export default {
  addThemeInitScript,
  initializeTheme,
  getThemeScript,
};
