/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ICsvFieldEx, TCsvRowBase } from '../../../Common/CsvLoader';

export interface TextRow extends TCsvRowBase {
    Key: bigint;
    FlowListId: string;
    Id: number;
    Text: string;
    Sound: string;
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
    {
        ExportType: 'C',
        Name: 'Sound',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '声音',
    },
];

export class TextListCsvLoader extends CsvLoader<TextRow> {
    public constructor() {
        super('TextListCsv', textListCsvFields);
    }
}
