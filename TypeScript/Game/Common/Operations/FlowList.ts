/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import { getDir, getFileName, getFileNameWithOutExt } from '../../../Common/File';
import { error, log, warn } from '../../../Common/Log';
import { calHash, toTsArray } from '../../../Common/Util';
import { IFlowInfo, IFlowListInfo, ITextConfig } from '../../Interface/IAction';
import { FlowListCsvLoader, IFlowListRow } from '../CsvConfig/FlowListCsv';
import { TextListCsvLoader } from '../CsvConfig/TextListCsv';
import { Context, createEditorContext } from '../EditorContext';
import { GameConfig } from '../GameConfig';

export enum EFlowListAction {
    GenText,
    ModifyText,
}

export const flowListContext: Context<IFlowListInfo, EFlowListAction> = createEditorContext<
    IFlowListInfo,
    EFlowListAction
>();

function getFlowListFiles(): string[] {
    const dir = GameConfig.FlowListDir;
    const array = NewArray(BuiltinString);
    MyFileHelper.FindFiles($ref(array), dir, 'csv');
    const files = toTsArray(array);
    const flowListFiles = files.filter((file) => {
        const fileName = getFileName(file);
        return fileName.startsWith(GameConfig.FlowListPrefix);
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

    public RefreshCache(): void {
        this.Files = getFlowListFiles();
        this.Names = this.Files.map((file) => {
            return getFileNameWithOutExt(file);
        });
    }

    public GenNewFlowListPath(): string {
        let id = 1;
        while (true) {
            const name = `${GameConfig.FlowListPrefix}${id++}`;
            if (!this.Names.includes(name)) {
                return `${GameConfig.FlowListDir}/${name}.csv`;
            }
        }
    }

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

    public LoadByName(name: string): IFlowListInfo {
        return this.Load(this.GetPath(name));
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
