"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySerializer = void 0;
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
function vectorToArray(vec) {
    return [vec.X, vec.Y, vec.Z];
}
function arrayToVector(array) {
    return new ue_1.Vector(array[0], array[1], array[2]);
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
    SpawnEntityByState(world, state) {
        const actorEss = ue_1.EditorSubsystemBlueprintLibrary.GetEditorSubsystem(ue_1.EditorActorSubsystem.StaticClass());
        const actorClass = (0, Class_1.getBlueprintType)(state.PrefabId);
        let rotator = undefined;
        if (state.Rotation) {
            rotator = ue_1.Rotator.MakeFromEuler(arrayToVector(state.Rotation));
        }
        const entity = actorEss.SpawnActorFromClass(actorClass, arrayToVector(state.Pos), rotator);
        if (state.Scale) {
            entity.SetActorScale3D(arrayToVector(state.Scale));
        }
        return entity;
    }
}
exports.entitySerializer = new EntitySerializer();
//# sourceMappingURL=EntitySerializer.js.map