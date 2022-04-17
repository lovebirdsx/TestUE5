"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regBlueprintType = exports.isType = exports.isChildOf = exports.isChildOfClass = exports.getTsClassByUeClass = exports.getUeClassByTsClass = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-function-type */
const UE = require("ue");
const Log_1 = require("./Log");
const tsClassToUeClassMap = new Map();
const ueClassToTsClassMap = new Map();
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
function regBlueprintType(path, classType) {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        (0, Log_1.error)(`Load class obj [${classType.name}] from [${path}] failed`);
        return;
    }
    tsClassToUeClassMap.set(classType, classObj);
    ueClassToTsClassMap.set(classObj, classType);
}
exports.regBlueprintType = regBlueprintType;
//# sourceMappingURL=Class.js.map