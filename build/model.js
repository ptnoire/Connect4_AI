"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AImove = exports.checkForWin = exports.makeMove = exports.reset = exports.AI_DIFFICULTY = exports.winningMove = exports.gameState = exports.currentPlayer = exports.board = void 0;
exports.board = [
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
exports.AI_DIFFICULTY = 3;
function reset() {
    exports.board = [
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
        if (exports.board[row][col] === 0) {
            exports.board[row][col] = exports.currentPlayer;
            cRow = row;
            break;
        }
    }
    checkForWin();
    exports.currentPlayer = exports.currentPlayer === 1 ? 2 : 1;
    return [cRow, +col, cRap];
}
exports.makeMove = makeMove;
function checkForWin() {
    // Check for Horizontal Win (col[0] - col[+4])
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (exports.board[row][col] === exports.currentPlayer &&
                exports.board[row][col + 1] === exports.currentPlayer &&
                exports.board[row][col + 2] === exports.currentPlayer &&
                exports.board[row][col + 3] === exports.currentPlayer) {
                exports.gameState = `Player ${exports.currentPlayer} Wins! Horizontal!`;
                exports.winningMove.push(row, col, col + 1, col + 2, col + 3);
            }
        }
    }
    // Check for Vertical Win (row[0] - row[+4])
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 7; col++) {
            if (exports.board[row][col] === exports.currentPlayer &&
                exports.board[row + 1][col] === exports.currentPlayer &&
                exports.board[row + 2][col] === exports.currentPlayer &&
                exports.board[row + 3][col] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! VERTICAL!`;
                exports.winningMove.push(row, col, col, col, col, row + 1, row + 2, row + 3);
            }
        }
    }
    // Check for Right Diagonal Win (row[0]col[0] - row[+4]col[+4])
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (exports.board[row][col] === exports.currentPlayer &&
                exports.board[row + 1][col + 1] === exports.currentPlayer &&
                exports.board[row + 2][col + 2] === exports.currentPlayer &&
                exports.board[row + 3][col + 3] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! DIAGONAL!`;
                exports.winningMove.push(row, col, col + 1, col + 2, col + 3, row + 1, row + 2, row + 3);
            }
        }
    }
    // Check for Left Diagonal Win (row[0]col[0] - row[+4]col[-4])
    for (let row = 0; row < 3; row++) {
        for (let col = 3; col < 7; col++) {
            if (exports.board[row][col] === exports.currentPlayer &&
                exports.board[row + 1][col - 1] === exports.currentPlayer &&
                exports.board[row + 2][col - 2] === exports.currentPlayer &&
                exports.board[row + 3][col - 3] === exports.currentPlayer) {
                exports.gameState = `PLAYER ${exports.currentPlayer} WINS! DIAGONAL!`;
                exports.winningMove.push(row, col, col - 1, col - 2, col - 3, row + 1, row + 2, row + 3);
            }
        }
    }
    // No Win Condition Found
    return false;
}
exports.checkForWin = checkForWin;
/// AI BELOW ///
const checkPossibleMoves = function (mockBoard) {
    // A possible move is defined by columns, checks to see if any column is full.
    let possibleMoves = [];
    for (let col = 0; col < 7; col++) {
        if (mockBoard[0][col] === 0) {
            possibleMoves.push(col);
        }
    }
    return possibleMoves;
};
// Similar to makemove function but we are doing a fake move that the computer can use to determine the outcomes in a minmax method.
const mockMove = function (mockBoard, col, player) {
    for (let row = 5; row >= 0; row--) {
        if (mockBoard[row][col] === 0) {
            mockBoard[row][col] = player;
            return mockBoard;
        }
    }
};
function calcScore(scope, player) {
    const otherPlayer = player === 1 ? 2 : 1;
    const net = scope.filter(space => space === player);
    const neg = scope.filter(space => space === 0);
    const oppose = scope.filter(space => space === otherPlayer);
    let score = 0;
    if (net.length === 3 && neg.length === 1)
        score += 5;
    if (net.length === 2 && neg.length === 2)
        score += 2;
    if (oppose.length === 3 && neg.length === 1)
        score += 10;
    return score;
}
function evaluateBoard(mockBoard, player) {
    let score = 0;
    // Check horizontal scores
    for (let row = 0; row < mockBoard.length; row++) {
        for (let col = 0; col < mockBoard[0].length - 3; col++) {
            const scope = [mockBoard[row][col], mockBoard[row][col + 1], mockBoard[row][col + 2], mockBoard[row][col + 3]];
            score += calcScore(scope, player);
        }
    }
    // Check vertical scores
    for (let row = 0; row < mockBoard.length - 3; row++) {
        for (let col = 0; col < mockBoard[0].length; col++) {
            const scope = [mockBoard[row][col], mockBoard[row + 1][col], mockBoard[row + 2][col], mockBoard[row + 3][col]];
            score += calcScore(scope, player);
        }
    }
    // Check diagonal scores (Right)
    for (let row = 0; row < mockBoard.length - 3; row++) {
        for (let col = 0; col < mockBoard[0].length - 3; col++) {
            const scope = [mockBoard[row][col], mockBoard[row + 1][col + 1], mockBoard[row + 2][col + 2], mockBoard[row + 3][col + 3]];
            score += calcScore(scope, player);
        }
    }
    // Check diagonal scores (Left)
    for (let row = 0; row < mockBoard.length - 3; row++) {
        for (let col = 3; col < mockBoard[0].length; col++) {
            const scope = [mockBoard[row][col], mockBoard[row + 1][col - 1], mockBoard[row + 2][col - 2], mockBoard[row + 3][col - 3]];
            score += calcScore(scope, player);
        }
    }
    return score;
}
// Depth = AI difficulty
const minMax = function (mockBoard, depth, player) {
    console.log(depth, player);
    if (depth === 0) {
        console.log('should break here');
        return { score: evaluateBoard(mockBoard, player) };
    }
    const validMoves = checkPossibleMoves(mockBoard);
    if (validMoves.length === 0) {
        console.log('this triggered me');
        return { score: evaluateBoard(mockBoard, player) };
    }
    let bestMove = 0;
    let bestScore = 0;
    if (player === 2)
        bestScore = -Infinity;
    if (player === 1)
        bestScore = Infinity;
    for (let i = 0; i < validMoves.length; i++) {
        const move = validMoves[i];
        // TypeScript work-around ( cant be undefined ) so added || board;
        const newBoard = mockMove(mockBoard, move, player) || mockBoard;
        const result = minMax(newBoard, depth - 1, player = player === 1 ? 2 : 1);
        if (player === 2 && result.score > bestScore) {
            bestScore = result.score;
            bestMove = move;
        }
        if (player === 1 && result.score > bestScore) {
            bestScore = result.score;
            bestMove = move;
        }
        console.log(newBoard, bestMove, bestScore);
    }
    return { move: bestMove || validMoves[0], score: bestScore };
};
const AImove = function () {
    const copyBoard = [...exports.board];
    const whatMoveToMake = minMax(copyBoard, exports.AI_DIFFICULTY, exports.currentPlayer);
    if (whatMoveToMake.move)
        return whatMoveToMake.move;
    return 0;
};
exports.AImove = AImove;
