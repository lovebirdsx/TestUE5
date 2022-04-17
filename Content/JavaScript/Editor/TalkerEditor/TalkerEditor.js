"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkerEditor = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const TalkerList_1 = require("../../Game/Common/Operations/TalkerList");
const KeyCommands_1 = require("../Common/KeyCommands");
const Color_1 = require("../Common/ReactComponent/Color");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
const ContextBtn_1 = require("../Common/ReactComponent/ContextBtn");
const ErrorBoundary_1 = require("../Common/ReactComponent/ErrorBoundary");
const Talker_1 = require("./Talker");
class TalkerEditor extends React.Component {
    CommandHandles = [];
    constructor(props) {
        super(props);
        const talkerList = TalkerList_1.TalkerListOp.Load();
        this.state = {
            TalkerList: talkerList,
            LastTalkerList: talkerList,
        };
    }
    ComponentDidMount() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
    }
    ComponentWillUnmount() {
        const kc = KeyCommands_1.KeyCommands.GetInstance();
        this.CommandHandles.forEach((h) => {
            kc.RemoveCommandCallback(h);
        });
    }
    NeedSave = () => {
        const { TalkerList: talkerList, LastTalkerList: lastTalkerList } = this.state;
        return talkerList !== lastTalkerList;
    };
    Save = () => {
        TalkerList_1.TalkerListOp.Save(this.state.TalkerList);
        this.setState((state) => {
            return {
                LastTalkerList: state.TalkerList,
            };
        });
    };
    Modify(cb) {
        this.setState((state) => {
            const newState = (0, immer_1.default)(state, (draft) => {
                cb(state.TalkerList, draft.TalkerList);
            });
            return newState;
        });
    }
    ModifyTalker = (id, talker) => {
        this.Modify((from, to) => {
            to.Talkers[id] = talker;
        });
    };
    AddTalker = () => {
        this.InsertTalker(this.state.TalkerList.Talkers.length);
    };
    InsertTalker(id) {
        this.Modify((from, to) => {
            const talkerId = from.TalkerGenId;
            const talker = {
                Id: talkerId,
                Name: `说话人${talkerId}`,
            };
            to.Talkers.splice(id, 0, talker);
            to.TalkerGenId = talkerId + 1;
        });
    }
    RemoveTalker(id) {
        this.Modify((from, to) => {
            to.Talkers.splice(id, 1);
        });
    }
    MoveTalker(id, isUp) {
        this.Modify((from, to) => {
            const toTalkers = to.Talkers;
            const fromTalkers = from.Talkers;
            if (isUp) {
                if (id > 0) {
                    toTalkers[id - 1] = fromTalkers[id];
                    toTalkers[id] = fromTalkers[id - 1];
                }
                else {
                    (0, Log_1.log)(`can not move talker ${fromTalkers[id].Name} up`);
                }
            }
            else {
                if (id < fromTalkers.length - 1) {
                    toTalkers[id + 1] = fromTalkers[id];
                    toTalkers[id] = fromTalkers[id + 1];
                }
                else {
                    (0, Log_1.log)(`can not move talker ${fromTalkers[id].Name} down`);
                }
            }
        });
    }
    OnTalkerCommand(cmd, id) {
        switch (cmd) {
            case 'insert':
                this.InsertTalker(id);
                break;
            case 'remove':
                this.RemoveTalker(id);
                break;
            case 'moveUp':
                this.MoveTalker(id, true);
                break;
            case 'moveDown':
                this.MoveTalker(id, false);
                break;
            default:
                break;
        }
    }
    GenPrefixForTalker(id) {
        return (React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveUp', 'moveDown'], OnCommand: (cmd) => {
                this.OnTalkerCommand(cmd, id);
            } }));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const { TalkerList: talkerList } = this.state;
        const talkers = talkerList.Talkers.map((talker, id) => {
            return (React.createElement(Talker_1.Talker, { key: id, Talker: talker, OnModify: (t) => {
                    this.ModifyTalker(id, t);
                }, PrefixElement: this.GenPrefixForTalker(id) }));
        });
        const scrollBoxSlot = {
            Size: { SizeRule: ue_1.ESlateSizeRule.Fill },
            Padding: { Left: 10, Bottom: 10 },
        };
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.Border, { BrushColor: (0, Color_1.formatColor)('#060606 ue back') },
                React.createElement(react_umg_1.VerticalBox, null,
                    React.createElement(CommonComponent_1.H1, { Text: "Talker Editor" }),
                    React.createElement(CommonComponent_1.H3, { Text: `${this.NeedSave() ? '*' : ''}${TalkerList_1.TALKER_LIST_CSV_PATH}`, Tip: "\u914D\u7F6E\u6587\u4EF6\u8DEF\u5F84(\u76F8\u5BF9\u4E8EContent\u76EE\u5F55)" }),
                    React.createElement(react_umg_1.HorizontalBox, null,
                        React.createElement(CommonComponent_1.Btn, { Text: "\u6DFB\u52A0\u8BB2\u8BDD\u4EBA", OnClick: this.AddTalker }),
                        React.createElement(CommonComponent_1.Btn, { Text: "\u4FDD\u5B58", OnClick: this.Save, Tip: (0, KeyCommands_1.getCommandKeyDesc)('Save') })))),
            React.createElement(react_umg_1.ScrollBox, { Slot: scrollBoxSlot },
                React.createElement(ErrorBoundary_1.ErrorBoundary, null,
                    React.createElement(Talker_1.talkerListContext.Provider, { value: this.state.TalkerList }, talkers)))));
    }
}
exports.TalkerEditor = TalkerEditor;
//# sourceMappingURL=TalkerEditor.js.map