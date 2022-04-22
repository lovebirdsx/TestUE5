"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npcScheme = exports.playFlowJsonScheme = void 0;
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
exports.playFlowJsonScheme = (0, Type_1.createStringScheme)({
    NewLine: true,
    CreateDefault: () => {
        return JSON.stringify((0, Action_1.parsePlayFlow)(''));
    },
});
exports.npcScheme = Type_1.emptyObjectScheme;
//# sourceMappingURL=NpcScheme.js.map