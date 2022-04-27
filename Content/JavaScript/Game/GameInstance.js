"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const Log_1 = require("../Common/Log");
const EntityManager_1 = require("./Manager/EntityManager");
class GameInstance {
    EntityManager = new EntityManager_1.EntityManager();
    Init(world) {
        this.EntityManager.Init(world);
        (0, Log_1.log)('GameInstance Init()');
    }
    Exit() {
        this.EntityManager.Exit();
        (0, Log_1.log)('GameInstance Exit()');
    }
    Tick(deltaTime) {
        this.EntityManager.Tick(deltaTime);
    }
}
exports.GameInstance = GameInstance;
//# sourceMappingURL=GameInstance.js.map