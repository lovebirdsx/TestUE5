"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameConfig = void 0;
const ue_1 = require("ue");
function getFlowListDir() {
    return ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, 'Data/FlowList');
}
class GameConfig {
    FlowListDir = getFlowListDir();
    FlowListPrefix = '流程_';
}
exports.gameConfig = new GameConfig();
//# sourceMappingURL=Config.js.map