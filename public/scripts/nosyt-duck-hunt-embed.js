/**
 * Duck Hunt Embed
 *
 * This file contains the code for embedding the Duck Hunt game
 * from duckhuntjs.com in a NosytOS95 window.
 */

// Duck Hunt window configuration
const DUCK_HUNT_CONFIG = {
  title: 'Duck Hunt',
  icon: '/images/win95/icons/duck-hunt.png',
  width: 800,
  height: 600,
  resizable: true,
  maximizable: true,
  minimizable: true,
  closable: true,
  centered: true,
  defaultPosition: { x: 50, y: 50 }
};

/**
 * Create Duck Hunt window
 */
function createDuckHuntWindow() {
  // Check if window already exists
  if (WindowManager.getWindowByTitle(DUCK_HUNT_CONFIG.title)) {
    WindowManager.focusWindow(WindowManager.getWindowByTitle(DUCK_HUNT_CONFIG.title));
    return;
  }

  // Play startup sound
  SoundManager.playSound('startup');

  // Create window
  const duckHuntWindow = WindowManager.createWindow({
    title: DUCK_HUNT_CONFIG.title,
    icon: DUCK_HUNT_CONFIG.icon,
    width: DUCK_HUNT_CONFIG.width,
    height: DUCK_HUNT_CONFIG.height,
    resizable: DUCK_HUNT_CONFIG.resizable,
    maximizable: DUCK_HUNT_CONFIG.maximizable,
    minimizable: DUCK_HUNT_CONFIG.minimizable,
    closable: DUCK_HUNT_CONFIG.closable,
    centered: DUCK_HUNT_CONFIG.centered,
    defaultPosition: DUCK_HUNT_CONFIG.defaultPosition
  });

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'duck-hunt-container';
  contentContainer.style.width = '100%';
  contentContainer.style.height = '100%';
  contentContainer.style.overflow = 'hidden';
  contentContainer.style.backgroundColor = '#87CEEB'; // Sky blue background

  // Create loading message
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'duck-hunt-loading';
  loadingMessage.textContent = 'Loading Duck Hunt...';
  loadingMessage.style.position = 'absolute';
  loadingMessage.style.top = '50%';
  loadingMessage.style.left = '50%';
  loadingMessage.style.transform = 'translate(-50%, -50%)';
  loadingMessage.style.color = '#000';
  loadingMessage.style.fontFamily = 'MS Sans Serif, sans-serif';
  loadingMessage.style.fontSize = '16px';
  loadingMessage.style.fontWeight = 'bold';
  loadingMessage.style.zIndex = '10';

  // Create iframe for Duck Hunt
  const iframe = document.createElement('iframe');
  iframe.src = 'https://duckhuntjs.com/';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.position = 'relative';
  iframe.style.zIndex = '5';

  // Add loading event listeners
  iframe.addEventListener('load', () => {
    // Hide loading message when iframe is loaded
    loadingMessage.style.display = 'none';

    // Play game start sound
    SoundManager.playSound('gameStart');
  });

  // Add error event listener
  iframe.addEventListener('error', () => {
    loadingMessage.textContent = 'Error loading Duck Hunt. Please try again.';
    loadingMessage.style.color = 'red';
  });

  // Create control bar
  const controlBar = document.createElement('div');
  controlBar.className = 'duck-hunt-controls';
  controlBar.style.position = 'absolute';
  controlBar.style.bottom = '0';
  controlBar.style.left = '0';
  controlBar.style.width = '100%';
  controlBar.style.height = '30px';
  controlBar.style.backgroundColor = '#C0C0C0';
  controlBar.style.borderTop = '1px solid #000';
  controlBar.style.display = 'flex';
  controlBar.style.alignItems = 'center';
  controlBar.style.padding = '0 10px';
  controlBar.style.zIndex = '15';

  // Create high score display
  const highScoreDisplay = document.createElement('div');
  highScoreDisplay.className = 'duck-hunt-high-score';
  highScoreDisplay.textContent = 'High Score: 0';
  highScoreDisplay.style.marginRight = 'auto';
  highScoreDisplay.style.fontFamily = 'MS Sans Serif, sans-serif';
  highScoreDisplay.style.fontSize = '12px';
  highScoreDisplay.style.fontWeight = 'bold';

  // Load high score from localStorage
  const savedHighScore = localStorage.getItem('duckHuntHighScore');
  if (savedHighScore) {
    highScoreDisplay.textContent = `High Score: ${savedHighScore}`;
  }

  // Create mute button
  const muteButton = document.createElement('button');
  muteButton.className = 'duck-hunt-mute-button win95-button';
  muteButton.textContent = 'Mute Sound';
  muteButton.style.marginRight = '10px';
  muteButton.style.padding = '2px 5px';
  muteButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  muteButton.style.fontSize = '12px';
  muteButton.style.cursor = 'pointer';

  // Check if sound was previously muted
  let isMuted = localStorage.getItem('duckHuntMuted') === 'true';
  if (isMuted) {
    muteButton.textContent = 'Unmute Sound';
  }

  // Add mute button event listener
  muteButton.addEventListener('click', () => {
    isMuted = !isMuted;

    // Update button text
    muteButton.textContent = isMuted ? 'Unmute Sound' : 'Mute Sound';

    // Save preference to localStorage
    localStorage.setItem('duckHuntMuted', isMuted.toString());

    // Play click sound
    SoundManager.playSound('click');

    // Mute/unmute iframe
    try {
      if (iframe.contentWindow) {
        // Try to access iframe content and mute/unmute
        // Note: This may not work due to cross-origin restrictions
        iframe.contentWindow.postMessage({ action: isMuted ? 'mute' : 'unmute' }, 'https://duckhuntjs.com');
      }
    } catch (error) {
      console.warn('Could not access iframe content:', error);
    }
  });

  // Create volume control
  const volumeControl = document.createElement('div');
  volumeControl.className = 'duck-hunt-volume-control';
  volumeControl.style.display = 'flex';
  volumeControl.style.alignItems = 'center';
  volumeControl.style.marginRight = '10px';

  const volumeLabel = document.createElement('span');
  volumeLabel.textContent = 'Volume: ';
  volumeLabel.style.fontFamily = 'MS Sans Serif, sans-serif';
  volumeLabel.style.fontSize = '12px';
  volumeLabel.style.marginRight = '5px';

  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.min = '0';
  volumeSlider.max = '100';
  volumeSlider.value = localStorage.getItem('duckHuntVolume') || '100';
  volumeSlider.style.width = '80px';

  // Add volume slider event listener
  volumeSlider.addEventListener('input', () => {
    // Save preference to localStorage
    localStorage.setItem('duckHuntVolume', volumeSlider.value);

    // Try to set volume in iframe
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          action: 'setVolume',
          volume: parseInt(volumeSlider.value) / 100
        }, 'https://duckhuntjs.com');
      }
    } catch (error) {
      console.warn('Could not access iframe content:', error);
    }
  });

  volumeControl.appendChild(volumeLabel);
  volumeControl.appendChild(volumeSlider);

  // Create fullscreen button
  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'duck-hunt-fullscreen-button win95-button';
  fullscreenButton.textContent = 'Fullscreen';
  fullscreenButton.style.marginRight = '10px';
  fullscreenButton.style.padding = '2px 5px';
  fullscreenButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  fullscreenButton.style.fontSize = '12px';
  fullscreenButton.style.cursor = 'pointer';

  // Add fullscreen button event listener
  fullscreenButton.addEventListener('click', () => {
    // Play click sound
    SoundManager.playSound('click');

    // Toggle fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullscreenButton.textContent = 'Fullscreen';
    } else {
      duckHuntWindow.requestFullscreen();
      fullscreenButton.textContent = 'Exit Fullscreen';
    }
  });

  // Create restart button
  const restartButton = document.createElement('button');
  restartButton.className = 'duck-hunt-restart-button win95-button';
  restartButton.textContent = 'Restart Game';
  restartButton.style.padding = '2px 5px';
  restartButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  restartButton.style.fontSize = '12px';
  restartButton.style.cursor = 'pointer';

  // Add restart button event listener
  restartButton.addEventListener('click', () => {
    // Play click sound
    SoundManager.playSound('click');

    // Reload iframe
    loadingMessage.style.display = 'block';
    iframe.src = iframe.src;
  });

  // Add elements to control bar
  controlBar.appendChild(highScoreDisplay);
  controlBar.appendChild(volumeControl);
  controlBar.appendChild(muteButton);
  controlBar.appendChild(fullscreenButton);
  controlBar.appendChild(restartButton);

  // Add elements to content container
  contentContainer.appendChild(loadingMessage);
  contentContainer.appendChild(iframe);
  contentContainer.appendChild(controlBar);

  // Add content to window
  duckHuntWindow.content.appendChild(contentContainer);

  // Set up message listener for high score updates
  window.addEventListener('message', (event) => {
    // Verify the message is from duckhuntjs.com
    if (event.origin === 'https://duckhuntjs.com') {
      try {
        // Check if the message contains a score
        if (event.data && event.data.action === 'score' && event.data.score) {
          const score = parseInt(event.data.score);
          const currentHighScore = parseInt(localStorage.getItem('duckHuntHighScore') || '0');

          // Update high score if the new score is higher
          if (score > currentHighScore) {
            localStorage.setItem('duckHuntHighScore', score.toString());
            highScoreDisplay.textContent = `High Score: ${score}`;

            // Show high score popup
            showHighScorePopup(score);
          }
        }
      } catch (error) {
        console.warn('Error processing message from iframe:', error);
      }
    }
  });

  // Focus window
  WindowManager.focusWindow(duckHuntWindow);

  return duckHuntWindow;
}

/**
 * Show high score popup
 * @param {number} score - The new high score
 */
function showHighScorePopup(score) {
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'duck-hunt-high-score-popup';

  // Style popup
  Object.assign(popup.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#C0C0C0',
    border: '2px solid #000',
    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    textAlign: 'center',
    zIndex: '1000',
    fontFamily: 'MS Sans Serif, sans-serif',
    minWidth: '250px'
  });

  // Create popup content
  popup.innerHTML = `
    <h2 style="margin-top: 0; color: #000080;">New High Score!</h2>
    <p style="font-size: 24px; font-weight: bold; margin: 20px 0;">${score}</p>
    <p>Congratulations on your new high score!</p>
    <button class="win95-button" style="padding: 5px 10px; margin-top: 10px;">OK</button>
  `;

  // Add popup to body
  document.body.appendChild(popup);

  // Add click handler to OK button
  const okButton = popup.querySelector('button');
  okButton.addEventListener('click', () => {
    // Play click sound
    SoundManager.playSound('click');

    // Remove popup
    document.body.removeChild(popup);
  });

  // Play sound
  SoundManager.playSound('levelUp');
}

// Register Duck Hunt in the Start Menu
if (typeof StartMenu !== 'undefined') {
  StartMenu.registerApp({
    name: 'Duck Hunt',
    icon: '/images/win95/icons/duck-hunt.png',
    category: 'Games',
    onClick: createDuckHuntWindow
  });
}

// Register Duck Hunt as a desktop icon
if (typeof DesktopIcons !== 'undefined') {
  DesktopIcons.registerIcon({
    name: 'Duck Hunt',
    icon: '/images/win95/icons/duck-hunt.png',
    onClick: createDuckHuntWindow
  });
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createDuckHuntWindow };
} else if (typeof window !== 'undefined') {
  window.createDuckHuntWindow = createDuckHuntWindow;
}
