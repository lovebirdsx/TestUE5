/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { error } from '../../Common/Log';
import { flowListOp } from '../Common/Operations/FlowList';
import {
    IActionInfo,
    IChangeState,
    IFlowInfo,
    IFlowListInfo,
    IPlayFlow,
    IShowTalk,
} from '../Flow/Action';
import { Component, gameContext, IFlowComponent, ITickable } from '../Interface';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';
import StateComponent from './StateComponent';
import { TalkComponent } from './TalkComponent';

export class FlowComponent extends Component implements IFlowComponent, ITickable {
    public readonly InitState: IPlayFlow;

    public readonly AutoRun: boolean;

    public readonly Continuable: boolean;

    private StateId: number;

    private ActionId: number;

    private ActionRunner: ActionRunnerComponent;

    private Talk: TalkComponent;

    private Handler: ActionRunnerHandler;

    private State: StateComponent;

    private FlowInfo: IFlowInfo;

    private FlowListInfo: IFlowListInfo;

    public OnInit(): void {
        if (!this.InitState) {
            return;
        }

        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.Talk = this.Entity.GetComponent(TalkComponent);
        this.State = this.Entity.GetComponent(StateComponent);
        this.FlowListInfo = flowListOp.LoadByName(this.InitState.FlowListName);
        this.FlowInfo = this.FlowListInfo.Flows.find((flow) => flow.Id === this.InitState.FlowId);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
    }

    public Tick(deltaTime: number): void {
        if (this.Continuable) {
            if (!this.IsRunning) {
                void this.Run();
            }
        }
    }

    public OnLoadState(): void {
        if (!this.InitState) {
            return;
        }

        this.StateId = this.State.GetState<number>('StateId') || this.InitState.StateId;
        this.ActionId = this.State.GetState<number>('ActionId') || 0;
    }

    public OnStart(): void {
        if (!this.InitState) {
            return;
        }

        if (this.AutoRun) {
            void this.Run();
        }

        if (this.Continuable) {
            gameContext.TickManager.AddTick(this);
        }
    }

    public OnDestroy(): void {
        if (this.Continuable) {
            gameContext.TickManager.RemoveTick(this);
        }

        if (this.IsRunning) {
            this.Handler.Stop();
            this.Handler = undefined;
        }
    }

    private ExecuteChangeState(actionInfo: IActionInfo): void {
        const changeState = actionInfo.Params as IChangeState;
        this.StateId = changeState.StateId;
        this.State.SetState('StateId', this.StateId);
    }

    private ExecuteFinishState(actionInfo: IActionInfo): void {
        this.Handler.Stop();
        this.Handler = undefined;
    }

    private async ExecuteShowTalk(actionInfo: IActionInfo): Promise<void> {
        const showTalk = actionInfo.Params as IShowTalk;
        await this.Talk.Show(this.FlowListInfo, showTalk);
    }

    public get IsRunning(): boolean {
        return this.Handler !== undefined;
    }

    public async Run(): Promise<void> {
        if (!this.InitState) {
            return;
        }

        if (this.Handler) {
            error(`${this.Name} Can not run again`);
            return;
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.StateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.StateId}]`);
            return;
        }

        // log(`[${this.Name}][${this.FlowInfo.Name}] to state [${state.Name}]`);

        this.Handler = this.ActionRunner.SpawnHandler(state.Actions);
        await this.Handler.Execute(this.ActionId, (actionId: number) => {
            this.State.SetState('ActionId', actionId);
            this.ActionId = actionId + 1;
        });
        this.Handler = undefined;
        this.ActionId = 0;
        this.State.SetState('ActionId', undefined);
    }
}
