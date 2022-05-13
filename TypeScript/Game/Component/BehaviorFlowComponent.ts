/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { delay } from '../../Common/Async';
import { error, log } from '../../Common/Log';
import { IFlowInfo } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Component, gameContext, IBehaviorFlowComponent, ITickable } from '../Interface';
import MoveComponent from './MoveComponent';
import StateComponent from './StateComponent';

export class BehaviorFlowComponent extends Component implements IBehaviorFlowComponent, ITickable {
    public InitStateId: number;

    public readonly FlowInfo: IFlowInfo;

    private ActionId: number;

    private MoveComponent: MoveComponent;

    private Runner: ActionRunner;

    private State: StateComponent;

    private MyIsPaused = false;

    private get IsConfigValid(): boolean {
        return this.FlowInfo && this.FlowInfo.States.length > 0;
    }

    public OnInit(): void {
        if (!this.IsConfigValid) {
            return;
        }

        this.MoveComponent = this.Entity.GetComponent(MoveComponent);
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
        this.ActionId = this.State.GetState<number>('BehaviorActionId') || 0;
    }

    public OnDestroy(): void {
        if (!this.IsConfigValid) {
            return;
        }

        gameContext.TickManager.RemoveTick(this);

        if (this.IsRunning) {
            void this.Runner.Stop();
            this.Runner = undefined;
        }
    }

    public ChangeBehaviorState(stateId: number): void {
        this.InitStateId = stateId;
        this.State.SetState('BehaviorStateId', this.InitStateId);
    }

    public get IsRunning(): boolean {
        return this.Runner !== undefined;
    }

    public get IsPaused(): boolean {
        return this.MyIsPaused;
    }

    public async SetPaused(isPaused: boolean): Promise<void> {
        if (!this.IsConfigValid) {
            return;
        }

        if (this.MyIsPaused === isPaused) {
            error(`${this.Name} no set pause state to ${isPaused} twice`);
            return;
        }

        this.MyIsPaused = isPaused;
        if (isPaused) {
            log('before await this.Runner.Stop();');
            await this.Runner.Stop();
            log('after await this.Runner.Stop();');

            // 确保Run的同步执行已经完毕
            while (this.Runner) {
                await delay(0.1);
            }
            log('after while');
        }
    }

    public async Run(): Promise<void> {
        if (!this.FlowInfo) {
            return;
        }

        if (this.Runner !== undefined) {
            error(`${this.Name} Can not run again`);
            return;
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
