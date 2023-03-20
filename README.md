# Using Connect 4 to do a dive into AI algorithms.

A friend said 'make a connect 4 game, then try to make an AI that you can't beat' and I was like ok.

Just for fun, also first full program written with TypeScript.

Friend said to check out `minmax` algo, so I begun my deep dive in on it.
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
  
