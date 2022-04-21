"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionRegistry = void 0;
/* eslint-disable spellcheck/spell-checker */
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("./Action");
class ActionRegistry {
    ObjectSchemeMap;
    ActionNamesByfilter;
    AcitonObjectSchemeMap;
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
        result.set(Type_1.EActionFilter.FlowList, new Action_1.FlowListActionScheme());
        result.set(Type_1.EActionFilter.Talk, new Action_1.TalkActionScheme());
        result.set(Type_1.EActionFilter.Trigger, new Action_1.TriggerActionScheme());
        return result;
    }
    SetupObjectMap(objectSchemeMap) {
        this.ObjectSchemeMap = objectSchemeMap;
        this.ActionNamesByfilter = this.CreateActionNamesByfilter(objectSchemeMap);
        this.AcitonObjectSchemeMap = this.CreateDynamicObjectSchemeMap();
    }
    GetScheme(name) {
        const as = this.ObjectSchemeMap[name];
        if (!as) {
            (0, Log_1.error)(`No action scheme for ${name}`);
        }
        return as;
    }
    SpawnAction(name) {
        const as = this.ObjectSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(),
        };
    }
    SpawnDefaultAction(filter) {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = this.ObjectSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(),
        };
    }
    GetActionNames(filter) {
        return this.ActionNamesByfilter.get(filter);
    }
    FixAction(action, objectFilter) {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            Object.assign(action, this.SpawnDefaultAction(objectFilter || Type_1.EActionFilter.FlowList));
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
    GetActionScheme(objectFilter) {
        return this.AcitonObjectSchemeMap.get(objectFilter);
    }
}
exports.actionRegistry = new ActionRegistry();
//# sourceMappingURL=ActionRegistry.js.map