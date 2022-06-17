/* eslint-disable spellcheck/spell-checker */
import { IEntityData } from './IEntity';

export interface ILevelConfig {
    Id: number;
    Name: string;
    ContentPath: string;
    IsPartition: boolean;
}

export interface ILevelsConfig {
    Levels: ILevelConfig[];
}

export interface ILevelData {
    EntityDatas: IEntityData[];
}
