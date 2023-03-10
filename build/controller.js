"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model = require("./model");
const cellView_1 = require("./views/cellView");
const cellView_2 = require("./views/cellView");
const makeMove = (col) => {
    cellView_1.default.render(model.makeMove(col));
};
(() => {
    cellView_2.default.init();
    cellView_2.default.addClickHandler(makeMove);
})();
