/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { createCsvField, CsvLoader, GlobalCsv, ICsvField, TCsvRowBase } from './CsvLoader';

export interface ITalkerRow extends TCsvRowBase {
    Id: number;
    Name: string;
}

const textListCsvFields: ICsvField[] = [
    createCsvField({
        Name: 'Id',
        CnName: 'Id',
        Type: 'Int',
        Filter: '1',
        Condition: 'notEmpty && unique',
        RenderType: 'Int',
    }),
    createCsvField({
        Name: 'Name',
        CnName: '说话人',
        Filter: '1',
        Localization: '1',
    }),
    createCsvField({
        Name: 'CameraBindTag',
        CnName: '镜头绑定Tag',
    }),
    createCsvField({
        Name: 'HeadIconAsset',
        CnName: '头像资源',
        RenderType: 'HeadIcon',
    }),
];

export class TalkerCsvLoader extends CsvLoader<ITalkerRow> {
    public constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}

export class TalkerCsv extends GlobalCsv<ITalkerRow> {}
