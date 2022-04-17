"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateOp = void 0;
const Index_1 = require("../Scheme/Action/Index");
class StateOp {
    Check(state, errorMessages) {
        let errorCount = 0;
        state.Actions.forEach((action) => {
            const messages = [];
            errorCount += Index_1.actionRegistry.CheckAction(action, messages);
            messages.forEach((msg) => {
                errorMessages.push(`[${state.Name}]${msg}`);
            });
        });
        return errorCount;
    }
    Fix(state, versionFrom, versionTo) {
        state.Actions.forEach((action) => {
            this.FixAction(action, versionFrom, versionTo);
        });
    }
    FixAction(action, versionFrom, versionTo) {
        Index_1.actionRegistry.FixAction(action);
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