/**
 * Enhanced Easter Eggs for NosytOS95
 * Hidden features and fun surprises for users to discover
 *
 * Includes:
 * - Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
 * - Secret messages in the terminal
 * - Hidden games and animations
 * - Special keyboard shortcuts
 * - Nostalgic Windows 95 references
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Easter eggs
  initKonamiCode();
  initSecretClicks();
  initKeyboardShortcuts();
  initHiddenMessages();
});

/**
 * Konami Code implementation
 * Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 */
function initKonamiCode() {
  // Define the Konami Code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  // Track user input
  let konamiIndex = 0;

  // Listen for keydown events
  document.addEventListener('keydown', (e) => {
    // Get the key that was pressed
    const key = e.key.toLowerCase();

    // Check if the key matches the expected key in the sequence
    const expectedKey = konamiCode[konamiIndex].toLowerCase();

    if (key === expectedKey) {
      // Move to the next key in the sequence
      konamiIndex++;

      // Check if the entire sequence has been entered
      if (konamiIndex === konamiCode.length) {
        // Reset the index
        konamiIndex = 0;

        // Trigger the Konami Code effect
        activateKonamiCode();
      }
    } else {
      // Reset the index if the wrong key is pressed
      konamiIndex = 0;
    }
  });
}

/**
 * Activate the Konami Code effect
 */
function activateKonamiCode() {
  console.log('Konami Code activated!');

  // Play a sound effect if available
  if (window.soundManager && typeof window.soundManager.playSpecialEffect === 'function') {
    window.soundManager.playSpecialEffect();
  }

  // Create a special effect overlay
  const overlay = document.createElement('div');
  overlay.className = 'konami-overlay';
  overlay.innerHTML = `
    <div class="konami-content">
      <h2>KONAMI CODE ACTIVATED!</h2>
      <p>You've discovered a secret!</p>
      <div class="konami-image"></div>
      <p>All applications have been upgraded with special powers.</p>
      <button id="konami-close">CONTINUE</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Add close button functionality
  const closeButton = document.getElementById('konami-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      overlay.classList.add('konami-fade-out');
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    });
  }

  // Apply special effects to all windows
  const windows = document.querySelectorAll('.win95-window');
  windows.forEach(window => {
    window.classList.add('konami-enhanced');
  });

  // Unlock special features
  unlockSpecialFeatures();
}

/**
 * Unlock special features after Konami Code
 */
function unlockSpecialFeatures() {
  // Set a flag in localStorage to remember the unlock
  localStorage.setItem('nosytOS95_konamiUnlocked', 'true');

  // Add special commands to terminal
  if (window.terminalCommands) {
    window.terminalCommands.superuser = {
      description: 'Activate superuser mode',
      execute: () => {
        return 'Superuser mode activated. All system restrictions removed.';
      }
    };

    window.terminalCommands.unlock = {
      description: 'Unlock hidden content',
      execute: () => {
        return 'All hidden content unlocked. Check the Start menu for new items.';
      }
    };
  }

  // Add special items to Start menu
  addSpecialStartMenuItems();
}

/**
 * Add special items to the Start menu
 */
function addSpecialStartMenuItems() {
  // Find the Programs submenu
  const programsMenu = document.getElementById('programs-menu');
  if (!programsMenu) return;

  // Create a new special item
  const specialItem = document.createElement('div');
  specialItem.className = 'submenu-item';
  specialItem.setAttribute('data-action', 'open');
  specialItem.setAttribute('data-target', 'secret-window');
  specialItem.innerHTML = `
    <img src="/images/win95/secret.png" alt="Secret" onerror="this.src='/images/win95/star.png'">
    <span>Secret Program</span>
  `;

  // Add the item to the menu
  const submenuItems = programsMenu.querySelector('.submenu-items');
  if (submenuItems) {
    submenuItems.appendChild(document.createElement('div')).className = 'submenu-divider';
    submenuItems.appendChild(specialItem);
  }

  // Create the secret window if it doesn't exist
  createSecretWindow();
}

/**
 * Create a secret window
 */
function createSecretWindow() {
  // Check if the window already exists
  if (document.getElementById('secret-window')) return;

  // Create the window
  const secretWindow = document.createElement('div');
  secretWindow.id = 'secret-window';
  secretWindow.className = 'win95-window';
  secretWindow.style.display = 'none';
  secretWindow.style.width = '400px';
  secretWindow.style.height = '300px';
  secretWindow.innerHTML = `
    <div class="window-header">
      <div class="window-title">Secret Program</div>
      <div class="window-controls">
        <button class="window-minimize">_</button>
        <button class="window-maximize">□</button>
        <button class="window-close">×</button>
      </div>
    </div>
    <div class="window-content">
      <div class="secret-content">
        <h3>Congratulations!</h3>
        <p>You've found the secret program. Here are some special commands:</p>
        <ul>
          <li><strong>Alt + F4:</strong> Don't try this one!</li>
          <li><strong>Ctrl + Alt + Del:</strong> System refresh</li>
          <li><strong>Win + D:</strong> Show desktop</li>
          <li><strong>F1:</strong> Get actual help</li>
        </ul>
        <p>Also, try clicking in the corners of the desktop...</p>
      </div>
    </div>
  `;

  // Add the window to the desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(secretWindow);
  } else {
    document.body.appendChild(secretWindow);
  }

  // Initialize window controls
  initWindowControls(secretWindow);
}

/**
 * Initialize window controls for a window
 */
function initWindowControls(window) {
  // Close button
  const closeButton = window.querySelector('.window-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      window.style.display = 'none';
    });
  }

  // Make the window draggable
  const header = window.querySelector('.window-header');
  if (header) {
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - window.getBoundingClientRect().left;
      offsetY = e.clientY - window.getBoundingClientRect().top;
      window.style.zIndex = getHighestZIndex() + 1;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        window.style.left = (e.clientX - offsetX) + 'px';
        window.style.top = (e.clientY - offsetY) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

/**
 * Get the highest z-index of all windows
 */
function getHighestZIndex() {
  const windows = document.querySelectorAll('.win95-window');
  let highest = 0;

  windows.forEach(window => {
    const zIndex = parseInt(window.style.zIndex || 0);
    if (zIndex > highest) {
      highest = zIndex;
    }
  });

  return highest;
}

/**
 * Initialize secret clicks in the corners of the desktop
 */
function initSecretClicks() {
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;

  // Define the corner areas (10% of the width/height)
  const cornerSize = 0.1;

  desktop.addEventListener('click', (e) => {
    const rect = desktop.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Check if the click is in a corner
    if (x < width * cornerSize && y < height * cornerSize) {
      // Top-left corner
      showCornerEffect('top-left');
    } else if (x > width * (1 - cornerSize) && y < height * cornerSize) {
      // Top-right corner
      showCornerEffect('top-right');
    } else if (x < width * cornerSize && y > height * (1 - cornerSize)) {
      // Bottom-left corner
      showCornerEffect('bottom-left');
    } else if (x > width * (1 - cornerSize) && y > height * (1 - cornerSize)) {
      // Bottom-right corner
      showCornerEffect('bottom-right');
    }
  });
}

/**
 * Show a special effect when a corner is clicked
 */
function showCornerEffect(corner) {
  console.log(`Corner clicked: ${corner}`);

  // Create a different effect for each corner
  switch (corner) {
    case 'top-left':
      // Show a retro animation
      showRetroAnimation();
      break;
    case 'top-right':
      // Show a hidden message
      showHiddenMessage('You found a secret corner!');
      break;
    case 'bottom-left':
      // Change the desktop background temporarily
      changeDesktopBackground();
      break;
    case 'bottom-right':
      // Show a mini-game
      showMiniGame();
      break;
  }
}

/**
 * Show a retro animation
 */
function showRetroAnimation() {
  // Create animation container
  const animation = document.createElement('div');
  animation.className = 'retro-animation';
  document.body.appendChild(animation);

  // Add animation content
  animation.innerHTML = '<div class="retro-animation-inner"></div>';

  // Remove after animation completes
  setTimeout(() => {
    animation.classList.add('fade-out');
    setTimeout(() => {
      animation.remove();
    }, 1000);
  }, 5000);
}

/**
 * Show a hidden message
 */
function showHiddenMessage(message) {
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = 'hidden-message';
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  // Remove after a delay
  setTimeout(() => {
    messageElement.classList.add('fade-out');
    setTimeout(() => {
      messageElement.remove();
    }, 1000);
  }, 3000);
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl + Alt + N - Show a nostalgic message
    if (e.ctrlKey && e.altKey && e.key === 'n') {
      showHiddenMessage('Windows 95 was released on August 24, 1995');
    }

    // Ctrl + Alt + S - Take a screenshot effect
    if (e.ctrlKey && e.altKey && e.key === 's') {
      takeScreenshotEffect();
    }

    // Ctrl + Alt + B - Simulate BSOD (Blue Screen of Death)
    if (e.ctrlKey && e.altKey && e.key === 'b') {
      simulateBSOD();
    }
  });
}

/**
 * Initialize hidden messages in various parts of the interface
 */
function initHiddenMessages() {
  // Add hidden messages to various elements
  const elements = [
    { selector: '.start-button', message: 'Where do you want to go today?' },
    { selector: '.desktop', message: 'Try the Konami Code!' },
    { selector: '.taskbar', message: 'Windows 95 had 1MB of video RAM' }
  ];

  elements.forEach(element => {
    const el = document.querySelector(element.selector);
    if (el) {
      el.addEventListener('dblclick', () => {
        showHiddenMessage(element.message);
      });
    }
  });
}

/**
 * Take a screenshot effect
 */
function takeScreenshotEffect() {
  // Play camera shutter sound if available
  if (window.soundManager && typeof window.soundManager.playScreenshot === 'function') {
    window.soundManager.playScreenshot();
  } else {
    // Create a simple camera shutter sound
    const shutterSound = new Audio();
    shutterSound.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...';
    shutterSound.play().catch(e => console.log('Audio play error:', e));
  }

  // Create screenshot effect element
  const effect = document.createElement('div');
  effect.className = 'screenshot-effect';
  document.body.appendChild(effect);

  // Remove after animation completes
  setTimeout(() => {
    effect.remove();

    // Show a message
    showHiddenMessage('Screenshot saved to clipboard');
  }, 500);
}

/**
 * Simulate BSOD (Blue Screen of Death)
 */
function simulateBSOD() {
  // Create BSOD element with authentic Windows 95 error message
  const bsod = document.createElement('div');
  bsod.className = 'bsod';
  bsod.innerHTML = `
    <h1>Windows</h1>
    <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
    <p>The current application will be terminated.</p>
    <p>* Press any key to terminate the current application.</p>
    <p>* Press CTRL+ALT+DEL to restart your computer. You will lose any unsaved information in all applications.</p>
    <div class="bsod-close">Click here to continue</div>
  `;
  document.body.appendChild(bsod);

  // Play error sound if available
  if (window.soundManager && typeof window.soundManager.playError === 'function') {
    window.soundManager.playError();
  }

  // Add close functionality
  const closeButton = bsod.querySelector('.bsod-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      bsod.classList.add('fade-out');
      setTimeout(() => {
        bsod.remove();
      }, 500);
    });
  }

  // Also close on any key press
  const handleKeyPress = () => {
    bsod.classList.add('fade-out');
    setTimeout(() => {
      bsod.remove();
    }, 500);
    document.removeEventListener('keydown', handleKeyPress);
  };
  document.addEventListener('keydown', handleKeyPress);
}

/**
 * Change desktop background temporarily
 */
function changeDesktopBackground() {
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;

  // Add animation class
  desktop.classList.add('background-change');

  // Play sound if available
  if (window.soundManager && typeof window.soundManager.playNotification === 'function') {
    window.soundManager.playNotification();
  }

  // Remove class after animation completes
  setTimeout(() => {
    desktop.classList.remove('background-change');
  }, 5000);
}

/**
 * Show mini game
 */
function showMiniGame() {
  // Create mini game container
  const game = document.createElement('div');
  game.className = 'mini-game';
  game.innerHTML = `
    <div class="mini-game-character"></div>
    <div class="mini-game-target"></div>
    <div class="mini-game-score">Score: 0</div>
    <div class="mini-game-close">X</div>
  `;
  document.body.appendChild(game);

  // Game variables
  let score = 0;
  let characterX = 150;
  let characterY = 100;
  let targetX = Math.random() * 280;
  let targetY = Math.random() * 180;

  // Get game elements
  const character = game.querySelector('.mini-game-character');
  const target = game.querySelector('.mini-game-target');
  const scoreDisplay = game.querySelector('.mini-game-score');
  const closeButton = game.querySelector('.mini-game-close');

  // Position elements
  character.style.left = characterX + 'px';
  character.style.top = characterY + 'px';
  target.style.left = targetX + 'px';
  target.style.top = targetY + 'px';

  // Handle keyboard input
  const handleKeyDown = (e) => {
    const speed = 5;

    switch (e.key) {
      case 'ArrowUp':
        characterY = Math.max(0, characterY - speed);
        break;
      case 'ArrowDown':
        characterY = Math.min(180, characterY + speed);
        break;
      case 'ArrowLeft':
        characterX = Math.max(0, characterX - speed);
        break;
      case 'ArrowRight':
        characterX = Math.min(280, characterX + speed);
        break;
    }

    character.style.left = characterX + 'px';
    character.style.top = characterY + 'px';

    // Check for collision with target
    const characterRect = character.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (
      characterRect.left < targetRect.right &&
      characterRect.right > targetRect.left &&
      characterRect.top < targetRect.bottom &&
      characterRect.bottom > targetRect.top
    ) {
      // Collision detected
      score++;
      scoreDisplay.textContent = 'Score: ' + score;

      // Move target to a new position
      targetX = Math.random() * 280;
      targetY = Math.random() * 180;
      target.style.left = targetX + 'px';
      target.style.top = targetY + 'px';

      // Play sound if available
      if (window.soundManager && typeof window.soundManager.playPickup === 'function') {
        window.soundManager.playPickup();
      }
    }
  };

  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);

  // Close button functionality
  closeButton.addEventListener('click', () => {
    document.removeEventListener('keydown', handleKeyDown);
    game.remove();

    // Show final score
    showHiddenMessage('Game over! Final score: ' + score);
  });
}