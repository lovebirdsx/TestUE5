"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playFlowScheme = exports.createDefaultPlayFlowFor = void 0;
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const FlowList_1 = require("../../../../Game/Common/Operations/FlowList");
function createDefaultPlayFlowFor(flowListName) {
    const flowList = FlowList_1.flowListOp.LoadByName(flowListName);
    const flow = flowList.Flows.length > 0 ? flowList.Flows[0] : null;
    const state = flow && flow.States.length > 0 ? flow.States[0] : null;
    return {
        FlowListName: flowListName,
        FlowId: flow ? flow.Id : 0,
        StateId: state ? state.Id : 0,
    };
}
exports.createDefaultPlayFlowFor = createDefaultPlayFlowFor;
function createDefaultPlayFlow() {
    if (FlowList_1.flowListOp.Names.length <= 0) {
        return {
            FlowListName: '',
            FlowId: 0,
            StateId: 0,
        };
    }
    return createDefaultPlayFlowFor(FlowList_1.flowListOp.Names[0]);
}
exports.playFlowScheme = (0, Type_1.createObjectScheme)({
    FlowListName: null,
    FlowId: null,
    StateId: null,
}, {
    Tip: '播放流程配置文件中的某个流程',
    Filters: [],
    RenderType: 'custom',
    CreateDefault: createDefaultPlayFlow,
});
//# sourceMappingURL=Flow.js.map