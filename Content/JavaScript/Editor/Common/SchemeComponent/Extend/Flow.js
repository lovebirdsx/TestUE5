"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderActionJson = exports.RenderPlayFlowJson = exports.RenderPlayFlow = exports.RenderStateId = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../../../Common/Log");
const Config_1 = require("../../../../Game/Common/Config");
const Flow_1 = require("../../../../Game/Common/Operations/Flow");
const FlowList_1 = require("../../../../Game/Common/Operations/FlowList");
const Action_1 = require("../../../../Game/Flow/Action");
const Flow_2 = require("../../../../Game/Scheme/Action/Flow");
const TriggerScheme_1 = require("../../../../Game/Scheme/Entity/TriggerScheme");
const ConfigFile_1 = require("../../../FlowEditor/ConfigFile");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Util_1 = require("../../Util");
const Any_1 = require("../Basic/Any");
const Context_1 = require("../Context");
const DEFAULT_STATE_ID = 1;
function RenderStateId(props) {
    return (React.createElement(Context_1.flowContext.Consumer, null, (value) => {
        const stateNames = value.States.map((e) => e.Name);
        const selectedState = value.States.find((e) => e.Id === props.Value);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            props.PrefixElement,
            React.createElement(CommonComponent_1.List, { Items: stateNames, Selected: selectedState ? selectedState.Name : '', Tip: "\u76EE\u6807\u72B6\u6001", OnSelectChanged: (selectedStateName) => {
                    const state = value.States.find((e) => e.Name === selectedStateName);
                    props.OnModify(state ? state.Id : DEFAULT_STATE_ID, 'normal');
                } })));
    }));
}
exports.RenderStateId = RenderStateId;
function openFlowEditor(flowName) {
    const configFile = new ConfigFile_1.ConfigFile();
    configFile.Load();
    configFile.FlowConfigPath = FlowList_1.flowListOp.GetPath(flowName);
    configFile.Save();
    (0, Util_1.sendEditorCommand)('RestartFlowEditor');
}
function RenderPlayFlow(props) {
    const playFlow = props.Value;
    if (FlowList_1.flowListOp.Names.length > 0) {
        if (!FlowList_1.flowListOp.Names.includes(playFlow.FlowListName)) {
            return (React.createElement(react_umg_1.HorizontalBox, null,
                props.PrefixElement,
                React.createElement(CommonComponent_1.List, { Items: FlowList_1.flowListOp.Names, Selected: playFlow.FlowListName, OnSelectChanged: function (flowListName) {
                        const newPlayFlow = (0, Flow_2.createDefaultPlayFlowFor)(flowListName);
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
                    const newPlayFlow = (0, Flow_2.createDefaultPlayFlowFor)(flowListName);
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
exports.RenderPlayFlow = RenderPlayFlow;
function RenderPlayFlowJson(props) {
    const playFlow = (0, Action_1.parsePlayFlow)(props.Value);
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.Btn, { Text: 'R', OnClick: () => {
                props.OnModify('', 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'P', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    // 注意下面只能用Any来渲染,Obj不能正确处理自定义Render的情况
    return (React.createElement(react_umg_1.VerticalBox, null,
        prefixElement,
        React.createElement(Any_1.Any, { Value: playFlow, Scheme: Flow_2.playFlowScheme, OnModify: (newFlow, type) => {
                props.OnModify(JSON.stringify(newFlow), type);
            } })));
}
exports.RenderPlayFlowJson = RenderPlayFlowJson;
// ActionJson本来是Json字符串,但PureData中处理的时候实际上是该字符串被序列化之后的对象
// 所以通过React渲染时,需要直接把其当成ITriggerActions来处理
function RenderActionJson(props) {
    const actions = props.Value;
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.Text, { Text: 'TriggerActions' }),
        React.createElement(CommonComponent_1.Btn, { Text: 'Reset', Tip: '重置', OnClick: () => {
                props.OnModify(TriggerScheme_1.actionsScheme.CreateDefault(), 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'Log', Tip: '输出动作Json', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    return (React.createElement(Any_1.Any, { PrefixElement: prefixElement, Value: actions, Scheme: TriggerScheme_1.actionsScheme, OnModify: (obj, type) => {
            props.OnModify(obj, type);
        } }));
}
exports.RenderActionJson = RenderActionJson;
//# sourceMappingURL=Flow.js.map