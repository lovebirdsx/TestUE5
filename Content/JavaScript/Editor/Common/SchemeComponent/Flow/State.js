"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderStateId = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
const Context_1 = require("../Context");
const DEFAULT_STATE_ID = 1;
// eslint-disable-next-line @typescript-eslint/naming-convention
function RenderStateId(props) {
    return (React.createElement(Context_1.flowContext.Consumer, null, (value) => {
        const stateNames = value.States.map((e) => e.Name);
        const selectedState = value.States.find((e) => e.Id === props.Value);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            props.PrefixElement,
            React.createElement(CommonComponent_1.List, { Items: stateNames, Selected: selectedState ? selectedState.Name : '', Tip: "\u76EE\u6807\u72B6\u6001", OnSelectChanged: (selectedStateName) => {
                    const state = value.States.find((e) => e.Name === selectedStateName);
                    props.OnModify(state ? state.Id : DEFAULT_STATE_ID, 'normal');
                } })));
    }));
}
exports.RenderStateId = RenderStateId;
//# sourceMappingURL=State.js.map