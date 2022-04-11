import * as UE from 'ue';

import { getClassObj, TUeClassType } from '../../../../Common/Class';
import TsTrigger from '../../../../Game/Entity/TsTrigger';
import { error } from '../../Log';
import { TObjectType } from '../Type';
import { triggerScheme } from './Trigger';

class EntitySchemes {
    private readonly SchemeMap: Map<UE.Class, TObjectType<unknown>> = new Map();

    public constructor() {
        this.RegAllSchemes();
    }

    private RegScheme(classType: TUeClassType, scheme: TObjectType<unknown>): void {
        const classObj = getClassObj(classType);
        this.SchemeMap.set(classObj, scheme);
    }

    private RegAllSchemes(): void {
        this.RegScheme(TsTrigger, triggerScheme);
    }

    public GetSchemeByUeObj<T extends TUeClassType>(obj: UE.Object): TObjectType<Partial<T>> {
        return this.GetSchemeByUeClass(obj.GetClass());
    }

    public GetSchemeByUeClass<T extends TUeClassType>(classObj: UE.Class): TObjectType<Partial<T>> {
        const result = this.SchemeMap.get(classObj);
        if (!result) {
            error(`Can not find scheme for ue class obj ${classObj.GetName()}`);
        }
        return result as TObjectType<Partial<T>>;
    }

    public GetScheme<T extends TUeClassType>(classType: T): TObjectType<Partial<T>> {
        const classObj = getClassObj(classType);
        return this.GetSchemeByUeClass<T>(classObj);
    }

    public GenData<T extends UE.Object>(obj: T): Partial<T> {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        const result = {};
        if (!scheme) {
            return result;
        }

        for (const fieldName in scheme.Fields) {
            result[fieldName] = obj[fieldName] as unknown;
        }
        return result;
    }

    public ApplyData<T extends UE.Object>(pureData: Partial<T>, obj: T): void {
        const classObj = obj.GetClass();
        const scheme = this.GetSchemeByUeClass(classObj);
        for (const fieldName in scheme.Fields) {
            if (pureData[fieldName] === undefined) {
                error(`pureData for [${classObj.GetName()}.${fieldName}] is undefined`);
            }
        }
        Object.assign(obj, pureData);
    }
}

export const entityScheme = new EntitySchemes();
