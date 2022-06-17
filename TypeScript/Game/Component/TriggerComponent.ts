/* eslint-disable no-void */
import { ITriggerActions } from '../../UniverseEditor/Common/Interface/IAction';
import { ITriggerComponent } from '../../UniverseEditor/Common/Interface/IComponent';
import { log } from '../../UniverseEditor/Common/Misc/Log';
import { ActionRunner } from '../Flow/ActionRunner';
import { Component, Entity } from '../Interface';
import PlayerComponent from './PlayerComponent';
import { StateComponent } from './StateComponent';

export class TriggerComponent extends Component implements ITriggerComponent {
    public MaxTriggerTimes: number;

    public TriggerActions: ITriggerActions;

    public IsNotLoad: boolean;

    private TriggerTimes = 0;

    private Runner: ActionRunner;

    private State: StateComponent;

    private ActionId: number;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
    }

    public OnLoadState(): void {
        if (!this.IsNotLoad) {
            this.TriggerTimes = this.State.GetState<number>('TriggerTimes') || 0;
        }
        this.ActionId = this.State.GetState<number>('ActionId') || 0;
    }

    public OnStart(): void {
        // 继续执行上次没有执行完毕的Actor
        if (this.TriggerTimes < this.MaxTriggerTimes && this.ActionId) {
            void this.DoTrigger();
        }
    }

    private async DoTrigger(): Promise<void> {
        if (!this.Runner) {
            this.Runner = new ActionRunner('Trigger', this.Entity, this.TriggerActions.Actions);
        }

        await this.Runner.Execute(this.ActionId, (actionId: number) => {
            this.ActionId = actionId + 1;
            this.State.SetState('ActionId', actionId);
        });

        this.ActionId = 0;
        this.State.SetState('ActionId', undefined);

        this.TriggerTimes++;
        if (!this.IsNotLoad) {
            this.State.SetState('TriggerTimes', this.TriggerTimes);
            log(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
        }
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }

        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }

        if (this.Runner?.IsRunning) {
            return;
        }

        void this.DoTrigger();
    }
}
