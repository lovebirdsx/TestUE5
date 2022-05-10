/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    CameraActor,
    Class,
    Game,
    GameplayStatics,
    Rotator,
    Transform,
    UMGManager,
    Vector,
} from 'ue';

import { createSignal, ISignal } from '../../Common/Async';
import { toVector } from '../../Common/Interface';
import { log } from '../../Common/Log';
import { IVectorType } from '../../Common/Type';
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import TsPlayerController from '../Player/TsPlayerController';
import { IRotatorComponent } from '../Scheme/Component/RotatorComponentScheme';
import PlayerComponent from './PlayerComponent';

export class RotatorComponent extends InteractiveComponent implements IRotatorComponent {
    private InteractSignal: ISignal<never>;

    private InteractUi: Game.Demo.UI.UI_Rotator.UI_Rotator_C;

    public RotatorSpeed: IVectorType;

    public LocationOffset: IVectorType;

    public RotationOffset: IVectorType;

    public EntityId: string;

    public OnInit(): void {
        this.InteractSignal = null;
    }

    public GetPlayerHud(): TsHud {
        const playerController = gameContext.PlayerController;
        return playerController.GetHUD() as TsHud;
    }

    public GetInteractContent(): string {
        // todo 改成从编写interact的json中读取
        return `操作控制台`;
    }

    public OnTriggerEnter(other: Entity): void {
        const player = other.TryGetComponent(PlayerComponent);
        if (player) {
            log(`OnTriggerEnterOnTriggerEnter`);
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

    public Interacting(entity: Entity): void {
        if (this.InteractSignal !== null) {
            this.InteractSignal.Emit();
        }
    }

    public async Interact(other: Entity): Promise<void> {
        // ui
        const tsHud = this.GetPlayerHud();
        tsHud.HideInteract();
        const classObj = Class.Load('/Game/Demo/UI/UI_Rotator.UI_Rotator_C');
        this.InteractUi = UMGManager.CreateWidget(
            tsHud.GetWorld(),
            classObj,
        ) as Game.Demo.UI.UI_Rotator.UI_Rotator_C;
        this.InteractUi.AddToViewport();

        // camera controll
        const playerController = gameContext.PlayerController as TsPlayerController;
        const oldCamera = playerController.GetViewTarget();

        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        const locationOffset = toVector(this.LocationOffset);
        let vector = oldCamera.K2_GetActorLocation().op_Addition(locationOffset);
        if (entity) {
            vector = entity.K2_GetActorLocation().op_Addition(locationOffset);
        }
        const rotate = new Rotator(
            this.RotationOffset.X,
            this.RotationOffset.Y,
            this.RotationOffset.Z,
        );
        const transform = new Transform(rotate, vector, new Vector(1, 1, 1));

        const newCamera = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            CameraActor.StaticClass(),
            transform,
        ) as CameraActor;
        playerController.SetViewTargetWithBlend(newCamera);

        // 切换输入
        this.Entity.Actor.EnableInput(playerController);

        // 等待取消
        this.InteractSignal = createSignal<never>();
        await Promise.all([this.InteractSignal.Promise]);

        // 结束
        this.Entity.Actor.DisableInput(playerController);

        playerController.SetViewTargetWithBlend(oldCamera);
        newCamera.K2_DestroyActor();

        this.InteractUi.RemoveFromViewport();
        this.InteractUi = null;
        tsHud.ShowInteract();
        this.InteractSignal = null;
    }

    public RotateX(val: number): void {
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            let rotation = entity.K2_GetActorRotation();
            const speed = this.RotatorSpeed.X * val;
            rotation = rotation.op_Addition(new Rotator(speed, 0, 0));
            entity.K2_SetActorRotation(rotation, true);
        }
    }

    public RotateY(val: number): void {
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            let rotation = entity.K2_GetActorRotation();
            const speed = this.RotatorSpeed.Y * val;
            rotation = rotation.op_Addition(new Rotator(0, speed, 0));
            entity.K2_SetActorRotation(rotation, true);
        }
    }
}
