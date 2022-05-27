/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */

import { CsvLoader, ECsvCellRenderType, ICsvFieldEx, TCsvRowBase } from '../../Common/CsvLoader';

export interface TalkerRow extends TCsvRowBase {
    Id: number;
    Name: string;
    CameraBindTag: string;
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
        Meta: {
            RenderType: ECsvCellRenderType.Int,
        },
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
        Meta: {
            RenderType: ECsvCellRenderType.String,
        },
    },
    {
        ExportType: 'C',
        Name: 'CameraBindTag',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '镜头绑定Tag',
        Meta: {
            RenderType: ECsvCellRenderType.String,
        },
    },
    {
        ExportType: 'C',
        Name: 'HeadIconAsset',
        Type: 'String',
        Filter: '0',
        Localization: '0',
        Condition: '',
        Default: '',
        CnName: '头像资源',
        Meta: {
            RenderType: ECsvCellRenderType.HeadIcon,
        },
    },
];

export class TalkerCsvLoader extends CsvLoader<TalkerRow> {
    public constructor() {
        super('TalkerCsv', textListCsvFields);
    }
}
