/**
 * Minesweeper Game for NosytOS95
 * Based on the implementation by Ania Kubow (https://github.com/kubowania/minesweeper)
 * Adapted for NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the game when the Minesweeper window is opened
  const minesweeperIcon = document.getElementById('minesweeper-icon');
  if (minesweeperIcon) {
    minesweeperIcon.addEventListener('click', initMinesweeper);
  }

  // Also initialize when the window is already open (for refresh cases)
  initMinesweeperIfWindowOpen();
});

function initMinesweeperIfWindowOpen() {
  const minesweeperWindow = document.getElementById('minesweeper-window');
  if (minesweeperWindow && minesweeperWindow.style.display === 'block') {
    initMinesweeper();
  }
}

function initMinesweeper() {
  const minesweeperWindow = document.getElementById('minesweeper-window');
  if (!minesweeperWindow) return;

  // Get the content area of the window
  const contentArea = minesweeperWindow.querySelector('.window-content');
  if (!contentArea) return;

  // Check if the game is already initialized
  if (contentArea.querySelector('.minesweeper-container')) return;

  // Create the game container
  const container = document.createElement('div');
  container.className = 'minesweeper-container';
  
  // Create the grid
  const grid = document.createElement('div');
  grid.className = 'minesweeper-grid';
  
  // Create the status area
  const statusArea = document.createElement('div');
  statusArea.className = 'minesweeper-status';
  
  // Create the flags counter
  const flagsCounter = document.createElement('div');
  flagsCounter.innerHTML = 'Flags left: <span id="minesweeper-flags-left">0</span>';
  
  // Create the result display
  const resultDisplay = document.createElement('div');
  resultDisplay.id = 'minesweeper-result';
  
  // Append elements to the container
  statusArea.appendChild(flagsCounter);
  statusArea.appendChild(resultDisplay);
  container.appendChild(grid);
  container.appendChild(statusArea);
  
  // Clear the content area and append the game container
  contentArea.innerHTML = '';
  contentArea.appendChild(container);
  
  // Start the game
  startMinesweeperGame(grid, document.getElementById('minesweeper-flags-left'), resultDisplay);
}

function startMinesweeperGame(grid, flagsLeft, result) {
  const width = 10;
  const bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  // Create the game board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    // Get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width*width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', 'minesweeper-square-' + i);
      square.classList.add(shuffledArray[i]);
      square.classList.add('minesweeper-square');
      grid.appendChild(square);
      squares.push(square);

      // Normal click
      square.addEventListener('click', function(e) {
        click(square);
      });

      // Right click
      square.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        addFlag(square);
      });
    }

    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = (i % width === 0);
      const isRightEdge = (i % width === width - 1);

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
        if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
        if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
        if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
        if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
        if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
        squares[i].setAttribute('data', total);
      }
    }
  }

  // Add flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains('checked') && (flags < bombAmount)) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = ' 🚩';
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  }

  // Click on square actions
  function click(square) {
    let currentId = square.id.replace('minesweeper-square-', '');
    if (isGameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;
    if (square.classList.contains('bomb')) {
      gameOver(square);
    } else {
      let total = square.getAttribute('data');
      if (total != 0) {
        square.classList.add('checked');
        if (total == 1) square.classList.add('one');
        if (total == 2) square.classList.add('two');
        if (total == 3) square.classList.add('three');
        if (total == 4) square.classList.add('four');
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add('checked');
  }

  // Check neighboring squares once square is clicked
  function checkSquare(square, currentId) {
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 - width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = parseInt(currentId) - width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 - width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = parseInt(currentId) + 1;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 + width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 + width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = parseInt(currentId) + width;
        const newSquare = document.getElementById('minesweeper-square-' + newId);
        click(newSquare);
      }
    }, 10);
  }

  // Game over
  function gameOver(square) {
    result.innerHTML = 'BOOM! Game Over!';
    isGameOver = true;

    // Show ALL the bombs
    squares.forEach(square => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
        square.classList.remove('bomb');
        square.classList.add('checked');
      }
    });
  }

  // Check for win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = 'YOU WIN!';
        isGameOver = true;
      }
    }
  }

  // Create the board and start the game
  createBoard();
}
