"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playFlowScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const ConfigFile_1 = require("../../../FlowEditor/ConfigFile");
const CommonComponent_1 = require("../../Component/CommonComponent");
const Flow_1 = require("../../Operations/Flow");
const FlowList_1 = require("../../Operations/FlowList");
const Type_1 = require("../Type");
function renderPlayFlow(props) {
    const playFlow = props.Value;
    if (playFlow.FlowListName) {
        const flowList = FlowList_1.flowListOp.LoadByName(playFlow.FlowListName);
        const flowNames = FlowList_1.flowListOp.GetFlowNames(flowList);
        const flow = flowList.Flows.find((flow) => flow.Id === playFlow.FlowId);
        const stateNames = Flow_1.flowOp.GetStateNames(flow);
        const state = Flow_1.flowOp.GetState(flow, playFlow.StateId);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            props.PrefixElement,
            React.createElement(CommonComponent_1.List, { Items: FlowList_1.flowListOp.Names, Selected: playFlow.FlowListName, OnSelectChanged: function (flowListName) {
                    const newPlayFlow = FlowList_1.flowListOp.CreateDefaultPlayFlowFor(flowListName);
                    props.OnModify(newPlayFlow, 'normal');
                }, Tip: `选择剧情文件` }),
            React.createElement(CommonComponent_1.List, { Items: flowNames, Selected: flow ? flow.Name : '', OnSelectChanged: function (flowName) {
                    const newFlow = flowList.Flows.find((flow) => flow.Name === flowName);
                    const newState = newFlow && newFlow.States.length > 0 ? newFlow.States[0] : null;
                    const newPlayFlow = {
                        FlowListName: playFlow.FlowListName,
                        FlowId: newFlow ? newFlow.Id : 0,
                        StateId: newState ? newState.Id : 0,
                    };
                    props.OnModify(newPlayFlow, 'normal');
                }, Tip: `选择剧情` }),
            React.createElement(CommonComponent_1.List, { Items: stateNames, Selected: state ? state.Name : '', OnSelectChanged: function (stateName) {
                    const newState = flow.States.find((state) => state.Name === stateName);
                    const newPlayFlow = {
                        FlowListName: playFlow.FlowListName,
                        FlowId: playFlow.FlowId,
                        StateId: newState ? newState.Id : 0,
                    };
                    props.OnModify(newPlayFlow, 'normal');
                }, Tip: `选择状态` })));
    }
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.Text, { Text: `No flow list file at [${ConfigFile_1.ConfigFile.FlowListDir}]` })));
}
function createDefaultPlayFlow(container) {
    return FlowList_1.flowListOp.CreateDefaultPlayFlow();
}
exports.playFlowScheme = (0, Type_1.createObjectScheme)({
    FlowListName: null,
    FlowId: null,
    StateId: null,
}, {
    Meta: {
        Tip: '播放流程配置文件中的某个流程',
    },
    Render: renderPlayFlow,
    CreateDefault: createDefaultPlayFlow,
});
//# sourceMappingURL=Flow.js.map