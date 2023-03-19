import * as model from './model';
import cellView from './views/cellView';
import RowCellView from './views/cellView';
import navView from './views/navView';

const makeMove = (col : number) => {
  if(model.gameState === '') RowCellView.render(model.makeMove(col));
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