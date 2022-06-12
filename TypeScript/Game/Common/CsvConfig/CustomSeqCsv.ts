/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from './CsvLoader';

export interface CustomSeqRow extends TCsvRowBase {
    Id: number;
    Name: string;
    SeqDataPath: string;
    BinderType: string;
}

const customSeqCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Type: 'Int',
        Filter: '1',
        Condition: 'notEmpty && unique',
        RenderType: 'Int',
    }),
    createCsvField({
        Name: 'Name',
        CnName: '名字',
        Filter: '1',
        Localization: '1',
    }),
    createCsvField({
        Name: 'SeqDataPath',
        CnName: 'SeqData文件',
        Filter: '0',
        RenderType: 'SequenceData',
    }),
    createCsvField({
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
