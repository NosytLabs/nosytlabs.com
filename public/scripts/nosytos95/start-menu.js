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
