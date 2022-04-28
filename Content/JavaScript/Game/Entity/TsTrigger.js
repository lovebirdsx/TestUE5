"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsTrigger = exports.triggerComponentClasses = void 0;
/* eslint-disable no-void */
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const ActionRunnerComponent_1 = require("../Component/ActionRunnerComponent");
const StateComponent_1 = require("../Component/StateComponent");
const Action_1 = require("../Flow/Action");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
exports.triggerComponentClasses = [StateComponent_1.default, ActionRunnerComponent_1.ActionRunnerComponent];
class TsTrigger extends TsEntity_1.default {
    // @cpp: int
    MaxTriggerTimes;
    TriggerActionsJson;
    // @no-blueprint
    TriggerTimes = 0;
    // @no-blueprint
    ActonRunner;
    // @no-blueprint
    Handler;
    // @no-blueprint
    State;
    // @no-blueprint
    GetComponentClasses() {
        return exports.triggerComponentClasses;
    }
    // @no-blueprint
    Init(context) {
        super.Init(context);
        this.ActonRunner = this.Entity.GetComponent(ActionRunnerComponent_1.ActionRunnerComponent);
        this.State = this.Entity.GetComponent(StateComponent_1.default);
        this.Handler = this.ActonRunner.SpawnHandler((0, Action_1.parseTriggerActionsJson)(this.TriggerActionsJson).Actions);
    }
    Load() {
        super.Load();
        this.TriggerTimes = this.State.GetState('TriggerTimes') || 0;
    }
    // @no-blueprint
    DoTrigger() {
        this.TriggerTimes++;
        this.State.SetState('TriggerTimes', this.TriggerTimes);
        void this.Handler.Execute();
        (0, Log_1.log)(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }
    ReceiveActorBeginOverlap(other) {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }
        if (this.Handler.IsRunning) {
            return;
        }
        if (!(other instanceof TsPlayer_1.default)) {
            return;
        }
        this.DoTrigger();
    }
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsTrigger.prototype, "MaxTriggerTimes", void 0);
__decorate([
    (0, ue_1.edit_on_instance)()
], TsTrigger.prototype, "TriggerActionsJson", void 0);
exports.TsTrigger = TsTrigger;
exports.default = TsTrigger;
//# sourceMappingURL=TsTrigger.js.map