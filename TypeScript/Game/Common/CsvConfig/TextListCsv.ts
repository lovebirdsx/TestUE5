/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from './CsvLoader';

export interface TextRow extends TCsvRowBase {
    Key: bigint;
    FlowListId: string;
    Id: number;
    Text: string;
    Sound: string;
}

const textListCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Key',
        CnName: '主键',
        Type: 'Long',
        Filter: '1',
    }),
    createCsvField({
        Name: 'FlowListId',
        CnName: '剧情名',
        Filter: '1',
    }),
    createCsvField({
        Name: 'Id',
        CnName: '文本Id',
        Type: 'Int',
        Filter: '1',
    }),
    createCsvField({
        Name: 'Text',
        CnName: '文本内容',
        Localization: '1',
    }),
    createCsvField({
        Name: 'Sound',
        CnName: '声音',
    }),
];

export class TextListCsvLoader extends CsvLoader<TextRow> {
    public constructor() {
        super('TextListCsv', textListCsvFields);
    }
}
