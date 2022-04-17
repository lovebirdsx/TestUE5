"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestListView = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../Common/Log");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
const FilterableList_1 = require("../Common/ReactComponent/FilterableList");
class TestListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SelectName: 'Foo1',
            Names: ['Foo1', 'Foo2', 'Foo3', 'Bar1', 'Bar2', 'Bar3', 'Car1', 'Car2', 'Car3'],
        };
    }
    OnSelectedNameChanged = (item) => {
        (0, Log_1.log)(`select id changed to ${item}`);
        this.setState({
            SelectName: item,
        });
    };
    AddItem = () => {
        this.setState((state) => (0, immer_1.default)(state, (draft) => {
            draft.Names.push(`item ${state.Names.length}`);
        }));
    };
    RemoveItem = () => {
        this.setState((state) => (0, immer_1.default)(state, (draft) => {
            draft.Names.pop();
        }));
    };
    Select = (id) => {
        this.setState((state) => (0, immer_1.default)(state, (draft) => {
            draft.SelectName = state.Names[id];
        }));
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const state = this.state;
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.List, { Items: state.Names, OnSelectChanged: this.OnSelectedNameChanged, Selected: state.SelectName }),
                React.createElement(CommonComponent_1.Btn, { Text: '+ item', OnClick: this.AddItem }),
                React.createElement(CommonComponent_1.Btn, { Text: '- item', OnClick: this.RemoveItem }),
                React.createElement(CommonComponent_1.Btn, { Text: '0', OnClick: () => {
                        this.Select(0);
                    } }),
                React.createElement(CommonComponent_1.Btn, { Text: '1', OnClick: () => {
                        this.Select(1);
                    } }),
                React.createElement(CommonComponent_1.Btn, { Text: '2', OnClick: () => {
                        this.Select(2);
                    } })),
            React.createElement(FilterableList_1.FilterableList, { Items: state.Names, Selected: state.SelectName, OnSelectChanged: this.OnSelectedNameChanged })));
    }
}
exports.TestListView = TestListView;
//# sourceMappingURL=TestListView.js.map