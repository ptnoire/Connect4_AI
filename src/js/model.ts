import * as lodash from "lodash";

export let board = [
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
export let AI_DIFFICULTY = 3;

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
  currentPlayer = 1;
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
     }
    }
  }
  
  // No Win Condition Found
  return false;
}


/// AI BELOW ///


  const checkPossibleMoves = function(mockBoard: Array<Array<number>>) {
    // A possible move is defined by columns, checks to see if any column is full.
    let possibleMoves = [];
    for (let col = 0; col < 7; col++) {
      if (mockBoard[0][col] === 0) {
        possibleMoves.push(col);
      }
    }
    return possibleMoves;
  }

  // Similar to makemove function but we are doing a fake move that the computer can use to determine the outcomes in a minmax method.
  const mockMove = function(mockBoard: Array<Array<number>>, col: number, player: number) {
    
    for (let row = 5; row >= 0; row--) {
      if (mockBoard[row][col] === 0) {
          mockBoard[row][col] = player;
          return mockBoard;
      }
    }
    console.log('failed');
    return mockBoard;
  }

  function calcScore(scope: Array<number>, player: number) {
    const otherPlayer: number = player === 1 ? 2 : 1;
    const net = scope.filter(space => space === player);
    const neg = scope.filter(space => space === 0);
    const oppose = scope.filter(space => space === otherPlayer);
    let score = 0;

    if(net.length === 3 && neg.length === 1) score += 10;
    if(net.length === 2 && neg.length === 2) score += 2;
    if(oppose.length === 3 && neg.length === 1) score += 5;

    return score;
  }

  function evaluateBoard(mockBoard: Array<Array<number>>, player: number) {
    let score = 0;
  
    // Check horizontal scores
    for (let row = 0; row < mockBoard.length; row++) {
      for (let col = 0; col < mockBoard[0].length - 3; col++) {
        const scope = [mockBoard[row][col], mockBoard[row][col+1], mockBoard[row][col+2], mockBoard[row][col+3]];
        score += calcScore(scope, player);
      }
    }
  
    // Check vertical scores
    for (let row = 0; row < mockBoard.length - 3; row++) {
      for (let col = 0; col < mockBoard[0].length; col++) {
        const scope = [mockBoard[row][col], mockBoard[row+1][col], mockBoard[row+2][col], mockBoard[row+3][col]];
        score += calcScore(scope, player);
      }
    }
  
    // Check diagonal scores (Right)
    for (let row = 0; row < mockBoard.length - 3; row++) {
      for (let col = 0; col < mockBoard[0].length - 3; col++) {
        const scope = [mockBoard[row][col], mockBoard[row+1][col+1], mockBoard[row+2][col+2], mockBoard[row+3][col+3]];
        score += calcScore(scope, player);
      }
    }
  
    // Check diagonal scores (Left)
    for (let row = 0; row < mockBoard.length - 3; row++) {
      for (let col = 3; col < mockBoard[0].length; col++) {
        const scope = [mockBoard[row][col], mockBoard[row+1][col-1], mockBoard[row+2][col-2], mockBoard[row+3][col-3]];
        score += calcScore(scope, player);
      }
    }

    return score;
  }

  // Depth = AI difficulty
  const minMax = function(mockBoard: Array<Array<number>>, depth: number, player: number, i: number) {
    const iteration = i+= 1;
    if (depth === 0) {
      return { score: evaluateBoard(mockBoard, player), depth: depth, player: player, iteration: iteration }
    }

    const validMoves: Array<number> = checkPossibleMoves(mockBoard);
    if(validMoves.length === 0) {
      return { score: evaluateBoard(mockBoard, player), depth: depth, player: player, iteration: iteration }
    }

    let bestMove: number = 0;
    let bestScore: number = 0;
    
    for (let i=0; i < validMoves.length; i++) {
      const move = validMoves[i];
      const newBoard = lodash.cloneDeep(mockMove(mockBoard, move, player));
      const result: any = minMax(newBoard, depth -1, player = player === 1 ? 2 : 1, iteration)
      
      if (player === 2 && result.score === 10 || result.score === 5) {
        return { move: move, score: result.score };
      }

      if (player === 2 && result.score > bestScore) {
        // console.log(`Player 2 Condition: Player: ${player}, Result.Score: ${result.score}, Best Score: ${bestScore}, Move: ${bestMove}, Depth: ${depth}`);
        bestScore = result.score;
        bestMove = move;
      }

      if (player === 1 && result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
        // console.log(`Player 1 Condition: Player: ${player}, Result.Score: ${result.score}, Best Score: ${bestScore}, Move: ${bestMove}, Depth: ${depth}`);
      }
    }
    return { move: bestMove, score: bestScore, depth, player, mockBoard };
  }

export const AImove = function() {
    const copyBoard = JSON.parse(JSON.stringify(board));
    const i = 0;
    let whatMoveToMake = minMax(copyBoard, AI_DIFFICULTY, currentPlayer, i);
    const move = whatMoveToMake.move;
    return move;
}