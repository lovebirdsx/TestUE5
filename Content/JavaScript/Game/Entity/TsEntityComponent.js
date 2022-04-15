"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
class TsEntityComponent extends ue_1.ActorComponent {
    get Name() {
        return `${this.GetOwner().GetName()}.${this.GetName()}`;
    }
    get Entity() {
        return this.GetOwner();
    }
    // @no-blueprint
    GetComponent(classObj) {
        return this.Entity.GetComponent(classObj);
    }
}
exports.default = TsEntityComponent;
//# sourceMappingURL=TsEntityComponent.js.map