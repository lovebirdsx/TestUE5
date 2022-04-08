"use strict";
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Any_1 = require("../../Common/Component/Any");
const CommonComponent_1 = require("../../Common/Component/CommonComponent");
const ContextBtn_1 = require("../../Common/Component/ContextBtn");
const Scheme_1 = require("../../Common/Scheme");
class Action extends React.Component {
    render() {
        const { props } = this;
        const { action } = props;
        return (React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } },
            React.createElement(Any_1.Any, { Value: action, Type: Scheme_1.scheme.GetNormalActionScheme(), OnModify: props.onModify, PrefixElement: React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveUp', 'moveDown'], OnCommand: props.onContextCommand, Tip: "\u9488\u5BF9\u5F53\u524D\u52A8\u4F5C\u9879\u8FDB\u884C\u64CD\u4F5C" }) })));
    }
}
exports.Action = Action;
//# sourceMappingURL=Action.js.map