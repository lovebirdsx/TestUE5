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
const Log_1 = require("../Log");
const JumpTalk_1 = require("./JumpTalk");
const Misc_1 = require("./Misc");
const PlotNode_1 = require("./PlotNode");
const Sequence_1 = require("./Sequence");
const ShowTalk_1 = require("./ShowTalk");
const State_1 = require("./State");
const Type_1 = require("./Type");
__exportStar(require("./Type"), exports);
const actionSchemeMap = {
    ChangeState: State_1.changeStateScheme,
    ChangeRandomState: State_1.changeRandomStateScheme,
    FinishState: State_1.finishStateScheme,
    JumpTalk: JumpTalk_1.jumpTalkScheme,
    Log: Misc_1.logScheme,
    PlaySequenceData: Sequence_1.playSequenceDataScheme,
    SetCameraMode: PlotNode_1.setCameraModeScheme,
    SetFlowBoolOption: PlotNode_1.setFlowBoolOptionScheme,
    SetPlotMode: PlotNode_1.setPlotModeScheme,
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
const actionNamesByfilter = createActionNamesByfilter();
function getScheme(name) {
    const as = actionSchemeMap[name];
    if (!as) {
        (0, Log_1.error)(`No action scheme for ${name}`);
    }
    return as;
}
function spawnAction(name) {
    const as = actionSchemeMap[name];
    return {
        Name: name,
        Params: as.CreateDefault(undefined),
    };
}
function spawnDefaultAction(filter) {
    const actionName = actionNamesByfilter.get(filter || 'normal')[0];
    const as = actionSchemeMap[actionName];
    return {
        Name: actionName,
        Params: as.CreateDefault(undefined),
    };
}
function getActionNames(filter) {
    return actionNamesByfilter.get(filter || 'normal');
}
function isFolderAble(scheme) {
    return scheme.Meta.NewLine;
}
function fixAction(action) {
    const typeData = getScheme(action.Name);
    if (!typeData) {
        Object.assign(action, spawnDefaultAction('normal'));
        return 'fixed';
    }
    const old = JSON.stringify(action.Params);
    const result = (0, Type_1.fixFileds)(action.Params, typeData.Fields);
    if (result === 'fixed') {
        (0, Log_1.log)(`Fix action [${action.Name}]: from ${old} => ${JSON.stringify(action.Params)}`);
    }
    return result;
}
function getNormalActionScheme() {
    return Type_1.normalActionScheme;
}
exports.scheme = {
    GetScheme: getScheme,
    GetActionNames: getActionNames,
    SpawnAction: spawnAction,
    SpawnDefaultAction: spawnDefaultAction,
    IsFolderAble: isFolderAble,
    FixAction: fixAction,
    GetNormalActionScheme: getNormalActionScheme,
};
//# sourceMappingURL=index.js.map