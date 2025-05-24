/**
 * Enhanced Taskbar Manager for NosytOS95
 * 
 * Provides a fully functional taskbar with:
 * - Proper display of running applications
 * - Start button functionality
 * - System tray with clock
 * - Taskbar item management (add, remove, activate)
 * - Keyboard navigation
 * - Accessibility features
 * 
 * @version 1.0.0
 * @author NosytLabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const taskbar = document.querySelector('.win95-taskbar');
  const startButton = document.querySelector('.start-button');
  const openWindowsContainer = document.querySelector('.open-windows');
  const systemTray = document.querySelector('.system-tray');
  const clock = document.querySelector('.clock');
  
  // State
  const taskbarState = {
    activeWindowId: null,
    taskbarItems: new Map(), // Map of windowId -> taskbarItem
    isStartMenuOpen: false,
    clockInterval: null
  };
  
  // Initialize
  function init() {
    setupStartButton();
    setupClock();
    setupTaskbarKeyboardNavigation();
    
    // Initial taskbar update
    updateTaskbar();
    
    console.log('Enhanced Taskbar Manager initialized');
  }
  
  // Set up the Start button
  function setupStartButton() {
    if (!startButton) return;
    
    // Start button already has click handlers in enhanced-start-menu.js
    // Here we just make sure it's properly accessible
    startButton.setAttribute('role', 'button');
    startButton.setAttribute('tabindex', '0');
    startButton.setAttribute('aria-label', 'Start Menu');
    startButton.setAttribute('aria-expanded', 'false');
    startButton.setAttribute('aria-controls', 'start-menu');
  }
  
  // Set up the clock
  function setupClock() {
    if (!clock) return;
    
    // Update clock immediately
    updateClock();
    
    // Update clock every minute
    taskbarState.clockInterval = setInterval(updateClock, 60000);
  }
  
  // Update the clock
  function updateClock() {
    if (!clock) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    clock.textContent = `${hours12}:${minutesStr} ${ampm}`;
    clock.setAttribute('title', now.toLocaleString());
    clock.setAttribute('aria-label', `Current time: ${hours12}:${minutesStr} ${ampm}`);
  }
  
  // Update the taskbar to reflect open windows
  function updateTaskbar() {
    if (!openWindowsContainer) return;
    
    // Clear existing taskbar items
    openWindowsContainer.innerHTML = '';
    taskbarState.taskbarItems.clear();
    
    // Get all visible windows
    const windows = document.querySelectorAll('.win95-window');
    
    // Add taskbar items for each visible window
    windows.forEach(windowElement => {
      if (windowElement.style.display !== 'none') {
        addTaskbarItem(windowElement);
      }
    });
  }
  
  // Add a taskbar item for a window
  function addTaskbarItem(windowElement) {
    if (!openWindowsContainer || !windowElement) return;
    
    const windowId = windowElement.id;
    if (!windowId) return;
    
    // Create taskbar item
    const taskbarItem = document.createElement('div');
    taskbarItem.className = 'taskbar-item';
    taskbarItem.setAttribute('data-window-id', windowId);
    taskbarItem.setAttribute('role', 'button');
    taskbarItem.setAttribute('tabindex', '0');
    
    // Get window title and icon
    const titleElement = windowElement.querySelector('.window-title span');
    const iconElement = windowElement.querySelector('.window-icon');
    
    const title = titleElement ? titleElement.textContent : windowId;
    const iconSrc = iconElement ? iconElement.src : '/images/win95/window.png';
    
    // Create icon
    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    
    // Create title
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    
    // Add elements to taskbar item
    taskbarItem.appendChild(icon);
    taskbarItem.appendChild(titleSpan);
    
    // Set active state if this is the active window
    if (windowId === taskbarState.activeWindowId) {
      taskbarItem.classList.add('active');
    }
    
    // Add click handler
    taskbarItem.addEventListener('click', () => {
      toggleWindow(windowId);
    });
    
    // Add keyboard handler
    taskbarItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleWindow(windowId);
      }
    });
    
    // Add to container and state
    openWindowsContainer.appendChild(taskbarItem);
    taskbarState.taskbarItems.set(windowId, taskbarItem);
  }
  
  // Toggle a window's visibility from the taskbar
  function toggleWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    const isVisible = windowElement.style.display !== 'none';
    const isActive = windowId === taskbarState.activeWindowId;
    
    if (isVisible && isActive) {
      // Minimize the window
      minimizeWindow(windowId);
    } else if (isVisible && !isActive) {
      // Bring window to front
      activateWindow(windowId);
    } else {
      // Restore the window
      restoreWindow(windowId);
    }
  }
  
  // Minimize a window
  function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    // Use the window manager's minimize function if available
    if (typeof window.minimizeWindow === 'function') {
      window.minimizeWindow(windowId);
    } else {
      // Fallback
      windowElement.style.display = 'none';
    }
    
    // Update taskbar item
    const taskbarItem = taskbarState.taskbarItems.get(windowId);
    if (taskbarItem) {
      taskbarItem.classList.remove('active');
    }
    
    // Update active window
    if (windowId === taskbarState.activeWindowId) {
      taskbarState.activeWindowId = null;
    }
  }
  
  // Restore a window
  function restoreWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    // Show the window
    windowElement.style.display = 'block';
    
    // Activate the window
    activateWindow(windowId);
  }
  
  // Activate a window (bring to front)
  function activateWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    
    // Use the window manager's activate function if available
    if (typeof window.activateWindow === 'function') {
      window.activateWindow(windowId);
    } else {
      // Fallback
      windowElement.style.zIndex = '1000';
    }
    
    // Update taskbar items
    taskbarState.taskbarItems.forEach((item, id) => {
      if (id === windowId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    // Update active window
    taskbarState.activeWindowId = windowId;
  }
  
  // Set up keyboard navigation for the taskbar
  function setupTaskbarKeyboardNavigation() {
    if (!taskbar) return;
    
    // Add keyboard navigation between taskbar items
    taskbar.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Let the browser handle tab navigation
        return;
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        
        const focusableElements = Array.from(taskbar.querySelectorAll('[tabindex="0"]'));
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        } else {
          nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }
        
        focusableElements[nextIndex].focus();
      }
    });
  }
  
  // Initialize the taskbar
  init();
  
  // Export functions for global use
  window.updateTaskbar = updateTaskbar;
  window.addTaskbarItem = addTaskbarItem;
  window.activateWindowInTaskbar = activateWindow;
  window.minimizeWindowInTaskbar = minimizeWindow;
  window.restoreWindowInTaskbar = restoreWindow;
});
