"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talker = exports.talkerListContext = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
exports.talkerListContext = React.createContext(undefined);
class Talker extends React.Component {
    Modify(cb) {
        const from = this.props.Talker;
        const to = (0, immer_1.default)(from, (draft) => {
            cb(from, draft);
        });
        if (from !== to) {
            this.props.OnModify(to);
        }
    }
    ModifyName = (name) => {
        this.Modify((from, to) => {
            to.Name = name;
        });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Id: id, Name: name } = this.props.Talker;
        return (React.createElement(react_umg_1.HorizontalBox, null,
            this.props.PrefixElement,
            React.createElement(exports.talkerListContext.Consumer, null, (value) => {
                return (React.createElement(CommonComponent_1.EditorBox, { Text: name, OnChange: this.ModifyName, Color: value.Talkers.find((e) => e.Name === name && e.Id !== id)
                        ? '#FF0000 red'
                        : undefined }));
            })));
    }
}
exports.Talker = Talker;
//# sourceMappingURL=Talker.js.map