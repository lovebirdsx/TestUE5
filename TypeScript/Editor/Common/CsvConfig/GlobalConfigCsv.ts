/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ICsvFieldEx, TCsvRowBase } from '../CsvLoader';
import { csvCellTypeScheme, csvFollowCellScheme } from '../Scheme/Csv/CsvCell';
import { IAbstractType, intScheme, stringScheme } from '../Scheme/Type';

export interface GlobalConfigRow extends TCsvRowBase {
    Id: number;
    Name: string;
}

const globalConfigCsvFields: ICsvFieldEx[] = [
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
        Filter: '1',
        Localization: '0',
        Condition: 'notEmpty && unique',
        Default: '',
        CnName: '变量名',
        TypeData: stringScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'Desc',
        Type: 'String',
        Filter: '1',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '说明',
        TypeData: stringScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'Type',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: 'notEmpty',
        Default: '',
        CnName: '变量类型',
        TypeData: csvCellTypeScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'Value',
        Type: 'String',
        Filter: '0',
        Localization: '1',
        Condition: '',
        Default: '',
        CnName: '值',
        TypeData: csvFollowCellScheme as IAbstractType<unknown>,
    },
];

export class GlobalConfigCsvLoader extends CsvLoader<GlobalConfigRow> {
    public constructor() {
        super('GlobalConfigCsv', globalConfigCsvFields);
    }
}
