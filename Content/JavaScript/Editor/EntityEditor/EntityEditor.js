"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityEditor = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const TsEntity_1 = require("../../Game/Entity/TsEntity");
const TsTrigger_1 = require("../../Game/Entity/TsTrigger");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
class EntityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
        };
    }
    GetCurrentSelectEntity() {
        const actors = ue_1.EditorLevelLibrary.GetSelectedLevelActors();
        if (actors.Num() !== 1) {
            return null;
        }
        const actor = actors.Get(0);
        if ((0, Class_1.isChildOfClass)(actor, TsEntity_1.default)) {
            return actor;
        }
        return null;
    }
    OnSelectionChanged = () => {
        this.setState({
            Entity: this.GetCurrentSelectEntity(),
        });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
    }
    ComponentWillUnmount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
    }
    RenderForTrigger(trigger) {
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(CommonComponent_1.Text, { Text: `Entity = ${trigger.GetName()}` }),
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Text, { Text: `MaxTriggerTimes` }),
                React.createElement(CommonComponent_1.EditorBox, { Text: `${trigger.MaxTriggerTimes}`, OnChange: function (text) { } })),
            React.createElement(CommonComponent_1.Text, { Text: `TriggerActions = ${trigger.TriggerActions}` })));
    }
    RenderEntity() {
        const entity = this.state.Entity;
        if (!entity) {
            return React.createElement(CommonComponent_1.Text, { Text: 'select entity to modify' });
        }
        if ((0, Class_1.isType)(entity, TsTrigger_1.default)) {
            return this.RenderForTrigger(entity);
        }
        return React.createElement(CommonComponent_1.Text, { Text: `Entity = ${entity.GetName()}` });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(CommonComponent_1.Text, { Text: this.state.Name }),
            this.RenderEntity()));
    }
}
exports.EntityEditor = EntityEditor;
//# sourceMappingURL=EntityEditor.js.map