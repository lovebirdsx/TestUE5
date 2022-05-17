/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
import { IActionInfo } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, InteractiveComponent, ISwitcherComponent } from '../Interface';
import { ActorStateComponent } from './ActorStateComponent';
import PlayerComponent from './PlayerComponent';
import { StateComponent } from './StateComponent';

export class SwitcherComponent extends InteractiveComponent implements ISwitcherComponent {
    public IsInitOn: boolean;

    public AutoExecuteOnLoad: boolean;

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
        if (this.StateComponent.HasState('IsSwitcherOpen')) {
            this.IsOn = this.StateComponent.GetState<boolean>('IsSwitcherOpen');
        } else {
            this.IsOn = this.IsInitOn;
        }

        if (this.AutoExecuteOnLoad) {
            void this.Run(this.IsOn);
        }
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

    private async Run(isOn: boolean): Promise<void> {
        const actionName = isOn ? 'SwitcherOn' : 'SwitcherOff';
        const actions = isOn ? this.OnActions : this.OffActions;
        this.Runner = new ActionRunner(actionName, this.Entity, actions);
        this.ActorSteteComponent.ChangeActorState(isOn ? 'On' : 'Off');
        await this.Runner.Execute();
        this.IsOn = isOn;
        this.StateComponent.SetState('IsSwitcherOpen', isOn);
        this.Runner = undefined;
    }

    public async Interact(entity: Entity): Promise<void> {
        if (this.Runner) {
            throw new Error(`interact again with ${this.Name}`);
        }

        await this.Run(!this.IsOn);
    }
}
