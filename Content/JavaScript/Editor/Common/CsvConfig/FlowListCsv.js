"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowListCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
const CsvLoader_1 = require("../CsvLoader");
const flowListCsvFields = [
    {
        ExportType: 'C',
        Name: 'Id',
        Type: 'String',
        Filter: '1',
        Localization: '0',
        Condition: 'notEmpty && unique',
        Default: '',
        CnName: 'Id',
    },
    {
        ExportType: 'C',
        Name: 'Json',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: 'Json字符串',
    },
];
class FlowListCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('FlowListCsv', flowListCsvFields);
    }
}
exports.FlowListCsvLoader = FlowListCsvLoader;
//# sourceMappingURL=FlowListCsv.js.map