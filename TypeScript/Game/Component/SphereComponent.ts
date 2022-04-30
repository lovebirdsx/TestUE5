/* eslint-disable spellcheck/spell-checker */
import { Vector } from 'ue';

import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import { GrabComponent, IGrabSetting } from './GrabComponent';
import PlayerComponent from './PlayerComponent';

enum EState {
    Up = 1,
    Down = 2,
}

export class SphereComponent extends InteractiveComponent {
    // @no-blueprint
    private Grab: GrabComponent;

    private State: number;

    public OnInit(): void {
        this.State = EState.Down;
        this.Grab = this.Entity.GetComponent(GrabComponent);
    }

    public GetPlayerHud(): TsHud {
        const playerController = gameContext.PlayerController;
        return playerController.GetHUD() as TsHud;
    }

    public GetInteractContent(): string {
        // todo 改成从编写interact的json中读取
        return this.Entity.Name;
    }

    public EnterInteract(): void {
        const tsHud = this.GetPlayerHud();
        tsHud.AddInteract(this.GetInteractContent());
    }

    public CloseInteract(): void {
        const tsHud = this.GetPlayerHud();
        tsHud.DelInteract(this.GetInteractContent());
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.AddInteractor(this.Entity);
            const tshub = this.GetPlayerHud();
            tshub.AddInteract(this.GetInteractContent());
        }
    }

    public OnTriggerExit(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.RemoveInteractor(this.Entity);
            const tshub = this.GetPlayerHud();
            tshub.DelInteract(this.GetInteractContent());
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async Interact(other: Entity): Promise<void> {
        const x = 10;
        switch (this.State) {
            case EState.Up:
                this.Grab.ReleaseGrab();
                this.State = EState.Down;
                break;
            case EState.Down:
                this.Grab.Grab(this.Entity.Actor, {
                    Position: new Vector(x, x, x),
                } as IGrabSetting);
                this.State = EState.Up;
                break;
        }
        // TODO change UI state
    }
}
