/**
 * utils-bundle.js - Consolidated Bundle
 * Generated automatically - do not edit directly
 * Generated on: 2025-05-26T03:43:40.000Z
 */


/* ===== sound-manager.js ===== */
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



/* ===== sound-paths.js ===== */
/**
 * Sound Paths Configuration
 * 
 * This file contains centralized path configurations for all sound files used in the application.
 * Using this configuration ensures consistency across different components and makes it easier
 * to update paths if the file structure changes.
 */

// Base paths for different sound categories
const SOUND_BASE_PATHS = {
  win95: './sounds/win95',
  duckHunt: './sounds/duck-hunt',
  audio: './audio',
  doom: './sounds/doom'
};

// Sound path configuration
const SOUND_PATHS = {
  // Windows 95 system sounds
  startup: `${SOUND_BASE_PATHS.win95}/startup.mp3`,
  shutdown: `${SOUND_BASE_PATHS.win95}/shutdown.mp3`,
  error: `${SOUND_BASE_PATHS.win95}/error.mp3`,
  notification: `${SOUND_BASE_PATHS.win95}/notify.mp3`,
  click: `${SOUND_BASE_PATHS.win95}/click.mp3`,
  close: `${SOUND_BASE_PATHS.win95}/close.mp3`,
  maximize: `${SOUND_BASE_PATHS.win95}/maximize.mp3`,
  minimize: `${SOUND_BASE_PATHS.win95}/minimize.mp3`,
  'menu-open': `${SOUND_BASE_PATHS.win95}/menu.mp3`,
  'menu-close': `${SOUND_BASE_PATHS.win95}/menu.mp3`,
  chimes: `${SOUND_BASE_PATHS.win95}/chimes.mp3`,
  ding: `${SOUND_BASE_PATHS.win95}/ding.mp3`,
  recycle: `${SOUND_BASE_PATHS.win95}/recycle.mp3`,
  tada: `${SOUND_BASE_PATHS.win95}/tada.mp3`,
  question: `${SOUND_BASE_PATHS.win95}/question.mp3`,
  exclamation: `${SOUND_BASE_PATHS.win95}/exclamation.mp3`,
  critical: `${SOUND_BASE_PATHS.win95}/critical.mp3`,

  // Clippy sounds
  'clippy-appear': `${SOUND_BASE_PATHS.audio}/clippy-appear.mp3`,
  'clippy-hide': `${SOUND_BASE_PATHS.audio}/clippy-hide.mp3`,

  // Duck Hunt sounds
  'duck-quack': `${SOUND_BASE_PATHS.duckHunt}/quack.mp3`,
  'duck-quack-fallback': `${SOUND_BASE_PATHS.audio}/quack.mp3`,
  shot: `${SOUND_BASE_PATHS.duckHunt}/shot.mp3`,
  'shot-fallback': `${SOUND_BASE_PATHS.audio}/gun-shot.mp3`,
  fall: `${SOUND_BASE_PATHS.duckHunt}/fall.mp3`,
  'fall-fallback': `${SOUND_BASE_PATHS.audio}/duck-falling.mp3`,
  'game-start': `${SOUND_BASE_PATHS.audio}/game-start.mp3`,
  'level-up': `${SOUND_BASE_PATHS.duckHunt}/level-up.mp3`,
  'level-up-fallback': `${SOUND_BASE_PATHS.audio}/level-up.mp3`,
  'game-over': `${SOUND_BASE_PATHS.audio}/game-over.mp3`,
  'dog-laugh': `${SOUND_BASE_PATHS.audio}/dog-laugh.mp3`,
  'dog-bark': `${SOUND_BASE_PATHS.audio}/dog-bark.mp3`,
  'duck-flap': `${SOUND_BASE_PATHS.audio}/duck-flap.mp3`,
  'round-clear': `${SOUND_BASE_PATHS.audio}/round-clear.mp3`,
  'empty-gun': `${SOUND_BASE_PATHS.audio}/empty-gun.mp3`,
  reload: `${SOUND_BASE_PATHS.audio}/reload.mp3`,
  'menu-select': `${SOUND_BASE_PATHS.audio}/menu-select.mp3`,

  // Doom sounds
  'doom-shoot': `${SOUND_BASE_PATHS.doom}/doom-shoot.mp3`,
  'doom-hit': `${SOUND_BASE_PATHS.doom}/doom-hit.mp3`,
  'doom-death': `${SOUND_BASE_PATHS.doom}/doom-death.mp3`,
  'doom-door': `${SOUND_BASE_PATHS.doom}/doom-door.mp3`,
  'doom-pickup': `${SOUND_BASE_PATHS.doom}/doom-pickup.mp3`,
  'doom-music': `${SOUND_BASE_PATHS.doom}/doom-music.mp3`,
  'doom-theme': `${SOUND_BASE_PATHS.doom}/doom-theme.mp3`,
  'doom-monster': `${SOUND_BASE_PATHS.doom}/monster.mp3`,
  'doom-pain': `${SOUND_BASE_PATHS.doom}/pain.mp3`,

  // Easter egg sounds
  konami: `${SOUND_BASE_PATHS.audio}/konami.mp3`,
  matrix: `${SOUND_BASE_PATHS.audio}/matrix.mp3`,
  clippy: `${SOUND_BASE_PATHS.audio}/clippy-appear.mp3`
};

// Duck Hunt sound configurations with fallback paths
const DUCK_HUNT_SOUNDS = {
  shot: { 
    src: [SOUND_PATHS.shot, SOUND_PATHS['shot-fallback']], 
    volume: 0.5, 
    preload: true 
  },
  quack: { 
    src: [SOUND_PATHS['duck-quack'], SOUND_PATHS['duck-quack-fallback']], 
    volume: 0.6, 
    preload: true 
  },
  fall: { 
    src: [SOUND_PATHS.fall, SOUND_PATHS['fall-fallback']], 
    volume: 0.6, 
    preload: true 
  },
  gameStart: { 
    src: [SOUND_PATHS['game-start']], 
    volume: 0.4, 
    preload: true 
  },
  levelUp: { 
    src: [SOUND_PATHS['level-up'], SOUND_PATHS['level-up-fallback']], 
    volume: 0.5, 
    preload: true 
  },
  gameOver: { 
    src: [SOUND_PATHS['game-over']], 
    volume: 0.5, 
    preload: true 
  },
  dogLaugh: { 
    src: [SOUND_PATHS['dog-laugh']], 
    volume: 0.6, 
    preload: false 
  },
  dogBark: { 
    src: [SOUND_PATHS['dog-bark']], 
    volume: 0.6, 
    preload: false 
  },
  duckFlap: { 
    src: [SOUND_PATHS['duck-flap']], 
    volume: 0.4, 
    preload: false 
  },
  roundClear: { 
    src: [SOUND_PATHS['round-clear']], 
    volume: 0.5, 
    preload: false 
  },
  emptyGun: { 
    src: [SOUND_PATHS['empty-gun']], 
    volume: 0.5, 
    preload: false 
  },
  reload: { 
    src: [SOUND_PATHS.reload], 
    volume: 0.5, 
    preload: false 
  },
  menuSelect: { 
    src: [SOUND_PATHS['menu-select']], 
    volume: 0.4, 
    preload: false 
  }
};

// Export the configurations
if (typeof window !== 'undefined') {
  window.SOUND_PATHS = SOUND_PATHS;
  window.DUCK_HUNT_SOUNDS = DUCK_HUNT_SOUNDS;
}

// For ES modules
export { SOUND_PATHS, DUCK_HUNT_SOUNDS };



/* ===== service-worker-registration.js ===== */
/**
 * Service Worker Registration Script
 * 
 * This script registers the service worker for the NosytLabs website.
 * It provides caching for assets, including sound files, to improve performance
 * and enable offline functionality.
 */

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update()
            .then(() => console.log('Service worker updated'))
            .catch(error => console.error('Service worker update failed:', error));
        }, 3600000); // 1 hour
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
  
  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('New content is available; please refresh.');
      // You could show a notification to the user here
    }
  });
  
  // Clean up dynamic cache when the page is unloaded
  window.addEventListener('unload', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAN_DYNAMIC_CACHE'
      });
    }
  });
}

// Function to preload sound files
function preloadSounds() {
  if (!navigator.serviceWorker.controller) {
    console.log('Service worker not yet active, skipping sound preloading');
    return;
  }
  
  // List of critical sound files to preload
  const criticalSounds = [
    '/sounds/win95/startup.mp3',
    '/sounds/win95/error.mp3',
    '/sounds/win95/notify.mp3',
    '/sounds/win95/click.mp3',
    '/sounds/duck-hunt/shot.mp3',
    '/sounds/duck-hunt/quack.mp3',
    '/audio/gun-shot.mp3',
    '/audio/quack.mp3'
  ];
  
  // Preload each sound file
  criticalSounds.forEach(soundUrl => {
    fetch(soundUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to preload sound: ${soundUrl}`);
        }
        console.log(`Preloaded sound: ${soundUrl}`);
      })
      .catch(error => {
        console.warn(`Error preloading sound ${soundUrl}:`, error);
      });
  });
}

// Preload sounds after service worker is active
navigator.serviceWorker.ready.then(preloadSounds);

// Check if the app is installed or in standalone mode
window.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('App is running in standalone mode');
    // You could customize the UI for installed app here
  }
});



/* ===== performance-monitor.js ===== */
// Performance Monitoring Module
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: {},
            resources: [],
            errors: [],
            fpMetrics: {},
            cacheStatus: {
                hits: 0,
                misses: 0
            }
        };
        
        this.init();
    }

    init() {
        // Initialize all monitoring systems
        this.observeNavigationTiming();
        this.observeResourceTiming();
        this.observeErrors();
        this.observePaintTiming();
        this.setupNetworkObserver();
        this.observeCacheStatus();
    }

    // Monitor navigation timing
    observeNavigationTiming() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.navigation = {
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart,
                domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.startTime
            };
            
            this.reportMetrics('navigation', this.metrics.navigation);
        });
    }

    // Monitor resource timing
    observeResourceTiming() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                const resourceMetric = {
                    name: entry.name,
                    type: entry.initiatorType,
                    size: entry.transferSize,
                    duration: entry.duration,
                    timestamp: Date.now()
                };
                
                this.metrics.resources.push(resourceMetric);
                this.reportMetrics('resource', resourceMetric);
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    // Monitor errors
    observeErrors() {
        window.addEventListener('error', (event) => {
            const errorMetric = {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                timestamp: Date.now()
            };
            
            this.metrics.errors.push(errorMetric);
            this.reportMetrics('error', errorMetric);
        });

        window.addEventListener('unhandledrejection', (event) => {
            const errorMetric = {
                message: event.reason,
                type: 'Promise',
                timestamp: Date.now()
            };
            
            this.metrics.errors.push(errorMetric);
            this.reportMetrics('error', errorMetric);
        });
    }

    // Monitor paint timing
    observePaintTiming() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.metrics.fpMetrics[entry.name] = entry.startTime;
                this.reportMetrics('paint', {
                    name: entry.name,
                    time: entry.startTime
                });
            });
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }

    // Monitor network status
    setupNetworkObserver() {
        window.addEventListener('online', () => {
            this.reportMetrics('network', { status: 'online', timestamp: Date.now() });
        });

        window.addEventListener('offline', () => {
            this.reportMetrics('network', { status: 'offline', timestamp: Date.now() });
        });
    }

    // Monitor cache performance
    observeCacheStatus() {
        if ('caches' in window) {
            // Intercept cache access through service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'CACHE_HIT') {
                    this.metrics.cacheStatus.hits++;
                } else if (event.data.type === 'CACHE_MISS') {
                    this.metrics.cacheStatus.misses++;
                }
                
                this.reportMetrics('cache', this.metrics.cacheStatus);
            });
        }
    }

    // Report metrics to analytics
    reportMetrics(type, data) {
        // Add Windows 95 theme info
        data.theme = 'windows95';
        
        // Add to debug console if enabled
        if (localStorage.getItem('debugMode') === 'true') {
            console.debug(`[Performance ${type}]`, data);
        }

        // Send to analytics endpoint
        fetch('/api/analytics/performance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                data,
                timestamp: Date.now(),
                page: window.location.pathname
            }),
            // Use keepalive to ensure data is sent even if page is unloading
            keepalive: true
        }).catch(error => {
            console.warn('Failed to report metrics:', error);
            // Store failed reports for retry
            this.storeFailedReport(type, data);
        });
    }

    // Store failed reports for retry
    storeFailedReport(type, data) {
        const failedReports = JSON.parse(localStorage.getItem('failedReports') || '[]');
        failedReports.push({
            type,
            data,
            timestamp: Date.now()
        });
        localStorage.setItem('failedReports', JSON.stringify(failedReports));
    }

    // Retry failed reports
    retryFailedReports() {
        const failedReports = JSON.parse(localStorage.getItem('failedReports') || '[]');
        if (failedReports.length === 0) return;

        failedReports.forEach(report => {
            this.reportMetrics(report.type, report.data);
        });

        localStorage.removeItem('failedReports');
    }

    // Get current performance summary
    getPerformanceSummary() {
        return {
            navigation: this.metrics.navigation,
            resourceCount: this.metrics.resources.length,
            errorCount: this.metrics.errors.length,
            cacheEfficiency: this.calculateCacheEfficiency(),
            paintTiming: this.metrics.fpMetrics,
            lastUpdate: Date.now()
        };
    }

    // Calculate cache efficiency
    calculateCacheEfficiency() {
        const total = this.metrics.cacheStatus.hits + this.metrics.cacheStatus.misses;
        if (total === 0) return 0;
        return (this.metrics.cacheStatus.hits / total) * 100;
    }

    // Clear metrics history
    clearMetrics() {
        this.metrics = {
            navigation: {},
            resources: [],
            errors: [],
            fpMetrics: {},
            cacheStatus: {
                hits: 0,
                misses: 0
            }
        };
    }
}

// Initialize and export instance
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;

// Retry failed reports when coming online
window.addEventListener('online', () => {
    performanceMonitor.retryFailedReports();
});

