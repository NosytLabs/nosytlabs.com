/**
 * NosytOS95 Duck Hunt
 * An enhanced Duck Hunt game for the NosytOS95 interface
 * Features improved graphics, animations, sound effects, and high score tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // Game variables
  let gameActive = false;
  let score = 0;
  let highScore = 0;
  let round = 1;
  let ducksShot = 0;
  let ducksRequired = 6;
  let lives = 3;
  let soundEnabled = true;
  let ammo = 3;
  let totalShots = 0;
  let accuracy = 0;
  let dogState = 'hidden'; // hidden, pointing, laughing, jumping
  let dogAnimationFrame = 0;
  let dogX = 200;
  let dogY = 250;
  let showingMessage = false;
  let messageText = '';
  let messageTimer = 0;

  // Game elements
  let gameCanvas = null;
  let gameContext = null;
  let ducks = [];
  let highScores = [];

  // Images
  const images = {
    background: new Image(),
    duckBlue: new Image(),
    duckRed: new Image(),
    duckBlack: new Image(),
    dog: new Image(),
    crosshair: new Image()
  };

  // Load images
  images.background.src = '/images/nosytos95/duck-hunt/background.png';
  images.duckBlue.src = '/images/nosytos95/duck-hunt/duck-blue.png';
  images.duckRed.src = '/images/nosytos95/duck-hunt/duck-red.png';
  images.duckBlack.src = '/images/nosytos95/duck-hunt/duck-black.png';
  images.dog.src = '/images/nosytos95/duck-hunt/dog.png';
  images.crosshair.src = '/images/nosytos95/duck-hunt/crosshair.png';

  // Sounds
  const sounds = {
    quack: new Audio('/sounds/nosytos95/duck-hunt/quack.mp3'),
    shot: new Audio('/sounds/nosytos95/duck-hunt/shot.mp3'),
    hit: new Audio('/sounds/nosytos95/duck-hunt/hit.mp3'),
    miss: new Audio('/sounds/nosytos95/duck-hunt/miss.mp3'),
    roundClear: new Audio('/sounds/nosytos95/duck-hunt/round-clear.mp3'),
    gameOver: new Audio('/sounds/nosytos95/duck-hunt/game-over.mp3'),
    dogLaugh: new Audio('/sounds/nosytos95/duck-hunt/dog-laugh.mp3'),
    dogBark: new Audio('/sounds/nosytos95/duck-hunt/dog-bark.mp3'),
    reload: new Audio('/sounds/nosytos95/duck-hunt/reload.mp3'),
    emptyGun: new Audio('/sounds/nosytos95/duck-hunt/empty-gun.mp3'),
    duckFall: new Audio('/sounds/nosytos95/duck-hunt/duck-fall.mp3'),
    duckFlap: new Audio('/sounds/nosytos95/duck-hunt/duck-flap.mp3')
  };

  // Duck class
  class Duck {
    constructor(round) {
      // Position and size
      this.x = Math.random() * 400;
      this.y = Math.random() * 100 + 50;
      this.width = 60;
      this.height = 60;

      // Movement
      const baseSpeed = 1 + (round * 0.2);
      this.speedX = (Math.random() * baseSpeed + 1) * (Math.random() < 0.5 ? 1 : -1);
      this.speedY = (Math.random() * baseSpeed + 0.5) * (Math.random() < 0.5 ? 1 : -1);

      // State
      this.alive = true;
      this.falling = false;
      this.escaping = false;
      this.escapeTimer = 0;
      this.fallSpeed = 0;

      // Animation
      this.frameCount = 0;
      this.currentFrame = 0;
      this.frameDelay = Math.max(3, 8 - round); // Faster animation in higher rounds
      this.flapSound = false;

      // Duck type (blue, red, black) - higher rounds have more difficult ducks
      const duckTypes = ['blue', 'red', 'black'];
      const typeIndex = Math.min(Math.floor(Math.random() * (1 + round / 3)), 2);
      this.type = duckTypes[typeIndex];

      // Set image based on type
      switch (this.type) {
        case 'blue':
          this.image = images.duckBlue;
          this.points = 100;
          break;
        case 'red':
          this.image = images.duckRed;
          this.points = 200;
          break;
        case 'black':
          this.image = images.duckBlack;
          this.points = 300;
          break;
        default:
          this.image = images.duckBlue;
          this.points = 100;
      }
    }

    update() {
      // Play flap sound occasionally
      if (!this.falling && !this.escaping && Math.random() < 0.01 && !this.flapSound) {
        playSound('duckFlap');
        this.flapSound = true;
        setTimeout(() => { this.flapSound = false; }, 1000);
      }

      if (this.falling) {
        // Falling duck
        this.fallSpeed += 0.2;
        this.y += this.fallSpeed;

        // Remove duck when it falls off screen
        if (this.y > 300) {
          return false;
        }
      } else if (this.escaping) {
        // Escaping duck
        this.escapeTimer++;
        this.speedY = -3 - (round * 0.2);
        this.y += this.speedY;

        // Remove duck when it flies off screen
        if (this.y < -this.height) {
          return false;
        }
      } else {
        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x < 0 || this.x > 400 - this.width) {
          this.speedX *= -1;
        }

        if (this.y < 50 || this.y > 200) {
          this.speedY *= -1;
        }

        // Random direction changes
        if (Math.random() < 0.01) {
          this.speedY *= -1;
        }

        // Escape after some time
        if (Math.random() < 0.002 * round) {
          this.escaping = true;
          playSound('quack');
        }
      }

      // Animation
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;

        if (this.falling) {
          // No animation when falling
          this.currentFrame = 0;
        } else {
          // Cycle through frames
          this.currentFrame = (this.currentFrame + 1) % 3;
        }
      }

      return true; // Keep duck
    }

    draw(context) {
      if (!this.alive) return;

      // Frame size in sprite sheet
      const frameWidth = 60;
      const frameHeight = 60;

      // Source coordinates in sprite sheet
      let frameX = this.currentFrame * frameWidth;
      let frameY = 0;

      // Different row for different states
      if (this.falling) {
        frameY = frameHeight * 2; // Third row for falling
      } else if (this.escaping) {
        frameY = frameHeight; // Second row for escaping
      } else {
        // First row for normal flight, flipped based on direction
        frameY = this.speedX > 0 ? 0 : frameHeight * 3; // Fourth row for flying left
      }

      // Draw duck
      context.drawImage(
        this.image,
        frameX, frameY, frameWidth, frameHeight,
        this.x, this.y, this.width, this.height
      );
    }

    hit(x, y) {
      if (!this.alive || this.falling) return false;

      // Check if shot hit duck
      const hitbox = {
        x: this.x + 10,
        y: this.y + 10,
        width: this.width - 20,
        height: this.height - 20
      };

      return (
        x >= hitbox.x && x <= hitbox.x + hitbox.width &&
        y >= hitbox.y && y <= hitbox.y + hitbox.height
      );
    }
  }

  // Initialize game
  function initGame() {
    const duckHuntWindow = document.getElementById('duck-hunt-window');
    if (!duckHuntWindow) return;

    gameCanvas = duckHuntWindow.querySelector('.game-canvas');
    const startButton = duckHuntWindow.querySelector('.start-button');
    const soundToggle = duckHuntWindow.querySelector('.sound-toggle');
    const highScoreButton = duckHuntWindow.querySelector('.high-score-button');

    if (!gameCanvas) return;

    // Set canvas size
    gameCanvas.width = 400;
    gameCanvas.height = 300;

    // Get context
    gameContext = gameCanvas.getContext('2d');

    // Custom cursor
    gameCanvas.style.cursor = 'none';

    // Mouse move handler for crosshair
    let mouseX = 0;
    let mouseY = 0;
    gameCanvas.addEventListener('mousemove', (e) => {
      const rect = gameCanvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    // Start button
    if (startButton) {
      startButton.addEventListener('click', startGame);
    }

    // Sound toggle
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';

        // Play sound to confirm
        if (soundEnabled) {
          playSound('shot');
        }
      });
    }

    // High score button
    if (highScoreButton) {
      highScoreButton.addEventListener('click', showHighScores);
    }

    // Canvas click handler
    gameCanvas.addEventListener('click', handleShot);

    // Draw initial screen
    drawStartScreen();

    // Load high scores from localStorage
    loadHighScores();

    // Draw crosshair on top
    function drawCrosshair() {
      if (!gameActive) return;

      const crosshairSize = 30;
      gameContext.drawImage(
        images.crosshair,
        mouseX - crosshairSize / 2,
        mouseY - crosshairSize / 2,
        crosshairSize,
        crosshairSize
      );

      requestAnimationFrame(drawCrosshair);
    }

    // Start crosshair animation
    drawCrosshair();
  }

  // Load high scores
  function loadHighScores() {
    const savedHighScores = localStorage.getItem('duckHuntHighScores');
    if (savedHighScores) {
      highScores = JSON.parse(savedHighScores);
    } else {
      highScores = [];
    }

    // Get highest score
    if (highScores.length > 0) {
      highScore = highScores[0].score;
    } else {
      highScore = 0;
    }
  }

  // Save high score
  function saveHighScore(name, score) {
    // Add new score
    highScores.push({ name, score, date: new Date().toLocaleDateString() });

    // Sort by score (descending)
    highScores.sort((a, b) => b.score - a.score);

    // Keep only top 10
    if (highScores.length > 10) {
      highScores = highScores.slice(0, 10);
    }

    // Save to localStorage
    localStorage.setItem('duckHuntHighScores', JSON.stringify(highScores));

    // Update high score
    highScore = highScores[0].score;
  }

  // Start game
  function startGame() {
    // Reset game state
    gameActive = true;
    score = 0;
    round = 1;
    ducksShot = 0;
    ducksRequired = 6;
    lives = 3;
    ammo = 3;
    totalShots = 0;
    accuracy = 0;
    ducks = [];
    dogState = 'pointing';
    dogAnimationFrame = 0;
    dogX = 200;
    dogY = 250;

    // Play start sound
    playSound('roundClear');

    // Show round message
    showMessage(`Round ${round}`, 2000);

    // Start with dog animation
    setTimeout(() => {
      // Spawn initial ducks
      spawnDucks();

      // Start game loop
      requestAnimationFrame(gameLoop);
    }, 2000);
  }

  // Game loop
  function gameLoop() {
    if (!gameActive) return;

    // Clear canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw background
    drawBackground();

    // Update and draw dog
    updateDog();
    drawDog();

    // Update and draw ducks
    for (let i = ducks.length - 1; i >= 0; i--) {
      const duck = ducks[i];
      const keepDuck = duck.update();

      if (keepDuck) {
        duck.draw(gameContext);
      } else {
        ducks.splice(i, 1);

        // If duck was falling, don't lose a life
        if (!duck.falling) {
          // Duck escaped
          lives--;

          // Show dog laughing
          dogState = 'laughing';
          dogAnimationFrame = 0;
          playSound('dogLaugh');

          if (lives <= 0) {
            endGame();
            return;
          }
        }
      }
    }

    // Spawn new ducks if needed
    if (ducks.length === 0 && dogState === 'hidden') {
      if (ducksShot >= ducksRequired) {
        // Advance to next round
        advanceRound();
      } else {
        // Reload ammo
        reloadAmmo();

        // Spawn more ducks
        spawnDucks();
      }
    }

    // Draw UI
    drawUI();

    // Draw message if showing
    if (showingMessage) {
      drawMessage();
    }

    // Continue game loop
    requestAnimationFrame(gameLoop);
  }

  // Update dog animation and state
  function updateDog() {
    if (dogState === 'hidden') return;

    dogAnimationFrame++;

    if (dogState === 'pointing') {
      // Dog pointing animation
      if (dogAnimationFrame > 60) {
        dogState = 'hidden';
      }
    } else if (dogState === 'laughing') {
      // Dog laughing animation
      if (dogAnimationFrame > 90) {
        dogState = 'hidden';
      }
    } else if (dogState === 'jumping') {
      // Dog jumping animation
      dogY = Math.max(150, 250 - Math.sin(dogAnimationFrame / 10) * 100);

      if (dogAnimationFrame > 60) {
        dogState = 'hidden';
      }
    }
  }

  // Draw dog
  function drawDog() {
    if (dogState === 'hidden') return;

    const dogWidth = 80;
    const dogHeight = 70;
    let frameX = 0;
    let frameY = 0;

    // Different frames for different states
    if (dogState === 'pointing') {
      frameY = 0;
      frameX = Math.floor(dogAnimationFrame / 15) % 2 * dogWidth;
    } else if (dogState === 'laughing') {
      frameY = dogHeight;
      frameX = Math.floor(dogAnimationFrame / 15) % 2 * dogWidth;
    } else if (dogState === 'jumping') {
      frameY = dogHeight * 2;
      frameX = Math.floor(dogAnimationFrame / 15) % 2 * dogWidth;
    }

    // Draw dog
    gameContext.drawImage(
      images.dog,
      frameX, frameY, dogWidth, dogHeight,
      dogX - dogWidth / 2, dogY - dogHeight / 2, dogWidth, dogHeight
    );
  }

  // Draw background
  function drawBackground() {
    // Draw background image if loaded
    if (images.background.complete) {
      gameContext.drawImage(images.background, 0, 0, gameCanvas.width, gameCanvas.height);
    } else {
      // Fallback background
      // Sky
      gameContext.fillStyle = '#87CEEB';
      gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height - 50);

      // Ground
      gameContext.fillStyle = '#8B4513';
      gameContext.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 50);

      // Grass
      gameContext.fillStyle = '#228B22';
      gameContext.fillRect(0, gameCanvas.height - 50, gameCanvas.width, 10);
    }
  }

  // Draw UI
  function drawUI() {
    // Score panel background
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(0, 0, gameCanvas.width, 40);

    // Score
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = '16px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'left';
    gameContext.fillText(`Score: ${score}`, 10, 25);

    // High Score
    gameContext.fillText(`High: ${highScore}`, 120, 25);

    // Round
    gameContext.textAlign = 'right';
    gameContext.fillText(`Round: ${round}`, gameCanvas.width - 10, 25);

    // Bottom panel
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(0, gameCanvas.height - 30, gameCanvas.width, 30);

    // Lives
    gameContext.textAlign = 'left';
    gameContext.fillStyle = '#FFFFFF';
    gameContext.fillText(`Lives: ${lives}`, 10, gameCanvas.height - 10);

    // Ammo
    gameContext.fillText(`Ammo: ${ammo}`, 120, gameCanvas.height - 10);

    // Ducks
    gameContext.textAlign = 'right';
    gameContext.fillText(`Ducks: ${ducksShot}/${ducksRequired}`, gameCanvas.width - 10, gameCanvas.height - 10);

    // Accuracy
    if (totalShots > 0) {
      accuracy = Math.round((ducksShot / totalShots) * 100);
      gameContext.fillText(`Accuracy: ${accuracy}%`, gameCanvas.width - 150, gameCanvas.height - 10);
    }
  }

  // Draw message
  function drawMessage() {
    if (!showingMessage) return;

    // Message background
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(50, 120, 300, 60);

    // Message border
    gameContext.strokeStyle = '#FFC107';
    gameContext.lineWidth = 2;
    gameContext.strokeRect(50, 120, 300, 60);

    // Message text
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = 'bold 20px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'center';
    gameContext.fillText(messageText, gameCanvas.width / 2, 160);

    // Update message timer
    messageTimer--;
    if (messageTimer <= 0) {
      showingMessage = false;
    }
  }

  // Show message
  function showMessage(text, duration = 2000) {
    messageText = text;
    messageTimer = duration / (1000 / 60); // Convert ms to frames at 60fps
    showingMessage = true;
  }

  // Draw start screen
  function drawStartScreen() {
    // Clear canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw background
    drawBackground();

    // Title background
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(50, 70, 300, 160);

    // Title border
    gameContext.strokeStyle = '#FFC107';
    gameContext.lineWidth = 3;
    gameContext.strokeRect(50, 70, 300, 160);

    // Title
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = 'bold 28px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'center';
    gameContext.fillText('DUCK HUNT', gameCanvas.width / 2, 110);

    // Instructions
    gameContext.font = '16px "MS Sans Serif", sans-serif';
    gameContext.fillText('Click to shoot the ducks!', gameCanvas.width / 2, 150);
    gameContext.fillText('Press Start to begin', gameCanvas.width / 2, 180);

    // High Score
    gameContext.fillText(`High Score: ${highScore}`, gameCanvas.width / 2, 210);
  }

  // Draw game over screen
  function drawGameOverScreen() {
    // Clear canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw background
    drawBackground();

    // Game Over background
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(50, 70, 300, 180);

    // Game Over border
    gameContext.strokeStyle = '#FF5252';
    gameContext.lineWidth = 3;
    gameContext.strokeRect(50, 70, 300, 180);

    // Game Over
    gameContext.fillStyle = '#FF5252';
    gameContext.font = 'bold 28px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'center';
    gameContext.fillText('GAME OVER', gameCanvas.width / 2, 110);

    // Final Score
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = '16px "MS Sans Serif", sans-serif';
    gameContext.fillText(`Final Score: ${score}`, gameCanvas.width / 2, 150);

    // Accuracy
    if (totalShots > 0) {
      accuracy = Math.round((ducksShot / totalShots) * 100);
    }
    gameContext.fillText(`Accuracy: ${accuracy}%`, gameCanvas.width / 2, 180);

    // High Score
    const newHighScore = score > highScore;
    if (newHighScore) {
      gameContext.fillStyle = '#4CAF50';
      gameContext.fillText('NEW HIGH SCORE!', gameCanvas.width / 2, 210);
    } else {
      gameContext.fillStyle = '#FFFFFF';
      gameContext.fillText(`High Score: ${highScore}`, gameCanvas.width / 2, 210);
    }

    // Restart
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = '14px "MS Sans Serif", sans-serif';
    gameContext.fillText('Press Start to play again', gameCanvas.width / 2, 240);

    // Save high score if new record
    if (newHighScore) {
      const playerName = prompt('New high score! Enter your name:', 'Player');
      if (playerName) {
        saveHighScore(playerName, score);
      }
    }
  }

  // Show high scores
  function showHighScores() {
    // Clear canvas
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw background
    drawBackground();

    // High Scores background
    gameContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameContext.fillRect(50, 50, 300, 200);

    // High Scores border
    gameContext.strokeStyle = '#4CAF50';
    gameContext.lineWidth = 3;
    gameContext.strokeRect(50, 50, 300, 200);

    // Title
    gameContext.fillStyle = '#4CAF50';
    gameContext.font = 'bold 20px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'center';
    gameContext.fillText('HIGH SCORES', gameCanvas.width / 2, 80);

    // Scores
    gameContext.fillStyle = '#FFFFFF';
    gameContext.font = '12px "MS Sans Serif", sans-serif';
    gameContext.textAlign = 'left';

    if (highScores.length === 0) {
      gameContext.textAlign = 'center';
      gameContext.fillText('No high scores yet!', gameCanvas.width / 2, 120);
    } else {
      // Headers
      gameContext.fillStyle = '#FFC107';
      gameContext.fillText('RANK', 70, 110);
      gameContext.fillText('NAME', 120, 110);
      gameContext.fillText('SCORE', 220, 110);
      gameContext.fillText('DATE', 280, 110);

      // List scores
      gameContext.fillStyle = '#FFFFFF';
      const maxToShow = Math.min(5, highScores.length);
      for (let i = 0; i < maxToShow; i++) {
        const score = highScores[i];
        const y = 130 + i * 20;

        gameContext.fillText(`${i + 1}.`, 70, y);
        gameContext.fillText(score.name.substring(0, 8), 120, y);
        gameContext.fillText(score.score.toString(), 220, y);
        gameContext.fillText(score.date, 280, y);
      }
    }

    // Back button
    gameContext.fillStyle = '#FFFFFF';
    gameContext.textAlign = 'center';
    gameContext.fillText('Press Start to return', gameCanvas.width / 2, 230);

    // Pause game
    gameActive = false;
  }

  // Spawn ducks
  function spawnDucks() {
    const duckCount = Math.min(3, round);

    // Show dog pointing before ducks appear
    dogState = 'pointing';
    dogAnimationFrame = 0;
    playSound('dogBark');

    // Spawn ducks after dog animation
    setTimeout(() => {
      for (let i = 0; i < duckCount; i++) {
        ducks.push(new Duck(round));
      }

      // Play quack sound
      playSound('quack');
    }, 1000);
  }

  // Reload ammo
  function reloadAmmo() {
    ammo = 3;
    playSound('reload');
  }

  // Handle shot
  function handleShot(e) {
    if (!gameActive) return;

    // Check ammo
    if (ammo <= 0) {
      playSound('emptyGun');
      return;
    }

    // Decrease ammo
    ammo--;
    totalShots++;

    // Get click position relative to canvas
    const rect = gameCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Play shot sound
    playSound('shot');

    // Check if any duck was hit
    let hit = false;

    for (const duck of ducks) {
      if (duck.hit(x, y)) {
        // Hit duck
        hit = true;
        duck.alive = false;
        duck.escaping = false;
        duck.falling = true;
        duck.fallSpeed = 0;

        // Update score
        score += duck.points * round;
        ducksShot++;

        // Update high score
        if (score > highScore) {
          highScore = score;
        }

        // Play hit sound
        playSound('hit');
        setTimeout(() => playSound('duckFall'), 500);

        // Show dog jumping to catch duck
        setTimeout(() => {
          dogState = 'jumping';
          dogAnimationFrame = 0;
          dogX = duck.x;
        }, 1000);

        break;
      }
    }

    if (!hit) {
      // Miss
      playSound('miss');
    }

    // Reload if out of ammo
    if (ammo <= 0) {
      setTimeout(reloadAmmo, 1000);
    }
  }

  // Advance to next round
  function advanceRound() {
    round++;
    ducksShot = 0;
    ducksRequired = Math.min(10, 6 + round);

    // Play round clear sound
    playSound('roundClear');

    // Show round message
    showMessage(`Round ${round}`, 2000);

    // Reload ammo
    reloadAmmo();

    // Spawn ducks for next round after a delay
    setTimeout(spawnDucks, 2000);
  }

  // End game
  function endGame() {
    gameActive = false;

    // Play game over sound
    playSound('gameOver');

    // Draw game over screen
    drawGameOverScreen();
  }

  // Play sound
  function playSound(soundName) {
    if (!soundEnabled) return;

    const sound = sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Error playing sound:', e));
    }
  }

  // Initialize game
  initGame();
});
