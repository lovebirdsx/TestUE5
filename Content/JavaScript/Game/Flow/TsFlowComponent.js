"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
const UE = require("ue");
const Log_1 = require("../../Editor/Common/Log");
const FlowList_1 = require("../../Editor/Common/Operations/FlowList");
const TsEntityComponent_1 = require("../Entity/TsEntityComponent");
const TsActionRunnerComponent_1 = require("./TsActionRunnerComponent");
class FlowContext {
    FlowInfo;
    FlowListInfo;
    StateId;
    Runner;
    constructor(flowListInfo, flowInfo, stateId, runner) {
        this.FlowListInfo = flowListInfo;
        this.FlowInfo = flowInfo;
        this.StateId = stateId;
        this.Runner = runner;
    }
}
class TsFlowComponent extends TsEntityComponent_1.default {
    // @no-blueprint
    ActionRunner;
    // @no-blueprint
    TalkerDisplay;
    // @no-blueprint
    FlowStack;
    ReceiveBeginPlay() {
        const entity = this.GetOwner();
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('PlayFlow', this.ExecutePlayFlow.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD();
        this.TalkerDisplay = tsHud.TalkerDisplay;
        this.FlowStack = [];
    }
    // @no-blueprint
    async ExecuteChangeState(actionInfo) {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            (0, Log_1.error)(`ChangeState failed: ${this.Name} has not flow running`);
            return;
        }
        currentFlow.Runner.Stop();
        const changeState = actionInfo.Params;
        const flowInfo = currentFlow.FlowInfo;
        await this.RunFlow(currentFlow.FlowListInfo, flowInfo, changeState.StateId);
    }
    // @no-blueprint
    ExecuteFinishState(actionInfo) {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            (0, Log_1.error)(`FinishState failed: ${this.Name} has not flow running`);
            return;
        }
        currentFlow.Runner.Stop();
    }
    // @no-blueprint
    async ExecuteShowTalk(actionInfo) {
        // const action = actionInfo.Params as IShowTalk;
        // const items = action.TalkItems;
        // for (let i = 0; i < items.length; i++) {
        //     const item = items[i];
        //     // this.TalkerDisplay.ShowSubtile(item.)
        // }
    }
    // @no-blueprint
    async ExecutePlayFlow(actionInfo) {
        const playFlow = actionInfo.Params;
        const flowListName = playFlow.FlowListName;
        const flowListInfo = FlowList_1.flowListOp.LoadByName(flowListName);
        const flowId = playFlow.FlowId;
        const flowInfo = flowListInfo.Flows.find((flow0) => flow0.Id === flowId);
        if (!flowInfo) {
            (0, Log_1.error)(`[${flowListName}] No flow id for [${flowId}]`);
            return;
        }
        await this.RunFlow(flowListInfo, flowInfo, playFlow.StateId);
    }
    // @no-blueprint
    async RunFlow(flowListInfo, flowInfo, stateId) {
        const state = flowInfo.States.find((state0) => state0.Id === stateId);
        if (!state) {
            (0, Log_1.error)(`[${flowInfo.Name}] no state for id [${stateId}]`);
            return;
        }
        (0, Log_1.log)(`[${this.Name}][${flowInfo.Name}] to state [${state.Name}]`);
        const handler = this.ActionRunner.SpawnHandler(state.Actions);
        const context = new FlowContext(flowListInfo, flowInfo, stateId, handler);
        this.FlowStack.push(context);
        await handler.Execute();
    }
    // @no-blueprint
    async Interact(flowInfo) {
        if (this.FlowStack.length > 0) {
            (0, Log_1.error)(`Can not interact again while already interact`);
            return;
        }
        if (flowInfo.States.length <= 0) {
            return;
        }
        await this.RunFlow(null, flowInfo, flowInfo.States[0].Id);
    }
}
exports.default = TsFlowComponent;
//# sourceMappingURL=TsFlowComponent.js.map