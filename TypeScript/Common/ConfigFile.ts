/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { log } from './Log';

function getDefaultFlowListPath(): string {
    return MyFileHelper.GetPath(EFileRoot.Save, 'Editor/DefaultFlowList.csv');
}

class ConfigFile {
    public static readonly SavePath = MyFileHelper.GetPath(
        EFileRoot.Save,
        'Editor/FlowEditorConfig.json',
    );

    // 剧情配置文件
    public FlowConfigPath: string;

    // CSV导入和导出文件
    public CsvExportPath: string;

    public CsvImportPath: string;

    // 上一次打开的Csv文件路径
    public CsvName: string;

    // 上一次打开的EntityTemplate文件路径
    private MyLastEntityTemplatePath: string;

    // EntityEditor是否被锁定
    public IsEntityEditorLocked: boolean;

    public IsDevelop: boolean;

    public readonly MaxHistory = 100;

    public readonly AutoSaveInterval = 60;

    public get LastEntityTemplatePath(): string {
        if (!this.MyLastEntityTemplatePath) {
            this.MyLastEntityTemplatePath = MyFileHelper.GetPath(
                EFileRoot.Content,
                'Data/Template/Default.json',
            );
        }
        return this.MyLastEntityTemplatePath;
    }

    public set LastEntityTemplatePath(value: string) {
        this.MyLastEntityTemplatePath = value;
        this.Save();
    }

    public constructor() {
        this.Load();
    }

    private Load(): void {
        const content = MyFileHelper.Read(ConfigFile.SavePath);
        if (content) {
            const obj = JSON.parse(content) as object;
            Object.assign(this, obj);
        }

        if (!this.FlowConfigPath) {
            this.FlowConfigPath = getDefaultFlowListPath();
        }

        if (!this.CsvName) {
            this.CsvName = '对话人';
        }

        log(`Load FlowEditor config: ${ConfigFile.SavePath}`);
    }

    public Save(): void {
        const tabSize = 2;
        MyFileHelper.Write(ConfigFile.SavePath, JSON.stringify(this, null, tabSize));
    }
}

export const configFile = new ConfigFile();
