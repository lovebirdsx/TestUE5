/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary, EditorOperations, EFileRoot, MyFileHelper, World } from 'ue';

import { getDir, listFiles } from '../../Common/File';
import { log } from '../../Common/Log';
import { readJsonObj, writeJson } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { IEntityData, ITsEntity } from '../../Game/Interface';
import { ILevelData } from '../../Game/Interface/Level';
import { getContentPackageName, openFile } from './Util';

interface IEntityRecord {
    EntityData: IEntityData;
    Path: string;
}

export class LevelDataManager {
    private MyEntityRecordMap: Map<number, IEntityRecord> = undefined;

    // 确保第一次保存总是能够成功
    private IsDirty = true;

    private get EntityRecordMap(): Map<number, IEntityRecord> {
        if (!this.MyEntityRecordMap) {
            this.MyEntityRecordMap = this.CreateEntityDataMap();
        }
        return this.MyEntityRecordMap;
    }

    private GetAllEntityPathForNormalLevel(world: World): string[] {
        const pathBaseOnContent = getContentPackageName(world);
        const levelDir = MyFileHelper.GetPath(EFileRoot.Content, `${pathBaseOnContent}_Entities`);
        return listFiles(levelDir, 'json', false);
    }

    private GetAllEntityPathForWpLevel(world: World): string[] {
        const pathBaseOnContent = getContentPackageName(world);
        const actorsDir = MyFileHelper.GetPath(
            EFileRoot.Content,
            `__ExternalActors__/${pathBaseOnContent}`,
        );
        return listFiles(actorsDir, 'json', true);
    }

    private CreateEntityDataMap(): Map<number, IEntityRecord> {
        const result: Map<number, IEntityRecord> = new Map();
        const world = EditorLevelLibrary.GetEditorWorld();
        const entityPaths = EditorOperations.IsInWpLevel(world)
            ? this.GetAllEntityPathForWpLevel(world)
            : this.GetAllEntityPathForNormalLevel(world);

        entityPaths.forEach((path) => {
            const entityData = readJsonObj<IEntityData>(path);
            const record: IEntityRecord = {
                Path: path,
                EntityData: entityData,
            };
            result.set(entityData.Id, record);
        });
        return result;
    }

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
        const record = this.EntityRecordMap.get(entity.Id);
        if (!record) {
            throw new Error(`No entity data for id [${entity.Id}]`);
        }
        return record.EntityData;
    }

    public SaveEntityData(entity: ITsEntity, data: IEntityData): void {
        const path = this.GetEntityJsonPath(entity);
        writeJson(data, path, true);
        this.IsDirty = true;

        this.EntityRecordMap.set(data.Id, {
            Path: path,
            EntityData: data,
        });

        log(`Save [${entity.ActorLabel}:${entity.Id}]: ${path}`);
    }

    public RemoveEntityData(entity: ITsEntity): void {
        if (!this.EntityRecordMap.has(entity.Id)) {
            throw new Error(`Remove entity data while id [${entity.Id}] not found`);
        }
        this.EntityRecordMap.delete(entity.Id);
    }

    public GetEntityData(id: number): IEntityData {
        const result = this.EntityRecordMap.get(id);
        if (!result) {
            throw new Error(`No entity data found for id [${id}]`);
        }

        return result.EntityData;
    }

    public GetMapDataPath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return GameConfig.GetCurrentLevelDataPath(world);
    }

    public OpenMapDataFile(): void {
        openFile(this.GetMapDataPath());
    }

    public ForeachEntityData(cb: (ed: IEntityData, path: string) => void): void {
        this.EntityRecordMap.forEach((record) => {
            cb(record.EntityData, record.Path);
        });
    }

    private SaveImpl(): void {
        const savePath = this.GetMapDataPath();
        const entityDatas: IEntityData[] = [];
        this.EntityRecordMap.forEach((record) => {
            entityDatas.push(record.EntityData);
        });

        const levelData: ILevelData = {
            EntityDatas: entityDatas,
        };
        writeJson(levelData, savePath);
        log(`Save level data to ${savePath}`);
    }

    public Save(): void {
        if (!this.IsDirty) {
            log('Save map date ignored because no modification exist');
            return;
        }

        this.SaveImpl();
        this.IsDirty = false;
    }
}

export const levelDataManager = new LevelDataManager();
