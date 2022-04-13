"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
    IsRunning;
    ActionMap;
    Constructor() {
        const owner = this.GetOwner();
        this.ActionMap = new Map();
        this.ActionMap.set('Wait', this.ExecuteWait.bind(this));
        this.ActionMap.set('Log', this.ExecuteLog.bind(this));
        (0, Log_1.log)(`ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`);
    }
    ExecuteJson(json) {
        const triggerActions = (0, Action_1.parseTriggerActionsJson)(json);
        void this.Execute(triggerActions.Actions);
    }
    async Execute(actions) {
        if (this.IsRunning) {
            (0, Log_1.error)(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }
        this.IsRunning = true;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            await this.ExecuteOne(action);
        }
        this.IsRunning = false;
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
    async ExecuteWait(action) {
        const waitAction = action.Params;
        return (0, Async_1.delay)(waitAction.Time * 1000);
    }
}
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "IsRunning", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "ActionMap", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "ExecuteJson", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "Execute", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "ExecuteOne", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "ExecuteLog", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsActionRunnerComponent.prototype, "ExecuteWait", null);
exports.default = TsActionRunnerComponent;
//# sourceMappingURL=TsActionRunnerComponent.js.map