"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-magic-numbers */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const File_1 = require("../../../Common/File");
const Test_1 = require("../../../Common/Test");
const UeHelper_1 = require("../../../Common/UeHelper");
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
    (0, Test_1.test)('find files', () => {
        const dir = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Test/TestFindFiles');
        for (let i = 0; i < 3; i++) {
            ue_1.MyFileHelper.Write(`${dir}/test${i}.test`, `test ${i}`);
        }
        const resultArray = (0, ue_1.NewArray)(ue_1.BuiltinString);
        ue_1.MyFileHelper.FindFiles((0, puerts_1.$ref)(resultArray), dir, 'test');
        const fileNames = (0, UeHelper_1.toTsArray)(resultArray);
        (0, Test_1.assertEq)(fileNames.length, 3, 'file count must equal');
        for (let i = 0; i < 3; i++) {
            const fileName = `${dir}/test${i}.test`;
            (0, Test_1.assertTrue)(fileNames.includes(fileName), `file [${fileName}] not find for: [${fileNames.join(',')}]`);
        }
    });
}
exports.default = testFile;
//# sourceMappingURL=TestFile.js.map