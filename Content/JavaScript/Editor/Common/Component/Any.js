"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const Array_1 = require("./Array");
const Basic_1 = require("./Basic");
const CommonComponent_1 = require("./CommonComponent");
const Dynamic_1 = require("./Dynamic");
const Obj_1 = require("./Obj");
class Any extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { props } = this;
        const { Type: type } = props;
        if (type.Render) {
            return type.Render(props);
        }
        switch (type.RrenderType) {
            case 'boolean':
                return React.createElement(Basic_1.Bool, { ...props });
            case 'int':
                return React.createElement(Basic_1.Int, { ...props });
            case 'float':
                return React.createElement(Basic_1.Float, { ...props });
            case 'string':
                return React.createElement(Basic_1.String, { ...props });
            case 'asset':
                return React.createElement(Basic_1.Asset, { ...props });
            case 'enum':
                return React.createElement(Basic_1.Enum, { ...props });
            case 'object':
                return React.createElement(Obj_1.Obj, { ...props });
            case 'array':
                return React.createElement(Array_1.Array, { ...props });
            case 'dynamic':
                return React.createElement(Dynamic_1.Dynamic, { ...props });
            default:
                return (React.createElement(CommonComponent_1.Text, { Text: `Not supported value type ${type.RrenderType}`, Color: "#FF0000 red" }));
        }
    }
}
exports.Any = Any;
//# sourceMappingURL=Any.js.map