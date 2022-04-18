"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSeqIdScheme = exports.talkerNamesScheme = exports.csvFollowCellScheme = exports.csvCellTypeScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CsvLoader_1 = require("../../../../Common/CsvLoader");
const CsvOp_1 = require("../../../../Common/CsvOp");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
const CsvRegistry_1 = require("../../../../Game/Common/CsvConfig/CsvRegistry");
const CommonComponent_1 = require("../../ReactComponent/CommonComponent");
const Context_1 = require("../../ReactComponent/Context");
const Dynamic_1 = require("../../ReactComponent/Dynamic");
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
            return (React.createElement(CommonComponent_1.List, { Items: values, Selected: selected, OnSelectChanged: function (item) {
                    const newId = ids[values.indexOf(item)];
                    props.OnModify(newId, 'normal');
                } }));
        },
        Check: () => 0,
        Fix: (value, container) => 'canNotFixed',
        Meta: {},
    };
}
exports.talkerNamesScheme = createCsvIndexScheme('对话人', 'Id', 'Name', 'Int');
exports.customSeqIdScheme = createCsvIndexScheme('自定义序列', 'Id', 'Name', 'Int');
//# sourceMappingURL=CsvCell.js.map