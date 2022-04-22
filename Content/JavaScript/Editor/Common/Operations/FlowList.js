"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editorFlowListOp = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const ue_1 = require("ue");
const File_1 = require("../../../Common/File");
const Log_1 = require("../../../Common/Log");
const FlowListCsv_1 = require("../../../Game/Common/CsvConfig/FlowListCsv");
const TextListCsv_1 = require("../../../Game/Common/CsvConfig/TextListCsv");
const FlowList_1 = require("../../../Game/Common/Operations/FlowList");
const Action_1 = require("../../../Game/Flow/Action");
const Flow_1 = require("./Flow");
const State_1 = require("./State");
const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';
class EditorFlowListOp {
    Check(flowlist, errorMessages) {
        let errorCount = 0;
        flowlist.Flows.forEach((flow) => {
            errorCount += Flow_1.editorFlowOp.Check(flow, errorMessages);
        });
        return errorCount;
    }
    Fix(flowList, versionTo) {
        const versionFrom = flowList.VersionNum;
        if (versionFrom === versionTo) {
            return;
        }
        if (!flowList.Texts) {
            flowList.Texts = {};
            flowList.TextGenId = 0;
        }
        flowList.Flows.forEach((flow) => {
            Flow_1.editorFlowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
    }
    RemoveText(flowList, textId) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
    }
    LoadEditor(path) {
        const abPath = this.GetEditorSavePath(path);
        const content = ue_1.MyFileHelper.Read(abPath);
        if (content) {
            const value = JSON.parse(content);
            if (typeof value === 'object') {
                return value;
            }
        }
        return {};
    }
    // 将编辑器的配置合并到config
    MergeEditorToConfig(config, editor) {
        for (const key in editor) {
            const v1 = config[key];
            const v2 = editor[key];
            if (typeof v2 === 'object') {
                // editor有可能落后于config,从而出现editor中多出的object
                // 由于editor的字段只可能存在于已有的config的object中,故而忽略
                if (typeof v1 === 'object') {
                    config[key] = this.MergeEditorToConfig(v1, v2);
                }
            }
            else {
                if (v1 === undefined) {
                    config[key] = v2;
                }
            }
        }
        return config;
    }
    SaveConfig(flowList, path) {
        const flowListWithOutTexts = (0, immer_1.default)(flowList, (draft) => {
            delete draft.Texts;
        });
        const content = JSON.stringify(flowListWithOutTexts, (key, value) => {
            if (typeof key === 'string' && key.startsWith('_')) {
                return undefined;
            }
            return value;
        }, 2);
        const flowListCsv = new FlowListCsv_1.FlowListCsvLoader();
        flowListCsv.SaveOne({ Id: (0, File_1.getFileNameWithOutExt)(path), Json: content }, path);
        (0, Log_1.log)(`Save flowList config to [${path}]`);
        this.SaveTextList(flowList, path);
    }
    GetEditorSavePath(configPath) {
        return ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, `${FLOW_EDITOR_SAVE_BASE}/${(0, File_1.getFileNameWithOutExt)(configPath)}.json`);
    }
    SaveEditor(flowList, path) {
        const editorSavePath = this.GetEditorSavePath(path);
        const content = JSON.stringify(flowList, (key, value) => {
            if (typeof key === 'string' &&
                key.length > 0 &&
                !key.startsWith('_') &&
                typeof value !== 'object') {
                return undefined;
            }
            return value;
        }, 2);
        if (ue_1.MyFileHelper.Write(editorSavePath, content)) {
            (0, Log_1.log)(`Save flowList editor to [${editorSavePath}]`);
        }
        else {
            (0, Log_1.error)(`Save flowList editor to [${editorSavePath}] failed`);
        }
    }
    Load(path) {
        const flowList = FlowList_1.flowListOp.Load(path);
        const editor = this.LoadEditor(path);
        this.MergeEditorToConfig(flowList, editor);
        if (flowList.VersionNum !== Action_1.FLOW_LIST_VERSION) {
            this.Fix(flowList, Action_1.FLOW_LIST_VERSION);
        }
        return flowList;
    }
    GenNewFlowListFile() {
        const newPath = FlowList_1.flowListOp.GenNewFlowListPath();
        const flowListInfo = FlowList_1.flowListOp.Create();
        this.Save(flowListInfo, newPath);
        FlowList_1.flowListOp.RefreshCache();
        return newPath;
    }
    Save(flowList, path) {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
    }
    SaveTextList(flowList, path) {
        const rows = [];
        const flowListId = (0, File_1.getFileNameWithOutExt)(path);
        const keyBase = FlowList_1.flowListOp.GenTextKey(flowListId);
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
        const csvPath = FlowList_1.flowListOp.GetTextListPath(path);
        const csv = new TextListCsv_1.TextListCsvLoader();
        csv.Save(rows, csvPath);
        (0, Log_1.log)(`save text csv to: ${csvPath}`);
    }
    ForeachActions(flowList, actionCb) {
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                State_1.stateOp.ForeachActions(state, actionCb);
            });
        });
    }
    // 移除flowList中不存在的TextID,返回移除的数量
    FormatTexts(flowList) {
        const textIds = {};
        this.ForeachActions(flowList, (action) => {
            if (action.Name === 'ShowOption') {
                const showOption = action.Params;
                if (textIds[showOption.TextId]) {
                    (0, Log_1.error)(`Duplicated textid ${showOption.TextId}`);
                    return;
                }
                textIds[showOption.TextId] = true;
            }
            else if (action.Name === 'ShowTalk') {
                const showTalk = action.Params;
                showTalk.TalkItems.forEach((talkItem) => {
                    const { TextId: textId } = talkItem;
                    if (textIds[textId]) {
                        (0, Log_1.error)(`Duplicated textid ${textId}`);
                        return;
                    }
                    textIds[textId] = true;
                    if (talkItem.Options) {
                        talkItem.Options.forEach((option) => {
                            const { TextId: textId } = option;
                            if (textIds[textId]) {
                                (0, Log_1.error)(`Duplicated textid ${textId}`);
                                return;
                            }
                            textIds[textId] = true;
                        });
                    }
                });
            }
            else if (action.Name === 'ShowCenterText') {
                const showCenterText = action.Params;
                const textId = showCenterText.TextId;
                if (textIds[textId]) {
                    (0, Log_1.error)(`Duplicated textid ${textId}`);
                    return;
                }
                textIds[textId] = true;
            }
        });
        const idsToRemove = [];
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
exports.editorFlowListOp = new EditorFlowListOp();
//# sourceMappingURL=FlowList.js.map