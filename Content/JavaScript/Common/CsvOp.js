"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvOp = void 0;
const Log_1 = require("./Log");
class CsvOp {
    GetFieldIndex(csv, fieldName, isIndex) {
        const indexFieldId = csv.FiledTypes.findIndex((ft) => ft.Name === fieldName);
        if (indexFieldId < 0) {
            (0, Log_1.error)(`${csv.Name} has no index field [${fieldName}]`);
            return -1;
        }
        const csvField = csv.FiledTypes[indexFieldId];
        if (isIndex && csvField.Filter === '0') {
            (0, Log_1.error)(`${csv.Name} field [${fieldName}] is not indexable`);
            return -1;
        }
        return indexFieldId;
    }
    GetIndexsAndValues(csv, indexFieldName, valueFieldName) {
        const indexFieldId = this.GetFieldIndex(csv, indexFieldName, true);
        const valueFieldId = this.GetFieldIndex(csv, valueFieldName, false);
        let indexes = undefined;
        if (indexFieldId >= 0) {
            indexes = csv.Rows.map((row) => {
                return row[indexFieldName];
            });
        }
        let values = undefined;
        if (valueFieldId >= 0) {
            values = csv.Rows.map((row) => {
                return row[valueFieldName];
            });
        }
        return [indexes, values];
    }
}
exports.csvOp = new CsvOp();
//# sourceMappingURL=CsvOp.js.map