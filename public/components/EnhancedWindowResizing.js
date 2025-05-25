/**
 * Enhanced Window Resizing Component for NosytOS95
 * Provides improved window resizing functionality for the Windows 95 interface
 */

class EnhancedWindowResizing {
  constructor() {
    this.windows = [];
    this.activeWindow = null;
    this.resizeHandles = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];
    this.resizing = false;
    this.resizeDirection = null;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.originalX = 0;
    this.originalY = 0;
    this.minWidth = 200;
    this.minHeight = 150;
    
    this.init();
  }

  init() {
    // Initialize window management
    document.addEventListener('DOMContentLoaded', () => {
      this.setupWindows();
      this.setupEventListeners();
    });
  }

  setupWindows() {
    // Find all windows in the DOM
    const windowElements = document.querySelectorAll('.win95-window');
    
    windowElements.forEach(windowEl => {
      // Add resize handles to each window
      this.addResizeHandles(windowEl);
      
      // Store window reference
      this.windows.push({
        element: windowEl,
        maximized: false,
        originalDimensions: null
      });
      
      // Set up window controls
      this.setupWindowControls(windowEl);
    });
  }

  addResizeHandles(windowEl) {
    // Create resize handles for each direction
    this.resizeHandles.forEach(direction => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-handle-${direction}`;
      handle.setAttribute('data-direction', direction);
      windowEl.appendChild(handle);
      
      // Add event listeners for resizing
      handle.addEventListener('mousedown', (e) => this.startResize(e, windowEl, direction));
    });
  }

  setupWindowControls(windowEl) {
    // Find window control buttons
    const minimizeBtn = windowEl.querySelector('.window-control-minimize');
    const maximizeBtn = windowEl.querySelector('.window-control-maximize');
    const closeBtn = windowEl.querySelector('.window-control-close');
    const titleBar = windowEl.querySelector('.window-title-bar');
    
    // Set up event listeners for window controls
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowEl));
    }
    
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowEl));
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeWindow(windowEl));
    }
    
    if (titleBar) {
      titleBar.addEventListener('mousedown', (e) => this.startDrag(e, windowEl));
      titleBar.addEventListener('dblclick', () => this.toggleMaximize(windowEl));
    }
    
    // Make window active on click
    windowEl.addEventListener('mousedown', () => this.setActiveWindow(windowEl));
  }

  startResize(e, windowEl, direction) {
    e.preventDefault();
    e.stopPropagation();
    
    this.resizing = true;
    this.resizeDirection = direction;
    this.activeWindow = windowEl;
    
    // Store initial positions and dimensions
    const rect = windowEl.getBoundingClientRect();
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.originalWidth = rect.width;
    this.originalHeight = rect.height;
    this.originalX = rect.left;
    this.originalY = rect.top;
    
    // Add resize event listeners
    document.addEventListener('mousemove', this.resizeMove);
    document.addEventListener('mouseup', this.resizeEnd);
    
    // Add resizing class to window
    windowEl.classList.add('resizing');
    
    // Set active window
    this.setActiveWindow(windowEl);
  }

  resizeMove = (e) => {
    if (!this.resizing || !this.activeWindow) return;
    
    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;
    
    let newWidth = this.originalWidth;
    let newHeight = this.originalHeight;
    let newX = this.originalX;
    let newY = this.originalY;
    
    // Calculate new dimensions based on resize direction
    switch (this.resizeDirection) {
      case 'right':
        newWidth = Math.max(this.minWidth, this.originalWidth + deltaX);
        break;
      case 'bottom':
        newHeight = Math.max(this.minHeight, this.originalHeight + deltaY);
        break;
      case 'bottom-right':
        newWidth = Math.max(this.minWidth, this.originalWidth + deltaX);
        newHeight = Math.max(this.minHeight, this.originalHeight + deltaY);
        break;
      case 'left':
        newWidth = Math.max(this.minWidth, this.originalWidth - deltaX);
        newX = this.originalX + (this.originalWidth - newWidth);
        break;
      case 'top':
        newHeight = Math.max(this.minHeight, this.originalHeight - deltaY);
        newY = this.originalY + (this.originalHeight - newHeight);
        break;
      case 'top-left':
        newWidth = Math.max(this.minWidth, this.originalWidth - deltaX);
        newHeight = Math.max(this.minHeight, this.originalHeight - deltaY);
        newX = this.originalX + (this.originalWidth - newWidth);
        newY = this.originalY + (this.originalHeight - newHeight);
        break;
      case 'top-right':
        newWidth = Math.max(this.minWidth, this.originalWidth + deltaX);
        newHeight = Math.max(this.minHeight, this.originalHeight - deltaY);
        newY = this.originalY + (this.originalHeight - newHeight);
        break;
      case 'bottom-left':
        newWidth = Math.max(this.minWidth, this.originalWidth - deltaX);
        newHeight = Math.max(this.minHeight, this.originalHeight + deltaY);
        newX = this.originalX + (this.originalWidth - newWidth);
        break;
    }
    
    // Apply new dimensions
    this.activeWindow.style.width = `${newWidth}px`;
    this.activeWindow.style.height = `${newHeight}px`;
    this.activeWindow.style.left = `${newX}px`;
    this.activeWindow.style.top = `${newY}px`;
  }

  resizeEnd = () => {
    if (!this.resizing) return;
    
    this.resizing = false;
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeEnd);
    
    // Remove resizing class
    if (this.activeWindow) {
      this.activeWindow.classList.remove('resizing');
    }
  }

  startDrag(e, windowEl) {
    // Don't drag if maximized
    const windowData = this.windows.find(w => w.element === windowEl);
    if (windowData && windowData.maximized) return;
    
    // Don't drag if clicking on window controls
    if (e.target.closest('.window-control')) return;
    
    e.preventDefault();
    
    const rect = windowEl.getBoundingClientRect();
    this.dragStartX = e.clientX - rect.left;
    this.dragStartY = e.clientY - rect.top;
    
    // Add drag event listeners
    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mouseup', this.dragEnd);
    
    // Add dragging class to window
    windowEl.classList.add('dragging');
    
    // Set active window
    this.setActiveWindow(windowEl);
  }

  dragMove = (e) => {
    if (!this.activeWindow) return;
    
    const newX = e.clientX - this.dragStartX;
    const newY = e.clientY - this.dragStartY;
    
    // Apply new position
    this.activeWindow.style.left = `${newX}px`;
    this.activeWindow.style.top = `${newY}px`;
  }

  dragEnd = () => {
    // Remove event listeners
    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.dragEnd);
    
    // Remove dragging class
    if (this.activeWindow) {
      this.activeWindow.classList.remove('dragging');
    }
  }

  setActiveWindow(windowEl) {
    // Remove active class from all windows
    this.windows.forEach(window => {
      window.element.classList.remove('active');
      window.element.style.zIndex = '10';
    });
    
    // Add active class to clicked window
    windowEl.classList.add('active');
    windowEl.style.zIndex = '100';
    this.activeWindow = windowEl;
  }

  minimizeWindow(windowEl) {
    // Implement minimize functionality
    windowEl.classList.add('minimized');
    windowEl.style.display = 'none';
    
    // Update taskbar
    this.updateTaskbar();
  }

  toggleMaximize(windowEl) {
    const windowData = this.windows.find(w => w.element === windowEl);
    
    if (!windowData) return;
    
    if (windowData.maximized) {
      // Restore window
      if (windowData.originalDimensions) {
        const { width, height, left, top } = windowData.originalDimensions;
        windowEl.style.width = width;
        windowEl.style.height = height;
        windowEl.style.left = left;
        windowEl.style.top = top;
        windowEl.style.borderRadius = '6px';
      }
      windowEl.classList.remove('maximized');
      windowData.maximized = false;
    } else {
      // Maximize window
      // Store original dimensions
      windowData.originalDimensions = {
        width: windowEl.style.width,
        height: windowEl.style.height,
        left: windowEl.style.left,
        top: windowEl.style.top
      };
      
      // Set maximized dimensions
      windowEl.style.width = '100%';
      windowEl.style.height = 'calc(100% - 40px)';
      windowEl.style.left = '0';
      windowEl.style.top = '0';
      windowEl.style.borderRadius = '0';
      
      windowEl.classList.add('maximized');
      windowData.maximized = true;
    }
  }

  closeWindow(windowEl) {
    // Hide window
    windowEl.style.display = 'none';
    
    // Update taskbar
    this.updateTaskbar();
  }

  updateTaskbar() {
    // Update taskbar buttons based on window state
    const taskbar = document.querySelector('.win95-taskbar');
    if (!taskbar) return;
    
    // Clear existing taskbar buttons
    const taskbarButtons = taskbar.querySelectorAll('.taskbar-button:not(.start-button)');
    taskbarButtons.forEach(button => button.remove());
    
    // Add buttons for non-minimized windows
    this.windows.forEach(window => {
      if (window.element.style.display !== 'none') {
        const title = window.element.querySelector('.window-title').textContent;
        const icon = window.element.querySelector('.window-icon').src;
        
        this.addTaskbarButton(taskbar, title, icon, window.element);
      }
    });
  }

  addTaskbarButton(taskbar, title, icon, windowEl) {
    const button = document.createElement('div');
    button.className = 'taskbar-button';
    
    const iconEl = document.createElement('img');
    iconEl.src = icon;
    iconEl.alt = title;
    
    const titleEl = document.createElement('span');
    titleEl.textContent = title;
    
    button.appendChild(iconEl);
    button.appendChild(titleEl);
    
    // Add click event to show/hide window
    button.addEventListener('click', () => {
      if (windowEl.style.display === 'none') {
        windowEl.style.display = 'block';
        this.setActiveWindow(windowEl);
      } else if (windowEl.classList.contains('active')) {
        windowEl.style.display = 'none';
      } else {
        this.setActiveWindow(windowEl);
      }
    });
    
    taskbar.appendChild(button);
  }

  setupEventListeners() {
    // Global event listeners
    document.addEventListener('click', (e) => {
      // Check if click is outside any window
      const isOutsideWindow = !e.target.closest('.win95-window');
      
      if (isOutsideWindow) {
        // Deactivate all windows
        this.windows.forEach(window => {
          window.element.classList.remove('active');
        });
        
        this.activeWindow = null;
      }
    });
  }
}

// Initialize the enhanced window resizing
const windowManager = new EnhancedWindowResizing();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = windowManager;
}
