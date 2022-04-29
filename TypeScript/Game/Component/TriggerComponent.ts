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

    public OnInit(): void {
        this.ActonRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.State = this.Entity.GetComponent(StateComponent);
        this.Handler = this.ActonRunner.SpawnHandler(this.TriggerActions.Actions);
    }

    public Load(): void {
        this.TriggerTimes = this.State.GetState<number>('TriggerTimes') || 0;
    }

    private DoTrigger(): void {
        this.TriggerTimes++;
        this.State.SetState('TriggerTimes', this.TriggerTimes);
        void this.Handler.Execute();
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

        this.DoTrigger();
    }
}
