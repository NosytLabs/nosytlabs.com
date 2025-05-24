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
