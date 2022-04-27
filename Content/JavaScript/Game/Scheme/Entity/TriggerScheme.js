"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheme = exports.actionsJsonScheme = exports.actionsScheme = void 0;
const Type_1 = require("../../../Common/Type");
const Public_1 = require("../Action/Public");
exports.actionsScheme = (0, Type_1.createObjectScheme)({
    Name: 'TriggerActions',
    Fields: {
        Actions: (0, Type_1.createArrayScheme)({
            NewLine: true,
            Element: Public_1.actionRegistry.GetActionScheme(Type_1.EActionFilter.Trigger),
        }),
    },
});
exports.actionsJsonScheme = (0, Type_1.createStringScheme)({
    Name: 'ActionsJson',
    IsJson: true,
    NewLine: true,
});
exports.triggerScheme = (0, Type_1.createObjectScheme)({
    Name: 'TsTrigger',
    Fields: {
        MaxTriggerTimes: (0, Type_1.createIntScheme)({
            ShowName: true,
            NewLine: true,
        }),
        TriggerActionsJson: exports.actionsJsonScheme,
    },
});
//# sourceMappingURL=TriggerScheme.js.map