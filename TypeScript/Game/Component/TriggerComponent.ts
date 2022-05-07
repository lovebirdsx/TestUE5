/* eslint-disable no-void */
import { log } from '../../Common/Log';
import { ITriggerActions } from '../Flow/Action';
import { Component, Entity, ITriggerComponent } from '../Interface';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';
import PlayerComponent from './PlayerComponent';
import StateComponent from './StateComponent';

export class TriggerComponent extends Component implements ITriggerComponent {
    public MaxTriggerTimes: number;

    public TriggerActions: ITriggerActions;

    private TriggerTimes = 0;

    private ActonRunner: ActionRunnerComponent;

    private Handler: ActionRunnerHandler;

    private State: StateComponent;

    private ActionId: number;

    public OnInit(): void {
        this.ActonRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.State = this.Entity.GetComponent(StateComponent);
        this.Handler = this.ActonRunner.SpawnHandler(this.TriggerActions.Actions);
    }

    public OnLoadState(): void {
        this.TriggerTimes = this.State.GetState<number>('TriggerTimes') || 0;
        this.ActionId = this.State.GetState<number>('ActionId') || 0;
    }

    private async DoTrigger(): Promise<void> {
        this.TriggerTimes++;
        this.State.SetState('TriggerTimes', this.TriggerTimes);
        await this.Handler.Execute(this.ActionId, (actionId: number) => {
            this.ActionId = actionId;
            this.State.SetState('ActionId', actionId);
        });

        this.ActionId = 0;
        this.State.SetState('ActionId', undefined);

        log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }

        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.Handler.IsRunning) {
            return;
        }

        void this.DoTrigger();
    }
}
