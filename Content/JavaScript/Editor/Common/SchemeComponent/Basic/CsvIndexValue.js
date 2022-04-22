"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvIndexValue = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const CsvOp_1 = require("../../../../Common/CsvOp");
const CsvRegistry_1 = require("../../../../Game/Common/CsvConfig/CsvRegistry");
const ConfigFile_1 = require("../../../FlowEditor/ConfigFile");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Util_1 = require("../../Util");
function openCsvEditor(csvName) {
    const configFile = new ConfigFile_1.ConfigFile();
    configFile.Load();
    configFile.CsvName = csvName;
    configFile.Save();
    (0, Util_1.sendEditorCommand)('RestartCsvEditor');
}
class CsvIndexValue extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        const scheme = props.Scheme;
        const csvName = scheme.CsvName;
        const csv = CsvRegistry_1.csvRegistry.Load(csvName);
        const indexField = scheme.IndexField;
        const valueField = scheme.ValueField;
        const [ids, values] = CsvOp_1.csvOp.GetIndexsAndValues(csv, indexField, valueField);
        if (!ids || !values) {
            throw new Error(`Can not create csv index scheme [${csvName}] [${indexField}] [${valueField}]`);
        }
        const id = props.Value;
        const selected = values[ids.indexOf(id)];
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.List, { Items: values, Selected: selected, Tip: `CSV配置[${csvName}]中的[${valueField}]列`, OnSelectChanged: function (item) {
                    const newId = ids[values.indexOf(item)];
                    props.OnModify(newId, 'normal');
                } }),
            React.createElement(CommonComponent_1.Btn, { Text: '⊙', OnClick: () => {
                    openCsvEditor(csvName);
                }, Tip: `打开Csv配置[${csvName}]` })));
    }
}
exports.CsvIndexValue = CsvIndexValue;
//# sourceMappingURL=CsvIndexValue.js.map