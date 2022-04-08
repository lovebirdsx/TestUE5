"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCsvView = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const ue_1 = require("ue");
const CsvView_1 = require("../Common/Component/CsvView");
const TalkerCsv_1 = require("../Common/CsvConfig/TalkerCsv");
const CsvLoader_1 = require("../Common/CsvLoader");
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
        CsvLoader_1.Csv.Log(this.state.Csv);
        return React.createElement(CsvView_1.CsvView, { Csv: this.state.Csv, OnModify: this.OnModify });
    }
}
exports.TestCsvView = TestCsvView;
//# sourceMappingURL=TestCsvView.js.map