"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
const Init_1 = require("../../Common/Init");
const Log_1 = require("../../Common/Log");
class TsPlayer extends ue_1.TestUE5Character {
    Movement;
    InitSpeed;
    // @no-blueprint
    Interacters;
    // @no-blueprint
    MyIsInteracting;
    Constructor() {
        this.Movement = this.GetMovementComponent();
        this.InitSpeed = this.Movement.MaxWalkSpeed;
        this.Interacters = [];
        (0, Init_1.initCommon)();
    }
    get Name() {
        return this.GetName();
    }
    get IsInteracting() {
        return this.MyIsInteracting;
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
    // @no-blueprint
    ResetSpeed() {
        this.Speed = this.InitSpeed;
    }
    // @no-blueprint
    AddInteractor(interacter) {
        const index = this.Interacters.indexOf(interacter);
        if (index >= 0) {
            (0, Log_1.error)(`Add duplicate interacter [${interacter.Name}]`);
            return;
        }
        this.Interacters.push(interacter);
    }
    // @no-blueprint
    RemoveInteractor(interacter) {
        const index = this.Interacters.indexOf(interacter);
        if (index < 0) {
            (0, Log_1.error)(`Remove not exist interactor [${interacter.Name}]`);
            return;
        }
        this.Interacters.splice(index, 1);
    }
    TryInteract() {
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
    async StartInteract(id) {
        if (id >= this.Interacters.length) {
            (0, Log_1.error)(`Can not start interact with id [${id} >= ${this.Interacters.length}]`);
            return;
        }
        if (this.IsInteracting) {
            (0, Log_1.error)(`Can not start iteract again`);
            return;
        }
        const interactor = this.Interacters[id];
        this.MyIsInteracting = true;
        await interactor.Interact(this);
        this.MyIsInteracting = false;
    }
}
exports.default = TsPlayer;
//# sourceMappingURL=TsPlayer.js.map