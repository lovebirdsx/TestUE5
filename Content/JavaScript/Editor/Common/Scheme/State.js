"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRandomStateScheme = exports.changeStateScheme = exports.finishStateScheme = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../../Common/Component/CommonComponent");
const Type_1 = require("../../Common/Scheme/Type");
const Flow_1 = require("../../FlowEditor/Component/Flow");
exports.finishStateScheme = (0, Type_1.createObjectScheme)({
    Result: (0, Type_1.createStringScheme)({
        CreateDefault: () => '结果',
    }),
    Arg1: (0, Type_1.createStringScheme)({
        Meta: { Optional: true },
        CreateDefault: () => '参数1',
    }),
    Arg2: (0, Type_1.createStringScheme)({
        Meta: { Optional: true },
        CreateDefault: () => '参数2',
    }),
}, {
    Meta: {
        Tip: '结束状态,后续的动作将不被执行',
    },
});
const DEFAULT_STATE_ID = 1;
const stateIdScheme = (0, Type_1.createIntScheme)({
    Meta: {
        HideName: true,
    },
    CreateDefault: (container) => DEFAULT_STATE_ID,
    Render: (props) => {
        return (React.createElement(Flow_1.flowContext.Consumer, null, (value) => {
            const stateNames = value.States.map((e) => e.Name);
            const selectedState = value.States.find((e) => e.Id === props.Value);
            return (React.createElement(react_umg_1.HorizontalBox, null,
                props.PrefixElement,
                React.createElement(CommonComponent_1.List, { Items: stateNames, Selected: selectedState ? selectedState.Name : '', Tip: "\u76EE\u6807\u72B6\u6001", OnSelectChanged: (selectedStateName) => {
                        const state = value.States.find((e) => e.Name === selectedStateName);
                        props.OnModify(state ? state.Id : DEFAULT_STATE_ID);
                    } })));
        }));
    },
});
exports.changeStateScheme = (0, Type_1.createObjectScheme)({
    StateId: stateIdScheme,
}, {
    Meta: {
        Tip: '跳转到状态,执行后将继续执行对应状态的动作',
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
});
//# sourceMappingURL=State.js.map