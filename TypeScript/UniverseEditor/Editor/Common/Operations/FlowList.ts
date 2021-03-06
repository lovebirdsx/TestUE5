/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import { Config } from '../../../Common/Config';
import { FlowListCsvLoader } from '../../../Common/CsvConfig/FlowListCsv';
import { TextListCsvLoader, TextRow } from '../../../Common/CsvConfig/TextListCsv';
import {
    IActionInfo,
    IFlowListInfo,
    IPlayFlow,
    IShowCenterText,
    IShowOption,
    IShowTalk,
} from '../../../Common/Interface/IAction';
import { getFileName, getFileNameWithOutExt, getSavePath } from '../../../Common/Misc/File';
import { error, log, warn } from '../../../Common/Misc/Log';
import { toTsArray } from '../../../Common/Misc/Util';
import { flowListOp } from '../../../Common/Operation/FlowList';
import { mergeEditorToConfig } from '../Util';
import { editorFlowOp } from './Flow';
import { stateOp } from './State';

const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';

function getFlowListFiles(): string[] {
    const dir = Config.FlowListDir;
    const array = NewArray(BuiltinString);
    MyFileHelper.FindFiles($ref(array), dir, 'csv');
    const files = toTsArray(array);
    const flowListFiles = files.filter((file) => {
        const fileName = getFileName(file);
        return fileName.startsWith(Config.FlowListPrefix);
    });
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    flowListFiles.sort();
    return flowListFiles;
}

class EditorFlowListOp {
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
            const name = `${Config.FlowListPrefix}${id++}`;
            if (!this.Names.includes(name)) {
                return `${Config.FlowListDir}/${name}.csv`;
            }
        }
    }

    public GetPath(name: string): string {
        const nameId = this.Names.indexOf(name);
        if (nameId < 0) {
            throw new Error(`Can not find flowlist for [${name}]`);
        }

        return this.Files[nameId];
    }

    public Check(flowList: IFlowListInfo, errorMessages: string[]): number {
        let errorCount = 0;
        flowList.Flows.forEach((flow) => {
            errorCount += editorFlowOp.Check(flow, errorMessages);
        });

        const textIdMap: Set<number> = new Set();
        const checkTextId = (id: number): void => {
            if (textIdMap.has(id)) {
                errorMessages.push(`?????????Text[${id}] ${flowList.Texts[id].Text}`);
                errorCount++;
            } else {
                textIdMap.add(id);
            }
        };

        // ?????????????????????id
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
        }

        flowList.Flows.forEach((flow) => {
            editorFlowOp.Fix(flow);
        });

        // ?????????????????????id
        const textIdMap: Set<number> = new Set();
        const tryFixTextId = (textContainer: { TextId: number }): void => {
            const textId = textContainer.TextId;
            if (textIdMap.has(textId)) {
                const text = flowList.Texts[textId].Text;
                textContainer.TextId = flowListOp.CreateText(flowList, text);
                warn(`????????????id:[${textId}]=>[${textContainer.TextId}] ${text}`);
            } else {
                textIdMap.add(textId);
            }
        };

        // ?????????????????????id
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
        return getSavePath(`${FLOW_EDITOR_SAVE_BASE}/${getFileNameWithOutExt(configPath)}.json`);
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

    public LoadByName(name: string): IFlowListInfo {
        return this.Load(this.GetPath(name));
    }

    public GenNewFlowListFile(): string {
        const newPath = this.GenNewFlowListPath();
        const flowListInfo = flowListOp.Create();
        this.Save(flowListInfo, newPath);
        this.RefreshCache();
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

    // ??????flowList???????????????TextID,?????????????????????
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
