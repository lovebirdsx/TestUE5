import { MyFileHelper } from 'ue';

import { error, log } from '../../Common/Log';
import { IEntityState, IPlayerState, ITsEntity, ITsPlayer } from '../Interface';
import { entitySerializer } from './EntitySerializer';

export interface ILevelState {
    Player: IPlayerState;
    Entities: IEntityState[];
}

export class LevelSerializer {
    public GenLevelState(entities: ITsEntity[], player: ITsPlayer): ILevelState {
        return {
            Player: player && entitySerializer.GenPlayerState(player),
            Entities: entities.map((e) => entitySerializer.GenEntityState(e)),
        };
    }

    public Save(entities: ITsEntity[], player: ITsPlayer, path: string): void {
        const state = this.GenLevelState(entities, player);
        MyFileHelper.Write(path, JSON.stringify(state, undefined, 2));
        log(`Save level state to ${path} ok`);
    }

    public Load(path: string): ILevelState {
        const content = MyFileHelper.Read(path);
        if (!content) {
            error(`No level exist at ${path}`);
            return {
                Player: undefined,
                Entities: [],
            };
        }

        log(`Load level state form ${path} succeed`);
        return JSON.parse(content) as ILevelState;
    }
}
