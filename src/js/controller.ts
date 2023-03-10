import * as model from './model';
import cellView from './views/cellView';
import RowCellView from './views/cellView';
import { View } from './views/view';

const makeMove = (col : number) => {
  cellView.render(model.makeMove(col));
}
(() => {
  RowCellView.init()
  RowCellView.addClickHandler(makeMove)
})();