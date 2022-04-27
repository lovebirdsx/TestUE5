/* eslint-disable spellcheck/spell-checker */

import { GameplayStatics, Rotator, Transform, Vector, World } from 'ue';

import { getBlueprintId, getBlueprintType } from '../../Common/Class';
import { error } from '../../Common/Log';
import StateComponent from '../Component/StateComponent';
import { TEntityPureData } from '../Entity/Interface';
import { TsEntity } from '../Entity/Public';
import TsPlayer from '../Player/TsPlayer';
import { entitySchemeRegistry } from '../Scheme/Entity/Public';

export interface IEntityState {
    PrefabId: number;
    Pos: number[];
    Rotation?: number[];
    Scale?: number[];
    PureData: TEntityPureData;
    State?: Record<string, unknown>;
}

export interface IPlayerState {
    Pos: number[];
    Rotation?: number[];
}

function vectorToArray(vec: Vector): number[] {
    return [vec.X, vec.Y, vec.Z];
}

function arrayToVector(array: number[]): Vector {
    return new Vector(array[0], array[1], array[2]);
}

function genRotationArray(vec: Vector): number[] {
    if (vec.X === 0 && vec.Y === 0 && vec.Z === 0) {
        return undefined;
    }

    return vectorToArray(vec);
}

function genScaleArray(vec: Vector): number[] {
    if (vec.X === 1 && vec.Y === 1 && vec.Z === 1) {
        return undefined;
    }

    return vectorToArray(vec);
}

const defaultRotator = Rotator.MakeFromEuler(new Vector());
const defaultScale = new Vector(1, 1, 1);

function genTransform(state: IEntityState): Transform {
    let rotator: Rotator = defaultRotator;
    if (state.Rotation) {
        rotator = Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }

    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defaultScale;

    const transform = new Transform(rotator, pos, scale);
    return transform;
}

function genState(entity: TsEntity): Record<string, unknown> {
    const stateComponent = entity.Entity.TryGetComponent(StateComponent);
    if (!stateComponent) {
        return undefined;
    }

    return stateComponent.GenSnapshot();
}

function applyState(entity: TsEntity, state: Record<string, unknown>): void {
    if (state === undefined) {
        return;
    }

    const stateComponent = entity.Entity.TryGetComponent(StateComponent);
    if (!stateComponent) {
        error(`apply state to ${entity.Name} but has not state component`);
        return;
    }

    stateComponent.ApplySnapshot(state);
}

class EntitySerializer {
    public GenEntityState(entity: TsEntity): IEntityState {
        return {
            PrefabId: getBlueprintId(entity.GetClass()),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            PureData: entitySchemeRegistry.GenData(entity),
            State: genState(entity),
        };
    }

    public GenPlayerState(player: TsPlayer): IPlayerState {
        return {
            Pos: vectorToArray(player.K2_GetActorLocation()),
            Rotation: genRotationArray(player.K2_GetActorRotation().Euler()),
        };
    }

    public SpawnEntityByState(world: World, state: IEntityState): TsEntity {
        const actorClass = getBlueprintType(state.PrefabId);
        const transfrom = genTransform(state);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            world,
            actorClass,
            transfrom,
        ) as TsEntity;
        GameplayStatics.FinishSpawningActor(entity, transfrom);
        entitySchemeRegistry.ApplyData(state.PureData, entity);
        applyState(entity, state.State);

        return entity;
    }
}

export const entitySerializer = new EntitySerializer();
