"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMoveComponent = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../Common/BaseComponent/CommonComponent");
// eslint-disable-next-line @typescript-eslint/naming-convention
function Child(props) {
    return (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(CommonComponent_1.Text, { Text: props.Config.Id.toString() }),
        React.createElement(CommonComponent_1.Text, { Text: props.Config.Name }),
        React.createElement(CommonComponent_1.Btn, { Text: " \u25B2 ", OnClick: () => {
                props.OnMove(props.Config, true);
            } }),
        React.createElement(CommonComponent_1.Btn, { Text: " \u25BC ", OnClick: () => {
                props.OnMove(props.Config, false);
            } })));
}
class TestMoveComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Children: [
                { Id: 0, Name: 'Name1' },
                { Id: 1, Name: 'Name2' },
            ],
        };
    }
    OnMove = (child, isUp) => {
        this.setState((state) => {
            return (0, immer_1.produce)(state, (draft) => {
                const id = state.Children.findIndex((e) => e.Id === child.Id);
                if (isUp) {
                    if (id > 0) {
                        draft.Children[id] = state.Children[id - 1];
                        draft.Children[id - 1] = state.Children[id];
                    }
                }
                else {
                    if (id < state.Children.length - 1) {
                        draft.Children[id] = state.Children[id + 1];
                        draft.Children[id + 1] = state.Children[id];
                    }
                }
            });
        });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const childs = this.state.Children.map((e, id) => {
            return React.createElement(Child, { key: id, Config: e, OnMove: this.OnMove });
        });
        return React.createElement(react_umg_1.VerticalBox, null, childs);
    }
}
exports.TestMoveComponent = TestMoveComponent;
//# sourceMappingURL=TestMoveComponent.js.map