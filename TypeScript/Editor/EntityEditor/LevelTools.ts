/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/Misc/File';
import { readJsonObj, writeJson } from '../../Common/Misc/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { flowListOp } from '../../Game/Common/Operations/FlowList';
import { IEntityData, IEntityTemplate } from '../../Game/Interface/IEntity';
import { ILevelData } from '../../Game/Interface/ILevel';
import { levelConfigs } from '../../Game/Interface/Level';

function getAllEntityDataPathForPartitionLevel(contentPath: string): string[] {
    const actorsDir = MyFileHelper.GetPath(EFileRoot.Content, `__ExternalActors__/${contentPath}`);
    return listFiles(actorsDir, 'json', true);
}

function getAllEntityDataPathForNormalLevel(contentPath: string): string[] {
    const levelDir = MyFileHelper.GetPath(EFileRoot.Content, `${contentPath}_Entities`);
    return listFiles(levelDir, 'json', false);
}

export function getAllEntityDataPath(levelName: string): string[] {
    const levelConfig = levelConfigs.find((config) => config.Name === levelName);
    if (!levelConfig) {
        throw new Error(`No Level for name [${levelName}]`);
    }

    if (levelConfig.IsPartition) {
        return getAllEntityDataPathForPartitionLevel(levelConfig.ContentPath);
    }
    return getAllEntityDataPathForNormalLevel(levelConfig.ContentPath);
}

function getAllEntityData(levelName: string): IEntityData[] {
    const paths = getAllEntityDataPath(levelName);
    return paths.map((path) => readJsonObj<IEntityData>(path));
}

export function tryGetWorldLevelName(worldName: string): string | undefined {
    const config = levelConfigs.find((config) => config.Name === worldName);
    return config ? config.Name : undefined;
}

export function saveLevelData(levelName: string, path: string): void {
    const levelData: ILevelData = {
        EntityDatas: getAllEntityData(levelName),
    };
    writeJson(levelData, path);
}

export class LevelTools {
    public static GetAllLevelNames(): string[] {
        return levelConfigs.map((level) => level.Name);
    }

    public static GetAllEntityTemplatePath(): string[] {
        return listFiles(GameConfig.EntityTemplateDir, 'json', true);
    }

    public static GetAllEntityTemplate(): IEntityTemplate[] {
        const templatePaths = this.GetAllEntityTemplatePath();
        return templatePaths.map((tp) => readJsonObj<IEntityTemplate>(tp));
    }

    public static FixEntityDataId(levelName: string): void {
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
