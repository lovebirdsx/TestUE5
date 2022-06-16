/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
    Actor,
    CharacterMovementComponent,
    edit_on_instance,
    PhysicsHandleComponent,
    Rotator,
    StaticMeshComponent,
    TestUE5Character,
    Transform,
    Vector,
} from 'ue';

import { log } from '../../Common/Log';
import PlayerComponent from '../Component/PlayerComponent';
import { deInitTsEntity, initTsEntity } from '../Entity/Common';
import { Entity, gameContext, ITsEntity, TComponentClass } from '../Interface';

export const playerComponentClasses: TComponentClass[] = [PlayerComponent];

class TsPlayer extends TestUE5Character implements ITsEntity {
    @edit_on_instance()
    public Id: number;

    // @no-blueprint
    private Movement: CharacterMovementComponent;

    // @no-blueprint
    private GrabHandle: PhysicsHandleComponent;

    // @no-blueprint
    private InitSpeed: number;

    // @no-blueprint
    public Entity: Entity;

    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return playerComponentClasses;
    }

    // @no-blueprint
    public Init(): void {
        initTsEntity(this, true);
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
        deInitTsEntity(this);
    }

    public ReceiveBeginPlay(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        this.GrabHandle = this.AddComponentByClass(
            PhysicsHandleComponent.StaticClass(),
            false,
            new Transform(),
            false,
        ) as PhysicsHandleComponent;
        this.InitSpeed = this.Movement.MaxWalkSpeed;
        gameContext.Player = this;

        this.Init();
    }

    public ReceiveEndPlay(): void {
        this.Destroy();
    }

    public get Speed(): number {
        return this.Movement.MaxWalkSpeed;
    }

    public set Speed(value: number) {
        log(`Player speed change from ${this.Speed} to ${value}`);
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
        if (!actor || actor === undefined) {
            this.GrabHandle.ReleaseComponent();
            return;
        }
        const component = actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        if (component) {
            const actorLocation: Vector = component.K2_GetComponentLocation();
            const actorRotation: Rotator = component.K2_GetComponentRotation();
            this.GrabHandle.GrabComponentAtLocationWithRotation(
                component,
                undefined,
                actorLocation,
                actorRotation,
            );
            component.SetAllPhysicsLinearVelocity(new Vector(1, 1, 1));
        }
    }

    public get Grab(): PhysicsHandleComponent {
        return this.GrabHandle;
    }
}

export default TsPlayer;
