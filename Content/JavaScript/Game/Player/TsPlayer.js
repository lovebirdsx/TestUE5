"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerComponentClasses = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
const PlayerComponent_1 = require("../Component/PlayerComponent");
const Interface_1 = require("../Interface");
exports.playerComponentClasses = [PlayerComponent_1.default];
class TsPlayer extends ue_1.TestUE5Character {
    Guid = 'unknown';
    ComponentsStateJson = '';
    // @no-blueprint
    Entity;
    // @no-blueprint
    GetComponentClasses() {
        return exports.playerComponentClasses;
    }
    // @no-blueprint
    Init(context) {
        this.Entity = (0, Interface_1.genEntity)(this, context);
        this.Entity.Init();
    }
    // @no-blueprint
    Load() {
        this.Entity.Load();
    }
    // @no-blueprint
    Start() {
        this.Entity.Start();
    }
    // @no-blueprint
    Destroy() {
        this.Entity.Destroy();
    }
    // @no-blueprint
    Movement;
    // @no-blueprint
    InitSpeed;
    ReceiveBeginPlay() {
        this.Movement = this.GetMovementComponent();
        this.InitSpeed = this.Movement.MaxWalkSpeed;
    }
    get Name() {
        return this.GetName();
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
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsPlayer.prototype, "Guid", void 0);
__decorate([
    (0, ue_1.edit_on_instance)()
], TsPlayer.prototype, "ComponentsStateJson", void 0);
exports.default = TsPlayer;
//# sourceMappingURL=TsPlayer.js.map