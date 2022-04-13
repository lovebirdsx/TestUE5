"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Editor/Common/Log");
const Action_1 = require("./Action");
class TsActionRunnerComponent extends ue_1.ActorComponent {
    // @no-blueprint
    IsRunning;
    // @no-blueprint
    ActionMap;
    Constructor() {
        const owner = this.GetOwner();
        this.ActionMap = new Map();
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        (0, Log_1.log)(`ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`);
    }
    // @no-blueprint
    RegisterActionFun(name, fun) {
        if (this.ActionMap.has(name)) {
            (0, Log_1.error)(`RegisterActionFun [${name}] already registered`);
        }
        this.ActionMap.set(name, fun);
    }
    // @no-blueprint
    ExecuteJson(json) {
        const triggerActions = (0, Action_1.parseTriggerActionsJson)(json);
        void this.Execute(triggerActions.Actions);
    }
    // @no-blueprint
    async Execute(actions) {
        if (this.IsRunning) {
            (0, Log_1.error)(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }
        this.IsRunning = true;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }
        this.IsRunning = false;
    }
    // @no-blueprint
    Stop() {
        this.IsRunning = false;
    }
    // @no-blueprint
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
    // @no-blueprint
    ExecuteLog(action) {
        const logAction = action.Params;
        switch (logAction.Level) {
            case 'Info':
                (0, Log_1.log)(logAction.Content);
                break;
            case 'Warn':
                (0, Log_1.warn)(logAction.Content);
                break;
            case 'Error':
                (0, Log_1.error)(logAction.Content);
                break;
            default:
                break;
        }
    }
    // @no-blueprint
    async ExecuteWait(action) {
        const waitAction = action.Params;
        return (0, Async_1.delay)(waitAction.Time * 1000);
    }
}
exports.default = TsActionRunnerComponent;
//# sourceMappingURL=TsActionRunnerComponent.js.map