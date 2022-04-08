"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Test_1 = require("../../../Editor/Common/Test");
const File_1 = require("../../Common/File");
function testFile() {
    (0, Test_1.test)('read save file', () => {
        const file = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Test/Foo.txt');
        ue_1.MyFileHelper.Write(file, 'Hello Test');
        const content = ue_1.MyFileHelper.Read(file);
        (0, Test_1.assertEq)(content, 'Hello Test', 'file read must equal to write');
    });
    (0, Test_1.test)('read content file', () => {
        const file = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Test/Foo.txt');
        ue_1.MyFileHelper.Write(file, 'Hello Test');
        const content = ue_1.MyFileHelper.Read(file);
        (0, Test_1.assertEq)(content, 'Hello Test', 'file read must equal to write');
    });
    (0, Test_1.test)('getFileName', () => {
        (0, Test_1.assertEq)((0, File_1.getFileName)('hello/foo.json'), 'foo.json', 'getFileName failed');
        (0, Test_1.assertEq)((0, File_1.removeExtension)('foo.json'), 'foo', 'getFileName failed');
        (0, Test_1.assertEq)((0, File_1.getFileNameWithOutExt)('hello/foo.json'), 'foo', 'getFileName failed');
    });
}
exports.default = testFile;
//# sourceMappingURL=TestFile.js.map