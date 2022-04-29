/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';

import { getTsClassByUeClass, getUeClassByTsClass, TTsClassType } from '../../../Common/Class';
import { error } from '../../../Common/Log';
import { ObjectScheme } from '../../../Common/Type';
import { stringifyWithOutUnderScore } from '../../../Common/Util';
import { entityRegistry } from '../../Entity/EntityRegistry';
import { ITsEntity, TComponentClass, TComponentsState, TEntityPureData } from '../../Interface';

class EntitySchemeRegistry {
    private readonly SchemeMap: Map<UE.Class, ObjectScheme<unknown>> = new Map();

    public RegScheme(classType: TTsClassType, scheme: ObjectScheme<unknown>): void {
        if (!scheme) {
            error(`Reg null scheme for class [${classType.name}]`);
            return;
        }
        const classObj = getUeClassByTsClass(classType);
        this.SchemeMap.set(classObj, scheme);
    }

    public GetSchemeByEntity<T extends TTsClassType>(obj: UE.Object): ObjectScheme<Partial<T>> {
        return this.GetSchemeByUeClass(obj.GetClass());
    }

    public GetSchemeByUeClass<T extends TTsClassType>(
        classObj: UE.Class,
    ): ObjectScheme<Partial<T>> {
        const result = this.SchemeMap.get(classObj);
        if (!result) {
            throw new Error(`Can not find scheme for ue class obj ${classObj.GetName()}`);
        }
        return result as ObjectScheme<Partial<T>>;
    }

    public GetComponentClasses(obj: UE.Object): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(obj.GetClass());
        return entityRegistry.GetComponents(tsClassObj);
    }

    public GenData<T extends ITsEntity>(obj: T): TEntityPureData {
        const result: TEntityPureData = {
            // 转换为Object,方便查看序列化之后的字符串
            ComponentsStateJson: obj.ComponentsStateJson
                ? (JSON.parse(obj.ComponentsStateJson) as TComponentsState)
                : {},
            Guid: obj.Guid,
        };

        return result;
    }

    public ApplyData<T extends ITsEntity>(pureData: TEntityPureData, obj: T): void {
        obj.Guid = pureData.Guid;

        // pureData中存储的是对象,所以要转换一次
        obj.ComponentsStateJson = stringifyWithOutUnderScore(pureData.ComponentsStateJson);

        // 让ue认为对象已经被修改
        UE.EditorOperations.MarkPackageDirty(obj);
    }
}

export const entitySchemeRegistry = new EntitySchemeRegistry();
