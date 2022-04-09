import { CharacterMovementComponent, TestUE5Character } from 'ue';

import { log } from '../../Editor/Common/Log';

class TsPlayer extends TestUE5Character {
    private Movement: CharacterMovementComponent;

    public Constructor(): void {
        this.Movement = this.GetMovementComponent() as CharacterMovementComponent;
        log(`${this.GetName()} Constructor()`);
    }
}

export default TsPlayer;
