"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const React = require("react");
const KeyCommands_1 = require("../../Editor/Common/KeyCommands");
const react_umg_1 = require("../../react-umg/react-umg");
const TalkerEditor_1 = require("./TalkerEditor");
const reactUmgStarter = puerts_1.argv.getByName('ReactUMGStarter');
react_umg_1.ReactUMG.init(reactUmgStarter);
KeyCommands_1.KeyCommands.Init(react_umg_1.ReactUMG.getRoot());
react_umg_1.ReactUMG.render(React.createElement(TalkerEditor_1.TalkerEditor));
//# sourceMappingURL=Main.js.map