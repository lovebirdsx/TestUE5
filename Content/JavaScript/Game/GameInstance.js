"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInstance = void 0;
const ue_1 = require("ue");
const Log_1 = require("../Common/Log");
const Public_1 = require("./Entity/Public");
const GlobalActionsRunner_1 = require("./Flow/GlobalActionsRunner");
const EntityManager_1 = require("./Manager/EntityManager");
class GameInstance {
    EntityManager = new EntityManager_1.EntityManager();
    GlobalActionsRunner = new GlobalActionsRunner_1.GlobalActionsRunner();
    GameContext;
    Init(world) {
        // import Entity/Public 并不一定会调用initEntity,所以在此处强制调用
        (0, Public_1.initEntity)();
        this.GameContext = {
            World: world,
            Player: ue_1.GameplayStatics.GetPlayerPawn(world, 0),
            EntityManager: this.EntityManager,
            PlayerController: ue_1.GameplayStatics.GetPlayerController(world, 0),
            GlobalActionsRunner: this.GlobalActionsRunner,
        };
        const playerController = this.GameContext.PlayerController;
        playerController.Context = this.GameContext;
        this.GlobalActionsRunner.Init(this.GameContext);
        this.EntityManager.Init(this.GameContext);
        (0, Log_1.log)('GameInstance Init()');
    }
    Exit() {
        this.EntityManager.Exit();
        this.GlobalActionsRunner.Exit();
        (0, Log_1.log)('GameInstance Exit()');
    }
    Tick(deltaTime) {
        this.EntityManager.Tick(deltaTime);
    }
}
exports.GameInstance = GameInstance;
//# sourceMappingURL=GameInstance.js.map