"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfigCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../CsvLoader");
const CsvCell_1 = require("../Scheme/Csv/CsvCell");
const Type_1 = require("../Scheme/Type");
const globalConfigCsvFields = [
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
        Filter: '1',
        Localization: '0',
        Condition: 'notEmpty && unique',
        Default: '',
        CnName: '变量名',
        TypeData: Type_1.stringScheme,
    },
    {
        ExportType: 'C',
        Name: 'Desc',
        Type: 'String',
        Filter: '1',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '说明',
        TypeData: Type_1.stringScheme,
    },
    {
        ExportType: 'C',
        Name: 'Type',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: 'notEmpty',
        Default: '',
        CnName: '变量类型',
        TypeData: CsvCell_1.csvCellTypeScheme,
    },
    {
        ExportType: 'C',
        Name: 'Value',
        Type: 'String',
        Filter: '0',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '值',
        TypeData: CsvCell_1.csvFollowCellScheme,
    },
];
class GlobalConfigCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('GlobalConfigCsv', globalConfigCsvFields);
    }
}
exports.GlobalConfigCsvLoader = GlobalConfigCsvLoader;
//# sourceMappingURL=GlobalConfigCsv.js.map