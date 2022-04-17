/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { ITalkerInfo, ITalkerListInfo } from '../../Game/Common/Operations/TalkerList';
import { EditorBox } from '../Common/ReactComponent/CommonComponent';

export const talkerListContext = React.createContext<ITalkerListInfo>(undefined);

export interface ITalkerProps {
    Talker: ITalkerInfo;
    OnModify: (talker: ITalkerInfo) => void;
    PrefixElement?: JSX.Element;
}

export class Talker extends React.Component<ITalkerProps> {
    private Modify(cb: (from: ITalkerInfo, to: ITalkerInfo) => void): void {
        const from = this.props.Talker;
        const to = produce(from, (draft) => {
            cb(from, draft);
        });
        if (from !== to) {
            this.props.OnModify(to);
        }
    }

    private readonly ModifyName = (name: string): void => {
        this.Modify((from, to) => {
            to.Name = name;
        });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Id: id, Name: name } = this.props.Talker;
        return (
            <HorizontalBox>
                {this.props.PrefixElement}
                <talkerListContext.Consumer>
                    {(value: ITalkerListInfo): JSX.Element => {
                        return (
                            <EditorBox
                                Text={name}
                                OnChange={this.ModifyName}
                                Color={
                                    value.Talkers.find((e) => e.Name === name && e.Id !== id)
                                        ? '#FF0000 red'
                                        : undefined
                                }
                            />
                        );
                    }}
                </talkerListContext.Consumer>
            </HorizontalBox>
        );
    }
}
