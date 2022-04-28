"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRunnerHandler = void 0;
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-magic-numbers */
const Log_1 = require("../../Common/Log");
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
        // if (globalActionsRunner.ContainsAction(action.Name)) {
        //     await globalActionsRunner.ExecuteOne(action);
        //     return;
        // }
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
}
exports.default = TsActionRunnerComponent;
//# sourceMappingURL=TsActionRunnerComponent.js.map