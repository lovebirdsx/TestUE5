/* eslint-disable spellcheck/spell-checker */
import { CsvLoader, ICsvField, TCsvRowBase } from '../CsvLoader';

export interface IFlowListRow extends TCsvRowBase {
    Id: string;
    Json: string;
}

const flowListCsvFields: ICsvField[] = [
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

export class FlowListCsvLoader extends CsvLoader<IFlowListRow> {
    public constructor() {
        super('FlowListCsv', flowListCsvFields);
    }
}
