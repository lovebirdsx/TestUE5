/* eslint-disable spellcheck/spell-checker */
import { Config } from '../../Common/Config';
import { IEntityData, IEntityTemplate } from '../../Common/Interface/IEntity';
import { ILevelData } from '../../Common/Interface/ILevel';
import { levelsConfig } from '../../Common/Interface/Level';
import { getProjectPath } from '../../Common/Misc/File';
import { readJsonObj, writeJson } from '../../Common/Misc/Util';
import { editorFlowListOp } from '../Common/Operations/FlowList';
import { listFiles } from '../Common/Util';

function getAllEntityDataPathForPartitionLevel(contentPath: string): string[] {
    const actorsDir = getProjectPath(`Content/__ExternalActors__/${contentPath}`);
    return listFiles(actorsDir, 'json', true);
}

function getAllEntityDataPathForNormalLevel(contentPath: string): string[] {
    const levelDir = getProjectPath(`Content/${contentPath}_Entities`);
    return listFiles(levelDir, 'json', false);
}

export function getAllEntityDataPath(levelName: string): string[] {
    const levelConfig = levelsConfig.Levels.find((config) => config.Name === levelName);
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
    const config = levelsConfig.Levels.find((config) => config.Name === worldName);
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
        return levelsConfig.Levels.map((level) => level.Name);
    }

    public static GetAllEntityTemplatePath(): string[] {
        return listFiles(Config.EntityTemplateDir, 'json', true);
    }

    public static GetAllEntityTemplate(): IEntityTemplate[] {
        const templatePaths = this.GetAllEntityTemplatePath();
        return templatePaths.map((tp) => readJsonObj<IEntityTemplate>(tp));
    }

    public static FixEntityDataId(levelName: string): void {
        const entityPaths = getAllEntityDataPath(levelName);
        const entityDatas = entityPaths.map((path) => readJsonObj<IEntityData>(path));

        entityDatas.forEach((ed, id) => {
            // ????????????????????????EntityData???????????????
            writeJson(ed, entityPaths[id]);
        });
    }

    public static FixAllEntityData(): void {
        this.GetAllLevelNames().forEach((levelName) => {
            this.FixEntityDataId(levelName);
        });
    }

    public static FixAllFlowList(): void {
        editorFlowListOp.Files.forEach((flowListFile) => {
            // ????????????????????????FlowList???????????????
        });
    }

    public static FixAllEntityTempalte(): void {
        const templatePaths = this.GetAllEntityTemplatePath();
        const templates = templatePaths.map((tp) => readJsonObj<IEntityTemplate>(tp));
        templates.forEach((t, id) => {
            // ????????????????????????Template???????????????
            writeJson(t, templatePaths[id]);
        });
    }
}
