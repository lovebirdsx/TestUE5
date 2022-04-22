"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerScheme = exports.actionsJsonScheme = exports.actionsScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Public_1 = require("../../SchemeComponent/Basic/Public");
const Public_2 = require("../Action/Public");
exports.actionsScheme = (0, Type_1.createObjectScheme)({
    Actions: (0, Type_1.createArrayScheme)({
        NewLine: true,
        Element: Public_2.actionRegistry.GetActionScheme(Type_1.EActionFilter.Trigger),
    }),
});
function renderActionJson(name, props) {
    const actions = (0, Action_1.parseTriggerActionsJson)(props.Value);
    const prefixElement = (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.Text, { Text: name }),
        React.createElement(CommonComponent_1.Btn, { Text: 'R', OnClick: () => {
                props.OnModify('', 'normal');
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: 'P', OnClick: () => {
                (0, Log_1.log)(props.Value);
            } })));
    return (React.createElement(Public_1.Obj, { PrefixElement: prefixElement, Value: actions, Scheme: exports.actionsScheme, OnModify: (obj, type) => {
            props.OnModify(JSON.stringify(obj), type);
        } }));
}
exports.actionsJsonScheme = (0, Type_1.createStringScheme)({
    NewLine: true,
    Render: (props) => renderActionJson('TriggerActionsJson', props),
});
exports.triggerScheme = (0, Type_1.createObjectScheme)({
    MaxTriggerTimes: (0, Type_1.createIntScheme)({
        NewLine: true,
    }),
    TriggerActionsJson: exports.actionsJsonScheme,
});
//# sourceMappingURL=TriggerScheme.js.map