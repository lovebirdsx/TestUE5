"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkerCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../../../Common/CsvLoader");
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
        Meta: {
            RenderType: CsvLoader_1.ECsvCellRenderType.Int,
        },
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
        Meta: {
            RenderType: CsvLoader_1.ECsvCellRenderType.String,
        },
    },
];
class TalkerCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}
exports.TalkerCsvLoader = TalkerCsvLoader;
//# sourceMappingURL=TalkerCsv.js.map