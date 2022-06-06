/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/File';
import { log } from '../../Common/Log';
import { readJsonObj, stringify } from '../../Common/Util';
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
        const entityDatas = entityPaths.map((path) =>
            readJsonObj<IEntityData & { Guid: string }>(path),
        );

        // 记录所有Entity的Guid和Id的对应关系
        const replaceMap: Map<string, string> = new Map();
        entityDatas.forEach((ed) => {
            replaceMap.set(`"${ed.Guid}"`, ed.Id.toString());
            log(`Entity [${ed.Id}] [${ed.Guid}]`);
        });

        entityDatas.forEach((ed, id) => {
            // 去掉Guid
            ed.Guid = undefined;

            // 将引用的Guid改成Id
            let edJson = stringify(ed);
            let replaceCount = 0;
            replaceMap.forEach((idStr: string, guidStr: string) => {
                const split = edJson.split(guidStr);
                if (split.length > 0) {
                    replaceCount += split.length - 1;
                    edJson = split.join(idStr);
                }
            });

            log(`[${ed.Name}] replaceCount=${replaceCount}`);
            MyFileHelper.Write(entityPaths[id], edJson);
        });

        // 修复所有flowList中的Guid
        const replaceMapForFlowList: Map<string, string> = new Map();
        replaceMap.forEach((idStr: string, guidStr: string) => {
            // 格式化成csv后, Guid被两个双引号包围
            replaceMapForFlowList.set(`"${guidStr}"`, idStr);
        });

        flowListOp.Files.forEach((flowListFile) => {
            let fileStr = MyFileHelper.Read(flowListFile);
            let replaceCount = 0;
            replaceMapForFlowList.forEach((idStr: string, guidStr: string) => {
                const split = fileStr.split(guidStr);
                if (split.length > 0) {
                    replaceCount += split.length - 1;
                    fileStr = split.join(idStr);
                }
            });

            log(`[${flowListFile}] replaceCount=${replaceCount}`);
            if (replaceCount > 0) {
                MyFileHelper.Write(flowListFile, fileStr);
            }
        });
    }

    public static FixAllEntityDataId(): void {
        this.GetAllLevelNames().forEach((levelName) => {
            this.FixEntityDataId(levelName);
        });
    }
}
