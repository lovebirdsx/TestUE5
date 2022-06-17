/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { csvRegistry, ECsvName } from '../../Common/CsvConfig/CsvRegistry';
import { componentConfig } from '../../Common/Interface/Component';
import { entityConfig, genBlueprintConfig } from '../../Common/Interface/Entity';
import { globalConfig } from '../../Common/Interface/Global';
import { GLOBAL_CONFIG_PATH } from '../../Common/Interface/IGlobal';
import { levelsConfig } from '../../Common/Interface/Level';
import { getProjectPath } from '../../Common/Misc/File';
import { log } from '../../Common/Misc/Log';
import { writeJson } from '../../Common/Misc/Util';
import { ENTITY_TEMPLATE_DIRTY_RECORD_FILE, entityTemplateManager } from './EntityTemplateManager';
import { levelDataManager } from './LevelDataManager';
import { EditorExtendedEntityCsv } from './Scheme/Csv/ExtendedEntityCsv';
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
            writeJson(levelsConfig, getProjectPath(globalConfig.LevelsConfigPath));
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
        DestFiles: getProjectPaths(globalConfig.EntityModelConfigPath),
        ExportFun: (): void => {
            EditorExtendedEntityCsv.Export(
                csvRegistry.GetPath(ECsvName.ExtendedEntity),
                getProjectPath(globalConfig.EntityModelConfigPath),
            );
        },
    },
];

export const configExporter = new ConfigExporter(items);
