"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowCellView = void 0;
const config_1 = require("../config");
const view_1 = require("./view");
class RowCellView extends view_1.View {
    _parentElement = config_1.THE_BOARD;
    _cells = config_1.CELLS;
    _rows = config_1.ROWS;
    init() {
        this._rows.forEach((el, i) => {
            el.dataset.row = String(i);
            el.querySelectorAll('.cell').forEach((el, i) => {
                if (el instanceof HTMLElement) {
                    el.dataset.col = String(i);
                }
            });
        });
    }
    addClickHandler(handler) {
        this._parentElement?.addEventListener('click', function (e) {
            if (e.target instanceof HTMLElement && e.target.classList.contains('cell')) {
                const num = e.target.dataset.col;
                handler(num);
            }
        });
    }
    render(data) {
        this._parentElement?.querySelector(`[data-row="${data[0]}"]`)
            ?.querySelector(`[data-col="${data[1]}"]`)
            ?.classList.add(`player${data[2]}`);
    }
    clear() {
        this._cells.forEach(el => {
            el.classList.remove('player1');
            el.classList.remove('player2');
            el.classList.remove('winning');
        });
        this._rows.forEach(el => {
            el.classList.remove('winning');
        });
    }
    renderWinningMoves(data) {
        const col = data.slice(1);
        if (data.length === 5) {
            col.forEach(el => this.colWinRender(data[0], el));
        }
        if (data.length === 8) {
            const row = data.slice(5);
            const col = data.slice(2, 5);
            this.colWinRender(data[0], data[1]);
            for (let i = 0; i < 3; i++) {
                this.colWinRender(row[i], col[i]);
            }
        }
    }
    colWinRender(row, col) {
        this._parentElement?.querySelector(`[data-row="${row}"]`)
            ?.querySelector(`[data-col="${col}"]`)
            ?.classList.add('winning');
    }
}
exports.RowCellView = RowCellView;
exports.default = new RowCellView();
