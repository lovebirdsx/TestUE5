"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showOptionScheme = exports.showTalkScheme = exports.talkItemScheme = exports.talkItemNameScheme = exports.talkItemTextIdScheme = exports.talkerIdScheme = exports.talkOptionScheme = exports.talkOptionTextIdScheme = exports.createTextIdScheme = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const FlowList_1 = require("../../../../Game/Common/Operations/FlowList");
const TalkerList_1 = require("../../../../Game/Common/Operations/TalkerList");
const Action_1 = require("./Action");
function createTextIdScheme(defaultText, type) {
    return (0, Type_1.createIntScheme)({
        CreateDefault: () => {
            let textId = 0;
            FlowList_1.flowListContext.Modify(FlowList_1.EFlowListAction.GenText, (from, to) => {
                const text = defaultText;
                textId = FlowList_1.flowListOp.CreateText(to, text);
            });
            return textId;
        },
        ...type,
    });
}
exports.createTextIdScheme = createTextIdScheme;
exports.talkOptionTextIdScheme = createTextIdScheme('该做啥选择呢', {
    Width: 200,
    Tip: '选项内容',
});
exports.talkOptionScheme = (0, Type_1.createObjectScheme)({
    TextId: exports.talkOptionTextIdScheme,
    Actions: (0, Type_1.createArrayScheme)({
        Element: new Action_1.TalkActionScheme(),
        NewLine: false,
        Tip: '选项动作',
    }),
});
exports.talkerIdScheme = (0, Type_1.createIntScheme)({
    Tip: '说话人',
    CreateDefault: () => {
        const { Talkers: talkers } = TalkerList_1.TalkerListOp.Get();
        return talkers.length > 0 ? talkers[0].Id : 1;
    },
});
exports.talkItemTextIdScheme = createTextIdScheme('说点什么吧', {
    Width: 500,
    Tip: '对话内容',
});
exports.talkItemNameScheme = (0, Type_1.createStringScheme)({
    Tip: '对话名字',
    CreateDefault: () => '对话1',
});
const talkItemFileds = {
    Id: (0, Type_1.createIntScheme)({
        Hide: true,
        CreateDefault: () => 1,
    }),
    Name: exports.talkItemNameScheme,
    WhoId: exports.talkerIdScheme,
    TextId: exports.talkItemTextIdScheme,
    WaitTime: (0, Type_1.createFloatScheme)({
        Optional: true,
        Width: 40,
        Tip: '等待多久之后可以跳过，默认值在【全局配置】表中定义',
        CreateDefault: () => 1,
    }),
    Actions: (0, Type_1.createArrayScheme)({
        NewLine: true,
        ArraySimplify: true,
        Optional: true,
        Tip: '动作列表',
        Element: new Action_1.TalkActionScheme(),
    }),
    Options: (0, Type_1.createArrayScheme)({
        NewLine: true,
        ArraySimplify: true,
        Optional: true,
        Tip: '选项列表',
        Element: exports.talkOptionScheme,
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
function fixTalkItem(showTalk, item) {
    const items = showTalk.TalkItems;
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
    if (exports.talkItemScheme.Fix(item) === 'fixed') {
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
function checkTalkItem(showTalk, item, message) {
    const items = showTalk.TalkItems;
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
    errorCount += exports.talkItemScheme.Check(item, message);
    return errorCount;
}
exports.talkItemScheme = (0, Type_1.createObjectScheme)(talkItemFileds, {
    NewLine: true,
    Tip: '对话项',
});
exports.showTalkScheme = (0, Type_1.createObjectScheme)({
    TalkItems: (0, Type_1.createArrayScheme)({
        NewLine: true,
        ArraySimplify: true,
        Tip: '对话列表',
        Element: exports.talkItemScheme,
    }),
    ResetCamera: (0, Type_1.createBooleanScheme)({
        Tip: '是否在对话播放结束后恢复到对话前的镜头状态,默认为false',
        Optional: true,
    }),
}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Scheduled: true,
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
    Fix(value) {
        let fixCount = 0;
        value.TalkItems.forEach((item) => {
            const result0 = fixTalkItem(value, item);
            if (result0 !== 'fixed') {
                fixCount++;
            }
        });
        return fixCount > 0 ? 'fixed' : 'nothing';
    },
    Check(value, message) {
        let result = 0;
        value.TalkItems.forEach((item) => {
            result += checkTalkItem(value, item, message);
        });
        return result;
    },
});
exports.showOptionScheme = (0, Type_1.createObjectScheme)({
    TextId: exports.talkOptionTextIdScheme,
}, {
    Filters: [Type_1.EActionFilter.FlowList],
    Scheduled: true,
    Tip: '显示独立选项',
});
//# sourceMappingURL=ShowTalk.js.map