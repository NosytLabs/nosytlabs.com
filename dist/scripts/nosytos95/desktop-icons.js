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
