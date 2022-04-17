"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTextListCsv = exports.writeTextListCsv = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const Test_1 = require("../../Common/Test");
const TextListCsv_1 = require("../../Game/Common/CsvConfig/TextListCsv");
function testTextListCsv() {
    function testFor(textCount) {
        const caseName = `textCount = ${textCount}`;
        (0, Test_1.test)(caseName, () => {
            const textRows = [];
            for (let i = 0; i < textCount; i++) {
                textRows.push({
                    Key: BigInt(i + 1),
                    FlowListId: 'test',
                    Id: i + 1,
                    Text: `文本${i + 1}`,
                });
            }
            const csv = new TextListCsv_1.TextListCsvLoader();
            const content = csv.Stringify(textRows);
            const textRowsParsed = csv.Parse(content);
            (0, Test_1.assertEq)(textRowsParsed, textRows, `${caseName} must equal`);
        });
    }
    testFor(0);
    testFor(1);
    testFor(2);
}
exports.default = testTextListCsv;
function writeTextListCsv(path) {
    const abPath = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, path);
    const textRows = [];
    const addCount = 6;
    for (let i = 0; i < addCount; i++) {
        textRows.push({
            Key: BigInt(i + 1),
            FlowListId: 'test',
            Id: i + 1,
            Text: `文本${i + 1}`,
        });
    }
    const csv = new TextListCsv_1.TextListCsvLoader();
    csv.Save(textRows, abPath);
    (0, Log_1.log)(`Write to ${abPath}`);
}
exports.writeTextListCsv = writeTextListCsv;
function readTextListCsv(path) {
    const csv = new TextListCsv_1.TextListCsvLoader();
    const abPath = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, path);
    const rows = csv.Load(abPath);
    (0, Log_1.log)(JSON.stringify(rows, null, 2));
}
exports.readTextListCsv = readTextListCsv;
//# sourceMappingURL=TestTextListCsv.js.map