/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { createCsvFieldEx, CsvLoader, ICsvField, TCsvRowBase } from '../../../Common/CsvLoader';

export interface CustomSeqRow extends TCsvRowBase {
    Id: number;
    Name: string;
    SeqDataPath: string;
    BinderType: string;
}

const customSeqCsvFields: ICsvField[] = [
    createCsvFieldEx({
        Name: 'Id',
        CnName: 'Id',
        Type: 'Int',
        Filter: '1',
        Condition: 'notEmpty && unique',
        RenderType: 'Int',
    }),
    createCsvFieldEx({
        Name: 'Name',
        CnName: '名字',
        Filter: '1',
        Localization: '1',
    }),
    createCsvFieldEx({
        Name: 'SeqDataPath',
        CnName: 'SeqData文件',
        Filter: '0',
        RenderType: 'SequenceData',
    }),
    createCsvFieldEx({
        Name: 'BinderType',
        CnName: '目标绑定类型',
        Filter: '0',
        RenderType: 'CameraBinderMode',
    }),
];

export class CustomSeqCsvLoader extends CsvLoader<CustomSeqRow> {
    public constructor() {
        super('CustomSeqCsv', customSeqCsvFields);
    }
}
