"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowOp = void 0;
class FlowOp {
    GetState(flow, stateId) {
        return flow.States.find((state) => state.Id === stateId);
    }
    GetStateNames(flow) {
        return flow.States.map((state) => state.Name);
    }
}
exports.flowOp = new FlowOp();
//# sourceMappingURL=Flow.js.map