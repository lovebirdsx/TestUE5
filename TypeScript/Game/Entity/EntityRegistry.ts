/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import {
    getBlueprintId,
    getTsClassByUeClass,
    isChildOfClass,
    TTsClassType,
} from '../../Common/Class';
import { toTransformInfo } from '../../Common/Interface';
import { warn } from '../../Common/Log';
import { stringify } from '../../Common/Util';
import {
    IEntityData,
    ITsEntity,
    parseComponentsData,
    TComponentClass,
    TComponentData,
    TComponentsData,
} from '../Interface';
import { TActionType } from '../Interface/Action';
import TsPlayer from '../Player/TsPlayer';
import { componentRegistry } from '../Scheme/Component/Public';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';

const baseActions: TActionType[] = ['Invoke', 'Log', 'Wait', 'ShowMessage'];

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    private readonly ActionsMap = new Map<TTsClassType, TActionType[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        if (this.EntityMap.has(entityClass)) {
            throw new Error(`Register entity again for [${entityClass.name}]`);
        }
        this.EntityMap.set(entityClass, components);
        const actions: TActionType[] = [...baseActions];
        components.forEach((compClass) => {
            const scheme = componentRegistry.TryGetScheme(compClass.name);
            if (scheme) {
                scheme.Actions.forEach((action) => {
                    if (actions.includes(action)) {
                        throw new Error(`Action ${action} on two component [${compClass.name}]`);
                    } else {
                        actions.push(action);
                    }
                });
            }
        });
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        actions.sort();
        this.ActionsMap.set(entityClass, actions);

        // log(`${entityClass.name} actions: ${actions.join(', ')}`);
    }

    public GetComponentClassesByTsClass(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            throw new Error(`No components class for entity [${entityClass.name}]`);
        }
        return result;
    }

    public GetComponentClasses(entity: ITsEntity): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(entity.GetClass());
        return this.GetComponentClassesByTsClass(tsClassObj);
    }

    public GetActionsByTsClass(entityClass: TTsClassType): TActionType[] {
        const actions = this.ActionsMap.get(entityClass);
        if (!actions) {
            throw new Error(`No actions for entity [${entityClass.name}]`);
        }

        return actions;
    }

    public GetActionsByActor(actor: Actor): TActionType[] {
        const tsClassObj = getTsClassByUeClass(actor.GetClass());
        return this.GetActionsByTsClass(tsClassObj);
    }

    private GenComponentsData(obj: ITsEntity): TComponentsData {
        const componentsData = parseComponentsData(obj.ComponentsDataJson);
        const classObjs = this.GetComponentClasses(obj);
        // 移除不存在的Component配置
        Object.keys(componentsData).forEach((key) => {
            const classObj = classObjs.find((obj) => obj.name === key);
            if (classObj === undefined || !componentRegistry.HasDataForScheme(key)) {
                warn(`移除不存在的Component配置[${key}]`);
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete componentsData[key];
            }
        });

        // 填充需要的Component配置
        classObjs.forEach((classObj) => {
            const componentName = classObj.name;
            if (componentRegistry.HasDataForScheme(componentName)) {
                const scheme = componentRegistry.GetScheme(componentName);
                if (componentsData[componentName]) {
                    scheme.Fix(componentsData[componentName]);
                } else {
                    const componentData = scheme.CreateDefault() as TComponentData;
                    componentData.Disabled = false;
                    componentsData[componentName] = componentData;
                }
            }
        });

        return componentsData;
    }

    public GenData<T extends ITsEntity>(obj: T): IEntityData {
        return {
            Lable: obj.ActorLabel,
            Transform: toTransformInfo(obj.GetTransform()),
            PrefabId: getBlueprintId(obj.GetClass()),
            Id: obj.Id,
            ComponentsData: this.GenComponentsData(obj),
        };
    }

    public Check(data: IEntityData, entity: ITsEntity, messages: string[]): number {
        let errorCount = 0;
        if (data.Id !== entity.Id) {
            messages.push(`Id和Actor的Id不一致`);
            errorCount++;
        }

        const classObjs = this.GetComponentClasses(entity);

        // 冗余的配置
        Object.keys(data.ComponentsData).forEach((componentName) => {
            const classObj = classObjs.find((obj) => obj.name === componentName);
            if (!classObj) {
                messages.push(`Component ${componentName}配置了数据, 但是找不到对应的类型数据`);
            }
        });

        // 缺少或者错误的配置
        classObjs.forEach((classObj) => {
            const componentName = classObj.name;
            if (componentRegistry.HasDataForScheme(componentName)) {
                const scheme = componentRegistry.GetScheme(componentName);
                const value = data.ComponentsData[componentName];
                if (value) {
                    errorCount += scheme.Check(value, messages);
                } else {
                    messages.push(`${componentName} 没有配置数据`);
                    errorCount++;
                }
            }
        });
        return errorCount;
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

export function isEntity(actor: Actor): boolean {
    return (
        isChildOfClass(actor, TsEntity) ||
        isChildOfClass(actor, TsCharacterEntity) ||
        isChildOfClass(actor, TsPlayer)
    );
}

export function isPlayer(actor: Actor): boolean {
    return isChildOfClass(actor, TsPlayer);
}

export const entityRegistry = new EntityRegistry();
