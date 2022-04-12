/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { CustomSeqCsvLoader } from '../Common/CsvConfig/CustomSeqCsv';
import { GlobalConfigCsvLoader } from '../Common/CsvConfig/GlobalConfigCsv';
import { TalkerCsvLoader } from '../Common/CsvConfig/TalkerCsv';
import { CsvLoader, ICsv, TCsvRowBase } from '../Common/CsvLoader';
import { error, log, warn } from '../Common/Log';

interface ICsvFileConfig {
    Name: string;
    Path: string;
    CsvLoaderClass: new () => CsvLoader<TCsvRowBase>;
}

const CSV_FILE_BASE_DIR = 'Data/Tables';

const configs: ICsvFileConfig[] = [
    {
        Name: '全局配置',
        Path: 'q.全局配置.csv',
        CsvLoaderClass: GlobalConfigCsvLoader,
    },
    {
        Name: '对话人',
        Path: 'd.对话人.csv',
        CsvLoaderClass: TalkerCsvLoader,
    },
    {
        Name: '自定义序列',
        Path: 'z.自定义序列.csv',
        CsvLoaderClass: CustomSeqCsvLoader,
    },
];

class CsvRegistry {
    private readonly ConfigMap = new Map<string, ICsvFileConfig>();

    private readonly LoaderMap = new Map<string, CsvLoader<TCsvRowBase>>();

    public readonly Names: string[] = [];

    private readonly BaseDir: string;

    public constructor() {
        configs.forEach((file) => {
            this.ConfigMap.set(file.Name, file);
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

    public GetPath(name: string): string {
        const config = this.ConfigMap.get(name);
        return this.GetSavePath(config.Path);
    }

    public Load(name: string): ICsv {
        const config = this.ConfigMap.get(name);
        if (!config) {
            error(`Can not load csv for name [${name}]`);
            return null;
        }

        const loader = this.GetLoader(config);
        return loader.LoadCsv(this.GetSavePath(config.Path));
    }

    public Save(name: string, csv: ICsv): boolean {
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
}

export const csvRegistry = new CsvRegistry();
