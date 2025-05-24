// Notepad
function initNotepad() {
  const notepadWindow = document.getElementById('notepad-window');
  
  if (notepadWindow) {
    const textarea = notepadWindow.querySelector('.notepad-content');
    if (textarea) {
      // Set initial content
      textarea.value = 'Welcome to NosytOS95!\n\n' +
        'This is a development version of NosytOS95, a Windows 95-inspired interface for the NosytLabs website.\n\n' +
        'Currently Working Features:\n' +
        '- Notepad (this application)\n' +
        '- Basic window management\n' +
        '- Start menu (limited functionality)\n\n' +
        'Coming Soon:\n' +
        '- Duck Hunt game with sound effects\n' +
        '- Nosyt AI Assistant\n' +
        '- File browser\n' +
        '- More applications and games\n\n' +
        'Known Issues:\n' +
        '- Some applications may not open correctly\n' +
        '- Window resizing may be inconsistent\n' +
        '- Limited browser compatibility\n\n' +
        'Visit www.nosytlabs.com for more information about our services.\n\n' +
        'Thank you for your interest in our services!';
    }
  }
}

// Duck Hunt
function initDuckHunt() {
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  
  if (duckHuntWindow) {
    const canvas = duckHuntWindow.querySelector('.game-canvas');
    const startButton = duckHuntWindow.querySelector('.start-button');
    const soundToggle = duckHuntWindow.querySelector('.sound-toggle');
    const highScoreButton = duckHuntWindow.querySelector('.high-score-button');
    
    if (canvas && startButton) {
      const ctx = canvas.getContext('2d');
      let gameRunning = false;
      let score = 0;
      let ducks = [];
      let soundEnabled = true;
      let highScore = localStorage.getItem('duckHuntHighScore') || 0;
      
      // Sound effects
      const sounds = {
        shoot: new Audio('/sounds/duck-hunt/shot.mp3'),
        quack: new Audio('/sounds/duck-hunt/quack.mp3'),
        fall: new Audio('/sounds/duck-hunt/fall.mp3')
      };
      
      // Toggle sound
      if (soundToggle) {
        soundToggle.addEventListener('click', function() {
          soundEnabled = !soundEnabled;
          this.textContent = soundEnabled ? '🔊' : '🔇';
        });
      }
      
      // Show high score
      if (highScoreButton) {
        highScoreButton.addEventListener('click', function() {
          alert('High Score: ' + highScore);
        });
      }
      
      // Draw sky background
      function drawBackground() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Draw grass
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
      }
      
      // Draw score
      function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '16px "MS Sans Serif"';
        ctx.fillText('Score: ' + score, 10, 20);
        ctx.fillText('High Score: ' + highScore, 10, 40);
      }
      
      // Create a duck
      function createDuck() {
        return {
          x: Math.random() * (canvas.width - 30),
          y: canvas.height - 80,
          width: 30,
          height: 30,
          speedX: (Math.random() * 2) + 1,
          speedY: -((Math.random() * 2) + 1),
          color: '#8B4513',
          hit: false
        };
      }
      
      // Draw ducks
      function drawDucks() {
        ducks.forEach(duck => {
          if (!duck.hit) {
            // Draw duck body
            ctx.fillStyle = duck.color;
            ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
            
            // Draw wings
            ctx.fillStyle = '#000';
            const wingOffset = Math.sin(Date.now() / 100) * 5;
            ctx.fillRect(duck.x - 10, duck.y + 10 + wingOffset, 10, 5);
            ctx.fillRect(duck.x + duck.width, duck.y + 10 - wingOffset, 10, 5);
            
            // Draw head
            ctx.fillStyle = '#000';
            ctx.fillRect(duck.x + duck.width - 5, duck.y - 10, 10, 10);
            
            // Draw beak
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(duck.x + duck.width + 5, duck.y - 5, 5, 5);
          } else {
            // Draw falling duck
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
          }
        });
      }
      
      // Update duck positions
      function updateDucks() {
        ducks.forEach(duck => {
          if (!duck.hit) {
            duck.x += duck.speedX;
            duck.y += duck.speedY;
            
            // Bounce off walls
            if (duck.x <= 0 || duck.x + duck.width >= canvas.width) {
              duck.speedX *= -1;
            }
            
            // Bounce off ceiling
            if (duck.y <= 0) {
              duck.speedY *= -1;
            }
            
            // Bounce off ground
            if (duck.y + duck.height >= canvas.height - 50) {
              duck.speedY *= -1;
            }
          } else {
            // Hit duck falls
            duck.speedY = 2;
            duck.y += duck.speedY;
          }
        });
        
        // Remove ducks that have fallen off screen
        ducks = ducks.filter(duck => !(duck.hit && duck.y > canvas.height));
        
        // Add new ducks if needed
        if (ducks.length < 3 && gameRunning) {
          ducks.push(createDuck());
          if (soundEnabled) {
            sounds.quack.currentTime = 0;
            sounds.quack.play().catch(e => console.log('Error playing sound:', e));
          }
        }
      }
      
      // Game loop
      function gameLoop() {
        if (!gameRunning) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        drawBackground();
        
        // Update and draw ducks
        updateDucks();
        drawDucks();
        
        // Draw score
        drawScore();
        
        // Continue loop
        requestAnimationFrame(gameLoop);
      }
      
      // Start game
      startButton.addEventListener('click', function() {
        gameRunning = true;
        score = 0;
        ducks = [createDuck(), createDuck(), createDuck()];
        gameLoop();
      });
      
      // Shoot on canvas click
      canvas.addEventListener('click', function(e) {
        if (!gameRunning) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Play shoot sound
        if (soundEnabled) {
          sounds.shoot.currentTime = 0;
          sounds.shoot.play().catch(e => console.log('Error playing sound:', e));
        }
        
        // Check for hits
        let hit = false;
        ducks.forEach(duck => {
          if (!duck.hit && 
              x >= duck.x && x <= duck.x + duck.width &&
              y >= duck.y && y <= duck.y + duck.height) {
            duck.hit = true;
            score += 10;
            hit = true;
            
            // Update high score
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('duckHuntHighScore', highScore);
            }
            
            // Play fall sound
            if (soundEnabled) {
              sounds.fall.currentTime = 0;
              sounds.fall.play().catch(e => console.log('Error playing sound:', e));
            }
          }
        });
      });
      
      // Initial draw
      drawBackground();
      ctx.fillStyle = '#000';
      ctx.font = '20px "MS Sans Serif"';
      ctx.fillText('Click Start to begin', canvas.width / 2 - 80, canvas.height / 2);
    }
  }
}
