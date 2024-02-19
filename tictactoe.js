/*Gameboard represents the state of my gameboard,
 **a factory function that exposes a dropToken and getBoard method,
 **and wrapped inside an IIFE so it cannot be reused to make additional instances.
 */

const gameboard = (function gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  //Method of getting my entire gameboard that my UI will need to render it.
  const getBoard = () => board;

  //Method that takes in a player's choice and drops the player's token if it's an available cell.
  const dropToken = (row, column, player) => {
    const availableCell = board[row][column].getValue() === "-";
    if (!availableCell) return;
    board[row][column].addToken(player);
  };

  return { getBoard, dropToken };
})();

/*A cell represents one square on the gameboard.
 ** = "-" if no token is in the square
 ** = "X" if player one's token
 ** = "O" if player two's token
 ** Exposes addToken, getValue, and clearValue methods
 */
function cell() {
  let value = "-";

  const addToken = (playerToken) => {
    value = playerToken;
  };

  const getValue = () => value;

  const clearValue = () => {
    value = "-";
  };

  return {
    addToken,
    getValue,
    clearValue,
  };
}

/* My gameController controls the flow of the game.
 **It keeps track of the current player, wins, and ties.
 **It contains the functions for resetting the scoreboard and playing a new game.
 */

const gameController = (function gameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = gameboard;

  const players = [
    { name: playerOneName, token: "X" },

    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  let gameWon = false;

  const getGameStatus = () => gameWon;

  let isTie = false;

  const getTieStatus = () => isTie;

  let wins = [];

  const playerOneScore = () => {
    const winCount = wins.filter((item) => item === players[0].token).length;
    return winCount;
  };

  const playerTwoScore = () => {
    const winCount = wins.filter((item) => item === players[1].token).length;
    return winCount;
  };

  const newGame = () => {
    switchPlayerTurn();
    gameWon = false;
    isTie = false;

    board.getBoard().forEach((row) => {
      row.forEach((column) => {
        column.clearValue();
      });
    });
  };

  const resetGame = () => {
    newGame();
    wins = [];
  };

  const checkWinner = () => {
    const [
      //using array destructuring to assign variable names to each cell
      [cell0, cell1, cell2],
      [cell3, cell4, cell5],
      [cell6, cell7, cell8],
    ] = board.getBoard();

    const winCombinations = [
      [cell0, cell1, cell2], //row combos
      [cell3, cell4, cell5],
      [cell6, cell7, cell8],
      [cell0, cell3, cell6], //column combos
      [cell1, cell4, cell7],
      [cell2, cell5, cell8],
      [cell0, cell4, cell8], //diagnal combos
      [cell2, cell4, cell6],
    ];

    for (let i = 0; i < winCombinations.length; i++) {
      const winCombination = winCombinations[i];
      const cellA = winCombination[0].getValue();
      const cellB = winCombination[1].getValue();
      const cellC = winCombination[2].getValue();

      if (cellA !== "-" && cellB !== "-" && cellC !== "-") {
        if (cellA === cellB && cellB === cellC) {
          gameWon = true;
          wins.push(getActivePlayer().token);
          break;
        }
      }
    }
  };

  const checkDraw = () => {
    let availableCells = 0;

    for (let i = 0; i < board.getBoard().length; i++) {
      for (let j = 0; j < board.getBoard()[i].length; j++) {
        board.getBoard()[i][j].getValue() === "-"
          ? availableCells++
          : (availableCells = availableCells);
      }
    }
    if (availableCells === 0 && gameWon === false) {
      isTie = true;
    }
  };

  const playRound = (row, column) => {
    board.dropToken(row, column, getActivePlayer().token);
    checkWinner();
    checkDraw();

    if (gameWon) {
      return;
    } else if (isTie) {
      return;
    } else {
      switchPlayerTurn();
    }
  };

  return {
    getBoard: board.getBoard,
    getActivePlayer,
    getGameStatus,
    playerOneScore,
    playerTwoScore,
    getTieStatus,
    playRound,
    resetGame,
    newGame,
  };
})();

/*My screenController reads and displays the game's state onto the screen.
 **It has access to several methods from the gameController,
 **such as newGame, resetGame, and playRound.
 */

const screenController = (function screenController() {
  const game = gameController;
  const boardDiv = document.querySelector(".board");
  const modal = document.querySelector("#modal");
  const overlay = document.querySelector("#overlay");
  const closeBtn = document.querySelector(".modal-close");
  const resetBtns = document.querySelectorAll(".reset");
  const newGameBtns = document.querySelectorAll(".new-game");

  const openModal = () => {
    modal.classList.add("active");
    overlay.classList.add("active");
  };

  const closeModal = () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  };

  const resetGame = () => {
    game.resetGame();
    closeModal();
    updateScreen();
  };

  const newGame = () => {
    game.newGame();
    closeModal();
    updateScreen();
  };

  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const playerTurnDivs = document.querySelectorAll(".turn");
    const gameStatus = game.getGameStatus();
    const isTie = game.getTieStatus();
    const playerOneScore = game.playerOneScore();
    const playerTwoScore = game.playerTwoScore();
    const score1 = document.querySelector(".score1");
    const score2 = document.querySelector(".score2");

    boardDiv.textContent = "";
    score1.textContent = `Score: ${playerOneScore}`;
    score2.textContent = `Score: ${playerTwoScore}`;

    if (gameStatus) {
      playerTurnDivs.forEach((div) => {
        div.textContent = `${activePlayer.name} won!!!`;
      });
      openModal();
    } else if (isTie) {
      playerTurnDivs.forEach((div) => {
        div.textContent = "It's a tie :(";
      });
      openModal();
    } else {
      playerTurnDivs.forEach((div) => {
        div.textContent = `${activePlayer.name}'s turn...`;
      });
    }

    board.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const squareBtn = document.createElement("button");
        squareBtn.classList.add("square");
        squareBtn.dataset.column = columnIndex;
        squareBtn.dataset.row = rowIndex;
        squareBtn.textContent = column.getValue();
        boardDiv.appendChild(squareBtn);
      });
    });
  };

  function boardClickHandler(e) {
    if (e.target.textContent !== "-") {
      return;
    } else {
      const selectedColumn = e.target.dataset.column;
      const selectedRow = e.target.dataset.row;
      const gameWon = game.getGameStatus();

      if (!selectedColumn) return;
      if (!selectedRow) return;
      if (gameWon) return; // Does not allow clicks after win.
      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
  }

  //Event listeners:

  boardDiv.addEventListener("click", boardClickHandler);
  closeBtn.addEventListener("click", closeModal);
  resetBtns.forEach((btn) => {
    btn.addEventListener("click", resetGame);
  });
  newGameBtns.forEach((btn) => {
    btn.addEventListener("click", newGame);
  });

  //Initial render:

  updateScreen();
})();

screenController();
