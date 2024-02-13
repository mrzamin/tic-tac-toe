/*The Gameboard represents the state of the board.
I am storing the gameboard as an arrat inside of a gameboard object.
*/

function Gameboard() {
  const coordinates = 9;
  const board = [];

  for (let i = 0; i < coordinates; i++) {
    board[i] = [];
    /* Come back here to add push method */
  }

  //Method of getting our entire gameboard that our UI will need to render it.
  const getBoard = () => board;

  const dropToken = (chosenCoordinate, player) => {
    const availableCoordinate = board[chosenCoordinate].getValue() === 0;

    if (!availableCoordinate) return;
    board[chosenCoordinate].addToken(player);
  };

  const printBoard = () => {
    const boardWithTokenValues = board.map((coordinate) =>
      coordinate.getValue()
    );
    console.log(boardWithTokenValues);
  };

  return { getBoard, dropToken, printBoard };
}
