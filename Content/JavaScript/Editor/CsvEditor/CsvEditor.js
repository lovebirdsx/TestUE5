"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvEditor = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Color_1 = require("../Common/Component/Color");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
const CsvView_1 = require("../Common/Component/CsvView");
const KeyCommands_1 = require("../Common/KeyCommands");
const Log_1 = require("../Common/Log");
const Util_1 = require("../Common/Util");
const ConfigFile_1 = require("../FlowEditor/ConfigFile");
const CsvRegistry_1 = require("./CsvRegistry");
function canUndo(state) {
    return state.StepId > 0 && state.Histories.length > 0;
}
function canRedo(state) {
    return state.StepId < state.Histories.length - 1;
}
class CsvEditor extends React.Component {
    ConfigFile;
    CommandHandles = [];
    AutoSaveHander;
    LastModifyTime;
    TimeSecond;
    constructor(props) {
        super(props);
        this.ConfigFile = new ConfigFile_1.ConfigFile();
        this.ConfigFile.Load();
        this.state = this.LoadInitState();
    }
    LoadInitState() {
        const name = this.ConfigFile.CsvName;
        const csvState = {
            Name: name,
            Csv: CsvRegistry_1.csvRegistry.Load(name),
        };
        return {
            StepId: 0,
            Histories: [csvState],
            LastLoadedCsvState: csvState,
        };
    }
    get CurrentCsvState() {
        const state = this.state;
        return state.Histories[state.StepId];
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
    RegKeyCommands() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
        this.CommandHandles.push(kc.AddCommandCallback('Redo', this.Redo));
        this.CommandHandles.push(kc.AddCommandCallback('Undo', this.Undo));
    }
    RemKeyCommands() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.forEach((handle) => {
            kc.RemoveCommandCallback(handle);
        });
    }
    StopAutoSave() {
        clearInterval(this.AutoSaveHander);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        this.RegKeyCommands();
        this.StartAutoSave();
    }
    ComponentWillUnmount() {
        this.RemKeyCommands();
        this.StopAutoSave();
    }
    RecordCsvState(csvState, isSaved) {
        const newEditorState = (0, immer_1.default)(this.state, (draft) => {
            if (draft.StepId < draft.Histories.length - 1) {
                draft.Histories.splice(draft.StepId + 1);
            }
            draft.Histories.push(csvState);
            draft.StepId++;
            if (draft.Histories.length > ConfigFile_1.ConfigFile.MaxHistory) {
                draft.Histories.shift();
                draft.StepId--;
            }
            if (isSaved) {
                draft.LastLoadedCsvState = csvState;
            }
        });
        this.setState(newEditorState);
        this.LastModifyTime = this.TimeSecond;
    }
    OnModifyCsv = (csv) => {
        this.RecordCsvState({
            Name: this.CurrentCsvState.Name,
            Csv: csv,
        }, false);
    };
    SaveImpl() {
        const state = this.CurrentCsvState;
        CsvRegistry_1.csvRegistry.Save(state.Name, state.Csv);
    }
    Save = () => {
        if (!this.NeedSave()) {
            return;
        }
        this.SaveImpl();
        this.setState({
            LastLoadedCsvState: this.CurrentCsvState,
        });
    };
    SetStep(newStepId) {
        this.setState((state) => {
            const oldCsvState = state.Histories[state.StepId];
            const newCsvState = state.Histories[newStepId];
            return {
                StepId: newStepId,
                LastLoadedCsvState: oldCsvState.Name !== newCsvState.Name ? newCsvState : state.LastLoadedCsvState,
            };
        });
    }
    Undo = () => {
        if (!canUndo(this.state)) {
            return;
        }
        this.SetStep(this.state.StepId - 1);
    };
    Redo = () => {
        if (!canRedo(this.state)) {
            return;
        }
        this.SetStep(this.state.StepId + 1);
    };
    NeedSave() {
        return this.CurrentCsvState !== this.state.LastLoadedCsvState;
    }
    GetUndoStateStr = () => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };
    RenderPath() {
        const path = CsvRegistry_1.csvRegistry.GetPath(this.CurrentCsvState.Name);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.SlotText, { Text: this.NeedSave() ? '*' + path : path }),
            React.createElement(CommonComponent_1.Btn, { Text: '目录', OnClick: () => {
                    (0, Util_1.openDirOfFile)(path);
                } })));
    }
    RenderToolbar() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: '保存', Disabled: !this.NeedSave(), OnClick: this.Save, Tip: (0, KeyCommands_1.getCommandKeyDesc)('Save') }),
            React.createElement(CommonComponent_1.Btn, { Text: '↻', OnClick: this.Undo, Disabled: !canUndo(this.state), Tip: `撤销 ${(0, KeyCommands_1.getCommandKeyDesc)('Undo')}` }),
            React.createElement(CommonComponent_1.Text, { Text: this.GetUndoStateStr(), Tip: `回退记录,最大支持${ConfigFile_1.ConfigFile.MaxHistory}个` }),
            React.createElement(CommonComponent_1.Btn, { Text: '↺', OnClick: this.Redo, Disabled: !canRedo(this.state), Tip: `重做 ${(0, KeyCommands_1.getCommandKeyDesc)('Redo')}` })));
    }
    SetCsvName(name) {
        const csvState = this.CurrentCsvState;
        if (csvState.Name === name) {
            return;
        }
        if (this.NeedSave()) {
            const result = ue_1.EditorOperations.ShowMessage(ue_1.EMsgType.YesNoCancel, `[${csvState.Name}]已经修改,需要保存吗?`);
            if (result === ue_1.EMsgResult.Cancel) {
                return;
            }
            else if (result === ue_1.EMsgResult.Yes) {
                this.SaveImpl();
            }
        }
        const newCsvState = {
            Name: name,
            Csv: CsvRegistry_1.csvRegistry.Load(name),
        };
        this.RecordCsvState(newCsvState, true);
        this.ConfigFile.CsvName = name;
        this.ConfigFile.Save();
    }
    RenderAllCsvEntries() {
        const colCount = 4;
        const currentName = this.CurrentCsvState.Name;
        const nameElements = CsvRegistry_1.csvRegistry.Names.map((name, id) => {
            const row = Math.floor(id / colCount);
            const col = id % colCount;
            const slot = { Row: row + 1, Column: col };
            return (React.createElement(CommonComponent_1.Btn, { Slot: slot, Text: name, key: name, Color: name === currentName ? CommonComponent_1.HEADING_COLOR : CommonComponent_1.DEFAULT_TEXT_COLOR, OnClick: () => {
                    this.SetCsvName(name);
                } }));
        });
        return React.createElement(react_umg_1.GridPanel, null, nameElements);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const scrollBoxSlot = {
            Size: { SizeRule: ue_1.ESlateSizeRule.Fill },
        };
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.Border, { BrushColor: (0, Color_1.formatColor)('#060606 ue back') },
                React.createElement(react_umg_1.VerticalBox, null,
                    this.RenderPath(),
                    this.RenderToolbar(),
                    this.RenderAllCsvEntries())),
            React.createElement(react_umg_1.ScrollBox, { Slot: scrollBoxSlot },
                React.createElement(CsvView_1.CsvView, { Csv: this.CurrentCsvState.Csv, OnModify: this.OnModifyCsv }))));
    }
}
exports.CsvEditor = CsvEditor;
//# sourceMappingURL=CsvEditor.js.map