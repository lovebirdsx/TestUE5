"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerActionScheme = exports.talkActionScheme = exports.flowListActionScheme = exports.createActionScheme = exports.ActionScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../Common/Type");
class ActionScheme extends Type_1.Scheme {
    RenderType = 'dynamic';
    Filter = Type_1.EActionFilter.FlowList;
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
function createActionScheme(type) {
    const scheme = new ActionScheme();
    Object.assign(scheme, type);
    return scheme;
}
exports.createActionScheme = createActionScheme;
exports.flowListActionScheme = createActionScheme({
    Name: 'FlowListAction',
    Filter: Type_1.EActionFilter.FlowList,
    CreateDefault() {
        const showTalk = {
            TalkItems: [],
        };
        return {
            Name: 'ShowTalk',
            Params: showTalk,
        };
    },
});
exports.talkActionScheme = createActionScheme({
    Name: 'TalkAction',
    Filter: Type_1.EActionFilter.Talk,
    CreateDefault() {
        const jumpTalk = {
            TalkId: 1,
        };
        return {
            Name: 'JumpTalk',
            Params: jumpTalk,
        };
    },
});
exports.triggerActionScheme = createActionScheme({
    Name: 'TriggerAction',
    Filter: Type_1.EActionFilter.Trigger,
});
//# sourceMappingURL=Action.js.map