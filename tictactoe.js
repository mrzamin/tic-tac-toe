/*The Gameboard represents the state of the board.
I am storing the gameboard as an array inside of a gameboard object.
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

  //Method of getting our entire gameboard that our UI will need to render it.
  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    const availableCoordinate = board[row][column].getValue() === "-";

    if (!availableCoordinate) return;
    board[row][column].addToken(player);
  };

  return { getBoard, dropToken };
})();

function cell() {
  let value = "-";

  const addToken = (playerToken) => {
    value = playerToken;
  };

  const clearCellValue = () => {
    value = "-";
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
    clearCellValue,
  };
}

function gameController(
  playerOneName = "Player 1",
  playerTwoName = "Player 2"
) {
  const board = gameboard;

  const gameArray = board.getBoard();

  const players = [
    { name: playerOneName, token: "X" },

    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  let gameOver = false;

  let isTie = false;

  let wins = [];

  const getPlayerOneScore = () => {
    const playerOneWinCount = wins.filter(
      (item) => item == players[0].token
    ).length;
    return playerOneWinCount;
  };

  const getPlayerTwoScore = () => {
    const playerTwoWinCount = wins.filter(
      (item) => item == players[1].token
    ).length;
    return playerTwoWinCount;
  };

  const getGameStatus = () => gameOver;

  const getTieStatus = () => isTie;

  const resetGame = () => {
    activePlayer = players[0];
    gameOver = false;
    isTie = false;
    wins = [];

    gameArray.forEach((row) => {
      row.forEach((column) => {
        column.clearCellValue();
      });
    });
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const checkWinner = () => {
    const [
      //use array destructuring to assign variable names to each cell
      [cell0, cell1, cell2],
      [cell3, cell4, cell5],
      [cell6, cell7, cell8],
    ] = gameArray;

    const winCombinations = [
      [cell0, cell1, cell2], //rows
      [cell3, cell4, cell5],
      [cell6, cell7, cell8],
      [cell0, cell3, cell6], //columns
      [cell1, cell4, cell7],
      [cell2, cell5, cell8],
      [cell0, cell4, cell8], //diagnals
      [cell2, cell4, cell6],
    ];

    for (let i = 0; i < winCombinations.length; i++) {
      const winCombination = winCombinations[i];
      const cellA = winCombination[0].getValue();
      const cellB = winCombination[1].getValue();
      const cellC = winCombination[2].getValue();

      if (cellA !== "-" && cellB !== "-" && cellC !== "-") {
        if (cellA === cellB && cellB === cellC) {
          gameOver = true;
          wins.push(getActivePlayer().token);
          break;
        }
      }
    }
  };

  const checkDraw = () => {
    let emptyCells = 0;
    const gameWon = gameOver;

    for (let i = 0; i < gameArray.length; i++) {
      for (let j = 0; j < gameArray[i].length; j++) {
        gameArray[i][j].getValue() == "-"
          ? emptyCells++
          : (emptyCells = emptyCells);
      }
    }
    if (emptyCells == 0 && gameWon == false) {
      isTie = true;
    }
  };

  const playRound = (row, column) => {
    board.dropToken(row, column, getActivePlayer().token);
    // console.log(`Dropping ${getActivePlayer().name}'s token...`);
    checkWinner();
    checkDraw();

    if (gameOver) {
      return;
    } else if (isTie) {
      return;
    } else {
      switchPlayerTurn();
    }
  };

  return {
    playRound,
    getActivePlayer,
    getGameStatus,
    getPlayerOneScore,
    getPlayerTwoScore,
    getTieStatus,
    getBoard: board.getBoard,
    resetGame,
  };
}

function screenController() {
  const game = gameController();
  const boardDiv = document.querySelector(".board");
  const playerTurnDiv = document.querySelector(".turn");
  const modal = document.querySelector("#modal");
  const overlay = document.querySelector("#overlay");
  const closeBtn = document.querySelector(".modal-close");
  const result = document.querySelector(".result");
  const resetBtn = document.querySelector(".reset");

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
    updateScreen();
  };

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const playerOneScore = game.getPlayerOneScore();
    const playerTwoScore = game.getPlayerTwoScore();
    const activePlayer = game.getActivePlayer();
    const gameStatus = game.getGameStatus();
    const isTie = game.getTieStatus();
    const score1 = document.querySelector(".score1");
    const score2 = document.querySelector(".score2");

    score1.textContent = `${playerOneScore}`;
    score2.textContent = `${playerTwoScore}`;

    if (gameStatus) {
      playerTurnDiv.textContent = `${activePlayer.name} won!!!`;
      result.textContent = `${activePlayer.name} won!!!`;
      openModal();
    } else if (isTie) {
      playerTurnDiv.textContent = "It's a tie :(";
      result.textContent = "It's a tie :(";
      openModal();
    } else {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
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
    if (e.target.textContent != "-") {
      return;
    } else {
      const selectedColumn = e.target.dataset.column;
      const selectedRow = e.target.dataset.row;
      const gameStatus = game.getGameStatus();

      if (!selectedColumn) return;
      if (!selectedRow) return;
      if (gameStatus) return; // Does not allow clicks after win.

      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
  }

  //Event listeners:

  boardDiv.addEventListener("click", boardClickHandler);
  closeBtn.addEventListener("click", closeModal);
  resetBtn.addEventListener("click", resetGame);

  updateScreen();
}

screenController();
