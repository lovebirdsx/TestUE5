"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcEntity = void 0;
/* eslint-disable spellcheck/spell-checker */
const FlowComponent_1 = require("../Component/FlowComponent");
const Interface_1 = require("../Interface");
class NpcEntity extends Interface_1.Entity {
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