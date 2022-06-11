/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */

import { createCsvField, CsvLoader, ICsvField, TCsvRowBase } from '../../Common/CsvLoader';

export interface TalkerRow extends TCsvRowBase {
    Id: number;
    Name: string;
    CameraBindTag: string;
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

export class TalkerCsvLoader extends CsvLoader<TalkerRow> {
    public constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}
