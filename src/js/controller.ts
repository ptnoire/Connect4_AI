import * as model from './model';
import RowCellView from './views/cellView';
import navView from './views/navView';

const makeMove = (col : number) => {
  RowCellView.render(model.makeMove(col));
}

const resetBoard = () => {
  model.reset();
  RowCellView.clear();
}

(() => {
  RowCellView.init();
  RowCellView.addClickHandler(makeMove);
  navView.addResetHandler(resetBoard);
})();