"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheme = void 0;
const Action_1 = require("../Action");
exports.triggerScheme = (0, Action_1.createObjectSchemeForUeClass)({
    MaxTriggerTimes: (0, Action_1.createIntScheme)({
        Meta: {
            NewLine: true,
        },
    }),
    TriggerActions: (0, Action_1.createStringScheme)({
        Meta: {
            NewLine: true,
        },
    }),
});
//# sourceMappingURL=Trigger.js.map