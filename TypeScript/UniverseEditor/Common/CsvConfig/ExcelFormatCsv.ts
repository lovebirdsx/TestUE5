/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { createCsvField, CsvLoader, GlobalCsv, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExcelFormatRow extends TCsvRowBase {
    Id: number;
    TargetPath: string;
    ConfigPath: string;
    OutputPath: string;
    FormatBtn: string;
}

const excelFormatCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Type: 'Int',
        Filter: '1',
        Condition: 'notEmpty && unique',
        RenderType: 'Int',
    }),
    createCsvField({
        Name: 'TargetPath',
        CnName: '输入文件',
        RenderType: 'ExcelFormatCsv',
    }),
    createCsvField({
        Name: 'ConfigPath',
        CnName: '通配符文件',
        RenderType: 'ExcelFormatCsv',
    }),
    createCsvField({
        Name: 'OutputPath',
        CnName: '输出文件',
        RenderType: 'ExcelFormatCsv',
    }),
    createCsvField({
        Name: 'FormatBtn',
        CnName: '导出',
        RenderType: 'ExcelFormatCsv',
    }),
];

export class ExcelFormatCsvLoader extends CsvLoader<IExcelFormatRow> {
    public constructor() {
        super('ExcelFormatCsvLoader', excelFormatCsvFields);
    }
}

export class ExcelFormatCsv extends GlobalCsv<IExcelFormatRow> {}
