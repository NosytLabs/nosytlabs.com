// Soundboard Application
function initSoundboard() {
  const soundboardWindow = document.getElementById('soundboard-window');
  
  if (soundboardWindow) {
    // Create soundboard interface
    createSoundboardInterface();
    
    // Initialize soundboard functionality
    initSoundboardFunctionality();
    
    // Create soundboard interface
    function createSoundboardInterface() {
      const soundboardContent = soundboardWindow.querySelector('.window-content');
      if (!soundboardContent) return;
      
      // Clear existing content
      soundboardContent.innerHTML = '';
      
      // Create soundboard layout
      soundboardContent.innerHTML = `
        <div class="soundboard-container">
          <div class="soundboard-header">
            <h2>NosytOS95 Soundboard</h2>
            <div class="volume-control">
              <label for="volume">Volume:</label>
              <input type="range" id="volume" min="0" max="100" value="50">
              <span class="volume-value">50%</span>
            </div>
          </div>
          <div class="soundboard-categories">
            <button class="category-button active" data-category="windows">Windows</button>
            <button class="category-button" data-category="effects">Sound Effects</button>
            <button class="category-button" data-category="memes">Meme Sounds</button>
            <button class="category-button" data-category="music">Music</button>
          </div>
          <div class="soundboard-grid">
            <!-- Sound buttons will be added here -->
          </div>
          <div class="soundboard-controls">
            <button class="stop-all-button">Stop All Sounds</button>
            <div class="now-playing">
              <span>Now Playing: </span>
              <span class="current-sound">None</span>
            </div>
          </div>
        </div>
      `;
      
      // Load initial category
      loadSoundCategory('windows');
    }
    
    // Initialize soundboard functionality
    function initSoundboardFunctionality() {
      // Volume control
      const volumeSlider = soundboardWindow.querySelector('#volume');
      const volumeValue = soundboardWindow.querySelector('.volume-value');
      
      if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', function() {
          const volume = this.value;
          volumeValue.textContent = `${volume}%`;
          
          // Update all audio elements
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            audio.volume = volume / 100;
          });
        });
      }
      
      // Category buttons
      const categoryButtons = soundboardWindow.querySelectorAll('.category-button');
      categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Update active button
          categoryButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Load category
          const category = this.getAttribute('data-category');
          loadSoundCategory(category);
        });
      });
      
      // Stop all sounds button
      const stopAllButton = soundboardWindow.querySelector('.stop-all-button');
      if (stopAllButton) {
        stopAllButton.addEventListener('click', function() {
          stopAllSounds();
        });
      }
    }
    
    // Load sound category
    function loadSoundCategory(category) {
      const soundboardGrid = soundboardWindow.querySelector('.soundboard-grid');
      if (!soundboardGrid) return;
      
      // Clear existing buttons
      soundboardGrid.innerHTML = '';
      
      // Get sounds for category
      const sounds = getSoundsByCategory(category);
      
      // Create buttons
      sounds.forEach(sound => {
        const button = document.createElement('button');
        button.className = 'sound-button';
        button.setAttribute('data-sound', sound.file);
        
        button.innerHTML = `
          <div class="sound-icon">
            <img src="${sound.icon}" alt="${sound.name}">
          </div>
          <div class="sound-name">${sound.name}</div>
        `;
        
        button.addEventListener('click', function() {
          playSound(sound.file, sound.name);
        });
        
        soundboardGrid.appendChild(button);
      });
    }
    
    // Play sound
    function playSound(file, name) {
      // Stop all sounds first
      stopAllSounds();
      
      // Create audio element
      const audio = new Audio(`/sounds/soundboard/${file}`);
      audio.volume = parseInt(soundboardWindow.querySelector('#volume').value) / 100;
      
      // Play sound
      audio.play().catch(error => {
        console.error('Error playing sound:', error);
      });
      
      // Update now playing
      const currentSound = soundboardWindow.querySelector('.current-sound');
      if (currentSound) {
        currentSound.textContent = name;
      }
      
      // Reset when done
      audio.onended = function() {
        if (currentSound && currentSound.textContent === name) {
          currentSound.textContent = 'None';
        }
      };
    }
    
    // Stop all sounds
    function stopAllSounds() {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      
      // Reset now playing
      const currentSound = soundboardWindow.querySelector('.current-sound');
      if (currentSound) {
        currentSound.textContent = 'None';
      }
    }
    
    // Get sounds by category
    function getSoundsByCategory(category) {
      const sounds = {
        windows: [
          { name: 'Windows 95 Startup', file: 'win95-startup.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Shutdown', file: 'win95-shutdown.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Error', file: 'win95-error.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Ding', file: 'win95-ding.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Logon', file: 'win95-logon.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Logoff', file: 'win95-logoff.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Critical Stop', file: 'win95-critical.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Chimes', file: 'win95-chimes.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Tada', file: 'win95-tada.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Recycle', file: 'win95-recycle.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Menu Command', file: 'win95-menu.mp3', icon: '/images/win95/sound.png' },
          { name: 'Windows 95 Minimize', file: 'win95-minimize.mp3', icon: '/images/win95/sound.png' }
        ],
        effects: [
          { name: 'Typewriter', file: 'typewriter.mp3', icon: '/images/win95/sound.png' },
          { name: 'Dial-up Modem', file: 'dialup.mp3', icon: '/images/win95/sound.png' },
          { name: 'Fax Machine', file: 'fax.mp3', icon: '/images/win95/sound.png' },
          { name: 'Camera Shutter', file: 'camera.mp3', icon: '/images/win95/sound.png' },
          { name: 'Door Bell', file: 'doorbell.mp3', icon: '/images/win95/sound.png' },
          { name: 'Phone Ring', file: 'phone.mp3', icon: '/images/win95/sound.png' },
          { name: 'Alarm Clock', file: 'alarm.mp3', icon: '/images/win95/sound.png' },
          { name: 'Keyboard Typing', file: 'keyboard.mp3', icon: '/images/win95/sound.png' },
          { name: 'Mouse Click', file: 'click.mp3', icon: '/images/win95/sound.png' },
          { name: 'Printer', file: 'printer.mp3', icon: '/images/win95/sound.png' },
          { name: 'Scanner', file: 'scanner.mp3', icon: '/images/win95/sound.png' },
          { name: 'Floppy Disk', file: 'floppy.mp3', icon: '/images/win95/sound.png' }
        ],
        memes: [
          { name: 'Sad Trombone', file: 'sad-trombone.mp3', icon: '/images/win95/sound.png' },
          { name: 'Airhorn', file: 'airhorn.mp3', icon: '/images/win95/sound.png' },
          { name: 'Wow', file: 'wow.mp3', icon: '/images/win95/sound.png' },
          { name: 'Nope', file: 'nope.mp3', icon: '/images/win95/sound.png' },
          { name: 'Fail', file: 'fail.mp3', icon: '/images/win95/sound.png' },
          { name: 'Crickets', file: 'crickets.mp3', icon: '/images/win95/sound.png' },
          { name: 'Ba Dum Tss', file: 'badum.mp3', icon: '/images/win95/sound.png' },
          { name: 'Wilhelm Scream', file: 'wilhelm.mp3', icon: '/images/win95/sound.png' },
          { name: 'Inception Horn', file: 'inception.mp3', icon: '/images/win95/sound.png' },
          { name: 'Dramatic Chipmunk', file: 'dramatic.mp3', icon: '/images/win95/sound.png' },
          { name: 'Nyan Cat', file: 'nyan.mp3', icon: '/images/win95/sound.png' },
          { name: 'Never Gonna Give You Up', file: 'rickroll.mp3', icon: '/images/win95/sound.png' }
        ],
        music: [
          { name: 'Elevator Music', file: 'elevator.mp3', icon: '/images/win95/sound.png' },
          { name: 'Retro Game Music', file: 'retro-game.mp3', icon: '/images/win95/sound.png' },
          { name: 'Vaporwave', file: 'vaporwave.mp3', icon: '/images/win95/sound.png' },
          { name: '8-bit Music', file: '8bit.mp3', icon: '/images/win95/sound.png' },
          { name: 'Lofi Hip Hop', file: 'lofi.mp3', icon: '/images/win95/sound.png' },
          { name: 'Jazz', file: 'jazz.mp3', icon: '/images/win95/sound.png' },
          { name: 'Classical', file: 'classical.mp3', icon: '/images/win95/sound.png' },
          { name: 'Rock', file: 'rock.mp3', icon: '/images/win95/sound.png' },
          { name: 'Pop', file: 'pop.mp3', icon: '/images/win95/sound.png' },
          { name: 'Electronic', file: 'electronic.mp3', icon: '/images/win95/sound.png' },
          { name: 'Hip Hop', file: 'hiphop.mp3', icon: '/images/win95/sound.png' },
          { name: 'Country', file: 'country.mp3', icon: '/images/win95/sound.png' }
        ]
      };
      
      return sounds[category] || [];
    }
  }
}
