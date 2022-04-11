/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    IActionInfo,
    IJumpTalk,
    IShowOption,
    IShowTalk,
    ITalkItem,
    ITalkOption,
} from '../../../../Game/Flow/Action';
import {
    EFlowListAction,
    flowListContext,
    FlowListOp,
} from '../../../FlowEditor/Operations/FlowList';
import { TalkerListOp } from '../../../TalkerEditor/TalkerList';
import { String } from '../../Component/Basic';
import { DEFAULT_TEXT_COLOR, EditorBox, List } from '../../Component/CommonComponent';
import { Obj } from '../../Component/Obj';
import {
    createArrayScheme,
    createDefaultObject,
    createDynamicType,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    fixFileds,
    IAnyProps,
    IMeta,
    TDynamicObjectType,
    TFixResult,
    TObjectFields,
    TPrimitiveType,
} from '../Type';

export const showTalkContext = React.createContext<IShowTalk>(undefined);

const talkActionInfoScheme: TDynamicObjectType = createDynamicType('talk', {
    Meta: {
        NewLine: false,
        Tip: '动作',
    },
});

function createTextIdScheme(defaultText: string, meta: IMeta): TPrimitiveType<number> {
    return createIntScheme({
        CreateDefault: () => {
            let textId = 0;
            flowListContext.Modify(EFlowListAction.GenText, (from, to) => {
                const text = defaultText;
                textId = FlowListOp.CreateText(to, text);
            });
            return textId;
        },
        Render: (props: IAnyProps) => {
            return (
                <HorizontalBox>
                    {props.PrefixElement}
                    <EditorBox
                        Width={props.Type.Meta.Width}
                        Text={flowListContext.Get().Texts[props.Value as number]}
                        OnChange={(text): void => {
                            flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                                const textId = props.Value as number;
                                FlowListOp.ModifyText(to, textId, text);
                            });
                        }}
                        Tip={props.Type.Meta.Tip}
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
        Element: talkActionInfoScheme,
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
                Tip={props.Type.Meta.Tip}
                OnSelectChanged={(name: string): void => {
                    const who = talkers.find((e) => e.Name === name);
                    props.OnModify(who.Id);
                }}
            />
        );
    },
});

const talkItemFileds: TObjectFields<ITalkItem> = {
    Id: createIntScheme({
        CreateDefault: () => 1,
        Meta: { Hide: true },
    }),
    Name: createStringScheme({
        CreateDefault: () => '对话1',
        Render: (props: IAnyProps) => {
            return (
                <showTalkContext.Consumer>
                    {(value): JSX.Element => {
                        return (
                            <String
                                {...props}
                                Color={
                                    hasTalk(value, props.Value as string)
                                        ? '#FF0000 red'
                                        : DEFAULT_TEXT_COLOR
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
        Width: 350,
        Tip: '对话内容',
    }),
    Actions: createArrayScheme({
        Element: talkActionInfoScheme,
        Meta: {
            NewLine: true,
            ArraySimplify: true,
            Optional: true,
            Tip: '动作列表',
        },
    }),
    Options: createArrayScheme({
        Element: talkOptionScheme,
        Meta: {
            NewLine: true,
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

function fixTalkItem(item: ITalkItem, container: unknown): TFixResult {
    const items = container as ITalkItem[];
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

export const talkItemScheme = createObjectScheme<ITalkItem>(talkItemFileds, {
    Meta: {
        NewLine: true,
        Tip: '对话项',
    },
    CreateDefault(container: unknown) {
        const items = container as ITalkItem[];
        const item = createDefaultObject<ITalkItem>(talkItemFileds);
        fixTalkItem(item, items);
        return item;
    },
    Fix: fixTalkItem,
});

export const showTalkScheme = createObjectScheme<IShowTalk>(
    {
        TalkItems: createArrayScheme<ITalkItem>({
            Element: talkItemScheme,
            Meta: {
                NewLine: true,
                ArraySimplify: true,
                Tip: '对话列表',
            },
            Fix: (items: ITalkItem[], container: unknown) => {
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
    },
    {
        Filters: ['normal'],
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
        Render(props: IAnyProps) {
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
        Filters: ['normal'],
        Scheduled: true,
        Meta: {
            Tip: '显示独立选项',
        },
    },
);
