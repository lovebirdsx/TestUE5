/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/File';
import { readJsonObj, writeJson } from '../../Common/Util';
import { IEntityData } from '../Interface';

export type TLevelName = 'Demo' | 'TestTsEntity' | 'WorldPartition';

export interface ILevelConfig {
    Name: TLevelName;
    ContentPath: string;
    IsPartition: boolean;
}

export const levelConfigs: ILevelConfig[] = [
    { Name: 'Demo', ContentPath: 'Demo/Map/Demo', IsPartition: true },
    {
        Name: 'WorldPartition',
        ContentPath: 'Test/WorldPartition/WorldPartition',
        IsPartition: true,
    },
    { Name: 'TestTsEntity', ContentPath: 'Test/TsEntity/TestTsEntity', IsPartition: false },
];

export interface ILevelData {
    EntityDatas: IEntityData[];
}

function getAllEntityDataPathForPartitionLevel(contentPath: string): string[] {
    const actorsDir = MyFileHelper.GetPath(EFileRoot.Content, `__ExternalActors__/${contentPath}`);
    return listFiles(actorsDir, 'json', true);
}

function getAllEntityDataPathForNormalLevel(contentPath: string): string[] {
    const levelDir = MyFileHelper.GetPath(EFileRoot.Content, `${contentPath}_Entities`);
    return listFiles(levelDir, 'json', false);
}

export function getAllEntityDataPath(levelName: TLevelName): string[] {
    const levelConfig = levelConfigs.find((config) => config.Name === levelName);
    if (!levelConfig) {
        throw new Error(`No Level for name [${levelName}]`);
    }

    if (levelConfig.IsPartition) {
        return getAllEntityDataPathForPartitionLevel(levelConfig.ContentPath);
    }
    return getAllEntityDataPathForNormalLevel(levelConfig.ContentPath);
}

export function getAllEntityData(levelName: TLevelName): IEntityData[] {
    const paths = getAllEntityDataPath(levelName);
    return paths.map((path) => readJsonObj<IEntityData>(path));
}

export function tryGetWorldLevelName(worldName: string): TLevelName | undefined {
    const config = levelConfigs.find((config) => config.Name === worldName);
    return config ? config.Name : undefined;
}

export function saveLevelData(levelName: TLevelName, path: string): void {
    const levelData: ILevelData = {
        EntityDatas: getAllEntityData(levelName),
    };
    writeJson(levelData, path);
}
