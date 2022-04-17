"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConfigCsv = exports.GlobalConfigCsvLoader = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const CsvLoader_1 = require("../../../Common/CsvLoader");
const Log_1 = require("../../../Common/Log");
const globalConfigCsvFields = [
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
            RenderType: CsvLoader_1.ECsvCellRenderType.Int,
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
            RenderType: CsvLoader_1.ECsvCellRenderType.String,
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
            RenderType: CsvLoader_1.ECsvCellRenderType.String,
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
            RenderType: CsvLoader_1.ECsvCellRenderType.CellType,
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
            RenderType: CsvLoader_1.ECsvCellRenderType.FollowCell,
        },
    },
];
class GlobalConfigCsvLoader extends CsvLoader_1.CsvLoader {
    constructor() {
        super('GlobalConfigCsv', globalConfigCsvFields);
    }
}
exports.GlobalConfigCsvLoader = GlobalConfigCsvLoader;
const globalValueConfig = {
    TalkJumpWaitTime: { Id: 1, Default: 0, Type: 'Float' },
    TalkCharPerMin: { Id: 2, Default: 0, Type: 'Int' },
    TalkShowInterval: { Id: 3, Default: 0, Type: 'Float' },
    TalkAutoJumpTime: { Id: 4, Default: 0, Type: 'Float' },
};
class GlobalConfigCsv extends CsvLoader_1.GlobalCsv {
    ConfigMap = new Map();
    Bind(csv) {
        super.Bind(csv);
        const rows = csv.Rows;
        const configs = globalValueConfig;
        Object.entries(configs).forEach(([name, config]) => {
            const row = rows.find((row) => row.Id === config.Id);
            if (!row) {
                (0, Log_1.error)(`No global config for ${name}`);
            }
            else if (row.Type !== config.Type) {
                (0, Log_1.error)(`global config type [${name}] csv type [${row.Type}] != [${config.Type}]`);
            }
            else {
                this.ConfigMap.set(name, row);
            }
        });
    }
    GetConfig(configType) {
        const config = this.ConfigMap.get(configType);
        return (0, CsvLoader_1.parseCsvValue)(config.Value, config.Type);
    }
}
exports.GlobalConfigCsv = GlobalConfigCsv;
//# sourceMappingURL=GlobalConfigCsv.js.map