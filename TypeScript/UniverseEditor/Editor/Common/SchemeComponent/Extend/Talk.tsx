/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IShowTalk } from '../../../../Common/Interface/IAction';
import {
    EFlowListAction,
    flowListContext,
    flowListOp,
} from '../../../../Common/Operation/FlowList';
import { TalkerListOp } from '../../../../Common/Operation/TalkerList';
import { AssetSelector } from '../../BaseComponent/AssetSelector';
import { Btn, DEFAULT_EDIT_TEXT_COLOR, EditorBox, List } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';
import { DEFAULT_SOUND_PATH, soundScheme } from '../../Scheme/Action/ShowTalk';
import { IProps, ObjectScheme } from '../../Type';
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
    const textId = props.Value;
    const textConfig = flowListContext.Get().Texts[textId];

    function RenderSound(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'C'}
                    Tip={'????????????'}
                    OnClick={(): void => {
                        flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                            flowListOp.ModifySound(to, textId, '');
                        });
                    }}
                />
                <AssetSelector
                    SelectedObjectPath={textConfig.Sound}
                    Path={soundScheme.SearchPath}
                    ClassType={soundScheme.ClassPath}
                    OnObjectPathChanged={(path: string): void => {
                        flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                            flowListOp.ModifySound(to, textId, path);
                        });
                    }}
                />
            </HorizontalBox>
        );
    }

    function RenderNoSound(): JSX.Element {
        return (
            <Btn
                Text={'+??????'}
                Tip={'????????????'}
                OnClick={function (): void {
                    flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                        flowListOp.ModifySound(to, textId, DEFAULT_SOUND_PATH);
                    });
                }}
            />
        );
    }

    return (
        <HorizontalBox>
            {props.PrefixElement}
            <EditorBox
                Width={props.Scheme.Width}
                Text={textConfig.Text}
                OnChange={(text): void => {
                    flowListContext.Modify(EFlowListAction.ModifyText, (from, to) => {
                        flowListOp.ModifyText(to, textId, text);
                    });
                }}
                Tip={props.Scheme.Tip}
            />
            {textConfig.Sound ? RenderSound() : RenderNoSound()}
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
