"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvFollowCellScheme = exports.csvCellTypeScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CsvLoader_1 = require("../../../../Common/CsvLoader");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
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
//# sourceMappingURL=CsvCell.js.map