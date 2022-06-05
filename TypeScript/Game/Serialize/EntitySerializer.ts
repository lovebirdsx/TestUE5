/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Transform } from 'ue';

import { getBlueprintClass, isChildOfClass } from '../../Common/Class';
import { stringify } from '../../Common/Util';
import { TsEntity } from '../Entity/Public';
import TsCharacterEntity from '../Entity/TsCharacterEntity';
import { gameContext, IEntityData } from '../Interface';

class EntitySerializer {
    public SpawnEntityByData(entityData: IEntityData, transform: Transform): TsEntity {
        const actorClass = getBlueprintClass(entityData.PrefabId);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            actorClass,
            transform,
        ) as TsEntity;

        if (isChildOfClass(entity, TsCharacterEntity)) {
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
