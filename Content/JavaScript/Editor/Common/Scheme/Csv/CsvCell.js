"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSeqIdScheme = exports.talkerNamesScheme = exports.csvFollowCellScheme = exports.csvCellTypeScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const CsvLoader_1 = require("../../../../Common/CsvLoader");
const CsvOp_1 = require("../../../../Common/CsvOp");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
const CsvRegistry_1 = require("../../../../Game/Common/CsvConfig/CsvRegistry");
const ConfigFile_1 = require("../../../FlowEditor/ConfigFile");
const CommonComponent_1 = require("../../ReactComponent/CommonComponent");
const Context_1 = require("../../ReactComponent/Context");
const Dynamic_1 = require("../../ReactComponent/Dynamic");
const Util_1 = require("../../Util");
function genCsvCellTypeEnumConfig() {
    const configs = CsvLoader_1.csvCellTypeConfig;
    const slotList = Object.entries(configs).map(([type, slot]) => {
        return [type, slot.Desc];
    });
    return Object.fromEntries(slotList);
}
exports.csvCellTypeScheme = (0, Type_1.createEnumType)(genCsvCellTypeEnumConfig(), {
    Meta: {
        HideName: true,
    },
});
function getCsvCellSchemeByType(type) {
    switch (type) {
        case 'Int':
            return Type_1.intScheme;
        case 'Float':
            return Type_1.floatScheme;
        case 'String':
            return Type_1.stringScheme;
        case 'Boolean':
            return Type_1.booleanScheme;
        default:
            (0, Log_1.error)(`not supported TCsvCellType ${type}`);
            return Type_1.stringScheme;
    }
}
exports.csvFollowCellScheme = (0, Type_1.createStringScheme)({
    RrenderType: 'custom',
    CreateDefault: (container) => '',
    Render: (props) => {
        return (React.createElement(Context_1.csvCellContext.Consumer, null, (ctx) => {
            const csv = ctx.Csv;
            const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
            const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName];
            const scheme = getCsvCellSchemeByType(prevCellvalue);
            return React.createElement(Dynamic_1.Any, { ...props, Type: scheme });
        }));
    },
});
function openCsvEditor(csvName) {
    const configFile = new ConfigFile_1.ConfigFile();
    configFile.Load();
    configFile.CsvName = csvName;
    configFile.Save();
    (0, Util_1.sendEditorCommand)('RestartCsvEditor');
}
// 创建csv引用字段Scheme
function createCsvIndexScheme(csvName, indexField, valueField, indexType) {
    const csv = CsvRegistry_1.csvRegistry.Load(csvName);
    const [ids, values] = CsvOp_1.csvOp.GetIndexsAndValues(csv, indexField, valueField);
    if (!ids || !values) {
        throw new Error(`Can not create csv index scheme [${csvName}] [${indexField}] [${valueField}]`);
    }
    return {
        RrenderType: 'custom',
        CreateDefault: (container) => {
            if (indexType === 'Int') {
                return parseInt(ids[0]);
            }
            else if (indexType === 'BigInt') {
                return BigInt(ids[0]);
            }
            return ids[0];
        },
        Render: (props) => {
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
        },
        Check: () => 0,
        Fix: (value, container) => 'canNotFixed',
        Meta: {
            HideName: true,
        },
    };
}
exports.talkerNamesScheme = createCsvIndexScheme(CsvRegistry_1.ECsvName.Talker, 'Id', 'Name', 'Int');
exports.customSeqIdScheme = createCsvIndexScheme(CsvRegistry_1.ECsvName.CustomSeq, 'Id', 'Name', 'Int');
//# sourceMappingURL=CsvCell.js.map