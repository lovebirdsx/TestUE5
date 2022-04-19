"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionRegistry = void 0;
/* eslint-disable spellcheck/spell-checker */
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
class ActionRegistry {
    ActionSchemeMap;
    ActionNamesByfilter;
    DynamicObjectSchemeMap;
    CreateActionNamesByfilter(actionSchemeMap) {
        const map = new Map();
        for (const typeName in actionSchemeMap) {
            const typeData = actionSchemeMap[typeName];
            typeData.Filters.forEach((filter) => {
                let names = map.get(filter);
                if (!names) {
                    names = [];
                    map.set(filter, names);
                }
                names.push(typeName);
            });
        }
        return map;
    }
    CreateDynamicObjectSchemeMap() {
        const result = new Map();
        Type_1.allObjectFilter.forEach((objectFilter) => {
            const type = (0, Type_1.createDynamicType)(objectFilter, {
                CreateDefault: (container) => {
                    const logAction = {
                        Level: 'Info',
                        Content: 'Hello World',
                    };
                    return {
                        Name: 'Log',
                        Params: logAction,
                    };
                },
                Meta: {
                    NewLine: true,
                },
            });
            result.set(objectFilter, type);
        });
        return result;
    }
    SetupActionMap(actionSchemeMap) {
        this.ActionSchemeMap = actionSchemeMap;
        this.ActionNamesByfilter = this.CreateActionNamesByfilter(actionSchemeMap);
        this.DynamicObjectSchemeMap = this.CreateDynamicObjectSchemeMap();
    }
    GetScheme(name) {
        const as = this.ActionSchemeMap[name];
        if (!as) {
            (0, Log_1.error)(`No action scheme for ${name}`);
        }
        return as;
    }
    SpawnAction(name) {
        const as = this.ActionSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(undefined),
        };
    }
    SpawnDefaultAction(filter) {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = this.ActionSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(undefined),
        };
    }
    GetActionNames(filter) {
        return this.ActionNamesByfilter.get(filter);
    }
    FixAction(action, objectFilter) {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            Object.assign(action, this.SpawnDefaultAction(objectFilter || Type_1.EObjectFilter.FlowList));
            return 'fixed';
        }
        const old = JSON.stringify(action.Params);
        const result = (0, Type_1.fixFileds)(action.Params, typeData.Fields);
        if (result === 'fixed') {
            (0, Log_1.log)(`Fix action [${action.Name}]: from ${old} => ${JSON.stringify(action.Params)}`);
        }
        return result;
    }
    CheckAction(action, errorMessages) {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            throw new Error(`Check action error: no scheme for name ${action.Name}`);
        }
        const errorMessages1 = [];
        (0, Type_1.checkFields)(action.Params, typeData.Fields, errorMessages1);
        errorMessages1.forEach((msg) => {
            errorMessages.push(`[${action.Name}]${msg}`);
        });
        return errorMessages1.length;
    }
    GetDynamicObjectScheme(objectFilter) {
        return this.DynamicObjectSchemeMap.get(objectFilter);
    }
}
exports.actionRegistry = new ActionRegistry();
//# sourceMappingURL=ActionRegistry.js.map