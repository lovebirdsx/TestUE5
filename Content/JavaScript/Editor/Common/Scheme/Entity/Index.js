"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityScheme = void 0;
const Class_1 = require("../../../../Common/Class");
const TsNpc_1 = require("../../../../Game/Entity/TsNpc");
const TsTrigger_1 = require("../../../../Game/Entity/TsTrigger");
const Log_1 = require("../../Log");
const Npc_1 = require("./Npc");
const Trigger_1 = require("./Trigger");
class EntitySchemes {
    SchemeMap = new Map();
    constructor() {
        this.RegAllSchemes();
    }
    RegScheme(classType, scheme) {
        if (!scheme) {
            (0, Log_1.error)(`Reg null scheme for class [${classType.name}]`);
            return;
        }
        const classObj = (0, Class_1.getClassObj)(classType);
        this.SchemeMap.set(classObj, scheme);
    }
    RegAllSchemes() {
        this.RegScheme(TsTrigger_1.default, Trigger_1.triggerScheme);
        this.RegScheme(TsNpc_1.default, Npc_1.npcScheme);
    }
    GetSchemeByUeObj(obj) {
        return this.GetSchemeByUeClass(obj.GetClass());
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