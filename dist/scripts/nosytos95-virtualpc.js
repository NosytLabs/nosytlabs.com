// Virtual PC Application
function initVirtualPC() {
  const virtualPCWindow = document.getElementById('virtual-pc-window');
  
  if (virtualPCWindow) {
    // Create game list
    createGameList();
    
    // Handle game selection
    const gameButtons = virtualPCWindow.querySelectorAll('.game-button');
    gameButtons.forEach(button => {
      button.addEventListener('click', function() {
        const game = this.getAttribute('data-game');
        launchGame(game);
      });
    });
    
    // Create game list
    function createGameList() {
      const gameListContainer = virtualPCWindow.querySelector('.game-list');
      if (!gameListContainer) return;
      
      // Clear existing content
      gameListContainer.innerHTML = '';
      
      // Add header
      const header = document.createElement('div');
      header.className = 'game-list-header';
      header.innerHTML = `
        <div class="game-list-title">Virtual PC</div>
        <div class="game-list-subtitle">9 PROGRAMS AVAILABLE</div>
      `;
      gameListContainer.appendChild(header);
      
      // Add games
      const games = [
        { id: 'doom', name: 'Doom', icon: '/images/win95/games/doom.png' },
        { id: 'simcity', name: 'SimCity 2000', icon: '/images/win95/games/simcity.png' },
        { id: 'mario', name: 'Mario & Luigi', icon: '/images/win95/games/mario.png' },
        { id: 'aoe', name: 'Age of Empires', icon: '/images/win95/games/aoe.png' },
        { id: 'aoe2', name: 'Age of Empires II', icon: '/images/win95/games/aoe2.png' },
        { id: 'prince', name: 'Prince of Persia', icon: '/images/win95/games/prince.png' },
        { id: 'aladdin', name: 'Aladdin', icon: '/images/win95/games/aladdin.png' },
        { id: 'oregon', name: 'The Oregon Trail', icon: '/images/win95/games/oregon.png' },
        { id: 'command', name: 'Command & Conquer', icon: '/images/win95/games/command.png' }
      ];
      
      const gameGrid = document.createElement('div');
      gameGrid.className = 'game-grid';
      
      games.forEach(game => {
        const gameButton = document.createElement('button');
        gameButton.className = 'game-button';
        gameButton.setAttribute('data-game', game.id);
        
        gameButton.innerHTML = `
          <div class="game-icon">
            <img src="${game.icon}" alt="${game.name}">
            <div class="game-name">${game.name}</div>
          </div>
        `;
        
        gameGrid.appendChild(gameButton);
      });
      
      gameListContainer.appendChild(gameGrid);
    }
    
    // Launch game
    function launchGame(game) {
      // Create game window if it doesn't exist
      let gameWindow = document.getElementById(`${game}-window`);
      
      if (!gameWindow) {
        gameWindow = document.createElement('div');
        gameWindow.id = `${game}-window`;
        gameWindow.className = 'win95-window game-window';
        gameWindow.style.display = 'none';
        gameWindow.style.width = '640px';
        gameWindow.style.height = '480px';
        gameWindow.style.left = '50%';
        gameWindow.style.top = '50%';
        gameWindow.style.transform = 'translate(-50%, -50%)';
        
        // Get game info
        const gameInfo = getGameInfo(game);
        
        // Create window content
        gameWindow.innerHTML = `
          <div class="window-header">
            <div class="window-title">
              <img src="${gameInfo.icon}" alt="${gameInfo.name}" class="window-icon">
              <span>${gameInfo.name}</span>
            </div>
            <div class="window-controls">
              <button class="window-minimize" title="Minimize">_</button>
              <button class="window-maximize" title="Maximize">□</button>
              <button class="window-close" title="Close">×</button>
            </div>
          </div>
          <div class="window-menu">
            <div class="menu-item">File</div>
            <div class="menu-item">Controls</div>
            <div class="menu-item">Help</div>
          </div>
          <div class="window-content game-content">
            <div class="game-loading">Loading ${gameInfo.name}...</div>
            <div class="game-frame" style="display: none;">
              <iframe src="${gameInfo.url}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="game-controls">
              <button class="game-fullscreen">Fullscreen</button>
              <button class="game-restart">Restart</button>
              <button class="game-mute">Mute</button>
            </div>
          </div>
          <div class="window-statusbar">
            <span>Ready</span>
          </div>
          <div class="resize-handle resize-handle-se"></div>
          <div class="resize-handle resize-handle-e"></div>
          <div class="resize-handle resize-handle-s"></div>
          <div class="resize-handle resize-handle-sw"></div>
          <div class="resize-handle resize-handle-n"></div>
          <div class="resize-handle resize-handle-w"></div>
          <div class="resize-handle resize-handle-ne"></div>
          <div class="resize-handle resize-handle-nw"></div>
        `;
        
        // Add to windows container
        document.querySelector('.windows-container').appendChild(gameWindow);
        
        // Initialize window management
        initWindowManagement();
        
        // Show game after loading
        setTimeout(() => {
          const loadingEl = gameWindow.querySelector('.game-loading');
          const frameEl = gameWindow.querySelector('.game-frame');
          
          if (loadingEl) loadingEl.style.display = 'none';
          if (frameEl) frameEl.style.display = 'block';
        }, 2000);
        
        // Handle game controls
        const fullscreenBtn = gameWindow.querySelector('.game-fullscreen');
        const restartBtn = gameWindow.querySelector('.game-restart');
        const muteBtn = gameWindow.querySelector('.game-mute');
        
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener('click', function() {
            const iframe = gameWindow.querySelector('iframe');
            if (iframe) {
              if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
              } else if (iframe.webkitRequestFullscreen) {
                iframe.webkitRequestFullscreen();
              } else if (iframe.msRequestFullscreen) {
                iframe.msRequestFullscreen();
              }
            }
          });
        }
        
        if (restartBtn) {
          restartBtn.addEventListener('click', function() {
            const iframe = gameWindow.querySelector('iframe');
            if (iframe) {
              iframe.src = iframe.src;
            }
          });
        }
        
        if (muteBtn) {
          muteBtn.addEventListener('click', function() {
            const iframe = gameWindow.querySelector('iframe');
            if (iframe) {
              iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
              this.textContent = this.textContent === 'Mute' ? 'Unmute' : 'Mute';
            }
          });
        }
      }
      
      // Show game window
      gameWindow.style.display = 'flex';
      bringToFront(gameWindow);
      updateTaskbar();
    }
    
    // Get game info
    function getGameInfo(game) {
      const games = {
        doom: {
          name: 'Doom',
          icon: '/images/win95/games/doom.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fdoom.jsdos?anonymous=1'
        },
        simcity: {
          name: 'SimCity 2000',
          icon: '/images/win95/games/simcity.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fsimcity2000.jsdos?anonymous=1'
        },
        mario: {
          name: 'Mario & Luigi',
          icon: '/images/win95/games/mario.png',
          url: 'https://www.retrogames.cc/embed/21929-super-mario-bros-japan-usa.html'
        },
        aoe: {
          name: 'Age of Empires',
          icon: '/images/win95/games/aoe.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Faoe.jsdos?anonymous=1'
        },
        aoe2: {
          name: 'Age of Empires II',
          icon: '/images/win95/games/aoe2.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Faoe2.jsdos?anonymous=1'
        },
        prince: {
          name: 'Prince of Persia',
          icon: '/images/win95/games/prince.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fprince.jsdos?anonymous=1'
        },
        aladdin: {
          name: 'Aladdin',
          icon: '/images/win95/games/aladdin.png',
          url: 'https://www.retrogames.cc/embed/16841-disney-s-aladdin-usa.html'
        },
        oregon: {
          name: 'The Oregon Trail',
          icon: '/images/win95/games/oregon.png',
          url: 'https://archive.org/embed/msdos_Oregon_Trail_The_1990'
        },
        command: {
          name: 'Command & Conquer',
          icon: '/images/win95/games/command.png',
          url: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fcommand.jsdos?anonymous=1'
        }
      };
      
      return games[game] || { 
        name: 'Unknown Game', 
        icon: '/images/win95/games/default.png',
        url: 'about:blank'
      };
    }
  }
}
