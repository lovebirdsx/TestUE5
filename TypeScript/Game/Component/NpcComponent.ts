/* eslint-disable spellcheck/spell-checker */
import { Entity, InteractiveComponent } from '../Interface';
import { FlowComponent } from './FlowComponent';
import PlayerComponent from './PlayerComponent';

export class NpcComponent extends InteractiveComponent {
    private Flow: FlowComponent;

    public OnInit(): void {
        this.Flow = this.Entity.GetComponent(FlowComponent);
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.AddInteractor(this.Entity);
        }
    }

    public OnTriggerExit(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.RemoveInteractor(this.Entity);
        }
    }

    public async Interact(other: Entity): Promise<void> {
        await this.Flow.Run();
    }
}
