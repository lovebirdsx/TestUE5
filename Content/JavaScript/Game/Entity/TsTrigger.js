"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-void */
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
// import TsActionRunnerComponent, { ActionRunnerHandler } from '../Flow/TsActionRunnerComponent';
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
class TsTrigger extends TsEntity_1.default {
    // @cpp: int
    MaxTriggerTimes;
    TriggerActionsJson;
    // @no-blueprint
    TriggerTimes = 0;
    // @no-blueprint
    // private ActionRunner: TsActionRunnerComponent;
    // @no-blueprint
    // private RunnerHandler: ActionRunnerHandler;
    ReceiveBeginPlay() {
        this.TriggerTimes = 0;
        // this.ActionRunner = this.GetComponent(TsActionRunnerComponent);
        // this.RunnerHandler = this.ActionRunner.SpawnHandlerByJson(this.TriggerActionsJson);
    }
    // @no-blueprint
    DoTrigger() {
        this.TriggerTimes++;
        // void this.RunnerHandler.Execute();
        (0, Log_1.log)(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }
    ReceiveActorBeginOverlap(other) {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }
        // if (this.RunnerHandler.IsRunning) {
        //     return;
        // }
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
exports.default = TsTrigger;
//# sourceMappingURL=TsTrigger.js.map