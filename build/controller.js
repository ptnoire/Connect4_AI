"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("./model");
const cellView_1 = require("./views/cellView");
const navView_1 = require("./views/navView");
const makeMove = (col) => {
    cellView_1.default.render(model.makeMove(col));
};
const resetBoard = () => {
    model.reset();
    cellView_1.default.clear();
};
(() => {
    cellView_1.default.init();
    cellView_1.default.addClickHandler(makeMove);
    navView_1.default.addResetHandler(resetBoard);
})();
