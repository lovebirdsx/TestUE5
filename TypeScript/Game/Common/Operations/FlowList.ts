/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import { getDir, getFileName, getFileNameWithOutExt } from '../../../Common/File';
import { error, log, warn } from '../../../Common/Log';
import { errorbox, toTsArray } from '../../../Common/UeHelper';
import { calHash } from '../../../Common/Util';
import { FLOW_LIST_VERSION, IFlowInfo, IFlowListInfo } from '../../Flow/Action';
import { gameConfig } from '../Config';
import { FlowListCsvLoader, IFlowListRow } from '../CsvConfig/FlowListCsv';
import { TextListCsvLoader } from '../CsvConfig/TextListCsv';
import { Context, createEditorContext } from '../EditorContext';

export enum EFlowListAction {
    GenText,
    ModifyText,
}

export const flowListContext: Context<IFlowListInfo, EFlowListAction> = createEditorContext<
    IFlowListInfo,
    EFlowListAction
>();

function getFlowListFiles(): string[] {
    const dir = gameConfig.FlowListDir;
    const array = NewArray(BuiltinString);
    MyFileHelper.FindFiles($ref(array), dir, 'csv');
    const files = toTsArray(array);
    const flowListFiles = files.filter((file) => {
        const fileName = getFileName(file);
        return fileName.startsWith(gameConfig.FlowListPrefix);
    });
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    flowListFiles.sort();
    return flowListFiles;
}

const MAX_TEXT_ID = 1e8;

class FlowListOp {
    public Names: string[];

    public Files: string[];

    public constructor() {
        this.RefreshCache();
    }

    private RefreshCache(): void {
        this.Files = getFlowListFiles();
        this.Names = this.Files.map((file) => {
            return getFileNameWithOutExt(file);
        });
    }

    public CreateFlow(flowList: IFlowListInfo): IFlowInfo {
        const flow: IFlowInfo = {
            Id: flowList.FlowGenId,
            StateGenId: 1,
            Name: `剧情${flowList.FlowGenId}`,
            States: [],
        };
        return flow;
    }

    public Parse(content: string): IFlowListInfo {
        if (!content) {
            return undefined;
        }

        return JSON.parse(content) as IFlowListInfo;
    }

    public Create(): IFlowListInfo {
        return {
            VersionNum: FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
    }

    public LoadByName(name: string): IFlowListInfo {
        return this.Load(this.GetPath(name));
    }

    public Load(path: string): IFlowListInfo {
        let row: IFlowListRow = null;
        let flowList: IFlowListInfo = null;
        try {
            const flowListCsv = new FlowListCsvLoader();
            row = flowListCsv.LoadOne(path);
        } catch (err) {
            error(err);
            errorbox(`打开流程配置文件失败:\n${path}\n${error}`);
            row = null;
        }

        if (!row) {
            flowList = this.Create();
        } else {
            flowList = this.Parse(row.Json);
            this.LoadTextList(flowList, path);
        }

        return flowList;
    }

    public GetTextListPath(configPath: string): string {
        return `${getDir(configPath)}/Text_${getFileName(configPath)}`;
    }

    public LoadTextList(flowList: IFlowListInfo, path: string): void {
        const csvPath = this.GetTextListPath(path);
        const csv = new TextListCsvLoader();
        const rows = csv.Load(csvPath);

        const texts = {} as Record<number, string>;
        if (rows) {
            rows.forEach((row) => {
                texts[row.Id] = row.Text;
            });
            log(`load text csv from: ${csvPath}`);
        } else {
            warn(`load text csv failed: ${csvPath}`);
        }

        flowList.Texts = texts;
    }

    public GetPath(name: string): string {
        const nameId = this.Names.indexOf(name);
        if (nameId < 0) {
            throw new Error(`Can not find flowlist for [${name}]`);
        }

        return this.Files[nameId];
    }

    public GetFlowNames(flowList: IFlowListInfo): string[] {
        return flowList.Flows.map((flow) => flow.Name);
    }

    public GetFlowName(flowList: IFlowListInfo, flowId: number): string {
        const flow = flowList.Flows.find((flow) => flow.Id === flowId);
        return flow !== undefined ? flow.Name : '';
    }

    public GetFlowId(flowList: IFlowListInfo, flowName: string): number {
        const flow = flowList.Flows.find((flow) => flow.Name === flowName);
        return flow !== undefined ? flow.Id : 0;
    }

    public GenTextKey(name: string): bigint {
        return BigInt(calHash(name) * MAX_TEXT_ID);
    }

    public CreateText(flowList: IFlowListInfo, text: string): number {
        if (flowList.TextGenId >= MAX_TEXT_ID) {
            error(`文本id已经超过最大值${MAX_TEXT_ID}`);
            return flowList.TextGenId;
        }
        const textId = flowList.TextGenId;
        flowList.Texts[textId] = text;
        flowList.TextGenId++;
        return textId;
    }

    public ModifyText(flowList: IFlowListInfo, textId: number, text: string): void {
        flowList.Texts[textId] = text;
    }
}

export const flowListOp = new FlowListOp();
