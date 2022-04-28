/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';

import { getTsClassByUeClass, getUeClassByTsClass, TTsClassType } from '../../../Common/Class';
import { error } from '../../../Common/Log';
import { ObjectScheme, StringScheme } from '../../../Common/Type';
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

    public GetScheme<T extends TTsClassType>(classType: T): ObjectScheme<Partial<T>> {
        const classObj = getUeClassByTsClass(classType);
        return this.GetSchemeByUeClass<T>(classObj);
    }

    public GetComponentClasses(obj: UE.Object): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(obj.GetClass());
        return entityRegistry.GetComponents(tsClassObj);
    }

    public GenData<T extends ITsEntity>(obj: T): TEntityPureData {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        if (!scheme) {
            throw new Error(`No scheme for ${obj ? obj.GetName() : 'undefined'}`);
        }

        const result: TEntityPureData = {
            // 转换为Object,方便查看序列化之后的字符串
            ComponentsStateJson: obj.ComponentsStateJson
                ? (JSON.parse(obj.ComponentsStateJson) as TComponentsState)
                : {},
            Guid: obj.Guid,
        };

        for (const fieldName in scheme.Fields) {
            const fieldScheme = scheme.Fields[fieldName] as StringScheme;
            if (!fieldScheme) {
                continue;
            }

            // Json字段特殊处理,是为了方便查看和对比序列化之后的字符串
            if (fieldScheme.IsJson) {
                let fileValue = obj[fieldName] as string;
                if (!fileValue) {
                    fileValue = fieldScheme.CreateDefault();
                }
                result[fieldName] = JSON.parse(fileValue);
            } else {
                result[fieldName] = obj[fieldName] as unknown;
            }
        }

        return result;
    }

    public ApplyData<T extends ITsEntity>(pureData: TEntityPureData, obj: T): void {
        const classObj = obj.GetClass();
        const scheme = this.GetSchemeByUeClass(classObj);
        for (const fieldName in scheme.Fields) {
            const fieldScheme = scheme.Fields[fieldName] as StringScheme;
            if (!fieldScheme) {
                continue;
            }

            if (pureData[fieldName] === undefined) {
                error(`pureData for [${classObj.GetName()}.${fieldName}] is undefined`);
            }

            // Json字段特殊处理,是为了方便查看和对比序列化之后的字符串
            if (fieldScheme.IsJson) {
                const fieldValue = pureData[fieldName];
                obj[fieldName] = JSON.stringify(fieldValue, null, 2);
            } else {
                obj[fieldName] = pureData[fieldName];
            }
        }
        obj.Guid = pureData.Guid;

        // pureData中存储的是对象,所以要转换一次
        obj.ComponentsStateJson = JSON.stringify(pureData.ComponentsStateJson, null, 2);

        // 让ue认为对象已经被修改
        UE.EditorOperations.MarkPackageDirty(obj);
    }
}

export const entitySchemeRegistry = new EntitySchemeRegistry();
