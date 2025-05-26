/**
 * Start Menu Fix
 * This script enhances the Start Menu to include cascading submenus
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for window system to be ready
  setTimeout(initStartMenuFix, 1000);
});

function initStartMenuFix() {
  console.log('Initializing Start Menu Fix...');

  // Replace the start menu with an enhanced version
  replaceStartMenu();

  console.log('Start Menu Fix initialized');
}

function replaceStartMenu() {
  // Get the start menu button
  const startButton = document.querySelector('.start-button');
  if (!startButton) {
    console.warn('Start button not found');
    return;
  }

  // Remove existing event listeners
  const newStartButton = startButton.cloneNode(true);
  startButton.parentNode.replaceChild(newStartButton, startButton);

  // Get the start menu
  let startMenu = document.querySelector('.start-menu');

  // If start menu exists, remove it
  if (startMenu) {
    startMenu.remove();
  }

  // Create new start menu
  startMenu = document.createElement('div');
  startMenu.className = 'start-menu';
  startMenu.style.display = 'none';

  // Create start menu content
  startMenu.innerHTML = `
    <div class="start-menu-header">
      <div class="start-menu-title">
        <span>NosytOS</span>
        <span class="start-menu-version">95</span>
      </div>
    </div>
    <div class="start-menu-content">
      <div class="start-menu-left">
        <div class="start-menu-item" data-submenu="programs">
          <img src="/images/win95/programs.png" alt="Programs">
          <span>Programs</span>
          <span class="submenu-arrow">▶</span>
        </div>
        <div class="start-menu-item" data-submenu="documents">
          <img src="/images/win95/documents.png" alt="Documents">
          <span>Documents</span>
          <span class="submenu-arrow">▶</span>
        </div>
        <div class="start-menu-item" data-submenu="settings">
          <img src="/images/win95/settings.png" alt="Settings">
          <span>Settings</span>
          <span class="submenu-arrow">▶</span>
        </div>
        <div class="start-menu-item" data-submenu="find">
          <img src="/images/win95/find.png" alt="Find">
          <span>Find</span>
          <span class="submenu-arrow">▶</span>
        </div>
        <div class="start-menu-item" data-submenu="help">
          <img src="/images/win95/help.png" alt="Help">
          <span>Help</span>
        </div>
        <div class="start-menu-item" data-submenu="run">
          <img src="/images/win95/run.png" alt="Run">
          <span>Run...</span>
        </div>
        <div class="start-menu-separator"></div>
        <div class="start-menu-item" data-action="shutdown">
          <img src="/images/win95/shutdown.png" alt="Shut Down">
          <span>Shut Down...</span>
        </div>
      </div>
    </div>

    <!-- Programs Submenu -->
    <div class="start-submenu" id="programs-submenu">
      <div class="start-menu-item" data-target="notepad-window">
        <img src="/images/win95/notepad.png" alt="Notepad">
        <span>Notepad</span>
      </div>
      <div class="start-menu-item" data-target="terminal-window">
        <img src="/images/win95/terminal.png" alt="Terminal">
        <span>Terminal</span>
      </div>
      <div class="start-menu-item" data-submenu="games">
        <img src="/images/win95/games.png" alt="Games">
        <span>Games</span>
        <span class="submenu-arrow">▶</span>
      </div>
      <div class="start-menu-item" data-target="nosyt-ai-window">
        <img src="/images/win95/ai.png" alt="Nosyt AI">
        <span>Nosyt AI</span>
      </div>
      <div class="start-menu-item" data-target="internet-explorer-window">
        <img src="/images/win95/ie.png" alt="Internet Explorer">
        <span>Internet Explorer</span>
      </div>
      <div class="start-menu-item" data-target="my-computer-window">
        <img src="/images/win95/computer.png" alt="My Computer">
        <span>My Computer</span>
      </div>
    </div>

    <!-- Games Submenu -->
    <div class="start-submenu" id="games-submenu">
      <div class="start-menu-item" data-target="duck-hunt-window">
        <img src="/images/win95/icons/duck-hunt.png" alt="Duck Hunt">
        <span>Duck Hunt</span>
      </div>
      <!-- Doom II removed as requested -->
    </div>

    <!-- Documents Submenu -->
    <div class="start-submenu" id="documents-submenu">
      <div class="start-menu-item">
        <img src="/images/win95/document.png" alt="README">
        <span>README.txt</span>
      </div>
      <div class="start-menu-item">
        <img src="/images/win95/document.png" alt="About NosytOS">
        <span>About NosytOS.txt</span>
      </div>
    </div>

    <!-- Settings Submenu -->
    <div class="start-submenu" id="settings-submenu">
      <div class="start-menu-item" data-submenu="control-panel">
        <img src="/images/win95/control-panel.png" alt="Control Panel">
        <span>Control Panel</span>
        <span class="submenu-arrow">▶</span>
      </div>
      <div class="start-menu-item">
        <img src="/images/win95/taskbar.png" alt="Taskbar">
        <span>Taskbar...</span>
      </div>
    </div>

    <!-- Control Panel Submenu -->
    <div class="start-submenu" id="control-panel-submenu">
      <div class="start-menu-item">
        <img src="/images/win95/display.png" alt="Display">
        <span>Display</span>
      </div>
      <div class="start-menu-item">
        <img src="/images/win95/mouse.png" alt="Mouse">
        <span>Mouse</span>
      </div>
      <div class="start-menu-item">
        <img src="/images/win95/sound.png" alt="Sounds">
        <span>Sounds</span>
      </div>
    </div>

    <!-- Find Submenu -->
    <div class="start-submenu" id="find-submenu">
      <div class="start-menu-item">
        <img src="/images/win95/find-file.png" alt="Files or Folders">
        <span>Files or Folders...</span>
      </div>
      <div class="start-menu-item">
        <img src="/images/win95/find-computer.png" alt="Computer">
        <span>Computer...</span>
      </div>
    </div>
  `;

  // Add start menu to the desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(startMenu);
  } else {
    document.body.appendChild(startMenu);
  }

  // Add click handler to start button
  newStartButton.addEventListener('click', () => {
    toggleStartMenu();
  });

  // Add click handlers to menu items
  const menuItems = startMenu.querySelectorAll('.start-menu-item');
  menuItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();

      const submenu = item.getAttribute('data-submenu');
      const target = item.getAttribute('data-target');
      const action = item.getAttribute('data-action');

      if (submenu) {
        showSubmenu(submenu);
      } else if (target) {
        openWindow(target);
        hideStartMenu();
      } else if (action) {
        performAction(action);
        hideStartMenu();
      }
    });

    // Add hover handler for submenus
    item.addEventListener('mouseenter', () => {
      const submenu = item.getAttribute('data-submenu');
      if (submenu) {
        showSubmenu(submenu);
      } else {
        hideAllSubmenus();
      }
    });
  });

  // Close start menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
      hideStartMenu();
    }
  });

  // Add keyboard shortcut (Windows key or Ctrl+Esc)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && e.ctrlKey || e.key === 'Meta') {
      toggleStartMenu();
    }
  });
}

function toggleStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  const startButton = document.querySelector('.start-button');

  if (!startMenu || !startButton) return;

  if (startMenu.style.display === 'none') {
    showStartMenu();
  } else {
    hideStartMenu();
  }
}

function showStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  const startButton = document.querySelector('.start-button');

  if (!startMenu || !startButton) return;

  startMenu.style.display = 'block';
  startButton.classList.add('active');

  // Position the start menu
  const taskbar = document.querySelector('.taskbar');
  if (taskbar) {
    startMenu.style.bottom = taskbar.offsetHeight + 'px';
    startMenu.style.left = '0';
  }

  // Hide all submenus
  hideAllSubmenus();
}

function hideStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  const startButton = document.querySelector('.start-button');

  if (!startMenu || !startButton) return;

  startMenu.style.display = 'none';
  startButton.classList.remove('active');

  // Hide all submenus
  hideAllSubmenus();
}

function hideAllSubmenus() {
  const submenus = document.querySelectorAll('.start-submenu');
  submenus.forEach((submenu) => {
    submenu.style.display = 'none';
  });
}

function showSubmenu(submenuId) {
  // Hide all submenus first
  hideAllSubmenus();

  // Show the requested submenu
  const submenu = document.getElementById(`${submenuId}-submenu`);
  if (!submenu) return;

  submenu.style.display = 'block';

  // Position the submenu
  const parentItem = document.querySelector(`.start-menu-item[data-submenu="${submenuId}"]`);
  if (!parentItem) return;

  const parentRect = parentItem.getBoundingClientRect();
  const startMenu = document.querySelector('.start-menu');

  if (parentItem.closest('.start-submenu')) {
    // This is a nested submenu, position to the right of the parent
    submenu.style.left = parentRect.right + 'px';
    submenu.style.top = parentRect.top + 'px';
  } else {
    // This is a top-level submenu, position to the right of the start menu
    submenu.style.left = startMenu.offsetWidth + 'px';
    submenu.style.top = parentRect.top - parentItem.offsetTop + 'px';
  }
}

function openWindow(windowId) {
  // Find the window
  const win = document.getElementById(windowId);

  if (win) {
    // Show the window
    win.style.display = 'block';

    // Bring to front
    if (typeof window.bringWindowToFront === 'function') {
      window.bringWindowToFront(win);
    }
  } else {
    // Window doesn't exist, create it
    createWindowByType(windowId);
  }
}

function createWindowByType(windowId) {
  switch (windowId) {
    case 'notepad-window':
      createNotepadWindow();
      break;
    case 'terminal-window':
      // Use the existing terminal fix
      if (typeof window.openTerminalWindow === 'function') {
        window.openTerminalWindow();
      }
      break;
    case 'duck-hunt-window':
      // Use the Duck Hunt embed
      if (typeof createDuckHuntWindow === 'function') {
        createDuckHuntWindow();
      } else {
        console.error('Duck Hunt window creation function not found');
      }
      break;
    case 'doom-window':
      // Use the existing doom fix
      const doomButton = document.querySelector('button[data-target="doom-window"]');
      if (doomButton) {
        doomButton.click();
      }
      break;
    case 'nosyt-ai-window':
      // Use the existing AI assistant
      const aiButton = document.querySelector('button[data-target="nosyt-ai-window"]');
      if (aiButton) {
        aiButton.click();
      }
      break;
    case 'internet-explorer-window':
      createInternetExplorerWindow();
      break;
    case 'my-computer-window':
      createMyComputerWindow();
      break;
    default:
      console.warn(`Unknown window type: ${windowId}`);
      break;
  }
}

function createNotepadWindow() {
  if (typeof window.createWindow === 'function') {
    window.createWindow({
      id: 'notepad-window',
      title: 'Notepad',
      icon: '/images/win95/notepad.png',
      content: `
        <div class="notepad-container">
          <textarea class="notepad-textarea" placeholder="Type your text here..."></textarea>
        </div>
      `,
      width: '600px',
      height: '400px'
    });
  }
}

function createInternetExplorerWindow() {
  if (typeof window.createWindow === 'function') {
    window.createWindow({
      id: 'internet-explorer-window',
      title: 'Internet Explorer',
      icon: '/images/win95/ie.png',
      content: `
        <div class="ie-container">
          <div class="ie-toolbar">
            <button class="ie-button">Back</button>
            <button class="ie-button">Forward</button>
            <button class="ie-button">Refresh</button>
            <button class="ie-button">Home</button>
            <div class="ie-address-bar">
              <span>Address:</span>
              <input type="text" value="https://nosytlabs.com">
              <button class="ie-go-button">Go</button>
            </div>
          </div>
          <div class="ie-content">
            <div class="ie-loading">
              <img src="/images/win95/ie-loading.gif" alt="Loading">
              <p>Loading NosytLabs website...</p>
            </div>
          </div>
        </div>
      `,
      width: '800px',
      height: '600px'
    });
  }
}

function createMyComputerWindow() {
  if (typeof window.createWindow === 'function') {
    window.createWindow({
      id: 'my-computer-window',
      title: 'My Computer',
      icon: '/images/win95/computer.png',
      content: `
        <div class="my-computer-container">
          <div class="my-computer-toolbar">
            <button class="my-computer-button">Back</button>
            <button class="my-computer-button">Forward</button>
            <button class="my-computer-button">Up</button>
            <div class="my-computer-address-bar">
              <span>Address:</span>
              <input type="text" value="My Computer">
              <button class="my-computer-go-button">Go</button>
            </div>
          </div>
          <div class="my-computer-content">
            <div class="my-computer-icon">
              <img src="/images/win95/drive-c.png" alt="C:">
              <span>Local Disk (C:)</span>
            </div>
            <div class="my-computer-icon">
              <img src="/images/win95/drive-d.png" alt="D:">
              <span>CD-ROM (D:)</span>
            </div>
            <div class="my-computer-icon">
              <img src="/images/win95/network.png" alt="Network">
              <span>Network</span>
            </div>
            <div class="my-computer-icon">
              <img src="/images/win95/control-panel.png" alt="Control Panel">
              <span>Control Panel</span>
            </div>
          </div>
        </div>
      `,
      width: '700px',
      height: '500px'
    });
  }
}

function performAction(action) {
  switch (action) {
    case 'shutdown':
      showShutdownDialog();
      break;
    default:
      console.warn(`Unknown action: ${action}`);
      break;
  }
}

function showShutdownDialog() {
  // Create shutdown dialog
  const dialog = document.createElement('div');
  dialog.className = 'win95-dialog';
  dialog.id = 'shutdown-dialog';

  dialog.innerHTML = `
    <div class="dialog-header">
      <div class="dialog-title">
        <span>Shut Down Windows</span>
      </div>
    </div>
    <div class="dialog-content">
      <div class="dialog-icon">
        <img src="/images/win95/shutdown.png" alt="Shut Down">
      </div>
      <div class="dialog-message">
        <p>What do you want the computer to do?</p>
        <select class="shutdown-options">
          <option value="shutdown">Shut down</option>
          <option value="restart">Restart</option>
          <option value="standby">Stand by</option>
          <option value="dos">Restart in MS-DOS mode</option>
        </select>
      </div>
    </div>
    <div class="dialog-buttons">
      <button class="dialog-button" id="shutdown-ok">OK</button>
      <button class="dialog-button" id="shutdown-cancel">Cancel</button>
    </div>
  `;

  // Add to desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(dialog);
  } else {
    document.body.appendChild(dialog);
  }

  // Center the dialog
  dialog.style.position = 'absolute';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.zIndex = '10000';

  // Add event listeners
  const okButton = document.getElementById('shutdown-ok');
  const cancelButton = document.getElementById('shutdown-cancel');

  if (okButton) {
    okButton.addEventListener('click', () => {
      const select = dialog.querySelector('.shutdown-options');
      const option = select ? select.value : 'shutdown';

      // Handle shutdown option
      handleShutdownOption(option);

      // Remove dialog
      dialog.remove();
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      // Remove dialog
      dialog.remove();
    });
  }
}

function handleShutdownOption(option) {
  switch (option) {
    case 'shutdown':
      // Show shutdown screen
      showShutdownScreen('Shutting down...');
      break;
    case 'restart':
      // Show restart screen
      showShutdownScreen('Restarting...');
      break;
    case 'standby':
      // Show standby screen
      showShutdownScreen('Entering standby mode...');
      break;
    case 'dos':
      // Show DOS screen
      showDosScreen();
      break;
    default:
      console.warn(`Unknown shutdown option: ${option}`);
      break;
  }
}

function showShutdownScreen(message) {
  // Create shutdown screen
  const screen = document.createElement('div');
  screen.className = 'shutdown-screen';

  screen.innerHTML = `
    <div class="shutdown-message">
      <p>${message}</p>
      <p>It is now safe to turn off your computer.</p>
    </div>
  `;

  // Add to body
  document.body.appendChild(screen);

  // Hide all windows
  const windows = document.querySelectorAll('.win95-window');
  windows.forEach((win) => {
    win.style.display = 'none';
  });

  // Hide taskbar
  const taskbar = document.querySelector('.taskbar');
  if (taskbar) {
    taskbar.style.display = 'none';
  }

  // Hide desktop icons
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  desktopIcons.forEach((icon) => {
    icon.style.display = 'none';
  });

  // After a delay, reload the page
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}

function showDosScreen() {
  // Create DOS screen
  const screen = document.createElement('div');
  screen.className = 'dos-screen';

  screen.innerHTML = `
    <div class="dos-content">
      <div class="dos-line">Microsoft(R) Windows 95</div>
      <div class="dos-line">   (C)Copyright Microsoft Corp 1981-1995.</div>
      <div class="dos-line"></div>
      <div class="dos-line">C:\\></div>
    </div>
  `;

  // Add to body
  document.body.appendChild(screen);

  // Hide all windows
  const windows = document.querySelectorAll('.win95-window');
  windows.forEach((win) => {
    win.style.display = 'none';
  });

  // Hide taskbar
  const taskbar = document.querySelector('.taskbar');
  if (taskbar) {
    taskbar.style.display = 'none';
  }

  // Hide desktop icons
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  desktopIcons.forEach((icon) => {
    icon.style.display = 'none';
  });

  // Add click handler to return to Windows
  screen.addEventListener('click', () => {
    // Remove DOS screen
    screen.remove();

    // Show taskbar
    if (taskbar) {
      taskbar.style.display = 'flex';
    }

    // Show desktop icons
    desktopIcons.forEach((icon) => {
      icon.style.display = 'block';
    });
  });

  // Add keyboard handler
  screen.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Remove DOS screen
      screen.remove();

      // Show taskbar
      if (taskbar) {
        taskbar.style.display = 'flex';
      }

      // Show desktop icons
      desktopIcons.forEach((icon) => {
        icon.style.display = 'block';
      });
    }
  });
}
