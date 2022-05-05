/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
    Actor,
    CharacterMovementComponent,
    edit_on_instance,
    PhysicsHandleComponent,
    PrimitiveComponent,
    Rotator,
    TestUE5Character,
    Transform,
    Vector,
} from 'ue';
import { log } from '../../Common/Log';

import { genGuid } from '../../Common/Util';
import PlayerComponent from '../Component/PlayerComponent';
import { Entity, gameContext, genEntity, ITsEntity, TComponentClass } from '../Interface';

export const playerComponentClasses: TComponentClass[] = [PlayerComponent];

class TsPlayer extends TestUE5Character implements ITsEntity {
    // @no-blueprint
    private Movement: CharacterMovementComponent;

    // @no-blueprint
    private GrabHandle: PhysicsHandleComponent;

    // @no-blueprint
    private InitSpeed: number;

    // @no-blueprint
    public Guid = 'unknown';

    @edit_on_instance()
    public ComponentsStateJson = '';

    // @no-blueprint
    public Entity: Entity;

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return playerComponentClasses;
    }

    // @no-blueprint
    public Init(): void {
        this.Guid = genGuid();
        this.Entity = genEntity(this);
        this.Entity.Init();
    }

    // @no-blueprint
    public LoadState(): void {
        this.Entity.LoadState();
    }

    // @no-blueprint
    public Start(): void {
        this.Entity.Start();
    }

    // @no-blueprint
    public Destroy(): void {
        this.Entity.Destroy();
    }

    public ReceiveBeginPlay(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        this.GrabHandle = this.AddComponentByClass(
            PhysicsHandleComponent.StaticClass(),
            false,
            new Transform(),
            false,
        ) as PhysicsHandleComponent;
        this.GrabHandle.bInterpolateTarget = false;
        this.InitSpeed = this.Movement.MaxWalkSpeed;
        gameContext.Player = this;
    }

    public get Speed(): number {
        return this.Movement.MaxWalkSpeed;
    }

    public set Speed(value: number) {
        this.Movement.MaxWalkSpeed = value;
        this.Movement.BrakingDecelerationWalking = value * 4;
        this.Movement.MaxAcceleration = value * 4;

        const lastSpeed = this.Movement.GetLastUpdateVelocity().Size();
        if (lastSpeed - value > 20 * 100) {
            this.Movement.StopMovementImmediately();
        }
    }

    // @no-blueprint
    public ResetSpeed(): void {
        this.Speed = this.InitSpeed;
    }

    public SetGrab(actor: Actor): void {
        if (!actor || actor === null) {
            this.GrabHandle.ReleaseComponent();
            return;
        }
        const component = actor.GetComponentByClass(
            PrimitiveComponent.StaticClass(),
        ) as PrimitiveComponent;
        this.GrabHandle.SetInterpolationSpeed(500);
        log(
            `SetGrabSetGrab ${this.GrabHandle.bInterpolateTarget}, ${this.GrabHandle.InterpolationSpeed}`,
        );
        if (component) {
            const actorLocation: Vector = component.K2_GetComponentLocation();
            const actorRotation: Rotator = component.K2_GetComponentRotation();
            this.GrabHandle.GrabComponentAtLocationWithRotation(
                component,
                null,
                actorLocation,
                actorRotation,
            );
        }
    }

    public get Grab(): PhysicsHandleComponent {
        return this.GrabHandle;
    }
}

export default TsPlayer;
