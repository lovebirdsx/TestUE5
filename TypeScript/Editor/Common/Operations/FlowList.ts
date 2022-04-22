/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { EFileRoot, MyFileHelper } from 'ue';

import { getFileNameWithOutExt } from '../../../Common/File';
import { error, log } from '../../../Common/Log';
import { FlowListCsvLoader } from '../../../Game/Common/CsvConfig/FlowListCsv';
import { TextListCsvLoader, TextRow } from '../../../Game/Common/CsvConfig/TextListCsv';
import { flowListOp } from '../../../Game/Common/Operations/FlowList';
import {
    FLOW_LIST_VERSION,
    IActionInfo,
    IFlowListInfo,
    IShowCenterText,
    IShowOption,
    IShowTalk,
} from '../../../Game/Flow/Action';
import { editorFlowOp } from './Flow';
import { stateOp } from './State';

const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';

class EditorFlowListOp {
    public Check(flowlist: IFlowListInfo, errorMessages: string[]): number {
        let errorCount = 0;
        flowlist.Flows.forEach((flow) => {
            errorCount += editorFlowOp.Check(flow, errorMessages);
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
            editorFlowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
    }

    public RemoveText(flowList: IFlowListInfo, textId: number): void {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
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

    public Load(path: string): IFlowListInfo {
        const flowList = flowListOp.Load(path);
        const editor = this.LoadEditor(path);
        this.MergeEditorToConfig(
            flowList as unknown as Record<string, unknown>,
            editor as Record<string, unknown>,
        );

        if (flowList.VersionNum !== FLOW_LIST_VERSION) {
            this.Fix(flowList, FLOW_LIST_VERSION);
        }

        return flowList;
    }

    public GenNewFlowListFile(): string {
        const newPath = flowListOp.GenNewFlowListPath();
        const flowListInfo = flowListOp.Create();
        this.Save(flowListInfo, newPath);
        flowListOp.RefreshCache();
        return newPath;
    }

    public Save(flowList: IFlowListInfo, path: string): void {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
    }

    public SaveTextList(flowList: IFlowListInfo, path: string): void {
        const rows: TextRow[] = [];
        const flowListId = getFileNameWithOutExt(path);
        const keyBase = flowListOp.GenTextKey(flowListId);
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
        const csvPath = flowListOp.GetTextListPath(path);
        const csv = new TextListCsvLoader();
        csv.Save(rows, csvPath);

        log(`save text csv to: ${csvPath}`);
    }

    public ForeachActions(flowList: IFlowListInfo, actionCb: (action: IActionInfo) => void): void {
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
            } else if (action.Name === 'ShowCenterText') {
                const showCenterText = action.Params as IShowCenterText;
                const textId = showCenterText.TextId;
                if (textIds[textId]) {
                    error(`Duplicated textid ${textId}`);
                    return;
                }
                textIds[textId] = true;
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
}

export const editorFlowListOp = new EditorFlowListOp();
