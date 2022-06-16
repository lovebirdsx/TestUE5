/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { IPlayFlow } from '../../Common/Interface/IAction';
import { log } from '../../Common/Misc/Log';
import { writeJson } from '../../Common/Misc/Util';
import { IEntityRecords } from './Interface';

function getDefaultFlowListPath(): string {
    return MyFileHelper.GetPath(EFileRoot.Save, 'Editor/DefaultFlowList.csv');
}

export class EditorConfig {
    public static readonly SavePath = MyFileHelper.GetPath(EFileRoot.Save, 'Editor/Config.json');

    public static readonly LastEntityStateSavePath = MyFileHelper.GetPath(
        EFileRoot.Save,
        'Editor/LastEntity.json',
    );

    // 剧情配置文件
    public FlowConfigPath: string = getDefaultFlowListPath();

    public LastPlayFlow: IPlayFlow;

    // CSV导入和导出文件
    public CsvExportPath: string;

    public CsvImportPath: string;

    // 上一次打开的Csv文件路径
    public CsvName = '对话人';

    // 上一次打开的EntityTemplate文件路径
    private MyLastEntityTemplatePath: string;

    // EntityEditor是否被锁定
    public IsEntityEditorLocked: boolean;

    // EntityEditor中EntityId
    public EntityIdToSearch: number;

    // EntityEditor中是否显示扩展工具栏
    public IsEntityEditorShowExtendToolBar: boolean;

    // EntityEditor中的编辑记录
    public EntityRecords: IEntityRecords = { Records: [] };

    // TalkerEditor中滚轮位置
    public TalkerOffset: number;

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
        const content = MyFileHelper.Read(EditorConfig.SavePath);
        if (content) {
            const obj = JSON.parse(content) as object;
            Object.assign(this, obj);
        }

        log(`Load EditorConfig: ${EditorConfig.SavePath}`);
    }

    public Save(): void {
        writeJson(this, EditorConfig.SavePath);
    }
}

export const editorConfig = new EditorConfig();
