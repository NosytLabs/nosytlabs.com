/**
 * NosytOS95 Window Manager
 * Handles window management for the NosytOS95 interface with authentic Windows 95 behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  // Window management variables
  let activeWindow = null;
  let windows = [];
  let zIndex = 100;
  let isDragging = false;
  let isResizing = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let resizeDirection = '';
  let originalWidth = 0;
  let originalHeight = 0;
  let originalX = 0;
  let originalY = 0;
  let startX = 0;
  let startY = 0;
  let windowStates = {}; // Store window states (normal, maximized, minimized)
  let focusHistory = []; // Track window focus history for Alt+Tab

  // Initialize window management
  function initWindowManager() {
    // Get all windows
    windows = Array.from(document.querySelectorAll('.win95-window'));

    // Initialize each window
    windows.forEach(window => {
      initWindow(window);
    });

    // Add click event to desktop to deactivate all windows
    const desktop = document.querySelector('.win95-desktop');
    if (desktop) {
      desktop.addEventListener('mousedown', (e) => {
        if (e.target === desktop || e.target.classList.contains('win95-desktop')) {
          deactivateAllWindows();
        }
      });
    }

    // Initialize desktop icons
    initDesktopIcons();

    // Initialize taskbar
    initTaskbar();

    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
  }

  // Initialize keyboard shortcuts
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt+Tab to switch between windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        switchToNextWindow();
      }

      // Alt+F4 to close active window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (activeWindow) {
          closeWindow(activeWindow);
        }
      }

      // Alt+Space to open window menu
      if (e.altKey && e.key === ' ') {
        e.preventDefault();
        if (activeWindow) {
          openWindowMenu(activeWindow);
        }
      }

      // Windows key or Ctrl+Esc to open Start Menu
      if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
        e.preventDefault();
        toggleStartMenu();
      }

      // Escape to close menus
      if (e.key === 'Escape') {
        closeAllMenus();
      }
    });
  }

  // Switch to next window (Alt+Tab)
  function switchToNextWindow() {
    // Get visible windows
    const visibleWindows = windows.filter(window => window.style.display !== 'none');

    if (visibleWindows.length <= 1) return;

    // Find the index of the active window
    const activeIndex = visibleWindows.indexOf(activeWindow);

    // Get the next window (or the first if at the end)
    const nextIndex = (activeIndex + 1) % visibleWindows.length;
    const nextWindow = visibleWindows[nextIndex];

    // Activate the next window
    activateWindow(nextWindow);
  }

  // Open window menu
  function openWindowMenu(window) {
    // Check if window menu already exists
    let windowMenu = document.getElementById('window-menu');

    // Create window menu if it doesn't exist
    if (!windowMenu) {
      windowMenu = document.createElement('div');
      windowMenu.id = 'window-menu';
      windowMenu.className = 'win95-menu';
      windowMenu.innerHTML = `
        <div class="menu-item" data-action="restore">Restore</div>
        <div class="menu-item" data-action="move">Move</div>
        <div class="menu-item" data-action="size">Size</div>
        <div class="menu-item" data-action="minimize">Minimize</div>
        <div class="menu-item" data-action="maximize">Maximize</div>
        <div class="menu-divider"></div>
        <div class="menu-item" data-action="close">Close</div>
      `;

      document.body.appendChild(windowMenu);

      // Add event listeners to menu items
      const menuItems = windowMenu.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', () => {
          const action = item.getAttribute('data-action');

          switch (action) {
            case 'restore':
              if (window.classList.contains('maximized')) {
                toggleMaximize(window);
              }
              break;
            case 'move':
              // Not implemented
              break;
            case 'size':
              // Not implemented
              break;
            case 'minimize':
              minimizeWindow(window);
              break;
            case 'maximize':
              if (!window.classList.contains('maximized')) {
                toggleMaximize(window);
              }
              break;
            case 'close':
              closeWindow(window);
              break;
          }

          // Close menu
          windowMenu.style.display = 'none';
        });
      });
    }

    // Position menu
    const titleBar = window.querySelector('.window-header');
    if (titleBar) {
      const rect = titleBar.getBoundingClientRect();
      windowMenu.style.left = `${rect.left}px`;
      windowMenu.style.top = `${rect.bottom}px`;
    }

    // Show menu
    windowMenu.style.display = 'block';

    // Add click event to close menu
    document.addEventListener('click', closeWindowMenu);

    // Function to close window menu
    function closeWindowMenu(e) {
      if (!e.target.closest('#window-menu')) {
        windowMenu.style.display = 'none';
        document.removeEventListener('click', closeWindowMenu);
      }
    }
  }

  // Toggle Start Menu
  function toggleStartMenu() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    if (startButton && startMenu) {
      if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
        startButton.classList.remove('active');
      } else {
        startMenu.style.display = 'block';
        startButton.classList.add('active');
      }
    }
  }

  // Close all menus
  function closeAllMenus() {
    // Close window menu
    const windowMenu = document.getElementById('window-menu');
    if (windowMenu) {
      windowMenu.style.display = 'none';
    }

    // Close Start Menu
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
      startMenu.style.display = 'none';

      // Deactivate Start button
      const startButton = document.getElementById('start-button');
      if (startButton) {
        startButton.classList.remove('active');
      }
    }
  }

  // Initialize a single window
  function initWindow(window) {
    const header = window.querySelector('.window-header');
    const minimizeBtn = window.querySelector('.window-minimize');
    const maximizeBtn = window.querySelector('.window-maximize');
    const closeBtn = window.querySelector('.window-close');
    const resizeHandles = window.querySelectorAll('.resize-handle');

    // Set initial position if not set
    if (!window.style.left) {
      window.style.left = `${Math.random() * 100}px`;
      window.style.top = `${Math.random() * 100}px`;
    }

    // Add window to taskbar
    addWindowToTaskbar(window);

    // Make window draggable by header
    if (header) {
      header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.window-controls')) return;

        activateWindow(window);
        startDrag(e, window);
        e.preventDefault();
      });
    }

    // Window controls
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => minimizeWindow(window));
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => toggleMaximize(window));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeWindow(window));
    }

    // Make window resizable
    if (resizeHandles.length > 0) {
      resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
          activateWindow(window);
          startResize(e, window, handle.classList[1].replace('resize-handle-', ''));
          e.preventDefault();
        });
      });
    }

    // Double-click header to maximize/restore
    if (header) {
      header.addEventListener('dblclick', (e) => {
        if (!e.target.closest('.window-controls')) {
          toggleMaximize(window);
        }
      });
    }
  }

  // Initialize desktop icons
  function initDesktopIcons() {
    const icons = document.querySelectorAll('.desktop-icon');

    icons.forEach(icon => {
      // Open window on double-click
      icon.addEventListener('dblclick', () => {
        const iconId = icon.id;
        const windowId = iconId.replace('-icon', '-window');
        const window = document.getElementById(windowId);

        if (window) {
          openWindow(window);
        }
      });

      // Keyboard accessibility
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const iconId = icon.id;
          const windowId = iconId.replace('-icon', '-window');
          const window = document.getElementById(windowId);

          if (window) {
            openWindow(window);
          }
        }
      });
    });
  }

  // Initialize taskbar
  function initTaskbar() {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    if (startButton && startMenu) {
      startButton.addEventListener('click', () => {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
      });

      // Close start menu when clicking elsewhere
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#start-button') && !e.target.closest('#start-menu')) {
          startMenu.style.display = 'none';
        }
      });
    }
  }

  // Add window to taskbar
  function addWindowToTaskbar(window) {
    const taskbar = document.querySelector('.win95-taskbar');
    if (!taskbar) return;

    const windowTitle = window.querySelector('.window-title span').textContent;
    const windowIcon = window.querySelector('.window-title img').src;
    const windowId = window.id;

    // Check if taskbar button already exists
    const existingButton = document.querySelector(`.taskbar-button[data-window="${windowId}"]`);
    if (existingButton) return;

    // Create taskbar button
    const taskbarButton = document.createElement('div');
    taskbarButton.className = 'taskbar-button';
    taskbarButton.setAttribute('data-window', windowId);
    taskbarButton.innerHTML = `
      <img src="${windowIcon}" alt="${windowTitle}">
      <span>${windowTitle}</span>
    `;

    // Add click event to toggle window
    taskbarButton.addEventListener('click', () => {
      if (window.style.display === 'none') {
        openWindow(window);
      } else if (window === activeWindow) {
        minimizeWindow(window);
      } else {
        activateWindow(window);
      }
    });

    // Add button to taskbar
    taskbar.appendChild(taskbarButton);
  }

  // Update taskbar button state
  function updateTaskbarButton(window) {
    const taskbarButton = document.querySelector(`.taskbar-button[data-window="${window.id}"]`);
    if (!taskbarButton) return;

    // Update active state
    if (window === activeWindow && window.style.display !== 'none') {
      taskbarButton.classList.add('active');
    } else {
      taskbarButton.classList.remove('active');
    }
  }

  // Open window
  function openWindow(window) {
    // Check if window exists
    if (!window) return;

    // Show window
    window.style.display = 'block';

    // Update window state
    if (windowStates[window.id]) {
      if (windowStates[window.id].state === 'minimized') {
        // Restore from minimized state
        windowStates[window.id].state = 'normal';

        // Play restore sound
        playWindowSound('restore');
      }
    } else {
      // Initialize window state
      windowStates[window.id] = {
        state: 'normal',
        prevWidth: window.style.width,
        prevHeight: window.style.height,
        prevLeft: window.style.left,
        prevTop: window.style.top
      };
    }

    // Activate window
    activateWindow(window);

    // Update taskbar
    updateTaskbarButton(window);

    // Add window to focus history if not already there
    if (!focusHistory.includes(window)) {
      focusHistory.push(window);
    }
  }

  // Close window
  function closeWindow(window) {
    // Check if window exists
    if (!window) return;

    // Play close sound
    playWindowSound('close');

    // Hide window
    window.style.display = 'none';

    // Update window state
    if (windowStates[window.id]) {
      windowStates[window.id].state = 'closed';
    }

    // Remove from taskbar
    const taskbarButton = document.querySelector(`.taskbar-button[data-window="${window.id}"]`);
    if (taskbarButton) {
      taskbarButton.remove();
    }

    // Remove from focus history
    const index = focusHistory.indexOf(window);
    if (index !== -1) {
      focusHistory.splice(index, 1);
    }

    // Set new active window if needed
    if (window === activeWindow) {
      // Activate the most recently focused window
      if (focusHistory.length > 0) {
        const lastFocusedWindow = focusHistory[focusHistory.length - 1];
        if (lastFocusedWindow.style.display !== 'none') {
          activateWindow(lastFocusedWindow);
        } else {
          // If last focused window is hidden, find the first visible window
          const visibleWindows = windows.filter(w => w.style.display !== 'none');
          if (visibleWindows.length > 0) {
            activateWindow(visibleWindows[0]);
          } else {
            activeWindow = null;
          }
        }
      } else {
        activeWindow = null;
      }
    }
  }

  // Minimize window
  function minimizeWindow(window) {
    // Check if window exists
    if (!window) return;

    // Play minimize sound
    playWindowSound('minimize');

    // Hide window
    window.style.display = 'none';

    // Update window state
    if (windowStates[window.id]) {
      windowStates[window.id].state = 'minimized';
    } else {
      windowStates[window.id] = {
        state: 'minimized',
        prevWidth: window.style.width,
        prevHeight: window.style.height,
        prevLeft: window.style.left,
        prevTop: window.style.top
      };
    }

    // Update taskbar button
    updateTaskbarButton(window);

    // Set new active window if needed
    if (window === activeWindow) {
      // Activate the most recently focused window that isn't this one
      const filteredHistory = focusHistory.filter(w => w !== window && w.style.display !== 'none');
      if (filteredHistory.length > 0) {
        activateWindow(filteredHistory[filteredHistory.length - 1]);
      } else {
        // If no other windows in focus history, find any visible window
        const visibleWindows = windows.filter(w => w !== window && w.style.display !== 'none');
        if (visibleWindows.length > 0) {
          activateWindow(visibleWindows[0]);
        } else {
          activeWindow = null;
        }
      }
    }
  }

  // Toggle maximize/restore window
  function toggleMaximize(window) {
    // Get desktop dimensions
    const desktop = document.querySelector('.win95-desktop');
    const desktopRect = desktop.getBoundingClientRect();

    if (window.classList.contains('maximized')) {
      // Restore window
      window.classList.remove('maximized');

      // Get previous dimensions from window state
      const state = windowStates[window.id] || {};
      window.style.width = state.prevWidth || '600px';
      window.style.height = state.prevHeight || '400px';
      window.style.left = state.prevLeft || '100px';
      window.style.top = state.prevTop || '100px';

      // Update window state
      if (windowStates[window.id]) {
        windowStates[window.id].state = 'normal';
      }

      // Update maximize button
      const maximizeBtn = window.querySelector('.window-maximize');
      if (maximizeBtn) {
        maximizeBtn.innerHTML = '□';
        maximizeBtn.title = 'Maximize';
      }

      // Add resize handles
      const resizeHandles = window.querySelectorAll('.resize-handle');
      resizeHandles.forEach(handle => {
        handle.style.display = 'block';
      });

      // Play restore sound
      playWindowSound('restore');
    } else {
      // Save current dimensions to window state
      if (!windowStates[window.id]) {
        windowStates[window.id] = {};
      }

      windowStates[window.id].prevWidth = window.style.width;
      windowStates[window.id].prevHeight = window.style.height;
      windowStates[window.id].prevLeft = window.style.left;
      windowStates[window.id].prevTop = window.style.top;
      windowStates[window.id].state = 'maximized';

      // Maximize window
      window.classList.add('maximized');
      window.style.width = `${desktopRect.width}px`;
      window.style.height = `${desktopRect.height - 28}px`; // Subtract taskbar height
      window.style.left = '0';
      window.style.top = '0';

      // Update maximize button
      const maximizeBtn = window.querySelector('.window-maximize');
      if (maximizeBtn) {
        maximizeBtn.innerHTML = '❐';
        maximizeBtn.title = 'Restore';
      }

      // Hide resize handles
      const resizeHandles = window.querySelectorAll('.resize-handle');
      resizeHandles.forEach(handle => {
        handle.style.display = 'none';
      });

      // Play maximize sound
      playWindowSound('maximize');
    }

    // Ensure window is active
    activateWindow(window);
  }

  // Play window sound
  function playWindowSound(action) {
    // Check if sound-manager.js is loaded
    if (typeof playSoundEffect === 'function') {
      switch (action) {
        case 'maximize':
          playSoundEffect('maximize');
          break;
        case 'restore':
          playSoundEffect('restore');
          break;
        case 'minimize':
          playSoundEffect('minimize');
          break;
        case 'close':
          playSoundEffect('close');
          break;
        case 'error':
          playSoundEffect('error');
          break;
      }
    }
  }

  // Activate window (bring to front)
  function activateWindow(window) {
    if (activeWindow === window) return;

    deactivateAllWindows();

    // Add active class
    window.classList.add('active');

    // Update title bar color
    const titleBar = window.querySelector('.window-header');
    if (titleBar) {
      titleBar.style.backgroundColor = 'var(--win95-titlebar, #000080)';
      titleBar.style.color = 'var(--win95-titlebar-text, #ffffff)';
    }

    // Bring to front
    window.style.zIndex = ++zIndex;
    activeWindow = window;

    // Update focus history for Alt+Tab
    const index = focusHistory.indexOf(window);
    if (index !== -1) {
      focusHistory.splice(index, 1);
    }
    focusHistory.push(window);

    // Update taskbar button
    updateTaskbarButton(window);

    // Store window state
    if (!windowStates[window.id]) {
      windowStates[window.id] = {
        state: 'normal',
        prevWidth: window.style.width,
        prevHeight: window.style.height,
        prevLeft: window.style.left,
        prevTop: window.style.top
      };
    }
  }

  // Deactivate all windows
  function deactivateAllWindows() {
    windows.forEach(window => {
      // Remove active class
      window.classList.remove('active');

      // Update title bar color
      const titleBar = window.querySelector('.window-header');
      if (titleBar) {
        titleBar.style.backgroundColor = 'var(--win95-title-inactive, #808080)';
        titleBar.style.color = 'var(--win95-titlebar-text, #ffffff)';
      }

      // Update taskbar button
      updateTaskbarButton(window);
    });

    activeWindow = null;
  }

  // Start window drag
  function startDrag(e, window) {
    if (window.classList.contains('maximized')) return;

    isDragging = true;
    const rect = window.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  // Handle window drag
  function handleDrag(e) {
    if (!isDragging || !activeWindow) return;

    const newLeft = e.clientX - dragOffsetX;
    const newTop = e.clientY - dragOffsetY;

    // Keep window within viewport
    const maxLeft = window.innerWidth - activeWindow.offsetWidth;
    const maxTop = window.innerHeight - activeWindow.offsetHeight;

    activeWindow.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
    activeWindow.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
  }

  // Stop window drag
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  // Start window resize
  function startResize(e, window, direction) {
    if (window.classList.contains('maximized')) return;

    isResizing = true;
    resizeDirection = direction;

    const rect = window.getBoundingClientRect();
    originalWidth = rect.width;
    originalHeight = rect.height;
    originalX = rect.left;
    originalY = rect.top;
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  }

  // Handle window resize
  function handleResize(e) {
    if (!isResizing || !activeWindow) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = originalWidth;
    let newHeight = originalHeight;
    let newLeft = originalX;
    let newTop = originalY;

    // Resize based on direction
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(200, originalWidth + deltaX);
    }
    if (resizeDirection.includes('w')) {
      newWidth = Math.max(200, originalWidth - deltaX);
      newLeft = originalX + originalWidth - newWidth;
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(100, originalHeight + deltaY);
    }
    if (resizeDirection.includes('n')) {
      newHeight = Math.max(100, originalHeight - deltaY);
      newTop = originalY + originalHeight - newHeight;
    }

    // Apply new dimensions
    activeWindow.style.width = `${newWidth}px`;
    activeWindow.style.height = `${newHeight}px`;
    activeWindow.style.left = `${newLeft}px`;
    activeWindow.style.top = `${newTop}px`;
  }

  // Stop window resize
  function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }

  // Initialize window manager
  initWindowManager();
});
