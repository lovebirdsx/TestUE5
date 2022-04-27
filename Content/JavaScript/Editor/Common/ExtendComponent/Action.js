"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Public_1 = require("../../../Game/Scheme/Action/Public");
const CommonComponent_1 = require("../BaseComponent/CommonComponent");
const ContextBtn = require("../BaseComponent/ContextBtn");
const Public_2 = require("../SchemeComponent/Public");
class Action extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { props } = this;
        const { Action: action } = props;
        const typeScheme = Public_1.actionRegistry.GetActionScheme(props.ActionFilter);
        return (React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } },
            React.createElement(Public_2.Dynamic, { Value: action, Scheme: typeScheme, OnModify: props.OnModify, PrefixElement: React.createElement(ContextBtn.ContextBtn, { Commands: ['上插', '下插', '移除', '上移', '下移'], OnCommand: props.OnContextCommand, Tip: "\u9488\u5BF9\u5F53\u524D\u52A8\u4F5C\u9879\u8FDB\u884C\u64CD\u4F5C" }) })));
    }
}
exports.Action = Action;
//# sourceMappingURL=Action.js.map