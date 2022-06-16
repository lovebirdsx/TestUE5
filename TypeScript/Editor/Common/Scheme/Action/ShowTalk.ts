/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { warn } from '../../../../Common/Misc/Log';
import {
    EFlowListAction,
    flowListContext,
    flowListOp,
} from '../../../../Game/Common/Operations/FlowList';
import { TalkerListOp } from '../../../../Game/Common/Operations/TalkerList';
import {
    IActionInfo,
    IJumpTalk,
    IShowOption,
    IShowTalk,
    ITalkItem,
    ITalkOption,
} from '../../../../Game/Interface/IAction';
import { globalContexts } from '../../GlobalContext';
import {
    createArrayScheme,
    createAssetScheme,
    createBooleanScheme,
    createFloatScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    IntScheme,
    ObjectScheme,
    TFixResult,
    TObjectFields,
} from '../../Type';
import { talkActionScheme } from './Action';

export function createTextIdScheme(defaultText: string, type: Partial<IntScheme>): IntScheme {
    return createIntScheme({
        CreateDefault: () => {
            let textId = 0;
            flowListContext.Modify(EFlowListAction.GenText, (from, to) => {
                const text = defaultText;
                textId = flowListOp.CreateText(to, text);
            });
            return textId;
        },
        ...type,
    });
}

export const talkOptionTextIdScheme = createTextIdScheme('该做啥选择呢', {
    Name: 'TalkOptionTextId',
    Width: 200,
    Tip: '选项内容',
});

export const talkOptionScheme = createObjectScheme<ITalkOption>({
    Name: 'TalkOption',
    Fields: {
        TextId: talkOptionTextIdScheme,
        Actions: createArrayScheme({
            CnName: '动作',
            Element: talkActionScheme,
            NewLine: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '选项动作',
        }),
    },
});

export const talkerIdScheme = createIntScheme({
    Name: 'TakerId',
    Tip: '说话人',
    CreateDefault: () => {
        const { Talkers: talkers } = TalkerListOp.Get();
        return talkers.length > 0 ? talkers[0].Id : 1;
    },
});

export const DEFAULT_SOUND_PATH = '/Game/Sound/Sound1.Sound1';

export const soundScheme = createAssetScheme({
    Name: 'Sound',
    CreateDefault: () => DEFAULT_SOUND_PATH,
    SearchPath: 'Sound',
    ClassPath: 'SoundCue',
});

export const talkItemTextIdScheme = createTextIdScheme('说点什么吧', {
    Name: 'TalkItemTextId',
    Width: 500,
    Tip: '对话内容',
});

export const talkItemNameScheme = createStringScheme({
    Name: 'TalkItemName',
    Tip: '对话名字',
    CreateDefault: () => '对话1',
});

const talkItemFileds: TObjectFields<ITalkItem> = {
    Id: createIntScheme({
        Hide: true,
        CreateDefault: () => 1,
    }),
    Name: talkItemNameScheme,
    WhoId: talkerIdScheme,
    TextId: talkItemTextIdScheme,
    WaitTime: createFloatScheme({
        CnName: '等待时间',
        Optional: true,
        Width: 40,
        Tip: '等待多久之后可以跳过，默认值在【全局配置】表中定义',
        CreateDefault: () => 1,
    }),
    Actions: createArrayScheme({
        CnName: '动作',
        NewLine: true,
        ArraySimplify: true,
        Optional: true,
        Tip: '动作列表',
        Element: talkActionScheme,
    }),
    Options: createArrayScheme({
        CnName: '选项',
        NewLine: true,
        ArraySimplify: true,
        Optional: true,
        Tip: '选项列表',
        Element: talkOptionScheme,
    }),
};

function fixJumpTalk(actions: IActionInfo[], talkIds: number[]): number {
    let fixCount = 0;
    actions.forEach((action) => {
        if (action.Name === 'JumpTalk') {
            const jumpTalk = action.Params as IJumpTalk;
            if (!talkIds.includes(jumpTalk.TalkId)) {
                warn(`修复跳转对话 [${jumpTalk.TalkId}] => [${0}]`);
                jumpTalk.TalkId = 0;
                fixCount++;
            }
        } else if (action.Name === 'ShowTalk') {
            const showTalk = action.Params as IShowTalk;
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

function fixTalkItem(items: ITalkItem[], item: ITalkItem): TFixResult {
    let fixedCount = 0;
    // 确保对话名字唯一
    if (!item.Name || items.find((e) => e.Name === item.Name && e !== item)) {
        for (let i = 0; i < items.length + 1; i++) {
            const name = `对话${i + 1}`;
            if (!items.find((e) => e.Name === name)) {
                warn(`修复对话名字 [${item.Name}] => [${name}]`);
                item.Name = name;
                fixedCount++;
                break;
            }
        }
    }

    // 确保对话id唯一
    if (items.find((e) => e.Id === item.Id && e !== item)) {
        for (let i = 0; i < items.length + 1; i++) {
            if (!items.find((e) => e.Id === i)) {
                warn(`修复对话id [${item.Id}] => [${i}]`);
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
            if (option.Actions) {
                fixedCount += fixJumpTalk(option.Actions, alltalkIds);
            }
        });
    }

    // 修复每一个TalkItem
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (talkItemScheme.Fix(item) === 'fixed') {
        fixedCount++;
    }

    return fixedCount > 0 ? 'fixed' : 'nothing';
}

function checkJumpTalk(actions: IActionInfo[], talkIds: number[], message: string[]): number {
    let errorCount = 0;
    actions.forEach((action, id) => {
        if (action.Name === 'JumpTalk') {
            const jumpTalk = action.Params as IJumpTalk;
            if (!talkIds.includes(jumpTalk.TalkId)) {
                message.push(`[${id}]JumpTalk的跳转对话id非法`);
                errorCount++;
            }
        } else if (action.Name === 'ShowTalk') {
            const showTalk = action.Params as IShowTalk;
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

function checkTalkItem(showTalk: IShowTalk, item: ITalkItem, message: string[]): number {
    const items = showTalk.TalkItems;
    let errorCount = 0;

    if (!item.Name) {
        errorCount++;
        message.push(`对话名为空`);
    } else if (items.find((e) => item !== e && e.Name === item.Name)) {
        errorCount++;
        message.push(`对话名重复${item.Name}`);
    } else if (items.find((e) => item !== e && e.Id === item.Id)) {
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
            if (option.Actions) {
                errorCount += checkJumpTalk(option.Actions, alltalkIds, message);
            }
        });
    }

    // 对话人必须存在
    const talkers = TalkerListOp.Get();
    if (!talkers.Talkers.find((e) => e.Id === item.WhoId)) {
        message.push(`[${item.Name}]对话人没有配置`);
        errorCount++;
    }

    // 检查TalkItem中的其它字段
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    errorCount += talkItemScheme.Check(item, message);

    return errorCount;
}

export const talkItemScheme = createObjectScheme<ITalkItem>({
    Name: 'TalkItem',
    Fields: talkItemFileds,
    NewLine: true,
    Tip: '对话项',
    CreateDefault(): ITalkItem {
        const item = ObjectScheme.CreateByFields(talkItemFileds);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const items: ITalkItem[] = globalContexts.Get<ITalkItem[]>(showTalkScheme.Fields.TalkItems);
        fixTalkItem(items, item);

        // 保存最后一个说话者的名字
        const lastItem = items.at(-1);
        if (lastItem) {
            item.WhoId = lastItem.WhoId;
        }
        return item;
    },
});

export const showTalkScheme = createObjectScheme<IShowTalk>({
    CnName: '显示对话',
    Name: 'ShowTalk',
    Fields: {
        TalkItems: createArrayScheme<ITalkItem>({
            NewLine: true,
            CnName: '对话',
            ArraySimplify: true,
            Tip: '对话列表',
            Element: talkItemScheme,
        }),
        ResetCamera: createBooleanScheme({
            Tip: '是否在对话播放结束后恢复到对话前的镜头状态,默认为false',
            CnName: '重置镜头',
            Optional: true,
        }),
    },
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
    Fix(value: IShowTalk): TFixResult {
        let fixCount = 0;
        value.TalkItems.forEach((item) => {
            const result0 = fixTalkItem(value.TalkItems, item);
            if (result0 !== 'fixed') {
                fixCount++;
            }
        });
        return fixCount > 0 ? 'fixed' : 'nothing';
    },
    Check(value: IShowTalk, message: string[]): number {
        let result = 0;
        value.TalkItems.forEach((item) => {
            result += checkTalkItem(value, item, message);
        });
        return result;
    },
});

export const showOptionScheme = createObjectScheme<IShowOption>({
    Name: 'ShowOption',
    CnName: '显示对话选项',
    Fields: {
        TextId: talkOptionTextIdScheme,
    },
    Scheduled: true,
    Tip: '显示独立选项',
});
