"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../../Editor/Common/Log");
const TsEntityComponent_1 = require("../Entity/TsEntityComponent");
const TsActionRunnerComponent_1 = require("./TsActionRunnerComponent");
class TsFlowComponent extends TsEntityComponent_1.default {
    // @no-blueprint
    Flow;
    // @no-blueprint
    ActionRunner;
    // @no-blueprint
    StateId;
    ReceiveBeginPlay() {
        const entity = this.GetOwner();
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
    }
    // @no-blueprint
    Bind(flow) {
        this.Flow = flow;
        this.StateId = 0;
    }
    // @no-blueprint
    ExecuteChangeState(action) {
        const changeStateAction = action.Params;
        this.ChangeState(changeStateAction.StateId);
    }
    // @no-blueprint
    ExecuteFinishState(action) {
        this.FinishState(action.Params);
    }
    // @no-blueprint
    ChangeState(id) {
        if (!this.Flow) {
            (0, Log_1.error)(`${this.Name} has not flow`);
            return;
        }
        if (!this.ActionRunner.IsRunning) {
            (0, Log_1.error)(`${this.Name} can not change state while not running`);
            return;
        }
        this.ActionRunner.Stop();
        this.StateId = id;
        const state = this.Flow.States[id];
        (0, Log_1.log)(`${this.GetName()} state change to [${state.Name}]`);
    }
    // @no-blueprint
    FinishState(action) {
        (0, Log_1.log)(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
    }
    // @no-blueprint
    async Interact() {
        let lastStateId = -1;
        while (lastStateId !== this.StateId) {
            lastStateId = this.StateId;
            const actions = this.Flow.States[lastStateId].Actions;
            // eslint-disable-next-line no-await-in-loop
            await this.ActionRunner.Execute(actions);
        }
    }
}
exports.default = TsFlowComponent;
//# sourceMappingURL=TsFlowComponent.js.map