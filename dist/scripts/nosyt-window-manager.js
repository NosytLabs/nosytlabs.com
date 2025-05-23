/**
 * NosytOS95 Window Manager
 *
 * A consolidated window management system for NosytOS95 that handles:
 * - Window dragging and resizing
 * - Window stacking (z-index management)
 * - Window state management (minimize, maximize, restore, close)
 * - Taskbar integration
 * - Keyboard navigation and accessibility
 *
 * This file consolidates functionality from:
 * - win95-fix.js
 * - enhanced-win95-window-manager.js
 * - window-manager-fix.js
 */

// Global window manager state
const windowManager = {
  windows: new Map(),
  activeWindowId: null,
  highestZIndex: 1000,
  taskbarHeight: 28,
  snapThreshold: 20,
  dragState: null,
  resizeState: null,
  initialized: false,
  soundsEnabled: true,
  sounds: {
    maximize: null,
    minimize: null,
    restore: null,
    close: null,
    error: null,
    open: null
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment to ensure all elements are loaded
  setTimeout(initWindowManager, 500);
});

/**
 * Initialize the window manager
 */
function initWindowManager() {
  if (windowManager.initialized) return;

  console.log('Initializing NosytOS95 Window Manager...');

  // Load sounds
  loadSounds();

  // Register all windows
  registerWindows();

  // Set up global event listeners
  setupGlobalEventListeners();

  // Fix any existing issues
  fixZIndexIssues();

  // Add mutation observer to handle dynamically created windows
  setupMutationObserver();

  // Mark as initialized
  windowManager.initialized = true;

  console.log('NosytOS95 Window Manager initialized');
}

/**
 * Load window manager sounds
 */
function loadSounds() {
  try {
    // Maximize sound
    windowManager.sounds.maximize = new Audio('/sounds/win95/maximize.wav');
    windowManager.sounds.maximize.volume = 0.5;

    // Minimize sound
    windowManager.sounds.minimize = new Audio('/sounds/win95/minimize.wav');
    windowManager.sounds.minimize.volume = 0.5;

    // Restore sound
    windowManager.sounds.restore = new Audio('/sounds/win95/restore.wav');
    windowManager.sounds.restore.volume = 0.5;

    // Close sound
    windowManager.sounds.close = new Audio('/sounds/win95/close.wav');
    windowManager.sounds.close.volume = 0.5;

    // Error sound
    windowManager.sounds.error = new Audio('/sounds/win95/error.wav');
    windowManager.sounds.error.volume = 0.5;

    // Open sound
    windowManager.sounds.open = new Audio('/sounds/win95/open.wav');
    windowManager.sounds.open.volume = 0.5;

    // Use fallbacks if sounds don't exist
    windowManager.sounds.maximize.addEventListener('error', () => {
      windowManager.sounds.maximize = new Audio('/sounds/win95/chord.wav');
    });

    windowManager.sounds.minimize.addEventListener('error', () => {
      windowManager.sounds.minimize = new Audio('/sounds/win95/ding.wav');
    });

    windowManager.sounds.restore.addEventListener('error', () => {
      windowManager.sounds.restore = new Audio('/sounds/win95/chord.wav');
    });

    windowManager.sounds.close.addEventListener('error', () => {
      windowManager.sounds.close = new Audio('/sounds/win95/tada.wav');
    });

    windowManager.sounds.error.addEventListener('error', () => {
      windowManager.sounds.error = new Audio('/sounds/win95/chord.wav');
    });

    windowManager.sounds.open.addEventListener('error', () => {
      windowManager.sounds.open = new Audio('/sounds/win95/chord.wav');
    });
  } catch (error) {
    console.warn('Could not load window manager sounds:', error);
    windowManager.soundsEnabled = false;
  }
}

/**
 * Play a window manager sound
 */
function playSound(sound) {
  if (windowManager.soundsEnabled && sound) {
    try {
      // Clone the sound to allow overlapping playback
      const soundClone = sound.cloneNode();
      soundClone.volume = sound.volume;
      soundClone.play().catch(error => {
        console.warn('Could not play sound:', error);
      });
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }
}

/**
 * Register all windows in the DOM
 */
function registerWindows() {
  const windows = document.querySelectorAll('.win95-window');

  windows.forEach(windowElement => {
    const windowId = windowElement.id;

    if (!windowId) {
      console.warn('Window element has no ID, skipping:', windowElement);
      return;
    }

    initializeWindow(windowId);
  });
}

/**
 * Initialize a window
 */
function initializeWindow(windowId) {
  const windowElement = document.getElementById(windowId);

  if (!windowElement) {
    console.warn(`Window element with ID "${windowId}" not found`);
    return;
  }

  // Skip if already initialized
  if (windowManager.windows.has(windowId)) {
    return;
  }

  // Create window info object
  const windowInfo = {
    id: windowId,
    element: windowElement,
    isOpen: windowElement.style.display !== 'none',
    isMaximized: windowElement.classList.contains('maximized'),
    isMinimized: false,
    zIndex: parseInt(windowElement.style.zIndex) || windowManager.highestZIndex++,
    originalState: null,
    taskbarItem: null
  };

  // Add to windows map
  windowManager.windows.set(windowId, windowInfo);

  // Set up window controls
  setupWindowControls(windowId);

  // Set up window dragging
  setupWindowDragging(windowId);

  // Set up window resizing
  setupWindowResizing(windowId);

  // Add to taskbar
  addToTaskbar(windowId);

  // Make window active when clicked
  windowElement.addEventListener('mousedown', () => {
    activateWindow(windowId);
  });

  // Set initial position if not set
  if (!windowElement.style.left || !windowElement.style.top) {
    // Center window on screen
    const desktop = document.querySelector('.win95-desktop');
    if (desktop) {
      const desktopRect = desktop.getBoundingClientRect();
      const windowWidth = windowElement.offsetWidth || 800;
      const windowHeight = windowElement.offsetHeight || 600;

      const left = Math.max(0, (desktopRect.width - windowWidth) / 2);
      const top = Math.max(0, (desktopRect.height - windowHeight - windowManager.taskbarHeight) / 2);

      windowElement.style.left = `${left}px`;
      windowElement.style.top = `${top}px`;
    }
  }

  // If window is open, activate it
  if (windowInfo.isOpen) {
    activateWindow(windowId);
  }
}

/**
 * Set up window controls (minimize, maximize, close)
 */
function setupWindowControls(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Minimize button
  const minimizeButton = windowElement.querySelector('.window-minimize');
  if (minimizeButton) {
    minimizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      minimizeWindow(windowId);
    });
  }

  // Maximize button
  const maximizeButton = windowElement.querySelector('.window-maximize');
  if (maximizeButton) {
    maximizeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMaximizeWindow(windowId);
    });
  }

  // Close button
  const closeButton = windowElement.querySelector('.window-close');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWindow(windowId);
    });
  }

  // Double-click on title bar to maximize/restore
  const titleBar = windowElement.querySelector('.window-header');
  if (titleBar) {
    titleBar.addEventListener('dblclick', (e) => {
      // Don't maximize when double-clicking controls
      if (e.target.closest('.window-controls')) return;

      toggleMaximizeWindow(windowId);
    });
  }
}

/**
 * Set up window dragging
 */
function setupWindowDragging(windowId) {
  const windowElement = document.getElementById(windowId);

  if (!windowElement) return;

  const titleBar = windowElement.querySelector('.window-header');

  if (!titleBar) return;

  let isDragging = false;
  let startX, startY;
  let startLeft, startTop;

  // Mouse events
  titleBar.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  // Touch events for mobile
  titleBar.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', drag);
  document.addEventListener('touchend', stopDrag);

  function startDrag(e) {
    // Skip if maximized
    if (windowElement.classList.contains('maximized')) return;

    // Skip if clicking on window controls
    if (e.target.closest('.window-controls')) return;

    e.preventDefault();

    // Get event coordinates
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // Activate window
    activateWindow(windowId);

    // Start dragging
    isDragging = true;

    // Add dragging class
    windowElement.classList.add('dragging');

    // Calculate offsets
    startX = clientX;
    startY = clientY;
    startLeft = parseInt(windowElement.style.left) || windowElement.offsetLeft;
    startTop = parseInt(windowElement.style.top) || windowElement.offsetTop;

    // Set drag state
    windowManager.dragState = {
      windowId,
      startX,
      startY,
      startLeft,
      startTop
    };
  }

  // Create snap guides if they don't exist
  let snapGuides = {
    left: document.querySelector('.snap-guide-left'),
    right: document.querySelector('.snap-guide-right'),
    top: document.querySelector('.snap-guide-top'),
    bottom: document.querySelector('.snap-guide-bottom'),
    center: document.querySelector('.snap-guide-center')
  };

  // Create snap guides if they don't exist
  if (!snapGuides.left) {
    // Create container for snap guides
    const snapGuideContainer = document.createElement('div');
    snapGuideContainer.className = 'snap-guide-container';
    snapGuideContainer.style.position = 'absolute';
    snapGuideContainer.style.top = '0';
    snapGuideContainer.style.left = '0';
    snapGuideContainer.style.width = '100%';
    snapGuideContainer.style.height = '100%';
    snapGuideContainer.style.pointerEvents = 'none';
    snapGuideContainer.style.zIndex = '9999';
    document.body.appendChild(snapGuideContainer);

    // Create guides
    snapGuides = {
      left: createSnapGuide('left'),
      right: createSnapGuide('right'),
      top: createSnapGuide('top'),
      bottom: createSnapGuide('bottom'),
      center: createSnapGuide('center')
    };

    // Helper function to create a snap guide
    function createSnapGuide(position) {
      const guide = document.createElement('div');
      guide.className = `snap-guide snap-guide-${position}`;
      guide.style.position = 'absolute';
      guide.style.backgroundColor = 'rgba(0, 120, 215, 0.3)';
      guide.style.display = 'none';
      guide.style.zIndex = '9999';
      guide.style.pointerEvents = 'none';

      // Position the guide
      switch (position) {
        case 'left':
          guide.style.left = '0';
          guide.style.top = '0';
          guide.style.width = '5px';
          guide.style.height = '100%';
          break;
        case 'right':
          guide.style.right = '0';
          guide.style.top = '0';
          guide.style.width = '5px';
          guide.style.height = '100%';
          break;
        case 'top':
          guide.style.left = '0';
          guide.style.top = '0';
          guide.style.width = '100%';
          guide.style.height = '5px';
          break;
        case 'bottom':
          guide.style.left = '0';
          guide.style.bottom = `${windowManager.taskbarHeight}px`;
          guide.style.width = '100%';
          guide.style.height = '5px';
          break;
        case 'center':
          guide.style.left = '50%';
          guide.style.top = '0';
          guide.style.width = '5px';
          guide.style.height = '100%';
          guide.style.transform = 'translateX(-50%)';
          break;
      }

      snapGuideContainer.appendChild(guide);
      return guide;
    }
  }

  // Function to show a specific snap guide
  function showSnapGuide(position) {
    if (snapGuides[position]) {
      snapGuides[position].style.display = 'block';
    }
  }

  // Function to hide all snap guides
  function hideSnapGuides() {
    Object.values(snapGuides).forEach(guide => {
      if (guide) guide.style.display = 'none';
    });
  }

  function drag(e) {
    if (!isDragging) return;

    // Get event coordinates
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // Calculate new position
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    let newLeft = startLeft + deltaX;
    let newTop = startTop + deltaY;

    // Apply constraints
    const desktop = document.querySelector('.win95-desktop');

    if (desktop) {
      // Keep window within desktop bounds
      const desktopRect = desktop.getBoundingClientRect();
      const windowRect = windowElement.getBoundingClientRect();

      // Minimum visible area
      const minVisible = 50;

      // Calculate bounds
      const minLeft = desktopRect.left - windowRect.width + minVisible;
      const maxLeft = desktopRect.right - minVisible;
      const minTop = desktopRect.top;
      const maxTop = desktopRect.bottom - windowManager.taskbarHeight - minVisible;

      // Check for snapping
      const snapDistance = 15; // Distance in pixels to snap
      let snapped = false;

      // Hide all snap guides first
      hideSnapGuides();

      // Snap to left edge
      if (Math.abs(newLeft - desktopRect.left) < snapDistance) {
        newLeft = desktopRect.left;
        showSnapGuide('left');
        snapped = true;
      }

      // Snap to right edge
      const rightEdge = desktopRect.right - windowRect.width;
      if (Math.abs(newLeft - rightEdge) < snapDistance) {
        newLeft = rightEdge;
        showSnapGuide('right');
        snapped = true;
      }

      // Snap to top edge
      if (Math.abs(newTop - desktopRect.top) < snapDistance) {
        newTop = desktopRect.top;
        showSnapGuide('top');
        snapped = true;
      }

      // Snap to bottom edge
      const bottomEdge = desktopRect.bottom - windowRect.height - windowManager.taskbarHeight;
      if (Math.abs(newTop - bottomEdge) < snapDistance) {
        newTop = bottomEdge;
        showSnapGuide('bottom');
        snapped = true;
      }

      // Snap to center
      const centerX = desktopRect.left + (desktopRect.width / 2) - (windowRect.width / 2);
      if (Math.abs(newLeft - centerX) < snapDistance) {
        newLeft = centerX;
        showSnapGuide('center');
        snapped = true;
      }

      // Apply bounds
      const constrainedLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));

      // Apply new position with smooth animation for snapping
      if (snapped) {
        windowElement.style.transition = 'left 0.1s ease-out, top 0.1s ease-out';
      } else {
        windowElement.style.transition = 'none';
      }

      windowElement.style.left = `${constrainedLeft}px`;
      windowElement.style.top = `${constrainedTop}px`;
    } else {
      // No desktop element, just apply new position
      windowElement.style.left = `${newLeft}px`;
      windowElement.style.top = `${newTop}px`;
    }
  }

  function stopDrag() {
    if (!isDragging) return;

    // Stop dragging
    isDragging = false;

    // Remove dragging class
    windowElement.classList.remove('dragging');

    // Hide snap guides
    hideSnapGuides();

    // Add a smooth animation when releasing
    windowElement.style.transition = 'transform 0.1s ease-out';
    windowElement.style.transform = 'scale(1.01)';

    // Reset transform after animation
    setTimeout(() => {
      windowElement.style.transform = 'scale(1)';

      // Remove transition after animation completes
      setTimeout(() => {
        windowElement.style.transition = '';
      }, 100);
    }, 10);

    // Clear drag state
    windowManager.dragState = null;

    // Play a subtle sound when dropping the window
    if (windowManager.soundsEnabled && windowManager.sounds.minimize) {
      try {
        // Clone the sound and lower volume for a subtle effect
        const dropSound = windowManager.sounds.minimize.cloneNode();
        dropSound.volume = 0.1; // Lower volume for subtle effect
        dropSound.play().catch(error => {
          // Ignore errors - sound is non-essential
        });
      } catch (error) {
        // Ignore errors - sound is non-essential
      }
    }
  }
}

/**
 * Set up window resizing
 */
function setupWindowResizing(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Get resize handles
  const resizeHandles = windowElement.querySelectorAll('.resize-handle');

  if (resizeHandles.length === 0) return;

  // Set up resize handlers
  resizeHandles.forEach(handle => {
    let isResizing = false;
    let startX, startY;
    let startWidth, startHeight;
    let startLeft, startTop;
    let resizeDirection;

    // Determine resize direction from handle class
    if (handle.classList.contains('resize-handle-e')) {
      resizeDirection = 'e';
    } else if (handle.classList.contains('resize-handle-s')) {
      resizeDirection = 's';
    } else if (handle.classList.contains('resize-handle-se')) {
      resizeDirection = 'se';
    } else if (handle.classList.contains('resize-handle-sw')) {
      resizeDirection = 'sw';
    } else if (handle.classList.contains('resize-handle-n')) {
      resizeDirection = 'n';
    } else if (handle.classList.contains('resize-handle-ne')) {
      resizeDirection = 'ne';
    } else if (handle.classList.contains('resize-handle-nw')) {
      resizeDirection = 'nw';
    } else if (handle.classList.contains('resize-handle-w')) {
      resizeDirection = 'w';
    }

    // Set cursor style based on resize direction
    switch (resizeDirection) {
      case 'e':
      case 'w':
        handle.style.cursor = 'ew-resize';
        break;
      case 's':
      case 'n':
        handle.style.cursor = 'ns-resize';
        break;
      case 'se':
      case 'nw':
        handle.style.cursor = 'nwse-resize';
        break;
      case 'sw':
      case 'ne':
        handle.style.cursor = 'nesw-resize';
        break;
    }

    // Make sure handle is visible and properly sized
    handle.style.position = 'absolute';
    handle.style.zIndex = '10';

    // Set handle size (larger than default for better usability)
    const handleSize = '10px';

    // Position handle based on direction
    switch (resizeDirection) {
      case 'e':
        handle.style.right = '0';
        handle.style.top = '0';
        handle.style.width = handleSize;
        handle.style.height = '100%';
        break;
      case 's':
        handle.style.bottom = '0';
        handle.style.left = '0';
        handle.style.width = '100%';
        handle.style.height = handleSize;
        break;
      case 'se':
        handle.style.right = '0';
        handle.style.bottom = '0';
        handle.style.width = handleSize;
        handle.style.height = handleSize;
        break;
      case 'sw':
        handle.style.left = '0';
        handle.style.bottom = '0';
        handle.style.width = handleSize;
        handle.style.height = handleSize;
        break;
      case 'n':
        handle.style.top = '0';
        handle.style.left = '0';
        handle.style.width = '100%';
        handle.style.height = handleSize;
        break;
      case 'ne':
        handle.style.right = '0';
        handle.style.top = '0';
        handle.style.width = handleSize;
        handle.style.height = handleSize;
        break;
      case 'nw':
        handle.style.left = '0';
        handle.style.top = '0';
        handle.style.width = handleSize;
        handle.style.height = handleSize;
        break;
      case 'w':
        handle.style.left = '0';
        handle.style.top = '0';
        handle.style.width = handleSize;
        handle.style.height = '100%';
        break;
    }

    // Mouse events
    handle.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    // Touch events for mobile
    handle.addEventListener('touchstart', startResize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('touchend', stopResize);

    function startResize(e) {
      // Skip if maximized
      if (windowElement.classList.contains('maximized')) return;

      e.preventDefault();
      e.stopPropagation();

      // Get event coordinates
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (clientX === undefined || clientY === undefined) return;

      // Activate window
      activateWindow(windowId);

      // Start resizing
      isResizing = true;

      // Add resizing class
      windowElement.classList.add('resizing');

      // Calculate starting values
      startX = clientX;
      startY = clientY;
      startWidth = windowElement.offsetWidth;
      startHeight = windowElement.offsetHeight;
      startLeft = parseInt(windowElement.style.left) || windowElement.offsetLeft;
      startTop = parseInt(windowElement.style.top) || windowElement.offsetTop;

      // Set resize state
      windowManager.resizeState = {
        windowId,
        direction: resizeDirection,
        startX,
        startY,
        startWidth,
        startHeight,
        startLeft,
        startTop
      };
    }

  // Create size snap guides if they don't exist
  let sizeSnapGuides = windowElement.querySelector('.size-snap-guides');
  if (!sizeSnapGuides) {
    sizeSnapGuides = document.createElement('div');
    sizeSnapGuides.className = 'size-snap-guides';
    sizeSnapGuides.style.position = 'absolute';
    sizeSnapGuides.style.top = '0';
    sizeSnapGuides.style.left = '0';
    sizeSnapGuides.style.width = '100%';
    sizeSnapGuides.style.height = '100%';
    sizeSnapGuides.style.pointerEvents = 'none';
    sizeSnapGuides.style.display = 'none';
    sizeSnapGuides.style.border = '2px dashed rgba(0, 120, 215, 0.5)';
    sizeSnapGuides.style.boxSizing = 'border-box';
    sizeSnapGuides.style.zIndex = '9999';
    windowElement.appendChild(sizeSnapGuides);
  }

  // Common window sizes for snapping
  const commonSizes = [
    { width: 800, height: 600, name: '800×600' },
    { width: 1024, height: 768, name: '1024×768' },
    { width: 1280, height: 720, name: '720p' },
    { width: 1920, height: 1080, name: '1080p' }
  ];

  // Function to show size snap guide
  function showSizeSnapGuide(width, height, name) {
    sizeSnapGuides.style.display = 'block';
    sizeSnapGuides.style.width = `${width}px`;
    sizeSnapGuides.style.height = `${height}px`;

    // Add size label if it doesn't exist
    let sizeLabel = sizeSnapGuides.querySelector('.size-label');
    if (!sizeLabel) {
      sizeLabel = document.createElement('div');
      sizeLabel.className = 'size-label';
      sizeLabel.style.position = 'absolute';
      sizeLabel.style.bottom = '-20px';
      sizeLabel.style.right = '0';
      sizeLabel.style.backgroundColor = 'rgba(0, 120, 215, 0.8)';
      sizeLabel.style.color = 'white';
      sizeLabel.style.padding = '2px 5px';
      sizeLabel.style.borderRadius = '3px';
      sizeLabel.style.fontSize = '12px';
      sizeSnapGuides.appendChild(sizeLabel);
    }

    sizeLabel.textContent = name || `${width}×${height}`;
  }

  // Function to hide size snap guide
  function hideSizeSnapGuide() {
    if (sizeSnapGuides) {
      sizeSnapGuides.style.display = 'none';
    }
  }

  function resize(e) {
    if (!isResizing) return;

    // Get event coordinates
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // Calculate deltas
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Minimum window size
    const minWidth = 200;
    const minHeight = 100;

    // Calculate new dimensions and position
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    // Apply changes based on resize direction
    switch (resizeDirection) {
      case 'e':
        newWidth = Math.max(minWidth, startWidth + deltaX);
        break;
      case 's':
        newHeight = Math.max(minHeight, startHeight + deltaY);
        break;
      case 'se':
        newWidth = Math.max(minWidth, startWidth + deltaX);
        newHeight = Math.max(minHeight, startHeight + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(minWidth, startWidth - deltaX);
        newLeft = startLeft + startWidth - newWidth;
        newHeight = Math.max(minHeight, startHeight + deltaY);
        break;
      case 'n':
        newHeight = Math.max(minHeight, startHeight - deltaY);
        newTop = startTop + startHeight - newHeight;
        break;
      case 'ne':
        newWidth = Math.max(minWidth, startWidth + deltaX);
        newHeight = Math.max(minHeight, startHeight - deltaY);
        newTop = startTop + startHeight - newHeight;
        break;
      case 'nw':
        newWidth = Math.max(minWidth, startWidth - deltaX);
        newLeft = startLeft + startWidth - newWidth;
        newHeight = Math.max(minHeight, startHeight - deltaY);
        newTop = startTop + startHeight - newHeight;
        break;
      case 'w':
        newWidth = Math.max(minWidth, startWidth - deltaX);
        newLeft = startLeft + startWidth - newWidth;
        break;
    }

    // Check for snapping to common sizes
    const snapDistance = 15; // Distance in pixels to snap
    let snapped = false;

    // Common window sizes for snapping
    const commonSizes = [
      { width: 800, height: 600 },
      { width: 1024, height: 768 },
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 }
    ];

    // Check each common size for snapping
    for (const size of commonSizes) {
      if (Math.abs(newWidth - size.width) < snapDistance &&
          Math.abs(newHeight - size.height) < snapDistance) {
        // Snap to this common size
        newWidth = size.width;
        newHeight = size.height;
        snapped = true;
        break;
      }
    }

    // Apply new dimensions with smooth animation for snapping
    if (snapped) {
      windowElement.style.transition = 'width 0.1s ease-out, height 0.1s ease-out, left 0.1s ease-out, top 0.1s ease-out';
    } else {
      windowElement.style.transition = 'none';
    }

    // Apply new dimensions and position
    windowElement.style.width = `${newWidth}px`;
    windowElement.style.height = `${newHeight}px`;
    windowElement.style.left = `${newLeft}px`;
    windowElement.style.top = `${newTop}px`;
  }

  function stopResize() {
    if (!isResizing) return;

    // Stop resizing
    isResizing = false;

    // Remove resizing class
    windowElement.classList.remove('resizing');

    // Add a subtle animation when releasing
    windowElement.style.transition = 'transform 0.1s ease-out';
    windowElement.style.transform = 'scale(1.01)';

    // Reset transform after animation
    setTimeout(() => {
      windowElement.style.transform = 'scale(1)';

      // Remove transition after animation completes
      setTimeout(() => {
        windowElement.style.transition = '';
      }, 100);
    }, 10);

    // Clear resize state
    windowManager.resizeState = null;

    // Play a subtle sound when finishing resize
    if (windowManager.soundsEnabled && windowManager.sounds.restore) {
      try {
        // Clone the sound and lower volume for a subtle effect
        const resizeSound = windowManager.sounds.restore.cloneNode();
        resizeSound.volume = 0.1; // Lower volume for subtle effect
        resizeSound.play().catch(error => {
          // Ignore errors - sound is non-essential
        });
      } catch (error) {
        // Ignore errors - sound is non-essential
      }
    }
  }
}

/**
 * Add window to taskbar
 */
function addToTaskbar(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Get taskbar
  const taskbar = document.querySelector('.win95-taskbar .open-windows');

  if (!taskbar) return;

  // Skip if already in taskbar
  if (windowInfo.taskbarItem) return;

  // Get window title
  const titleElement = windowElement.querySelector('.window-title span');
  const title = titleElement ? titleElement.textContent : windowId;

  // Get window icon
  const iconElement = windowElement.querySelector('.window-title img');
  const iconSrc = iconElement ? iconElement.src : '/images/win95/default.png';

  // Create taskbar item
  const taskbarItem = document.createElement('div');
  taskbarItem.className = 'taskbar-item';
  taskbarItem.setAttribute('data-window-id', windowId);

  // Add active class if window is active
  if (windowManager.activeWindowId === windowId) {
    taskbarItem.classList.add('active');
  }

  // Create taskbar item content
  taskbarItem.innerHTML = `
    <img src="${iconSrc}" alt="${title}">
    <span>${title}</span>
  `;

  // Add click handler
  taskbarItem.addEventListener('click', () => {
    const info = windowManager.windows.get(windowId);

    if (!info) return;

    if (info.isMinimized) {
      // Restore window
      restoreWindow(windowId);
    } else if (windowManager.activeWindowId === windowId) {
      // Minimize window if it's already active
      minimizeWindow(windowId);
    } else {
      // Activate window
      activateWindow(windowId);
    }
  });

  // Add to taskbar
  taskbar.appendChild(taskbarItem);

  // Update window info
  windowInfo.taskbarItem = taskbarItem;
}

/**
 * Activate a window (bring to front)
 */
function activateWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Skip if already active
  if (windowManager.activeWindowId === windowId) return;

  // Skip if minimized
  if (windowInfo.isMinimized) {
    restoreWindow(windowId);
    return;
  }

  // Update active window
  const previousActiveId = windowManager.activeWindowId;
  windowManager.activeWindowId = windowId;

  // Update z-index
  windowManager.highestZIndex++;
  windowElement.style.zIndex = windowManager.highestZIndex;
  windowInfo.zIndex = windowManager.highestZIndex;

  // Update taskbar
  updateTaskbarItems();

  // Show window if hidden
  if (windowElement.style.display === 'none') {
    windowElement.style.display = 'block';
    windowInfo.isOpen = true;
    windowInfo.isMinimized = false;
  }

  // Add active class
  windowElement.classList.add('active');

  // Remove active class from previous active window
  if (previousActiveId) {
    const previousElement = document.getElementById(previousActiveId);
    if (previousElement) {
      previousElement.classList.remove('active');
    }
  }
}

/**
 * Minimize a window with animation
 */
function minimizeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Skip if already minimized
  if (windowInfo.isMinimized) return;

  // Play minimize sound
  playSound(windowManager.sounds.minimize);

  // Get taskbar item position for animation target
  const taskbarItem = windowInfo.taskbarItem;
  let targetRect = null;

  if (taskbarItem) {
    targetRect = taskbarItem.getBoundingClientRect();
  }

  // Save original position and dimensions for animation
  const originalRect = windowElement.getBoundingClientRect();
  const originalTransform = windowElement.style.transform;
  const originalTransition = windowElement.style.transition;

  // Prepare for animation
  windowElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

  if (targetRect) {
    // Calculate scale and translation for animation
    const scaleX = targetRect.width / originalRect.width;
    const scaleY = targetRect.height / originalRect.height;
    const translateX = (targetRect.left - originalRect.left) + (targetRect.width / 2) - (originalRect.width / 2);
    const translateY = (targetRect.top - originalRect.top) + (targetRect.height / 2) - (originalRect.height / 2);

    // Apply animation
    windowElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    windowElement.style.opacity = '0.5';

    // Hide window after animation completes
    setTimeout(() => {
      windowElement.style.display = 'none';
      windowElement.style.transform = originalTransform;
      windowElement.style.opacity = '1';
      windowElement.style.transition = originalTransition;
    }, 300);
  } else {
    // Fallback animation if no taskbar item
    windowElement.style.transform = 'scale(0.8)';
    windowElement.style.opacity = '0';

    // Hide window after animation completes
    setTimeout(() => {
      windowElement.style.display = 'none';
      windowElement.style.transform = originalTransform;
      windowElement.style.opacity = '1';
      windowElement.style.transition = originalTransition;
    }, 300);
  }

  // Update window info
  windowInfo.isMinimized = true;

  // Update active window
  if (windowManager.activeWindowId === windowId) {
    windowManager.activeWindowId = null;

    // Activate next window after a short delay
    setTimeout(() => {
      const nextWindow = findTopVisibleWindow();
      if (nextWindow) {
        activateWindow(nextWindow.id);
      }
    }, 100);
  }

  // Update taskbar
  updateTaskbarItems();

  // Highlight taskbar item
  if (taskbarItem) {
    taskbarItem.classList.add('minimizing');
    setTimeout(() => {
      taskbarItem.classList.remove('minimizing');
    }, 500);
  }
}

/**
 * Restore a minimized window with animation
 */
function restoreWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Skip if not minimized
  if (!windowInfo.isMinimized) return;

  // Play restore sound
  playSound(windowManager.sounds.restore);

  // Get taskbar item position for animation source
  const taskbarItem = windowInfo.taskbarItem;
  let sourceRect = null;

  if (taskbarItem) {
    sourceRect = taskbarItem.getBoundingClientRect();
  }

  // Show window immediately but prepare for animation
  windowElement.style.display = 'block';

  // Save original transform and transition
  const originalTransform = windowElement.style.transform;
  const originalTransition = windowElement.style.transition;

  // Prepare for animation
  windowElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';

  if (sourceRect) {
    // Get window's final position
    const finalRect = windowElement.getBoundingClientRect();

    // Calculate initial scale and translation for animation
    const scaleX = sourceRect.width / finalRect.width;
    const scaleY = sourceRect.height / finalRect.height;
    const translateX = (sourceRect.left - finalRect.left) + (sourceRect.width / 2) - (finalRect.width / 2);
    const translateY = (sourceRect.top - finalRect.top) + (sourceRect.height / 2) - (finalRect.height / 2);

    // Apply initial transform
    windowElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
    windowElement.style.opacity = '0.7';

    // Force reflow to ensure the initial transform is applied
    windowElement.offsetHeight;

    // Animate to final position
    requestAnimationFrame(() => {
      windowElement.style.transform = originalTransform || 'none';
      windowElement.style.opacity = '1';

      // Reset transition after animation completes
      setTimeout(() => {
        windowElement.style.transition = originalTransition;
      }, 300);
    });
  } else {
    // Fallback animation if no taskbar item
    windowElement.style.transform = 'scale(0.8)';
    windowElement.style.opacity = '0.7';

    // Force reflow to ensure the initial transform is applied
    windowElement.offsetHeight;

    // Animate to final position
    requestAnimationFrame(() => {
      windowElement.style.transform = originalTransform || 'none';
      windowElement.style.opacity = '1';

      // Reset transition after animation completes
      setTimeout(() => {
        windowElement.style.transition = originalTransition;
      }, 300);
    });
  }

  // Update window info
  windowInfo.isMinimized = false;
  windowInfo.isOpen = true;

  // Highlight taskbar item
  if (taskbarItem) {
    taskbarItem.classList.add('restoring');
    setTimeout(() => {
      taskbarItem.classList.remove('restoring');
    }, 500);
  }

  // Activate window
  activateWindow(windowId);
}

/**
 * Toggle maximize/restore window
 */
function toggleMaximizeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Skip if minimized
  if (windowInfo.isMinimized) {
    restoreWindow(windowId);
    return;
  }

  // Activate window
  activateWindow(windowId);

  // Add transition for smooth animation
  windowElement.style.transition = 'width 0.2s ease-out, height 0.2s ease-out, left 0.2s ease-out, top 0.2s ease-out';

  if (windowInfo.isMaximized) {
    // Restore window
    windowElement.classList.remove('maximized');

    // Restore original state
    if (windowInfo.originalState) {
      windowElement.style.width = windowInfo.originalState.width + 'px';
      windowElement.style.height = windowInfo.originalState.height + 'px';
      windowElement.style.left = windowInfo.originalState.left + 'px';
      windowElement.style.top = windowInfo.originalState.top + 'px';

      windowInfo.originalState = null;
    } else {
      // Default size if no original state
      windowElement.style.width = '800px';
      windowElement.style.height = '600px';
      windowElement.style.left = '50px';
      windowElement.style.top = '50px';
    }

    // Play restore sound
    playSound(windowManager.sounds.restore);

    // Update maximize button
    const maximizeButton = windowElement.querySelector('.window-maximize');
    if (maximizeButton) {
      maximizeButton.textContent = '□';
      maximizeButton.title = 'Maximize';
    }

    // Add a subtle bounce effect
    setTimeout(() => {
      windowElement.style.transform = 'scale(0.98)';
      setTimeout(() => {
        windowElement.style.transform = 'scale(1)';
      }, 100);
    }, 200);
  } else {
    // Save current state
    windowInfo.originalState = {
      width: windowElement.offsetWidth,
      height: windowElement.offsetHeight,
      left: parseInt(windowElement.style.left, 10) || 0,
      top: parseInt(windowElement.style.top, 10) || 0
    };

    // Maximize window with a slight delay for better animation
    setTimeout(() => {
      windowElement.classList.add('maximized');

      // Set to desktop dimensions
      const desktop = document.querySelector('.win95-desktop');
      if (desktop) {
        windowElement.style.width = '100%';
        windowElement.style.height = `calc(100% - ${windowManager.taskbarHeight}px)`;
        windowElement.style.left = '0';
        windowElement.style.top = '0';
      }

      // Add a subtle expand effect
      setTimeout(() => {
        windowElement.style.transform = 'scale(1.01)';
        setTimeout(() => {
          windowElement.style.transform = 'scale(1)';
        }, 100);
      }, 200);
    }, 10);

    // Play maximize sound
    playSound(windowManager.sounds.maximize);

    // Update maximize button
    const maximizeButton = windowElement.querySelector('.window-maximize');
    if (maximizeButton) {
      maximizeButton.textContent = '❐';
      maximizeButton.title = 'Restore';
    }
  }

  // Remove transition after animation completes
  setTimeout(() => {
    windowElement.style.transition = '';
  }, 300);

  // Update window info
  windowInfo.isMaximized = !windowInfo.isMaximized;
}

/**
 * Close a window with animation
 */
function closeWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Play close sound
  playSound(windowManager.sounds.close);

  // Save original transform and transition
  const originalTransform = windowElement.style.transform;
  const originalTransition = windowElement.style.transition;

  // Prepare for animation
  windowElement.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';

  // Apply closing animation
  windowElement.style.transform = 'scale(0.8)';
  windowElement.style.opacity = '0';

  // Update active window immediately
  if (windowManager.activeWindowId === windowId) {
    windowManager.activeWindowId = null;

    // Activate next window
    const nextWindow = findTopVisibleWindow();
    if (nextWindow) {
      activateWindow(nextWindow.id);
    }
  }

  // Remove from taskbar with animation
  if (windowInfo.taskbarItem && windowInfo.taskbarItem.parentNode) {
    const taskbarItem = windowInfo.taskbarItem;

    // Add closing class for CSS animation
    taskbarItem.classList.add('closing');

    // Remove after animation
    setTimeout(() => {
      if (taskbarItem.parentNode) {
        taskbarItem.parentNode.removeChild(taskbarItem);
      }
      windowInfo.taskbarItem = null;
    }, 300);
  }

  // Hide window and clean up after animation completes
  setTimeout(() => {
    // Hide window
    windowElement.style.display = 'none';

    // Reset styles
    windowElement.style.transform = originalTransform;
    windowElement.style.opacity = '1';
    windowElement.style.transition = originalTransition;

    // Update window info
    windowInfo.isOpen = false;
    windowInfo.isMinimized = false;

    // Remove from windows map
    windowManager.windows.delete(windowId);
  }, 300);
}

/**
 * Find the top visible window
 */
function findTopVisibleWindow() {
  let topWindow = null;
  let highestZIndex = -1;

  windowManager.windows.forEach(windowInfo => {
    if (windowInfo.isOpen && !windowInfo.isMinimized && windowInfo.zIndex > highestZIndex) {
      topWindow = windowInfo;
      highestZIndex = windowInfo.zIndex;
    }
  });

  return topWindow;
}

/**
 * Update taskbar items
 */
function updateTaskbarItems() {
  windowManager.windows.forEach(windowInfo => {
    if (windowInfo.taskbarItem) {
      if (windowManager.activeWindowId === windowInfo.id) {
        windowInfo.taskbarItem.classList.add('active');
      } else {
        windowInfo.taskbarItem.classList.remove('active');
      }
    }
  });
}

/**
 * Fix z-index issues
 */
function fixZIndexIssues() {
  // Fix z-index for desktop elements
  const desktop = document.querySelector('.win95-desktop');
  if (desktop) {
    desktop.style.zIndex = '1';
  }

  // Fix z-index for taskbar
  const taskbar = document.querySelector('.win95-taskbar');
  if (taskbar) {
    taskbar.style.zIndex = '1000';
  }

  // Fix z-index for start menu
  const startMenu = document.querySelector('.start-menu');
  if (startMenu) {
    startMenu.style.zIndex = '1001';
  }

  // Fix z-index for context menus
  const contextMenus = document.querySelectorAll('.context-menu');
  contextMenus.forEach(menu => {
    menu.style.zIndex = '1002';
  });
}

/**
 * Set up global event listeners
 */
function setupGlobalEventListeners() {
  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    const startMenu = document.querySelector('.start-menu');
    const startButton = document.querySelector('.start-button');

    if (startMenu && startMenu.style.display === 'block') {
      if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
      }
    }
  });

  // Handle keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt+Tab to switch windows
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      switchToNextWindow();
    }

    // Alt+F4 to close active window
    if (e.altKey && e.key === 'F4') {
      e.preventDefault();
      if (windowManager.activeWindowId) {
        closeWindow(windowManager.activeWindowId);
      }
    }
  });

  // Update window constraints on resize
  window.addEventListener('resize', () => {
    windowManager.windows.forEach(windowInfo => {
      if (windowInfo.isMaximized) {
        const windowElement = document.getElementById(windowInfo.id);
        if (windowElement) {
          const desktop = document.querySelector('.win95-desktop');
          if (desktop) {
            windowElement.style.width = '100%';
            windowElement.style.height = `calc(100% - ${windowManager.taskbarHeight}px)`;
          }
        }
      }
    });
  });
}

/**
 * Switch to next window
 */
function switchToNextWindow() {
  const openWindows = Array.from(windowManager.windows.values())
    .filter(windowInfo => windowInfo.isOpen && !windowInfo.isMinimized);

  if (openWindows.length === 0) return;

  // Sort by z-index
  openWindows.sort((a, b) => a.zIndex - b.zIndex);

  // Find current active window index
  const activeIndex = openWindows.findIndex(windowInfo =>
    windowInfo.id === windowManager.activeWindowId
  );

  // Calculate next window index
  const nextIndex = (activeIndex + 1) % openWindows.length;

  // Activate next window
  activateWindow(openWindows[nextIndex].id);
}

/**
 * Set up mutation observer to handle dynamically created windows
 */
function setupMutationObserver() {
  const desktop = document.querySelector('.win95-desktop');

  if (!desktop) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('win95-window')) {
            const windowId = node.id;
            if (windowId && !windowManager.windows.has(windowId)) {
              initializeWindow(windowId);
            }
          }
        });
      }
    });
  });

  observer.observe(desktop, { childList: true });
}

/**
 * Open a window with animation
 */
function openWindow(windowId) {
  const windowElement = document.getElementById(windowId);
  const windowInfo = windowManager.windows.get(windowId);

  if (!windowElement || !windowInfo) return;

  // Skip if already open
  if (windowInfo.isOpen && !windowInfo.isMinimized) return;

  // Save original transform and transition
  const originalTransform = windowElement.style.transform;
  const originalTransition = windowElement.style.transition;

  // Prepare for animation
  windowElement.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  windowElement.style.transform = 'scale(0.9)';
  windowElement.style.opacity = '0';

  // Show window
  windowElement.style.display = 'block';

  // Force reflow to ensure the initial transform is applied
  windowElement.offsetHeight;

  // Animate to final position
  requestAnimationFrame(() => {
    windowElement.style.transform = originalTransform || 'none';
    windowElement.style.opacity = '1';

    // Add opening class for CSS animation
    windowElement.classList.add('opening');

    // Reset transition and remove class after animation completes
    setTimeout(() => {
      windowElement.style.transition = originalTransition;
      windowElement.classList.remove('opening');
    }, 300);
  });

  // Update window info
  windowInfo.isOpen = true;
  windowInfo.isMinimized = false;

  // Activate window
  activateWindow(windowId);

  // Create taskbar item if needed
  if (!windowInfo.taskbarItem) {
    addToTaskbar(windowId);
  }

  // Play open sound
  playSound(windowManager.sounds.open || windowManager.sounds.restore);
}

// Export functions to global scope
window.activateWindow = activateWindow;
window.minimizeWindow = minimizeWindow;
window.restoreWindow = restoreWindow;
window.toggleMaximizeWindow = toggleMaximizeWindow;
window.closeWindow = closeWindow;
window.openWindow = openWindow;