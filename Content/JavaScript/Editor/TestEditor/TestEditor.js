"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTestEditor = exports.TestEditor = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const CommonComponent_1 = require("../../Editor/Common/Component/CommonComponent");
const TestContainer_1 = require("../../Editor/UnitTest/Engine/TestContainer");
const TestFile_1 = require("../../Editor/UnitTest/Engine/TestFile");
const TestImmer_1 = require("../../Editor/UnitTest/TestImmer");
const TestTalkListTool_1 = require("../../Editor/UnitTest/TestTalkListTool");
const TestTextListCsv_1 = require("../../Editor/UnitTest/TestTextListCsv");
const react_umg_2 = require("../../react-umg/react-umg");
const Log_1 = require("../Common/Log");
const TestCsvParser_1 = require("../UnitTest/TestCsvParser");
const FileDialog_1 = require("./FileDialog");
const TestAssetSelector_1 = require("./TestAssetSelector");
const TestButton_1 = require("./TestButton");
const TestContextBtn_1 = require("./TestContextBtn");
const TestCsvView_1 = require("./TestCsvView");
const TestListView_1 = require("./TestListView");
const TestMoveComponent_1 = require("./TestMoveComponent");
const allTests = [
    { Name: 'testContainer', Fun: TestContainer_1.default },
    { Name: 'testImmer', Fun: TestImmer_1.default },
    { Name: 'testFile', Fun: TestFile_1.default },
    { Name: 'testCsvParser', Fun: TestCsvParser_1.default },
    { Name: 'testTalkListTool', Fun: TestTalkListTool_1.default },
    { Name: 'testTextListCSV', Fun: TestTextListCsv_1.default },
    { Name: 'testOpenFileDialog', Fun: FileDialog_1.testOpenFileDialog, ManualRun: true },
    { Name: 'testCloseFileDialog', Fun: FileDialog_1.testSaveFileDialog, ManualRun: true },
];
class TestEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Tests: allTests,
        };
    }
    RenderTest() {
        const row = 4;
        const testElements = this.state.Tests.map((test, id) => {
            const slot = {
                Row: Math.floor(id / row),
                Column: id % row,
                Padding: {
                    Left: 1,
                    Right: 1,
                    Top: 1,
                    Bottom: 1,
                },
            };
            return (React.createElement(CommonComponent_1.Btn, { Slot: slot, key: test.Name, Text: test.Name, OnClick: () => {
                    test.Fun();
                } }));
        });
        return React.createElement(react_umg_1.GridPanel, null, testElements);
    }
    RenderReadWriteCsv() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: "write EditorTest/textList.csv", OnClick: () => {
                    (0, TestTextListCsv_1.writeTextListCsv)('EditorTest/textList.csv');
                } }),
            React.createElement(CommonComponent_1.Btn, { Text: "read EditorTest/textList2.csv", OnClick: () => {
                    (0, TestTextListCsv_1.readTextListCsv)('EditorTest/textList2.csv');
                } })));
    }
    RenderTests() {
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(CommonComponent_1.H3, { Text: 'Test Logic' }),
            this.RenderTest(),
            React.createElement(CommonComponent_1.H3, { Text: 'Test Button enabled' }),
            React.createElement(TestButton_1.TestButton, null),
            React.createElement(CommonComponent_1.H3, { Text: 'Test MoveComponent' }),
            React.createElement(TestMoveComponent_1.TestMoveComponent, null),
            React.createElement(CommonComponent_1.H3, { Text: 'Test ListView' }),
            React.createElement(TestListView_1.TestListView, null),
            React.createElement(CommonComponent_1.H3, { Text: 'Test ContextBtn' }),
            React.createElement(TestContextBtn_1.TestContextBtn, null),
            React.createElement(CommonComponent_1.H3, { Text: 'Test AssetSelector' }),
            React.createElement(TestAssetSelector_1.TestAssetSelector, null),
            React.createElement(CommonComponent_1.H3, { Text: 'Read/Write Csv' }),
            this.RenderReadWriteCsv(),
            React.createElement(CommonComponent_1.H3, { Text: 'Test Csv View' }),
            React.createElement(TestCsvView_1.TestCsvView, null)));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const scrollBoxSlot = {
            Size: { SizeRule: ue_1.ESlateSizeRule.Fill },
        };
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.ScrollBox, { Slot: scrollBoxSlot }, this.RenderTests())));
    }
}
exports.TestEditor = TestEditor;
function testAll() {
    allTests.forEach((test) => {
        if (!test.ManualRun) {
            (0, Log_1.log)(`${test.Name} ==================`);
            test.Fun();
        }
    });
}
function runTestEditor(starter) {
    testAll();
    react_umg_2.ReactUMG.init(starter);
    react_umg_2.ReactUMG.render(React.createElement(TestEditor, null));
}
exports.runTestEditor = runTestEditor;
//# sourceMappingURL=TestEditor.js.map