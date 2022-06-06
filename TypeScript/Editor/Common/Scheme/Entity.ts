/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { getBlueprintId } from '../../../Common/Class';
import { toTransformInfo } from '../../../Common/Interface';
import { warn } from '../../../Common/Log';
import { stringify } from '../../../Common/Util';
import { IEntityData, ITsEntity, TComponentData, TComponentsData } from '../../../Game/Interface';
import { TActionType } from '../../../Game/Interface/Action';
import { TComponentType } from '../../../Game/Interface/Component';
import {
    getActionsByEntityType,
    getComponentsTypeByEntity,
    getEntityTypeByActor,
    TEntityType,
} from '../../../Game/Interface/Entity';
import { editorEntityOp } from '../Operations/Entity';
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
        return getComponentsTypeByEntity(this.GetEntityType(entity));
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
        const entityData = editorEntityOp.GetEntityData(entity);
        const componentsData = entityData.ComponentsData;
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

    public GenData(obj: ITsEntity): IEntityData {
        return {
            Name: obj.ActorLabel,
            Id: obj.Id,
            BlueprintId: getBlueprintId(obj.GetClass()),
            Transform: toTransformInfo(obj.GetTransform()),
            ComponentsData: this.GenComponentsData(obj),
        };
    }

    public ApplyData<T extends ITsEntity>(data: IEntityData, obj: T): boolean {
        let modifyCount = 0;
        if (obj.Id !== data.Id) {
            obj.Id = data.Id;
            modifyCount++;
        }
        const newDataJson = stringify(data.ComponentsData, true);
        if (obj.ComponentsDataJson !== newDataJson) {
            obj.ComponentsDataJson = newDataJson;
            modifyCount++;
        }
        if (obj.ComponentsDataJson !== newDataJson) {
            obj.ComponentsDataJson = newDataJson;
            modifyCount++;
        }
        return modifyCount > 0;
    }

    // 判断data数据是否和entity自身携带的数据一致
    public IsDataModified(entity: ITsEntity, data: IEntityData): boolean {
        const componentsDataJson = stringify(data.ComponentsData);
        return componentsDataJson !== entity.ComponentsDataJson || entity.Id !== data.Id;
    }
}

export const entityRegistry = new EntityRegistry();
