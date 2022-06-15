/* eslint-disable spellcheck/spell-checker */
import { ICsv, ICsvField, TCsvRowBase } from '../../../../Game/Common/CsvConfig/CsvLoader';

export class EditorGlobalCsv<T extends TCsvRowBase = TCsvRowBase> implements ICsv {
    public readonly Name: string;

    public readonly FiledTypes: ICsvField[];

    public readonly Rows: T[];

    public Bind(csv: ICsv): void {
        Object.assign(this, csv);
    }

    public Check(messages: string[]): number {
        return 0;
    }
}
