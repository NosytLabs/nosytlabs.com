/**
 * Windows 95 Theme Manager
 * Handles applying the Windows 95 theme to the website
 */

// Import the theme CSS
import './themes/windows95.css';

// Theme configuration
const themeConfig = {
  name: 'Windows 95',
  description: 'Classic Windows 95 theme for the website',
  version: '1.0.0',
  author: 'NosytLabs',
  themeClass: 'win95-theme',
  icon: '🪟' // Window icon
};

// Theme toggle configuration
const themeToggleConfig = {
  light: {
    name: 'Light',
    description: 'Light theme variant',
    themeClass: 'light-theme',
    icon: '☀️' // Sun icon
  },
  dark: {
    name: 'Dark',
    description: 'Dark theme variant',
    themeClass: 'dark-theme',
    icon: '🌙' // Moon icon
  }
};

// Function to apply the Windows 95 theme
function applyWindows95Theme() {
  // Add theme class to body
  document.body.classList.add('win95-theme');
  
  // Apply specific UI elements with Windows 95 styling
  const elements = {
    header: document.querySelector('.header'),
    nav: document.querySelector('.nav'),
    buttons: document.querySelectorAll('.button'),
    inputs: document.querySelectorAll('input, textarea, select'),
    containers: document.querySelectorAll('.container, .card, .panel')
  };
  
  // Apply styles to elements
  if (elements.header) {
    elements.header.style.backgroundColor = '#c0c0c0';
    elements.header.style.borderBottom = '1px solid #808080';
  }
  
  if (elements.nav) {
    elements.nav.style.backgroundColor = '#c0c0c0';
    elements.nav.style.borderBottom = '1px solid #808080';
  }
  
  // Apply styles to buttons
  elements.buttons.forEach(button => {
    if (!button.classList.contains('win95-button')) {
      button.classList.add('win95-button');
    }
  });
  
  // Apply styles to inputs
  elements.inputs.forEach(input => {
    if (!input.classList.contains('win95-input')) {
      input.classList.add('win95-input');
    }
  });
  
  // Apply styles to containers
  elements.containers.forEach(container => {
    if (!container.classList.contains('win95-container')) {
      container.classList.add('win95-container');
    }
  });
  
  // Add Windows 95 specific UI elements if they don't exist
  if (!document.querySelector('.win95-taskbar')) {
    const taskbar = document.createElement('div');
    taskbar.className = 'win95-taskbar';
    document.body.appendChild(taskbar);
  }
  
  // Log theme application
  console.log(`Applied ${themeConfig.name} theme (v${themeConfig.version})`);
}

// Function to remove the Windows 95 theme
function removeWindows95Theme() {
  // Remove theme class from body
  document.body.classList.remove('win95-theme');
  
  // Remove Windows 95 specific UI elements
  const taskbar = document.querySelector('.win95-taskbar');
  if (taskbar) {
    taskbar.remove();
  }
  
  // Log theme removal
  console.log(`Removed ${themeConfig.name} theme`);
}

// Initialize the theme when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if this is the active theme (could be stored in localStorage)
  const activeTheme = localStorage.getItem('activeTheme');
  const currentTheme = localStorage.getItem('currentTheme') || 'default';
  
  // Apply the current theme
  if (currentTheme === 'windows95') {
    applyWindows95Theme();
  }
  
  // Create theme toggle switch if it doesn't exist
  if (!document.getElementById('theme-toggle-switch')) {
    const themeToggleContainer = document.createElement('div');
    themeToggleContainer.className = 'theme-toggle-container';
    themeToggleContainer.innerHTML = `
      <div class="theme-toggle">
        <input type="checkbox" id="theme-toggle-switch" />
        <span class="slider"></span>
      </div>
      <span class="theme-label">${themeToggleConfig[currentTheme].name}</span>
    `;
    
    // Add the theme toggle to the document
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(themeToggleContainer);
    } else {
      document.body.insertBefore(themeToggleContainer, document.body.firstChild);
    }
  }
  
  // Add event listener for theme toggle switch
  const themeToggleSwitch = document.getElementById('theme-toggle-switch');
  if (themeToggleSwitch) {
    // Set initial state of the toggle switch
    themeToggleSwitch.checked = currentTheme === 'windows95';
    
    // Add event listener for toggle switch
    themeToggleSwitch.addEventListener('change', function() {
      const isChecked = this.checked;
      const newTheme = isChecked ? 'windows95' : 'default';
      
      // Update theme
      if (isChecked) {
        applyWindows95Theme();
      } else {
        removeWindows95Theme();
      }
      
      // Save theme preference
      localStorage.setItem('currentTheme', newTheme);
    });
  }
  
});

// Export functions for external use
export {
  applyWindows95Theme,
  removeWindows95Theme,
  themeConfig
};