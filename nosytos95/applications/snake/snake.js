// NosytOS95 Snake Game
// Classic Snake implementation with Windows 95 styling

class SnakeGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'ready'; // ready, playing, paused, gameOver
        this.snake = [];
        this.food = null;
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.speed = 150;
        this.gameLoop = null;
        
        // Game dimensions
        this.gridSize = 20;
        this.canvasWidth = 400;
        this.canvasHeight = 400;
        this.gridWidth = this.canvasWidth / this.gridSize;
        this.gridHeight = this.canvasHeight / this.gridSize;
        
        // Colors
        this.colors = {
            background: '#000000',
            snake: '#00FF00',
            snakeHead: '#90EE90',
            food: '#FF0000',
            grid: '#333333'
        };
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.setupEventListeners();
        this.setupKeyboardControls();
        this.initializeGame();
        console.log('Snake initialized');
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="snake-game">
                <div class="game-header">
                    <div class="game-controls">
                        <button class="new-game-btn win95-button">New Game</button>
                        <button class="pause-btn win95-button">Pause</button>
                        <button class="help-btn win95-button">Help</button>
                    </div>
                    <div class="game-stats">
                        <div class="stat-item">
                            <label>Score:</label>
                            <div class="score-display">0</div>
                        </div>
                        <div class="stat-item">
                            <label>High Score:</label>
                            <div class="high-score-display">${this.highScore}</div>
                        </div>
                        <div class="stat-item">
                            <label>Length:</label>
                            <div class="length-display">1</div>
                        </div>
                    </div>
                </div>
                <div class="game-content">
                    <div class="game-board-container">
                        <canvas class="game-canvas" width="${this.canvasWidth}" height="${this.canvasHeight}"></canvas>
                        <div class="game-overlay" style="display: none;">
                            <div class="overlay-message"></div>
                            <button class="restart-btn win95-button" style="margin-top: 10px;">Play Again</button>
                        </div>
                    </div>
                    <div class="game-info">
                        <div class="controls-panel">
                            <h4>Controls:</h4>
                            <div class="control-grid">
                                <div class="control-row">
                                    <div class="control-key"></div>
                                    <div class="control-key">↑</div>
                                    <div class="control-key"></div>
                                </div>
                                <div class="control-row">
                                    <div class="control-key">←</div>
                                    <div class="control-key">↓</div>
                                    <div class="control-key">→</div>
                                </div>
                            </div>
                            <div class="control-info">
                                <div>WASD or Arrow Keys</div>
                                <div>Space: Pause</div>
                                <div>R: Restart</div>
                            </div>
                        </div>
                        <div class="speed-panel">
                            <h4>Speed:</h4>
                            <div class="speed-controls">
                                <button class="speed-btn win95-button" data-speed="200">Slow</button>
                                <button class="speed-btn win95-button active" data-speed="150">Normal</button>
                                <button class="speed-btn win95-button" data-speed="100">Fast</button>
                                <button class="speed-btn win95-button" data-speed="50">Insane</button>
                            </div>
                        </div>
                        <div class="achievements-panel">
                            <h4>Achievements:</h4>
                            <div class="achievement" data-achievement="first-food">
                                <span class="achievement-icon">🍎</span>
                                <span class="achievement-text">First Bite</span>
                            </div>
                            <div class="achievement" data-achievement="score-100">
                                <span class="achievement-icon">💯</span>
                                <span class="achievement-text">Century</span>
                            </div>
                            <div class="achievement" data-achievement="length-10">
                                <span class="achievement-icon">🐍</span>
                                <span class="achievement-text">Long Snake</span>
                            </div>
                            <div class="achievement" data-achievement="speed-demon">
                                <span class="achievement-icon">⚡</span>
                                <span class="achievement-text">Speed Demon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setupEventListeners() {
        // New game button
        const newGameBtn = this.container.querySelector('.new-game-btn');
        newGameBtn.addEventListener('click', () => this.newGame());

        // Pause button
        const pauseBtn = this.container.querySelector('.pause-btn');
        pauseBtn.addEventListener('click', () => this.togglePause());

        // Help button
        const helpBtn = this.container.querySelector('.help-btn');
        helpBtn.addEventListener('click', () => this.showHelp());

        // Restart button in overlay
        const restartBtn = this.container.querySelector('.restart-btn');
        restartBtn.addEventListener('click', () => this.newGame());

        // Speed buttons
        const speedBtns = this.container.querySelectorAll('.speed-btn');
        speedBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                speedBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.speed = parseInt(btn.dataset.speed);
                
                if (btn.dataset.speed === '50') {
                    this.unlockAchievement('speed-demon');
                }
            });
        });
    }

    setupKeyboardControls() {
        // Focus the container to receive keyboard events
        this.container.tabIndex = 0;
        this.container.focus();

        this.container.addEventListener('keydown', (e) => {
            if (this.gameState === 'gameOver') return;

            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    e.preventDefault();
                    this.changeDirection(0, -1);
                    break;
                case 'arrowdown':
                case 's':
                    e.preventDefault();
                    this.changeDirection(0, 1);
                    break;
                case 'arrowleft':
                case 'a':
                    e.preventDefault();
                    this.changeDirection(-1, 0);
                    break;
                case 'arrowright':
                case 'd':
                    e.preventDefault();
                    this.changeDirection(1, 0);
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'r':
                    e.preventDefault();
                    this.newGame();
                    break;
            }
        });
    }

    initializeGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.generateFood();
        this.updateDisplay();
        this.render();
    }

    newGame() {
        this.gameState = 'playing';
        this.initializeGame();
        this.hideOverlay();
        this.startGameLoop();
        
        // Update pause button
        const pauseBtn = this.container.querySelector('.pause-btn');
        pauseBtn.textContent = 'Pause';
    }

    changeDirection(x, y) {
        // Prevent reversing into itself
        if (this.direction.x === -x && this.direction.y === -y) return;
        
        this.nextDirection = { x, y };
    }

    generateFood() {
        let foodPosition;
        do {
            foodPosition = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y));
        
        this.food = foodPosition;
    }

    update() {
        if (this.gameState !== 'playing') return;

        // Update direction
        this.direction = { ...this.nextDirection };

        // Move snake
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        // Check wall collision
        if (head.x < 0 || head.x >= this.gridWidth || 
            head.y < 0 || head.y >= this.gridHeight) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateDisplay();
            this.generateFood();
            this.checkAchievements();
        } else {
            this.snake.pop();
        }
    }

    checkAchievements() {
        if (this.score >= 10) {
            this.unlockAchievement('first-food');
        }
        if (this.score >= 100) {
            this.unlockAchievement('score-100');
        }
        if (this.snake.length >= 10) {
            this.unlockAchievement('length-10');
        }
    }

    unlockAchievement(achievementId) {
        const achievement = this.container.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievement && !achievement.classList.contains('unlocked')) {
            achievement.classList.add('unlocked');
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                ${achievement.querySelector('.achievement-icon').textContent}
                <span>Achievement Unlocked!</span>
                <strong>${achievement.querySelector('.achievement-text').textContent}</strong>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopGameLoop();
            this.showOverlay('PAUSED\nPress Space to continue');
            
            const pauseBtn = this.container.querySelector('.pause-btn');
            pauseBtn.textContent = 'Resume';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.hideOverlay();
            this.startGameLoop();
            
            const pauseBtn = this.container.querySelector('.pause-btn');
            pauseBtn.textContent = 'Pause';
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.stopGameLoop();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateDisplay();
            this.showOverlay(`NEW HIGH SCORE!\n${this.score} points\nLength: ${this.snake.length}`);
        } else {
            this.showOverlay(`GAME OVER\nScore: ${this.score}\nLength: ${this.snake.length}`);
        }
    }

    startGameLoop() {
        this.stopGameLoop();
        this.gameLoop = setInterval(() => {
            this.update();
            this.render();
        }, this.speed);
    }

    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    showOverlay(message) {
        const overlay = this.container.querySelector('.game-overlay');
        const messageEl = this.container.querySelector('.overlay-message');
        messageEl.textContent = message;
        overlay.style.display = 'flex';
    }

    hideOverlay() {
        const overlay = this.container.querySelector('.game-overlay');
        overlay.style.display = 'none';
    }

    showHelp() {
        const helpMessage = `Snake Game Help:

Objective:
Eat the red food to grow your snake and increase your score.
Avoid hitting the walls or your own tail!

Controls:
• Arrow Keys or WASD: Move snake
• Space: Pause/Resume game
• R: Restart game

Scoring:
• Each food eaten: +10 points
• Try to beat your high score!

Speed Settings:
• Slow: Good for beginners
• Normal: Classic speed
• Fast: For experienced players
• Insane: Ultimate challenge

Achievements:
• First Bite: Eat your first food
• Century: Score 100 points
• Long Snake: Grow to 10 segments
• Speed Demon: Play on Insane speed`;
        
        alert(helpMessage);
    }

    updateDisplay() {
        this.container.querySelector('.score-display').textContent = this.score;
        this.container.querySelector('.high-score-display').textContent = this.highScore;
        this.container.querySelector('.length-display').textContent = this.snake.length;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw grid
        this.drawGrid();

        // Draw food
        this.drawFood();

        // Draw snake
        this.drawSnake();
    }

    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.gridSize, 0);
            this.ctx.lineTo(x * this.gridSize, this.canvasHeight);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.gridSize);
            this.ctx.lineTo(this.canvasWidth, y * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawFood() {
        if (!this.food) return;

        this.ctx.fillStyle = this.colors.food;
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Add food highlight
        this.ctx.fillStyle = '#FF6666';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 8,
            this.gridSize - 8
        );
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            // Head is different color
            this.ctx.fillStyle = index === 0 ? this.colors.snakeHead : this.colors.snake;
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );

            // Add segment highlight
            if (index === 0) {
                // Head highlight
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 3,
                    segment.y * this.gridSize + 3,
                    this.gridSize - 10,
                    this.gridSize - 10
                );
            }
        });
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore') || '0');
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }

    // Application lifecycle methods
    pause() {
        if (this.gameState === 'playing') {
            this.togglePause();
        }
    }

    resume() {
        if (this.gameState === 'paused') {
            this.togglePause();
        }
    }

    hasUnsavedChanges() {
        return this.gameState === 'playing' && this.score > 0;
    }

    destroy() {
        this.stopGameLoop();
    }
}

// Initialize when window is loaded
if (typeof window !== 'undefined') {
    window.SnakeGame = SnakeGame;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SnakeGame;
}
