/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { CsvLoader, ICsvFieldEx, TCsvRowBase } from '../CsvLoader';
import { cameraBindModeScheme, seqDataScheme } from '../Scheme/Action/Sequence';
import { IAbstractType, intScheme, stringScheme } from '../Scheme/Type';

export interface CustomSeqRow extends TCsvRowBase {
    Id: number;
    Name: string;
    SeqDataPath: string;
    BinderType: string;
}

const customSeqCsvFields: ICsvFieldEx[] = [
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
        CnName: '名字',
        TypeData: stringScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'SeqDataPath',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: 'SeqData文件',
        TypeData: seqDataScheme as IAbstractType<unknown>,
    },
    {
        ExportType: 'C',
        Name: 'BinderType',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '目标绑定类型',
        TypeData: cameraBindModeScheme as IAbstractType<unknown>,
    },
];

export class CustomSeqCsvLoader extends CsvLoader<CustomSeqRow> {
    public constructor() {
        super('CustomSeqCsv', customSeqCsvFields);
    }
}
