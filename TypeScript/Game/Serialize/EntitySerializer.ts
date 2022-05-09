/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Rotator, Transform, Vector } from 'ue';

import { getBlueprintType, isChildOfClass } from '../../Common/Class';
import { entityRegistry } from '../Entity/EntityRegistry';
import { TsEntity } from '../Entity/Public';
import TsCharacterEntity from '../Entity/TsCharacterEntity';
import { gameContext, IEntityData, IEntitySnapshot, ITsEntity } from '../Interface';

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

function genTransform(state: IEntitySnapshot): Transform {
    let rotator: Rotator = defaultRotator;
    if (state.Rot) {
        rotator = Rotator.MakeFromEuler(arrayToVector(state.Rot));
    }

    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defaultScale;

    const transform = new Transform(rotator, pos, scale);
    return transform;
}

class EntitySerializer {
    public GenTsEntitySnapshot(entity: ITsEntity): IEntitySnapshot {
        return {
            ...entityRegistry.GenData(entity),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rot: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
        };
    }

    public SpawnEntityBySnapshot(snapshot: IEntitySnapshot): TsEntity {
        const transform = genTransform(snapshot);
        return this.SpawnEntityByData(snapshot, transform);
    }

    public SpawnEntityByData(state: IEntityData, transform: Transform): TsEntity {
        const actorClass = getBlueprintType(state.PrefabId);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            actorClass,
            transform,
        ) as TsEntity;

        if (isChildOfClass(entity, TsCharacterEntity)) {
            const character = entity as Actor as Character;
            character.SpawnDefaultController();
        }

        entityRegistry.ApplyData(state, entity);

        GameplayStatics.FinishSpawningActor(entity, transform);

        return entity;
    }
}

export const entitySerializer = new EntitySerializer();
