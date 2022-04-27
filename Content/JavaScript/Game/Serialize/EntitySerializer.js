"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySerializer = void 0;
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const StateComponent_1 = require("../Component/StateComponent");
const Public_1 = require("../Scheme/Entity/Public");
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
const defaultRotator = ue_1.Rotator.MakeFromEuler(new ue_1.Vector());
const defaultScale = new ue_1.Vector(1, 1, 1);
function genTransform(state) {
    let rotator = defaultRotator;
    if (state.Rotation) {
        rotator = ue_1.Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }
    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defaultScale;
    const transform = new ue_1.Transform(rotator, pos, scale);
    return transform;
}
function genState(entity) {
    const stateComponent = entity.Entity.TryGetComponent(StateComponent_1.default);
    if (!stateComponent) {
        return undefined;
    }
    return stateComponent.GenSnapshot();
}
function applyState(entity, state) {
    if (state === undefined) {
        return;
    }
    const stateComponent = entity.Entity.TryGetComponent(StateComponent_1.default);
    if (!stateComponent) {
        (0, Log_1.error)(`apply state to ${entity.Name} but has not state component`);
        return;
    }
    stateComponent.ApplySnapshot(state);
}
class EntitySerializer {
    GenEntityState(entity) {
        return {
            PrefabId: (0, Class_1.getBlueprintId)(entity.GetClass()),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            PureData: Public_1.entitySchemeRegistry.GenData(entity),
            State: genState(entity),
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
        Public_1.entitySchemeRegistry.ApplyData(state.PureData, entity);
        applyState(entity, state.State);
        return entity;
    }
}
exports.entitySerializer = new EntitySerializer();
//# sourceMappingURL=EntitySerializer.js.map