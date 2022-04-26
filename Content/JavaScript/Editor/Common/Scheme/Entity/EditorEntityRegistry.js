"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorEntityRegistry = void 0;
/* eslint-disable spellcheck/spell-checker */
const UE = require("ue");
const Class_1 = require("../../../../Common/Class");
const Log_1 = require("../../../../Common/Log");
const Public_1 = require("../../../../Game/Entity/Public");
const Index_1 = require("../Component/Index");
class EditorEntityRegistry {
    SchemeMap = new Map();
    RegScheme(classType, scheme) {
        if (!scheme) {
            (0, Log_1.error)(`Reg null scheme for class [${classType.name}]`);
            return;
        }
        const classObj = (0, Class_1.getUeClassByTsClass)(classType);
        this.SchemeMap.set(classObj, scheme);
    }
    GetSchemeByEntity(obj) {
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
        const classObj = (0, Class_1.getUeClassByTsClass)(classType);
        return this.GetSchemeByUeClass(classObj);
    }
    GetComponentClasses(obj) {
        const tsClassObj = (0, Class_1.getTsClassByUeClass)(obj.GetClass());
        return Public_1.entityRegistry.GetComponents(tsClassObj);
    }
    GenComponentsStateJson(classObjs) {
        const components = {};
        classObjs.forEach((classObj) => {
            const componentScheme = Index_1.componentRegistry.GetScheme(classObj.name);
            components[classObj.name] = componentScheme.CreateDefault();
        });
        const componentsState = {
            Components: components,
        };
        return JSON.stringify(componentsState);
    }
    GenData(obj) {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        const result = {
            ComponentsStateJson: '',
            Guid: obj.Guid,
        };
        if (!scheme) {
            return result;
        }
        for (const fieldName in scheme.Fields) {
            result[fieldName] = obj[fieldName];
        }
        result.ComponentsStateJson = obj.ComponentsStateJson;
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
        obj.ComponentsStateJson = pureData.ComponentsStateJson;
        obj.Guid = pureData.Guid;
        Object.assign(obj, pureData);
        // 让ue认为对象已经被修改
        UE.EditorOperations.MarkPackageDirty(obj);
    }
}
exports.editorEntityRegistry = new EditorEntityRegistry();
//# sourceMappingURL=EditorEntityRegistry.js.map