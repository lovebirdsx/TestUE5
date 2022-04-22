/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IProps, ObjectScheme } from '../../../../Common/Type';
import {
    EFlowListAction,
    flowListContext,
    flowListOp,
} from '../../../../Game/Common/Operations/FlowList';
import { TalkerListOp } from '../../../../Game/Common/Operations/TalkerList';
import { IShowTalk } from '../../../../Game/Flow/Action';
import { DEFAULT_EDIT_TEXT_COLOR, EditorBox, List } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';
import { Obj, String } from '../Basic/Public';
import { showTalkContext } from '../Context';

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

export function RenderTextId(props: IProps<number>): JSX.Element {
    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Text={flowListContext.Get().Texts[props.Value]}
                OnChange={(text): void => {
                    flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                        const textId = props.Value;
                        flowListOp.ModifyText(to, textId, text);
                    });
                }}
                Tip={props.Scheme.Tip}
            />
        </HorizontalBox>
    );
}

export function RenderShowTalk(props: IProps<IShowTalk, ObjectScheme<IShowTalk>>): JSX.Element {
    return (
        <showTalkContext.Provider value={props.Value}>
            <Obj {...props} />
        </showTalkContext.Provider>
    );
}

function hasTalk(showTalk: IShowTalk, name: string): boolean {
    let count = 0;
    showTalk.TalkItems.forEach((item) => {
        if (item.Name === name) {
            count++;
        }
    });
    return count > 1;
}

export function RenderTalkItemName(props: IProps<string>): JSX.Element {
    return (
        <showTalkContext.Consumer>
            {(value): JSX.Element => {
                return (
                    <String
                        {...props}
                        Color={
                            hasTalk(value, props.Value) ? '#FF0000 red' : DEFAULT_EDIT_TEXT_COLOR
                        }
                    />
                );
            }}
        </showTalkContext.Consumer>
    );
}

export function RenderTalkerIdScheme(props: IProps<number>): JSX.Element {
    const { Talkers: talkers } = TalkerListOp.Get();
    const names = TalkerListOp.GetNames();
    const selectedTalker = talkers.find((e) => e.Id === props.Value);
    return (
        <FilterableList
            Items={names}
            Selected={selectedTalker ? selectedTalker.Name : ''}
            Tip={props.Scheme.Tip}
            OnSelectChanged={(name: string): void => {
                const who = talkers.find((e) => e.Name === name);
                props.OnModify(who.Id, 'normal');
            }}
        />
    );
}
