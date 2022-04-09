"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
class TsPlayer extends ue_1.TestUE5Character {
    Constructor() {
        this.Movement = this.GetMovementComponent();
        Log_1.log(`${this.GetName()} Constructor()`);
    }
}
exports.default = TsPlayer;
//# sourceMappingURL=TsPlayer.js.map