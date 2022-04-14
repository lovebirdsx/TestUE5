"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showOptionScheme = exports.showTalkScheme = exports.talkItemScheme = exports.talkerScheme = exports.talkOptionScheme = exports.showTalkContext = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const TalkerList_1 = require("../../../TalkerEditor/TalkerList");
const Basic_1 = require("../../Component/Basic");
const CommonComponent_1 = require("../../Component/CommonComponent");
const Obj_1 = require("../../Component/Obj");
const FlowList_1 = require("../../Operations/FlowList");
const Type_1 = require("../Type");
exports.showTalkContext = React.createContext(undefined);
const talkActionInfoScheme = (0, Type_1.createDynamicType)(Type_1.EObjectFilter.Talk, {
    Meta: {
        NewLine: false,
        Tip: '动作',
    },
});
function createTextIdScheme(defaultText, meta) {
    return (0, Type_1.createIntScheme)({
        CreateDefault: () => {
            let textId = 0;
            FlowList_1.flowListContext.Modify(FlowList_1.EFlowListAction.GenText, (from, to) => {
                const text = defaultText;
                textId = FlowList_1.flowListOp.CreateText(to, text);
            });
            return textId;
        },
        Render: (props) => {
            return (React.createElement(react_umg_1.HorizontalBox, null,
                props.PrefixElement,
                React.createElement(CommonComponent_1.EditorBox, { Width: props.Type.Meta.Width, Text: FlowList_1.flowListContext.Get().Texts[props.Value], OnChange: (text) => {
                        FlowList_1.flowListContext.Modify(FlowList_1.EFlowListAction.ModifyText, (from, to) => {
                            const textId = props.Value;
                            FlowList_1.flowListOp.ModifyText(to, textId, text);
                        });
                    }, Tip: props.Type.Meta.Tip })));
        },
        Meta: meta,
    });
}
exports.talkOptionScheme = (0, Type_1.createObjectScheme)({
    TextId: createTextIdScheme('该做啥选择呢', {
        HideName: true,
        Width: 200,
        Tip: '选项内容',
    }),
    Actions: (0, Type_1.createArrayScheme)({
        Element: talkActionInfoScheme,
        Meta: {
            HideName: true,
            NewLine: false,
            Tip: '选项动作',
        },
    }),
});
function hasTalk(showTalk, name) {
    let count = 0;
    showTalk.TalkItems.forEach((item) => {
        if (item.Name === name) {
            count++;
        }
    });
    return count > 1;
}
exports.talkerScheme = (0, Type_1.createIntScheme)({
    CreateDefault: () => {
        const { Talkers: talkers } = TalkerList_1.TalkerListOp.Get();
        return talkers.length > 0 ? talkers[0].Id : 1;
    },
    Meta: {
        HideName: true,
        Tip: '说话人',
    },
    Render: (props) => {
        const { Talkers: talkers } = TalkerList_1.TalkerListOp.Get();
        const names = TalkerList_1.TalkerListOp.GetNames();
        const selectedTalker = talkers.find((e) => e.Id === props.Value);
        return (React.createElement(CommonComponent_1.List, { Items: names, Selected: selectedTalker ? selectedTalker.Name : '', Tip: props.Type.Meta.Tip, OnSelectChanged: (name) => {
                const who = talkers.find((e) => e.Name === name);
                props.OnModify(who.Id, 'normal');
            } }));
    },
});
const talkItemFileds = {
    Id: (0, Type_1.createIntScheme)({
        CreateDefault: () => 1,
        Meta: { Hide: true },
    }),
    Name: (0, Type_1.createStringScheme)({
        CreateDefault: () => '对话1',
        Render: (props) => {
            return (React.createElement(exports.showTalkContext.Consumer, null, (value) => {
                return (React.createElement(Basic_1.String, { ...props, Color: hasTalk(value, props.Value)
                        ? '#FF0000 red'
                        : CommonComponent_1.DEFAULT_EDIT_TEXT_COLOR }));
            }));
        },
        Meta: {
            HideName: true,
            Tip: '对话名字',
        },
    }),
    WhoId: exports.talkerScheme,
    TextId: createTextIdScheme('说点什么吧', {
        HideName: true,
        Width: 500,
        Tip: '对话内容',
    }),
    WaitTime: (0, Type_1.createFloatScheme)({
        CreateDefault: (container) => 1,
        Meta: {
            Optional: true,
            Width: 40,
            Tip: '等待多久之后可以跳过，默认值在【全局配置】表中定义',
        },
    }),
    Actions: (0, Type_1.createArrayScheme)({
        Element: talkActionInfoScheme,
        Meta: {
            NewLine: true,
            HideName: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '动作列表',
        },
    }),
    Options: (0, Type_1.createArrayScheme)({
        Element: exports.talkOptionScheme,
        Meta: {
            NewLine: true,
            HideName: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '选项列表',
        },
    }),
};
function fixJumpTalk(actions, talkIds) {
    let fixCount = 0;
    actions.forEach((action) => {
        if (action.Name === 'JumpTalk') {
            const jumpTalk = action.Params;
            if (!talkIds.includes(jumpTalk.TalkId)) {
                jumpTalk.TalkId = 0;
                fixCount++;
            }
        }
        else if (action.Name === 'ShowTalk') {
            const showTalk = action.Params;
            showTalk.TalkItems.forEach((talkItem) => {
                if (talkItem.Actions) {
                    fixCount += fixJumpTalk(talkItem.Actions, talkIds);
                }
                if (talkItem.Options) {
                    talkItem.Options.forEach((option) => {
                        fixCount += fixJumpTalk(option.Actions, talkIds);
                    });
                }
            });
        }
    });
    return fixCount;
}
function fixTalkItem(item, container) {
    const items = container;
    let fixedCount = 0;
    // 确保对话名字唯一
    if (!item.Name || items.find((e) => e.Name === item.Name)) {
        for (let i = 0; i < items.length + 1; i++) {
            const name = `对话${i + 1}`;
            if (!items.find((e) => e.Name === name)) {
                item.Name = name;
                fixedCount++;
                break;
            }
        }
    }
    // 确保对话id唯一
    if (items.find((e) => e.Id === item.Id)) {
        for (let i = 0; i < items.length + 1; i++) {
            if (!items.find((e) => e.Id === i)) {
                item.Id = i;
                fixedCount++;
                break;
            }
        }
    }
    // 确保item中每一个跳转对话指令的id合法
    const alltalkIds = items.map((item) => item.Id);
    if (item.Actions) {
        fixedCount += fixJumpTalk(item.Actions, alltalkIds);
    }
    if (item.Options) {
        item.Options.forEach((option) => {
            fixedCount += fixJumpTalk(option.Actions, alltalkIds);
        });
    }
    // 修复每一个TalkItem
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if ((0, Type_1.fixFileds)(item, exports.talkItemScheme.Fields) === 'fixed') {
        fixedCount++;
    }
    return fixedCount > 0 ? 'fixed' : 'nothing';
}
function checkJumpTalk(actions, talkIds, message) {
    let errorCount = 0;
    actions.forEach((action, id) => {
        if (action.Name === 'JumpTalk') {
            const jumpTalk = action.Params;
            if (!talkIds.includes(jumpTalk.TalkId)) {
                message.push(`[${id}]JumpTalk的跳转对话id非法`);
                errorCount++;
            }
        }
        else if (action.Name === 'ShowTalk') {
            const showTalk = action.Params;
            showTalk.TalkItems.forEach((talkItem) => {
                if (talkItem.Actions) {
                    errorCount += checkJumpTalk(talkItem.Actions, talkIds, message);
                }
                if (talkItem.Options) {
                    talkItem.Options.forEach((option) => {
                        errorCount += checkJumpTalk(option.Actions, talkIds, message);
                    });
                }
            });
        }
    });
    return errorCount;
}
function checkTalkItem(item, container, message) {
    const items = container;
    let errorCount = 0;
    if (!item.Name) {
        errorCount++;
        message.push(`对话名为空`);
    }
    else if (items.find((e) => item !== e && e.Name === item.Name)) {
        errorCount++;
        message.push(`对话名重复${item.Name}`);
    }
    else if (items.find((e) => item !== e && e.Id === item.Id)) {
        errorCount++;
        message.push(`对话${item.Name}id[${item.Id}]重复`);
    }
    // 确保item中每一个跳转对话指令的id合法
    const alltalkIds = items.map((item) => item.Id);
    if (item.Actions) {
        errorCount += checkJumpTalk(item.Actions, alltalkIds, message);
    }
    if (item.Options) {
        item.Options.forEach((option) => {
            errorCount += checkJumpTalk(option.Actions, alltalkIds, message);
        });
    }
    // 对话人必须存在
    const talkers = TalkerList_1.TalkerListOp.Get();
    if (!talkers.Talkers.find((e) => e.Id === item.WhoId)) {
        message.push(`[${item.Name}]对话人没有配置`);
        errorCount++;
    }
    // 检查TalkItem中的其它字段
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    errorCount += (0, Type_1.checkFields)(item, exports.talkItemScheme.Fields, message);
    return errorCount;
}
exports.talkItemScheme = (0, Type_1.createObjectScheme)(talkItemFileds, {
    Meta: {
        NewLine: true,
        Tip: '对话项',
    },
    CreateDefault(container) {
        const items = container;
        const item = (0, Type_1.createDefaultObject)(talkItemFileds);
        fixTalkItem(item, items);
        return item;
    },
    Fix: fixTalkItem,
    Check: checkTalkItem,
});
exports.showTalkScheme = (0, Type_1.createObjectScheme)({
    TalkItems: (0, Type_1.createArrayScheme)({
        Element: exports.talkItemScheme,
        Meta: {
            NewLine: true,
            HideName: true,
            ArraySimplify: true,
            Tip: '对话列表',
        },
        Fix: (items, container) => {
            let fixCount = 0;
            items.forEach((item) => {
                const result = fixTalkItem(item, items);
                if (result === 'fixed') {
                    fixCount++;
                }
            });
            return fixCount > 0 ? 'fixed' : 'nothing';
        },
    }),
    ResetCamera: (0, Type_1.createBooleanScheme)({
        Meta: {
            Tip: '是否在对话播放结束后恢复到对话前的镜头状态,默认为false',
            Optional: true,
        },
    }),
}, {
    Filters: [Type_1.EObjectFilter.FlowList],
    Scheduled: true,
    Meta: {
        Tip: [
            '显示对话',
            '  对话',
            '    由多个[talkItem]构成',
            '    每个[talkItem]可以配置对话内容,对话动作和选项,',
            '    对话执行时,执行顺序为: 对话内容->对话动作->选项',
            '  执行顺序',
            '    选项被玩家选择后,其中包含的动作将被依次执行',
            '    若选项的动作中包含了跳转执行,则会跳转对应的对话或者状态',
            '    执行跳转动作后,该动作所在序列的后续的动作将不被执行',
            '    若当前对话没有跳转指令,则按顺序执行下一条对话',
        ].join('\n'),
    },
    Render(props) {
        return (React.createElement(exports.showTalkContext.Provider, { value: props.Value },
            React.createElement(Obj_1.Obj, { ...props })));
    },
});
exports.showOptionScheme = (0, Type_1.createObjectScheme)({
    TextId: createTextIdScheme('该做啥选择呢', {
        HideName: true,
        Width: 200,
        Tip: '选项内容',
    }),
}, {
    Filters: [Type_1.EObjectFilter.FlowList],
    Scheduled: true,
    Meta: {
        Tip: '显示独立选项',
    },
});
//# sourceMappingURL=ShowTalk.js.map