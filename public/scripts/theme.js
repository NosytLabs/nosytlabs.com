/**
 * NosytLabs Theme Management
 * Handles dark mode and theme preferences
 */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
});

/**
 * Initialize theme based on user preference or system setting
 */
function initTheme() {
  // Check for saved theme preference
  const storedTheme = localStorage.getItem('theme');
  
  // Check for system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Apply theme based on preference
  if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      // Toggle dark mode
      document.documentElement.classList.toggle('dark');
      
      // Save preference
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }
  
  // Listen for system preference changes
  prefersDarkScheme.addEventListener('change', function(e) {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
  
  console.log('Theme system initialized');
}
