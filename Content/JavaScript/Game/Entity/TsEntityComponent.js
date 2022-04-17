"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
// import TsEntity from './TsEntity';
class TsEntityComponent extends ue_1.ActorComponent {
    get Name() {
        return `${this.GetOwner().GetName()}.${this.GetName()}`;
    }
}
exports.default = TsEntityComponent;
//# sourceMappingURL=TsEntityComponent.js.map