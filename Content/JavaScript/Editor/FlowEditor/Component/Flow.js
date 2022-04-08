"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flow = exports.flowContext = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../../Common/Component/CommonComponent");
const ContextBtn_1 = require("../../Common/Component/ContextBtn");
const Log_1 = require("../../Common/Log");
const Flow_1 = require("../Operations/Flow");
const State_1 = require("./State");
exports.flowContext = React.createContext(undefined);
const ADD_STATE_TIP = [
    '增加状态',
    '  状态',
    '    一个剧情由多个状态组成',
    '    一个状态可以包含多个动作',
    '  状态执行顺序',
    '    剧情播放时,根据其指定的状态id进入对应状态',
    '    若状态中的动作包含了状态跳转动作,则跳转到对应的状态',
    '    若状态中的动作执行了[finishState],则状态执行结束',
    '    若状态中的动作全部执行完毕,则状态也执行结束',
    '    状态执行结束后,控制权将交回给外部',
].join('\n');
class Flow extends React.Component {
    Modify(cb) {
        const { Flow: flow } = this.props;
        const newFlow = (0, immer_1.produce)(flow, (draft) => {
            cb(flow, draft);
        });
        if (flow !== newFlow) {
            this.props.OnModify(newFlow);
        }
    }
    ChangeFold = () => {
        this.Modify((from, to) => {
            to._folded = !from._folded;
        });
    };
    ChangeName = (name) => {
        this.Modify((from, to) => {
            to.Name = name;
        });
    };
    AddState = () => {
        this.Modify((from, to) => {
            to.StateGenId = from.StateGenId + 1;
            to._folded = false;
            to.States.push(Flow_1.FlowOp.CreateState(from));
        });
    };
    InsertState = (id) => {
        this.Modify((from, to) => {
            to.States.splice(id + 1, 0, Flow_1.FlowOp.CreateState(from));
        });
    };
    MoveState = (id, isUp) => {
        this.Modify((from, to) => {
            const toStates = to.States;
            const fromStates = from.States;
            if (isUp) {
                if (id > 0) {
                    toStates[id - 1] = fromStates[id];
                    toStates[id] = fromStates[id - 1];
                }
                else {
                    (0, Log_1.log)(`can not move state ${fromStates[id].Name} up`);
                }
            }
            else {
                // eslint-disable-next-line no-lonely-if
                if (id < fromStates.length - 1) {
                    toStates[id + 1] = fromStates[id];
                    toStates[id] = fromStates[id + 1];
                }
                else {
                    (0, Log_1.log)(`can not move state ${fromStates[id].Name} down`);
                }
            }
        });
    };
    RemoveState = (id) => {
        this.Modify((from, to) => {
            to.States.splice(id, 1);
        });
    };
    ModifyState = (id, state) => {
        this.Modify((from, to) => {
            to.States[id] = state;
        });
    };
    OnContextCommand(id, cmd) {
        switch (cmd) {
            case 'insert':
                this.InsertState(id);
                break;
            case 'remove':
                this.RemoveState(id);
                break;
            case 'moveUp':
                this.MoveState(id, true);
                break;
            case 'moveDown':
                this.MoveState(id, false);
                break;
            default:
                break;
        }
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Flow: flow } = this.props;
        let nodes = [];
        if (!flow._folded) {
            const { States: states } = flow;
            nodes = states.map((state, id) => {
                return (React.createElement(State_1.State, { key: id, IsDuplicate: states.find((e) => e !== state && e.Name === state.Name) !== undefined, State: state, OnModify: (newConfig) => {
                        this.ModifyState(id, newConfig);
                    }, OnContextCommand: (cmd) => {
                        this.OnContextCommand(id, cmd);
                    } }));
            });
        }
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Fold, { IsFold: flow._folded, IsFull: flow.States.length > 0, OnChanged: this.ChangeFold }),
                React.createElement(CommonComponent_1.Text, { Text: '●', Color: this.props.IsDuplicate ? '#8B0000 dark red' : '#FFFFFF white' }),
                React.createElement(CommonComponent_1.EditorBox, { Text: flow.Name, OnChange: this.ChangeName, Tip: "\u5267\u60C5\u540D\u5B57" }),
                React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveDown', 'moveUp'], OnCommand: this.props.OnContextCommand, Tip: "\u9488\u5BF9\u5F53\u524D\u5267\u60C5\u9879\u64CD\u4F5C" }),
                React.createElement(CommonComponent_1.Btn, { Text: '✚状态', OnClick: this.AddState, Tip: ADD_STATE_TIP })),
            React.createElement(react_umg_1.VerticalBox, { RenderTransform: { Translation: { X: CommonComponent_1.TAB_OFFSET } } },
                React.createElement(exports.flowContext.Provider, { value: flow }, nodes))));
    }
}
exports.Flow = Flow;
//# sourceMappingURL=Flow.js.map