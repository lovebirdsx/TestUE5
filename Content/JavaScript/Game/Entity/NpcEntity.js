"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcEntity = void 0;
/* eslint-disable spellcheck/spell-checker */
const Entity_1 = require("../../Common/Entity");
const FlowComponent_1 = require("../Component/FlowComponent");
class NpcEntity extends Entity_1.Entity {
    Flow;
    Init() {
        this.Flow = this.GetComponent(FlowComponent_1.FlowComponent);
    }
    async Interact() {
        await this.Flow.Run();
    }
}
exports.NpcEntity = NpcEntity;
//# sourceMappingURL=NpcEntity.js.map