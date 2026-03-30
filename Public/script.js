const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset-btn");
const xScoreEl = document.getElementById("x-score");
const oScoreEl = document.getElementById("o-score");
const drawScoreEl = document.getElementById("draw-score");

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0, D: 0 };

function setStatus(msg, cls) {
  statusEl.textContent = msg;
  statusEl.className = "status " + (cls || "");
}

function checkWinner(b) {
  for (const [a, bc, c] of WINNING_COMBOS) {
    if (b[a] && b[a] === b[bc] && b[a] === b[c]) {
      return b[a];
    }
  }
  if (b.every(cell => cell !== null)) return "draw";
  return null;
}

function getWinningCombo(b) {
  for (const combo of WINNING_COMBOS) {
    const [a, bc, c] = combo;
    if (b[a] && b[a] === b[bc] && b[a] === b[c]) return combo;
  }
  return null;
}

// Minimax algorithm
function minimax(b, isMaximizing) {
  const result = checkWinner(b);
  if (result === "O") return 10;
  if (result === "X") return -10;
  if (result === "draw") return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "O";
        best = Math.max(best, minimax(b, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = "X";
        best = Math.min(best, minimax(b, true));
        b[i] = null;
      }
    }
    return best;
  }
}

function getBotMove() {
  let bestScore = -Infinity;
  let bestMove = null;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function placeMarker(idx, player) {
  board[idx] = player;
  const cell = cells[idx];
  cell.classList.add("taken", player.toLowerCase());
  const mark = document.createElement("span");
  mark.className = "mark";
  mark.textContent = player;
  cell.appendChild(mark);
}

function handleResult() {
  const winner = checkWinner(board);
  if (winner) {
    gameOver = true;
    if (winner === "draw") {
      scores.D++;
      drawScoreEl.textContent = scores.D;
      setStatus("It's a draw!", "draw");
    } else {
      const combo = getWinningCombo(board);
      combo.forEach(i => cells[i].classList.add("winning"));
      scores[winner]++;
      xScoreEl.textContent = scores.X;
      oScoreEl.textContent = scores.O;
      setStatus(`Player ${winner} wins!`, "winner");
    }
    return true;
  }
  return false;
}

function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx] || currentPlayer !== "X") return;

  placeMarker(idx, "X");
  if (handleResult()) return;

  currentPlayer = "O";
  setStatus("Bot is thinking...", "o-turn");

  // Small delay so it feels natural
  setTimeout(() => {
    const botMove = getBotMove();
    placeMarker(botMove, "O");
    if (handleResult()) return;
    currentPlayer = "X";
    setStatus("Player X's turn", "x-turn");
  }, 300);
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  cells.forEach(cell => {
    cell.className = "cell";
    cell.innerHTML = "";
  });
  setStatus("Player X's turn", "x-turn");
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
resetBtn.addEventListener("click", resetGame);
setStatus("Player X's turn", "x-turn");