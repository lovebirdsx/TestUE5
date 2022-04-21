"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestContextBtn = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../Common/Log");
const ContextBtn_1 = require("../Common/BaseComponent/ContextBtn");
// eslint-disable-next-line @typescript-eslint/naming-convention
function TestContextBtn() {
    return (React.createElement(react_umg_1.VerticalBox, null,
        React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveDown', 'moveUp'], OnCommand: (cmd) => {
                (0, Log_1.log)(cmd);
            } })));
}
exports.TestContextBtn = TestContextBtn;
//# sourceMappingURL=TestContextBtn.js.map