"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavView = void 0;
const config_1 = require("../config");
const view_1 = require("./view");
class NavView extends view_1.View {
    _button = config_1.RESET_BUTTON;
    addResetHandler(handler) {
        this._button?.addEventListener('click', function (e) {
            if (e.target instanceof HTMLElement) {
                e.preventDefault();
                handler();
            }
        });
    }
}
exports.NavView = NavView;
exports.default = new NavView();
