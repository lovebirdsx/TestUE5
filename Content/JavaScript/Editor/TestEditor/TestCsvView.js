"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCsvView = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const ue_1 = require("ue");
const TalkerCsv_1 = require("../../Game/Common/CsvConfig/TalkerCsv");
const CsvView_1 = require("../Common/ExtendComponent/CsvView");
const CsvOp_1 = require("../Common/Operations/CsvOp");
const TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';
class TestCsvView extends React.Component {
    constructor(props) {
        super(props);
        const loader = new TalkerCsv_1.TalkerCsvLoader();
        const path = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, TALKER_LIST_CSV_PATH);
        const csv = loader.LoadCsv(path);
        this.state = {
            Csv: csv,
            FilterTexts: csv.FiledTypes.map(() => ''),
        };
    }
    OnModify = (csv) => {
        this.setState({ Csv: csv });
    };
    OnModifyFilterTexts = (id, text) => {
        const newFilterTexts = (0, immer_1.default)(this.state.FilterTexts, (draft) => {
            draft[id] = text;
        });
        this.setState({ FilterTexts: newFilterTexts });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        CsvOp_1.editorCsvOp.Log(this.state.Csv);
        return (React.createElement(CsvView_1.CsvView, { Csv: this.state.Csv, OnModify: this.OnModify, FilterTexts: this.state.FilterTexts, OnModifyFilterTexts: this.OnModifyFilterTexts }));
    }
}
exports.TestCsvView = TestCsvView;
//# sourceMappingURL=TestCsvView.js.map