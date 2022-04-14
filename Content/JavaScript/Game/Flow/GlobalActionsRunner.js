"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalActionsRunner = void 0;
/* eslint-disable spellcheck/spell-checker */
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Editor/Common/Log");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsPlayerController_1 = require("../Player/TsPlayerController");
const MS_PER_SECOND = 1000;
class GlobalActionsRunner {
    ActionMap;
    constructor() {
        this.ActionMap = new Map();
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('SetFlowBoolOption', this.ExecuteSetFlowBoolOption.bind(this));
    }
    ContainsAction(actionType) {
        return this.ActionMap.has(actionType);
    }
    async ExecuteOne(action) {
        const actionFun = this.ActionMap.get(action.Name);
        if (!actionFun) {
            (0, Log_1.error)(`No action for action type [${action.Name}]`);
            return;
        }
        if (action.Async) {
            actionFun(action);
        }
        else {
            await actionFun(action);
        }
    }
    ExecuteLog(actionInfo) {
        const action = actionInfo.Params;
        switch (action.Level) {
            case 'Info':
                (0, Log_1.log)(action.Content);
                break;
            case 'Warn':
                (0, Log_1.warn)(action.Content);
                break;
            case 'Error':
                (0, Log_1.error)(action.Content);
                break;
            default:
                break;
        }
    }
    async ExecuteWait(actionInfo) {
        const action = actionInfo.Params;
        return (0, Async_1.delay)(action.Time * MS_PER_SECOND);
    }
    ExecuteSetFlowBoolOption(actionInfo) {
        const action = actionInfo.Params;
        switch (action.Option) {
            case 'DisableInput':
                {
                    const playerController = TsPlayerController_1.default.Instance;
                    if (action.Value) {
                        TsPlayer_1.default.Instance.DisableInput(playerController);
                    }
                    else {
                        TsPlayer_1.default.Instance.EnableInput(playerController);
                    }
                }
                break;
            default:
                (0, Log_1.error)(`Unsupported option type ${action.Option}`);
                break;
        }
    }
}
exports.globalActionsRunner = new GlobalActionsRunner();
//# sourceMappingURL=GlobalActionsRunner.js.map