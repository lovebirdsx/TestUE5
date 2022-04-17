"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRandomStateScheme = exports.changeStateScheme = exports.finishStateScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const Type_1 = require("../../../../Common/Type");
const CommonComponent_1 = require("../../ReactComponent/CommonComponent");
const Context_1 = require("../../ReactComponent/Context");
exports.finishStateScheme = (0, Type_1.createObjectScheme)({}, {
    Meta: {
        Tip: '结束状态,后续的动作将不被执行',
    },
    Filters: (0, Type_1.objectFilterExcept)(Type_1.EObjectFilter.FlowList),
});
const DEFAULT_STATE_ID = 1;
const stateIdScheme = (0, Type_1.createIntScheme)({
    Meta: {
        HideName: true,
    },
    CreateDefault: (container) => DEFAULT_STATE_ID,
    Render: (props) => {
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
    },
});
exports.changeStateScheme = (0, Type_1.createObjectScheme)({
    StateId: stateIdScheme,
}, {
    Meta: {
        Tip: '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始',
    },
});
exports.changeRandomStateScheme = (0, Type_1.createObjectScheme)({
    StateIds: (0, Type_1.createArrayScheme)({
        Element: stateIdScheme,
        Meta: {
            HideName: true,
        },
    }),
}, {
    Meta: {
        Tip: '随机选择一个状态进行跳转',
    },
    Filters: (0, Type_1.objectFilterExcept)(Type_1.EObjectFilter.Trigger),
});
//# sourceMappingURL=State.js.map