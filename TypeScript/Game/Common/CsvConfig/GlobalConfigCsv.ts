/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import { error } from '../../../Common/Log';
import {
    createCsvField,
    CsvLoader,
    GlobalCsv,
    ICsv,
    ICsvField,
    parseCsvValue,
    TCsvCellType,
    TCsvRowBase,
} from './CsvLoader';

export interface GlobalConfigRow extends TCsvRowBase {
    Id: number;
    Type: TCsvCellType;
    Name: string;
    Value: string;
}

const globalConfigCsvFields: ICsvField[] = [
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
        CnName: '变量名',
        Filter: '1',
        Condition: 'notEmpty && unique',
    }),
    createCsvField({
        Name: 'Desc',
        CnName: '说明',
        Filter: '1',
    }),
    createCsvField({
        Name: 'Type',
        CnName: '变量类型',
        Condition: 'notEmpty',
        RenderType: 'CellType',
    }),
    createCsvField({
        Name: 'Value',
        CnName: '值',
        Localization: '1',
        RenderType: 'FollowCell',
    }),
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
