"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../Log");
const Flow_1 = require("../Operations/Flow");
const Action_1 = require("../Scheme/Action");
const Action_2 = require("./Action");
const CommonComponent_1 = require("./CommonComponent");
const ContextBtn_1 = require("./ContextBtn");
const Flow_2 = require("./Flow");
const ADD_ACTION_TIP = [
    '增加动作',
    '  动作',
    '    不同的动作包含了不同的功能',
    '    显示对话也是通过动作来实现的',
    '  执行方式',
    '    同步: 默认的执行方式,当前动作执行完毕后才执行下一条动作',
    '    异步: 当前动作执行后,不等待其完毕,马上执行下一条',
    '  动作上下文',
    '    在不同的执行上下文中,可以执行的动作是不一样的',
    '    譬如:',
    '      [showTalk]动作只能在状态层执行',
    '      [jumpTalk]动作只能在[showTalk]中执行',
].join('\n');
class State extends React.Component {
    Modify(cb, type) {
        const { State: state } = this.props;
        const newState = (0, immer_1.default)(state, (draft) => {
            cb(state, draft);
        });
        this.props.OnModify(newState, type);
    }
    ChangeFold = () => {
        this.Modify((from, to) => {
            to._folded = !from._folded;
        }, 'fold');
    };
    SpwanNewActionAfter(state, id) {
        return Action_1.scheme.SpawnDefaultAction(this.props.ObjectFilter);
    }
    AddAction = () => {
        this.Modify((from, to) => {
            to.Actions.push(this.SpwanNewActionAfter(from, from.Actions.length - 1));
            to._folded = false;
        }, 'normal');
    };
    InsertAction = (id) => {
        this.Modify((from, to) => {
            const action = this.SpwanNewActionAfter(from, id);
            to.Actions.splice(id + 1, 0, action);
        }, 'normal');
    };
    RemoveAction = (id) => {
        this.Modify((from, to) => {
            to.Actions.splice(id, 1);
        }, 'normal');
    };
    MoveAction = (id, isUp) => {
        this.Modify((from, to) => {
            if (isUp) {
                if (id > 0) {
                    to.Actions[id] = from.Actions[id - 1];
                    to.Actions[id - 1] = from.Actions[id];
                }
                else {
                    (0, Log_1.log)(`Can not move action ${from.Actions[id].Name} up`);
                }
            }
            else {
                // eslint-disable-next-line no-lonely-if
                if (id < from.Actions.length - 1) {
                    to.Actions[id] = from.Actions[id + 1];
                    to.Actions[id + 1] = from.Actions[id];
                }
                else {
                    (0, Log_1.log)(`Can not move action ${from.Actions[id].Name} down`);
                }
            }
        }, 'normal');
    };
    ChangeName = (name) => {
        this.Modify((from, to) => {
            to.Name = name;
        }, 'normal');
    };
    OnActionModify = (id, action, type) => {
        this.Modify((from, to) => {
            to.Actions[id] = action;
        }, type);
    };
    OnContextCommand(id, cmd) {
        switch (cmd) {
            case 'insert':
                this.InsertAction(id);
                break;
            case 'remove':
                this.RemoveAction(id);
                break;
            case 'moveUp':
                this.MoveAction(id, true);
                break;
            case 'moveDown':
                this.MoveAction(id, false);
                break;
            default:
                break;
        }
    }
    ShowStateMoveTo(flow) {
        const states = Flow_1.flowOp.GetDestinationStates(flow, this.props.State);
        const statesFormated = states.map((state) => `➔[${state}]`);
        return (states.length > 0 && (React.createElement(CommonComponent_1.SlotText, { Text: statesFormated.toString(), Tip: '当前状态有可能跳转的状态' })));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { State: state } = this.props;
        const actions = state.Actions.map((e, id) => {
            return (React.createElement(Action_2.Action, { key: id, Action: e, ObjectFilter: this.props.ObjectFilter, OnModify: (action, type) => {
                    this.OnActionModify(id, action, type);
                }, OnContextCommand: (cmd) => {
                    this.OnContextCommand(id, cmd);
                } }));
        });
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Fold, { IsFold: state._folded, IsFull: state.Actions.length > 0, OnChanged: this.ChangeFold }),
                React.createElement(CommonComponent_1.Text, { Text: '●', Color: this.props.IsDuplicate ? '#8B0000 dark red' : '#FFFFFF white' }),
                React.createElement(CommonComponent_1.EditorBox, { Text: state.Name, OnChange: this.ChangeName, Tip: "\u72B6\u6001\u540D\u5B57" }),
                React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveUp', 'moveDown'], OnCommand: this.props.OnContextCommand, Tip: "\u9488\u5BF9\u5F53\u524D\u72B6\u6001\u9879\u64CD\u4F5C" }),
                React.createElement(CommonComponent_1.Btn, { Text: '✚动作', OnClick: this.AddAction, Tip: ADD_ACTION_TIP }),
                React.createElement(Flow_2.flowContext.Consumer, null, (value) => {
                    return this.ShowStateMoveTo(value);
                })),
            React.createElement(react_umg_1.VerticalBox, null, state._folded ? null : actions)));
    }
}
exports.State = State;
//# sourceMappingURL=State.js.map