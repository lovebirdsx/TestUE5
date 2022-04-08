"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowListOp = exports.flowListContext = exports.EFlowListAction = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const ue_1 = require("ue");
const Action_1 = require("../../../Game/Flow/Action");
const Common_1 = require("../../Common/Common");
const FlowListCsv_1 = require("../../Common/CsvConfig/FlowListCsv");
const TextListCsv_1 = require("../../Common/CsvConfig/TextListCsv");
const EditorContext_1 = require("../../Common/EditorContext");
const File_1 = require("../../Common/File");
const Log_1 = require("../../Common/Log");
const Util_1 = require("../../Common/Util");
const Flow_1 = require("./Flow");
const State_1 = require("./State");
var EFlowListAction;
(function (EFlowListAction) {
    EFlowListAction[EFlowListAction["GenText"] = 0] = "GenText";
    EFlowListAction[EFlowListAction["ModifyText"] = 1] = "ModifyText";
})(EFlowListAction = exports.EFlowListAction || (exports.EFlowListAction = {}));
exports.flowListContext = (0, EditorContext_1.createEditorContext)();
const FLOW_EDITOR_SAVE_BASE = 'FlowEditor';
const MAX_TEXT_ID = 1e8;
class FlowListOp {
    static Create() {
        return {
            VersionNum: Action_1.FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
    }
    static CreateText(flowList, text) {
        if (flowList.TextGenId >= MAX_TEXT_ID) {
            (0, Log_1.error)(`文本id已经超过最大值${MAX_TEXT_ID}`);
            return flowList.TextGenId;
        }
        const textId = flowList.TextGenId;
        flowList.Texts[textId] = text;
        flowList.TextGenId++;
        return textId;
    }
    static RemoveText(flowList, textId) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
    }
    static ModifyText(flowList, textId, text) {
        flowList.Texts[textId] = text;
    }
    static CreateFlow(flowList) {
        const flow = {
            Id: flowList.FlowGenId,
            StateGenId: 1,
            Name: `剧情${flowList.FlowGenId}`,
            States: [],
        };
        return flow;
    }
    static Parse(content) {
        if (!content) {
            return undefined;
        }
        return JSON.parse(content);
    }
    static Fix(flowList, versionTo) {
        const versionFrom = flowList.VersionNum;
        if (versionFrom === versionTo) {
            return;
        }
        if (!flowList.Texts) {
            flowList.Texts = {};
            flowList.TextGenId = 0;
        }
        flowList.Flows.forEach((flow) => {
            Flow_1.FlowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
    }
    static LoadEditor(path) {
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
    static MergeEditorToConfig(config, editor) {
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
    static GetTextListPath(configPath) {
        return `${(0, File_1.getDir)(configPath)}/Text_${(0, File_1.getFileName)(configPath)}`;
    }
    static LoadTextList(flowList, path) {
        const csvPath = this.GetTextListPath(path);
        const csv = new TextListCsv_1.TextListCsvLoader();
        const rows = csv.Load(csvPath);
        const texts = {};
        if (rows) {
            rows.forEach((row) => {
                texts[row.Id] = row.Text;
            });
            (0, Log_1.log)(`load text csv from: ${csvPath}`);
        }
        else {
            (0, Log_1.warn)(`load text csv failed: ${csvPath}`);
        }
        flowList.Texts = texts;
    }
    static GenTextKey(name) {
        return BigInt((0, Util_1.calHash)(name) * MAX_TEXT_ID);
    }
    static SaveTextList(flowList, path) {
        const rows = [];
        const flowListId = (0, File_1.getFileNameWithOutExt)(path);
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
        const csv = new TextListCsv_1.TextListCsvLoader();
        csv.Save(rows, csvPath);
        (0, Log_1.log)(`save text csv to: ${csvPath}`);
    }
    static Load(path) {
        let row = null;
        let flowList = null;
        try {
            const flowListCsv = new FlowListCsv_1.FlowListCsvLoader();
            row = flowListCsv.LoadOne(path);
        }
        catch (err) {
            (0, Log_1.error)(err);
            (0, Common_1.errorbox)(`打开流程配置文件失败:\n${path}\n${Log_1.error}`);
            row = null;
        }
        if (!row) {
            flowList = this.Create();
        }
        else {
            flowList = this.Parse(row.Json);
            const editor = this.LoadEditor(path);
            this.MergeEditorToConfig(flowList, editor);
            this.LoadTextList(flowList, path);
            if (flowList.VersionNum !== Action_1.FLOW_LIST_VERSION) {
                this.Fix(flowList, Action_1.FLOW_LIST_VERSION);
            }
        }
        return flowList;
    }
    static SaveConfig(flowList, path) {
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
    static GetEditorSavePath(configPath) {
        return ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, `${FLOW_EDITOR_SAVE_BASE}/${(0, File_1.getFileNameWithOutExt)(configPath)}.json`);
    }
    static SaveEditor(flowList, path) {
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
    static ForeachActions(flowList, actionCb) {
        flowList.Flows.forEach((flow) => {
            flow.States.forEach((state) => {
                State_1.StateOp.ForeachActions(state, actionCb);
            });
        });
    }
    // 移除flowList中不存在的TextID,返回移除的数量
    static FormatTexts(flowList) {
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
    static Save(flowList, path) {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
    }
}
exports.FlowListOp = FlowListOp;
//# sourceMappingURL=FlowList.js.map