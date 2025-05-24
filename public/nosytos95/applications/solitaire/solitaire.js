// NosytOS95 Solitaire Game
// Classic Klondike Solitaire implementation with Windows 95 styling

class SolitaireGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.gameState = 'ready';
        this.score = 0;
        this.moves = 0;
        this.time = 0;
        this.timer = null;
        
        // Game areas
        this.deck = [];
        this.waste = [];
        this.foundations = [[], [], [], []]; // Hearts, Diamonds, Clubs, Spades
        this.tableau = [[], [], [], [], [], [], []]; // 7 columns
        
        this.suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        this.ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.colors = { hearts: 'red', diamonds: 'red', clubs: 'black', spades: 'black' };
        
        this.selectedCard = null;
        this.selectedPile = null;
        
        this.init();
    }

    init() {
        this.createGameInterface();
        this.setupEventListeners();
        this.newGame();
        console.log('Solitaire initialized');
    }

    createGameInterface() {
        this.container.innerHTML = `
            <div class="solitaire-game">
                <div class="game-header">
                    <div class="game-controls">
                        <button class="new-game-btn win95-button">New Game</button>
                        <button class="hint-btn win95-button">Hint</button>
                        <button class="undo-btn win95-button">Undo</button>
                        <button class="help-btn win95-button">Help</button>
                    </div>
                    <div class="game-stats">
                        <div class="stat-item">
                            <label>Score:</label>
                            <div class="score-display">0</div>
                        </div>
                        <div class="stat-item">
                            <label>Time:</label>
                            <div class="time-display">00:00</div>
                        </div>
                        <div class="stat-item">
                            <label>Moves:</label>
                            <div class="moves-display">0</div>
                        </div>
                    </div>
                </div>
                <div class="game-board">
                    <div class="top-area">
                        <div class="stock-waste">
                            <div class="stock-pile card-slot" id="stock">
                                <div class="card-back"></div>
                            </div>
                            <div class="waste-pile card-slot" id="waste"></div>
                        </div>
                        <div class="foundations">
                            <div class="foundation card-slot" data-suit="hearts" id="foundation-0">
                                <div class="foundation-placeholder">♥</div>
                            </div>
                            <div class="foundation card-slot" data-suit="diamonds" id="foundation-1">
                                <div class="foundation-placeholder">♦</div>
                            </div>
                            <div class="foundation card-slot" data-suit="clubs" id="foundation-2">
                                <div class="foundation-placeholder">♣</div>
                            </div>
                            <div class="foundation card-slot" data-suit="spades" id="foundation-3">
                                <div class="foundation-placeholder">♠</div>
                            </div>
                        </div>
                    </div>
                    <div class="tableau">
                        <div class="tableau-column" data-column="0"></div>
                        <div class="tableau-column" data-column="1"></div>
                        <div class="tableau-column" data-column="2"></div>
                        <div class="tableau-column" data-column="3"></div>
                        <div class="tableau-column" data-column="4"></div>
                        <div class="tableau-column" data-column="5"></div>
                        <div class="tableau-column" data-column="6"></div>
                    </div>
                </div>
                <div class="game-overlay" style="display: none;">
                    <div class="overlay-message"></div>
                    <button class="play-again-btn win95-button">Play Again</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Control buttons
        this.container.querySelector('.new-game-btn').addEventListener('click', () => this.newGame());
        this.container.querySelector('.hint-btn').addEventListener('click', () => this.showHint());
        this.container.querySelector('.undo-btn').addEventListener('click', () => this.undo());
        this.container.querySelector('.help-btn').addEventListener('click', () => this.showHelp());
        this.container.querySelector('.play-again-btn').addEventListener('click', () => this.newGame());

        // Stock pile click
        this.container.querySelector('#stock').addEventListener('click', () => this.drawFromStock());

        // Foundation clicks
        const foundations = this.container.querySelectorAll('.foundation');
        foundations.forEach((foundation, index) => {
            foundation.addEventListener('click', () => this.handleFoundationClick(index));
        });

        // Tableau clicks
        const tableauColumns = this.container.querySelectorAll('.tableau-column');
        tableauColumns.forEach((column, index) => {
            column.addEventListener('click', (e) => this.handleTableauClick(index, e));
        });
    }

    newGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.moves = 0;
        this.time = 0;
        this.selectedCard = null;
        this.selectedPile = null;
        
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.updateDisplay();
        this.hideOverlay();
        this.startTimer();
    }

    createDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.deck.push({
                    suit: suit,
                    rank: rank,
                    color: this.colors[suit],
                    faceUp: false,
                    id: `${rank}-${suit}`
                });
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Clear all piles
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], []];

        // Deal to tableau
        for (let col = 0; col < 7; col++) {
            for (let row = 0; row <= col; row++) {
                const card = this.deck.pop();
                card.faceUp = (row === col); // Only top card face up
                this.tableau[col].push(card);
            }
        }

        this.renderGame();
    }

    drawFromStock() {
        if (this.deck.length > 0) {
            const card = this.deck.pop();
            card.faceUp = true;
            this.waste.push(card);
            this.moves++;
        } else if (this.waste.length > 0) {
            // Reset stock from waste
            while (this.waste.length > 0) {
                const card = this.waste.pop();
                card.faceUp = false;
                this.deck.push(card);
            }
        }
        
        this.updateDisplay();
        this.renderGame();
    }

    handleFoundationClick(foundationIndex) {
        if (this.selectedCard && this.selectedPile) {
            if (this.canMoveToFoundation(this.selectedCard, foundationIndex)) {
                this.moveCardToFoundation(foundationIndex);
            }
        }
        this.clearSelection();
    }

    handleTableauClick(columnIndex, event) {
        const column = this.tableau[columnIndex];
        const clickedCard = this.getClickedCard(event, column);
        
        if (this.selectedCard && this.selectedPile) {
            if (this.canMoveToTableau(this.selectedCard, columnIndex)) {
                this.moveCardToTableau(columnIndex);
            }
        } else if (clickedCard && clickedCard.faceUp) {
            this.selectCard(clickedCard, 'tableau', columnIndex);
        } else if (column.length > 0 && !column[column.length - 1].faceUp) {
            // Flip top card if face down
            column[column.length - 1].faceUp = true;
            this.moves++;
            this.score += 5;
        }
        
        this.updateDisplay();
        this.renderGame();
    }

    getClickedCard(event, column) {
        // Simplified - return top card for now
        return column.length > 0 ? column[column.length - 1] : null;
    }

    selectCard(card, pile, index) {
        this.clearSelection();
        this.selectedCard = card;
        this.selectedPile = { type: pile, index: index };
        
        // Visual selection
        const cardElement = this.findCardElement(card);
        if (cardElement) {
            cardElement.classList.add('selected');
        }
    }

    clearSelection() {
        this.selectedCard = null;
        this.selectedPile = null;
        
        // Clear visual selection
        const selected = this.container.querySelectorAll('.card.selected');
        selected.forEach(card => card.classList.remove('selected'));
    }

    canMoveToFoundation(card, foundationIndex) {
        const foundation = this.foundations[foundationIndex];
        const targetSuit = this.suits[foundationIndex];
        
        if (card.suit !== targetSuit) return false;
        
        if (foundation.length === 0) {
            return card.rank === 'A';
        } else {
            const topCard = foundation[foundation.length - 1];
            const cardValue = this.getCardValue(card.rank);
            const topValue = this.getCardValue(topCard.rank);
            return cardValue === topValue + 1;
        }
    }

    canMoveToTableau(card, columnIndex) {
        const column = this.tableau[columnIndex];
        
        if (column.length === 0) {
            return card.rank === 'K';
        } else {
            const topCard = column[column.length - 1];
            const cardValue = this.getCardValue(card.rank);
            const topValue = this.getCardValue(topCard.rank);
            return cardValue === topValue - 1 && card.color !== topCard.color;
        }
    }

    moveCardToFoundation(foundationIndex) {
        if (this.selectedPile.type === 'tableau') {
            const column = this.tableau[this.selectedPile.index];
            const card = column.pop();
            this.foundations[foundationIndex].push(card);
            this.score += 10;
        } else if (this.selectedPile.type === 'waste') {
            const card = this.waste.pop();
            this.foundations[foundationIndex].push(card);
            this.score += 10;
        }
        
        this.moves++;
        this.checkWin();
    }

    moveCardToTableau(columnIndex) {
        if (this.selectedPile.type === 'foundation') {
            const card = this.foundations[this.selectedPile.index].pop();
            this.tableau[columnIndex].push(card);
            this.score -= 15; // Penalty for moving from foundation
        } else if (this.selectedPile.type === 'waste') {
            const card = this.waste.pop();
            this.tableau[columnIndex].push(card);
            this.score += 5;
        }
        
        this.moves++;
    }

    getCardValue(rank) {
        const values = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
                        '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
        return values[rank];
    }

    checkWin() {
        const totalCards = this.foundations.reduce((sum, foundation) => sum + foundation.length, 0);
        if (totalCards === 52) {
            this.gameWon();
        }
    }

    gameWon() {
        this.gameState = 'won';
        this.stopTimer();
        this.score += 1000; // Bonus for winning
        this.showOverlay(`Congratulations!\nYou won in ${this.formatTime(this.time)}\nScore: ${this.score}\nMoves: ${this.moves}`);
    }

    startTimer() {
        this.stopTimer();
        this.timer = setInterval(() => {
            this.time++;
            this.updateDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        this.container.querySelector('.score-display').textContent = this.score;
        this.container.querySelector('.time-display').textContent = this.formatTime(this.time);
        this.container.querySelector('.moves-display').textContent = this.moves;
    }

    renderGame() {
        this.renderStock();
        this.renderWaste();
        this.renderFoundations();
        this.renderTableau();
    }

    renderStock() {
        const stockElement = this.container.querySelector('#stock');
        stockElement.innerHTML = this.deck.length > 0 ? '<div class="card-back"></div>' : '';
    }

    renderWaste() {
        const wasteElement = this.container.querySelector('#waste');
        wasteElement.innerHTML = '';
        if (this.waste.length > 0) {
            const topCard = this.waste[this.waste.length - 1];
            wasteElement.appendChild(this.createCardElement(topCard));
        }
    }

    renderFoundations() {
        this.foundations.forEach((foundation, index) => {
            const foundationElement = this.container.querySelector(`#foundation-${index}`);
            foundationElement.innerHTML = `<div class="foundation-placeholder">${['♥', '♦', '♣', '♠'][index]}</div>`;
            
            if (foundation.length > 0) {
                const topCard = foundation[foundation.length - 1];
                foundationElement.appendChild(this.createCardElement(topCard));
            }
        });
    }

    renderTableau() {
        this.tableau.forEach((column, columnIndex) => {
            const columnElement = this.container.querySelector(`[data-column="${columnIndex}"]`);
            columnElement.innerHTML = '';
            
            column.forEach((card, cardIndex) => {
                const cardElement = this.createCardElement(card);
                cardElement.style.top = `${cardIndex * 20}px`;
                columnElement.appendChild(cardElement);
            });
        });
    }

    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.faceUp ? 'face-up' : 'face-down'} ${card.color}`;
        cardElement.dataset.cardId = card.id;
        
        if (card.faceUp) {
            const suitSymbol = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }[card.suit];
            cardElement.innerHTML = `
                <div class="card-content">
                    <div class="card-rank">${card.rank}</div>
                    <div class="card-suit">${suitSymbol}</div>
                </div>
            `;
        } else {
            cardElement.innerHTML = '<div class="card-back-pattern"></div>';
        }
        
        return cardElement;
    }

    findCardElement(card) {
        return this.container.querySelector(`[data-card-id="${card.id}"]`);
    }

    showHint() {
        alert('Hint: Look for Aces to start foundations, or try to expose face-down cards in the tableau.');
    }

    undo() {
        alert('Undo functionality would be implemented here with move history.');
    }

    showHelp() {
        const helpText = `Solitaire Help:

Objective:
Move all cards to the four foundation piles, sorted by suit from Ace to King.

Rules:
• Tableau: Build down in alternating colors (red on black, black on red)
• Foundations: Build up by suit (A, 2, 3... J, Q, K)
• Only Kings can be placed in empty tableau columns
• Only Aces can start foundation piles

Controls:
• Click stock pile to draw cards
• Click cards to select/move them
• Click foundations or tableau to place selected cards

Scoring:
• Move to foundation: +10 points
• Move to tableau: +5 points
• Flip tableau card: +5 points
• Move from foundation: -15 points
• Win bonus: +1000 points`;

        alert(helpText);
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

    // Application lifecycle methods
    pause() {
        this.stopTimer();
    }

    resume() {
        if (this.gameState === 'playing') {
            this.startTimer();
        }
    }

    hasUnsavedChanges() {
        return this.gameState === 'playing' && this.moves > 0;
    }

    destroy() {
        this.stopTimer();
    }
}

// Initialize when window is loaded
if (typeof window !== 'undefined') {
    window.SolitaireGame = SolitaireGame;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolitaireGame;
}
