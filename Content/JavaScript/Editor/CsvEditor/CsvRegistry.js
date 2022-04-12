"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvRegistry = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const CustomSeqCsv_1 = require("../Common/CsvConfig/CustomSeqCsv");
const GlobalConfigCsv_1 = require("../Common/CsvConfig/GlobalConfigCsv");
const TalkerCsv_1 = require("../Common/CsvConfig/TalkerCsv");
const Log_1 = require("../Common/Log");
const CSV_FILE_BASE_DIR = 'Data/Tables';
const configs = [
    {
        Name: '全局配置',
        Path: 'q.全局配置.csv',
        CsvLoaderClass: GlobalConfigCsv_1.GlobalConfigCsvLoader,
    },
    {
        Name: '对话人',
        Path: 'd.对话人.csv',
        CsvLoaderClass: TalkerCsv_1.TalkerCsvLoader,
    },
    {
        Name: '自定义序列',
        Path: 'z.自定义序列.csv',
        CsvLoaderClass: CustomSeqCsv_1.CustomSeqCsvLoader,
    },
];
class CsvRegistry {
    ConfigMap = new Map();
    LoaderMap = new Map();
    Names = [];
    BaseDir;
    constructor() {
        configs.forEach((file) => {
            this.ConfigMap.set(file.Name, file);
            this.Names.push(file.Name);
        });
        this.BaseDir = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, CSV_FILE_BASE_DIR);
    }
    GetSavePath(path) {
        return `${this.BaseDir}/${path}`;
    }
    GetLoader(config) {
        let loader = this.LoaderMap.get(config.Name);
        if (!loader) {
            loader = new config.CsvLoaderClass();
            this.LoaderMap.set(config.Name, loader);
        }
        return loader;
    }
    GetPath(name) {
        const config = this.ConfigMap.get(name);
        return this.GetSavePath(config.Path);
    }
    Load(name) {
        const config = this.ConfigMap.get(name);
        if (!config) {
            (0, Log_1.error)(`Can not load csv for name [${name}]`);
            return null;
        }
        const loader = this.GetLoader(config);
        return loader.LoadCsv(this.GetSavePath(config.Path));
    }
    Save(name, csv) {
        const config = this.ConfigMap.get(name);
        if (!config) {
            (0, Log_1.error)(`Can not save csv for name [${name}]`);
            return false;
        }
        const loader = this.GetLoader(config);
        const path = this.GetSavePath(config.Path);
        if (!loader.SaveCsv(csv, path)) {
            (0, Log_1.warn)(`Save csv [${csv.Name}] to ${path} failed`);
            return false;
        }
        (0, Log_1.log)(`Save csv: [${path}]`);
        return true;
    }
}
exports.csvRegistry = new CsvRegistry();
//# sourceMappingURL=CsvRegistry.js.map