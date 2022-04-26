"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetPath = exports.getBlueprintPath = exports.getBlueprintId = exports.getBlueprintType = exports.regBlueprintType = exports.isType = exports.isChildOf = exports.isChildOfClass = exports.getTsClassByUeClass = exports.getUeClassByTsClass = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-function-type */
const UE = require("ue");
const Log_1 = require("./Log");
const tsClassToUeClassMap = new Map();
const ueClassToTsClassMap = new Map();
const pathByClass = new Map();
const ueClassById = new Map();
const idByUeClass = new Map();
function getUeClassByTsClass(tsClassType) {
    return tsClassToUeClassMap.get(tsClassType);
}
exports.getUeClassByTsClass = getUeClassByTsClass;
function getTsClassByUeClass(ueClassType) {
    return ueClassToTsClassMap.get(ueClassType);
}
exports.getTsClassByUeClass = getTsClassByUeClass;
function isChildOfClass(childObj, parentClassType) {
    const childClass = childObj.GetClass();
    const parentClass = getUeClassByTsClass(parentClassType);
    if (!parentClass) {
        (0, Log_1.warn)(`can not find class type [${parentClassType.name}], childObj [${childObj.GetName()}-${childClass.GetName()}]`);
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}
exports.isChildOfClass = isChildOfClass;
function isChildOf(childClassType, parentClassType) {
    const childClass = getUeClassByTsClass(childClassType);
    const parentClass = getUeClassByTsClass(parentClassType);
    if (!childClass || !parentClass) {
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}
exports.isChildOf = isChildOf;
function isType(obj, classType) {
    const classObj1 = obj.GetClass();
    const classObj2 = getUeClassByTsClass(classType);
    return classObj1 === classObj2;
}
exports.isType = isType;
function regBlueprintType(id, path, classType) {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        (0, Log_1.error)(`Load class obj [${classType.name}] from [${path}] failed`);
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
    pathByClass.set(classObj, path);
    tsClassToUeClassMap.set(classType, classObj);
    ueClassToTsClassMap.set(classObj, classType);
    idByUeClass.set(classObj, id);
}
exports.regBlueprintType = regBlueprintType;
function getBlueprintType(id) {
    return ueClassById.get(id);
}
exports.getBlueprintType = getBlueprintType;
function getBlueprintId(classObj) {
    return idByUeClass.get(classObj);
}
exports.getBlueprintId = getBlueprintId;
function getBlueprintPath(classObj) {
    const path = pathByClass.get(classObj);
    if (!path) {
        (0, Log_1.error)(`Can not get blueprint path for TsClass [${classObj.GetName()}]`);
    }
    return path;
}
exports.getBlueprintPath = getBlueprintPath;
function getAssetPath(classObj) {
    const blueprintPath = getBlueprintPath(classObj);
    if (!blueprintPath) {
        return blueprintPath;
    }
    const assetPath = blueprintPath.substring(0, blueprintPath.length - 2);
    return assetPath;
}
exports.getAssetPath = getAssetPath;
//# sourceMappingURL=Class.js.map