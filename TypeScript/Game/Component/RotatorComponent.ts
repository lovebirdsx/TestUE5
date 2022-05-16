/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref, $unref } from 'puerts';
import {
    Actor,
    CameraActor,
    Class,
    Game,
    GameplayStatics,
    NewArray,
    Rotator,
    StaticMeshComponent,
    Transform,
    UMGManager,
    Vector,
} from 'ue';

import { createSignal, ISignal } from '../../Common/Async';
import { toVector } from '../../Common/Interface';
import { IVectorType } from '../../Common/Type';
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import TsPlayerController from '../Player/TsPlayerController';
import { IEventRotator, IRotatorComponent } from '../Scheme/Component/RotatorComponentScheme';
import PlayerComponent from './PlayerComponent';

export class RotatorComponent extends InteractiveComponent implements IRotatorComponent {
    private InteractSignal: ISignal<boolean>;

    private InteractUi: Game.Demo.UI.UI_Rotator.UI_Rotator_C;

    public RotatorSpeed: IVectorType;

    private Runner: ActionRunner;

    public LocationOffset: IVectorType;

    public RotationOffset: IVectorType;

    public EntityId: string;

    public IsRotatorSelf: boolean;

    public InteractAction: IEventRotator;

    public RotationMapping: IVectorType;

    public IsLocalSpace: boolean;

    public OnInit(): void {
        this.InteractSignal = null;
    }

    public GetPlayerHud(): TsHud {
        const playerController = gameContext.PlayerController;
        return playerController.GetHUD() as TsHud;
    }

    public GetInteractContent(): string {
        // todo 改成从编写interact的json中读取
        return `E`;
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

    public Interacting(entity: Entity): void {
        if (this.InteractSignal !== null) {
            this.InteractSignal.Emit(true);
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

        //  触发事件
        if (!this.Runner) {
            this.Runner = new ActionRunner(
                'Rotator',
                this.Entity,
                this.InteractAction.StartActions,
            );
        }
        await this.Runner.Execute();
        this.Runner = undefined;

        // 等待取消
        this.InteractSignal = createSignal<boolean>();
        await Promise.all([this.InteractSignal.Promise]);

        // 结束
        this.Entity.Actor.DisableInput(playerController);

        // 结束事件
        if (this.Runner) {
            this.Runner.Stop();
        }
        this.Runner = new ActionRunner('Rotator', this.Entity, this.InteractAction.EndActions);
        await this.Runner.Execute();
        this.Runner = undefined;

        playerController.SetViewTargetWithBlend(oldCamera);
        newCamera.K2_DestroyActor();

        this.InteractUi.RemoveFromViewport();
        this.InteractUi = null;
        tsHud.ShowInteract();
        this.InteractSignal = null;
    }

    public GetRotator(map: number): Rotator {
        let rotator = new Rotator(0, 0, 0);
        switch (map) {
            case 1:
                rotator = new Rotator(1, 0, 0);
                break;
            case 2:
                rotator = new Rotator(0, 0, 1);
                break;
            default:
                break;
        }
        return rotator;
    }

    public RotateX(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const speed = (this.RotatorSpeed.X * val) / 100;
            const rotator = this.GetRotator(this.RotationMapping.X).op_Multiply(speed);
            entity.K2_AddActorWorldRotation(rotator, false, null, false);
            this.WakeRigidBodies();
            if (this.IsRotatorSelf) {
                this.Entity.Actor.K2_AddActorWorldRotation(rotator, false, null, false);
            }
        }
    }

    public RotateY(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const speed = (this.RotatorSpeed.Y * val) / 100;
            const rotator = this.GetRotator(this.RotationMapping.Y).op_Multiply(speed);
            entity.K2_AddActorWorldRotation(rotator, false, null, false);
            this.WakeRigidBodies();
            if (this.IsRotatorSelf) {
                this.Entity.Actor.K2_AddActorWorldRotation(rotator, false, null, false);
            }
        }
    }

    public RotateZ(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const speed = (this.RotatorSpeed.Z * val) / 100;
            const rotator = this.GetRotator(this.RotationMapping.Z).op_Multiply(speed);
            entity.K2_AddActorWorldRotation(rotator, false, null, false);
            this.WakeRigidBodies();
            if (this.IsRotatorSelf) {
                this.Entity.Actor.K2_AddActorWorldRotation(rotator, false, null, false);
            }
        }
    }

    public WakeRigidBodies(): void {
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const actorRef = $ref(NewArray(Actor));
            entity.GetOverlappingActors(actorRef, Actor.StaticClass());
            const actors = $unref(actorRef);
            if (actors.Num() > 0) {
                for (let i = 0; i < actors.Num(); i++) {
                    const actor = actors.Get(i);
                    const component = actor.GetComponentByClass(
                        StaticMeshComponent.StaticClass(),
                    ) as StaticMeshComponent;
                    if (component?.IsSimulatingPhysics()) {
                        component.WakeAllRigidBodies();
                        // 调整球的手感
                        const upSpeed = component.GetPhysicsLinearVelocity();
                        if (upSpeed.Z > 0) {
                            component.AddImpulse(new Vector(0, 0, -20));
                        }
                    }
                }
            }
        }
    }
}
