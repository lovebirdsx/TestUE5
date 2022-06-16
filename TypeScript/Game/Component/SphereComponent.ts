/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';
import { Game, UMGManager } from 'ue';

import { createSignal, ISignal } from '../../Common/Misc/Async';
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import TsPlayerController from '../Player/TsPlayerController';
import { GrabComponent } from './GrabComponent';
import PlayerComponent from './PlayerComponent';

enum EState {
    Up = 1,
    Down = 2,
}

export class SphereComponent extends InteractiveComponent {
    // @no-blueprint
    private Grab: GrabComponent;

    private State: number;

    private InteractSignal: ISignal<boolean>;

    private InteractUi: Game.Demo.UI.UI_Sphere.UI_Sphere_C;

    public OnInit(): void {
        this.State = EState.Down;
        this.Grab = this.Entity.GetComponent(GrabComponent);
        this.InteractSignal = undefined;
    }

    public GetInteractContent(): string {
        return this.Content ? this.Content : '抬起';
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.AddInteractor(this.Entity);
            const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
            tsHud.AddInteract(this.GetInteractContent(), this.Entity.Id);
        }
    }

    public OnTriggerExit(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            player.RemoveInteractor(this.Entity);
            const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
            tsHud.DelInteract(this.Entity.Id);
        }
    }

    public async Interact(other: Entity): Promise<void> {
        if (this.State === EState.Down) {
            this.Grab.Grab(this.Entity.Actor);
            this.State = EState.Up;
            await this.Execute();
            this.State = EState.Down;
            this.Grab.ReleaseGrab();
        }
    }

    public Interacting(): void {
        if (this.InteractSignal !== undefined) {
            this.InteractSignal.Emit(true);
        }
    }

    public async Execute(): Promise<void> {
        const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
        tsHud.HideInteract();

        const classObj = UE.Class.Load('/Game/Demo/UI/UI_Sphere.UI_Sphere_C');
        this.InteractUi = UMGManager.CreateWidget(
            tsHud.GetWorld(),
            classObj,
        ) as UE.Game.Demo.UI.UI_Sphere.UI_Sphere_C;
        this.InteractUi.SetBtnTitle(`放下`);
        this.InteractUi.AddToViewport();

        const playerController = gameContext.PlayerController as TsPlayerController;
        this.Entity.Actor.EnableInput(playerController);
        // 等待取消
        this.InteractSignal = createSignal<boolean>();
        await Promise.all([this.InteractSignal.Promise]);

        this.Entity.Actor.DisableInput(playerController);

        this.InteractUi.RemoveFromViewport();
        this.InteractUi = undefined;
        tsHud.ShowInteract();
        this.InteractSignal = undefined;
    }
}
