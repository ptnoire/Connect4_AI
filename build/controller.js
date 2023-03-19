"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("./model");
const cellView_1 = require("./views/cellView");
const cellView_2 = require("./views/cellView");
const navView_1 = require("./views/navView");
const makeMove = (col) => {
    if (model.gameState === '') {
        cellView_2.default.render(model.makeMove(col));
        switchTurn();
    }
    if (model.gameState !== '') {
        navView_1.default.titleChange(model.gameState);
        cellView_1.default.renderWinningMoves(model.winningMove);
    }
};
const switchTurn = () => {
    cellView_2.default.render(model.makeMove(model.AImove()));
};
const resetBoard = () => {
    model.reset();
    cellView_2.default.clear();
    navView_1.default.titleReset();
};
(() => {
    cellView_2.default.init();
    cellView_2.default.addClickHandler(makeMove);
    navView_1.default.addResetHandler(resetBoard);
})();
