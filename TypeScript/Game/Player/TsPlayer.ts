/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CharacterMovementComponent, TestUE5Character } from 'ue';

class TsPlayer extends TestUE5Character {
    private Movement: CharacterMovementComponent;

    private InitSpeed: number;

    public Constructor(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        this.InitSpeed = this.Movement.MaxWalkSpeed;
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

    public ResetSpeed(): void {
        this.Speed = this.InitSpeed;
    }
}

export default TsPlayer;
