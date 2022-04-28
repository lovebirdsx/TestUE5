"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const GameInstance_1 = require("./GameInstance");
class TsGameInstance extends ue_1.DemoGameInstance {
    // @no-blueprint
    Instance;
    ReceiveTick(deltaSeconds) {
        // 将GameInstance放在此处生成,是为了确保游戏中其它对象都已经生成完毕
        // 譬如 Player, PlayerController
        if (!this.Instance) {
            this.Instance = new GameInstance_1.GameInstance();
            this.Instance.Init(this.GetWorld());
        }
        this.Instance.Tick(deltaSeconds);
    }
    ReceiveShutdown() {
        this.Instance.Exit();
    }
}
exports.default = TsGameInstance;
//# sourceMappingURL=TsGameInstance.js.map