/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';

import { getTsClassByUeClass, getUeClassByTsClass, TTsClassType } from '../../../../Common/Class';
import { TComponentClass } from '../../../../Common/Entity';
import { error } from '../../../../Common/Log';
import { ObjectScheme } from '../../../../Common/Type';
import { IComponentsState, ITsEntity } from '../../../../Game/Entity/Interface';
import { entityRegistry } from '../../../../Game/Entity/Public';
import { componentRegistry } from '../Component/Index';

export type TEntityPureData = Record<string, unknown> & {
    ComponentsStateJson: string;
};

class EditorEntityRegistry {
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
            error(`Can not find scheme for ue class obj ${classObj.GetName()}`);
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

    private GenComponentsStateJson(classObjs: TComponentClass[]): string {
        const components: Record<string, Record<string, unknown>> = {};
        classObjs.forEach((classObj) => {
            const componentScheme = componentRegistry.GetScheme(classObj.name);
            components[classObj.name] = componentScheme.CreateDefault() as Record<string, unknown>;
        });
        const componentsState: IComponentsState = {
            Components: components,
        };
        return JSON.stringify(componentsState);
    }

    public GenData<T extends ITsEntity>(obj: T): TEntityPureData {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        const result: TEntityPureData = {
            ComponentsStateJson: '',
        };
        if (!scheme) {
            return result;
        }

        for (const fieldName in scheme.Fields) {
            result[fieldName] = obj[fieldName] as unknown;
        }
        result.ComponentsStateJson = obj.ComponentsStateJson;
        return result;
    }

    public ApplyData<T extends ITsEntity>(pureData: TEntityPureData, obj: T): void {
        const classObj = obj.GetClass();
        const scheme = this.GetSchemeByUeClass(classObj);
        for (const fieldName in scheme.Fields) {
            if (pureData[fieldName] === undefined) {
                error(`pureData for [${classObj.GetName()}.${fieldName}] is undefined`);
            }
        }
        obj.ComponentsStateJson = pureData.ComponentsStateJson;
        Object.assign(obj, pureData);
    }
}

export const editorEntityRegistry = new EditorEntityRegistry();
