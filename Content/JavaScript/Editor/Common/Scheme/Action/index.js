"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheme = void 0;
const Log_1 = require("../../Log");
const Type_1 = require("../Type");
const Flow_1 = require("./Flow");
const JumpTalk_1 = require("./JumpTalk");
const Misc_1 = require("./Misc");
const PlotNode_1 = require("./PlotNode");
const Sequence_1 = require("./Sequence");
const ShowTalk_1 = require("./ShowTalk");
const ShowText_1 = require("./ShowText");
const State_1 = require("./State");
__exportStar(require("../Type"), exports);
const actionSchemeMap = {
    ChangeState: State_1.changeStateScheme,
    ChangeRandomState: State_1.changeRandomStateScheme,
    FinishTalk: JumpTalk_1.finishTalkScheme,
    FinishState: State_1.finishStateScheme,
    JumpTalk: JumpTalk_1.jumpTalkScheme,
    Log: Misc_1.logScheme,
    PlayFlow: Flow_1.playFlowScheme,
    PlaySequenceData: Sequence_1.playSequenceDataScheme,
    SetCameraMode: PlotNode_1.setCameraModeScheme,
    SetFlowBoolOption: PlotNode_1.setFlowBoolOptionScheme,
    SetPlotMode: PlotNode_1.setPlotModeScheme,
    ShowCenterText: ShowText_1.showCenterTextScheme,
    ShowMessage: Misc_1.showMssageScheme,
    ShowOption: ShowTalk_1.showOptionScheme,
    ShowTalk: ShowTalk_1.showTalkScheme,
    Wait: Misc_1.waitScheme,
};
function createActionNamesByfilter() {
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
function createDynamicObjectSchemeMap() {
    const result = new Map();
    Type_1.allObjectFilter.forEach((objectFilter) => {
        const type = (0, Type_1.createDynamicType)(objectFilter, {
            Meta: {
                NewLine: true,
            },
        });
        result.set(objectFilter, type);
    });
    return result;
}
class Scheme {
    ActionNamesByfilter;
    DynamicObjectSchemeMap;
    constructor() {
        this.ActionNamesByfilter = createActionNamesByfilter();
        this.DynamicObjectSchemeMap = createDynamicObjectSchemeMap();
    }
    GetScheme(name) {
        const as = actionSchemeMap[name];
        if (!as) {
            (0, Log_1.error)(`No action scheme for ${name}`);
        }
        return as;
    }
    SpawnAction(name) {
        const as = actionSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(undefined),
        };
    }
    SpawnDefaultAction(filter) {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = actionSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(undefined),
        };
    }
    GetActionNames(filter) {
        return this.ActionNamesByfilter.get(filter);
    }
    IsFolderAble(scheme) {
        return scheme.Meta.NewLine;
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
exports.scheme = new Scheme();
//# sourceMappingURL=index.js.map