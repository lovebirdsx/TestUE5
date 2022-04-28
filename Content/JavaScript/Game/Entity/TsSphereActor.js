"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sphereComponentClasses = void 0;
const InterActComponent_1 = require("../Component/InterActComponent");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
exports.sphereComponentClasses = [InterActComponent_1.InterActComponent];
class TsSphereActor extends TsEntity_1.default {
    // @no-blueprint
    GetComponentClasses() {
        return exports.sphereComponentClasses;
    }
    // @no-blueprint
    InterAct;
    // @no-blueprint
    Init(context) {
        super.Init(context);
        this.InterAct = this.Entity.GetComponent(InterActComponent_1.InterActComponent);
    }
    // @no-blueprint
    // eslint-disable-next-line @typescript-eslint/require-await
    async Interact(player) {
        this.InterAct.Run();
    }
    ReceiveActorBeginOverlap(other) {
        if (!(other instanceof TsPlayer_1.default)) {
            return;
        }
        if (this.InterAct) {
            this.InterAct.ShowInteract();
        }
        other.AddInteractor(this);
    }
    ReceiveActorEndOverlap(other) {
        if (!(other instanceof TsPlayer_1.default)) {
            return;
        }
        if (this.InterAct) {
            this.InterAct.CloseInteract();
        }
        other.RemoveInteractor(this);
    }
}
exports.default = TsSphereActor;
//# sourceMappingURL=TsSphereActor.js.map