/**
 * nosytos95-core.js - Consolidated Bundle
 * Generated automatically - do not edit directly
 * Generated on: 2025-05-26T03:43:39.961Z
 */


/* ===== window-manager.js ===== */
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



/* ===== taskbar.js ===== */
/**
 * NosytOS95 Taskbar
 * Handles taskbar functionality for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Taskbar variables
  const taskbar = document.querySelector('.win95-taskbar');
  const openWindowsContainer = document.querySelector('.open-windows');
  const systemTray = document.querySelector('.system-tray');
  const clock = document.querySelector('.clock');
  
  // Initialize taskbar
  function initTaskbar() {
    if (!taskbar || !openWindowsContainer || !systemTray || !clock) return;
    
    // Initialize taskbar height
    taskbar.style.height = '28px';
    
    // Initialize system tray icons
    initSystemTrayIcons();
    
    // Initialize clock
    updateClock();
    setInterval(updateClock, 60000); // Update every minute
    
    // Initialize taskbar context menu
    initTaskbarContextMenu();
    
    // Initialize taskbar resizing
    initTaskbarResizing();
    
    // Update taskbar with open windows
    updateTaskbar();
    
    // Add window event listeners
    addWindowEventListeners();
  }
  
  // Initialize system tray icons
  function initSystemTrayIcons() {
    // Create volume icon
    const volumeIcon = document.createElement('img');
    volumeIcon.src = '/images/win95/volume.png';
    volumeIcon.alt = 'Volume';
    volumeIcon.className = 'system-tray-icon';
    volumeIcon.title = 'Volume';
    volumeIcon.addEventListener('click', () => {
      alert('Volume control is not implemented in this demo.');
    });
    
    // Create network icon
    const networkIcon = document.createElement('img');
    networkIcon.src = '/images/win95/network.png';
    networkIcon.alt = 'Network';
    networkIcon.className = 'system-tray-icon';
    networkIcon.title = 'Network';
    networkIcon.addEventListener('click', () => {
      alert('Network settings are not implemented in this demo.');
    });
    
    // Add icons to system tray
    systemTray.insertBefore(networkIcon, clock);
    systemTray.insertBefore(volumeIcon, clock);
  }
  
  // Update clock
  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    clock.textContent = `${hours12}:${minutesStr} ${ampm}`;
    
    // Add tooltip with date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    clock.title = dateStr;
  }
  
  // Initialize taskbar context menu
  function initTaskbarContextMenu() {
    // Create taskbar context menu
    const taskbarContextMenu = document.createElement('div');
    taskbarContextMenu.className = 'context-menu';
    taskbarContextMenu.id = 'taskbar-context-menu';
    taskbarContextMenu.style.display = 'none';
    taskbarContextMenu.innerHTML = `
      <div class="context-menu-item" data-action="cascade-windows">Cascade Windows</div>
      <div class="context-menu-item" data-action="tile-windows-horizontally">Tile Windows Horizontally</div>
      <div class="context-menu-item" data-action="tile-windows-vertically">Tile Windows Vertically</div>
      <div class="context-menu-item" data-action="minimize-all-windows">Minimize All Windows</div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" data-action="taskbar-properties">Taskbar Properties...</div>
    `;
    
    // Add context menu to document
    document.body.appendChild(taskbarContextMenu);
    
    // Show context menu on right-click
    taskbar.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      // Position context menu
      taskbarContextMenu.style.left = `${e.clientX}px`;
      taskbarContextMenu.style.top = `${e.clientY - taskbarContextMenu.offsetHeight}px`;
      
      // Show context menu
      taskbarContextMenu.style.display = 'block';
      
      // Add click event listener to document to close context menu
      document.addEventListener('click', closeTaskbarContextMenu);
    });
    
    // Handle context menu item clicks
    const contextMenuItems = taskbarContextMenu.querySelectorAll('.context-menu-item');
    contextMenuItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        
        switch (action) {
          case 'cascade-windows':
            cascadeWindows();
            break;
          case 'tile-windows-horizontally':
            tileWindowsHorizontally();
            break;
          case 'tile-windows-vertically':
            tileWindowsVertically();
            break;
          case 'minimize-all-windows':
            minimizeAllWindows();
            break;
          case 'taskbar-properties':
            showTaskbarProperties();
            break;
        }
        
        // Close context menu
        closeTaskbarContextMenu();
      });
    });
    
    // Function to close taskbar context menu
    function closeTaskbarContextMenu() {
      taskbarContextMenu.style.display = 'none';
      document.removeEventListener('click', closeTaskbarContextMenu);
    }
  }
  
  // Initialize taskbar resizing
  function initTaskbarResizing() {
    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'taskbar-resize-handle';
    resizeHandle.style.position = 'absolute';
    resizeHandle.style.top = '0';
    resizeHandle.style.left = '0';
    resizeHandle.style.right = '0';
    resizeHandle.style.height = '3px';
    resizeHandle.style.cursor = 'ns-resize';
    
    // Add resize handle to taskbar
    taskbar.appendChild(resizeHandle);
    
    // Variables for resizing
    let startY = 0;
    let startHeight = 0;
    let resizing = false;
    
    // Mouse down event
    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      resizing = true;
      startY = e.clientY;
      startHeight = taskbar.offsetHeight;
      
      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    // Mouse move event
    function handleMouseMove(e) {
      if (!resizing) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = Math.max(28, Math.min(100, startHeight + deltaY));
      
      taskbar.style.height = `${newHeight}px`;
      
      // Update desktop height
      const desktop = document.querySelector('.win95-desktop');
      if (desktop) {
        desktop.style.height = `calc(100vh - ${newHeight}px)`;
      }
    }
    
    // Mouse up event
    function handleMouseUp() {
      resizing = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }
  
  // Update taskbar with open windows
  function updateTaskbar() {
    if (!openWindowsContainer) return;
    
    // Clear current taskbar items
    openWindowsContainer.innerHTML = '';
    
    // Get all visible windows
    const windows = Array.from(document.querySelectorAll('.win95-window')).filter(window => {
      return window.style.display !== 'none';
    });
    
    // Add taskbar item for each window
    windows.forEach(window => {
      const title = window.querySelector('.window-title span').textContent;
      const icon = window.querySelector('.window-icon').src;
      const isActive = window.classList.contains('active');
      
      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'taskbar-item';
      
      // Add active class if window is active
      if (isActive) {
        taskbarItem.classList.add('active');
      }
      
      // Add content
      taskbarItem.innerHTML = `
        <img src="${icon}" alt="${title}" class="taskbar-icon">
        <span class="taskbar-text">${title}</span>
      `;
      
      // Add click event listener
      taskbarItem.addEventListener('click', () => {
        if (isActive) {
          // Minimize window if it's already active
          window.style.display = 'none';
        } else {
          // Show and activate window
          window.style.display = 'block';
          activateWindow(window);
        }
        
        // Update taskbar
        updateTaskbar();
      });
      
      // Add taskbar item to container
      openWindowsContainer.appendChild(taskbarItem);
    });
  }
  
  // Add window event listeners
  function addWindowEventListeners() {
    // Get all windows
    const windows = document.querySelectorAll('.win95-window');
    
    windows.forEach(window => {
      // Add event listener for window activation
      window.addEventListener('mousedown', () => {
        activateWindow(window);
      });
      
      // Add event listener for window close
      const closeButton = window.querySelector('.window-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          window.style.display = 'none';
          updateTaskbar();
        });
      }
      
      // Add event listener for window minimize
      const minimizeButton = window.querySelector('.window-minimize');
      if (minimizeButton) {
        minimizeButton.addEventListener('click', () => {
          window.style.display = 'none';
          updateTaskbar();
        });
      }
    });
  }
  
  // Activate window
  function activateWindow(window) {
    // Deactivate all windows
    const windows = document.querySelectorAll('.win95-window');
    windows.forEach(w => {
      w.classList.remove('active');
    });
    
    // Activate this window
    window.classList.add('active');
    
    // Bring to front
    const zIndex = getHighestZIndex() + 1;
    window.style.zIndex = zIndex;
    
    // Update taskbar
    updateTaskbar();
  }
  
  // Get highest z-index
  function getHighestZIndex() {
    const windows = document.querySelectorAll('.win95-window');
    let highest = 100; // Base z-index
    
    windows.forEach(window => {
      const zIndex = parseInt(window.style.zIndex || 0);
      if (zIndex > highest) {
        highest = zIndex;
      }
    });
    
    return highest;
  }
  
  // Cascade windows
  function cascadeWindows() {
    const windows = Array.from(document.querySelectorAll('.win95-window')).filter(window => {
      return window.style.display !== 'none';
    });
    
    const desktop = document.querySelector('.win95-desktop');
    if (!desktop) return;
    
    const startX = 20;
    const startY = 20;
    const offsetX = 30;
    const offsetY = 30;
    
    windows.forEach((window, index) => {
      // Reset maximized state
      window.classList.remove('maximized');
      
      // Set position
      window.style.left = `${startX + index * offsetX}px`;
      window.style.top = `${startY + index * offsetY}px`;
      
      // Set size
      window.style.width = '600px';
      window.style.height = '400px';
      
      // Activate window
      activateWindow(window);
    });
  }
  
  // Tile windows horizontally
  function tileWindowsHorizontally() {
    const windows = Array.from(document.querySelectorAll('.win95-window')).filter(window => {
      return window.style.display !== 'none';
    });
    
    const desktop = document.querySelector('.win95-desktop');
    if (!desktop || windows.length === 0) return;
    
    const desktopWidth = desktop.offsetWidth;
    const desktopHeight = desktop.offsetHeight;
    const windowWidth = desktopWidth;
    const windowHeight = desktopHeight / windows.length;
    
    windows.forEach((window, index) => {
      // Reset maximized state
      window.classList.remove('maximized');
      
      // Set position
      window.style.left = '0';
      window.style.top = `${index * windowHeight}px`;
      
      // Set size
      window.style.width = `${windowWidth}px`;
      window.style.height = `${windowHeight}px`;
      
      // Activate window
      activateWindow(window);
    });
  }
  
  // Tile windows vertically
  function tileWindowsVertically() {
    const windows = Array.from(document.querySelectorAll('.win95-window')).filter(window => {
      return window.style.display !== 'none';
    });
    
    const desktop = document.querySelector('.win95-desktop');
    if (!desktop || windows.length === 0) return;
    
    const desktopWidth = desktop.offsetWidth;
    const desktopHeight = desktop.offsetHeight;
    const windowWidth = desktopWidth / windows.length;
    const windowHeight = desktopHeight;
    
    windows.forEach((window, index) => {
      // Reset maximized state
      window.classList.remove('maximized');
      
      // Set position
      window.style.left = `${index * windowWidth}px`;
      window.style.top = '0';
      
      // Set size
      window.style.width = `${windowWidth}px`;
      window.style.height = `${windowHeight}px`;
      
      // Activate window
      activateWindow(window);
    });
  }
  
  // Minimize all windows
  function minimizeAllWindows() {
    const windows = document.querySelectorAll('.win95-window');
    
    windows.forEach(window => {
      window.style.display = 'none';
    });
    
    // Update taskbar
    updateTaskbar();
  }
  
  // Show taskbar properties
  function showTaskbarProperties() {
    alert('Taskbar Properties are not implemented in this demo.');
  }
  
  // Initialize taskbar
  initTaskbar();
});



/* ===== start-menu.js ===== */
/**
 * NosytOS95 Start Menu
 * Handles Start Menu functionality for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Start Menu variables
  let startMenuOpen = false;
  let activeSubmenu = null;
  
  // Initialize Start Menu
  function initStartMenu() {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('start-menu');
    const desktop = document.querySelector('.win95-desktop');
    
    if (!startButton || !startMenu || !desktop) return;
    
    // Start Button click handler
    startButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });
    
    // Close Start Menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (startMenuOpen && !e.target.closest('.start-menu') && !e.target.closest('.start-button') && !e.target.closest('.submenu')) {
        closeStartMenu();
      }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Esc or Windows key to toggle Start Menu
      if ((e.ctrlKey && e.key === 'Escape') || e.key === 'Meta') {
        toggleStartMenu();
        e.preventDefault();
      }
      
      // Escape to close Start Menu
      if (e.key === 'Escape' && startMenuOpen) {
        closeStartMenu();
        e.preventDefault();
      }
    });
    
    // Initialize Start Menu items
    initStartMenuItems();
  }
  
  // Initialize Start Menu items
  function initStartMenuItems() {
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    
    startMenuItems.forEach(item => {
      // Handle item with submenu
      if (item.hasAttribute('data-submenu')) {
        item.addEventListener('mouseenter', (e) => {
          e.stopPropagation();
          
          // Get submenu ID and element
          const submenuId = item.getAttribute('data-submenu');
          const submenu = document.getElementById(submenuId);
          
          if (submenu) {
            // Hide all other submenus
            hideAllSubmenus();
            
            // Position submenu
            positionSubmenu(item, submenu);
            
            // Show submenu
            submenu.style.display = 'block';
            activeSubmenu = submenu;
          }
        });
      } else {
        // Handle regular item
        item.addEventListener('mouseenter', () => {
          hideAllSubmenus();
        });
        
        // Handle item click
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          
          const action = item.getAttribute('data-action');
          const target = item.getAttribute('data-target');
          
          if (action === 'open' && target) {
            openWindow(target);
          } else if (action === 'return-to-site') {
            window.location.href = '/';
          }
          
          // Close Start Menu
          closeStartMenu();
        });
      }
    });
    
    // Initialize submenu items
    initSubmenuItems();
  }
  
  // Initialize submenu items
  function initSubmenuItems() {
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    submenuItems.forEach(item => {
      // Handle submenu item click
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');
        
        if (action === 'open' && target) {
          openWindow(target);
        } else if (action === 'return-to-site') {
          window.location.href = '/';
        } else if (action === 'shutdown') {
          showShutdownDialog();
        } else if (action === 'restart') {
          showRestartDialog();
        } else if (action === 'logoff') {
          showLogoffDialog();
        } else if (action === 'find-files') {
          showFindFilesDialog();
        } else if (action === 'find-computer') {
          showFindComputerDialog();
        }
        
        // Close Start Menu
        closeStartMenu();
      });
    });
  }
  
  // Position submenu relative to its parent item
  function positionSubmenu(parentItem, submenu) {
    const parentRect = parentItem.getBoundingClientRect();
    const startMenu = document.getElementById('start-menu');
    const startMenuRect = startMenu.getBoundingClientRect();
    
    // Position to the right of the parent menu
    submenu.style.top = `${parentRect.top}px`;
    submenu.style.left = `${startMenuRect.right}px`;
  }
  
  // Hide all submenus
  function hideAllSubmenus() {
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
      submenu.style.display = 'none';
    });
    activeSubmenu = null;
  }
  
  // Toggle Start Menu
  function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    
    if (startMenuOpen) {
      closeStartMenu();
    } else {
      // Show Start Menu
      startMenu.style.display = 'block';
      startButton.classList.add('active');
      startMenuOpen = true;
    }
  }
  
  // Close Start Menu
  function closeStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    
    // Hide Start Menu
    startMenu.style.display = 'none';
    startButton.classList.remove('active');
    startMenuOpen = false;
    
    // Hide all submenus
    hideAllSubmenus();
  }
  
  // Open window
  function openWindow(windowId) {
    const window = document.getElementById(windowId);
    if (!window) return;
    
    // Show window
    window.style.display = 'block';
    
    // Bring to front
    const zIndex = getHighestZIndex() + 1;
    window.style.zIndex = zIndex;
    
    // Add to taskbar
    updateTaskbar();
  }
  
  // Get highest z-index
  function getHighestZIndex() {
    const windows = document.querySelectorAll('.win95-window');
    let highest = 100; // Base z-index
    
    windows.forEach(window => {
      const zIndex = parseInt(window.style.zIndex || 0);
      if (zIndex > highest) {
        highest = zIndex;
      }
    });
    
    return highest;
  }
  
  // Update taskbar
  function updateTaskbar() {
    const openWindows = document.querySelector('.open-windows');
    if (!openWindows) return;
    
    // Clear current taskbar items
    openWindows.innerHTML = '';
    
    // Get all visible windows
    const windows = Array.from(document.querySelectorAll('.win95-window')).filter(window => {
      return window.style.display !== 'none';
    });
    
    // Add taskbar item for each window
    windows.forEach(window => {
      const title = window.querySelector('.window-title span').textContent;
      const icon = window.querySelector('.window-icon').src;
      
      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'taskbar-item';
      taskbarItem.innerHTML = `
        <img src="${icon}" alt="${title}" class="taskbar-icon">
        <span class="taskbar-text">${title}</span>
      `;
      
      // Highlight active window
      if (parseInt(window.style.zIndex) === getHighestZIndex()) {
        taskbarItem.classList.add('active');
      }
      
      // Click handler to focus window
      taskbarItem.addEventListener('click', () => {
        if (window.style.display === 'none') {
          window.style.display = 'block';
        }
        
        // Bring to front
        const zIndex = getHighestZIndex() + 1;
        window.style.zIndex = zIndex;
        
        // Update taskbar
        updateTaskbar();
      });
      
      openWindows.appendChild(taskbarItem);
    });
  }
  
  // Show shutdown dialog
  function showShutdownDialog() {
    alert('Shutdown is not implemented in this demo.');
  }
  
  // Show restart dialog
  function showRestartDialog() {
    if (confirm('Are you sure you want to restart NosytOS95?')) {
      window.location.reload();
    }
  }
  
  // Show logoff dialog
  function showLogoffDialog() {
    alert('Logoff is not implemented in this demo.');
  }
  
  // Show find files dialog
  function showFindFilesDialog() {
    alert('Find Files is not implemented in this demo.');
  }
  
  // Show find computer dialog
  function showFindComputerDialog() {
    alert('Find Computer is not implemented in this demo.');
  }
  
  // Update clock
  function updateClock() {
    const clock = document.querySelector('.clock');
    if (!clock) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    
    clock.textContent = `${hours12}:${minutesStr} ${ampm}`;
  }
  
  // Initialize Start Menu
  initStartMenu();
  
  // Update clock every minute
  updateClock();
  setInterval(updateClock, 60000);
});



/* ===== desktop-icons.js ===== */
/**
 * NosytOS95 Desktop Icons
 * Handles desktop icons functionality for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Desktop icons variables
  let selectedIcon = null;
  let icons = [];
  let iconGrid = [];
  let gridSize = { cols: 8, rows: 6 };
  let iconSize = { width: 75, height: 75 };
  let iconSpacing = 10;
  
  // Initialize desktop icons
  function initDesktopIcons() {
    // Get all desktop icons
    icons = Array.from(document.querySelectorAll('.desktop-icon'));
    
    // Initialize icon grid
    initIconGrid();
    
    // Initialize each icon
    icons.forEach(icon => {
      initIcon(icon);
    });
    
    // Add desktop context menu
    initDesktopContextMenu();
    
    // Add keyboard navigation
    initKeyboardNavigation();
  }
  
  // Initialize icon grid
  function initIconGrid() {
    // Create grid array
    iconGrid = Array(gridSize.rows).fill().map(() => Array(gridSize.cols).fill(null));
    
    // Calculate desktop dimensions
    const desktop = document.querySelector('.win95-desktop');
    if (!desktop) return;
    
    const desktopRect = desktop.getBoundingClientRect();
    
    // Calculate grid size based on desktop dimensions
    gridSize.cols = Math.floor(desktopRect.width / (iconSize.width + iconSpacing));
    gridSize.rows = Math.floor(desktopRect.height / (iconSize.height + iconSpacing));
    
    // Recreate grid array with new dimensions
    iconGrid = Array(gridSize.rows).fill().map(() => Array(gridSize.cols).fill(null));
  }
  
  // Initialize a single icon
  function initIcon(icon) {
    // Find empty spot in grid
    const position = findEmptyGridPosition();
    if (!position) return;
    
    // Set icon position
    icon.style.position = 'absolute';
    icon.style.left = `${position.col * (iconSize.width + iconSpacing)}px`;
    icon.style.top = `${position.row * (iconSize.height + iconSpacing)}px`;
    icon.style.width = `${iconSize.width}px`;
    icon.style.height = `${iconSize.height}px`;
    
    // Mark grid position as occupied
    iconGrid[position.row][position.col] = icon;
    
    // Add click event to select icon
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      selectIcon(icon);
    });
    
    // Add double-click event to open window
    icon.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openIconWindow(icon);
    });
    
    // Add right-click event for context menu
    icon.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectIcon(icon);
      showIconContextMenu(icon, e.clientX, e.clientY);
    });
    
    // Add drag and drop functionality
    initIconDragDrop(icon);
  }
  
  // Find empty position in grid
  function findEmptyGridPosition() {
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        if (!iconGrid[row][col]) {
          return { row, col };
        }
      }
    }
    return null;
  }
  
  // Select icon
  function selectIcon(icon) {
    // Deselect all icons
    icons.forEach(i => {
      i.classList.remove('selected');
    });
    
    // Select this icon
    icon.classList.add('selected');
    selectedIcon = icon;
    
    // Focus icon for keyboard navigation
    icon.focus();
  }
  
  // Open icon window
  function openIconWindow(icon) {
    // Play click sound
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('click');
    }
    
    // Get window ID from icon ID
    const iconId = icon.id;
    const windowId = iconId.replace('-icon', '-window');
    
    // Get window element
    const window = document.getElementById(windowId);
    
    // Open window if it exists
    if (window) {
      // Show window
      window.style.display = 'block';
      
      // Activate window
      if (typeof activateWindow === 'function') {
        activateWindow(window);
      }
    } else if (icon.classList.contains('disabled-icon')) {
      // Show "coming soon" message for disabled icons
      alert('This feature is coming soon!');
    } else if (icon.id === 'do-not-click-icon') {
      // Handle "DO NOT CLICK" folder
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    }
  }
  
  // Initialize icon drag and drop
  function initIconDragDrop(icon) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let startGridPos = { row: 0, col: 0 };
    
    // Mouse down event
    icon.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left mouse button
      if (icon.classList.contains('disabled-icon')) return; // Disabled icons can't be moved
      
      // Get initial position
      startX = e.clientX;
      startY = e.clientY;
      startLeft = parseInt(icon.style.left) || 0;
      startTop = parseInt(icon.style.top) || 0;
      
      // Find current grid position
      for (let row = 0; row < gridSize.rows; row++) {
        for (let col = 0; col < gridSize.cols; col++) {
          if (iconGrid[row][col] === icon) {
            startGridPos = { row, col };
            break;
          }
        }
      }
      
      // Select icon
      selectIcon(icon);
      
      // Add event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Prevent default to avoid text selection
      e.preventDefault();
    });
    
    // Mouse move event
    function handleMouseMove(e) {
      isDragging = true;
      
      // Calculate new position
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      // Move icon
      icon.style.left = `${startLeft + deltaX}px`;
      icon.style.top = `${startTop + deltaY}px`;
      
      // Add dragging class
      icon.classList.add('dragging');
    }
    
    // Mouse up event
    function handleMouseUp(e) {
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Remove dragging class
      icon.classList.remove('dragging');
      
      if (isDragging) {
        // Calculate grid position
        const col = Math.round(parseInt(icon.style.left) / (iconSize.width + iconSpacing));
        const row = Math.round(parseInt(icon.style.top) / (iconSize.height + iconSpacing));
        
        // Check if position is valid
        if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
          // Check if position is empty or same as start
          if (!iconGrid[row][col] || (row === startGridPos.row && col === startGridPos.col)) {
            // Clear old position
            iconGrid[startGridPos.row][startGridPos.col] = null;
            
            // Set new position
            iconGrid[row][col] = icon;
            
            // Snap to grid
            icon.style.left = `${col * (iconSize.width + iconSpacing)}px`;
            icon.style.top = `${row * (iconSize.height + iconSpacing)}px`;
          } else {
            // Position is occupied, return to original position
            icon.style.left = `${startGridPos.col * (iconSize.width + iconSpacing)}px`;
            icon.style.top = `${startGridPos.row * (iconSize.height + iconSpacing)}px`;
          }
        } else {
          // Position is out of bounds, return to original position
          icon.style.left = `${startGridPos.col * (iconSize.width + iconSpacing)}px`;
          icon.style.top = `${startGridPos.row * (iconSize.height + iconSpacing)}px`;
        }
      }
      
      isDragging = false;
    }
  }
  
  // Initialize desktop context menu
  function initDesktopContextMenu() {
    const desktop = document.querySelector('.win95-desktop');
    const contextMenu = document.getElementById('desktop-context-menu');
    
    if (!desktop || !contextMenu) return;
    
    // Show context menu on right-click
    desktop.addEventListener('contextmenu', (e) => {
      // Only show if clicking directly on desktop (not on an icon)
      if (e.target === desktop || e.target.classList.contains('win95-desktop')) {
        e.preventDefault();
        
        // Deselect all icons
        icons.forEach(icon => {
          icon.classList.remove('selected');
        });
        selectedIcon = null;
        
        // Position context menu
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        
        // Show context menu
        contextMenu.style.display = 'block';
        
        // Add click event to document to close context menu
        document.addEventListener('click', closeContextMenu);
      }
    });
    
    // Handle context menu item clicks
    const contextMenuItems = contextMenu.querySelectorAll('.context-menu-item');
    contextMenuItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        
        switch (action) {
          case 'refresh':
            refreshDesktop();
            break;
          case 'arrange-icons':
            arrangeIcons();
            break;
          case 'new-folder':
            createNewFolder();
            break;
          case 'new-shortcut':
            createNewShortcut();
            break;
          case 'properties':
            showDesktopProperties();
            break;
          case 'trigger-bsod':
            triggerBSOD();
            break;
        }
        
        // Close context menu
        closeContextMenu();
      });
    });
    
    // Function to close context menu
    function closeContextMenu() {
      contextMenu.style.display = 'none';
      document.removeEventListener('click', closeContextMenu);
    }
  }
  
  // Initialize keyboard navigation
  function initKeyboardNavigation() {
    // Add keydown event to document
    document.addEventListener('keydown', (e) => {
      // Only handle if an icon is selected
      if (!selectedIcon) return;
      
      // Find current grid position
      let currentPos = { row: 0, col: 0 };
      for (let row = 0; row < gridSize.rows; row++) {
        for (let col = 0; col < gridSize.cols; col++) {
          if (iconGrid[row][col] === selectedIcon) {
            currentPos = { row, col };
            break;
          }
        }
      }
      
      // Handle arrow keys
      switch (e.key) {
        case 'ArrowUp':
          navigateToIcon(currentPos.row - 1, currentPos.col);
          e.preventDefault();
          break;
        case 'ArrowDown':
          navigateToIcon(currentPos.row + 1, currentPos.col);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          navigateToIcon(currentPos.row, currentPos.col - 1);
          e.preventDefault();
          break;
        case 'ArrowRight':
          navigateToIcon(currentPos.row, currentPos.col + 1);
          e.preventDefault();
          break;
        case 'Enter':
          openIconWindow(selectedIcon);
          e.preventDefault();
          break;
      }
    });
  }
  
  // Navigate to icon at grid position
  function navigateToIcon(row, col) {
    // Check if position is valid
    if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
      // Check if there's an icon at this position
      const icon = iconGrid[row][col];
      if (icon) {
        // Select icon
        selectIcon(icon);
      }
    }
  }
  
  // Refresh desktop
  function refreshDesktop() {
    // Play refresh sound
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('click');
    }
    
    // Reload page
    window.location.reload();
  }
  
  // Arrange icons
  function arrangeIcons() {
    // Play arrange sound
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('click');
    }
    
    // Clear grid
    iconGrid = Array(gridSize.rows).fill().map(() => Array(gridSize.cols).fill(null));
    
    // Arrange icons
    icons.forEach(icon => {
      const position = findEmptyGridPosition();
      if (!position) return;
      
      // Set icon position
      icon.style.left = `${position.col * (iconSize.width + iconSpacing)}px`;
      icon.style.top = `${position.row * (iconSize.height + iconSpacing)}px`;
      
      // Mark grid position as occupied
      iconGrid[position.row][position.col] = icon;
    });
  }
  
  // Create new folder
  function createNewFolder() {
    alert('This feature is not implemented yet.');
  }
  
  // Create new shortcut
  function createNewShortcut() {
    alert('This feature is not implemented yet.');
  }
  
  // Show desktop properties
  function showDesktopProperties() {
    // Get properties window
    const propertiesWindow = document.getElementById('properties-window');
    if (!propertiesWindow) return;
    
    // Update properties window content
    const itemType = propertiesWindow.querySelector('.item-type');
    const itemLocation = propertiesWindow.querySelector('.item-location');
    const itemSize = propertiesWindow.querySelector('.item-size');
    const itemContains = propertiesWindow.querySelector('.item-contains');
    const itemCreated = propertiesWindow.querySelector('.item-created');
    const propertiesIcon = propertiesWindow.querySelector('.properties-icon img');
    
    if (itemType) itemType.textContent = 'Desktop';
    if (itemLocation) itemLocation.textContent = 'C:\\Windows\\Desktop';
    if (itemSize) itemSize.textContent = '0 bytes';
    if (itemContains) itemContains.textContent = `${icons.length} Icons`;
    if (itemCreated) itemCreated.textContent = '5/16/2025 12:00 AM';
    if (propertiesIcon) propertiesIcon.src = '/images/win95/desktop.png';
    
    // Show properties window
    propertiesWindow.style.display = 'block';
    
    // Activate window
    if (typeof activateWindow === 'function') {
      activateWindow(propertiesWindow);
    }
  }
  
  // Trigger BSOD
  function triggerBSOD() {
    // Get BSOD element
    const bsod = document.getElementById('bsod');
    if (!bsod) return;
    
    // Show BSOD
    bsod.style.display = 'block';
    
    // Play error sound
    if (typeof playSoundEffect === 'function') {
      playSoundEffect('error');
    }
    
    // Hide BSOD after 5 seconds
    setTimeout(() => {
      bsod.style.display = 'none';
    }, 5000);
  }
  
  // Initialize desktop icons
  initDesktopIcons();
});


