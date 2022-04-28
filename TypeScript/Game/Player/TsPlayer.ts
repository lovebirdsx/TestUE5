/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CharacterMovementComponent, TestUE5Character } from 'ue';

import { initCommon } from '../../Common/Init';
import { error } from '../../Common/Log';
import { ITsEntity, ITsPlayer } from '../Interface';

class TsPlayer extends TestUE5Character implements ITsPlayer {
    private Movement: CharacterMovementComponent;

    private InitSpeed: number;

    // @no-blueprint
    private Interacters: ITsEntity[];

    // @no-blueprint
    private MyIsInteracting: boolean;

    public Constructor(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        this.InitSpeed = this.Movement.MaxWalkSpeed;
        this.Interacters = [];

        initCommon();
    }

    public get Name(): string {
        return this.GetName();
    }

    public get IsInteracting(): boolean {
        return this.MyIsInteracting;
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

    // @no-blueprint
    public AddInteractor(interacter: ITsEntity): void {
        const index = this.Interacters.indexOf(interacter);
        if (index >= 0) {
            error(`Add duplicate interacter [${interacter.Name}]`);
            return;
        }

        this.Interacters.push(interacter);
    }

    // @no-blueprint
    public RemoveInteractor(interacter: ITsEntity): void {
        const index = this.Interacters.indexOf(interacter);
        if (index < 0) {
            error(`Remove not exist interactor [${interacter.Name}]`);
            return;
        }

        this.Interacters.splice(index, 1);
    }

    public TryInteract(): boolean {
        if (this.IsInteracting) {
            return false;
        }

        if (this.Interacters.length <= 0) {
            return false;
        }

        // eslint-disable-next-line no-void
        void this.StartInteract(0);
        return true;
    }

    // @no-blueprint
    public async StartInteract(id: number): Promise<void> {
        if (id >= this.Interacters.length) {
            error(`Can not start interact with id [${id} >= ${this.Interacters.length}]`);
            return;
        }

        if (this.IsInteracting) {
            error(`Can not start iteract again`);
            return;
        }

        const interactor = this.Interacters[id];
        this.MyIsInteracting = true;
        await interactor.Interact(this);
        this.MyIsInteracting = false;
    }
}

export default TsPlayer;
