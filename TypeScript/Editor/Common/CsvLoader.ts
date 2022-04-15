/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { MyFileHelper } from 'ue';

import { TCsvValueType } from '../../Game/Flow/Action';
import { LineReader, LineWriter } from './LineStream';
import { error, log, warn } from './Log';
import { IAbstractType } from './Scheme/Type';

const exportType = ['C', 'S'] as const;
const valueType = ['Int', 'String', 'Long'] as const;
const boolType = ['1', '0', ''] as const;

export type TExportType = typeof exportType[number];
export type TValueType = typeof valueType[number];
export type TBoolType = typeof boolType[number];

export interface ICsvField {
    ExportType: TExportType;
    Name: string;
    Type: TValueType;
    Filter: TBoolType;
    Localization: TBoolType;
    Condition: string;
    Default: string;
    CnName: string;
}

type TCsvFieldKey = keyof ICsvField;

interface IValidateType {
    CnName: string;
    Range?: readonly string[];
}

const csvFieldValidValues: { [key in keyof ICsvField]: IValidateType } = {
    ExportType: { CnName: '客户端/服务端 使用', Range: exportType },
    Name: { CnName: '字段名' },
    Type: { CnName: '字段数据类型', Range: valueType },
    Filter: { CnName: '该字段是否用于条件筛选', Range: boolType },
    Localization: { CnName: '是否导出多语言', Range: boolType },
    Condition: { CnName: '条件检查' },
    Default: { CnName: '默认值' },
    CnName: { CnName: '#' },
};

export type TCsvRowBase = Record<string, TCsvValueType>;

export interface ICsvFieldEx extends ICsvField {
    TypeData?: IAbstractType<unknown>;
}

export interface ICsv {
    Name: string;
    FiledTypes: ICsvFieldEx[];
    Rows: TCsvRowBase[];
}

export class GlobalCsv implements ICsv {
    public Name: string;

    public FiledTypes: ICsvFieldEx[];

    public Rows: TCsvRowBase[];

    public Bind(csv: ICsv): void {
        Object.assign(this, csv);
    }
}

export class CsvLoader<TCsvRow extends TCsvRowBase> {
    public readonly FiledTypes: ICsvFieldEx[];

    public readonly Name: string;

    public constructor(name: string, fieldTypes: ICsvFieldEx[]) {
        // 检查是否存在索引,filter字段用于表示该功能
        let filterCount = 0;
        fieldTypes.forEach((e) => {
            if (e.Filter === '1') {
                filterCount++;
            }
        });
        if (filterCount <= 0) {
            log(`[${name}]: No index key (field [filter] = 1)`);
        }

        this.FiledTypes = fieldTypes.slice();
        this.Name = name;
    }

    private CheckHeadline(tockens: string[], fieldName: TCsvFieldKey): void {
        const validate = csvFieldValidValues[fieldName];
        if (tockens[0] !== validate.CnName) {
            throw new Error(
                `CSV file [${this.Name}] first colume invalid, expect[${validate.CnName}] actual:[${tockens[0]}]`,
            );
        }

        if (tockens.length !== this.FiledTypes.length + 1) {
            throw new Error(
                `CSV file [${this.Name}] header tocken count invalid, field[${
                    validate.CnName
                }], expect[${this.FiledTypes.length + 1}], actual[${tockens.length}]`,
            );
        }

        for (let i = 1; i < tockens.length; i++) {
            if (validate.Range) {
                const toc = tockens[i];
                if (!validate.Range.includes(toc)) {
                    throw new Error(
                        `CSV file [${this.Name}] head field invalid, [${
                            validate.CnName
                        }], expect of [${validate.Range.join(',')}], actual[${toc}]`,
                    );
                }
            }
        }
    }

    private WriteHeadLine(writer: LineWriter, fieldName: TCsvFieldKey): void {
        const tockens: string[] = [];
        const validate = csvFieldValidValues[fieldName];
        tockens.push(validate.CnName);
        this.FiledTypes.forEach((fieldType) => {
            tockens.push(fieldType[fieldName]);
        });
        writer.write(tockens);
    }

    private ReadHeader(reader: LineReader): void {
        for (const key in csvFieldValidValues) {
            if (reader.isEnd) {
                throw new Error(
                    `CSV [${this.Name}] header row count [${reader.totalLine}] not enough`,
                );
            }
            const tockens = reader.readNext();
            this.CheckHeadline(tockens, key as TCsvFieldKey);
        }
    }

    private ReadRow(reader: LineReader): TCsvRow {
        const tockens = reader.readNext();
        if (tockens.length !== this.FiledTypes.length + 1) {
            throw new Error(
                `CSV [${this.Name}] row count invalid, row[${
                    reader.currentLineNumber
                }], expect count[${this.FiledTypes.length + 1}], actual[${tockens.length}]`,
            );
        }
        const row = {} as TCsvRowBase;
        for (let i = 1; i < tockens.length; i++) {
            const fieldType = this.FiledTypes[i - 1];
            if (fieldType.Type === 'Int') {
                row[fieldType.Name] = parseInt(tockens[i], 10);
            } else if (fieldType.Type === 'Long') {
                row[fieldType.Name] = BigInt(tockens[i]);
            } else if (fieldType.Type === 'String') {
                row[fieldType.Name] = tockens[i];
            }
        }
        return row as TCsvRow;
    }

    private ReadRows(reader: LineReader): TCsvRow[] {
        const result: TCsvRow[] = [];
        while (!reader.isEnd) {
            result.push(this.ReadRow(reader));
        }

        return result;
    }

    private WriteHeader(writer: LineWriter): void {
        for (const key in csvFieldValidValues) {
            this.WriteHeadLine(writer, key as TCsvFieldKey);
        }
    }

    private WriteRow(writer: LineWriter, row: TCsvRow): void {
        const tockens: string[] = [];
        tockens.push('');
        this.FiledTypes.forEach((fieldType) => {
            const value = row[fieldType.Name];
            if (typeof value === 'string') {
                tockens.push(value);
            } else {
                tockens.push(value.toString());
            }
        });
        writer.write(tockens);
    }

    private WriteRows(writer: LineWriter, rows: TCsvRow[]): void {
        rows.forEach((row) => {
            this.WriteRow(writer, row);
        });
    }

    public Parse(content: string): TCsvRow[] {
        const reader = new LineReader(content);
        if (reader.isValid) {
            this.ReadHeader(reader);
            return this.ReadRows(reader);
        }

        return [];
    }

    public ParseOne(content: string): TCsvRow {
        const reader = new LineReader(content);
        if (reader.isValid) {
            this.ReadHeader(reader);
            return this.ReadRow(reader);
        }
        return undefined;
    }

    public Stringify(rows: TCsvRow[]): string {
        const writer = new LineWriter();
        this.WriteHeader(writer);
        this.WriteRows(writer, rows);
        return writer.gen();
    }

    public StringifyOne(row: TCsvRow): string {
        const writer = new LineWriter();
        this.WriteHeader(writer);
        this.WriteRow(writer, row);
        return writer.gen();
    }

    public Load(path: string): TCsvRow[] {
        const content = MyFileHelper.Read(path);
        if (!content) {
            warn(`Can not read csv at [${path}]`);
            return [];
        }
        return this.Parse(content);
    }

    public LoadOne(path: string): TCsvRow {
        const content = MyFileHelper.Read(path);
        if (!content) {
            return undefined;
        }
        return this.ParseOne(content);
    }

    public Save(rows: TCsvRow[], path: string): boolean {
        return MyFileHelper.Write(path, this.Stringify(rows));
    }

    public SaveOne(row: TCsvRow, path: string): boolean {
        return MyFileHelper.Write(path, this.StringifyOne(row));
    }

    public LoadCsv(path: string): ICsv {
        return {
            Name: this.Name,
            FiledTypes: this.FiledTypes,
            Rows: this.Load(path),
        };
    }

    public SaveCsv(csv: ICsv, path: string): boolean {
        return this.Save(csv.Rows as TCsvRow[], path);
    }
}

export class Csv {
    public static Log(csv: ICsv): void {
        const headers = csv.FiledTypes.map((field) => {
            return field.Name;
        });
        log(headers.join('\t'));
        csv.Rows.forEach((row) => {
            const values = csv.FiledTypes.map((field) => {
                return row[field.Name].toString();
            });
            log(values.join('\t'));
        });
    }

    public static IsIndexField(field: ICsvFieldEx): boolean {
        return field.Filter === '1' && (field.Type === 'Int' || field.Type === 'Long');
    }

    public static GetIndexField(csv: ICsv): ICsvFieldEx {
        return csv.FiledTypes.find((field) => this.IsIndexField(field));
    }

    public static GetMaxIndexFieldId(csv: ICsv): bigint | number {
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

    public static MutableInsert(csv: ICsv, rowId: number): ICsv {
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
                row[field.Name] = field.TypeData.CreateDefault(null) as TCsvValueType;
            }
        });

        return produce(csv, (draft) => {
            draft.Rows.splice(rowId, 0, row);
        });
    }

    public static MutableRemove(csv: ICsv, rowId: number): ICsv {
        return produce(csv, (draft) => {
            draft.Rows.splice(rowId, 1);
        });
    }

    public static CanMove(csv: ICsv, rowId: number, isUp: boolean): boolean {
        if (isUp) {
            return rowId > 0 && rowId < csv.Rows.length;
        }
        return rowId >= 0 && rowId < csv.Rows.length - 1;
    }

    public static MutableMove(csv: ICsv, rowId: number, isUp: boolean): ICsv {
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
