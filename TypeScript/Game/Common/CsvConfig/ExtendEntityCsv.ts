/* eslint-disable spellcheck/spell-checker */
import { TEntityType } from '../../Interface/IEntity';
import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from './CsvLoader';

export interface IExtendedEntityBpRow extends TCsvRowBase {
    Id: string;
    Name: string;
    Bp: string;
    Type: TEntityType;
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
        Name: 'Type',
        CnName: '实体类型',
        RenderType: 'EntityType',
    }),
    createCsvField({
        Name: 'TemplateId',
        CnName: '实体模板',
        Type: 'Int',
        RenderType: 'EntityTemplateId',
    }),
];

export class EntityCsvLoader extends CsvLoader<IExtendedEntityBpRow> {
    public constructor() {
        super('ExtendedEntityBpCsv', extendedEntityBpCsvFields);
    }
}
