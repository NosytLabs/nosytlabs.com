// Start Menu
function initStartMenu() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');
  
  if (startButton && startMenu) {
    // Toggle start menu on click
    startButton.addEventListener('click', function() {
      if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
      } else {
        startMenu.style.display = 'block';
      }
    });
    
    // Close start menu when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
        startMenu.style.display = 'none';
      }
    });
    
    // Handle start menu items
    const menuItems = startMenu.querySelectorAll('.submenu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const app = this.getAttribute('data-app');
        if (app) {
          openApp(app);
          startMenu.style.display = 'none';
        }
      });
    });
    
    // Handle shutdown
    const shutdownItem = document.getElementById('shutdown-item');
    if (shutdownItem) {
      shutdownItem.addEventListener('click', function() {
        if (confirm('Are you sure you want to shut down NosytOS95?')) {
          window.location.href = '/';
        }
      });
    }
  }
}

// Taskbar
function initTaskbar() {
  updateTaskbar();
}

function updateTaskbar() {
  const taskbarItems = document.querySelector('.taskbar-items');
  const windows = document.querySelectorAll('.win95-window');
  
  // Clear existing taskbar items
  taskbarItems.innerHTML = '';
  
  // Add taskbar item for each visible window
  windows.forEach(window => {
    if (window.style.display !== 'none') {
      const title = window.querySelector('.window-title span').textContent;
      const icon = window.querySelector('.window-title img').src;
      const id = window.id;
      
      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'taskbar-item';
      if (window.classList.contains('active')) {
        taskbarItem.classList.add('active');
      }
      
      const img = document.createElement('img');
      img.src = icon;
      img.alt = title;
      
      const span = document.createElement('span');
      span.textContent = title;
      
      taskbarItem.appendChild(img);
      taskbarItem.appendChild(span);
      
      taskbarItem.addEventListener('click', function() {
        if (window.style.display === 'none') {
          window.style.display = 'flex';
          bringToFront(window);
        } else if (window.classList.contains('active')) {
          window.style.display = 'none';
        } else {
          bringToFront(window);
        }
      });
      
      taskbarItems.appendChild(taskbarItem);
    }
  });
}

// Clock
function updateClock() {
  const clock = document.getElementById('taskbar-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    clock.textContent = hours12 + ':' + minutesStr + ' ' + ampm;
  }
}

// Clippy
function initClippy() {
  const clippy = document.getElementById('clippy');
  const clippyImage = document.getElementById('clippy-image');
  const clippyBubble = document.querySelector('.clippy-bubble');
  const clippyClose = document.querySelector('.clippy-close');
  const clippyOptions = document.getElementById('clippy-options');
  const clippyMessage = document.getElementById('clippy-message');
  
  if (clippy && clippyImage && clippyBubble && clippyClose && clippyOptions && clippyMessage) {
    // Show clippy bubble on click
    clippyImage.addEventListener('click', function() {
      if (clippyBubble.style.display === 'block') {
        clippyBubble.style.display = 'none';
      } else {
        clippyBubble.style.display = 'block';
      }
    });
    
    // Close clippy bubble
    clippyClose.addEventListener('click', function() {
      clippyBubble.style.display = 'none';
    });
    
    // Handle clippy options
    const options = clippyOptions.querySelectorAll('.clippy-option');
    options.forEach(option => {
      option.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        
        switch (action) {
          case 'help':
            clippyMessage.textContent = "To get started, try clicking on the desktop icons or using the Start menu. Double-click on icons to open applications.";
            break;
          case 'explore':
            clippyMessage.textContent = "Enjoy exploring NosytOS95! I'll be here if you need me.";
            clippyBubble.style.display = 'none';
            break;
        }
      });
    });
    
    // Show Clippy after a delay
    setTimeout(() => {
      clippyBubble.style.display = 'block';
    }, 3000);
  }
}

// Do Not Click folder
function initDoNotClick() {
  const doNotClickIcon = document.querySelector('.desktop-icon[data-app="do-not-click"]');
  
  if (doNotClickIcon) {
    doNotClickIcon.addEventListener('dblclick', function() {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    });
  }
}
