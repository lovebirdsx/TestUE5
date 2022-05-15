/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { error } from '../../Common/Log';
import { IFlowInfo, IChangeBehaviorState } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Component, gameContext, IBehaviorFlowComponent, ITickable } from '../Interface';
import { StateComponent } from './StateComponent';

export class BehaviorFlowComponent extends Component implements IBehaviorFlowComponent, ITickable {
    public InitStateId: number;

    public readonly FlowInfo: IFlowInfo;

    private ActionId: number;

    private Runner: ActionRunner;

    private State: StateComponent;

    private MyIsPaused = false;

    private NextStateId = -1;

    private get IsConfigValid(): boolean {
        return this.FlowInfo && this.FlowInfo.States.length > 0;
    }

    public OnInit(): void {
        if (!this.IsConfigValid) {
            return;
        }

        this.State = this.Entity.GetComponent(StateComponent);

        gameContext.TickManager.AddTick(this);
    }

    public Tick(deltaTime: number): void {
        if (!this.IsPaused && !this.IsRunning) {
            void this.Run();
        }
    }

    public OnLoadState(): void {
        if (!this.IsConfigValid) {
            return;
        }

        this.InitStateId = this.State.GetState<number>('BehaviorStateId') || 0;
        this.NextStateId = this.State.GetState<number>('BehaviorNextStateId') || -1;
        this.ActionId = this.State.GetState<number>('BehaviorActionId') || 0;
        this.MyIsPaused = this.State.GetState<boolean>('IsBehaviorPaused') || false;
    }

    public OnDestroy(): void {
        if (!this.IsConfigValid) {
            return;
        }

        gameContext.TickManager.RemoveTick(this);

        // 不能在此处停止Runner, 因为调用OnDestroy时, UE的相关组件已经失效了
        // 而Runner中的Stop, 会访问到相关的组件(譬如CharacterMoveComponent)
        // if (this.IsRunning) {
        //     this.Runner.Stop();
        //     this.Runner = undefined;
        // }
    }

    public ChangeBehaviorState(stateId: number): void {
        this.InitStateId = stateId;
        this.State.SetState('BehaviorStateId', this.InitStateId);
    }

    public get IsRunning(): boolean {
        return this.Runner !== undefined;
    }

    public StopCurrentState(): void {
        if (this.Runner.IsRunning) {
            this.Runner.Stop();
        }
    }

    public get IsPaused(): boolean {
        return this.MyIsPaused;
    }

    public set IsPaused(isPaused: boolean) {
        if (!this.IsConfigValid) {
            return;
        }

        if (this.MyIsPaused === isPaused) {
            error(`${this.Name} no set pause state to ${isPaused} twice`);
            return;
        }

        this.MyIsPaused = isPaused;
        this.State.SetState('IsBehaviorPaused', isPaused ? true : undefined);
        if (isPaused) {
            this.Runner.Stop();
        }
    }

    public SetNextState(data: IChangeBehaviorState): void {
        if (data.IsInstant) {
            if (this.IsRunning) {
                this.Runner.Stop();
            } else if (this.MyIsPaused) {
                this.IsPaused = false;
            }
        }

        this.NextStateId = data.StateId;
        this.State.SetState('BehaviorNextStateId', this.NextStateId);
    }

    public async Run(): Promise<void> {
        if (!this.FlowInfo) {
            return;
        }

        if (this.Runner !== undefined) {
            error(`${this.Name} Can not run again`);
            return;
        }

        if (this.NextStateId >= 0) {
            this.ChangeBehaviorState(this.NextStateId);
            this.NextStateId = -1;
            this.State.SetState('BehaviorNextStateId', undefined);
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.InitStateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.InitStateId}]`);
            return;
        }

        this.Runner = new ActionRunner('BehaviorFlow', this.Entity, state.Actions);
        await this.Runner.Execute(this.ActionId, (actionId) => {
            this.ActionId = actionId + 1;
            this.State.SetState('BehaviorActionId', this.ActionId);
        });

        if (!this.Runner.IsInterrupt) {
            this.ActionId = 0;
            this.State.SetState('BehaviorActionId', undefined);
        }

        this.Runner = undefined;
    }
}
