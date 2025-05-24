// NosytOS95 Minesweeper Game
// Classic Minesweeper implementation with Windows 95 styling

class MinesweeperGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.board = [];
        this.gameState = 'ready'; // ready, playing, won, lost
        this.mineCount = 10;
        this.flagCount = 0;
        this.revealedCount = 0;
        this.rows = 9;
        this.cols = 9;
        this.firstClick = true;
        this.timer = 0;
        this.timerInterval = null;
        
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.newGame();
        console.log('Minesweeper initialized');
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="minesweeper-game">
                <div class="game-header">
                    <div class="game-controls">
                        <select class="difficulty-select">
                            <option value="beginner">Beginner (9x9, 10 mines)</option>
                            <option value="intermediate">Intermediate (16x16, 40 mines)</option>
                            <option value="expert">Expert (16x30, 99 mines)</option>
                        </select>
                        <button class="new-game-btn win95-button">New Game</button>
                    </div>
                    <div class="game-status">
                        <div class="mine-counter">
                            <span class="counter-display">010</span>
                        </div>
                        <button class="smiley-btn">😊</button>
                        <div class="timer-display">
                            <span class="counter-display">000</span>
                        </div>
                    </div>
                </div>
                <div class="game-board-container">
                    <div class="game-board"></div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Difficulty selector
        const difficultySelect = this.container.querySelector('.difficulty-select');
        difficultySelect.addEventListener('change', (e) => {
            this.changeDifficulty(e.target.value);
        });

        // New game button
        const newGameBtn = this.container.querySelector('.new-game-btn');
        newGameBtn.addEventListener('click', () => {
            this.newGame();
        });

        // Smiley button
        const smileyBtn = this.container.querySelector('.smiley-btn');
        smileyBtn.addEventListener('click', () => {
            this.newGame();
        });
    }

    changeDifficulty(difficulty) {
        const config = this.difficulties[difficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.mineCount = config.mines;
        this.newGame();
    }

    newGame() {
        this.gameState = 'ready';
        this.flagCount = 0;
        this.revealedCount = 0;
        this.firstClick = true;
        this.timer = 0;
        this.clearTimer();
        
        this.initializeBoard();
        this.renderBoard();
        this.updateMineCounter();
        this.updateTimer();
        this.updateSmiley();
    }

    initializeBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0,
                    row: row,
                    col: col
                };
            }
        }
    }

    placeMines(excludeRow, excludeCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            
            // Don't place mine on first click or if already has mine
            if ((row === excludeRow && col === excludeCol) || this.board[row][col].isMine) {
                continue;
            }
            
            this.board[row][col].isMine = true;
            minesPlaced++;
        }
        
        this.calculateAdjacentMines();
    }

    calculateAdjacentMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine) {
                    this.board[row][col].adjacentMines = this.countAdjacentMines(row, col);
                }
            }
        }
    }

    countAdjacentMines(row, col) {
        let count = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.board[r][c].isMine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    renderBoard() {
        const boardContainer = this.container.querySelector('.game-board');
        boardContainer.innerHTML = '';
        boardContainer.style.gridTemplateColumns = `repeat(${this.cols}, 20px)`;
        boardContainer.style.gridTemplateRows = `repeat(${this.rows}, 20px)`;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = this.createCell(row, col);
                boardContainer.appendChild(cell);
            }
        }
    }

    createCell(row, col) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Left click to reveal
        cell.addEventListener('click', (e) => {
            e.preventDefault();
            this.revealCell(row, col);
        });

        // Right click to flag
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleFlag(row, col);
        });

        // Middle click for chord
        cell.addEventListener('mousedown', (e) => {
            if (e.button === 1) { // Middle mouse button
                e.preventDefault();
                this.chordCell(row, col);
            }
        });

        this.updateCellDisplay(cell, row, col);
        return cell;
    }

    updateCellDisplay(cell, row, col) {
        const cellData = this.board[row][col];
        
        cell.className = 'mine-cell';
        cell.textContent = '';

        if (cellData.isFlagged) {
            cell.classList.add('flagged');
            cell.textContent = '🚩';
        } else if (cellData.isRevealed) {
            cell.classList.add('revealed');
            if (cellData.isMine) {
                cell.classList.add('mine');
                cell.textContent = '💣';
            } else if (cellData.adjacentMines > 0) {
                cell.textContent = cellData.adjacentMines;
                cell.classList.add(`number-${cellData.adjacentMines}`);
            }
        }
    }

    revealCell(row, col) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;

        // First click - place mines
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.gameState = 'playing';
            this.startTimer();
        }

        cell.isRevealed = true;
        this.revealedCount++;

        if (cell.isMine) {
            this.gameOver(false);
            return;
        }

        // Auto-reveal adjacent cells if no adjacent mines
        if (cell.adjacentMines === 0) {
            this.revealAdjacentCells(row, col);
        }

        this.updateCellDisplay(this.getCellElement(row, col), row, col);
        this.checkWinCondition();
    }

    revealAdjacentCells(row, col) {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (!this.board[r][c].isRevealed && !this.board[r][c].isFlagged) {
                        this.revealCell(r, c);
                    }
                }
            }
        }
    }

    toggleFlag(row, col) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed) return;

        cell.isFlagged = !cell.isFlagged;
        this.flagCount += cell.isFlagged ? 1 : -1;

        this.updateCellDisplay(this.getCellElement(row, col), row, col);
        this.updateMineCounter();
    }

    chordCell(row, col) {
        const cell = this.board[row][col];
        if (!cell.isRevealed || cell.adjacentMines === 0) return;

        // Count adjacent flags
        let flagCount = 0;
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.board[r][c].isFlagged) {
                        flagCount++;
                    }
                }
            }
        }

        // If flag count matches adjacent mines, reveal unflagged adjacent cells
        if (flagCount === cell.adjacentMines) {
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                        if (!this.board[r][c].isFlagged) {
                            this.revealCell(r, c);
                        }
                    }
                }
            }
        }
    }

    getCellElement(row, col) {
        return this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    checkWinCondition() {
        const totalCells = this.rows * this.cols;
        const safeCells = totalCells - this.mineCount;
        
        if (this.revealedCount === safeCells) {
            this.gameOver(true);
        }
    }

    gameOver(won) {
        this.gameState = won ? 'won' : 'lost';
        this.clearTimer();
        
        if (!won) {
            // Reveal all mines
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (this.board[row][col].isMine) {
                        this.board[row][col].isRevealed = true;
                        this.updateCellDisplay(this.getCellElement(row, col), row, col);
                    }
                }
            }
        }
        
        this.updateSmiley();
        
        setTimeout(() => {
            const message = won ? 'Congratulations! You won!' : 'Game Over! You hit a mine!';
            alert(message);
        }, 100);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }

    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateMineCounter() {
        const remaining = this.mineCount - this.flagCount;
        const display = this.container.querySelector('.mine-counter .counter-display');
        display.textContent = remaining.toString().padStart(3, '0');
    }

    updateTimer() {
        const display = this.container.querySelector('.timer-display .counter-display');
        const time = Math.min(999, this.timer);
        display.textContent = time.toString().padStart(3, '0');
    }

    updateSmiley() {
        const smiley = this.container.querySelector('.smiley-btn');
        switch (this.gameState) {
            case 'won':
                smiley.textContent = '😎';
                break;
            case 'lost':
                smiley.textContent = '😵';
                break;
            default:
                smiley.textContent = '😊';
        }
    }
}

// Initialize when window is loaded
if (typeof window !== 'undefined') {
    window.MinesweeperGame = MinesweeperGame;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinesweeperGame;
}
