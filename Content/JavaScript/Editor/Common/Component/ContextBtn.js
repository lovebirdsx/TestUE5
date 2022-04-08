"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBtn = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const CommonComponent_1 = require("./CommonComponent");
class ContextBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OprationCount: 0,
        };
    }
    OnSelectChanged = (option) => {
        this.setState((state) => {
            return {
                OprationCount: state.OprationCount + 1,
            };
        });
        this.props.OnCommand(option);
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const selected = this.state.OprationCount % 2 === 0 ? '0' : '1';
        const { Commands: commands, Tip: tip } = this.props;
        return (React.createElement(CommonComponent_1.List, { Items: commands, Selected: selected, OnSelectChanged: this.OnSelectChanged, Tip: tip }));
    }
}
exports.ContextBtn = ContextBtn;
//# sourceMappingURL=ContextBtn.js.map