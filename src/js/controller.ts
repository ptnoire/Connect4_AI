import * as model from './model';
import cellView from './views/cellView';
import RowCellView from './views/cellView';
import navView from './views/navView';

const makeMove = (col : number) => {
  if(model.gameState === '' && model.currentPlayer === 1) {
    RowCellView.render(model.makeMove(col));
    checkWin();
    setTimeout(() => switchTurn(), 1000);
  }

}

const switchTurn = async () => {
  if(model.gameState === '' && model.currentPlayer === 2){
  RowCellView.render(model.makeMove(await model.AImove() || 0));
  checkWin();
  }
}

const checkWin = () => {
  if(model.gameState !== '') {
    navView.titleChange(model.gameState);
    cellView.renderWinningMoves(model.winningMove);
  }
}

const resetBoard = () => {
  model.reset();
  RowCellView.clear();
  navView.titleReset();
}

(() => {
  RowCellView.init();
  RowCellView.addClickHandler(makeMove);
  navView.addResetHandler(resetBoard);
})();