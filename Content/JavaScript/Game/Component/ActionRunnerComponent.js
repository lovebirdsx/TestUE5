"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionRunnerComponent = exports.ActionRunnerHandler = void 0;
const Log_1 = require("../../Common/Log");
const Interface_1 = require("../Interface");
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
            (0, Log_1.error)(`${this.Runner.Name} can not run actions again`);
            return;
        }
        this.MyIsRunning = true;
        const actions = this.Actions;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            // eslint-disable-next-line no-await-in-loop
            await this.Runner.ExecuteOne(action);
            if (!this.IsRunning) {
                break;
            }
        }
        this.MyIsRunning = false;
    }
}
exports.ActionRunnerHandler = ActionRunnerHandler;
class ActionRunnerComponent extends Interface_1.Component {
    ActionMap = new Map();
    RegisterActionFun(name, fun) {
        if (this.ActionMap.has(name)) {
            (0, Log_1.error)(`RegisterActionFun [${name}] already registered`);
        }
        this.ActionMap.set(name, fun);
    }
    SpawnHandler(actions) {
        return new ActionRunnerHandler(actions, this);
    }
    async ExecuteOne(action) {
        const globalActionsRunner = this.Context.GlobalActionsRunner;
        if (globalActionsRunner.ContainsAction(action.Name)) {
            await globalActionsRunner.ExecuteOne(action);
            return;
        }
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
exports.ActionRunnerComponent = ActionRunnerComponent;
//# sourceMappingURL=ActionRunnerComponent.js.map