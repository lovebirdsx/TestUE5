/* eslint-disable spellcheck/spell-checker */
import { IActionInfo } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, InteractiveComponent, ISwitcherComponent } from '../Interface';
import { ActorStateComponent } from './ActorStateComponent';
import PlayerComponent from './PlayerComponent';
import { StateComponent } from './StateComponent';

export class SwitcherComponent extends InteractiveComponent implements ISwitcherComponent {
    public readonly OnActions: IActionInfo[];

    public readonly OffActions: IActionInfo[];

    private IsOn: boolean;

    private StateComponent: StateComponent;

    private ActorSteteComponent: ActorStateComponent;

    private Runner: ActionRunner | undefined;

    public OnInit(): void {
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.ActorSteteComponent = this.Entity.GetComponent(ActorStateComponent);
    }

    public OnLoadState(): void {
        this.IsOn = this.StateComponent.GetState<boolean>('IsSwitcherOpen');
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }

        player.AddInteractor(this.Entity);
    }

    public OnTriggerExit(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }

        player.RemoveInteractor(this.Entity);
    }

    public async Interact(entity: Entity): Promise<void> {
        if (this.Runner) {
            throw new Error(`interact again with ${this.Name}`);
        }

        const actionName = this.IsOn ? 'SwitcherOff' : 'SwitcherOn';
        const actions = this.IsOn ? this.OffActions : this.OnActions;
        this.Runner = new ActionRunner(actionName, this.Entity, actions);
        this.ActorSteteComponent.ChangeActorState(this.IsOn ? 'Off' : 'On');
        await this.Runner.Execute();
        this.Runner = undefined;
        this.IsOn = !this.IsOn;
        this.StateComponent.SetState('IsSwitcherOpen', this.IsOn);
    }
}
