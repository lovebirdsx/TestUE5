/* eslint-disable spellcheck/spell-checker */
import { createCsvField, CsvLoader, GlobalCsv, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExtendedEntityRow extends TCsvRowBase {
    Id: string;
    Name: string;
    Bp: string;
    TemplateId: number;
}

const extendedEntityBpCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Filter: '1',
    }),
    createCsvField({
        Name: 'Name',
        CnName: '名字',
    }),
    createCsvField({
        Name: 'Bp',
        CnName: '蓝图',
        RenderType: 'EntityBp',
    }),
    createCsvField({
        Name: 'TemplateId',
        CnName: '实体模板',
        Type: 'Int',
        RenderType: 'EntityTemplateId',
    }),
];

export class ExtendedEntityCsvLoader extends CsvLoader<IExtendedEntityRow> {
    public constructor() {
        super('ExtendedEntityBpCsv', extendedEntityBpCsvFields);
    }
}

export class ExtendedEntityCsv extends GlobalCsv<IExtendedEntityRow> {}
