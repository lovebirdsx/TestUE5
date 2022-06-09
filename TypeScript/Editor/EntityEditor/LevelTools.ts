/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary, EFileRoot, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/File';
import { readJsonObj, writeJson } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { IEntityTemplate } from '../../Game/Common/Operations/EntityTemplate';
import { flowListOp } from '../../Game/Common/Operations/FlowList';
import { IEntityData } from '../../Game/Interface';
import { ILevelData } from '../../Game/Interface/Level';

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

function getAllEntityData(levelName: TLevelName): IEntityData[] {
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

export class LevelTools {
    public static GetAllLevelNames(): TLevelName[] {
        return levelConfigs.map((level) => level.Name);
    }

    public static GetAllEntityDataPathOfCurrentLevel(): string[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        return getAllEntityDataPath(world.GetName() as TLevelName);
    }

    public static GetAllEntityDataOfCurrentLevel(): IEntityData[] {
        const paths = this.GetAllEntityDataPathOfCurrentLevel();
        return paths.map((path) => readJsonObj<IEntityData>(path));
    }

    public static GetAllEntityTemplatePath(): string[] {
        return listFiles(GameConfig.EntityTemplateDir, 'json', true);
    }

    public static GetAllEntityTemplate(): IEntityTemplate[] {
        const templatePaths = this.GetAllEntityTemplatePath();
        return templatePaths.map((tp) => readJsonObj<IEntityTemplate>(tp));
    }

    public static FixEntityDataId(levelName: TLevelName): void {
        const entityPaths = getAllEntityDataPath(levelName);
        const entityDatas = entityPaths.map((path) => readJsonObj<IEntityData>(path));

        entityDatas.forEach((ed, id) => {
            // 此处可以加入针对EntityData处理的代码
            writeJson(ed, entityPaths[id]);
        });
    }

    public static FixAllEntityData(): void {
        this.GetAllLevelNames().forEach((levelName) => {
            this.FixEntityDataId(levelName);
        });
    }

    public static FixAllFlowList(): void {
        flowListOp.Files.forEach((flowListFile) => {
            // 此处可以加入针对FlowList处理的代码
        });
    }

    public static FixAllEntityTempalte(): void {
        const templatePaths = this.GetAllEntityTemplatePath();
        const templates = templatePaths.map((tp) => readJsonObj<IEntityTemplate>(tp));
        templates.forEach((t, id) => {
            // 此处可以加入针对Template处理的代码
            writeJson(t, templatePaths[id]);
        });
    }
}
