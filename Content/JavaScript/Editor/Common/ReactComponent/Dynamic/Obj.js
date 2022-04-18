"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obj = void 0;
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Index_1 = require("../../Scheme/Action/Index");
const CommonComponent_1 = require("../CommonComponent");
const ContextBtn_1 = require("../ContextBtn");
const Any_1 = require("./Any");
function getFoldFieldName(key) {
    return `_${key}Folded`;
}
const FOLD_KEY = '_folded';
class Obj extends React.Component {
    ModifyKv(key, value, type, needUpdateFolded) {
        const newObj = (0, immer_1.default)(this.props.Value, (draft) => {
            if (value === undefined) {
                delete draft[key];
            }
            else {
                draft[key] = value;
            }
            if (needUpdateFolded) {
                draft[FOLD_KEY] = false;
            }
        });
        this.props.OnModify(newObj, type);
    }
    OnFoldChange = (isFolded) => {
        const { Value: value } = this.props;
        const newValue = (0, immer_1.default)(value, (draft) => {
            draft[FOLD_KEY] = isFolded;
        });
        this.props.OnModify(newValue, 'fold');
    };
    OnArrayFieldFoldChange(key, isFolded) {
        this.ModifyKv(getFoldFieldName(key), isFolded, 'fold');
    }
    AddArrayItem(arrayKey, arrayValue, arrayTypeData) {
        const newArrayItem = arrayTypeData.Element.CreateDefault(arrayValue);
        const newArrayValue = (0, immer_1.default)(arrayValue, (draft) => {
            draft.push(newArrayItem);
        });
        this.ModifyKv(arrayKey, newArrayValue, 'normal');
    }
    OnToggleFiledOptional = (key) => {
        const { Value: value, Type: type } = this.props;
        const fieldValue = value[key];
        if (fieldValue !== undefined) {
            this.ModifyKv(key, undefined, 'normal', true);
        }
        else {
            const objectTypeData = type;
            const fieldTypeData = objectTypeData.Fields[key];
            this.ModifyKv(key, fieldTypeData.CreateDefault(value), 'normal', true);
        }
    };
    RenderFieldValue(fieldKey, fieldValue, fieldTypeData) {
        if (fieldTypeData.RrenderType === 'array') {
            const fieldFoldKey = getFoldFieldName(fieldKey);
            const { Value: value } = this.props;
            const isFolded = typeof value === 'object'
                ? value[fieldFoldKey]
                : false;
            return (React.createElement(Any_1.Any, { PrefixElement: React.createElement(CommonComponent_1.SlotText, { Text: fieldKey }), Value: fieldValue, Owner: value, Type: fieldTypeData, IsFolded: isFolded, OnFoldChange: (folded) => {
                    this.OnArrayFieldFoldChange(fieldKey, folded);
                }, OnModify: (v, type) => {
                    this.ModifyKv(fieldKey, v, type);
                } }));
        }
        return (React.createElement(Any_1.Any, { Value: fieldValue, Owner: this.props.Value, Type: fieldTypeData, OnModify: (obj, type) => {
                this.ModifyKv(fieldKey, obj, type);
            } }));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Value: value, Type: type, PrefixElement: prefixElement } = this.props;
        if (!value) {
            return React.createElement(CommonComponent_1.Text, { Text: 'value is null', Color: "#FF0000 red" });
        }
        const objectType = type;
        const objValue = value;
        // 根据obj中的字段filed来自动计算如何渲染
        // 先集中绘制不需要换行的字段
        // 再依次绘制需要换行的字段
        const sameLineFields = [];
        const sameLineFieldsKey = [];
        const simplifyArrayFields = [];
        const simplifyArrayFieldsKey = [];
        const newLineFields = [];
        const newLineFieldsKey = [];
        const optinalKeys = [];
        for (const key in objectType.Fields) {
            const fieldTypeData = objectType.Fields[key];
            if (fieldTypeData.Meta.Hide) {
                continue;
            }
            if (Index_1.actionRegistry.IsFolderAble(fieldTypeData)) {
                newLineFields.push(fieldTypeData);
                newLineFieldsKey.push(key);
                if (fieldTypeData.RrenderType === 'array' &&
                    fieldTypeData.Meta.ArraySimplify &&
                    objValue[key]) {
                    simplifyArrayFields.push(fieldTypeData);
                    simplifyArrayFieldsKey.push(key);
                }
            }
            else {
                sameLineFields.push(fieldTypeData);
                sameLineFieldsKey.push(key);
            }
            if (fieldTypeData.Meta.Optional) {
                optinalKeys.push(key);
            }
        }
        const sameLine = sameLineFields.map((e, id) => {
            const fieldKey = sameLineFieldsKey[id];
            const fieldValue = objValue[fieldKey];
            const fieldTypeData = objectType.Fields[fieldKey];
            if (fieldTypeData.Meta.Optional && fieldValue === undefined) {
                return undefined;
            }
            return (React.createElement(react_umg_1.HorizontalBox, { key: fieldKey },
                !fieldTypeData.Meta.HideName && (React.createElement(CommonComponent_1.Text, { Text: `${fieldKey}:`, Tip: fieldTypeData.Meta.Tip || fieldKey })),
                this.RenderFieldValue(fieldKey, fieldValue, fieldTypeData)));
        });
        const simplifyArray = simplifyArrayFields.map((e, id) => {
            // 显示数组类型的名字和+号
            const arrayFieldKey = simplifyArrayFieldsKey[id];
            const arrayFieldValue = objValue[arrayFieldKey];
            const arrayTypeData = objectType.Fields[arrayFieldKey];
            return (React.createElement(react_umg_1.HorizontalBox, { key: arrayFieldKey },
                React.createElement(CommonComponent_1.SlotText, { Text: arrayFieldKey, Tip: arrayTypeData.Meta.Tip || arrayFieldKey }),
                React.createElement(CommonComponent_1.Btn, { Text: '✚', Tip: '添加', OnClick: () => {
                        this.AddArrayItem(arrayFieldKey, arrayFieldValue, arrayTypeData);
                    } })));
        });
        // eslint-disable-next-line no-undef
        const newLine = [];
        newLineFields.forEach((e, id) => {
            const fieldKey = newLineFieldsKey[id];
            const fieldValue = objValue[fieldKey];
            const fieldTypeData = objectType.Fields[fieldKey];
            if (fieldValue !== undefined) {
                newLine.push(React.createElement(react_umg_1.HorizontalBox, { key: id },
                    !fieldTypeData.Meta.HideName && (React.createElement(CommonComponent_1.Text, { Text: `${fieldKey}:`, Tip: fieldTypeData.Meta.Tip || fieldKey })),
                    this.RenderFieldValue(fieldKey, fieldValue, fieldTypeData)));
            }
        });
        const isFold = objValue[FOLD_KEY];
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                newLineFields.length > 0 && (React.createElement(CommonComponent_1.Fold, { IsFold: isFold, IsFull: newLine.length > 0, OnChanged: this.OnFoldChange })),
                prefixElement,
                React.createElement(react_umg_1.HorizontalBox, null, sameLine),
                React.createElement(react_umg_1.HorizontalBox, null, simplifyArray),
                optinalKeys.length > 0 && React.createElement(CommonComponent_1.SlotText, { Text: "Op", Tip: "\u53EF\u9009\u53C2\u6570" }),
                optinalKeys.length > 0 && (React.createElement(ContextBtn_1.ContextBtn, { Commands: optinalKeys, OnCommand: this.OnToggleFiledOptional, Tip: "\u5207\u6362\u53EF\u9009\u53C2\u6570" }))),
            React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } }, !isFold && newLine)));
    }
}
exports.Obj = Obj;
//# sourceMappingURL=Obj.js.map