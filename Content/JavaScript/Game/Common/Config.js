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
    LevelDataDir = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, 'Data/Map');
    LevelSaveDir = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Map');
    GetCurrentMapDataPath(world) {
        const settings = world.K2_GetWorldSettings();
        return `${this.LevelDataDir}/${settings.MapName}.json`;
    }
    GetCurrentMapSavePath(world) {
        const settings = world.K2_GetWorldSettings();
        return `${this.LevelSaveDir}/${settings.MapName}.json`;
    }
}
exports.gameConfig = new GameConfig();
//# sourceMappingURL=Config.js.map