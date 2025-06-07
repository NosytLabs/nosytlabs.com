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
