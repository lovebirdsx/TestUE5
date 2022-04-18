"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvLoader = exports.GlobalCsv = exports.ECsvCellRenderType = exports.parseCsvValue = exports.csvCellTypeConfig = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const LineStream_1 = require("./LineStream");
const Log_1 = require("./Log");
exports.csvCellTypeConfig = {
    Int: {
        Default: 0,
        Prase: (str) => parseInt(str, 10),
        Desc: '整形',
    },
    String: {
        Default: '',
        Prase: (str) => str,
        Desc: '字符串',
    },
    Boolean: {
        Default: false,
        Prase: (str) => Boolean(str),
        Desc: '布尔型',
    },
    Float: {
        Default: 0.0,
        Prase: (str) => parseFloat(str),
        Desc: '浮点型',
    },
};
function parseCsvValue(stringValue, type) {
    const config = exports.csvCellTypeConfig[type];
    return config.Prase(stringValue);
}
exports.parseCsvValue = parseCsvValue;
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
var ECsvCellRenderType;
(function (ECsvCellRenderType) {
    ECsvCellRenderType[ECsvCellRenderType["Boolean"] = 0] = "Boolean";
    ECsvCellRenderType[ECsvCellRenderType["CameraBinderMode"] = 1] = "CameraBinderMode";
    ECsvCellRenderType[ECsvCellRenderType["CellType"] = 2] = "CellType";
    ECsvCellRenderType[ECsvCellRenderType["Float"] = 3] = "Float";
    ECsvCellRenderType[ECsvCellRenderType["FollowCell"] = 4] = "FollowCell";
    ECsvCellRenderType[ECsvCellRenderType["Int"] = 5] = "Int";
    ECsvCellRenderType[ECsvCellRenderType["SequenceData"] = 6] = "SequenceData";
    ECsvCellRenderType[ECsvCellRenderType["String"] = 7] = "String";
})(ECsvCellRenderType = exports.ECsvCellRenderType || (exports.ECsvCellRenderType = {}));
class GlobalCsv {
    Name;
    FiledTypes;
    Rows;
    Bind(csv) {
        Object.assign(this, csv);
    }
}
exports.GlobalCsv = GlobalCsv;
class CsvLoader {
    FiledTypes;
    Name;
    // 每一列对应的FieldName
    ColumeNames;
    FieldMap = new Map();
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
        fieldTypes.forEach((fieldType) => {
            this.FieldMap.set(fieldType.Name, fieldType);
        });
    }
    CheckHeadline(tockens, fieldName) {
        const validate = csvFieldValidValues[fieldName];
        if (tockens[0] !== validate.CnName) {
            throw new Error(`CSV file [${this.Name}] first colume invalid, expect[${validate.CnName}] actual:[${tockens[0]}]`);
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
        // 允许长度不一致
        // if (tockens.length !== this.FiledTypes.length + 1) {
        //     throw new Error(
        //         `CSV [${this.Name}] row count invalid, row[${
        //             reader.currentLineNumber
        //         }], expect count[${this.FiledTypes.length + 1}], actual[${tockens.length}]`,
        //     );
        // }
        const row = {};
        for (let i = 1; i < tockens.length; i++) {
            const fieldName = this.ColumeNames[i];
            const fieldType = this.FieldMap.get(fieldName);
            if (!fieldType) {
                continue;
            }
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
            if (value === undefined) {
                tockens.push('');
            }
            else if (typeof value === 'string') {
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
//# sourceMappingURL=CsvLoader.js.map