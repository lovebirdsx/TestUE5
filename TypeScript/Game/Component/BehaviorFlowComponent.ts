/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { error, log } from '../../Common/Log';
import { IActionInfo, IChangeState, IFlowInfo } from '../Flow/Action';
import { Component, gameContext, IBehaviorFlowComponent, ITickable } from '../Interface';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';
import MoveComponent from './MoveComponent';
import StateComponent from './StateComponent';

export class BehaviorFlowComponent extends Component implements IBehaviorFlowComponent, ITickable {
    public InitStateId: number;

    public readonly FlowInfo: IFlowInfo;

    private ActionId: number;

    private ActionRunner: ActionRunnerComponent;

    private MoveComponent: MoveComponent;

    private Handler: ActionRunnerHandler;

    private State: StateComponent;

    private MyIsPaused = false;

    public OnInit(): void {
        if (!this.FlowInfo) {
            return;
        }

        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.MoveComponent = this.Entity.GetComponent(MoveComponent);
        this.State = this.Entity.GetComponent(StateComponent);
        this.ActionRunner.RegisterActionFun(
            'ChangeBehaviorState',
            this.ExecuteChangeBehaviorState.bind(this),
        );

        gameContext.TickManager.AddTick(this);
    }

    public Tick(deltaTime: number): void {
        if (!this.IsPaused && !this.IsRunning) {
            log(`Run .................`);
            void this.Run();
        }
    }

    public OnLoadState(): void {
        if (!this.FlowInfo) {
            return;
        }

        this.InitStateId = this.State.GetState<number>('BehaviorStateId') || 0;
        this.ActionId = this.State.GetState<number>('BehaviorActionId') || 0;
    }

    public OnDestroy(): void {
        if (!this.FlowInfo) {
            return;
        }

        gameContext.TickManager.RemoveTick(this);

        if (this.IsRunning) {
            this.Handler.Stop();
            this.Handler = undefined;
        }
    }

    private ExecuteChangeBehaviorState(actionInfo: IActionInfo): void {
        const changeState = actionInfo.Params as IChangeState;
        this.InitStateId = changeState.StateId;
        this.State.SetState('BehaviorStateId', this.InitStateId);
    }

    public get IsRunning(): boolean {
        return this.Handler !== undefined;
    }

    public get IsPaused(): boolean {
        return this.MyIsPaused;
    }

    public async SetPaused(isPaused: boolean): Promise<void> {
        if (this.MyIsPaused === isPaused) {
            error(`${this.Name} no set pause state to ${isPaused} twice`);
            return;
        }

        this.MyIsPaused = isPaused;
        if (isPaused) {
            await this.MoveComponent.StopMove();
            this.Handler.Stop();
            this.Handler = undefined;
        }
    }

    public async Run(): Promise<void> {
        if (!this.FlowInfo) {
            return;
        }

        if (this.Handler !== undefined) {
            error(`${this.Name} Can not run again`);
            return;
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.InitStateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.InitStateId}]`);
            return;
        }

        this.Handler = this.ActionRunner.SpawnHandler(state.Actions);
        await this.Handler.Execute(this.ActionId, (actionId: number) => {
            this.State.SetState('BehaviorActionId', actionId);
            this.ActionId = actionId + 1;
        });
        this.Handler = undefined;
        this.ActionId = 0;
        this.State.SetState('BehaviorActionId', undefined);
    }
}
