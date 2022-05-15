import { $ref } from 'puerts';
import { Actor, GameplayStatics, NewArray, World } from 'ue';

import { getUeClassByTsClass } from '../../Common/Class';
import { TsCharacterEntity } from '../Entity/TsCharacterEntity';
import { TsEntity } from '../Entity/TsEntity';
import { ITsEntity } from '../Interface';

export class LevelUtil {
    public static GetAllEntities(world: World): ITsEntity[] {
        // Entity
        const entities = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getUeClassByTsClass(TsEntity), $ref(entities));
        const result: TsEntity[] = [];
        for (let i = 0; i < entities.Num(); i++) {
            const entity = entities.Get(i);
            result.push(entity as TsEntity);
        }

        // Character Entity
        const characterEntities = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(
            world,
            getUeClassByTsClass(TsCharacterEntity),
            $ref(characterEntities),
        );
        for (let i = 0; i < characterEntities.Num(); i++) {
            const characterEntity = characterEntities.Get(i);
            result.push(characterEntity as TsEntity);
        }

        return result;
    }
}
