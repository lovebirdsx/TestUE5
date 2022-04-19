"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityEditor = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const TsEntity_1 = require("../../Game/Entity/TsEntity");
const KeyCommands_1 = require("../Common/KeyCommands");
const LevelEditor_1 = require("../Common/LevelEditor");
const Color_1 = require("../Common/ReactComponent/Color");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
const ErrorBoundary_1 = require("../Common/ReactComponent/ErrorBoundary");
const Public_1 = require("../Common/Scheme/Entity/Public");
const ConfigFile_1 = require("../FlowEditor/ConfigFile");
const EntityView_1 = require("./EntityView");
function canUndo(state) {
    return state.StepId > 0 && state.Histories.length > 0;
}
function canRedo(state) {
    return state.StepId < state.Histories.length - 1;
}
class EntityEditor extends React.Component {
    LastApplyEntityState;
    DetectEditorPlayingHander;
    constructor(props) {
        super(props);
        const initEntityState = this.GenEntityStateBySelect();
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
            Histories: [initEntityState],
            StepId: 0,
            IsEditorPlaying: LevelEditor_1.default.IsPlaying,
        };
        this.LastApplyEntityState = initEntityState;
    }
    GenEntityStateBySelect() {
        const entity = this.GetCurrentSelectEntity();
        if (entity) {
            return {
                Entity: entity,
                PureData: Public_1.editorEntityRegistry.GenData(entity),
            };
        }
        return {
            Entity: undefined,
            PureData: undefined,
        };
    }
    GetCurrentSelectEntity() {
        const actors = ue_1.EditorLevelLibrary.GetSelectedLevelActors();
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            if ((0, Class_1.isChildOfClass)(actor, TsEntity_1.default)) {
                return actor;
            }
        }
        return undefined;
    }
    OnEntityDestory = (entity) => {
        this.setState((state) => {
            return (0, immer_1.default)(state, (draft) => {
                state.Histories.forEach((entityState, id) => {
                    if (entityState.Entity === entity) {
                        draft.Histories[id].Entity = null;
                        draft.Histories[id].PureData = null;
                    }
                });
            });
        });
        entity.OnDestroyed.Remove(this.OnEntityDestory);
    };
    OnSelectionChanged = () => {
        if (LevelEditor_1.default.IsPlaying) {
            return;
        }
        const entity = this.GetCurrentSelectEntity();
        if (!entity || entity === this.EntityState.Entity) {
            return;
        }
        const entityState = {
            Entity: entity,
            PureData: Public_1.editorEntityRegistry.GenData(entity),
        };
        this.RecordEntityState(entityState, 'normal');
        entity.OnDestroyed.Remove(this.OnEntityDestory);
        entity.OnDestroyed.Add(this.OnEntityDestory);
    };
    DetectEditorPlaying = () => {
        const isEditorPlaying = LevelEditor_1.default.IsPlaying;
        if (isEditorPlaying !== this.state.IsEditorPlaying) {
            this.setState({
                IsEditorPlaying: isEditorPlaying,
            });
        }
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
        this.DetectEditorPlayingHander = setInterval(this.DetectEditorPlaying, 500);
    }
    ComponentWillUnmount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
        clearInterval(this.DetectEditorPlayingHander);
    }
    get EntityState() {
        return this.state.Histories[this.state.StepId];
    }
    RecordEntityState(entityState, type) {
        this.setState((state) => {
            const newState = (0, immer_1.default)(this.state, (draft) => {
                if (type === 'normal') {
                    if (draft.StepId < draft.Histories.length - 1) {
                        draft.Histories.splice(draft.StepId + 1);
                    }
                    draft.Histories.push(entityState);
                    draft.StepId++;
                    if (draft.Histories.length > ConfigFile_1.ConfigFile.MaxHistory) {
                        draft.Histories.shift();
                        draft.StepId--;
                    }
                }
                else if (type === 'fold') {
                    draft.Histories[state.StepId] = entityState;
                }
            });
            return newState;
        });
    }
    OnEntityModify = (data, type) => {
        const es = this.EntityState;
        const newState = {
            Entity: es.Entity,
            PureData: data,
        };
        this.RecordEntityState(newState, type);
    };
    ApplyEntityChange() {
        if (this.state.IsEditorPlaying) {
            return;
        }
        const es = this.EntityState;
        LevelEditor_1.default.SelectActor(es.Entity);
        if (es === this.LastApplyEntityState || !es.Entity) {
            return;
        }
        Public_1.editorEntityRegistry.ApplyData(es.PureData, es.Entity);
        this.LastApplyEntityState = es;
    }
    RenderEntity() {
        if (this.state.IsEditorPlaying) {
            return React.createElement(CommonComponent_1.SlotText, { Text: 'Editor is playing' });
        }
        const es = this.EntityState;
        if (!es.Entity) {
            return React.createElement(CommonComponent_1.SlotText, { Text: 'select entity to modify' });
        }
        return (React.createElement(EntityView_1.EntityView, { Entity: es.Entity, PureData: es.PureData, OnModify: this.OnEntityModify }));
    }
    SetStep(newStepId) {
        this.setState((state) => {
            return {
                StepId: newStepId,
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
    Info = () => {
        (0, Log_1.log)(JSON.stringify(this.state.Histories, null, 2));
    };
    Test = () => {
        (0, Log_1.log)(`is playing = ${LevelEditor_1.default.IsPlaying}`);
    };
    GetUndoStateStr = () => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };
    RenderToolbar() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: '↻', OnClick: this.Undo, Disabled: !canUndo(this.state), Tip: `撤销 ${(0, KeyCommands_1.getCommandKeyDesc)('Undo')}` }),
            React.createElement(CommonComponent_1.Text, { Text: this.GetUndoStateStr(), Tip: `回退记录,最大支持${ConfigFile_1.ConfigFile.MaxHistory}个` }),
            React.createElement(CommonComponent_1.Btn, { Text: '↺', OnClick: this.Redo, Disabled: !canRedo(this.state), Tip: `重做 ${(0, KeyCommands_1.getCommandKeyDesc)('Redo')}` }),
            React.createElement(CommonComponent_1.Btn, { Text: 'State', OnClick: this.Info, Tip: `输出状态` }),
            React.createElement(CommonComponent_1.Btn, { Text: 'Test', OnClick: this.Test, Tip: `测试` })));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        this.ApplyEntityChange();
        const scrollBoxSlot = {
            Size: { SizeRule: ue_1.ESlateSizeRule.Fill },
        };
        return (React.createElement(ErrorBoundary_1.ErrorBoundary, null,
            React.createElement(react_umg_1.VerticalBox, null,
                React.createElement(react_umg_1.Border, { BrushColor: (0, Color_1.formatColor)('#060606 ue back') },
                    React.createElement(react_umg_1.VerticalBox, null, this.RenderToolbar())),
                React.createElement(ErrorBoundary_1.ErrorBoundary, null,
                    React.createElement(react_umg_1.ScrollBox, { Slot: scrollBoxSlot }, this.RenderEntity())))));
    }
}
exports.EntityEditor = EntityEditor;
//# sourceMappingURL=EntityEditor.js.map