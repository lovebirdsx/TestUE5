/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary } from 'ue';

import { listFiles } from '../../Common/File';
import { readJsonObj, writeJson } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { IEntityTemplate } from '../../Game/Common/Operations/EntityTemplate';
import { flowListOp } from '../../Game/Common/Operations/FlowList';
import { IEntityData } from '../../Game/Interface';
import { getAllEntityDataPath, levelConfigs, TLevelName } from '../../Game/Interface/Level';

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
