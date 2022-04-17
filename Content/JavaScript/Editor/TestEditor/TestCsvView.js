"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCsvView = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const ue_1 = require("ue");
const TalkerCsv_1 = require("../../Game/Common/CsvConfig/TalkerCsv");
const CsvOp_1 = require("../Common/Operations/CsvOp");
const CsvView_1 = require("../Common/ReactComponent/CsvView");
const TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';
class TestCsvView extends React.Component {
    constructor(props) {
        super(props);
        const loader = new TalkerCsv_1.TalkerCsvLoader();
        const path = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, TALKER_LIST_CSV_PATH);
        this.state = {
            Csv: loader.LoadCsv(path),
        };
    }
    OnModify = (csv) => {
        this.setState({ Csv: csv });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        CsvOp_1.csvOp.Log(this.state.Csv);
        return React.createElement(CsvView_1.CsvView, { Csv: this.state.Csv, OnModify: this.OnModify });
    }
}
exports.TestCsvView = TestCsvView;
//# sourceMappingURL=TestCsvView.js.map