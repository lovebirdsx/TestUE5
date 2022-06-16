/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { IFlowInfo } from '../../Common/Interface/IAction';
import { IBehaviorFlowComponent } from '../../Common/Interface/IComponent';
import { error } from '../../Common/Misc/Log';
import { ActionRunner } from '../Flow/ActionRunner';
import { Component, gameContext, ITickable } from '../Interface';
import { StateComponent } from './StateComponent';

export class BehaviorFlowComponent extends Component implements IBehaviorFlowComponent, ITickable {
    public InitStateId: number;

    public readonly FlowInfo: IFlowInfo;

    private ActionId: number;

    private Runner: ActionRunner;

    private State: StateComponent;

    private StateId: number;

    private MyIsPaused = false;

    private MyIsPausedByFlow = false;

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
        if (this.Runner) {
            if (this.Runner.IsRunning) {
                if (this.MyIsPaused || this.MyIsPausedByFlow) {
                    this.StopCurrentState();
                }
            }
        } else {
            if (!this.MyIsPaused && !this.MyIsPausedByFlow) {
                void this.Run();
            }
        }
    }

    public OnLoadState(): void {
        if (!this.IsConfigValid) {
            return;
        }

        this.StateId = this.State.GetState<number>('BehaviorStateId') || this.InitStateId;
        this.ActionId = this.State.GetState<number>('BehaviorActionId') || 0;
        this.MyIsPaused = this.State.GetState<boolean>('IsBehaviorPaused') || false;
    }

    public OnDestroy(): void {
        if (!this.IsConfigValid) {
            return;
        }

        gameContext.TickManager.RemoveTick(this);
        this.StopCurrentState();
    }

    public ChangeBehaviorState(stateId: number): void {
        this.StateId = stateId;
        this.State.SetState('BehaviorStateId', this.StateId);
    }

    public get IsRunning(): boolean {
        return this.Runner !== undefined;
    }

    public StopCurrentState(): void {
        if (this.Runner?.IsRunning) {
            this.Runner.Stop();
        }
    }

    // 该接口只能被FlowComponent调用
    public SetPausedByFlow(isPaused: boolean): void {
        if (!this.IsConfigValid) {
            return;
        }

        if (this.MyIsPausedByFlow === isPaused) {
            error(`${this.Name} no set PausedByFlow state to ${isPaused} twice`);
            return;
        }

        this.MyIsPausedByFlow = isPaused;
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
    }

    public async Run(): Promise<void> {
        if (!this.FlowInfo) {
            return;
        }

        if (this.Runner !== undefined) {
            error(`${this.Name} Can not run again`);
            return;
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.StateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.StateId}]`);
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
