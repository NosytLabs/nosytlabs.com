/**
 * EnhancedWindowResizing.js
 * Improved window resizing and dragging functionality for NosytOS95
 */

// Initialize window management when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeWindowManagement();
});

function initializeWindowManagement() {
  // Get all windows
  const windows = document.querySelectorAll('.win95-window');
  
  // Initialize each window
  windows.forEach(window => {
    makeWindowDraggable(window);
    makeWindowResizable(window);
    setupWindowControls(window);
  });
  
  // Set up desktop icons
  setupDesktopIcons();
  
  // Set up taskbar
  setupTaskbar();
}

/**
 * Make a window draggable by its header
 */
function makeWindowDraggable(window) {
  const header = window.querySelector('.window-header');
  if (!header) return;
  
  let isDragging = false;
  let offsetX, offsetY;
  
  header.addEventListener('mousedown', function(e) {
    // Don't start drag if clicking on window controls
    if (e.target.closest('.window-controls')) return;
    
    isDragging = true;
    
    // Bring window to front
    bringToFront(window);
    
    // Calculate the offset of the mouse pointer relative to the window
    const rect = window.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    // Add dragging class for visual feedback
    window.classList.add('dragging');
    
    // Prevent text selection during drag
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    // Calculate new position
    const desktop = document.querySelector('.win95-desktop');
    const desktopRect = desktop.getBoundingClientRect();
    
    let newLeft = e.clientX - offsetX - desktopRect.left;
    let newTop = e.clientY - offsetY - desktopRect.top;
    
    // Constrain to desktop
    newLeft = Math.max(0, Math.min(newLeft, desktopRect.width - window.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, desktopRect.height - window.offsetHeight - 30)); // Account for taskbar
    
    // Apply new position
    window.style.left = newLeft + 'px';
    window.style.top = newTop + 'px';
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      window.classList.remove('dragging');
    }
  });
}

/**
 * Make a window resizable using resize handles
 */
function makeWindowResizable(window) {
  const handles = window.querySelectorAll('.resize-handle');
  
  handles.forEach(handle => {
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    handle.addEventListener('mousedown', function(e) {
      isResizing = true;
      
      // Bring window to front
      bringToFront(window);
      
      // Get initial dimensions and position
      const rect = window.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;
      startLeft = rect.left;
      startTop = rect.top;
      
      // Add resizing class for visual feedback
      window.classList.add('resizing');
      
      // Prevent text selection during resize
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isResizing) return;
      
      // Calculate dimension changes based on handle type
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const desktop = document.querySelector('.win95-desktop');
      const desktopRect = desktop.getBoundingClientRect();
      
      // Minimum dimensions
      const minWidth = 300;
      const minHeight = 200;
      
      // Apply resizing based on handle position
      if (handle.classList.contains('resize-handle-e') || 
          handle.classList.contains('resize-handle-se') || 
          handle.classList.contains('resize-handle-ne')) {
        // East resize (right)
        let newWidth = Math.max(minWidth, startWidth + deltaX);
        newWidth = Math.min(newWidth, desktopRect.width - (startLeft - desktopRect.left));
        window.style.width = newWidth + 'px';
      }
      
      if (handle.classList.contains('resize-handle-s') || 
          handle.classList.contains('resize-handle-se') || 
          handle.classList.contains('resize-handle-sw')) {
        // South resize (bottom)
        let newHeight = Math.max(minHeight, startHeight + deltaY);
        newHeight = Math.min(newHeight, desktopRect.height - (startTop - desktopRect.top) - 30); // Account for taskbar
        window.style.height = newHeight + 'px';
      }
      
      if (handle.classList.contains('resize-handle-w') || 
          handle.classList.contains('resize-handle-sw') || 
          handle.classList.contains('resize-handle-nw')) {
        // West resize (left)
        let newWidth = Math.max(minWidth, startWidth - deltaX);
        let newLeft = startLeft + deltaX;
        
        // Constrain to desktop
        if (newLeft >= desktopRect.left) {
          window.style.width = newWidth + 'px';
          window.style.left = (newLeft - desktopRect.left) + 'px';
        }
      }
      
      if (handle.classList.contains('resize-handle-n') || 
          handle.classList.contains('resize-handle-ne') || 
          handle.classList.contains('resize-handle-nw')) {
        // North resize (top)
        let newHeight = Math.max(minHeight, startHeight - deltaY);
        let newTop = startTop + deltaY;
        
        // Constrain to desktop
        if (newTop >= desktopRect.top) {
          window.style.height = newHeight + 'px';
          window.style.top = (newTop - desktopRect.top) + 'px';
        }
      }
      
      // Update content for specific windows
      updateWindowContent(window);
    });
    
    document.addEventListener('mouseup', function() {
      if (isResizing) {
        isResizing = false;
        window.classList.remove('resizing');
      }
    });
  });
}

/**
 * Set up window control buttons (minimize, maximize, close)
 */
function setupWindowControls(window) {
  const minimizeBtn = window.querySelector('.window-minimize');
  const maximizeBtn = window.querySelector('.window-maximize');
  const closeBtn = window.querySelector('.window-close');
  
  // Store original dimensions for restore
  window.dataset.originalWidth = window.style.width || '800px';
  window.dataset.originalHeight = window.style.height || '600px';
  window.dataset.originalLeft = window.style.left || '50px';
  window.dataset.originalTop = window.style.top || '50px';
  
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', function() {
      window.style.display = 'none';
      updateTaskbar();
    });
  }
  
  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', function() {
      const desktop = document.querySelector('.win95-desktop');
      const desktopRect = desktop.getBoundingClientRect();
      
      if (window.classList.contains('maximized')) {
        // Restore
        window.style.width = window.dataset.originalWidth;
        window.style.height = window.dataset.originalHeight;
        window.style.left = window.dataset.originalLeft;
        window.style.top = window.dataset.originalTop;
        window.classList.remove('maximized');
      } else {
        // Maximize
        window.dataset.originalWidth = window.style.width;
        window.dataset.originalHeight = window.style.height;
        window.dataset.originalLeft = window.style.left;
        window.dataset.originalTop = window.style.top;
        
        window.style.width = (desktopRect.width - 4) + 'px';
        window.style.height = (desktopRect.height - 34) + 'px'; // Account for taskbar
        window.style.left = '0px';
        window.style.top = '0px';
        window.classList.add('maximized');
      }
      
      // Update content for specific windows
      updateWindowContent(window);
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      window.style.display = 'none';
      updateTaskbar();
    });
  }
}

/**
 * Update window content based on resize
 */
function updateWindowContent(window) {
  // Update Duck Hunt game if that window was resized
  if (window.id === 'duck-hunt-window') {
    updateDuckHuntGame();
  }
  
  // Update Doom game if that window was resized
  if (window.id === 'doom-window') {
    updateDoomGame();
  }
}

/**
 * Set up desktop icons to open windows
 */
function setupDesktopIcons() {
  const icons = document.querySelectorAll('.desktop-icon');
  
  icons.forEach(icon => {
    icon.addEventListener('click', function() {
      const windowId = this.id.replace('-icon', '-window');
      const windowElement = document.getElementById(windowId);
      
      if (windowElement) {
        // Position window in center if not already positioned
        if (!windowElement.style.left) {
          const desktop = document.querySelector('.win95-desktop');
          const left = (desktop.offsetWidth - windowElement.offsetWidth) / 2;
          const top = (desktop.offsetHeight - windowElement.offsetHeight) / 2;
          windowElement.style.left = left + 'px';
          windowElement.style.top = top + 'px';
        }
        
        windowElement.style.display = 'block';
        bringToFront(windowElement);
        updateTaskbar();
      }
    });
  });
}

/**
 * Set up taskbar functionality
 */
function setupTaskbar() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');
  
  if (startButton && startMenu) {
    startButton.addEventListener('click', function() {
      if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
      } else {
        startMenu.style.display = 'block';
      }
    });
    
    // Close start menu when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
        startMenu.style.display = 'none';
      }
    });
  }
}

/**
 * Bring a window to the front
 */
function bringToFront(window) {
  const windows = document.querySelectorAll('.win95-window');
  let maxZIndex = 0;
  
  // Find the highest z-index
  windows.forEach(w => {
    const zIndex = parseInt(w.style.zIndex || 0);
    maxZIndex = Math.max(maxZIndex, zIndex);
  });
  
  // Set this window's z-index higher
  window.style.zIndex = maxZIndex + 1;
}

/**
 * Update taskbar with open windows
 */
function updateTaskbar() {
  const openWindowsContainer = document.querySelector('.open-windows');
  if (!openWindowsContainer) return;
  
  const windows = document.querySelectorAll('.win95-window');
  
  openWindowsContainer.innerHTML = '';
  
  windows.forEach(window => {
    if (window.style.display !== 'none') {
      const title = window.querySelector('.window-title span').textContent;
      const icon = window.querySelector('.window-icon').src;
      
      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'taskbar-item';
      
      const iconImg = document.createElement('img');
      iconImg.src = icon;
      iconImg.alt = title;
      
      const titleSpan = document.createElement('span');
      titleSpan.textContent = title;
      
      taskbarItem.appendChild(iconImg);
      taskbarItem.appendChild(titleSpan);
      
      // Click handler to focus window
      taskbarItem.addEventListener('click', function() {
        if (window.style.display === 'none') {
          window.style.display = 'block';
        }
        bringToFront(window);
      });
      
      openWindowsContainer.appendChild(taskbarItem);
    }
  });
}

// Export functions for use in other scripts
window.bringToFront = bringToFront;
window.updateTaskbar = updateTaskbar;
window.updateWindowContent = updateWindowContent;
