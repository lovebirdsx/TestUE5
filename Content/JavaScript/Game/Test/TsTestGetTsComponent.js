"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../../Editor/Common/Log");
const TsEntity_1 = require("../Entity/TsEntity");
const TsActionRunnerComponent_1 = require("../Flow/TsActionRunnerComponent");
const TsFlowComponent_1 = require("../Flow/TsFlowComponent");
class TsTestGetTsComponent extends TsEntity_1.default {
    ReceiveBeginPlay() {
        (0, Log_1.log)('TsTestGetTsComponent =====');
        const actionRunner = this.GetComponent(TsActionRunnerComponent_1.default);
        (0, Log_1.log)(`actionRunner name is ${actionRunner.GetName()}`);
        const flow = this.GetComponent(TsFlowComponent_1.default);
        (0, Log_1.log)(`flow name is ${flow.GetName()}`);
    }
}
exports.default = TsTestGetTsComponent;
//# sourceMappingURL=TsTestGetTsComponent.js.map