import { MyFileHelper } from 'ue';

import { error, log } from '../../Common/Log';
import { IEntityState, ITsEntity } from '../Interface';
import { entitySerializer } from './EntitySerializer';

export interface ILevelState {
    Entities: IEntityState[];
}

export class LevelSerializer {
    public GenLevelState(entities: ITsEntity[]): ILevelState {
        return {
            Entities: entities.map((e) => entitySerializer.GenEntityState(e)),
        };
    }

    public Save(entities: ITsEntity[], path: string): void {
        const state = this.GenLevelState(entities);
        MyFileHelper.Write(path, JSON.stringify(state, undefined, 2));
        log(`Save level state to ${path} ok`);
    }

    public Load(path: string): ILevelState {
        const content = MyFileHelper.Read(path);
        if (!content) {
            error(`No level exist at ${path}`);
            return {
                Entities: [],
            };
        }

        log(`Load level state form ${path} succeed`);
        return JSON.parse(content) as ILevelState;
    }
}
