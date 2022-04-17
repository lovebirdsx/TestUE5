"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextListCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../../../Common/CsvLoader");
const textListCsvFields = [
    {
        ExportType: 'C',
        Name: 'Key',
        Type: 'Long',
        Filter: '1',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '主键',
    },
    {
        ExportType: 'C',
        Name: 'FlowListId',
        Type: 'String',
        Filter: '1',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '剧情名',
    },
    {
        ExportType: 'C',
        Name: 'Id',
        Type: 'Int',
        Filter: '1',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '文本Id',
    },
    {
        ExportType: 'C',
        Name: 'Text',
        Type: 'String',
        Filter: '0',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '文本内容',
    },
];
class TextListCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('TextListCsv', textListCsvFields);
    }
}
exports.TextListCsvLoader = TextListCsvLoader;
//# sourceMappingURL=TextListCsv.js.map