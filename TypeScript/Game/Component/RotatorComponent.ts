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
import { IInteract } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, gameContext, IInteractCall, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';
import TsPlayerController from '../Player/TsPlayerController';
import { IEventRotator, IRotatorComponent } from '../Scheme/Component/RotatorComponentScheme';
import { EventComponent } from './EventComponent';
import PlayerComponent from './PlayerComponent';
import { StateComponent } from './StateComponent';

export class RotatorComponent extends InteractiveComponent implements IRotatorComponent {
    private InteractSignal: ISignal<boolean>;

    private InteractUi: Game.Demo.UI.UI_Rotator.UI_Rotator_C;

    public RotatorSpeed: IVectorType;

    private Runner: ActionRunner;

    private State: StateComponent;

    private Event: EventComponent;

    private StateId = 0;

    public LocationOffset: IVectorType;

    public RotationOffset: IVectorType;

    public EntityId: string;

    public IsRotatorSelf: boolean;

    public InteractAction: IEventRotator;

    public RotationMapping: IVectorType;

    public IsLocalSpace: boolean;

    public OnInit(): void {
        this.InteractSignal = null;
        this.State = this.Entity.GetComponent(StateComponent);
        this.Event = this.Entity.GetComponent(EventComponent);
        const call: IInteractCall = {
            Name: 'UndergroundComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        this.Event.RegistryInteract(call);
    }

    public OnLoadState(): void {
        this.StateId = this.State.GetState<number>('StateId') || 0;
    }

    public Activate(action: IInteract): void {
        if (action.Param) {
            this.StateId = Number(action.Param);
            this.State.SetState('StateId', this.StateId);
            if (this.InteractUi) {
                // this.InteractUi.SetChallengeState(this.StateId);
            }
        }
    }

    public GetPlayerHud(): TsHud {
        const playerController = gameContext.PlayerController;
        return playerController.GetHUD() as TsHud;
    }

    public GetInteractContent(): string {
        // todo 改成从编写interact的json中读取
        return `按E调查`;
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

    public Interacting(): void {
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
        // this.InteractUi.SetChallengeState(this.StateId);

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
            case 0:
                rotator = new Rotator(0, 1, 0);
                break;
            default:
                break;
        }
        return rotator;
    }

    public AdapateVal(val: number): number {
        // 让鼠标操作不会太快
        let value = val;
        if (value > 1) {
            value = 1;
        } else if (value < -1) {
            value = -1;
        }
        return value;
    }

    public RotateX(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const value = this.AdapateVal(val);
            const speed = (this.RotatorSpeed.X * value) / 100;
            const rotator = this.GetRotator(this.RotationMapping.X).op_Multiply(speed);
            this.RotateEntity(rotator);
        }
    }

    public RotateY(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const value = this.AdapateVal(val);
            const speed = (this.RotatorSpeed.Y * value) / 100;
            const rotator = this.GetRotator(this.RotationMapping.Y).op_Multiply(speed);
            this.RotateEntity(rotator);
        }
    }

    public RotateZ(val: number): void {
        if (!val) {
            return;
        }
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        if (entity) {
            const value = this.AdapateVal(val);
            const speed = (this.RotatorSpeed.Z * value) / 100;
            const rotator = this.GetRotator(this.RotationMapping.Z).op_Multiply(speed);
            this.RotateEntity(rotator);
        }
    }

    public RotateEntity(rotator: Rotator): void {
        const entity = gameContext.EntityManager.GetEntity(this.EntityId);
        entity.K2_AddActorWorldRotation(rotator, false, null, false);
        const stateComponent = entity.Entity.TryGetComponent(StateComponent);
        if (stateComponent) {
            stateComponent.RecordRotation();
        }

        this.WakeRigidBodies();
        if (this.IsRotatorSelf) {
            this.Entity.Actor.K2_AddActorWorldRotation(rotator, false, null, false);
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
                    }
                }
            }
        }
    }
}
