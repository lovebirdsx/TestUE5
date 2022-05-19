/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { EFileRoot, MyFileHelper } from 'ue';

import { getFileNameWithOutExt } from '../../../Common/File';
import { error, log, warn } from '../../../Common/Log';
import { FlowListCsvLoader } from '../../../Game/Common/CsvConfig/FlowListCsv';
import { TextListCsvLoader, TextRow } from '../../../Game/Common/CsvConfig/TextListCsv';
import { flowOp } from '../../../Game/Common/Operations/Flow';
import { flowListOp } from '../../../Game/Common/Operations/FlowList';
import { stateOp } from '../../../Game/Common/Operations/State';
import {
    IActionInfo,
    IFlowListInfo,
    IPlayFlow,
    IShowCenterText,
    IShowOption,
    IShowTalk,
} from '../../../Game/Flow/Action';
import { mergeEditorToConfig } from '../Util';

const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';

class EditorFlowListOp {
    public Check(flowList: IFlowListInfo, errorMessages: string[]): number {
        let errorCount = 0;
        flowList.Flows.forEach((flow) => {
            errorCount += flowOp.Check(flow, errorMessages);
        });

        const textIdMap: Set<number> = new Set();
        const checkTextId = (id: number): void => {
            if (textIdMap.has(id)) {
                errorMessages.push(`重复的Text[${id}] ${flowList.Texts[id].Text}`);
                errorCount++;
            } else {
                textIdMap.add(id);
            }
        };

        // 检查重复的文本id
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                stateOp.ForeachActions(state, (action) => {
                    switch (action.Name) {
                        case 'ShowTalk': {
                            const showTalk = action.Params as IShowTalk;
                            showTalk.TalkItems.forEach((talkItem) => {
                                checkTextId(talkItem.TextId);
                                talkItem.Options?.forEach((option) => {
                                    checkTextId(option.TextId);
                                });
                            });
                            break;
                        }
                        case 'ShowCenterText': {
                            const show = action.Params as IShowCenterText;
                            checkTextId(show.TextId);
                            break;
                        }
                        case 'ShowOption': {
                            const show = action.Params as IShowOption;
                            checkTextId(show.TextId);
                            break;
                        }
                        default:
                            break;
                    }
                });
            });
        });
        return errorCount;
    }

    public Fix(flowList: IFlowListInfo): void {
        if (!flowList.Texts) {
            flowList.Texts = {};
            flowList.TextGenId = 0;
        }

        flowList.Flows.forEach((flow) => {
            flowOp.Fix(flow);
        });

        // 修复重复的文本id
        const textIdMap: Set<number> = new Set();
        const tryFixTextId = (textContainer: { TextId: number }): void => {
            const textId = textContainer.TextId;
            if (textIdMap.has(textId)) {
                const text = flowList.Texts[textId].Text;
                textContainer.TextId = flowListOp.CreateText(flowList, text);
                warn(`修复文本id:[${textId}]=>[${textContainer.TextId}] ${text}`);
            } else {
                textIdMap.add(textId);
            }
        };

        // 检查重复的文本id
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                stateOp.ForeachActions(state, (action) => {
                    switch (action.Name) {
                        case 'ShowTalk': {
                            const showTalk = action.Params as IShowTalk;
                            showTalk.TalkItems.forEach((talkItem) => {
                                tryFixTextId(talkItem);
                                talkItem.Options?.forEach((option) => {
                                    tryFixTextId(option);
                                });
                            });
                            break;
                        }
                        case 'ShowCenterText': {
                            const show = action.Params as IShowCenterText;
                            tryFixTextId(show);
                            break;
                        }
                        case 'ShowOption': {
                            const show = action.Params as IShowOption;
                            tryFixTextId(show);
                            break;
                        }
                        default:
                            break;
                    }
                });
            });
        });
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

    public SaveEditor(flowList: IFlowListInfo, path: string): void {
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
        mergeEditorToConfig(
            flowList as unknown as Record<string, unknown>,
            editor as Record<string, unknown>,
        );

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
            const text = flowList.Texts[key];
            rows.push({
                Key: keyBase + BigInt(id),
                FlowListId: flowListId,
                Id: id,
                Text: text.Text,
                Sound: text.Sound,
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

    public FoldForPlayFlow(flowList: IFlowListInfo, playFlow: IPlayFlow): void {
        const flowId = playFlow.FlowId;
        const stateId = playFlow.StateId;
        flowList.Flows.forEach((flow) => {
            flow._folded = flow.Id !== flowId;
            if (flow.Id === flowId) {
                flow.States.forEach((state) => {
                    state._folded = state.Id !== stateId;
                });
            }
        });
    }
}

export const editorFlowListOp = new EditorFlowListOp();
