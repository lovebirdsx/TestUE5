/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { warn } from '../../../Common/Log';
import { deepEquals } from '../../../Common/Util';
import { ITsEntity } from '../../../Game/Interface';
import { toTransformInfo } from '../../../Game/Interface/Action';
import {
    getActionsByEntityType,
    getBlueprintTypeByClass,
    getComponentsTypeByEntityType,
    getEntityTypeByActor,
} from '../../../Game/Interface/Entity';
import { TActionType } from '../../../Game/Interface/IAction';
import { TComponentType } from '../../../Game/Interface/IComponent';
import {
    IEntityData,
    TComponentData,
    TComponentsData,
    TEntityType,
} from '../../../Game/Interface/IEntity';
import { levelDataManager } from '../LevelDataManager';
import { componentRegistry } from './Component/ComponentRegistry';

class EntityRegistry {
    public GetEntityType(entity: ITsEntity): TEntityType {
        const entityType = getEntityTypeByActor(entity);
        if (!entityType) {
            throw new Error(`No entity type for entity [${entity.ActorLabel}] [${entity.Id}]`);
        }
        return entityType;
    }

    public GetActions(entity: ITsEntity): TActionType[] {
        return getActionsByEntityType(this.GetEntityType(entity));
    }

    public GetComponentTypes(entity: ITsEntity): TComponentType[] {
        return getComponentsTypeByEntityType(this.GetEntityType(entity));
    }

    public Check(data: IEntityData, entity: ITsEntity, messages: string[]): number {
        let errorCount = 0;
        if (data.Id !== entity.Id) {
            messages.push(`Id和Actor的Id不一致`);
            errorCount++;
        }

        const componentTypes = this.GetComponentTypes(entity);

        // 冗余的配置
        Object.keys(data.ComponentsData).forEach((componentType) => {
            if (!componentTypes.find((type) => type === componentType)) {
                messages.push(`Component ${componentType}配置了数据, 但是找不到对应的类型数据`);
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

    private GenComponentsData(entity: ITsEntity): TComponentsData {
        const entityData = levelDataManager.TryGetEntityData(entity);
        const componentsData: TComponentsData = entityData ? entityData.ComponentsData : {};
        const componentTypes = this.GetComponentTypes(entity);

        // 移除不存在的Component配置
        Object.keys(componentsData).forEach((key) => {
            const componentType = key as TComponentType;
            const isExist = componentTypes.find((type) => type === componentType) !== undefined;
            if (!isExist || !componentRegistry.HasScheme(componentType)) {
                warn(`移除不存在的Component配置[${componentType}]`);
                delete componentsData[componentType];
            }
        });

        // 填充需要的Component配置
        componentTypes.forEach((componentType) => {
            if (componentRegistry.HasScheme(componentType)) {
                // 存在则尝试修复, 否则构造一个新的ComponentData
                const scheme = componentRegistry.GetScheme(componentType);
                if (componentsData[componentType]) {
                    scheme.Fix(componentsData[componentType]);
                } else {
                    const componentData = scheme.CreateDefault() as TComponentData;
                    componentData.Disabled = false;
                    componentsData[componentType] = componentData;
                }
            }
        });

        return componentsData;
    }

    public GenData(entity: ITsEntity): IEntityData {
        return {
            Name: entity.ActorLabel,
            Id: entity.Id,
            BlueprintType: getBlueprintTypeByClass(entity.GetClass()),
            Transform: toTransformInfo(entity.GetTransform()),
            ComponentsData: this.GenComponentsData(entity),
        };
    }

    // 判断entity当前的数据和data中的数据是否一致
    public IsDataModified(entity: ITsEntity, data: IEntityData): boolean {
        const oldData = levelDataManager.GetEntityData(entity);
        return !deepEquals(data, oldData);
    }
}

export const entityRegistry = new EntityRegistry();
