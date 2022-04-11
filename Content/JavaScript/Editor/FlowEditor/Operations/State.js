"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateOp = void 0;
const Action_1 = require("../../Common/Scheme/Action");
class StateOp {
    static Fix(state, versionFrom, versionTo) {
        state.Actions.forEach((action) => {
            this.FixAction(action, versionFrom, versionTo);
        });
    }
    static FixAction(action, versionFrom, versionTo) {
        Action_1.scheme.FixAction(action);
    }
    static ForeachActions(state, actionCb) {
        state.Actions.forEach((action) => {
            actionCb(action);
            if (action.Name === 'ShowTalk') {
                const showTalk = action.Params;
                showTalk.TalkItems.forEach((talkItem) => {
                    if (talkItem.Actions) {
                        talkItem.Actions.forEach(actionCb);
                    }
                    if (talkItem.Options) {
                        talkItem.Options.forEach((option) => {
                            option.Actions.forEach(actionCb);
                        });
                    }
                });
            }
        });
    }
}
exports.StateOp = StateOp;
//# sourceMappingURL=State.js.map