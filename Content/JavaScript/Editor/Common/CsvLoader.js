"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Csv = exports.CsvLoader = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const ue_1 = require("ue");
const LineStream_1 = require("./LineStream");
const Log_1 = require("./Log");
const exportType = ['C', 'S'];
const valueType = ['Int', 'String', 'Long'];
const boolType = ['1', '0', ''];
const csvFieldValidValues = {
    ExportType: { CnName: '客户端/服务端 使用', Range: exportType },
    Name: { CnName: '字段名' },
    Type: { CnName: '字段数据类型', Range: valueType },
    Filter: { CnName: '该字段是否用于条件筛选', Range: boolType },
    Localization: { CnName: '是否导出多语言', Range: boolType },
    Condition: { CnName: '条件检查' },
    Default: { CnName: '默认值' },
    CnName: { CnName: '#' },
};
class CsvLoader {
    FiledTypes;
    Name;
    constructor(name, fieldTypes) {
        // 检查是否存在索引,filter字段用于表示该功能
        let filterCount = 0;
        fieldTypes.forEach((e) => {
            if (e.Filter === '1') {
                filterCount++;
            }
        });
        if (filterCount <= 0) {
            (0, Log_1.log)(`[${name}]: No index key (field [filter] = 1)`);
        }
        this.FiledTypes = fieldTypes.slice();
        this.Name = name;
    }
    CheckHeadline(tockens, fieldName) {
        const validate = csvFieldValidValues[fieldName];
        if (tockens[0] !== validate.CnName) {
            throw new Error(`CSV file [${this.Name}] first colume invalid, expect[${validate.CnName}] actual:[${tockens[0]}]`);
        }
        if (tockens.length !== this.FiledTypes.length + 1) {
            throw new Error(`CSV file [${this.Name}] header tocken count invalid, field[${validate.CnName}], expect[${this.FiledTypes.length + 1}], actual[${tockens.length}]`);
        }
        for (let i = 1; i < tockens.length; i++) {
            if (validate.Range) {
                const toc = tockens[i];
                if (!validate.Range.includes(toc)) {
                    throw new Error(`CSV file [${this.Name}] head field invalid, [${validate.CnName}], expect of [${validate.Range.join(',')}], actual[${toc}]`);
                }
            }
        }
    }
    WriteHeadLine(writer, fieldName) {
        const tockens = [];
        const validate = csvFieldValidValues[fieldName];
        tockens.push(validate.CnName);
        this.FiledTypes.forEach((fieldType) => {
            tockens.push(fieldType[fieldName]);
        });
        writer.write(tockens);
    }
    ReadHeader(reader) {
        for (const key in csvFieldValidValues) {
            if (reader.isEnd) {
                throw new Error(`CSV [${this.Name}] header row count [${reader.totalLine}] not enough`);
            }
            const tockens = reader.readNext();
            this.CheckHeadline(tockens, key);
        }
    }
    ReadRow(reader) {
        const tockens = reader.readNext();
        if (tockens.length !== this.FiledTypes.length + 1) {
            throw new Error(`CSV [${this.Name}] row count invalid, row[${reader.currentLineNumber}], expect count[${this.FiledTypes.length + 1}], actual[${tockens.length}]`);
        }
        const row = {};
        for (let i = 1; i < tockens.length; i++) {
            const fieldType = this.FiledTypes[i - 1];
            if (fieldType.Type === 'Int') {
                row[fieldType.Name] = parseInt(tockens[i], 10);
            }
            else if (fieldType.Type === 'Long') {
                row[fieldType.Name] = BigInt(tockens[i]);
            }
            else if (fieldType.Type === 'String') {
                row[fieldType.Name] = tockens[i];
            }
        }
        return row;
    }
    ReadRows(reader) {
        const result = [];
        while (!reader.isEnd) {
            result.push(this.ReadRow(reader));
        }
        return result;
    }
    WriteHeader(writer) {
        for (const key in csvFieldValidValues) {
            this.WriteHeadLine(writer, key);
        }
    }
    WriteRow(writer, row) {
        const tockens = [];
        tockens.push('');
        this.FiledTypes.forEach((fieldType) => {
            const value = row[fieldType.Name];
            if (typeof value === 'string') {
                tockens.push(value);
            }
            else {
                tockens.push(value.toString());
            }
        });
        writer.write(tockens);
    }
    WriteRows(writer, rows) {
        rows.forEach((row) => {
            this.WriteRow(writer, row);
        });
    }
    Parse(content) {
        const reader = new LineStream_1.LineReader(content);
        if (reader.isValid) {
            this.ReadHeader(reader);
            return this.ReadRows(reader);
        }
        return [];
    }
    ParseOne(content) {
        const reader = new LineStream_1.LineReader(content);
        if (reader.isValid) {
            this.ReadHeader(reader);
            return this.ReadRow(reader);
        }
        return undefined;
    }
    Stringify(rows) {
        const writer = new LineStream_1.LineWriter();
        this.WriteHeader(writer);
        this.WriteRows(writer, rows);
        return writer.gen();
    }
    StringifyOne(row) {
        const writer = new LineStream_1.LineWriter();
        this.WriteHeader(writer);
        this.WriteRow(writer, row);
        return writer.gen();
    }
    Load(path) {
        const content = ue_1.MyFileHelper.Read(path);
        if (!content) {
            (0, Log_1.warn)(`Can not read csv at [${path}]`);
            return [];
        }
        return this.Parse(content);
    }
    LoadOne(path) {
        const content = ue_1.MyFileHelper.Read(path);
        if (!content) {
            return undefined;
        }
        return this.ParseOne(content);
    }
    Save(rows, path) {
        return ue_1.MyFileHelper.Write(path, this.Stringify(rows));
    }
    SaveOne(row, path) {
        return ue_1.MyFileHelper.Write(path, this.StringifyOne(row));
    }
    LoadCsv(path) {
        return {
            Name: this.Name,
            FiledTypes: this.FiledTypes,
            Rows: this.Load(path),
        };
    }
    SaveCsv(csv, path) {
        return this.Save(csv.Rows, path);
    }
}
exports.CsvLoader = CsvLoader;
class Csv {
    static Log(csv) {
        const headers = csv.FiledTypes.map((field) => {
            return field.Name;
        });
        (0, Log_1.log)(headers.join('\t'));
        csv.Rows.forEach((row) => {
            const values = csv.FiledTypes.map((field) => {
                return row[field.Name].toString();
            });
            (0, Log_1.log)(values.join('\t'));
        });
    }
    static IsIndexField(field) {
        return field.Filter === '1' && (field.Type === 'Int' || field.Type === 'Long');
    }
    static GetIndexField(csv) {
        return csv.FiledTypes.find((field) => this.IsIndexField(field));
    }
    static GetMaxIndexFieldId(csv) {
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
    static MutableInsert(csv, rowId) {
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
                row[field.Name] = field.TypeData.CreateDefault(null);
            }
        });
        return (0, immer_1.default)(csv, (draft) => {
            draft.Rows.splice(rowId, 0, row);
        });
    }
    static MutableRemove(csv, rowId) {
        return (0, immer_1.default)(csv, (draft) => {
            draft.Rows.splice(rowId, 1);
        });
    }
    static CanMove(csv, rowId, isUp) {
        if (isUp) {
            return rowId > 0 && rowId < csv.Rows.length;
        }
        return rowId >= 0 && rowId < csv.Rows.length - 1;
    }
    static MutableMove(csv, rowId, isUp) {
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
exports.Csv = Csv;
//# sourceMappingURL=CsvLoader.js.map