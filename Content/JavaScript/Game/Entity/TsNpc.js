"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Action_1 = require("../Flow/Action");
const TsActionRunnerComponent_1 = require("../Flow/TsActionRunnerComponent");
const TsFlowComponent_1 = require("../Flow/TsFlowComponent");
const TsEntity_1 = require("./TsEntity");
class TsNpc extends TsEntity_1.default {
    FlowJson;
    ActionRunner;
    Flow;
    ReceiveBeginPlay() {
        this.ActionRunner = this.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        this.Flow = this.GetComponentByTsClass(TsFlowComponent_1.default);
        this.Flow.Bind((0, Action_1.parseFlowInfo)(this.FlowJson));
    }
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsNpc.prototype, "FlowJson", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsNpc.prototype, "ActionRunner", void 0);
__decorate([
    (0, ue_1.no_blueprint)()
], TsNpc.prototype, "Flow", void 0);
exports.default = TsNpc;
//# sourceMappingURL=TsNpc.js.map