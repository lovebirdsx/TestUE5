/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-function-type */
import * as UE from 'ue';

import { error, warn } from './Log';

export interface ITsClassType<T extends UE.Object> extends Function {
    new (...args: unknown[]): T;
}

export type TTsClassType = ITsClassType<UE.Object>;

const tsClassToUeClassMap: Map<TTsClassType, UE.Class> = new Map();
const ueClassToTsClassMap: Map<UE.Class, TTsClassType> = new Map();
const pathByClass = new Map<UE.Class, string>();

export function getUeClassByTsClass(tsClassType: TTsClassType): UE.Class {
    return tsClassToUeClassMap.get(tsClassType);
}

export function getTsClassByUeClass(ueClassType: UE.Class): TTsClassType {
    return ueClassToTsClassMap.get(ueClassType);
}

export function isChildOfClass(childObj: UE.Object, parentClassType: TTsClassType): boolean {
    const childClass = childObj.GetClass();
    const parentClass = getUeClassByTsClass(parentClassType);
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

export function isChildOf(childClassType: TTsClassType, parentClassType: TTsClassType): boolean {
    const childClass = getUeClassByTsClass(childClassType);
    const parentClass = getUeClassByTsClass(parentClassType);
    if (!childClass || !parentClass) {
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}

export function isType(obj: UE.Object, classType: TTsClassType): boolean {
    const classObj1 = obj.GetClass();
    const classObj2 = getUeClassByTsClass(classType);
    return classObj1 === classObj2;
}

export function regBlueprintType(path: string, classType: TTsClassType): void {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        error(`Load class obj [${classType.name}] from [${path}] failed`);
        return;
    }

    pathByClass.set(classObj, path);
    tsClassToUeClassMap.set(classType, classObj);
    ueClassToTsClassMap.set(classObj, classType);
}

export function getBlueprintPath(classObj: UE.Class): string {
    const path = pathByClass.get(classObj);
    if (!path) {
        error(`Can not get blueprint path for TsClass [${classObj.GetName()}]`);
    }
    return path;
}

export function getAssetPath(classObj: UE.Class): string {
    const blueprintPath = getBlueprintPath(classObj);
    if (!blueprintPath) {
        return blueprintPath;
    }

    const assetPath = blueprintPath.substring(0, blueprintPath.length - 2);
    return assetPath;
}
