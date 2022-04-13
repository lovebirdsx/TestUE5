"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowList = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const FlowList_1 = require("../../FlowEditor/Operations/FlowList");
const Log_1 = require("../Log");
const CommonComponent_1 = require("./CommonComponent");
const ContextBtn_1 = require("./ContextBtn");
const Flow_1 = require("./Flow");
function foldAll(obj, value, force) {
    if (typeof obj !== 'object') {
        return;
    }
    const recObj = obj;
    for (const key in obj) {
        if (key.startsWith('_') && key.toLowerCase().endsWith('folded')) {
            recObj[key] = value;
        }
        else if (force) {
            recObj._folded = value;
        }
        const field = recObj[key];
        if (typeof field === 'object') {
            foldAll(field, value, false);
        }
    }
}
const FLOW_TIP = [
    '增加剧情',
    '  剧情',
    '    一个剧情配置文件,由多段剧情组成',
    '    每个剧情具有唯一的id,可以被外部调用',
    '  剧情调用',
    '    输入: 剧情id',
    '    输出: 结果参数(通过[finishState]动作来指定)',
].join('\n');
class FlowList extends React.Component {
    Modify(cb, type) {
        const { FlowList: flowList } = this.props;
        const newflowList = (0, immer_1.default)(flowList, (draft) => {
            cb(flowList, draft);
        });
        if (flowList !== newflowList) {
            this.props.OnModify(newflowList, type);
        }
    }
    AddFlow = () => {
        this.Modify((from, to) => {
            const flow = FlowList_1.FlowListOp.CreateFlow(from);
            to.Flows.push(flow);
            to.FlowGenId = this.props.FlowList.FlowGenId + 1;
        }, 'normal');
    };
    InsertFlow = (id) => {
        this.Modify((from, to) => {
            const newFlow = FlowList_1.FlowListOp.CreateFlow(this.props.FlowList);
            to.Flows.splice(id + 1, 0, newFlow);
        }, 'normal');
    };
    RemoveFlow = (id) => {
        this.Modify((from, to) => {
            to.Flows.splice(id, 1);
        }, 'normal');
    };
    OnContextCommand = (id, cmd) => {
        switch (cmd) {
            case 'insert':
                this.InsertFlow(id);
                break;
            case 'remove':
                this.RemoveFlow(id);
                break;
            case 'moveUp':
                this.FlowMove(id, true);
                break;
            case 'moveDown':
                this.FlowMove(id, false);
                break;
            default:
                break;
        }
    };
    FlowMove = (id, isUp) => {
        this.Modify((from, to) => {
            const { Flows: flows } = from;
            const flow = flows[id];
            if (id === 0 && isUp) {
                (0, Log_1.log)(`${flow.Name} can not move up`);
                return;
            }
            if (id === flows.length - 1 && !isUp) {
                (0, Log_1.log)(`${flow.Name} can not move down`);
                return;
            }
            if (isUp) {
                to.Flows[id] = flows[id - 1];
                to.Flows[id - 1] = flows[id];
            }
            else {
                to.Flows[id] = flows[id + 1];
                to.Flows[id + 1] = flows[id];
            }
        }, 'normal');
    };
    ModifiedFlow = (id, flow, type) => {
        this.Modify((from, draft) => {
            draft.Flows[id] = flow;
        }, type);
    };
    FoldAll = (value) => {
        this.Modify((from, draft) => {
            draft.Flows.forEach((flow) => {
                foldAll(flow, value, true);
            });
        }, 'fold');
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { Flows: flows } = this.props.FlowList;
        const nodes = flows.map((flow, id) => {
            return (React.createElement(Flow_1.Flow, { key: id, Flow: flow, IsDuplicate: flows.find((e1) => e1 !== flow && e1.Name === flow.Name) !== undefined, OnModify: (newFlow, type) => {
                    this.ModifiedFlow(id, newFlow, type);
                }, PrefixElement: React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveDown', 'moveUp'], OnCommand: (cmd) => {
                        this.OnContextCommand(id, cmd);
                    }, Tip: "\u9488\u5BF9\u5F53\u524D\u5267\u60C5\u9879\u64CD\u4F5C" }) }));
        });
        const rootSlot = {
            Padding: { Left: 10, Bottom: 10 },
        };
        return (React.createElement(react_umg_1.VerticalBox, { Slot: rootSlot },
            React.createElement(react_umg_1.HorizontalBox, null,
                React.createElement(CommonComponent_1.Btn, { Text: '✚流程', OnClick: this.AddFlow, Tip: FLOW_TIP }),
                React.createElement(CommonComponent_1.Btn, { Text: '▼▼', OnClick: () => {
                        this.FoldAll(false);
                    }, Tip: "\u5C55\u5F00\u6240\u6709" }),
                React.createElement(CommonComponent_1.Btn, { Text: '▶▶', OnClick: () => {
                        this.FoldAll(true);
                    }, Tip: "\u6298\u53E0\u6240\u6709" })),
            nodes));
    }
}
exports.FlowList = FlowList;
//# sourceMappingURL=FlowList.js.map