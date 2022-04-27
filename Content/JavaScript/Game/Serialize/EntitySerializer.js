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
const defalutRotator = ue_1.Rotator.MakeFromEuler(new ue_1.Vector());
const defalutScale = new ue_1.Vector(1, 1, 1);
function genTransform(state) {
    let rotator = defalutRotator;
    if (state.Rotation) {
        rotator = ue_1.Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }
    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defalutScale;
    const transform = new ue_1.Transform(rotator, pos, scale);
    return transform;
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
        const actorClass = (0, Class_1.getBlueprintType)(state.PrefabId);
        const transfrom = genTransform(state);
        const entity = ue_1.GameplayStatics.BeginDeferredActorSpawnFromClass(world, actorClass, transfrom);
        ue_1.GameplayStatics.FinishSpawningActor(entity, transfrom);
        return entity;
    }
}
exports.entitySerializer = new EntitySerializer();
//# sourceMappingURL=EntitySerializer.js.map