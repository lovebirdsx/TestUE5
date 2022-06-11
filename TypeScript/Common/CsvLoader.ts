/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { LineReader, LineWriter } from './LineStream';
import { log, warn } from './Log';
import { TCsvValueType } from './Type';
import { RequiredField } from './Util';

export const csvCellTypeConfig = {
    Int: {
        Default: 0,
        Prase: (str: string): number => parseInt(str, 10),
        Desc: '整形',
    },
    String: {
        Default: '',
        Prase: (str: string): string => str,
        Desc: '字符串',
    },
    Boolean: {
        Default: false,
        Prase: (str: string): boolean => Boolean(str),
        Desc: '布尔型',
    },
    Float: {
        Default: 0.0,
        Prase: (str: string): number => parseFloat(str),
        Desc: '浮点型',
    },
};

export type TCsvCellType = keyof typeof csvCellTypeConfig;
export type TCsvValue<T extends TCsvCellType> = typeof csvCellTypeConfig[T]['Default'];

export function parseCsvValue<T extends TCsvCellType>(stringValue: string, type: T): TCsvValue<T> {
    const config = csvCellTypeConfig[type];
    return config.Prase(stringValue);
}

const exportType = ['C', 'S'] as const;
const valueType = ['Int', 'String', 'Long'] as const;
const boolType = ['1', '0', ''] as const;

export type TExportType = typeof exportType[number];
export type TValueType = typeof valueType[number];
export type TBoolType = typeof boolType[number];

export type TCsvCellRenderType =
    | 'Boolean'
    | 'CameraBinderMode'
    | 'CellType'
    | 'EntityBp'
    | 'EntityTemplateId'
    | 'Float'
    | 'FollowCell'
    | 'HeadIcon'
    | 'Int'
    | 'SequenceData'
    | 'String';

export interface ICsvField {
    ExportType: TExportType;
    Name: string;
    Type: TValueType;
    Filter: TBoolType;
    Localization: TBoolType;
    Condition: string;
    Default: string;
    CnName: string;
    RenderType: TCsvCellRenderType;
}

type TCsvFieldKey = keyof ICsvField;

interface IValidateType {
    CnName: string;
    Range?: readonly string[];
    IgnoreSerialize?: boolean;
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
    RenderType: { CnName: '', IgnoreSerialize: true },
};

export enum ECsvCellRenderType {
    Boolean,
    CameraBinderMode,
    CellType,
    Float,
    FollowCell,
    Int,
    SequenceData,
    HeadIcon,
    String,
}

export type TCsvRowBase = Record<string, TCsvValueType>;

function createDefaultCsvFiledEx(): ICsvField {
    return {
        ExportType: 'C',
        Name: 'default',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '未知',
        RenderType: 'String',
    };
}

export function createCsvField(
    value: RequiredField<Partial<ICsvField>, 'CnName' | 'Name'>,
): ICsvField {
    const result = createDefaultCsvFiledEx();
    Object.assign(result, value);
    return result;
}

export interface ICsv {
    Name: string;
    FiledTypes: ICsvField[];
    Rows: TCsvRowBase[];
}

export class GlobalCsv implements ICsv {
    public Name: string;

    public FiledTypes: ICsvField[];

    public Rows: TCsvRowBase[];

    public Bind(csv: ICsv): void {
        Object.assign(this, csv);
    }
}

export class CsvLoader<TCsvRow extends TCsvRowBase> {
    public readonly FiledTypes: ICsvField[];

    public readonly Name: string;

    // 每一列对应的FieldName
    private ColumeNames: string[];

    private readonly FieldMap = new Map<string, ICsvField>();

    public constructor(name: string, fieldTypes: ICsvField[]) {
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

        fieldTypes.forEach((fieldType) => {
            this.FieldMap.set(fieldType.Name, fieldType);
        });
    }

    private CheckHeadline(tockens: string[], fieldName: TCsvFieldKey): void {
        const validate = csvFieldValidValues[fieldName];
        if (tockens[0] !== validate.CnName) {
            throw new Error(
                `CSV file [${this.Name}] first colume invalid, expect[${validate.CnName}] actual:[${tockens[0]}]`,
            );
        }

        if (fieldName === 'Name') {
            this.ColumeNames = tockens;
        }

        // 允许长度不一致
        // if (tockens.length !== this.FiledTypes.length + 1) {
        //     throw new Error(
        //         `CSV file [${this.Name}] header tocken count invalid, field[${
        //             validate.CnName
        //         }], expect[${this.FiledTypes.length + 1}], actual[${tockens.length}]`,
        //     );
        // }

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
            const validater = csvFieldValidValues[key as TCsvFieldKey];
            if (validater.IgnoreSerialize) {
                continue;
            }

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

        // 允许长度不一致
        // if (tockens.length !== this.FiledTypes.length + 1) {
        //     throw new Error(
        //         `CSV [${this.Name}] row count invalid, row[${
        //             reader.currentLineNumber
        //         }], expect count[${this.FiledTypes.length + 1}], actual[${tockens.length}]`,
        //     );
        // }

        const row = {} as TCsvRowBase;
        for (let i = 1; i < tockens.length; i++) {
            const fieldName = this.ColumeNames[i];
            const fieldType = this.FieldMap.get(fieldName);
            if (!fieldType) {
                continue;
            }
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
            const validater = csvFieldValidValues[key as TCsvFieldKey];
            if (!validater.IgnoreSerialize) {
                this.WriteHeadLine(writer, key as TCsvFieldKey);
            }
        }
    }

    private WriteRow(writer: LineWriter, row: TCsvRow): void {
        const tockens: string[] = [];
        tockens.push('');
        this.FiledTypes.forEach((fieldType) => {
            const value = row[fieldType.Name];
            if (value === undefined) {
                tockens.push('');
            } else if (typeof value === 'string') {
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

    public TryLoad(path: string): TCsvRow[] {
        const content = MyFileHelper.Read(path);
        return content ? this.Parse(content) : [];
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
