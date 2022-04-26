"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySerializer = void 0;
const Class_1 = require("../../Common/Class");
function vectorToArray(vec) {
    return [vec.X, vec.Y, vec.Z];
}
function genRotationArray(vec) {
    if (vec.X === 0 && vec.Y === 0 && vec.Z === 0) {
        return undefined;
    }
    return vectorToArray(vec);
}
function genScaleArray(vec) {
    if (vec.X === 1 && vec.Y === 1 && vec.Z === 1) {
        return undefined;
    }
    return vectorToArray(vec);
}
class EntitySerializer {
    GenEntityState(entity) {
        return {
            Guid: entity.Guid,
            PrefabId: (0, Class_1.getBlueprintId)(entity.GetClass()),
            Name: entity.Name,
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            Fields: {},
            Components: {},
        };
    }
    GenPlayerState(player) {
        return {
            Pos: vectorToArray(player.K2_GetActorLocation()),
            Rotation: genRotationArray(player.K2_GetActorRotation().Euler()),
        };
    }
    SpawnEntityByState(state) {
        return undefined;
    }
}
exports.entitySerializer = new EntitySerializer();
//# sourceMappingURL=EntitySerializer.js.map