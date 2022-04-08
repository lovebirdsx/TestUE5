"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorbox = exports.msgbox = exports.openSaveCsvFileDialog = exports.openLoadCsvFileDialog = exports.openSaveJsonFileDialog = exports.openLoadJsonFileDialog = exports.toUeArray = exports.toTsArray = void 0;
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
function toTsArray(array) {
    const result = [];
    for (let i = 0; i < array.Num(); i++) {
        result.push(array.Get(i));
    }
    return result;
}
exports.toTsArray = toTsArray;
function toUeArray(array, rt) {
    const result = (0, ue_1.NewArray)(rt);
    array.forEach((e) => {
        result.Add(e);
    });
    return result;
}
exports.toUeArray = toUeArray;
function openLoadJsonFileDialog(defaultFile) {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    if (ue_1.MyFileHelper.OpenFileDialog('Open Json File', defaultFile, 'Json File | *.json', filesRef)) {
        return ue_1.MyFileHelper.GetAbsolutePath((0, puerts_1.$unref)(filesRef).Get(0));
    }
    return undefined;
}
exports.openLoadJsonFileDialog = openLoadJsonFileDialog;
function openSaveJsonFileDialog(defaultFile) {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    if (ue_1.MyFileHelper.SaveFileDialog('Select Json File To Save', defaultFile, 'Json File | *.json', filesRef)) {
        return ue_1.MyFileHelper.GetAbsolutePath((0, puerts_1.$unref)(filesRef).Get(0));
    }
    return undefined;
}
exports.openSaveJsonFileDialog = openSaveJsonFileDialog;
function openLoadCsvFileDialog(defaultFile) {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    if (ue_1.MyFileHelper.OpenFileDialog('Open CSV File', defaultFile, 'CSV File | *.csv', filesRef)) {
        return ue_1.MyFileHelper.GetAbsolutePath((0, puerts_1.$unref)(filesRef).Get(0));
    }
    return undefined;
}
exports.openLoadCsvFileDialog = openLoadCsvFileDialog;
function openSaveCsvFileDialog(defaultFile) {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    if (ue_1.MyFileHelper.SaveFileDialog('Select CSV File To Save', defaultFile, 'CSV File | *.csv', filesRef)) {
        return ue_1.MyFileHelper.GetAbsolutePath((0, puerts_1.$unref)(filesRef).Get(0));
    }
    return undefined;
}
exports.openSaveCsvFileDialog = openSaveCsvFileDialog;
function msgbox(content) {
    ue_1.EditorOperations.ShowMessage(ue_1.EMsgType.Ok, content, '提示');
}
exports.msgbox = msgbox;
function errorbox(content) {
    ue_1.EditorOperations.ShowMessage(ue_1.EMsgType.Ok, content, '错误');
}
exports.errorbox = errorbox;
//# sourceMappingURL=Common.js.map