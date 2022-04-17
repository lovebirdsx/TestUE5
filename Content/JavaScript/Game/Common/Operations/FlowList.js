"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowListOp = exports.flowListContext = exports.EFlowListAction = void 0;
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const File_1 = require("../../../Common/File");
const Log_1 = require("../../../Common/Log");
const UeHelper_1 = require("../../../Common/UeHelper");
const Util_1 = require("../../../Common/Util");
const Action_1 = require("../../Flow/Action");
const Config_1 = require("../Config");
const FlowListCsv_1 = require("../CsvConfig/FlowListCsv");
const TextListCsv_1 = require("../CsvConfig/TextListCsv");
const EditorContext_1 = require("../EditorContext");
var EFlowListAction;
(function (EFlowListAction) {
    EFlowListAction[EFlowListAction["GenText"] = 0] = "GenText";
    EFlowListAction[EFlowListAction["ModifyText"] = 1] = "ModifyText";
})(EFlowListAction = exports.EFlowListAction || (exports.EFlowListAction = {}));
exports.flowListContext = (0, EditorContext_1.createEditorContext)();
function getFlowListFiles() {
    const dir = Config_1.gameConfig.FlowListDir;
    const array = (0, ue_1.NewArray)(ue_1.BuiltinString);
    ue_1.MyFileHelper.FindFiles((0, puerts_1.$ref)(array), dir, 'csv');
    const files = (0, UeHelper_1.toTsArray)(array);
    const flowListFiles = files.filter((file) => {
        const fileName = (0, File_1.getFileName)(file);
        return fileName.startsWith(Config_1.gameConfig.FlowListPrefix);
    });
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    flowListFiles.sort();
    return flowListFiles;
}
const MAX_TEXT_ID = 1e8;
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
    Create() {
        return {
            VersionNum: Action_1.FLOW_LIST_VERSION,
            TextGenId: 1,
            FlowGenId: 1,
            Flows: [],
            Texts: {},
        };
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
            (0, UeHelper_1.errorbox)(`打开流程配置文件失败:\n${path}\n${Log_1.error}`);
            row = null;
        }
        if (!row) {
            flowList = this.Create();
        }
        else {
            flowList = this.Parse(row.Json);
            this.LoadTextList(flowList, path);
        }
        return flowList;
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
    GetPath(name) {
        const nameId = this.Names.indexOf(name);
        if (nameId < 0) {
            throw new Error(`Can not find flowlist for [${name}]`);
        }
        return this.Files[nameId];
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
    GenTextKey(name) {
        return BigInt((0, Util_1.calHash)(name) * MAX_TEXT_ID);
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
    ModifyText(flowList, textId, text) {
        flowList.Texts[textId] = text;
    }
}
exports.flowListOp = new FlowListOp();
//# sourceMappingURL=FlowList.js.map