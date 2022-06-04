/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Transform } from 'ue';

import { getBlueprintClass, isChildOfClass } from '../../Common/Class';
import { entityRegistry } from '../Entity/EntityRegistry';
import { TsEntity } from '../Entity/Public';
import TsCharacterEntity from '../Entity/TsCharacterEntity';
import { gameContext, IEntityData } from '../Interface';

class EntitySerializer {
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
