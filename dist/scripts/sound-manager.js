/**
 * Enhanced Sound Manager
 * This script manages sound effects for NosytOS95
 */

// Initialize sound manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for window system to be ready
  setTimeout(initSoundManager, 1000);
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

    // Sound paths
    this.soundPaths = {
      // Authentic Windows 95 system sounds
      startup: '/sounds/win95/startup.mp3',
      shutdown: '/sounds/win95/shutdown.mp3',
      error: '/sounds/win95/error.mp3',
      notification: '/sounds/win95/notify.mp3',
      click: '/sounds/win95/click.mp3',
      close: '/sounds/win95/close.mp3',
      maximize: '/sounds/win95/maximize.mp3',
      minimize: '/sounds/win95/minimize.mp3',
      'menu-open': '/sounds/win95/menu.mp3',
      'menu-close': '/sounds/win95/menu.mp3',
      chimes: '/sounds/win95/chimes.mp3',
      ding: '/sounds/win95/ding.mp3',
      recycle: '/sounds/win95/recycle.mp3',
      tada: '/sounds/win95/tada.mp3',
      question: '/sounds/win95/question.mp3',
      exclamation: '/sounds/win95/exclamation.mp3',
      critical: '/sounds/win95/critical.mp3',

      // Clippy sounds
      'clippy-appear': '/sounds/clippy-appear.mp3',
      'clippy-hide': '/sounds/clippy-hide.mp3',

      // Duck Hunt sounds
      'duck-quack': '/sounds/quack.mp3',
      shoot: '/sounds/shot.mp3',
      hit: '/sounds/hit.mp3',
      miss: '/sounds/miss.mp3',
      reload: '/sounds/reload.mp3',
      levelup: '/sounds/level-up.mp3',
      gameOver: '/sounds/game-over.mp3',

      // Doom sounds
      doomShoot: '/sounds/click.mp3',
      doomHit: '/sounds/notification.mp3',
      doomDeath: '/sounds/error.mp3',
      doomDoor: '/sounds/menu-open.mp3',
      doomEmpty: '/sounds/error.mp3',
      doomPowerup: '/sounds/startup.mp3',
      doomLevelup: '/sounds/startup.mp3',

      // Easter egg sounds
      konami: '/sounds/startup.mp3',
      matrix: '/sounds/startup.mp3',
      clippy: '/sounds/clippy-appear.mp3'
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
  console.log('Initializing Sound Manager...');

  // Create sound manager instance
  window.soundManager = new SoundManager();

  // Play startup sound
  window.soundManager.play('startup');

  // Add event listeners for common UI sounds
  addSoundEventListeners();

  console.log('Sound Manager initialized');
}

// Add event listeners for common UI sounds
function addSoundEventListeners() {
  // Window buttons
  document.addEventListener('click', (e) => {
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
  });

  // Error dialogs
  document.addEventListener('DOMNodeInserted', (e) => {
    if (e.target.classList && e.target.classList.contains('win95-dialog')) {
      // Check if it's an error dialog
      const title = e.target.querySelector('.dialog-title');
      if (title && title.textContent.includes('Error')) {
        window.soundManager.play('error');
      } else {
        window.soundManager.play('notification');
      }
    }
  });
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
