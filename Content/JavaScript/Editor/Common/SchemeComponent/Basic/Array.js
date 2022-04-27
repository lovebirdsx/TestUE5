"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Array = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const GlobalContext_1 = require("../../../../Common/GlobalContext");
const Log_1 = require("../../../../Common/Log");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const ContextBtn_1 = require("../../BaseComponent/ContextBtn");
const Any_1 = require("./Any");
class Array extends React.Component {
    ModifyByCb(cb, type = 'normal') {
        const from = this.props.Value;
        const newValue = (0, immer_1.default)(from, (draft) => {
            cb(from, draft);
        });
        this.props.OnModify(newValue, type);
    }
    SpawnElement() {
        const scheme = this.props.Scheme;
        const handle = GlobalContext_1.globalContexts.Push(scheme, this.props.Value);
        const result = scheme.Element.CreateDefault();
        GlobalContext_1.globalContexts.Pop(handle);
        return result;
    }
    Modify(id, e, type) {
        this.ModifyByCb((from, to) => {
            to[id] = e;
        }, type);
    }
    Add = () => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElement();
            to.push(e);
        });
        this.props.OnFoldChange(false);
    };
    Insert = (id) => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElement();
            to.splice(id, 0, e);
        });
    };
    Remove = (id) => {
        this.ModifyByCb((form, to) => {
            to.splice(id, 1);
        });
    };
    Move = (id, isUp) => {
        this.ModifyByCb((from, to) => {
            if (isUp) {
                if (id > 0) {
                    to[id] = from[id - 1];
                    to[id - 1] = from[id];
                }
                else {
                    (0, Log_1.log)('Can not move up');
                }
            }
            else {
                if (id < from.length - 1) {
                    to[id] = from[id + 1];
                    to[id + 1] = from[id];
                }
                else {
                    (0, Log_1.log)('Can not move down');
                }
            }
        });
    };
    OnElementContextCommand(id, cmd) {
        switch (cmd) {
            case '上插':
                this.Insert(id);
                break;
            case '下插':
                this.Insert(id + 1);
                break;
            case '移除':
                this.Remove(id);
                break;
            case '上移':
                this.Move(id, true);
                break;
            case '下移':
                this.Move(id, false);
                break;
            default:
                break;
        }
    }
    GetArrayItemTip() {
        return this.props.Scheme.Element.Tip || '数组项';
    }
    CreatePrefixElement(id) {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(ContextBtn_1.ContextBtn, { Commands: ['上插', '下插', '移除', '上移', '下移'], OnCommand: (cmd) => {
                    this.OnElementContextCommand(id, cmd);
                }, Tip: `针对当前${this.GetArrayItemTip()}操作` })));
    }
    CreateItemsElement() {
        const { Value: value, Scheme: scheme } = this.props;
        return value.map((e, id) => {
            return (React.createElement(Any_1.Any, { key: id, PrefixElement: this.CreatePrefixElement(id), Value: e, Scheme: scheme.Element, OnModify: (e0, type) => {
                    this.Modify(id, e0, type);
                } }));
        });
    }
    RenderOneLineArray() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: '✚', OnClick: this.Add, Tip: `增加${this.GetArrayItemTip()}` }),
            this.CreateItemsElement()));
    }
    RenderMutilineArray() {
        const { Value: value, Scheme: type, IsFolded: isFolded, PrefixElement: prefixElement, } = this.props;
        if (type.ArraySimplify) {
            return React.createElement(react_umg_1.VerticalBox, null, !isFolded && this.CreateItemsElement());
        }
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Fold, { IsFold: isFolded, OnChanged: this.props.OnFoldChange, IsFull: value.length > 0 }),
                prefixElement,
                React.createElement(CommonComponent_1.Btn, { Text: '✚', OnClick: this.Add })),
            React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } }, !isFolded && this.CreateItemsElement())));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Scheme: type } = this.props;
        if (type.NewLine) {
            return this.RenderMutilineArray();
        }
        return this.RenderOneLineArray();
    }
}
exports.Array = Array;
//# sourceMappingURL=Array.js.map