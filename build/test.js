"use strict";
// const checkPossibleMoves = function(mockBoard: Array<Array<number>>) {
//     let possibleMoves = [];
//     for (let col = 0; col < 7; col++) {
//       if (mockBoard[0][col] === 0) {
//         possibleMoves.push(col);
//       }
//     }
//     return possibleMoves;
//   }
// const mockMove = function(mockBoard: Array<Array<number>>, col: number, player: number) {
//     for (let row = 5; row >= 0; row--) {
//       if (mockBoard[row][col] === 0) {
//           mockBoard[row][col] = player;
//           return mockBoard;
//       }
//     }
//     console.error('Mock Move Failed!');
//     return mockBoard;
// }
// function calcScore(scope: Array<number>, player: number) {
//     const otherPlayer: number = 1;
//     const net = scope.filter(space => space === player);
//     const neg = scope.filter(space => space === 0);
//     const oppose = scope.filter(space => space === otherPlayer);
//     let score = 0;
//     if(net.length === 3 && neg.length === 1) score += 1000;
//     if(net.length === 2 && neg.length === 2) score += 10;
//     if(oppose.length === 3 && neg.length === 1) score += 100;
//     return score;
// }
// function evaluateBoard(mockBoard: Array<Array<number>>, player: number, iteraton: number) {
//     let score = 0;
//     // Check horizontal scores
//     for (let row = 0; row < mockBoard.length; row++) {
//       for (let col = 0; col < mockBoard[0].length - 3; col++) {
//         const scope = [mockBoard[row][col], mockBoard[row][col+1], mockBoard[row][col+2], mockBoard[row][col+3]];
//         if (score <= 100) {
//           score += calcScore(scope, player);
//         }
//         if (score >= 100) {
//           console.log(`1-> Horizontal Triggered: ${score}, iteration: ${iteraton}`)
//           break
//         }
//       }
//     }
//     if (score >= 100) {
//       console.log(`2 -> Horizontal Broke: ${score}, iteration: ${iteraton}`)
//       return score;
//     }
//     console.log('Reset Score');
//     score = 0;
//     // Check vertical scores
//     for (let row = 0; row < mockBoard.length - 3; row++) {
//       for (let col = 0; col < mockBoard[0].length; col++) {
//         const scope = [mockBoard[row][col], mockBoard[row+1][col], mockBoard[row+2][col], mockBoard[row+3][col]];
//         if (score <= 100) {
//           score += calcScore(scope, player);
//         }
//         if (score >= 100) {
//           console.log(`1-> Vertical Triggered: ${score},  iteration: ${iteraton}`)
//           break
//         }
//       }
//     }
//     if (score >= 100) {
//       console.log(`2 -> Vertical Broke: ${score}, iteration: ${iteraton}`)
//       return score;
//     }
//     console.log('Reset Score');
//     score = 0;
//     // Check diagonal scores (Right)
//     for (let row = 0; row < mockBoard.length - 3; row++) {
//       for (let col = 0; col < mockBoard[0].length - 3; col++) {
//         const scope = [mockBoard[row][col], mockBoard[row+1][col+1], mockBoard[row+2][col+2], mockBoard[row+3][col+3]];
//         if (score <= 100) {
//             score += calcScore(scope, player);
//           }
//           if (score >= 100) {
//             console.log(`1-> Diagonal Right Triggered: ${score},  iteration: ${iteraton}`)
//             break
//           }
//         }
//     }
//     if (score >= 100) {
//         console.log(`2 -> Diagonal Right Broke: ${score}, iteration: ${iteraton}`)
//         return score;
//     }
//     console.log('Reset Score');
//     score = 0;
//     // Check diagonal scores (Left)
//     for (let row = 0; row < mockBoard.length - 3; row++) {
//       for (let col = 3; col < mockBoard[0].length; col++) {
//         const scope = [mockBoard[row][col], mockBoard[row+1][col-1], mockBoard[row+2][col-2], mockBoard[row+3][col-3]];
//         if (score <= 100) {
//             score += calcScore(scope, player);
//           }
//           if (score >= 100) {
//             console.log(`1-> Diagonal Left Triggered: ${score},  iteration: ${iteraton}`)
//             break
//           }
//         }
//     }
//       if (score >= 100) {
//         console.log(`2 -> Diagonal Left Broke: ${score}, iteration: ${iteraton}`)
//         return score;
//     }
//     console.log('Reset Score');
//     score = 0;
//     return score;
// }
// const minMax = function(mockBoard: Array<Array<number>>, depth: number, player: number, i: number) {
//     const iteration = i+= 1;
//     if (depth === 0) {
//       return { score: evaluateBoard(mockBoard, player, iteration), depth: depth, player: player, iteration: iteration }
//     }
//     const validMoves: Array<number> = checkPossibleMoves(mockBoard);
//     if(validMoves.length === 0) {
//       return { score: evaluateBoard(mockBoard, player, iteration), depth: depth, player: player, iteration: iteration }
//     }
//     let bestMove: number = 0;
//     let bestScore: number = 0;
//     for (let i=0; i < validMoves.length; i++) {
//       const move = validMoves[i];
//       const newBoard = lodash.cloneDeep(mockMove(mockBoard, move, player));
//       const result: any = minMax(newBoard, 0, player, iteration)
//       if (result.score >= 100) {
//         bestScore = result.score;
//         bestMove = move;
//         console.log(`Broke Early in Min Max, iteration: ${iteration}`);
//         break;
//       }
//       if (result.score > bestScore) {
//         bestScore = result.score;
//         bestMove = move;
//       }
//     }
//     return { move: bestMove, score: bestScore, depth, player, mockBoard };
//   }
