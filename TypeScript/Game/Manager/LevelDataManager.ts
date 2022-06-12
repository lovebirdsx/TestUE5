/* eslint-disable spellcheck/spell-checker */
import { readJsonObj } from '../../Common/Util';
import { entityIdAllocator } from '../Common/Operations/Entity';
import { EntityTemplateOp } from '../Common/Operations/EntityTemplate';
import { gameContext, ILevelDataManager } from '../Interface';
import { IEntityData } from '../Interface/IEntity';
import { ILevelData } from '../Interface/ILevel';
import { getLevelDataPath } from '../Interface/Level';
import { IManager } from './Interface';

export class LevelDataManager implements IManager, ILevelDataManager {
    private readonly EntityDataMap: Map<number, IEntityData> = new Map();

    public constructor() {
        gameContext.LevelDataManager = this;
    }

    public Init(): void {
        const world = gameContext.World;
        const levelDataPath = getLevelDataPath(world);
        const levelData = readJsonObj<ILevelData>(levelDataPath, { EntityDatas: [] });
        levelData.EntityDatas.forEach((ed) => {
            this.EntityDataMap.set(ed.Id, ed);
        });
    }

    public Exit(): void {}

    public GetEntityData(id: number): IEntityData {
        return this.EntityDataMap.get(id);
    }

    public GenEntityData(templateId: number, entityId?: number): IEntityData {
        const template = EntityTemplateOp.GetTemplateById(templateId);
        const entityData: IEntityData = {
            Id: entityId || entityIdAllocator.Alloc(),
            BlueprintType: template.BlueprintType,
            ComponentsData: template.ComponentsData,
        };
        this.EntityDataMap.set(entityData.Id, entityData);
        return entityData;
    }
}
