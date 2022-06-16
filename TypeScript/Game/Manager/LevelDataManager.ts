/* eslint-disable spellcheck/spell-checker */
import { readJsonObj } from '../../Common/Misc/Util';
import { entityIdAllocator } from '../Common/Operations/Entity';
import { gameContext, ILevelDataManager } from '../Interface';
import { decompressEntityData, loadEntityTemplateConfig } from '../Interface/Entity';
import { IEntityData, IEntityTemplate } from '../Interface/IEntity';
import { ILevelData } from '../Interface/ILevel';
import { getLevelDataPath } from '../Interface/Level';
import { IManager } from './Interface';

export class LevelDataManager implements IManager, ILevelDataManager {
    private readonly CompressedEntityDataMap: Map<number, IEntityData> = new Map();

    private readonly TemplateMap: Map<number, IEntityTemplate> = new Map();

    private readonly EntityDataMap: Map<number, IEntityData> = new Map();

    public constructor() {
        gameContext.LevelDataManager = this;
    }

    public Init(): void {
        const world = gameContext.World;
        const levelDataPath = getLevelDataPath(world);
        const levelData = readJsonObj<ILevelData>(levelDataPath, { EntityDatas: [] });
        levelData.EntityDatas.forEach((ed) => {
            this.CompressedEntityDataMap.set(ed.Id, ed);
        });

        const templateConfig = loadEntityTemplateConfig();
        templateConfig.Templates.forEach((tp) => {
            this.TemplateMap.set(tp.Id, tp);
        });
    }

    public Exit(): void {}

    public GetEntityData(id: number): IEntityData {
        let result = this.EntityDataMap.get(id);
        if (!result) {
            const ced = this.CompressedEntityDataMap.get(id);
            result = decompressEntityData(ced, this.TemplateMap.get(ced.TemplateId));
            this.EntityDataMap.set(id, result);
        }
        return result;
    }

    public GenEntityData(templateId: number, entityId?: number): IEntityData {
        const template = this.TemplateMap.get(templateId);
        const entityData: IEntityData = {
            Name: '',
            Id: entityId || entityIdAllocator.Alloc(),
            BlueprintType: template.BlueprintType,
            ComponentsData: template.ComponentsData,
        };
        this.EntityDataMap.set(entityData.Id, entityData);
        return entityData;
    }
}
