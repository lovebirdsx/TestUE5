"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CommonComponent_1 = require("../CommonComponent");
const ComponentRegistry_1 = require("./ComponentRegistry");
class Any extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { props } = this;
        const { Type: type } = props;
        if (type.Render) {
            return type.Render(props);
        }
        const reactClass = ComponentRegistry_1.componentRegistry.Get(type.RrenderType);
        if (reactClass) {
            return React.createElement(reactClass, { ...props });
        }
        return React.createElement(CommonComponent_1.Text, { Text: `Not supported value type ${type.RrenderType}`, Color: "#FF0000 red" });
    }
}
exports.Any = Any;
//# sourceMappingURL=Any.js.map