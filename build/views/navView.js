"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavView = void 0;
const config_1 = require("../config");
const view_1 = require("./view");
class NavView extends view_1.View {
    _button = config_1.RESET_BUTTON;
    _title = config_1.TITLE;
    addResetHandler(handler) {
        this._button?.addEventListener('click', function (e) {
            if (e.target instanceof HTMLElement) {
                e.preventDefault();
                handler();
            }
        });
    }
    titleChange(input) {
        if (this._title !== null)
            this._title.textContent = input;
        this._title?.classList.add('winScreen');
    }
    titleReset() {
        if (this._title !== null)
            this._title.textContent = `CONNECT4 : GREG'S WORLD`;
        this._title?.classList.remove('winScreen');
    }
}
exports.NavView = NavView;
exports.default = new NavView();
