/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary, EditorOperations, EFileRoot, MyFileHelper } from 'ue';

import { getDir } from '../../../Common/File';
import { log } from '../../../Common/Log';
import { readJsonObj, writeJson } from '../../../Common/Util';
import { IEntityData, ITsEntity } from '../../../Game/Interface';
import { LevelTools } from '../../EntityEditor/LevelTools';
import { CustomSegmentIdGenerator } from '../SegmentIdGenerator';

export class EntityIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        const entityDatas = LevelTools.GetAllEntityDataOfCurrentLevel();
        let result = -1;
        entityDatas.forEach((ed) => {
            if (this.ContainsId(ed.Id) && ed.Id > result) {
                result = ed.Id;
            }
        });
        return result;
    }
}

function createCurrentLevelEntityIdGenerator(): EntityIdGenerator {
    const world = EditorLevelLibrary.GetEditorWorld();
    return new EntityIdGenerator(`${world.GetName()}_Entities`);
}

export const currentLevelEntityIdGenerator = createCurrentLevelEntityIdGenerator();

class EditorEntityOp {
    public GetEntityJsonPath(entity: ITsEntity): string {
        const externActorPath = EditorOperations.GetExternActorSavePath(entity);
        if (externActorPath) {
            const pathBaseOnContent = externActorPath.substring(6);
            return MyFileHelper.GetPath(EFileRoot.Content, pathBaseOnContent) + '.json';
        }

        const world = EditorLevelLibrary.GetEditorWorld() || EditorLevelLibrary.GetGameWorld();
        const mapPath = EditorOperations.GetPackagePath(world);
        const mapDir = getDir(mapPath);

        return `${mapDir}/${world.GetName()}_Entities/${entity.ActorGuid.ToString()}.json`;
    }

    public LoadEntityData(entity: ITsEntity): IEntityData {
        const path = this.GetEntityJsonPath(entity);
        return readJsonObj(path);
    }

    public SaveEntityData(entity: ITsEntity, data: IEntityData): void {
        const path = this.GetEntityJsonPath(entity);
        writeJson(data, path, true);
        log(`Save [${entity.ActorLabel}:${entity.Id}]: ${path}`);
    }
}

export const editorEntityOp = new EditorEntityOp();
