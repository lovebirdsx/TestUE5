/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { toTransformInfo } from '../../../Common/Interface/Action';
import {
    getActionsByEntityType,
    getComponentsTypeByEntityType,
    getEntityTypeByActor,
} from '../../../Common/Interface/Entity';
import { TActionType } from '../../../Common/Interface/IAction';
import { TComponentType } from '../../../Common/Interface/IComponent';
import { IEntityData, ITsEntityBase, TEntityType } from '../../../Common/Interface/IEntity';
import { deepEquals } from '../../../Common/Misc/Util';
import { levelDataManager } from '../LevelDataManager';
import { componentRegistry } from './Component/ComponentRegistry';

class EntityRegistry {
    public GetEntityType(entity: ITsEntityBase): TEntityType {
        const entityType = getEntityTypeByActor(entity);
        if (!entityType) {
            throw new Error(`No entity type for entity [${entity.ActorLabel}] [${entity.Id}]`);
        }
        return entityType;
    }

    public GetActions(entity: ITsEntityBase): TActionType[] {
        return getActionsByEntityType(this.GetEntityType(entity));
    }

    public GetComponentTypes(entity: ITsEntityBase): TComponentType[] {
        return getComponentsTypeByEntityType(this.GetEntityType(entity));
    }

    public Check(data: IEntityData, entity: ITsEntityBase, messages: string[]): number {
        let errorCount = 0;
        if (data.Id !== entity.Id) {
            messages.push(`Id和Actor的Id不一致`);
            errorCount++;
        }

        const componentTypes = this.GetComponentTypes(entity);

        // 冗余的配置
        Object.keys(data.ComponentsData).forEach((componentType) => {
            if (!componentTypes.find((type) => type === componentType)) {
                messages.push(`Component ${componentType} 配置了数据, 但是找不到对应的类型数据`);
            }
        });

        // 缺少或者错误的配置
        componentTypes.forEach((type) => {
            if (componentRegistry.HasScheme(type)) {
                const scheme = componentRegistry.GetScheme(type);
                const value = data.ComponentsData[type];
                if (value) {
                    errorCount += scheme.Check(value, messages);
                } else {
                    messages.push(`${type} 没有配置数据`);
                    errorCount++;
                }
            }
        });
        return errorCount;
    }

    public GenData(entity: ITsEntityBase): IEntityData {
        const entityData = levelDataManager.CloneEntityData(entity);
        const entityType = getEntityTypeByActor(entity);
        componentRegistry.FixComponentsData(entityType, entityData.ComponentsData);

        // 返回一个新的, 确保保存的Json按照此格式来排列
        return {
            Name: entity.ActorLabel,
            Id: entityData.Id,
            BlueprintType: entityData.BlueprintType,
            TemplateId: entityData.TemplateId,
            Transform: toTransformInfo(entity.GetTransform()),
            ComponentsData: entityData.ComponentsData,
        };
    }

    // 判断entity当前的数据和data中的数据是否一致
    public IsDataModified(entity: ITsEntityBase, data: IEntityData): boolean {
        const oldData = levelDataManager.GetEntityData(entity);
        return !deepEquals(data, oldData);
    }
}

export const entityRegistry = new EntityRegistry();
