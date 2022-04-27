"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const GameInstance_1 = require("./GameInstance");
class TsGameInstance extends ue_1.DemoGameInstance {
    // @no-blueprint
    Instance;
    ReceiveInit() {
        this.Instance = new GameInstance_1.GameInstance();
        this.Instance.Init(this.GetWorld());
    }
    ReceiveTick(deltaSeconds) {
        this.Instance.Tick(deltaSeconds);
    }
    ReceiveShutdown() {
        this.Instance.Exit();
    }
}
exports.default = TsGameInstance;
//# sourceMappingURL=TsGameInstance.js.map