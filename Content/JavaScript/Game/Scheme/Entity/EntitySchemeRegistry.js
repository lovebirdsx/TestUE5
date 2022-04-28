"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entitySchemeRegistry = void 0;
/* eslint-disable spellcheck/spell-checker */
const UE = require("ue");
const Class_1 = require("../../../Common/Class");
const Log_1 = require("../../../Common/Log");
const EntityRegistry_1 = require("../../Entity/EntityRegistry");
class EntitySchemeRegistry {
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
            throw new Error(`Can not find scheme for ue class obj ${classObj.GetName()}`);
        }
        return result;
    }
    GetScheme(classType) {
        const classObj = (0, Class_1.getUeClassByTsClass)(classType);
        return this.GetSchemeByUeClass(classObj);
    }
    GetComponentClasses(obj) {
        const tsClassObj = (0, Class_1.getTsClassByUeClass)(obj.GetClass());
        return EntityRegistry_1.entityRegistry.GetComponents(tsClassObj);
    }
    GenData(obj) {
        const scheme = this.GetSchemeByUeClass(obj.GetClass());
        if (!scheme) {
            throw new Error(`No scheme for ${obj ? obj.GetName() : 'undefined'}`);
        }
        const result = {
            // 转换为Object,方便查看序列化之后的字符串
            ComponentsStateJson: obj.ComponentsStateJson
                ? JSON.parse(obj.ComponentsStateJson)
                : {},
            Guid: obj.Guid,
        };
        for (const fieldName in scheme.Fields) {
            const fieldScheme = scheme.Fields[fieldName];
            if (!fieldScheme) {
                continue;
            }
            // Json字段特殊处理,是为了方便查看和对比序列化之后的字符串
            if (fieldScheme.IsJson) {
                let fileValue = obj[fieldName];
                if (!fileValue) {
                    fileValue = fieldScheme.CreateDefault();
                }
                result[fieldName] = JSON.parse(fileValue);
            }
            else {
                result[fieldName] = obj[fieldName];
            }
        }
        return result;
    }
    ApplyData(pureData, obj) {
        const classObj = obj.GetClass();
        const scheme = this.GetSchemeByUeClass(classObj);
        for (const fieldName in scheme.Fields) {
            const fieldScheme = scheme.Fields[fieldName];
            if (!fieldScheme) {
                continue;
            }
            if (pureData[fieldName] === undefined) {
                (0, Log_1.error)(`pureData for [${classObj.GetName()}.${fieldName}] is undefined`);
            }
            // Json字段特殊处理,是为了方便查看和对比序列化之后的字符串
            if (fieldScheme.IsJson) {
                const fieldValue = pureData[fieldName];
                obj[fieldName] = JSON.stringify(fieldValue, null, 2);
            }
            else {
                obj[fieldName] = pureData[fieldName];
            }
        }
        obj.Guid = pureData.Guid;
        // pureData中存储的是对象,所以要转换一次
        obj.ComponentsStateJson = JSON.stringify(pureData.ComponentsStateJson, null, 2);
        // 让ue认为对象已经被修改
        UE.EditorOperations.MarkPackageDirty(obj);
    }
}
exports.entitySchemeRegistry = new EntitySchemeRegistry();
//# sourceMappingURL=EntitySchemeRegistry.js.map