// DOM Elements
const boardSizeInput = document.getElementById('boardSizeInput');
const setSizeBtn = document.getElementById('setSizeBtn');
const startVisualizationBtn = document.getElementById('startVisualizationBtn');
const solutionNavigator = document.getElementById('solutionNavigator');
const prevSolutionBtn = document.getElementById('prevSolutionBtn');
const nextSolutionBtn = document.getElementById('nextSolutionBtn');
const solutionCounterText = document.getElementById('solutionCounterText');
const chessBoard = document.getElementById('chessBoard');
const toastContainer = document.getElementById('toastContainer');

// State
let boardSize = 4;
let board = [];
let solutions = [];
let currentSolution = 0;
let isAnimating = false;
let chessCells = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeBoard(boardSize);
  
  // Event listeners
  setSizeBtn.addEventListener('click', handleSizeChange);
  startVisualizationBtn.addEventListener('click', startVisualization);
  prevSolutionBtn.addEventListener('click', showPrevSolution);
  nextSolutionBtn.addEventListener('click', showNextSolution);
});

// Helper Functions
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}

function initializeBoard(n) {
  // Clear the board
  chessBoard.innerHTML = '';
  
  // Create new board matrix
  board = Array(n).fill().map(() => Array(n).fill(0));
  chessCells = Array(n).fill().map(() => Array(n));
  
  // Set the grid size
  chessBoard.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  chessBoard.style.width = `${Math.min(500, n * 50)}px`;
  chessBoard.style.height = `${Math.min(500, n * 50)}px`;
  
  // Create cells
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const cell = document.createElement('div');
      cell.className = `chess-cell flex items-center justify-center transition-all duration-300 ${
        (row + col) % 2 === 0 ? 'bg-black/40' : 'bg-black/10'
      }`;
      
      const cellSize = `${Math.min(50, 500 / n)}px`;
      cell.style.width = cellSize;
      cell.style.height = cellSize;
      
      chessBoard.appendChild(cell);
      chessCells[row][col] = cell;
    }
  }
  
  // Hide solution navigator
  solutionNavigator.style.display = 'none';
  solutions = [];
  currentSolution = 0;
}

function handleSizeChange() {
  const n = parseInt(boardSizeInput.value);
  if (isNaN(n) || n < 1) {
    showToast("Please enter a valid board size", "error");
    return;
  }

  if (n > 12) {
    showToast("Maximum board size is 12 for performance reasons", "error");
    return;
  }

  boardSize = n;
  initializeBoard(n);
  showToast(`Board size set to ${n}x${n}`);
}

function isSafe(board, row, col) {
  // Check row
  for (let i = 0; i < col; i++) {
    if (board[row][i] === 1) return false;
  }

  // Check upper diagonal
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 1) return false;
  }

  // Check lower diagonal
  for (let i = row, j = col; i < board.length && j >= 0; i++, j--) {
    if (board[i][j] === 1) return false;
  }

  return true;
}

async function solveNQueensUtil(col, tempBoard, allSolutions, animate = false) {
  if (col >= boardSize) {
    // Deep copy the solution and add it to allSolutions
    allSolutions.push(tempBoard.map(row => [...row]));
    return true;
  }

  let foundSolution = false;

  for (let row = 0; row < boardSize; row++) {
    // Check if placing a queen is safe
    if (isSafe(tempBoard, row, col)) {
      // Place queen
      tempBoard[row][col] = 1;
      
      // If animating, update the board and highlight the placed queen
      if (animate) {
        updateBoardDisplay(tempBoard);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        highlightCell(chessCells[row][col], '#22c55e');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Recursively place queens in remaining columns
      const result = await solveNQueensUtil(col + 1, tempBoard, allSolutions, animate);
      foundSolution = foundSolution || result;

      // Backtrack: remove the queen
      tempBoard[row][col] = 0;
      
      // If animating, update the board and highlight the removed queen
      if (animate) {
        updateBoardDisplay(tempBoard);
        
        highlightCell(chessCells[row][col], '#ef4444');
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }

  return foundSolution;
}

function updateBoardDisplay(boardState) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = chessCells[row][col];
      // Remove existing queen
      cell.innerHTML = '';
      
      if (boardState[row][col] === 1) {
        const queen = document.createElement('div');
        queen.className = 'queen-icon animate-pulse';
        // Use a smaller size for the queen that scales with board size
        const fontSize = Math.min(24, 250 / boardSize);
        queen.style.fontSize = `${fontSize}px`;
        queen.textContent = '♕';
        queen.style.color = 'gold';
        queen.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
        cell.appendChild(queen);
      }
    }
  }
}

function highlightCell(cell, color = '#f97316', duration = 800) {
  const originalBackgroundColor = window.getComputedStyle(cell).backgroundColor;
  
  return cell.animate([
    { backgroundColor: originalBackgroundColor },
    { backgroundColor: color, offset: 0.5 },
    { backgroundColor: originalBackgroundColor }
  ], {
    duration,
    easing: 'ease-in-out'
  });
}

async function findAllSolutions() {
  const allSolutions = [];
  const tempBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
  
  await solveNQueensUtil(0, tempBoard, allSolutions, false);
  return allSolutions;
}

async function startVisualization() {
  if (isAnimating) return;
  
  try {
    isAnimating = true;
    startVisualizationBtn.textContent = 'Visualizing...';
    startVisualizationBtn.disabled = true;
    setSizeBtn.disabled = true;
    
    // Clear the board
    initializeBoard(boardSize);
    
    // First find all solutions without animation
    const allSolutions = await findAllSolutions();
    
    if (allSolutions.length === 0) {
      showToast(`No solution exists for ${boardSize}-Queens problem`, "error");
      isAnimating = false;
      startVisualizationBtn.textContent = 'Start Visualization';
      startVisualizationBtn.disabled = false;
      setSizeBtn.disabled = false;
      return;
    }
    
    solutions = allSolutions;
    currentSolution = 0;
    
    // Now demonstrate the process with animation
    const animTempBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
    const animationSolutions = [];
    
    await solveNQueensUtil(0, animTempBoard, animationSolutions, true);
    
    // Show the first solution after animation is complete
    updateBoardDisplay(allSolutions[0]);
    
    // Show solution navigator
    solutionNavigator.style.display = 'flex';
    solutionCounterText.textContent = `Solution 1 of ${allSolutions.length}`;
    
    showToast(`Found ${allSolutions.length} solution${allSolutions.length !== 1 ? 's' : ''} for ${boardSize}-Queens problem`);
  } catch (error) {
    console.error("Error during visualization:", error);
    showToast("Error during visualization", "error");
  } finally {
    isAnimating = false;
    startVisualizationBtn.textContent = 'Start Visualization';
    startVisualizationBtn.disabled = false;
    setSizeBtn.disabled = false;
  }
}

function showSolution(index) {
  if (index >= 0 && index < solutions.length) {
    currentSolution = index;
    updateBoardDisplay(solutions[index]);
    solutionCounterText.textContent = `Solution ${index + 1} of ${solutions.length}`;
  }
}

function showNextSolution() {
  const nextIndex = (currentSolution + 1) % solutions.length;
  showSolution(nextIndex);
}

function showPrevSolution() {
  const prevIndex = (currentSolution - 1 + solutions.length) % solutions.length;
  showSolution(prevIndex);
}
