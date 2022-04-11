"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityScheme = void 0;
const Class_1 = require("../../../../Common/Class");
const TsTrigger_1 = require("../../../../Game/Entity/TsTrigger");
const Log_1 = require("../../Log");
const Trigger_1 = require("./Trigger");
class EntitySchemes {
    SchemeMap = new Map();
    constructor() {
        this.RegAllSchemes();
    }
    RegScheme(classType, scheme) {
        const classObj = (0, Class_1.getClassObj)(classType);
        this.SchemeMap.set(classObj, scheme);
    }
    RegAllSchemes() {
        this.RegScheme(TsTrigger_1.default, Trigger_1.triggerScheme);
    }
    GetSchemeByUeClass(classObj) {
        const result = this.SchemeMap.get(classObj);
        if (!result) {
            (0, Log_1.error)(`Can not find scheme for ue class obj ${classObj.GetName()}`);
        }
        return result;
    }
    GetScheme(classType) {
        const classObj = (0, Class_1.getClassObj)(classType);
        return this.GetSchemeByUeClass(classObj);
    }
    GenData(obj) {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        const result = {};
        if (!scheme) {
            return result;
        }
        for (const fieldName in scheme.Fields) {
            result[fieldName] = obj[fieldName];
        }
        return result;
    }
    ApplyData(pureData, obj) {
        const classObj = obj.GetClass();
        const scheme = this.GetSchemeByUeClass(classObj);
        for (const fieldName in scheme.Fields) {
            if (pureData[fieldName] === undefined) {
                (0, Log_1.error)(`pureData for [${classObj.GetName()}.${fieldName}] is undefined`);
            }
        }
        Object.assign(obj, pureData);
    }
}
exports.entityScheme = new EntitySchemes();
//# sourceMappingURL=Index.js.map