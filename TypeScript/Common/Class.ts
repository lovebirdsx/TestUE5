/* eslint-disable @typescript-eslint/prefer-function-type */
import * as UE from 'ue';

import { error, warn } from '../Editor/Common/Log';
import TsEntity from '../Game/Entity/TsEntity';
import TsTrigger from '../Game/Entity/TsTrigger';

export interface IUeClassType<T extends UE.Object> extends Function {
    new (...args: unknown[]): T;
}

export type TUeClassType = IUeClassType<UE.Object>;

const classMap: Map<TUeClassType, UE.Class> = new Map();

export function getClassObj(classType: TUeClassType): UE.Class {
    return classMap.get(classType);
}

export function isChildOfClass(childObj: UE.Object, parentClassType: TUeClassType): boolean {
    const childClass = childObj.GetClass();
    const parentClass = getClassObj(parentClassType);
    if (!parentClass) {
        warn(
            `can not find class type [${
                parentClassType.name
            }], childObj [${childObj.GetName()}-${childClass.GetName()}]`,
        );
        return false;
    }

    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}

export function isChildOf(childClassType: TUeClassType, parentClassType: TUeClassType): boolean {
    const childClass = getClassObj(childClassType);
    const parentClass = getClassObj(parentClassType);
    if (!childClass || !parentClass) {
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}

export function isType(obj: UE.Object, classType: TUeClassType): boolean {
    const classObj1 = obj.GetClass();
    const classObj2 = getClassObj(classType);
    return classObj1 === classObj2;
}

function regBlueprintType(path: string, classType: TUeClassType): void {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        error(`Load class obj [${classType.name}] from [${path}] failed`);
        return;
    }

    classMap.set(classType, classObj);
}

function regAllTypes(): void {
    regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C', TsEntity);
    regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsTrigger.TsTrigger_C', TsTrigger);
}

regAllTypes();
