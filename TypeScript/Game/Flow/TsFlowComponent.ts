/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
import * as UE from 'ue';

import { error, log } from '../../Editor/Common/Log';
import TsEntity from '../Entity/TsEntity';
import TsEntityComponent from '../Entity/TsEntityComponent';
import TsHud from '../Player/TsHud';
import { IActionInfo, IChangeState, IFinishState, IFlowInfo } from './Action';
import TsActionRunnerComponent, { ActionRunnerHandler } from './TsActionRunnerComponent';

class TsFlowComponent extends TsEntityComponent {
    // @no-blueprint
    private Flow: IFlowInfo;

    // @no-blueprint
    private ActionRunner: TsActionRunnerComponent;

    // @no-blueprint
    private StateId: number;

    // @no-blueprint
    private RunnerHandler: ActionRunnerHandler;

    // @no-blueprint
    private TalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    public ReceiveBeginPlay(): void {
        const entity = this.GetOwner() as TsEntity;
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));

        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD() as TsHud;
        this.TalkerDisplay = tsHud.TalkerDisplay;
    }

    // @no-blueprint
    public Bind(flow: IFlowInfo): void {
        this.Flow = flow;
        this.StateId = 0;
    }

    // @no-blueprint
    private ExecuteChangeState(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as IChangeState;
        const id = action.StateId;
        if (!this.Flow) {
            error(`${this.Name} has not flow`);
            return;
        }

        if (this.RunnerHandler?.IsRunning) {
            error(`${this.Name} can not change state while not running`);
            return;
        }

        this.RunnerHandler.Stop();
        this.StateId = id;

        const state = this.Flow.States[id];
        log(`${this.GetName()} state change to [${state.Name}]`);
    }

    // @no-blueprint
    private ExecuteFinishState(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as IFinishState;
        log(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
        this.RunnerHandler.Stop();
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
    public async Interact(): Promise<void> {
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

export default TsFlowComponent;
