"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UE = require("ue");
const Log_1 = require("../Editor/Common/Log");
const TsEntity_1 = require("../Game/Entity/TsEntity");
const TsTrigger_1 = require("../Game/Entity/TsTrigger");
const classMap = new Map();
function getClassObj(classType) {
    return classMap.get(classType);
}
exports.getClassObj = getClassObj;
function isChildOfClass(childObj, parentClassType) {
    const childClass = childObj.GetClass();
    const parentClass = getClassObj(parentClassType);
    if (!parentClass) {
        Log_1.warn(`can not find class type, childObj [${childObj.GetName()}-${childClass.GetName()}]`);
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}
exports.isChildOfClass = isChildOfClass;
function isChildOf(childClassType, parentClassType) {
    const childClass = getClassObj(childClassType);
    const parentClass = getClassObj(parentClassType);
    if (!childClass || !parentClass) {
        return false;
    }
    return UE.KismetMathLibrary.ClassIsChildOf(childClass, parentClass);
}
exports.isChildOf = isChildOf;
function isType(obj, classType) {
    const classObj1 = obj.GetClass();
    const classObj2 = getClassObj(classType);
    return classObj1 === classObj2;
}
exports.isType = isType;
function regBlueprintType(path, classType) {
    const classObj = UE.Class.Load(path);
    if (!classObj) {
        Log_1.error(`Load class obj for [${path}] failed`);
        return;
    }
    classMap.set(classType, classObj);
}
function regAllTypes() {
    regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C', TsEntity_1.default);
    regBlueprintType('/Game/Blueprints/TypeScript/Game/Entity/TsTrigger.TsTrigger_C', TsTrigger_1.default);
}
regAllTypes();
//# sourceMappingURL=Class.js.map