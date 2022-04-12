"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvFollowCellScheme = exports.csvCellTypeScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const Action_1 = require("../../../../Game/Flow/Action");
const Any_1 = require("../../Component/Any");
const CsvView_1 = require("../../Component/CsvView");
const Log_1 = require("../../Log");
const Type_1 = require("../Type");
exports.csvCellTypeScheme = (0, Type_1.createEnumType)(Action_1.csvCellTypeConfig, {
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
        return (React.createElement(CsvView_1.csvCellContext.Consumer, null, (ctx) => {
            const csv = ctx.Csv;
            const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
            const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName];
            const scheme = getCsvCellSchemeByType(prevCellvalue);
            return React.createElement(Any_1.Any, { ...props, Type: scheme });
        }));
    },
});
//# sourceMappingURL=CsvCell.js.map