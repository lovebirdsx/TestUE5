"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
class TsPlayer extends ue_1.TestUE5Character {
    Constructor() {
        this.Movement = this.GetMovementComponent();
        this.InitSpeed = this.Movement.MaxWalkSpeed;
    }
    get Speed() {
        return this.Movement.MaxWalkSpeed;
    }
    set Speed(value) {
        this.Movement.MaxWalkSpeed = value;
        this.Movement.BrakingDecelerationWalking = value * 4;
        this.Movement.MaxAcceleration = value * 4;
        const lastSpeed = this.Movement.GetLastUpdateVelocity().Size();
        if (lastSpeed - value > 20 * 100) {
            this.Movement.StopMovementImmediately();
        }
    }
    ResetSpeed() {
        this.Speed = this.InitSpeed;
    }
}
exports.default = TsPlayer;
//# sourceMappingURL=TsPlayer.js.map