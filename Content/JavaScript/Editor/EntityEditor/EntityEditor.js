"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const TsEntity_1 = require("../../Game/Entity/TsEntity");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
class EntityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.OnSelectionChanged = () => {
            this.setState({
                Entity: this.GetCurrentSelectEntity(),
            });
        };
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
        if (Class_1.isChildOfClass(actor, TsEntity_1.default)) {
            return actor;
        }
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UNSAFE_componentWillMount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
    }
    ComponentWillUnmount() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
    }
    RenderEntity() {
        const entity = this.state.Entity;
        if (!entity) {
            return React.createElement(CommonComponent_1.Text, { Text: 'select entity to modify' });
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