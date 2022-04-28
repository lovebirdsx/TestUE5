"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelSerializer = void 0;
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const EntitySerializer_1 = require("./EntitySerializer");
class LevelSerializer {
    GenLevelState(entities, player) {
        return {
            Player: player && EntitySerializer_1.entitySerializer.GenPlayerState(player),
            Entities: entities.map((e) => EntitySerializer_1.entitySerializer.GenEntityState(e)),
        };
    }
    Save(entities, player, path) {
        const state = this.GenLevelState(entities, player);
        ue_1.MyFileHelper.Write(path, JSON.stringify(state, undefined, 2));
        (0, Log_1.log)(`Save level state to ${path} ok`);
    }
    Load(path) {
        const content = ue_1.MyFileHelper.Read(path);
        if (!content) {
            (0, Log_1.error)(`No level exist at ${path}`);
            return {
                Player: undefined,
                Entities: [],
            };
        }
        (0, Log_1.log)(`Load level state form ${path} succeed`);
        return JSON.parse(content);
    }
}
exports.LevelSerializer = LevelSerializer;
//# sourceMappingURL=LevelSerializer.js.map