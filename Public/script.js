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

function checkWinner() {
  for (const [a, b, c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: null, combo: [] };
  return null;
}

function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  const cell = e.currentTarget;
  cell.classList.add("taken", currentPlayer.toLowerCase());
  const mark = document.createElement("span");
  mark.className = "mark";
  mark.textContent = currentPlayer;
  cell.appendChild(mark);

  const result = checkWinner();

  if (result) {
    gameOver = true;
    if (result.winner) {
      result.combo.forEach(i => cells[i].classList.add("winning"));
      scores[result.winner]++;
      xScoreEl.textContent = scores.X;
      oScoreEl.textContent = scores.O;
      setStatus(`Player ${result.winner} wins!`, "winner");
    } else {
      scores.D++;
      drawScoreEl.textContent = scores.D;
      setStatus("It's a draw!", "draw");
    }
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`Player ${currentPlayer}'s turn`, currentPlayer === "X" ? "x-turn" : "o-turn");
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