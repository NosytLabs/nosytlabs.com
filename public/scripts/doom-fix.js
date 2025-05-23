/**
 * Doom II Game Fix
 * This script enables the Doom II game that was marked as "Coming Soon"
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for window system to be ready
  setTimeout(initDoomFix, 1000);
});

function initDoomFix() {
  console.log('Initializing Doom II Fix...');

  // Enable the Doom II icon
  const doomIcon = document.querySelector('button[data-target="doom-window"]');
  if (doomIcon) {
    // Remove "Coming Soon" label
    const comingSoonLabel = doomIcon.querySelector('.coming-soon');
    if (comingSoonLabel) {
      comingSoonLabel.remove();
    }

    // Enable the button
    doomIcon.disabled = false;
    doomIcon.style.opacity = '1';
    doomIcon.style.cursor = 'pointer';

    // Add click handler
    doomIcon.addEventListener('click', openDoomWindow);

    console.log('Doom II icon enabled');
  } else {
    console.warn('Doom II icon not found');
  }
}

function openDoomWindow() {
  console.log('Opening Doom II window...');

  // Check if window already exists
  let doomWindow = document.getElementById('doom-window');

  if (!doomWindow) {
    // Create the window
    doomWindow = document.createElement('div');
    doomWindow.id = 'doom-window';
    doomWindow.className = 'win95-window';
    doomWindow.style.width = '800px';
    doomWindow.style.height = '600px';
    doomWindow.style.display = 'block';
    doomWindow.style.position = 'absolute';
    doomWindow.style.top = '50%';
    doomWindow.style.left = '50%';
    doomWindow.style.transform = 'translate(-50%, -50%)';
    doomWindow.style.zIndex = '1000';

    // Create window content
    doomWindow.innerHTML = `
      <div class="window-header">
        <div class="window-title">
          <img src="/images/win95/doom.png" alt="Doom II" class="window-icon">
          <span>Doom II</span>
        </div>
        <div class="window-controls">
          <button class="window-minimize">_</button>
          <button class="window-maximize">□</button>
          <button class="window-close">×</button>
        </div>
      </div>
      <div class="window-menu">
        <div class="menu-item">Game</div>
        <div class="menu-item">Options</div>
        <div class="menu-item">View</div>
        <div class="menu-item">Help</div>
      </div>
      <div class="window-content">
        <div class="doom-game-container">
          <div class="doom-loading">Loading Doom II...</div>
        </div>
      </div>
      <div class="window-status-bar">Ready</div>
    `;

    // Add to desktop
    const desktop = document.querySelector('.desktop');
    if (desktop) {
      desktop.appendChild(doomWindow);
    } else {
      document.body.appendChild(doomWindow);
    }

    // Initialize window controls
    initWindowControls(doomWindow);

    // Initialize Doom game
    setTimeout(() => {
      initDoomGame(doomWindow);
    }, 500);
  } else {
    // Show existing window
    doomWindow.style.display = 'block';

    // Bring to front
    const windows = document.querySelectorAll('.win95-window');
    let highestZIndex = 0;

    windows.forEach(win => {
      const zIndex = parseInt(win.style.zIndex || 0);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    });

    doomWindow.style.zIndex = (highestZIndex + 1).toString();
  }

  // Add to taskbar
  addToTaskbar('doom-window', 'Doom II', '/images/win95/doom.png');
}

function initWindowControls(window) {
  // Close button
  const closeButton = window.querySelector('.window-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      window.style.display = 'none';

      // Remove from taskbar
      const taskbarButton = document.querySelector('.taskbar-button[data-window="doom-window"]');
      if (taskbarButton) {
        taskbarButton.remove();
      }
    });
  }

  // Minimize button
  const minimizeButton = window.querySelector('.window-minimize');
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      window.style.display = 'none';
    });
  }

  // Maximize button
  const maximizeButton = window.querySelector('.window-maximize');
  if (maximizeButton) {
    maximizeButton.addEventListener('click', () => {
      if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
        window.style.width = '800px';
        window.style.height = '600px';
        window.style.top = '50%';
        window.style.left = '50%';
        window.style.transform = 'translate(-50%, -50%)';
      } else {
        window.classList.add('maximized');
        window.style.width = '100%';
        window.style.height = 'calc(100% - 40px)';
        window.style.top = '0';
        window.style.left = '0';
        window.style.transform = 'none';
      }
    });
  }

  // Make window draggable
  const header = window.querySelector('.window-header');
  if (header) {
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      if (window.classList.contains('maximized')) return;

      isDragging = true;
      offsetX = e.clientX - window.getBoundingClientRect().left;
      offsetY = e.clientY - window.getBoundingClientRect().top;

      // Bring window to front
      const windows = document.querySelectorAll('.win95-window');
      let highestZIndex = 0;

      windows.forEach(win => {
        const zIndex = parseInt(win.style.zIndex || 0);
        if (zIndex > highestZIndex) {
          highestZIndex = zIndex;
        }
      });

      window.style.zIndex = (highestZIndex + 1).toString();
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

function addToTaskbar(windowId, title, iconSrc) {
  // Check if taskbar button already exists
  let taskbarButton = document.querySelector(`.taskbar-button[data-window="${windowId}"]`);

  if (!taskbarButton) {
    // Create taskbar button
    const taskbar = document.querySelector('.taskbar');
    if (!taskbar) return;

    taskbarButton = document.createElement('button');
    taskbarButton.className = 'taskbar-button active';
    taskbarButton.setAttribute('data-window', windowId);

    taskbarButton.innerHTML = `
      <img src="${iconSrc}" alt="${title}">
      <span>${title}</span>
    `;

    taskbar.appendChild(taskbarButton);

    // Add click handler
    taskbarButton.addEventListener('click', () => {
      const window = document.getElementById(windowId);
      if (window) {
        if (window.style.display === 'none') {
          window.style.display = 'block';
          taskbarButton.classList.add('active');
        } else {
          window.style.display = 'none';
          taskbarButton.classList.remove('active');
        }
      }
    });
  } else {
    // Update existing button
    taskbarButton.classList.add('active');
  }
}

function initDoomGame(doomWindow) {
  console.log('Initializing Doom II game...');

  const gameContainer = doomWindow.querySelector('.doom-game-container');
  if (!gameContainer) return;

  // Clear loading message
  gameContainer.innerHTML = '';

  // Create game UI
  createDoomUI(gameContainer);

  // Initialize game state
  window.doomGameActive = false;
  window.doomHealth = 100;
  window.doomAmmo = 50;
  window.doomScore = 0;
  window.doomLevel = 1;
  window.doomKills = 0;

  // Add start button
  const startButton = document.createElement('button');
  startButton.className = 'doom-start-button';
  startButton.textContent = 'Start Game';
  gameContainer.appendChild(startButton);

  startButton.addEventListener('click', () => {
    startDoomGame(gameContainer);
    startButton.style.display = 'none';
  });
}

function createDoomUI(container) {
  // Create HUD
  const hud = document.createElement('div');
  hud.className = 'doom-hud';

  hud.innerHTML = `
    <div class="doom-health">Health: <span id="doom-health">100</span></div>
    <div class="doom-ammo">Ammo: <span id="doom-ammo">50</span></div>
    <div class="doom-score">Score: <span id="doom-score">0</span></div>
    <div class="doom-level">Level: <span id="doom-level">1</span></div>
    <div class="doom-timer">Time: <span id="doom-timer">00:00</span></div>
  `;

  container.appendChild(hud);

  // Create game view
  const gameView = document.createElement('div');
  gameView.className = 'doom-game-view';
  container.appendChild(gameView);

  // Create weapon
  const weapon = document.createElement('div');
  weapon.className = 'doom-weapon';
  weapon.style.backgroundImage = 'url("/images/win95/doom-shotgun.png")';
  container.appendChild(weapon);

  // Create message area
  const message = document.createElement('div');
  message.className = 'doom-message';
  message.id = 'doom-message';
  message.textContent = 'Welcome to Doom II';
  container.appendChild(message);
}

function startDoomGame(container) {
  console.log('Starting Doom II game...');

  // Set game state
  window.doomGameActive = true;
  window.doomHealth = 100;
  window.doomAmmo = 50;
  window.doomScore = 0;
  window.doomLevel = 1;
  window.doomKills = 0;
  window.doomGameStartTime = Date.now();

  // Update UI
  document.getElementById('doom-health').textContent = window.doomHealth;
  document.getElementById('doom-ammo').textContent = window.doomAmmo;
  document.getElementById('doom-score').textContent = window.doomScore;
  document.getElementById('doom-level').textContent = window.doomLevel;

  // Show welcome message
  showDoomMessage('Welcome to Doom II. Click to shoot!', 3000);

  // Start game timer
  window.doomGameTimer = setInterval(updateDoomTimer, 1000);

  // Add event listeners
  const gameView = container.querySelector('.doom-game-view');
  if (gameView) {
    gameView.addEventListener('click', handleDoomShoot);
    gameView.addEventListener('mousemove', handleDoomMouseMove);
  }

  // Add keyboard controls
  document.addEventListener('keydown', handleDoomKeyDown);

  // Spawn enemies
  spawnDoomEnemies(container);
}

function updateDoomTimer() {
  if (!window.doomGameActive) return;

  const elapsedTime = Math.floor((Date.now() - window.doomGameStartTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const seconds = (elapsedTime % 60).toString().padStart(2, '0');

  document.getElementById('doom-timer').textContent = `${minutes}:${seconds}`;
}

function showDoomMessage(text, duration = 2000, isImportant = false) {
  const messageElement = document.getElementById('doom-message');
  if (!messageElement) return;

  messageElement.textContent = text;

  if (isImportant) {
    messageElement.classList.add('important');
  } else {
    messageElement.classList.remove('important');
  }

  // Clear previous timeout
  if (window.doomMessageTimeout) {
    clearTimeout(window.doomMessageTimeout);
  }

  // Auto-hide message after duration
  if (duration > 0) {
    window.doomMessageTimeout = setTimeout(() => {
      messageElement.textContent = '';
    }, duration);
  }
}

function handleDoomShoot(e) {
  if (!window.doomGameActive) return;

  // Check ammo
  if (window.doomAmmo <= 0) {
    showDoomMessage('Out of ammo!', 1500, true);
    playDoomSound('empty');
    return;
  }

  // Decrease ammo
  window.doomAmmo--;
  document.getElementById('doom-ammo').textContent = window.doomAmmo;

  // Play shoot sound
  playDoomSound('shoot');

  // Create muzzle flash
  createMuzzleFlash();

  // Check for hit
  const enemies = document.querySelectorAll('.doom-enemy');
  let hit = false;

  enemies.forEach(enemy => {
    const rect = enemy.getBoundingClientRect();
    const gameView = document.querySelector('.doom-game-view');
    const gameViewRect = gameView.getBoundingClientRect();

    // Adjust coordinates relative to game view
    const relativeX = e.clientX - gameViewRect.left;
    const relativeY = e.clientY - gameViewRect.top;

    // Check if click is within enemy bounds
    if (
      relativeX >= rect.left - gameViewRect.left &&
      relativeX <= rect.right - gameViewRect.left &&
      relativeY >= rect.top - gameViewRect.top &&
      relativeY <= rect.bottom - gameViewRect.top
    ) {
      hit = true;
      handleEnemyHit(enemy);
    }
  });

  if (!hit) {
    // Create bullet hole at click position
    createBulletHole(e.clientX, e.clientY);
  }
}

function handleDoomMouseMove(e) {
  if (!window.doomGameActive) return;

  // Move weapon slightly based on mouse position
  const weapon = document.querySelector('.doom-weapon');
  if (!weapon) return;

  const gameView = document.querySelector('.doom-game-view');
  const gameViewRect = gameView.getBoundingClientRect();

  // Calculate position relative to center
  const centerX = gameViewRect.width / 2;
  const centerY = gameViewRect.height / 2;
  const relativeX = e.clientX - gameViewRect.left - centerX;
  const relativeY = e.clientY - gameViewRect.top - centerY;

  // Move weapon slightly (max 10px in any direction)
  const maxMove = 10;
  const moveX = (relativeX / centerX) * maxMove;
  const moveY = (relativeY / centerY) * maxMove;

  weapon.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

function handleDoomKeyDown(e) {
  if (!window.doomGameActive) return;

  // Process cheat codes
  if (window.doomCheatSequence === undefined) {
    window.doomCheatSequence = '';
  }

  window.doomCheatSequence += e.key.toLowerCase();

  // Keep only the last 10 characters
  if (window.doomCheatSequence.length > 10) {
    window.doomCheatSequence = window.doomCheatSequence.substring(window.doomCheatSequence.length - 10);
  }

  // Check for cheat codes
  checkDoomCheats();

  // Handle movement keys
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      // Move forward
      showDoomMessage('Moving forward');
      break;
    case 's':
    case 'ArrowDown':
      // Move backward
      showDoomMessage('Moving backward');
      break;
    case 'a':
    case 'ArrowLeft':
      // Turn left
      showDoomMessage('Turning left');
      break;
    case 'd':
    case 'ArrowRight':
      // Turn right
      showDoomMessage('Turning right');
      break;
    case ' ':
      // Shoot
      const gameView = document.querySelector('.doom-game-view');
      if (gameView) {
        const rect = gameView.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create a synthetic click event at the center of the screen
        handleDoomShoot({
          clientX: centerX,
          clientY: centerY
        });
      }
      break;
  }
}

function checkDoomCheats() {
  const cheats = {
    'iddqd': () => {
      // God mode
      window.doomHealth = 999;
      document.getElementById('doom-health').textContent = window.doomHealth;
      showDoomMessage('GOD MODE ACTIVATED', 3000, true);
      playDoomSound('powerup');
    },
    'idkfa': () => {
      // Full ammo and weapons
      window.doomAmmo = 999;
      document.getElementById('doom-ammo').textContent = window.doomAmmo;
      showDoomMessage('FULL AMMO ACTIVATED', 3000, true);
      playDoomSound('powerup');
    },
    'idclev': () => {
      // Level warp
      window.doomLevel += 1;
      document.getElementById('doom-level').textContent = window.doomLevel;
      showDoomMessage(`WARPING TO LEVEL ${window.doomLevel}`, 3000, true);
      playDoomSound('door');
    }
  };

  // Check each cheat code
  Object.keys(cheats).forEach(code => {
    if (window.doomCheatSequence.endsWith(code)) {
      cheats[code]();
      window.doomCheatSequence = '';
    }
  });
}

function createMuzzleFlash() {
  const weapon = document.querySelector('.doom-weapon');
  if (!weapon) return;

  // Create muzzle flash element
  const muzzleFlash = document.createElement('div');
  muzzleFlash.className = 'doom-muzzle-flash';
  weapon.appendChild(muzzleFlash);

  // Remove after animation
  setTimeout(() => {
    muzzleFlash.remove();
  }, 100);
}

function createBulletHole(x, y) {
  const gameView = document.querySelector('.doom-game-view');
  if (!gameView) return;

  const gameViewRect = gameView.getBoundingClientRect();

  // Create bullet hole element
  const bulletHole = document.createElement('div');
  bulletHole.className = 'doom-bullet-hole';

  // Position relative to game view
  bulletHole.style.left = (x - gameViewRect.left) + 'px';
  bulletHole.style.top = (y - gameViewRect.top) + 'px';

  gameView.appendChild(bulletHole);

  // Remove after a delay
  setTimeout(() => {
    bulletHole.remove();
  }, 5000);
}

function spawnDoomEnemies(container) {
  if (!window.doomGameActive) return;

  const gameView = container.querySelector('.doom-game-view');
  if (!gameView) return;

  // Determine number of enemies based on level
  const enemyCount = Math.min(3 + window.doomLevel, 10);

  // Clear existing enemies
  const existingEnemies = gameView.querySelectorAll('.doom-enemy');
  existingEnemies.forEach(enemy => enemy.remove());

  // Create new enemies
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => {
      createDoomEnemy(gameView);
    }, i * 1000); // Stagger enemy spawns
  }
}

function createDoomEnemy(gameView) {
  if (!window.doomGameActive) return;

  // Create enemy element
  const enemy = document.createElement('div');
  enemy.className = 'doom-enemy';
  enemy.dataset.health = 3; // Each enemy takes 3 hits

  // Random position
  const left = 10 + Math.random() * 80; // 10-90%
  const top = 10 + Math.random() * 70; // 10-80%

  enemy.style.left = `${left}%`;
  enemy.style.top = `${top}%`;

  // Random enemy type
  const enemyTypes = ['imp', 'demon', 'cacodemon'];
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  enemy.dataset.type = enemyType;
  enemy.style.backgroundImage = `url("/images/win95/doom-${enemyType}.png")`;

  gameView.appendChild(enemy);

  // Animate enemy
  animateDoomEnemy(enemy);
}

function animateDoomEnemy(enemy) {
  if (!window.doomGameActive) return;

  // Random movement
  const duration = 2000 + Math.random() * 3000;
  const newLeft = 10 + Math.random() * 80;
  const newTop = 10 + Math.random() * 70;

  enemy.style.transition = `left ${duration}ms ease, top ${duration}ms ease`;
  enemy.style.left = `${newLeft}%`;
  enemy.style.top = `${newTop}%`;

  // Continue animation
  setTimeout(() => {
    if (enemy.parentNode) {
      animateDoomEnemy(enemy);
    }
  }, duration);
}

function handleEnemyHit(enemy) {
  // Decrease enemy health
  let health = parseInt(enemy.dataset.health) - 1;
  enemy.dataset.health = health;

  // Visual feedback
  enemy.classList.add('hit');
  setTimeout(() => {
    enemy.classList.remove('hit');
  }, 200);

  if (health <= 0) {
    // Enemy defeated
    enemy.classList.add('defeated');

    // Play death sound
    playDoomSound('death');

    // Update score and kills
    window.doomKills++;
    window.doomScore += 100 * window.doomLevel;
    document.getElementById('doom-score').textContent = window.doomScore;

    // Remove enemy after death animation
    setTimeout(() => {
      enemy.remove();

      // Check if all enemies are defeated
      const remainingEnemies = document.querySelectorAll('.doom-enemy').length;
      if (remainingEnemies === 0) {
        // Level complete
        levelComplete();
      }
    }, 1000);
  } else {
    // Play hit sound
    playDoomSound('hit');
  }
}

function levelComplete() {
  if (!window.doomGameActive) return;

  // Show level complete message
  showDoomMessage(`LEVEL ${window.doomLevel} COMPLETE!`, 3000, true);

  // Play level complete sound
  playDoomSound('levelup');

  // Increase level
  window.doomLevel++;
  document.getElementById('doom-level').textContent = window.doomLevel;

  // Restore some health and ammo
  window.doomHealth = Math.min(window.doomHealth + 25, 100);
  window.doomAmmo = Math.min(window.doomAmmo + 15, 99);

  document.getElementById('doom-health').textContent = window.doomHealth;
  document.getElementById('doom-ammo').textContent = window.doomAmmo;

  // Spawn new enemies after a delay
  setTimeout(() => {
    const container = document.querySelector('.doom-game-container');
    if (container) {
      spawnDoomEnemies(container);
    }
  }, 3000);
}

function playDoomSound(type) {
  // Create audio element
  const audio = new Audio();

  // Set source based on type
  switch (type) {
    case 'shoot':
      audio.src = '/sounds/doom-shoot.mp3';
      break;
    case 'hit':
      audio.src = '/sounds/doom-hit.mp3';
      break;
    case 'death':
      audio.src = '/sounds/doom-death.mp3';
      break;
    case 'door':
      audio.src = '/sounds/doom-door.mp3';
      break;
    case 'empty':
      audio.src = '/sounds/doom-empty.mp3';
      break;
    case 'powerup':
      audio.src = '/sounds/doom-powerup.mp3';
      break;
    case 'levelup':
      audio.src = '/sounds/doom-levelup.mp3';
      break;
    default:
      return;
  }

  // Play sound
  audio.volume = 0.3;
  audio.play().catch(e => {
    console.log('Sound play error:', e);
  });
}
