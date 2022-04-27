/* eslint-disable spellcheck/spell-checker */

import { GameplayStatics, Rotator, Transform, Vector, World } from 'ue';

import { getBlueprintId, getBlueprintType } from '../../Common/Class';
import { TsEntity } from '../Entity/Public';
import TsPlayer from '../Player/TsPlayer';

export interface IEntityState {
    Guid: string;
    PrefabId: number;
    Name: string;
    Pos: number[];
    Rotation?: number[];
    Scale?: number[];
    Fields: Record<string, unknown>;
    Components: Record<string, unknown>;
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

const defalutRotator = Rotator.MakeFromEuler(new Vector());
const defalutScale = new Vector(1, 1, 1);

function genTransform(state: IEntityState): Transform {
    let rotator: Rotator = defalutRotator;
    if (state.Rotation) {
        rotator = Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }

    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defalutScale;

    const transform = new Transform(rotator, pos, scale);
    return transform;
}

class EntitySerializer {
    public GenEntityState(entity: TsEntity): IEntityState {
        return {
            Guid: entity.Guid,
            PrefabId: getBlueprintId(entity.GetClass()),
            Name: entity.Name,
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            Fields: {},
            Components: {},
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
        return entity;
    }
}

export const entitySerializer = new EntitySerializer();
