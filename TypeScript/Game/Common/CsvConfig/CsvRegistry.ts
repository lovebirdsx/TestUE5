/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { CsvLoader, GlobalCsv, ICsv, TCsvRowBase } from '../../../Common/CsvLoader';
import { error, log, warn } from '../../../Common/Log';
import { ECsvName } from '../../../Common/Type';
import { CustomSeqCsvLoader } from './CustomSeqCsv';
import { GlobalConfigCsv, GlobalConfigCsvLoader } from './GlobalConfigCsv';
import { TalkerCsvLoader } from './TalkerCsv';

export type TCsvClass = new () => GlobalCsv;

interface ICsvFileConfig {
    Name: ECsvName;
    Path: string;
    CsvLoaderClass: new () => CsvLoader<TCsvRowBase>;
    CsvClass: TCsvClass;
}

const CSV_FILE_BASE_DIR = 'Data/Tables';

const configs: ICsvFileConfig[] = [
    {
        Name: ECsvName.Global,
        Path: 'q.全局配置.csv',
        CsvLoaderClass: GlobalConfigCsvLoader,
        CsvClass: GlobalConfigCsv,
    },
    {
        Name: ECsvName.Talker,
        Path: 'd.对话人.csv',
        CsvLoaderClass: TalkerCsvLoader,
        CsvClass: undefined,
    },
    {
        Name: ECsvName.CustomSeq,
        Path: 'z.自定义序列.csv',
        CsvLoaderClass: CustomSeqCsvLoader,
        CsvClass: undefined,
    },
];

class CsvRegistry {
    private readonly ConfigMap = new Map<ECsvName, ICsvFileConfig>();

    private readonly ConfigMapByCsvClass = new Map<TCsvClass, ICsvFileConfig>();

    private readonly LoaderMap = new Map<string, CsvLoader<TCsvRowBase>>();

    private readonly CsvMap = new Map<TCsvClass, GlobalCsv>();

    public readonly Names: string[] = [];

    private readonly BaseDir: string;

    public constructor() {
        configs.forEach((file) => {
            this.ConfigMap.set(file.Name, file);
            this.ConfigMapByCsvClass.set(file.CsvClass, file);
            this.Names.push(file.Name);
        });
        this.BaseDir = MyFileHelper.GetPath(EFileRoot.Content, CSV_FILE_BASE_DIR);
    }

    private GetSavePath(path: string): string {
        return `${this.BaseDir}/${path}`;
    }

    private GetLoader(config: ICsvFileConfig): CsvLoader<TCsvRowBase> {
        let loader = this.LoaderMap.get(config.Name);
        if (!loader) {
            loader = new config.CsvLoaderClass();
            this.LoaderMap.set(config.Name, loader);
        }
        return loader;
    }

    public GetPath(name: ECsvName): string {
        const config = this.ConfigMap.get(name);
        return this.GetSavePath(config.Path);
    }

    public Load(name: ECsvName): ICsv {
        const config = this.ConfigMap.get(name);
        if (!config) {
            error(`Can not load csv for name [${name}]`);
            return null;
        }

        const loader = this.GetLoader(config);
        return loader.LoadCsv(this.GetSavePath(config.Path));
    }

    public Save(name: ECsvName, csv: ICsv): boolean {
        const config = this.ConfigMap.get(name);
        if (!config) {
            error(`Can not save csv for name [${name}]`);
            return false;
        }

        const loader = this.GetLoader(config);
        const path = this.GetSavePath(config.Path);
        if (!loader.SaveCsv(csv, path)) {
            warn(`Save csv [${csv.Name}] to ${path} failed`);
            return false;
        }

        log(`Save csv: [${path}]`);
        return true;
    }

    public GetCsv<T extends GlobalCsv>(classObj: new () => T): T {
        let result = this.CsvMap.get(classObj);
        if (!result) {
            const config = this.ConfigMapByCsvClass.get(classObj);
            if (!config) {
                error(`No config for csvClass [${classObj.name}]`);
                return undefined;
            }

            result = new config.CsvClass();
            result.Bind(this.Load(config.Name));
            this.CsvMap.set(classObj, result);
        }

        return result as T;
    }
}

export const csvRegistry = new CsvRegistry();
