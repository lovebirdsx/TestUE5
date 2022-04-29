"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsNpc = exports.npcComponentClasses = void 0;
const ActionRunnerComponent_1 = require("../Component/ActionRunnerComponent");
const FlowComponent_1 = require("../Component/FlowComponent");
const NpcComponent_1 = require("../Component/NpcComponent");
const StateComponent_1 = require("../Component/StateComponent");
const TalkComponent_1 = require("../Component/TalkComponent");
const EntityRegistry_1 = require("./EntityRegistry");
const TsEntity_1 = require("./TsEntity");
exports.npcComponentClasses = [
    StateComponent_1.default,
    FlowComponent_1.FlowComponent,
    TalkComponent_1.TalkComponent,
    ActionRunnerComponent_1.ActionRunnerComponent,
    NpcComponent_1.NpcComponent,
];
class TsNpc extends TsEntity_1.default {
    // @no-blueprint
    GetComponentClasses() {
        return exports.npcComponentClasses;
    }
    ReceiveActorBeginOverlap(other) {
        if ((0, EntityRegistry_1.isEntity)(other)) {
            const tsEntity = other;
            this.Entity.OnTriggerEnter(tsEntity.Entity);
        }
    }
    ReceiveActorEndOverlap(other) {
        if ((0, EntityRegistry_1.isEntity)(other)) {
            const tsEntity = other;
            this.Entity.OnTriggerExit(tsEntity.Entity);
        }
    }
}
exports.TsNpc = TsNpc;
exports.default = TsNpc;
//# sourceMappingURL=TsNpc.js.map