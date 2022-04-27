"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsNpc = exports.npcComponentClasses = void 0;
const ActionRunnerComponent_1 = require("../Component/ActionRunnerComponent");
const FlowComponent_1 = require("../Component/FlowComponent");
const TalkComponent_1 = require("../Component/TalkComponent");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
exports.npcComponentClasses = [
    FlowComponent_1.FlowComponent,
    TalkComponent_1.TalkComponent,
    ActionRunnerComponent_1.ActionRunnerComponent,
];
class TsNpc extends TsEntity_1.default {
    // @no-blueprint
    GetComponentClasses() {
        return exports.npcComponentClasses;
    }
    // @no-blueprint
    Flow;
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
        this.Flow = this.Entity.GetComponent(FlowComponent_1.FlowComponent);
    }
    // @no-blueprint
    async Interact(player) {
        await this.Flow.Run();
    }
    ReceiveActorBeginOverlap(other) {
        if (!(other instanceof TsPlayer_1.default)) {
            return;
        }
        other.AddInteractor(this);
    }
    ReceiveActorEndOverlap(other) {
        if (!(other instanceof TsPlayer_1.default)) {
            return;
        }
        other.RemoveInteractor(this);
    }
}
exports.TsNpc = TsNpc;
exports.default = TsNpc;
//# sourceMappingURL=TsNpc.js.map