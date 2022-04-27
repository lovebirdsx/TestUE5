"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsState = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Index_1 = require("../../Game/Scheme/Component/Index");
const CommonComponent_1 = require("../Common/BaseComponent/CommonComponent");
const Public_1 = require("../Common/SchemeComponent/Basic/Public");
class ComponentsState extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const classObjs = this.props.ClassObjs;
        const components = this.props.Value;
        const elements = classObjs.map((classObj, id) => {
            if (!Index_1.componentRegistry.HasScheme(classObj.name)) {
                return undefined;
            }
            const scheme = Index_1.componentRegistry.GetScheme(classObj.name);
            let value = components[classObj.name];
            if (!value) {
                value = scheme.CreateDefault();
            }
            return (React.createElement(react_umg_1.VerticalBox, { key: id },
                React.createElement(CommonComponent_1.Text, { Text: classObj.name }),
                React.createElement(Public_1.Obj, { Value: value, Scheme: scheme, OnModify: (obj, type) => {
                        const newComponentState = (0, immer_1.default)(this.props.Value, (draft) => {
                            draft[classObj.name] = obj;
                        });
                        this.props.OnModify(newComponentState, type);
                    } })));
        });
        return React.createElement(react_umg_1.VerticalBox, null, elements);
    }
}
exports.ComponentsState = ComponentsState;
//# sourceMappingURL=ComponentsState.js.map