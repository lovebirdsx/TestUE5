/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    checkFields,
    createArrayScheme,
    createBooleanScheme,
    createDefaultObject,
    createFloatScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
    fixFileds,
    IMeta,
    // FloatScheme,
    IProps,
    Scheme,
    TFixResult,
    TObjectFields,
} from '../../../../Common/Type';
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
} from '../../../../Game/Flow/Action';
import { DEFAULT_EDIT_TEXT_COLOR, EditorBox, List } from '../../BaseComponent/CommonComponent';
import { String } from '../../SchemeComponent/Basic/Basic';
import { Obj } from '../../SchemeComponent/Basic/Obj';
import { TalkActionScheme } from './Action';

export const showTalkContext = React.createContext<IShowTalk>(undefined);

export function createTextIdScheme(defaultText: string, meta: IMeta): Scheme<number> {
    return createIntScheme({
        CreateDefault: () => {
            let textId = 0;
            flowListContext.Modify(EFlowListAction.GenText, (from, to) => {
                const text = defaultText;
                textId = flowListOp.CreateText(to, text);
            });
            return textId;
        },
        Render: (props: IProps) => {
            return (
                <HorizontalBox>
                    {props.PrefixElement}
                    <EditorBox
                        Width={props.Scheme.Meta.Width}
                        Text={flowListContext.Get().Texts[props.Value as number]}
                        OnChange={(text): void => {
                            flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                                const textId = props.Value as number;
                                flowListOp.ModifyText(to, textId, text);
                            });
                        }}
                        Tip={props.Scheme.Meta.Tip}
                    />
                </HorizontalBox>
            );
        },
        Meta: meta,
    });
}

export const talkOptionScheme = createObjectScheme<ITalkOption>({
    TextId: createTextIdScheme('该做啥选择呢', {
        HideName: true,
        Width: 200,
        Tip: '选项内容',
    }),
    Actions: createArrayScheme({
        Element: new TalkActionScheme(),
        Meta: {
            HideName: true,
            NewLine: false,
            Tip: '选项动作',
        },
    }),
});

function hasTalk(showTalk: IShowTalk, name: string): boolean {
    let count = 0;
    showTalk.TalkItems.forEach((item) => {
        if (item.Name === name) {
            count++;
        }
    });
    return count > 1;
}

export const talkerScheme = createIntScheme({
    CreateDefault: () => {
        const { Talkers: talkers } = TalkerListOp.Get();
        return talkers.length > 0 ? talkers[0].Id : 1;
    },
    Meta: {
        HideName: true,
        Tip: '说话人',
    },
    Render: (props) => {
        const { Talkers: talkers } = TalkerListOp.Get();
        const names = TalkerListOp.GetNames();
        const selectedTalker = talkers.find((e) => e.Id === props.Value);
        return (
            <List
                Items={names}
                Selected={selectedTalker ? selectedTalker.Name : ''}
                Tip={props.Scheme.Meta.Tip}
                OnSelectChanged={(name: string): void => {
                    const who = talkers.find((e) => e.Name === name);
                    props.OnModify(who.Id, 'normal');
                }}
            />
        );
    },
});

// fuck
// class WaitTimeScheme extends FloatScheme {
//     public CreateDefault(): number {
//         return 1;
//     }

//     public Optional?: boolean = true;

//     public Width?: number = 40;

//     public Tip?: string = '等待多久之后可以跳过，默认值在【全局配置】表中定义';
// }

const talkItemFileds: TObjectFields<ITalkItem> = {
    Id: createIntScheme({
        CreateDefault: () => 1,
        Meta: { Hide: true },
    }),
    Name: createStringScheme({
        CreateDefault: () => '对话1',
        Render: (props: IProps<string>) => {
            return (
                <showTalkContext.Consumer>
                    {(value): JSX.Element => {
                        return (
                            <String
                                {...props}
                                Color={
                                    hasTalk(value, props.Value)
                                        ? '#FF0000 red'
                                        : DEFAULT_EDIT_TEXT_COLOR
                                }
                            />
                        );
                    }}
                </showTalkContext.Consumer>
            );
        },
        Meta: {
            HideName: true,
            Tip: '对话名字',
        },
    }),
    WhoId: talkerScheme,
    TextId: createTextIdScheme('说点什么吧', {
        HideName: true,
        Width: 500,
        Tip: '对话内容',
    }),
    WaitTime: createFloatScheme({
        CreateDefault: () => 1,
        Meta: {
            Optional: true,
            Width: 40,
            Tip: '等待多久之后可以跳过，默认值在【全局配置】表中定义',
        },
    }),
    Actions: createArrayScheme({
        Element: new TalkActionScheme(),
        Meta: {
            NewLine: true,
            HideName: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '动作列表',
        },
    }),
    Options: createArrayScheme({
        Element: talkOptionScheme,
        Meta: {
            NewLine: true,
            HideName: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '选项列表',
        },
    }),
};

function fixJumpTalk(actions: IActionInfo[], talkIds: number[]): number {
    let fixCount = 0;
    actions.forEach((action) => {
        if (action.Name === 'JumpTalk') {
            const jumpTalk = action.Params as IJumpTalk;
            if (!talkIds.includes(jumpTalk.TalkId)) {
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

function fixTalkItem(item: ITalkItem): TFixResult {
    // const items = container as ITalkItem[];
    // fuck
    const items = [] as ITalkItem[];
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
    if (fixFileds(item, talkItemScheme.Fields) === 'fixed') {
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

function checkTalkItem(item: ITalkItem, message: string[]): number {
    // const items = container as ITalkItem[];
    // fuck
    const items = [] as ITalkItem[];
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
            errorCount += checkJumpTalk(option.Actions, alltalkIds, message);
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
    errorCount += checkFields(item, talkItemScheme.Fields, message);

    return errorCount;
}

export const talkItemScheme = createObjectScheme<ITalkItem>(talkItemFileds, {
    Meta: {
        NewLine: true,
        Tip: '对话项',
    },
    CreateDefault() {
        // fuck
        // const items = container as ITalkItem[];
        const item = createDefaultObject<ITalkItem>(talkItemFileds);
        // fixTalkItem(item, items);
        return item;
    },
    Fix: fixTalkItem,
    Check: checkTalkItem,
});

export const showTalkScheme = createObjectScheme<IShowTalk>(
    {
        TalkItems: createArrayScheme<ITalkItem>({
            Element: talkItemScheme,
            Meta: {
                NewLine: true,
                HideName: true,
                ArraySimplify: true,
                Tip: '对话列表',
            },
            Fix: (items: ITalkItem[]) => {
                let fixCount = 0;
                items.forEach((item) => {
                    const result = fixTalkItem(item);
                    if (result === 'fixed') {
                        fixCount++;
                    }
                });
                return fixCount > 0 ? 'fixed' : 'nothing';
            },
        }),
        ResetCamera: createBooleanScheme({
            Meta: {
                Tip: '是否在对话播放结束后恢复到对话前的镜头状态,默认为false',
                Optional: true,
            },
        }),
    },
    {
        Filters: [EActionFilter.FlowList],
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
        Render(props: IProps) {
            return (
                <showTalkContext.Provider value={props.Value as IShowTalk}>
                    <Obj {...props} />
                </showTalkContext.Provider>
            );
        },
    },
);

export const showOptionScheme = createObjectScheme<IShowOption>(
    {
        TextId: createTextIdScheme('该做啥选择呢', {
            HideName: true,
            Width: 200,
            Tip: '选项内容',
        }),
    },
    {
        Filters: [EActionFilter.FlowList],
        Scheduled: true,
        Meta: {
            Tip: '显示独立选项',
        },
    },
);
