/* eslint-disable spellcheck/spell-checker */
import { Config } from '../Config';
import { FlowListCsvLoader, IFlowListRow } from '../CsvConfig/FlowListCsv';
import { TextListCsvLoader } from '../CsvConfig/TextListCsv';
import { IFlowInfo, IFlowListInfo, ITextConfig } from '../Interface/IAction';
import { getDir, getFileName } from '../Misc/File';
import { error, log, warn } from '../Misc/Log';
import { calHash } from '../Misc/Util';
import { Context, createEditorContext } from './EditorContext';

export enum EFlowListAction {
    GenText,
    ModifyText,
}

export const flowListContext: Context<IFlowListInfo, EFlowListAction> = createEditorContext<
    IFlowListInfo,
    EFlowListAction
>();

const MAX_TEXT_ID = 1e8;

class FlowListOp {
    private GenNewFlowId(flowList: IFlowListInfo): number {
        let maxId = 0;
        flowList.Flows.forEach((flow) => {
            if (flow.Id > maxId) {
                maxId = flow.Id;
            }
        });
        return maxId + 1;
    }

    public CreateFlow(flowList: IFlowListInfo): IFlowInfo {
        const id = this.GenNewFlowId(flowList);
        const flow: IFlowInfo = {
            Id: id,
            Name: `剧情${id}`,
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
            Flows: [],
            Texts: {},
        };
    }

    public Load(path: string): IFlowListInfo {
        let row: IFlowListRow = undefined;
        let flowList: IFlowListInfo = undefined;
        try {
            const flowListCsv = new FlowListCsvLoader();
            row = flowListCsv.LoadOne(path);
        } catch (err) {
            error(err);
            row = undefined;
        }

        if (!row) {
            flowList = this.Create();
        } else {
            flowList = this.Parse(row.Json);
            this.LoadTextList(flowList, path);
        }

        return flowList;
    }

    public LoadByName(name: string): IFlowListInfo {
        const path = `${Config.FlowListDir}/${name}.csv`;
        return this.Load(path);
    }

    public GetTextListPath(configPath: string): string {
        return `${getDir(configPath)}/Text_${getFileName(configPath)}`;
    }

    public LoadTextList(flowList: IFlowListInfo, path: string): void {
        const csvPath = this.GetTextListPath(path);
        const csv = new TextListCsvLoader();
        const rows = csv.TryLoad(csvPath);

        const texts = {} as Record<number, ITextConfig>;
        if (rows) {
            rows.forEach((row) => {
                texts[row.Id] = {
                    Text: row.Text,
                    Sound: row.Sound,
                };
            });
            if (rows.length > 0) {
                log(`load text csv from: ${csvPath}`);
            }
        } else {
            warn(`load text csv failed: ${csvPath}`);
        }

        flowList.Texts = texts;
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

    public GetFlow(flowList: IFlowListInfo, flowId: number): IFlowInfo {
        return flowList.Flows.find((flow) => flow.Id === flowId);
    }

    public GenTextKey(name: string): bigint {
        return BigInt(calHash(name) * MAX_TEXT_ID);
    }

    private GenNewTextId(flowList: IFlowListInfo): number {
        let maxId = 0;
        Object.keys(flowList.Texts).forEach((key) => {
            const id = parseInt(key);
            if (id > maxId) {
                maxId = id;
            }
        });
        return maxId + 1;
    }

    public CreateText(flowList: IFlowListInfo, text: string): number {
        const textId = this.GenNewTextId(flowList);
        if (textId >= MAX_TEXT_ID) {
            throw new Error(`文本id[${textId}]已经超过最大值${MAX_TEXT_ID}`);
        }

        flowList.Texts[textId] = { Text: text, Sound: '' };
        return textId;
    }

    public ModifyText(flowList: IFlowListInfo, textId: number, text: string): void {
        flowList.Texts[textId].Text = text;
    }

    public ModifySound(flowList: IFlowListInfo, textId: number, sound: string): void {
        flowList.Texts[textId].Sound = sound;
    }
}

export const flowListOp = new FlowListOp();
