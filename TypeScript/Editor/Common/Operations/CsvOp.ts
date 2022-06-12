/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';

import { error, log } from '../../../Common/Log';
import { ICsv, ICsvField, TCsvRowBase } from '../../../Game/Common/CsvConfig/CsvLoader';
import { TCsvValueType } from '../../../Game/Interface/IAction';
import { csvScheme } from '../Scheme/Csv/CsvScheme';

class EditorCsvOp {
    public Log(csv: ICsv): void {
        const headers = csv.FiledTypes.map((field) => {
            return field.Name;
        });
        log(headers.join('\t'));
        csv.Rows.forEach((row) => {
            const values = csv.FiledTypes.map((field) => {
                const value = row[field.Name];
                return value ? value.toString() : '';
            });
            log(values.join('\t'));
        });
    }

    public IsIndexField(field: ICsvField): boolean {
        return field.Filter === '1' && (field.Type === 'Int' || field.Type === 'Long');
    }

    public GetIndexField(csv: ICsv): ICsvField {
        return csv.FiledTypes.find((field) => this.IsIndexField(field));
    }

    public GetMaxIndexFieldId(csv: ICsv): bigint | number {
        const indexField = this.GetIndexField(csv);
        if (!indexField) {
            error(`Can not find index field for csv [${csv.Name}]`);
            return 0;
        }

        if (indexField.Type === 'Int') {
            let max = 0;
            csv.Rows.forEach((row) => {
                const id = row[indexField.Name] as number;
                if (id > max) {
                    max = id;
                }
            });
            return max;
        }

        if (indexField.Type === 'Long') {
            let max = 0n;
            csv.Rows.forEach((row) => {
                const id = row[indexField.Name] as bigint;
                if (id > max) {
                    max = id;
                }
            });
            return max;
        }

        error(`GetMaxIndexFieldId must not happen for csv [${csv.Name}]`);
        return 0;
    }

    public MutableInsert(csv: ICsv, rowId: number): ICsv {
        const row = {} as TCsvRowBase;
        csv.FiledTypes.forEach((field) => {
            if (this.IsIndexField(field)) {
                const maxId = this.GetMaxIndexFieldId(csv);
                if (typeof maxId === 'number') {
                    row[field.Name] = maxId + 1;
                } else {
                    row[field.Name] = maxId + 1n;
                }
            } else {
                const typeData = csvScheme.GetSchme(field.RenderType);
                row[field.Name] = typeData.CreateDefault() as TCsvValueType;
            }
        });

        return produce(csv, (draft) => {
            draft.Rows.splice(rowId, 0, row);
        });
    }

    public MutableRemove(csv: ICsv, rowId: number): ICsv {
        return produce(csv, (draft) => {
            draft.Rows.splice(rowId, 1);
        });
    }

    public CanMove(csv: ICsv, rowId: number, isUp: boolean): boolean {
        if (isUp) {
            return rowId > 0 && rowId < csv.Rows.length;
        }
        return rowId >= 0 && rowId < csv.Rows.length - 1;
    }

    public MutableMove(csv: ICsv, rowId: number, isUp: boolean): ICsv {
        if (!this.CanMove(csv, rowId, isUp)) {
            return csv;
        }

        if (isUp) {
            return produce(csv, (draft) => {
                draft.Rows[rowId] = csv.Rows[rowId - 1];
                draft.Rows[rowId - 1] = csv.Rows[rowId];
            });
        }

        return produce(csv, (draft) => {
            draft.Rows[rowId] = csv.Rows[rowId + 1];
            draft.Rows[rowId + 1] = csv.Rows[rowId];
        });
    }
}

export const editorCsvOp = new EditorCsvOp();
