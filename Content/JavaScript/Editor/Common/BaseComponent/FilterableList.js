"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterableList = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("./CommonComponent");
const MAX_ITEM_COUNT = 10;
class FilterableList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Filter: '',
            IsFilterExpand: false,
        };
    }
    OnFilterBtnClicked = () => {
        this.setState((state) => {
            return {
                IsFilterExpand: !state.IsFilterExpand,
            };
        });
    };
    OnFilterTextChanged = (text) => {
        this.setState({
            Filter: text.toLowerCase(),
        });
    };
    OnSelectChanged = (item) => {
        this.props.OnSelectChanged(item);
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        const state = this.state;
        const newProps = (0, immer_1.default)(props, (draft) => {
            if (props.Items.length <= MAX_ITEM_COUNT) {
                return;
            }
            if (state.IsFilterExpand) {
                const filteredItems = props.Items.filter((item) => item.toLowerCase().includes(state.Filter));
                draft.Items = filteredItems;
            }
            draft.OnSelectChanged = this.OnSelectChanged;
        });
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.List, { ...newProps }),
            props.Items.length > MAX_ITEM_COUNT && (React.createElement(CommonComponent_1.Btn, { Text: '▤', OnClick: this.OnFilterBtnClicked, Tip: '点击后，在弹出的输入框中填入字符串，下拉列表中的内容将匹配输入的字符串' })),
            props.Items.length > MAX_ITEM_COUNT && state.IsFilterExpand && (React.createElement(CommonComponent_1.EditorBox, { Text: state.Filter, OnChange: this.OnFilterTextChanged }))));
    }
}
exports.FilterableList = FilterableList;
//# sourceMappingURL=FilterableList.js.map