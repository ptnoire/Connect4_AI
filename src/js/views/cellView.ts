import { CELLS, ROWS, THE_BOARD } from "../config";
import { View } from "./view";

export class RowCellView extends View {
    _parentElement = THE_BOARD;
    _cells = CELLS;
    _rows = ROWS;

    init() {
        this._rows.forEach((el, i) => {
            el.dataset.row = String(i);
            el.querySelectorAll('.cell').forEach((el, i) => {
                if(el instanceof HTMLElement) {
                    el.dataset.col = String(i);
                }
            })
        })
    }

    addClickHandler(handler : Function) {
        this._parentElement?.addEventListener('click', function(e) {
            if (e.target instanceof HTMLElement) {
                const num = e.target.dataset.col;
                handler(num);
            }
        })
    }

    render(data : Array<Number>) {
        this._parentElement?.querySelector(`[data-row="${data[0]}"]`)
        ?.querySelector(`[data-col="${data[1]}"]`)
        ?.classList.add(`player${data[2]}`);
    }

    clear() {
        this._cells.forEach(el => {
            el.classList.remove('player1');
            el.classList.remove('player2');
        })
    }
}

export default new RowCellView();