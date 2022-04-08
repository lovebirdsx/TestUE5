/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ICsvFieldEx, TCsvRowBase } from '../CsvLoader';
import { IAbstractType, intScheme, stringScheme } from '../Scheme/Type';

export interface TalkerRow extends TCsvRowBase {
    Id: number;
    Name: string;
}

const textListCsvFields: ICsvFieldEx[] = [
    {
        ExportType: 'C',
        Name: 'Id',
        Type: 'Int',
        Filter: '1',
        Localization: '0',
        Condition: 'notEmpty && unique',
        Default: '',
        CnName: 'Id',
        TypeData: intScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'Name',
        Type: 'String',
        Filter: '0',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '说话人',
        TypeData: stringScheme as IAbstractType<unknown>,
    },
];

export class TalkerCsvLoader extends CsvLoader<TalkerRow> {
    public constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}
