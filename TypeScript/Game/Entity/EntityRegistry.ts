/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import {
    getBlueprintId,
    getTsClassByUeClass,
    isChildOfClass,
    TTsClassType,
} from '../../Common/Class';
import { error, warn } from '../../Common/Log';
import { getGuid, stringify } from '../../Common/Util';
import {
    IEntityData,
    ITsEntity,
    parseComponentsState,
    TComponentClass,
    TComponentsState,
    TComponentState,
} from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import { componentRegistry } from '../Scheme/Component/Public';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        this.EntityMap.set(entityClass, components);
    }

    public GetComponentClassesByTsClass(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            error(`No components class for [${entityClass.name}]`);
        }
        return result;
    }

    public GetComponentClassesByActor(actor: Actor): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(actor.GetClass());
        return this.GetComponentClassesByTsClass(tsClassObj);
    }

    private GenComponentsState(obj: ITsEntity): TComponentsState {
        const state = parseComponentsState(obj.ComponentsStateJson);
        const classObjs = this.GetComponentClassesByActor(obj);
        // 移除不存在的Component配置
        Object.keys(state).forEach((key) => {
            const classObj = classObjs.find((obj) => obj.name === key);
            if (classObj === undefined || !componentRegistry.HasScheme(key)) {
                warn(`移除不存在的Component配置[${key}]`);
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete state[key];
            }
        });

        // 填充需要的Component配置
        classObjs.forEach((classObj) => {
            const componentName = classObj.name;
            const scheme = componentRegistry.TryGetScheme(componentName);
            if (scheme) {
                if (state[componentName]) {
                    scheme.Fix(state[componentName]);
                } else {
                    const componentState = scheme.CreateDefault() as TComponentState;
                    componentState._Disabled = true;
                    state[componentName] = componentState;
                }
            }
        });

        return state;
    }

    public GenData<T extends ITsEntity>(obj: T): IEntityData {
        return {
            PrefabId: getBlueprintId(obj.GetClass()),
            Guid: obj.Guid,
            ComponentsState: this.GenComponentsState(obj),
        };
    }

    public Check(data: IEntityData, entity: ITsEntity, messages: string[]): number {
        let errorCount = 0;
        if (data.Guid !== getGuid(entity)) {
            messages.push(`Guid和Actor的Guid不一致`);
            errorCount++;
        }

        const classObjs = this.GetComponentClassesByActor(entity);

        // 冗余的配置
        Object.keys(data.ComponentsState).forEach((componentName) => {
            const classObj = classObjs.find((obj) => obj.name === componentName);
            if (!classObj) {
                messages.push(`Component ${componentName}配置了数据, 但是找不到对应的类型数据`);
            }
        });

        // 缺少或者错误的配置
        classObjs.forEach((classObj) => {
            const componentName = classObj.name;
            const scheme = componentRegistry.TryGetScheme(componentName);
            if (scheme) {
                const value = data.ComponentsState[componentName];
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

    public ApplyData<T extends ITsEntity>(data: IEntityData, obj: T): void {
        obj.Guid = data.Guid;
        obj.ComponentsStateJson = stringify(data.ComponentsState);
    }

    // 判断data数据是否和entity自身携带的数据一致
    public IsDataModified(entity: ITsEntity, data: IEntityData): boolean {
        const componentsStateJson = stringify(data.ComponentsState);
        return componentsStateJson !== entity.ComponentsStateJson || entity.Guid !== data.Guid;
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
