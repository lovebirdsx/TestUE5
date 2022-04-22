"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRandomStateScheme = exports.changeStateScheme = exports.stateIdScheme = exports.finishStateScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
exports.finishStateScheme = (0, Type_1.createObjectScheme)({}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Tip: '结束状态,后续的动作将不被执行',
});
const DEFAULT_STATE_ID = 1;
exports.stateIdScheme = (0, Type_1.createIntScheme)({
    CreateDefault: () => DEFAULT_STATE_ID,
});
exports.changeStateScheme = (0, Type_1.createObjectScheme)({
    StateId: exports.stateIdScheme,
}, {
    Filters: [Type_1.EActionFilter.FlowList, Type_1.EActionFilter.Talk],
    Tip: '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始',
});
exports.changeRandomStateScheme = (0, Type_1.createObjectScheme)({
    StateIds: (0, Type_1.createArrayScheme)({
        Element: exports.stateIdScheme,
    }),
}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Tip: '随机选择一个状态进行跳转',
});
//# sourceMappingURL=State.js.map