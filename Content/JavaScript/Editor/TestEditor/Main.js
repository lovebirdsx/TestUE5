"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const Init_1 = require("../../Common/Init");
const Public_1 = require("../../Game/Entity/Public");
const TestEditor_1 = require("./TestEditor");
(0, Init_1.initCommon)();
(0, Public_1.initEntity)();
const reactUmgStarter = puerts_1.argv.getByName('ReactUMGStarter');
(0, TestEditor_1.runTestEditor)(reactUmgStarter);
//# sourceMappingURL=Main.js.map