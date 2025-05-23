/**
 * NosytOS95 Sound Manager
 * Handles sound effects for the NosytOS95 interface
 */

// Sound effects
const soundEffects = {
  startup: '/sounds/nosytos95/startup.mp3',
  error: '/sounds/nosytos95/error.mp3',
  notify: '/sounds/nosytos95/notify.mp3',
  maximize: '/sounds/nosytos95/maximize.mp3',
  minimize: '/sounds/nosytos95/minimize.mp3',
  restore: '/sounds/nosytos95/restore.mp3',
  close: '/sounds/nosytos95/close.mp3',
  click: '/sounds/nosytos95/click.mp3',
  menuOpen: '/sounds/nosytos95/menu-open.mp3',
  menuClose: '/sounds/nosytos95/menu-close.mp3',
  duckHuntShot: '/sounds/nosytos95/duck-hunt/shot.mp3',
  duckHuntFall: '/sounds/nosytos95/duck-hunt/fall.mp3',
  duckHuntLaugh: '/sounds/nosytos95/duck-hunt/laugh.mp3',
  duckHuntBark: '/sounds/nosytos95/duck-hunt/bark.mp3',
  duckHuntQuack: '/sounds/nosytos95/duck-hunt/quack.mp3',
  duckHuntRound: '/sounds/nosytos95/duck-hunt/round.mp3',
  duckHuntGameOver: '/sounds/nosytos95/duck-hunt/game-over.mp3'
};

// Audio elements cache
const audioElements = {};

// Sound enabled flag
let soundEnabled = true;

// Initialize sound manager
function initSoundManager() {
  // Create audio elements for each sound effect
  for (const [name, src] of Object.entries(soundEffects)) {
    const audio = new Audio();
    audio.src = src;
    audio.preload = 'auto';
    audioElements[name] = audio;
  }
  
  // Check if sound is enabled in localStorage
  const storedSoundEnabled = localStorage.getItem('nosytos95_sound_enabled');
  if (storedSoundEnabled !== null) {
    soundEnabled = storedSoundEnabled === 'true';
  }
  
  // Add sound toggle to system tray
  addSoundToggleToSystemTray();
  
  // Play startup sound
  if (soundEnabled) {
    setTimeout(() => {
      playSound('startup');
    }, 1000);
  }
}

// Add sound toggle to system tray
function addSoundToggleToSystemTray() {
  const systemTray = document.querySelector('.system-tray');
  if (!systemTray) return;
  
  // Create sound toggle icon
  const soundToggle = document.createElement('img');
  soundToggle.className = 'system-tray-icon';
  soundToggle.title = soundEnabled ? 'Sound: On (Click to mute)' : 'Sound: Off (Click to unmute)';
  soundToggle.src = soundEnabled ? '/images/win95/sound-on.png' : '/images/win95/sound-off.png';
  
  // Add click event to toggle sound
  soundToggle.addEventListener('click', () => {
    toggleSound();
    soundToggle.title = soundEnabled ? 'Sound: On (Click to mute)' : 'Sound: Off (Click to unmute)';
    soundToggle.src = soundEnabled ? '/images/win95/sound-on.png' : '/images/win95/sound-off.png';
  });
  
  // Add to system tray before the clock
  const clock = systemTray.querySelector('.clock');
  if (clock) {
    systemTray.insertBefore(soundToggle, clock);
  } else {
    systemTray.appendChild(soundToggle);
  }
}

// Toggle sound
function toggleSound() {
  soundEnabled = !soundEnabled;
  
  // Save to localStorage
  localStorage.setItem('nosytos95_sound_enabled', soundEnabled);
  
  // Play sound effect
  if (soundEnabled) {
    playSound('click');
  }
}

// Play sound effect
function playSound(name) {
  if (!soundEnabled) return;
  
  const audio = audioElements[name];
  if (audio) {
    // Reset audio to beginning
    audio.currentTime = 0;
    
    // Play audio
    audio.play().catch(error => {
      console.error(`Error playing sound ${name}:`, error);
    });
  }
}

// Play sound effect (global function)
function playSoundEffect(name) {
  playSound(name);
}

// Initialize sound manager
document.addEventListener('DOMContentLoaded', initSoundManager);

// Make functions available globally
window.playSoundEffect = playSoundEffect;
window.toggleSound = toggleSound;
