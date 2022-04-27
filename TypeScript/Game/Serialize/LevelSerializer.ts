import { EFileRoot, MyFileHelper } from 'ue';

import { error, log } from '../../Common/Log';
import { TsEntity } from '../Entity/Public';
import TsPlayer from '../Player/TsPlayer';
import { entitySerializer, IEntityState, IPlayerState } from './EntitySerializer';

interface ILevelState {
    Player: IPlayerState;
    Entities: IEntityState[];
}

export const LEVEL_SAVE_PATH = MyFileHelper.GetPath(EFileRoot.Content, 'Demo/Map.json');

export class LevelSerializer {
    public GenLevelState(entities: TsEntity[], player: TsPlayer = undefined): ILevelState {
        return {
            Player: player && entitySerializer.GenPlayerState(player),
            Entities: entities.map((e) => entitySerializer.GenEntityState(e)),
        };
    }

    public Save(entities: TsEntity[], player: TsPlayer = undefined): void {
        const state = this.GenLevelState(entities, player);
        MyFileHelper.Write(LEVEL_SAVE_PATH, JSON.stringify(state, undefined, 2));
        log(`Save level state to ${LEVEL_SAVE_PATH} ok`);
    }

    public Load(): ILevelState {
        const content = MyFileHelper.Read(LEVEL_SAVE_PATH);
        if (!content) {
            error(`No level exist at ${LEVEL_SAVE_PATH}`);
            return {
                Player: undefined,
                Entities: [],
            };
        }

        return JSON.parse(content) as ILevelState;
    }
}
