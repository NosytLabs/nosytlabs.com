/**
 * Enhanced Sound Manager
 * This script manages sound effects for NosytOS95
 */

// Initialize sound manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create a global initialization flag
  if (typeof window.soundManagerInitialized === 'undefined') {
    window.soundManagerInitialized = false;
  }

  // Check if window system is ready
  if (typeof window.nosytOS !== 'undefined' && window.nosytOS.ready) {
    // Window system is already ready, initialize immediately
    initSoundManager();
  } else {
    // Wait for window system to be ready with a safety timeout
    const maxWaitTime = 5000; // 5 seconds max wait time
    const checkInterval = 100; // Check every 100ms
    let elapsedTime = 0;

    const checkWindowSystem = () => {
      if (typeof window.nosytOS !== 'undefined' && window.nosytOS.ready) {
        // Window system is ready
        initSoundManager();
        return;
      }

      elapsedTime += checkInterval;

      if (elapsedTime >= maxWaitTime) {
        // Max wait time reached, initialize anyway
        console.warn('Sound Manager: Window system not ready after timeout, initializing anyway');
        initSoundManager();
      } else {
        // Check again after interval
        setTimeout(checkWindowSystem, checkInterval);
      }
    };

    // Start checking
    checkWindowSystem();
  }
});

// Sound manager class
class SoundManager {
  constructor() {
    // Sound cache
    this.sounds = {};

    // Default volume
    this.volume = 0.3;

    // Muted state
    this.muted = false;

    // Use centralized sound paths from sound-paths.js if available
    this.soundPaths = window.SOUND_PATHS || {
      // Authentic Windows 95 system sounds
      startup: './sounds/win95/startup.mp3',
      shutdown: './sounds/win95/shutdown.mp3',
      error: './sounds/win95/error.mp3',
      notification: './sounds/win95/notify.mp3',
      click: './sounds/win95/click.mp3',
      close: './sounds/win95/close.mp3',
      maximize: './sounds/win95/maximize.mp3',
      minimize: './sounds/win95/minimize.mp3',
      'menu-open': './sounds/win95/menu.mp3',
      'menu-close': './sounds/win95/menu.mp3',
      chimes: './sounds/win95/chimes.mp3',
      ding: './sounds/win95/ding.mp3',
      recycle: './sounds/win95/recycle.mp3',
      tada: './sounds/win95/tada.mp3',
      question: './sounds/win95/question.mp3',
      exclamation: './sounds/win95/exclamation.mp3',
      critical: './sounds/win95/critical.mp3',

      // Clippy sounds
      'clippy-appear': './sounds/clippy-appear.mp3',
      'clippy-hide': './sounds/clippy-hide.mp3',

      // Duck Hunt sounds
      'duck-quack': './sounds/quack.mp3',
      shot: './sounds/shot.mp3',
      hit: './sounds/hit.mp3',
      miss: './sounds/miss.mp3',
      reload: './sounds/reload.mp3',
      levelup: './sounds/level-up.mp3',
      gameOver: './sounds/game-over.mp3',

      // Doom sounds
      doomShoot: './sounds/click.mp3',
      doomHit: './sounds/notification.mp3',
      doomDeath: './sounds/error.mp3',
      doomDoor: './sounds/menu-open.mp3',
      doomEmpty: './sounds/error.mp3',
      doomPowerup: './sounds/startup.mp3',
      doomLevelup: './sounds/startup.mp3',

      // Easter egg sounds
      konami: './sounds/startup.mp3',
      matrix: './sounds/startup.mp3',
      clippy: './sounds/clippy-appear.mp3'
    };

    // Preload common sounds
    this.preloadSounds(['click', 'error', 'notification', 'startup']);

    // Initialize volume from localStorage
    this.initVolume();
  }

  // Initialize volume from localStorage
  initVolume() {
    try {
      const savedVolume = localStorage.getItem('nosytOS95Volume');
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }

      const savedMuted = localStorage.getItem('nosytOS95Muted');
      if (savedMuted !== null) {
        this.muted = savedMuted === 'true';
      }
    } catch (e) {
      console.warn('Could not load sound settings from localStorage:', e);
    }
  }

  // Save volume to localStorage
  saveVolume() {
    try {
      localStorage.setItem('nosytOS95Volume', this.volume.toString());
      localStorage.setItem('nosytOS95Muted', this.muted.toString());
    } catch (e) {
      console.warn('Could not save sound settings to localStorage:', e);
    }
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveVolume();
    return this.volume;
  }

  // Get current volume
  getVolume() {
    return this.volume;
  }

  // Mute/unmute sounds
  setMuted(muted) {
    this.muted = muted;
    this.saveVolume();
    return this.muted;
  }

  // Toggle mute state
  toggleMute() {
    this.muted = !this.muted;
    this.saveVolume();
    return this.muted;
  }

  // Get muted state
  isMuted() {
    return this.muted;
  }

  // Preload sounds
  preloadSounds(soundNames) {
    soundNames.forEach(name => {
      this.getSound(name);
    });
  }

  // Get sound (from cache or create new)
  getSound(name) {
    // Check if sound exists in paths
    if (!this.soundPaths[name]) {
      console.warn(`Sound "${name}" not found in sound paths`);
      return null;
    }

    // Check if sound is already cached
    if (!this.sounds[name]) {
      // Create new Audio element
      const audio = new Audio();
      audio.src = this.soundPaths[name];
      audio.preload = 'auto';

      // Add to cache
      this.sounds[name] = audio;
    }

    return this.sounds[name];
  }

  // Play sound by name
  play(name) {
    // Don't play if muted
    if (this.muted) return;

    // Get sound
    const sound = this.getSound(name);
    if (!sound) return;

    // Clone the sound to allow overlapping playback
    const soundClone = sound.cloneNode();
    soundClone.volume = this.volume;

    // Play with error handling
    soundClone.play().catch(e => {
      console.warn(`Sound play error (${name}):`, e);
    });

    return soundClone;
  }

  // Play sound with options
  playWithOptions(name, options = {}) {
    // Don't play if muted
    if (this.muted) return;

    // Get sound
    const sound = this.getSound(name);
    if (!sound) return;

    // Clone the sound to allow overlapping playback
    const soundClone = sound.cloneNode();

    // Apply options
    soundClone.volume = options.volume !== undefined ? options.volume : this.volume;
    if (options.loop !== undefined) soundClone.loop = options.loop;
    if (options.playbackRate !== undefined) soundClone.playbackRate = options.playbackRate;

    // Play with error handling
    soundClone.play().catch(e => {
      console.warn(`Sound play error (${name}):`, e);
    });

    return soundClone;
  }

  // Stop all sounds
  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  // Add a new sound
  addSound(name, path) {
    this.soundPaths[name] = path;

    // Clear from cache if it exists
    if (this.sounds[name]) {
      delete this.sounds[name];
    }

    return this.getSound(name);
  }

  // Cleanup method to prevent memory leaks
  cleanup() {
    // Stop all sounds
    this.stopAll();

    // Clear sound cache
    for (const name in this.sounds) {
      const sound = this.sounds[name];
      if (sound) {
        // Remove event listeners
        sound.oncanplaythrough = null;
        sound.onerror = null;
        sound.onended = null;

        // Pause and reset
        sound.pause();
        sound.currentTime = 0;

        // Remove from cache
        delete this.sounds[name];
      }
    }

    // Save settings
    try {
      localStorage.setItem('nosytOS95Volume', this.volume.toString());
      localStorage.setItem('nosytOS95Muted', this.muted.toString());
    } catch (e) {
      console.warn('Could not save sound settings to localStorage:', e);
    }

    console.log('Sound Manager cleaned up');
  }

  // Legacy methods for backward compatibility
  playStartup() {
    this.play('startup');
  }

  playClick() {
    this.play('click');
  }

  playError() {
    this.play('error');
  }

  playNotification() {
    this.play('notification');
  }

  playMenuOpen() {
    this.play('menu-open');
  }

  playMenuClose() {
    this.play('menu-close');
  }

  playClippyAppear() {
    this.play('clippy-appear');
  }

  playClippyHide() {
    this.play('clippy-hide');
  }

  playDuckQuack() {
    this.play('duck-quack');
  }

  playShoot() {
    this.play('shoot');
  }

  playHit() {
    this.play('hit');
  }

  playMiss() {
    this.play('miss');
  }

  playReload() {
    this.play('reload');
  }

  playLevelUp() {
    this.play('levelup');
  }

  playGameOver() {
    this.play('gameOver');
  }
}

// Initialize sound manager
function initSoundManager() {
  // Prevent multiple initializations
  if (window.soundManagerInitialized) {
    console.log('Sound Manager already initialized, skipping');
    return;
  }

  console.log('Initializing Sound Manager...');

  try {
    // Create sound manager instance
    window.soundManager = new SoundManager();

    // Play startup sound
    window.soundManager.play('startup');

    // Add event listeners for common UI sounds
    addSoundEventListeners();

    // Mark as initialized
    window.soundManagerInitialized = true;

    console.log('Sound Manager initialized successfully');
  } catch (error) {
    console.error('Error initializing Sound Manager:', error);
    // Set initialization flag to false to allow retry
    window.soundManagerInitialized = false;
  }
}

// Store event listeners for cleanup
const soundEventListeners = {
  click: null,
  domNodeInserted: null
};

// Add event listeners for common UI sounds
function addSoundEventListeners() {
  // Remove existing listeners if any
  removeSoundEventListeners();

  // Window buttons and UI elements click handler
  const clickHandler = (e) => {
    // Ensure sound manager exists
    if (!window.soundManager) return;

    // Close button
    if (e.target.closest('.window-close')) {
      window.soundManager.play('close');
    }
    // Maximize button
    else if (e.target.closest('.window-maximize')) {
      window.soundManager.play('maximize');
    }
    // Minimize button
    else if (e.target.closest('.window-minimize')) {
      window.soundManager.play('minimize');
    }
    // Desktop icons
    else if (e.target.closest('.desktop-icon')) {
      window.soundManager.play('click');
    }
    // Start menu items
    else if (e.target.closest('.start-menu-item')) {
      window.soundManager.play('click');
    }
    // Taskbar buttons
    else if (e.target.closest('.taskbar-button')) {
      window.soundManager.play('click');
    }
    // Regular buttons and links (for backward compatibility)
    else if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
      window.soundManager.play('click');
    }
  };

  // Error dialogs handler
  const domNodeInsertedHandler = (e) => {
    // Ensure sound manager exists
    if (!window.soundManager) return;

    if (e.target.classList && e.target.classList.contains('win95-dialog')) {
      // Check if it's an error dialog
      const title = e.target.querySelector('.dialog-title');
      if (title && title.textContent.includes('Error')) {
        window.soundManager.play('error');
      } else {
        window.soundManager.play('notification');
      }
    }
  };

  // Add event listeners
  document.addEventListener('click', clickHandler);
  document.addEventListener('DOMNodeInserted', domNodeInsertedHandler);

  // Store references for cleanup
  soundEventListeners.click = clickHandler;
  soundEventListeners.domNodeInserted = domNodeInsertedHandler;
}

// Remove event listeners to prevent memory leaks
function removeSoundEventListeners() {
  // Remove click handler
  if (soundEventListeners.click) {
    document.removeEventListener('click', soundEventListeners.click);
    soundEventListeners.click = null;
  }

  // Remove DOM node inserted handler
  if (soundEventListeners.domNodeInserted) {
    document.removeEventListener('DOMNodeInserted', soundEventListeners.domNodeInserted);
    soundEventListeners.domNodeInserted = null;
  }
}

// Global cleanup function
function cleanupSoundManager() {
  // Check if sound manager exists
  if (window.soundManager) {
    // Call cleanup method
    window.soundManager.cleanup();

    // Remove event listeners
    removeSoundEventListeners();

    // Reset initialization flag
    window.soundManagerInitialized = false;

    // Remove global reference
    window.soundManager = null;

    console.log('Sound Manager global cleanup complete');
  }
}

// Global function to play sounds from other scripts
function playSound(name, options) {
  if (window.soundManager) {
    if (options) {
      return window.soundManager.playWithOptions(name, options);
    } else {
      return window.soundManager.play(name);
    }
  }
}
