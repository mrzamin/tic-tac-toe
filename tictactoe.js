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

  // const printBoard = () => {
  //   const boardWithTokenValues = board.map((row) =>
  //     row.map((column) => column.getValue())
  //   );
  //   console.log(boardWithTokenValues);
  // };

  return { getBoard, dropToken };
}

function cell() {
  let value = 0;

  const addToken = (playerToken) => {
    value = playerToken;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

function gameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = gameboard();

  const players = [
    { name: playerOneName, token: "X" },

    { name: playerTwoName, token: "O" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // const printNewRound = () => {
  //   board.printBoard();
  //   console.log(`${getActivePlayer().name}'s turn`);
  // };

  const playRound = (row, column) => {
    board.dropToken(row, column, getActivePlayer().token);
    console.log(`Dropping ${getActivePlayer().name}'s token...`);
    switchPlayerTurn();
    // printNewRound();
  };

  // printNewRound();

  return {
    playRound,
    getActivePlayer,
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

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

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
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;

    if (!selectedColumn) return;
    if (!selectedRow) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", boardClickHandler);

  updateScreen();
}

screenController();
