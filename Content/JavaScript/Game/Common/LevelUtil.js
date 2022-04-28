"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelUtil = void 0;
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Public_1 = require("../Entity/Public");
class LevelUtil {
    static GetAllEntities(world) {
        const actors = (0, ue_1.NewArray)(ue_1.Actor);
        ue_1.GameplayStatics.GetAllActorsOfClass(world, (0, Class_1.getUeClassByTsClass)(Public_1.TsEntity), (0, puerts_1.$ref)(actors));
        const result = [];
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            result.push(actor);
        }
        return result;
    }
}
exports.LevelUtil = LevelUtil;
//# sourceMappingURL=LevelUtil.js.map