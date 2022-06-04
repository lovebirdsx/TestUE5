/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import { IActionInfo } from '../Interface/Action';
import { ISwitcherComponent } from '../Interface/Component';
import TsHud from '../Player/TsHud';
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

    public GetInteractContent(): string {
        return this.Content ? this.Content : '调查';
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }
        player.AddInteractor(this.Entity);
        const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
        tsHud.AddInteract(this.GetInteractContent(), this.Entity.Guid);
    }

    public OnTriggerExit(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (!player) {
            return;
        }
        player.RemoveInteractor(this.Entity);
        const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
        tsHud.DelInteract(this.Entity.Guid);
    }

    private async Run(isOn: boolean): Promise<void> {
        const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
        const actionName = isOn ? 'SwitcherOn' : 'SwitcherOff';
        const actions = isOn ? this.OnActions : this.OffActions;
        this.Runner = new ActionRunner(actionName, this.Entity, actions);
        this.ActorSteteComponent.ChangeActorState(isOn ? 'Open' : 'Close');
        tsHud.HideInteract();
        await this.Runner.Execute();
        tsHud.ShowInteract();
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
