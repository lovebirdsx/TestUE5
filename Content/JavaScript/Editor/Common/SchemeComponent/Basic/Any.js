"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const Type_1 = require("../../../../Common/Type");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const RenderRegistry_1 = require("../RenderRegistry");
const ComponentRegistry_1 = require("./ComponentRegistry");
class Any extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { props } = this;
        const { Scheme: type } = props;
        if (type.Render) {
            return type.Render(props);
        }
        const component = RenderRegistry_1.renderRegistry.GetComponent((0, Type_1.getSchemeClass)(props.Scheme));
        if (component) {
            return React.createElement(component, { ...props });
        }
        const reactClass = ComponentRegistry_1.componentRegistry.Get(type.RenderType);
        if (reactClass) {
            return React.createElement(reactClass, { ...props });
        }
        return React.createElement(CommonComponent_1.Text, { Text: `Not supported value type ${type.RenderType}`, Color: "#FF0000 red" });
    }
}
exports.Any = Any;
//# sourceMappingURL=Any.js.map