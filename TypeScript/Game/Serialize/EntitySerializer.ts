/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Transform, Vector } from 'ue';

import { getBlueprintClass, isChildOfClass } from '../../Common/Class';
import { entityRegistry } from '../Entity/EntityRegistry';
import { TsEntity } from '../Entity/Public';
import TsCharacterEntity from '../Entity/TsCharacterEntity';
import { gameContext, IEntityData, IEntitySnapshot, ITsEntity } from '../Interface';

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
    public GenTsEntitySnapshot(entity: ITsEntity): IEntitySnapshot {
        return {
            ...entityRegistry.GenData(entity),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rot: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
        };
    }

    public SpawnEntityByData(state: IEntityData, transform: Transform): TsEntity {
        const actorClass = getBlueprintClass(state.PrefabId);
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
