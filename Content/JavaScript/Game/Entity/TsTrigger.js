"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
const TsActionRunner_1 = require("../Flow/TsActionRunner");
const TsPlayer_1 = require("../Player/TsPlayer");
const TsEntity_1 = require("./TsEntity");
class TsTrigger extends TsEntity_1.default {
    // @cpp: int
    MaxTriggerTimes;
    TriggerActionsJson;
    TriggerTimes = 0;
    ActionRunner;
    ReceiveBeginPlay() {
        super.ReceiveBeginPlay();
        this.TriggerTimes = 0;
        this.ActionRunner = this.GetComponentByTsClass(TsActionRunner_1.default);
        if (!this.ActionRunner) {
            (0, Log_1.error)('TSTriggerEntity need set actionRunner');
        }
    }
    DoTrigger() {
        this.TriggerTimes++;
        this.ActionRunner.ExecuteJson(this.TriggerActionsJson);
        (0, Log_1.log)(`DoTrigger ${this.TriggerTimes} / ${this.MaxTriggerTimes}`);
    }
    ReceiveActorBeginOverlap(other) {
        if (this.TriggerTimes >= this.MaxTriggerTimes) {
            return;
        }
        if (this.ActionRunner.IsRunning) {
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
__decorate([
    (0, ue_1.no_blueprint)()
], TsTrigger.prototype, "TriggerTimes", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsTrigger.prototype, "ActionRunner", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsTrigger.prototype, "DoTrigger", null);
exports.default = TsTrigger;
//# sourceMappingURL=TsTrigger.js.map