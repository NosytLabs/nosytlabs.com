// NosytOS95 Tetris Game
// Classic Tetris implementation with Windows 95 styling

class TetrisGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'ready'; // ready, playing, paused, gameOver
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.isPaused = false;
        
        // Game dimensions
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.blockSize = 25;
        
        // Tetris pieces (tetrominoes)
        this.pieces = {
            I: { shape: [[1,1,1,1]], color: '#00FFFF' },
            O: { shape: [[1,1],[1,1]], color: '#FFFF00' },
            T: { shape: [[0,1,0],[1,1,1]], color: '#800080' },
            S: { shape: [[0,1,1],[1,1,0]], color: '#00FF00' },
            Z: { shape: [[1,1,0],[0,1,1]], color: '#FF0000' },
            J: { shape: [[1,0,0],[1,1,1]], color: '#0000FF' },
            L: { shape: [[0,0,1],[1,1,1]], color: '#FFA500' }
        };
        
        this.pieceTypes = Object.keys(this.pieces);
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.initializeBoard();
        this.setupEventListeners();
        this.setupKeyboardControls();
        console.log('Tetris initialized');
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="tetris-game">
                <div class="game-header">
                    <div class="game-controls">
                        <button class="new-game-btn win95-button">New Game</button>
                        <button class="pause-btn win95-button">Pause</button>
                        <button class="help-btn win95-button">Help</button>
                    </div>
                </div>
                <div class="game-content">
                    <div class="game-info">
                        <div class="score-panel">
                            <div class="info-section">
                                <label>Score:</label>
                                <div class="score-display">0</div>
                            </div>
                            <div class="info-section">
                                <label>Lines:</label>
                                <div class="lines-display">0</div>
                            </div>
                            <div class="info-section">
                                <label>Level:</label>
                                <div class="level-display">1</div>
                            </div>
                        </div>
                        <div class="next-piece-panel">
                            <label>Next:</label>
                            <canvas class="next-canvas" width="100" height="80"></canvas>
                        </div>
                        <div class="controls-info">
                            <h4>Controls:</h4>
                            <div class="control-item">← → Move</div>
                            <div class="control-item">↓ Soft Drop</div>
                            <div class="control-item">↑ Rotate</div>
                            <div class="control-item">Space Hard Drop</div>
                            <div class="control-item">P Pause</div>
                        </div>
                    </div>
                    <div class="game-board-container">
                        <canvas class="game-canvas" width="250" height="500"></canvas>
                        <div class="game-overlay" style="display: none;">
                            <div class="overlay-message"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = this.container.querySelector('.next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
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
    }

    setupKeyboardControls() {
        // Focus the container to receive keyboard events
        this.container.tabIndex = 0;
        this.container.focus();

        this.container.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
    }

    initializeBoard() {
        this.board = [];
        for (let y = 0; y < this.boardHeight; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.boardWidth; x++) {
                this.board[y][x] = 0;
            }
        }
    }

    newGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.isPaused = false;
        
        this.initializeBoard();
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        
        this.updateDisplay();
        this.hideOverlay();
        this.gameLoop();
        
        // Update pause button
        const pauseBtn = this.container.querySelector('.pause-btn');
        pauseBtn.textContent = 'Pause';
    }

    createPiece() {
        const type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
        const piece = this.pieces[type];
        
        return {
            type: type,
            shape: piece.shape.map(row => [...row]),
            color: piece.color,
            x: Math.floor(this.boardWidth / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return;
        
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.isValidPosition(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }

    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        
        if (this.isValidPosition(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
        }
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = [];
        
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = matrix[rows - 1 - j][i];
            }
        }
        
        return rotated;
    }

    hardDrop() {
        if (!this.currentPiece) return;
        
        while (this.movePiece(0, 1)) {
            // Keep dropping until it can't move down
        }
        this.placePiece();
    }

    isValidPosition(shape, x, y) {
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const newX = x + px;
                    const newY = y + py;
                    
                    if (newX < 0 || newX >= this.boardWidth || 
                        newY >= this.boardHeight || 
                        (newY >= 0 && this.board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece() {
        if (!this.currentPiece) return;
        
        // Place piece on board
        for (let py = 0; py < this.currentPiece.shape.length; py++) {
            for (let px = 0; px < this.currentPiece.shape[py].length; px++) {
                if (this.currentPiece.shape[py][px]) {
                    const x = this.currentPiece.x + px;
                    const y = this.currentPiece.y + py;
                    
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
        
        // Check for completed lines
        this.clearLines();
        
        // Get next piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        // Check game over
        if (!this.isValidPosition(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver();
        }
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // Line is complete
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.calculateScore(linesCleared);
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            
            this.updateDisplay();
        }
    }

    calculateScore(linesCleared) {
        const baseScore = [0, 40, 100, 300, 1200];
        return baseScore[linesCleared] * this.level;
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.isPaused = true;
            this.showOverlay('PAUSED\nPress P to continue');
            
            const pauseBtn = this.container.querySelector('.pause-btn');
            pauseBtn.textContent = 'Resume';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.isPaused = false;
            this.hideOverlay();
            this.gameLoop();
            
            const pauseBtn = this.container.querySelector('.pause-btn');
            pauseBtn.textContent = 'Pause';
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.showOverlay(`GAME OVER\nScore: ${this.score}\nLines: ${this.lines}\nLevel: ${this.level}`);
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
        const helpMessage = `Tetris Help:

Controls:
← → Arrow keys: Move piece left/right
↓ Arrow key: Soft drop (faster fall)
↑ Arrow key: Rotate piece
Space: Hard drop (instant drop)
P: Pause/Resume game

Scoring:
1 line: 40 × level
2 lines: 100 × level
3 lines: 300 × level
4 lines (Tetris): 1200 × level

The game speeds up every 10 lines cleared!`;
        
        alert(helpMessage);
    }

    updateDisplay() {
        // Update score displays
        this.container.querySelector('.score-display').textContent = this.score.toLocaleString();
        this.container.querySelector('.lines-display').textContent = this.lines;
        this.container.querySelector('.level-display').textContent = this.level;
    }

    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.dropTime += deltaTime;
        
        if (this.dropTime > this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTime = 0;
        }
        
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        this.drawBoard();
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, this.ctx);
        }
        
        // Draw next piece
        this.drawNextPiece();
        
        // Draw grid
        this.drawGrid();
    }

    drawBoard() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, 
                                    this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
    }

    drawPiece(piece, context) {
        context.fillStyle = piece.color;
        
        for (let py = 0; py < piece.shape.length; py++) {
            for (let px = 0; px < piece.shape[py].length; px++) {
                if (piece.shape[py][px]) {
                    const x = (piece.x + px) * this.blockSize;
                    const y = (piece.y + py) * this.blockSize;
                    context.fillRect(x, y, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
    }

    drawNextPiece() {
        // Clear next canvas
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const tempPiece = {
                ...this.nextPiece,
                x: 1,
                y: 1
            };
            
            this.nextCtx.fillStyle = this.nextPiece.color;
            
            for (let py = 0; py < tempPiece.shape.length; py++) {
                for (let px = 0; px < tempPiece.shape[py].length; px++) {
                    if (tempPiece.shape[py][px]) {
                        const x = (tempPiece.x + px) * 20;
                        const y = (tempPiece.y + py) * 20;
                        this.nextCtx.fillRect(x, y, 19, 19);
                    }
                }
            }
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
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
}

// Initialize when window is loaded
if (typeof window !== 'undefined') {
    window.TetrisGame = TetrisGame;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TetrisGame;
}
