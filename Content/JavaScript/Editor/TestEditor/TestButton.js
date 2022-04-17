"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestButton = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
class TestButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            IsButtonEnabled: false,
        };
    }
    OnChecked = (checked) => {
        this.setState({ IsButtonEnabled: checked });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Check, { OnChecked: this.OnChecked, UnChecked: !this.state.IsButtonEnabled }),
                React.createElement(CommonComponent_1.Btn, { Text: this.state.IsButtonEnabled ? 'Enabled' : 'Disabled', Disabled: !this.state.IsButtonEnabled, OnClick: () => {
                        ue_1.EditorOperations.ShowMessage(ue_1.EMsgType.Ok, 'Your Click the button', 'Hello');
                    } }))));
    }
}
exports.TestButton = TestButton;
//# sourceMappingURL=TestButton.js.map