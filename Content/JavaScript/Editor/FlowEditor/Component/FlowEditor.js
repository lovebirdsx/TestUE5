"use strict";
/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowEditor = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Common_1 = require("../../../Editor/Common/Common");
const Color_1 = require("../../../Editor/Common/Component/Color");
const CommonComponent_1 = require("../../../Editor/Common/Component/CommonComponent");
const ErrorBoundary_1 = require("../../../Editor/Common/Component/ErrorBoundary");
const KeyCommands_1 = require("../../../Editor/Common/KeyCommands");
const FlowList_1 = require("../../Common/Component/FlowList");
const Log_1 = require("../../Common/Log");
const Util_1 = require("../../Common/Util");
const ConfigFile_1 = require("../ConfigFile");
const FlowList_2 = require("../Operations/FlowList");
const TalkListTool_1 = require("../TalkListTool");
function canUndo(state) {
    return state.StepId > 0 && state.Histories.length > 0;
}
function canRedo(state) {
    return state.StepId < state.Histories.length - 1;
}
class FlowEditor extends React.Component {
    ConfigFile;
    CommandHandles = [];
    AutoSaveHander;
    LastModifyTime;
    TimeSecond;
    constructor(props) {
        super(props);
        this.ConfigFile = new ConfigFile_1.ConfigFile();
        this.ConfigFile.Load();
        this.state = this.LoadState();
    }
    RegKeyCommands() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
        this.CommandHandles.push(kc.AddCommandCallback('SaveAs', this.SaveByDialog));
        this.CommandHandles.push(kc.AddCommandCallback('Open', this.OpenByDialog));
        this.CommandHandles.push(kc.AddCommandCallback('Redo', this.Redo));
        this.CommandHandles.push(kc.AddCommandCallback('Undo', this.Undo));
        this.CommandHandles.push(kc.AddCommandCallback('ClearConsole', this.ClearConsole));
        this.CommandHandles.push(kc.AddCommandCallback('ToggleDevelop', this.ToggleDevelop));
    }
    RemKeyCommands() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.forEach((handle) => {
            kc.RemoveCommandCallback(handle);
        });
    }
    StartAutoSave() {
        const autoSaveInterval = 1000;
        this.AutoSaveHander = setInterval(this.DetectAutoSave, autoSaveInterval);
        this.TimeSecond = 0;
    }
    DetectAutoSave = () => {
        this.TimeSecond++;
        if (!this.NeedSave()) {
            return;
        }
        if (this.TimeSecond - this.LastModifyTime < ConfigFile_1.ConfigFile.AutoSaveInterval) {
            return;
        }
        (0, Log_1.log)('Auto save triggered');
        this.Save();
    };
    StopAutoSave() {
        clearInterval(this.AutoSaveHander);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        this.RegKeyCommands();
        this.StartAutoSave();
        // 由于子Component中会访问 FlowListContext, 所以不能在componentDidMout中调用
        // 没有在componentWillMount中调用,是因为会报警告
        // 参考 https://github.com/facebook/react/issues/5737
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        FlowList_2.flowListContext.Set(() => this.FlowList, (flowList, type) => {
            if (type === FlowList_2.EFlowListAction.ModifyText) {
                this.ModifyFlowList(flowList, 'normal');
            }
            else if (type === FlowList_2.EFlowListAction.GenText) {
                this.ModifyFlowList(flowList, 'normal', true);
            }
        });
    }
    ComponentWillUnmount() {
        this.RemKeyCommands();
        this.StopAutoSave();
        FlowList_2.flowListContext.Clear();
    }
    get FlowList() {
        return this.state.Histories[this.state.StepId];
    }
    LoadState(path) {
        // 保存编辑器配置
        if (path) {
            this.ConfigFile.FlowConfigPath = path;
            this.ConfigFile.Save();
        }
        // 加载剧情配置
        const flowListConfig = FlowList_2.FlowListOp.Load(this.ConfigFile.FlowConfigPath);
        return {
            Histories: [flowListConfig],
            StepId: 0,
            Saved: flowListConfig,
            IsDevelop: this.ConfigFile.IsDevelop,
        };
    }
    Open(path) {
        this.setState(this.LoadState(path));
    }
    OpenFlowListConfigDir = () => {
        (0, Util_1.openDirOfFile)(this.ConfigFile.FlowConfigPath);
    };
    OpenByDialog = () => {
        const openPath = (0, Common_1.openLoadCsvFileDialog)(this.ConfigFile.FlowConfigPath);
        if (!openPath) {
            return;
        }
        if (this.NeedSave()) {
            const result = ue_1.EditorOperations.ShowMessage(ue_1.EMsgType.YesNoCancel, '当前配置已经修改,需要保存吗?');
            if (result === ue_1.EMsgResult.Cancel) {
                return;
            }
            else if (result === ue_1.EMsgResult.Yes) {
                this.Save();
            }
        }
        if (openPath !== this.ConfigFile.FlowConfigPath) {
            this.Open(openPath);
        }
    };
    Save = () => {
        this.ConfigFile.Save();
        // 此处不能直接使用this.flowList,因为会修改其内容
        // React修改state中的内容,只能在setState中进行
        const flowListToSave = (0, immer_1.default)(this.FlowList, (draft) => {
            const removeCount = FlowList_2.FlowListOp.FormatTexts(draft);
            if (removeCount > 0) {
                (0, Log_1.log)(`remove ${removeCount} text ids`);
            }
        });
        FlowList_2.FlowListOp.Save(flowListToSave, this.ConfigFile.FlowConfigPath);
        this.setState({
            Saved: this.FlowList,
        });
    };
    NeedSave() {
        return this.FlowList !== this.state.Saved;
    }
    SaveByDialog = () => {
        const openPath = (0, Common_1.openSaveCsvFileDialog)(this.ConfigFile.FlowConfigPath);
        if (!openPath) {
            return;
        }
        if (openPath !== this.ConfigFile.FlowConfigPath) {
            this.ConfigFile.FlowConfigPath = openPath;
            this.Save();
            this.Open(openPath);
        }
        else {
            this.Save();
        }
    };
    RecordState(state, flowConfig, draft) {
        draft.Histories.splice(state.StepId + 1);
        draft.Histories.push(flowConfig);
        if (draft.Histories.length > ConfigFile_1.ConfigFile.MaxHistory) {
            draft.Histories.shift();
            draft.StepId = ConfigFile_1.ConfigFile.MaxHistory - 1;
        }
        else {
            draft.StepId = state.StepId + 1;
        }
        this.LastModifyTime = this.TimeSecond;
    }
    Undo = () => {
        this.setState((state) => (0, immer_1.default)(state, (draft) => {
            if (!canUndo(state)) {
                return;
            }
            draft.StepId = state.StepId - 1;
        }));
    };
    Redo = () => {
        this.setState((state) => (0, immer_1.default)(state, (draft) => {
            if (!canRedo(state)) {
                return;
            }
            draft.StepId = state.StepId + 1;
        }));
    };
    GetUndoStateStr = () => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };
    Export = () => {
        const path = (0, Common_1.openSaveCsvFileDialog)(this.ConfigFile.CsvExportPath);
        if (!path) {
            return;
        }
        this.ConfigFile.CsvExportPath = path;
        this.ConfigFile.Save();
        TalkListTool_1.TalkListTool.Export(this.FlowList, path);
        (0, Log_1.log)(`Export flowlist to ${path} succeed`);
    };
    Import = () => {
        const path = (0, Common_1.openLoadCsvFileDialog)(this.ConfigFile.CsvImportPath);
        if (!path) {
            return;
        }
        this.ConfigFile.CsvImportPath = path;
        this.ConfigFile.Save();
        let listInfo = null;
        try {
            listInfo = TalkListTool_1.TalkListTool.Import(path);
        }
        catch (e) {
            (0, Common_1.msgbox)(`导入失败:${e}`);
            return;
        }
        this.ModifyFlowList(listInfo, 'normal');
        (0, Log_1.log)(`Import flowlist from ${path} succeed`);
    };
    ModifyFlowList = (newConfig, type, noRecord) => {
        if (noRecord || type === 'fold') {
            this.setState((state) => (0, immer_1.default)(state, (draft) => {
                draft.Histories[draft.StepId] = newConfig;
                // 修正已经保存的点，避免不必要的状态
                if (state.Saved === state.Histories[state.StepId]) {
                    draft.Saved = newConfig;
                }
            }));
        }
        else {
            this.setState((state) => (0, immer_1.default)(state, (draft) => {
                this.RecordState(state, newConfig, draft);
            }));
        }
    };
    LogHistory = () => {
        ue_1.EditorOperations.ClearLogWindow();
        (0, Log_1.log)(JSON.stringify(this.state.Histories, null, 2));
    };
    LogFlowInfo = () => {
        ue_1.EditorOperations.ClearLogWindow();
        (0, Log_1.log)(JSON.stringify(this.FlowList, null, 2));
    };
    ClearConsole = () => {
        ue_1.EditorOperations.ClearLogWindow();
    };
    ToggleDevelop = () => {
        this.ConfigFile.IsDevelop = !this.ConfigFile.IsDevelop;
        this.ConfigFile.Save();
        this.setState({
            IsDevelop: this.ConfigFile.IsDevelop,
        });
    };
    RenderDevelopElements() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: '导出对话...', OnClick: this.Export, Tip: '导出对话列表到CSV文件中,具体请参考【流程编辑器】使用说明' }),
            React.createElement(CommonComponent_1.Btn, { Text: 'History', OnClick: this.LogHistory }),
            React.createElement(CommonComponent_1.Btn, { Text: 'Flow info', OnClick: this.LogFlowInfo }),
            React.createElement(CommonComponent_1.Btn, { Text: 'Clear Console', OnClick: this.ClearConsole, Tip: `清空控制台 ${(0, KeyCommands_1.getCommandKeyDesc)('ClearConsole')}` }),
            React.createElement(CommonComponent_1.Check, { UnChecked: !ue_1.EditorOperations.GetIfWaitJSDebug(), OnChecked: (checked) => {
                    ue_1.EditorOperations.SetIfWaitJSDebug(checked);
                } }),
            React.createElement(CommonComponent_1.Text, { Text: "Wait Debugger", Tip: "\u7B49\u5F85TS\u7684\u8C03\u8BD5\u5668, \u82E5\u9009\u4E2D, \u5219\u7A0B\u5E8F\u7B49\u5F85, \u76F4\u5230\u8C03\u8BD5\u5668\u8FDE\u63A5\u540E\u624D\u7EE7\u7EED\u6267\u884C" })));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const scrollBoxSlot = {
            Size: { SizeRule: ue_1.ESlateSizeRule.Fill },
        };
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.Border, { BrushColor: (0, Color_1.formatColor)('#060606 ue back') },
                React.createElement(react_umg_1.VerticalBox, null,
                    React.createElement(react_umg_1.HorizontalBox, null,
                        React.createElement(CommonComponent_1.SlotText, { Text: `${this.NeedSave() ? '*' : ''}${this.ConfigFile.FlowConfigPath}`, Tip: "\u5F53\u524D\u6253\u5F00\u7684\u5267\u60C5\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84(\u76F8\u5BF9\u4E8EContent\u76EE\u5F55)" }),
                        React.createElement(CommonComponent_1.Btn, { Text: '目录', OnClick: this.OpenFlowListConfigDir, Tip: '打开配置文件所在目录' })),
                    React.createElement(react_umg_1.HorizontalBox, null,
                        React.createElement(CommonComponent_1.Btn, { Text: '打开...', OnClick: this.OpenByDialog, Tip: (0, KeyCommands_1.getCommandKeyDesc)('Open') }),
                        React.createElement(CommonComponent_1.Btn, { Text: '保存', OnClick: this.Save, Tip: (0, KeyCommands_1.getCommandKeyDesc)('Save') }),
                        React.createElement(CommonComponent_1.Btn, { Text: '另存为...', OnClick: this.SaveByDialog, Tip: (0, KeyCommands_1.getCommandKeyDesc)('SaveAs') }),
                        React.createElement(CommonComponent_1.Btn, { Text: '↻', OnClick: this.Undo, Disabled: !canUndo(this.state), Tip: `撤销 ${(0, KeyCommands_1.getCommandKeyDesc)('Undo')}` }),
                        React.createElement(CommonComponent_1.Text, { Text: this.GetUndoStateStr(), Tip: `回退记录,最大支持${ConfigFile_1.ConfigFile.MaxHistory}个` }),
                        React.createElement(CommonComponent_1.Btn, { Text: '↺', OnClick: this.Redo, Disabled: !canRedo(this.state), Tip: `重做 ${(0, KeyCommands_1.getCommandKeyDesc)('Redo')}` }),
                        React.createElement(CommonComponent_1.Btn, { Text: '导入对话...', OnClick: this.Import, Tip: '从CSV中导入对话配置,具体请参考【流程编辑器】使用说明' })),
                    this.state.IsDevelop && this.RenderDevelopElements())),
            React.createElement(react_umg_1.ScrollBox, { Slot: scrollBoxSlot },
                React.createElement(ErrorBoundary_1.ErrorBoundary, null,
                    React.createElement(FlowList_1.FlowList, { FlowList: this.FlowList, OnModify: this.ModifyFlowList })))));
    }
}
exports.FlowEditor = FlowEditor;
//# sourceMappingURL=FlowEditor.js.map