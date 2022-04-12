"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheme = exports.actionsJsonScheme = exports.actionsScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Action_1 = require("../../../../Game/Flow/Action");
const CommonComponent_1 = require("../../Component/CommonComponent");
const Obj_1 = require("../../Component/Obj");
const Log_1 = require("../../Log");
const Action_2 = require("../Action");
exports.actionsScheme = (0, Action_2.createObjectScheme)({
    Actions: (0, Action_2.createArrayScheme)({
        Element: Action_2.normalActionScheme,
        Meta: {
            HideName: true,
            NewLine: true,
        },
    }),
});
function renderActionJson(name, props) {
    const actions = (0, Action_1.parseActionsJson)(props.Value);
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.Text, { Text: name }),
        React.createElement(CommonComponent_1.Btn, { Text: 'R', OnClick: () => {
                props.OnModify('', 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'P', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    return (React.createElement(Obj_1.Obj, { PrefixElement: prefixElement, Value: actions, Type: exports.actionsScheme, OnModify: (obj, type) => {
            props.OnModify(JSON.stringify(obj), type);
        } }));
}
exports.actionsJsonScheme = (0, Action_2.createStringScheme)({
    Render: (props) => renderActionJson('TriggerActionsJson', props),
    Meta: {
        HideName: true,
        NewLine: true,
    },
});
exports.triggerScheme = (0, Action_2.createObjectSchemeForUeClass)({
    MaxTriggerTimes: (0, Action_2.createIntScheme)({
        Meta: {
            NewLine: true,
        },
    }),
    TriggerActionsJson: exports.actionsJsonScheme,
});
//# sourceMappingURL=Trigger.js.map