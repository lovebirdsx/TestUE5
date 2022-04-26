"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelSerializer = exports.LEVEL_SAVE_PATH = void 0;
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const EntitySerializer_1 = require("./EntitySerializer");
exports.LEVEL_SAVE_PATH = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, 'Demo/Map.json');
class LevelSerializer {
    GenLevelState(entities, player = undefined) {
        return {
            Player: player && EntitySerializer_1.entitySerializer.GenPlayerState(player),
            Entities: entities.map((e) => EntitySerializer_1.entitySerializer.GenEntityState(e)),
        };
    }
    Save(entities, player = undefined) {
        const state = this.GenLevelState(entities, player);
        ue_1.MyFileHelper.Write(exports.LEVEL_SAVE_PATH, JSON.stringify(state, undefined, 2));
        (0, Log_1.log)(`Save level state to ${exports.LEVEL_SAVE_PATH} ok`);
    }
    Load() {
        const content = ue_1.MyFileHelper.Read(exports.LEVEL_SAVE_PATH);
        if (!content) {
            (0, Log_1.error)(`No level exist at ${exports.LEVEL_SAVE_PATH}`);
            return {
                Player: undefined,
                Entities: [],
            };
        }
        return JSON.parse(content);
    }
}
exports.LevelSerializer = LevelSerializer;
//# sourceMappingURL=LevelSerializer.js.map