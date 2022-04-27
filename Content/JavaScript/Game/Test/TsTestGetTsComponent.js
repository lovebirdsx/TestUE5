"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../../Common/Log");
const Public_1 = require("../Entity/Public");
// import TsActionRunnerComponent from '../Flow/TsActionRunnerComponent';
// import TsFlowComponent from '../Flow/TsFlowComponent';
class TsTestGetTsComponent extends Public_1.TsEntity {
    ReceiveBeginPlay() {
        (0, Log_1.log)('TsTestGetTsComponent =====');
        // const actionRunner = this.GetComponent(TsActionRunnerComponent);
        // log(`actionRunner name is ${actionRunner.GetName()}`);
        // const flow = this.GetComponent(TsFlowComponent);
        // log(`flow name is ${flow.GetName()}`);
    }
}
exports.default = TsTestGetTsComponent;
//# sourceMappingURL=TsTestGetTsComponent.js.map