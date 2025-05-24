/**
 * Windows 95 Window Manager
 * Handles window dragging, resizing, and other window management functions
 * for the NosytOS95 interface
 */

(function() {
  'use strict';

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initWindowManager);

  function initWindowManager() {
    const desktop = document.getElementById('desktop');
    if (!desktop) return;

    const windows = document.querySelectorAll('.win95-window');
    if (windows.length === 0) return;

    // Add resize handles to all windows
    windows.forEach(window => {
      // Add resize handle if it doesn't exist
      if (!window.querySelector('.win95-resize-handle')) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'win95-resize-handle';
        window.appendChild(resizeHandle);
      }

      // Setup window functionality
      setupWindow(window, desktop);
    });

    // Update taskbar initially
    updateTaskbar();
  }

  /**
   * Setup window dragging, resizing, and controls
   * @param {HTMLElement} window - The window element
   * @param {HTMLElement} desktop - The desktop element
   */
  function setupWindow(window, desktop) {
    const header = window.querySelector('.window-header');
    let isDragging = false;
    let isResizing = false;
    let offsetX, offsetY;
    let startWidth, startHeight;
    let startX, startY;
    let initialLeft, initialTop;

    // Add ARIA attributes for accessibility
    window.setAttribute('role', 'dialog');
    window.setAttribute('aria-modal', 'true');

    // Add title from window header if available
    const title = header ? header.textContent.trim() : 'Window';
    window.setAttribute('aria-label', title);

    // Make window focusable
    window.setAttribute('tabindex', '-1');

    // Add keyboard navigation for window
    window.addEventListener('keydown', function(e) {
      // Escape key closes window
      if (e.key === 'Escape') {
        const closeButton = window.querySelector('.window-close');
        if (closeButton) {
          closeButton.click();
        }
      }

      // Enter key on header maximizes/restores window
      if (e.key === 'Enter' && e.target === header) {
        const maximizeButton = window.querySelector('.window-maximize');
        if (maximizeButton) {
          maximizeButton.click();
        }
      }
    });

    // Dragging functionality with improved touch support
    if (header) {
      // Mouse dragging
      header.addEventListener('mousedown', function(e) {
        // Don't drag when clicking controls
        if (e.target.closest('.window-controls')) return;

        isDragging = true;
        offsetX = e.clientX - window.getBoundingClientRect().left;
        offsetY = e.clientY - window.getBoundingClientRect().top;
        initialLeft = window.offsetLeft;
        initialTop = window.offsetTop;

        // Bring window to front
        bringToFront(window);

        // Prevent text selection during drag
        e.preventDefault();

        // Add dragging class for visual feedback
        window.classList.add('win95-dragging');
      });

      // Touch dragging
      header.addEventListener('touchstart', function(e) {
        // Don't drag when touching controls
        if (e.target.closest('.window-controls')) return;

        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - window.getBoundingClientRect().left;
        offsetY = touch.clientY - window.getBoundingClientRect().top;
        initialLeft = window.offsetLeft;
        initialTop = window.offsetTop;

        // Bring window to front
        bringToFront(window);

        // Prevent scrolling during drag
        e.preventDefault();

        // Add dragging class for visual feedback
        window.classList.add('win95-dragging');
      });

      // Double-click header to maximize/restore
      header.addEventListener('dblclick', function(e) {
        // Don't maximize when double-clicking controls
        if (e.target.closest('.window-controls')) return;

        const maximizeButton = window.querySelector('.window-maximize');
        if (maximizeButton) {
          maximizeButton.click();
        }
      });
    }

    // Resizing functionality with improved touch support
    const resizeHandle = window.querySelector('.win95-resize-handle');
    if (resizeHandle) {
      // Add ARIA attributes for accessibility
      resizeHandle.setAttribute('role', 'button');
      resizeHandle.setAttribute('aria-label', 'Resize window');
      resizeHandle.setAttribute('tabindex', '0');

      // Mouse resizing
      resizeHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        isResizing = true;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = parseInt(window.style.left) || 0;
        initialTop = parseInt(window.style.top) || 0;

        // Bring window to front
        bringToFront(window);

        // Prevent text selection during resize
        e.preventDefault();

        // Add resizing class for visual feedback
        window.classList.add('win95-resizing');
      });

      // Touch resizing
      resizeHandle.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        isResizing = true;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        initialLeft = parseInt(window.style.left) || 0;
        initialTop = parseInt(window.style.top) || 0;

        // Bring window to front
        bringToFront(window);

        // Prevent scrolling during resize
        e.preventDefault();

        // Add resizing class for visual feedback
        window.classList.add('win95-resizing');
      });

      // Keyboard resizing
      resizeHandle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          // Toggle resize mode
          isResizing = !isResizing;

          if (isResizing) {
            startWidth = window.offsetWidth;
            startHeight = window.offsetHeight;
            window.classList.add('win95-resizing');
          } else {
            window.classList.remove('win95-resizing');
          }

          e.preventDefault();
        }

        // Arrow keys for resizing when in resize mode
        if (isResizing) {
          const step = e.shiftKey ? 10 : 5;

          switch (e.key) {
            case 'ArrowRight':
              window.style.width = (window.offsetWidth + step) + 'px';
              break;
            case 'ArrowDown':
              window.style.height = (window.offsetHeight + step) + 'px';
              break;
            case 'ArrowLeft':
              window.style.width = Math.max(300, window.offsetWidth - step) + 'px';
              break;
            case 'ArrowUp':
              window.style.height = Math.max(200, window.offsetHeight - step) + 'px';
              break;
          }

          e.preventDefault();
        }
      });
    }

    // Mouse move handler for dragging and resizing
    document.addEventListener('mousemove', function(e) {
      handleMove(e.clientX, e.clientY);
    });

    // Touch move handler for dragging and resizing
    document.addEventListener('touchmove', function(e) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);

      // Prevent scrolling during drag/resize
      if (isDragging || isResizing) {
        e.preventDefault();
      }
    });

    // Unified move handler for both mouse and touch
    function handleMove(clientX, clientY) {
      // Handle dragging with improved bounds checking
      if (isDragging) {
        const x = clientX - offsetX;
        const y = clientY - offsetY;

        // Get desktop dimensions
        const desktopWidth = desktop.offsetWidth;
        const desktopHeight = desktop.offsetHeight;
        const taskbarHeight = 30; // Height of the taskbar

        // Calculate maximum positions to keep window within bounds
        // Ensure at least 100px of the window is always visible
        const maxX = desktopWidth - 100;
        const maxY = desktopHeight - taskbarHeight - 30; // 30px for window header

        // Calculate minimum positions to keep window within bounds
        // Ensure at least 100px of the window is always visible
        const minX = -window.offsetWidth + 100;
        const minY = 0; // Don't allow window to go above the desktop

        // Apply constraints
        const newX = Math.max(minX, Math.min(x, maxX));
        const newY = Math.max(minY, Math.min(y, maxY));

        window.style.left = newX + 'px';
        window.style.top = newY + 'px';

        // Update cursor to indicate dragging
        document.body.style.cursor = 'move';

        // Add visual feedback for dragging
        window.style.transition = 'none';
        window.style.opacity = '0.95';
      }

      // Handle resizing with improved bounds checking
      if (isResizing) {
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // Calculate new dimensions with minimum constraints
        const minWidth = 300;
        const minHeight = 200;
        const newWidth = Math.max(minWidth, startWidth + deltaX);
        const newHeight = Math.max(minHeight, startHeight + deltaY);

      // Ensure windows can be properly resized to larger dimensions
      const maxWidth = Math.min(1920, desktop.offsetWidth);
      const maxHeight = Math.min(1080, desktop.offsetHeight - 30); // Account for taskbar

        // Calculate new position to ensure window stays within desktop bounds
        let newLeft = parseInt(window.style.left) || 0;
        let newTop = parseInt(window.style.top) || 0;

        // Ensure window doesn't go off-screen
        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;

        // Ensure window doesn't exceed desktop width/height
        const maxWidth = desktop.offsetWidth - newLeft;
        const maxHeight = desktop.offsetHeight - newTop - 30; // Account for taskbar

        // Apply new dimensions with constraints
        window.style.width = Math.min(newWidth, maxWidth) + 'px';
        window.style.height = Math.min(newHeight, maxHeight) + 'px';
        window.style.left = newLeft + 'px';
        window.style.top = newTop + 'px';

        // Update cursor to indicate resizing
        document.body.style.cursor = 'nwse-resize';

        // Add visual feedback for resizing
        window.style.transition = 'none';
        window.style.opacity = '0.95';

        // Update content that needs resizing
        if (typeof updateDuckHuntGame === 'function') {
          updateDuckHuntGame();
        }
      }
    }

    // Mouse up handler to stop dragging and resizing
    document.addEventListener('mouseup', function() {
      handleEnd();
    });

    // Touch end handler to stop dragging and resizing
    document.addEventListener('touchend', function() {
      handleEnd();
    });

    // Unified end handler for both mouse and touch
    function handleEnd() {
      if (isDragging || isResizing) {
        // Reset cursor
        document.body.style.cursor = 'default';

        // Reset states
        isDragging = false;
        isResizing = false;

        // Remove visual feedback classes
        window.classList.remove('win95-dragging');
        window.classList.remove('win95-resizing');

        // Restore opacity with transition
        window.style.transition = 'opacity 0.2s ease';
        window.style.opacity = '1';

        // Update taskbar to reflect any changes
        updateTaskbar();

        // Focus the window for keyboard navigation
        window.focus();
      }
    }

    // Window controls
    setupWindowControls(window);
  }

  /**
   * Setup window control buttons (minimize, maximize, close)
   * @param {HTMLElement} window - The window element
   */
  function setupWindowControls(window) {
    // Add ARIA attributes to window controls
    const windowControls = window.querySelector('.window-controls');
    if (windowControls) {
      windowControls.setAttribute('role', 'toolbar');
      windowControls.setAttribute('aria-label', 'Window controls');
    }

    // Close button
    const closeButton = window.querySelector('.window-close');
    if (closeButton) {
      // Add accessibility attributes
      closeButton.setAttribute('aria-label', 'Close window');
      closeButton.setAttribute('role', 'button');
      closeButton.setAttribute('tabindex', '0');

      // Add event listeners for mouse, touch, and keyboard
      closeButton.addEventListener('click', closeWindow);
      closeButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        closeWindow();
      });
      closeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          closeWindow();
          e.preventDefault();
        }
      });

      function closeWindow() {
        // Add closing animation
        window.classList.add('win95-closing');

        // Hide window after animation
        setTimeout(() => {
          window.style.display = 'none';
          window.classList.remove('win95-closing');
          updateTaskbar();
        }, 300);
      }
    }

    // Minimize button
    const minimizeButton = window.querySelector('.window-minimize');
    if (minimizeButton) {
      // Add accessibility attributes
      minimizeButton.setAttribute('aria-label', 'Minimize window');
      minimizeButton.setAttribute('role', 'button');
      minimizeButton.setAttribute('tabindex', '0');

      // Add event listeners for mouse, touch, and keyboard
      minimizeButton.addEventListener('click', minimizeWindow);
      minimizeButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        minimizeWindow();
      });
      minimizeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          minimizeWindow();
          e.preventDefault();
        }
      });

      function minimizeWindow() {
        // Add minimizing animation
        window.classList.add('win95-minimizing');

        // Hide window after animation
        setTimeout(() => {
          window.style.display = 'none';
          window.classList.remove('win95-minimizing');
          updateTaskbar();
        }, 300);
      }
    }

    // Maximize button
    const maximizeButton = window.querySelector('.window-maximize');
    if (maximizeButton) {
      // Add accessibility attributes
      maximizeButton.setAttribute('role', 'button');
      maximizeButton.setAttribute('tabindex', '0');

      // Set initial state
      updateMaximizeButtonState();

      // Add event listeners for mouse, touch, and keyboard
      maximizeButton.addEventListener('click', toggleMaximize);
      maximizeButton.addEventListener('touchend', function(e) {
        e.preventDefault();
        toggleMaximize();
      });
      maximizeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleMaximize();
          e.preventDefault();
        }
      });

      function toggleMaximize() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        if (window.classList.contains('maximized')) {
          // Restore window with animation
          window.classList.add('win95-restoring');
          window.classList.remove('maximized');

          // Restore previous dimensions and position
          window.style.width = window.dataset.prevWidth || '800px';
          window.style.height = window.dataset.prevHeight || '600px';
          window.style.left = window.dataset.prevLeft || '50px';
          window.style.top = window.dataset.prevTop || '50px';

          // Update button state
          updateMaximizeButtonState();

          // Show resize handles
          const resizeHandles = window.querySelectorAll('.resize-handle, .win95-resize-handle');
          resizeHandles.forEach(handle => {
            handle.style.display = 'block';
          });

          // Remove animation class after transition
          setTimeout(() => {
            window.classList.remove('win95-restoring');
          }, 300);
        } else {
          // Save current dimensions and position before maximizing
          window.dataset.prevWidth = window.style.width || window.offsetWidth + 'px';
          window.dataset.prevHeight = window.style.height || window.offsetHeight + 'px';
          window.dataset.prevLeft = window.style.left || window.offsetLeft + 'px';
          window.dataset.prevTop = window.style.top || window.offsetTop + 'px';

          // Maximize window with animation
          window.classList.add('win95-maximizing');
          window.classList.add('maximized');

          // Set to desktop dimensions
          window.style.width = '100%';
          window.style.height = 'calc(100% - 30px)'; // Account for taskbar
          window.style.left = '0';
          window.style.top = '0';

          // Update button state
          updateMaximizeButtonState();

          // Hide resize handles
          const resizeHandles = window.querySelectorAll('.resize-handle, .win95-resize-handle');
          resizeHandles.forEach(handle => {
            handle.style.display = 'none';
          });

          // Remove animation class after transition
          setTimeout(() => {
            window.classList.remove('win95-maximizing');
          }, 300);
        }

        // Update any content that needs resizing
        if (typeof updateDuckHuntGame === 'function') {
          updateDuckHuntGame();
        }

        // Update taskbar
        updateTaskbar();

        // Focus the window for keyboard navigation
        window.focus();
      }

      function updateMaximizeButtonState() {
        if (window.classList.contains('maximized')) {
          maximizeButton.textContent = '❐';
          maximizeButton.title = 'Restore';
          maximizeButton.setAttribute('aria-label', 'Restore window');
        } else {
          maximizeButton.textContent = '□';
          maximizeButton.title = 'Maximize';
          maximizeButton.setAttribute('aria-label', 'Maximize window');
        }
      }
    }
  }

  /**
   * Bring a window to the front
   * @param {HTMLElement} window - The window to bring to front
   */
  function bringToFront(window) {
    const windows = document.querySelectorAll('.win95-window');
    let maxZ = 10; // Start at 10 to be above desktop icons

    // Find the highest z-index
    windows.forEach(w => {
      const zIndex = parseInt(w.style.zIndex || 10);
      maxZ = Math.max(maxZ, zIndex);
    });

    // Set this window's z-index to be higher
    window.style.zIndex = (maxZ + 1).toString();

    // Update active state in taskbar
    updateTaskbar();
  }

  /**
   * Update the taskbar to reflect open windows
   */
  function updateTaskbar() {
    const taskbar = document.getElementById('taskbar');
    if (!taskbar) return;

    const windows = document.querySelectorAll('.win95-window');
    const taskbarButtons = taskbar.querySelectorAll('.win95-taskbar-button');

    // Remove active class from all buttons
    taskbarButtons.forEach(button => {
      button.classList.remove('active');
    });

    // Update buttons for visible windows
    windows.forEach(window => {
      const windowId = window.id;
      const isVisible = window.style.display !== 'none';
      const zIndex = parseInt(window.style.zIndex || 10);
      const isActive = isVisible && zIndex === Math.max(...Array.from(windows).map(w => parseInt(w.style.zIndex || 10)));

      const button = taskbar.querySelector(`.win95-taskbar-button[data-window="${windowId}"]`);
      if (button) {
        button.style.display = isVisible ? 'block' : 'none';
        if (isActive) {
          button.classList.add('active');
        }
      }
    });
  }

  // Expose functions to global scope if needed
  window.bringToFront = bringToFront;
  window.updateTaskbar = updateTaskbar;
})();
