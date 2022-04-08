/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { EFileRoot, MyFileHelper } from 'ue';

import {
    FLOW_LIST_VERSION,
    IActionInfo,
    IFlowInfo,
    IFlowListInfo,
    IShowOption,
    IShowTalk,
} from '../../../Game/Flow/Action';
import { errorbox } from '../../Common/Common';
import { FlowListCsvLoader, IFlowListRow } from '../../Common/CsvConfig/FlowListCsv';
import { TextListCsvLoader, TextRow } from '../../Common/CsvConfig/TextListCsv';
import { Context, createEditorContext } from '../../Common/EditorContext';
import { getDir, getFileName, getFileNameWithOutExt } from '../../Common/File';
import { error, log, warn } from '../../Common/Log';
import { calHash } from '../../Common/Util';
import { FlowOp } from './Flow';
import { StateOp } from './State';

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

export class FlowListOp {
    public static Create(): IFlowListInfo {
        return {
            VersionNum: FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
    }

    public static CreateText(flowList: IFlowListInfo, text: string): number {
        if (flowList.TextGenId >= MAX_TEXT_ID) {
            error(`文本id已经超过最大值${MAX_TEXT_ID}`);
            return flowList.TextGenId;
        }
        const textId = flowList.TextGenId;
        flowList.Texts[textId] = text;
        flowList.TextGenId++;
        return textId;
    }

    public static RemoveText(flowList: IFlowListInfo, textId: number): void {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
    }

    public static ModifyText(flowList: IFlowListInfo, textId: number, text: string): void {
        flowList.Texts[textId] = text;
    }

    public static CreateFlow(flowList: IFlowListInfo): IFlowInfo {
        const flow: IFlowInfo = {
            Id: flowList.FlowGenId,
            StateGenId: 1,
            Name: `剧情${flowList.FlowGenId}`,
            States: [],
        };
        return flow;
    }

    public static Parse(content: string): IFlowListInfo {
        if (!content) {
            return undefined;
        }

        return JSON.parse(content) as IFlowListInfo;
    }

    public static Fix(flowList: IFlowListInfo, versionTo: number): void {
        const versionFrom = flowList.VersionNum;
        if (versionFrom === versionTo) {
            return;
        }

        if (!flowList.Texts) {
            flowList.Texts = {};
            flowList.TextGenId = 0;
        }

        flowList.Flows.forEach((flow) => {
            FlowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
    }

    private static LoadEditor(path: string): object {
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
    private static MergeEditorToConfig(
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

    private static GetTextListPath(configPath: string): string {
        return `${getDir(configPath)}/Text_${getFileName(configPath)}`;
    }

    public static LoadTextList(flowList: IFlowListInfo, path: string): void {
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

    private static GenTextKey(name: string): bigint {
        return BigInt(calHash(name) * MAX_TEXT_ID);
    }

    public static SaveTextList(flowList: IFlowListInfo, path: string): void {
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

    public static Load(path: string): IFlowListInfo {
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

    private static SaveConfig(flowList: IFlowListInfo, path: string): void {
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

    private static GetEditorSavePath(configPath: string): string {
        return MyFileHelper.GetPath(
            EFileRoot.Save,
            `${FLOW_EDITOR_SAVE_BASE}/${getFileNameWithOutExt(configPath)}.json`,
        );
    }

    private static SaveEditor(flowList: IFlowListInfo, path: string): void {
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

    private static ForeachActions(
        flowList: IFlowListInfo,
        actionCb: (action: IActionInfo) => void,
    ): void {
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                StateOp.ForeachActions(state, actionCb);
            });
        });
    }

    // 移除flowList中不存在的TextID,返回移除的数量
    public static FormatTexts(flowList: IFlowListInfo): number {
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

    public static Save(flowList: IFlowListInfo, path: string): void {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
    }
}
