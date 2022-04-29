/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CharacterMovementComponent, edit_on_instance, TestUE5Character } from 'ue';

import PlayerComponent from '../Component/PlayerComponent';
import { Entity, genEntity, IGameContext, ITsEntity, TComponentClass } from '../Interface';

export const playerComponentClasses: TComponentClass[] = [PlayerComponent];

class TsPlayer extends TestUE5Character implements ITsEntity {
    @edit_on_instance()
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
    public Init(context: IGameContext): void {
        this.Entity = genEntity(this, context);
        this.Entity.Init();
    }

    // @no-blueprint
    public Load(): void {
        this.Entity.Load();
    }

    // @no-blueprint
    public Start(): void {
        this.Entity.Start();
    }

    // @no-blueprint
    public Destroy(): void {
        this.Entity.Destroy();
    }

    // @no-blueprint
    private Movement: CharacterMovementComponent;

    // @no-blueprint
    private InitSpeed: number;

    public ReceiveBeginPlay(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        this.InitSpeed = this.Movement.MaxWalkSpeed;
    }

    public get Name(): string {
        return this.GetName();
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
}

export default TsPlayer;
