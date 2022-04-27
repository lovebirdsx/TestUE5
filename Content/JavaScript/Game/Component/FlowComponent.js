"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowComponent = void 0;
const Entity_1 = require("../../Common/Entity");
const Log_1 = require("../../Common/Log");
const FlowList_1 = require("../Common/Operations/FlowList");
const ActionRunnerComponent_1 = require("./ActionRunnerComponent");
const StateComponent_1 = require("./StateComponent");
const TalkComponent_1 = require("./TalkComponent");
class FlowComponent extends Entity_1.Component {
    InitState;
    StateId;
    ActionRunner;
    Talk;
    Handler;
    State;
    FlowInfo;
    FlowListInfo;
    OnInit() {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent_1.ActionRunnerComponent);
        this.Talk = this.Entity.GetComponent(TalkComponent_1.TalkComponent);
        this.State = this.Entity.GetComponent(StateComponent_1.default);
        this.StateId = this.State.GetState('StateId') || this.InitState.StateId;
        this.FlowListInfo = FlowList_1.flowListOp.LoadByName(this.InitState.FlowListName);
        this.FlowInfo = this.FlowListInfo.Flows.find((flow) => flow.Id === this.InitState.FlowId);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
    }
    ExecuteChangeState(actionInfo) {
        const changeState = actionInfo.Params;
        this.StateId = changeState.StateId;
        this.State.SetState('StateId', this.StateId);
    }
    ExecuteFinishState(actionInfo) {
        this.Handler.Stop();
        this.Handler = undefined;
    }
    async ExecuteShowTalk(actionInfo) {
        const showTalk = actionInfo.Params;
        await this.Talk.Show(this.FlowListInfo, showTalk);
    }
    async Run() {
        if (this.Handler) {
            (0, Log_1.error)(`${this.Name} Can not run again`);
            return;
        }
        const state = this.FlowInfo.States.find((state0) => state0.Id === this.StateId);
        if (!state) {
            (0, Log_1.error)(`[${this.FlowInfo.Name}] no state for id [${this.StateId}]`);
            return;
        }
        (0, Log_1.log)(`[${this.Name}][${this.FlowInfo.Name}] to state [${state.Name}]`);
        this.Handler = this.ActionRunner.SpawnHandler(state.Actions);
        await this.Handler.Execute();
        this.Handler = undefined;
    }
}
exports.FlowComponent = FlowComponent;
//# sourceMappingURL=FlowComponent.js.map