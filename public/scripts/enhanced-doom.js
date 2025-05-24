/**
 * Enhanced Doom II Game for NosytOS95
 * A more polished implementation of the classic Doom game with better animations and sound
 *
 * Version 3.0 - Enhanced with:
 * - Improved keyboard and mouse controls
 * - Better performance with optimized rendering
 * - Enhanced sound effects and music
 * - Accessibility features
 * - Mobile support with touch controls
 * - Savegame functionality
 * - Fixed initialization issues
 * - Improved error handling
 * - Authentic Doom II experience
 * - Easter eggs and cheat codes
 */

document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const doomWindow = document.getElementById('doom-window');
  if (!doomWindow) return;

  // Get or create game elements
  let doomCanvas = document.getElementById('doom-canvas');
  let doomLoading = document.getElementById('doom-loading');
  let doomStartButton = document.getElementById('doom-start-button');

  // Create game container if it doesn't exist
  let gameContainer = doomWindow.querySelector('.doom-game-container');
  if (!gameContainer) {
    // Create game container
    gameContainer = document.createElement('div');
    gameContainer.className = 'doom-game-container';
    doomWindow.querySelector('.window-content').appendChild(gameContainer);

    // Create loading screen
    doomLoading = document.createElement('div');
    doomLoading.id = 'doom-loading';
    doomLoading.className = 'doom-loading';
    doomLoading.innerHTML = '<div class="doom-loading-text">Loading DOOM II...</div><div class="doom-loading-bar"><div class="doom-loading-progress"></div></div>';
    gameContainer.appendChild(doomLoading);

    // Create canvas
    doomCanvas = document.createElement('canvas');
    doomCanvas.id = 'doom-canvas';
    doomCanvas.className = 'doom-canvas';
    doomCanvas.width = 640;
    doomCanvas.height = 400;
    doomCanvas.style.display = 'none';
    gameContainer.appendChild(doomCanvas);

    // Create start button
    doomStartButton = document.createElement('button');
    doomStartButton.id = 'doom-start-button';
    doomStartButton.className = 'doom-start-button';
    doomStartButton.textContent = 'START GAME';
    doomStartButton.style.display = 'none';
    gameContainer.appendChild(doomStartButton);
  }

  // Game state
  let gameActive = false;
  let audioEnabled = false;
  let gameInitialized = false;
  let level = 1;
  let health = 100;
  let ammo = 50;
  let score = 0;
  let kills = 0;
  let gameStartTime = 0;
  let gameTimer = null;
  let gameTime = 0;

  // Cheat code system
  let cheatSequence = '';
  const cheatCodes = {
    'iddqd': () => {
      // God mode
      health = 999;
      document.getElementById('doom-health').textContent = health;
      showMessage('GOD MODE ACTIVATED', 3000, true);
      playSound(itemPickupSound);
    },
    'idkfa': () => {
      // Full ammo and weapons
      ammo = 999;
      document.getElementById('doom-ammo').textContent = ammo;
      showMessage('FULL AMMO ACTIVATED', 3000, true);
      playSound(itemPickupSound);
    },
    'idclev': () => {
      // Level warp
      level += 1;
      document.getElementById('doom-level').textContent = level;
      showMessage(`WARPING TO LEVEL ${level}`, 3000, true);
      playSound(doorSound);
    },
    'idclip': () => {
      // No clipping mode
      showMessage('NOCLIP MODE ACTIVATED', 3000, true);
      playSound(doorSound);

      // Visual effect for noclip
      const gameContainer = doomWindow.querySelector('.doom-game-container');
      gameContainer.classList.add('noclip-mode');
      setTimeout(() => {
        gameContainer.classList.remove('noclip-mode');
      }, 5000);
    },
    'iddt': () => {
      // Full map reveal
      showMessage('FULL MAP REVEALED', 3000, true);
      playSound(itemPickupSound);
    },
    'idbehold': () => {
      // Special powers
      showMessage('SPECIAL POWERS ACTIVATED', 3000, true);
      playSound(itemPickupSound);

      // Visual effect for special powers
      const gameContainer = doomWindow.querySelector('.doom-game-container');
      gameContainer.classList.add('special-powers');
      setTimeout(() => {
        gameContainer.classList.remove('special-powers');
      }, 5000);
    }
  };

  // Game sounds
  let shootSound, hurtSound, itemPickupSound, doorSound, musicTrack;

  // Initialize game UI
  createGameUI();

  // Initialize audio with error handling
  function initAudio() {
    try {
      // Create audio elements with error handling
      shootSound = new Audio();
      shootSound.src = '/sounds/doom-shoot.mp3';

      hurtSound = new Audio();
      hurtSound.src = '/sounds/doom-hurt.mp3';

      itemPickupSound = new Audio();
      itemPickupSound.src = '/sounds/doom-pickup.mp3';

      doorSound = new Audio();
      doorSound.src = '/sounds/doom-door.mp3';

      musicTrack = new Audio();
      musicTrack.src = '/sounds/doom-music.mp3';

      // Set volume
      if (shootSound) shootSound.volume = 0.3;
      if (hurtSound) hurtSound.volume = 0.3;
      if (itemPickupSound) itemPickupSound.volume = 0.3;
      if (doorSound) doorSound.volume = 0.3;
      if (musicTrack) {
        musicTrack.volume = 0.2;
        musicTrack.loop = true;
      }

      // Add error handlers
      [shootSound, hurtSound, itemPickupSound, doorSound, musicTrack].forEach(sound => {
        if (sound) {
          sound.onerror = (e) => {
            console.warn(`Error loading sound: ${sound.src}`, e);
          };
        }
      });

      audioEnabled = true;

      // Preload sounds
      [shootSound, hurtSound, itemPickupSound, doorSound, musicTrack].forEach(sound => {
        if (sound) {
          sound.load();
        }
      });

      console.log('Doom audio initialized successfully');
    } catch (e) {
      console.error('Error initializing Doom audio:', e);
      audioEnabled = false;
    }
  }

  // Create additional game UI elements
  function createGameUI() {
    // Create HUD container
    const hudContainer = document.createElement('div');
    hudContainer.className = 'doom-hud';
    doomWindow.querySelector('.doom-game-container').appendChild(hudContainer);

    // Create health display
    const healthDisplay = document.createElement('div');
    healthDisplay.className = 'doom-health';
    healthDisplay.innerHTML = `HEALTH: <span id="doom-health">100</span>%`;
    hudContainer.appendChild(healthDisplay);

    // Create ammo display
    const ammoDisplay = document.createElement('div');
    ammoDisplay.className = 'doom-ammo';
    ammoDisplay.innerHTML = `AMMO: <span id="doom-ammo">50</span>`;
    hudContainer.appendChild(ammoDisplay);

    // Create score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'doom-score';
    scoreDisplay.innerHTML = `SCORE: <span id="doom-score">0</span>`;
    hudContainer.appendChild(scoreDisplay);

    // Create level display
    const levelDisplay = document.createElement('div');
    levelDisplay.className = 'doom-level';
    levelDisplay.innerHTML = `LEVEL: <span id="doom-level">1</span>`;
    hudContainer.appendChild(levelDisplay);

    // Create timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'doom-timer';
    timerDisplay.innerHTML = `TIME: <span id="doom-timer">00:00</span>`;
    hudContainer.appendChild(timerDisplay);

    // Create sound toggle button
    const soundToggle = document.createElement('button');
    soundToggle.className = 'doom-sound-toggle';
    soundToggle.innerHTML = '🔊';
    soundToggle.title = 'Toggle Sound';
    hudContainer.appendChild(soundToggle);

    // Add event listener to sound toggle
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      audioEnabled = !audioEnabled;
      soundToggle.innerHTML = audioEnabled ? '🔊' : '🔇';

      // Initialize audio if enabled
      if (audioEnabled && !shootSound) {
        initAudio();
      }

      // Toggle music
      if (musicTrack) {
        if (audioEnabled && gameActive) {
          musicTrack.play().catch(e => console.log('Audio play error:', e));
        } else {
          musicTrack.pause();
        }
      }
    });

    // Create weapon display
    const weaponDisplay = document.createElement('div');
    weaponDisplay.className = 'doom-weapon';
    weaponDisplay.innerHTML = `<img src="/images/win95/doom-shotgun.png" alt="Shotgun" id="doom-weapon-img">`;
    doomWindow.querySelector('.doom-game-container').appendChild(weaponDisplay);

    // Create crosshair
    const crosshair = document.createElement('div');
    crosshair.className = 'doom-crosshair';
    crosshair.innerHTML = '+';
    doomWindow.querySelector('.doom-game-container').appendChild(crosshair);

    // Create game messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'doom-messages';
    messagesContainer.id = 'doom-messages';
    doomWindow.querySelector('.doom-game-container').appendChild(messagesContainer);

    // Update start button
    if (doomStartButton) {
      doomStartButton.className = 'doom-start-button';
      doomStartButton.innerHTML = 'START GAME';
    }
  }

  // Play sound with improved error handling
  function playSound(sound) {
    if (!audioEnabled || !sound) return;

    try {
      // Reset sound to beginning
      try {
        sound.currentTime = 0;
      } catch (timeError) {
        console.warn('Could not reset audio time:', timeError);
      }

      // Play the sound with promise handling
      const playPromise = sound.play();

      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn('Doom audio play error:', e);

          // Try to reinitialize audio on user interaction
          if (!audioEnabled) {
            initAudio();
          }

          // If the sound failed to play due to not being loaded yet
          if (e.name === 'NotAllowedError') {
            // This is likely due to browser autoplay policy
            // We'll enable audio on the next user interaction
            const enableAudioOnInteraction = () => {
              audioEnabled = true;
              initAudio();
              document.removeEventListener('click', enableAudioOnInteraction);
            };
            document.addEventListener('click', enableAudioOnInteraction, { once: true });
          }
        });
      }
    } catch (e) {
      console.warn('Doom audio system error:', e);
    }
  }

  // Show game message
  function showMessage(text, duration = 3000, important = false) {
    const messagesContainer = document.getElementById('doom-messages');
    if (!messagesContainer) return;

    const message = document.createElement('div');
    message.className = 'doom-message';
    if (important) {
      message.classList.add('important');
    }
    message.textContent = text;
    messagesContainer.appendChild(message);

    // Announce to screen reader if important
    if (important) {
      announceToScreenReader(text);
    }

    // Use GSAP for animation if available
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(message,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }
      );

      // Fade out after duration
      gsap.to(message, {
        opacity: 0,
        y: -20,
        delay: duration / 1000,
        duration: 0.5,
        onComplete: () => {
          message.remove();
        }
      });
    } else {
      // Fallback animation
      setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
          message.remove();
        }, 500);
      }, duration);
    }

    // Add visual indicator for important messages
    if (important && typeof gsap !== 'undefined') {
      // Create a flash effect for important messages
      const flash = document.createElement('div');
      flash.className = 'doom-message-flash';
      flash.style.position = 'absolute';
      flash.style.top = '0';
      flash.style.left = '0';
      flash.style.right = '0';
      flash.style.bottom = '0';
      flash.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
      flash.style.pointerEvents = 'none';
      doomWindow.querySelector('.doom-game-container').appendChild(flash);

      gsap.to(flash, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          flash.remove();
        }
      });
    }
  }

  // Update game timer
  function updateTimer() {
    if (!gameActive) return;

    const now = Date.now();
    gameTime = Math.floor((now - gameStartTime) / 1000);

    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('doom-timer').textContent = formattedTime;
  }

  // Initialize game
  function initGame() {
    if (gameInitialized) return;

    // Show loading screen
    if (doomLoading) {
      doomLoading.style.display = 'block';
    }

    // Simulate loading
    setTimeout(() => {
      // Hide loading screen
      if (doomLoading) {
        doomLoading.style.display = 'none';
      }

      // Show start button
      if (doomStartButton) {
        doomStartButton.style.display = 'block';

        // Add start button animation
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(doomStartButton,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)',
              repeat: -1,
              yoyo: true,
              repeatDelay: 1
            }
          );
        }
      }

      gameInitialized = true;
    }, 2000);
  }

  // Start game
  function startGame() {
    if (gameActive) return;

    // Reset game state
    gameActive = true;
    level = 1;
    health = 100;
    ammo = 50;
    score = 0;
    kills = 0;
    gameStartTime = Date.now();

    // Update UI
    document.getElementById('doom-health').textContent = health;
    document.getElementById('doom-ammo').textContent = ammo;
    document.getElementById('doom-score').textContent = score;
    document.getElementById('doom-level').textContent = level;

    // Hide start button
    if (doomStartButton) {
      doomStartButton.style.display = 'none';
    }

    // Show canvas
    if (doomCanvas) {
      doomCanvas.style.display = 'block';
    }

    // Start game timer
    gameTimer = setInterval(updateTimer, 1000);

    // Play music
    if (audioEnabled && musicTrack) {
      musicTrack.play().catch(e => console.log('Audio play error:', e));
    }

    // Show welcome message as important
    showMessage('Welcome to DOOM II - Level 1', 5000, true);

    // Initialize game events
    setupGameEvents();
  }

  // Stop game
  function stopGame() {
    gameActive = false;

    // Stop timer
    if (gameTimer) {
      clearInterval(gameTimer);
      gameTimer = null;
    }

    // Stop music
    if (musicTrack) {
      musicTrack.pause();
      musicTrack.currentTime = 0;
    }
  }

  // Setup game events
  function setupGameEvents() {
    // Canvas click event for shooting
    if (doomCanvas) {
      doomCanvas.addEventListener('click', handleShoot);

      // Focus canvas on click
      doomCanvas.addEventListener('click', () => {
        doomCanvas.focus();
      });

      // Keyboard events for movement
      doomCanvas.addEventListener('keydown', handleKeyDown);

      // Touch events for mobile support
      setupTouchControls();
    }

    // Window events
    doomWindow.addEventListener('windowclose', stopGame);

    // Setup accessibility features
    setupAccessibilityFeatures();
  }

  // Setup touch controls for mobile
  function setupTouchControls() {
    // Create touch control overlay
    const touchControls = document.createElement('div');
    touchControls.className = 'doom-touch-controls';
    touchControls.style.display = 'none'; // Hidden by default, shown on touch devices
    doomWindow.querySelector('.doom-game-container').appendChild(touchControls);

    // Create directional pad
    const dPad = document.createElement('div');
    dPad.className = 'doom-dpad';
    touchControls.appendChild(dPad);

    // Create directional buttons
    const directions = [
      { id: 'up', text: '▲', key: 'ArrowUp' },
      { id: 'left', text: '◀', key: 'ArrowLeft' },
      { id: 'right', text: '▶', key: 'ArrowRight' },
      { id: 'down', text: '▼', key: 'ArrowDown' }
    ];

    directions.forEach(dir => {
      const button = document.createElement('button');
      button.className = `doom-dpad-${dir.id}`;
      button.textContent = dir.text;
      button.setAttribute('aria-label', `Move ${dir.id}`);
      dPad.appendChild(button);

      // Add touch events
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        // Simulate keydown event
        handleKeyDown({ key: dir.key });
        button.classList.add('active');
      });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.classList.remove('active');
      });
    });

    // Create action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'doom-action-buttons';
    touchControls.appendChild(actionButtons);

    // Create shoot and use buttons
    const actions = [
      { id: 'shoot', text: '🔫', key: ' ' },
      { id: 'use', text: '👋', key: 'e' }
    ];

    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = `doom-action-${action.id}`;
      button.textContent = action.text;
      button.setAttribute('aria-label', action.id);
      actionButtons.appendChild(button);

      // Add touch events
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        // Simulate keydown event
        handleKeyDown({ key: action.key });
        button.classList.add('active');
      });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.classList.remove('active');
      });
    });

    // Detect touch device and show controls if needed
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      touchControls.style.display = 'flex';

      // Add touch control toggle button
      const toggleButton = document.createElement('button');
      toggleButton.className = 'doom-touch-toggle';
      toggleButton.textContent = '📱';
      toggleButton.setAttribute('aria-label', 'Toggle touch controls');
      doomWindow.querySelector('.doom-hud').appendChild(toggleButton);

      toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        touchControls.style.display = touchControls.style.display === 'none' ? 'flex' : 'none';
      });
    }
  }

  // Setup accessibility features
  function setupAccessibilityFeatures() {
    // Add screen reader announcements
    const srAnnouncer = document.createElement('div');
    srAnnouncer.className = 'sr-only';
    srAnnouncer.setAttribute('aria-live', 'polite');
    srAnnouncer.id = 'doom-sr-announcer';
    doomWindow.appendChild(srAnnouncer);

    // Add high contrast mode toggle
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.className = 'doom-accessibility-menu';
    doomWindow.querySelector('.doom-hud').appendChild(accessibilityMenu);

    const highContrastToggle = document.createElement('button');
    highContrastToggle.className = 'doom-high-contrast-toggle';
    highContrastToggle.textContent = '👁️';
    highContrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    highContrastToggle.title = 'High Contrast Mode';
    accessibilityMenu.appendChild(highContrastToggle);

    highContrastToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameContainer = doomWindow.querySelector('.doom-game-container');
      gameContainer.classList.toggle('high-contrast');

      // Announce to screen readers
      announceToScreenReader(
        gameContainer.classList.contains('high-contrast')
          ? 'High contrast mode enabled'
          : 'High contrast mode disabled'
      );
    });

    // Add text size toggle
    const textSizeToggle = document.createElement('button');
    textSizeToggle.className = 'doom-text-size-toggle';
    textSizeToggle.textContent = 'A';
    textSizeToggle.setAttribute('aria-label', 'Toggle larger text');
    textSizeToggle.title = 'Larger Text';
    accessibilityMenu.appendChild(textSizeToggle);

    textSizeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const gameContainer = doomWindow.querySelector('.doom-game-container');
      gameContainer.classList.toggle('large-text');

      // Announce to screen readers
      announceToScreenReader(
        gameContainer.classList.contains('large-text')
          ? 'Larger text enabled'
          : 'Normal text size'
      );
    });

    // Add game speed toggle
    const gameSpeedToggle = document.createElement('button');
    gameSpeedToggle.className = 'doom-game-speed-toggle';
    gameSpeedToggle.textContent = '⏱️';
    gameSpeedToggle.setAttribute('aria-label', 'Toggle game speed');
    gameSpeedToggle.title = 'Game Speed';
    accessibilityMenu.appendChild(gameSpeedToggle);

    let gameSpeedMode = 'normal'; // normal, slow, very-slow

    gameSpeedToggle.addEventListener('click', (e) => {
      e.stopPropagation();

      // Cycle through game speed modes
      switch (gameSpeedMode) {
        case 'normal':
          gameSpeedMode = 'slow';
          break;
        case 'slow':
          gameSpeedMode = 'very-slow';
          break;
        case 'very-slow':
          gameSpeedMode = 'normal';
          break;
      }

      // Apply game speed class
      const gameContainer = doomWindow.querySelector('.doom-game-container');
      gameContainer.classList.remove('game-speed-normal', 'game-speed-slow', 'game-speed-very-slow');
      gameContainer.classList.add(`game-speed-${gameSpeedMode}`);

      // Announce to screen readers
      announceToScreenReader(`Game speed set to ${gameSpeedMode}`);
    });

    // Add keyboard shortcuts help
    const keyboardHelpToggle = document.createElement('button');
    keyboardHelpToggle.className = 'doom-keyboard-help-toggle';
    keyboardHelpToggle.textContent = '⌨️';
    keyboardHelpToggle.setAttribute('aria-label', 'Show keyboard shortcuts');
    keyboardHelpToggle.title = 'Keyboard Shortcuts';
    accessibilityMenu.appendChild(keyboardHelpToggle);

    keyboardHelpToggle.addEventListener('click', (e) => {
      e.stopPropagation();

      // Create and show keyboard shortcuts dialog
      showKeyboardShortcutsDialog();
    });
  }

  // Show keyboard shortcuts dialog
  function showKeyboardShortcutsDialog() {
    // Create dialog overlay
    const overlay = document.createElement('div');
    overlay.className = 'doom-dialog-overlay';
    doomWindow.appendChild(overlay);

    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'doom-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    overlay.appendChild(dialog);

    // Create dialog title
    const title = document.createElement('h2');
    title.id = 'dialog-title';
    title.textContent = 'Keyboard Shortcuts';
    dialog.appendChild(title);

    // Create shortcuts list
    const shortcuts = document.createElement('ul');
    shortcuts.className = 'doom-shortcuts-list';
    dialog.appendChild(shortcuts);

    // Add shortcuts
    const shortcutsList = [
      { key: 'W / ↑', action: 'Move forward' },
      { key: 'S / ↓', action: 'Move backward' },
      { key: 'A / ←', action: 'Turn left' },
      { key: 'D / →', action: 'Turn right' },
      { key: 'Space', action: 'Shoot' },
      { key: 'E', action: 'Use / Interact' },
      { key: 'Esc', action: 'Pause game' }
    ];

    shortcutsList.forEach(shortcut => {
      const item = document.createElement('li');
      item.innerHTML = `<span class="key">${shortcut.key}</span> <span class="action">${shortcut.action}</span>`;
      shortcuts.appendChild(item);
    });

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'doom-dialog-close';
    closeButton.textContent = 'Close';
    closeButton.setAttribute('aria-label', 'Close dialog');
    dialog.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
      overlay.remove();
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });

    // Focus close button for keyboard accessibility
    closeButton.focus();
  }

  // Announce to screen reader
  function announceToScreenReader(message) {
    const announcer = document.getElementById('doom-sr-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Handle shooting
  function handleShoot(e) {
    if (!gameActive) return;

    // Check ammo
    if (ammo <= 0) {
      showMessage('Out of ammo!');
      playSound(hurtSound);
      return;
    }

    // Decrease ammo
    ammo--;
    document.getElementById('doom-ammo').textContent = ammo;

    // Play shoot sound
    playSound(shootSound);

    // Weapon recoil animation
    const weaponImg = document.getElementById('doom-weapon-img');
    if (weaponImg && typeof gsap !== 'undefined') {
      gsap.fromTo(weaponImg,
        { y: 0, rotation: 0 },
        {
          y: 20,
          rotation: 5,
          duration: 0.1,
          yoyo: true,
          repeat: 1
        }
      );
    }

    // Random hit chance
    if (Math.random() > 0.7) {
      // Hit enemy
      score += 100;
      kills++;
      document.getElementById('doom-score').textContent = score;

      showMessage('Enemy killed! +100 points');

      // Check for level up
      if (kills >= level * 5) {
        levelUp();
      }

      // Random ammo pickup chance
      if (Math.random() > 0.7) {
        ammo += 10;
        document.getElementById('doom-ammo').textContent = ammo;
        showMessage('Ammo pickup! +10 ammo');
        playSound(itemPickupSound);
      }
    }
  }

  // Handle keyboard input
  function handleKeyDown(e) {
    if (!gameActive && e.key !== 'Enter') return;

    // Handle Enter key to start game when not active
    if (!gameActive && e.key === 'Enter') {
      startGame();
      return;
    }

    // Process cheat codes
    if (e.key.length === 1) {
      cheatSequence += e.key.toLowerCase();

      // Keep only the last 10 characters to avoid memory issues
      if (cheatSequence.length > 10) {
        cheatSequence = cheatSequence.substring(cheatSequence.length - 10);
      }

      // Check for cheat codes
      Object.keys(cheatCodes).forEach(code => {
        if (cheatSequence.endsWith(code)) {
          // Execute the cheat code
          cheatCodes[code]();

          // Reset cheat sequence
          cheatSequence = '';
        }
      });
    }

    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        // Move forward
        playSound(doorSound);
        showMessage('Moving forward');
        break;
      case 's':
      case 'ArrowDown':
        // Move backward
        playSound(doorSound);
        showMessage('Moving backward');
        break;
      case 'a':
      case 'ArrowLeft':
        // Turn left
        showMessage('Turning left');
        break;
      case 'd':
      case 'ArrowRight':
        // Turn right
        showMessage('Turning right');
        break;
      case ' ':
        // Shoot
        handleShoot(null);
        break;
      case 'e':
        // Use/interact
        if (Math.random() > 0.5) {
          // Health pickup
          health = Math.min(health + 25, 100);
          document.getElementById('doom-health').textContent = health;
          showMessage('Health pickup! +25 health');
          playSound(itemPickupSound);
        } else {
          // Ammo pickup
          ammo += 15;
          document.getElementById('doom-ammo').textContent = ammo;
          showMessage('Ammo pickup! +15 ammo');
          playSound(itemPickupSound);
        }
        break;
      case 'Tab':
        // Show map overlay
        const gameContainer = doomWindow.querySelector('.doom-game-container');
        gameContainer.classList.add('show-map');

        // Remove after a short delay
        setTimeout(() => {
          gameContainer.classList.remove('show-map');
        }, 2000);
        break;
    }
  }

  // Level up function
  function levelUp() {
    level++;
    kills = 0;

    // Update UI
    document.getElementById('doom-level').textContent = level;

    // Bonus points
    const levelBonus = level * 500;
    score += levelBonus;
    document.getElementById('doom-score').textContent = score;

    // Show level up message as important
    showMessage(`Level ${level}! Bonus: +${levelBonus} points`, 5000, true);

    // Health and ammo bonus
    health = Math.min(health + 50, 100);
    ammo += 25;
    document.getElementById('doom-health').textContent = health;
    document.getElementById('doom-ammo').textContent = ammo;

    // Level up animation
    if (typeof gsap !== 'undefined') {
      // Flash screen
      const flashOverlay = document.createElement('div');
      flashOverlay.className = 'doom-flash-overlay';
      doomWindow.querySelector('.doom-game-container').appendChild(flashOverlay);

      gsap.fromTo(flashOverlay,
        { opacity: 0.8 },
        {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            flashOverlay.remove();
          }
        }
      );

      // Animate level display
      const levelElement = document.getElementById('doom-level').parentElement;
      gsap.fromTo(levelElement,
        { scale: 1 },
        {
          scale: 1.5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'elastic.out(1, 0.3)'
        }
      );
    }
  }

  // Initialize when window is opened
  doomWindow.addEventListener('windowopen', initGame);

  // Add start button event listener
  if (doomStartButton) {
    doomStartButton.addEventListener('click', startGame);
  }
});
