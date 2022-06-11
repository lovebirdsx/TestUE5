/* eslint-disable spellcheck/spell-checker */
import { createCsvFieldEx, CsvLoader, ICsvField, TCsvRowBase } from '../../../Common/CsvLoader';

export interface IFlowListRow extends TCsvRowBase {
    Id: string;
    Json: string;
}

const flowListCsvFields: ICsvField[] = [
    createCsvFieldEx({
        Name: 'Id',
        CnName: 'Id',
        Filter: '1',
        Condition: 'notEmpty && unique',
    }),
    createCsvFieldEx({
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
