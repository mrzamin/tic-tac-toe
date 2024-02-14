/*The Gameboard represents the state of the board.
I am storing the gameboard as an arrat inside of a gameboard object.
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

  const printBoard = () => {
    const boardWithTokenValues = board.map((row) =>
      row.map((column) => column.getValue())
    );
    console.log(boardWithTokenValues);
  };

  return { getBoard, dropToken, printBoard };
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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  const playRound = (chosenCoordinate) => {
    board.dropToken(chosenCoordinate, getActivePlayer().token);
    console.log(`Dropping ${getActivePlayer().name}'s token...`);
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = gameController();
