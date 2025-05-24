/**
 * NosytOS95 Start Menu
 * 
 * A comprehensive Start Menu implementation for NosytOS95 with:
 * - Cascading submenus
 * - Program launching
 * - System controls
 * - Keyboard navigation
 * - Sound effects
 * - Recent documents tracking
 */

// Start Menu state
const startMenu = {
  isOpen: false,
  activeSubmenu: null,
  menuItems: [],
  currentFocusIndex: -1,
  sounds: {
    open: null,
    close: null,
    hover: null,
    click: null
  },
  soundsEnabled: true,
  submenuTimers: {},
  recentDocuments: [],
  maxRecentDocuments: 15
};

/**
 * Initialize when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment to ensure all elements are loaded
  setTimeout(initStartMenu, 500);
});

/**
 * Initialize the Start Menu
 */
function initStartMenu() {
  console.log('Initializing NosytOS95 Start Menu...');

  // Load sounds
  loadSounds();

  // Create Start Menu if it doesn't exist
  createStartMenu();

  // Set up Start Button
  setupStartButton();

  // Set up keyboard navigation
  setupKeyboardNavigation();

  // Load recent documents from localStorage if available
  loadRecentDocuments();

  console.log('NosytOS95 Start Menu initialized');
}

/**
 * Load Start Menu sounds
 */
function loadSounds() {
  try {
    // Open sound
    startMenu.sounds.open = new Audio('/sounds/win95/menu-open.wav');
    startMenu.sounds.open.volume = 0.5;

    // Close sound
    startMenu.sounds.close = new Audio('/sounds/win95/menu-close.wav');
    startMenu.sounds.close.volume = 0.5;

    // Hover sound
    startMenu.sounds.hover = new Audio('/sounds/win95/menu-hover.wav');
    startMenu.sounds.hover.volume = 0.3;

    // Click sound
    startMenu.sounds.click = new Audio('/sounds/win95/menu-click.wav');
    startMenu.sounds.click.volume = 0.5;

    // Use fallbacks if sounds don't exist
    startMenu.sounds.open.addEventListener('error', () => {
      startMenu.sounds.open = new Audio('/sounds/win95/chord.wav');
    });

    startMenu.sounds.close.addEventListener('error', () => {
      startMenu.sounds.close = new Audio('/sounds/win95/ding.wav');
    });

    startMenu.sounds.hover.addEventListener('error', () => {
      startMenu.sounds.hover = new Audio('/sounds/win95/ding.wav');
      startMenu.sounds.hover.volume = 0.2;
    });

    startMenu.sounds.click.addEventListener('error', () => {
      startMenu.sounds.click = new Audio('/sounds/win95/chord.wav');
    });
  } catch (error) {
    console.warn('Could not load Start Menu sounds:', error);
    startMenu.soundsEnabled = false;
  }
}

/**
 * Play a Start Menu sound
 */
function playSound(sound) {
  if (startMenu.soundsEnabled && sound) {
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
 * Create the Start Menu
 */
function createStartMenu() {
  // Check if Start Menu already exists
  let startMenuElement = document.getElementById('start-menu');

  if (startMenuElement) {
    // Start Menu already exists, just set up event handlers
    setupStartMenuItems(startMenuElement);
    return;
  }

  // Create Start Menu element
  startMenuElement = document.createElement('div');
  startMenuElement.id = 'start-menu';
  startMenuElement.className = 'start-menu';

  // Create Start Menu content
  startMenuElement.innerHTML = `
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
        <div class="start-menu-item" data-action="find">
          <img src="/images/win95/find.png" alt="Find">
          <span>Find</span>
        </div>
        <div class="start-menu-item" data-action="help">
          <img src="/images/win95/help.png" alt="Help">
          <span>Help</span>
        </div>
        <div class="start-menu-item" data-action="run">
          <img src="/images/win95/run.png" alt="Run">
          <span>Run...</span>
        </div>
        <div class="start-menu-separator"></div>
        <div class="start-menu-item" data-action="shutdown">
          <img src="/images/win95/shutdown.png" alt="Shut Down">
          <span>Shut Down...</span>
        </div>
      </div>
      <div class="start-menu-right">
        <div class="recent-documents">
          <div class="recent-documents-title">Documents</div>
          <div class="recent-documents-list"></div>
        </div>
      </div>
    </div>
  `;

  // Add to desktop
  const desktop = document.querySelector('.win95-desktop');
  if (desktop) {
    desktop.appendChild(startMenuElement);
  } else {
    document.body.appendChild(startMenuElement);
  }

  // Create submenus
  createSubmenus(startMenuElement);

  // Set up event handlers
  setupStartMenuItems(startMenuElement);
}

// ... [Previous functions remain unchanged up to handleMenuAction] ...

/**
 * Handle menu action
 */
function handleMenuAction(action, item) {
  switch (action) {
    case 'find':
      openFindDialog();
      break;

    case 'help':
      openHelpWindow();
      break;

    case 'run':
      openRunDialog();
      break;

    case 'shutdown':
      openShutdownDialog();
      break;

    default:
      console.warn(`Unknown action: ${action}`);
      break;
  }
}

/**
 * Open system dialogs
 */
function openFindDialog() {
  const event = new CustomEvent('openDialog', {
    detail: {
      type: 'find',
      title: 'Find: Files or Folders',
      icon: 'find.png'
    }
  });
  window.dispatchEvent(event);
}

function openHelpWindow() {
  const event = new CustomEvent('openWindow', {
    detail: {
      type: 'help',
      title: 'Help',
      icon: 'help.png'
    }
  });
  window.dispatchEvent(event);
}

function openRunDialog() {
  const event = new CustomEvent('openDialog', {
    detail: {
      type: 'run',
      title: 'Run',
      icon: 'run.png'
    }
  });
  window.dispatchEvent(event);
}

function openShutdownDialog() {
  const event = new CustomEvent('openDialog', {
    detail: {
      type: 'shutdown',
      title: 'Shut Down Windows',
      icon: 'shutdown.png',
      options: [
        { id: 'shutdown', text: 'Shut down the computer' },
        { id: 'restart', text: 'Restart the computer' },
        { id: 'dos', text: 'Restart in MS-DOS mode' }
      ]
    }
  });
  window.dispatchEvent(event);
}

/**
 * Recent Documents Management
 */
function loadRecentDocuments() {
  try {
    const saved = localStorage.getItem('recentDocuments');
    if (saved) {
      startMenu.recentDocuments = JSON.parse(saved);
      updateRecentDocuments();
    }
  } catch (error) {
    console.warn('Could not load recent documents:', error);
  }
}

function saveRecentDocuments() {
  try {
    localStorage.setItem('recentDocuments', JSON.stringify(startMenu.recentDocuments));
  } catch (error) {
    console.warn('Could not save recent documents:', error);
  }
}

function addRecentDocument(doc) {
  // Remove if already exists
  startMenu.recentDocuments = startMenu.recentDocuments.filter(d => d.id !== doc.id);
  
  // Add to beginning of array
  startMenu.recentDocuments.unshift(doc);
  
  // Trim to max length
  if (startMenu.recentDocuments.length > startMenu.maxRecentDocuments) {
    startMenu.recentDocuments.pop();
  }
  
  // Update menus and save
  updateRecentDocuments();
  saveRecentDocuments();
}

function updateRecentDocuments() {
  // Update right side list
  const list = document.querySelector('.recent-documents-list');
  if (list) {
    list.innerHTML = '';
    startMenu.recentDocuments.forEach(doc => {
      const item = document.createElement('div');
      item.className = 'recent-document-item';
      item.setAttribute('data-action', 'open');
      item.setAttribute('data-target', doc.id);
      item.innerHTML = `
        <img src="/images/win95/${doc.icon}" alt="${doc.title}">
        <span>${doc.title}</span>
      `;
      list.appendChild(item);
    });
  }
  
  // Update documents submenu
  const submenu = document.getElementById('documents-submenu');
  if (submenu) {
    // Remove old recent documents after separator
    const separator = submenu.querySelector('.start-menu-separator');
    let next = separator.nextSibling;
    while (next) {
      const current = next;
      next = current.nextSibling;
      current.remove();
    }
    
    // Add updated recent documents
    startMenu.recentDocuments.forEach(doc => {
      const item = document.createElement('div');
      item.className = 'start-submenu-item';
      item.setAttribute('data-action', 'open');
      item.setAttribute('data-target', doc.id);
      item.innerHTML = `
        <img src="/images/win95/${doc.icon}" alt="${doc.title}">
        <span>${doc.title}</span>
      `;
      submenu.appendChild(item);
    });
  }
}

// Export functions for use in other modules
export {
  initStartMenu,
  openStartMenu,
  closeStartMenu,
  addRecentDocument,
  handleMenuAction
};