"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const Log_1 = require("../Common/Log");
class GameInstance {
    Init() {
        (0, Log_1.log)('GameInstance Init()');
    }
    Exit() {
        (0, Log_1.log)('GameInstance Exit()');
    }
    Tick(deltaTime) {
        //
    }
}
exports.GameInstance = GameInstance;
//# sourceMappingURL=GameInstance.js.map