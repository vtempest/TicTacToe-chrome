<script>
  import { onMount } from 'svelte';
  import QuantumWaveOrbital from '$lib/components/QuantumWave/QuantumWaveOrbital.svelte';

  // Constants
  const EMPTY = 0;
  const PLAYER = 1;
  const COMPUTER = 2;

  // Reactive variables
  let boardSize = 3;
  let gameBoard = [];
  let scores = { lost: 0, ties: 0 };
  let isGameLocked = false;
  let moveHistory = [];

  $: winningLength = boardSize;
  $: winningCombinations = generateWinningCombinations(boardSize, winningLength);

  onMount(() => {
    initBoard();
  });

  function initBoard() {
    gameBoard = Array(boardSize * boardSize).fill(EMPTY);
    moveHistory = [];
    isGameLocked = false;
  }

  function generateWinningCombinations(size, length) {
    const combinations = [];

    // Helper function to add combinations
    const addCombination = (combo) => {
      if (combo.every(index => index < size * size)) {
        combinations.push(combo);
      }
    };

    // Rows and Columns
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - length; j++) {
        addCombination(Array.from({length}, (_, k) => i * size + j + k)); // Row
        addCombination(Array.from({length}, (_, k) => (j + k) * size + i)); // Column
      }
    }

    // Diagonals
    for (let i = 0; i <= size - length; i++) {
      for (let j = 0; j <= size - length; j++) {
        addCombination(Array.from({length}, (_, k) => (i + k) * size + j + k)); // Top-left to bottom-right
        addCombination(Array.from({length}, (_, k) => (i + k) * size + (j + length - 1 - k))); // Top-right to bottom-left
      }
    }

    return combinations;
  }

  function handleCellClick(index) {
    if (isGameLocked || gameBoard[index] !== EMPTY) return;

    moveHistory = [...moveHistory, [...gameBoard]];
    gameBoard[index] = PLAYER;
    gameBoard = [...gameBoard];

    if (!checkWin(PLAYER)) {
      computerMove();
    }
  }

  function computerMove() {
    const move = findBestMove();
    if (move !== -1) {
      gameBoard[move] = COMPUTER;
      gameBoard = [...gameBoard];
      checkWin(COMPUTER);
    } else {
      handleTie();
    }
  }

  function findBestMove() {
    // Win if possible
    const winMove = findWinningMove(COMPUTER);
    if (winMove !== -1) return winMove;

    // Block player's win
    const blockMove = findWinningMove(PLAYER);
    if (blockMove !== -1) return blockMove;

    // Create opportunities or block player's opportunities
    for (let combo of winningCombinations) {
      const computerCount = combo.filter(index => gameBoard[index] === COMPUTER).length;
      const emptyCount = combo.filter(index => gameBoard[index] === EMPTY).length;
      if (computerCount === Math.floor(winningLength / 2) && emptyCount === winningLength - Math.floor(winningLength / 2)) {
        return combo.find(index => gameBoard[index] === EMPTY);
      }
    }

    // Take center if available
    const centerIndex = Math.floor(boardSize * boardSize / 2);
    if (gameBoard[centerIndex] === EMPTY) return centerIndex;

    // Take any empty corner
    const cornerIndices = [0, boardSize - 1, boardSize * (boardSize - 1), boardSize * boardSize - 1];
    for (let index of cornerIndices) {
      if (gameBoard[index] === EMPTY) return index;
    }

    // Take any empty cell
    return gameBoard.findIndex(cell => cell === EMPTY);
  }

  function findWinningMove(player) {
    for (let combo of winningCombinations) {
      const playerCount = combo.filter(index => gameBoard[index] === player).length;
      const emptyCount = combo.filter(index => gameBoard[index] === EMPTY).length;
      if (playerCount === winningLength - 1 && emptyCount === 1) {
        return combo.find(index => gameBoard[index] === EMPTY);
      }
    }
    return -1;
  }

  function checkWin(player) {
    for (let combo of winningCombinations) {
      if (combo.every(index => gameBoard[index] === player)) {
        if (player === PLAYER) {
          alert("You actually won!");
        } else {
          scores.lost++;
          scores = { ...scores };
          isGameLocked = true;
          
          combo.forEach(index => {
            document.getElementById(`t${index}`).classList.add('lose');
          });
          
          setTimeout(() => {
            combo.forEach(index => {
              document.getElementById(`t${index}`).classList.remove('lose');
            });
            isGameLocked = false;
            resetBoard();
          }, 1000);
        }
        setTimeout(resetBoard, 500);
        return true;
      }
    }
    if (gameBoard.every(cell => cell !== EMPTY)) {
      handleTie();
      return true;
    }
    return false;
  }

  function handleTie() {
    scores.ties++;
    scores = { ...scores };
    setTimeout(resetBoard, 500);
  }

  function resetBoard() {
    initBoard();
  }

  function undoMove() {
    if (moveHistory.length > 0 && !isGameLocked) {
      gameBoard = moveHistory.pop();
      moveHistory = [...moveHistory];
    }
  }

  function handleGridSizeChange(event) {
    boardSize = parseInt(event.target.value);
    resetBoard();
  }
</script>

<div id="game-container">
  <div id="tictactoe">
    <div id="board" style="grid-template-columns: repeat({boardSize}, 1fr);">
      {#each gameBoard as cell, index}
        <div 
          id="t{index}" 
          class="cell {cell === PLAYER ? 'x' : cell === COMPUTER ? 'o' : ''}"
          on:click={() => handleCellClick(index)}
        >
          {#if cell === PLAYER}
            <svg viewBox="0 0 50 50" class="symbol">
              <line x1="10" y1="10" x2="40" y2="40" stroke="black" stroke-width="3" />
              <line x1="40" y1="10" x2="10" y2="40" stroke="black" stroke-width="3" />
            </svg>
          {:else if cell === COMPUTER}
            <svg viewBox="0 0 50 50" class="symbol">
              <circle cx="25" cy="25" r="20" fill="none" stroke="black" stroke-width="3" />
            </svg>
          {/if}
        </div>
      {/each}
    </div>
    <div id="controls">
      <div>
        <label for="gridSize">Grid Size:</label>
        <select id="gridSize" on:change={handleGridSizeChange}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
          <option value="6">6x6</option>
        </select>
      </div>
      <div>
        Lost: <span id="score-o">{scores.lost}</span>
        Ties: <span id="score-g">{scores.ties}</span>
      </div>
      <button on:click={undoMove} disabled={moveHistory.length === 0 || isGameLocked}>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" fill="currentColor" />
        </svg>
        Undo
      </button>
    </div>
  </div>
  <div id="quantum-orbital">
    <QuantumWaveOrbital />
  </div>
</div>

<style>
  #game-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    gap: 20px;
  }

  #tictactoe, #quantum-orbital {
    flex: 1;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  #board {
    display: grid;
    gap: 5px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    width: 100%;
    max-width: 300px;
  }

  .cell {
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid #333;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cell:hover {
    background-color: #e0e0e0;
  }

  .symbol {
    width: 60%;
    height: 60%;
  }

  #controls {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }

  #score-o, #score-g {
    font-weight: bold;
    margin: 0 5px;
  }
  
  .lose .o circle {
    stroke: red;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  button:hover {
    background-color: #45a049;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button svg {
    margin-right: 5px;
    width: 16px;
    height: 16px;
  }

  select {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  @media (max-width: 768px) {
    #game-container {
      flex-direction: column;
    }

    #tictactoe, #quantum-orbital {
      width: 100%;
    }
  }
</style>