/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ICsvFieldEx, TCsvRowBase } from '../CsvLoader';

export interface TextRow extends TCsvRowBase {
    Key: bigint;
    FlowListId: string;
    Id: number;
    Text: string;
}

const textListCsvFields: ICsvFieldEx[] = [
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

export class TextListCsvLoader extends CsvLoader<TextRow> {
    public constructor() {
        super('TextListCsv', textListCsvFields);
    }
}
