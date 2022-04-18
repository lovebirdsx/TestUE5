/* eslint-disable spellcheck/spell-checker */
import { ICsv } from './CsvLoader';
import { error } from './Log';

class CsvOp {
    private GetFieldIndex(csv: ICsv, fieldName: string, isIndex: boolean): number {
        const indexFieldId = csv.FiledTypes.findIndex((ft) => ft.Name === fieldName);
        if (indexFieldId < 0) {
            error(`${csv.Name} has no index field [${fieldName}]`);
            return -1;
        }

        const csvField = csv.FiledTypes[indexFieldId];
        if (isIndex && csvField.Filter === '0') {
            error(`${csv.Name} field [${fieldName}] is not indexable`);
            return -1;
        }

        return indexFieldId;
    }

    public GetIndexsAndValues(
        csv: ICsv,
        indexFieldName: string,
        valueFieldName: string,
    ): [string[], string[]] {
        const indexFieldId = this.GetFieldIndex(csv, indexFieldName, true);
        const valueFieldId = this.GetFieldIndex(csv, valueFieldName, false);

        let indexes: string[] = undefined;
        if (indexFieldId >= 0) {
            indexes = csv.Rows.map((row) => {
                return row[indexFieldName] as string;
            });
        }

        let values: string[] = undefined;
        if (valueFieldId >= 0) {
            values = csv.Rows.map((row) => {
                return row[valueFieldName] as string;
            });
        }

        return [indexes, values];
    }

    public GetValue(
        csv: ICsv,
        indexFieldName: string,
        indexFieldValue: string,
        valueName: string,
    ): string {
        const findRow = csv.Rows.find((row) => row[indexFieldName].toString() === indexFieldValue);
        return findRow ? findRow[valueName].toString() : '';
    }
}

export const csvOp = new CsvOp();
