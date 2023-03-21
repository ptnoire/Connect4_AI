# Using Connect 4 to do a dive into AI algorithms.

A friend said 'make a connect 4 game, then try to make an AI that you can't beat' and I was like ok.

Just for fun, also first full program written with TypeScript.

Friend said to check out `minmax` algo, so I begun my deep dive in on it.


# March 21st, 2023 --- Working Prototype Shipment!
## Top Level Overview / How I Deviated from the Original Design
* The AI will look at all of the valid moves, then determine which move is the best depending on a few different factors, mainly victory and blocking victory.
* The `depth` parameter is idle for now, until I can refactor the code to process a more valid look at moves ahead.
*   * The reason I had to redesign this aspect is because JavaScript (TypeScript in this instance) passes objects and arrays as reference, this meant that even though I was making copies of arrays of arrays, it would always mutate the original array. Even after implementing lodash's cloneDeep(), it just wasn't enough. Therefore; the thousands of computations that the AI had to go through would run in real time, just simply requiring too much strain on the system (browser) although when I return I have a solution to this that I will describe once I finish it's arechitecture.
* Now, the AI looks at all the valid moves and will make a move based upon 'it's best interest' unless the opponent (player) is about to win. If there are no advantageous moves, it will select a valid move at pseudo-random just to create a spicy opponent to play against.

## How I redesigned the Helper Functions
If you're curious as to the lifespan of this project, please see below on the original updates / notes.

Finding Possible Moves:
```
const checkPossibleMoves = function(mockBoard: Array<Array<number>>) {
  let possibleMoves = [];
  for (let col = 0; col < 7; col++) {
    if (mockBoard[0][col] === 0) {
      possibleMoves.push(col);
    }
  }
  return possibleMoves;
}
```

Creating a Mock Move and then examining the results. The way I changed this from before is that this function had no way of knowing what the current move made was, so when scoring the results it would always result in scoring as if the board had already had that move in place, confusing the algorithm constantly and creating odd events like the computer refusing to block the player's victories or just ignoring obvious victories.
```
const mockMove = function(mockBoard: Array<Array<number>>, col: number, player: number) {
  for (let row = 5; row >= 0; row--) {
    if (mockBoard[row][col] === 0) {
        mockBoard[row][col] = player;
        return mockBoard;
    }
  }

  return mockBoard;
}
```

Calculating the score value of the current move made:
```
function calcScore(scope: Array<number>, player: number) {
  const otherPlayer: number = 1;
  const currentMove = scope.filter(space => space === 3);
  const net = scope.filter(space => space === player);
  const neg = scope.filter(space => space === 0);
  const oppose = scope.filter(space => space === otherPlayer);
  let score = 0;

  if(net.length === 3 && currentMove.length === 1) score += 1000;
  if(net.length === 2 && currentMove.length === 1) score += 15;
  if(net.length === 1 && currentMove.length === 1) score += 10;
  if(oppose.length === 3 && currentMove.length === 1) score += 1000;

  return score;
}
```

Dissecting the board, piece by piece to score the moves made and the current state of the board.
```
function evaluateBoard(mockBoard: Array<Array<number>>, player: number, iteraton: number) {
  let score = 0;
  
  // Check horizontal scores
  for (let row = 0; row < mockBoard.length; row++) {
    for (let col = 0; col < mockBoard[0].length - 3; col++) {
      const scope = [mockBoard[row][col], mockBoard[row][col+1], mockBoard[row][col+2], mockBoard[row][col+3]];
      if (score < 1000) {
        score += calcScore(scope, player);
      }
      if (score >= 1000) {
        break
      }
    }
  }
  if (score >= 1000) {
    return score;
  }

  score = 0;

  // Check vertical scores
  for (let row = 0; row < mockBoard.length - 3; row++) {
    for (let col = 0; col < mockBoard[0].length; col++) {
      const scope = [mockBoard[row][col], mockBoard[row+1][col], mockBoard[row+2][col], mockBoard[row+3][col]];
      if (score < 1000) {
        score += calcScore(scope, player);
      }
      if (score >= 1000) {
        break
      }
    }
  }
  if (score >= 1000) {
    return score;
  }

  score = 0;

  // Check diagonal scores (Right)
  for (let row = 0; row < mockBoard.length - 3; row++) {
    for (let col = 0; col < mockBoard[0].length - 3; col++) {
      const scope = [mockBoard[row][col], mockBoard[row+1][col+1], mockBoard[row+2][col+2], mockBoard[row+3][col+3]];
      if (score < 1000) {
          score += calcScore(scope, player);
        }
        if (score >= 1000) {
          break
        }
      }
  }
  if (score >= 1000) {
      return score;
  }

  score = 0;

  // Check diagonal scores (Left)
  for (let row = 0; row < mockBoard.length - 3; row++) {
    for (let col = 3; col < mockBoard[0].length; col++) {
      const scope = [mockBoard[row][col], mockBoard[row+1][col-1], mockBoard[row+2][col-2], mockBoard[row+3][col-3]];
      if (score < 1000) {
          score += calcScore(scope, player);
        }
        if (score >= 1000) {
          break
        }
      }
  }
    if (score >= 1000) {
      return score;
  }

  score = 0;
  return score;
}
```

A recursive min max function that will loop over itself, breaking only if a move is obvious or finding the highest valued move and returning it to pass to the AI to make the move:
```
const minMax = async function(mockBoard: Array<Array<number>>, depth: number, player: number, i: number) {
  
  const iteration = i+= 1;
  if (depth === 0) {
    return { score: evaluateBoard(mockBoard, player, iteration), depth: depth, player: player, iteration: iteration }
  }

  const validMoves: Array<number> = checkPossibleMoves(mockBoard);
  if(validMoves.length === 0) {
    return { score: evaluateBoard(mockBoard, player, iteration), depth: depth, player: player, iteration: iteration }
  }

  let bestMove: number = 0;
  let bestScore: number = 0;
  
  for (let i=0; i < validMoves.length; i++) {
    const move = validMoves[i];
    const newMockBoard = lodash.cloneDeep(mockBoard);
    const newBoard = lodash.cloneDeep(mockMove(newMockBoard, move, 3));
    const result: any = await minMax(newBoard, 0, player, iteration);
    
    if (result.score >= 100) {
      bestScore = result.score;
      bestMove = move;
      break;
    }

    if (result.score > bestScore) {
      bestScore = result.score;
      bestMove = move;
    }
  }

  if(bestScore === 0) {
    bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  return { move: bestMove, score: bestScore, depth, player, mockBoard };
}
```

And the function that is called to activate all of this:
```
export const AImove = async function() {
    const copyBoard = JSON.parse(JSON.stringify(board));
    const i = 0;
    let whatMoveToMake = await minMax(copyBoard, 1, currentPlayer, i);
    const move = whatMoveToMake.move;
    return move;
}
```

## Nice Code Dump.. How does all of this work?
Excellent question my dear reader, allow me to give you the tour.

The game board is reflected upon this array of arrays:
```
export let board = [
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0], 
];
```

When the player clicks, a function will run that is similar to 'mockMove' where it will loop over the `board` array and find the lowest row, of the column that is clicked on:

```
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
        board[row][col] = currentPlayer;
  }
```
Note: This is a snippet of the actual code.

Once the player moves, it will then pass the turn to the AI. This function is called `AImove`.

The life cycle of `AImove` is:
```
Get a copy of the game board -> asynchronously run minMax() -> return the move that should be made -> make the move
```

Inside of the minMax move this is what happens:

```
Intake: copy of the game board, depth (AI DIFFICULTY), current player, iteration (for tracking purposes)
Gather Valid Moves
For Loop that runs each valid move into a mock simulation, then scores those moves based upon the score system
If the score beats the current or last score, it will replace the bestMove with that move
returns the move for the AI to  make.
```
The for loop that will run and analyze scores/moves
```
  for (let i=0; i < validMoves.length; i++) {
    const move = validMoves[i];
    const newMockBoard = lodash.cloneDeep(mockBoard);
    const newBoard = lodash.cloneDeep(mockMove(newMockBoard, move, 3));
    const result: any = await minMax(newBoard, 0, player, iteration);
    
    if (result.score >= 100) {
      bestScore = result.score;
      bestMove = move;
      break;
    }

    if (result.score > bestScore) {
      bestScore = result.score;
      bestMove = move;
    }
  }
```
If the score ever hits above 100, it is a move that makes the most sense to make regardless of the future prospects because this would either mean that the player is about to win or the AI can win, so it will break the entire cycle if a move is obvious. This was one of the major changes I made to the original design where the AI would blow past obvious moves to make deeply thought out moves about the future but never the present.

The result will be returned asychronously, this allows the processes to be run outside of the call stack, allowing for a faster operation of these computations.

Being that I paused the depth parameter to just get a working protoype, I make sure that every recursive instance of 'minmax' just returns the evaluated score of the move that was just made, meaning it will only analyze the valid moves that are available via this line:
```
if (depth === 0) return { score: evaluateBoard(mockBoard, player, iteration) }
```

Inside the evaluation we will run multiple for loops over and take out snippets of the array / board and analyze them based on the current move made (3) and give it a score based on the `calcScore` function:

For example:
```
  // Check horizontal scores
  for (let row = 0; row < mockBoard.length; row++) {
    for (let col = 0; col < mockBoard[0].length - 3; col++) {
      const scope = [mockBoard[row][col], mockBoard[row][col+1], mockBoard[row][col+2], mockBoard[row][col+3]];
      if (score < 1000) {
        score += calcScore(scope, player);
      }
      if (score >= 1000) {
        break
      }
    }
  }
  if (score >= 1000) {
    return score;
  }
```
```
function calcScore(scope: Array<number>, player: number) {
  const otherPlayer: number = 1;
  const currentMove = scope.filter(space => space === 3);
  const net = scope.filter(space => space === player);
  const neg = scope.filter(space => space === 0);
  const oppose = scope.filter(space => space === otherPlayer);
  let score = 0;

  if(net.length === 3 && currentMove.length === 1) score += 1000;
  if(net.length === 2 && currentMove.length === 1) score += 15;
  if(net.length === 1 && currentMove.length === 1) score += 10;
  if(oppose.length === 3 && currentMove.length === 1) score += 1000;

  return score;
}
```

Another major design change was made so that the score would break if it ever reached the obvious threshold, in the future I will do a bit better math on calculations, at the moment it's design is obvious large numbers, but still allowing smaller numbers to be added up. (i.e. if it ever hits 1000, it would be an obvious move and should break the cycles.

# Notes
Hello thank you for finding this section, I am happy to of shipped a working protoype of this AI, I will return to refactor and make this AI more powerful for at the moment you can easily beat the AI if you're mildly clever with your moves.

I have a lot of projects to work on and a lot of commissions at the moment, I hope you enjoy this simple app. My thoughts are I need to update the mobile view and just make it a bit cleaner, I worked so much on the logic of this that I didn't think too much on the design past the initial mock up.

Cheers from PT.

# Below is the previous updates



## Top Level Overview for How this AI will Function
* The AI will look ahead of the current game state to see all possible moves and then determine which move would be the most optimal.
* It will have a `depth` parameter, defined by the difficulty, which will directly influence how many moves ahead it will analyze.
* Using a score system, if it has the chance to win by placing the 4th piece in connection, it will play that, if it can block the player from winning (placing their 4th piece) it ranks that second, then the score system determines if it has any options to play in succession to it's already played moves.
* The final calculation will then proceed to pass a number to the master controller, which interacts the same way as a player would, displaying the move correctly on the DOM.

## Helper Functions provided for the AI
* `find possible moves` : Valid moves will be determined by open columns, since Connect 4 is played by dropping a piece into a column, the only way this will return false is if the column is full, so if that happens, it will take out all of those moves to prevent the AI from analyzing that column, should reduce runtime and errors in judgement.
```
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
```
  * `evaluate board` : There is a score system I have designed to determine which is the best move.
```  
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
  ```
  The first step of this formula will be to take out 'scopes' of the board, to analyze them in smaller pieces. For example: in a horizontal analysis we want to snip out a row and see what possible moves exists.
  * `score system` : A seperate function is then called to determine the score, the score numbers may change depending how well the AI reads these moves and scores them but simply put: Winning move is scored 10, should rise above all other scores. A move that blocks the opponents move is scored 5, a move that has 2 other pieces and open spaces next to it is just scored 2. I am leaving room in the score system currently (3/18/23) just in case I find that this algorithm could be improved.
  ```
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
  ```
  * `minmax` : Finally the algorithm presented as a function. I'll first post the code then give my entire run down as I see it. I'll try to keep updating this as I debug as this currently doesn't work.
  ```
    const minMax = function(mockBoard: Array<Array<number>>, depth: number, player: number) {
    if (depth === 0) {
      return { score: evaluateBoard(mockBoard, player) }
    }

    const validMoves: Array<number> = checkPossibleMoves(mockBoard);
    if(validMoves.length === 0) {
      return { score: evaluateBoard(mockBoard, player)}
    }

    let bestMove: number = 0;
    let bestScore: number = 0;
    if(player === 2) bestScore = -Infinity;
    if(player === 1) bestScore = Infinity;
    
    for (let i=0; i < validMoves.length; i++) {
      const move = validMoves[i];
      const newBoard = mockMove(mockBoard, move, player); 
      const result: any = minMax(newBoard, depth -1, player = player === 1 ? 2 : 1)
      
      if (player === 2 && result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      if (player === 1 && result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      // console.log(`player ${player}, best move: ${bestMove}, score = ${bestScore}`);
    }

    return { move: bestMove, score: bestScore };
  }
  ```
  
  ## The Design
  (March 20, 2023 -- End of Day)
  
  The biggest issues I face at the moment is the fact that JavaScript passes by reference. This is specfically an issue when you have an array of arrays. So for the time being, I've fetched lodash's clone deep function to try and overcome this, it's working somewhat, but when the depth is set higher the processing power is just too much.
  
  I have ended the day with getting the AI to at least block a vertical victory from the player. This only happens if the player just puts pieces in the first column and hits 3 in a row. I've tried getting the AI to block a horizontal victory but it didn't work so still somethings to work out.
  
  You can check the commits but that is annoying so I'll post the major changes in a short blurb here:
```
      if (player === 2 && result.score === 10 || result.score === 5) {
        return { move: move, score: result.score };
      }
```

```
export const AImove = function() {
    const copyBoard = JSON.parse(JSON.stringify(board));
    const i = 0;
    let whatMoveToMake = minMax(copyBoard, AI_DIFFICULTY, currentPlayer, i);
    const move = whatMoveToMake.move;
    return move;
}
```

```
const newBoard = lodash.cloneDeep(mockMove(mockBoard, move, player));
```
  
  As well, I need to do a bubbling event on the click, because currently you can just skip turns by clicking on the table and having nothing happen. Thought I had already implemented this but seems I made a mistake. Will keep at it until this is finished but this is the first time where I have found JavaScript not acting as I wanted. Perhaps this is how people switch languages.. cheers!
  
  (March 20, 2023)
  * Once the player (who goes first) clicks the column they want to play their piece in, the controller will then call the AI model to move.
  * A copy of the board is made (currently, for some reason the original board is mutating, which is my biggest bug. I do not know why this is happening at the moment,  it shouldn't be touching the original array but it somehow is) and then it passed into an function as an argument along with the `AI_DIFFICULTY` variable which will be defined by the player, it is simply a number that reflects how many iterations of moves the AI can look ahead to determine the best move, as well as the currentPlayer variable which should always start as 2 (which is the AI)
  * The function will be declared as a constant that will ultimately be a single number (which column from 0 to 6) to play.
  * Then that constant is passed into the makeMove function which ultimately makes the move on the real board.
  ```
  export const AImove = function() {
    const copyBoard = [...board];
    const whatMoveToMake = minMax(copyBoard, AI_DIFFICULTY, currentPlayer);
    console.log(whatMoveToMake.move);
    if(whatMoveToMake.move) return whatMoveToMake.move;
    return 0;
}
```
When the minmax function is called, we have a recursive function that will call itself as many times as it needs to implement the theory into practice.
```
MinMax -> is depth 0? : break -> check possible moves -> are there no valid moves? : break
```
If it passes the first two base cases, it will pass into a for loop that will call the function again if needed.
```
    for (let i=0; i < validMoves.length; i++) {
      const move = validMoves[i];
      const newBoard = mockMove(mockBoard, move, player); 
      const result: any = minMax(newBoard, depth -1, player = player === 1 ? 2 : 1)
      
      EDIT 1:
      const result: any = minMax(newBoard, depth -1, player = player === 1 ? 2 : 1, move)
      minMax(board, depth, player, move) <-- Added an argument for saving the move that it is analyzing
```
We have:
  * A move chosen from the valid moves, a new board iteration is defined from the results from this move being made, a result that will be analyzed (reducing the depth by 1  as well and changing the player, as to move to the other player and analyze the next move)
  ```
    const mockMove = function(mockBoard: Array<Array<number>>, col: number, player: number) {
    for (let row = 5; row >= 0; row--) {
      if (mockBoard[row][col] === 0) {
          mockBoard[row][col] = player;
          return mockBoard;
      }
    }
    return mockBoard;
  }
  ```
EDIT 1: I think I found out where I originally went wrong, I overlooked the fact that on 0 depth and 0 valid moves it wouldn't return a move. A short sighted error.

Now as these new arguments are being passed, it will eventually reach this stage:
```
Is result's score higher than the previous score? -> If yes, replace the score + move -> Return this data
```

EDIT 2: I also realize as I'm writing this that I am only ever collecting the first iteration of this minMax function. Will return when I figure this out. B)
  
