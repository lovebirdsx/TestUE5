import { $ref } from 'puerts';
import { Actor, GameplayStatics, NewArray, World } from 'ue';

import { getUeClassByTsClass } from '../../Common/Class';
import { TsEntity } from '../Entity/Public';

export class LevelUtil {
    public static GetAllEntities(world: World): TsEntity[] {
        const actors = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getUeClassByTsClass(TsEntity), $ref(actors));
        const result: TsEntity[] = [];
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            result.push(actor as TsEntity);
        }
        return result;
    }
}
