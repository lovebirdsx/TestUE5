/* eslint-disable spellcheck/spell-checker */
import { error } from '../../Common/Misc/Log';
import { ICsv } from '../../Game/Common/CsvConfig/CsvLoader';
import { TCsvValueType } from '../../Game/Interface/IAction';

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

    public GetIndexsAndValues<TIndex extends TCsvValueType, TValue extends TCsvValueType>(
        csv: ICsv,
        indexFieldName: string,
        valueFieldName: string,
    ): [TIndex[], TValue[]] {
        const indexFieldId = this.GetFieldIndex(csv, indexFieldName, true);
        const valueFieldId = this.GetFieldIndex(csv, valueFieldName, false);

        let indexes: TIndex[] = undefined;
        if (indexFieldId >= 0) {
            indexes = csv.Rows.map((row) => {
                return row[indexFieldName] as TIndex;
            });
        }

        let values: TValue[] = undefined;
        if (valueFieldId >= 0) {
            values = csv.Rows.map((row) => {
                return row[valueFieldName] as TValue;
            });
        }

        return [indexes, values];
    }

    public GetValue<T extends TCsvValueType>(
        csv: ICsv,
        indexFieldName: string,
        indexFieldValue: string,
        valueName: string,
    ): T {
        const findRow = csv.Rows.find((row) => row[indexFieldName].toString() === indexFieldValue);
        return findRow ? (findRow[valueName] as T) : undefined;
    }
}

export const csvOp = new CsvOp();
