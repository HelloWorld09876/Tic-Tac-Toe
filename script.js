/**
 * MTC Tic-Tac-Toe
 * Developed for MTC Recruitment Task
 * 
 * This file handles all game logic, state management, and DOM interactions.
 * It includes an implementation of the Minimax algorithm for the unbeatable AI mode.
 */

// ----------------------------------------------------------------------------
// GAME CONSTANTS
// ----------------------------------------------------------------------------

const PLAYER_X = 'X';
const PLAYER_O = 'O';

/**
 * Winning combinations representing all possible ways to win the game.
 * Indices correspond to the 3x3 grid (0-8).
 * [Rows, Columns, Diagonals]
 */
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// ----------------------------------------------------------------------------
// GAME STATE
// ----------------------------------------------------------------------------

/**
 * Represents the 3x3 game board.
 * - '': Empty cell
 * - 'X': Player X
 * - 'O': Player O
 */
let board = ['', '', '', '', '', '', '', '', ''];

let currentPlayer = PLAYER_X;
let gameActive = true;

/**
 * Game Mode configuration.
 * - 'pvp': Player vs Player (Local)
 * - 'pvc-easy': Player vs Computer (Random moves)
 * - 'pvc-hard': Player vs Computer (Minimax Algorithm)
 */
let gameMode = 'pvp';

let scores = { x: 0, o: 0, draws: 0 };

// ----------------------------------------------------------------------------
// DOM ELEMENTS
// ----------------------------------------------------------------------------

const cells = document.querySelectorAll('.cell');
const statusMsg = document.getElementById('status-msg');
const restartBtn = document.getElementById('restart-btn');
const newGameBtn = document.getElementById('new-game-btn');
const gameModeSelect = document.getElementById('game-mode');
const scoreXElement = document.querySelector('#score-x .value');
const scoreOElement = document.querySelector('#score-o .value');
const scoreDrawsElement = document.querySelector('.ties .value');
const modal = document.getElementById('result-modal');
const modalMessage = document.getElementById('modal-message');
const winningLine = document.getElementById('winning-line');

// ----------------------------------------------------------------------------
// INITIALIZATION & EVENT LISTENERS
// ----------------------------------------------------------------------------

/**
 * Initializes the game by setting up event listeners and resetting the state.
 * Should be called once when the script loads.
 */
function initGame() {
    cells.forEach(cell => {
        // Prevent multiple listeners if re-initialized, technically optional here but good practice
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick);
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });

    restartBtn.addEventListener('click', resetGame);
    document.getElementById('reset-score-btn').addEventListener('click', resetScore);
    newGameBtn.addEventListener('click', resetGame);

    gameModeSelect.addEventListener('change', (e) => {
        gameMode = e.target.value;
        resetGame(); // Reset board when mode changes
    });

    updateStatus();
}

// ----------------------------------------------------------------------------
// GAME LOGIC
// ----------------------------------------------------------------------------

/**
 * Handles the click event for a game cell.
 * Validates the move and initiates the computer's turn if applicable.
 * @param {Event} e - The click event
 */
function handleCellClick(e) {
    const clickedCell = e.target;
    // index stored in data-index HTML attribute
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Validate: Ignore if cell is taken or game is over
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Execute User's Move
    makeMove(clickedCellIndex, currentPlayer);

    // Trigger Computer Move if in PvC mode and game is still active
    if (gameActive && gameMode.startsWith('pvc') && currentPlayer === PLAYER_O) {
        // Add a slight artificial delay for a better UX (feels like "thinking")
        setTimeout(makeComputerMove, 400);
    }
}

/**
 * Updates the internal board state and the UI for a specific move.
 * Checks for win/draw conditions after the move.
 * @param {number} index - The board index (0-8)
 * @param {string} player - The player symbol ('X' or 'O')
 */
function makeMove(index, player) {
    board[index] = player;

    // UI Update
    const cellBox = cells[index];
    cellBox.textContent = player;
    cellBox.classList.add(player.toLowerCase());

    // Check Game Status
    if (checkWin(board, player)) {
        endGame(false, player); // Win
    } else if (isDraw(board)) {
        endGame(true); // Draw
    } else {
        // Switch Turns
        currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        updateStatus();
    }
}

// ----------------------------------------------------------------------------
// COMPUTER AI (EASY & HARD)
// ----------------------------------------------------------------------------

/**
 * Determines and executes the computer's move based on the selected difficulty.
 */
function makeComputerMove() {
    if (!gameActive) return;

    let moveIndex;
    if (gameMode === 'pvc-easy') {
        moveIndex = getRandomMove();
    } else if (gameMode === 'pvc-hard') {
        moveIndex = getBestMove(); // Uses Minimax
    }

    if (moveIndex !== null) {
        makeMove(moveIndex, PLAYER_O);
    }
}

/**
 * EASY MODE: Returns a random available index from the board.
 * @returns {number|null} Index of the move or null if no moves available.
 */
function getRandomMove() {
    const availableMoves = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (availableMoves.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
}

/**
 * HARD MODE: Uses the Minimax algorithm to find the optimal move.
 * @returns {number|null} Index of the best move.
 */
function getBestMove() {
    let bestScore = -Infinity;
    let move = null;

    // Evaluate all possible moves for the computer (O)
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = PLAYER_O; // Try move
            let score = minimax(board, 0, false); // Calculate score
            board[i] = ''; // Undo move

            // Maximize the score for Computer
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

/**
 * The Minimax Recursive Algorithm.
 * Evaluates the board state to determine the best possible outcome.
 * 
 * Scores:
 * - Computer (O) win: +10 (minus depth for faster wins)
 * - Player (X) win: -10 (plus depth for slower losses)
 * - Draw: 0
 * 
 * @param {Array} currentBoard - The current state of the board.
 * @param {number} depth - Recursion depth (how many moves ahead).
 * @param {boolean} isMaximizing - True if it's Computer's turn (maximize score), False for Human (minimize score).
 * @returns {number} The score of the board state.
 */
function minimax(currentBoard, depth, isMaximizing) {
    // Terminal States
    if (checkWinForMinimax(currentBoard, PLAYER_O)) return 10 - depth;
    if (checkWinForMinimax(currentBoard, PLAYER_X)) return depth - 10;
    if (isDraw(currentBoard)) return 0;

    if (isMaximizing) {
        // Computer's Turn: Maximize Score
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = PLAYER_O;
                let score = minimax(currentBoard, depth + 1, false);
                currentBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Human's Turn: Minimize Score (Assume human plays perfectly)
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === '') {
                currentBoard[i] = PLAYER_X;
                let score = minimax(currentBoard, depth + 1, true);
                currentBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/**
 * Helper function for Minimax to detect wins without triggering UI effects.
 * @param {Array} b - Board array
 * @param {string} player - Player symbol
 * @returns {boolean} True if player has won
 */
function checkWinForMinimax(b, player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => b[index] === player);
    });
}

// ----------------------------------------------------------------------------
// WIN/DRAW DETECTION
// ----------------------------------------------------------------------------

/**
 * Checks if a specific player has won the game.
 * If a win is detected on the active game board, it also triggers the visual line draw.
 * @param {Array} currentBoard 
 * @param {string} player 
 * @returns {boolean}
 */
function checkWin(currentBoard, player) {
    const winningCombo = WINNING_COMBINATIONS.find(combination => {
        return combination.every(index => currentBoard[index] === player);
    });

    if (winningCombo) {
        // Visual polish: Draw the line only if this is the live game checking for a result
        if (gameActive) drawWinningLine(winningCombo);
        return true;
    }
    return false;
}

/**
 * Checks if the board is full (Draw condition).
 * @param {Array} currentBoard 
 * @returns {boolean}
 */
function isDraw(currentBoard) {
    return currentBoard.every(cell => cell !== '');
}

// ----------------------------------------------------------------------------
// GAME CONTROL & UI
// ----------------------------------------------------------------------------

/**
 * Ends the game, updates scores, and displays the result modal.
 * @param {boolean} draw - True if it's a draw
 * @param {string|null} winner - 'X' or 'O' if someone won
 */
function endGame(draw, winner = null) {
    gameActive = false;

    if (draw) {
        statusMsg.textContent = "It's a Draw!";
        modalMessage.textContent = "It's a Draw!";
        scores.draws++;
        scoreDrawsElement.textContent = scores.draws;
    } else {
        statusMsg.textContent = `${winner} Wins!`;
        modalMessage.textContent = `${winner} Wins!`;

        if (winner === PLAYER_X) {
            scores.x++;
            scoreXElement.textContent = scores.x;
        } else {
            scores.o++;
            scoreOElement.textContent = scores.o;
        }
    }

    // Show modal after small delay
    setTimeout(() => {
        modal.style.display = 'flex';
    }, 800);
}

/**
 * Updates the status message to indicate whose turn it is.
 */
function updateStatus() {
    if (!gameActive) return;
    statusMsg.textContent = `Player ${currentPlayer}'s Turn`;
}

/**
 * Resets the game board for a new round.
 * Does NOT reset the scores.
 */
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = PLAYER_X;

    // Clear UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    modal.style.display = 'none';
    winningLine.style.width = '0';
    winningLine.style.display = 'none';

    updateStatus();

    // If resetting against computer and computer is X (not implemented here, but good for future),
    // we would trigger computer move. Default is Player X starts.
}

/**
 * Resets BOTH the game board (via resetGame) and the scoreboard.
 * Used for "Reset Score" button.
 */
function resetScore() {
    scores = { x: 0, o: 0, draws: 0 };
    scoreXElement.textContent = '0';
    scoreOElement.textContent = '0';
    scoreDrawsElement.textContent = '0';
    resetGame();
}

/**
 * Draws a visual line through the winning combination.
 * Calculates position, length, and rotation dynamically based on cell coordinates.
 * @param {Array} combination - Array of 3 indices [a, b, c]
 */
function drawWinningLine(combination) {
    const cellA = cells[combination[0]]; // Start cell
    const cellC = cells[combination[2]]; // End cell

    const boardRect = document.getElementById('board').getBoundingClientRect();
    const rectA = cellA.getBoundingClientRect();
    const rectC = cellC.getBoundingClientRect();

    // Calculate center points relative to board container
    const x1 = rectA.left + rectA.width / 2 - boardRect.left;
    const y1 = rectA.top + rectA.height / 2 - boardRect.top;
    const x2 = rectC.left + rectC.width / 2 - boardRect.left;
    const y2 = rectC.top + rectC.height / 2 - boardRect.top;

    // Calculate length (distance) and angle
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Apply styles to the line element
    winningLine.style.width = `${length}px`;
    winningLine.style.transform = `rotate(${angle}deg)`;
    winningLine.style.top = `${y1 - 2.5}px`; // Center vertically (assuming 5px thickness)
    winningLine.style.left = `${x1}px`;
    winningLine.style.display = 'block';
}

// ----------------------------------------------------------------------------
// INITIALIZE
// ----------------------------------------------------------------------------
initGame();
