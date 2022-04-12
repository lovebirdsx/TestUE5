"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = exports.Enum = exports.String = exports.Float = exports.Int = exports.Bool = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const AssetSelector_1 = require("./AssetSelector");
const CommonComponent_1 = require("./CommonComponent");
// eslint-disable-next-line @typescript-eslint/naming-convention
function Bool(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.Check, { UnChecked: !props.Value, OnChecked: (value) => {
                props.OnModify(value, 'normal');
            }, Tip: props.Type.Meta.Tip })));
}
exports.Bool = Bool;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Int(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.EditorBox, { Width: props.Type.Meta.Width, Tip: props.Type.Meta.Tip, Text: props.Value.toString(), OnChange: (text) => {
                props.OnModify(parseInt(text, 10), 'normal');
            } })));
}
exports.Int = Int;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Float(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.EditorBox, { Width: props.Type.Meta.Width, Text: props.Value.toString(), Tip: props.Type.Meta.Tip, OnChange: (text) => {
                props.OnModify(parseFloat(text), 'normal');
            } })));
}
exports.Float = Float;
// eslint-disable-next-line @typescript-eslint/naming-convention
function String(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        props.PrefixElement,
        React.createElement(CommonComponent_1.EditorBox, { Width: props.Type.Meta.Width, Text: props.Value, OnChange: (text) => {
                props.OnModify(text, 'normal');
            }, Tip: props.Type.Meta.Tip, Color: props.Color })));
}
exports.String = String;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Enum(props) {
    const enumType = props.Type;
    return (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.List, { Width: props.Type.Meta.Width, Items: enumType.Names, Selected: props.Value, Tip: enumType.Config[props.Value], OnSelectChanged: (item) => {
                props.OnModify(item, 'normal');
            } })));
}
exports.Enum = Enum;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Asset(props) {
    const assetType = props.Type;
    return (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(AssetSelector_1.AssetSelector, { Path: assetType.SearchPath, ClassType: assetType.ClassPath, SelectedObjectPath: props.Value, OnObjectPathChanged: (path) => {
                props.OnModify(path, 'normal');
            } })));
}
exports.Asset = Asset;
//# sourceMappingURL=Basic.js.map