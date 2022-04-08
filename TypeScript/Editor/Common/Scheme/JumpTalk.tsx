/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { IJumpTalk } from '../../../Game/Flow/Action';
import { List } from '../Component/CommonComponent';
import { showTalkContext } from './ShowTalk';
import { createIntScheme, createObjectScheme, IAnyProps } from './Type';

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
                            const slected = items[props.Value as number].Name;
                            return (
                                <List
                                    Items={items.map((e) => e.Name)}
                                    Selected={slected}
                                    OnSelectChanged={(itemName: string): void => {
                                        props.OnModify(
                                            items.findIndex((it) => it.Name === itemName),
                                        );
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
        Filters: ['talk'],
        Meta: {
            Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
        },
    },
);
