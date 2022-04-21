import * as React from 'react';

import { IProps } from '../../../../Common/Type';
import { List } from '../../BaseComponent/CommonComponent';
import { showTalkContext } from '../../Scheme/Action/ShowTalk';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function RenderJumpTalkId(props: IProps<number>): JSX.Element {
    return (
        <showTalkContext.Consumer>
            {(value): JSX.Element => {
                const showTalk = value;
                const items = showTalk.TalkItems;
                const talkId = props.Value;
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
}
