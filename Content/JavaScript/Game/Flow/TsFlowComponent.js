"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
const UE = require("ue");
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
    // @no-blueprint
    RunnerHandler;
    // @no-blueprint
    TalkerDisplay;
    ReceiveBeginPlay() {
        const entity = this.GetOwner();
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD();
        this.TalkerDisplay = tsHud.TalkerDisplay;
    }
    // @no-blueprint
    Bind(flow) {
        this.Flow = flow;
        this.StateId = 0;
    }
    // @no-blueprint
    ExecuteChangeState(actionInfo) {
        const action = actionInfo.Params;
        const id = action.StateId;
        if (!this.Flow) {
            (0, Log_1.error)(`${this.Name} has not flow`);
            return;
        }
        if (this.RunnerHandler?.IsRunning) {
            (0, Log_1.error)(`${this.Name} can not change state while not running`);
            return;
        }
        this.RunnerHandler.Stop();
        this.StateId = id;
        const state = this.Flow.States[id];
        (0, Log_1.log)(`${this.GetName()} state change to [${state.Name}]`);
    }
    // @no-blueprint
    ExecuteFinishState(actionInfo) {
        const action = actionInfo.Params;
        (0, Log_1.log)(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
        this.RunnerHandler.Stop();
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
    async Interact() {
        let lastStateId = -1;
        while (lastStateId !== this.StateId) {
            lastStateId = this.StateId;
            const actions = this.Flow.States[lastStateId].Actions;
            this.RunnerHandler = this.ActionRunner.SpawnHandler(actions);
            // eslint-disable-next-line no-await-in-loop
            await this.RunnerHandler.Execute();
        }
    }
}
exports.default = TsFlowComponent;
//# sourceMappingURL=TsFlowComponent.js.map