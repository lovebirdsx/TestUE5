/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Transform } from 'ue';

import { getClassByBluprintType, getClassByEntityType } from '../../Common/Interface/Entity';
import { IEntityData } from '../../Common/Interface/IEntity';
import { isObjChildOfClass, stringify } from '../../Common/Misc/Util';
import TsEntity from '../Entity/TsEntity';
import { gameContext } from '../Interface';

const characterEntityClass = getClassByEntityType('CharacterEntity');

class EntitySerializer {
    public SpawnEntityByData(entityData: IEntityData, transform: Transform): TsEntity {
        const actorClass = getClassByBluprintType(entityData.BlueprintType);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            actorClass,
            transform,
        ) as TsEntity;

        if (isObjChildOfClass(entity, characterEntityClass)) {
            const character = entity as Actor as Character;
            character.SpawnDefaultController();
        }

        if (!entityData.Id) {
            throw new Error(
                `Invalid EntityData for spawn [id = ${entityData.Id}]\n${stringify(entityData)}`,
            );
        }

        entity.Id = entityData.Id;

        GameplayStatics.FinishSpawningActor(entity, transform);

        return entity;
    }
}

export const entitySerializer = new EntitySerializer();
