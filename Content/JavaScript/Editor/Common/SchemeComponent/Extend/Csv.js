"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderCsvFollowCell = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CsvCell_1 = require("../../Scheme/Csv/CsvCell");
const Any_1 = require("../Basic/Any");
const Context_1 = require("../Context");
function RenderCsvFollowCell(props) {
    return (React.createElement(Context_1.csvCellContext.Consumer, null, (ctx) => {
        const csv = ctx.Csv;
        const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
        const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName];
        const scheme = (0, CsvCell_1.getCsvCellSchemeByType)(prevCellvalue);
        return React.createElement(Any_1.Any, { ...props, Scheme: scheme });
    }));
}
exports.RenderCsvFollowCell = RenderCsvFollowCell;
//# sourceMappingURL=Csv.js.map