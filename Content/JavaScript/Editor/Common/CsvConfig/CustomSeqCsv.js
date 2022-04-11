"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSeqCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../CsvLoader");
const Sequence_1 = require("../Scheme/Action/Sequence");
const Type_1 = require("../Scheme/Type");
const customSeqCsvFields = [
    {
        ExportType: 'C',
        Name: 'Id',
        Type: 'Int',
        Filter: '1',
        Localization: '0',
        Condition: 'notEmpty && unique',
        Default: '',
        CnName: 'Id',
        TypeData: Type_1.intScheme,
    },
    {
        ExportType: 'C',
        Name: 'Name',
        Type: 'String',
        Filter: '0',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '名字',
        TypeData: Type_1.stringScheme,
    },
    {
        ExportType: 'C',
        Name: 'SeqDataPath',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: 'SeqData文件',
        TypeData: Sequence_1.seqDataScheme,
    },
    {
        ExportType: 'C',
        Name: 'BinderType',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '目标绑定类型',
        TypeData: Sequence_1.cameraBindModeScheme,
    },
];
class CustomSeqCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('CustomSeqCsv', customSeqCsvFields);
    }
}
exports.CustomSeqCsvLoader = CustomSeqCsvLoader;
//# sourceMappingURL=CustomSeqCsv.js.map