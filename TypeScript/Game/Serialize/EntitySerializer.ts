/* eslint-disable spellcheck/spell-checker */

import { Vector } from 'ue';

import { getBlueprintId } from '../../Common/Class';
import TsEntity from '../Entity/TsEntity';
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

    public SpawnEntityByState(state: IEntityState): TsEntity {
        return undefined;
    }
}

export const entitySerializer = new EntitySerializer();
