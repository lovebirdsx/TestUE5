"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorCsvOp = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const Log_1 = require("../../../Common/Log");
const CsvScheme_1 = require("../../../Game/Scheme/Csv/CsvScheme");
class EditorCsvOp {
    Log(csv) {
        const headers = csv.FiledTypes.map((field) => {
            return field.Name;
        });
        (0, Log_1.log)(headers.join('\t'));
        csv.Rows.forEach((row) => {
            const values = csv.FiledTypes.map((field) => {
                const value = row[field.Name];
                return value ? value.toString() : '';
            });
            (0, Log_1.log)(values.join('\t'));
        });
    }
    IsIndexField(field) {
        return field.Filter === '1' && (field.Type === 'Int' || field.Type === 'Long');
    }
    GetIndexField(csv) {
        return csv.FiledTypes.find((field) => this.IsIndexField(field));
    }
    GetMaxIndexFieldId(csv) {
        const indexField = this.GetIndexField(csv);
        if (!indexField) {
            (0, Log_1.error)(`Can not find index field for csv [${csv.Name}]`);
            return 0;
        }
        if (indexField.Type === 'Int') {
            let max = 0;
            csv.Rows.forEach((row) => {
                const id = row[indexField.Name];
                if (id > max) {
                    max = id;
                }
            });
            return max;
        }
        if (indexField.Type === 'Long') {
            let max = 0n;
            csv.Rows.forEach((row) => {
                const id = row[indexField.Name];
                if (id > max) {
                    max = id;
                }
            });
            return max;
        }
        (0, Log_1.error)(`GetMaxIndexFieldId must not happen for csv [${csv.Name}]`);
        return 0;
    }
    MutableInsert(csv, rowId) {
        const row = {};
        csv.FiledTypes.forEach((field) => {
            if (this.IsIndexField(field)) {
                const maxId = this.GetMaxIndexFieldId(csv);
                if (typeof maxId === 'number') {
                    row[field.Name] = maxId + 1;
                }
                else {
                    row[field.Name] = maxId + 1n;
                }
            }
            else {
                const typeData = CsvScheme_1.csvScheme.GetSchme(field.Meta);
                row[field.Name] = typeData.CreateDefault();
            }
        });
        return (0, immer_1.default)(csv, (draft) => {
            draft.Rows.splice(rowId, 0, row);
        });
    }
    MutableRemove(csv, rowId) {
        return (0, immer_1.default)(csv, (draft) => {
            draft.Rows.splice(rowId, 1);
        });
    }
    CanMove(csv, rowId, isUp) {
        if (isUp) {
            return rowId > 0 && rowId < csv.Rows.length;
        }
        return rowId >= 0 && rowId < csv.Rows.length - 1;
    }
    MutableMove(csv, rowId, isUp) {
        if (!this.CanMove(csv, rowId, isUp)) {
            return csv;
        }
        if (isUp) {
            return (0, immer_1.default)(csv, (draft) => {
                draft.Rows[rowId] = csv.Rows[rowId - 1];
                draft.Rows[rowId - 1] = csv.Rows[rowId];
            });
        }
        return (0, immer_1.default)(csv, (draft) => {
            draft.Rows[rowId] = csv.Rows[rowId + 1];
            draft.Rows[rowId + 1] = csv.Rows[rowId];
        });
    }
}
exports.editorCsvOp = new EditorCsvOp();
//# sourceMappingURL=CsvOp.js.map