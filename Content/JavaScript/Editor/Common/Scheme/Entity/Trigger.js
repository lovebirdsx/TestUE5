"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheme = void 0;
const Action_1 = require("../Action");
exports.triggerScheme = (0, Action_1.createObjectSchemeForUeClass)({
    MaxTriggerTimes: Action_1.intScheme,
    TriggerActions: Action_1.stringScheme,
});
//# sourceMappingURL=Trigger.js.map