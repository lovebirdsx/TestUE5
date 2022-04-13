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
const TsActionRunnerComponent_1 = require("./TsActionRunnerComponent");
class TsFlowComponent extends ue_1.ActorComponent {
    ReceiveBeginPlay() {
        const entity = this.GetOwner();
        const actionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        actionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        actionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
    }
    ExecuteChangeState(action) {
        const changeStateAction = action.Params;
        this.ChangeState(changeStateAction.StateId);
    }
    ExecuteFinishState(action) {
        this.FinishState(action.Params);
    }
    ChangeState(id) {
        (0, Log_1.log)(`${this.GetName()} state change to [${id}]`);
    }
    FinishState(action) {
        (0, Log_1.log)(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
    }
}
__decorate([
    (0, ue_1.no_blueprint)()
], TsFlowComponent.prototype, "ExecuteChangeState", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsFlowComponent.prototype, "ExecuteFinishState", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsFlowComponent.prototype, "ChangeState", null);
__decorate([
    (0, ue_1.no_blueprint)()
], TsFlowComponent.prototype, "FinishState", null);
exports.default = TsFlowComponent;
//# sourceMappingURL=TsFlowComponent.js.map