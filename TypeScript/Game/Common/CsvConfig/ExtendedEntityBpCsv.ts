/* eslint-disable spellcheck/spell-checker */
import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExtendedEntityBpRow extends TCsvRowBase {
    Id: string;
    Name: string;
    EntityBp: string;
    EntityTemplateId: number;
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
        Name: 'EntityBp',
        CnName: '蓝图',
        RenderType: 'EntityBp',
    }),
    createCsvField({
        Name: 'EntityTemplateId',
        CnName: '实体模板',
        RenderType: 'EntityTemplateId',
        Type: 'Int',
    }),
];

export class ExtendedEntityBpCsvLoader extends CsvLoader<IExtendedEntityBpRow> {
    public constructor() {
        super('ExtendedEntityBpCsv', extendedEntityBpCsvFields);
    }
}
