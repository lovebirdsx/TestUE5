/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ECsvCellRenderType, ICsvFieldEx, TCsvRowBase } from '../../../Common/CsvLoader';

export interface CustomSeqRow extends TCsvRowBase {
    Id: number;
    Name: string;
    SeqDataPath: string;
    BinderType: string;
}

const customSeqCsvFields: ICsvFieldEx[] = [
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
            RenderType: ECsvCellRenderType.Int,
        },
    },
    {
        ExportType: 'C',
        Name: 'Name',
        Type: 'String',
        Filter: '1',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '名字',
        Meta: {
            RenderType: ECsvCellRenderType.String,
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
            RenderType: ECsvCellRenderType.SequenceData,
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
            RenderType: ECsvCellRenderType.CameraBinderMode,
        },
    },
];

export class CustomSeqCsvLoader extends CsvLoader<CustomSeqRow> {
    public constructor() {
        super('CustomSeqCsv', customSeqCsvFields);
    }
}
