"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateOp = void 0;
const Action_1 = require("../Scheme/Action");
class StateOp {
    Fix(state, versionFrom, versionTo) {
        state.Actions.forEach((action) => {
            this.FixAction(action, versionFrom, versionTo);
        });
    }
    FixAction(action, versionFrom, versionTo) {
        Action_1.scheme.FixAction(action);
    }
    ForeachActions(state, actionCb) {
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
exports.stateOp = new StateOp();
//# sourceMappingURL=State.js.map