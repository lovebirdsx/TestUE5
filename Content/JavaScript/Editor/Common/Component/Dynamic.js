"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dynamic = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("./CommonComponent");
const Scheme_1 = require("../Scheme");
const Any_1 = require("./Any");
class Dynamic extends React.Component {
    Select = (type) => {
        const action = Scheme_1.scheme.SpawnAction(type);
        this.props.OnModify(action);
    };
    ChangeAsync = (async) => {
        const action = this.props.Value;
        const newAction = (0, immer_1.default)(action, (draft) => {
            draft.Async = async;
        });
        this.props.OnModify(newAction);
    };
    Modify = (obj) => {
        const { Value: value } = this.props;
        const action = value;
        const newValue = (0, immer_1.default)(action, (draft) => {
            draft.Params = obj;
        });
        this.props.OnModify(newValue);
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Type: type, Value: value, PrefixElement: prefixElement } = this.props;
        const action = value;
        const dynamicType = type;
        const actionTypeData = Scheme_1.scheme.GetScheme(action.Name);
        return (React.createElement(Any_1.Any, { Value: action.Params, Type: actionTypeData, OnModify: this.Modify, PrefixElement: React.createElement(react_umg_1.HorizontalBox, null,
                prefixElement,
                React.createElement(CommonComponent_1.List, { Items: Scheme_1.scheme.GetActionNames(dynamicType.Filter), Selected: action.Name, OnSelectChanged: this.Select, Tip: actionTypeData.Meta.Tip }),
                actionTypeData.Scheduled && (React.createElement(CommonComponent_1.Text, { Text: "async", Tip: "\u662F\u5426\u4EE5\u5F02\u6B65\u65B9\u5F0F\u6267\u884C\u52A8\u4F5C" })),
                actionTypeData.Scheduled && (React.createElement(CommonComponent_1.Check, { UnChecked: !action.Async, OnChecked: this.ChangeAsync }))) }));
    }
}
exports.Dynamic = Dynamic;
//# sourceMappingURL=Dynamic.js.map