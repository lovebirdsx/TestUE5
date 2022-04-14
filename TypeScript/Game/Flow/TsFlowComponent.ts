/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
import * as UE from 'ue';

import { error, log } from '../../Editor/Common/Log';
import { flowListOp } from '../../Editor/Common/Operations/FlowList';
import TsEntity from '../Entity/TsEntity';
import TsEntityComponent from '../Entity/TsEntityComponent';
import TsHud from '../Player/TsHud';
import { IActionInfo, IChangeState, IFlowInfo, IFlowListInfo, IPlayFlow } from './Action';
import TsActionRunnerComponent, { ActionRunnerHandler } from './TsActionRunnerComponent';

class FlowContext {
    public FlowInfo: IFlowInfo;

    public FlowListInfo: IFlowListInfo;

    public StateId: number;

    public Runner: ActionRunnerHandler;

    public constructor(
        flowListInfo: IFlowListInfo,
        flowInfo: IFlowInfo,
        stateId: number,
        runner: ActionRunnerHandler,
    ) {
        this.FlowListInfo = flowListInfo;
        this.FlowInfo = flowInfo;
        this.StateId = stateId;
        this.Runner = runner;
    }
}

class TsFlowComponent extends TsEntityComponent {
    // @no-blueprint
    private ActionRunner: TsActionRunnerComponent;

    // @no-blueprint
    private TalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    // @no-blueprint
    private FlowStack: FlowContext[];

    public ReceiveBeginPlay(): void {
        const entity = this.GetOwner() as TsEntity;
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('PlayFlow', this.ExecutePlayFlow.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));

        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD() as TsHud;
        this.TalkerDisplay = tsHud.TalkerDisplay;

        this.FlowStack = [];
    }

    // @no-blueprint
    private async ExecuteChangeState(actionInfo: IActionInfo): Promise<void> {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            error(`ChangeState failed: ${this.Name} has not flow running`);
            return;
        }

        currentFlow.Runner.Stop();
        const changeState = actionInfo.Params as IChangeState;
        const flowInfo = currentFlow.FlowInfo;
        await this.RunFlow(currentFlow.FlowListInfo, flowInfo, changeState.StateId);
    }

    // @no-blueprint
    private ExecuteFinishState(actionInfo: IActionInfo): void {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            error(`FinishState failed: ${this.Name} has not flow running`);
            return;
        }

        currentFlow.Runner.Stop();
    }

    // @no-blueprint
    private async ExecuteShowTalk(actionInfo: IActionInfo): Promise<void> {
        // const action = actionInfo.Params as IShowTalk;
        // const items = action.TalkItems;
        // for (let i = 0; i < items.length; i++) {
        //     const item = items[i];
        //     // this.TalkerDisplay.ShowSubtile(item.)
        // }
    }

    // @no-blueprint
    private async ExecutePlayFlow(actionInfo: IActionInfo): Promise<void> {
        const playFlow = actionInfo.Params as IPlayFlow;
        const flowListName = playFlow.FlowListName;
        const flowListInfo = flowListOp.LoadByName(flowListName);
        const flowId = playFlow.FlowId;
        const flowInfo = flowListInfo.Flows.find((flow0) => flow0.Id === flowId);
        if (!flowInfo) {
            error(`[${flowListName}] No flow id for [${flowId}]`);
            return;
        }

        await this.RunFlow(flowListInfo, flowInfo, playFlow.StateId);
    }

    // @no-blueprint
    private async RunFlow(
        flowListInfo: IFlowListInfo,
        flowInfo: IFlowInfo,
        stateId: number,
    ): Promise<void> {
        const state = flowInfo.States.find((state0) => state0.Id === stateId);
        if (!state) {
            error(`[${flowInfo.Name}] no state for id [${stateId}]`);
            return;
        }

        log(`[${this.Name}][${flowInfo.Name}] to state [${state.Name}]`);

        const handler = this.ActionRunner.SpawnHandler(state.Actions);
        const context = new FlowContext(flowListInfo, flowInfo, stateId, handler);
        this.FlowStack.push(context);
        await handler.Execute();
    }

    // @no-blueprint
    public async Interact(flowInfo: IFlowInfo): Promise<void> {
        if (this.FlowStack.length > 0) {
            error(`Can not interact again while already interact`);
            return;
        }

        if (flowInfo.States.length <= 0) {
            return;
        }

        await this.RunFlow(null, flowInfo, flowInfo.States[0].Id);
    }
}

export default TsFlowComponent;
