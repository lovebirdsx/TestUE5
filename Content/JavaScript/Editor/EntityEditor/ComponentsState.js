"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsState = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Dynamic_1 = require("../Common/ReactComponent/Dynamic");
const Index_1 = require("../Common/Scheme/Component/Index");
class ComponentsState extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const classObjs = this.props.ClassObjs;
        const components = this.props.Value.Components;
        const elements = classObjs.map((classObj, id) => {
            const scheme = Index_1.componentRegistry.GetScheme(classObj.name);
            let value = components[classObj.name];
            if (!value) {
                value = scheme.CreateDefault(undefined);
            }
            return (React.createElement(Dynamic_1.Obj, { key: id, Value: value, Type: scheme, OnModify: (obj, type) => {
                    const newComponentState = (0, immer_1.default)(this.props.Value, (draft) => {
                        draft.Components[classObj.name] = obj;
                    });
                    this.props.OnModify(newComponentState, type);
                } }));
        });
        return React.createElement(react_umg_1.VerticalBox, null, elements);
    }
}
exports.ComponentsState = ComponentsState;
//# sourceMappingURL=ComponentsState.js.map