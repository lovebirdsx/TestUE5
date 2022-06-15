/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { getProjectPath } from '../../Common/File';
import { log } from '../../Common/Log';
import { writeJson } from '../../Common/Util';
import { csvRegistry, ECsvName } from '../../Game/Common/CsvConfig/CsvRegistry';
import { ExtendedEntityCsvLoader } from '../../Game/Common/CsvConfig/ExtendedEntityCsv';
import { componentConfig } from '../../Game/Interface/Component';
import { entityConfig, genBlueprintConfig } from '../../Game/Interface/Entity';
import { globalConfig } from '../../Game/Interface/Global';
import { GLOBAL_CONFIG_PATH } from '../../Game/Interface/IGlobal';
import { levelConfigs } from '../../Game/Interface/Level';
import { ENTITY_TEMPLATE_DIRTY_RECORD_FILE, entityTemplateManager } from './EntityTemplateManager';
import { levelDataManager } from './LevelDataManager';
import { msgbox } from './Util';

interface IExportItem {
    Name: string;
    SourceFiles: string[];
    DestFiles: string[];
    ExportFun: () => void;
}

function getModifyTick(files: string[]): bigint {
    let result = 0n;
    files.forEach((f) => {
        const modifyTick = MyFileHelper.GetFileModifyTick(f);
        if (modifyTick > result) {
            result = modifyTick;
        }
    });
    return result;
}

function calNeedExport(sourceFiles: string[], destFiles: string[]): boolean {
    const sourceModifyTick = getModifyTick(sourceFiles);
    const destModifyTick = getModifyTick(destFiles);
    return destModifyTick === 0n || destModifyTick < sourceModifyTick;
}

class ConfigExporter {
    private readonly Items: IExportItem[];

    public constructor(items: IExportItem[]) {
        this.Items = items;
    }

    public Export(messages?: string[], isForce?: boolean): number {
        let count = 0;
        this.Items.forEach((item) => {
            if (isForce || calNeedExport(item.SourceFiles, item.DestFiles)) {
                item.ExportFun();
                count++;
                if (messages) {
                    messages.push(`[${item.Name}]`);
                }
                log(`Export ${item.Name}`);
            }
        });
        if (count === 0) {
            log(`No config need export: all new`);
        }
        return count;
    }

    public ExportByUser(isForce?: boolean): void {
        const messages: string[] = [];
        const count = this.Export(messages, isForce);
        msgbox(`导出了[${count}]个配置:\n${messages.join('\n')}`);
    }
}

function getProjectPaths(...files: string[]): string[] {
    return files.map((file) => getProjectPath(file));
}

const items: IExportItem[] = [
    {
        Name: 'Global',
        SourceFiles: getProjectPaths('TypeScript/Game/Interface/Global.ts'),
        DestFiles: getProjectPaths(GLOBAL_CONFIG_PATH),
        ExportFun: (): void => {
            writeJson(globalConfig, getProjectPath(GLOBAL_CONFIG_PATH));
        },
    },
    {
        Name: 'Component',
        SourceFiles: getProjectPaths('TypeScript/Game/Interface/Component.ts'),
        DestFiles: getProjectPaths(globalConfig.ComponentConfigPath),
        ExportFun: (): void => {
            writeJson(componentConfig, getProjectPath(globalConfig.ComponentConfigPath));
        },
    },
    {
        Name: 'Entity',
        SourceFiles: getProjectPaths('TypeScript/Game/Interface/Entity.ts'),
        DestFiles: getProjectPaths(globalConfig.EntityConfigPath),
        ExportFun: (): void => {
            writeJson(entityConfig, getProjectPath(globalConfig.EntityConfigPath));
        },
    },
    {
        Name: 'Blueprint',
        SourceFiles: [
            csvRegistry.GetPath(ECsvName.ExtendedEntity),
            getProjectPath('TypeScript/Game/Interface/Entity.ts'),
        ],
        DestFiles: getProjectPaths(globalConfig.BlueprintConfigPath),
        ExportFun: (): void => {
            writeJson(genBlueprintConfig(), getProjectPath(globalConfig.BlueprintConfigPath));
        },
    },
    {
        Name: 'Entity Template',
        SourceFiles: [ENTITY_TEMPLATE_DIRTY_RECORD_FILE],
        DestFiles: getProjectPaths(globalConfig.TemplateConfigPath),
        ExportFun: (): void => {
            entityTemplateManager.Export();
        },
    },
    {
        Name: 'Levels',
        SourceFiles: getProjectPaths('TypeScript/Game/Interface/Level.ts'),
        DestFiles: getProjectPaths(globalConfig.LevelsConfigPath),
        ExportFun: (): void => {
            writeJson(levelConfigs, getProjectPath(globalConfig.LevelsConfigPath));
        },
    },
    {
        Name: 'Level Data',
        SourceFiles: [levelDataManager.DirtyReocrdPath],
        DestFiles: [levelDataManager.GetMapDataPath()],
        ExportFun: (): void => {
            levelDataManager.Export();
        },
    },
    {
        Name: 'ExtendedEntity',
        SourceFiles: [csvRegistry.GetPath(ECsvName.ExtendedEntity)],
        DestFiles: getProjectPaths(globalConfig.BlueprintModelConfigPath),
        ExportFun: (): void => {
            const loader = csvRegistry.GetLoaderByName(
                ECsvName.ExtendedEntity,
            ) as ExtendedEntityCsvLoader;
            if (loader) {
                loader.ExportData(csvRegistry.GetPath(ECsvName.ExtendedEntity));
            }
        },
    },
];

export const configExporter = new ConfigExporter(items);
