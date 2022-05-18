/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
import { IActionInfo } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, InteractiveComponent, ISwitcherComponent } from '../Interface';
import { ActorStateComponent } from './ActorStateComponent';
import PlayerComponent from './PlayerComponent';

export class SwitcherComponent extends InteractiveComponent implements ISwitcherComponent {
    public readonly OnActions: IActionInfo[];

    public readonly OffActions: IActionInfo[];

    private IsOn: boolean;

    private ActorSteteComponent: ActorStateComponent;

    private Runner: ActionRunner | undefined;

    public OnInit(): void {
        this.ActorSteteComponent = this.Entity.GetComponent(ActorStateComponent);
    }

    public OnLoadState(): void {
        this.IsOn = this.ActorSteteComponent.State === 'Open';
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
        this.ActorSteteComponent.ChangeActorState(isOn ? 'Open' : 'Close');
        await this.Runner.Execute();
        this.IsOn = isOn;
        this.Runner = undefined;
    }

    public async Interact(entity: Entity): Promise<void> {
        if (this.Runner) {
            throw new Error(`interact again with ${this.Name}`);
        }

        await this.Run(!this.IsOn);
    }
}
