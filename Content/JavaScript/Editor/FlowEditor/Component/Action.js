"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Any_1 = require("../../Common/Component/Any");
const CommonComponent_1 = require("../../Common/Component/CommonComponent");
const ContextBtn_1 = require("../../Common/Component/ContextBtn");
const Action_1 = require("../../Common/Scheme/Action");
class Action extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { props } = this;
        const { Action: action } = props;
        return (React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } },
            React.createElement(Any_1.Any, { Value: action, Type: Action_1.scheme.GetNormalActionScheme(), OnModify: props.OnModify, PrefixElement: React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveUp', 'moveDown'], OnCommand: props.OnContextCommand, Tip: "\u9488\u5BF9\u5F53\u524D\u52A8\u4F5C\u9879\u8FDB\u884C\u64CD\u4F5C" }) })));
    }
}
exports.Action = Action;
//# sourceMappingURL=Action.js.map