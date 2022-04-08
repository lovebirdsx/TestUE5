"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkerCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../CsvLoader");
const Type_1 = require("../Scheme/Type");
const textListCsvFields = [
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
        CnName: '说话人',
        TypeData: Type_1.stringScheme,
    },
];
class TalkerCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}
exports.TalkerCsvLoader = TalkerCsvLoader;
//# sourceMappingURL=TalkerCsv.js.map