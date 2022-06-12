/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary, EditorOperations, EFileRoot, MyFileHelper, World } from 'ue';

import { getDir, listFiles } from '../../Common/File';
import { log } from '../../Common/Log';
import { readJsonObj, writeJson } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { ITsEntity } from '../../Game/Interface';
import { IEntityData } from '../../Game/Interface/IEntity';
import { ILevelData } from '../../Game/Interface/ILevel';
import { getContentPackageName, openFile } from './Util';

interface IEntityRecord {
    EntityData: IEntityData;
    Path: string;
}

export class LevelDataManager {
    private MyEntityRecordMap: Map<number, IEntityRecord> = undefined;

    private readonly AddRecords: Map<number, IEntityRecord> = new Map();

    private readonly DelRecords: Map<number, IEntityRecord> = new Map();

    private readonly ModRecords: Map<number, IEntityRecord> = new Map();

    // 第一次总是能保存成功
    private NeedSaveMapData = true;

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

    public TryGetEntityData(entity: ITsEntity): IEntityData | undefined {
        const record = this.EntityRecordMap.get(entity.Id);
        return record ? record.EntityData : undefined;
    }

    public GetEntityData(entity: ITsEntity): IEntityData {
        const record = this.EntityRecordMap.get(entity.Id);
        if (!record) {
            throw new Error(`No entity data for id [${entity.Id}]`);
        }
        return record.EntityData;
    }

    public AddEntityData(entity: ITsEntity, data: IEntityData): void {
        const oldRecord = this.EntityRecordMap.get(entity.Id);
        if (oldRecord) {
            throw new Error(
                `Add entity data for [${entity.ActorLabel}:${entity.Id}] while already exist`,
            );
        }

        const newRecord = {
            Path: this.GetEntityJsonPath(entity),
            EntityData: data,
        };

        this.EntityRecordMap.set(entity.Id, newRecord);

        this.AddRecords.set(data.Id, newRecord);
        this.DelRecords.delete(data.Id);
        this.NeedSaveMapData = true;
    }

    public ModifyEntityData(entity: ITsEntity, data: IEntityData): void {
        const record = this.EntityRecordMap.get(entity.Id);
        if (!record) {
            throw new Error(
                `Modify entity data for [${entity.ActorLabel}: ${entity.Id}] while not exist`,
            );
        }

        record.EntityData = data;

        // 新添加的Entity, 在没有保存为uasset前, 不保存其EntityData, 确保两个数据同时存在
        if (!this.AddRecords.has(entity.Id)) {
            writeJson(record.EntityData, record.Path);
        }

        this.ModRecords.set(entity.Id, record);
        this.NeedSaveMapData = true;
    }

    public DelEntityData(entity: ITsEntity): void {
        const record = this.EntityRecordMap.get(entity.Id);
        if (!record) {
            throw new Error(`Remove entity data while id [${entity.Id}] not found`);
        }

        this.EntityRecordMap.delete(entity.Id);
        this.DelRecords.set(entity.Id, record);
        this.AddRecords.delete(entity.Id);
        this.NeedSaveMapData = true;
    }

    public GetEntityDataById(id: number): IEntityData {
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

    public SaveMapData(): void {
        if (!this.NeedSaveMapData) {
            log('Save map date ignored because no modification exist');
            return;
        }

        const savePath = this.GetMapDataPath();
        const entityDatas: IEntityData[] = [];
        this.EntityRecordMap.forEach((record) => {
            entityDatas.push(record.EntityData);
        });

        const levelData: ILevelData = {
            EntityDatas: entityDatas,
        };
        writeJson(levelData, savePath);
        this.NeedSaveMapData = false;
        log(`Save level data to ${savePath}`);
    }

    private SaveAddAndDelEntities(): void {
        this.AddRecords.forEach((record) => {
            writeJson(record.EntityData, record.Path);
            log(`Save [${record.EntityData.Name}:${record.EntityData.Id}]: ${record.Path}`);
        });

        this.DelRecords.forEach((record) => {
            MyFileHelper.Remove(record.Path);
            log(`Remove [${record.EntityData.Name}:${record.EntityData.Id}]: ${record.Path}`);
        });

        this.AddRecords.clear();
        this.DelRecords.clear();
    }

    public Save(): void {
        this.SaveMapData();
        this.SaveAddAndDelEntities();
    }
}

export const levelDataManager = new LevelDataManager();
