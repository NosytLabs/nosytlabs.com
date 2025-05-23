/**
 * Enhanced Window Resizing for NosytOS95
 * This script improves the window resizing functionality for the NosytOS95 interface
 * with better handling of resize events, improved bounds checking, and smoother animations.
 */

(function() {
  'use strict';

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initEnhancedResizing);

  // Global variables
  let isResizing = false;
  let currentWindow = null;
  let currentHandle = null;
  let startWidth, startHeight, startX, startY;
  let initialLeft, initialTop;

  // Minimum window dimensions
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 200;

  function initEnhancedResizing() {
    // Get all windows
    const windows = document.querySelectorAll('.win95-window');
    if (windows.length === 0) return;

    // Add resize handles to all windows
    windows.forEach(window => {
      setupResizeHandles(window);
    });

    // Add document event listeners for mouse movement and release
    setupGlobalEventListeners();

    console.log('Enhanced window resizing initialized');
  }

  function setupResizeHandles(window) {
    // Create resize handles if they don't exist
    if (!window.querySelector('.resize-handle-e')) {
      // Create all resize handles
      const directions = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw'];
      
      directions.forEach(direction => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${direction}`;
        handle.setAttribute('data-direction', direction);
        window.appendChild(handle);
      });
    }

    // Add event listeners to all resize handles
    const handles = window.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
      handle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        isResizing = true;
        currentWindow = window;
        currentHandle = handle;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseInt(window.style.left) || 0;
        initialTop = parseInt(window.style.top) || 0;

        // Bring window to front
        if (typeof bringToFront === 'function') {
          bringToFront(window);
        } else {
          window.style.zIndex = 1000;
        }

        // Add active class to window
        window.classList.add('active');

        // Prevent text selection during resize
        e.preventDefault();
      });
    });
  }

  function setupGlobalEventListeners() {
    // Mouse move event for resizing
    document.addEventListener('mousemove', handleMouseMove);

    // Mouse up event to stop resizing
    document.addEventListener('mouseup', function() {
      if (isResizing && currentWindow) {
        // Reset cursor
        document.body.style.cursor = 'default';
        
        // Remove active class
        currentWindow.classList.remove('resizing');
        
        // Reset state
        isResizing = false;
        currentWindow = null;
        currentHandle = null;
      }
    });

    // Window resize event to ensure windows stay within viewport
    window.addEventListener('resize', function() {
      const windows = document.querySelectorAll('.win95-window');
      const desktop = document.querySelector('.win95-desktop') || document.body;
      
      windows.forEach(window => {
        // Ensure window is within desktop bounds after viewport resize
        const maxX = desktop.offsetWidth - 100; // Ensure at least 100px is visible
        const maxY = desktop.offsetHeight - 100; // Ensure at least 100px is visible
        
        const currentX = parseInt(window.style.left) || 0;
        const currentY = parseInt(window.style.top) || 0;
        
        if (currentX > maxX) {
          window.style.left = maxX + 'px';
        }
        
        if (currentY > maxY) {
          window.style.top = maxY + 'px';
        }
      });
    });
  }

  function handleMouseMove(e) {
    if (!isResizing || !currentWindow || !currentHandle) return;

    // Get resize direction
    const direction = currentHandle.getAttribute('data-direction');
    
    // Calculate deltas
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    // Get desktop bounds
    const desktop = document.querySelector('.win95-desktop') || document.body;
    const maxWidth = desktop.offsetWidth - initialLeft;
    const maxHeight = desktop.offsetHeight - initialTop;

    // Handle resizing based on direction
    switch (direction) {
      case 'e': // East (right)
        resizeEast(deltaX, maxWidth);
        break;
      case 's': // South (bottom)
        resizeSouth(deltaY, maxHeight);
        break;
      case 'se': // Southeast (bottom-right)
        resizeEast(deltaX, maxWidth);
        resizeSouth(deltaY, maxHeight);
        break;
      case 'n': // North (top)
        resizeNorth(deltaY);
        break;
      case 'w': // West (left)
        resizeWest(deltaX);
        break;
      case 'ne': // Northeast (top-right)
        resizeNorth(deltaY);
        resizeEast(deltaX, maxWidth);
        break;
      case 'nw': // Northwest (top-left)
        resizeNorth(deltaY);
        resizeWest(deltaX);
        break;
      case 'sw': // Southwest (bottom-left)
        resizeSouth(deltaY, maxHeight);
        resizeWest(deltaX);
        break;
    }

    // Add resizing class for styling
    currentWindow.classList.add('resizing');
    
    // Update cursor based on direction
    document.body.style.cursor = direction + '-resize';
  }

  // Resize functions for each direction
  function resizeEast(deltaX, maxWidth) {
    if (!currentWindow) return;
    
    const newWidth = Math.max(MIN_WIDTH, Math.min(startWidth + deltaX, maxWidth));
    currentWindow.style.width = newWidth + 'px';
  }

  function resizeSouth(deltaY, maxHeight) {
    if (!currentWindow) return;
    
    const newHeight = Math.max(MIN_HEIGHT, Math.min(startHeight + deltaY, maxHeight));
    currentWindow.style.height = newHeight + 'px';
  }

  function resizeNorth(deltaY) {
    if (!currentWindow) return;
    
    const newHeight = Math.max(MIN_HEIGHT, startHeight - deltaY);
    const newTop = initialTop + (startHeight - newHeight);
    
    currentWindow.style.height = newHeight + 'px';
    currentWindow.style.top = newTop + 'px';
  }

  function resizeWest(deltaX) {
    if (!currentWindow) return;
    
    const newWidth = Math.max(MIN_WIDTH, startWidth - deltaX);
    const newLeft = initialLeft + (startWidth - newWidth);
    
    currentWindow.style.width = newWidth + 'px';
    currentWindow.style.left = newLeft + 'px';
  }
})();
