/* eslint-disable spellcheck/spell-checker */
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import { FlowComponent } from './FlowComponent';
import PlayerComponent from './PlayerComponent';

export class NpcComponent extends InteractiveComponent {
    private Flow: FlowComponent;

    private IsAdded: boolean;

    public OnInit(): void {
        this.Flow = this.Entity.GetComponent(FlowComponent);
    }

    public OnTriggerEnter(other: Entity): void {
        if (this.Flow.IsRunning) {
            return;
        }

        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.AddInteractor(this.Entity);
            this.IsAdded = true;
            const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
            tsHud.AddInteract(this.GetInteractContent());
        }
    }

    public OnTriggerExit(other: Entity): void {
        if (!this.IsAdded) {
            return;
        }

        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.RemoveInteractor(this.Entity);
            this.IsAdded = false;
            const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
            tsHud.DelInteract(this.GetInteractContent());
        }
    }

    public async Interact(other: Entity): Promise<void> {
        if (this.Flow.IsRunning) {
            return;
        }

        await this.Flow.Run();
    }
}
