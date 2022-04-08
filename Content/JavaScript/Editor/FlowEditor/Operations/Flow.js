"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowOp = void 0;
const State_1 = require("./State");
class FlowOp {
    static CreateState(flow) {
        const state = {
            Name: `状态${flow.StateGenId}`,
            Actions: [],
            Id: flow.StateGenId,
        };
        return state;
    }
    static Fix(flow, versionFrom, versionTo) {
        flow.States.forEach((state) => {
            State_1.StateOp.Fix(state, versionFrom, versionTo);
        });
        // 确保每一个切换状态指令的stateId合法
        const allStateIds = flow.States.map((state) => state.Id);
        flow.States.forEach((state) => {
            State_1.StateOp.ForeachActions(state, (action) => {
                if (action.Name === 'ChangeState') {
                    const changeState = action.Params;
                    if (!allStateIds.includes(changeState.StateId)) {
                        changeState.StateId = allStateIds[0];
                    }
                }
                else if (action.Name === 'ChangeRandomState') {
                    const changeRandomState = action.Params;
                    const stateIds = changeRandomState.StateIds;
                    for (let i = stateIds.length - 1; i >= 0; i--) {
                        const stateId = stateIds[i];
                        if (!allStateIds.includes(stateId)) {
                            stateIds.splice(i, 1);
                        }
                    }
                    if (stateIds.length < 0) {
                        stateIds.push(allStateIds[0]);
                    }
                }
            });
        });
    }
    static GetDestinationStatesImpl(flow, actions, result) {
        if (!actions) {
            return;
        }
        actions.forEach((action) => {
            if (action.Name === 'ShowTalk') {
                const showTalk = action.Params;
                showTalk.TalkItems.forEach((item) => {
                    this.GetDestinationStatesImpl(flow, item.Actions, result);
                    if (item.Options) {
                        item.Options.forEach((option) => {
                            this.GetDestinationStatesImpl(flow, option.Actions, result);
                        });
                    }
                });
            }
            else if (action.Name === 'ChangeState') {
                const changeState = action.Params;
                const state = flow.States.find((e) => e.Id === changeState.StateId);
                if (state && !result.includes(state.Name)) {
                    result.push(state.Name);
                }
            }
            else if (action.Name === 'ChangeRandomState') {
                const changeRandomState = action.Params;
                const stateIds = changeRandomState.StateIds;
                stateIds.forEach((id) => {
                    const state = flow.States.find((e) => e.Id === id);
                    if (state && !result.includes(state.Name)) {
                        result.push(state.Name);
                    }
                });
            }
        });
    }
    static GetDestinationStates(flow, state) {
        const result = [];
        this.GetDestinationStatesImpl(flow, state.Actions, result);
        return result;
    }
}
exports.FlowOp = FlowOp;
//# sourceMappingURL=Flow.js.map