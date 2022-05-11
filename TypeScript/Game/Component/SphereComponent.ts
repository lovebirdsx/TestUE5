/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';
import { Game, UMGManager } from 'ue';

import { createSignal, ISignal } from '../../Common/Async';
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
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
        this.InteractSignal = null;
    }

    public GetPlayerHud(): TsHud {
        const playerController = gameContext.PlayerController;
        return playerController.GetHUD() as TsHud;
    }

    public GetInteractContent(): string {
        // todo 改成从编写interact的json中读取
        return this.Entity.Name;
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

    public async Interact(other: Entity): Promise<void> {
        if (this.State === EState.Down) {
            // TODO scheme 设置
            this.Grab.Grab(this.Entity.Actor);
            this.State = EState.Up;
            await this.Execute();
            this.State = EState.Down;
            this.Grab.ReleaseGrab();
        }
    }

    public Interacting(entity: Entity): void {
        if (this.InteractSignal !== null) {
            this.InteractSignal.Emit(true);
        }
    }

    public async Execute(): Promise<void> {
        const tsHud = this.GetPlayerHud();
        tsHud.HideInteract();

        const classObj = UE.Class.Load('/Game/Demo/UI/UI_Sphere.UI_Sphere_C');
        this.InteractUi = UMGManager.CreateWidget(
            tsHud.GetWorld(),
            classObj,
        ) as UE.Game.Demo.UI.UI_Sphere.UI_Sphere_C;
        this.InteractUi.SetBtnTitle(`放下`);
        this.InteractUi.AddToViewport();

        // 等待取消
        this.InteractSignal = createSignal<never>();
        await Promise.all([this.InteractSignal.Promise]);

        this.InteractUi.RemoveFromViewport();
        this.InteractUi = null;
        tsHud.ShowInteract();
        this.InteractSignal = null;
    }
}
