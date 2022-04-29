"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcComponent = void 0;
/* eslint-disable spellcheck/spell-checker */
const Interface_1 = require("../Interface");
const FlowComponent_1 = require("./FlowComponent");
const PlayerComponent_1 = require("./PlayerComponent");
class NpcComponent extends Interface_1.InteractiveComponent {
    Flow;
    OnInit() {
        this.Flow = this.Entity.GetComponent(FlowComponent_1.FlowComponent);
    }
    OnTriggerEnter(other) {
        const player = other.TryGetComponent(PlayerComponent_1.default);
        if (player) {
            player.AddInteractor(this.Entity);
        }
    }
    OnTriggerExit(other) {
        const player = other.TryGetComponent(PlayerComponent_1.default);
        if (player) {
            player.RemoveInteractor(this.Entity);
        }
    }
    async Interact(other) {
        await this.Flow.Run();
    }
}
exports.NpcComponent = NpcComponent;
//# sourceMappingURL=NpcComponent.js.map