/*The Gameboard represents the state of the board.
I am storing the gameboard as an array inside of a gameboard object.
*/

function gameboard() {
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
    const availableCoordinate = board[row][column].getValue() === 0;

    if (!availableCoordinate) return;
    board[row][column].addToken(player);
  };

  return { getBoard, dropToken };
}

function cell() {
  let value = 0;

  const addToken = (playerToken) => {
    value = playerToken;
  };

  const clearCellValue = () => {
    value = 0;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
    clearCellValue,
  };
}

function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = gameboard();

  const gameArray = board.getBoard();

  const players = [
    { name: playerOneName, token: "X" },

    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  let gameOver = false;

  const getGameStatus = () => gameOver;

  const resetGame = () => {
    activePlayer = players[0];
    gameOver = false;
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

    console.log(cell0);
    console.log(cell0.getValue());
    console.log(cell1.getValue());

    console.log(cell2.getValue());

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

      if (cellA !== 0 && cellB !== 0 && cellC !== 0) {
        if (cellA === cellB && cellB === cellC) {
          gameOver = true;

          // gameArray.forEach((row) => {
          //   row.forEach((column) => {
          //     column.clearCellValue();
          //   });
          // });
          break;
        }
      }
    }
  };

  const playRound = (row, column) => {
    board.dropToken(row, column, getActivePlayer().token);
    // console.log(`Dropping ${getActivePlayer().name}'s token...`);
    checkWinner();

    if (gameOver) {
      return;
    } else {
      switchPlayerTurn();
    }
  };

  return {
    playRound,
    getActivePlayer,
    getGameStatus,
    getBoard: board.getBoard,
  };
}

function screenController() {
  const game = gameController();
  const boardDiv = document.querySelector(".board");
  const playerTurnDiv = document.querySelector(".turn");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const gameStatus = game.getGameStatus();

    if (gameStatus) {
      playerTurnDiv.textContent = `${activePlayer.name} won!!!`;
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
        squareBtn.addEventListener("click", boardClickHandler, { once: true });
        boardDiv.appendChild(squareBtn);
      });
    });
  };

  function boardClickHandler(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    console.log("clicked");
    const gameStatus = game.getGameStatus();

    if (gameStatus) return; // Does not allow clicks after win.
    if (!selectedColumn) return;
    if (!selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  // boardDiv.addEventListener("click", boardClickHandler);

  updateScreen();
}

screenController();
