/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-function-type */
import * as UE from 'ue';

import { error, warn } from './Log';

export interface ITsClassType<T extends UE.Object> extends Function {
    new (...args: unknown[]): T;
}

export type TTsClassType = ITsClassType<UE.Object>;
export type TActorComponentClassType = ITsClassType<UE.ActorComponent>;

const tsClassToUeClassMap: Map<TTsClassType, UE.Class> = new Map();
const ueClassToTsClassMap: Map<UE.Class, TTsClassType> = new Map();
const pathByClass: Map<UE.Class, string> = new Map();
const ueClassById: Map<number, UE.Class> = new Map();
const idByUeClass: Map<UE.Class, number> = new Map();

export function getUeClassByTsClass(tsClassType: TTsClassType): UE.Class {
    return tsClassToUeClassMap.get(tsClassType);
}

export function getTsClassByUeClass(ueClassType: UE.Class): TTsClassType {
    const result = ueClassToTsClassMap.get(ueClassType);
    if (!result) {
        throw new Error(`No ts class for ue class ${ueClassType.GetName()}`);
    }
    return result;
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

/**
 * 注册蓝图类型:
 * id 每一个蓝图类型的唯一id, 主要用于序列化
 * path 蓝图的路径, 类似于 `/Game/Blueprints/ExtendedEntity/BP_AiNpcFemale1.BP_AiNpcFemale1_C`
 * classType 蓝图对应的TsClass类型, 有两种, 一种是本体, 一种是继承
 * isOrigin 表示TsClass是否为本体
 **/
export function regBlueprintType(
    id: number,
    path: string,
    classType: TTsClassType,
    isOrigin: boolean,
): void {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        error(`Load class obj [${classType.name}] from [${path}] failed`);
        return;
    }

    const class0 = ueClassById.get(id);
    if (class0) {
        throw new Error(`id [${id}] is already reg by class [${class0.GetName()}]`);
    }

    const id0 = idByUeClass.get(classObj);
    if (id0 !== undefined) {
        throw new Error(`class [${classObj.GetName()}] already reg to id [${id0}]`);
    }

    ueClassById.set(id, classObj);
    idByUeClass.set(classObj, id);

    pathByClass.set(classObj, path);
    ueClassToTsClassMap.set(classObj, classType);

    if (isOrigin) {
        tsClassToUeClassMap.set(classType, classObj);
    }
}

export function getBlueprintClass(id: number): UE.Class {
    const result = ueClassById.get(id);
    if (!result) {
        throw new Error(`No blueprint class for id [${id}]`);
    }
    return result;
}

export function getBlueprintId(classObj: UE.Class): number {
    return idByUeClass.get(classObj);
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
