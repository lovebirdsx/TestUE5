"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
const Log_1 = require("../Common/Log");
class EntityEditor extends React.Component {
    constructor(props) {
        super(props);
        this.OnSelectionChanged = () => {
            Log_1.log('SelectionChanged');
        };
        this.state = {
            Name: 'Hello Entity Editor',
        };
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(CommonComponent_1.Text, { Text: this.state.Name })));
    }
}
exports.EntityEditor = EntityEditor;
//# sourceMappingURL=EntityEditor.js.map