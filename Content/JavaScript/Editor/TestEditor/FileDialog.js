"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSaveFileDialog = exports.testOpenFileDialog = void 0;
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Log_1 = require("../Common/Log");
// Layer .raw files|*.raw|Layer .r8 files|*.r8|All files|*.*
function testOpenFileDialog() {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    ue_1.MyFileHelper.OpenFileDialog('testOpenFileDialog', 'test.json', 'Json | *.json', filesRef);
    const files = (0, puerts_1.$unref)(filesRef);
    (0, Log_1.log)(`file count ${files.Num()}`);
    for (let i = 0; i < files.Num(); i++) {
        const file = files.Get(i);
        (0, Log_1.log)(`${file} ${ue_1.MyFileHelper.GetPathRelativeTo(file, ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, ''))}`);
    }
}
exports.testOpenFileDialog = testOpenFileDialog;
function testSaveFileDialog() {
    const filesRef = (0, puerts_1.$ref)((0, ue_1.NewArray)(ue_1.BuiltinString));
    ue_1.MyFileHelper.SaveFileDialog('testOpenFileDialog', 'test.json', 'Json | *.json', filesRef);
    const files = (0, puerts_1.$unref)(filesRef);
    (0, Log_1.log)(`file count ${files.Num()}`);
    for (let i = 0; i < files.Num(); i++) {
        const file = files.Get(i);
        (0, Log_1.log)(`${file} ${ue_1.MyFileHelper.GetPathRelativeTo(file, ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, ''))}`);
    }
}
exports.testSaveFileDialog = testSaveFileDialog;
//# sourceMappingURL=FileDialog.js.map