"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../Common/Log");
class TsGameInstance extends ue_1.GameInstance {
    static Instance;
    Constructor() {
        TsGameInstance.Instance = this;
    }
    ReceiveInit() {
        (0, Log_1.log)('TsGameInstance ReceiveInit');
    }
    ReceiveShutdown() {
        (0, Log_1.log)('TsGameInstance ReceiveShutdown');
    }
}
exports.default = TsGameInstance;
//# sourceMappingURL=TsGameInstance.js.map