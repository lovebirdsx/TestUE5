"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npcScheme = exports.flowJsonScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Action_1 = require("../../../../Game/Flow/Action");
const CommonComponent_1 = require("../../Component/CommonComponent");
const Flow_1 = require("../../Component/Flow");
const Log_1 = require("../../Log");
const Type_1 = require("../Type");
function renderFlowJson(name, props) {
    const flow = (0, Action_1.parseFlowInfo)(props.Value);
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.Text, { Text: name }),
        React.createElement(CommonComponent_1.Btn, { Text: 'R', OnClick: () => {
                props.OnModify('', 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'P', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    return (React.createElement(react_umg_1.VerticalBox, null,
        prefixElement,
        React.createElement(Flow_1.Flow, { Flow: flow, ObjectFilter: Type_1.EObjectFilter.Npc, OnModify: (newFlow, type) => {
                props.OnModify(JSON.stringify(newFlow), type);
            } })));
}
exports.flowJsonScheme = (0, Type_1.createStringScheme)({
    Render: (props) => renderFlowJson('FlowConfig', props),
    Meta: {
        HideName: true,
        NewLine: true,
    },
});
exports.npcScheme = (0, Type_1.createObjectSchemeForUeClass)({
    FlowJson: exports.flowJsonScheme,
});
//# sourceMappingURL=Npc.js.map