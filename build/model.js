"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForWin = exports.init = exports.makeMove = exports.reset = exports.AI_DIFFICULTY = exports.winningMove = exports.gameState = exports.currentPlayer = void 0;
let board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
];
exports.currentPlayer = 1;
exports.gameState = '';
exports.winningMove = [];
exports.AI_DIFFICULTY = 7;
function reset() {
    board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    exports.gameState = '';
    exports.winningMove = [];
}
exports.reset = reset;
function makeMove(col) {
    let cRow = 0;
    let cRap = exports.currentPlayer;
    for (let row = 5; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = exports.currentPlayer;
            cRow = row;
            break;
        }
    }
    checkForWin();
    exports.currentPlayer = exports.currentPlayer === 1 ? 2 : 1;
    return [cRow, +col, cRap];
}
exports.makeMove = makeMove;
const init = () => {
};
exports.init = init;
function checkForWin() {
    // Check for Horizontal Win (col[0] - col[+4])
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === exports.currentPlayer &&
                board[row][col + 1] === exports.currentPlayer &&
                board[row][col + 2] === exports.currentPlayer &&
                board[row][col + 3] === exports.currentPlayer) {
                exports.gameState = `Player ${exports.currentPlayer} Wins! Horizontal!`;
                exports.winningMove.push(row, col, col + 1, col + 2, col + 3);
                console.log(exports.gameState, exports.winningMove);
            }
        }
    }
    // Check for Vertical Win (row[0] - row[+4])
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            if (board[row][col] === exports.currentPlayer &&
                board[row + 1][col] === exports.currentPlayer &&
                board[row + 2][col] === exports.currentPlayer &&
                board[row + 3][col] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! VERTICAL!`;
                exports.winningMove.push(row, col, col, col, col, row + 1, row + 2, row + 3);
                console.log(exports.gameState, exports.winningMove);
            }
        }
    }
    // Check for Right Diagonal Win (row[0]col[0] - row[+4]col[+4])
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === exports.currentPlayer &&
                board[row + 1][col + 1] === exports.currentPlayer &&
                board[row + 2][col + 2] === exports.currentPlayer &&
                board[row + 3][col + 3] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! DIAGONAL!`;
                exports.winningMove.push(row, col, col + 1, col + 2, col + 3, row + 1, row + 2, row + 3);
                console.log(exports.gameState, exports.winningMove);
            }
        }
    }
    // Check for Left Diagonal Win (row[0]col[0] - row[+4]col[-4])
    for (let row = 0; row < 3; row++) {
        for (let col = 3; col < 7; col++) {
            if (board[row][col] === exports.currentPlayer &&
                board[row + 1][col - 1] === exports.currentPlayer &&
                board[row + 2][col - 2] === exports.currentPlayer &&
                board[row + 3][col - 3] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! DIAGONAL!`;
                exports.winningMove.push(row, col, col - 1, col - 2, col - 3, row + 1, row + 2, row + 3);
                console.log(exports.gameState, exports.winningMove);
            }
        }
    }
    // No Win Condition Found
    return false;
}
exports.checkForWin = checkForWin;
/// AI BELOW ///
if (exports.currentPlayer === 2) {
    const checkPossibleMoves = function (board) {
        // A possible move is defined by columns, checks to see if any column is full.
        let possibleMoves = [];
        for (let col = 0; col < 7; col++) {
            if (board[0][col] === 0) {
                possibleMoves.push(col);
            }
        }
        return possibleMoves;
    };
    // Similar to makemove function but we are doing a fake move that the computer can use to determine the outcomes in a minmax method.
    const mockMove = function (board, col, player) {
        for (let row = 5; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = player;
                return board;
            }
        }
    };
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
    const minMax = function (board, depth, player) {
        if (depth === 0) {
            return { score: evaluateBoard(board, player) };
        }
        const validMoves = checkPossibleMoves(board);
        let bestMove, bestScore;
        if (player === 2)
            bestScore = -Infinity;
        if (player === 1)
            bestScore = Infinity;
        for (let i = 0; i < validMoves.length; i++) {
            const move = validMoves[i];
            const newBoard = mockMove(board, move, player) || board;
            const result = minMax(newBoard, depth - 1, player = player === 1 ? 2 : 1);
            // if (player & result.score > bestScore) {
            //   bestScore = result.score;
            //   bestMove = move;
            // }
        }
        return { move: bestMove = 0, score: bestScore };
    };
}
