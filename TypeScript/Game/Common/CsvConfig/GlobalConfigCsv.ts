/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    CsvLoader,
    ECsvCellRenderType,
    GlobalCsv,
    ICsv,
    ICsvFieldEx,
    parseCsvValue,
    TCsvCellType,
    TCsvRowBase,
} from '../../../Common/CsvLoader';
import { error } from '../../../Common/Log';

export interface GlobalConfigRow extends TCsvRowBase {
    Id: number;
    Type: TCsvCellType;
    Name: string;
    Value: string;
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
        Meta: {
            RenderType: ECsvCellRenderType.Int,
        },
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
        Meta: {
            RenderType: ECsvCellRenderType.String,
        },
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
        Meta: {
            RenderType: ECsvCellRenderType.String,
        },
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
        Meta: {
            RenderType: ECsvCellRenderType.CellType,
        },
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
        Meta: {
            RenderType: ECsvCellRenderType.FollowCell,
        },
    },
];

export class GlobalConfigCsvLoader extends CsvLoader<GlobalConfigRow> {
    public constructor() {
        super('GlobalConfigCsv', globalConfigCsvFields);
    }
}

interface IConfigSlot {
    Id: number;
    Type: TCsvCellType;
}

const globalValueConfig = {
    TalkJumpWaitTime: { Id: 1, Default: 0, Type: 'Float' },
    TalkCharPerMin: { Id: 2, Default: 0, Type: 'Int' },
    TalkShowInterval: { Id: 3, Default: 0, Type: 'Float' },
    TalkAutoJumpTime: { Id: 4, Default: 0, Type: 'Float' },
};

export type TGlobalValueName = keyof typeof globalValueConfig;
type TGlobalValueType<T extends TGlobalValueName> = typeof globalValueConfig[T]['Default'];

export class GlobalConfigCsv extends GlobalCsv {
    private readonly ConfigMap = new Map<TGlobalValueName, GlobalConfigRow>();

    public Bind(csv: ICsv): void {
        super.Bind(csv);

        const rows = csv.Rows as GlobalConfigRow[];
        const configs = globalValueConfig as Record<string, IConfigSlot>;
        Object.entries(configs).forEach(([name, config]) => {
            const row = rows.find((row) => row.Id === config.Id);
            if (!row) {
                error(`No global config for ${name}`);
            } else if (row.Type !== config.Type) {
                error(`global config type [${name}] csv type [${row.Type}] != [${config.Type}]`);
            } else {
                this.ConfigMap.set(name as TGlobalValueName, row);
            }
        });
    }

    public GetConfig<T extends TGlobalValueName>(configType: T): TGlobalValueType<T> {
        const config = this.ConfigMap.get(configType);
        return parseCsvValue(config.Value, config.Type) as TGlobalValueType<T>;
    }
}