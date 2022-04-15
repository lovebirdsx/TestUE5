"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowListOp = exports.flowListContext = exports.EFlowListAction = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Action_1 = require("../../../Game/Flow/Action");
const ConfigFile_1 = require("../../FlowEditor/ConfigFile");
const Common_1 = require("../Common");
const FlowListCsv_1 = require("../CsvConfig/FlowListCsv");
const TextListCsv_1 = require("../CsvConfig/TextListCsv");
const EditorContext_1 = require("../EditorContext");
const File_1 = require("../File");
const Log_1 = require("../Log");
const Util_1 = require("../Util");
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
function getFlowListFiles() {
    const dir = ConfigFile_1.ConfigFile.FlowListDir;
    const array = (0, ue_1.NewArray)(ue_1.BuiltinString);
    ue_1.MyFileHelper.FindFiles((0, puerts_1.$ref)(array), dir, 'csv');
    const files = (0, Common_1.toTsArray)(array);
    const flowListFiles = files.filter((file) => {
        const fileName = (0, File_1.getFileName)(file);
        return fileName.startsWith(ConfigFile_1.ConfigFile.FlowListPrefix);
    });
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    flowListFiles.sort();
    return flowListFiles;
}
class FlowListOp {
    Names;
    Files;
    constructor() {
        this.RefreshCache();
    }
    RefreshCache() {
        this.Files = getFlowListFiles();
        this.Names = this.Files.map((file) => {
            return (0, File_1.getFileNameWithOutExt)(file);
        });
    }
    Create() {
        return {
            VersionNum: Action_1.FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
    }
    CreateText(flowList, text) {
        if (flowList.TextGenId >= MAX_TEXT_ID) {
            (0, Log_1.error)(`文本id已经超过最大值${MAX_TEXT_ID}`);
            return flowList.TextGenId;
        }
        const textId = flowList.TextGenId;
        flowList.Texts[textId] = text;
        flowList.TextGenId++;
        return textId;
    }
    RemoveText(flowList, textId) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete flowList.Texts[textId];
    }
    ModifyText(flowList, textId, text) {
        flowList.Texts[textId] = text;
    }
    CreateFlow(flowList) {
        const flow = {
            Id: flowList.FlowGenId,
            StateGenId: 1,
            Name: `剧情${flowList.FlowGenId}`,
            States: [],
        };
        return flow;
    }
    Parse(content) {
        if (!content) {
            return undefined;
        }
        return JSON.parse(content);
    }
    Check(flowlist, errorMessages) {
        let errorCount = 0;
        flowlist.Flows.forEach((flow) => {
            errorCount += Flow_1.flowOp.Check(flow, errorMessages);
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
            Flow_1.flowOp.Fix(flow, versionFrom, versionTo);
        });
        flowList.VersionNum = versionTo;
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
    GetTextListPath(configPath) {
        return `${(0, File_1.getDir)(configPath)}/Text_${(0, File_1.getFileName)(configPath)}`;
    }
    LoadTextList(flowList, path) {
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
    GenTextKey(name) {
        return BigInt((0, Util_1.calHash)(name) * MAX_TEXT_ID);
    }
    SaveTextList(flowList, path) {
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
    GetPath(name) {
        const nameId = this.Names.indexOf(name);
        if (nameId < 0) {
            throw new Error(`Can not find flowlist for [${name}]`);
        }
        return this.Files[nameId];
    }
    LoadByName(name) {
        return this.Load(this.GetPath(name));
    }
    Load(path) {
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
    Save(flowList, path) {
        this.SaveConfig(flowList, path);
        this.SaveEditor(flowList, path);
    }
    GetFlowNames(flowList) {
        return flowList.Flows.map((flow) => flow.Name);
    }
    GetFlowName(flowList, flowId) {
        const flow = flowList.Flows.find((flow) => flow.Id === flowId);
        return flow !== undefined ? flow.Name : '';
    }
    GetFlowId(flowList, flowName) {
        const flow = flowList.Flows.find((flow) => flow.Name === flowName);
        return flow !== undefined ? flow.Id : 0;
    }
    CreateDefaultPlayFlowFor(flowListName) {
        const flowList = this.LoadByName(flowListName);
        const flow = flowList.Flows.length > 0 ? flowList.Flows[0] : null;
        const state = flow && flow.States.length > 0 ? flow.States[0] : null;
        return {
            FlowListName: flowListName,
            FlowId: flow ? flow.Id : 0,
            StateId: state ? state.Id : 0,
        };
    }
    CreateDefaultPlayFlow() {
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
exports.flowListOp = new FlowListOp();
//# sourceMappingURL=FlowList.js.map