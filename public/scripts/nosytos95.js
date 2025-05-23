// NosytOS95 Core Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize NosytOS95
  initNosytOS95();
});

function initNosytOS95() {
  // Initialize window management
  initWindowManagement();
  
  // Initialize desktop icons
  initDesktopIcons();
  
  // Initialize start menu
  initStartMenu();
  
  // Initialize taskbar
  initTaskbar();
  
  // Initialize clock
  updateClock();
  setInterval(updateClock, 60000);
  
  // Initialize Clippy
  initClippy();
  
  // Initialize applications
  initNotepad();
  initDuckHunt();
  initTerminal();
  initHelp();
  
  // Initialize Do Not Click folder
  initDoNotClick();
  
  console.log('NosytOS95 initialized');
}

// Window Management
function initWindowManagement() {
  const windows = document.querySelectorAll('.win95-window');
  let activeWindow = null;
  let zIndex = 100;
  
  // Initialize each window
  windows.forEach(window => {
    // Set initial z-index
    window.style.zIndex = zIndex++;
    
    // Window header drag functionality
    const header = window.querySelector('.window-header');
    if (header) {
      header.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-controls')) return;
        
        // Bring window to front
        bringToFront(window);
        
        // Start dragging
        const rect = window.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        function moveWindow(e) {
          window.style.left = (e.clientX - offsetX) + 'px';
          window.style.top = (e.clientY - offsetY) + 'px';
        }
        
        function stopMoving() {
          document.removeEventListener('mousemove', moveWindow);
          document.removeEventListener('mouseup', stopMoving);
        }
        
        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMoving);
      });
    }
    
    // Window controls functionality
    const minimizeBtn = window.querySelector('.window-minimize');
    const maximizeBtn = window.querySelector('.window-maximize');
    const closeBtn = window.querySelector('.window-close');
    
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function() {
        window.style.display = 'none';
        updateTaskbar();
      });
    }
    
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', function() {
        if (window.classList.contains('maximized')) {
          // Restore window
          window.classList.remove('maximized');
          window.style.width = window.dataset.prevWidth || '400px';
          window.style.height = window.dataset.prevHeight || '300px';
          window.style.left = window.dataset.prevLeft || '50%';
          window.style.top = window.dataset.prevTop || '50%';
          window.style.transform = window.dataset.prevTransform || 'translate(-50%, -50%)';
        } else {
          // Maximize window
          window.classList.add('maximized');
          window.dataset.prevWidth = window.style.width;
          window.dataset.prevHeight = window.style.height;
          window.dataset.prevLeft = window.style.left;
          window.dataset.prevTop = window.style.top;
          window.dataset.prevTransform = window.style.transform;
          
          window.style.width = '100%';
          window.style.height = 'calc(100% - 28px)';
          window.style.left = '0';
          window.style.top = '0';
          window.style.transform = 'none';
        }
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        window.style.display = 'none';
        updateTaskbar();
      });
    }
    
    // Resize functionality
    const resizeHandles = window.querySelectorAll('.resize-handle');
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Bring window to front
        bringToFront(window);
        
        const rect = window.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startLeft = rect.left;
        const startTop = rect.top;
        
        const direction = handle.className.replace('resize-handle resize-handle-', '');
        
        function resize(e) {
          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;
          
          // Calculate new dimensions based on direction
          if (direction.includes('e')) {
            newWidth = Math.max(200, startWidth + (e.clientX - startX));
          }
          if (direction.includes('s')) {
            newHeight = Math.max(150, startHeight + (e.clientY - startY));
          }
          if (direction.includes('w')) {
            newWidth = Math.max(200, startWidth - (e.clientX - startX));
            newLeft = startLeft + (startWidth - newWidth);
          }
          if (direction.includes('n')) {
            newHeight = Math.max(150, startHeight - (e.clientY - startY));
            newTop = startTop + (startHeight - newHeight);
          }
          
          // Apply new dimensions
          window.style.width = newWidth + 'px';
          window.style.height = newHeight + 'px';
          window.style.left = newLeft + 'px';
          window.style.top = newTop + 'px';
        }
        
        function stopResizing() {
          document.removeEventListener('mousemove', resize);
          document.removeEventListener('mouseup', stopResizing);
        }
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
      });
    });
    
    // Click to focus
    window.addEventListener('mousedown', function() {
      bringToFront(window);
    });
  });
}

// Bring window to front
function bringToFront(window) {
  const windows = document.querySelectorAll('.win95-window');
  let maxZ = 0;
  
  windows.forEach(w => {
    const z = parseInt(w.style.zIndex || 0);
    maxZ = Math.max(maxZ, z);
    w.classList.remove('active');
  });
  
  window.style.zIndex = maxZ + 1;
  window.classList.add('active');
  updateTaskbar();
}

// Desktop Icons
function initDesktopIcons() {
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  
  desktopIcons.forEach(icon => {
    icon.addEventListener('dblclick', function() {
      const app = this.getAttribute('data-app');
      openApp(app);
    });
  });
}

// Open Application
function openApp(app) {
  const appWindow = document.getElementById(app + '-window');
  
  if (appWindow) {
    appWindow.style.display = 'flex';
    bringToFront(appWindow);
    
    // Special handling for Notepad to open maximized
    if (app === 'notepad') {
      // Ensure Notepad opens maximized
      const maximizeBtn = appWindow.querySelector('.window-maximize');
      if (maximizeBtn && !appWindow.classList.contains('maximized')) {
        maximizeBtn.click();
      }
      
      // Focus the textarea
      setTimeout(() => {
        const textarea = appWindow.querySelector('.notepad-content');
        if (textarea) {
          textarea.focus();
        }
      }, 100);
    }
    
    updateTaskbar();
  } else if (app === 'do-not-click') {
    // Rick Roll Easter Egg
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }
}
