"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRunnerHandler = void 0;
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Editor/Common/Log");
const TsEntityComponent_1 = require("../Entity/TsEntityComponent");
const Action_1 = require("./Action");
class ActionRunnerHandler {
    MyIsRunning;
    Actions;
    Runner;
    constructor(actions, runner) {
        this.MyIsRunning = false;
        this.Actions = actions;
        this.Runner = runner;
    }
    get IsRunning() {
        return this.MyIsRunning;
    }
    Stop() {
        this.MyIsRunning = false;
    }
    async Execute() {
        if (this.IsRunning) {
            (0, Log_1.error)(`${this.Runner.GetName()} can not run actions again`);
            return;
        }
        this.MyIsRunning = true;
        const actions = this.Actions;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.Runner.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }
        this.MyIsRunning = false;
    }
}
exports.ActionRunnerHandler = ActionRunnerHandler;
class TsActionRunnerComponent extends TsEntityComponent_1.default {
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
    SpawnHandlerByJson(json) {
        const triggerActions = (0, Action_1.parseTriggerActionsJson)(json);
        return this.SpawnHandler(triggerActions.Actions);
    }
    // @no-blueprint
    SpawnHandler(actions) {
        return new ActionRunnerHandler(actions, this);
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