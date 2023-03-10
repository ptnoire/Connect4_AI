
let board = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
];
  
let currentPlayer = 1;

// Game State for checkWin function?

export function reset() {
  // Probably a 'nicer' way to do this but this works fine.

  board = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
  ];
}

export function makeMove(col: number) {
  let cRow = 0; let cRap = currentPlayer;

  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
        board[row][col] = currentPlayer;
        cRow = row;
        break;
    }
  }

  checkForWin();
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  return [cRow, +col, cRap];
}

export const init = () => {

}

export function checkForWin() {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === currentPlayer &&
          board[row][col + 1] === currentPlayer &&
          board[row][col + 2] === currentPlayer &&
          board[row][col + 3] === currentPlayer
        ) {
          console.log('You Win! Horizontal!');
        }
      }
    }
  
    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (
          board[row][col] === currentPlayer &&
          board[row + 1][col] === currentPlayer &&
          board[row + 2][col] === currentPlayer &&
          board[row + 3][col] === currentPlayer
        ) {
          console.log('You Win! Vertical!');
        }
      }
    }
  
    // Check diagonal
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] === currentPlayer &&
          board[row + 1][col + 1] === currentPlayer &&
          board[row + 2][col + 2] === currentPlayer &&
          board[row + 3][col + 3] === currentPlayer
        ) {
          console.log('You Win! Diagonal!');
        }
      }
    }
  
    // Check other diagonal
    for (let row = 0; row < 3; row++) {
      for (let col = 3; col < 7; col++) {
        if (
          board[row][col] === currentPlayer &&
          board[row + 1][col - 1] === currentPlayer &&
          board[row + 2][col - 2] === currentPlayer &&
          board[row + 3][col - 3] === currentPlayer
        ) {
          console.log('You Win! Diagonal!');
        }
      }
    }
  
    // No win condition found
    return false;
  }
  