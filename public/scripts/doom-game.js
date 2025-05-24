/**
 * Doom II Game for NosytOS95
 * A simple implementation of Doom II using JS-Doom
 */

class DoomGame {
  constructor() {
    // Game elements
    this.gameContainer = document.querySelector('.doom-game-container');
    this.canvas = document.getElementById('doom-canvas');
    this.loadingMessage = document.getElementById('doom-loading');
    this.startButton = document.getElementById('doom-start-button');

    // Game state
    this.gameActive = false;
    this.soundEnabled = true;
    this.isFullscreen = false;

    // Audio elements
    this.sounds = {
      theme: new Audio('/sounds/doom/doom-theme.mp3'),
      shotgun: new Audio('/sounds/doom/shotgun.mp3'),
      monster: new Audio('/sounds/doom/monster.mp3'),
      door: new Audio('/sounds/doom/door.mp3'),
      pain: new Audio('/sounds/doom/pain.mp3')
    };

    // Preload sounds
    Object.values(this.sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.5;
    });

    // Initialize the game
    this.init();
  }

  init() {
    // Set up event listeners
    if (this.startButton) {
      this.startButton.addEventListener('click', this.startGame.bind(this));
    }

    // Add sound toggle button
    this.createSoundToggle();

    // Add fullscreen toggle button
    this.createFullscreenToggle();

    // Prevent window from closing when clicking game area
    document.getElementById('doom-window').addEventListener('click', (e) => {
      if (e.target.closest('.doom-game-container')) {
        e.stopPropagation();
      }
    });

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Handle key events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Initialize loading state
    if (this.loadingMessage) {
      this.loadingMessage.style.display = 'block';
    }

    // Check if JS-Doom is loaded
    if (typeof JSDOOM !== 'undefined') {
      this.initDoomEngine();
    } else {
      // Load JS-Doom script
      this.loadJSDoom();
    }
  }

  loadJSDoom() {
    // Create script element to load JS-Doom
    const script = document.createElement('script');
    script.src = '/scripts/js-doom.min.js';
    script.onload = () => {
      this.initDoomEngine();
    };
    script.onerror = () => {
      if (this.loadingMessage) {
        this.loadingMessage.textContent = 'Failed to load Doom engine. Please try again later.';
      }
    };
    document.head.appendChild(script);
  }

  initDoomEngine() {
    // Initialize JS-Doom engine with the canvas
    if (this.canvas && typeof JSDOOM !== 'undefined') {
      try {
        this.doomEngine = new JSDOOM.Engine({
          canvas: this.canvas,
          wad: '/wads/doom2.wad',
          resolution: { width: 320, height: 200 },
          sfxVolume: this.soundEnabled ? 0.5 : 0,
          musicVolume: this.soundEnabled ? 0.3 : 0
        });

        // Hide loading message and show start button
        if (this.loadingMessage) {
          this.loadingMessage.style.display = 'none';
        }
        if (this.startButton) {
          this.startButton.style.display = 'block';
        }
      } catch (error) {
        console.error('Failed to initialize Doom engine:', error);
        if (this.loadingMessage) {
          this.loadingMessage.textContent = 'Failed to initialize Doom engine. Please try again later.';
        }
      }
    }
  }

  startGame() {
    if (!this.doomEngine) return;

    // Hide start button
    if (this.startButton) {
      this.startButton.style.display = 'none';
    }

    // Start the game
    this.gameActive = true;
    this.doomEngine.start();

    // Play theme music
    if (this.soundEnabled) {
      this.sounds.theme.loop = true;
      this.sounds.theme.play();
    }

    // Focus canvas for keyboard input
    if (this.canvas) {
      this.canvas.focus();
    }
  }

  pauseGame() {
    if (!this.doomEngine || !this.gameActive) return;

    this.gameActive = false;
    this.doomEngine.pause();

    // Pause theme music
    this.sounds.theme.pause();
  }

  resumeGame() {
    if (!this.doomEngine || this.gameActive) return;

    this.gameActive = true;
    this.doomEngine.resume();

    // Resume theme music if sound is enabled
    if (this.soundEnabled) {
      this.sounds.theme.play();
    }

    // Focus canvas for keyboard input
    if (this.canvas) {
      this.canvas.focus();
    }
  }

  toggleFullscreen() {
    const doomWindow = document.getElementById('doom-window');
    if (!doomWindow) return;

    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      // Save current dimensions and position
      doomWindow.dataset.prevWidth = doomWindow.style.width;
      doomWindow.dataset.prevHeight = doomWindow.style.height;
      doomWindow.dataset.prevLeft = doomWindow.style.left;
      doomWindow.dataset.prevTop = doomWindow.style.top;

      // Set fullscreen dimensions
      doomWindow.style.width = '100%';
      doomWindow.style.height = 'calc(100% - 28px)'; // Account for taskbar
      doomWindow.style.left = '0';
      doomWindow.style.top = '0';
      doomWindow.classList.add('maximized');
    } else {
      // Restore previous dimensions and position
      doomWindow.style.width = doomWindow.dataset.prevWidth || '640px';
      doomWindow.style.height = doomWindow.dataset.prevHeight || '480px';
      doomWindow.style.left = doomWindow.dataset.prevLeft || '50px';
      doomWindow.style.top = doomWindow.dataset.prevTop || '50px';
      doomWindow.classList.remove('maximized');
    }

    // Update canvas size
    this.handleResize();
  }

  handleResize() {
    if (!this.canvas || !this.doomEngine) return;

    // Resize canvas to fit container
    const container = this.canvas.parentElement;
    if (container) {
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight;

      // Update doom engine resolution if available
      if (this.doomEngine.setResolution) {
        this.doomEngine.setResolution(this.canvas.width, this.canvas.height);
      }
    }
  }

  handleKeyDown(e) {
    if (!this.gameActive) return;

    // Pass key events to doom engine if available
    if (this.doomEngine && this.doomEngine.handleKeyDown) {
      this.doomEngine.handleKeyDown(e);
    }
  }

  handleKeyUp(e) {
    if (!this.gameActive) return;

    // Pass key events to doom engine if available
    if (this.doomEngine && this.doomEngine.handleKeyUp) {
      this.doomEngine.handleKeyUp(e);
    }
  }

  createSoundToggle() {
    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle win95-button';
    soundToggle.innerHTML = '🔊';
    soundToggle.title = 'Toggle Sound';
    soundToggle.style.position = 'absolute';
    soundToggle.style.top = '10px';
    soundToggle.style.right = '50px';
    soundToggle.style.zIndex = '100';

    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.soundEnabled = !this.soundEnabled;
      soundToggle.innerHTML = this.soundEnabled ? '🔊' : '🔇';

      // Mute/unmute all sounds
      Object.values(this.sounds).forEach(sound => {
        sound.muted = !this.soundEnabled;
      });

      // Update doom engine sound if available
      if (this.doomEngine && this.doomEngine.setSoundVolume) {
        this.doomEngine.setSoundVolume(this.soundEnabled ? 0.5 : 0);
        this.doomEngine.setMusicVolume(this.soundEnabled ? 0.3 : 0);
      }
    });

    this.gameContainer.appendChild(soundToggle);
  }

  createFullscreenToggle() {
    const fullscreenToggle = document.createElement('button');
    fullscreenToggle.className = 'fullscreen-toggle win95-button';
    fullscreenToggle.innerHTML = '⛶';
    fullscreenToggle.title = 'Toggle Fullscreen';
    fullscreenToggle.style.position = 'absolute';
    fullscreenToggle.style.top = '10px';
    fullscreenToggle.style.right = '10px';
    fullscreenToggle.style.zIndex = '100';

    fullscreenToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
      fullscreenToggle.innerHTML = this.isFullscreen ? '⮌' : '⛶';
    });

    this.gameContainer.appendChild(fullscreenToggle);
  }
}

// Initialize the game when the window is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if the doom window exists
  const doomWindow = document.getElementById('doom-window');
  if (doomWindow) {
    // Initialize when the window is opened
    const doomIcon = document.getElementById('doom-icon');
    if (doomIcon) {
      doomIcon.addEventListener('dblclick', () => {
        setTimeout(() => {
          new DoomGame();
        }, 500); // Short delay to ensure window is fully opened
      });
    }

    // Also initialize if window is already open
    if (doomWindow.style.display !== 'none') {
      new DoomGame();
    }

    // Initialize when opened from Start menu
    const startMenuDoom = document.querySelector('.submenu-item[data-target="doom-window"]');
    if (startMenuDoom) {
      startMenuDoom.addEventListener('click', () => {
        setTimeout(() => {
          new DoomGame();
        }, 500);
      });
    }
  }
});
