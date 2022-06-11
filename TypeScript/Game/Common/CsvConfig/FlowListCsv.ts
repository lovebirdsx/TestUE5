/* eslint-disable spellcheck/spell-checker */
import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from '../../../Common/CsvLoader';

export interface IFlowListRow extends TCsvRowBase {
    Id: string;
    Json: string;
}

const flowListCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Filter: '1',
        Condition: 'notEmpty && unique',
    }),
    createCsvField({
        Name: 'Json',
        CnName: 'Json字符串',
        Filter: '0',
    }),
];

export class FlowListCsvLoader extends CsvLoader<IFlowListRow> {
    public constructor() {
        super('FlowListCsv', flowListCsvFields);
    }
}
