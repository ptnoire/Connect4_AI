let board = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
];
  
export let currentPlayer = 1;

export let gameState = '';
export let winningMove:Array<number> = [];
export let AI_DIFFICULTY = 7;

export function reset() {
  board = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
];
  gameState = '';
  winningMove = [];
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

  checkForWin()
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  return [cRow, +col, cRap];
  
}

export const init = () => {

}

export function checkForWin() {
  // Check for Horizontal Win (col[0] - col[+4])
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] === currentPlayer &&
        board[row][col + 1] === currentPlayer &&
        board[row][col + 2] === currentPlayer &&
        board[row][col + 3] === currentPlayer
      ) { 
        gameState = `Player ${currentPlayer} Wins! Horizontal!`;
        winningMove.push(row, col, col+1, col+2, col+3);
        console.log(gameState, winningMove);
      }
    }
  }
  
  // Check for Vertical Win (row[0] - row[+4])
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      if (
        board[row][col] === currentPlayer &&
        board[row + 1][col] === currentPlayer &&
        board[row + 2][col] === currentPlayer &&
        board[row + 3][col] === currentPlayer
      ) { 
        gameState = `PLAYER ${currentPlayer} WINS! VERTICAL!`;
        winningMove.push(row, col, col, col, col, row+1, row+2, row+3);
        console.log(gameState, winningMove); 
      }
    }
  }
  
  // Check for Right Diagonal Win (row[0]col[0] - row[+4]col[+4])
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      if (
        board[row][col] === currentPlayer &&
        board[row + 1][col + 1] === currentPlayer &&
        board[row + 2][col + 2] === currentPlayer &&
        board[row + 3][col + 3] === currentPlayer
      ) { 
        gameState = `PLAYER ${currentPlayer} WINS! DIAGONAL!`;
        winningMove.push(row, col, col+1, col+2, col+3, row+1, row+2, row+3);
        console.log(gameState, winningMove);
     }
    }
  }
  
  // Check for Left Diagonal Win (row[0]col[0] - row[+4]col[-4])
  for (let row = 0; row < 3; row++) {
    for (let col = 3; col < 7; col++) {
      if (
        board[row][col] === currentPlayer &&
        board[row + 1][col - 1] === currentPlayer &&
        board[row + 2][col - 2] === currentPlayer &&
        board[row + 3][col - 3] === currentPlayer
      ) { 
        gameState = `PLAYER ${currentPlayer} WINS! DIAGONAL!`;
        winningMove.push(row, col, col-1, col-2, col-3, row+1, row+2, row+3);
        console.log(gameState, winningMove);
     }
    }
  }
  
  // No Win Condition Found
  return false;
}


/// AI BELOW ///

if(currentPlayer === 2) {

  const checkPossibleMoves = function(board: Array<Array<number>>) {
    // A possible move is defined by columns, checks to see if any column is full.
    let possibleMoves = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === 0) {
        possibleMoves.push(col);
      }
    }
    return possibleMoves;
  }

  // Similar to makemove function but we are doing a fake move that the computer can use to determine the outcomes in a minmax method.
  const mockMove = function(board: Array<Array<number>>, col: number, player: number) {
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === 0) {
          board[row][col] = player;
          return board;
      }
    }
  }

  // function evaluateBoard(board, player) {
  //   const otherPlayer = player === 1 ? 2 : 1;
  //   let score = 0;
  
  //   // Check horizontal scores
  //   for (let row = 0; row < board.length; row++) {
  //     for (let col = 0; col < board[0].length - 3; col++) {
  //       const window = [board[row][col], board[row][col+1], board[row][col+2], board[row][col+3]];
  //       score += evaluateWindow(window, player, otherPlayer);
  //     }
  //   }
  
  //   // Check vertical scores
  //   for (let row = 0; row < board.length - 3; row++) {
  //     for (let col = 0; col < board[0].length; col++) {
  //       const window = [board[row][col], board[row+1][col], board[row+2][col], board[row+3][col]];
  //       score += evaluateWindow(window, player, otherPlayer);
  //     }
  //   }
  
  //   // Check diagonal scores (positive slope)
  //   for (let row = 0; row < board.length - 3; row++) {
  //     for (let col = 0; col < board[0].length - 3; col++) {
  //       const window = [board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3]];
  //       score += evaluateWindow(window, player, otherPlayer);
  //     }
  //   }
  
  //   // Check diagonal scores (negative slope)
  //   for (let row = 0; row < board.length - 3; row++) {
  //     for (let col = 3; col < board[0].length; col++) {
  //       const window = [board[row][col], board[row+1][col-1], board[row+2][col-2], board[row+3][col-3]];
  //       score += evaluateWindow(window, player, otherPlayer);
  //     }
  //   }
  
  //   return score;
  // }

  // Depth = AI difficulty
  const minMax = function(board: Array<Array<number>>, depth: number, player: number) {
    if (depth === 0) {
      return { score: evaluateBoard(board, player) }
    }

    
    const validMoves: Array<number> = checkPossibleMoves(board);
    let bestMove: number, bestScore;
    if(player === 2) bestScore = -Infinity;
    if(player === 1) bestScore = Infinity;
    
    for (let i=0; i < validMoves.length; i++) {
      const move = validMoves[i];
      const newBoard = mockMove(board, move, player) || board;
      const result : Object = minMax(newBoard, depth -1, player = player === 1 ? 2 : 1)

      // if (player & result.score > bestScore) {
      //   bestScore = result.score;
      //   bestMove = move;
      // }
    }

    return { move: bestMove = 0, score: bestScore };
  }
}