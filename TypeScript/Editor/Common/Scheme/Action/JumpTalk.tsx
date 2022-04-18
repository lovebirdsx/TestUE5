/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import {
    createIntScheme,
    createObjectScheme,
    EObjectFilter,
    IAnyProps,
} from '../../../../Common/Type';
import { IJumpTalk } from '../../../../Game/Flow/Action';
import { List } from '../../ReactComponent/CommonComponent';
import { showTalkContext } from './ShowTalk';

export const jumpTalkScheme = createObjectScheme<IJumpTalk>(
    {
        TalkId: createIntScheme({
            Meta: {
                HideName: true,
            },
            CreateDefault() {
                return 0;
            },
            Render(props: IAnyProps) {
                return (
                    <showTalkContext.Consumer>
                        {(value): JSX.Element => {
                            const showTalk = value;
                            const items = showTalk.TalkItems;
                            const talkId = props.Value as number;
                            const selected = items.find((e) => e.Id === talkId);
                            const selectedName = selected ? selected.Name : '';
                            return (
                                <List
                                    Items={items.map((e) => e.Name)}
                                    Selected={selectedName}
                                    OnSelectChanged={(itemName: string): void => {
                                        const item = items.find((it) => it.Name === itemName);
                                        props.OnModify(item ? item.Id : 0, 'normal');
                                    }}
                                />
                            );
                        }}
                    </showTalkContext.Consumer>
                );
            },
        }),
    },
    {
        Filters: [EObjectFilter.Talk],
        Meta: {
            Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
        },
    },
);

export const finishTalkScheme = createObjectScheme(
    {},
    {
        Filters: [EObjectFilter.Talk],
        Meta: {
            Tip: '结束当前对话,跳到ShowTalk之后的动作执行',
        },
    },
);
