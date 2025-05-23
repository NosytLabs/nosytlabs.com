/**
 * Windows 95 Accessibility Enhancements
 * Adds ARIA attributes and keyboard navigation to the NosytOS95 interface
 */

(function() {
  'use strict';

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initAccessibility);

  function initAccessibility() {
    // Add ARIA attributes to desktop icons
    enhanceDesktopIcons();
    
    // Add ARIA attributes to windows
    enhanceWindows();
    
    // Add ARIA attributes to window controls
    enhanceWindowControls();
    
    // Add ARIA attributes to taskbar
    enhanceTaskbar();
    
    // Add ARIA attributes to start menu
    enhanceStartMenu();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
  }

  /**
   * Add ARIA attributes to desktop icons
   */
  function enhanceDesktopIcons() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    
    desktopIcons.forEach(icon => {
      // Add role and tabindex
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      
      // Add aria-label based on the icon text
      const iconText = icon.querySelector('span')?.textContent;
      if (iconText) {
        icon.setAttribute('aria-label', `Open ${iconText}`);
      }
      
      // Add keyboard event listeners
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          icon.click();
        }
      });
    });
  }

  /**
   * Add ARIA attributes to windows
   */
  function enhanceWindows() {
    const windows = document.querySelectorAll('.win95-window');
    
    windows.forEach(window => {
      // Add role and aria attributes
      window.setAttribute('role', 'dialog');
      window.setAttribute('aria-modal', 'true');
      
      // Add aria-labelledby pointing to the window title
      const titleElement = window.querySelector('.window-title span');
      if (titleElement) {
        const titleId = `title-${window.id}`;
        titleElement.id = titleId;
        window.setAttribute('aria-labelledby', titleId);
      }
      
      // Add aria-describedby for windows with status bars
      const statusBar = window.querySelector('.window-statusbar span');
      if (statusBar) {
        const statusId = `status-${window.id}`;
        statusBar.id = statusId;
        window.setAttribute('aria-describedby', statusId);
      }
    });
  }

  /**
   * Add ARIA attributes to window controls
   */
  function enhanceWindowControls() {
    // Enhance minimize buttons
    const minimizeButtons = document.querySelectorAll('.window-minimize');
    minimizeButtons.forEach(button => {
      button.setAttribute('aria-label', 'Minimize window');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
    });
    
    // Enhance maximize buttons
    const maximizeButtons = document.querySelectorAll('.window-maximize');
    maximizeButtons.forEach(button => {
      button.setAttribute('aria-label', 'Maximize window');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      
      // Update aria-label when window state changes
      const window = button.closest('.win95-window');
      if (window) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && 
                window.classList.contains('maximized')) {
              button.setAttribute('aria-label', 'Restore window');
            } else {
              button.setAttribute('aria-label', 'Maximize window');
            }
          });
        });
        
        observer.observe(window, { attributes: true });
      }
    });
    
    // Enhance close buttons
    const closeButtons = document.querySelectorAll('.window-close');
    closeButtons.forEach(button => {
      button.setAttribute('aria-label', 'Close window');
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
    });
    
    // Add keyboard event listeners to all window controls
    const allControls = document.querySelectorAll('.window-minimize, .window-maximize, .window-close');
    allControls.forEach(control => {
      control.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          control.click();
        }
      });
    });
  }

  /**
   * Add ARIA attributes to taskbar
   */
  function enhanceTaskbar() {
    const taskbar = document.querySelector('.win95-taskbar');
    if (!taskbar) return;
    
    // Add role and aria-label to taskbar
    taskbar.setAttribute('role', 'toolbar');
    taskbar.setAttribute('aria-label', 'Taskbar');
    
    // Enhance start button
    const startButton = taskbar.querySelector('.start-button');
    if (startButton) {
      startButton.setAttribute('role', 'button');
      startButton.setAttribute('aria-label', 'Start menu');
      startButton.setAttribute('aria-haspopup', 'true');
      startButton.setAttribute('aria-expanded', 'false');
      startButton.setAttribute('tabindex', '0');
      
      // Add keyboard event listener
      startButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startButton.click();
          
          // Update aria-expanded state
          const startMenu = document.getElementById('start-menu');
          if (startMenu) {
            const isVisible = startMenu.style.display !== 'none';
            startButton.setAttribute('aria-expanded', isVisible.toString());
          }
        }
      });
    }
    
    // Enhance taskbar buttons
    const taskbarButtons = taskbar.querySelectorAll('.win95-taskbar-button');
    taskbarButtons.forEach(button => {
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      
      // Add keyboard event listener
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });
    
    // Enhance clock
    const clock = taskbar.querySelector('.clock');
    if (clock) {
      clock.setAttribute('role', 'status');
      clock.setAttribute('aria-live', 'polite');
    }
  }

  /**
   * Add ARIA attributes to start menu
   */
  function enhanceStartMenu() {
    const startMenu = document.getElementById('start-menu');
    if (!startMenu) return;
    
    // Add role and aria attributes to start menu
    startMenu.setAttribute('role', 'menu');
    startMenu.setAttribute('aria-label', 'Start menu');
    
    // Enhance start menu items
    const menuItems = startMenu.querySelectorAll('.start-menu-item');
    menuItems.forEach(item => {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '-1');
      
      // If item has a submenu, add appropriate attributes
      if (item.hasAttribute('data-submenu')) {
        item.setAttribute('aria-haspopup', 'true');
        item.setAttribute('aria-expanded', 'false');
        
        // Find associated submenu
        const submenuId = item.getAttribute('data-submenu');
        if (submenuId) {
          const submenu = document.getElementById(submenuId);
          if (submenu) {
            submenu.setAttribute('role', 'menu');
            submenu.setAttribute('aria-label', `${item.textContent} submenu`);
            
            // Enhance submenu items
            const submenuItems = submenu.querySelectorAll('.submenu-item');
            submenuItems.forEach(subItem => {
              subItem.setAttribute('role', 'menuitem');
              subItem.setAttribute('tabindex', '-1');
            });
          }
        }
      }
    });
  }

  /**
   * Setup keyboard navigation
   */
  function setupKeyboardNavigation() {
    // Add a skip link for keyboard users
    addSkipLink();
    
    // Setup keyboard navigation for desktop icons
    setupDesktopIconsKeyNav();
    
    // Setup keyboard navigation for windows
    setupWindowsKeyNav();
    
    // Setup keyboard navigation for start menu
    setupStartMenuKeyNav();
  }

  /**
   * Add a skip link for keyboard users
   */
  function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#desktop';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to desktop';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.padding = '8px';
    skipLink.style.zIndex = '9999';
    skipLink.style.backgroundColor = '#000';
    skipLink.style.color = '#fff';
    skipLink.style.transition = 'top 0.3s';
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Setup keyboard navigation for desktop icons
   */
  function setupDesktopIconsKeyNav() {
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    if (desktopIcons.length === 0) return;
    
    // Allow arrow key navigation between desktop icons
    desktopIcons.forEach((icon, index) => {
      icon.addEventListener('keydown', (e) => {
        let nextIndex;
        
        switch (e.key) {
          case 'ArrowRight':
            nextIndex = (index + 1) % desktopIcons.length;
            desktopIcons[nextIndex].focus();
            e.preventDefault();
            break;
          case 'ArrowLeft':
            nextIndex = (index - 1 + desktopIcons.length) % desktopIcons.length;
            desktopIcons[nextIndex].focus();
            e.preventDefault();
            break;
          case 'ArrowDown':
            // Assuming icons are in a grid with 5 icons per row
            nextIndex = (index + 5) % desktopIcons.length;
            desktopIcons[nextIndex].focus();
            e.preventDefault();
            break;
          case 'ArrowUp':
            // Assuming icons are in a grid with 5 icons per row
            nextIndex = (index - 5 + desktopIcons.length) % desktopIcons.length;
            desktopIcons[nextIndex].focus();
            e.preventDefault();
            break;
        }
      });
    });
  }

  /**
   * Setup keyboard navigation for windows
   */
  function setupWindowsKeyNav() {
    // Add keyboard shortcuts for window management
    document.addEventListener('keydown', (e) => {
      // Alt+F4 to close active window
      if (e.altKey && e.key === 'F4') {
        const activeWindow = document.querySelector('.win95-window[style*="z-index"][style*="display: block"]');
        if (activeWindow) {
          const closeButton = activeWindow.querySelector('.window-close');
          if (closeButton) {
            closeButton.click();
            e.preventDefault();
          }
        }
      }
      
      // Alt+Space to open window menu (not implemented yet)
      if (e.altKey && e.key === ' ') {
        // TODO: Implement window menu
        e.preventDefault();
      }
    });
  }

  /**
   * Setup keyboard navigation for start menu
   */
  function setupStartMenuKeyNav() {
    const startMenu = document.getElementById('start-menu');
    if (!startMenu) return;
    
    const startButton = document.querySelector('.start-button');
    if (!startButton) return;
    
    // When start menu is opened, focus the first item
    startButton.addEventListener('click', () => {
      setTimeout(() => {
        const firstMenuItem = startMenu.querySelector('.start-menu-item');
        if (firstMenuItem && startMenu.style.display !== 'none') {
          firstMenuItem.focus();
        }
      }, 100);
    });
    
    // Setup keyboard navigation within start menu
    const menuItems = startMenu.querySelectorAll('.start-menu-item');
    menuItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        let nextIndex;
        
        switch (e.key) {
          case 'ArrowDown':
            nextIndex = (index + 1) % menuItems.length;
            menuItems[nextIndex].focus();
            e.preventDefault();
            break;
          case 'ArrowUp':
            nextIndex = (index - 1 + menuItems.length) % menuItems.length;
            menuItems[nextIndex].focus();
            e.preventDefault();
            break;
          case 'Escape':
            startButton.click(); // Close the menu
            startButton.focus(); // Focus back to start button
            e.preventDefault();
            break;
        }
      });
    });
  }
})();
