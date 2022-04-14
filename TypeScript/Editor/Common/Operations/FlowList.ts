/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { $ref } from 'puerts';
import { BuiltinString, EFileRoot, MyFileHelper, NewArray } from 'ue';

import {
    FLOW_LIST_VERSION,
    IActionInfo,
    IFlowInfo,
    IFlowListInfo,
    IPlayFlow,
    IShowOption,
    IShowTalk,
} from '../../../Game/Flow/Action';
import { ConfigFile } from '../../FlowEditor/ConfigFile';
import { errorbox, toTsArray } from '../Common';
import { FlowListCsvLoader, IFlowListRow } from '../CsvConfig/FlowListCsv';
import { TextListCsvLoader, TextRow } from '../CsvConfig/TextListCsv';
import { Context, createEditorContext } from '../EditorContext';
import { getDir, getFileName, getFileNameWithOutExt } from '../File';
import { error, log, warn } from '../Log';
import { calHash } from '../Util';
import { flowOp } from './Flow';
import { stateOp } from './State';

export enum EFlowListAction {
    GenText,
    ModifyText,
}

export const flowListContext: Context<IFlowListInfo, EFlowListAction> = createEditorContext<
    IFlowListInfo,
    EFlowListAction
>();

const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';
const MAX_TEXT_ID = 1e8;

function getFlowListFiles(): string[] {
    const dir = ConfigFile.FlowListDir;
    const array = NewArray(BuiltinString);
    MyFileHelper.FindFiles($ref(array), dir, 'csv');
    const files = toTsArray(array);
    const flowListFiles = files.filter((file) => {
        const fileName = getFileName(file);
        return fileName.startsWith(ConfigFile.FlowListPrefix);
    });
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    flowListFiles.sort();
    return flowListFiles;
}

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

    public Create(): IFlowListInfo {
        return {
            VersionNum: FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
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

    public RemoveText(flowList: IFlowListInfo, textId: number): void {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
    }

    public ModifyText(flowList: IFlowListInfo, textId: number, text: string): void {
        flowList.Texts[textId] = text;
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

    public Check(flowlist: IFlowListInfo, errorMessages: string[]): number {
        let errorCount = 0;
        flowlist.Flows.forEach((flow) => {
            errorCount += flowOp.Check(flow, errorMessages);
        });
        return errorCount;
    }

    public Fix(flowList: IFlowListInfo, versionTo: number): void {
        const versionFrom = flowList.VersionNum;
        if (versionFrom === versionTo) {
            return;
        }

        if (!flowList.Texts) {
            flowList.Texts = {};
            flowList.TextGenId = 0;
        }

        flowList.Flows.forEach((flow) => {
            flowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
    }

    private LoadEditor(path: string): object {
        const abPath = this.GetEditorSavePath(path);
        const content = MyFileHelper.Read(abPath);
        if (content) {
            const value = JSON.parse(content) as unknown;
            if (typeof value === 'object') {
                return value;
            }
        }

        return {};
    }

    // 将编辑器的配置合并到config
    private MergeEditorToConfig(
        config: Record<string, unknown>,
        editor: Record<string, unknown>,
    ): object {
        for (const key in editor) {
            const v1 = config[key];
            const v2 = editor[key];
            if (typeof v2 === 'object') {
                // editor有可能落后于config,从而出现editor中多出的object
                // 由于editor的字段只可能存在于已有的config的object中,故而忽略
                if (typeof v1 === 'object') {
                    config[key] = this.MergeEditorToConfig(
                        v1 as Record<string, unknown>,
                        v2 as Record<string, unknown>,
                    );
                }
            } else {
                if (v1 === undefined) {
                    config[key] = v2;
                }
            }
        }
        return config;
    }

    private GetTextListPath(configPath: string): string {
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

    private GenTextKey(name: string): bigint {
        return BigInt(calHash(name) * MAX_TEXT_ID);
    }

    public SaveTextList(flowList: IFlowListInfo, path: string): void {
        const rows: TextRow[] = [];
        const flowListId = getFileNameWithOutExt(path);
        const keyBase = this.GenTextKey(flowListId);
        for (const key in flowList.Texts) {
            const id = parseInt(key, 10);
            rows.push({
                Key: keyBase + BigInt(id),
                FlowListId: flowListId,
                Id: id,
                Text: flowList.Texts[key],
            });
        }

        if (rows.length <= 0) {
            return;
        }

        rows.sort((a, b) => a.Id - b.Id);
        const csvPath = this.GetTextListPath(path);
        const csv = new TextListCsvLoader();
        csv.Save(rows, csvPath);

        log(`save text csv to: ${csvPath}`);
    }

    public GetPath(name: string): string {
        const nameId = this.Names.indexOf(name);
        if (nameId < 0) {
            throw new Error(`Can not find flowlist for [${name}]`);
        }

        return this.Files[nameId];
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
            const editor = this.LoadEditor(path);
            this.MergeEditorToConfig(
                flowList as unknown as Record<string, unknown>,
                editor as Record<string, unknown>,
            );
            this.LoadTextList(flowList, path);
            if (flowList.VersionNum !== FLOW_LIST_VERSION) {
                this.Fix(flowList, FLOW_LIST_VERSION);
            }
        }

        return flowList;
    }

    private SaveConfig(flowList: IFlowListInfo, path: string): void {
        const flowListWithOutTexts = produce(flowList, (draft) => {
            delete draft.Texts;
        });

        const content = JSON.stringify(
            flowListWithOutTexts,
            (key: string, value: unknown): unknown => {
                if (typeof key === 'string' && key.startsWith('_')) {
                    return undefined;
                }
                return value;
            },
            2,
        );

        const flowListCsv = new FlowListCsvLoader();
        flowListCsv.SaveOne({ Id: getFileNameWithOutExt(path), Json: content }, path);
        log(`Save flowList config to [${path}]`);

        this.SaveTextList(flowList, path);
    }

    private GetEditorSavePath(configPath: string): string {
        return MyFileHelper.GetPath(
            EFileRoot.Save,
            `${FLOW_EDITOR_SAVE_BASE}/${getFileNameWithOutExt(configPath)}.json`,
        );
    }

    private SaveEditor(flowList: IFlowListInfo, path: string): void {
        const editorSavePath = this.GetEditorSavePath(path);
        const content = JSON.stringify(
            flowList,
            (key: string, value: unknown): unknown => {
                if (
                    typeof key === 'string' &&
                    key.length > 0 &&
                    !key.startsWith('_') &&
                    typeof value !== 'object'
                ) {
                    return undefined;
                }
                return value;
            },
            2,
        );

        if (MyFileHelper.Write(editorSavePath, content)) {
            log(`Save flowList editor to [${editorSavePath}]`);
        } else {
            error(`Save flowList editor to [${editorSavePath}] failed`);
        }
    }

    private ForeachActions(flowList: IFlowListInfo, actionCb: (action: IActionInfo) => void): void {
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                stateOp.ForeachActions(state, actionCb);
            });
        });
    }

    // 移除flowList中不存在的TextID,返回移除的数量
    public FormatTexts(flowList: IFlowListInfo): number {
        const textIds: Record<number, boolean> = {};
        this.ForeachActions(flowList, (action) => {
            if (action.Name === 'ShowOption') {
                const showOption = action.Params as IShowOption;
                if (textIds[showOption.TextId]) {
                    error(`Duplicated textid ${showOption.TextId}`);
                    return;
                }
                textIds[showOption.TextId] = true;
            } else if (action.Name === 'ShowTalk') {
                const showTalk = action.Params as IShowTalk;
                showTalk.TalkItems.forEach((talkItem) => {
                    const { TextId: textId } = talkItem;
                    if (textIds[textId]) {
                        error(`Duplicated textid ${textId}`);
                        return;
                    }
                    textIds[textId] = true;

                    if (talkItem.Options) {
                        talkItem.Options.forEach((option) => {
                            const { TextId: textId } = option;
                            if (textIds[textId]) {
                                error(`Duplicated textid ${textId}`);
                                return;
                            }
                            textIds[textId] = true;
                        });
                    }
                });
            }
        });

        const idsToRemove: number[] = [];
        for (const id in flowList.Texts) {
            if (!textIds[id]) {
                idsToRemove.push(parseInt(id, 10));
            }
        }

        idsToRemove.forEach((id) => {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete flowList.Texts[id];
        });

        return idsToRemove.length;
    }

    public Save(flowList: IFlowListInfo, path: string): void {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
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

    public CreateDefaultPlayFlowFor(flowListName: string): IPlayFlow {
        const flowList = this.LoadByName(flowListName);
        const flow = flowList.Flows.length > 0 ? flowList.Flows[0] : null;
        const state = flow && flow.States.length > 0 ? flow.States[0] : null;
        return {
            FlowListName: flowListName,
            FlowId: flow ? flow.Id : 0,
            StateId: state ? state.Id : 0,
        };
    }

    public CreateDefaultPlayFlow(): IPlayFlow {
        if (this.Names.length <= 0) {
            return {
                FlowListName: '',
                FlowId: 0,
                StateId: 0,
            };
        }

        return this.CreateDefaultPlayFlowFor(this.Names[0]);
    }
}

export const flowListOp = new FlowListOp();
