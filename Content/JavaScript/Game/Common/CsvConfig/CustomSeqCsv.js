"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSeqCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../../../Common/CsvLoader");
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
        CnName: '名字',
        Meta: {
            RenderType: CsvLoader_1.ECsvCellRenderType.String,
        },
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
        Meta: {
            RenderType: CsvLoader_1.ECsvCellRenderType.SequenceData,
        },
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
        Meta: {
            RenderType: CsvLoader_1.ECsvCellRenderType.CameraBinderMode,
        },
    },
];
class CustomSeqCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('CustomSeqCsv', customSeqCsvFields);
    }
}
exports.CustomSeqCsvLoader = CustomSeqCsvLoader;
//# sourceMappingURL=CustomSeqCsv.js.map