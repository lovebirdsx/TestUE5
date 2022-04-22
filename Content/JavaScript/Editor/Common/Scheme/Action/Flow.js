"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playFlowScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const Type_1 = require("../../../../Common/Type");
const Config_1 = require("../../../../Game/Common/Config");
const Flow_1 = require("../../../../Game/Common/Operations/Flow");
const FlowList_1 = require("../../../../Game/Common/Operations/FlowList");
const ConfigFile_1 = require("../../../FlowEditor/ConfigFile");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Util_1 = require("../../Util");
function openFlowEditor(flowName) {
    const configFile = new ConfigFile_1.ConfigFile();
    configFile.Load();
    configFile.FlowConfigPath = FlowList_1.flowListOp.GetPath(flowName);
    configFile.Save();
    (0, Util_1.sendEditorCommand)('RestartFlowEditor');
}
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
function renderPlayFlow(props) {
    const playFlow = props.Value;
    if (FlowList_1.flowListOp.Names.length > 0) {
        if (!FlowList_1.flowListOp.Names.includes(playFlow.FlowListName)) {
            return (React.createElement(react_umg_1.HorizontalBox, null,
                props.PrefixElement,
                React.createElement(CommonComponent_1.List, { Items: FlowList_1.flowListOp.Names, Selected: playFlow.FlowListName, OnSelectChanged: function (flowListName) {
                        const newPlayFlow = createDefaultPlayFlowFor(flowListName);
                        props.OnModify(newPlayFlow, 'normal');
                    }, Tip: `选择剧情文件` })));
        }
        const flowList = FlowList_1.flowListOp.LoadByName(playFlow.FlowListName);
        const flowNames = FlowList_1.flowListOp.GetFlowNames(flowList);
        const flow = flowList.Flows.find((flow) => flow.Id === playFlow.FlowId);
        const stateNames = Flow_1.flowOp.GetStateNames(flow);
        const state = Flow_1.flowOp.GetState(flow, playFlow.StateId);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            props.PrefixElement,
            React.createElement(CommonComponent_1.List, { Items: FlowList_1.flowListOp.Names, Selected: playFlow.FlowListName, OnSelectChanged: function (flowListName) {
                    const newPlayFlow = createDefaultPlayFlowFor(flowListName);
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
                }, Tip: `选择状态` }),
            React.createElement(CommonComponent_1.Btn, { Text: '⊙', OnClick: () => {
                    openFlowEditor(playFlow.FlowListName);
                }, Tip: '打开流程配置' })));
    }
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.Text, { Text: `目录:[${Config_1.gameConfig.FlowListDir}]\n不存在流程配置文件(前缀为[${Config_1.gameConfig.FlowListPrefix}])` })));
}
exports.playFlowScheme = (0, Type_1.createObjectScheme)({
    FlowListName: null,
    FlowId: null,
    StateId: null,
}, {
    Tip: '播放流程配置文件中的某个流程',
    Render: renderPlayFlow,
    Filters: [],
    CreateDefault: createDefaultPlayFlow,
});
//# sourceMappingURL=Flow.js.map