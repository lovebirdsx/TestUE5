"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalActionsRunner = void 0;
/* eslint-disable spellcheck/spell-checker */
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Common/Log");
const UeHelper_1 = require("../../Common/UeHelper");
class GlobalActionsRunner {
    ActionMap;
    Context;
    constructor() {
        this.ActionMap = new Map();
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('ShowMessage', this.ExecuteShowMessage.bind(this));
        this.ActionMap.set('SetFlowBoolOption', this.ExecuteSetFlowBoolOption.bind(this));
    }
    Init(context) {
        this.Context = context;
    }
    Exit() {
        //
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
    ExecuteShowMessage(actionInfo) {
        const action = actionInfo.Params;
        (0, UeHelper_1.msgbox)(action.Content);
    }
    async ExecuteWait(actionInfo) {
        const action = actionInfo.Params;
        return (0, Async_1.delay)(action.Time);
    }
    ExecuteSetFlowBoolOption(actionInfo) {
        const action = actionInfo.Params;
        switch (action.Option) {
            case 'DisableInput':
                if (action.Value) {
                    this.Context.Player.DisableInput(this.Context.PlayerController);
                }
                else {
                    this.Context.Player.EnableInput(this.Context.PlayerController);
                }
                break;
            default:
                (0, Log_1.error)(`Unsupported option type ${action.Option}`);
                break;
        }
    }
}
exports.GlobalActionsRunner = GlobalActionsRunner;
//# sourceMappingURL=GlobalActionsRunner.js.map