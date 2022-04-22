"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npcScheme = exports.playFlowJsonScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Public_1 = require("../../SchemeComponent/Basic/Public");
const Public_2 = require("../Action/Public");
function renderFlowJson(name, props) {
    const playFlow = (0, Action_1.parsePlayFlow)(props.Value);
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.Text, { Text: name }),
        React.createElement(CommonComponent_1.Btn, { Text: 'R', OnClick: () => {
                props.OnModify('', 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'P', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    // 注意下面只能用Any来渲染,Obj不能正确处理自定义Render的情况
    return (React.createElement(react_umg_1.VerticalBox, null,
        prefixElement,
        React.createElement(Public_1.Any, { Value: playFlow, Scheme: Public_2.playFlowScheme, OnModify: (newFlow, type) => {
                props.OnModify(JSON.stringify(newFlow), type);
            } })));
}
exports.playFlowJsonScheme = (0, Type_1.createStringScheme)({
    NewLine: true,
    Render: (props) => renderFlowJson('Flow', props),
    CreateDefault: () => {
        return JSON.stringify((0, Action_1.parsePlayFlow)(''));
    },
});
exports.npcScheme = Type_1.emptyObjectScheme;
//# sourceMappingURL=NpcScheme.js.map