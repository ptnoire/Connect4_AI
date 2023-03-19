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
            el.classList.remove('winning');
        })
        this._rows.forEach(el => {
            el.classList.remove('winning');
        })
    }

    renderWinningMoves(data : Array<number>) {
        const col = data.slice(1);
        
        if(data.length === 5) {
            col.forEach(el => this.colWinRender(data[0], el));
        }

        if(data.length === 8) {
            const row = data.slice(5);
            const col = data.slice(2,5);
            this.colWinRender(data[0], data[1]);
            for (let i = 0; i < 3; i++) {
                this.colWinRender(row[i], col[i]);
            }
        }
    }

    colWinRender(row: number, col: number) {
        this._parentElement?.querySelector(`[data-row="${row}"]`)
            ?.querySelector(`[data-col="${col}"]`)
            ?.classList.add('winning');
    }
}

export default new RowCellView();