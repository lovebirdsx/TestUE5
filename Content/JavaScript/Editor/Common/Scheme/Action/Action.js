"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerActionScheme = exports.TalkActionScheme = exports.FlowListActionScheme = exports.ActionScheme = void 0;
const Type_1 = require("../../../../Common/Type");
class ActionScheme extends Type_1.Scheme {
    RenderType = 'dynamic';
    CreateDefault() {
        const logAction = {
            Level: 'Info',
            Content: 'Hello World',
        };
        return {
            Name: 'Log',
            Params: logAction,
        };
    }
}
exports.ActionScheme = ActionScheme;
class FlowListActionScheme extends ActionScheme {
    Filter = Type_1.EActionFilter.FlowList;
}
exports.FlowListActionScheme = FlowListActionScheme;
class TalkActionScheme extends ActionScheme {
    Filter = Type_1.EActionFilter.Talk;
}
exports.TalkActionScheme = TalkActionScheme;
class TriggerActionScheme extends ActionScheme {
    Filter = Type_1.EActionFilter.Trigger;
}
exports.TriggerActionScheme = TriggerActionScheme;
//# sourceMappingURL=Action.js.map