"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeRandomStateScheme = exports.StateIdsScheme = exports.ChangeStateScheme = exports.StateIdScheme = exports.FinishStateScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
class FinishStateScheme extends Type_1.ObjectScheme {
    Fields = {};
    Filters = [Type_1.EActionFilter.FlowList];
    Tip = '结束状态,后续的动作将不被执行';
}
exports.FinishStateScheme = FinishStateScheme;
const DEFAULT_STATE_ID = 1;
class StateIdScheme extends Type_1.IntScheme {
    CreateDefault() {
        return DEFAULT_STATE_ID;
    }
}
exports.StateIdScheme = StateIdScheme;
class ChangeStateScheme extends Type_1.ObjectScheme {
    Fields = {
        StateId: new StateIdScheme(),
    };
    Filters = [Type_1.EActionFilter.FlowList];
    Tip = '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始';
}
exports.ChangeStateScheme = ChangeStateScheme;
class StateIdsScheme extends Type_1.ArrayScheme {
    Element = new StateIdScheme();
}
exports.StateIdsScheme = StateIdsScheme;
class ChangeRandomStateScheme extends Type_1.ObjectScheme {
    Fields = {
        StateIds: new StateIdsScheme(),
    };
    Filters = [Type_1.EActionFilter.FlowList];
    Tip = '随机选择一个状态进行跳转';
}
exports.ChangeRandomStateScheme = ChangeRandomStateScheme;
//# sourceMappingURL=State.js.map